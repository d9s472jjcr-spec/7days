import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

test("PWAの主要ファイルが存在する", async () => {
  for (const path of ["index.html", "options.html", "styles.css", "options.css", "src/app.js", "src/options.js", "src/catalog.js", "src/outfits.js", "manifest.webmanifest", "sw.js", "icons/icon-192.png", "icons/icon-512.png"]) {
    assert.ok((await stat(resolve(root, path))).size > 0, path);
  }
});

test("旧保存キーを削除し保存形式v6を使用する", async () => {
  const app = await readFile(resolve(root, "src/app.js"), "utf8");
  assert.match(app, /7days:last-values:v6/);
  assert.match(app, /7days:presets:v6/);
  assert.match(app, /version <= 5/);
  assert.match(app, /localStorage\.setItem\(SCHEMA_KEY, "6"\)/);
});

test("Service Workerは選択肢カタログを含む更新済みキャッシュを使用する", async () => {
  const serviceWorker = await readFile(resolve(root, "sw.js"), "utf8");
  assert.match(serviceWorker, /const CACHE = "7days-v11"/);
  assert.match(serviceWorker, /\.\/options\.html/);
  assert.match(serviceWorker, /\.\/src\/options\.js/);
  assert.match(serviceWorker, /\.\/src\/catalog\.js\?v=6\.0\.0/);
  assert.match(serviceWorker, /\.\/src\/outfits\.js\?v=6\.0\.0/);
});

test("選択肢カタログは現行データモジュールを直接参照する", async () => {
  const html = await readFile(resolve(root, "options.html"), "utf8");
  const script = await readFile(resolve(root, "src/options.js"), "utf8");
  assert.match(html, /id="catalog-search"/);
  assert.match(script, /from "\.\/catalog\.js\?v=6\.0\.0"/);
  assert.match(script, /from "\.\/outfits\.js\?v=6\.0\.0"/);
  assert.match(script, /commonPalette/);
  assert.match(script, /outfitCatalogs/);
});

test("指示文作成画面から選択肢カタログへ移動できる", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /href="\.\/options\.html"/);
  assert.match(html, /現在の選択項目・選択肢を見る/);
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

test("候補版のパッケージ版番号は6.0.0である", async () => {
  const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  assert.equal(packageJson.version, "6.0.0");
});

test("コピーとリセットは固定表示のアイコンボタンである", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const css = await readFile(resolve(root, "styles.css"), "utf8");
  assert.match(html, /<nav class="fixed-actions"/);
  assert.match(html, /id="copy-button"[^>]+aria-label="指示文をコピー"/);
  assert.match(html, /id="reset-button"[^>]+aria-label="基準設定に戻す"/);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.doesNotMatch(html, />指示文をコピー<\/button>|>基準設定に戻す<\/button>/);
  assert.match(css, /\.fixed-actions\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /\.fixed-action\s*\{[^}]*min-height:\s*48px/s);
});

test("関連項目を視覚的にまとめるグループを持つ", async () => {
  const catalog = await readFile(resolve(root, "src/catalog.js"), "utf8");
  const app = await readFile(resolve(root, "src/app.js"), "utf8");
  for (const group of ["person", "outfit-classification", "outerwear", "top", "bottom", "onepiece", "shoe", "hair", "presentation", "camera", "environment"]) {
    assert.match(catalog + app, new RegExp(`(?:group: \\\"${group}\\\"|${group}: \\\")`), group);
  }
  assert.match(app, /field-group-/);
});

test("ヘッダーは製品名のみで固定条件の注意書きを表示しない", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /<header class="hero">\s*<h1>神は7日で世界を作った<\/h1>\s*<\/header>/);
  assert.doesNotMatch(html, /PERSON IMAGE PROMPT BUILDER|選ぶだけで|固定条件|画像の新規生成・フォトリアル/);
});
