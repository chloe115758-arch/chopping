import assert from "node:assert/strict";
import test from "node:test";
import { perPerson, slotLabel, timeLeft } from "./share.ts";

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

test("slotLabel", () => {
  assert.equal(slotLabel(new Date(2026, 10, 19, 19, 0)), "11월 19일(목) 오후 7시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 11, 30)), "11월 21일(토) 오전 11시 30분");
  assert.equal(slotLabel(new Date(2026, 10, 21, 0, 0)), "11월 21일(토) 오전 12시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 12, 0)), "11월 21일(토) 오후 12시");
});
