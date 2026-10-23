(() => {
  // Only rendered translation spans, never account information, history, cookies or network responses.
  const visible = el => !!(el && el.getClientRects().length);
  let lastSource='',lastTarget='',pairedTarget='',lastError=false;
  async function sample(){
    try {
      const permission=await chrome.runtime.sendMessage({action:'captureStatus'});
      if(!permission?.capturing){document.getElementById('lecture-note-capture-badge')?.remove();return;}
      const input=[...document.querySelectorAll('textarea[role="combobox"]')].find(visible);
      const spans=[...document.querySelectorAll('span[jsname="W297wb"]')].filter(visible);
      const source=input?.value||'', target=spans.map(el=>el.textContent.trim()).filter(Boolean).join(' ');
      const changed=source!==lastSource;
      if(changed)pairedTarget='';
      if(target!==lastTarget)pairedTarget=target;
      if(!source)pairedTarget='';
      const response=await chrome.runtime.sendMessage({action:'frame',payload:{source,target:pairedTarget,available:!!input,at:Date.now()}});
      lastSource=source;lastTarget=target;
      // A text-only badge indicates active capture without interfering with Google's controls.
      let badge=document.getElementById('lecture-note-capture-badge');
      if(response?.capturing){if(!badge){badge=document.createElement('div');badge.id='lecture-note-capture-badge';badge.style.cssText='position:fixed;bottom:20px;right:20px;z-index:2147483647;background:#173b64;color:white;padding:12px 18px;border-radius:9px;font:13px sans-serif;pointer-events:none';document.body.append(badge);}badge.textContent='● Lecture Note에 기록 중'+(source.length>4400?' · 5,000자 제한 임박':'');}else badge?.remove();
    }catch{if(!lastError){document.getElementById('lecture-note-capture-badge')?.remove();lastError=true;}}
  }
  setInterval(sample,800);sample();
})();
