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
  promptLineForShooting,
  resetOutfitSelection,
  shootingFields,
} from "../src/catalog.js";
import { outfitCatalogs, outerwearOptions, shoeOptions } from "../src/outfits.js";

const noOutfitBaseline = "画像を新規生成する。 被写体は、架空の20代の成人日本人女性1人とする。 容姿は、美人とする。 体型は、脚の長いモデル体型とする。 バストは、豊かなバスト（89cm相当）とする。 ヒップは、標準的なヒップ（85cm相当）とする。 髪色は、ナチュラルブラウンとする。 髪型は、顎丈のナチュラルボブとする。 前髪は、流し前髪とする。 瞳の色は、ナチュラルブラウンとする。 表情は真剣とし、口元を自然に閉じ、目元を落ち着かせる。 自然に直立する。 撮影構図は全身とし、頭頂から足先までを画面内に収める。頭、手、足の周囲に余白を確保し、身体の一部を見切らない。 カメラは被写体の目線の高さに置き、水平に撮影する。 撮影方向は、人物の正面からとする。 撮影背景は、純白のシームレススタジオ背景とする。 照明には柔らかなニュートラルの拡散光を使用し、全身を均一に照らす。 縦横比は、縦長の9:16とする。 全身構図では、足元にごく薄い自然な接地影を入れる。 文字、ロゴ、透かし、余分な人物、不要な小物は入れない。";

const stageSeparate = {
  ...defaults,
  outfitType: "stage",
  outfitStructure: "separate",
  topDesign: "stage_top_01",
  bottomDesign: "stage_bottom_01",
};

test("初期状態は衣装未選択の21文を改行なしで出力する", () => {
  assert.equal(generatePrompt(defaults), noOutfitBaseline);
  assert.equal(generatePrompt(defaults).match(/。/g).length, 21);
  assert.doesNotMatch(generatePrompt(defaults), /[\r\n]/);
});

test("衣装タイプ未選択では衣装タイプだけを表示する", () => {
  assert.deepEqual(outfitFields(defaults).map(({ id }) => id), ["outfitType"]);
});

test("衣装構成未選択では衣装タイプと衣装構成だけを表示する", () => {
  assert.deepEqual(outfitFields({ ...defaults, outfitType: "stage" }).map(({ id }) => id), ["outfitType", "outfitStructure"]);
});

test("上下分離は分類・上下デザイン・色・装飾・靴を自然な順序で出力する", () => {
  const prompt = generatePrompt(stageSeparate);
  assert.match(prompt, /衣装タイプは、ステージ衣装とする。 構成は、上下分離とする。 トップスは、ホワイトのシャツカラーのステージシャツとする。 ボトムスは、チャコールグレーのハイウエスト・ミニ丈 フレアスカートとする。 装飾内容は衣装に合わせて補完し、量は控えめとする。 靴は、ブラックのパンプスとする。/);
});

