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
} from "./outfits.js";

export const fixedLines = [
  "画像を新規生成する。",
  "被写体は、架空の20代の成人日本人女性1人とする。",
  "容姿は、美人とする。",
  "体型は、脚の長いモデル体型とする。",
];

export const contactShadowLine = "全身構図では、足元にごく薄い自然な接地影を入れる。";
export const fixedClosingLines = [
  "縦横比は、縦長の9:16とする。",
  "文字、ロゴ、透かし、余分な人物、不要な小物は入れない。",
];

export const personFields = [
  { id: "bust", label: "バスト", section: "人物", group: "person", options: ["控えめなバスト（79cm相当）", "標準的なバスト（84cm相当）", "豊かなバスト（89cm相当）", "とても豊かなバスト（94cm相当）"] },
  { id: "hip", label: "ヒップ", section: "人物", group: "person", options: ["控えめなヒップ（80cm相当）", "標準的なヒップ（85cm相当）", "豊かなヒップ（90cm相当）", "とても豊かなヒップ（95cm相当）"] },
];

export const hairstyleOptions = [
  { value: "耳上丈のナチュラルベリーショート", label: "ナチュラルベリーショート" },
  { value: "耳上丈のベリーショート・ピクシーカット", label: "ピクシーカット" },
  { value: "耳下から顎上丈のマッシュショート", label: "マッシュショート" },
  { value: "耳下から顎上丈の前下がりショート", label: "前下がりショート" },
  { value: "耳下から顎上丈のストレートショート", label: "ストレートショート" },
  { value: "顎丈のナチュラルボブ", label: "ナチュラルボブ" },
  { value: "顎丈の切りっぱなしボブ", label: "切りっぱなしボブ" },
  { value: "顎丈の前下がりボブ", label: "前下がりボブ" },
  { value: "顎下から肩上丈の外ハネロブ", label: "外ハネロブ" },
  { value: "顎下から肩上丈の内巻きロブ", label: "内巻きロブ" },
  { value: "肩から鎖骨丈のレイヤーミディアム", label: "レイヤーミディアム" },
  { value: "肩から鎖骨丈のストレートミディアム", label: "ストレートミディアム" },
  { value: "肩から鎖骨丈のゆるいウェーブヘア", label: "ゆるウェーブミディアム" },
  { value: "肩から鎖骨丈の強めのウェーブヘア", label: "ウェーブミディアム" },
  { value: "胸下から腰上丈のストレートロング", label: "ストレートロング" },
  { value: "胸下から腰上丈のゆるいウェーブロング", label: "ゆるウェーブロング" },
  { value: "胸下から腰上丈のストレートな姫カット", label: "姫カットロング" },
  { value: "高い位置でまとめたポニーテール", label: "高めポニーテール" },
  { value: "低い位置でまとめたポニーテール", label: "低めポニーテール" },
  { value: "片側でまとめたサイドポニーテール", label: "サイドポニーテール" },
  { value: "左右でまとめたツインテール", label: "ツインテール" },
  { value: "髪の上半分を左右でまとめたハーフツイン", label: "ハーフツイン" },
  { value: "髪の上半分をまとめたハーフアップ", label: "ハーフアップ" },
  { value: "高い位置でまとめたお団子ヘア", label: "高めお団子" },
  { value: "左右でまとめたツインお団子ヘア", label: "ツインお団子" },
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
    { value: "人物は自然に直立する。", label: "自然な直立姿勢" },
    { value: "人物は片脚へ自然に重心を置き、反対側の脚と腰をわずかに緩めて立つ。", label: "片脚重心の立ち姿" },
    { value: "人物は片手を腰へ自然に添えて立つ。", label: "片手を腰に添える" },
    { value: "人物は両手を下腹部の前で軽く重ねて立つ。", label: "両手を前で組む" },
    { value: "人物は椅子の前方へ浅く腰掛け、背筋を自然に伸ばす。", label: "椅子に浅く座る" },
    { value: "人物は両手を左右の腰へ自然に添えて立つ。", label: "両手を腰に添える" },
    { value: "人物は両腕を胸の下で軽く組んで立つ。", label: "腕を軽く組む" },
    { value: "人物は片手を胸元へ軽く添えて立つ。", label: "片手を胸元に添える" },
    { value: "人物は片手を肩より低い位置へ自然に上げて立つ。", label: "片手を軽く上げる" },
    { value: "人物は椅子に深く腰掛けて脚を組み、片手で自然に頬杖をつく。", label: "椅子に深く座り、脚を組んで頬杖" },
    { value: "人物は床にあぐらをかいて座り、上体を自然に起こす。", label: "床にあぐらをかいて座る" },
    { value: "人物は床に座って片膝を立て、もう片方の脚は自然にまっすぐ人物の正面へ伸ばす。", label: "床に片膝を立てて座る" },
  ] },
  { id: "framing", label: "構図", section: "撮影設定", group: "camera", options: [
    { value: "撮影構図は全身とし、人物の頭頂から足先までを画面内に収める。画像には人物の頭、手、足の周囲に余白を確保し、身体の一部を見切らない。", label: "全身" },
    { value: "撮影構図は太もも上とし、人物の頭頂から太ももの中央付近までを画面内に収める。", label: "太もも上" },
    { value: "撮影構図は腰上とし、人物の頭頂から腰付近までを画面内に収める。", label: "腰上" },
    { value: "撮影構図はバストアップとし、人物の頭頂から胸元までを画面内に収める。", label: "バストアップ" },
  ] },
  { id: "cameraAngle", label: "カメラアングル", section: "撮影設定", group: "camera", options: [
    { value: "カメラは人物の目線の高さに置き、水平に撮影する。", label: "目線の高さ" },
    { value: "カメラは人物の目線よりわずかに高い位置に置き、強い見下ろしにならない角度とする。", label: "やや高め" },
    { value: "カメラは人物の目線よりわずかに低い位置に置き、強いあおりにならない角度とする。", label: "やや低め" },
  ] },
  { id: "cameraDirection", label: "撮影方向", section: "撮影設定", group: "camera", options: [
    { value: "撮影方向は、人物の正面からとする。", label: "正面" },
    { value: "撮影方向は、人物の正面に対して斜め45度からとする。", label: "斜め45度" },
    { value: "撮影方向は、人物の真横からとする。", label: "真横" },
    { value: "撮影方向は、人物の背中側からとする。", label: "背面" },
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
    // オーソドックス
    { value: "照明には柔らかなニュートラルの拡散光を使用し、人物全体を均一に照らす。", label: "ニュートラルな拡散照明" },
    { value: "照明には一方向から入る柔らかな自然光を使用する。", label: "柔らかな自然光" },
    { value: "照明にはキーライト、フィルライト、バックライトを組み合わせた標準的な3点照明を使用する。", label: "3点照明" },
    { value: "照明には人物の正面上方から当たる柔らかなバタフライ照明を使用する。", label: "バタフライ照明" },
    // 明るい
    { value: "照明には影を浅く抑えた均一なハイキー照明を使用する。", label: "ハイキー照明" },
    { value: "照明には正面の大型ソフトボックスから当たる明るく柔らかな光を使用する。", label: "大型ソフトボックス照明" },
    { value: "照明には大きな窓から入る明るい自然光を使用し、影を柔らかく保つ。", label: "明るい窓光" },
    { value: "照明には白い壁面から反射する明るいバウンス光を使用し、全身を均一に照らす。", label: "白色バウンス照明" },
    // 暗い
    { value: "照明には背景を暗く保ち、人物の顔と身体だけを選択的に照らすローキー照明を使用する。", label: "ローキー照明" },
    { value: "照明には人物の斜め上方から当たるレンブラント照明を使用し、顔に自然な明暗差を作る。", label: "レンブラント照明" },
    { value: "照明には人物の斜め横から当たる柔らかなサイドライトを使用し、人物に自然な立体感を作る。", label: "サイドライト" },
    { value: "照明には人物の背後から当たる逆光を主体とし、輪郭を明るく浮かび上がらせる。", label: "輪郭を強調する逆光" },
    // 独特・演出的
    { value: "照明には正面からの白色スポットライトと、人物の輪郭を照らす控えめな白色のリムライトを使用する。", label: "ステージ照明" },
    { value: "照明には左右から異なる2色のカラーフィルター光を使用し、人物へ明確な色の対比を作る。", label: "2色カラーフィルター照明" },
    { value: "照明にはゴボを通した投影光を使用し、背景と人物へ幾何学的な光と影の模様を作る。", label: "ゴボ投影照明" },
    { value: "照明には青紫とマゼンタのネオン光を使用し、輪郭へ鮮明な色のグラデーションを作る。", label: "ネオン照明" },
  ] },
];

