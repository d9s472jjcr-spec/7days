import test from "node:test";
import assert from "node:assert/strict";
import {
  modeConfigs,
  modeFromSearch,
  normalizeMode,
  prepareStorageForMode,
} from "../src/mode-config.js";

class MemoryStorage {
  constructor(entries = {}) {
    this.values = new Map(Object.entries(entries));
    this.removed = [];
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.removed.push(key);
    this.values.delete(key);
  }
}

test("modeクエリはanimeだけをアニメとして扱い、それ以外は写真へ戻す", () => {
  assert.equal(normalizeMode("anime"), "anime");
  assert.equal(normalizeMode("photo"), "photo");
  assert.equal(normalizeMode("unknown"), "photo");
  assert.equal(modeFromSearch("?mode=anime"), "anime");
  assert.equal(modeFromSearch("?mode=photo"), "photo");
  assert.equal(modeFromSearch(""), "photo");
});

test("モード設定は写真とアニメの生成規則・初期値を混在させない", () => {
  assert.ok(!modeConfigs.photo.catalog.hairFields.some(({ id }) => id === "eyeShape"));
  assert.ok(modeConfigs.anime.catalog.hairFields.some(({ id }) => id === "eyeShape"));
  assert.notEqual(modeConfigs.photo.catalog.generatePrompt, modeConfigs.anime.catalog.generatePrompt);
  assert.notEqual(modeConfigs.photo.catalog.defaults, modeConfigs.anime.catalog.defaults);
  assert.equal(modeConfigs.photo.catalog.defaults.expression.includes("真剣"), true);
  assert.equal(modeConfigs.anime.catalog.defaults.eyeShape, modeConfigs.anime.catalog.eyeShapeOptions[0].value);
});

test("写真スキーマ準備は既存v8とアニメv1を変更しない", () => {
  const storage = new MemoryStorage({
    "7days:last-values:v1": "old-photo",
    "7days:presets:v7": "old-presets",
    "7days:last-values:v8": "current-photo",
    "7days:presets:v8": "current-photo-presets",
    "7days:anime:last-values:v1": "current-anime",
    "7days:anime:presets:v1": "current-anime-presets",
    "7days:anime:schema-version": "1",
  });

  prepareStorageForMode("photo", storage);

  assert.equal(storage.getItem("7days:last-values:v8"), "current-photo");
  assert.equal(storage.getItem("7days:presets:v8"), "current-photo-presets");
  assert.equal(storage.getItem("7days:anime:last-values:v1"), "current-anime");
  assert.equal(storage.getItem("7days:anime:presets:v1"), "current-anime-presets");
  assert.equal(storage.getItem("7days:anime:schema-version"), "1");
  assert.equal(storage.getItem("7days:schema-version"), "8");
  assert.ok(storage.removed.every((key) => !key.startsWith("7days:anime:")));
});

test("アニメスキーマ準備は写真v8を変更しない", () => {
  const storage = new MemoryStorage({
    "7days:last-values:v8": "current-photo",
    "7days:presets:v8": "current-photo-presets",
    "7days:schema-version": "8",
    "7days:anime:last-values:v1": "stale-anime",
    "7days:anime:presets:v1": "stale-anime-presets",
  });

  prepareStorageForMode("anime", storage);

  assert.equal(storage.getItem("7days:last-values:v8"), "current-photo");
  assert.equal(storage.getItem("7days:presets:v8"), "current-photo-presets");
  assert.equal(storage.getItem("7days:schema-version"), "8");
  assert.equal(storage.getItem("7days:anime:last-values:v1"), null);
  assert.equal(storage.getItem("7days:anime:presets:v1"), null);
  assert.equal(storage.getItem("7days:anime:schema-version"), "1");
  assert.ok(storage.removed.every((key) => key.startsWith("7days:anime:")));
});

test("一致済みスキーマでは保存値を削除しない", () => {
  const photoStorage = new MemoryStorage({ "7days:schema-version": "8", "7days:last-values:v8": "photo" });
  const animeStorage = new MemoryStorage({ "7days:anime:schema-version": "1", "7days:anime:last-values:v1": "anime" });
  prepareStorageForMode("photo", photoStorage);
  prepareStorageForMode("anime", animeStorage);
  assert.deepEqual(photoStorage.removed, []);
  assert.deepEqual(animeStorage.removed, []);
  assert.equal(photoStorage.getItem("7days:last-values:v8"), "photo");
  assert.equal(animeStorage.getItem("7days:anime:last-values:v1"), "anime");
});
