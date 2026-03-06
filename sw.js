// ══════════════════════════════════════════════════════════════════
// EUPB MUSEO — Service Worker (PWA)
// Estrategia: Cache-first para assets estáticos, Network-first para API
// ══════════════════════════════════════════════════════════════════

const CACHE_NAME = "eupb-museo-v1";

// Assets estáticos que cachear en install
const PRECACHE_ASSETS = [
  "./index.html",
  "./museo.html",
  "./youtube.html",
  "./styles.css",
  "./db.js",
  "./misiones.js",
  "./logros.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  // CDN libs (se cachean en primer uso)
];

// Dominios que NUNCA cachear (APIs en tiempo real)
const NO_CACHE_DOMAINS = [
  "firestore.googleapis.com",
  "firebase.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "w.soundcloud.com",
  "api-v2.soundcloud.com",
  "www.youtube.com",
];

// ── Install: pre-cachear assets esenciales ──
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches viejos ──
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: estrategia mixta ──
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // No interceptar POST ni peticiones a APIs en tiempo real
  if (e.request.method !== "GET") return;
  if (NO_CACHE_DOMAINS.some((d) => url.hostname.includes(d))) return;

  // Chrome extensions, etc.
  if (!url.protocol.startsWith("http")) return;

  // CDN assets (Three.js, Firebase SDK, fonts): cache-first
  if (
    url.hostname.includes("cdnjs.cloudflare.com") ||
    url.hostname.includes("gstatic.com") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
            return res;
          })
      )
    );
    return;
  }

  // Imágenes externas (covers): cache-first con fallback
  if (
    url.hostname.includes("postimg.cc") ||
    url.hostname.includes("scdn.co") ||
    url.hostname.includes("mzstatic.com") ||
    url.hostname.includes("genius.com") ||
    e.request.destination === "image"
  ) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request)
            .then((res) => {
              if (res.ok) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
              }
              return res;
            })
            .catch(() => new Response("", { status: 404 }))
      )
    );
    return;
  }

  // Archivos locales (HTML, JS, CSS): network-first con fallback a cache
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
