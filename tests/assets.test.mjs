import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

test("PWAの主要ファイルが存在する", async () => {
  for (const path of ["index.html", "styles.css", "src/app.js", "src/catalog.js", "src/outfits.js", "manifest.webmanifest", "sw.js", "icons/icon-192.png", "icons/icon-512.png"]) {
    assert.ok((await stat(resolve(root, path))).size > 0, path);
  }
});

test("旧保存キーを削除し保存形式v3を使用する", async () => {
  const app = await readFile(resolve(root, "src/app.js"), "utf8");
  assert.match(app, /7days:last-values:v3/);
  assert.match(app, /7days:presets:v3/);
  assert.match(app, /removeItem\("7days:last-values:v1"\)/);
  assert.match(app, /removeItem\("7days:presets:v1"\)/);
  assert.match(app, /removeItem\("7days:last-values:v2"\)/);
  assert.match(app, /removeItem\("7days:presets:v2"\)/);
});

test("Service Workerは更新済みキャッシュ名を使用する", async () => {
  const serviceWorker = await readFile(resolve(root, "sw.js"), "utf8");
  assert.match(serviceWorker, /const CACHE = "7days-v5"/);
});

test("プリセット読込処理はページを再読み込みしない", async () => {
  const app = await readFile(resolve(root, "src/app.js"), "utf8");
  const loadHandler = app.slice(app.indexOf('presetSelect.addEventListener("change"'), app.indexOf('deletePresetButton.addEventListener'));
  assert.doesNotMatch(loadHandler, /location\.reload/);
  assert.match(loadHandler, /renderState\(presetCard\)/);
});

test("manifestはインストール可能な基本情報を持つ", async () => {
  const manifest = JSON.parse(await readFile(resolve(root, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
});

test("外部スクリプト・外部フォント・分析タグを読み込まない", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /analytics|gtag|fonts\.googleapis/i);
});

test("iPhone向けviewportとsafe areaを備える", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const css = await readFile(resolve(root, "styles.css"), "utf8");
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /font-size:\s*16px/);
  assert.match(css, /min-height:\s*44px/);
});

test("ヘッダーは製品名のみで固定条件の注意書きを表示しない", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /<header class="hero">\s*<h1>神は7日で世界を作った<\/h1>\s*<\/header>/);
  assert.doesNotMatch(html, /PERSON IMAGE PROMPT BUILDER|選ぶだけで|固定条件|画像の新規生成・フォトリアル/);
});
