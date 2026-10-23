export const ordered = rows => [...rows].sort((a,b)=>a.at-b.at || a.seq-b.seq);
export const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function clock(ms){const d=new Date(ms);return [d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');}
export function duration(ms){const s=Math.max(0,Math.floor(ms/1000));return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':');}
export function plain(session){return `${session.title}\n${new Date(session.started).toLocaleString('ko-KR')}\n시간은 번역 화면에서 처음 관찰한 시각입니다.\n\n`+ordered(session.rows).map(r=>`[${clock(r.at)} · +${duration(r.at-session.started)}]${r.draft?' (미확정)':''}\n${r.source}\n${r.target||'(번역 대기)'}\n`).join('\n');}
export function sentences(text, lang='en') {try{return [...new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text)].map(x=>x.segment.trim()).filter(Boolean);}catch{return [text.trim()].filter(Boolean);}}
// A Google input reset starts a new block. Revisions replace their block instead of duplicating text.
export function ingest(state, frame, now=Date.now()) {
  const source=String(frame.source||'').trim().slice(0,6000), target=String(frame.target||'').trim().slice(0,12000);
  if(!source){state.empty=true;return state;}
  if(state.empty || !state.blocks.length){state.blocks.push({id:`b${state.blocks.length}`,at:now,source:'',target:'',changed:now});state.empty=false;}
  const b=state.blocks.at(-1);
  if(b.source!==source || b.target!==target){const ss=sentences(source,state.lang); b.times=ss.map((_,i)=>b.times?.[i]??now); b.source=source;b.target=target;b.changed=now;}
  return state;
}
export function rowsFrom(state, now=Date.now()) {
  let seq=0;
  return state.blocks.flatMap((b,i)=>{
    const ss=sentences(b.source,state.lang), ts=sentences(b.target,'ko');
    const aligned=ss.length===ts.length && ss.length>0;
    const pairs=aligned?ss.map((s,j)=>[s,ts[j]]):[[b.source,b.target]];
    return pairs.map(([source,target],j)=>({id:`${b.id}-${j}`,at:aligned?(b.times?.[j]??b.at):b.at,seq:seq++,source,target,draft:!target||(i===state.blocks.length-1&&!state.empty&&now-b.changed<2200)}));
  });
}
// Minimal uncompressed ZIP writer, used for a real DOCX and the extension bundle; no CDN dependency.
export function zip(files){const enc=new TextEncoder(),parts=[],central=[];let offset=0;const u16=(v,n)=>v.setUint16(n[0],n[1],true),u32=(v,n)=>v.setUint32(n[0],n[1],true);for(const [name,value] of Object.entries(files)){const n=enc.encode(name),d=typeof value==='string'?enc.encode(value):value;let crc=0xffffffff;for(const c of d){crc^=c;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;const h=new Uint8Array(30+n.length),v=new DataView(h.buffer);u32(v,[0,0x04034b50]);u16(v,[4,20]);u16(v,[6,0x800]);u32(v,[14,crc]);u32(v,[18,d.length]);u32(v,[22,d.length]);u16(v,[26,n.length]);h.set(n,30);parts.push(h,d);const c=new Uint8Array(46+n.length),w=new DataView(c.buffer);u32(w,[0,0x02014b50]);u16(w,[4,20]);u16(w,[6,20]);u16(w,[8,0x800]);u32(w,[16,crc]);u32(w,[20,d.length]);u32(w,[24,d.length]);u16(w,[28,n.length]);u32(w,[42,offset]);c.set(n,46);central.push(c);offset+=h.length+d.length;}const size=central.reduce((s,c)=>s+c.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);u32(v,[0,0x06054b50]);u16(v,[8,central.length]);u16(v,[10,central.length]);u32(v,[12,size]);u32(v,[16,offset]);return new Blob([...parts,...central,end],{type:'application/zip'});}
export function docx(session){const p=(text,bold=false)=>`<w:p><w:r>${bold?'<w:rPr><w:b/></w:rPr>':''}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;return zip({'[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>','_rels/.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>','word/document.xml':`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${p(session.title,true)}${p('시간은 번역 화면에서 처음 관찰한 시각입니다.')}${ordered(session.rows).map(r=>p(clock(r.at)+(r.draft?' · 미확정':''),true)+p(r.source)+p(r.target||'(번역 대기)')+p('')).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`});}
