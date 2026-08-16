import {
  bangsOptions,
  commonPalette,
  hairstyleOptions,
  shootingFields as legacyShootingFields,
} from "./catalog.js";
import {
  animeCameraAngleOptions,
  animeFramingOptions,
  animeLightingOptions,
  animePoseOptions,
  eyeExpressionOptions,
  eyeShapeOptions,
  eyeShapePriorityLine,
  mouthExpressionOptions,
  specialEyeExpressionOptions,
} from "./anime-shooting.js";
import {
  firstOutfitSelection,
  lowerUnderwearOptions,
  outfitCatalogFor,
  outfitChoice,
  outfitDecorationOptions,
  outfitStructureOptions,
  outfitTypeOptions,
  outerwearOptions,
  shoeOptions,
  upperUnderwearOptions,
} from "./outfits.js";

export const fixedLines = [
  "画像を新規生成する。",
  "被写体は、架空の20代の成人日本人女性1人とする。",
];

export const contactShadowLine = "足元に画風と光源に合う自然な接地影を入れる。";
export const fixedClosingLines = [
  "縦横比は、縦長の9:16とする。",
  "文字、ロゴ、透かし、余分な人物、不要な小物は入れない。",
];

const eyeColorField = { id: "eyeColor", label: "瞳の色", section: "顔・身体", group: "eye", type: "color" };
export const faceFields = [
  { id: "eyeShape", label: "目の形", section: "顔・身体", group: "eye", options: eyeShapeOptions },
  { id: "eyeExpression", label: "目の表現", section: "顔・身体", group: "eye", options: eyeExpressionOptions },
  { id: "specialEyeExpression", label: "特殊な目の表現", section: "顔・身体", group: "eye", options: specialEyeExpressionOptions },
  eyeColorField,
  { id: "mouthExpression", label: "口の表現", section: "顔・身体", group: "mouth", options: mouthExpressionOptions },
  { id: "bust", label: "バスト", section: "顔・身体", group: "person", options: ["控えめなバスト（79cm相当）", "標準的なバスト（84cm相当）", "豊かなバスト（89cm相当）", "とても豊かなバスト（94cm相当）"] },
  { id: "hip", label: "ヒップ", section: "顔・身体", group: "person", options: ["控えめなヒップ（80cm相当）", "標準的なヒップ（85cm相当）", "豊かなヒップ（90cm相当）", "とても豊かなヒップ（95cm相当）"] },
];

export const hairFields = [
  { id: "hairColor", label: "髪色", section: "髪", group: "hair", type: "color" },
  { id: "hairstyle", label: "髪型", section: "髪", group: "hair", options: hairstyleOptions },
  { id: "bangs", label: "前髪", section: "髪", group: "hair", options: bangsOptions },
];

const cameraDirectionOptions = legacyShootingFields.find(({ id }) => id === "cameraDirection").options;
const backgroundOptions = legacyShootingFields.find(({ id }) => id === "background").options;
export const shootingFields = [
  { id: "pose", label: "ポーズ", section: "撮影設定", group: "presentation", options: animePoseOptions },
  { id: "framing", label: "構図", section: "撮影設定", group: "camera", options: animeFramingOptions },
  { id: "cameraAngle", label: "カメラアングル", section: "撮影設定", group: "camera", options: animeCameraAngleOptions },
  { id: "cameraDirection", label: "撮影方向", section: "撮影設定", group: "camera", options: cameraDirectionOptions },
  { id: "background", label: "背景", section: "撮影設定", group: "environment", options: backgroundOptions },
  { id: "lighting", label: "照明", section: "撮影設定", group: "environment", options: animeLightingOptions },
];

