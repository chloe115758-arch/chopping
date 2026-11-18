"use client";

import { useState } from "react";
import { ME, ME_REVIEW_COUNT, PUBLIC_PLACES } from "@/lib/mock-data";
import { perPerson, shareQtyText, slotLabel, won } from "@/lib/share";
import { useStore } from "@/lib/store";
import Button from "./Button";
import Card from "./Card";
import { SESSION_START } from "./Countdown";
import MapPicker, { type Pin } from "./MapPicker";
import PageHeader from "./PageHeader";

const label = "text-meta font-medium text-brown-soft";
const field =
  "mt-1.5 min-h-13 w-full rounded-field border border-line bg-card px-4 text-base font-medium text-brown placeholder:font-normal placeholder:text-brown-soft";
const MIN_PEOPLE = 2;
const MAX_PEOPLE = 10;

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function NewPostForm() {
  const { addPost } = useStore();
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("개");
  const [price, setPrice] = useState("");
  const [people, setPeople] = useState(4);
  const [splitByKind, setSplitByKind] = useState(false);
  const [photo, setPhoto] = useState<string>();
  const [place, setPlace] = useState(PUBLIC_PLACES[0]); // 공공장소를 기본값으로 제안
  const [showMap, setShowMap] = useState(false);
  const [pin, setPin] = useState<Pin>();
  const [today] = useState(() => ymd(new Date()));
  const [date, setDate] = useState(() => ymd(new Date(Date.now() + 86400000))); // 기본: 내일
  const [time, setTime] = useState("19:00");
  const [timeError, setTimeError] = useState(false);
  const [posted, setPosted] = useState(false);

  const share = perPerson(Number(qty), Number(price), people);
  const pickup = new Date(`${date}T${time}`);
  const pickupLabel = Number.isNaN(pickup.getTime()) ? null : slotLabel(pickup);
  const ready =
    item.trim() !== "" &&
    unit.trim() !== "" &&
    place.trim() !== "" &&
    share !== null &&
    pickupLabel !== null;
  const shareText = share && shareQtyText({ unit, splitByKind }, share.qty);

  if (posted && share)
    return (
      <main className="flex flex-col gap-4">
        <PageHeader title="나눔 올리기" />
        <Card className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <p className="text-heading font-semibold">나눔을 올렸어요.</p>
          <p className="font-semibold">{item}</p>
          <p className="text-meta text-brown-soft">
            1인당 {won(share.price)} · {shareText}
          </p>
          <p className="text-meta text-brown-soft">
            {pickupLabel} · {place}
          </p>
          <Button href="/" className="mt-4">
            피드에서 보기
          </Button>
        </Card>
      </main>
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || !pickupLabel) return;
    const inHours = (pickup.getTime() - Date.now()) / 3600000;
    if (inHours <= 0) {
      setTimeError(true);
      return;
    }
    const elapsedMin = Math.floor((Date.now() / 1000 - SESSION_START) / 60);
    addPost({
      id: `new-${Date.now()}`,
      item: item.trim(),
      photo,
      totalQty: Number(qty),
      unit: unit.trim(),
      splitByKind,
      totalPrice: Number(price),
      people,
      joined: 1, // 등록자 본인
      distanceM: 0,
      // 신청 마감은 수령 1시간 전 (최소 10분은 열어 둔다)
      closesInMin: elapsedMin + Math.max(10, Math.round(inHours * 60) - 60),
      place: place.trim(),
      pin,
      slots: [{ label: pickupLabel, inHours }],
      author: { nickname: ME, reviewCount: ME_REVIEW_COUNT },
    });
    setPosted(true);
  };

  return (
    <main>
      <PageHeader title="나눔 올리기" />
      <form onSubmit={submit} className="mt-3 flex flex-col gap-6">
        <div className="flex items-end gap-3">
          <label className={`flex-1 ${label}`}>
            품목
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="예: 코스트코 베이글 12개입"
              className={field}
            />
          </label>
          {/* 사진 추가: 고르면 버튼 자리에 미리보기가 나온다 */}
          <label className="relative flex size-13 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-field border border-line bg-card focus-within:outline-2 focus-within:outline-brown">
            <input
              type="file"
              accept="image/*"
              aria-label={photo ? "사진 바꾸기" : "사진 추가"}
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                const file = e.target.files?.[0];
                // shortcut: 브라우저 안에서만 쓰는 임시 주소. 새로고침하면 사라진다. 서버가 생기면 업로드로 바꾼다.
                if (file) setPhoto(URL.createObjectURL(file));
              }}
            />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- 방금 고른 로컬 파일 미리보기
              <img src={photo} alt="" className="size-full object-cover" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-6 fill-none stroke-current stroke-2"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="M4 17l5-4 4 3 3-2 4 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
        </div>

        <div className="flex gap-3">
          <label className={`flex-1 ${label}`}>
            총수량
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="12"
              className={field}
            />
          </label>
          <label className={`w-24 ${label}`}>
            단위
            <input value={unit} onChange={(e) => setUnit(e.target.value)} className={field} />
          </label>
        </div>

        <label className={label}>
          총가격 (원)
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="9990"
            className={field}
          />
        </label>

        <div>
          <p className={label}>나눌 인원 (나 포함)</p>
          <div className="mt-1 flex items-center gap-4">
            <button
              type="button"
              aria-label="인원 줄이기"
              disabled={people <= MIN_PEOPLE}
              onClick={() => setPeople(people - 1)}
              className="size-12 rounded-full border border-line bg-card text-2xl font-medium disabled:text-brown-soft"
            >
              −
            </button>
            <span aria-live="polite" className="w-16 text-center text-xl font-semibold">
              {people}명
            </span>
            <button
              type="button"
              aria-label="인원 늘리기"
              disabled={people >= MAX_PEOPLE}
              onClick={() => setPeople(people + 1)}
              className="size-12 rounded-full border border-line bg-card text-2xl font-medium disabled:text-brown-soft"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex min-h-12 items-center gap-3 font-medium">
          <input
            type="checkbox"
            checked={splitByKind}
            onChange={(e) => setSplitByKind(e.target.checked)}
            className="size-5 accent-brown"
          />
          여러 종류가 든 세트예요 (종류별로 분할)
        </label>

        {/* 자동 계산 결과 */}
        <div aria-live="polite" className="rounded-card bg-apricot p-4">
          <p className="text-meta font-medium">1인당</p>
          {share ? (
            <>
              <p className="text-display font-bold leading-tight">{won(share.price)}</p>
              <p className="mt-1 font-semibold">{shareText}</p>
              <p className="mt-1 text-meta">
                {won(Number(price))} ÷ {people}명
              </p>
            </>
          ) : (
            <p className="mt-1 font-semibold">
              총수량, 총가격, 인원을 입력하면 1인당 몫을 계산해 드려요.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-end gap-3">
            <label className={`flex-1 ${label}`}>
              수령 장소 (공공장소)
              <input
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                list="public-places"
                placeholder="예: 망원역 2번 출구 앞"
                className={field}
              />
            </label>
            <button
              type="button"
              aria-expanded={showMap}
              onClick={() => setShowMap(true)}
              className="min-h-13 shrink-0 rounded-field bg-brown px-4 font-semibold text-cream"
            >
              찾기
            </button>
          </div>
          <datalist id="public-places">
            {PUBLIC_PLACES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          {showMap && (
            <>
              <MapPicker onPick={setPin} />
              <p aria-live="polite" className="mt-2 text-meta text-brown-soft">
                {pin
                  ? "핀을 찍었어요. 다시 누르면 위치를 바꿀 수 있어요."
                  : "지도를 눌러 만날 곳에 핀을 찍어 주세요."}
              </p>
            </>
          )}
          <p className="mt-2 text-meta text-brown-soft">
            역 출구, 편의점 앞처럼 사람이 다니는 곳으로 적어 주세요. 집 주소는 적지 않아요.
          </p>
        </div>

        <fieldset>
          <legend className={label}>수령 시간</legend>
          <div className="flex gap-3">
            <label className={`flex-1 ${label}`}>
              <span className="sr-only">수령 </span>날짜
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTimeError(false);
                }}
                className={field}
              />
            </label>
            <label className={`flex-1 ${label}`}>
              <span className="sr-only">수령 </span>시간
              <input
                type="time"
                value={time}
                step={600}
                onChange={(e) => {
                  setTime(e.target.value);
                  setTimeError(false);
                }}
                className={field}
              />
            </label>
          </div>
          <p aria-live="polite" className="mt-2 text-meta font-medium">
            {timeError ? (
              <span className="text-coral-deep">지금보다 뒤의 시간을 골라 주세요.</span>
            ) : (
              pickupLabel && <span className="text-brown-soft">{pickupLabel}에 만나요.</span>
            )}
          </p>
        </fieldset>

        <p className="rounded-card bg-yellow/30 px-4 py-3 text-meta font-medium">
          닉네임과 후기 수만 공개돼요. 정확한 주소와 실명은 받지 않아요.
        </p>

        <Button type="submit" disabled={!ready} className="w-full">
          나눔 올리기
        </Button>
      </form>
    </main>
  );
}
