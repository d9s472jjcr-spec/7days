import {
  bangsOptions,
  commonPalette,
  hairstyleOptions,
} from "./catalog.js";
import {
  eyeExpressionOptions,
  eyeShapeOptions,
  mouthExpressionOptions,
  specialEyeExpressionOptions,
} from "./anime-shooting.js";
import {
  BODY_LINKED_MEASUREMENT_IDS,
  BODY_MEASUREMENT_DEFAULTS,
  BODY_MEASUREMENT_LIMITS,
  applyHeightToLinkedMeasurements,
  calculateBodyMeasurements,
  clampMeasurement,
  classifyBodyMeasurement,
  relinkBodyMeasurement,
} from "./body-measurements.js";
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

const eyeColorField = { id: "eyeColor", label: "瞳の色", section: "顔・身体", group: "eye", type: "color" };
export const faceFields = [
  { id: "eyeShape", label: "目の形", section: "顔・身体", group: "eye", options: eyeShapeOptions },
  { id: "eyeExpression", label: "目の表現", section: "顔・身体", group: "eye", options: eyeExpressionOptions },
  { id: "specialEyeExpression", label: "特殊な目の表現", section: "顔・身体", group: "eye", options: specialEyeExpressionOptions },
  eyeColorField,
  { id: "mouthExpression", label: "口の表現", section: "顔・身体", group: "mouth", options: mouthExpressionOptions },
];

export const hairFields = [
  { id: "hairstyle", label: "髪型", section: "髪", group: "hair", options: hairstyleOptions },
  { id: "hairColor", label: "髪色", section: "髪", group: "hair", type: "color" },
  { id: "bangs", label: "前髪", section: "髪", group: "hair", options: bangsOptions },
];

