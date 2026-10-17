import {extractOriginal} from './zip-reader.js';
const $=id=>document.getElementById(id);let objectURL;
async function init(){try{
 const name=new URLSearchParams(location.search).get('file');if(!/^[a-f0-9]{64}\.(?:hwp|hwpx|pdf)$/.test(name||''))throw Error('유효한 원본 파일을 선택해 주세요.');
 const map=await fetch('download-map.json').then(r=>{if(!r.ok)throw Error('파일 목록을 불러오지 못했습니다.');return r.json()});const item=map[name];if(!item)throw Error('요청한 원본 파일이 없습니다.');
 $('filename').textContent=`${name} · ${(item.bytes/1024).toFixed(1)} KB`;
 $('bundle').href=item.bundle;$('bundle').hidden=false;$('bundle').download='';
 if(item.officialUrl){$('official').href=item.officialUrl;$('official').hidden=false}
 $('status').textContent='ZIP 묶음을 불러와 원본 파일을 검증하고 있습니다…';
 const r=await fetch(item.bundle);if(!r.ok)throw Error('ZIP 묶음을 불러오지 못했습니다. 아래 링크를 이용해 주세요.');
 const bytes=await extractOriginal(await r.arrayBuffer(),name,item.sha256);
 objectURL=URL.createObjectURL(new Blob([bytes],{type:name.endsWith('.pdf')?'application/pdf':'application/octet-stream'}));$('save').href=objectURL;$('save').download=item.downloadName||name;$('save').hidden=false;$('save').style.display='inline-block';$('status').textContent='원본 파일 검증을 마쳤습니다. 아래 버튼으로 내려받으세요.';
 }catch(e){$('status').textContent=e.message||'파일을 준비하지 못했습니다. ZIP 묶음을 이용해 주세요.'}}
window.addEventListener('pagehide',()=>{if(objectURL)URL.revokeObjectURL(objectURL)});init();
