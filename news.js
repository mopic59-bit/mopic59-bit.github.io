// 링크를 확인한 뒤 제목과 짧은 요약을 함께 추가합니다.
// { url: 'https://...', title: '기사 제목', summary: '간단한 요약', date: '2026-10-10', publisher: '매체명' }
const newsItems = [
  {
    "url": "https://www.newsmp.com/news/articleView.html?idxno=254207",
    "title": "양산부산대병원ㆍ부산의대 연구팀, 국립암센터 CAR-T 개발과제 선정",
    "titleEn": "Pusan National University Yangsan Hospital and School of Medicine team selected for a National Cancer Center CAR-T development project",
    "summary": "이재민·정재헌·홍창완 교수 연구팀이 신경모세포종을 위한 Nrf2 제어 GD2 표적 CAR-T 세포치료제 개발 과제에 선정됐습니다. 45개월 동안 총 37억여 원의 지원을 받아 연구와 전임상 검증, 임상 적용 기반 마련을 추진할 계획입니다.",
    "summaryEn": "A team led by Professors Jae Min Lee, Jae Heon Jeong, and Chang Wan Hong was selected to develop an Nrf2-regulated, GD2-targeted CAR-T cell therapy for neuroblastoma. With approximately KRW 3.7 billion in funding over 45 months, the team plans to conduct research and preclinical validation and establish a foundation for clinical application.",
    "date": "2026-06-04",
    "publisher": "의약뉴스",
    "publisherEn": "NewsMP"
  },
  {
    "url": "https://www.veritas-a.com/news/articleView.html?idxno=438881",
    "title": "영남대 의대 학생들 '대한감염학회/대한항균요법학회' 우수연제상 수상",
    "titleEn": "Yeungnam University medical students win outstanding presentation awards from Korean infectious disease and antimicrobial therapy societies",
    "summary": "이재민 교수가 지도한 의대 학생들이 의료 빅데이터를 활용해 바이러스와 소아 열성경련의 연관성을 연구하고 감염학회·항균요법학회 우수연제상을 받았습니다.",
    "summaryEn": "Medical students supervised by Professor Jae Min Lee used large-scale health data to study the association between viruses and febrile seizures in children, earning outstanding presentation awards from the infectious disease and antimicrobial therapy societies.",
    "date": "2022-12-01",
    "publisher": "베리타스알파",
    "publisherEn": "Veritas Alpha"
  },
  {
    "url": "https://www.newsway.co.kr/news/view?tp=1&ud=2021112518432316804",
    "title": "영남대 의대, 의학통계 빅데이터 발표회 성황리 마쳐",
    "titleEn": "Yeungnam University School of Medicine holds a successful medical statistics and big data symposium",
    "summary": "영남대 의대가 의료 빅데이터와 인공지능 연구 경험을 나누는 공개 발표회를 열었습니다. 이재민 교수는 공공 의료자료를 활용한 연구 과정과 경험을 소개했습니다.",
    "summaryEn": "Yeungnam University School of Medicine hosted a public symposium to share research experience in health big data and artificial intelligence. Professor Jae Min Lee discussed his experience and research process using public health datasets.",
    "date": "2021-11-25",
    "publisher": "뉴스웨이",
    "publisherEn": "Newsway"
  },
  {
    "url": "https://www.kbsm.net/news/view.php?idx=308359",
    "title": "배우 이준기 일본 팬클럽, 영남대병원 `병원학교` 도서 기부",
    "titleEn": "Actor Lee Joon-gi's Japanese fan club donates books to Yeungnam University Hospital's hospital school",
    "summary": "배우 이준기의 일본 팬클럽이 영남대병원 병원학교에 그림책 50권을 기부했습니다. 장기 치료 중인 학생들의 학습과 정서적 안정을 응원하는 나눔입니다.",
    "summaryEn": "Actor Lee Joon-gi's Japanese fan club donated 50 picture books to the hospital school at Yeungnam University Hospital, supporting the learning and emotional well-being of students receiving long-term treatment.",
    "date": "2021-04-13",
    "publisher": "경북신문",
    "publisherEn": "Gyeongbuk Shinmun"
  },
  {
    "url": "https://www.ajunews.com/view/20210330172831281",
    "title": "영남대 의대생, 바이러스와 소아 혈소판감소증의 연관성 연구···‘국제 저명 저널’ 게재",
    "titleEn": "Yeungnam University medical students publish research on viruses and childhood thrombocytopenia in an international journal",
    "summary": "이재민·이영환 교수의 지도를 받은 의대 학생들이 바이러스 감염과 소아 면역혈소판감소증의 연관성을 공공 보건자료로 분석하고 국제 학술지에 발표했습니다.",
    "summaryEn": "Medical students supervised by Professors Jae Min Lee and Young Hwan Lee analyzed the association between viral infections and childhood immune thrombocytopenia using public health data and published their findings in an international journal.",
    "date": "2021-03-30",
    "publisher": "아주경제",
    "publisherEn": "Aju Business Daily"
  },
  {
    "url": "https://www.bosa.co.kr/news/articleView.html?idxno=2136979",
    "title": "이재민 교수, 소아혈액종양학회 '최우수연제상'",
    "titleEn": "Professor Jae Min Lee receives the Best Presentation Award from the Korean Society of Pediatric Hematology-Oncology",
    "summary": "영남대병원 소아청소년과 이재민 교수가 영유아기 미세먼지 장기 노출과 소아암 발생의 관련성을 분석한 후향적 코호트 연구로 대한소아혈액종양학회 추계학술대회 최우수연제상을 받았습니다. 국민건강보험 청구자료와 한국환경공단 대기오염 자료를 결합해 누적 미세먼지 노출과 소아암 발생 위험의 연관성을 분석했습니다.",
    "summaryEn": "Professor Jae Min Lee of the Department of Pediatrics at Yeungnam University Hospital received the Best Presentation Award at the Korean Society of Pediatric Hematology-Oncology's autumn meeting for a retrospective cohort study on long-term exposure to particulate matter in early childhood and childhood cancer. The study combined National Health Insurance claims with Korea Environment Corporation air pollution data to examine the association between cumulative particulate matter exposure and childhood cancer risk.",
    "date": "2020-10-28",
    "publisher": "의학신문",
    "publisherEn": "Medical News (Bosa)"
  },
  {
    "url": "https://www.mdtoday.co.kr/news/articleView.html?idxno=361771",
    "title": "영남대 의대 학생 연구 논문, 국제 학술지 등재",
    "titleEn": "Yeungnam University medical students publish their research in an international journal",
    "summary": "이재민 교수의 지도를 받은 의대 학생들이 신속 다중 PCR 검사를 활용한 백일해의 조기 진단·치료 연구를 수행하고 국제 학술지에 발표했습니다.",
    "summaryEn": "Medical students supervised by Professor Jae Min Lee studied the early diagnosis and treatment of pertussis using rapid multiplex PCR testing and published their findings in an international journal.",
    "date": "2020-06-29",
    "publisher": "메디컬투데이",
    "publisherEn": "Medical Today"
  },
  {
    "url": "https://www.idaegu.co.kr/news/articleView.html?idxno=311521",
    "title": "영남대병원, 소아청소년 완화의료 시범기관 선정",
    "titleEn": "Yeungnam University Hospital selected for a pediatric palliative care pilot program",
    "summary": "영남대병원이 소아청소년 완화의료 시범사업기관으로 선정됐습니다. 이재민 교수는 중증 소아청소년과 가족이 지역에서 전문적인 돌봄을 받을 수 있는 기반의 의미를 설명했습니다.",
    "summaryEn": "Yeungnam University Hospital was selected as a provider for a pediatric palliative care pilot program. Professor Jae Min Lee explained the significance of establishing access to specialized local care for seriously ill children, adolescents, and their families.",
    "date": "2020-05-17",
    "publisher": "대구신문",
    "publisherEn": "Daegu Shinmun"
  },
  {
    "url": "https://www.medifonews.com/news/article_print.html?no=149581",
    "title": "영남대의료원 이재민 교수 연구팀, 대한소아혈액종양학회 추계학술대회 우수연제상 수상",
    "titleEn": "Professor Jae Min Lee's team at Yeungnam University Medical Center wins an Outstanding Presentation Award at the pediatric hematology-oncology autumn meeting",
    "summary": "이재민 교수의 지도 아래 학생연구팀이 소아암 항암치료 중 구역·구토에 대한 올란자핀의 효과와 안전성을 연구해 우수연제상을 받았습니다.",
    "summaryEn": "A student research team supervised by Professor Jae Min Lee received an Outstanding Presentation Award for studying the efficacy and safety of olanzapine for chemotherapy-induced nausea and vomiting in children with cancer.",
    "date": "2019-10-28",
    "publisher": "메디포뉴스",
    "publisherEn": "Medifonews"
  },
  {
    "url": "https://www.imaeil.com/page/view/2018090410523919990",
    "title": "[메디컬퓨처스] 이재민 영남대 교수(소아청소년과)",
    "titleEn": "[Medical Futures] Jae Min Lee, Professor of Pediatrics at Yeungnam University",
    "summary": "소아혈액종양 전문의가 된 과정과 진료 철학을 소개한 인터뷰입니다. 소아암 환자의 사회 복귀와 소아 난치병 환자를 위한 완화의료에 대한 생각을 담았습니다.",
    "summaryEn": "This interview explores his path to becoming a pediatric hematologist-oncologist and his approach to patient care. It includes his views on helping children with cancer return to everyday life and on palliative care for children with difficult-to-treat illnesses.",
    "date": "2018-09-04",
    "publisher": "매일신문",
    "publisherEn": "Maeil Shinmun"
  },
  {
    "url": "https://www.ksmnews.co.kr/news/view.php?idx=211842",
    "title": "힘든 치료 이겨낸 영웅…너희가 ‘꿈꾸는 대로’",
    "titleEn": "Young heroes who endured difficult treatment: following their dreams",
    "summary": "영남대병원이 소아암 치료자들의 꿈을 담은 그림 전시회를 열었습니다. 아이들의 희망을 응원하고 소아암에 대한 사회적 인식을 개선하기 위한 행사입니다.",
    "summaryEn": "Yeungnam University Hospital held an art exhibition featuring the dreams of children who had received cancer treatment. The event supported their hopes and promoted greater public understanding of childhood cancer.",
    "date": "2018-06-26",
    "publisher": "경상매일신문",
    "publisherEn": "Gyeongsang Maeil Shinmun"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=946283",
    "title": "영남대병원과 대구남양학교, 소아암 환아 사회인식 개선 전시회 열어",
    "titleEn": "Yeungnam University Hospital and Daegu Namyang School hold an exhibition to raise awareness of childhood cancer",
    "summary": "영남대병원과 대구남양학교가 소아암 환아의 꿈을 담은 작품 전시회를 열었습니다. 치료 중인 아이들을 응원하고 소아암에 대한 인식을 개선하기 위한 행사입니다.",
    "summaryEn": "Yeungnam University Hospital and Daegu Namyang School held an exhibition of artwork depicting the dreams of children with cancer. The event supported children undergoing treatment and raised public awareness of childhood cancer.",
    "date": "2018-06-23",
    "publisher": "국제뉴스",
    "publisherEn": "Gukje News"
  },
  {
    "url": "https://www.k-health.com/news/articleView.html?idxno=32859",
    "title": "영남대병원, 소아암환아 사회인식개선 위한 전시회 개최",
    "titleEn": "Yeungnam University Hospital hosts an exhibition to improve public understanding of children with cancer",
    "summary": "영남대병원 소아청소년과와 희열위고 봉사사업단이 소아암 환아에 대한 인식 개선 전시회를 열었습니다. 완치자들의 국토순례 사진과 병원학교 학생들의 작품을 소개했습니다.",
    "summaryEn": "Yeungnam University Hospital's Department of Pediatrics and the Huiyeol Wego volunteer group hosted an exhibition to improve public understanding of children with cancer. It featured photographs of cancer survivors' journey across Korea and artwork by hospital school students.",
    "date": "2017-11-24",
    "publisher": "헬스경향",
    "publisherEn": "Health Kyunghyang"
  },
  {
    "url": "https://www.nspna.com/country/?mode=view&newsid=252713",
    "title": "영남대병원 소아청소년과-영남대 경영대학,  소아암 환아 사회인식 개선 전시회 열어",
    "titleEn": "Yeungnam University Hospital's Department of Pediatrics and Business School hold a childhood cancer awareness exhibition",
    "summary": "소아암 완치자들의 국토순례 사진과 병원학교 학생들의 작품을 함께 전시하며 환아의 꿈과 일상 회복을 응원하고 사회적 편견을 줄이고자 했습니다.",
    "summaryEn": "An exhibition combined photographs of childhood cancer survivors' journey across Korea with artwork by hospital school students. It aimed to support the children's dreams and return to everyday life while reducing social prejudice.",
    "date": "2017-11-24",
    "publisher": "NSP통신",
    "publisherEn": "NSP News Agency"
  },
  {
    "url": "https://www.breaknews.com/sub_read.html?uid=538385&section=sc2",
    "title": "영남대병원, 시리아 난민 환아 돕기 페이스북 이벤트 가져",
    "titleEn": "Yeungnam University Hospital launches a Facebook campaign to support a Syrian refugee child",
    "summary": "영남대병원이 치료 중인 시리아 난민 환아를 돕는 응원 댓글 후원 행사를 진행했습니다. 댓글 참여를 치료비 지원으로 연결하는 방식의 나눔입니다.",
    "summaryEn": "Yeungnam University Hospital organized a social media campaign to support a Syrian refugee child undergoing treatment. Encouraging comments on Facebook were linked to contributions toward the child's medical expenses.",
    "date": "2017-10-27",
    "publisher": "브레이크뉴스",
    "publisherEn": "Break News"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=777962",
    "title": "영남대병원, 국내 최단 시간 호흡기감염 바이러스 검사 결과 확인",
    "titleEn": "Yeungnam University Hospital reports Korea's fastest respiratory virus testing turnaround",
    "summary": "영남대병원이 신속 호흡기감염 검사 시스템을 도입했습니다. 이재민 교수팀은 빠른 검사 결과 확인과 호흡기감염 환자의 입원기간 감소에 관한 연구를 소개했습니다.",
    "summaryEn": "Yeungnam University Hospital introduced a rapid respiratory infection testing system. Professor Jae Min Lee's team presented research on faster test results and shorter hospital stays for patients with respiratory infections.",
    "date": "2017-09-05",
    "publisher": "국제뉴스",
    "publisherEn": "Gukje News"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=777043",
    "title": "영남대병원, 백혈병·소아암 환아의 아픔을 함께 나누다",
    "titleEn": "Yeungnam University Hospital stands with children facing leukemia and cancer",
    "summary": "백혈병·소아암에 대한 사회적 인식을 개선하는 국토순례 캠페인의 해단식이 영남대병원에서 열렸습니다. 환아와 가족의 권익·복지에 대한 관심을 촉구했습니다.",
    "summaryEn": "Yeungnam University Hospital hosted the closing ceremony of a journey across Korea to raise public awareness of leukemia and childhood cancer. The campaign called for greater attention to the rights and well-being of affected children and their families.",
    "date": "2017-09-04",
    "publisher": "국제뉴스",
    "publisherEn": "Gukje News"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=775965",
    "title": "한국소아암부모회, 대구경북 백혈병·소아암 사회인식 전환 캠페인",
    "titleEn": "Korean childhood cancer parents' association holds an awareness campaign in Daegu and Gyeongbuk",
    "summary": "대구·경북에서 소아암에 대한 편견을 줄이고 환아와 완치자의 사회 참여를 응원하는 국토순례 캠페인이 진행됐습니다. 해단식에서는 이재민 교수에게 감사패를 전달했습니다.",
    "summaryEn": "A journey across Korea in the Daegu and Gyeongbuk region aimed to reduce prejudice about childhood cancer and support the social participation of children with cancer and survivors. Professor Jae Min Lee received a plaque of appreciation at the closing ceremony.",
    "date": "2017-09-02",
    "publisher": "국제뉴스",
    "publisherEn": "Gukje News"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=747401",
    "title": "영남대의료원에서 대학생들이 환아 위한 봉사 펼쳐",
    "titleEn": "University students volunteer for young patients at Yeungnam University Medical Center",
    "summary": "희열위고 소속 대학생들이 영남대의료원 환아들에게 일대일 학습·멘토링과 도토리교실 프로그램을 제공하며 치료 중에도 배움을 이어갈 수 있도록 지원했습니다.",
    "summaryEn": "University students in the Huiyeol Wego volunteer group provided one-to-one tutoring, mentoring, and the Acorn Classroom program for young patients at Yeungnam University Medical Center, helping them continue learning during treatment.",
    "date": "2017-07-15",
    "publisher": "국제뉴스",
    "publisherEn": "Gukje News"
  },
  {
    "url": "https://www.dailypharm.com/user/news/114392",
    "title": "소아암재단-코웨이 '파랑새' 대구영남대병원 방문",
    "titleEn": "Korea Childhood Cancer Foundation and Coway's Bluebird team visit Yeungnam University Hospital in Daegu",
    "summary": "한국소아암재단과 코웨이 파랑새가 영남대병원 소아암병동을 방문해 공기청정기·청소기·손 소독제 등을 지원했습니다.",
    "summaryEn": "The Korea Childhood Cancer Foundation and Coway's Bluebird team visited the pediatric cancer ward at Yeungnam University Hospital and donated air purifiers, vacuum cleaners, hand sanitizers, and other supplies.",
    "date": "2016-04-06",
    "publisher": "데일리팜",
    "publisherEn": "Daily Pharm"
  },
  {
    "url": "https://www.mdtoday.co.kr/news/articleView.html?idxno=240707",
    "title": "영남대병원 이재민 교수, 대한조혈모세포이식학회 우수연제상",
    "titleEn": "Professor Jae Min Lee of Yeungnam University Hospital receives an Outstanding Presentation Award from the Korean Society of Blood and Marrow Transplantation",
    "summary": "이재민 교수가 소아 급성림프모구백혈병의 조혈모세포이식 전처치요법을 비교한 연구로 대한조혈모세포이식학회 우수연제상을 받았습니다.",
    "summaryEn": "Professor Jae Min Lee received an Outstanding Presentation Award from the Korean Society of Blood and Marrow Transplantation for a study comparing hematopoietic stem cell transplantation conditioning regimens in childhood acute lymphoblastic leukemia.",
    "date": "2016-03-04",
    "publisher": "메디컬투데이",
    "publisherEn": "Medical Today"
  },
  {
    "kind": "link",
    "year": 2023,
    "title": "2023년 CPHO 우수논문상 영남의대 이재민",
    "titleEn": "2023 CPHO Outstanding Paper Award — Jae Min Lee, Yeungnam University School of Medicine",
    "url": "https://www.kspho.or.kr/content/about/article_list.html"
  },
  {
    "kind": "link",
    "year": 2017,
    "title": "2017년 대한혈액학회 우수논문상 영남의대 이재민",
    "titleEn": "2017 Korean Society of Hematology Outstanding Paper Award — Jae Min Lee, Yeungnam University School of Medicine",
    "url": "https://www.hematology.or.kr/sub01/sub02.html"
  }
];