const feature = (label, prompt) => ({ value: label, label, prompt });
export const personFeatureOptions = [
  feature("元気", "明るく活発な印象を持たせる。"),
  feature("クール", "落ち着きと知性のあるクールな印象を持たせる。"),
  feature("お姉さん", "頼もしさと大人の余裕を感じる印象を持たせる。"),
  feature("母性あふれる", "包容力と温かさを感じる母性的な印象を持たせる。"),
  feature("小悪魔", "愛らしさの中に人を翻弄する小悪魔的な印象を持たせる。"),
  feature("ギャル", "華やかで親しみやすいギャルらしい印象を持たせる。"),
  feature("お嬢様", "育ちの良さと品のあるお嬢様らしい印象を持たせる。"),
  feature("キャリアウーマン", "仕事ができる自信と知性を感じる印象を持たせる。"),
  feature("スポーティ", "健康的で活動的な印象を持たせる。"),
  feature("内気", "控えめで人見知りするような印象を持たせる。"),
  feature("天然", "飾り気がなく少し抜けた親しみやすい印象を持たせる。"),
  feature("いたずら好き", "遊び心のあるいたずら好きな印象を持たせる。"),
  feature("ツンデレ", "強気さの奥に優しさを隠した印象を持たせる。"),
  feature("姉御肌", "面倒見がよく頼れる姉御肌の印象を持たせる。"),
  feature("女王様", "堂々とした威厳と支配力を感じる印象を持たせる。"),
  feature("天真爛漫", "無邪気でのびのびとした印象を持たせる。"),
  feature("おっとり", "穏やかでゆったりとした印象を持たせる。"),
  feature("勝ち気", "気が強く挑戦的な印象を持たせる。"),
  feature("生真面目", "実直で規律を重んじる印象を持たせる。"),
  feature("無気力", "力の抜けた気だるい印象を持たせる。"),
  feature("情熱的", "感情豊かで熱意に満ちた印象を持たせる。"),
  feature("自由奔放", "型にとらわれない自由な印象を持たせる。"),
  feature("好奇心旺盛", "新しいものへ強く惹かれる好奇心豊かな印象を持たせる。"),
  feature("マイペース", "周囲に流されない自分のペースを持つ印象にする。"),
  feature("社交的", "人付き合いが得意で親しみやすい印象を持たせる。"),
  feature("孤高", "他者に依存しない孤高の印象を持たせる。"),
  feature("控えめ", "自己主張を抑えた慎ましい印象を持たせる。"),
  feature("豪快", "細部にこだわらない大胆で豪快な印象を持たせる。"),
  feature("慎重", "物事を注意深く見極める慎重な印象を持たせる。"),
  feature("夢見がち", "空想に心を向ける夢見がちな印象を持たせる。"),
  feature("癒やし系", "一緒にいる人を安心させる柔らかな印象を持たせる。"),
  feature("ミステリアス", "内面を簡単には読ませない神秘的な印象を持たせる。"),
  feature("ワイルド", "野性的で力強い印象を持たせる。"),
  feature("ボーイッシュ", "軽快で少年らしさを感じる印象を持たせる。"),
  feature("中性的", "女性性と男性性のどちらにも偏らない印象を持たせる。"),
  feature("優雅", "所作に品と余裕を感じる優雅な印象を持たせる。"),
  feature("凛々しい", "芯の強さを感じる凛々しい印象を持たせる。"),
  feature("妖艶", "大人の色気と奥深さを感じる妖艶な印象を持たせる。"),
  feature("素朴", "飾らず自然体で親しみやすい印象を持たせる。"),
  feature("高貴", "気品と威厳を感じる高貴な印象を持たせる。"),
  feature("甘え上手", "相手の懐へ自然に入る愛嬌のある印象を持たせる。"),
  feature("負けず嫌い", "向上心が強く簡単には引かない印象を持たせる。"),
  feature("サバサバ", "物事を引きずらない率直でさっぱりした印象を持たせる。"),
  feature("繊細", "細かな感情の動きに敏感な繊細さを感じる印象にする。"),
  feature("大胆", "ためらわず行動する大胆な印象を持たせる。"),
  feature("無口", "必要以上に語らない静かな印象を持たせる。"),
  feature("おしゃべり", "会話を楽しむ明るく表情豊かな印象を持たせる。"),
  feature("献身的", "相手を支えることを惜しまない献身的な印象を持たせる。"),
  feature("自信家", "自分の魅力と能力を信じる自信に満ちた印象を持たせる。"),
  feature("心配性", "周囲を気遣い先回りして心配する印象を持たせる。"),
  feature("楽天家", "物事を前向きに受け止める楽天的な印象を持たせる。"),
  feature("ロマンチスト", "理想や情緒を大切にする印象を持たせる。"),
  feature("現実主義", "状況を冷静に捉える現実的な印象を持たせる。"),
  feature("論理派", "筋道を立てて考える知的な印象を持たせる。"),
  feature("直感型", "感覚を信じて素早く動く印象を持たせる。"),
  feature("完璧主義", "細部まで妥協しない緊張感のある印象を持たせる。"),
  feature("反骨精神", "権威や常識へ安易に従わない強い意志を感じる印象にする。"),
  feature("冒険家", "未知へ踏み出す行動力と大胆さを感じる印象にする。"),
  feature("芸術家肌", "独自の感性と創造性を感じる印象を持たせる。"),
  feature("リーダータイプ", "周囲を導く決断力と頼もしさを感じる印象にする。"),
];

export const personFeatureField = {
  id: "personFeature",
  label: "人物の特徴",
  section: "人物",
  group: "character",
  options: personFeatureOptions,
};

const rangeField = (id, label) => ({
  id,
  label,
  section: "顔・身体",
  group: "person",
  type: "range",
  ...BODY_MEASUREMENT_LIMITS[id],
  linked: BODY_LINKED_MEASUREMENT_IDS.includes(id),
});
export const bodyFields = [
  rangeField("height", "身長"),
  rangeField("bust", "バスト"),
  rangeField("waist", "ウエスト"),
  rangeField("hip", "ヒップ"),
];

