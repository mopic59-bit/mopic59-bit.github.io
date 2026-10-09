const ORCID='0000-0001-6822-1051';
const API=`https://pub.orcid.org/v3.0/${ORCID}/works`;
const search=document.querySelector('#search'), year=document.querySelector('#year');
const status=document.querySelector('#sync-status'), button=document.querySelector('#refresh-papers');
let papers=[...publications], loading=false, lastRefresh=0;
const cacheKey=`orcid-${ORCID}`;
try{const cached=JSON.parse(localStorage.getItem(cacheKey));if(cached && Array.isArray(cached.papers)){papers=cached.papers;status.textContent=`마지막 갱신 · ${cached.updatedAt}`;}}catch{}
function dateKey(p){const [y=0,m=0,d=0]=(p.date || String(p.year || 0)).split('-');return Number(y)*10000+Number(m)*100+Number(d);}
function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=papers.filter(p=>(!year.value||String(p.year)===year.value)&&`${p.title} ${p.authors} ${p.journal} ${p.doi}`.toLowerCase().includes(q));
 const container=document.querySelector('#papers');container.replaceChildren();
 document.querySelector('#count').textContent=`ORCID 공개 기록 ${papers.length}건 중 ${filtered.length}건 표시 · 최신 발행일순`;
 for(const p of filtered){
  const row=document.createElement('article');row.className='paper';
  const date=document.createElement('div');date.className='year';date.textContent=p.year || '—';
  const body=document.createElement('div'),title=document.createElement('h3');title.textContent=p.title;body.append(title);
  if(p.authors){const authors=document.createElement('p');authors.textContent=p.authors;body.append(authors);}
  const journal=document.createElement('p');journal.textContent=[p.journal,p.date].filter(Boolean).join(' · ');body.append(journal);
  const source=document.createElement('a');source.href=`https://orcid.org/${ORCID}`;source.textContent='ORCID 기록 ↗';source.target='_blank';source.rel='noopener noreferrer';source.style.fontSize='12px';body.append(source);
  const link=document.createElement('a');link.className='doi';link.href=p.doi?`https://doi.org/${encodeURI(p.doi)}`:`https://orcid.org/${ORCID}`;link.textContent=p.doi?'DOI ↗':'ORCID ↗';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${p.title} 원문 또는 ORCID 기록`);
  row.append(date,body,link);container.append(row);
 }
 if(!filtered.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='검색 조건에 맞는 논문이 없습니다.';container.append(empty);}
}
function updateView(){
 papers.sort((a,b)=>dateKey(b)-dateKey(a)||a.title.localeCompare(b.title));
 const selected=year.value;year.replaceChildren();
 const all=document.createElement('option');all.value='';all.textContent='모든 연도';year.append(all);
 for(const y of [...new Set(papers.map(p=>p.year))].sort((a,b)=>b-a)){const option=document.createElement('option');option.value=y;option.textContent=y||'연도 미등록';year.append(option);}
 if([...year.options].some(o=>o.value===selected))year.value=selected;
 render();
}
function convertGroup(group){
 const s=[...group['work-summary']].sort((a,b)=>Number(b['display-index'])-Number(a['display-index']))[0];
 const date=s['publication-date']||{},parts=['year','month','day'].map(k=>date[k]?.value||'');
 const ids=group['external-ids']?.['external-id']||[];
 const doi=ids.find(i=>i['external-id-type']==='doi')?.['external-id-value']||'';
 const old=papers.find(p=>p.putCode===s['put-code']||(doi && (p.doi||'').toLowerCase()===doi.toLowerCase()));
 return {year:Number(parts[0]),date:parts.filter(Boolean).map(p=>p.padStart(2,'0')).join('-'),title:s.title.title.value,authors:old?.authors||'',journal:s['journal-title']?.value||'',doi,putCode:s['put-code'],type:s.type};
}
async function refreshPapers(){
 if(loading)return;loading=true;button.disabled=true;status.textContent='ORCID 최신 기록을 확인하고 있습니다…';
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(API,{headers:{Accept:'application/json'},cache:'no-store',signal:controller.signal});
  if(!response.ok)throw new Error('ORCID unavailable');const data=await response.json();if(!Array.isArray(data.group))throw new Error('Invalid record');
  const next=data.group.map(convertGroup),missing=next.filter(p=>!p.authors).map(p=>p.putCode);
  if(missing.length){try{
   const detail=await fetch(`${API}/${missing.join(',')}`,{headers:{Accept:'application/json'},signal:controller.signal});
   if(detail.ok){for(const item of (await detail.json()).bulk||[]){const w=item.work;if(!w)continue;const p=next.find(p=>p.putCode===w['put-code']);if(p)p.authors=(w.contributors?.contributor||[]).map(c=>c['credit-name']?.value).filter(Boolean).join(', ');}}
  }catch{}}
  papers=next;lastRefresh=Date.now();updateView();
  const updatedAt=new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false});status.textContent=`ORCID 갱신 완료 · ${updatedAt} (한국시간)`;
  try{localStorage.setItem(cacheKey,JSON.stringify({papers,updatedAt}));}catch{}
 }catch{status.textContent='ORCID에 연결하지 못했습니다. 저장된 목록을 표시합니다. 다시 갱신해 주세요.';}
 finally{clearTimeout(timeout);loading=false;button.disabled=false;}
}
search.addEventListener('input',render);year.addEventListener('change',render);button.addEventListener('click',refreshPapers);
updateView();refreshPapers();
setInterval(()=>{if(!document.hidden)refreshPapers();},30*60*1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastRefresh>30*60*1000)refreshPapers();});