test("上下一体は衣装デザインと衣装色を出力する", () => {
  const values = resetOutfitSelection({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  const prompt = generatePrompt(values);
  assert.match(prompt, /衣装タイプは、ステージ衣装とする。 構成は、上下一体とする。 衣装は、ホワイトのハイウエスト・ミニ丈 フィット＆フレアドレスとする。/);
  assert.doesNotMatch(prompt, /トップスは|ボトムスは/);
});

test("装飾無しは省略せず明示する", () => {
  assert.match(generatePrompt({ ...stageSeparate, outfitDecoration: "無し" }), /装飾は付けない。/);
});

test("アウターは無しなら省略し、選択時は色付きで上下より前へ出力する", () => {
  assert.doesNotMatch(generatePrompt(stageSeparate), /アウターは/);
  const prompt = generatePrompt({ ...stageSeparate, outerwear: "cropped_jacket", outerwearColor: "レッド" });
  assert.match(prompt, /構成は、上下分離とする。 アウターは、レッドのウエスト上丈のクロップドジャケットとする。 トップスは/);
});

test("裸足は靴色を出力しない", () => {
  const prompt = generatePrompt({ ...stageSeparate, shoe: "barefoot", shoeColor: "レッド" });
  assert.match(prompt, /足元は裸足とする。/);
  assert.doesNotMatch(prompt, /靴は|レッドの裸足/);
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
  assert.match(prompt, /装飾内容は衣装に合わせて補完し、量は華美とする。/);
  assert.ok(!prompt.includes("容姿の印象に合わせて"));
});

test("4系統は確定した拡張候補数を持つ", () => {
  assert.equal(outfitCatalogs.stage_separate.tops.length, 24);
  assert.equal(outfitCatalogs.stage_separate.bottoms.length, 44);
  assert.equal(outfitCatalogs.casual_separate.tops.length, 33);
  assert.equal(outfitCatalogs.casual_separate.bottoms.length, 50);
  assert.equal(outfitCatalogs.stage_onepiece.outfits.length, 24);
  assert.equal(outfitCatalogs.casual_onepiece.outfits.length, 36);
  assert.equal(Object.values(outfitCatalogs).flatMap((catalog) => Object.values(catalog).flat()).length, 211);
  assert.equal(outerwearOptions.length, 11);
  assert.equal(shoeOptions.length, 17);
});

test("採用した私服コンセプト衣装8種類だけを収録する", () => {
  const labels = outfitCatalogs.casual_onepiece.outfits.map(({ label }) => label);
  for (const label of ["ゴシックロリータドレス", "セーラーワンピース", "メイドドレス", "ヴィクトリアンドレス", "フラッパードレス", "ロカビリードレス", "チャイナドレス（旗袍）", "振袖"]) {
    assert.ok(labels.includes(label), label);
  }
  const stageLabels = outfitCatalogs.stage_onepiece.outfits.map(({ label }) => label);
  for (const rejected of ["ミリタリー制服ドレス", "スチームパンクドレス", "サイバーパンクボディスーツ", "チアリーダーワンピース", "バレエチュチュ", "フィギュアスケートドレス", "社交ダンスドレス", "フラメンコドレス"]) {
    assert.ok(!stageLabels.includes(rejected), rejected);
  }
});

test("省略されやすいUI名にも衣装種別を明記する", () => {
  for (const label of ["フレアミニスカート", "ショートジャンプスーツ", "ストレートデニムパンツ", "ミディプリーツスカート", "ウルトラハイウエスト・ミニスカート"]) {
    assert.ok(Object.values(outfitCatalogs).flatMap((catalog) => Object.values(catalog).flat()).some((item) => item.label === label), label);
  }
});

test("系統選択時は一覧1番と指定色を初期選択する", () => {
  const separate = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "separate" });
  assert.equal(separate.topDesign, outfitCatalogs.casual_separate.tops[0].value);
  assert.equal(separate.bottomDesign, outfitCatalogs.casual_separate.bottoms[0].value);
  assert.equal(separate.topColor, "ホワイト");
  assert.equal(separate.bottomColor, "チャコールグレー");
  assert.equal(separate.outerwear, "none");
  assert.equal(separate.shoe, "pumps");
  assert.equal(separate.shoeColor, "ブラック");
  const onepiece = resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" });
  assert.equal(onepiece.outfitDesign, outfitCatalogs.casual_onepiece.outfits[0].value);
  assert.equal(onepiece.outfitColor, "ホワイト");
});

test("無効な保存値は現行カタログの1番へ補正する", () => {
  const restored = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "separate", topDesign: "deleted", bottomDesign: "deleted" });
  assert.equal(restored.topDesign, "stage_top_01");
  assert.equal(restored.bottomDesign, "stage_bottom_01");
});

test("表情と必須の撮影設定は定められた順で追記する", () => {
  const [expression, pose, framing, cameraAngle, cameraDirection, background, lighting] = shootingFields.map((field) => field.options.at(-1).value);
  const prompt = generatePrompt({ ...defaults, expression, pose, framing, cameraAngle, cameraDirection, background, lighting });
  const shootingValues = [expression, pose, framing, cameraAngle, cameraDirection, background, lighting];
  const expected = shootingValues.map((value, index) => promptLineForShooting(shootingFields[index].id, value)).concat(["縦横比は、縦長の9:16とする。", "文字、ロゴ、透かし、余分な人物、不要な小物は入れない。"]);
  let previousIndex = -1;
  for (const part of expected) {
    const currentIndex = prompt.indexOf(part);
    assert.ok(currentIndex > previousIndex, part);
    previousIndex = currentIndex;
  }
});

test("容姿と体型はUIから廃止し固定文として出力する", () => {
  assert.deepEqual(personFields.map(({ id }) => id), ["bust", "hip"]);
  assert.ok(!fields.some(({ id }) => id === "beauty" || id === "body"));
  assert.deepEqual(fixedLines.slice(-2), ["容姿は、美人とする。", "体型は、脚の長いモデル体型とする。"]);
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
  assert.equal(generatePrompt(stageSeparate).match(/。/g).length, 27);
  const stageOnepiece = normalizeOutfitState({ ...defaults, outfitType: "stage", outfitStructure: "onepiece" });
  assert.equal(generatePrompt(stageOnepiece).match(/。/g).length, 26);
});

