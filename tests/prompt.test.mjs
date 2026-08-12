import test from "node:test";
import assert from "node:assert/strict";
import {
  defaults,
  fields,
  fixedLines,
  generatePrompt,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  presetMessage,
  resetOutfitSelection,
} from "../src/catalog.js";
import { outfitCatalogs } from "../src/outfits.js";

const noOutfitBaseline = `ユーザー指示
画像の新規生成
フォトリアル
架空の20代の成人日本人女性
クール系美人
健康的な女性らしさのある標準体型
豊かなバスト（89cm相当）
標準的なヒップ（85cm相当）
髪色はダークブラウン
髪型は流し前髪のボブ
瞳の色はブラウン`;

const stageSeparate = {
  ...defaults,
  outfitType: "stage",
  outfitStructure: "separate",
  topDesign: "stage_top_01",
  bottomDesign: "stage_bottom_01",
};

test("初期状態は衣装未選択の11行と完全一致する", () => {
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
  assert.match(prompt, /衣装タイプはステージ衣装\n衣装構成は上下分離\nトップスはホワイトの長袖・スタンドカラー・ウエスト丈 ショートジャケット\nボトムスはチャコールグレーのハイウエスト・ミニ丈 フレアスカート\n衣装装飾の内容は容姿の印象に合わせておまかせ、装飾量は控えめ/);
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

test("任意の撮影設定は選択時だけ定められた順で追記する", () => {
  const prompt = generatePrompt({ ...defaults, expression: "自然な微笑み", pose: "自然な直立姿勢", framing: "全身が入る縦位置", background: "無地のホワイトのスタジオ背景", lighting: "柔らかなスタジオ照明" });
  assert.ok(prompt.endsWith(["表情は自然な微笑み", "ポーズは自然な直立姿勢", "構図は全身が入る縦位置", "背景は無地のホワイトのスタジオ背景", "照明は柔らかなスタジオ照明"].join("\n")));
});

test("全固定フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields.filter((item) => !item.optional)) {
    if (field.type === "color") assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    else assert.ok(field.options.includes(defaults[field.id]), field.id);
  }
});

test("固定条件は成人・架空・日本人女性・フォトリアルを明記する", () => {
  assert.deepEqual(fixedLines, ["ユーザー指示", "画像の新規生成", "フォトリアル", "架空の20代の成人日本人女性"]);
});

test("選択肢は空文字の任意項目を除き重複しない", () => {
  for (const field of fields) {
    const values = field.type === "color" ? paletteFor(field).map(([name]) => name) : field.options.filter(Boolean);
    assert.equal(new Set(values).size, values.length, field.id);
  }
});

test("プリセット操作の完了通知に対象名を含める", () => {
  assert.equal(presetMessage("save", "白シャツ"), "白シャツを端末に登録しました");
  assert.equal(presetMessage("load", "白シャツ"), "白シャツを呼び出しました");
  assert.equal(presetMessage("delete", "白シャツ"), "白シャツを端末から削除しました");
});
