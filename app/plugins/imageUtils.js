// app/plugins/imageUtils.js
export default defineNuxtPlugin((nuxtApp) => {
  const baseURL = "https://api.vitamixfruit.com/storage_public/";
  const getImageUrl = (path) => {
    if (!path) return "";

    // اگر URL کامل بود، همان را برگردان
    if (
      typeof path === "string" &&
      (path.startsWith("http://") || path.startsWith("https://"))
    ) {
      return path;
    }

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${baseURL}${cleanPath}`;
  };

  return {
    provide: {
      getImageUrl,
    },
  };
});
