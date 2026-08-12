import {
  firstOutfitSelection,
  outfitCatalogFor,
  outfitChoice,
  outfitDecorationOptions,
  outfitLabel,
  outfitStructureOptions,
  outfitTypeOptions,
} from "./outfits.js";

export const fixedLines = [
  "ユーザー指示",
  "画像の新規生成",
  "フォトリアル",
  "架空の20代の成人日本人女性",
];

export const personFields = [
  { id: "beauty", label: "容姿", section: "人物", options: ["可愛い系美人", "清楚系美人", "クール系美人", "知的系美人", "柔和系美人", "薄幸系美人", "妖艶系美人", "中性的美人"] },
  { id: "body", label: "体型", section: "人物", options: ["細身で脚の長いモデル体型", "健康的な女性らしさのある標準体型", "メリハリのある曲線美を持つグラマラス体型", "健康的ながら引き締まったスポーティ体型"] },
  { id: "bust", label: "バスト", section: "人物", options: ["控えめなバスト（79cm相当）", "標準的なバスト（84cm相当）", "豊かなバスト（89cm相当）", "とても豊かなバスト（94cm相当）"] },
  { id: "hip", label: "ヒップ", section: "人物", options: ["控えめなヒップ（80cm相当）", "標準的なヒップ（85cm相当）", "豊かなヒップ（90cm相当）", "とても豊かなヒップ（95cm相当）"] },
];

export const hairFields = [
  { id: "hairColor", label: "髪色", section: "髪・瞳", type: "color", palette: "hair", prefix: "髪色は" },
  { id: "hairstyle", label: "髪型", section: "髪・瞳", prefix: "髪型は", options: ["流し前髪のボブ", "前髪ありのショートボブ", "センターパートのボブ", "流し前髪のミディアムヘア", "前髪ありのストレートロング", "センターパートのストレートロング", "低い位置のポニーテール", "ゆるいウェーブのロングヘア"] },
  { id: "eyeColor", label: "瞳の色", section: "髪・瞳", type: "color", palette: "eyes", prefix: "瞳の色は" },
];

export const shootingFields = [
  { id: "expression", label: "表情（任意）", section: "撮影設定", optional: true, prefix: "表情は", options: ["", "自然な微笑み", "穏やかな微笑み", "落ち着いたニュートラルな表情", "自信のある表情", "やさしい表情", "凛とした表情"] },
  { id: "pose", label: "ポーズ（任意）", section: "撮影設定", optional: true, prefix: "ポーズは", options: ["", "自然な直立姿勢", "正面を向いた直立姿勢", "体をわずかに斜めにした立ち姿", "片手を腰に添えた立ち姿", "腕を自然に下ろした立ち姿", "椅子に浅く腰掛けた姿勢"] },
  { id: "framing", label: "構図（任意）", section: "撮影設定", optional: true, prefix: "構図は", options: ["", "全身が入る縦位置", "頭から膝までが入る縦位置", "ウエストアップ", "バストアップ", "目線の高さからの正面撮影", "わずかに斜め前からの撮影"] },
  { id: "background", label: "背景（任意）", section: "撮影設定", optional: true, prefix: "背景は", options: ["", "無地のライトグレーのスタジオ背景", "無地のホワイトのスタジオ背景", "落ち着いた室内", "明るいオフィス", "自然光の入る窓辺", "背景を自然にぼかした屋外"] },
  { id: "lighting", label: "照明（任意）", section: "撮影設定", optional: true, prefix: "照明は", options: ["", "柔らかなスタジオ照明", "窓から入る柔らかな自然光", "均一な拡散光", "輪郭を自然に見せる斜め前方からの光", "明るく清潔感のあるハイキー照明", "落ち着いたローキー照明"] },
];

export const fields = [...personFields, ...hairFields, ...shootingFields];

export const palettes = {
  standard: [
    ["ホワイト", "#f7f7f2"], ["アイボリー", "#f2e8cf"], ["ベージュ", "#cdbb9f"], ["ライトグレー", "#b8bcc2"], ["チャコールグレー", "#44474d"], ["ブラック", "#191a1d"],
    ["ネイビー", "#1f3154"], ["ブルー", "#3a70a8"], ["サックスブルー", "#9fc7dc"], ["グリーン", "#396b52"], ["オリーブ", "#6d7045"], ["ブラウン", "#714f3b"],
    ["キャメル", "#b47b45"], ["ボルドー", "#742f42"], ["レッド", "#b8383c"], ["ピンク", "#d89aab"], ["ラベンダー", "#a99bc8"], ["イエロー", "#d8b33f"],
  ],
  hair: [["ブラック", "#171515"], ["ナチュラルブラック", "#292423"], ["ダークブラウン", "#49352d"], ["ブラウン", "#714f3b"], ["ライトブラウン", "#9a7152"], ["アッシュブラウン", "#776b65"]],
  eyes: [["ダークブラウン", "#3b281f"], ["ブラウン", "#654434"], ["ライトブラウン", "#8a654b"], ["ヘーゼル", "#887247"], ["グレー", "#70757a"]],
};

