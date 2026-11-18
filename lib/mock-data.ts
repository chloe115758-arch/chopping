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
  author: { nickname: string; shareCount: number }; // shareCount: 끝까지 마친 나눔 횟수
};

// 로그인이 없어서 "나"를 여기 한 곳에서 정한다
export const CURRENT_USER = { nickname: "자취3년차", shareCount: 4, town: "망원동" as Dong }; // town: 동네를 고르기 전 기본 동네

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
    author: CURRENT_USER,
  },
  // 아래 글은 사진이 없어 품목 첫 글자 색 타일로 보인다
  {
    id: "7", dong: "성수동", category: "과일·채소",
    item: "제주 감귤 10kg",
    totalQty: 10, unit: "kg", totalPrice: 29900, people: 5, joined: 2,
    closesInMin: 120, place: "성수역 3번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "귤러버", shareCount: 6 },
  },
  {
    id: "8", dong: "성수동", category: "달걀·유제품",
    item: "동물복지 유정란 30구 2판",
    totalQty: 60, unit: "구", totalPrice: 23800, people: 4, joined: 3,
    closesInMin: 420, place: "서울숲역 4번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "달걀한판", shareCount: 0 },
  },
  {
    id: "9", dong: "성수동", category: "정육·수산",
    item: "노르웨이 생연어 필렛 1.2kg",
    totalQty: 1.2, unit: "kg", totalPrice: 42000, people: 4, joined: 1,
    closesInMin: 200, place: "뚝섬역 1번 출구 앞",
    slots: [tomorrow], splitMethod: presplit,
    author: { nickname: "성수직장인", shareCount: 15 },
  },
  {
    id: "10", dong: "성수동", category: "생활용품",
    item: "다우니 실내건조 세탁세제 3L 4개",
    totalQty: 4, unit: "개", totalPrice: 31600, people: 4, joined: 2,
    closesInMin: 2000, place: "성수역 3번 출구 앞",
    slots: [saturday], splitMethod: together,
    author: { nickname: "살림꾼", shareCount: 9 },
  },
  {
    id: "11", dong: "연남동", category: "달걀·유제품",
    item: "서울우유 그릭요거트 450g 6개",
    totalQty: 6, unit: "개", totalPrice: 21000, people: 3, joined: 1,
    closesInMin: 75, place: "홍대입구역 3번 출구 앞",
    slots: [tonight, tomorrow], splitMethod: together,
    author: { nickname: "요거트중독", shareCount: 2 },
  },
  {
    id: "12", dong: "연남동", category: "정육·수산",
    item: "한돈 삼겹살 구이용 2kg",
    totalQty: 2, unit: "kg", totalPrice: 45800, people: 4, joined: 3,
    closesInMin: 330, place: "연남파출소 앞",
    slots: [tomorrow, saturday], splitMethod: presplit,
    author: { nickname: "고기반찬", shareCount: 21 },
  },
  {
    id: "13", dong: "연남동", category: "과일·채소",
    item: "햇양파 5kg",
    totalQty: 5, unit: "kg", totalPrice: 9900, people: 5, joined: 2,
    closesInMin: 1300, place: "경의선숲길 연남동 입구",
    slots: [tomorrow, saturday], splitMethod: together,
    author: { nickname: "연남텃밭", shareCount: 4 },
  },
  {
    id: "14", dong: "연남동", category: "생활용품",
    item: "크리넥스 키친타월 150매 12롤",
    totalQty: 12, unit: "롤", totalPrice: 19800, people: 4, joined: 1,
    closesInMin: 3000, place: "홍대입구역 3번 출구 앞",
    slots: [saturday], splitMethod: presplit,
    author: { nickname: "미니멀리", shareCount: 0 },
  },
];
