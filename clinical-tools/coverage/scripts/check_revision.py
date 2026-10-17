#!/usr/bin/env python3
"""Read public official sources; update status/evidence only. NEVER update clinical data."""
import argparse, concurrent.futures, datetime, hashlib, html, json, pathlib, re, urllib.request, urllib.parse, urllib.error
BASE='https://www.law.go.kr/LSW/'
CURRENT='https://www.law.go.kr/'+urllib.parse.quote('행정규칙/본인일부부담금산정특례에관한기준')
def digest(b): return hashlib.sha256(b).hexdigest()
def save(p,o):
 p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
def compare(a,b):
 changes=[]
 for k in ('id','notice','issuedDate','effectiveDate'):
  if a.get(k)!=b.get(k): changes.append({'field':k,'before':a.get(k),'after':b.get(k)})
 old={x['key']:x for x in a['files']}; new={x['key']:x for x in b['files']}
 for k in sorted(old.keys()|new.keys()):
  if k not in old or k not in new or old[k]['sha256']!=new[k]['sha256']:
   changes.append({'field':'attachment','key':k,'before':old.get(k),'after':new.get(k)})
 return changes
class Fetcher:
 def __init__(self,cache): self.cache=cache; cache.mkdir(parents=True,exist_ok=True)
 def get(self,url):
  key=digest(url.encode()); f=self.cache/key; m=self.cache/(key+'.json'); meta=json.loads(m.read_text()) if m.exists() else {}; headers={'User-Agent':'CoverageOfficialRevisionCheck/1.0','Cache-Control':'no-cache'}
  if f.exists():
   if meta.get('etag'): headers['If-None-Match']=meta['etag']
   if meta.get('modified'): headers['If-Modified-Since']=meta['modified']
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=45) as r:
    b=r.read(); f.write_bytes(b); save(m,{'url':url,'etag':r.headers.get('ETag'),'modified':r.headers.get('Last-Modified')}); return b
  except urllib.error.HTTPError as e:
   if e.code==304 and f.exists(): return f.read_bytes()
   raise
 def text(self,u): return self.get(u).decode('utf-8')
def observe(fetch,archive):
 entry=fetch.text(CURRENT); match=re.search(r'admRulSeq=(\d+)',entry)
 if not match: raise ValueError('현행 법령 이름 조회에서 판본 식별 실패')
 seq=match[1]; url=BASE+'admRulInfoP.do?admRulSeq='+seq; page=fetch.text(url)
 def prop(k):
  m=re.search(r'\b'+k+r':\s*"([^"]+)"',page)
  if not m: raise ValueError('공식 고시 메타데이터 누락: '+k)
  return m[1]
 def date(k):
  v=prop(k); datetime.datetime.strptime(v,'%Y%m%d'); return v[:4]+'-'+v[4:6]+'-'+v[6:]
 observed={'id':seq,'notice':prop('prmlNo'),'issuedDate':date('prmlYd'),'effectiveDate':date('efYd'),'sourceUrl':url,'discoveryUrl':CURRENT}
 rule_id=prop('admRulId'); menu=fetch.text(BASE+'admRulBylInfoR.do?admRulSeq='+seq)
 options=re.findall(r'<option value="(\d+,\d+,\d+,\d+)"[^>]*>(.*?)</option>',menu,re.S)
 if not options: raise ValueError('공식 별표·서식 목록 없음')
 def annex(item):
  val,title=item; s,n,b,c=val.split(','); query=urllib.parse.urlencode(dict(bylSeq=s,bylNo=n,bylBrNo=b,bylClsCd=c,admRulId=rule_id)); source=BASE+'admRulBylContentsInfoR.do?'+query; content=fetch.text(source)
  ids=dict(re.findall(r'id="(hanFlSeq|pdfFlSeq|odtFlSeq)"[^>]*value="([^"]*)"',content)); files=[]
  for kind,fid in ids.items():
   if not fid or fid=='0': continue
   url=BASE+'flDownload.do?flSeq='+fid; data=fetch.get(url)
   if not (data.startswith(b'%PDF') or data.startswith(b'PK') or data.startswith(b'\xd0\xcf\x11\xe0')): raise ValueError('원본 형식 검증 실패: '+fid)
   ext={'hanFlSeq':'hwp','pdfFlSeq':'pdf','odtFlSeq':'odt'}[kind]; sha=digest(data)
   (archive/(sha+'.'+ext)).write_bytes(data)
   files.append({'key':n+'-'+b+'-'+c+'-'+kind,'annex':html.unescape(title),'bylSeq':s,'flSeq':fid,'format':ext,'sha256':sha,'bytes':len(data),'sourceUrl':url})
  if not files: raise ValueError('원본 파일 없음: '+s)
  return files
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex: observed['files']=sorted([f for fs in ex.map(annex,options) for f in fs],key=lambda f:f['key'])
 observed['annexCount']=len(options); return observed

