import {
  firstOutfitSelection,
  outfitCatalogFor,
  outfitChoice,
  outfitDecorationOptions,
  outfitLabel,
  outfitStructureOptions,
  outfitTypeOptions,
  outerwearOptions,
  shoeOptions,
} from "./outfits.js?v=6.0.0";

export const fixedLines = [
  "この入力は、画像の新規生成を指示するものとする。",
  "生成する画像は、フォトリアル画像とする。",
  "被写体は、架空の20代の成人日本人女性1人とする。",
  "人物の容姿は、美人とする。",
  "人物の体型は、脚の長いモデル体型とする。",
];

export const contactShadowLine = "人物の足元には、ごく薄い自然な接地影を入れる。";
export const fixedClosingLines = [
  "画像の縦横比は、縦長の9:16とする。",
  "画像には、文字、ロゴ、透かし、余分な人物および不要な小物を入れない。",
];

export const personFields = [
  { id: "bust", label: "バスト", section: "人物", group: "person", options: ["控えめなバスト（79cm相当）", "標準的なバスト（84cm相当）", "豊かなバスト（89cm相当）", "とても豊かなバスト（94cm相当）"] },
  { id: "hip", label: "ヒップ", section: "人物", group: "person", options: ["控えめなヒップ（80cm相当）", "標準的なヒップ（85cm相当）", "豊かなヒップ（90cm相当）", "とても豊かなヒップ（95cm相当）"] },
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
  { id: "hairColor", label: "髪色", section: "髪・瞳", group: "hair", type: "color" },
  { id: "hairstyle", label: "髪型", section: "髪・瞳", group: "hair", options: hairstyleOptions },
  { id: "bangs", label: "前髪", section: "髪・瞳", group: "hair", options: bangsOptions },
  { id: "eyeColor", label: "瞳の色", section: "髪・瞳", type: "color" },
];

