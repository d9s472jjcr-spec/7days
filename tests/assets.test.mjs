import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("9.0.0の単一画面資産が揃う", async () => {
  for (const file of [
    "index.html", "styles.css", "src/app.js", "src/mode-config.js",
    "src/unified-catalog.js", "src/body-measurements.js", "src/catalog.js",
    "src/anime-shooting.js", "src/outfits.js", "sw.js", "manifest.webmanifest",
  ]) await access(new URL(`../${file}`, import.meta.url));

  const pkg = JSON.parse(await read("package.json"));
  assert.equal(pkg.version, "9.0.0");
  await assert.rejects(access(new URL("../src/anime-catalog.js", import.meta.url)));
});

test("indexは9.0.0の単一生成画面で切替・プリセットUIを持たない", async () => {
  const html = await read("index.html");
  assert.match(html, /styles\.css\?v=9\.0\.0/);
  assert.match(html, /src\/app\.js\?v=9\.0\.0/);
  assert.doesNotMatch(html, /mode-switch|anime\.html|\?mode=/);
  assert.doesNotMatch(html, /preset|プリセット/i);
  assert.ok(html.indexOf('id="reset-button"') < html.indexOf('id="copy-button"'));
});

test("固定フッターはリセットとコピーの1対1", async () => {
  const css = await read("styles.css");
  assert.match(css, /\.fixed-actions[^}]*grid-template-columns:\s*minmax\(0, 1fr\)\s+minmax\(0, 1fr\)/s);
});

test("Service Workerは9.0.0資産をv18へキャッシュする", async () => {
  const sw = await read("sw.js");
  assert.match(sw, /7days-v18/);
  for (const asset of [
    "styles.css?v=9.0.0", "src/app.js?v=9.0.0", "src/mode-config.js",
    "src/unified-catalog.js", "src/body-measurements.js", "src/anime-shooting.js",
    "src/outfits.js",
  ]) assert.match(sw, new RegExp(asset.replace(/[.?]/g, "\\$&")));
  assert.doesNotMatch(sw, /anime-catalog|anime\.html/);
});

test("現行アプリはプリセット保存・読込・削除ロジックを持たない", async () => {
  const app = await read("src/app.js");
  const activeCatalog = await read("src/unified-catalog.js");
  assert.doesNotMatch(app, /preset|プリセット/i);
  assert.doesNotMatch(activeCatalog, /presetMessage/);
});

test("数値スライダーの連動・手動解除・再連動・リセットを端末へ自動保存する", async () => {
  const app = await read("src/app.js");
  assert.match(app, /localStorage\.setItem\(appConfig\.storageKey/);
  assert.match(app, /catalog\.applyHeightChange\(state, value\)/);
  assert.match(app, /catalog\.setManualMeasurement\(state, field\.id, value\)/);
  assert.match(app, /catalog\.relinkMeasurement\(state, field\.id\)/);
  assert.match(app, /state\s*=\s*stateFromValues\(\)/);
});

test("外部スクリプト、フォント、解析コードを読み込まない", async () => {
  const html = await read("index.html");
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /analytics|gtag|fonts\.googleapis/i);
});
