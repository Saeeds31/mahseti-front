export default defineEventHandler(async () => {
  try {
    const data = await $fetch<{
      success: boolean;
      data: Array<{
        loc: string;
        lastmod: string;
        changefreq: string;
        priority: string;
      }>;
    }>("https://api.mahseti.shop/api/v1/sitemap-urls");

    return data?.data ?? [];
  } catch (error) {
    console.error("خطا در دریافت لیست سایت‌مپ:", error);
    return [];
  }
});
