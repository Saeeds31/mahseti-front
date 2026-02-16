// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  imports: {
    dirs: ["composables"],
  },

  modules: ["@pinia/nuxt", "@nuxt/ui"],

  plugins: ["~/plugins/axios.js"],

  devtools: { enabled: true },

  css: ["~/assets/css/main.css", "~/assets/css/fonts.css"],

  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
        lang: "fa",
      },
      title: "Vitamix / ویتامیکس /فروش میوه خشک",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: "https://api.mahseti.shop",
    },
  },

  // تنظیمات پروکسی برای محیط توسعه (رفع CORS و 404)
  nitro: {
    devProxy: {
      "/api-proxy/": {
        target: "https://api.mahseti.shop/",
        changeOrigin: true,
        prependPath: false,
      },
    },
  },

  // تنظیمات مسیرها (برای سازگاری با SSR و هیبرید)
  routeRules: {
    "/api-proxy/**": {
      proxy: "https://api.mahseti.shop/**",
    },
  },
});