export const defaults = {
  eyeShape: eyeShapeOptions[0].value,
  eyeExpression: eyeExpressionOptions[0].value,
  specialEyeExpression: "",
  eyeColor: "ナチュラルブラウン",
  mouthExpression: mouthExpressionOptions[0].value,
  bust: "豊かなバスト（89cm相当）",
  hip: "標準的なヒップ（85cm相当）",
  outfitType: "",
  outfitStructure: "",
  outerwear: "none",
  outerwearColor: "ホワイト",
  topDesign: "",
  topColor: "ホワイト",
  bottomDesign: "",
  bottomColor: "チャコールグレー",
  outfitDesign: "",
  outfitColor: "ホワイト",
  upperUnderwear: "none",
  upperUnderwearColor: "ホワイト",
  lowerUnderwear: "none",
  lowerUnderwearColor: "ホワイト",
  outfitDecoration: "内容は衣装に合わせておまかせ、装飾量は控えめ",
  shoe: "pumps",
  shoeColor: "ブラック",
  hairColor: "ナチュラルブラウン",
  hairstyle: "顎丈のナチュラルボブ",
  bangs: "流し前髪",
  pose: animePoseOptions[0].value,
  framing: animeFramingOptions[0].value,
  cameraAngle: animeCameraAngleOptions[0].value,
  cameraDirection: cameraDirectionOptions[0].value,
  background: backgroundOptions[0].value,
  lighting: animeLightingOptions[0].value,
};

const garmentPalette = [["無し", "#FFFFFF"], ["おまかせ", "#D8D8D4"], ...commonPalette];
const garmentColorIds = new Set(["outerwearColor", "topColor", "bottomColor", "outfitColor", "upperUnderwearColor", "lowerUnderwearColor", "shoeColor"]);
export function paletteFor(field) { return garmentColorIds.has(field.id) ? garmentPalette : commonPalette; }

const designOptions = (concrete, { allowNone = true } = {}) => [
  ...(allowNone ? [{ value: "none", label: "無し", fullName: "" }] : []),
  { value: "auto", label: "おまかせ", fullName: "" },
  ...concrete,
];

export function outfitFields(values) {
  const result = [{ id: "outfitType", label: "衣装タイプ", section: "衣装", group: "outfit-classification", options: outfitTypeOptions }];
  if (!values.outfitType) return result;
  result.push({ id: "outfitStructure", label: "衣装構成", section: "衣装", group: "outfit-classification", options: outfitStructureOptions });
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (!catalog) return result;
  result.push({ id: "outerwear", label: "アウター", section: "衣装", group: "outerwear", options: outerwearOptions });
  if (values.outerwear !== "none") result.push({ id: "outerwearColor", label: "アウターの色", section: "衣装", group: "outerwear", type: "color" });
  if (values.outfitStructure === "separate") {
    result.push({ id: "topDesign", label: "トップスデザイン", section: "衣装", group: "top", options: designOptions(catalog.tops) });
    if (values.topDesign !== "none") result.push({ id: "topColor", label: "トップスの色", section: "衣装", group: "top", type: "color" });
    result.push({ id: "bottomDesign", label: "ボトムスデザイン", section: "衣装", group: "bottom", options: designOptions(catalog.bottoms) });
    if (values.bottomDesign !== "none") result.push({ id: "bottomColor", label: "ボトムスの色", section: "衣装", group: "bottom", type: "color" });
  } else {
    result.push(
      { id: "outfitDesign", label: "衣装デザイン", section: "衣装", group: "onepiece", options: designOptions(catalog.outfits, { allowNone: false }) },
      { id: "outfitColor", label: "衣装の色", section: "衣装", group: "onepiece", type: "color" },
    );
  }
  result.push({ id: "upperUnderwear", label: "上半身の下着", section: "衣装", group: "upper-underwear", options: upperUnderwearOptions });
  if (values.upperUnderwear !== "none") result.push({ id: "upperUnderwearColor", label: "上半身の下着の色", section: "衣装", group: "upper-underwear", type: "color" });
  result.push({ id: "lowerUnderwear", label: "下半身の下着", section: "衣装", group: "lower-underwear", options: lowerUnderwearOptions });
  if (values.lowerUnderwear !== "none") result.push({ id: "lowerUnderwearColor", label: "下半身の下着の色", section: "衣装", group: "lower-underwear", type: "color" });
  result.push(
    { id: "outfitDecoration", label: "衣装装飾", section: "衣装", options: outfitDecorationOptions },
    { id: "shoe", label: "靴", section: "衣装", group: "shoe", options: shoeOptions },
  );
  if (values.shoe !== "barefoot") result.push({ id: "shoeColor", label: "靴の色", section: "衣装", group: "shoe", type: "color" });
  return result;
}

