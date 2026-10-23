(() => {
  const channel='LECTURE_NOTE_BRIDGE_V1';
  window.addEventListener('message', async event=>{
    if(event.source!==window||event.origin!==location.origin||event.data?.channel!==channel||event.data.direction!=='request')return;
    const {id,action,payload}=event.data;
    if(typeof id!=='string'||!['ping','start','poll','pause','resume','stop'].includes(action))return;
    try {const result=await chrome.runtime.sendMessage({action,payload});window.postMessage({channel,direction:'response',id,result},location.origin);}
    catch {window.postMessage({channel,direction:'response',id,result:{error:'연결 프로그램이 갱신되었습니다. 페이지를 새로고침하세요.'}},location.origin);}
  });
})();
