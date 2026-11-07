// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  const urls = await $fetch("/api/sitemap-urls");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u: any) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return xml;
});
