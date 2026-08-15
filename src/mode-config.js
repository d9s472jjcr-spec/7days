import * as photoCatalog from "./catalog.js?v=7.0.0";
import * as animeCatalog from "./anime-catalog.js?v=7.0.0";

const brushIcon = '<svg class="mode-icon mode-icon-brush" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.1 12 8-8a2.8 2.8 0 1 1 4 4l-8 8"></path><path d="M7.1 14c-1.7 0-3 1.3-3 3 0 1.3-1.2 2-2 2 1 1.2 2.5 2 4 2 2.8 0 5-2.2 5-5a2 2 0 0 0-2-2Z"></path></svg>';
const cameraIcon = '<svg class="mode-icon mode-icon-camera" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 13 3H9L7.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path><circle cx="11" cy="12" r="4"></circle></svg>';

export const modeConfigs = Object.freeze({
  photo: Object.freeze({
    id: "photo",
    catalog: photoCatalog,
    storageKey: "7days:last-values:v8",
    presetsKey: "7days:presets:v8",
    schemaKey: "7days:schema-version",
    schemaVersion: "8",
    heading: "神は7日で世界を作った",
    description: "人物画像生成用の日本語指示文を端末内だけで作成するPWA",
    themeColor: "#f6f2eb",
    presetPlaceholder: "例：白シャツ・スタジオ",
    targetMode: "anime",
    switchLabel: "アニメ人物イラスト用へ切り替える",
    switchIcon: brushIcon,
  }),
  anime: Object.freeze({
    id: "anime",
    catalog: animeCatalog,
    storageKey: "7days:anime:last-values:v1",
    presetsKey: "7days:anime:presets:v1",
    schemaKey: "7days:anime:schema-version",
    schemaVersion: "1",
    heading: "3日くらい休んでいいのに",
    description: "アニメ人物イラスト生成用の日本語指示文を端末内だけで作成するPWA",
    themeColor: "#f0eef8",
    presetPlaceholder: "例：ステージ衣装・全身",
    targetMode: "photo",
    switchLabel: "フォトリアル人物画像用へ切り替える",
    switchIcon: cameraIcon,
  }),
});

export function normalizeMode(value) {
  return value === "anime" ? "anime" : "photo";
}

export function modeFromSearch(search = "") {
  return normalizeMode(new URLSearchParams(search).get("mode"));
}

export function prepareStorageForMode(modeId, storage) {
  const config = modeConfigs[normalizeMode(modeId)];
  if (storage.getItem(config.schemaKey) === config.schemaVersion) return;

  if (config.id === "photo") {
    for (let version = 1; version <= 7; version += 1) {
      storage.removeItem(`7days:last-values:v${version}`);
      storage.removeItem(`7days:presets:v${version}`);
    }
  } else {
    storage.removeItem(config.storageKey);
    storage.removeItem(config.presetsKey);
  }
  storage.setItem(config.schemaKey, config.schemaVersion);
}