test("撮影設定は承認済みの必須候補だけを持つ", () => {
  const byId = Object.fromEntries(shootingFields.map((field) => [field.id, field]));
  assert.deepEqual(shootingFields.map(({ id }) => id), ["expression", "pose", "framing", "cameraAngle", "cameraDirection", "background", "lighting"]);
  assert.deepEqual([byId.expression.options.length, byId.pose.options.length, byId.framing.options.length, byId.cameraAngle.options.length, byId.cameraDirection.options.length, byId.background.options.length, byId.lighting.options.length], [4, 12, 4, 3, 4, 19, 16]);
  assert.ok(shootingFields.every((field) => !field.optional && field.options.every((option) => option.value.endsWith("。"))));
  assert.equal(byId.pose.options[0].label, "自然な直立姿勢");
  assert.deepEqual(byId.pose.options.find(({ label }) => label === "椅子に浅く座る"), {
    value: "人物は椅子の前方へ浅く腰掛け、背筋を自然に伸ばす。",
    label: "椅子に浅く座る",
  });
  assert.equal(
    promptLineForShooting("pose", byId.pose.options.find(({ label }) => label === "椅子に浅く座る").value),
    "椅子の前方へ浅く腰掛け、背筋を自然に伸ばす。",
  );
  assert.deepEqual(byId.pose.options.slice(-3), [
    { value: "人物は椅子に深く腰掛けて脚を組み、片手で自然に頬杖をつく。", label: "椅子に深く座り、脚を組んで頬杖" },
    { value: "人物は床にあぐらをかいて座り、上体を自然に起こす。", label: "床にあぐらをかいて座る" },
    { value: "人物は床に座って片膝を立て、もう片方の脚は自然にまっすぐ人物の正面へ伸ばす。", label: "床に片膝を立てて座る" },
  ]);
  assert.equal(byId.framing.options[0].label, "全身");
  assert.equal(byId.cameraAngle.options[0].label, "目線の高さ");
  assert.deepEqual(byId.cameraDirection.options.map(({ label }) => label), ["正面", "斜め45度", "真横", "背面"]);
  assert.equal(defaults.cameraDirection, byId.cameraDirection.options[0].value);
  assert.equal(byId.background.options[0].label, "純白のスタジオ");
  assert.equal(byId.lighting.options[0].label, "ニュートラルな拡散照明");
});

test("12種類のポーズは承認済みの最小限の手・腕指定だけを持つ", () => {
  const pose = shootingFields.find(({ id }) => id === "pose");
  assert.deepEqual(pose.options, [
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
  ]);
  for (const label of ["自然な直立姿勢", "片脚重心の立ち姿", "椅子に浅く座る", "床にあぐらをかいて座る", "床に片膝を立てて座る"]) {
    assert.doesNotMatch(pose.options.find((option) => option.label === label).value, /腕|手/, label);
  }
});

test("カメラアングルは高さ、撮影方向は見る方向だけを指定する", () => {
  const byId = Object.fromEntries(shootingFields.map((field) => [field.id, field]));
  byId.cameraAngle.options.forEach(({ value }) => assert.doesNotMatch(value, /正面|真横|背中|45度/));
  byId.cameraDirection.options.forEach(({ value }) => assert.doesNotMatch(value, /目線|見下ろし|あおり|高い|低い/));
  assert.deepEqual(byId.cameraDirection.options.map(({ value }) => value), [
    "撮影方向は、人物の正面からとする。",
    "撮影方向は、人物の正面に対して斜め45度からとする。",
    "撮影方向は、人物の真横からとする。",
    "撮影方向は、人物の背中側からとする。",
  ]);
});

test("全身構図だけ接地影を出力する", () => {
  assert.match(generatePrompt(defaults), /ごく薄い自然な接地影/);
  const framing = shootingFields.find(({ id }) => id === "framing");
  framing.options.slice(1).forEach(({ value }) => assert.doesNotMatch(generatePrompt({ ...defaults, framing: value }), /接地影/));
});

