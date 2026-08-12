import test from "node:test";
import assert from "node:assert/strict";
import {
  bangsOptions,
  commonPalette,
  defaults,
  fields,
  fixedLines,
  generatePrompt,
  hairstyleOptions,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  personFields,
  presetMessage,
  resetOutfitSelection,
  shootingFields,
} from "../src/catalog.js";
import { outfitCatalogs } from "../src/outfits.js";

const noOutfitBaseline = `ユーザー指示
画像の新規生成
フォトリアル
架空の20代の成人日本人女性
美人
脚の長いモデル体型
豊かなバスト（89cm相当）
標準的なヒップ（85cm相当）
髪色はナチュラルブラウン
髪型は顎丈のナチュラルボブ
前髪は流し前髪
瞳の色はナチュラルブラウン
表情は真剣。口元を自然に閉じ、落ち着いた目元にする`;

const stageSeparate = {
  ...defaults,
  outfitType: "stage",
  outfitStructure: "separate",
  topDesign: "stage_top_01",
  bottomDesign: "stage_bottom_01",
};

test("初期状態は衣装未選択の13行と完全一致する", () => {
  assert.equal(generatePrompt(defaults), noOutfitBaseline);
});

test("衣装タイプ未選択では衣装タイプだけを表示する", () => {
  assert.deepEqual(outfitFields(defaults).map(({ id }) => id), ["outfitType"]);
});

test("衣装構成未選択では衣装タイプと衣装構成だけを表示する", () => {
  assert.deepEqual(outfitFields({ ...defaults, outfitType: "stage" }).map(({ id }) => id), ["outfitType", "outfitStructure"]);
});

test("上下分離は分類・上下デザイン・色・装飾を自然な順序で出力する", () => {
  const prompt = generatePrompt(stageSeparate);
  assert.match(prompt, /衣装タイプはステージ衣装\n衣装構成は上下分離\nトップスはホワイトの長袖・スタンドカラー・ウエスト丈 ショートジャケット\nボトムスはチャコールグレーのハイウエスト・ミニ丈 フレアスカート\n衣装装飾の内容は衣装に合わせておまかせ、装飾量は控えめ/);
});

test("上下一体は衣装デザインと衣装色を出力する", () => {
  const values = resetOutfitSelection({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  const prompt = generatePrompt(values);
  assert.match(prompt, /衣装タイプはステージ衣装\n衣装構成は上下一体\n衣装はホワイトの半袖・スクエアネック・ハイウエスト・ウエスト丈上身頃・ミニ丈 フィット＆フレアドレス/);
  assert.doesNotMatch(prompt, /トップスは|ボトムスは/);
});

test("装飾無しは省略せず明示する", () => {
  assert.match(generatePrompt({ ...stageSeparate, outfitDecoration: "無し" }), /衣装装飾は無し/);
});

test("衣装装飾のおまかせ内容は衣装を基準にする", () => {
  const prompt = generatePrompt({ ...stageSeparate, outfitDecoration: "内容は衣装に合わせておまかせ、装飾量は華美" });
  assert.match(prompt, /衣装装飾の内容は衣装に合わせておまかせ、装飾量は華美/);
  assert.ok(!prompt.includes("容姿の印象に合わせて"));
});

test("4系統は8候補ずつを持ち合計144通りになる", () => {
  assert.equal(outfitCatalogs.stage_separate.tops.length, 8);
  assert.equal(outfitCatalogs.stage_separate.bottoms.length, 8);
  assert.equal(outfitCatalogs.casual_separate.tops.length, 8);
  assert.equal(outfitCatalogs.casual_separate.bottoms.length, 8);
  assert.equal(outfitCatalogs.stage_onepiece.outfits.length, 8);
  assert.equal(outfitCatalogs.casual_onepiece.outfits.length, 8);
  const combinations = (8 * 8) + 8 + (8 * 8) + 8;
  assert.equal(combinations, 144);
});

test("省略されやすいUI名にも衣装種別を明記する", () => {
  assert.equal(outfitCatalogs.stage_separate.bottoms[0].label, "フレアミニスカート");
  assert.equal(outfitCatalogs.stage_onepiece.outfits[0].label, "フィット＆フレアドレス");
  assert.equal(outfitCatalogs.stage_onepiece.outfits[6].label, "ショートジャンプスーツ");
  assert.equal(outfitCatalogs.casual_separate.bottoms[0].label, "ストレートデニムパンツ");
  assert.equal(outfitCatalogs.casual_separate.bottoms[4].label, "ミディプリーツスカート");
});

test("系統選択時は一覧1番と指定色を初期選択する", () => {
  const separate = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "separate" });
  assert.equal(separate.topDesign, "casual_top_01");
  assert.equal(separate.bottomDesign, "casual_bottom_01");
  assert.equal(separate.topColor, "ホワイト");
  assert.equal(separate.bottomColor, "チャコールグレー");
  const onepiece = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" });
  assert.equal(onepiece.outfitDesign, "casual_one_01");
  assert.equal(onepiece.outfitColor, "ホワイト");
});

