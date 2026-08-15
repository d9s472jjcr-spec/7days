import test from "node:test";
import assert from "node:assert/strict";
import {
  animeCameraAngleOptions,
  animeExpressionOptions,
  animeFramingOptions,
  animeLightingOptions,
  animePoseOptions,
  backgroundOptions,
  bangsOptions,
  cameraDirectionOptions,
  commonPalette,
  contactShadowLine,
  defaults,
  eyeShapeOptions,
  eyeShapePriorityLine,
  fields,
  fixedClosingLines,
  fixedLines,
  generatePrompt,
  hairFields,
  hairstyleOptions,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  personFields,
  resetOutfitSelection,
  shootingFields,
  visibleFields,
} from "../src/anime-catalog.js";
import {
  bangsOptions as photoBangsOptions,
  commonPalette as photoPalette,
  hairFields as photoHairFields,
  hairstyleOptions as photoHairstyleOptions,
  shootingFields as photoShootingFields,
} from "../src/catalog.js";
import { outfitCatalogs, outerwearOptions, shoeOptions } from "../src/outfits.js";

const stageSeparate = {
  ...defaults,
  outfitType: "stage",
  outfitStructure: "separate",
  topDesign: "stage_top_01",
  bottomDesign: "stage_bottom_01",
};

test("アニメ版の固定文は画風を含まない確定2文だけである", () => {
  assert.deepEqual(fixedLines, [
    "画像を新規生成する。",
    "被写体は、架空の20代の成人日本人女性1人とする。",
  ]);
  const prompt = generatePrompt(defaults);
  assert.doesNotMatch(prompt, /容姿は|体型は|フォトリアル|アニメ|画風を|画風は/);
  assert.ok(prompt.startsWith(fixedLines.join(" ")));
});

test("髪・目の項目は前髪の後に目の形、続けて瞳色を置く", () => {
  assert.deepEqual(hairFields.map(({ id }) => id), ["hairColor", "hairstyle", "bangs", "eyeShape", "eyeColor"]);
  const visible = visibleFields(defaults).map(({ id }) => id);
  assert.ok(visible.indexOf("bangs") < visible.indexOf("eyeShape"));
  assert.ok(visible.indexOf("eyeShape") < visible.indexOf("eyeColor"));
  const prompt = generatePrompt(defaults);
  assert.ok(prompt.indexOf("前髪は、") < prompt.indexOf("目の形は、"));
  assert.ok(prompt.indexOf("目の形は顔立ちの基礎") < prompt.indexOf("瞳の色は、"));
});

test("目の形はアーモンド型を初期値とする確定6種類である", () => {
  assert.deepEqual(eyeShapeOptions.map(({ label }) => label), ["アーモンド型", "丸目", "切れ長", "つり目", "たれ目", "三白眼"]);
  assert.equal(defaults.eyeShape, eyeShapeOptions[0].value);
  assert.match(eyeShapeOptions[0].value, /アーモンド型/);
  assert.match(eyeShapeOptions[1].value, /縦の開きを広く取り、丸みを強調/);
  assert.match(eyeShapeOptions[2].value, /横幅を強調し、縦の開きを控え/);
  assert.match(eyeShapeOptions[3].value, /目尻を目頭より高く/);
  assert.match(eyeShapeOptions[4].value, /目尻を目頭より低く/);
  assert.match(eyeShapeOptions[5].value, /虹彩の左右と下側に白目/);
  assert.match(eyeShapeOptions[5].value, /虹彩、瞳孔、ハイライトは保持する/);
  assert.match(eyeShapePriorityLine, /表情による眉、まぶた、視線、目の開閉の変化を優先/);
});

