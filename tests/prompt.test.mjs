import test from "node:test";
import assert from "node:assert/strict";
import {
  bangsOptions,
  commonPalette,
  defaults,
  fields,
  fixedLines,
  generatePrompt,
  hairFields,
  hairstyleOptions,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  personFields,
  presetMessage,
  resetOutfitSelection,
  shootingFields,
} from "../src/catalog.js";
import { outfitCatalogs, outerwearOptions, shoeOptions } from "../src/outfits.js";

const noOutfitBaseline = `この入力は、画像の新規生成を指示するものとする。
生成する画像は、フォトリアル画像とする。
被写体は、架空の20代の成人日本人女性1人とする。
人物の容姿は、美人とする。
人物の体型は、脚の長いモデル体型とする。
人物のバストは、豊かなバスト（89cm相当）とする。
人物のヒップは、標準的なヒップ（85cm相当）とする。
人物の髪色は、ナチュラルブラウンとする。
人物の髪型は、顎丈のナチュラルボブとする。
人物の前髪は、流し前髪とする。
人物の瞳の色は、ナチュラルブラウンとする。
人物の表情は真剣とし、口元を自然に閉じ、目元を落ち着かせる。
人物は自然に直立し、両腕を体側へ自然に下ろす。
撮影構図は全身とし、人物の頭頂から足先までを画面内に収める。画像には人物の頭、手、足の周囲に余白を確保し、身体の一部を見切らない。
カメラは人物の目線の高さに置き、人物の正面から水平に撮影する。
撮影背景は、純白のシームレススタジオ背景とする。
照明には柔らかなニュートラルの拡散光を使用し、人物全体を均一に照らす。
画像の縦横比は、縦長の9:16とする。
人物の足元には、ごく薄い自然な接地影を入れる。
画像には、文字、ロゴ、透かし、余分な人物および不要な小物を入れない。`;

const stageSeparate = {
  ...defaults,
  outfitType: "stage",
  outfitStructure: "separate",
  topDesign: "stage_top_01",
  bottomDesign: "stage_bottom_01",
};

test("初期状態は衣装未選択の20行と完全一致する", () => {
  assert.equal(generatePrompt(defaults), noOutfitBaseline);
});

test("衣装タイプ未選択では衣装タイプだけを表示する", () => {
  assert.deepEqual(outfitFields(defaults).map(({ id }) => id), ["outfitType"]);
});

test("衣装構成未選択では衣装タイプと衣装構成だけを表示する", () => {
  assert.deepEqual(outfitFields({ ...defaults, outfitType: "stage" }).map(({ id }) => id), ["outfitType", "outfitStructure"]);
});

test("上下分離は分類・上下デザイン・色・装飾・靴を自然な順序で出力する", () => {
  const prompt = generatePrompt(stageSeparate);
  assert.match(prompt, /人物が着用する衣装のタイプは、ステージ衣装とする。\n衣装の構成は、上下分離とする。\n人物が着用するトップスは、ホワイトのシャツカラーのステージシャツとする。\n人物が着用するボトムスは、チャコールグレーのハイウエスト・ミニ丈 フレアスカートとする。\n衣装装飾の内容は衣装に合わせて補完し、装飾量は控えめとする。\n人物が履く靴は、ブラックのパンプスとする。/);
});

