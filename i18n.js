(function () {
  'use strict';
  var messages = {
  "nav.label": {
    "ko": "주 메뉴",
    "en": "Main navigation"
  },
  "nav.about": {
    "ko": "소개",
    "en": "About"
  },
  "nav.tools": {
    "ko": "연구 도구",
    "en": "Research Tools"
  },
  "nav.archive": {
    "ko": "개인 기록",
    "en": "Personal Archive"
  },
  "footer.copyright": {
    "ko": "© 2026 이재민 · 개인 연구 홈페이지",
    "en": "© 2026 Jae Min Lee · Personal Research Website"
  },
  "years.all": {
    "ko": "모든 연도",
    "en": "All years"
  },
  "nav.papers": {
    "ko": "논문",
    "en": "Publications"
  },
  "nav.news": {
    "ko": "뉴스",
    "en": "News"
  },
  "home.intro": {
    "ko": "부산대학교 의과대학 · 부산대학교 어린이병원 소아청소년과<br>이재민 교수의<br>논문과 연구 도구를 정리하는 개인 연구 홈페이지입니다.",
    "en": "Personal research website of Professor Jae Min Lee.<br>Department of Pediatrics, Pusan National University School of Medicine<br>and Pusan National University Children's Hospital.<br>A collection of publications and research tools."
  },
  "home.tools": {
    "ko": "연구 도구",
    "en": "Research Tools"
  },
  "home.papers": {
    "ko": "주요 논문",
    "en": "Selected Publications"
  },
  "about.heading": {
    "ko": "소개와 진료 분야",
    "en": "About &amp; Clinical Expertise"
  },
  "name": {
    "ko": "이재민",
    "en": "Jae Min Lee"
  },
  "about.affiliation": {
    "ko": "부산대학교 의과대학 소아청소년과<br>부산대학교 어린이병원 소아청소년과<br>혈액종양클리닉 운영",
    "en": "Department of Pediatrics, Pusan National University School of Medicine<br>Department of Pediatrics, Pusan National University Children's Hospital<br>Hematology &amp; Oncology Clinic"
  },
  "clinical.hematology": {
    "ko": "소아혈액질환",
    "en": "Pediatric Blood Disorders"
  },
  "clinical.blood": {
    "ko": "소아빈혈 · 재생불량빈혈 · 유전용혈빈혈 · 혈우병",
    "en": "Pediatric anemia · Aplastic anemia · Hereditary hemolytic anemia · Hemophilia"
  },
  "clinical.oncology": {
    "ko": "소아암",
    "en": "Pediatric Cancer"
  },
  "clinical.cancer": {
    "ko": "혈액암: 백혈병, 림프종, 혈구탐식증후군 등<br>고형암: 신경모세포종, 뇌종양, 랑게르한스세포종, 횡문근육종, 골육종, 윌름스 종양 등",
    "en": "Hematologic conditions: leukemia, lymphoma, hemophagocytic lymphohistiocytosis, and others<br>Solid tumors: neuroblastoma, brain tumors, Langerhans cell histiocytosis, rhabdomyosarcoma, osteosarcoma, Wilms tumor, and others"
  },
  "tools.heading": {
    "ko": "논문 작성과 연구를 위한 도구",
    "en": "Tools for Writing &amp; Research"
  },
  "tools.intro": {
    "ko": "ChatGPT를 활용해 개발한 도구를 소개하는 공간입니다.",
    "en": "Research tools developed with ChatGPT."
  },
  "tools.description": {
    "ko": "ChatGPT를 활용해 개발한 문헌 선별 도구입니다.<br>Rayyan을 벤치마킹해서 메타분석 시에 필요한 문헌 선별용으로 개발했습니다.<br>아래 버튼을 눌러 실행 페이지로 이동할 수 있습니다.",
    "en": "A literature screening tool developed with ChatGPT.<br>Inspired by Rayyan, it supports study screening for meta-analyses.<br>Use the button below to open the application."
  },
  "tools.launch": {
    "ko": "도구 실행 ↗",
    "en": "Open Tool ↗"
  },
  "tools.source": {
    "ko": "GitHub 소스 ↗",
    "en": "GitHub Source ↗"
  },
  "papers.heading": {
    "ko": "소아혈액종양 주요 논문",
    "en": "Selected Papers in Pediatric Hematology &amp; Oncology"
  },
  "papers.intro": {
    "ko": "직접 선정한 논문의 핵심 내용과 주제를 정리합니다.<br><a href=\"personal.html#publications\">이재민 교수의 논문 목록 ↗</a>",
    "en": "Key findings and topics from personally selected papers.<br><a href=\"personal.html#publications\">Jae Min Lee's Publications ↗</a>"
  },
  "tags.all": {
    "ko": "전체",
    "en": "All"
  },
  "filters.reset": {
    "ko": "필터 초기화",
    "en": "Reset filters"
  },
  "papers.dates": {
    "ko": "온라인 공개일 기준 최신순 · 서지정보에는 정식 게재 연도가 함께 표시될 수 있습니다.",
    "en": "Newest online publication first · The citation may also show the year of the journal issue."
  },
  "papers.pending": {
    "ko": "선정한 논문을 준비 중입니다. 등록하면 핵심 요약과 주제 태그를 함께 볼 수 있습니다.",
    "en": "Selected papers will appear here with summaries and topic tags."
  },
  "papers.noscript": {
    "ko": "논문 목록과 태그 필터를 보려면 JavaScript를 활성화해 주세요.",
    "en": "Please enable JavaScript to view the papers and topic filters."
  },
  "news.heading": {
    "ko": "소아혈액종양 뉴스",
    "en": "Pediatric Hematology &amp; Oncology News"
  },
  "news.intro": {
    "ko": "소아혈액종양 분야에서 주목할 소식을 전합니다.<br><a href=\"personal.html#news\">이재민 교수 관련 뉴스 ↗</a>",
    "en": "Selected news in pediatric hematology and oncology.<br><a href=\"personal.html#news\">News about Jae Min Lee ↗</a>"
  },
  "news.pending": {
    "ko": "선정한 소식을 준비 중입니다.",
    "en": "Selected news will appear here."
  },
  "footer.specialty": {
    "ko": "소아혈액종양 / Pediatric Hematology &amp; Oncology",
    "en": "Pediatric Hematology &amp; Oncology"
  },
  "tags.label": {
    "ko": "논문 주제 태그",
    "en": "Paper topic tags"
  },
  "papers.searchLabel": {
    "ko": "주요 논문 검색",
    "en": "Search selected papers"
  },
  "papers.yearLabel": {
    "ko": "주요 논문 발행 연도",
    "en": "Publication year"
  },
  "papers.searchPlaceholder": {
    "ko": "논문 제목·저자·요약·태그 검색",
    "en": "Search titles, authors, summaries or tags"
  },
  "about.imageAlt": {
    "ko": "바닷속 병원에서 아기상어 환자를 돌보는 이재민 교수의 일러스트",
    "en": "Illustration of Professor Jae Min Lee caring for a baby shark patient in an underwater hospital"
  },
  "nav.selected": {
    "ko": "주요 논문",
    "en": "Selected Papers"
  },
  "nav.fieldNews": {
    "ko": "분야 뉴스",
    "en": "Field News"
  },
  "archive.home": {
    "ko": "← 홈페이지",
    "en": "← Home"
  },
  "archive.heading": {
    "ko": "개인 논문과 뉴스",
    "en": "Personal Publications &amp; News"
  },
  "archive.intro": {
    "ko": "이재민 교수의 연구 기록과 관련 소식을 모았습니다.",
    "en": "Research publications and news about Professor Jae Min Lee."
  },
  "archive.papers": {
    "ko": "개인 논문",
    "en": "Personal Publications"
  },
  "archive.news": {
    "ko": "개인 뉴스",
    "en": "Personal News"
  },
  "archive.papersHeading": {
    "ko": "이재민 교수의 논문",
    "en": "Publications by Jae Min Lee"
  },
  "archive.orcidInfo": {
    "ko": "ORCID 공개 기록을 발행일 기준 최신순으로 정리합니다. 페이지를 열 때와 열려 있는 동안 30분마다 자동 갱신됩니다.",
    "en": "Public ORCID records, sorted by publication date. The list refreshes when you open the page and every 30 minutes while it remains open."
  },
  "archive.refresh": {
    "ko": "지금 갱신 ↻",
    "en": "Refresh now ↻"
  },
  "archive.source": {
    "ko": "서지 출처: <a href=\"https://orcid.org/0000-0001-6822-1051\" target=\"_blank\" rel=\"noopener noreferrer\">ORCID 공개 기록</a> · 연도 미등록 기록은 마지막에 표시됩니다.",
    "en": "Source: <a href=\"https://orcid.org/0000-0001-6822-1051\" target=\"_blank\" rel=\"noopener noreferrer\">Public ORCID records</a> · Records without a publication year appear last."
  },
  "archive.orcid": {
    "ko": "ORCID 연구 기록 보기 ↗",
    "en": "View ORCID Research Record ↗"
  },
  "archive.newsHeading": {
    "ko": "이재민 교수 관련 뉴스",
    "en": "News about Jae Min Lee"
  },
  "archive.newsIntro": {
    "ko": "연구와 진료에 관한 소식을 전합니다.",
    "en": "News about research and clinical work."
  },
  "news.empty": {
    "ko": "등록된 뉴스가 없습니다. 새로운 소식을 준비 중입니다.",
    "en": "No news has been added yet. More updates will follow."
  },
  "archive.return": {
    "ko": "홈페이지로 돌아가기 ↗",
    "en": "Return to Home ↗"
  },
  "archive.searchLabel": {
    "ko": "논문 검색",
    "en": "Search publications"
  },
  "archive.yearLabel": {
    "ko": "발행 연도",
    "en": "Publication year"
  },
  "archive.searchPlaceholder": {
    "ko": "논문 제목·저자·학술지 검색",
    "en": "Search titles, authors or journals"
  },
  "language.label": {
    "ko": "언어 선택",
    "en": "Choose language"
  },
  "page.homeTitle": {
    "ko": "이재민 | 소아혈액종양 연구",
    "en": "Jae Min Lee | Pediatric Hematology & Oncology Research"
  },
  "page.archiveTitle": {
    "ko": "개인 논문과 뉴스 | 이재민",
    "en": "Personal Publications & News | Jae Min Lee"
  },
  "page.description": {
    "ko": "이재민의 개인 연구 홈페이지. 소아혈액종양 진료 분야, 논문 목록과 ChatGPT 기반 연구 도구.",
    "en": "The personal research website of Jae Min Lee: pediatric hematology and oncology, publications, and research tools developed with ChatGPT."
  },
  "page.ogDescription": {
    "ko": "부산대학교 의과대학 이재민 교수의 소아혈액종양 진료·연구, 논문 목록과 연구 도구를 소개합니다.",
    "en": "Pediatric hematology and oncology research, publications, and tools by Professor Jae Min Lee at Pusan National University School of Medicine."
  }
};
  var storageKey = 'research-lab-language';
  var language = 'ko';
  var requested = new URL(window.location.href).searchParams.get('lang');
  var saved = null;
  try {
    saved = window.localStorage.getItem(storageKey);
  } catch (error) { /* The site also works when browser storage is unavailable. */ }
  language = requested === 'en' || requested === 'ko' ? requested : saved === 'en' ? 'en' : 'ko';

  function t(key, values) {
    var entry = messages[key];
    var text = entry ? entry[language] || entry.ko : key;
    return text.replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, name) {
      return values && values[name] !== undefined ? String(values[name]) : match;
    });
  }
  function record(item, key) {
    if (!item) return '';
    return language === 'en' && item[key + 'En'] ? item[key + 'En'] : item[key] || '';
  }
  function translateStatic() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      if (messages[key]) node.innerHTML = t(key); // Only the fixed, locally authored interface dictionary contains HTML.
    });
    ['placeholder', 'aria-label', 'alt'].forEach(function (attribute) {
      document.querySelectorAll('[data-i18n-' + attribute + ']').forEach(function (node) {
        var key = node.getAttribute('data-i18n-' + attribute);
        if (messages[key]) node.setAttribute(attribute, t(key));
      });
    });
    document.querySelectorAll('[data-language]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-language') === language));
    });
    var pageTitle = t(document.body.getAttribute('data-page') === 'archive' ? 'page.archiveTitle' : 'page.homeTitle');
    document.title = pageTitle;
    [['name', 'description', t('page.description')], ['property', 'og:title', pageTitle], ['property', 'og:description', t('page.ogDescription')], ['property', 'og:site_name', t('page.homeTitle')], ['property', 'og:image:alt', t('about.imageAlt')], ['property', 'og:locale', language === 'en' ? 'en_US' : 'ko_KR']].forEach(function (item) {
      var node = document.querySelector('meta[' + item[0] + '="' + item[1] + '"]');
      if (node) node.setAttribute('content', item[2]);
    });
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      try {
        var url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || !/(?:^|\/)(?:index|personal)\.html$/.test(url.pathname)) return;
        url.searchParams.set('lang', language);
        link.setAttribute('href', url.href);
      } catch (error) { /* Keep the original link if it cannot be parsed. */ }
    });
  }
  function setLanguage(next, updateUrl) {
    if (next !== 'ko' && next !== 'en') return;
    language = next;
    window.labI18n.language = language;
    try { window.localStorage.setItem(storageKey, language); } catch (error) {}
    translateStatic();
    if (updateUrl !== false) {
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        window.history.replaceState(window.history.state, '', url.href);
      } catch (error) {}
    }
    window.dispatchEvent(new CustomEvent('lab-language-change', { detail: { language: language } }));
  }
  window.labI18n = { language: language, t: t, record: record, setLanguage: setLanguage };
  document.querySelectorAll('[data-language]').forEach(function (button) {
    button.addEventListener('click', function () { setLanguage(button.getAttribute('data-language')); });
  });
  window.addEventListener('popstate', function () {
    try {
      var next = new URL(window.location.href).searchParams.get('lang');
      if (next === 'ko' || next === 'en') setLanguage(next, false);
    } catch (error) {}
  });
  setLanguage(language, false);
}());
