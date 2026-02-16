<!-- app/components/header/TopBar.vue -->
<template>
  <section
    v-if="info"
    class="w-full bg-[#87003F] text-white text-sm py-3 px-12 max-lg:px-8 flex items-center justify-between gap-3 max-md:items-start"
    dir="rtl"
  >
    <div class="flex flex-wrap items-center gap-2 text-base font-medium">
      <span class="pl-2">{{ info.newsText }}</span>
      <div
        class="flex items-center gap-1 opacity-90 hover:opacity-100 transition"
      >
        <img src="/icons/instagram.svg" alt="instagram" class="w-5 h-5" />
        <span class="max-md:hidden">اینستاگرام:</span>
        <a
          :href="info.socialLink"
          target="_blank"
          rel="noreferrer"
          class="underline decoration-white/30 underline-offset-4 hover:decoration-white"
        >
          {{ info.socialLabel }}
        </a>
      </div>
    </div>
    <div class="hidden lg:flex text-base font-extrabold gap-2">
      <span>{{ info.welcomeMessage }}</span>
    </div>
    <div class="flex gap-1 items-center text-base font-normal max-md:hidden">
      <img src="/icons/location.svg" alt="location" class="w-5 h-5" />
      <span>{{ info.address }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TopBarInfo {
  newsText: string;
  socialLabel: string;
  socialLink: string;
  welcomeMessage: string;
  address: string;
}

const info = ref<TopBarInfo>({
  newsText: "انواع سوتین و ست های فانتزی شارژ شد",
  socialLabel: "mahsetishop",
  socialLink: "https://instagram.com/mahsetishop",
  welcomeMessage: "به ماه‌سِتی خوش آمدید",
  address: "آدرس: گرگان، خیابان پنج آذر، جنب سالن تختی",
});
</script>
