#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════
// EUPB Archivo — Generador de páginas estáticas SEO
// Genera /disco/[slug]/index.html y /artista/[slug]/index.html
// ══════════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const SITE = "https://eupb.es";
const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

// ── Helpers ──────────────────────────────────────────────────────

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escHtml(s) {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escAttr(s) {
  return escHtml(s);
}

function truncate(s, max) {
  if (!s || s.length <= max) return s || "";
  return s.slice(0, max - 1) + "…";
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── Load data ────────────────────────────────────────────────────

function loadDb(year) {
  const filePath = path.join(__dirname, `db${year}.js`);
  let code = fs.readFileSync(filePath, "utf8");
  code = code.replace(/export\s+default\s+\w+;?/g, "");
  code = code.replace(/const\s+/g, "var ");
  eval(code);
  return eval(`DATA_${year}`);
}

function loadArtists() {
  const filePath = path.join(__dirname, "artists.js");
  let code = fs.readFileSync(filePath, "utf8");
  code = code.replace(/export\s+default\s+\w+;?/g, "");
  code = code.replace(/const\s+/g, "var ");
  eval(code);
  return typeof ARTIST_PROFILES !== "undefined" ? ARTIST_PROFILES : {};
}

// ── Gather all albums ────────────────────────────────────────────

const allAlbums = [];
for (const year of YEARS) {
  const data = loadDb(year);
  for (const album of data) {
    allAlbums.push({ ...album, year });
  }
}

const artistProfiles = loadArtists();

// ── Build slug maps ──────────────────────────────────────────────

// Disco slugs — detect collisions (same artist+title, different years)
const slugCount = {};
for (const album of allAlbums) {
  const base = slugify(album.a) + "-" + slugify(album.t);
  slugCount[base] = (slugCount[base] || 0) + 1;
}

// Assign final slugs
for (const album of allAlbums) {
  const base = slugify(album.a) + "-" + slugify(album.t);
  if (slugCount[base] > 1) {
    album.slug = base + "-" + album.year;
  } else {
    album.slug = base;
  }
  album.artistSlug = slugify(album.a);
  album.titleSlug = slugify(album.t);
}

// ── Build artist data ────────────────────────────────────────────

const artistMap = {}; // slug -> { name, albums[], cities[], labels[], profile }
for (const album of allAlbums) {
  const s = album.artistSlug;
  if (!artistMap[s]) {
    artistMap[s] = {
      name: album.a,
      slug: s,
      albums: [],
      cities: new Set(),
      labels: new Set(),
      years: new Set(),
      profile: artistProfiles[s] || null,
    };
  }
  artistMap[s].albums.push(album);
  if (album.o) artistMap[s].cities.add(album.o);
  if (album.l) artistMap[s].labels.add(album.l);
  artistMap[s].years.add(album.year);
}

// ── Albums by year (for "more from this year") ───────────────────

const albumsByYear = {};
for (const album of allAlbums) {
  if (!albumsByYear[album.year]) albumsByYear[album.year] = [];
  albumsByYear[album.year].push(album);
}

// ── CSS ──────────────────────────────────────────────────────────

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#060606;color:#e0e0e0;font-family:'Space Mono',monospace;line-height:1.6}
a{color:#ed1c24;text-decoration:none;transition:opacity .2s}
a:hover{opacity:.8}
img{max-width:100%;height:auto;display:block}
.hdr{position:sticky;top:0;z-index:100;background:#0a0a0a;border-bottom:1px solid #1a1a1a;padding:12px 24px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:1.1rem;color:#ed1c24;letter-spacing:2px}
.nav{display:flex;gap:18px;align-items:center}
.nav a{font-family:'Orbitron',sans-serif;font-size:.7rem;color:#888;letter-spacing:1.5px;text-transform:uppercase}
.nav a:hover{color:#ed1c24}
.btn3d{background:#ed1c24;color:#fff;padding:5px 12px;border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:1px}
.wrap{max-width:900px;margin:0 auto;padding:24px 16px 60px}
.bc{font-size:.75rem;color:#666;margin-bottom:20px;font-family:'Orbitron',sans-serif;letter-spacing:1px}
.bc a{color:#888}
.bc span{color:#555;margin:0 6px}
h1{font-family:'Orbitron',sans-serif;font-size:1.6rem;color:#fff;margin-bottom:8px;line-height:1.3}
h2{font-family:'Orbitron',sans-serif;font-size:1rem;color:#ed1c24;margin:32px 0 16px;letter-spacing:1px;text-transform:uppercase}
.cover{border-radius:8px;max-width:360px;margin:20px 0;box-shadow:0 8px 32px rgba(237,28,36,.15)}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.tag{background:#1a1a1a;color:#aaa;padding:4px 12px;border-radius:20px;font-size:.75rem;border:1px solid #222}
.tag.yr{border-color:#ed1c24;color:#ed1c24}
ol.tk{padding-left:24px;margin:12px 0}
ol.tk li{padding:4px 0;color:#bbb;font-size:.85rem;border-bottom:1px solid #111}
ol.tk li::marker{color:#ed1c24}
.links{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}
.links a{background:#1a1a1a;padding:6px 16px;border-radius:4px;font-size:.8rem;border:1px solid #222}
.links a:hover{border-color:#ed1c24}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;margin:16px 0}
.card{background:#111;border-radius:8px;overflow:hidden;transition:transform .2s}
.card:hover{transform:translateY(-4px)}
.card img{width:100%;aspect-ratio:1;object-fit:cover}
.card .info{padding:8px}
.card .info .ca{font-size:.7rem;color:#888}
.card .info .ct{font-size:.75rem;color:#ddd;font-weight:700}
.cta{display:inline-block;background:#ed1c24;color:#fff;padding:10px 24px;border-radius:6px;font-family:'Orbitron',sans-serif;font-size:.8rem;letter-spacing:1px;margin:24px 0}
.cta:hover{opacity:.9}
.stats{display:flex;gap:24px;margin:16px 0}
.stat{text-align:center}
.stat .n{font-family:'Orbitron',sans-serif;font-size:1.5rem;color:#ed1c24}
.stat .l{font-size:.7rem;color:#666;text-transform:uppercase}
.bio{color:#999;font-size:.9rem;margin:12px 0;line-height:1.7}
.social{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}
.social a{background:#1a1a1a;padding:6px 14px;border-radius:4px;font-size:.8rem;border:1px solid #222;text-transform:capitalize}
.avatar{width:160px;height:160px;border-radius:50%;object-fit:cover;border:3px solid #ed1c24;margin:16px 0}
.ftr{text-align:center;padding:32px 16px;color:#444;font-size:.7rem;border-top:1px solid #111;margin-top:40px}
@media(max-width:640px){
  .hdr{flex-direction:column;gap:8px;text-align:center}
  .nav{flex-wrap:wrap;justify-content:center;gap:10px}
  h1{font-size:1.2rem}
  .cover{max-width:100%}
  .grid{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))}
  .stats{flex-wrap:wrap}
}
`;

// ── Header / Footer HTML ─────────────────────────────────────────

function headerHtml() {
  return `<header class="hdr">
  <a href="/" class="logo">EUPB ARCHIVO</a>
  <nav class="nav">
    <a href="/catalogo.html">DISCOS</a>
    <a href="/catalogo.html">ARTISTAS</a>
    <a href="/catalogo.html">RANKING</a>
    <a href="/museo.html" class="btn3d">MUSEO 3D</a>
  </nav>
</header>`;
}

function footerHtml() {
  return `<footer class="ftr">EUPB Archivo © 2010–2019 · Archivo digital del rap en español</footer>`;
}

// ── Disco page ───────────────────────────────────────────────────

function generateDiscoPage(album) {
  const artist = artistMap[album.artistSlug];
  const canonical = `${SITE}/disco/${album.slug}/`;
  const titleTag = truncate(
    `${album.a} — ${album.t} (${album.year}) | EUPB Archivo`,
    60
  );
  const desc = escAttr(
    truncate(
      `${album.a} — ${album.t} (${album.year}). ${album.o ? album.o + ". " : ""}${album.l ? "Sello: " + album.l + ". " : ""}Tracklist, enlaces y más en EUPB Archivo.`,
      160
    )
  );
  const coverUrl = album.cover || `${SITE}/nocover.jpg`;

  // Schema.org JSON-LD
  const tracks = (album.tk || []).map((name, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "MusicRecording",
      name: name,
      position: i + 1,
    },
  }));

  const sameAs = [];
  if (album.spotify) sameAs.push(album.spotify);
  if (album.youtube)
    sameAs.push(`https://www.youtube.com/watch?v=${album.youtube}`);
  if (album.bandcamp) sameAs.push(album.bandcamp);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.t,
    byArtist: {
      "@type": "MusicGroup",
      name: album.a,
      url: `${SITE}/artista/${album.artistSlug}/`,
    },
    datePublished: `${album.year}`,
    image: coverUrl,
    genre: "Hip Hop",
    track: {
      "@type": "ItemList",
      numberOfItems: (album.tk || []).length,
      itemListElement: tracks,
    },
  };
  if (sameAs.length) jsonLd.sameAs = sameAs;

  // "More from this artist"
  const moreArtist = artist
    ? artist.albums.filter((a) => a.slug !== album.slug).slice(0, 6)
    : [];

  // "More from this year"
  const moreYear = (albumsByYear[album.year] || [])
    .filter((a) => a.slug !== album.slug)
    .slice(0, 6);

  // CTA hash
  const ctaHash = `disco/${album.year}/${album.artistSlug}/${album.titleSlug}`;

  // External links
  let linksHtml = "";
  if (album.spotify || album.youtube || album.bandcamp) {
    linksHtml = `<div class="links">`;
    if (album.spotify)
      linksHtml += `<a href="${escAttr(album.spotify)}" target="_blank" rel="noopener">Spotify</a>`;
    if (album.youtube)
      linksHtml += `<a href="https://www.youtube.com/watch?v=${escAttr(album.youtube)}" target="_blank" rel="noopener">YouTube</a>`;
    if (album.bandcamp)
      linksHtml += `<a href="${escAttr(album.bandcamp)}" target="_blank" rel="noopener">Bandcamp</a>`;
    linksHtml += `</div>`;
  }

  function cardsHtml(albums) {
    return albums
      .map(
        (a) => `<a href="/disco/${a.slug}/" class="card">
      <img src="${escAttr(a.cover || SITE + "/nocover.jpg")}" alt="${escAttr(a.a)} — ${escAttr(a.t)}" loading="lazy" width="280" height="280">
      <div class="info"><div class="ca">${escHtml(a.a)}</div><div class="ct">${escHtml(a.t)} (${a.year})</div></div>
    </a>`
      )
      .join("\n");
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(titleTag)}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escAttr(titleTag)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${escAttr(coverUrl)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="music.album">
<meta property="og:site_name" content="EUPB Archivo">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(titleTag)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${escAttr(coverUrl)}">
<meta name="theme-color" content="#ed1c24">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head>
<body>
${headerHtml()}
<main class="wrap">
  <nav class="bc" aria-label="Breadcrumb">
    <a href="/">INICIO</a><span>›</span><a href="/catalogo.html">DISCOS</a><span>›</span>${escHtml(album.a)} — ${escHtml(album.t)}
  </nav>
  <h1><a href="/artista/${album.artistSlug}/">${escHtml(album.a)}</a> — ${escHtml(album.t)}</h1>
  <div class="tags">
    <span class="tag yr">${album.year}</span>
    ${album.o ? `<span class="tag">${escHtml(album.o)}</span>` : ""}
    ${album.l ? `<span class="tag">${escHtml(album.l)}</span>` : ""}
  </div>
  <img class="cover" src="${escAttr(coverUrl)}" alt="Portada de ${escAttr(album.t)} de ${escAttr(album.a)}" width="360" height="360">
  ${linksHtml}
  ${
    album.tk && album.tk.length
      ? `<h2>Tracklist</h2>
  <ol class="tk">${album.tk.map((t) => `<li>${escHtml(t)}</li>`).join("")}</ol>`
      : ""
  }
  <a class="cta" href="/catalogo.html#${ctaHash}">Votar y comentar este disco</a>
  ${
    moreArtist.length
      ? `<h2>Más de ${escHtml(album.a)}</h2>
  <div class="grid">${cardsHtml(moreArtist)}</div>`
      : ""
  }
  ${
    moreYear.length
      ? `<h2>Más discos de ${album.year}</h2>
  <div class="grid">${cardsHtml(moreYear)}</div>`
      : ""
  }
</main>
${footerHtml()}
</body>
</html>`;
}

// ── Artist page ──────────────────────────────────────────────────

function generateArtistPage(artistSlug) {
  const artist = artistMap[artistSlug];
  const profile = artist.profile || {};
  const canonical = `${SITE}/artista/${artistSlug}/`;
  const cities = [...artist.cities];
  const labels = [...artist.labels];
  const years = [...artist.years].sort();
  const nDiscos = artist.albums.length;

  const titleTag = truncate(
    `${artist.name} — Discografía y perfil | EUPB Archivo`,
    60
  );
  const bioTrunc = truncate(profile.bio || "", 120);
  const desc = escAttr(
    truncate(
      `${artist.name}: ${nDiscos} disco${nDiscos > 1 ? "s" : ""} (${years[0]}–${years[years.length - 1]}). ${cities.join(", ")}. ${bioTrunc}`.trim(),
      160
    )
  );

  const avatarUrl = profile.photo || artist.albums[0]?.cover || `${SITE}/nocover.jpg`;

  // Social links
  const social = profile.social || {};
  const socialLinks = Object.entries(social)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<a href="${escAttr(v)}" target="_blank" rel="noopener">${escHtml(k)}</a>`
    )
    .join("");

  // Schema.org JSON-LD
  const albumsList = artist.albums.map((a) => ({
    "@type": "MusicAlbum",
    name: a.t,
    datePublished: `${a.year}`,
    url: `${SITE}/disco/${a.slug}/`,
  }));

  const sameAs = Object.values(social).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    image: avatarUrl,
    genre: "Hip Hop",
    album: albumsList,
  };
  if (cities.length) jsonLd.foundingLocation = { "@type": "Place", name: cities[0] };
  if (sameAs.length) jsonLd.sameAs = sameAs;

  function cardsHtml(albums) {
    return albums
      .map(
        (a) => `<a href="/disco/${a.slug}/" class="card">
      <img src="${escAttr(a.cover || SITE + "/nocover.jpg")}" alt="${escAttr(a.a)} — ${escAttr(a.t)}" loading="lazy" width="280" height="280">
      <div class="info"><div class="ca">${a.year}</div><div class="ct">${escHtml(a.t)}</div></div>
    </a>`
      )
      .join("\n");
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(titleTag)}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escAttr(titleTag)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${escAttr(avatarUrl)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="EUPB Archivo">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(titleTag)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${escAttr(avatarUrl)}">
<meta name="theme-color" content="#ed1c24">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head>
<body>
${headerHtml()}
<main class="wrap">
  <nav class="bc" aria-label="Breadcrumb">
    <a href="/">INICIO</a><span>›</span><a href="/catalogo.html">ARTISTAS</a><span>›</span>${escHtml(artist.name)}
  </nav>
  ${profile.photo ? `<img class="avatar" src="${escAttr(profile.photo)}" alt="${escAttr(artist.name)}" width="160" height="160">` : ""}
  <h1>${escHtml(artist.name)}</h1>
  <div class="tags">
    ${cities.map((c) => `<span class="tag">${escHtml(c)}</span>`).join("")}
    ${labels.map((l) => `<span class="tag">${escHtml(l)}</span>`).join("")}
  </div>
  <div class="stats">
    <div class="stat"><div class="n">${nDiscos}</div><div class="l">Discos</div></div>
    <div class="stat"><div class="n">${years[0]}–${years[years.length - 1]}</div><div class="l">Años activo</div></div>
  </div>
  ${profile.bio ? `<p class="bio">${escHtml(profile.bio)}</p>` : ""}
  ${socialLinks ? `<div class="social">${socialLinks}</div>` : ""}
  <a class="cta" href="/catalogo.html#artista/${artistSlug}">Ver en el catálogo</a>
  <h2>Discografía</h2>
  <div class="grid">${cardsHtml(artist.albums)}</div>
</main>
${footerHtml()}
</body>
</html>`;
}

// ── Generate everything ──────────────────────────────────────────

console.log("Generando páginas estáticas...");

let discoCount = 0;
for (const album of allAlbums) {
  const dir = path.join(__dirname, "disco", album.slug);
  mkdirp(dir);
  fs.writeFileSync(path.join(dir, "index.html"), generateDiscoPage(album));
  discoCount++;
}
console.log(`✓ ${discoCount} páginas de disco generadas`);

let artistCount = 0;
for (const slug of Object.keys(artistMap)) {
  const dir = path.join(__dirname, "artista", slug);
  mkdirp(dir);
  fs.writeFileSync(path.join(dir, "index.html"), generateArtistPage(slug));
  artistCount++;
}
console.log(`✓ ${artistCount} páginas de artista generadas`);

// ── Sitemap ──────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/catalogo.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

for (const album of allAlbums) {
  sitemap += `  <url>
    <loc>${SITE}/disco/${album.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

for (const slug of Object.keys(artistMap)) {
  sitemap += `  <url>
    <loc>${SITE}/artista/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

sitemap += `</urlset>`;
fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap);
console.log(
  `✓ sitemap.xml generado (${2 + discoCount + artistCount} URLs)`
);

// ── robots.txt ───────────────────────────────────────────────────

fs.writeFileSync(
  path.join(__dirname, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
);
console.log("✓ robots.txt generado");

console.log(
  `\nTotal: ${discoCount + artistCount} páginas estáticas generadas.`
);