function renderNews(items) {
 const container = document.querySelector('#news-list');
 container.replaceChildren();
 const valid = items.filter(item => {
  try { return ['https:', 'http:'].includes(new URL(item.url).protocol) && item.title; }
  catch { return false; }
 }).sort((a,b) => (b.date || String(b.year || '')).localeCompare(a.date || String(a.year || '')));
 if (!valid.length) {
  const message = document.createElement('p');
  message.className = 'news-empty';
  message.textContent = window.labI18n.t('news.empty');
  container.append(message);
  return;
 }
 for (const item of valid) {
  if (item.kind === 'link') {
   const row = document.createElement('article'); row.className = 'news-item news-link';
   const title = document.createElement('h3');
   const link = document.createElement('a'); link.href = item.url;
   link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = window.labI18n.record(item, 'title') + ' ↗';
   title.append(link); row.append(title); container.append(row); continue;
  }
  const article = document.createElement('article'); article.className = 'news-item';
  const meta = document.createElement('p'); meta.className = 'count';
  meta.textContent = [window.labI18n.record(item, 'publisher'),item.date].filter(Boolean).join(' · ');
  const title = document.createElement('h3');
  const link = document.createElement('a'); link.href = item.url;
  link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = window.labI18n.record(item, 'title') + ' ↗';
  title.append(link);
  article.append(meta,title);
  if (item.summary) {
   const summary = document.createElement('p'); summary.className = 'muted';
   summary.textContent = window.labI18n.record(item, 'summary'); article.append(summary);
  }
  container.append(article);
 }
}
renderNews(newsItems);
window.addEventListener('lab-language-change', () => renderNews(newsItems));

