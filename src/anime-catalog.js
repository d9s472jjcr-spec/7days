import {
  bangsOptions,
  commonPalette,
  defaults as photoDefaults,
  hairFields as photoHairFields,
  hairstyleOptions,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  personFields,
  presetMessage,
  resetOutfitSelection,
  shootingFields as photoShootingFields,
} from "./catalog.js?v=7.0.0";
import {
  outfitCatalogFor,
  outfitChoice,
  outfitDecorationOptions,
  outfitLabel,
  outfitStructureOptions,
  outfitTypeOptions,
  outerwearOptions,
  shoeOptions,
} from "./outfits.js?v=7.0.0";
import {
  animeCameraAngleOptions,
  animeExpressionOptions,
  animeFramingOptions,
  animeLightingOptions,
  animePoseOptions,
  eyeShapeOptions,
  eyeShapePriorityLine,
} from "./anime-shooting.js?v=7.0.0";

export const fixedLines = [
  "画像を新規生成する。",
  "被写体は、架空の20代の成人日本人女性1人とする。",
];

export const contactShadowLine = "足元に画風と光源に合う自然な接地影を入れる。";
export const fixedClosingLines = [
  "縦横比は、縦長の9:16とする。",
  "文字、ロゴ、透かし、余分な人物、不要な小物は入れない。",
];

const sharedShootingOptions = (id) => photoShootingFields.find((field) => field.id === id).options;

export const cameraDirectionOptions = sharedShootingOptions("cameraDirection");
export const backgroundOptions = sharedShootingOptions("background");

export const hairFields = [
  ...photoHairFields.slice(0, 3),
  { id: "eyeShape", label: "目の形", section: "髪・瞳", group: "eye", options: eyeShapeOptions },
  { ...photoHairFields[3], group: "eye" },
];

export const shootingFields = [
  { id: "expression", label: "表情", section: "撮影設定", group: "presentation", options: animeExpressionOptions },
  { id: "pose", label: "ポーズ", section: "撮影設定", group: "presentation", options: animePoseOptions },
  { id: "framing", label: "構図", section: "撮影設定", group: "camera", options: animeFramingOptions },
  { id: "cameraAngle", label: "カメラアングル", section: "撮影設定", group: "camera", options: animeCameraAngleOptions },
  { id: "cameraDirection", label: "撮影方向", section: "撮影設定", group: "camera", options: cameraDirectionOptions },
  { id: "background", label: "背景", section: "撮影設定", group: "environment", options: backgroundOptions },
  { id: "lighting", label: "照明", section: "撮影設定", group: "environment", options: animeLightingOptions },
];

export const fields = [...personFields, ...hairFields, ...shootingFields];

export const defaults = {
  ...photoDefaults,
  eyeShape: eyeShapeOptions[0].value,
  expression: animeExpressionOptions[0].value,
  pose: animePoseOptions[0].value,
  framing: animeFramingOptions[0].value,
  cameraAngle: animeCameraAngleOptions[0].value,
  cameraDirection: cameraDirectionOptions[0].value,
  background: backgroundOptions[0].value,
  lighting: animeLightingOptions[0].value,
};

export function visibleFields(values) {
  return [...personFields, ...outfitFields(values), ...hairFields, ...shootingFields];
}

function appendOutfitLines(lines, values) {
  const catalog = outfitCatalogFor(values.outfitType, values.outfitStructure);
  if (!catalog) return;

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

export function generatePrompt(values) {
  const lines = [...fixedLines];
  lines.push(`バストは、${values.bust}とする。`);
  lines.push(`ヒップは、${values.hip}とする。`);
  appendOutfitLines(lines, values);
  lines.push(`髪色は、${values.hairColor}とする。`);
  lines.push(`髪型は、${values.hairstyle}とする。`);
  lines.push(`前髪は、${values.bangs}とする。`);
  lines.push(values.eyeShape);
  lines.push(eyeShapePriorityLine);
  lines.push(`瞳の色は、${values.eyeColor}とする。`);
  shootingFields.forEach((field) => lines.push(values[field.id]));
  lines.push(fixedClosingLines[0]);
  if (animeFramingOptions.slice(0, 2).some(({ value }) => value === values.framing)) lines.push(contactShadowLine);
  lines.push(fixedClosingLines[1]);
  return lines.join(" ").replace(/[\r\n]+/g, " ").replace(/[ \t]+/g, " ").trim();
}

export {
  bangsOptions,
  commonPalette,
  hairstyleOptions,
  normalizeOutfitState,
  outfitFields,
  paletteFor,
  personFields,
  presetMessage,
  resetOutfitSelection,
};

export {
  animeCameraAngleOptions,
  animeExpressionOptions,
  animeFramingOptions,
  animeLightingOptions,
  animePoseOptions,
  eyeShapeOptions,
  eyeShapePriorityLine,
};

export {
  outfitDecorationOptions,
  outfitStructureOptions,
  outfitTypeOptions,
  outerwearOptions,
  shoeOptions,
};