export function visibleFields(values) { return [...faceFields, ...outfitFields(values), ...hairFields, ...shootingFields]; }

export function resetOutfitSelection(values) {
  Object.assign(values, firstOutfitSelection(values.outfitType, values.outfitStructure));
  Object.assign(values, {
    topColor: "ホワイト", bottomColor: "チャコールグレー", outfitColor: "ホワイト",
    upperUnderwear: "none", upperUnderwearColor: "ホワイト",
    lowerUnderwear: "none", lowerUnderwearColor: "ホワイト",
    outfitDecoration: defaults.outfitDecoration, outerwear: "none", outerwearColor: "ホワイト",
    shoe: "pumps", shoeColor: "ブラック",
  });
  return values;
}

function validChoice(options, value) { return Boolean(outfitChoice(options, value)); }
export function normalizeOutfitState(values) {
  if (!outfitTypeOptions.some((option) => option.value && option.value === values.outfitType)) {
    values.outfitType = ""; values.outfitStructure = "";
    Object.assign(values, firstOutfitSelection("", ""));
    return values;
  }
  if (!outfitStructureOptions.some((option) => option.value && option.value === values.outfitStructure)) {
    values.outfitStructure = "";
    Object.assign(values, firstOutfitSelection("", ""));
    return values;
  }
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (!validChoice(outerwearOptions, values.outerwear)) values.outerwear = defaults.outerwear;
  if (values.outfitStructure === "separate") {
    if (!["none", "auto"].includes(values.topDesign) && !validChoice(catalog.tops, values.topDesign)) values.topDesign = "auto";
    if (!["none", "auto"].includes(values.bottomDesign) && !validChoice(catalog.bottoms, values.bottomDesign)) values.bottomDesign = "auto";
    values.outfitDesign = "";
  } else {
    if (values.outfitDesign !== "auto" && !validChoice(catalog.outfits, values.outfitDesign)) values.outfitDesign = "auto";
    values.topDesign = ""; values.bottomDesign = "";
  }
  if (!validChoice(upperUnderwearOptions, values.upperUnderwear)) values.upperUnderwear = "none";
  if (!validChoice(lowerUnderwearOptions, values.lowerUnderwear)) values.lowerUnderwear = "none";
  if (!outfitDecorationOptions.includes(values.outfitDecoration)) values.outfitDecoration = defaults.outfitDecoration;
  if (!validChoice(shoeOptions, values.shoe)) values.shoe = defaults.shoe;
  return values;
}

function optionHasValue(options, value) {
  return options.some((option) => (typeof option === "string" ? option : option.value) === value);
}

export function normalizeState(values) {
  const normalized = normalizeOutfitState(values);
  [...faceFields, ...hairFields, ...shootingFields].forEach((field) => {
    if (field.type === "color") {
      if (!paletteFor(field).some(([name]) => name === normalized[field.id])) normalized[field.id] = defaults[field.id];
    } else if (field.options && !optionHasValue(field.options, normalized[field.id])) {
      normalized[field.id] = defaults[field.id];
    }
  });
  outfitFields(normalized).filter((field) => field.type === "color").forEach((field) => {
    if (!paletteFor(field).some(([name]) => name === normalized[field.id])) normalized[field.id] = defaults[field.id];
  });
  return normalized;
}

function typePrefix(values) { return values.outfitType === "stage" ? "ステージ衣装向け" : "私服向け"; }
function colorText(color) {
  if (!color || color === "無し") return "";
  if (color === "おまかせ") return "色をおまかせにした";
  return `${color}の`;
}
function garmentLine(subject, selection, options, color) {
  if (!selection || selection === "none") return "";
  if (selection === "auto") return `${subject}は、デザインと色をおまかせとする。`;
  const item = outfitChoice(options, selection);
  return item ? `${subject}は、${colorText(color)}${item.fullName}とする。` : "";
}
function underwearLine(region, selection, options, color, visible) {
  if (!selection || selection === "none") return "";
  const placement = visible ? `${region}の衣装として` : `${region}の衣装の下に`;
  if (selection === "auto") return `${placement}着用する下着は、種類と色をおまかせとする。`;
  const item = outfitChoice(options, selection);
  return item ? `${placement}、${colorText(color)}${item.fullName}を着用する。` : "";
}

