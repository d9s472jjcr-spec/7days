import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

test("PWAの主要ファイルが存在する", async () => {
  for (const path of ["index.html", "styles.css", "manifest.webmanifest", "sw.js", "icons/icon-192.png", "icons/icon-512.png"]) {
    assert.ok((await stat(resolve(root, path))).size > 0, path);
  }
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
