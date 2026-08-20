import { appConfig, prepareUnifiedStorage } from "./mode-config.js";

const catalog = appConfig.catalog;
const form = document.querySelector("#prompt-form");
const output = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-button");
const resetButton = document.querySelector("#reset-button");
const toast = document.querySelector("#toast");

function loadObject(key, fallback = {}) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  } catch { return fallback; }
}

function stateFromValues(values = {}) {
  const clean = { ...catalog.defaults };
  Object.keys(clean).forEach((key) => { if (Object.hasOwn(values, key)) clean[key] = values[key]; });
  return catalog.normalizeState(clean);
}

prepareUnifiedStorage(localStorage);
let state = stateFromValues(loadObject(appConfig.storageKey));
const persistState = () => localStorage.setItem(appConfig.storageKey, JSON.stringify(state));
const optionRecord = (option) => typeof option === "string" ? { value: option, label: option || "指定なし" } : option;

function updateValue(id, value) {
  state[id] = value;
  if (id === "outfitType") {
    if (!value) state.outfitStructure = "";
    if (state.outfitStructure) catalog.resetOutfitSelection(state);
    else catalog.normalizeOutfitState(state);
  } else if (id === "outfitStructure") catalog.resetOutfitSelection(state);
  persistState();
  renderState();
}

function createSelect(field) {
  const select = document.createElement("select");
  select.id = field.id; select.name = field.id; select.setAttribute("aria-label", field.label);
  field.options.forEach((item) => {
    const record = optionRecord(item); const option = document.createElement("option");
    option.value = record.value; option.textContent = record.label; select.append(option);
  });
  select.value = state[field.id] ?? catalog.defaults[field.id];
  select.addEventListener("change", () => updateValue(field.id, select.value));
  return select;
}

function createColorPicker(field) {
  const wrap = document.createElement("div"); wrap.className = "color-picker";
  const button = document.createElement("button"); button.type = "button"; button.className = "color-trigger";
  button.id = field.id; button.setAttribute("aria-label", field.label); button.setAttribute("aria-haspopup", "listbox"); button.setAttribute("aria-expanded", "false");
  const panel = document.createElement("div"); panel.className = "color-panel"; panel.setAttribute("role", "listbox"); panel.hidden = true;
  const choices = catalog.paletteFor(field);
  const paint = (value) => {
    const match = choices.find(([name]) => name === value) || choices[0];
    button.innerHTML = `<span class="swatch" style="--swatch:${match[1]}"></span><span>${match[0]}</span><span class="chevron">⌄</span>`;
  };
  paint(state[field.id] ?? catalog.defaults[field.id]);
  choices.forEach(([name, hex]) => {
    const option = document.createElement("button"); option.type = "button"; option.className = "color-option"; option.setAttribute("role", "option"); option.dataset.value = name;
    option.innerHTML = `<span class="swatch" style="--swatch:${hex}"></span><span>${name}</span>`;
    option.addEventListener("click", () => { updateValue(field.id, name); panel.hidden = true; button.setAttribute("aria-expanded", "false"); });
    panel.append(option);
  });
  button.addEventListener("click", () => {
    const opening = panel.hidden;
    document.querySelectorAll(".color-panel:not([hidden])").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".color-trigger[aria-expanded=true]").forEach((item) => item.setAttribute("aria-expanded", "false"));
    panel.hidden = !opening; button.setAttribute("aria-expanded", String(opening));
  });
  wrap.append(button, panel); return wrap;
}

const rangeSummaryText = (id) => {
  const summary = catalog.measurementSummary(id, state);
  if (typeof summary === "string") return summary;
  return summary?.text || `${state[id]}cm`;
};

function refreshRangeControls() {
  catalog.visibleFields(state).filter(({ type }) => type === "range").forEach((field) => {
    const input = form.querySelector(`input[data-measurement="${field.id}"]`);
    if (input) {
      input.value = state[field.id];
      input.setAttribute("aria-valuetext", rangeSummaryText(field.id));
    }
    const summary = form.querySelector(`[data-measurement-summary="${field.id}"]`);
    if (summary) summary.textContent = rangeSummaryText(field.id);
    const linkButton = form.querySelector(`[data-relink-measurement="${field.id}"]`);
    if (linkButton) {
      const linked = catalog.isMeasurementLinked(state, field.id);
      linkButton.disabled = linked;
      linkButton.textContent = linked ? "身長と連動中" : "身長基準に戻す";
    }
  });
}