export const defaults = {
  hairstyle: "顎丈のナチュラルボブ",
  hairColor: "ナチュラルブラウン",
  bangs: "流し前髪",
  personFeature: "クール",
  eyeShape: eyeShapeOptions[0].value,
  eyeExpression: eyeExpressionOptions[0].value,
  specialEyeExpression: "",
  eyeColor: "ナチュラルブラウン",
  mouthExpression: mouthExpressionOptions[0].value,
  ...BODY_MEASUREMENT_DEFAULTS,
  bustLinked: true,
  waistLinked: true,
  hipLinked: true,
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

export function visibleFields(values) {
  return [...hairFields, personFeatureField, ...faceFields, ...bodyFields, ...outfitFields(values)];
}

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
  [...hairFields, personFeatureField, ...faceFields].forEach((field) => {
    if (field.type === "color") {
      if (!paletteFor(field).some(([name]) => name === normalized[field.id])) normalized[field.id] = defaults[field.id];
    } else if (field.options && !optionHasValue(field.options, normalized[field.id])) {
      normalized[field.id] = defaults[field.id];
    }
  });
  normalized.height = clampMeasurement("height", normalized.height);
  BODY_LINKED_MEASUREMENT_IDS.forEach((id) => {
    normalized[id] = clampMeasurement(id, normalized[id]);
    normalized[`${id}Linked`] = normalized[`${id}Linked`] !== false;
  });
  Object.assign(normalized, applyHeightToLinkedMeasurements(normalized, measurementLinks(normalized), normalized.height));
  outfitFields(normalized).filter((field) => field.type === "color").forEach((field) => {
    if (!paletteFor(field).some(([name]) => name === normalized[field.id])) normalized[field.id] = defaults[field.id];
  });
  return normalized;
}

function measurementLinks(values) {
  return Object.fromEntries(BODY_LINKED_MEASUREMENT_IDS.map((id) => [id, values[`${id}Linked`] !== false]));
}

export function isMeasurementLinked(values, id) {
  return BODY_LINKED_MEASUREMENT_IDS.includes(id) && values[`${id}Linked`] !== false;
}

export function applyHeightChange(values, nextHeight) {
  Object.assign(values, applyHeightToLinkedMeasurements(values, measurementLinks(values), nextHeight));
  return values;
}

export function setManualMeasurement(values, id, value) {
  values[id] = clampMeasurement(id, value);
  if (BODY_LINKED_MEASUREMENT_IDS.includes(id)) values[`${id}Linked`] = false;
  return values;
}

export function relinkMeasurement(values, id) {
  const result = relinkBodyMeasurement(values, measurementLinks(values), id);
  Object.assign(values, result.values);
  values[`${id}Linked`] = true;
  return values;
}

export function measurementSummary(id, values) {
  const numeric = clampMeasurement(id, values[id]);
  if (id === "height") return `${numeric}cm`;
  const quality = classifyBodyMeasurement(id, numeric);
  if (id === "bust") {
    const { cup } = calculateBodyMeasurements(values.height, numeric, values.waist);
    return `${numeric}cm｜${quality}｜推定${cup}カップ相当`;
  }
  return `${numeric}cm｜${quality}`;
}

function colorText(color) {
  if (!color || color === "無し") return "";
  if (color === "おまかせ") return "色をおまかせにした";
  return `${color}の`;
}
function autoPhrase(color, noun, property) {
  if (color === "おまかせ") return `${property}と色をおまかせにした${noun}`;
  return `${property}をおまかせにした${colorText(color)}${noun}`;
}
function garmentPhrase(selection, options, color, noun) {
  if (!selection || selection === "none") return "";
  if (selection === "auto") return autoPhrase(color, noun, "デザイン");
  const item = outfitChoice(options, selection);
  return item ? `${colorText(color)}${item.fullName}` : "";
}
function underwearPhrase(selection, options, color, noun) {
  if (!selection || selection === "none") return "";
  if (selection === "auto") return autoPhrase(color, noun, "種類");
  const item = outfitChoice(options, selection);
  return item ? `${colorText(color)}${item.fullName}` : "";
}
function listText(items) {
  const clean = items.filter(Boolean);
  if (clean.length < 2) return clean[0] || "";
  return `${clean.slice(0, -1).join("、")}と${clean.at(-1)}`;
}

