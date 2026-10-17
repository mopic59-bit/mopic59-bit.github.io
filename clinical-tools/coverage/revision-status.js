const box = document.getElementById('revision-status');
export function renderStatus(s, target = box) {
 const date = value => value ? new Intl.DateTimeFormat('ko-KR', {dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Seoul'}).format(new Date(value))+' (한국시간)' : '성공한 확인 기록 없음';
 const node = (tag,text) => {const e=document.createElement(tag);e.textContent=text;return e;};
 target.replaceChildren(node('h2','공식 기준 확인 현황'));
 const grid=node('div','');grid.className='revision-grid';
 const row=(label,value)=>{let d=node('div','');d.append(node('small',label),node('strong',value));grid.append(d);};
 row('이 사이트에 반영된 고시',`보건복지부고시 제${s.applied.notice}호`);
 row('반영 기준 시행일',s.applied.effectiveDate);
 row('마지막 공식 원문 확인',date(s.lastSuccessfulCheckAt));
 const fail=s.checkState!=='success';const pending=s.revisionState==='pending';
 row('새 개정 여부',pending?'개정 발견·승인 대기':fail?'확인 실패 · 변경 여부 미확정':'확인 범위 내 변경 없음');
 target.append(grid);
 if(fail) target.append(node('p','최근 확인 실패: '+(s.lastError||'확인 결과를 읽을 수 없습니다.')+' 마지막 성공한 확인일과 반영 기준을 유지합니다.'));
 if(pending) target.append(node('p',`관측 고시: 제${s.observed?.notice||'미확인'}호 · 시행 ${s.observed?.effectiveDate||'미확인'}. 새 자료는 검토 대기 중이며, 승인 전에는 검색·표·반영 기준을 바꾸지 않습니다.`));
 target.append(node('p',`최근 확인 시도: ${date(s.lastAttemptAt)} · 국가법령정보센터 현행 고시 메타데이터와 부속서 원본 SHA-256 비교. 개별 적용 여부는 원문 확인이 필요합니다.`));
 if(s.secondary) target.append(node('p',s.secondary.summary));
 const links=node('div','');links.className='revision-links';
 const link=(label,url)=>{const a=node('a',label);a.href=url;links.append(a);};
 link('반영 고시 공식 원문',s.applied.sourceUrl);link('확인 이력','revision/check-history.json');link('원본 비교 기준 다운로드','revision/applied.json');
 if(s.pending)link('승인 대기 변경 내역',s.pending.reportPath);
 for(const [label,tab] of [['판본·수집 현황','history'],['원문 다운로드','files']]) {const b=node('button',label);b.type='button';b.addEventListener('click',()=>{document.querySelector(`nav [data-tab="${tab}"]`)?.click();document.getElementById(tab+'-view')?.scrollIntoView({block:'start',behavior:'smooth'});});links.append(b);}
 target.append(links);target.dataset.state=pending?'pending':fail?'failed':'unchanged';
}
if (box) fetch('revision/status.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('상태 파일 HTTP '+r.status);return r.json();}).then(s=>renderStatus(s)).catch(()=>{box.textContent='공식 확인 기록을 불러오지 못했습니다. 변경 없음으로 판단하지 마세요. 기존 검색 자료는 유지됩니다.';box.dataset.state='failed';});
