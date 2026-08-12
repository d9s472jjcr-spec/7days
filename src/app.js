import { defaults, fields, generatePrompt, paletteFor, presetMessage } from "./catalog.js";

const STORAGE_KEY = "7days:last-values:v1";
const PRESETS_KEY = "7days:presets:v1";
const PENDING_TOAST_KEY = "7days:pending-toast:v1";
const PENDING_PRESET_KEY = "7days:pending-preset:v1";
const state = loadJson(STORAGE_KEY, defaults);
const form = document.querySelector("#prompt-form");
const output = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-button");
const resetButton = document.querySelector("#reset-button");
const presetName = document.querySelector("#preset-name");
const presetSelect = document.querySelector("#preset-select");
const savePresetButton = document.querySelector("#save-preset");
const deletePresetButton = document.querySelector("#delete-preset");
const toast = document.querySelector("#toast");

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" ? { ...fallback, ...value } : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function createSelect(field) {
  const select = document.createElement("select");
  select.id = field.id;
  select.name = field.id;
  select.setAttribute("aria-label", field.label);
  field.options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value || "指定なし";
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
      paint(name);
      updateValue(field.id, name);
      close();
    });
    panel.append(option);
  });

  function close() {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
  button.addEventListener("click", () => {
    const opening = panel.hidden;
    document.querySelectorAll(".color-panel:not([hidden])").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".color-trigger[aria-expanded=true]").forEach((item) => item.setAttribute("aria-expanded", "false"));
    panel.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
  });
  document.addEventListener("click", (event) => { if (!wrap.contains(event.target)) close(); });
  wrap.append(button, panel);
  return wrap;
}

function renderForm() {
  const groups = new Map();
  fields.forEach((field) => {
    if (!groups.has(field.section)) {
      const section = document.createElement("section");
      section.className = "form-section card";
      section.innerHTML = `<h2>${field.section}</h2>`;
      groups.set(field.section, section);
      form.append(section);
    }
    const row = document.createElement("div");
    row.className = "field-row";
    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;
    row.append(label, field.type === "color" ? createColorPicker(field) : createSelect(field));
    groups.get(field.section).append(row);
  });
}

function updateValue(id, value) {
  state[id] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderOutput();
}

function renderOutput() {
  output.value = generatePrompt(state);
  document.querySelector("#line-count").textContent = `${output.value.split("\n").length}行`;
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
  Object.assign(state, defaults);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  sessionStorage.setItem(PENDING_TOAST_KEY, presetMessage("load", name));
  sessionStorage.setItem(PENDING_PRESET_KEY, name);
  location.reload();
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

renderForm();
renderOutput();
const pendingPreset = sessionStorage.getItem(PENDING_PRESET_KEY) || "";
sessionStorage.removeItem(PENDING_PRESET_KEY);
refreshPresets(pendingPreset);

const pendingToast = sessionStorage.getItem(PENDING_TOAST_KEY);
if (pendingToast) {
  sessionStorage.removeItem(PENDING_TOAST_KEY);
  showToast(pendingToast);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
