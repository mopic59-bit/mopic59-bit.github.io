(function () {
  'use strict';

  // Deliberately independent of count.js: never read URL queries, fragments,
  // page titles, form values, screen size, or clinical-tool activity.
  if (window.location.origin !== 'https://mopic59-bit.github.io' ||
      !['/', '/index.html'].includes(window.location.pathname) ||
      document.body.dataset.page !== 'home') return;

  var output = document.getElementById('homepage-visit-count');
  var count = null;
  var failed = false;
  function render() {
    if (!output) return;
    var en = document.documentElement.lang === 'en';
    output.textContent = count !== null ? count : failed
      ? (en ? 'Temporarily unavailable' : '일시적으로 확인할 수 없음')
      : (en ? 'Loading…' : '확인 중…');
  }
  window.addEventListener('lab-language-change', render);

  var referrer = '';
  try {
    var source = new URL(document.referrer);
    if (source.protocol === 'https:' || source.protocol === 'http:') referrer = source.origin;
  } catch (error) { /* Direct visits have no referrer. */ }

  // Explicit allowlist. The HTTP Referer is suppressed independently of r.
  var pixel = new URL('https://mopic.goatcounter.com/count');
  pixel.searchParams.set('p', '/');
  pixel.searchParams.set('t', 'Homepage');
  pixel.searchParams.set('r', referrer);
  var image = new Image();
  image.referrerPolicy = 'no-referrer';
  image.src = pixel.href;

  var controller = new AbortController();
  var timeout = setTimeout(function () { controller.abort(); }, 8000);
  fetch('https://mopic.goatcounter.com/counter/%2F.json', {
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    signal: controller.signal
  }).then(function (response) {
    if (!response.ok) throw new Error('Counter unavailable');
    return response.json();
  }).then(function (data) {
    if (typeof data.count !== 'string' || !/^\d[\d, .\u00a0\u202f]*$/.test(data.count)) {
      throw new Error('Invalid counter');
    }
    count = data.count;
  }).catch(function () {
    failed = true;
  }).finally(function () {
    clearTimeout(timeout);
    render();
  });
  render();
}());
