import assert from "node:assert/strict";
import test from "node:test";
import { hms, perPerson, slotLabel } from "./share.ts";

test("perPerson", () => {
  assert.deepEqual(perPerson(12, 9990, 4), { qty: 3, price: 2498 }); // 2497.5 올림
  assert.deepEqual(perPerson(2, 13900, 4), { qty: 0.5, price: 3475 });
  assert.equal(perPerson(12, 9990, 1), null);
  assert.equal(perPerson(12, 9990, 2.5), null);
  assert.equal(perPerson(0, 9990, 4), null);
  assert.equal(perPerson(NaN, 9990, 4), null);
});

test("hms", () => {
  assert.equal(hms(59), "00:00:59");
  assert.equal(hms(5400), "01:30:00");
  assert.equal(hms(172799), "47:59:59");
});

test("slotLabel", () => {
  assert.equal(slotLabel(new Date(2026, 10, 19, 19, 0)), "11월 19일(목) 오후 7시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 11, 30)), "11월 21일(토) 오전 11시 30분");
  assert.equal(slotLabel(new Date(2026, 10, 21, 0, 0)), "11월 21일(토) 오전 12시");
  assert.equal(slotLabel(new Date(2026, 10, 21, 12, 0)), "11월 21일(토) 오후 12시");
});
