import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("8.0.0の単一画面資産が揃う", async () => {
  for (const file of ["index.html", "styles.css", "src/app.js", "src/mode-config.js", "src/unified-catalog.js", "src/catalog.js", "src/anime-shooting.js", "src/outfits.js", "sw.js", "manifest.webmanifest"]) {
    await access(new URL(`../${file}`, import.meta.url));
  }
  const pkg = JSON.parse(await read("package.json"));
  assert.equal(pkg.version, "8.0.0");
  await assert.rejects(access(new URL("../src/anime-catalog.js", import.meta.url)));
});

test("indexは単一生成画面で切替ボタンを持たない", async () => {
  const html = await read("index.html");
  assert.match(html, /styles\.css\?v=8\.0\.0/);
  assert.match(html, /src\/app\.js\?v=8\.0\.0/);
  assert.doesNotMatch(html, /mode-switch|anime\.html|\?mode=/);
  assert.ok(html.indexOf('id="reset-button"') < html.indexOf('id="copy-button"'));
});

test("固定フッターはリセットとコピーの1対1", async () => {
  const css = await read("styles.css");
  assert.match(css, /\.fixed-actions[^}]*grid-template-columns:\s*minmax\(0, 1fr\)\s+minmax\(0, 1fr\)/s);
});

test("Service Workerは8.0.0資産をv17へキャッシュする", async () => {
  const sw = await read("sw.js");
  assert.match(sw, /7days-v17/);
  for (const asset of ["styles.css?v=8.0.0", "src/app.js?v=8.0.0", "src/unified-catalog.js", "src/anime-shooting.js", "src/outfits.js"]) assert.match(sw, new RegExp(asset.replace(/[.?]/g, "\\$&")));
  assert.doesNotMatch(sw, /anime-catalog|anime\.html/);
});

test("外部スクリプト、フォント、解析コードを読み込まない", async () => {
  const html = await read("index.html");
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /analytics|gtag|fonts\.googleapis/i);
});
