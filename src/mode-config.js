import * as catalog from "./unified-catalog.js";

export const appConfig = Object.freeze({
  catalog,
  storageKey: "7days:unified:last-values:v1",
  presetsKey: "7days:unified:presets:v1",
  schemaKey: "7days:unified:schema-version",
  schemaVersion: "1",
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

function parseObject(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function mapLegacyExpression(value, target) {
  const text = String(value || "");
  const eye = catalog.faceFields.find(({ id }) => id === "eyeExpression").options;
  const mouth = catalog.faceFields.find(({ id }) => id === "mouthExpression").options;
  if (text.includes("喜び")) { target.eyeExpression = eye[1].value; target.mouthExpression = mouth[4].value; }
  else if (text.includes("怒り")) { target.eyeExpression = eye[4].value; target.mouthExpression = mouth[13].value; }
  else if (text.includes("悲しみ")) { target.eyeExpression = eye[5].value; target.mouthExpression = mouth[14].value; }
  else if (text.includes("真剣")) { target.eyeExpression = eye[2].value; target.mouthExpression = mouth[0].value; }
}

function mapLegacyShooting(values, target) {
  const fields = Object.fromEntries(catalog.shootingFields.map((field) => [field.id, field]));
  const pick = (id, index) => fields[id].options[index]?.value || catalog.defaults[id];
  const valid = (id, value) => fields[id].options.some((option) => option.value === value);

  if (!valid("pose", target.pose)) target.pose = catalog.defaults.pose;
  if (!valid("framing", target.framing)) {
    const text = String(values.framing || "");
    target.framing = text.includes("太もも") ? pick("framing", 2)
      : text.includes("腰上") ? pick("framing", 3)
        : text.includes("バストアップ") ? pick("framing", 4)
          : pick("framing", 0);
  }
  if (!valid("cameraAngle", target.cameraAngle)) {
    const text = String(values.cameraAngle || "");
    target.cameraAngle = text.includes("高い") ? pick("cameraAngle", 1)
      : text.includes("低い") ? pick("cameraAngle", 4)
        : pick("cameraAngle", 0);
  }
  ["cameraDirection", "background"].forEach((id) => {
    if (!valid(id, target[id])) target[id] = catalog.defaults[id];
  });
  if (!valid("lighting", target.lighting)) target.lighting = catalog.defaults.lighting;
}

export function migrateLegacyPhotoValues(values = {}) {
  const migrated = { ...catalog.defaults };
  Object.keys(migrated).forEach((key) => {
    if (Object.hasOwn(values, key)) migrated[key] = values[key];
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
  mapLegacyShooting(values, migrated);
  return catalog.normalizeState(migrated);
}

export function prepareUnifiedStorage(storage) {
  if (storage.getItem(appConfig.schemaKey) === appConfig.schemaVersion) return false;
  if (!storage.getItem(appConfig.storageKey)) {
    const legacy = parseObject(storage.getItem(legacyPhotoKeys.storageKey));
    if (legacy) storage.setItem(appConfig.storageKey, JSON.stringify(migrateLegacyPhotoValues(legacy)));
  }
  if (!storage.getItem(appConfig.presetsKey)) {
    const legacyPresets = parseObject(storage.getItem(legacyPhotoKeys.presetsKey));
    if (legacyPresets) {
      const migrated = Object.fromEntries(Object.entries(legacyPresets).map(([name, values]) => [name, migrateLegacyPhotoValues(values)]));
      storage.setItem(appConfig.presetsKey, JSON.stringify(migrated));
    }
  }
  storage.setItem(appConfig.schemaKey, appConfig.schemaVersion);
  return true;
}
