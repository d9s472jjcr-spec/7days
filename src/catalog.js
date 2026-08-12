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

export const hairstyleOptions = [
  { value: "耳上丈のベリーショート・ピクシーカット", label: "ピクシーカット" },
  { value: "耳下から顎上丈のマッシュショート", label: "マッシュショート" },
  { value: "耳下から顎上丈の前下がりショート", label: "前下がりショート" },
  { value: "顎丈のナチュラルボブ", label: "ナチュラルボブ" },
  { value: "顎丈の切りっぱなしボブ", label: "切りっぱなしボブ" },
  { value: "顎下から肩上丈の外ハネロブ", label: "外ハネロブ" },
  { value: "肩から鎖骨丈のレイヤーミディアム", label: "レイヤーミディアム" },
  { value: "肩から鎖骨丈のゆるいウェーブヘア", label: "ゆるウェーブミディアム" },
  { value: "胸下から腰上丈のストレートロング", label: "ストレートロング" },
  { value: "胸下から腰上丈のゆるいウェーブロング", label: "ゆるウェーブロング" },
  { value: "胸下から腰上丈のストレートな姫カット", label: "姫カットロング" },
  { value: "高い位置でまとめたポニーテール", label: "高めポニーテール" },
  { value: "低い位置でまとめたポニーテール", label: "低めポニーテール" },
  { value: "左右でまとめたツインテール", label: "ツインテール" },
  { value: "髪の上半分をまとめたハーフアップ", label: "ハーフアップ" },
  { value: "高い位置でまとめたお団子ヘア", label: "高めお団子" },
  { value: "低い位置ですっきりまとめたシニヨン", label: "シニヨン" },
];

export const bangsOptions = ["センターパート", "サイドパート", "かきあげ前髪", "流し前髪", "斜め前髪", "サイドバング", "ワイドバング", "ラウンドバング", "メカクレ"];

export const hairFields = [
  { id: "hairColor", label: "髪色", section: "髪・瞳", type: "color", prefix: "髪色は" },
  { id: "hairstyle", label: "髪型", section: "髪・瞳", prefix: "髪型は", options: hairstyleOptions },
  { id: "bangs", label: "前髪", section: "髪・瞳", prefix: "前髪は", options: bangsOptions },
  { id: "eyeColor", label: "瞳の色", section: "髪・瞳", type: "color", prefix: "瞳の色は" },
];

export const shootingFields = [
  { id: "expression", label: "表情（任意）", section: "撮影設定", optional: true, prefix: "表情は", options: ["", "自然な微笑み", "穏やかな微笑み", "落ち着いたニュートラルな表情", "自信のある表情", "やさしい表情", "凛とした表情"] },
  { id: "pose", label: "ポーズ（任意）", section: "撮影設定", optional: true, prefix: "ポーズは", options: ["", "自然な直立姿勢", "正面を向いた直立姿勢", "体をわずかに斜めにした立ち姿", "片手を腰に添えた立ち姿", "腕を自然に下ろした立ち姿", "椅子に浅く腰掛けた姿勢"] },
  { id: "framing", label: "構図（任意）", section: "撮影設定", optional: true, prefix: "構図は", options: ["", "全身が入る縦位置", "頭から膝までが入る縦位置", "ウエストアップ", "バストアップ", "目線の高さからの正面撮影", "わずかに斜め前からの撮影"] },
  { id: "background", label: "背景（任意）", section: "撮影設定", optional: true, prefix: "背景は", options: ["", "無地のライトグレーのスタジオ背景", "無地のホワイトのスタジオ背景", "落ち着いた室内", "明るいオフィス", "自然光の入る窓辺", "背景を自然にぼかした屋外"] },
  { id: "lighting", label: "照明（任意）", section: "撮影設定", optional: true, prefix: "照明は", options: ["", "柔らかなスタジオ照明", "窓から入る柔らかな自然光", "均一な拡散光", "輪郭を自然に見せる斜め前方からの光", "明るく清潔感のあるハイキー照明", "落ち着いたローキー照明"] },
];

export const fields = [...personFields, ...hairFields, ...shootingFields];

export const commonPalette = [
  ["ブラック", "#191A1D"], ["ナチュラルブラック", "#1C1817"], ["ソフトブラック", "#2B2523"], ["ブルーブラック", "#141B27"], ["アッシュブラック", "#25272A"], ["チャコールブラック", "#303033"],
  ["ブラウン", "#714F3B"], ["ナチュラルブラウン", "#5A3F34"], ["ココアブラウン", "#4B302B"], ["マロンブラウン", "#6B3F2B"], ["ダークブラウン", "#3E2B25"], ["ベージュ", "#CDBB9F"], ["キャメル", "#B47B45"], ["モカベージュ", "#8A7061"], ["ヌーディベージュ", "#B99A85"], ["アッシュブラウン", "#6E625D"], ["アッシュベージュ", "#A79687"], ["グレージュ", "#8C827C"],
  ["ライトグレー", "#B8BCC2"], ["チャコールグレー", "#4A484A"],
  ["ピンク", "#D89AAB"], ["ショコラピンク", "#7B4A50"], ["ラベンダー", "#A99BC8"], ["ラベンダーブラウン", "#675660"],
  ["ウォルナットブラウン", "#50372D"], ["ウォームブラウン", "#81533A"],
  ["グリーン", "#396B52"], ["オリーブ", "#6D7045"], ["オリーブブラウン", "#5C5941"],
  ["ホワイト", "#F7F7F2"], ["アイボリー", "#F2E8CF"], ["イエロー", "#D8B33F"], ["ライトブロンド", "#D8BC82"], ["ハニーブロンド", "#C99A4D"], ["プラチナブロンド", "#E6DFCF"], ["アッシュブロンド", "#B7AD9B"], ["ピンクブロンド", "#D7A5A6"], ["ミルクティーベージュ", "#C0A589"], ["シルバーアッシュ", "#A7AAAC"], ["ホワイトブロンド", "#EEE9DD"], ["オリーブグレージュ", "#85866B"], ["カーキアッシュ", "#77785A"],
  ["レッド", "#B8383C"], ["チェリーピンク", "#B94F68"], ["ワインレッド", "#6F2635"], ["アプリコットオレンジ", "#D47A45"], ["ラベンダーアッシュ", "#9B8EA1"], ["ハニーピンク", "#D18D91"],
  ["ブルー", "#3A70A8"], ["サックスブルー", "#9FC7DC"], ["ネイビーブルー", "#202D4E"], ["インディゴブルー", "#27385E"], ["ターコイズブルー", "#287C84"], ["シアンブルー", "#3296A8"], ["スカイブルー", "#78B2CA"],
];

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
  hairColor: "ナチュラルブラウン",
  hairstyle: "顎丈のナチュラルボブ",
  bangs: "流し前髪",
  eyeColor: "ナチュラルブラウン",
  expression: "",
  pose: "",
  framing: "",
  background: "",
  lighting: "",
};

export function paletteFor(field) {
  return commonPalette;
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
