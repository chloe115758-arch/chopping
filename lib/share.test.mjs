import assert from "node:assert/strict";
import test from "node:test";
import {
  filterPosts,
  isValidNickname,
  perPerson,
  shareHistoryText,
  slotLabel,
  timeLeft,
  topicParticle,
} from "./share.ts";

test("perPerson", () => {
  assert.deepEqual(perPerson(12, 9990, 4), { qty: 3, price: 2498 }); // 2497.5 올림
  assert.deepEqual(perPerson(2, 13900, 4), { qty: 0.5, price: 3475 });
  assert.equal(perPerson(12, 9990, 1), null);
  assert.equal(perPerson(12, 9990, 2.5), null);
  assert.equal(perPerson(0, 9990, 4), null);
  assert.equal(perPerson(NaN, 9990, 4), null);
});

test("timeLeft", () => {
  assert.equal(timeLeft(0), "마감");
  assert.equal(timeLeft(30), "1분 남음");
  assert.equal(timeLeft(45 * 60 + 59), "45분 남음");
  assert.equal(timeLeft(3600), "1시간 남음");
  assert.equal(timeLeft(3 * 3600 + 20 * 60), "3시간 20분 남음");
  assert.equal(timeLeft(86399), "23시간 59분 남음");
  assert.equal(timeLeft(86400), "1일 남음");
  assert.equal(timeLeft(2 * 86400 + 5000), "2일 남음");
});

test("shareHistoryText", () => {
  assert.equal(shareHistoryText(12), "나눔 12번 완료");
  assert.equal(shareHistoryText(0), "첫 나눔");
});

test("filterPosts", () => {
  const posts = [
    { id: 1, item: "꿀사과 5kg", dong: "망원동", category: "과일·채소", closesInMin: 600 },
    { id: 2, item: "베이글", dong: "망원동", category: "빵·간식", closesInMin: 90 },
    { id: 3, item: "사과즙", dong: "성수동", category: "과일·채소", closesInMin: 30 },
    { id: 4, item: "Apple 사과", dong: "망원동", category: "과일·채소", closesInMin: 100 },
  ];
  const ids = (f) => filterPosts(posts, f).map((p) => p.id);
  assert.deepEqual(ids({ dong: "망원동" }), [2, 4, 1]); // 마감 빠른 순
  assert.deepEqual(ids({ dong: "망원동", q: " 사과 " }), [4, 1]);
  assert.deepEqual(ids({ dong: "망원동", q: "apple" }), [4]);
  assert.deepEqual(ids({ dong: "망원동", category: "과일·채소", urgent: true }), [4]);
  assert.deepEqual(ids({ dong: "망원동", q: "수박" }), []);
  assert.deepEqual(ids({ dong: "연남동" }), []);
});

test("topicParticle", () => {
  assert.equal(topicParticle("수박"), "은");
  assert.equal(topicParticle("사과"), "는");
  assert.equal(topicParticle("apple"), "은(는)");
  assert.equal(topicParticle(""), "은(는)");
});

test("isValidNickname", () => {
  assert.equal(isValidNickname("알뜰한이웃"), true);
  assert.equal(isValidNickname("자취3년차"), true);
  assert.equal(isValidNickname("a"), false);
  assert.equal(isValidNickname("열한글자가넘는닉네임이에요"), false);
  assert.equal(isValidNickname("띄어 쓰기"), false);
  assert.equal(isValidNickname(""), false);
});

test("slotLabel", () => {
  assert.equal(slotLabel(new Date(2026, 10, 19, 19, 0)), "11월 19일(목) 오후 7시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 11, 30)), "11월 21일(토) 오전 11시 30분");
  assert.equal(slotLabel(new Date(2026, 10, 21, 0, 0)), "11월 21일(토) 오전 12시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 12, 0)), "11월 21일(토) 오후 12시");
});
