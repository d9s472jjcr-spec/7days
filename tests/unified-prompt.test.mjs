import assert from "node:assert/strict";
import test from "node:test";
import * as catalog from "../src/unified-catalog.js";
import {
  appConfig,
  legacyPhotoKeys,
  legacyUnifiedKeys,
  migrateLegacyPhotoValues,
  migrateUnifiedV1Values,
  prepareUnifiedStorage,
} from "../src/mode-config.js";
import { lowerUnderwearOptions, outfitCatalogs, upperUnderwearOptions } from "../src/outfits.js";

const field = (id, values = catalog.defaults) => catalog.visibleFields(values).find((item) => item.id === id);
const optionValue = (option) => typeof option === "string" ? option : option.value;
const optionLabel = (option) => typeof option === "string" ? option : option.label;
const storageDouble = (entries = []) => {
  const map = new Map(entries);
  return {
    map,
    storage: {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => map.set(key, value),
      removeItem: (key) => map.delete(key),
    },
  };
};

test("固定文は画風を含まない2文だけ", () => {
  assert.deepEqual(catalog.fixedLines, ["画像を新規生成する。", "被写体は、架空の20代の成人日本人女性1人とする。"]);
  assert.doesNotMatch(catalog.fixedLines.join(" "), /フォトリアル|写実|アニメ|画風/);
});

test("髪型・髪色・前髪をフォーム最上部へこの順序で置く", () => {
  assert.deepEqual(catalog.hairFields.map(({ id }) => id), ["hairstyle", "hairColor", "bangs"]);
  assert.deepEqual(catalog.visibleFields(catalog.defaults).slice(0, 3).map(({ id }) => id), ["hairstyle", "hairColor", "bangs"]);
});

test("人物の特徴は承認済み60候補で初期値をクールにする", () => {
  const expected = [
    "元気", "クール", "お姉さん", "母性あふれる", "小悪魔", "ギャル", "お嬢様", "キャリアウーマン", "スポーティ", "内気",
    "天然", "いたずら好き", "ツンデレ", "姉御肌", "女王様", "天真爛漫", "おっとり", "勝ち気", "生真面目", "無気力",
    "情熱的", "自由奔放", "好奇心旺盛", "マイペース", "社交的", "孤高", "控えめ", "豪快", "慎重", "夢見がち",
    "癒やし系", "ミステリアス", "ワイルド", "ボーイッシュ", "中性的", "優雅", "凛々しい", "妖艶", "素朴", "高貴",
    "甘え上手", "負けず嫌い", "サバサバ", "繊細", "大胆", "無口", "おしゃべり", "献身的", "自信家", "心配性",
    "楽天家", "ロマンチスト", "現実主義", "論理派", "直感型", "完璧主義", "反骨精神", "冒険家", "芸術家肌", "リーダータイプ",
  ];
  assert.equal(catalog.defaults.personFeature, "クール");
  assert.deepEqual(catalog.personFeatureOptions.map(optionLabel), expected);
  assert.equal(new Set(catalog.personFeatureOptions.map(optionValue)).size, 60);
});

test("身長・B/W/Hは承認済み範囲の数値スライダー", () => {
  assert.deepEqual(catalog.bodyFields.map(({ id, min, max, step, type }) => ({ id, min, max, step, type })), [
    { id: "height", min: 140, max: 175, step: 1, type: "range" },
    { id: "bust", min: 70, max: 100, step: 1, type: "range" },
    { id: "waist", min: 50, max: 65, step: 1, type: "range" },
    { id: "hip", min: 75, max: 95, step: 1, type: "range" },
  ]);
  assert.deepEqual(
    Object.fromEntries(["height", "bust", "waist", "hip"].map((id) => [id, catalog.defaults[id]])),
    { height: 158, bust: 81, waist: 57, hip: 82 },
  );
  assert.equal(catalog.measurementSummary("bust", catalog.defaults), "81cm｜標準的｜推定Cカップ相当");
});