test("無効な保存値は現行カタログの1番へ補正する", () => {
  const restored = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "deleted", bottomDesign: "deleted" });
  assert.equal(restored.topDesign, "stage_top_01");
  assert.equal(restored.bottomDesign, "stage_bottom_01");
});

test("表情と任意の撮影設定は定められた順で追記する", () => {
  const expression = "表情は控えめな喜び。口角をわずかに上げ、目元を柔らかくする";
  const prompt = generatePrompt({ ...defaults, expression, pose: "体をわずかに斜めにした立ち姿", framing: "頭から膝までが入る縦位置", background: "無地のライトグレーのスタジオ背景", lighting: "窓から入る柔らかな自然光" });
  assert.ok(prompt.endsWith([expression, "ポーズは体をわずかに斜めにした立ち姿", "構図は頭から膝までが入る縦位置", "背景は無地のライトグレーのスタジオ背景", "照明は窓から入る柔らかな自然光"].join("\n")));
});

test("容姿と体型はUIから廃止し固定文として出力する", () => {
  assert.deepEqual(personFields.map(({ id }) => id), ["bust", "hip"]);
  assert.ok(!fields.some(({ id }) => id === "beauty" || id === "body"));
  assert.deepEqual(fixedLines.slice(-2), ["美人", "脚の長いモデル体型"]);
});

test("表情は真剣を初期値とする確定4種類だけを持つ", () => {
  const expression = shootingFields.find(({ id }) => id === "expression");
  assert.equal(defaults.expression, expression.options[0].value);
  assert.deepEqual(expression.options, [
    { label: "真剣", value: "表情は真剣。口元を自然に閉じ、落ち着いた目元にする" },
    { label: "喜び", value: "表情は控えめな喜び。口角をわずかに上げ、目元を柔らかくする" },
    { label: "怒り", value: "表情は控えめな怒り。口をわずかに結び、視線を少し鋭くし、眉の内側をわずかに下げる" },
    { label: "悲しみ", value: "表情は控えめな悲しみ。口角と目元をわずかに下げ、眉の内側をわずかに上げる" },
  ]);
});

test("衣装選択後の指示文は上下分離18行・上下一体17行になる", () => {
  assert.equal(generatePrompt(stageSeparate).split("\n").length, 18);
  const stageOnepiece = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  assert.equal(generatePrompt(stageOnepiece).split("\n").length, 17);
});

test("その他の撮影設定は差の大きい確定候補だけを持つ", () => {
  const byId = Object.fromEntries(shootingFields.map((field) => [field.id, field]));
  assert.deepEqual(byId.pose.options, ["", "体をわずかに斜めにした立ち姿", "片手を腰に添えた立ち姿", "椅子に浅く腰掛けた姿勢"]);
  assert.deepEqual(byId.framing.options, ["", "頭から膝までが入る縦位置", "ウエストアップ", "バストアップ", "わずかに斜め前からの撮影"]);
  assert.deepEqual(byId.background.options, ["", "無地のライトグレーのスタジオ背景", "落ち着いた室内", "明るいオフィス", "自然光の入る窓辺", "背景を自然にぼかした屋外"]);
  assert.deepEqual(byId.lighting.options, ["", "窓から入る柔らかな自然光", "明るく清潔感のあるハイキー照明", "落ち着いたローキー照明"]);
});

test("全固定フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields.filter((item) => !item.optional)) {
    if (field.type === "color") assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    else assert.ok(field.options.some((option) => (typeof option === "string" ? option : option.value) === defaults[field.id]), field.id);
  }
});

test("5つの色項目は同じ順序の共通55色を使う", () => {
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

  const separateColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "separate" }).filter(({ type }) => type === "color");
  const onepieceColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" }).filter(({ type }) => type === "color");
  const hairAndEyeColors = fields.filter(({ type }) => type === "color");
  const colorFields = [...separateColors, ...onepieceColors, ...hairAndEyeColors];
  assert.deepEqual(colorFields.map(({ id }) => id), ["topColor", "bottomColor", "outfitColor", "hairColor", "eyeColor"]);
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

test("固定条件は成人・架空・日本人女性・フォトリアル・美人・モデル体型を明記する", () => {
  assert.deepEqual(fixedLines, ["ユーザー指示", "画像の新規生成", "フォトリアル", "架空の20代の成人日本人女性", "美人", "脚の長いモデル体型"]);
});

test("選択肢は空文字の任意項目を除き重複しない", () => {
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
