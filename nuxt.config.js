export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
 
   imports: {
     dirs: ['composables']
   },
 
   modules: [
     "@pinia/nuxt",
     "@nuxt/ui",
   ],
 
   plugins: [
     "~/plugins/axios.js",
   ],
 
   devtools: { enabled: true },
 
   css: [
     "~/assets/css/main.css",
     "~/assets/css/fonts.css",
   ],
 
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
       apiBase:
         process.env.NUXT_PUBLIC_API_BASE ||
         "https://api.vitamixfruit.com/api/v1",
     },
   },
 })
 