(function () {
  'use strict';

  function start() {
    var tagList = document.getElementById('topic-tags');
    var searchInput = document.getElementById('topic-search');
    var yearSelect = document.getElementById('topic-year');
    var countNode = document.getElementById('topic-count');
    var paperList = document.getElementById('topic-papers');
    var newsList = document.getElementById('topic-news');
    if (!tagList || !searchInput || !yearSelect || !countNode || !paperList || !newsList) return;

    var library = window.researchLibrary || {};
    var defaultTags = ['ALL', 'AML', '림프종', '신경모세포종', '뇌종양', '기타 고형암', '비악성 혈액질환', 'CAR-T', '항체·면역치료', '표적치료', '조혈모세포이식', '지지요법'];
    var papers = (Array.isArray(library.papers) ? library.papers : []).filter(isRecord).map(function (record, index) {
      return {
        id: value(record.id) || 'paper-' + index,
        title: value(record.title) || '제목 미등록',
        authors: Array.isArray(record.authors) ? record.authors.map(value).filter(Boolean).join(', ') : value(record.authors),
        journal: value(record.journal),
        date: validDate(record.date),
        year: validYear(record.year) || validDate(record.date).slice(0, 4),
        doi: value(record.doi),
        url: safeUrl(record.url),
        summary: value(record.summary),
        dateNote: value(record.dateNote),
        tags: unique(Array.isArray(record.tags) ? record.tags.map(value) : [])
      };
    }).sort(newestFirst);
    var taxonomy = unique(Array.isArray(library.tags) ? library.tags.map(value) : defaultTags);
    var presentTags = unique(papers.reduce(function (all, paper) {
      return all.concat(paper.tags);
    }, []));
    var tags = taxonomy.filter(function (tag) { return presentTags.indexOf(tag) >= 0; }).concat(presentTags.filter(function (tag) {
      return taxonomy.indexOf(tag) < 0;
    }));
    var years = unique(papers.map(function (paper) { return paper.year; })).sort(function (a, b) { return Number(b) - Number(a); });
    var state = { tag: '', q: '', year: '' };

    yearSelect.replaceChildren();
    var allYears = element('option', '', '모든 연도');
    allYears.value = '';
    yearSelect.appendChild(allYears);
    years.forEach(function (year) {
      var option = element('option', '', year + '년');
      option.value = year;
      yearSelect.appendChild(option);
    });

    readQuery();
    renderPapers();
    renderNews();

    searchInput.addEventListener('input', function () {
      state.q = searchInput.value;
      applyFilters();
    });
    yearSelect.addEventListener('change', function () {
      state.year = yearSelect.value;
      applyFilters();
    });
    var resetButton = document.getElementById('topic-reset');
    if (resetButton) resetButton.addEventListener('click', function () {
      state = { tag: '', q: '', year: '' };
      searchInput.value = '';
      yearSelect.value = '';
      applyFilters();
    });
    window.addEventListener('popstate', function () {
      readQuery();
      renderPapers();
    });

    function readQuery() {
      var params = new URL(window.location.href).searchParams;
      var tag = params.get('tag') || '';
      var year = params.get('year') || '';
      state = { tag: tags.indexOf(tag) >= 0 ? tag : '', q: params.get('q') || '', year: years.indexOf(year) >= 0 ? year : '' };
      searchInput.value = state.q;
      yearSelect.value = state.year;
    }

    function applyFilters() {
      renderPapers();
      var url = new URL(window.location.href);
      ['tag', 'q', 'year'].forEach(function (key) {
        if (state[key]) url.searchParams.set(key, state[key]);
        else url.searchParams.delete(key);
      });
      url.hash = 'publications';
      try { window.history.replaceState(window.history.state, '', url.href); } catch (error) { /* File previews may restrict history updates. */ }
    }

    function chooseTag(tag) {
      state.tag = tag;
      applyFilters();
      var buttons = tagList.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-topic-tag') === tag) {
          buttons[i].focus({ preventScroll: true });
          break;
        }
      }
    }

    function renderPapers() {
      var query = state.q.trim().toLocaleLowerCase();
      var matching = papers.filter(function (paper) {
        if (state.year && paper.year !== state.year) return false;
        if (!query) return true;
        return [paper.title, paper.authors, paper.journal, paper.summary, paper.doi, paper.tags.join(' ')].join(' ').toLocaleLowerCase().indexOf(query) >= 0;
      });
      var visible = matching.filter(function (paper) { return !state.tag || paper.tags.indexOf(state.tag) >= 0; });
      tagList.replaceChildren();
      tagList.appendChild(filterButton('', '전체', matching.length));
      tags.forEach(function (tag) {
        var count = matching.filter(function (paper) { return paper.tags.indexOf(tag) >= 0; }).length;
        tagList.appendChild(filterButton(tag, tag, count));
      });
      countNode.textContent = '선정 논문 ' + papers.length + '편 중 ' + visible.length + '편 표시';
      paperList.replaceChildren();
      if (!visible.length) {
        paperList.appendChild(element('p', 'empty', papers.length ? '조건에 맞는 논문이 없습니다. 태그, 검색어 또는 연도를 바꿔보세요.' : '선정 자료를 준비 중입니다.'));
        return;
      }
      visible.forEach(function (paper) {
        var article = element('article', 'paper');
        article.appendChild(element('div', 'year', paper.year || '—'));
        var body = element('div', 'paper-content');
        if (paper.tags.length) {
          var paperTags = element('div', 'paper-tags');
          paper.tags.forEach(function (tag) { paperTags.appendChild(filterButton(tag, tag)); });
          body.appendChild(paperTags);
        }
        var heading = element('h3');
        var doiHref = doiUrl(paper.doi);
        heading.appendChild(linkOrText(paper.title, paper.url || doiHref));
        body.appendChild(heading);
        if (paper.authors) body.appendChild(element('p', 'paper-authors', paper.authors));
        var citation = [paper.journal, paper.date ? '온라인 공개 ' + formatDate(paper.date) : paper.year].filter(Boolean).join(' · ');
        if (citation) body.appendChild(element('p', 'paper-citation', citation));
        if (paper.dateNote) body.appendChild(element('p', 'paper-date-note', paper.dateNote));
        body.appendChild(element('p', 'paper-summary', paper.summary || '핵심 요약을 준비 중입니다.'));
        article.appendChild(body);
        var reference = doiHref || paper.url;
        if (reference) {
          var source = linkOrText(doiHref ? 'DOI ↗' : '원문 ↗', reference);
          source.className = 'doi';
          article.appendChild(source);
        }
        paperList.appendChild(article);
      });
    }

    function filterButton(tag, label, count) {
      var button = element('button', 'topic-tag', tag ? '#' + label : label);
      button.type = 'button';
      button.setAttribute('data-topic-tag', tag);
      button.setAttribute('aria-pressed', String(state.tag === tag));
      if (typeof count === 'number') {
        button.appendChild(element('span', 'tag-count', ' ' + count));
        button.setAttribute('aria-label', label + ' 논문 ' + count + '편');
      }
      button.addEventListener('click', function () { chooseTag(tag); });
      return button;
    }

    function renderNews() {
      var news = (Array.isArray(library.news) ? library.news : []).filter(isRecord).map(function (record) {
        return {
          title: value(record.title) || '제목 미등록',
          publisher: value(record.publisher) || value(record.source),
          date: validDate(record.date),
          summary: value(record.summary),
          url: safeUrl(record.url) || safeUrl(record.link)
        };
      }).sort(newestFirst);
      newsList.replaceChildren();
      if (!news.length) {
        newsList.appendChild(element('p', 'empty news-empty', '선정 뉴스를 준비 중입니다.'));
        return;
      }
      news.forEach(function (item) {
        var article = element('article', 'news-item');
        var heading = element('h3');
        heading.appendChild(linkOrText(item.title, item.url));
        article.appendChild(heading);
        var metadata = [item.publisher, item.date ? formatDate(item.date) : '날짜 미등록'].filter(Boolean).join(' · ');
        article.appendChild(element('p', 'muted', metadata));
        article.appendChild(element('p', 'news-summary', item.summary || '기사 요약을 준비 중입니다.'));
        if (item.url) article.appendChild(linkOrText('기사 읽기 ↗', item.url));
        newsList.appendChild(article);
      });
    }
  }

  function value(input) { return typeof input === 'string' || typeof input === 'number' ? String(input).trim() : ''; }
  function isRecord(record) { return record !== null && typeof record === 'object' && !Array.isArray(record); }
  function unique(items) { return items.filter(function (item, index) { return item && items.indexOf(item) === index; }); }
  function validYear(input) { var year = value(input); return /^\d{4}$/.test(year) && Number(year) > 0 ? year : ''; }
  function validDate(input) {
    var date = value(input);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    var parsed = new Date(date + 'T00:00:00Z');
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
  }
  function newestFirst(a, b) { return a.date === b.date ? 0 : a.date > b.date ? -1 : 1; }
  function formatDate(date) { return date.replace(/-/g, '.'); }
  function safeUrl(input) {
    try {
      var url = new URL(value(input));
      return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : '';
    } catch (error) { return ''; }
  }
  function doiUrl(input) {
    var doi = value(input).replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
    return /^10\.\d{4,9}\/\S+$/i.test(doi) ? safeUrl('https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/')) : '';
  }
  function element(name, className, text) {
    var node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function linkOrText(text, href) {
    var url = safeUrl(href);
    if (!url) return element('span', '', text);
    var link = element('a', '', text);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