export const shootingFields = [
  { id: "expression", label: "表情", section: "撮影設定", group: "presentation", options: [
    { value: "人物の表情は真剣とし、口元を自然に閉じ、目元を落ち着かせる。", label: "真剣" },
    { value: "人物の表情は控えめな喜びとし、口角をわずかに上げ、目元を柔らかくする。", label: "喜び" },
    { value: "人物の表情は控えめな怒りとし、口をわずかに結び、視線を少し鋭くし、眉の内側をわずかに下げる。", label: "怒り" },
    { value: "人物の表情は控えめな悲しみとし、口角と目元をわずかに下げ、眉の内側をわずかに上げる。", label: "悲しみ" },
  ] },
  { id: "pose", label: "ポーズ", section: "撮影設定", group: "presentation", options: [
    { value: "人物は自然に直立し、両腕を体側へ自然に下ろす。", label: "自然な直立姿勢" },
    { value: "人物は片脚へ自然に重心を置き、反対側の脚と腰をわずかに緩めて立つ。", label: "片脚重心の立ち姿" },
    { value: "人物は片手を腰へ自然に添え、反対側の腕を体側へ下ろして立つ。", label: "片手を腰に添える" },
    { value: "人物は両手を下腹部の前で軽く重ね、肩と肘を自然に緩めて立つ。", label: "両手を前で組む" },
    { value: "人物は椅子の前方へ浅く腰掛け、背筋を自然に伸ばし、両手を太腿の上へ置く。", label: "椅子に浅く座る" },
    { value: "人物は両手を左右の腰へ自然に添え、肘を軽く外側へ開いて立つ。", label: "両手を腰に添える" },
    { value: "人物は両腕を胸の下で軽く組み、肩に力を入れず自然に立つ。", label: "腕を軽く組む" },
    { value: "人物は片手を胸元へ軽く添え、反対側の腕を体側へ自然に下ろして立つ。", label: "片手を胸元に添える" },
    { value: "人物は片肘を軽く曲げ、片手を肩より低い位置へ自然に上げ、反対側の腕を体側へ下ろして立つ。", label: "片手を軽く上げる" },
  ] },
  { id: "framing", label: "構図", section: "撮影設定", group: "camera", options: [
    { value: "撮影構図は全身とし、人物の頭頂から足先までを画面内に収める。画像には人物の頭、手、足の周囲に余白を確保し、身体の一部を見切らない。", label: "全身" },
    { value: "撮影構図は太もも上とし、人物の頭頂から太ももの中央付近までを画面内に収める。", label: "太もも上" },
    { value: "撮影構図は腰上とし、人物の頭頂から腰付近までを画面内に収める。", label: "腰上" },
    { value: "撮影構図はバストアップとし、人物の頭頂から胸元までを画面内に収める。", label: "バストアップ" },
  ] },
  { id: "cameraAngle", label: "カメラアングル", section: "撮影設定", group: "camera", options: [
    { value: "カメラは人物の目線の高さに置き、人物の正面から水平に撮影する。", label: "目線の高さ" },
    { value: "カメラは人物の目線よりわずかに高い位置に置き、強い見下ろしにならない角度で撮影する。", label: "やや高め" },
    { value: "カメラは人物の目線よりわずかに低い位置に置き、強いあおりにならない角度で撮影する。", label: "やや低め" },
  ] },
  { id: "background", label: "背景", section: "撮影設定", group: "environment", options: [
    { value: "撮影背景は、純白のシームレススタジオ背景とする。", label: "純白のスタジオ" },
    { value: "撮影背景は、ライトグレーのシームレススタジオ背景とする。", label: "ライトグレーのスタジオ" },
    { value: "撮影背景は、無機質なコンクリート壁の撮影スタジオとする。", label: "コンクリート壁のスタジオ" },
    { value: "撮影背景は、家具や装飾を抑えたシンプルな室内とする。", label: "シンプルな室内" },
    { value: "撮影背景は、整然としたモダンなリビングとする。", label: "モダンなリビング" },
    { value: "撮影背景は、整然とした現代的なオフィス内装とする。", label: "オフィス" },
    { value: "撮影背景は、落ち着いた内装のカフェとする。", label: "カフェ" },
    { value: "撮影背景は、上品な内装のホテルロビーとする。", label: "ホテルロビー" },
    { value: "撮影背景は、クラシカルな洋館の室内とする。", label: "洋館" },
    { value: "撮影背景は、畳と障子のある和室とする。", label: "和室" },
    { value: "撮影背景は、現代的な建物が並ぶ都市の通りとする。", label: "都市の通り" },
    { value: "撮影背景は、レンガ壁に囲まれた路地とする。", label: "レンガ造りの路地" },
    { value: "撮影背景は、都市の建物が見える屋上とする。", label: "屋上" },
    { value: "撮影背景は、樹木と草地のある公園とする。", label: "公園" },
    { value: "撮影背景は、砂浜と海が見える海辺とする。", label: "海辺" },
    { value: "撮影背景は、音響設備と小規模ステージを備えたライブハウスとする。", label: "ライブハウス" },
    { value: "撮影背景は、客席と舞台設備を備えた小規模ホールとする。", label: "小規模ホール" },
    { value: "撮影背景は、広い客席と本格的な舞台設備を備えた大規模ホールとする。", label: "大規模ホール" },
    { value: "撮影背景は、広いフロアと大規模な観客席を備えたアリーナ会場とする。", label: "アリーナ" },
  ] },
  { id: "lighting", label: "照明", section: "撮影設定", group: "environment", options: [
    { value: "照明には柔らかなニュートラルの拡散光を使用し、人物全体を均一に照らす。", label: "ニュートラルな拡散照明" },
    { value: "照明には一方向から入る柔らかな自然光を使用する。", label: "柔らかな自然光" },
    { value: "照明には影を浅く抑えた均一なハイキー照明を使用する。", label: "ハイキー照明" },
    { value: "照明には人物の斜め横から当たる柔らかなサイドライトを使用し、人物に自然な立体感を作る。", label: "サイドライト" },
    { value: "照明には正面からの白色スポットライトと、人物の輪郭を照らす控えめな白色のリムライトを使用する。", label: "ステージ照明" },
  ] },
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
  outfitDecoration: "内容は衣装に合わせておまかせ、装飾量は控えめ",
  shoe: "pumps",
  shoeColor: "ブラック",
  hairColor: "ナチュラルブラウン",
  hairstyle: "顎丈のナチュラルボブ",
  bangs: "流し前髪",
  eyeColor: "ナチュラルブラウン",
  expression: shootingFields[0].options[0].value,
  pose: shootingFields[1].options[0].value,
  framing: shootingFields[2].options[0].value,
  cameraAngle: shootingFields[3].options[0].value,
  background: shootingFields[4].options[0].value,
  lighting: shootingFields[5].options[0].value,
};

export function paletteFor(field) {
  return commonPalette;
}

