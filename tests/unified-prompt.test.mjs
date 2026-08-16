import assert from "node:assert/strict";
import test from "node:test";
import * as catalog from "../src/unified-catalog.js";
import { appConfig, legacyPhotoKeys, migrateLegacyPhotoValues, prepareUnifiedStorage } from "../src/mode-config.js";
import { lowerUnderwearOptions, outfitCatalogs, upperUnderwearOptions } from "../src/outfits.js";

const field = (id) => catalog.visibleFields(catalog.defaults).find((item) => item.id === id) || catalog.faceFields.find((item) => item.id === id);

test("固定文は画風を含まない2文だけ", () => {
  assert.deepEqual(catalog.fixedLines, ["画像を新規生成する。", "被写体は、架空の20代の成人日本人女性1人とする。"]);
  assert.doesNotMatch(catalog.fixedLines.join(" "), /フォトリアル|写実|アニメ|画風/);
});

test("顔項目の順序と件数を固定する", () => {
  assert.deepEqual(catalog.faceFields.map(({ id }) => id), ["eyeShape", "eyeExpression", "specialEyeExpression", "eyeColor", "mouthExpression", "bust", "hip"]);
  assert.equal(field("eyeShape").options.length, 6);
  assert.equal(field("eyeExpression").options.length, 18);
  assert.equal(field("specialEyeExpression").options.length, 10);
  assert.equal(field("mouthExpression").options.length, 24);
  assert.equal(field("specialEyeExpression").options[0].value, "");
});

test("撮影設定は豊富な6項目を共通利用する", () => {
  assert.deepEqual(catalog.shootingFields.map(({ id, options }) => [id, options.length]), [["pose",45],["framing",7],["cameraAngle",7],["cameraDirection",4],["background",19],["lighting",32]]);
});

test("指示文は改行も画風固定語も含まない", () => {
  const prompt = catalog.generatePrompt(catalog.defaults);
  assert.doesNotMatch(prompt, /[\r\n]/);
  assert.doesNotMatch(prompt, /フォトリアル|写実的|アニメ風|2Dイラスト/);
  assert.ok(prompt.endsWith("不要な小物は入れない。"));
});

test("特殊な目は無しなら省略し、選択時は優先規則を出す", () => {
  const none = catalog.generatePrompt(catalog.defaults);
  assert.doesNotMatch(none, /特殊な目の表現に必要な範囲/);
  const heart = catalog.generatePrompt({ ...catalog.defaults, specialEyeExpression: field("specialEyeExpression").options[8].value });
  assert.match(heart, /ハート形/);
  assert.match(heart, /特殊な目の表現に必要な範囲/);
});

test("上下分離は無しとおまかせを許可し、上下一体は無しを許可しない", () => {
  const separate = catalog.outfitFields({ ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "auto", bottomDesign: "auto" });
  assert.deepEqual(separate.find(({ id }) => id === "topDesign").options.slice(0,2).map(({ value }) => value), ["none", "auto"]);
  const onepiece = catalog.outfitFields({ ...catalog.defaults, outfitType: "stage", outfitStructure: "onepiece", outfitDesign: "auto" });
  assert.equal(onepiece.find(({ id }) => id === "outfitDesign").options[0].value, "auto");
  assert.ok(!onepiece.find(({ id }) => id === "outfitDesign").options.some(({ value }) => value === "none"));
  const none = catalog.outfitFields({ ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "none", bottomDesign: "none", upperUnderwear: "none", lowerUnderwear: "none" });
  for (const id of ["topColor", "bottomColor", "upperUnderwearColor", "lowerUnderwearColor"]) assert.ok(!none.some((item) => item.id === id));
});

test("下着は各13候補で衣服の有無に応じて主衣装か内側になる", () => {
  assert.equal(upperUnderwearOptions.length, 13);
  assert.equal(lowerUnderwearOptions.length, 13);
  const base = { ...catalog.defaults, outfitType: "casual", outfitStructure: "separate", upperUnderwear: "bralette", lowerUnderwear: "normal_panties" };
  const only = catalog.generatePrompt({ ...base, topDesign: "none", bottomDesign: "none" });
  assert.match(only, /上半身の衣装として、ホワイトのブラレット/);
  assert.match(only, /下半身の衣装として、ホワイトのノーマルショーツ/);
  assert.doesNotMatch(only, /装飾内容/);
  const under = catalog.generatePrompt({ ...base, topDesign: "auto", bottomDesign: "auto" });
  assert.match(under, /上半身の衣装の下に、ホワイトのブラレット/);
  assert.match(under, /下半身の衣装の下に、ホワイトのノーマルショーツ/);
});

