(() => {
 const ORCID = '0000-0001-6822-1051';
 const API = `https://pub.orcid.org/v3.0/${ORCID}/works`;
 const search = document.querySelector('#search'), year = document.querySelector('#year');
 const status = document.querySelector('#sync-status'), button = document.querySelector('#refresh-papers');
 const container = document.querySelector('#papers'), count = document.querySelector('#count');
 if (!search || !year || !status || !button || !container || !count) return;
 const messages = {
  ko: {
   searchLabel: '논문 검색', searchPlaceholder: '논문 제목·저자·학술지 검색', yearLabel: '발행 연도',
   allYears: '모든 연도', undated: '연도 미등록', refresh: '지금 갱신 ↻', refreshing: '갱신 중…',
   count: 'ORCID 공개 기록 {total}건 중 {shown}건 표시 · 최신 발행일순', source: 'ORCID 기록 ↗',
   sourceLabel: '{title} ORCID 기록', articleLabel: '{title} 원문 또는 ORCID 기록',
   empty: '검색 조건에 맞는 논문이 없습니다.', stored: '저장된 ORCID 기록',
   storedDate: '저장된 ORCID 기록 · {date}', cached: '마지막 갱신 · {date} (한국시간)', cachedUndated: '이전 ORCID 갱신 기록',
   loading: 'ORCID 최신 기록을 확인하고 있습니다…', success: 'ORCID 갱신 완료 · {date} (한국시간)',
   failed: 'ORCID에 연결하지 못했습니다. 저장된 목록을 표시합니다. 다시 갱신해 주세요.'
  },
  en: {
   searchLabel: 'Search publications', searchPlaceholder: 'Search titles, authors, or journals', yearLabel: 'Publication year',
   allYears: 'All years', undated: 'Year not recorded', refresh: 'Refresh now ↻', refreshing: 'Refreshing…',
   count: 'Showing {shown} of {total} public ORCID records · newest publication first', source: 'ORCID record ↗',
   sourceLabel: 'ORCID record for {title}', articleLabel: 'Full article or ORCID record for {title}',
   empty: 'No publications match your search.', stored: 'Saved ORCID records',
   storedDate: 'Saved ORCID records · {date}', cached: 'Last update · {date} (Korea time)', cachedUndated: 'Last ORCID update (cached)',
   loading: 'Checking the latest ORCID records…', success: 'ORCID updated · {date} (Korea time)',
   failed: 'Unable to connect to ORCID. Showing the saved list. Please try refreshing again.'
  }
 };
 function language() { return window.labI18n?.language === 'en' ? 'en' : 'ko'; }
 function t(key, values = {}) {
  return messages[language()][key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
 }
 let papers = [...publications], loading = false, lastRefresh = 0;
 const savedDate = status.textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
 let syncState = { kind: savedDate ? 'storedDate' : 'stored', date: savedDate };
 const cacheKey = `orcid-${ORCID}`;
 try {
  const cached = JSON.parse(localStorage.getItem(cacheKey));
  if (cached && Array.isArray(cached.papers)) {
   papers = cached.papers;
   syncState = { kind: 'cached', date: cached.updatedAt || '', iso: cached.updatedAtIso || '' };
  }
 } catch {}
 function formattedUpdate() {
  if (!syncState.iso) return syncState.date || '';
  const date = new Date(syncState.iso);
  if (Number.isNaN(date.getTime())) return syncState.date || '';
  return date.toLocaleString(language() === 'en' ? 'en-US' : 'ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
 }
 function renderStatus() {
  const date = formattedUpdate();
  const kind = syncState.kind === 'cached' && (!date || (language() === 'en' && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(date))) ? 'cachedUndated' : syncState.kind;
  status.textContent = t(kind, { date });
  button.textContent = t(loading ? 'refreshing' : 'refresh');
  button.disabled = loading;
 }
 function dateKey(p) {
  const [y = 0, m = 0, d = 0] = (p.date || String(p.year || 0)).split('-');
  return Number(y) * 10000 + Number(m) * 100 + Number(d);
 }
 function render() {
  const q = search.value.trim().toLowerCase();
  const filtered = papers.filter(p => (!year.value || String(p.year) === year.value) && `${p.title} ${p.authors} ${p.journal} ${p.doi}`.toLowerCase().includes(q));
  container.replaceChildren();
  count.textContent = t('count', { total: papers.length, shown: filtered.length });
  for (const p of filtered) {
   const row = document.createElement('article'); row.className = 'paper';
   const date = document.createElement('div'); date.className = 'year'; date.textContent = p.year || '—';
   const body = document.createElement('div'), title = document.createElement('h3'); title.textContent = p.title; body.append(title);
   if (p.authors) { const authors = document.createElement('p'); authors.textContent = p.authors; body.append(authors); }
   const journal = document.createElement('p'); journal.textContent = [p.journal, p.date].filter(Boolean).join(' · '); body.append(journal);
   const source = document.createElement('a'); source.href = `https://orcid.org/${ORCID}`; source.textContent = t('source'); source.target = '_blank'; source.rel = 'noopener noreferrer'; source.style.fontSize = '12px'; source.setAttribute('aria-label', t('sourceLabel', { title: p.title })); body.append(source);
   const link = document.createElement('a'); link.className = 'doi'; link.href = p.doi ? `https://doi.org/${encodeURI(p.doi)}` : `https://orcid.org/${ORCID}`; link.textContent = p.doi ? 'DOI ↗' : 'ORCID ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', t('articleLabel', { title: p.title }));
   row.append(date, body, link); container.append(row);
  }
  if (!filtered.length) { const empty = document.createElement('p'); empty.className = 'empty'; empty.textContent = t('empty'); container.append(empty); }
 }
 function updateView() {
  papers.sort((a, b) => dateKey(b) - dateKey(a) || a.title.localeCompare(b.title));
  const selected = year.value; year.replaceChildren();
  const all = document.createElement('option'); all.value = ''; all.textContent = t('allYears'); year.append(all);
  for (const y of [...new Set(papers.map(p => p.year))].sort((a, b) => b - a)) {
   const option = document.createElement('option'); option.value = y; option.textContent = y || t('undated'); year.append(option);
  }
  if ([...year.options].some(o => o.value === selected)) year.value = selected;
  search.setAttribute('aria-label', t('searchLabel'));
  search.setAttribute('placeholder', t('searchPlaceholder'));
  year.setAttribute('aria-label', t('yearLabel'));
  render(); renderStatus();
 }
 function convertGroup(group) {
  const s = [...group['work-summary']].sort((a, b) => Number(b['display-index']) - Number(a['display-index']))[0];
  const date = s['publication-date'] || {}, parts = ['year', 'month', 'day'].map(k => date[k]?.value || '');
  const ids = group['external-ids']?.['external-id'] || [];
  const doi = ids.find(i => i['external-id-type'] === 'doi')?.['external-id-value'] || '';
  const old = papers.find(p => p.putCode === s['put-code'] || (doi && (p.doi || '').toLowerCase() === doi.toLowerCase()));
  return { year: Number(parts[0]), date: parts.filter(Boolean).map(p => p.padStart(2, '0')).join('-'), title: s.title.title.value, authors: old?.authors || '', journal: s['journal-title']?.value || '', doi, putCode: s['put-code'], type: s.type };
 }
 async function refreshPapers() {
  if (loading) return;
  loading = true; syncState = { kind: 'loading' }; renderStatus();
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
  try {
   const response = await fetch(API, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal });
   if (!response.ok) throw new Error('ORCID unavailable');
   const data = await response.json(); if (!Array.isArray(data.group)) throw new Error('Invalid record');
   const next = data.group.map(convertGroup), missing = next.filter(p => !p.authors).map(p => p.putCode);
   if (missing.length) {
    try {
     const detail = await fetch(`${API}/${missing.join(',')}`, { headers: { Accept: 'application/json' }, signal: controller.signal });
     if (detail.ok) {
      for (const item of (await detail.json()).bulk || []) {
       const w = item.work; if (!w) continue;
       const p = next.find(p => p.putCode === w['put-code']);
       if (p) p.authors = (w.contributors?.contributor || []).map(c => c['credit-name']?.value).filter(Boolean).join(', ');
      }
     }
    } catch {}
   }
   papers = next; lastRefresh = Date.now();
   const updatedAtIso = new Date().toISOString();
   const updatedAt = new Date(updatedAtIso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
   syncState = { kind: 'success', iso: updatedAtIso, date: updatedAt };
   updateView();
   try { localStorage.setItem(cacheKey, JSON.stringify({ papers, updatedAt, updatedAtIso })); } catch {}
  } catch { syncState = { kind: 'failed' }; }
  finally { clearTimeout(timeout); loading = false; renderStatus(); }
 }
 search.addEventListener('input', render); year.addEventListener('change', render); button.addEventListener('click', refreshPapers);
 window.addEventListener('lab-language-change', updateView);
 updateView(); refreshPapers();
 setInterval(() => { if (!document.hidden) refreshPapers(); }, 30 * 60 * 1000);
 document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - lastRefresh > 30 * 60 * 1000) refreshPapers(); });
})();

