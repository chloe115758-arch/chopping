export type Slot = { label: string; inHours: number };

export type Post = {
  id: string;
  item: string;
  photo?: string; // public/posts/ 아래 파일. 없거나 못 불러오면 색 타일
  totalQty: number;
  unit: string;
  splitByKind?: boolean; // 여러 종류가 든 세트: 수량 대신 "종류별로 분할"로 표시
  totalPrice: number;
  people: number; // 나눌 인원 (등록자 포함)
  joined: number;
  distanceM: number;
  // shortcut: 마감을 "남은 분"으로 고정해 둠(시간이 흐르지 않음). 실제 데이터가 생기면 마감 시각으로 바꾼다.
  closesInMin: number;
  place: string; // 공공장소만. 정확한 주소는 받지 않는다
  slots: Slot[];
  author: { nickname: string; reviewCount: number };
};

export const ME = "자취3년차";

const tonight: Slot = { label: "오늘 저녁 8시", inHours: 4 };
const tomorrow: Slot = { label: "내일 저녁 7시", inHours: 27 };
const saturday: Slot = { label: "토요일 오전 11시", inHours: 67 };

export const posts: Post[] = [
  {
    id: "1", item: "경북 부사 못난이 꿀사과 5kg", photo: "/posts/apple.png",
    totalQty: 5, unit: "kg", totalPrice: 39900, people: 5, joined: 3,
    distanceM: 350, closesInMin: 90, place: "망원역 2번 출구 앞",
    slots: [tonight, tomorrow], author: { nickname: "과일좋아", reviewCount: 12 },
  },
  {
    id: "2", item: "코스트코 커클랜드 베이글 12개 (6개입 2봉)", photo: "/posts/bagel.png",
    totalQty: 12, unit: "개", totalPrice: 17120, people: 4, joined: 1,
    distanceM: 520, closesInMin: 150, place: "망원시장 입구",
    slots: [tomorrow, saturday], author: { nickname: "빵순이", reviewCount: 3 },
  },
  {
    id: "3", item: "미트리 실온보관 닭가슴살 5종 30팩", photo: "/posts/chicken.png",
    totalQty: 30, unit: "팩", totalPrice: 67500, people: 5, joined: 3,
    distanceM: 800, closesInMin: 600, place: "CU 망원한강점 앞",
    slots: [tomorrow, saturday], author: { nickname: "단백질러", reviewCount: 27 },
  },
  {
    id: "4", item: "크라운 과자세트 13종", photo: "/posts/snack.png",
    totalQty: 13, unit: "종", splitByKind: true, totalPrice: 58800, people: 5, joined: 2,
    distanceM: 1200, closesInMin: 1500, place: "합정역 7번 출구 앞",
    slots: [saturday], author: { nickname: "간식창고", reviewCount: 8 },
  },
  {
    id: "5", item: "백진주 쌀 10kg", photo: "/posts/rice.png",
    totalQty: 10, unit: "kg", totalPrice: 42900, people: 5, joined: 1,
    distanceM: 1600, closesInMin: 2880, place: "마포구청역 3번 출구 앞",
    slots: [tomorrow, saturday], author: { nickname: "합정주민", reviewCount: 5 },
  },
  {
    id: "6", item: "롤앤롤 3겹 화장지 30롤 3팩", photo: "/posts/tissue.png",
    totalQty: 90, unit: "롤", totalPrice: 34800, people: 6, joined: 2,
    distanceM: 0, closesInMin: 300, place: "망원역 2번 출구 앞",
    slots: [tomorrow], author: { nickname: ME, reviewCount: 4 },
  },
];
