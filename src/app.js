import {
  defaults,
  generatePrompt,
  normalizeOutfitState,
  paletteFor,
  presetMessage,
  resetOutfitSelection,
  visibleFields,
} from "./catalog.js?v=5.0.0";

const STORAGE_KEY = "7days:last-values:v5";
const PRESETS_KEY = "7days:presets:v5";
const SCHEMA_KEY = "7days:schema-version";

if (localStorage.getItem(SCHEMA_KEY) !== "5") {
  localStorage.removeItem("7days:last-values:v1");
  localStorage.removeItem("7days:presets:v1");
  localStorage.removeItem("7days:last-values:v2");
  localStorage.removeItem("7days:presets:v2");
  localStorage.removeItem("7days:last-values:v3");
  localStorage.removeItem("7days:presets:v3");
  localStorage.removeItem("7days:last-values:v4");
  localStorage.removeItem("7days:presets:v4");
  localStorage.setItem(SCHEMA_KEY, "5");
}

const state = normalizeOutfitState(loadJson(STORAGE_KEY, defaults));
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

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" ? { ...fallback, ...value } : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function optionRecord(option) {
  return typeof option === "string" ? { value: option, label: option || "指定なし" } : option;
}

function createSelect(field) {
  const select = document.createElement("select");
  select.id = field.id;
  select.name = field.id;
  select.setAttribute("aria-label", field.label);
  field.options.forEach((item) => {
    const record = optionRecord(item);
    const option = document.createElement("option");
    option.value = record.value;
    option.textContent = record.label;
    select.append(option);
  });
  select.value = state[field.id] ?? defaults[field.id];
  select.addEventListener("change", () => updateValue(field.id, select.value));
  return select;
}

function createColorPicker(field) {
  const wrap = document.createElement("div");
  wrap.className = "color-picker";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "color-trigger";
  button.id = field.id;
  button.setAttribute("aria-label", field.label);
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  const panel = document.createElement("div");
  panel.className = "color-panel";
  panel.setAttribute("role", "listbox");
  panel.hidden = true;

  const choices = paletteFor(field);
  function paint(value) {
    const match = choices.find(([name]) => name === value) || choices[0];
    button.innerHTML = `<span class="swatch" style="--swatch:${match[1]}"></span><span>${match[0]}</span><span class="chevron">⌄</span>`;
  }
  paint(state[field.id] ?? defaults[field.id]);

  choices.forEach(([name, hex]) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "color-option";
    option.setAttribute("role", "option");
    option.dataset.value = name;
    option.innerHTML = `<span class="swatch" style="--swatch:${hex}"></span><span>${name}</span>`;
    option.addEventListener("click", () => {
      updateValue(field.id, name);
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });
    panel.append(option);
  });

  button.addEventListener("click", () => {
    const opening = panel.hidden;
    document.querySelectorAll(".color-panel:not([hidden])").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".color-trigger[aria-expanded=true]").forEach((item) => item.setAttribute("aria-expanded", "false"));
    panel.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
  });
  wrap.append(button, panel);
  return wrap;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".color-picker")) return;
  document.querySelectorAll(".color-panel:not([hidden])").forEach((item) => { item.hidden = true; });
  document.querySelectorAll(".color-trigger[aria-expanded=true]").forEach((item) => item.setAttribute("aria-expanded", "false"));
});

function renderForm() {
  form.replaceChildren();
  const groups = new Map();
  visibleFields(state).forEach((field) => {
    if (!groups.has(field.section)) {
      const section = document.createElement("section");
      section.className = "form-section card";
      section.dataset.section = field.section;
      section.innerHTML = `<h2>${field.section}</h2>`;
      groups.set(field.section, section);
      form.append(section);
    }
    const row = document.createElement("div");
    row.className = "field-row";
    row.dataset.field = field.id;
    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;
    row.append(label, field.type === "color" ? createColorPicker(field) : createSelect(field));
    groups.get(field.section).append(row);
  });
}

function renderOutput() {
  output.value = generatePrompt(state);
  document.querySelector("#line-count").textContent = `${output.value.split("\n").length}行`;
}

function renderState(anchor = null) {
  const previousTop = anchor?.getBoundingClientRect().top;
  renderForm();
  renderOutput();
  if (anchor && Number.isFinite(previousTop)) {
    window.scrollBy(0, anchor.getBoundingClientRect().top - previousTop);
  }
}

function updateValue(id, value) {
  state[id] = value;
  if (id === "outfitType") {
    if (!value) state.outfitStructure = "";
    if (state.outfitStructure) resetOutfitSelection(state);
    else normalizeOutfitState(state);
  } else if (id === "outfitStructure") {
    resetOutfitSelection(state);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderState();
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 1800);
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(output.value);
    showToast("指示文をコピーしました");
  } catch {
    output.select();
    document.execCommand("copy");
    showToast("指示文をコピーしました");
  }
}

function presets() { return loadJson(PRESETS_KEY, {}); }

function refreshPresets(selected = "") {
  presetSelect.innerHTML = '<option value="">プリセットを選択</option>';
  Object.keys(presets()).sort((a, b) => a.localeCompare(b, "ja")).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    presetSelect.append(option);
  });
  presetSelect.value = selected;
}

copyButton.addEventListener("click", copyPrompt);
resetButton.addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  location.reload();
});
savePresetButton.addEventListener("click", () => {
  const name = presetName.value.trim();
  if (!name) return showToast("プリセット名を入力してください");
  const all = presets();
  all[name] = { ...state };
  localStorage.setItem(PRESETS_KEY, JSON.stringify(all));
  presetName.value = "";
  refreshPresets(name);
  showToast(presetMessage("save", name));
});
presetSelect.addEventListener("change", () => {
  const name = presetSelect.value;
  const selected = presets()[name];
  if (!selected) return;
  Object.assign(state, defaults, selected);
  normalizeOutfitState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderState(presetCard);
  refreshPresets(name);
  showToast(presetMessage("load", name));
});
deletePresetButton.addEventListener("click", () => {
  if (!presetSelect.value) return showToast("削除するプリセットを選択してください");
  const name = presetSelect.value;
  const all = presets();
  delete all[name];
  localStorage.setItem(PRESETS_KEY, JSON.stringify(all));
  refreshPresets();
  showToast(presetMessage("delete", name));
});

renderState();
refreshPresets();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