export function generatePrompt(rawValues) {
  const values = normalizeState({ ...defaults, ...rawValues });
  const feature = personFeatureOptions.find((option) => option.value === values.personFeature) || personFeatureOptions[1];
  const bustQuality = classifyBodyMeasurement("bust", values.bust);
  const waistQuality = classifyBodyMeasurement("waist", values.waist);
  const hipQuality = classifyBodyMeasurement("hip", values.hip);
  const { cup } = calculateBodyMeasurements(values.height, values.bust, values.waist);
  const lines = [
    ...fixedLines,
    `髪は${values.hairColor}の${values.hairstyle}で、前髪は${values.bangs}とする。`,
    feature.prompt,
  ];
  if (values.specialEyeExpression) lines.push(values.specialEyeExpression);
  else lines.push(values.eyeShape, values.eyeExpression);
  if (!values.specialEyeExpression) lines.push(`瞳は${values.eyeColor}とする。`);
  lines.push(
    values.mouthExpression,
    `身長${values.height}cm、バストは${bustQuality}な${cup}カップ相当（${values.bust}cm）、ウエストは${waistQuality}（${values.waist}cm）、ヒップは${hipQuality}（${values.hip}cm）とする。`,
  );

  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (catalog) {
    const garments = [];
    const outer = garmentPhrase(values.outerwear, outerwearOptions, values.outerwearColor, "アウター");
    if (outer) garments.push(outer);
    let upperCovered = false;
    let lowerCovered = false;
    if (values.outfitStructure === "separate") {
      const top = garmentPhrase(values.topDesign, catalog.tops, values.topColor, "トップス");
      const bottom = garmentPhrase(values.bottomDesign, catalog.bottoms, values.bottomColor, "ボトムス");
      if (top) garments.push(top);
      if (bottom) garments.push(bottom);
      upperCovered = values.topDesign !== "none";
      lowerCovered = values.bottomDesign !== "none";
    } else {
      const outfit = garmentPhrase(values.outfitDesign, catalog.outfits, values.outfitColor, "衣装");
      if (outfit) garments.push(outfit);
      upperCovered = true;
      lowerCovered = true;
    }
    if (garments.length) lines.push(`${listText(garments)}を着用する。`);

    const upper = underwearPhrase(values.upperUnderwear, upperUnderwearOptions, values.upperUnderwearColor, "上半身用下着");
    const lower = underwearPhrase(values.lowerUnderwear, lowerUnderwearOptions, values.lowerUnderwearColor, "下半身用下着");
    const under = [];
    const visible = [];
    if (upper) (upperCovered ? under : visible).push(upper);
    if (lower) (lowerCovered ? under : visible).push(lower);
    if (under.length) lines.push(`下着として${listText(under)}を着用する。`);
    if (visible.length) lines.push(`${listText(visible)}を着用する。`);

    if (garments.length || visible.length) {
      if (values.outfitDecoration === "無し") lines.push("装飾は付けない。");
      else if (values.outfitDecoration.includes("控えめ")) lines.push("衣装に合わせた控えめな装飾を加える。");
      else if (values.outfitDecoration.includes("華美")) lines.push("衣装に合わせた華美な装飾を加える。");
    }
    const shoe = outfitChoice(shoeOptions, values.shoe);
    if (values.shoe === "barefoot") lines.push("裸足とする。");
    else if (values.shoe === "auto") lines.push(`${autoPhrase(values.shoeColor, "靴", "種類")}を履く。`);
    else if (shoe) lines.push(`${colorText(values.shoeColor)}${shoe.fullName}を履く。`);
  }

  return lines.filter(Boolean).join(" ").replace(/[\r\n]+/g, " ").replace(/[ \t]+/g, " ").trim();
}
