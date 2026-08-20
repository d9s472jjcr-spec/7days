import * as catalog from "./unified-catalog.js";

export const appConfig = Object.freeze({
  catalog,
  storageKey: "7days:unified:last-values:v2",
  schemaKey: "7days:unified:schema-version",
  schemaVersion: "2",
});

export const legacyUnifiedKeys = Object.freeze({
  storageKey: "7days:unified:last-values:v1",
  presetsKey: "7days:unified:presets:v1",
  schemaKey: "7days:unified:schema-version",
});

export const legacyPhotoKeys = Object.freeze({
  storageKey: "7days:last-values:v8",
  presetsKey: "7days:presets:v8",
  schemaKey: "7days:schema-version",
});

const upperUnderwearMigration = Object.freeze({
  casual_top_07: "three_quarter_bra", casual_top_08: "full_cup_bra",
  casual_top_09: "three_quarter_bra", casual_top_10: "three_quarter_bra",
  casual_top_11: "strapless_bra", casual_top_12: "bralette",
  casual_top_13: "sports_bra", casual_top_27: "camisole",
  casual_top_30: "longline_bra", casual_top_31: "three_quarter_bra",
});
const lowerUnderwearMigration = Object.freeze({
  casual_bottom_19: "normal_panties", casual_bottom_20: "high_waist_panties",
  casual_bottom_21: "hip_hanger_panties", casual_bottom_22: "boy_length_panties",
  casual_bottom_44: "high_leg_panties", casual_bottom_45: "t_back_panties",
  casual_bottom_46: "lace_panties",
});

const legacyMeasurementAnchors = Object.freeze({
  bust: Object.freeze({ restrained: 79, standard: 84, rich: 89, veryRich: 94 }),
  hip: Object.freeze({ restrained: 80, standard: 85, rich: 90, veryRich: 95 }),
});

function parseObject(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function mapLegacyExpression(value, target) {
  const text = String(value || "");
  const eye = catalog.faceFields.find(({ id }) => id === "eyeExpression")?.options || [];
  const mouth = catalog.faceFields.find(({ id }) => id === "mouthExpression")?.options || [];
  if (text.includes("喜び")) { target.eyeExpression = eye[1]?.value; target.mouthExpression = mouth[4]?.value; }
  else if (text.includes("怒り")) { target.eyeExpression = eye[4]?.value; target.mouthExpression = mouth[13]?.value; }
  else if (text.includes("悲しみ")) { target.eyeExpression = eye[5]?.value; target.mouthExpression = mouth[14]?.value; }
  else if (text.includes("真剣")) { target.eyeExpression = eye[2]?.value; target.mouthExpression = mouth[0]?.value; }
}

function migrateLegacyMeasurement(id, value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return Math.round(numeric);
  const text = String(value || "");
  const centimeter = text.match(/(\d{2,3}(?:\.\d+)?)\s*cm/i);
  if (centimeter) return Math.round(Number(centimeter[1]));
  const anchors = legacyMeasurementAnchors[id];
  if (text.includes("とても豊")) return anchors.veryRich;
  if (text.includes("豊")) return anchors.rich;
  if (text.includes("標準")) return anchors.standard;
  if (text.includes("控え")) return anchors.restrained;
  return catalog.defaults[id];
}

function migrateSharedValues(values = {}) {
  const migrated = { ...catalog.defaults };
  const newBodyKeys = new Set([
    "height", "bust", "waist", "hip", "bustLinked", "waistLinked", "hipLinked", "personFeature",
  ]);
  Object.keys(migrated).forEach((key) => {
    if (!newBodyKeys.has(key) && Object.hasOwn(values, key)) migrated[key] = values[key];
  });

  mapLegacyExpression(values.expression, migrated);
  if (upperUnderwearMigration[values.topDesign]) {
    migrated.upperUnderwear = upperUnderwearMigration[values.topDesign];
    migrated.upperUnderwearColor = values.topColor || "ホワイト";
    migrated.topDesign = "none";
  }
  if (lowerUnderwearMigration[values.bottomDesign]) {
    migrated.lowerUnderwear = lowerUnderwearMigration[values.bottomDesign];
    migrated.lowerUnderwearColor = values.bottomColor || "ホワイト";
    migrated.bottomDesign = "none";
  }

  const hasBust = Object.hasOwn(values, "bust") && values.bust !== "" && values.bust != null;
  const hasHip = Object.hasOwn(values, "hip") && values.hip !== "" && values.hip != null;
  migrated.height = catalog.defaults.height;
  migrated.waist = catalog.defaults.waist;
  migrated.personFeature = catalog.defaults.personFeature;
  migrated.bust = hasBust ? migrateLegacyMeasurement("bust", values.bust) : catalog.defaults.bust;
  migrated.hip = hasHip ? migrateLegacyMeasurement("hip", values.hip) : catalog.defaults.hip;
  migrated.bustLinked = !hasBust;
  migrated.waistLinked = true;
  migrated.hipLinked = !hasHip;

  return catalog.normalizeState(migrated);
}

export function migrateUnifiedV1Values(values = {}) {
  return migrateSharedValues(values);
}

export function migrateLegacyPhotoValues(values = {}) {
  return migrateSharedValues(values);
}

export function prepareUnifiedStorage(storage) {
  const schemaIsCurrent = storage.getItem(appConfig.schemaKey) === appConfig.schemaVersion;
  if (schemaIsCurrent && storage.getItem(appConfig.storageKey)) return false;

  let changed = false;
  if (!storage.getItem(appConfig.storageKey)) {
    const unifiedV1 = parseObject(storage.getItem(legacyUnifiedKeys.storageKey));
    const photoV8 = unifiedV1 ? null : parseObject(storage.getItem(legacyPhotoKeys.storageKey));
    if (unifiedV1) {
      storage.setItem(appConfig.storageKey, JSON.stringify(migrateUnifiedV1Values(unifiedV1)));
      changed = true;
    } else if (photoV8) {
      storage.setItem(appConfig.storageKey, JSON.stringify(migrateLegacyPhotoValues(photoV8)));
      changed = true;
    }
  }

  if (!schemaIsCurrent) {
    storage.setItem(appConfig.schemaKey, appConfig.schemaVersion);
    changed = true;
  }
  return changed;
}