export function generatePrompt(rawValues) {
  const values = normalizeState({ ...defaults, ...rawValues });
  const lines = [...fixedLines, values.eyeShape, eyeShapePriorityLine, values.eyeExpression];
  if (values.specialEyeExpression) {
    lines.push(values.specialEyeExpression);
    lines.push("特殊な目の表現に必要な範囲では、通常の目の形と目元の表現より特殊表現を優先する。");
  }
  lines.push(`瞳の色は、${values.eyeColor}とする。`, values.mouthExpression);
  lines.push(`バストは、${values.bust}とする。`, `ヒップは、${values.hip}とする。`);

  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (catalog) {
    const prefix = typePrefix(values);
    const outer = garmentLine(`${prefix}のアウター`, values.outerwear, outerwearOptions, values.outerwearColor);
    if (outer) lines.push(outer);
    let visibleClothing = values.outerwear !== "none";
    if (values.outfitStructure === "separate") {
      const top = garmentLine(`${prefix}のトップス`, values.topDesign, catalog.tops, values.topColor);
      const bottom = garmentLine(`${prefix}のボトムス`, values.bottomDesign, catalog.bottoms, values.bottomColor);
      if (top) lines.push(top);
      if (bottom) lines.push(bottom);
      visibleClothing ||= values.topDesign !== "none" || values.bottomDesign !== "none";
      const upper = underwearLine("上半身", values.upperUnderwear, upperUnderwearOptions, values.upperUnderwearColor, values.topDesign === "none");
      const lower = underwearLine("下半身", values.lowerUnderwear, lowerUnderwearOptions, values.lowerUnderwearColor, values.bottomDesign === "none");
      if (upper) lines.push(upper);
      if (lower) lines.push(lower);
    } else {
      const outfit = garmentLine(`${prefix}の上下一体衣装`, values.outfitDesign, catalog.outfits, values.outfitColor);
      if (outfit) lines.push(outfit);
      visibleClothing = true;
      const upper = underwearLine("上半身", values.upperUnderwear, upperUnderwearOptions, values.upperUnderwearColor, false);
      const lower = underwearLine("下半身", values.lowerUnderwear, lowerUnderwearOptions, values.lowerUnderwearColor, false);
      if (upper) lines.push(upper);
      if (lower) lines.push(lower);
    }
    if (visibleClothing) {
      if (values.outfitDecoration === "無し") lines.push("装飾は付けない。");
      else if (values.outfitDecoration.includes("控えめ")) lines.push("装飾内容は衣装に合わせて補完し、量は控えめとする。");
      else if (values.outfitDecoration.includes("華美")) lines.push("装飾内容は衣装に合わせて補完し、量は華美とする。");
    }
    const shoe = outfitChoice(shoeOptions, values.shoe);
    if (values.shoe === "barefoot") lines.push("足元は裸足とする。");
    else if (values.shoe === "auto") lines.push("靴の種類と色は、衣装に合わせておまかせとする。");
    else if (shoe) lines.push(`靴は、${colorText(values.shoeColor)}${shoe.fullName}とする。`);
  }

  lines.push(`髪色は、${values.hairColor}とする。`, `髪型は、${values.hairstyle}とする。`, `前髪は、${values.bangs}とする。`);
  shootingFields.forEach((field) => lines.push(values[field.id]));
  lines.push(fixedClosingLines[0]);
  if (values.framing === animeFramingOptions[0].value) lines.push(contactShadowLine);
  lines.push(fixedClosingLines[1]);
  return lines.filter(Boolean).join(" ").replace(/[\r\n]+/g, " ").replace(/[ \t]+/g, " ").trim();
}

export function presetMessage(action, name) {
  return ({ save: `${name}を端末に登録しました`, load: `${name}を呼び出しました`, delete: `${name}を端末から削除しました` })[action] || "";
}
