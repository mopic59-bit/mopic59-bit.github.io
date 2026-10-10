// 링크를 확인한 뒤 제목과 짧은 요약을 함께 추가합니다.
// { url: 'https://...', title: '기사 제목', summary: '간단한 요약', date: '2026-10-10', publisher: '매체명' }
const newsItems = [
  {
    "url": "https://www.newsmp.com/news/articleView.html?idxno=254207",
    "title": "양산부산대병원ㆍ부산의대 연구팀, 국립암센터 CAR-T 개발과제 선정",
    "summary": "이재민·정재헌·홍창완 교수 연구팀이 신경모세포종을 위한 Nrf2 제어 GD2 표적 CAR-T 세포치료제 개발 과제에 선정됐습니다. 45개월 동안 총 37억여 원의 지원을 받아 연구와 전임상 검증, 임상 적용 기반 마련을 추진할 계획입니다.",
    "date": "2026-06-04",
    "publisher": "의약뉴스"
  },
  {
    "url": "https://www.veritas-a.com/news/articleView.html?idxno=438881",
    "title": "영남대 의대 학생들 '대한감염학회/대한항균요법학회' 우수연제상 수상",
    "summary": "이재민 교수가 지도한 의대 학생들이 의료 빅데이터를 활용해 바이러스와 소아 열성경련의 연관성을 연구하고 감염학회·항균요법학회 우수연제상을 받았습니다.",
    "date": "2022-12-01",
    "publisher": "베리타스알파"
  },
  {
    "url": "https://www.newsway.co.kr/news/view?tp=1&ud=2021112518432316804",
    "title": "영남대 의대, 의학통계 빅데이터 발표회 성황리 마쳐",
    "summary": "영남대 의대가 의료 빅데이터와 인공지능 연구 경험을 나누는 공개 발표회를 열었습니다. 이재민 교수는 공공 의료자료를 활용한 연구 과정과 경험을 소개했습니다.",
    "date": "2021-11-25",
    "publisher": "뉴스웨이"
  },
  {
    "url": "https://www.kbsm.net/news/view.php?idx=308359",
    "title": "배우 이준기 일본 팬클럽, 영남대병원 `병원학교` 도서 기부",
    "summary": "배우 이준기의 일본 팬클럽이 영남대병원 병원학교에 그림책 50권을 기부했습니다. 장기 치료 중인 학생들의 학습과 정서적 안정을 응원하는 나눔입니다.",
    "date": "2021-04-13",
    "publisher": "경북신문"
  },
  {
    "url": "https://www.ajunews.com/view/20210330172831281",
    "title": "영남대 의대생, 바이러스와 소아 혈소판감소증의 연관성 연구···‘국제 저명 저널’ 게재",
    "summary": "이재민·이영환 교수의 지도를 받은 의대 학생들이 바이러스 감염과 소아 면역혈소판감소증의 연관성을 공공 보건자료로 분석하고 국제 학술지에 발표했습니다.",
    "date": "2021-03-30",
    "publisher": "아주경제"
  },
  {
    "url": "https://www.bosa.co.kr/news/articleView.html?idxno=2136979",
    "title": "이재민 교수, 소아혈액종양학회 '최우수연제상'",
    "summary": "영남대병원 소아청소년과 이재민 교수가 영유아기 미세먼지 장기 노출과 소아암 발생의 관련성을 분석한 후향적 코호트 연구로 대한소아혈액종양학회 추계학술대회 최우수연제상을 받았습니다. 국민건강보험 청구자료와 한국환경공단 대기오염 자료를 결합해 누적 미세먼지 노출과 소아암 발생 위험의 연관성을 분석했습니다.",
    "date": "2020-10-28",
    "publisher": "의학신문"
  },
  {
    "url": "https://www.mdtoday.co.kr/news/articleView.html?idxno=361771",
    "title": "영남대 의대 학생 연구 논문, 국제 학술지 등재",
    "summary": "이재민 교수의 지도를 받은 의대 학생들이 신속 다중 PCR 검사를 활용한 백일해의 조기 진단·치료 연구를 수행하고 국제 학술지에 발표했습니다.",
    "date": "2020-06-29",
    "publisher": "메디컬투데이"
  },
  {
    "url": "https://www.idaegu.co.kr/news/articleView.html?idxno=311521",
    "title": "영남대병원, 소아청소년 완화의료 시범기관 선정",
    "summary": "영남대병원이 소아청소년 완화의료 시범사업기관으로 선정됐습니다. 이재민 교수는 중증 소아청소년과 가족이 지역에서 전문적인 돌봄을 받을 수 있는 기반의 의미를 설명했습니다.",
    "date": "2020-05-17",
    "publisher": "대구신문"
  },
  {
    "url": "https://www.medifonews.com/news/article_print.html?no=149581",
    "title": "영남대의료원 이재민 교수 연구팀, 대한소아혈액종양학회 추계학술대회 우수연제상 수상",
    "summary": "이재민 교수의 지도 아래 학생연구팀이 소아암 항암치료 중 구역·구토에 대한 올란자핀의 효과와 안전성을 연구해 우수연제상을 받았습니다.",
    "date": "2019-10-28",
    "publisher": "메디포뉴스"
  },
  {
    "url": "https://www.imaeil.com/page/view/2018090410523919990",
    "title": "[메디컬퓨처스] 이재민 영남대 교수(소아청소년과)",
    "summary": "소아혈액종양 전문의가 된 과정과 진료 철학을 소개한 인터뷰입니다. 소아암 환자의 사회 복귀와 소아 난치병 환자를 위한 완화의료에 대한 생각을 담았습니다.",
    "date": "2018-09-04",
    "publisher": "매일신문"
  },
  {
    "url": "https://www.ksmnews.co.kr/news/view.php?idx=211842",
    "title": "힘든 치료 이겨낸 영웅…너희가 ‘꿈꾸는 대로’",
    "summary": "영남대병원이 소아암 치료자들의 꿈을 담은 그림 전시회를 열었습니다. 아이들의 희망을 응원하고 소아암에 대한 사회적 인식을 개선하기 위한 행사입니다.",
    "date": "2018-06-26",
    "publisher": "경상매일신문"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=946283",
    "title": "영남대병원과 대구남양학교, 소아암 환아 사회인식 개선 전시회 열어",
    "summary": "영남대병원과 대구남양학교가 소아암 환아의 꿈을 담은 작품 전시회를 열었습니다. 치료 중인 아이들을 응원하고 소아암에 대한 인식을 개선하기 위한 행사입니다.",
    "date": "2018-06-23",
    "publisher": "국제뉴스"
  },
  {
    "url": "https://www.k-health.com/news/articleView.html?idxno=32859",
    "title": "영남대병원, 소아암환아 사회인식개선 위한 전시회 개최",
    "summary": "영남대병원 소아청소년과와 희열위고 봉사사업단이 소아암 환아에 대한 인식 개선 전시회를 열었습니다. 완치자들의 국토순례 사진과 병원학교 학생들의 작품을 소개했습니다.",
    "date": "2017-11-24",
    "publisher": "헬스경향"
  },
  {
    "url": "https://www.nspna.com/country/?mode=view&newsid=252713",
    "title": "영남대병원 소아청소년과-영남대 경영대학,  소아암 환아 사회인식 개선 전시회 열어",
    "summary": "소아암 완치자들의 국토순례 사진과 병원학교 학생들의 작품을 함께 전시하며 환아의 꿈과 일상 회복을 응원하고 사회적 편견을 줄이고자 했습니다.",
    "date": "2017-11-24",
    "publisher": "NSP통신"
  },
  {
    "url": "https://www.breaknews.com/sub_read.html?uid=538385&section=sc2",
    "title": "영남대병원, 시리아 난민 환아 돕기 페이스북 이벤트 가져",
    "summary": "영남대병원이 치료 중인 시리아 난민 환아를 돕는 응원 댓글 후원 행사를 진행했습니다. 댓글 참여를 치료비 지원으로 연결하는 방식의 나눔입니다.",
    "date": "2017-10-27",
    "publisher": "브레이크뉴스"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=777962",
    "title": "영남대병원, 국내 최단 시간 호흡기감염 바이러스 검사 결과 확인",
    "summary": "영남대병원이 신속 호흡기감염 검사 시스템을 도입했습니다. 이재민 교수팀은 빠른 검사 결과 확인과 호흡기감염 환자의 입원기간 감소에 관한 연구를 소개했습니다.",
    "date": "2017-09-05",
    "publisher": "국제뉴스"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=777043",
    "title": "영남대병원, 백혈병·소아암 환아의 아픔을 함께 나누다",
    "summary": "백혈병·소아암에 대한 사회적 인식을 개선하는 국토순례 캠페인의 해단식이 영남대병원에서 열렸습니다. 환아와 가족의 권익·복지에 대한 관심을 촉구했습니다.",
    "date": "2017-09-04",
    "publisher": "국제뉴스"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=775965",
    "title": "한국소아암부모회, 대구경북 백혈병·소아암 사회인식 전환 캠페인",
    "summary": "대구·경북에서 소아암에 대한 편견을 줄이고 환아와 완치자의 사회 참여를 응원하는 국토순례 캠페인이 진행됐습니다. 해단식에서는 이재민 교수에게 감사패를 전달했습니다.",
    "date": "2017-09-02",
    "publisher": "국제뉴스"
  },
  {
    "url": "https://www.gukjenews.com/news/articleView.html?idxno=747401",
    "title": "영남대의료원에서 대학생들이 환아 위한 봉사 펼쳐",
    "summary": "희열위고 소속 대학생들이 영남대의료원 환아들에게 일대일 학습·멘토링과 도토리교실 프로그램을 제공하며 치료 중에도 배움을 이어갈 수 있도록 지원했습니다.",
    "date": "2017-07-15",
    "publisher": "국제뉴스"
  },
  {
    "url": "https://www.dailypharm.com/user/news/114392",
    "title": "소아암재단-코웨이 '파랑새' 대구영남대병원 방문",
    "summary": "한국소아암재단과 코웨이 파랑새가 영남대병원 소아암병동을 방문해 공기청정기·청소기·손 소독제 등을 지원했습니다.",
    "date": "2016-04-06",
    "publisher": "데일리팜"
  },
  {
    "url": "https://www.mdtoday.co.kr/news/articleView.html?idxno=240707",
    "title": "영남대병원 이재민 교수, 대한조혈모세포이식학회 우수연제상",
    "summary": "이재민 교수가 소아 급성림프모구백혈병의 조혈모세포이식 전처치요법을 비교한 연구로 대한조혈모세포이식학회 우수연제상을 받았습니다.",
    "date": "2016-03-04",
    "publisher": "메디컬투데이"
  }
];

function renderNews(items) {
 const container = document.querySelector('#news-list');
 container.replaceChildren();
 const valid = items.filter(item => {
  try { return ['https:', 'http:'].includes(new URL(item.url).protocol) && item.title; }
  catch { return false; }
 }).sort((a,b) => (b.date || '').localeCompare(a.date || ''));
 if (!valid.length) {
  const message = document.createElement('p');
  message.className = 'news-empty';
  message.textContent = '등록된 뉴스가 없습니다. 새로운 소식을 준비 중입니다.';
  container.append(message);
  return;
 }
 for (const item of valid) {
  const article = document.createElement('article'); article.className = 'news-item';
  const meta = document.createElement('p'); meta.className = 'count';
  meta.textContent = [item.publisher,item.date].filter(Boolean).join(' · ');
  const title = document.createElement('h3');
  const link = document.createElement('a'); link.href = item.url;
  link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.title + ' ↗';
  title.append(link);
  article.append(meta,title);
  if (item.summary) {
   const summary = document.createElement('p'); summary.className = 'muted';
   summary.textContent = item.summary; article.append(summary);
  }
  container.append(article);
 }
}
renderNews(newsItems);

