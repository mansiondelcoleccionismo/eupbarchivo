export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Archivos estáticos: SIEMPRE servir directamente sin pasar por el Worker
    if (path.match(/\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|mp3|mp4|webm|xml|txt|webmanifest|map)$/i) || path === '/') {
      return env.ASSETS.fetch(request);
    }

    const ua = (request.headers.get("user-agent") || "").toLowerCase();

    // Detectar bots de redes sociales
    const isBot = /whatsapp|telegrambot|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|pinterest/i.test(ua);

    if (!isBot) {
      // Usuario normal pidiendo ruta SPA: servir index.html
      return env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
    }

    // Bot detectado: generar meta tags dinámicos
    const cleanPath = path.replace(/^\//, "");

    let title = "EUPB — Archivo Digital del Rap en Español (2010-2019)";
    let description = "El catálogo más completo del hip-hop en español. 100+ discos, 220+ artistas.";
    let image = url.origin + "/og-image.png";
    let pageUrl = url.href;

    try {
      const dataResp = await env.ASSETS.fetch(new Request(url.origin + "/og-data.json"));
      if (dataResp.ok) {
        const data = await dataResp.json();

        if (cleanPath.startsWith("disco/")) {
          const key = cleanPath.replace("disco/", "");
          const disco = data.discos[key];
          if (disco) {
            title = disco.a + " — " + disco.t + " | EUPB";
            description = "Escucha " + disco.t + " de " + disco.a + ". Descubre el tracklist, vota y comenta en el archivo del rap español.";
            if (disco.cover) image = disco.cover;
          }
        } else if (cleanPath.startsWith("artista/")) {
          const slug = cleanPath.replace("artista/", "");
          const artista = data.artistas[slug];
          if (artista) {
            title = artista.name + " | EUPB — Archivo del Rap Español";
            description = "Discografía completa de " + artista.name + ". " + artista.count + " discos en el archivo del rap español.";
          }
        }
      }
    } catch (e) {
      // Si falla, usar los valores por defecto
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="EUPB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
</head>
<body>
<p><a href="${pageUrl}">${title}</a></p>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};