export const defaults = {
  beauty: "クール系美人",
  body: "健康的な女性らしさのある標準体型",
  bust: "豊かなバスト（89cm相当）",
  hip: "標準的なヒップ（85cm相当）",
  outfitType: "",
  outfitStructure: "",
  topDesign: "",
  topColor: "ホワイト",
  bottomDesign: "",
  bottomColor: "チャコールグレー",
  outfitDesign: "",
  outfitColor: "ホワイト",
  outfitDecoration: "内容は容姿の印象に合わせておまかせ、装飾量は控えめ",
  hairColor: "ダークブラウン",
  hairstyle: "流し前髪のボブ",
  eyeColor: "ブラウン",
  expression: "",
  pose: "",
  framing: "",
  background: "",
  lighting: "",
};

export function paletteFor(field) {
  return palettes[field.palette || "standard"];
}

export function outfitFields(values) {
  const result = [{ id: "outfitType", label: "衣装タイプ", section: "衣装", options: outfitTypeOptions }];
  if (!values.outfitType) return result;
  result.push({ id: "outfitStructure", label: "衣装構成", section: "衣装", options: outfitStructureOptions });
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (!catalog) return result;
  if (values.outfitStructure === "separate") {
    result.push(
      { id: "topDesign", label: "トップスデザイン", section: "衣装", options: catalog.tops },
      { id: "topColor", label: "トップスの色", section: "衣装", type: "color" },
      { id: "bottomDesign", label: "ボトムスデザイン", section: "衣装", options: catalog.bottoms },
      { id: "bottomColor", label: "ボトムスの色", section: "衣装", type: "color" },
    );
  } else {
    result.push(
      { id: "outfitDesign", label: "衣装デザイン", section: "衣装", options: catalog.outfits },
      { id: "outfitColor", label: "衣装の色", section: "衣装", type: "color" },
    );
  }
  result.push({ id: "outfitDecoration", label: "衣装装飾", section: "衣装", options: outfitDecorationOptions });
  return result;
}

export function visibleFields(values) {
  return [...personFields, ...outfitFields(values), ...hairFields, ...shootingFields];
}

export function resetOutfitSelection(values) {
  Object.assign(values, firstOutfitSelection(values.outfitType, values.outfitStructure));
  values.topColor = "ホワイト";
  values.bottomColor = "チャコールグレー";
  values.outfitColor = "ホワイト";
  values.outfitDecoration = defaults.outfitDecoration;
  return values;
}

export function normalizeOutfitState(values) {
  const typeIsValid = outfitTypeOptions.some((option) => option.value && option.value === values.outfitType);
  if (!typeIsValid) {
    values.outfitType = "";
    values.outfitStructure = "";
    Object.assign(values, firstOutfitSelection("", ""));
    return values;
  }
  const structureIsValid = outfitStructureOptions.some((option) => option.value && option.value === values.outfitStructure);
  if (!structureIsValid) {
    values.outfitStructure = "";
    Object.assign(values, firstOutfitSelection("", ""));
    return values;
  }
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (values.outfitStructure === "separate") {
    if (!outfitChoice(catalog.tops, values.topDesign)) values.topDesign = catalog.tops[0].value;
    if (!outfitChoice(catalog.bottoms, values.bottomDesign)) values.bottomDesign = catalog.bottoms[0].value;
    values.outfitDesign = "";
  } else {
    if (!outfitChoice(catalog.outfits, values.outfitDesign)) values.outfitDesign = catalog.outfits[0].value;
    values.topDesign = "";
    values.bottomDesign = "";
  }
  if (!outfitDecorationOptions.includes(values.outfitDecoration)) values.outfitDecoration = defaults.outfitDecoration;
  return values;
}

function appendSimpleFields(lines, source, values) {
  source.forEach((field) => {
    const value = values[field.id];
    if (value) lines.push(field.prefix ? `${field.prefix}${value}` : value);
  });
}

export function generatePrompt(values) {
  const lines = [...fixedLines];
  appendSimpleFields(lines, personFields, values);

  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (catalog) {
    lines.push(`衣装タイプは${outfitLabel(outfitTypeOptions, values.outfitType)}`);
    lines.push(`衣装構成は${outfitLabel(outfitStructureOptions, values.outfitStructure)}`);
    if (values.outfitStructure === "separate") {
      const top = outfitChoice(catalog.tops, values.topDesign);
      const bottom = outfitChoice(catalog.bottoms, values.bottomDesign);
      if (top) lines.push(`トップスは${values.topColor}の${top.fullName}`);
      if (bottom) lines.push(`ボトムスは${values.bottomColor}の${bottom.fullName}`);
    } else {
      const outfit = outfitChoice(catalog.outfits, values.outfitDesign);
      if (outfit) lines.push(`衣装は${values.outfitColor}の${outfit.fullName}`);
    }
    if (values.outfitDecoration === "無し") lines.push("衣装装飾は無し");
    else if (values.outfitDecoration) lines.push(`衣装装飾の${values.outfitDecoration}`);
  }

  appendSimpleFields(lines, hairFields, values);
  appendSimpleFields(lines, shootingFields, values);
  return lines.join("\n");
}

export function presetMessage(action, name) {
  const messages = { save: `${name}を端末に登録しました`, load: `${name}を呼び出しました`, delete: `${name}を端末から削除しました` };
  return messages[action] || "";
}
