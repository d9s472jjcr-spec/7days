const CACHE = "7days-v16";
const ASSETS = ["./", "./index.html", "./styles.css?v=7.0.0", "./src/app.js?v=7.0.0", "./src/mode-config.js?v=7.0.0", "./src/catalog.js?v=7.0.0", "./src/anime-catalog.js?v=7.0.0", "./src/anime-shooting.js?v=7.0.0", "./src/outfits.js?v=7.0.0", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

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