test("下着と重複する旧衣装候補を除去する", () => {
  const tops = outfitCatalogs.casual_separate.tops.map(({ value }) => value);
  const bottoms = outfitCatalogs.casual_separate.bottoms.map(({ value }) => value);
  for (const id of ["casual_top_07","casual_top_08","casual_top_09","casual_top_10","casual_top_11","casual_top_12","casual_top_13","casual_top_27","casual_top_30","casual_top_31"]) assert.ok(!tops.includes(id));
  for (const id of ["casual_bottom_19","casual_bottom_20","casual_bottom_21","casual_bottom_22","casual_bottom_44","casual_bottom_45","casual_bottom_46"]) assert.ok(!bottoms.includes(id));
});

test("衣装タイプと構成の独立行を出さず、衣装文へ用途を含める", () => {
  const prompt = catalog.generatePrompt({ ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "auto", bottomDesign: "auto" });
  assert.doesNotMatch(prompt, /衣装タイプは|構成は/);
  assert.match(prompt, /ステージ衣装向けのトップス/);
  assert.match(prompt, /ステージ衣装向けのボトムス/);
});

test("全110色に加え衣装色だけ無しとおまかせを表示する", () => {
  assert.equal(catalog.paletteFor({ id: "hairColor" }).length, 110);
  assert.equal(catalog.paletteFor({ id: "topColor" }).length, 112);
  assert.deepEqual(catalog.paletteFor({ id: "topColor" }).slice(0,2).map(([name]) => name), ["無し", "おまかせ"]);
});

test("統合保存キーは旧キーから分離する", () => {
  assert.equal(appConfig.storageKey, "7days:unified:last-values:v1");
  assert.equal(appConfig.presetsKey, "7days:unified:presets:v1");
  assert.notEqual(appConfig.storageKey, legacyPhotoKeys.storageKey);
});

test("旧写真v8を一度だけ移行し旧データを保持する", () => {
  const map = new Map([[legacyPhotoKeys.storageKey, JSON.stringify({ outfitType:"casual", outfitStructure:"separate", topDesign:"casual_top_12", topColor:"ピンク" })]]);
  const storage = { getItem:(key)=>map.get(key)||null, setItem:(key,value)=>map.set(key,value), removeItem:(key)=>map.delete(key) };
  assert.equal(prepareUnifiedStorage(storage), true);
  const migrated = JSON.parse(map.get(appConfig.storageKey));
  assert.equal(migrated.topDesign, "none");
  assert.equal(migrated.upperUnderwear, "bralette");
  assert.ok(map.has(legacyPhotoKeys.storageKey));
  const snapshot = JSON.stringify([...map]);
  assert.equal(prepareUnifiedStorage(storage), false);
  assert.equal(JSON.stringify([...map]), snapshot);
});

test("legacy shooting values outside the unified catalog fall back to valid defaults", () => {
  const migrated = migrateLegacyPhotoValues({
    framing: "legacy framing value",
    cameraAngle: "legacy camera angle value",
    lighting: "legacy lighting value",
  });
  for (const id of ["framing", "cameraAngle", "lighting"]) {
    const shootingField = catalog.shootingFields.find((item) => item.id === id);
    assert.ok(shootingField.options.some((option) => option.value === migrated[id]));
  }
});

test("全選択肢の総当たり出力に未定義値や改行がない", () => {
  const base = { ...catalog.defaults, outfitType:"stage", outfitStructure:"separate", topDesign:"auto", bottomDesign:"auto" };
  for (const item of catalog.visibleFields(base)) {
    if (item.type === "color") continue;
    for (const option of item.options) {
      const value = typeof option === "string" ? option : option.value;
      const prompt = catalog.generatePrompt({ ...base, [item.id]: value });
      assert.doesNotMatch(prompt, /undefined|null|[\r\n]/);
    }
  }
});
