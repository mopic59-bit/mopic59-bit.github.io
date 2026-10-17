import {codeMatches} from './search.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').toLowerCase().replace(/\s+/g,' ').trim();
export function gridFor(table){const grid=[];for(const c of table.cells){for(let r=c.row;r<c.row+c.rowSpan;r++){grid[r]??=[];for(let k=c.col;k<c.col+c.colSpan;k++)grid[r][k]=c}}return grid}
export function selectRows(table,filters={}){
 const grid=gridFor(table),headerRows=table.headerRows??1,roles=table.roles??{disease:1,kcd:2,vcode:3};
 const query=Object.fromEntries(Object.entries(filters).map(([k,v])=>[k,norm(v)]));const active=Object.values(query).some(Boolean),hits=[],context=new Set();

 for(let r=headerRows;r<grid.length;r++){
  const cells=grid[r]||[],kcd=cells[roles.kcd],vcode=cells[roles.vcode],disease=cells[roles.disease];
  // Code columns must be independent source cells. A spanning condition is never a code mapping.
  const ktext=kcd&&kcd.col===roles.kcd&&kcd.colSpan===1?kcd.text:'';
  const vtext=vcode&&vcode.col===roles.vcode&&vcode.colSpan===1?vcode.text:'';
  const ancestors=table.contextRows?.[r]||[];let dtext=disease?.text||'';
  for(const rr of ancestors)dtext+=' '+(grid[rr]?.[roles.disease]?.text||'');
  if(query.disease&&!norm(dtext).includes(query.disease))continue;
  if(query.kcd&&!codeMatches(ktext,query.kcd))continue;
  if(query.vcode&&!norm(vtext).includes(query.vcode))continue;
  hits.push(r);
  // Keep preceding full-width condition rows visible; no content is assigned to a new disease/code cell.
  if(active)for(const rr of ancestors)context.add(rr);
 }
 const visible=active?[...new Set([...hits,...context])].sort((a,b)=>a-b):Array.from({length:Math.max(0,grid.length-headerRows)},(_,i)=>i+headerRows);
 return {grid,hits,visible,headerRows,roles,active};
}
export function tableMarkup(table,filters={},number=1){
 const {grid,hits,visible,headerRows,roles,active}=selectRows(table,filters);if(!hits.length)return '';
 const renderRows=(rows,header=false)=>rows.map(r=>{const cells=[];for(let col=0;col<(table.columnCount||Math.max(...grid.map(x=>x?.length||0)));col++){const c=grid[r]?.[col];if(!c||c.col!==col)continue;const covered=rows.filter(rr=>rr>=c.row&&rr<c.row+c.rowSpan);if(covered[0]!==r)continue;const tag=header?'th':'td';const cls=c.col===roles.kcd||c.col===roles.vcode?' class="rare-code"':'';cells.push(`<${tag}${cls} colspan="${c.colSpan}" rowspan="${covered.length}"${header?' scope="col"':''} data-source-row="${c.row+1}" data-source-col="${c.col+1}">${esc(c.text)}</${tag}>`)}return `<tr data-row="${r+1}" class="${active&&hits.includes(r)?'rare-hit':(table.cells.some(c=>c.row===r&&c.colSpan>1)?'rare-context':'')}">${cells.join('')}</tr>`}).join('');
 return `<div class="rare-table-scroll" tabindex="0" role="region" aria-label="희귀질환 원문 표 ${number}, 가로 스크롤 가능"><table class="rare-table"><caption>원문 표 ${number} · ${active?'검색 일치 행과 연결된 병합 셀·상위 조건 표시':'원문 행 순서 및 병합 범위 유지'}</caption><colgroup>${Array.from({length:table.columnCount||4},(_,i)=>`<col style="width:${i===0?'8%':i===roles.disease?'58%':'17%'}">`).join('')}</colgroup><thead>${renderRows(Array.from({length:headerRows},(_,i)=>i),true)}</thead><tbody>${renderRows(visible)}</tbody></table></div>`;
}
export async function setupRare(data,showTab){
 const $=id=>document.getElementById(id),fields=['disease','kcd','vcode'];let bundle;
 try{const r=await fetch('rare-tables.json');if(!r.ok)throw Error('Table data unavailable');bundle=await r.json()}catch(e){$('rare-tables').innerHTML='<div class="empty">표 자료를 불러오지 못했습니다. 새로고침하거나 원문 자료실의 파일을 확인하세요.</div>';return {hasVersion:()=>false}}
 const editions=bundle.editions;const p=new URLSearchParams(location.search);
 $('rare-coverage').textContent=`상병명·상병코드·특정기호가 독립된 열로 구분된 ${editions.length}개 판본을 제공합니다. 이전 희귀난치성질환 판본은 원문 자료실·판본별 비교에서 확인할 수 있습니다.`;
 $('rare-version').innerHTML=editions.map(e=>`<option value="${esc(e.versionId)}">${esc(e.notice)} · 시행 ${esc(e.effectiveDate)}</option>`).join('');
 if(editions.some(e=>e.versionId===p.get('rareVersion')))$('rare-version').value=p.get('rareVersion');
 for(const k of fields)if(p.has('rare-'+k))$('rare-'+k).value=p.get('rare-'+k);
 const sourceUrl=u=>{try{const x=new URL(u,location.href);return ['http:','https:'].includes(x.protocol)?esc(x.href):'#'}catch{return '#'}};
 function render(){
  const e=editions.find(x=>x.versionId===$('rare-version').value);if(!e)return;
  const f=Object.fromEntries(fields.map(k=>[k,$('rare-'+k).value]));
  $('rare-meta').innerHTML=`<div class="rare-source"><p><strong>${esc(e.notice)}</strong> · 시행 ${esc(e.effectiveDate)}</p><a href="${sourceUrl(e.sourceUrl)}" target="_blank" rel="noopener">공식 원문 ↗</a><a href="${sourceUrl(e.downloadPath)}">원본 ${esc((e.sourceFormat||'').toUpperCase())} 다운로드 ↓</a></div>`;
  $('rare-common').innerHTML=`<p>${esc(e.outsideText||'공통 적용 조건은 원본 전체에서 확인하세요.')}</p>`;
  const selections=e.tables.map(t=>selectRows(t,f)),count=selections.reduce((s,x)=>s+x.hits.length,0),all=selections.reduce((s,x)=>s+x.grid.length-x.headerRows,0);
  $('rare-count').textContent=`${count.toLocaleString()}개 원문 행 / ${all.toLocaleString()}개 행 · 질환 수와 다를 수 있음`;
  $('rare-tables').innerHTML=e.tables.map((t,i)=>tableMarkup(t,f,i+1)).join('')||'<div class="empty">일치하는 원문 행이 없습니다. 검색어를 줄여 보세요. 검색되지 않는다는 이유로 비대상이라고 판단할 수 없습니다.</div>';
  const p=new URLSearchParams(location.search);p.set('rareVersion',e.versionId);for(const k of fields){if(f[k])p.set('rare-'+k,f[k]);else p.delete('rare-'+k)}history.replaceState(null,'',location.pathname+'?'+p);
 }
 $('rare-version').onchange=render;for(const k of fields)$('rare-'+k).oninput=render;$('rare-reset').onclick=()=>{for(const k of fields)$('rare-'+k).value='';render()};render();
 return {hasVersion:id=>editions.some(e=>e.versionId===id),open(id){$('rare-version').value=id;for(const k of fields)$('rare-'+k).value='';render();showTab('rare');$('rare-view').scrollIntoView?.({block:'start'})}};
}
