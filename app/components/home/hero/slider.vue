<template>
  <div class="w-full h-[450px] overflow-hidden rounded-2xl">
    <Swiper :modules="[Autoplay, Pagination, Navigation]" :slides-per-view="1" :loop="false"
      :autoplay="{ delay: 3500, disableOnInteraction: false }" :pagination="true" :navigation="{
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      }" class="hero-swiper" dir="rtl">
      <SwiperSlide v-for="slide in slides" :key="slide.id" class="w-full h-full">
        <nuxt-link :to="slide.link"
          class="relative w-full h-full bg-[#f9dada] rounded-[20px] px-8 py-9 flex justify-between">
          <div :class="slide.type" class="absolute inset-0 flex z-0">
            <img :src="$getImageUrl(slide.image)" class="h-full w-full object-cover" />
          </div>
        </nuxt-link>
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
const { $getImageUrl } = useNuxtApp();

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
  background: #1c1395;
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
<style>
.swiper-slide:has(.mobile) {
  display: none;
}

@media(max-width:580px) {

  .swiper-slide:has(.desktop) {
    display: none;
  }

  .swiper-slide:has(.mobile) {
    display: block;
  }

}
</style>