const search = document.querySelector('#search');
const year = document.querySelector('#year');
for (const value of [...new Set(publications.map(p => p.year))].sort((a,b)=>b-a)) {
 const option = document.createElement('option'); option.value=value; option.textContent=value; year.append(option);
}
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const filtered=publications.filter(p=>(!year.value||String(p.year)===year.value)&&`${p.title} ${p.authors} ${p.journal} ${p.doi}`.toLocaleLowerCase().includes(q));
 const container=document.querySelector('#papers'); container.replaceChildren();
 document.querySelector('#count').textContent=`확인된 ${publications.length}편 중 ${filtered.length}편 표시`;
 for(const p of filtered){
  const row=document.createElement('article'); row.className='paper';
  const date=document.createElement('div'); date.className='year'; date.textContent=p.year;
  const body=document.createElement('div'); const title=document.createElement('h3'); title.textContent=p.title;
  const authors=document.createElement('p'); authors.textContent=p.authors;
  const journal=document.createElement('p'); journal.textContent=p.journal;
  const source=document.createElement('a'); source.href=p.source; source.textContent='서지 출처 ↗'; source.target='_blank'; source.rel='noopener noreferrer'; source.style.fontSize='12px';
  body.append(title,authors,journal,source);
  const link=document.createElement('a');link.className='doi';link.href=`https://doi.org/${p.doi}`;link.textContent='DOI ↗';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${p.title} DOI 원문`);
  row.append(date,body,link);container.append(row);
 }
 if(!filtered.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='검색 조건에 맞는 논문이 없습니다.';container.append(empty);}
}
search.addEventListener('input',render);year.addEventListener('change',render);render();