test("アニメ版撮影設定は確定順・件数・初期値を持つ", () => {
  const byId = Object.fromEntries(shootingFields.map((field) => [field.id, field]));
  assert.deepEqual(shootingFields.map(({ id }) => id), ["expression", "pose", "framing", "cameraAngle", "cameraDirection", "background", "lighting"]);
  assert.deepEqual(
    [byId.expression.options.length, byId.pose.options.length, byId.framing.options.length, byId.cameraAngle.options.length, byId.cameraDirection.options.length, byId.background.options.length, byId.lighting.options.length],
    [16, 45, 7, 7, 4, 19, 32],
  );
  assert.deepEqual(
    [byId.expression.options[0].label, byId.pose.options[0].label, byId.framing.options[0].label, byId.cameraAngle.options[0].label, byId.cameraDirection.options[0].label, byId.background.options[0].label, byId.lighting.options[0].label],
    ["真剣", "自然な直立姿勢", "全身", "目線の高さ", "正面", "純白のスタジオ", "ニュートラル拡散光"],
  );
  shootingFields.forEach((field) => {
    assert.equal(defaults[field.id], field.options[0].value, field.id);
    assert.equal(new Set(field.options.map(({ value }) => value)).size, field.options.length, field.id);
    assert.ok(field.options.every(({ value, label }) => value.endsWith("。") && label), field.id);
  });
});

test("表情16種類のUI順を固定する", () => {
  assert.deepEqual(animeExpressionOptions.map(({ label }) => label), [
    "真剣", "微笑み", "目を閉じた笑顔", "怒り", "照れ", "ジト目", "半目", "眠そう",
    "ぐるぐる目", "ハイライトなし目", "涙目", "ウインク", "点目", "キラキラ目", "白目", "しいたけ目",
  ]);
});

test("ポーズ45種類のUI順を固定する", () => {
  assert.deepEqual(animePoseOptions.map(({ label }) => label), [
    "自然な直立姿勢", "片脚重心の立ち姿", "片膝を軽く曲げる", "片手を腰に添える", "両手を腰に添える",
    "両手を前で組む", "腕を軽く組む", "片手を胸元に添える", "両手を胸元で組む", "片手を軽く上げる",
    "大きく手を振る", "敬礼", "顔横ピース", "両手ピース", "正面を指さす", "片手を差し出す",
    "両手を頬に添える", "口元を隠す", "両腕を大きく広げる", "ガッツポーズ", "両手を後ろで組み前傾",
    "自分の胸をつかむ", "臀部をつかんで外側へ引く", "椅子に浅く座る", "椅子に深く座り脚を組んで頬杖",
    "床にあぐら", "床に片膝を立てて座る", "深くしゃがむ", "片膝立ち", "正座", "床に座り膝を押さえて開脚",
    "仰向けで脚を上げ足首を交差", "片脚を後ろへ跳ね上げる", "両足ジャンプ", "走り出す", "前方へ走る",
    "大きく踏み込む", "スキップ", "片脚跳び", "着地直後", "片腕を高く上げたダンス",
    "両腕を広げたダンス", "ターン", "正面キック", "横キック",
  ]);
  assert.deepEqual(animePoseOptions.find(({ label }) => label === "椅子に浅く座る"), {
    value: "人物は椅子の前方へ浅く腰掛け、背筋を自然に伸ばす。",
    label: "椅子に浅く座る",
  });
});

test("構図・カメラアングル・照明のUI順を固定する", () => {
  assert.deepEqual(animeFramingOptions.map(({ label }) => label), ["全身", "全身遠景", "太もも上", "腰上", "バストアップ", "肩上", "顔アップ"]);
  assert.deepEqual(animeCameraAngleOptions.map(({ label }) => label), ["目線の高さ", "やや上", "俯瞰", "真上", "やや下", "ローアングル", "床面"]);
  assert.deepEqual(animeLightingOptions.map(({ label }) => label), [
    "ニュートラル拡散光", "柔らかな自然光", "三点照明", "バタフライ", "曇天拡散光", "正面ソフト", "上方ソフト", "室内環境光",
    "ハイキー", "大型ソフトボックス", "明るい窓光", "白色バウンス", "朝日", "真昼", "ゴールデンアワー", "水面反射",
    "ローキー", "レンブラント", "サイド", "リム逆光", "月光", "ブルーアワー", "ろうそく", "画面光",
    "ステージ", "二色照明", "ゴボ", "ネオン", "木漏れ日", "ブラインド", "アンダー", "プリズム",
  ]);
});

test("撮影方向と背景は写真版の確定候補を共有する", () => {
  const photoDirection = photoShootingFields.find(({ id }) => id === "cameraDirection").options;
  const photoBackground = photoShootingFields.find(({ id }) => id === "background").options;
  assert.deepEqual(cameraDirectionOptions, photoDirection);
  assert.deepEqual(backgroundOptions, photoBackground);
});

