import {
  bangsOptions,
  commonPalette,
  defaults,
  fixedLines,
  hairFields,
  hairstyleOptions,
  personFields,
  shootingFields,
} from "./catalog.js";
import {
  outfitCatalogs,
  outfitDecorationOptions,
  outfitStructureOptions,
  outfitTypeOptions,
} from "./outfits.js";

const sectionsRoot = document.querySelector("#catalog-sections");
const summaryRoot = document.querySelector("#catalog-summary");
const searchInput = document.querySelector("#catalog-search");
const resultText = document.querySelector("#catalog-result");
const emptyText = document.querySelector("#catalog-empty");

const option = (label, output = label, extra = {}) => ({ label, output, ...extra });
const plainOptions = (values, defaultValue) => values.map((value) => option(value.label ?? value, value.value || value, { isDefault: (value.value || value) === defaultValue }));

const clothingFields = [
  { section: "ステージ衣装 × 上下分離", label: "トップスデザイン", options: outfitCatalogs.stage_separate.tops.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
  { section: "ステージ衣装 × 上下分離", label: "ボトムスデザイン", options: outfitCatalogs.stage_separate.bottoms.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
  { section: "ステージ衣装 × 上下一体", label: "衣装デザイン", options: outfitCatalogs.stage_onepiece.outfits.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
  { section: "私服・その他衣装 × 上下分離", label: "トップスデザイン", options: outfitCatalogs.casual_separate.tops.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
  { section: "私服・その他衣装 × 上下分離", label: "ボトムスデザイン", options: outfitCatalogs.casual_separate.bottoms.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
  { section: "私服・その他衣装 × 上下一体", label: "衣装デザイン", options: outfitCatalogs.casual_onepiece.outfits.map((item, index) => option(item.label, item.fullName, { isDefault: index === 0 })) },
];

const sections = [
  { title: "固定出力", fields: [{ label: "固定文", note: "選択項目ではなく、すべての指示文へ常に出力", options: fixedLines.map((value) => option(value)) }] },
  { title: "人物", fields: personFields.map((field) => ({ label: field.label, note: `初期値：${defaults[field.id]}`, options: plainOptions(field.options, defaults[field.id]) })) },
  { title: "衣装の基本設定", fields: [
    { label: "衣装タイプ", note: "初期値なし。選択後に衣装構成を表示", options: plainOptions(outfitTypeOptions.filter((item) => item.value), defaults.outfitType) },
    { label: "衣装構成", note: "初期値なし。衣装タイプ選択後に表示", options: plainOptions(outfitStructureOptions.filter((item) => item.value), defaults.outfitStructure) },
    { label: "衣装装飾", note: `初期値：${defaults.outfitDecoration}`, options: plainOptions(outfitDecorationOptions, defaults.outfitDecoration) },
  ] },
  ...["ステージ衣装 × 上下分離", "ステージ衣装 × 上下一体", "私服・その他衣装 × 上下分離", "私服・その他衣装 × 上下一体"].map((title) => ({ title, fields: clothingFields.filter((field) => field.section === title) })),
  { title: "共通55色", fields: [{ label: "髪色・瞳・衣装色", note: "すべて同じ名称・順序・カラーチップを使用", type: "color", options: commonPalette.map(([label, hex]) => option(label, hex, { color: hex, isDefault: [defaults.hairColor, defaults.eyeColor, defaults.topColor, defaults.bottomColor, defaults.outfitColor].includes(label) })) }] },
  { title: "髪・瞳", fields: [
    { label: "髪型", note: `初期値：${hairstyleOptions.find((item) => item.value === defaults.hairstyle)?.label}`, options: hairstyleOptions.map((item) => option(item.label, item.value, { isDefault: item.value === defaults.hairstyle })) },
    { label: "前髪", note: `初期値：${defaults.bangs}`, options: plainOptions(bangsOptions, defaults.bangs) },
    { label: "髪色・瞳の色", note: "共通55色を参照", options: [option("共通55色", "髪色・瞳の色は同じカラーカタログから選択")] },
  ] },
  { title: "撮影設定", fields: shootingFields.map((field) => ({ label: field.label, note: field.optional ? "任意。指定なしは指示文へ出力しない" : `初期値：${field.options.find((item) => (item.value ?? item) === defaults[field.id])?.label ?? defaults[field.id]}`, options: plainOptions(field.options.filter((item) => (item.value ?? item) !== ""), defaults[field.id]) })) },
];

function optionItem(item, type) {
  const li = document.createElement("li");
  li.className = `option-item${item.isDefault ? " is-default" : ""}`;
  li.dataset.search = `${item.label} ${item.output}`.toLowerCase();
  if (type === "color") {
    li.innerHTML = `<span class="catalog-swatch" style="--swatch:${item.color}"></span><span class="option-label">${item.label}${item.isDefault ? '<span class="default-badge">初期値に使用</span>' : ""}<br><span class="option-output">${item.output}</span></span>`;
  } else {
    li.innerHTML = `<span class="option-label">${item.label}${item.isDefault ? '<span class="default-badge">初期値</span>' : ""}</span><span class="option-output">${item.output === item.label ? "" : item.output}</span>`;
  }
  return li;
}

function render() {
  sections.forEach((section, sectionIndex) => {
    const details = document.createElement("details");
    details.className = "catalog-group";
    details.open = sectionIndex < 3;
    const optionCount = section.fields.reduce((sum, field) => sum + field.options.length, 0);
    details.innerHTML = `<summary><span>${section.title}</span><span class="group-count">${optionCount}件</span></summary>`;
    const body = document.createElement("div");
    body.className = "group-body";
    section.fields.forEach((field) => {
      const block = document.createElement("section");
      block.className = "field-block";
      block.innerHTML = `<div class="field-heading"><h3>${field.label}</h3>${field.note ? `<span class="field-note">${field.note}</span>` : ""}</div>`;
      const list = document.createElement("ul");
      list.className = `option-list${field.type === "color" ? " color-list" : ""}`;
      field.options.forEach((item) => {
        const row = optionItem(item, field.type);
        row.dataset.search += ` ${section.title} ${field.label}`.toLowerCase();
        list.append(row);
      });
      block.append(list);
      body.append(block);
    });
    details.append(body);
    sectionsRoot.append(details);
  });

  const totalOptions = sections.reduce((sum, section) => sum + section.fields.reduce((fieldSum, field) => fieldSum + field.options.length, 0), 0);
  const cards = [[sections.length, "カテゴリ"], [totalOptions, "掲載行"], [commonPalette.length, "共通色"], [144, "衣装組合せ"]];
  summaryRoot.innerHTML = cards.map(([value, label]) => `<div class="summary-card"><strong>${value}</strong><span>${label}</span></div>`).join("");
  filterCatalog();
}

function filterCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".catalog-group").forEach((group) => {
    let groupVisible = 0;
    group.querySelectorAll(".field-block").forEach((block) => {
      let fieldVisible = 0;
      block.querySelectorAll(".option-item").forEach((item) => {
        const match = !query || item.dataset.search.includes(query);
        item.hidden = !match;
        if (match) fieldVisible += 1;
      });
      block.hidden = fieldVisible === 0;
      groupVisible += fieldVisible;
    });
    group.hidden = groupVisible === 0;
    if (query && groupVisible) group.open = true;
    visible += groupVisible;
  });
  resultText.textContent = query ? `${visible}件が一致` : "名称または出力語句で絞り込めます";
  emptyText.hidden = visible !== 0;
}

searchInput.addEventListener("input", filterCatalog);
render();
