export const BODY_MEASUREMENT_POLICY_VERSION = "body-measurement-derivation-1.2.0";

export const WAIST_UNDER_BUST_INFLUENCE = 0.2;

export const BODY_MEASUREMENT_LIMITS = Object.freeze({
  height: Object.freeze({ min: 140, max: 175, step: 1 }),
  bust: Object.freeze({ min: 70, max: 100, step: 1 }),
  waist: Object.freeze({ min: 50, max: 65, step: 1 }),
  hip: Object.freeze({ min: 75, max: 95, step: 1 }),
});

export const BODY_MEASUREMENT_DEFAULTS = Object.freeze({
  height: 158,
  bust: 81,
  waist: 57,
  hip: 82,
});

export const BODY_LINKED_MEASUREMENT_IDS = Object.freeze(["bust", "waist", "hip"]);

export const BODY_MEASUREMENT_BANDS = Object.freeze({
  bust: Object.freeze([
    Object.freeze({ min: 70, max: 78, label: "控えめ" }),
    Object.freeze({ min: 79, max: 82, label: "標準的" }),
    Object.freeze({ min: 83, max: 91, label: "豊か" }),
    Object.freeze({ min: 92, max: 100, label: "とても豊か" }),
  ]),
  waist: Object.freeze([
    Object.freeze({ min: 50, max: 57, label: "細め" }),
    Object.freeze({ min: 58, max: 65, label: "標準的" }),
  ]),
  hip: Object.freeze([
    Object.freeze({ min: 75, max: 79, label: "控えめ" }),
    Object.freeze({ min: 80, max: 85, label: "標準的" }),
    Object.freeze({ min: 86, max: 90, label: "豊か" }),
    Object.freeze({ min: 91, max: 95, label: "とても豊か" }),
  ]),
});

export function clampMeasurement(id, value) {
  const limits = BODY_MEASUREMENT_LIMITS[id];
  if (!limits) throw new RangeError(`Unknown body measurement: ${id}`);
  const numeric = Number(value);
  const fallback = BODY_MEASUREMENT_DEFAULTS[id];
  const rounded = Number.isFinite(numeric) ? Math.round(numeric) : fallback;
  return Math.min(limits.max, Math.max(limits.min, rounded));
}

export function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

export function estimateUnderBust(height) {
  if (height <= 158) return 61.5 + (height - 140) * (4 / 18);
  if (height <= 165) return 65.5 + (height - 158) * (1.2 / 7);
  if (height <= 166) return 66.7;
  return 66.7 + (height - 166) * (2.3 / 9);
}

export function calculateCup(difference) {
  if (difference < 7.5) return "AAA";
  if (difference < 10) return "AA";
  if (difference < 12.5) return "A";
  if (difference < 15) return "B";
  if (difference < 17.5) return "C";
  if (difference < 20) return "D";
  if (difference < 22.5) return "E";
  if (difference < 25) return "F";
  if (difference < 27.5) return "G";
  if (difference < 30) return "H";
  if (difference < 32.5) return "I";
  return "J以上";
}

export function calculateBodyMeasurements(
  height,
  selectedBust = null,
  selectedWaist = null,
) {
  const clampedHeight = clampMeasurement("height", height);
  const d = clampedHeight - BODY_MEASUREMENT_DEFAULTS.height;
  const rawWeight = 48 + (3389 / 5355) * d + (23 / 5355) * d * d;
  const rawBust = 81 + (458 / 1071) * d - (1 / 1071) * d * d;
  const rawWaist = 57 + (155 / 1071) * d + (2 / 1071) * d * d;
  const rawHip = 82 + (310 / 1071) * d + (4 / 1071) * d * d;
  const heightBasedRawUnderBust = estimateUnderBust(clampedHeight);
  const waistForUnderBust = selectedWaist ?? rawWaist;
  const rawUnderBust = heightBasedRawUnderBust
    + (waistForUnderBust - rawWaist) * WAIST_UNDER_BUST_INFLUENCE;
  const cupBust = selectedBust ?? rawBust;
  const cupDifference = cupBust - rawUnderBust;

  return {
    height: clampedHeight,
    weight: roundToHalf(rawWeight),
    bust: Math.round(rawBust),
    waist: Math.round(rawWaist),
    hip: Math.round(rawHip),
    underBust: roundToHalf(rawUnderBust),
    cup: calculateCup(cupDifference),
    raw: {
      weight: rawWeight,
      bust: rawBust,
      waist: rawWaist,
      hip: rawHip,
      underBust: rawUnderBust,
      cupDifference,
    },
  };
}

export function deriveBodyMeasurements(height) {
  const calculated = calculateBodyMeasurements(height);
  return {
    height: calculated.height,
    bust: calculated.bust,
    waist: calculated.waist,
    hip: calculated.hip,
  };
}

export function applyHeightToLinkedMeasurements(values, links, nextHeight) {
  const derived = deriveBodyMeasurements(nextHeight);
  const next = {
    ...values,
    height: derived.height,
  };

  for (const id of BODY_LINKED_MEASUREMENT_IDS) {
    next[id] = links?.[id] === false
      ? clampMeasurement(id, values?.[id])
      : derived[id];
  }
  return next;
}

export function relinkBodyMeasurement(values, links, id) {
  if (!BODY_LINKED_MEASUREMENT_IDS.includes(id)) {
    throw new RangeError(`Body measurement cannot be height-linked: ${id}`);
  }
  const height = clampMeasurement("height", values?.height);
  const derived = deriveBodyMeasurements(height);
  return {
    values: { ...values, height, [id]: derived[id] },
    links: { ...links, [id]: true },
  };
}

export function classifyBodyMeasurement(id, value) {
  const bands = BODY_MEASUREMENT_BANDS[id];
  if (!bands) throw new RangeError(`Body measurement has no qualitative bands: ${id}`);
  const normalized = clampMeasurement(id, value);
  return bands.find(({ min, max }) => normalized >= min && normalized <= max).label;
}
