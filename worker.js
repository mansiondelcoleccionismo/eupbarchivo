export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Raíz del sitio: servir directamente
    if (path === "/" || path === "") {
      return env.ASSETS.fetch(request);
    }

    // 2. Archivos estáticos con extensión (CSS, JS, imágenes, etc.): servir directamente
    //    PERO no interceptar rutas que terminan en / (como /artista/3yo/)
    if (path.match(/\.[a-z0-9]{1,10}$/i) && !path.endsWith("/index.html")) {
      return env.ASSETS.fetch(request);
    }

    // 3. Rutas de artista/ o disco/: decidir según user-agent
    if (path.match(/^\/(artista|disco)\//)) {
      const ua = (request.headers.get("user-agent") || "").toLowerCase();

      const isBot = /googlebot|bingbot|yandexbot|baiduspider|duckduckbot|whatsapp|telegrambot|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|pinterest|applebot|semrushbot|ahrefsbot|mj12bot|dotbot/i.test(ua);

      if (isBot) {
        // Bot: servir la página estática SEO (artista/X/index.html o disco/X/index.html)
        // Cloudflare Pages sirve index.html automáticamente para rutas que terminan en /
        return env.ASSETS.fetch(request);
      }

      // Usuario normal: servir el SPA (index.html de la raíz)
      return env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
    }

    // 4. Cualquier otra ruta sin extensión: SPA fallback
    return env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
  }
};