test("上下一体は衣装デザインと衣装色を出力する", () => {
  const values = resetOutfitSelection({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  const prompt = generatePrompt(values);
  assert.match(prompt, /人物が着用する衣装のタイプは、ステージ衣装とする。\n衣装の構成は、上下一体とする。\n人物が着用する衣装は、ホワイトのハイウエスト・ミニ丈 フィット＆フレアドレスとする。/);
  assert.doesNotMatch(prompt, /人物が着用するトップス|人物が着用するボトムス/);
});

test("装飾無しは省略せず明示する", () => {
  assert.match(generatePrompt({ ...stageSeparate, outfitDecoration: "無し" }), /衣装には、装飾を付けない。/);
});

test("アウターは無しなら省略し、選択時は色付きで上下より前へ出力する", () => {
  assert.doesNotMatch(generatePrompt(stageSeparate), /人物が着用するアウターは/);
  const prompt = generatePrompt({ ...stageSeparate, outerwear: "cropped_jacket", outerwearColor: "レッド" });
  assert.match(prompt, /衣装の構成は、上下分離とする。\n人物が着用するアウターは、レッドのウエスト上丈のクロップドジャケットとする。\n人物が着用するトップスは/);
});

test("裸足は靴色を出力しない", () => {
  const prompt = generatePrompt({ ...stageSeparate, shoe: "barefoot", shoeColor: "レッド" });
  assert.match(prompt, /人物の足元は、裸足とする。/);
  assert.doesNotMatch(prompt, /人物が履く靴は|レッドの裸足/);
});

test("下着・ビキニ・競技用水着・コルセットを選択できる", () => {
  assert.ok(outfitCatalogs.stage_separate.tops.some(({ label }) => label === "コルセットトップ"));
  assert.ok(outfitCatalogs.casual_separate.tops.some(({ label }) => label === "ブラジャー"));
  assert.ok(outfitCatalogs.casual_separate.tops.some(({ label }) => label === "ビキニトップ"));
  assert.ok(outfitCatalogs.casual_separate.bottoms.some(({ label }) => label === "ショーツ"));
  assert.ok(outfitCatalogs.casual_separate.bottoms.some(({ label }) => label === "ビキニボトム"));
  assert.ok(outfitCatalogs.casual_onepiece.outfits.some(({ label }) => label === "競技用水着"));
});

test("衣装装飾のおまかせ内容は衣装を基準にする", () => {
  const prompt = generatePrompt({ ...stageSeparate, outfitDecoration: "内容は衣装に合わせておまかせ、装飾量は華美" });
  assert.match(prompt, /衣装装飾の内容は衣装に合わせて補完し、装飾量は華美とする。/);
  assert.ok(!prompt.includes("容姿の印象に合わせて"));
});

test("4系統は確定した拡張候補数を持つ", () => {
  assert.equal(outfitCatalogs.stage_separate.tops.length, 12);
  assert.equal(outfitCatalogs.stage_separate.bottoms.length, 22);
  assert.equal(outfitCatalogs.casual_separate.tops.length, 19);
  assert.equal(outfitCatalogs.casual_separate.bottoms.length, 29);
  assert.equal(outfitCatalogs.stage_onepiece.outfits.length, 12);
  assert.equal(outfitCatalogs.casual_onepiece.outfits.length, 16);
  assert.equal(outerwearOptions.length, 11);
  assert.equal(shoeOptions.length, 17);
});

test("省略されやすいUI名にも衣装種別を明記する", () => {
  assert.equal(outfitCatalogs.stage_separate.bottoms[0].label, "フレアミニスカート");
  assert.equal(outfitCatalogs.stage_onepiece.outfits[0].label, "フィット＆フレアドレス");
  assert.equal(outfitCatalogs.stage_onepiece.outfits[10].label, "ショートジャンプスーツ");
  assert.equal(outfitCatalogs.casual_separate.bottoms[11].label, "ストレートデニムパンツ");
  assert.equal(outfitCatalogs.casual_separate.bottoms[1].label, "ミディプリーツスカート");
});

test("系統選択時は一覧1番と指定色を初期選択する", () => {
  const separate = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "separate" });
  assert.equal(separate.topDesign, "casual_top_01");
  assert.equal(separate.bottomDesign, "casual_bottom_01");
  assert.equal(separate.topColor, "ホワイト");
  assert.equal(separate.bottomColor, "チャコールグレー");
  assert.equal(separate.outerwear, "none");
  assert.equal(separate.shoe, "pumps");
  assert.equal(separate.shoeColor, "ブラック");
  const onepiece = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" });
  assert.equal(onepiece.outfitDesign, "casual_one_01");
  assert.equal(onepiece.outfitColor, "ホワイト");
});

test("無効な保存値は現行カタログの1番へ補正する", () => {
  const restored = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "deleted", bottomDesign: "deleted" });
  assert.equal(restored.topDesign, "stage_top_01");
  assert.equal(restored.bottomDesign, "stage_bottom_01");
});

test("表情と必須の撮影設定は定められた順で追記する", () => {
  const [expression, pose, framing, cameraAngle, background, lighting] = shootingFields.map((field) => field.options.at(-1).value);
  const prompt = generatePrompt({ ...defaults, expression, pose, framing, cameraAngle, background, lighting });
  const lines = prompt.split("\n");
  assert.deepEqual(lines.slice(-8), [expression, pose, framing, cameraAngle, background, lighting, "画像の縦横比は、縦長の9:16とする。", "画像には、文字、ロゴ、透かし、余分な人物および不要な小物を入れない。"]);
});

test("容姿と体型はUIから廃止し固定文として出力する", () => {
  assert.deepEqual(personFields.map(({ id }) => id), ["bust", "hip"]);
  assert.ok(!fields.some(({ id }) => id === "beauty" || id === "body"));
  assert.deepEqual(fixedLines.slice(-2), ["人物の容姿は、美人とする。", "人物の体型は、脚の長いモデル体型とする。"]);
});

