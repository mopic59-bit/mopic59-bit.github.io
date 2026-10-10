(function () {
  'use strict';

  var labels = {
    ko: {
      all: '전체', allYears: '모든 연도', year: '{year}년', untitled: '제목 미등록',
      count: '선정 논문 {total}편 중 {visible}편 표시', tagCount: '{label} 논문 {count}편',
      noMatches: '조건에 맞는 논문이 없습니다. 태그, 검색어 또는 연도를 바꿔보세요.',
      papersPending: '선정 자료를 준비 중입니다.', summaryPending: '핵심 요약을 준비 중입니다.',
      onlineDate: '온라인 공개 {date}', original: '원문 ↗', newsPending: '선정 뉴스를 준비 중입니다.',
      dateMissing: '날짜 미등록', newsSummaryPending: '기사 요약을 준비 중입니다.', readArticle: '기사 읽기 ↗'
    },
    en: {
      all: 'All', allYears: 'All years', year: '{year}', untitled: 'Untitled',
      count: 'Showing {visible} of {total} selected papers', tagCount: '{label}: {count} papers',
      noMatches: 'No papers match these filters. Try another tag, search term, or year.',
      papersPending: 'Selected papers will be added here.', summaryPending: 'A key findings summary will be added here.',
      onlineDate: 'Published online {date}', original: 'Full text ↗', newsPending: 'Selected news will be added here.',
      dateMissing: 'Date unavailable', newsSummaryPending: 'An article summary will be added here.', readArticle: 'Read article ↗'
    }
  };
  var tagLabelsEn = {
    '림프종': 'Lymphoma', '신경모세포종': 'Neuroblastoma', '뇌종양': 'Brain tumors',
    '기타 고형암': 'Other solid tumors', '비악성 혈액질환': 'Nonmalignant hematology',
    '항체·면역치료': 'Antibody and immunotherapy', '표적치료': 'Targeted therapy',
    '조혈모세포이식': 'HSCT', '지지요법': 'Supportive care'
  };
  function language() { return window.labI18n && window.labI18n.language === 'en' ? 'en' : 'ko'; }
  function t(key, values) {
    var message = labels[language()][key] || key;
    return message.replace(/\{(\w+)\}/g, function (match, name) { return values && values[name] !== undefined ? String(values[name]) : match; });
  }
  function localized(record, key) {
    if (window.labI18n && typeof window.labI18n.record === 'function') return value(window.labI18n.record(record, key));
    return language() === 'en' ? value(record[key + 'En']) || value(record[key]) : value(record[key]);
  }
  function tagLabel(tag) { return language() === 'en' ? tagLabelsEn[tag] || tag : tag; }

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
        title: value(record.title),
        titleEn: value(record.titleEn),
        authors: Array.isArray(record.authors) ? record.authors.map(value).filter(Boolean).join(', ') : value(record.authors),
        authorsEn: Array.isArray(record.authorsEn) ? record.authorsEn.map(value).filter(Boolean).join(', ') : value(record.authorsEn),
        journal: value(record.journal),
        journalEn: value(record.journalEn),
        date: validDate(record.date),
        year: validYear(record.year) || validDate(record.date).slice(0, 4),
        doi: value(record.doi),
        url: safeUrl(record.url),
        summary: value(record.summary),
        summaryEn: value(record.summaryEn),
        dateNote: value(record.dateNote),
        dateNoteEn: value(record.dateNoteEn),
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

    renderYears();
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
    window.addEventListener('lab-language-change', function () {
      renderYears();
      renderPapers();
      renderNews();
    });

    function renderYears() {
      yearSelect.replaceChildren();
      var allYears = element('option', '', t('allYears'));
      allYears.value = '';
      yearSelect.appendChild(allYears);
      years.forEach(function (year) {
        var option = element('option', '', t('year', { year: year }));
        option.value = year;
        yearSelect.appendChild(option);
      });
      yearSelect.value = state.year;
    }

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
        return [paper.title, paper.titleEn, paper.authors, paper.authorsEn, paper.journal, paper.journalEn, paper.summary, paper.summaryEn, paper.doi, paper.tags.join(' '), paper.tags.map(function (tag) { return tagLabelsEn[tag] || tag; }).join(' ')].join(' ').toLocaleLowerCase().indexOf(query) >= 0;
      });
      var visible = matching.filter(function (paper) { return !state.tag || paper.tags.indexOf(state.tag) >= 0; });
      tagList.replaceChildren();
      tagList.appendChild(filterButton('', t('all'), matching.length));
      tags.forEach(function (tag) {
        var count = matching.filter(function (paper) { return paper.tags.indexOf(tag) >= 0; }).length;
        tagList.appendChild(filterButton(tag, tagLabel(tag), count));
      });
      countNode.textContent = t('count', { total: papers.length, visible: visible.length });
      paperList.replaceChildren();
      if (!visible.length) {
        paperList.appendChild(element('p', 'empty', t(papers.length ? 'noMatches' : 'papersPending')));
        return;
      }
      visible.forEach(function (paper) {
        var article = element('article', 'paper');
        article.appendChild(element('div', 'year', paper.year || '—'));
        var body = element('div', 'paper-content');
        if (paper.tags.length) {
          var paperTags = element('div', 'paper-tags');
          paper.tags.forEach(function (tag) { paperTags.appendChild(filterButton(tag, tagLabel(tag))); });
          body.appendChild(paperTags);
        }
        var heading = element('h3');
        var doiHref = doiUrl(paper.doi);
        heading.appendChild(linkOrText(localized(paper, 'title') || t('untitled'), paper.url || doiHref));
        body.appendChild(heading);
        var authors = localized(paper, 'authors');
        if (authors) body.appendChild(element('p', 'paper-authors', authors));
        var citation = [localized(paper, 'journal'), paper.date ? t('onlineDate', { date: formatDate(paper.date) }) : paper.year].filter(Boolean).join(' · ');
        if (citation) body.appendChild(element('p', 'paper-citation', citation));
        var dateNote = localized(paper, 'dateNote');
        if (dateNote) body.appendChild(element('p', 'paper-date-note', dateNote));
        body.appendChild(element('p', 'paper-summary', localized(paper, 'summary') || t('summaryPending')));
        article.appendChild(body);
        var reference = doiHref || paper.url;
        if (reference) {
          var source = linkOrText(doiHref ? 'DOI ↗' : t('original'), reference);
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
        button.setAttribute('aria-label', t('tagCount', { label: label, count: count }));
      }
      button.addEventListener('click', function () { chooseTag(tag); });
      return button;
    }

    function renderNews() {
      var news = (Array.isArray(library.news) ? library.news : []).filter(isRecord).map(function (record) {
        return {
          title: value(record.title),
          titleEn: value(record.titleEn),
          publisher: value(record.publisher) || value(record.source),
          publisherEn: value(record.publisherEn) || value(record.sourceEn),
          date: validDate(record.date),
          summary: value(record.summary),
          summaryEn: value(record.summaryEn),
          url: safeUrl(record.url) || safeUrl(record.link)
        };
      }).sort(newestFirst);
      newsList.replaceChildren();
      if (!news.length) {
        newsList.appendChild(element('p', 'empty news-empty', t('newsPending')));
        return;
      }
      news.forEach(function (item) {
        var article = element('article', 'news-item');
        var heading = element('h3');
        heading.appendChild(linkOrText(localized(item, 'title') || t('untitled'), item.url));
        article.appendChild(heading);
        var metadata = [localized(item, 'publisher'), item.date ? formatDate(item.date) : t('dateMissing')].filter(Boolean).join(' · ');
        article.appendChild(element('p', 'muted', metadata));
        article.appendChild(element('p', 'news-summary', localized(item, 'summary') || t('newsSummaryPending')));
        if (item.url) article.appendChild(linkOrText(t('readArticle'), item.url));
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
  function formatDate(date) {
    return new Intl.DateTimeFormat(language() === 'en' ? 'en-US' : 'ko-KR', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T00:00:00Z'));
  }
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