test("衣装・色・髪型・前髪は写真版と同じデータを共有する", () => {
  assert.deepEqual(commonPalette, photoPalette);
  assert.deepEqual(hairstyleOptions, photoHairstyleOptions);
  assert.deepEqual(bangsOptions, photoBangsOptions);
  assert.equal(commonPalette.length, 110);
  assert.equal(hairstyleOptions.length, 26);
  assert.equal(bangsOptions.length, 9);
  assert.equal(Object.values(outfitCatalogs).flatMap((catalog) => Object.values(catalog).flat()).length, 211);
  assert.equal(outerwearOptions.length, 11);
  assert.equal(shoeOptions.length, 17);
});

test("アニメ版の初期指示文は1行で21文、固定順で出力する", () => {
  const prompt = generatePrompt(defaults);
  assert.equal(prompt.match(/。/g).length, 21);
  assert.doesNotMatch(prompt, /[\r\n]/);
  assert.match(prompt, /バストは、豊かなバスト（89cm相当）とする。 ヒップは、標準的なヒップ（85cm相当）とする。/);
  assert.match(prompt, /髪色は、ナチュラルブラウンとする。 髪型は、顎丈のナチュラルボブとする。 前髪は、流し前髪とする。 目の形は、/);
  assert.match(prompt, /縦横比は、縦長の9:16とする。 足元に画風と光源に合う自然な接地影を入れる。 文字、ロゴ、透かし、余分な人物、不要な小物は入れない。$/);
});

test("衣装選択時も写真版と同じ衣装規則・順序を使う", () => {
  const prompt = generatePrompt(stageSeparate);
  assert.equal(prompt.match(/。/g).length, 27);
  assert.match(prompt, /衣装タイプは、ステージ衣装とする。 構成は、上下分離とする。 トップスは、ホワイトのシャツカラーのステージシャツとする。 ボトムスは、チャコールグレーのハイウエスト・ミニ丈 フレアスカートとする。 装飾内容は衣装に合わせて補完し、量は控えめとする。 靴は、ブラックのパンプスとする。/);
  const onepiece = normalizeOutfitState({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" });
  assert.equal(generatePrompt(onepiece).match(/。/g).length, 26);
});

test("全身と全身遠景だけアニメ用接地影を出力する", () => {
  assert.equal(contactShadowLine, "足元に画風と光源に合う自然な接地影を入れる。");
  animeFramingOptions.slice(0, 2).forEach(({ value }) => assert.match(generatePrompt({ ...defaults, framing: value }), /画風と光源に合う自然な接地影/));
  animeFramingOptions.slice(2).forEach(({ value }) => assert.doesNotMatch(generatePrompt({ ...defaults, framing: value }), /接地影/));
});

test("特殊表情は目の形の一般規則より後へ出力する", () => {
  for (const label of ["ぐるぐる目", "ハイライトなし目", "点目", "白目", "しいたけ目"]) {
    const expression = animeExpressionOptions.find((option) => option.label === label).value;
    const prompt = generatePrompt({ ...defaults, expression });
    assert.ok(prompt.indexOf(eyeShapePriorityLine) < prompt.indexOf(expression), label);
  }
});

test("全項目・全選択肢の指示文は未定義値・改行を含まず句点で終わる", () => {
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
    assert.doesNotMatch(prompt, /undefined|null|[\r\n]/);
    assert.match(prompt, /。$/);
  });
});

test("全固定フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields) {
    if (field.type === "color") assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    else assert.ok(field.options.some((option) => (typeof option === "string" ? option : option.value) === defaults[field.id]), field.id);
  }
});

test("固定末尾は9対16と共通禁止文だけである", () => {
  assert.deepEqual(fixedClosingLines, [
    "縦横比は、縦長の9:16とする。",
    "文字、ロゴ、透かし、余分な人物、不要な小物は入れない。",
  ]);
});

test("写真版に目の形項目を逆流させない", () => {
  assert.ok(!photoHairFields.some(({ id }) => id === "eyeShape"));
  assert.ok(!photoShootingFields.some(({ id }) => id === "eyeShape"));
  assert.ok(!photoBangsOptions.includes("三白眼"));
});

test("衣装タイプ未選択時は衣装タイプだけを表示する", () => {
  assert.deepEqual(outfitFields(defaults).map(({ id }) => id), ["outfitType"]);
});