test("表情は真剣を初期値とする確定4種類だけを持つ", () => {
  const expression = shootingFields.find(({ id }) => id === "expression");
  assert.equal(defaults.expression, expression.options[0].value);
  assert.deepEqual(expression.options, [
    { label: "真剣", value: "人物の表情は真剣とし、口元を自然に閉じ、目元を落ち着かせる。" },
    { label: "喜び", value: "人物の表情は控えめな喜びとし、口角をわずかに上げ、目元を柔らかくする。" },
    { label: "怒り", value: "人物の表情は控えめな怒りとし、口をわずかに結び、視線を少し鋭くし、眉の内側をわずかに下げる。" },
    { label: "悲しみ", value: "人物の表情は控えめな悲しみとし、口角と目元をわずかに下げ、眉の内側をわずかに上げる。" },
  ]);
});

test("衣装選択後の指示文は靴を含む", () => {
  assert.equal(generatePrompt(stageSeparate).split("\n").length, 26);
  const stageOnepiece = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  assert.equal(generatePrompt(stageOnepiece).split("\n").length, 25);
});

test("撮影設定は承認済みの必須候補だけを持つ", () => {
  const byId = Object.fromEntries(shootingFields.map((field) => [field.id, field]));
  assert.deepEqual(shootingFields.map(({ id }) => id), ["expression", "pose", "framing", "cameraAngle", "background", "lighting"]);
  assert.deepEqual([byId.expression.options.length, byId.pose.options.length, byId.framing.options.length, byId.cameraAngle.options.length, byId.background.options.length, byId.lighting.options.length], [4, 9, 4, 3, 19, 5]);
  assert.ok(shootingFields.every((field) => !field.optional && field.options.every((option) => option.value.endsWith("。"))));
  assert.equal(byId.pose.options[0].label, "自然な直立姿勢");
  assert.equal(byId.framing.options[0].label, "全身");
  assert.equal(byId.cameraAngle.options[0].label, "目線の高さ");
  assert.equal(byId.background.options[0].label, "純白のスタジオ");
  assert.equal(byId.lighting.options[0].label, "ニュートラルな拡散照明");
});

test("全身構図だけ接地影を出力する", () => {
  assert.match(generatePrompt(defaults), /ごく薄い自然な接地影/);
  const framing = shootingFields.find(({ id }) => id === "framing");
  framing.options.slice(1).forEach(({ value }) => assert.doesNotMatch(generatePrompt({ ...defaults, framing: value }), /接地影/));
});

test("生成される全行は主語と述語を持つ完全な文章として句点で終わる", () => {
  const samples = [defaults, stageSeparate, resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" })];
  samples.forEach((values) => generatePrompt(values).split("\n").forEach((line) => assert.match(line, /。$/, line)));
});

test("全項目・全選択肢の出力は完全な文章で未定義値を含まない", () => {
  const samples = [{ ...defaults }];
  personFields.forEach((field) => field.options.forEach((value) => samples.push({ ...defaults, [field.id]: value })));
  hairFields.forEach((field) => {
    const options = field.type === "color" ? commonPalette.map(([name]) => name) : field.options.map((option) => option.value ?? option);
    options.forEach((value) => samples.push({ ...defaults, [field.id]: value }));
  });
  shootingFields.forEach((field) => field.options.forEach(({ value }) => samples.push({ ...defaults, [field.id]: value })));

  for (const [key, catalog] of Object.entries(outfitCatalogs)) {
    const [outfitType, outfitStructure] = key.split("_");
    const base = resetOutfitSelection({ ...defaults, outfitType, outfitStructure });
    outerwearOptions.forEach(({ value }) => samples.push({ ...base, outerwear: value }));
    shoeOptions.forEach(({ value }) => samples.push({ ...base, shoe: value }));
    if (outfitStructure === "separate") {
      catalog.tops.forEach(({ value }) => samples.push({ ...base, topDesign: value }));
      catalog.bottoms.forEach(({ value }) => samples.push({ ...base, bottomDesign: value }));
    } else {
      catalog.outfits.forEach(({ value }) => samples.push({ ...base, outfitDesign: value }));
    }
  }

  commonPalette.forEach(([color]) => samples.push({
    ...stageSeparate,
    outerwear: "bolero",
    outerwearColor: color,
    topColor: color,
    bottomColor: color,
    shoeColor: color,
    hairColor: color,
    eyeColor: color,
  }));

  samples.forEach((values) => {
    const prompt = generatePrompt(values);
    assert.doesNotMatch(prompt, /undefined|null/);
    prompt.split("\n").forEach((line) => assert.match(line, /。$/, line));
  });
});

test("全固定フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields.filter((item) => !item.optional)) {
    if (field.type === "color") assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    else assert.ok(field.options.some((option) => (typeof option === "string" ? option : option.value) === defaults[field.id]), field.id);
  }
});

