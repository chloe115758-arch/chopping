export type Slot = { label: string; inHours: number };

export const DONGS = ["망원동", "성수동", "연남동"] as const;
export type Dong = (typeof DONGS)[number];

// 피드 칩의 "전체"는 필터가 없다는 뜻이라 여기에 넣지 않는다
export const CATEGORIES = [
  "과일·채소",
  "달걀·유제품",
  "정육·수산",
  "빵·간식",
  "쌀·곡물",
  "음료·생수",
  "냉동·간편식",
  "생활용품",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Post = {
  id: string;
  item: string;
  dong: Dong;
  category: Category;
  photo?: string; // public/posts/ 아래 파일. 없거나 못 불러오면 색 타일
  totalQty: number;
  unit: string;
  splitByKind?: boolean; // 여러 종류가 든 세트: 수량 대신 "종류별로 분할"로 표시
  totalPrice: number;
  people: number; // 나눌 인원 (등록자 포함)
  joined: number;
  // shortcut: 마감을 "남은 분"으로 고정해 둠(시간이 흐르지 않음). 실제 데이터가 생기면 마감 시각으로 바꾼다.
  closesInMin: number;
  place: string; // 공공장소만. 정확한 주소는 받지 않는다
  pin?: { lat: number; lng: number }; // 등록자가 지도에 찍은 수령 위치
  slots: Slot[];
  splitMethod: string; // 나누는 방법. SPLIT_METHODS 중 하나
  mine?: boolean; // 내가 올린 글. 닉네임은 바뀔 수 있어서 닉네임 비교 대신 이 표시로 구분한다
  author: { nickname: string; shareCount: number }; // shareCount: 끝까지 마친 나눔 횟수
};

// 로그인이 없어서 "나"를 여기 한 곳에서 정한다
// nickname·town은 사용자가 정하기 전의 기본값이다 (닉네임은 시작 화면, 동네는 피드에서 바꾼다)
export const CURRENT_USER = { nickname: "자취3년차", shareCount: 4, town: "망원동" as Dong };

// 시작 화면에서 권하는 닉네임
export const SUGGESTED_NICKNAMES = [
  "알뜰한이웃",
  "소분의달인",
  "반띵장인",
  "나눔새싹",
  "장보기메이트",
  "냉장고지킴이",
  "쪼개기고수",
  "동네알뜰이",
  "한입만이웃",
];

const tonight: Slot = { label: "오늘 저녁 8시", inHours: 4 };
const tomorrow: Slot = { label: "내일 저녁 7시", inHours: 27 };
const saturday: Slot = { label: "토요일 오전 11시", inHours: 67 };

export const SPLIT_METHODS = ["올린 사람이 미리 소분해서 가져와요", "수령할 때 함께 나눠요"];
const [presplit, together] = SPLIT_METHODS;

// 등록 화면에서 제안하는 수령 장소. 공공장소만 둔다
export const PUBLIC_PLACES: Record<Dong, string[]> = {
  망원동: ["망원역 2번 출구 앞", "망원시장 입구", "합정역 7번 출구 앞"],
  성수동: ["성수역 3번 출구 앞", "서울숲역 4번 출구 앞", "뚝섬역 1번 출구 앞"],
  연남동: ["홍대입구역 3번 출구 앞", "경의선숲길 연남동 입구", "연남파출소 앞"],
};

export const posts: Post[] = [
  {
    id: "1", dong: "망원동", category: "과일·채소",
    item: "경북 부사 못난이 꿀사과 5kg", photo: "/posts/apple.png",
    totalQty: 5, unit: "kg", totalPrice: 39900, people: 5, joined: 3,
    closesInMin: 90, place: "망원역 2번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "과일좋아", shareCount: 12 },
  },
  {
    id: "2", dong: "망원동", category: "빵·간식",
    item: "코스트코 커클랜드 베이글 12개 (6개입 2봉)", photo: "/posts/bagel.png",
    totalQty: 12, unit: "개", totalPrice: 17120, people: 4, joined: 1,
    closesInMin: 150, place: "망원시장 입구",
    slots: [tomorrow, saturday], splitMethod: presplit,
    author: { nickname: "빵순이", shareCount: 3 },
  },
  {
    id: "3", dong: "망원동", category: "정육·수산",
    item: "미트리 실온보관 닭가슴살 5종 30팩", photo: "/posts/chicken.png",
    totalQty: 30, unit: "팩", totalPrice: 67500, people: 5, joined: 3,
    closesInMin: 600, place: "CU 망원한강점 앞",
    slots: [tomorrow, saturday], splitMethod: presplit,
    author: { nickname: "단백질러", shareCount: 27 },
  },
  {
    id: "4", dong: "망원동", category: "빵·간식",
    item: "크라운 과자세트 13종", photo: "/posts/snack.png",
    totalQty: 13, unit: "종", splitByKind: true, totalPrice: 58800, people: 5, joined: 2,
    closesInMin: 1500, place: "합정역 7번 출구 앞",
    slots: [saturday], splitMethod: together,
    author: { nickname: "간식창고", shareCount: 8 },
  },
  {
    id: "5", dong: "망원동", category: "쌀·곡물",
    item: "백진주 쌀 10kg", photo: "/posts/rice.png",
    totalQty: 10, unit: "kg", totalPrice: 42900, people: 5, joined: 1,
    closesInMin: 2880, place: "마포구청역 3번 출구 앞",
    slots: [tomorrow, saturday], splitMethod: together,
    author: { nickname: "합정주민", shareCount: 5 },
  },
  {
    id: "6", dong: "망원동", category: "생활용품",
    item: "롤앤롤 3겹 화장지 30롤 3팩", photo: "/posts/tissue.png",
    totalQty: 90, unit: "롤", totalPrice: 34800, people: 6, joined: 2,
    closesInMin: 300, place: "망원역 2번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    mine: true, author: CURRENT_USER,
  },
  // 아래 글의 사진은 위키미디어 공용의 자유 라이선스 사진이다. 출처는 public/posts/CREDITS.md
  {
    id: "7", dong: "성수동", category: "과일·채소",
    item: "제주 감귤 10kg", photo: "/posts/tangerine.jpg",
    totalQty: 10, unit: "kg", totalPrice: 29900, people: 5, joined: 2,
    closesInMin: 120, place: "성수역 3번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "귤러버", shareCount: 6 },
  },
  {
    id: "8", dong: "성수동", category: "달걀·유제품",
    item: "동물복지 유정란 30구 2판", photo: "/posts/eggs.jpg",
    totalQty: 60, unit: "구", totalPrice: 23800, people: 4, joined: 3,
    closesInMin: 420, place: "서울숲역 4번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "달걀한판", shareCount: 0 },
  },
  {
    id: "9", dong: "성수동", category: "정육·수산",
    item: "노르웨이 생연어 필렛 1.2kg", photo: "/posts/salmon.jpg",
    totalQty: 1.2, unit: "kg", totalPrice: 42000, people: 4, joined: 1,
    closesInMin: 200, place: "뚝섬역 1번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "성수직장인", shareCount: 15 },
  },
  {
    id: "10", dong: "성수동", category: "생활용품",
    item: "다우니 실내건조 세탁세제 3L 4개", photo: "/posts/detergent.jpg",
    totalQty: 4, unit: "개", totalPrice: 31600, people: 4, joined: 2,
    closesInMin: 2000, place: "성수역 3번 출구 앞",
    slots: [saturday], splitMethod: together,
    author: { nickname: "살림꾼", shareCount: 9 },
  },
  {
    id: "11", dong: "연남동", category: "달걀·유제품",
    item: "서울우유 그릭요거트 450g 6개", photo: "/posts/yogurt.jpg",
    totalQty: 6, unit: "개", totalPrice: 21000, people: 3, joined: 1,
    closesInMin: 75, place: "홍대입구역 3번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "요거트중독", shareCount: 2 },
  },
  {
    id: "12", dong: "연남동", category: "정육·수산",
    item: "한돈 삼겹살 구이용 2kg", photo: "/posts/porkbelly.jpg",
    totalQty: 2, unit: "kg", totalPrice: 45800, people: 4, joined: 4, // 내 자리 포함, 모집 완료
    closesInMin: 330, place: "연남파출소 앞",
    slots: [tomorrow, saturday], splitMethod: presplit,
    author: { nickname: "고기반찬", shareCount: 21 },
  },
  {
    id: "13", dong: "연남동", category: "과일·채소",
    item: "햇양파 5kg", photo: "/posts/onion.jpg",
    totalQty: 5, unit: "kg", totalPrice: 9900, people: 5, joined: 2,
    closesInMin: 1300, place: "경의선숲길 연남동 입구",
    slots: [tomorrow, saturday], splitMethod: together,
    author: { nickname: "연남텃밭", shareCount: 4 },
  },
  {
    id: "14", dong: "연남동", category: "생활용품",
    item: "크리넥스 키친타월 150매 12롤", photo: "/posts/papertowel.jpg",
    totalQty: 12, unit: "롤", totalPrice: 19800, people: 4, joined: 1,
    closesInMin: 3000, place: "홍대입구역 3번 출구 앞",
    slots: [saturday], splitMethod: presplit,
    author: { nickname: "미니멀리", shareCount: 0 },
  },
  {
    id: "15", dong: "망원동", category: "과일·채소",
    item: "성주 참외 3kg", photo: "/posts/chamoe.jpg",
    totalQty: 3, unit: "kg", totalPrice: 24900, people: 3, joined: 1,
    closesInMin: 240, place: "망원시장 입구",
    slots: [tomorrow], splitMethod: together,
    author: { nickname: "참외농장", shareCount: 7 },
  },
  {
    id: "16", dong: "망원동", category: "달걀·유제품",
    item: "유기농 우유 900ml 6팩", photo: "/posts/milk.jpg",
    totalQty: 6, unit: "팩", totalPrice: 19800, people: 3, joined: 2,
    closesInMin: 480, place: "망원역 2번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "우유한잔", shareCount: 1 },
  },
  {
    id: "17", dong: "연남동", category: "달걀·유제품",
    item: "슬라이스 치즈 100매", photo: "/posts/cheese.jpg",
    totalQty: 100, unit: "매", totalPrice: 18900, people: 5, joined: 2,
    closesInMin: 1700, place: "경의선숲길 연남동 입구",
    slots: [saturday], splitMethod: together,
    author: { nickname: "치즈덕후", shareCount: 11 },
  },
  {
    id: "18", dong: "성수동", category: "정육·수산",
    item: "완도 활전복 12미 (1kg)", photo: "/posts/abalone.jpg",
    totalQty: 12, unit: "미", totalPrice: 39000, people: 4, joined: 2,
    closesInMin: 160, place: "서울숲역 4번 출구 앞",
    slots: [tonight], splitMethod: presplit,
    author: { nickname: "바다사람", shareCount: 5 },
  },
  {
    id: "19", dong: "성수동", category: "빵·간식",
    item: "크루아상 생지 20개", photo: "/posts/croissant.jpg",
    totalQty: 20, unit: "개", totalPrice: 16900, people: 4, joined: 1,
    closesInMin: 900, place: "뚝섬역 1번 출구 앞",
    slots: [tomorrow, saturday], splitMethod: presplit,
    author: { nickname: "홈베이커", shareCount: 0 },
  },
  {
    id: "20", dong: "연남동", category: "빵·간식",
    item: "견과류 하루한줌 100봉", photo: "/posts/nuts.jpg",
    totalQty: 100, unit: "봉", totalPrice: 32900, people: 5, joined: 3,
    closesInMin: 2400, place: "홍대입구역 3번 출구 앞",
    slots: [saturday], splitMethod: presplit,
    author: { nickname: "넛츠", shareCount: 14 },
  },
  {
    id: "21", dong: "성수동", category: "쌀·곡물",
    item: "찰현미 4kg", photo: "/posts/brownrice.jpg",
    totalQty: 4, unit: "kg", totalPrice: 15900, people: 4, joined: 1,
    closesInMin: 1100, place: "성수역 3번 출구 앞",
    slots: [tomorrow], splitMethod: together,
    author: { nickname: "현미밥", shareCount: 3 },
  },
  {
    id: "22", dong: "연남동", category: "쌀·곡물",
    item: "오트밀 2.5kg", photo: "/posts/oatmeal.jpg",
    totalQty: 2.5, unit: "kg", totalPrice: 13900, people: 5, joined: 2,
    closesInMin: 520, place: "연남파출소 앞",
    slots: [tomorrow], splitMethod: together,
    author: { nickname: "아침오트", shareCount: 6 },
  },
  {
    id: "23", dong: "성수동", category: "쌀·곡물",
    item: "잡곡 10종 혼합 5kg", photo: "/posts/grains.jpg",
    totalQty: 5, unit: "kg", totalPrice: 22800, people: 5, joined: 4,
    closesInMin: 140, place: "뚝섬역 1번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "잡곡밥", shareCount: 18 },
  },
  {
    id: "24", dong: "연남동", category: "생활용품",
    item: "지퍼백 중형 300매", photo: "/posts/zipperbag.jpg",
    totalQty: 300, unit: "매", totalPrice: 12900, people: 5, joined: 1,
    closesInMin: 2600, place: "경의선숲길 연남동 입구",
    slots: [saturday], splitMethod: presplit,
    author: { nickname: "정리왕", shareCount: 2 },
  },
  {
    id: "25", dong: "망원동", category: "음료·생수",
    item: "생수 2L 24병", photo: "/posts/water.jpg",
    totalQty: 24, unit: "병", totalPrice: 13900, people: 4, joined: 2,
    closesInMin: 700, place: "망원역 2번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "물많이", shareCount: 9 },
  },
  {
    id: "26", dong: "성수동", category: "음료·생수",
    item: "탄산수 500ml 40병", photo: "/posts/sparkling.jpg",
    totalQty: 40, unit: "병", totalPrice: 17900, people: 4, joined: 1,
    closesInMin: 100, place: "성수역 3번 출구 앞",
    slots: [tonight], splitMethod: presplit,
    author: { nickname: "탄산러버", shareCount: 4 },
  },
  {
    id: "27", dong: "연남동", category: "음료·생수",
    item: "콜드브루 원액 1L 4병", photo: "/posts/coldbrew.jpg",
    totalQty: 4, unit: "병", totalPrice: 27600, people: 4, joined: 3,
    closesInMin: 380, place: "홍대입구역 3번 출구 앞",
    slots: [tomorrow], splitMethod: together,
    author: { nickname: "카페인", shareCount: 22 },
  },
  {
    id: "28", dong: "망원동", category: "음료·생수",
    item: "오렌지 주스 1.5L 6병", photo: "/posts/orangejuice.jpg",
    totalQty: 6, unit: "병", totalPrice: 16800, people: 3, joined: 1,
    closesInMin: 1900, place: "합정역 7번 출구 앞",
    slots: [saturday], splitMethod: together,
    author: { nickname: "주스한잔", shareCount: 0 },
  },
  {
    id: "29", dong: "망원동", category: "냉동·간편식",
    item: "냉동 왕교자 1.5kg 3봉", photo: "/posts/mandu.jpg",
    totalQty: 3, unit: "봉", totalPrice: 23700, people: 3, joined: 1,
    closesInMin: 170, place: "망원시장 입구",
    slots: [tonight, tomorrow], splitMethod: presplit,
    author: { nickname: "만두왕", shareCount: 8 },
  },
  {
    id: "30", dong: "성수동", category: "냉동·간편식",
    item: "닭가슴살 볶음밥 250g 20팩", photo: "/posts/friedrice.jpg",
    totalQty: 20, unit: "팩", totalPrice: 29800, people: 5, joined: 2,
    closesInMin: 620, place: "서울숲역 4번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "자취고수", shareCount: 13 },
  },
  {
    id: "31", dong: "연남동", category: "냉동·간편식",
    item: "냉동 블루베리 2kg", photo: "/posts/blueberry.jpg",
    totalQty: 2, unit: "kg", totalPrice: 17800, people: 4, joined: 2,
    closesInMin: 1500, place: "연남파출소 앞",
    slots: [saturday], splitMethod: together,
    author: { nickname: "스무디", shareCount: 5 },
  },
  {
    id: "32", dong: "성수동", category: "냉동·간편식",
    item: "즉석 미역국 블록 30개", photo: "/posts/miyeokguk.jpg",
    totalQty: 30, unit: "개", totalPrice: 21900, people: 5, joined: 1,
    closesInMin: 3100, place: "성수역 3번 출구 앞",
    slots: [saturday], splitMethod: presplit,
    author: { nickname: "국물파", shareCount: 1 },
  },
];
