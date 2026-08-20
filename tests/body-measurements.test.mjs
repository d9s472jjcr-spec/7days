import assert from "node:assert/strict";
import test from "node:test";
import {
  BODY_LINKED_MEASUREMENT_IDS,
  BODY_MEASUREMENT_DEFAULTS,
  BODY_MEASUREMENT_LIMITS,
  BODY_MEASUREMENT_POLICY_VERSION,
  WAIST_UNDER_BUST_INFLUENCE,
  applyHeightToLinkedMeasurements,
  calculateBodyMeasurements,
  calculateCup,
  classifyBodyMeasurement,
  deriveBodyMeasurements,
  relinkBodyMeasurement,
} from "../src/body-measurements.js";

test("IDC v1.2のポリシー、入力範囲、初期値を固定する", () => {
  assert.equal(BODY_MEASUREMENT_POLICY_VERSION, "body-measurement-derivation-1.2.0");
  assert.equal(WAIST_UNDER_BUST_INFLUENCE, 0.2);
  assert.deepEqual(BODY_MEASUREMENT_LIMITS, {
    height: { min: 140, max: 175, step: 1 },
    bust: { min: 70, max: 100, step: 1 },
    waist: { min: 50, max: 65, step: 1 },
    hip: { min: 75, max: 95, step: 1 },
  });
  assert.deepEqual(BODY_MEASUREMENT_DEFAULTS, { height: 158, bust: 81, waist: 57, hip: 82 });
  assert.deepEqual(BODY_LINKED_MEASUREMENT_IDS, ["bust", "waist", "hip"]);
});

test("身長基準のB/W/HをIDC v1.2式から導出する", () => {
  assert.deepEqual(deriveBodyMeasurements(140), { height: 140, bust: 73, waist: 55, hip: 78 });
  assert.deepEqual(deriveBodyMeasurements(158), { height: 158, bust: 81, waist: 57, hip: 82 });
  assert.deepEqual(deriveBodyMeasurements(175), { height: 175, bust: 88, waist: 60, hip: 88 });
  assert.deepEqual(deriveBodyMeasurements(120), { height: 140, bust: 73, waist: 55, hip: 78 });
  assert.deepEqual(deriveBodyMeasurements(176.4), { height: 175, bust: 88, waist: 60, hip: 88 });
});

test("身長変更では連動中の項目だけを再計算する", () => {
  const values = { height: 158, bust: 100, waist: 57, hip: 82 };
  const updated = applyHeightToLinkedMeasurements(
    values,
    { bust: false, waist: true, hip: true },
    175,
  );
  assert.deepEqual(updated, { height: 175, bust: 100, waist: 60, hip: 88 });
  assert.deepEqual(values, { height: 158, bust: 100, waist: 57, hip: 82 });
});

test("個別項目を現在の身長基準へ戻して再連動する", () => {
  const result = relinkBodyMeasurement(
    { height: 175, bust: 100, waist: 50, hip: 95 },
    { bust: false, waist: false, hip: false },
    "bust",
  );
  assert.deepEqual(result, {
    values: { height: 175, bust: 88, waist: 50, hip: 95 },
    links: { bust: true, waist: false, hip: false },
  });
});

test("表示中のB/Wからアンダーバストとカップを再計算する", () => {
  const initial = calculateBodyMeasurements(158, 81, 57);
  assert.equal(initial.underBust, 65.5);
  assert.equal(initial.cup, "C");

  const corrected = calculateBodyMeasurements(158, 81, 65);
  assert.equal(corrected.underBust, 67);
  assert.ok(Math.abs(corrected.raw.underBust - 67.1) < 1e-10);
  assert.equal(corrected.cup, "B");

  const unroundedBoundary = calculateBodyMeasurements(158, 74, 50);
  assert.equal(unroundedBoundary.underBust, 64);
  assert.ok(Math.abs(unroundedBoundary.raw.cupDifference - 9.9) < 1e-10);
  assert.equal(unroundedBoundary.cup, "AA");
});

test("AAAからJ以上までのカップ境界を固定する", () => {
  const cases = [
    [7.49, "AAA"], [7.5, "AA"], [10, "A"], [12.5, "B"],
    [15, "C"], [17.5, "D"], [20, "E"], [22.5, "F"],
    [25, "G"], [27.5, "H"], [30, "I"], [32.5, "J以上"],
  ];
  for (const [difference, expected] of cases) assert.equal(calculateCup(difference), expected);
});

test("承認済みのB/W/H定型区分を全境界で判定する", () => {
  const cases = [
    ["bust", 70, "控えめ"], ["bust", 78, "控えめ"],
    ["bust", 79, "標準的"], ["bust", 82, "標準的"],
    ["bust", 83, "豊か"], ["bust", 91, "豊か"],
    ["bust", 92, "とても豊か"], ["bust", 100, "とても豊か"],
    ["waist", 50, "細め"], ["waist", 57, "細め"],
    ["waist", 58, "標準的"], ["waist", 65, "標準的"],
    ["hip", 75, "控えめ"], ["hip", 79, "控えめ"],
    ["hip", 80, "標準的"], ["hip", 85, "標準的"],
    ["hip", 86, "豊か"], ["hip", 90, "豊か"],
    ["hip", 91, "とても豊か"], ["hip", 95, "とても豊か"],
  ];
  for (const [id, value, expected] of cases) {
    assert.equal(classifyBodyMeasurement(id, value), expected, `${id} ${value}`);
  }
});