test("衣装・アウター・靴・髪・瞳の色項目は同じ順序の共通55色を使う", () => {
  const expectedNames = [
    "ブラック", "ナチュラルブラック", "ソフトブラック", "ブルーブラック", "アッシュブラック", "チャコールブラック",
    "ブラウン", "ナチュラルブラウン", "ココアブラウン", "マロンブラウン", "ダークブラウン", "ベージュ", "キャメル", "モカベージュ", "ヌーディベージュ", "アッシュブラウン", "アッシュベージュ", "グレージュ",
    "ライトグレー", "チャコールグレー", "ピンク", "ショコラピンク", "ラベンダー", "ラベンダーブラウン", "ウォルナットブラウン", "ウォームブラウン",
    "グリーン", "オリーブ", "オリーブブラウン", "ホワイト", "アイボリー", "イエロー", "ライトブロンド", "ハニーブロンド", "プラチナブロンド", "アッシュブロンド", "ピンクブロンド", "ミルクティーベージュ", "シルバーアッシュ", "ホワイトブロンド", "オリーブグレージュ", "カーキアッシュ",
    "レッド", "チェリーピンク", "ワインレッド", "アプリコットオレンジ", "ラベンダーアッシュ", "ハニーピンク", "ブルー", "サックスブルー", "ネイビーブルー", "インディゴブルー", "ターコイズブルー", "シアンブルー", "スカイブルー",
  ];
  assert.equal(commonPalette.length, 55);
  assert.equal(new Set(commonPalette.map(([name]) => name)).size, 55);
  assert.deepEqual(commonPalette.map(([name]) => name), expectedNames);
  assert.ok(commonPalette.every(([, hex]) => /^#[0-9A-F]{6}$/.test(hex)));
  assert.deepEqual(commonPalette[0], ["ブラック", "#191A1D"]);
  assert.deepEqual(commonPalette[7], ["ナチュラルブラウン", "#5A3F34"]);
  assert.deepEqual(commonPalette[19], ["チャコールグレー", "#4A484A"]);
  assert.deepEqual(commonPalette[29], ["ホワイト", "#F7F7F2"]);
  assert.deepEqual(commonPalette[54], ["スカイブルー", "#78B2CA"]);

  const separateColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "separate", outerwear: "bolero" }).filter(({ type }) => type === "color");
  const onepieceColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "onepiece", outerwear: "bolero" }).filter(({ type }) => type === "color");
  const hairAndEyeColors = fields.filter(({ type }) => type === "color");
  const colorFields = [...separateColors, ...onepieceColors, ...hairAndEyeColors];
  assert.deepEqual(colorFields.map(({ id }) => id), ["outerwearColor", "topColor", "bottomColor", "shoeColor", "outerwearColor", "outfitColor", "shoeColor", "hairColor", "eyeColor"]);
  colorFields.forEach((field) => assert.strictEqual(paletteFor(field), commonPalette));
});

test("髪型17種類は短いUI名と正式な出力語句を持つ", () => {
  assert.equal(hairstyleOptions.length, 17);
  assert.deepEqual(hairstyleOptions[3], { value: "顎丈のナチュラルボブ", label: "ナチュラルボブ" });
  assert.ok(hairstyleOptions.every(({ value, label }) => value && label));
  assert.ok(hairstyleOptions.every(({ value, label }) => !/セミロング|ベリーロング/.test(`${value}${label}`)));
});

test("前髪は確定した9種類だけを持つ", () => {
  assert.deepEqual(bangsOptions, ["センターパート", "サイドパート", "かきあげ前髪", "流し前髪", "斜め前髪", "サイドバング", "ワイドバング", "ラウンドバング", "メカクレ"]);
  assert.ok(!bangsOptions.includes("前髪なし"));
  assert.ok(!bangsOptions.includes("ぱっつん前髪"));
});

test("固定条件は完全な文章で成人・架空・日本人女性・フォトリアル・美人・モデル体型を明記する", () => {
  assert.deepEqual(fixedLines, ["この入力は、画像の新規生成を指示するものとする。", "生成する画像は、フォトリアル画像とする。", "被写体は、架空の20代の成人日本人女性1人とする。", "人物の容姿は、美人とする。", "人物の体型は、脚の長いモデル体型とする。"]);
});

test("選択肢は重複しない", () => {
  for (const field of fields) {
    const values = field.type === "color" ? paletteFor(field).map(([name]) => name) : field.options.map((option) => typeof option === "string" ? option : option.value).filter(Boolean);
    assert.equal(new Set(values).size, values.length, field.id);
  }
});

test("プリセット操作の完了通知に対象名を含める", () => {
  assert.equal(presetMessage("save", "白シャツ"), "白シャツを端末に登録しました");
  assert.equal(presetMessage("load", "白シャツ"), "白シャツを呼び出しました");
  assert.equal(presetMessage("delete", "白シャツ"), "白シャツを端末から削除しました");
});
