<!-- app/components/header/TopBar.vue -->
<template>
  <section v-if="siteData"
    class="w-full bg-[#1c1395] text-white text-sm py-3 px-3 md:px-12  flex items-center justify-between gap-3 max-md:items-start"
    dir="rtl">
    <div class="w-full md:w-max justify-between flex flex-wrap items-center gap-2 text-base max-md:text-xs font-medium">
      <div class="ticker">
        <div class="ticker-text">
          {{ siteData.top_header_title }}
        </div>
      </div>
      <div class="flex items-center gap-1 opacity-90 hover:opacity-100 transition">
        <img src="/icons/instagram.svg" alt="instagram" class="w-5 h-5" />
        <span class="max-md:hidden">اینستاگرام:</span>
        <a :href="social.instagram" target="_blank" rel="noreferrer"
          class="underline decoration-white/30 underline-offset-4 hover:decoration-white">
          @mahsetishop
        </a>
      </div>
    </div>
    <div class="hidden lg:flex text-base font-extrabold gap-2">
      <span>{{ siteData.welcome_message }}</span>
    </div>
    <a href="https://rubika.ir/mahsetishp" class="flex gap-1 items-center text-base font-normal max-md:hidden">
      <img src="~/assets/images/rubika.png" alt="location" class="w-5 h-5" />
      <span>ماه ستی در روبیکا</span>
    </a>
  </section>
</template>

<script setup>
import { useSettingStore } from "~/store/settings.js";
const settingStore = useSettingStore();
const { settings } = storeToRefs(settingStore);

const siteData = computed(
  () => settings.value?.site
);
const social = computed(
  () => settings.value?.social
);




</script>
<style>
.ticker {
  width: 270px;
  overflow: hidden;
  white-space: nowrap;
}

.ticker-text {
  display: inline-block;
  animation: ticker 20s linear infinite;
}

@keyframes ticker {
  0% {
    transform: translateX(-40%);
  }

  100% {
    transform: translateX(100%);
  }
}

@media (max-width:580px) {
  .ticker {
    width: calc(100vw - 150px);
  }
}
</style>