test("撮影・カメラ・背景・照明は現行フォームと指示文から除外する", () => {
  const removed = ["pose", "framing", "cameraAngle", "cameraDirection", "background", "lighting", "aspectRatio", "contactShadow"];
  const ids = catalog.visibleFields(catalog.defaults).map(({ id }) => id);
  for (const id of removed) {
    assert.ok(!ids.includes(id), `${id} should not be visible`);
    assert.ok(!Object.hasOwn(catalog.defaults, id), `${id} should not have an active default`);
  }
  const prompt = catalog.generatePrompt({
    ...catalog.defaults,
    pose: "POSE_SENTINEL", framing: "FRAME_SENTINEL", cameraAngle: "ANGLE_SENTINEL",
    cameraDirection: "DIRECTION_SENTINEL", background: "BACKGROUND_SENTINEL", lighting: "LIGHT_SENTINEL",
  });
  assert.doesNotMatch(prompt, /SENTINEL/);
  assert.doesNotMatch(prompt, /撮影構図|カメラ|背景|照明|縦横比|接地影|文字、ロゴ|不要な小物/);
});

test("指示文は一行で、身体値と推定カップを重複なく簡潔に出す", () => {
  const prompt = catalog.generatePrompt(catalog.defaults);
  assert.doesNotMatch(prompt, /[\r\n]/);
  assert.doesNotMatch(prompt, /フォトリアル|写実的|アニメ風|2Dイラスト/);
  assert.match(prompt, /身長158cm、バストは標準的なCカップ相当（81cm）、ウエストは細め（57cm）、ヒップは標準的（82cm）/);
  assert.equal((prompt.match(/81cm/g) || []).length, 1);
  const sentences = prompt.split("。").map((item) => item.trim()).filter(Boolean);
  assert.equal(new Set(sentences).size, sentences.length);
});

test("目と口の外見項目は維持し、特殊な目が無しなら省略する", () => {
  assert.deepEqual(catalog.faceFields.map(({ id }) => id), ["eyeShape", "eyeExpression", "specialEyeExpression", "eyeColor", "mouthExpression"]);
  assert.equal(field("eyeShape").options.length, 6);
  assert.equal(field("eyeExpression").options.length, 18);
  assert.equal(field("specialEyeExpression").options.length, 10);
  assert.equal(field("mouthExpression").options.length, 24);
  assert.equal(field("specialEyeExpression").options[0].value, "");
  const none = catalog.generatePrompt(catalog.defaults);
  const heartValue = field("specialEyeExpression").options[8].value;
  assert.doesNotMatch(none, /ハート形/);
  assert.match(catalog.generatePrompt({ ...catalog.defaults, specialEyeExpression: heartValue }), /ハート形/);
});

test("上下分離だけ衣服の無しを許し、上下一体には無しを出さない", () => {
  const separate = catalog.outfitFields({ ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "auto", bottomDesign: "auto" });
  assert.deepEqual(separate.find(({ id }) => id === "topDesign").options.slice(0, 2).map(optionValue), ["none", "auto"]);
  assert.deepEqual(separate.find(({ id }) => id === "bottomDesign").options.slice(0, 2).map(optionValue), ["none", "auto"]);

  const onepiece = catalog.outfitFields({ ...catalog.defaults, outfitType: "stage", outfitStructure: "onepiece", outfitDesign: "auto" });
  const onepieceOptions = onepiece.find(({ id }) => id === "outfitDesign").options;
  assert.equal(onepieceOptions[0].value, "auto");
  assert.ok(!onepieceOptions.some(({ value }) => value === "none"));
});

