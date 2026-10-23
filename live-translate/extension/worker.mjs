import {ingest,rowsFrom} from './core.mjs';
const APP='https://mopic59-bit.github.io/live-translate/';
let queue=Promise.resolve();
const send=async(tabId,msg)=>{try{await chrome.tabs.sendMessage(tabId,msg);}catch{}};
async function process(msg,sender){
  const isApp=sender.url?.startsWith(APP)&&sender.tab?.id;
  const isGoogle=/^https:\/\/translate\.google\.(com|co\.kr)\//.test(sender.url||'')&&sender.tab?.id;
  if(!isApp&&!isGoogle)return {error:'허용되지 않은 페이지입니다.'};
  let {active}=await chrome.storage.local.get('active');const now=Date.now();
  if(msg.action==='captureStatus')return {capturing:!!(isGoogle&&active&&active.googleTab===sender.tab.id&&active.status==='running'&&now-active.lease<=15000)};
  if(msg.action==='frame'){
    if(!isGoogle||!active||active.googleTab!==sender.tab.id||active.status!=='running'||now-active.lease>15000)return {capturing:false};
    active.lastFrame=now;active.available=!!msg.payload?.available;
    ingest(active,msg.payload||{},now);await chrome.storage.local.set({active});return {capturing:true};
  }
  if(!isApp)return {error:'지원하지 않는 요청입니다.'};
  if(msg.action==='ping')return {version:'1.0.0'};
  if(msg.action==='start'){
    if(active?.status==='running'&&now-active.lease<15000&&active.appTab!==sender.tab.id)return {error:'다른 Lecture Note 탭에서 기록 중입니다. 먼저 그 탭에서 종료하세요.'};
    const p=msg.payload||{};if(!/^[a-zA-Z0-9-]{1,80}$/.test(p.sessionId||''))return {error:'강의 ID 오류'};
    const lang=['en','ja','zh-CN','ko'].includes(p.lang)?p.lang:'en';
    const tab=await chrome.tabs.create({url:`https://translate.google.co.kr/?hl=ko&sl=${lang}&tl=ko&op=translate`});
    active={sessionId:p.sessionId,appTab:sender.tab.id,googleTab:tab.id,status:'running',lease:now,lang,blocks:[],empty:true,lastFrame:0,available:false};
    await chrome.storage.local.set({active});return {ok:true};
  }
  if(!active||active.sessionId!==msg.payload?.sessionId||active.appTab!==sender.tab.id)return {error:'연결된 기록 세션이 없습니다. 기록을 종료한 후 다시 시작하세요.'};
  if(msg.action==='poll'){active.lease=now;await chrome.storage.local.set({active});return {status:active.status,rows:rowsFrom(active,now),lastFrame:active.lastFrame,available:active.available,chars:active.blocks.at(-1)?.source.length||0};}
  if(msg.action==='pause')active.status='paused';
  else if(msg.action==='resume'){active.status='running';active.lease=now;}
  else if(msg.action==='stop')active.status='stopped';
  else return {error:'알 수 없는 요청입니다.'};
  await chrome.storage.local.set({active});return {ok:true,rows:rowsFrom(active,now),status:active.status};
}
chrome.runtime.onMessage.addListener((msg,sender,respond)=>{
  queue=queue.catch(()=>{}).then(()=>process(msg,sender));queue.then(respond,e=>respond({error:e.message||'연결 오류'}));return true;
});
chrome.tabs.onRemoved.addListener(tabId=>{queue=queue.catch(()=>{}).then(async()=>{const {active}=await chrome.storage.local.get('active');if(active&&(active.appTab===tabId||active.googleTab===tabId)){active.status='stopped';await chrome.storage.local.set({active});}});});
