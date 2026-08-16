import { appConfig, prepareUnifiedStorage } from "./mode-config.js";

const catalog = appConfig.catalog;
const form = document.querySelector("#prompt-form");
const output = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-button");
const resetButton = document.querySelector("#reset-button");
const presetName = document.querySelector("#preset-name");
const presetSelect = document.querySelector("#preset-select");
const savePresetButton = document.querySelector("#save-preset");
const deletePresetButton = document.querySelector("#delete-preset");
const toast = document.querySelector("#toast");
const presetCard = document.querySelector(".preset-card");

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
    hair: "髪", presentation: "人物演出", camera: "カメラ", environment: "撮影環境",
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
    row.append(label, field.type === "color" ? createColorPicker(field) : createSelect(field)); target.append(row);
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
const presets = () => loadObject(appConfig.presetsKey);
function refreshPresets(selected = "") {
  presetSelect.innerHTML = '<option value="">プリセットを選択</option>';
  Object.keys(presets()).sort((a, b) => a.localeCompare(b, "ja")).forEach((name) => {
    const option = document.createElement("option"); option.value = name; option.textContent = name; presetSelect.append(option);
  });
  presetSelect.value = selected;
}

copyButton.addEventListener("click", copyPrompt);
resetButton.addEventListener("click", () => { state = stateFromValues(); persistState(); renderState(); showToast("基準設定に戻しました"); });
savePresetButton.addEventListener("click", () => {
  const name = presetName.value.trim(); if (!name) return showToast("プリセット名を入力してください");
  const all = presets(); all[name] = { ...state }; localStorage.setItem(appConfig.presetsKey, JSON.stringify(all)); presetName.value = ""; refreshPresets(name); showToast(catalog.presetMessage("save", name));
});
presetSelect.addEventListener("change", () => {
  const name = presetSelect.value; const selected = presets()[name]; if (!selected) return;
  state = stateFromValues(selected); persistState(); renderState(presetCard); refreshPresets(name); showToast(catalog.presetMessage("load", name));
});
deletePresetButton.addEventListener("click", () => {
  if (!presetSelect.value) return showToast("削除するプリセットを選択してください");
  const name = presetSelect.value; const all = presets(); delete all[name]; localStorage.setItem(appConfig.presetsKey, JSON.stringify(all)); refreshPresets(); showToast(catalog.presetMessage("delete", name));
});

renderState(); refreshPresets();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