export function outfitFields(values) {
  const result = [{ id: "outfitType", label: "衣装タイプ", section: "衣装", group: "outfit-classification", options: outfitTypeOptions }];
  if (!values.outfitType) return result;
  result.push({ id: "outfitStructure", label: "衣装構成", section: "衣装", group: "outfit-classification", options: outfitStructureOptions });
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (!catalog) return result;
  result.push({ id: "outerwear", label: "アウター", section: "衣装", group: "outerwear", options: outerwearOptions });
  if (values.outerwear !== "none") result.push({ id: "outerwearColor", label: "アウターの色", section: "衣装", group: "outerwear", type: "color" });
  if (values.outfitStructure === "separate") {
    result.push(
      { id: "topDesign", label: "トップスデザイン", section: "衣装", group: "top", options: catalog.tops },
      { id: "topColor", label: "トップスの色", section: "衣装", group: "top", type: "color" },
      { id: "bottomDesign", label: "ボトムスデザイン", section: "衣装", group: "bottom", options: catalog.bottoms },
      { id: "bottomColor", label: "ボトムスの色", section: "衣装", group: "bottom", type: "color" },
    );
  } else {
    result.push(
      { id: "outfitDesign", label: "衣装デザイン", section: "衣装", group: "onepiece", options: catalog.outfits },
      { id: "outfitColor", label: "衣装の色", section: "衣装", group: "onepiece", type: "color" },
    );
  }
  result.push({ id: "outfitDecoration", label: "衣装装飾", section: "衣装", options: outfitDecorationOptions });
  result.push({ id: "shoe", label: "靴", section: "衣装", group: "shoe", options: shoeOptions });
  if (values.shoe !== "barefoot") result.push({ id: "shoeColor", label: "靴の色", section: "衣装", group: "shoe", type: "color" });
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
  values.outerwear = defaults.outerwear;
  values.outerwearColor = defaults.outerwearColor;
  values.shoe = defaults.shoe;
  values.shoeColor = defaults.shoeColor;
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
  if (!outfitChoice(outerwearOptions, values.outerwear)) values.outerwear = defaults.outerwear;
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
  if (!outfitChoice(shoeOptions, values.shoe)) values.shoe = defaults.shoe;
  return values;
}

export function generatePrompt(values) {
  const lines = [...fixedLines];
  lines.push(`人物のバストは、${values.bust}とする。`);
  lines.push(`人物のヒップは、${values.hip}とする。`);

  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (catalog) {
    lines.push(`人物が着用する衣装のタイプは、${outfitLabel(outfitTypeOptions, values.outfitType)}とする。`);
    lines.push(`衣装の構成は、${outfitLabel(outfitStructureOptions, values.outfitStructure)}とする。`);
    const outerwear = outfitChoice(outerwearOptions, values.outerwear);
    if (outerwear?.value !== "none") lines.push(`人物が着用するアウターは、${values.outerwearColor}の${outerwear.fullName}とする。`);
    if (values.outfitStructure === "separate") {
      const top = outfitChoice(catalog.tops, values.topDesign);
      const bottom = outfitChoice(catalog.bottoms, values.bottomDesign);
      if (top) lines.push(`人物が着用するトップスは、${values.topColor}の${top.fullName}とする。`);
      if (bottom) lines.push(`人物が着用するボトムスは、${values.bottomColor}の${bottom.fullName}とする。`);
    } else {
      const outfit = outfitChoice(catalog.outfits, values.outfitDesign);
      if (outfit) lines.push(`人物が着用する衣装は、${values.outfitColor}の${outfit.fullName}とする。`);
    }
    if (values.outfitDecoration === "無し") lines.push("衣装には、装飾を付けない。");
    else if (values.outfitDecoration?.includes("控えめ")) lines.push("衣装装飾の内容は衣装に合わせて補完し、装飾量は控えめとする。");
    else if (values.outfitDecoration?.includes("華美")) lines.push("衣装装飾の内容は衣装に合わせて補完し、装飾量は華美とする。");
    const shoe = outfitChoice(shoeOptions, values.shoe);
    if (shoe?.value === "barefoot") lines.push("人物の足元は、裸足とする。");
    else if (shoe) lines.push(`人物が履く靴は、${values.shoeColor}の${shoe.fullName}とする。`);
  }

  lines.push(`人物の髪色は、${values.hairColor}とする。`);
  lines.push(`人物の髪型は、${values.hairstyle}とする。`);
  lines.push(`人物の前髪は、${values.bangs}とする。`);
  lines.push(`人物の瞳の色は、${values.eyeColor}とする。`);
  shootingFields.forEach((field) => lines.push(values[field.id]));
  lines.push(fixedClosingLines[0]);
  if (values.framing === shootingFields.find(({ id }) => id === "framing").options[0].value) {
    lines.push(contactShadowLine);
  }
  lines.push(fixedClosingLines[1]);
  return lines.join("\n");
}

export function presetMessage(action, name) {
  const messages = { save: `${name}を端末に登録しました`, load: `${name}を呼び出しました`, delete: `${name}を端末から削除しました` };
  return messages[action] || "";
}
