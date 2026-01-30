
export default defineNuxtPlugin((nuxtApp) => {
  const baseURL = "https://api.vitamixfruit.com/storage_public/";
  const getImageUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${baseURL}${cleanPath}`;
  };

  return {
    provide: {
      getImageUrl,
    },
  };
});
