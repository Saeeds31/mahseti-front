<template>
  <div class="w-full h-[450px] overflow-hidden rounded-2xl">
    <Swiper
      :modules="[Autoplay, Pagination, Navigation]"
      :slides-per-view="1"
      :loop="false"
      :autoplay="{ delay: 3500, disableOnInteraction: false }"
      :pagination="true"
      :navigation="{
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      }"
      class="hero-swiper"
      dir="rtl"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id" class="w-full h-full">
        <div class="relative w-full h-full bg-[#f9dada] rounded-[20px] px-8 py-9 flex justify-between">
          <div class="absolute left-[-12px] top-0 bottom-0 flex -z-0">
            <img :src="slide.image1" class="h-full object-cover" />
          </div>

          <div class="max-lg:hidden absolute left-1/3 top-1/2 -translate-y-1/2">
            <img :src="slide.image2" class="object-contain" />
          </div>

          <div class="w-[45%] max-lg:w-full ml-auto flex flex-col gap-4 text-right pt-4 z-50">
            <h1 class="text-[1.3rem] font-extrabold text-[#2c2c2c] leading-[1.4]">
              {{ slide.title }}
            </h1>

            <p class="leading-[1.9] text-[0.98rem] text-[#424242]">
              {{ slide.description }}
            </p>

            <NuxtLink
              :to="slide.ctaLink"
              class="self-start bg-[#ED2E68] text-white px-7 py-3 rounded-xl text-[0.95rem] font-semibold"
            >
              {{ slide.ctaText }}
            </NuxtLink>

            <img :src="slide.image3" class="w-1/5 absolute -bottom-0" />
          </div>
        </div>
      </SwiperSlide>

      <div class="hero-prev custom-nav-btn">
        <img src="/icons/arrow.svg" />
      </div>

      <div class="hero-next custom-nav-btn">
        <img src="/icons/arrow.svg" class="rotate-180" />
      </div>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

defineProps<{ slides: any[] }>();
</script>

<style scoped>
:deep(.hero-swiper) {
  height: 100%;
}
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #fff;
  opacity: 0.9;
  border-radius: 50%;
  transition: all 0.3s ease;
}
:deep(.swiper-pagination-bullet-active) {
  width: 20px;
  height: 10px;
  background: #0d44d0;
  border-radius: 999px;
  opacity: 1;
}
:deep(.custom-nav-btn) {
  width: 32px;
  height: 32px;
  background: #ed2e68;
  border-radius: 30%;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 20;
  position: absolute;
}
:deep(.hero-prev) {
  right: 12px !important;
}
:deep(.hero-next) {
  left: 12px !important;
}
:deep(.custom-nav-btn.swiper-button-disabled) {
  background: rgba(255, 255, 255, 0.35) !important;
  backdrop-filter: blur(2px);
  border: 2px solid !important;
  border: #575555 !important;
  opacity: 0.7;
  cursor: not-allowed;
}
.custom-nav-btn.swiper-button-disabled img {
  filter: brightness(0) saturate(100%);
  opacity: 0.7;
}
</style>