test("下着は衣服が無ければ見える衣装、衣服があれば内側として自然に出す", () => {
  assert.equal(upperUnderwearOptions.length, 13);
  assert.equal(lowerUnderwearOptions.length, 13);
  const base = {
    ...catalog.defaults,
    outfitType: "casual", outfitStructure: "separate",
    upperUnderwear: "bralette", lowerUnderwear: "normal_panties",
  };
  const only = catalog.generatePrompt({ ...base, topDesign: "none", bottomDesign: "none" });
  assert.match(only, /ホワイトのブラレット/);
  assert.match(only, /ホワイトのノーマルショーツ/);
  assert.doesNotMatch(only, /下着として/);

  const under = catalog.generatePrompt({ ...base, topDesign: "auto", bottomDesign: "auto" });
  assert.match(under, /下着として[^。]*ホワイトのブラレット/);
  assert.match(under, /下着として[^。]*ホワイトのノーマルショーツ/);
});

test("下着と重複する旧衣装候補を除去する", () => {
  const tops = outfitCatalogs.casual_separate.tops.map(({ value }) => value);
  const bottoms = outfitCatalogs.casual_separate.bottoms.map(({ value }) => value);
  for (const id of ["casual_top_07", "casual_top_08", "casual_top_09", "casual_top_10", "casual_top_11", "casual_top_12", "casual_top_13", "casual_top_27", "casual_top_30", "casual_top_31"]) assert.ok(!tops.includes(id));
  for (const id of ["casual_bottom_19", "casual_bottom_20", "casual_bottom_21", "casual_bottom_22", "casual_bottom_44", "casual_bottom_45", "casual_bottom_46"]) assert.ok(!bottoms.includes(id));
});

test("衣装分類のUI用語を出さず、実際の衣服だけを自然に記述する", () => {
  const values = { ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "auto", bottomDesign: "auto" };
  const prompt = catalog.generatePrompt(values);
  assert.doesNotMatch(prompt, /衣装タイプは|衣装構成は|構成は|ステージ衣装向け|私服向け|上下一体衣装は|トップスデザイン|ボトムスデザイン|衣装デザイン/);
  assert.match(prompt, /デザインをおまかせにしたホワイトのトップス/);
  assert.match(prompt, /デザインをおまかせにしたチャコールグレーのボトムス/);
});

test("デザインや種類がおまかせでも選択色を衣装・下着・靴へ反映する", () => {
  const prompt = catalog.generatePrompt({
    ...catalog.defaults,
    outfitType: "casual", outfitStructure: "separate",
    outerwear: "auto", outerwearColor: "ブルー",
    topDesign: "auto", topColor: "レッド",
    bottomDesign: "auto", bottomColor: "グリーン",
    upperUnderwear: "auto", upperUnderwearColor: "ピンク",
    lowerUnderwear: "auto", lowerUnderwearColor: "パープル",
    shoe: "auto", shoeColor: "イエロー",
  });
  assert.match(prompt, /デザインをおまかせにしたブルーのアウター/);
  assert.match(prompt, /デザインをおまかせにしたレッドのトップス/);
  assert.match(prompt, /デザインをおまかせにしたグリーンのボトムス/);
  assert.match(prompt, /種類をおまかせにしたピンクの上半身用下着/);
  assert.match(prompt, /種類をおまかせにしたパープルの下半身用下着/);
  assert.match(prompt, /種類をおまかせにしたイエローの靴/);
});

test("全110色に加え衣装色だけ無しとおまかせを表示する", () => {
  assert.equal(catalog.paletteFor({ id: "hairColor" }).length, 110);
  assert.equal(catalog.paletteFor({ id: "topColor" }).length, 112);
  assert.deepEqual(catalog.paletteFor({ id: "topColor" }).slice(0, 2).map(([name]) => name), ["無し", "おまかせ"]);
});

test("統合保存はv2だけを現行キーとしプリセットキーを持たない", () => {
  assert.equal(appConfig.storageKey, "7days:unified:last-values:v2");
  assert.equal(appConfig.schemaVersion, "2");
  assert.ok(!Object.hasOwn(appConfig, "presetsKey"));
  assert.equal(legacyUnifiedKeys.storageKey, "7days:unified:last-values:v1");
  assert.equal(legacyUnifiedKeys.presetsKey, "7days:unified:presets:v1");
});

