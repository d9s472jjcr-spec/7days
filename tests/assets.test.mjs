import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { modeConfigs } from "../src/mode-config.js";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const version = packageJson.version;

async function text(path) {
  return readFile(resolve(root, path), "utf8");
}

test("単一HTMLと両モードの共有資産が存在する", async () => {
  for (const path of [
    "index.html",
    "styles.css",
    "src/app.js",
    "src/mode-config.js",
    "src/catalog.js",
    "src/anime-catalog.js",
    "src/anime-shooting.js",
    "src/outfits.js",
    "manifest.webmanifest",
    "sw.js",
    "icons/icon-192.png",
    "icons/icon-512.png",
  ]) {
    assert.ok((await stat(resolve(root, path))).size > 0, path);
  }
  for (const path of ["anime.html", "src/anime-app.js"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
  }
});

test("Web選択肢カタログを削除しExcel台帳だけを残す", async () => {
  for (const path of ["options.html", "options.css", "src/options.js", "docs/OPTIONS_CATALOG.md"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
  }
  assert.ok((await stat(resolve(root, "docs/7days_options_catalog.xlsx"))).size > 0);
  assert.doesNotMatch(await text("index.html"), /options\.html|OPTIONS_CATALOG/);
});

test("写真版v8とアニメ版v1の保存契約を完全に分離する", () => {
  const photo = modeConfigs.photo;
  const anime = modeConfigs.anime;
  assert.deepEqual(
    [photo.storageKey, photo.presetsKey, photo.schemaKey, photo.schemaVersion],
    ["7days:last-values:v8", "7days:presets:v8", "7days:schema-version", "8"],
  );
  assert.deepEqual(
    [anime.storageKey, anime.presetsKey, anime.schemaKey, anime.schemaVersion],
    ["7days:anime:last-values:v1", "7days:anime:presets:v1", "7days:anime:schema-version", "1"],
  );
  const photoKeys = new Set([photo.storageKey, photo.presetsKey, photo.schemaKey]);
  assert.ok([anime.storageKey, anime.presetsKey, anime.schemaKey].every((key) => !photoKeys.has(key)));
});

test("Service Workerは単一HTMLと両モードの実行資産をキャッシュする", async () => {
  const serviceWorker = await text("sw.js");
  assert.match(serviceWorker, /const CACHE = "7days-v16"/);
  for (const path of ["./index.html", "./src/app.js", "./src/mode-config.js", "./src/catalog.js", "./src/anime-catalog.js", "./src/anime-shooting.js", "./src/outfits.js"]) {
    assert.ok(serviceWorker.includes(path), path);
  }
  assert.doesNotMatch(serviceWorker, /anime\.html|anime-app\.js|options\.html|options\.css|src\/options\.js/);
  assert.match(serviceWorker, /event\.request\.mode === "navigate"/);
  assert.match(serviceWorker, /caches\.match\(event\.request, \{ ignoreSearch \}\)/);
});

test("HTML・JS・Service Workerの資産版はpackage versionと一致する", async () => {
  assert.equal(version, "7.0.0");
  const sources = [
    await text("index.html"),
    await text("src/app.js"),
    await text("src/mode-config.js"),
    await text("src/catalog.js"),
    await text("src/anime-catalog.js"),
    await text("sw.js"),
  ];
  sources.forEach((source) => {
    const refs = [...source.matchAll(/\?v=(\d+\.\d+\.\d+)/g)].map((match) => match[1]);
    assert.ok(refs.length > 0);
    refs.forEach((ref) => assert.equal(ref, version));
  });
});

test("固定フッターはリセット・切替・コピーの1対1対2である", async () => {
  const html = await text("index.html");
  const css = await text("styles.css");
  assert.match(html, /<nav class="fixed-actions"/);
  assert.ok(html.indexOf('id="reset-button"') < html.indexOf('id="mode-switch-button"'));
  assert.ok(html.indexOf('id="mode-switch-button"') < html.indexOf('id="copy-button"'));
  assert.match(html, /<button id="mode-switch-button"[^>]+type="button"/);
  assert.match(html, /id="copy-button"[^>]+aria-label="指示文をコピー"/);
  assert.match(html, /id="reset-button"[^>]+aria-label="基準設定に戻す"/);
  assert.doesNotMatch(html, />指示文をコピー<\/button>|>基準設定に戻す<\/button>/);
  assert.equal(modeConfigs.photo.switchLabel, "アニメ人物イラスト用へ切り替える");
  assert.equal(modeConfigs.anime.switchLabel, "フォトリアル人物画像用へ切り替える");
  assert.match(modeConfigs.photo.switchIcon, /mode-icon-brush/);
  assert.match(modeConfigs.anime.switchIcon, /mode-icon-camera/);
  assert.match(css, /\.fixed-actions\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\) minmax\(0, 2fr\)/);
  assert.match(css, /bottom:\s*max\(6px, env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /\.fixed-action\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.fixed-action\s*\{[^}]*min-height:\s*50px/s);
});

test("単一ヘッダーをモードに応じて切り替える", async () => {
  const html = await text("index.html");
  const app = await text("src/app.js");
  assert.match(html, /<header class="hero">\s*<h1>神は7日で世界を作った<\/h1>\s*<\/header>/);
  assert.equal(modeConfigs.photo.heading, "神は7日で世界を作った");
  assert.equal(modeConfigs.anime.heading, "3日くらい休んでいいのに");
  assert.match(app, /document\.documentElement\.classList\.toggle\("mode-anime"/);
  assert.match(app, /heading\.textContent = config\.heading/);
  assert.match(app, /themeColor\.setAttribute\("content", config\.themeColor\)/);
  assert.doesNotMatch(html, /PERSON IMAGE PROMPT BUILDER|選ぶだけで|固定条件|画像の新規生成・フォトリアル/);
});

test("単一画面は共通のPWA名・manifest・ブラウザーtitleを使う", async () => {
  const manifest = JSON.parse(await text("manifest.webmanifest"));
  const html = await text("index.html");
  assert.equal(manifest.name, "神は7日で世界を作った");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
  assert.match(html, /<title>神は7日で世界を作った<\/title>/);
  assert.match(html, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
});

test("モード切替とプリセット読込はページを再読み込みしない", async () => {
  const app = await text("src/app.js");
  const loadHandler = app.slice(app.indexOf('presetSelect.addEventListener("change"'), app.indexOf("deletePresetButton.addEventListener"));
  assert.doesNotMatch(app, /location\.(?:reload|assign|replace)|location\.href\s*=/);
  assert.match(app, /modeSwitchButton\.addEventListener\("click"/);
  assert.match(app, /activateMode\(activeConfig\.targetMode, \{ historyAction: "push", preserveScroll: true \}\)/);
  assert.match(app, /window\.addEventListener\("popstate"/);
  assert.match(loadHandler, /renderState\(presetCard\)/);
});

test("外部スクリプト・外部フォント・分析タグを読み込まない", async () => {
  const html = await text("index.html");
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /analytics|gtag|fonts\.googleapis/i);
});

test("iPhone向けviewportとsafe areaを単一画面に備える", async () => {
  const html = await text("index.html");
  const css = await text("styles.css");
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /font-size:\s*16px/);
  assert.match(css, /min-height:\s*44px/);
});

test("関連項目を視覚的にまとめ、アニメモードの目を独立グループ化する", async () => {
  const photoCatalog = await text("src/catalog.js");
  const app = await text("src/app.js");
  const animeCatalog = await text("src/anime-catalog.js");
  for (const group of ["person", "outfit-classification", "outerwear", "top", "bottom", "onepiece", "shoe", "hair", "presentation", "camera", "environment"]) {
    assert.ok((photoCatalog + app).includes('group: "' + group + '"') || (photoCatalog + app).includes(group + ': "'), group);
  }
  assert.match(animeCatalog, /group: "eye"/);
  assert.match(app, /eye: "目"/);
  assert.match(await text("styles.css"), /\.field-group-eye/);
});