export const fields = [...personFields, ...hairFields, ...shootingFields];

export const commonPalette = [
  // ブラック系
  ["ブラック", "#191A1D"], ["ナチュラルブラック", "#1C1817"], ["ソフトブラック", "#2B2523"], ["ブルーブラック", "#141B27"], ["アッシュブラック", "#25272A"], ["チャコールブラック", "#303033"],
  ["ジェットブラック", "#0B0B0C"], ["インクブラック", "#171820"], ["オニキスブラック", "#202124"], ["グラファイト", "#3B3E42"],
  // ホワイト・グレー・シルバー系
  ["ライトグレー", "#B8BCC2"], ["チャコールグレー", "#4A484A"], ["ホワイト", "#F7F7F2"], ["アイボリー", "#F2E8CF"], ["シルバーアッシュ", "#A7AAAC"], ["ホワイトブロンド", "#EEE9DD"],
  ["ピュアホワイト", "#FFFFFF"], ["クリーム", "#FFF4D6"], ["エクリュ", "#E8DCC5"], ["パールグレー", "#D8D8D4"], ["ミディアムグレー", "#85878B"], ["アッシュグレー", "#77787A"], ["スレートグレー", "#5F6770"], ["シルバー", "#BFC3C7"], ["ガンメタル", "#4B5056"],
  // ブラウン・ベージュ系
  ["ブラウン", "#714F3B"], ["ナチュラルブラウン", "#5A3F34"], ["ココアブラウン", "#4B302B"], ["マロンブラウン", "#6B3F2B"], ["ダークブラウン", "#3E2B25"], ["ベージュ", "#CDBB9F"], ["キャメル", "#B47B45"], ["モカベージュ", "#8A7061"], ["ヌーディベージュ", "#B99A85"], ["アッシュブラウン", "#6E625D"], ["アッシュベージュ", "#A79687"], ["グレージュ", "#8C827C"], ["ラベンダーブラウン", "#675660"], ["ウォルナットブラウン", "#50372D"], ["ウォームブラウン", "#81533A"], ["オリーブブラウン", "#5C5941"], ["ミルクティーベージュ", "#C0A589"], ["オリーブグレージュ", "#85866B"], ["カーキアッシュ", "#77785A"],
  ["サンドベージュ", "#C7AC83"], ["ローズベージュ", "#C5A09A"], ["トープ", "#8B7D75"], ["キャラメルブラウン", "#A4673B"], ["カッパーブラウン", "#8A4B35"], ["マホガニーブラウン", "#5A2928"],
  // レッド・ピンク・オレンジ系
  ["ピンク", "#D89AAB"], ["ショコラピンク", "#7B4A50"], ["ピンクブロンド", "#D7A5A6"], ["レッド", "#B8383C"], ["チェリーピンク", "#B94F68"], ["ワインレッド", "#6F2635"], ["アプリコットオレンジ", "#D47A45"], ["ハニーピンク", "#D18D91"],
  ["クリムゾン", "#A51C30"], ["スカーレット", "#D0342C"], ["ルビーレッド", "#9B1B30"], ["トマトレッド", "#D94A3A"], ["バーミリオン", "#E34234"], ["コーラルピンク", "#E58B91"], ["ローズピンク", "#C96F85"], ["ベビーピンク", "#F2B8C6"], ["ダスティピンク", "#B7848E"], ["マゼンタ", "#C02A7A"], ["ピーチ", "#F2A07B"], ["コーラルオレンジ", "#E97955"], ["タンジェリンオレンジ", "#E97824"], ["柿色", "#C85A32"],
  // イエロー・ブロンド・ゴールド系
  ["イエロー", "#D8B33F"], ["ライトブロンド", "#D8BC82"], ["ハニーブロンド", "#C99A4D"], ["プラチナブロンド", "#E6DFCF"], ["アッシュブロンド", "#B7AD9B"],
  ["レモンイエロー", "#F2D94E"], ["マスタードイエロー", "#C49A2E"], ["アンバー", "#D99A2B"], ["ゴールド", "#C9A227"], ["シャンパンゴールド", "#D6BC83"],
  // グリーン系
  ["グリーン", "#396B52"], ["オリーブ", "#6D7045"],
  ["ミントグリーン", "#9BCDB6"], ["ライムグリーン", "#78A942"], ["エメラルドグリーン", "#2E8B57"], ["フォレストグリーン", "#24543B"], ["セージグリーン", "#8A9A7B"], ["カーキグリーン", "#6B7043"], ["ティールグリーン", "#2F756D"], ["モスグリーン", "#657A47"],
  // ブルー系
  ["ブルー", "#3A70A8"], ["サックスブルー", "#9FC7DC"], ["ネイビーブルー", "#202D4E"], ["インディゴブルー", "#27385E"], ["ターコイズブルー", "#287C84"], ["シアンブルー", "#3296A8"], ["スカイブルー", "#78B2CA"],
  ["アイスブルー", "#C6E4F2"], ["コバルトブルー", "#2456A6"], ["ロイヤルブルー", "#3156A3"], ["ウルトラマリンブルー", "#314CB6"], ["ミッドナイトブルー", "#182A4A"],
  // パープル系
  ["ラベンダー", "#A99BC8"], ["ラベンダーアッシュ", "#9B8EA1"],
  ["バイオレット", "#6E4E9E"], ["パープル", "#73458A"], ["モーヴ", "#9A7293"], ["ライラック", "#B9A1D0"],
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
  cameraDirection: shootingFields[4].options[0].value,
  background: shootingFields[5].options[0].value,
  lighting: shootingFields[6].options[0].value,
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
  lines.push(`バストは、${values.bust}とする。`);
  lines.push(`ヒップは、${values.hip}とする。`);

  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (catalog) {
    lines.push(`衣装タイプは、${outfitLabel(outfitTypeOptions, values.outfitType)}とする。`);
    lines.push(`構成は、${outfitLabel(outfitStructureOptions, values.outfitStructure)}とする。`);
    const outerwear = outfitChoice(outerwearOptions, values.outerwear);
    if (outerwear?.value !== "none") lines.push(`アウターは、${values.outerwearColor}の${outerwear.fullName}とする。`);
    if (values.outfitStructure === "separate") {
      const top = outfitChoice(catalog.tops, values.topDesign);
      const bottom = outfitChoice(catalog.bottoms, values.bottomDesign);
      if (top) lines.push(`トップスは、${values.topColor}の${top.fullName}とする。`);
      if (bottom) lines.push(`ボトムスは、${values.bottomColor}の${bottom.fullName}とする。`);
    } else {
      const outfit = outfitChoice(catalog.outfits, values.outfitDesign);
      if (outfit) lines.push(`衣装は、${values.outfitColor}の${outfit.fullName}とする。`);
    }
    if (values.outfitDecoration === "無し") lines.push("装飾は付けない。");
    else if (values.outfitDecoration?.includes("控えめ")) lines.push("装飾内容は衣装に合わせて補完し、量は控えめとする。");
    else if (values.outfitDecoration?.includes("華美")) lines.push("装飾内容は衣装に合わせて補完し、量は華美とする。");
    const shoe = outfitChoice(shoeOptions, values.shoe);
    if (shoe?.value === "barefoot") lines.push("足元は裸足とする。");
    else if (shoe) lines.push(`靴は、${values.shoeColor}の${shoe.fullName}とする。`);
  }

  lines.push(`髪色は、${values.hairColor}とする。`);
  lines.push(`髪型は、${values.hairstyle}とする。`);
  lines.push(`前髪は、${values.bangs}とする。`);
  lines.push(`瞳の色は、${values.eyeColor}とする。`);
  shootingFields.forEach((field) => lines.push(promptLineForShooting(field.id, values[field.id])));
  lines.push(fixedClosingLines[0]);
  if (values.framing === shootingFields.find(({ id }) => id === "framing").options[0].value) {
    lines.push(contactShadowLine);
  }
  lines.push(fixedClosingLines[1]);
  return lines.join(" ").replace(/[\r\n]+/g, " ").replace(/[ \t]+/g, " ").trim();
}

export function promptLineForShooting(fieldId, value) {
  if (fieldId === "expression") return value.replace(/^人物の/, "");
  if (fieldId === "pose") return value.replace(/^人物は/, "");
  if (fieldId === "framing") return value
    .replaceAll("人物の頭頂", "頭頂")
    .replace("画像には人物の頭、手、足", "頭、手、足");
  if (fieldId === "cameraAngle") return value.replaceAll("人物の目線", "被写体の目線");
  if (fieldId === "lighting") return value
    .replace("人物全体", "全身")
    .replace("人物の斜め横", "斜め横")
    .replace("人物に自然な立体感", "自然な立体感")
    .replace("人物の輪郭", "輪郭");
  return value;
}

export function presetMessage(action, name) {
  const messages = { save: `${name}を端末に登録しました`, load: `${name}を呼び出しました`, delete: `${name}を端末から削除しました` };
  return messages[action] || "";
}