function createRangeControl(field) {
  const wrap = document.createElement("div"); wrap.className = "range-control";
  const heading = document.createElement("div"); heading.className = "range-heading";
  const summary = document.createElement("output"); summary.className = "range-summary";
  summary.htmlFor = field.id; summary.dataset.measurementSummary = field.id; summary.setAttribute("aria-live", "polite");
  summary.textContent = rangeSummaryText(field.id);
  heading.append(summary);

  if (field.linked) {
    const relink = document.createElement("button"); relink.type = "button"; relink.className = "range-link";
    relink.dataset.relinkMeasurement = field.id;
    relink.disabled = catalog.isMeasurementLinked(state, field.id);
    relink.textContent = relink.disabled ? "身長と連動中" : "身長基準に戻す";
    relink.addEventListener("click", () => {
      state = catalog.relinkMeasurement(state, field.id) || state;
      persistState(); refreshRangeControls(); renderOutput();
    });
    heading.append(relink);
  }

  const input = document.createElement("input");
  input.type = "range"; input.className = "range-input"; input.id = field.id; input.name = field.id;
  input.min = field.min; input.max = field.max; input.step = field.step; input.value = state[field.id];
  input.dataset.measurement = field.id; input.setAttribute("aria-label", field.label);
  input.setAttribute("aria-valuetext", rangeSummaryText(field.id));
  input.addEventListener("input", () => {
    const value = Number(input.value);
    state = field.id === "height"
      ? catalog.applyHeightChange(state, value) || state
      : catalog.setManualMeasurement(state, field.id, value) || state;
    persistState(); refreshRangeControls(); renderOutput();
  });

  const scale = document.createElement("div"); scale.className = "range-scale";
  scale.innerHTML = `<span>${field.min}cm</span><span>${field.max}cm</span>`;
  wrap.append(heading, input, scale);
  return wrap;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".color-picker")) return;
  document.querySelectorAll(".color-panel:not([hidden])").forEach((item) => { item.hidden = true; });
  document.querySelectorAll(".color-trigger[aria-expanded=true]").forEach((item) => item.setAttribute("aria-expanded", "false"));
});

function renderForm() {
  form.replaceChildren(); const sections = new Map(); const groups = new Map();
  const groupLabels = {
    eye: "目", mouth: "口", person: "身体サイズ", "outfit-classification": "衣装分類",
    outerwear: "アウター", top: "トップス", bottom: "ボトムス", onepiece: "上下一体衣装",
    "upper-underwear": "上半身の下着", "lower-underwear": "下半身の下着", shoe: "靴",
    hair: "髪", character: "人物の特徴",
  };
  catalog.visibleFields(state).forEach((field) => {
    if (!sections.has(field.section)) {
      const section = document.createElement("section"); section.className = "form-section card"; section.dataset.section = field.section; section.innerHTML = `<h2>${field.section}</h2>`;
      sections.set(field.section, section); form.append(section);
    }
    let target = sections.get(field.section);
    if (field.group) {
      const key = `${field.section}:${field.group}`;
      if (!groups.has(key)) {
        const group = document.createElement("section"); group.className = `field-group field-group-${field.group}`; group.dataset.group = field.group; group.innerHTML = `<h3>${groupLabels[field.group]}</h3>`;
        groups.set(key, group); target.append(group);
      }
      target = groups.get(key);
    }
    const row = document.createElement("div"); row.className = "field-row"; row.dataset.field = field.id;
    const label = document.createElement("label"); label.htmlFor = field.id; label.textContent = field.label;
    const control = field.type === "color" ? createColorPicker(field)
      : field.type === "range" ? createRangeControl(field)
        : createSelect(field);
    row.append(label, control); target.append(row);
  });
}

function renderOutput() {
  output.value = catalog.generatePrompt(state);
  document.querySelector("#line-count").textContent = `${output.value.match(/。/g)?.length || 0}文`;
}
function renderState(anchor = null) {
  const previousTop = anchor?.getBoundingClientRect().top; renderForm(); renderOutput();
  if (anchor && Number.isFinite(previousTop)) window.scrollBy(0, anchor.getBoundingClientRect().top - previousTop);
}
function showToast(message) {
  toast.textContent = message; toast.hidden = false; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { toast.hidden = true; }, 1800);
}
async function copyPrompt() {
  try { await navigator.clipboard.writeText(output.value); }
  catch { output.select(); document.execCommand("copy"); }
  showToast("指示文をコピーしました");
}

copyButton.addEventListener("click", copyPrompt);
resetButton.addEventListener("click", () => { state = stateFromValues(); persistState(); renderState(); showToast("基準設定に戻しました"); });

renderState();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
