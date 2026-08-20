const CACHE = "7days-v18";
const ASSETS = ["./", "./index.html", "./styles.css?v=9.0.0", "./src/app.js?v=9.0.0", "./src/mode-config.js", "./src/unified-catalog.js", "./src/body-measurements.js", "./src/catalog.js", "./src/anime-shooting.js", "./src/outfits.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const ignoreSearch = event.request.mode === "navigate";
  event.respondWith(caches.match(event.request, { ignoreSearch }).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