test("旧統合v1のB/Hを数値化し手動値としてv2へ安全に移行する", () => {
  const oldValues = {
    bust: "とても豊かなバスト（94cm相当）",
    hip: "豊かなヒップ（90cm相当）",
    hairstyle: catalog.defaults.hairstyle,
  };
  const oldPreset = JSON.stringify({ 旧設定: oldValues });
  const { map, storage } = storageDouble([
    [legacyUnifiedKeys.storageKey, JSON.stringify(oldValues)],
    [legacyUnifiedKeys.presetsKey, oldPreset],
    [appConfig.schemaKey, "1"],
  ]);

  assert.equal(prepareUnifiedStorage(storage), true);
  const migrated = JSON.parse(map.get(appConfig.storageKey));
  assert.deepEqual(
    Object.fromEntries(["height", "bust", "waist", "hip", "personFeature", "bustLinked", "waistLinked", "hipLinked"].map((key) => [key, migrated[key]])),
    { height: 158, bust: 94, waist: 57, hip: 90, personFeature: "クール", bustLinked: false, waistLinked: true, hipLinked: false },
  );
  assert.equal(map.get(legacyUnifiedKeys.storageKey), JSON.stringify(oldValues));
  assert.equal(map.get(legacyUnifiedKeys.presetsKey), oldPreset);
  const snapshot = JSON.stringify([...map]);
  assert.equal(prepareUnifiedStorage(storage), false);
  assert.equal(JSON.stringify([...map]), snapshot);
});

test("旧定性B/Hの全4区分を承認済み代表値へ変換する", () => {
  const cases = [
    ["控えめなバスト（79cm相当）", "控えめなヒップ（80cm相当）", 79, 80],
    ["標準的なバスト（84cm相当）", "標準的なヒップ（85cm相当）", 84, 85],
    ["豊かなバスト（89cm相当）", "豊かなヒップ（90cm相当）", 89, 90],
    ["とても豊かなバスト（94cm相当）", "とても豊かなヒップ（95cm相当）", 94, 95],
  ];
  for (const [bust, hip, expectedBust, expectedHip] of cases) {
    const migrated = migrateUnifiedV1Values({ bust, hip });
    assert.equal(migrated.bust, expectedBust);
    assert.equal(migrated.hip, expectedHip);
    assert.equal(migrated.bustLinked, false);
    assert.equal(migrated.hipLinked, false);
  }
});

test("旧写真v8は衣装・下着を移行し、旧データを削除しない", () => {
  const legacy = { outfitType: "casual", outfitStructure: "separate", topDesign: "casual_top_12", topColor: "ピンク" };
  const migratedDirect = migrateLegacyPhotoValues(legacy);
  assert.equal(migratedDirect.topDesign, "none");
  assert.equal(migratedDirect.upperUnderwear, "bralette");

  const { map, storage } = storageDouble([[legacyPhotoKeys.storageKey, JSON.stringify(legacy)]]);
  assert.equal(prepareUnifiedStorage(storage), true);
  assert.ok(map.has(legacyPhotoKeys.storageKey));
  assert.ok(map.has(appConfig.storageKey));
});

test("全選択肢の総当たり出力に未定義値、改行、UI分類語がない", () => {
  const base = { ...catalog.defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "auto", bottomDesign: "auto" };
  for (const item of catalog.visibleFields(base)) {
    if (item.type === "color" || item.type === "range" || !item.options) continue;
    for (const option of item.options) {
      const prompt = catalog.generatePrompt({ ...base, [item.id]: optionValue(option) });
      assert.doesNotMatch(prompt, /undefined|null|[\r\n]/);
      assert.doesNotMatch(prompt, /衣装タイプは|衣装構成は|ステージ衣装向け|私服向け/);
    }
  }
});
