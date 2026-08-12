import test from "node:test";
import assert from "node:assert/strict";
import { defaults, fields, fixedLines, generatePrompt, paletteFor } from "../src/catalog.js";

const baseline = `ユーザー指示
画像の新規生成
フォトリアル
架空の20代の成人日本人女性
美人
モデル体型
バストがとても豊か
トップスはホワイトの長袖ボタンアップシャツ
ボトムスはチャコールグレーのスラックス
衣装の基調カラーはホワイト
髪色はダークブラウン
髪型は流し前髪のボブ
瞳の色はブラウン`;

test("基準設定が承認済み指示文と完全一致する", () => {
  assert.equal(generatePrompt(defaults), baseline);
});

test("任意の撮影設定は選択時だけ定められた順で追記する", () => {
  const prompt = generatePrompt({
    ...defaults,
    expression: "自然な微笑み",
    pose: "自然な直立姿勢",
    framing: "全身が入る縦位置",
    background: "無地のホワイトのスタジオ背景",
    lighting: "柔らかなスタジオ照明",
  });
  assert.ok(prompt.endsWith([
    "表情は自然な微笑み",
    "ポーズは自然な直立姿勢",
    "構図は全身が入る縦位置",
    "背景は無地のホワイトのスタジオ背景",
    "照明は柔らかなスタジオ照明",
  ].join("\n")));
});

test("色と衣類名を一つの自然な行に合成する", () => {
  const prompt = generatePrompt({ ...defaults, topColor: "ネイビー", topType: "テーラードジャケット" });
  assert.match(prompt, /トップスはネイビーのテーラードジャケット/);
  assert.doesNotMatch(prompt, /トップスの色/);
});

test("全必須フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields.filter((item) => !item.optional)) {
    if (field.type === "color") {
      assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    } else {
      assert.ok(field.options.includes(defaults[field.id]), field.id);
    }
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