MOHW='https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&keyField=TITLE&keyWord='+urllib.parse.quote('산정특례')
def parse_secondary(page):
 rows=[]
 for block in re.findall(r'<tr[^>]*>(.*?)</tr>',page,re.S):
  match=re.search(r'href="([^"]*list_no=(\d+)[^"]*)"[^>]*>(.*?)</a>',block,re.S)
  if not match: continue
  title=html.unescape(re.sub('<[^>]+>','',match[3])).strip()
  if '본인일부부담금산정특례에관한기준' not in re.sub(r'\s+','',title):continue
  def cell(label):
   m=re.search(r'data-label="'+label+r'"[^>]*>(.*?)</td>',block,re.S)
   return html.unescape(re.sub('<[^>]+>','',m[1])).strip() if m else ''
  preview=re.search(r'<tr id="preView'+match[2]+r'"[^>]*>(.*?)</tr>',page,re.S)
  body=' '.join(html.unescape(re.sub('<[^>]+>',' ',preview[1] if preview else '')).split())
  category='proposal' if '행정예고' in title else 'supplement' if any(x in title for x in ['질의응답','안내','지침']) else 'governing_notice' if '[고시]' in title and cell('발령번호') else 'review_required'
  rows.append({'id':match[2],'title':title,'notice':cell('발령번호'),'postedDate':cell('등록일'),'category':category,'summary':body,'sourceUrl':'https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no='+match[2]})
 if not rows:raise ValueError('보건복지부 검색 결과를 검증할 수 없음')
 return rows

def secondary(fetch,known):
 old={r['id']:r for r in known}; found=[]
 for page in range(1,21):
  rows=parse_secondary(fetch.text(MOHW+'&nPage='+str(page)));found.extend(rows)
  if any(r['id'] in old for r in rows):break
 else:raise ValueError('보건복지부 기존 확인 지점에 도달하지 못함')
 changes=[{'field':'secondary_notice','classification':r['category'],'before':old.get(r['id']),'after':r} for r in found if r['id'] not in old or r!=old[r['id']]]
 return found,changes

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]);ap.add_argument('--cache',type=pathlib.Path,default=pathlib.Path('/tmp/coverage-revision-cache'));args=ap.parse_args();root=args.root; rev=root/'revision'; baseline=json.loads((rev/'applied.json').read_text()); p=rev/'status.json'; status=json.loads(p.read_text()) if p.exists() else {'applied':{k:v for k,v in baseline.items() if k!='files'},'lastSuccessfulCheckAt':None,'pending':None}; now=datetime.datetime.now(datetime.timezone.utc).isoformat(); status['lastAttemptAt']=now; staging=args.cache/'originals';staging.mkdir(parents=True,exist_ok=True)
 try:
  fetch=Fetcher(args.cache/'http'); observed=observe(fetch,staging); changes=compare(baseline,observed); partial=None
  try:
   sec,secchanges=secondary(fetch,json.loads((rev/'secondary-baseline.json').read_text()));observed['secondary']=sec;changes+=secchanges
   status['secondary']={'checkedAt':now,'summary':'보건복지부 산정특례 제목 검색·고시 목록 확인. 질의응답·지침과 행정예고는 고시 개정과 구분합니다. HIRA는 교차확인 참고 출처이며 전수 검색 범위에 포함하지 않습니다.','sourceUrl':MOHW}
  except Exception as e:partial=str(e)
  fingerprint=digest(json.dumps(observed,sort_keys=True).encode()); new=bool(changes) and fingerprint!=status.get('pending',{}).get('fingerprint') if status.get('pending') else bool(changes)
  status.update(observed={k:v for k,v in observed.items() if k!='files'},lastPrimaryCheckAt=now,lastError=partial,checkState='partial' if partial else 'success',revisionState='pending' if changes else 'unchanged')
  if not partial: status['lastSuccessfulCheckAt']=now
  if changes:
   folder=rev/'pending'/fingerprint;folder.mkdir(parents=True,exist_ok=True);save(folder/'observation.json',observed);save(folder/'changes.json',changes)
   # Preserve changed originals for review; never change applied data or baseline.
   for change in changes:
    f=change.get('after')
    if isinstance(f,dict) and 'sha256' in f: name=f['sha256']+'.'+f['format'];(folder/name).write_bytes((staging/name).read_bytes())
   status['pending']={'fingerprint':fingerprint,'detectedAt':(status.get('pending') or {}).get('detectedAt',now),'changeCount':len(changes),'reportPath':'revision/pending/'+fingerprint+'/changes.json','observationPath':'revision/pending/'+fingerprint+'/observation.json'}
  else: status['pending']=None
  report={'checkedAt':now,'result':status['revisionState'],'notifyChange':new,'changes':changes,'checkedFiles':len(observed['files']),'checkedAnnexes':observed['annexCount'],'secondaryState':'partial' if partial else 'success','secondaryError':partial}
 except Exception as e:
  status.update(checkState='failed',lastError=str(e));report={'checkedAt':now,'result':'failed','notifyChange':False,'error':str(e)}
 save(p,status);save(rev/'latest-check.json',report); history=rev/'check-history.json'; rows=json.loads(history.read_text()) if history.exists() else [];rows.append(report);save(history,rows[-366:]);print(json.dumps(report,ensure_ascii=False)); return 0 if report['result']!='failed' else 1
if __name__=='__main__': raise SystemExit(main())
