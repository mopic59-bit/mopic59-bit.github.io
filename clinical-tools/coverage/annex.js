import {codeMatches} from './search.js';
import {gridFor} from './rare.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').toLowerCase().replace(/\s+/g,' ').trim();
const labels={severity:'화상 정도',bodySurface:'체표면적',target:'대상·적용 조건',disease:'상병명',kcd:'상병코드 (KCD)',vcode:'특정기호',group:'구분',procedure:'수술·처치명',procedureCode:'수술·처치 코드',ingredient:'약제·성분명',ingredientCode:'약제·성분 코드'};
const url=u=>{try{const v=new URL(u,location.href);return ['https:','http:'].includes(v.protocol)?esc(v.href):'#'}catch{return '#'}};
export function cellCodeMatches(text,query){if(codeMatches(text,query))return true;const ranges=String(text).toUpperCase().match(/[A-Z]\d{2}(?:\.\d{1,4})?\s*[~～∼\-–]\s*[A-Z]\d{2}(?:\.\d{1,4})?/g)||[];return ranges.some(range=>codeMatches(range,query))}
export function matchTable(table,filters={}){
 const grid=gridFor(table),hits=[],active=Object.values(filters).some(v=>norm(v));
 for(let r=table.headerRows||0;r<table.rowCount;r++){
  const cells=[...new Set(grid[r]||[])].filter(Boolean);let ok=true;
  for(const [role,value] of Object.entries(filters)){
   const q=norm(value);if(!q)continue;
   if(role==='query'){if(!norm(cells.map(c=>c.text).join(' ')).includes(q))ok=false;continue}
   const cols=[table.roles?.[role]].flat().filter(Number.isInteger);
   const allowed=table.roleCells?.[role];
   const texts=allowed?cells.filter(c=>allowed.includes(table.cells.indexOf(c))).map(c=>c.text):[...new Set(cols.map(col=>grid[r]?.[col]).filter(c=>c&&c.colSpan===1))].map(c=>c.text);
   // Only explicit independent source columns are searched as codes or names.
   // Merged conditions remain visible, never synthesized as disease/code mappings.
   if(!texts.some(t=>role==='kcd'?cellCodeMatches(t,q):norm(t).includes(q)))ok=false;
  }
  if(ok)hits.push(r);
 }
 return {grid,hits,active};
}
export function annexTableMarkup(table,filters={},number=1){
 const {hits,active}=matchTable(table,filters);const header=table.headerRows||0;
 const rows=Array.from({length:table.rowCount},(_,r)=>{
  const cells=table.cells.filter(c=>c.row===r).sort((a,b)=>a.col-b.col).map(c=>{const tag=r<header?'th':'td';return `<${tag} rowspan="${c.rowSpan}" colspan="${c.colSpan}" data-source-row="${r+1}" data-source-col="${c.col+1}">${esc(c.text)}</${tag}>`}).join('');
  return `<tr data-row="${r+1}"${active&&hits.includes(r)?' class="annex-hit" tabindex="-1"':''}>${cells}</tr>`;
 });
 return `<div class="annex-table-scroll" tabindex="0" role="region" aria-label="원문 표 ${number}, 가로 스크롤 가능"><table class="annex-table"><caption>원문 표 ${number}${active?` · 일치 ${hits.length}행 · 문맥 보존을 위해 전체 행 표시`:' · 원문 행·열·병합 범위 유지'}</caption>${header?`<thead>${rows.slice(0,header).join('')}</thead>`:''}<tbody>${rows.slice(header).join('')}</tbody></table></div>`;
}
export async function setupAnnex(data,showTab){
 const $=id=>document.getElementById(id);let bundle,filters={},hitIndex=-1;
 try{const r=await fetch('annex-tables.json');if(!r.ok)throw Error();bundle=await r.json()}catch{$('annex-tables').innerHTML='<div class="empty">표 자료를 불러오지 못했습니다. 새로고침하거나 원문 자료실을 이용하세요.</div>';return {hasDocument:()=>false}}
 const editions=bundle.editions;const families=bundle.families;const p=new URLSearchParams(location.search);
 const familyId=e=>e.familyId||e.annexKey;const familyName=f=>f.label||f.title||f.id;
 $('table-family').innerHTML=families.map(f=>`<option value="${esc(f.id)}">${esc(familyName(f))}</option>`).join('')+'<option value="rare">별표 4 · 희귀질환 (전용 조회)</option>';
 if(families.some(f=>f.id===p.get('tableFamily')))$('table-family').value=p.get('tableFamily');
 function selected(){return editions.find(e=>e.documentId===$('table-version').value)}
 function controls(){const e=selected();if(!e)return;const roles=[...new Set(e.tables.flatMap(t=>[...Object.keys(t.roles||{}),...Object.keys(t.roleCells||{})]))].filter(k=>labels[k]);$('table-fields').innerHTML=roles.map(k=>`<label>${esc(labels[k]+(e.tables.some(t=>(t.combinedRolePairs||[]).some(pair=>pair.includes(k)))?' · 복합 원문 셀':''))}<input id="table-${esc(k)}" data-role="${esc(k)}" autocomplete="off" value="${esc(filters[k]||'')}"></label>`).join('');for(const input of $('table-fields').querySelectorAll('input'))input.oninput=()=>{filters[input.dataset.role]=input.value;render()}}
 function versions(requested){const matches=editions.filter(e=>familyId(e)===$('table-family').value);$('table-version').innerHTML=matches.map(e=>`<option value="${esc(e.documentId)}">${esc(e.notice)} · ${e.effectiveDate?'시행 '+esc(e.effectiveDate):'시행일 미확인'} · ${esc(e.annexTitle)}</option>`).join('');if(matches.some(e=>e.documentId===requested))$('table-version').value=requested;filters={};$('table-query').value='';controls();render()}
 function render(){const e=selected();if(!e)return;const f={...filters,query:$('table-query').value};const matched=e.tables.map(t=>matchTable(t,f));const active=Object.values(f).some(v=>norm(v));const count=matched.reduce((s,t)=>s+t.hits.length,0);const total=e.tables.reduce((s,t)=>s+t.rowCount-(t.headerRows||0),0);hitIndex=-1;$('table-hit-position').textContent='';
  $('table-title').textContent=e.annexTitle;$('table-meta').innerHTML=`<div class="rare-source"><p><strong>${esc(e.notice)}</strong> · ${e.effectiveDate?'시행 '+esc(e.effectiveDate):'시행일 미확인'}</p><a href="${url(e.sourceUrl)}" target="_blank" rel="noopener">공식 원문 ↗</a><a href="${url(e.downloadPath)}">원본 ${esc(e.sourceFormat.toUpperCase())} 다운로드 ↓</a></div>`;
  $('table-coverage').textContent=`이 번호의 확보 판본 ${editions.filter(x=>familyId(x)===familyId(e)).length}개. 별표 번호의 대상·명칭은 개정에 따라 달라집니다. 선택한 판본의 제목과 시행일을 확인하세요.`;
  $('table-count').textContent=active?`${count.toLocaleString()}개 일치 행 / ${total.toLocaleString()}개 원문 행 · 원문 표 전체 유지`:`${e.tables.length}개 표 · ${total.toLocaleString()}개 원문 행`;
  const blocks=e.blocks||[{type:'text',text:e.outsideText},...e.tables.map((t,i)=>({type:'table',tableIndex:i}))];
  $('annex-tables').innerHTML=blocks.map(b=>b.type==='table'?annexTableMarkup(e.tables[b.tableIndex],f,b.tableIndex+1):`<p class="annex-paragraph">${esc(b.text)}</p>`).join('');
  $('table-empty').hidden=!active||count>0;$('table-prev-hit').disabled=$('table-next-hit').disabled=!active||!count;
  const p=new URLSearchParams(location.search);p.set('tableFamily',familyId(e));p.set('tableDocument',e.documentId);for(const k of ['query',...Object.keys(labels)]){if(f[k])p.set('table-'+k,f[k]);else p.delete('table-'+k)}history.replaceState(null,'',location.pathname+'?'+p);
 }
 function jump(direction){const hits=[...$('annex-tables').querySelectorAll('.annex-hit')];if(!hits.length)return;hitIndex=hitIndex<0?(direction>0?0:hits.length-1):(hitIndex+direction+hits.length)%hits.length;const row=hits[hitIndex];row.scrollIntoView?.({block:'start',behavior:'smooth'});row.focus?.({preventScroll:true});$('table-hit-position').textContent=`${hitIndex+1} / ${hits.length}번째 일치 행`}
 $('table-family').onchange=()=>{if($('table-family').value==='rare'){showTab('rare');$('table-family').value=familyId(selected());return}versions()};$('table-version').onchange=()=>{filters={};$('table-query').value='';controls();render()};$('table-query').oninput=render;$('table-reset').onclick=()=>{filters={};$('table-query').value='';controls();render()};$('table-prev-hit').onclick=()=>jump(-1);$('table-next-hit').onclick=()=>jump(1);
 versions(p.get('tableDocument'));for(const k of ['query',...Object.keys(labels)])if(p.has('table-'+k)){if(k==='query')$('table-query').value=p.get('table-'+k);else filters[k]=p.get('table-'+k)}controls();render();
 return {hasDocument:id=>editions.some(e=>e.documentId===id),open(id){const e=editions.find(e=>e.documentId===id);if(!e)return;$('table-family').value=familyId(e);versions(id);showTab('tables')}};
}