test("生成結果は改行を含まず句点で終わる", () => {
  const samples = [defaults, stageSeparate, resetOutfitSelection({ ...defaults, outfitType: "casual", outfitStructure: "onepiece" })];
  samples.forEach((values) => {
    const prompt = generatePrompt(values);
    assert.doesNotMatch(prompt, /[\r\n]/);
    assert.match(prompt, /。$/);
  });
});

test("全項目・全選択肢の出力は未定義値を含まず句点で終わる", () => {
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
    assert.doesNotMatch(prompt, /[\r\n]/);
    assert.match(prompt, /。$/);
  });
});

test("全固定フィールドの初期値は有効な選択肢に含まれる", () => {
  for (const field of fields.filter((item) => !item.optional)) {
    if (field.type === "color") assert.ok(paletteFor(field).some(([name]) => name === defaults[field.id]), field.id);
    else assert.ok(field.options.some((option) => (typeof option === "string" ? option : option.value) === defaults[field.id]), field.id);
  }
});

test("衣装・アウター・靴・髪・瞳の色項目は同じ順序の共通110色を使う", () => {
  assert.equal(commonPalette.length, 110);
  assert.equal(new Set(commonPalette.map(([name]) => name)).size, 110);
  assert.ok(commonPalette.every(([, hex]) => /^#[0-9A-F]{6}$/.test(hex)));
  assert.deepEqual(commonPalette[0], ["ブラック", "#191A1D"]);
  assert.deepEqual(commonPalette[9], ["グラファイト", "#3B3E42"]);
  assert.deepEqual(commonPalette[12], ["ホワイト", "#F7F7F2"]);
  assert.deepEqual(commonPalette[26], ["ナチュラルブラウン", "#5A3F34"]);
  assert.deepEqual(commonPalette[98], ["スカイブルー", "#78B2CA"]);
  assert.deepEqual(commonPalette[109], ["ライラック", "#B9A1D0"]);
  for (const color of ["ピュアホワイト", "マホガニーブラウン", "バーミリオン", "柿色", "ゴールド", "エメラルドグリーン", "ウルトラマリンブルー", "モーヴ"]) {
    assert.ok(commonPalette.some(([name]) => name === color), color);
  }

  const separateColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "separate", outerwear: "bolero" }).filter(({ type }) => type === "color");
  const onepieceColors = outfitFields({ ...defaults, outfitType: "stage", outfitStructure: "onepiece", outerwear: "bolero" }).filter(({ type }) => type === "color");
  const hairAndEyeColors = fields.filter(({ type }) => type === "color");
  const colorFields = [...separateColors, ...onepieceColors, ...hairAndEyeColors];
  assert.deepEqual(colorFields.map(({ id }) => id), ["outerwearColor", "topColor", "bottomColor", "shoeColor", "outerwearColor", "outfitColor", "shoeColor", "hairColor", "eyeColor"]);
  colorFields.forEach((field) => assert.strictEqual(paletteFor(field), commonPalette));
});

test("髪型26種類は短いUI名と正式な出力語句を持つ", () => {
  assert.equal(hairstyleOptions.length, 26);
  assert.deepEqual(hairstyleOptions.find(({ label }) => label === "ナチュラルボブ"), { value: "顎丈のナチュラルボブ", label: "ナチュラルボブ" });
  assert.deepEqual(hairstyleOptions.find(({ label }) => label === "ウェーブミディアム"), { value: "肩から鎖骨丈の強めのウェーブヘア", label: "ウェーブミディアム" });
  assert.ok(hairstyleOptions.every(({ value, label }) => value && label));
  assert.ok(hairstyleOptions.every(({ value, label }) => !/セミロング|ベリーロング/.test(`${value}${label}`)));
});

test("前髪は確定した9種類だけを持つ", () => {
  assert.deepEqual(bangsOptions, ["センターパート", "サイドパート", "かきあげ前髪", "流し前髪", "斜め前髪", "サイドバング", "ワイドバング", "ラウンドバング", "メカクレ"]);
  assert.ok(!bangsOptions.includes("前髪なし"));
  assert.ok(!bangsOptions.includes("ぱっつん前髪"));
});

test("固定条件は画風を指定せず必須条件を保持する", () => {
  assert.deepEqual(fixedLines, ["画像を新規生成する。", "被写体は、架空の20代の成人日本人女性1人とする。", "容姿は、美人とする。", "体型は、脚の長いモデル体型とする。"]);
  assert.doesNotMatch(generatePrompt(defaults), /フォトリアル|アニメ|画風/);
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
