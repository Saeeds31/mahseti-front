<!-- app/components/home/sliders/VotedRestockSlider.client.vue -->
<!-- <template>
  <Swiper
    dir="rtl"
    :modules="[Navigation]"
    :space-between="40"
    :breakpoints="{
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
      1280: { slidesPerView: 4 },
    }"
    :navigation="{
      nextEl: '.voted-next',
      prevEl: '.voted-prev',
    }"
  >
    <SwiperSlide v-for="product in products" :key="product.id">
      <SharedProductCard :product="product" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});
</script> -->
<!-- app/components/home/sliders/HomeOfferSlider.client.vue -->
<template>
  <div class="relative w-full h-full">
    <div class="hero-nav">
      <div class="hero-prev custom-nav-btn">
        <img src="/icons/arrow.svg" alt="قبلی" />
      </div>
      <div class="hero-next custom-nav-btn">
        <img src="/icons/arrow.svg" class="rotate-180" alt="بعدی" />
      </div>
    </div>

    <Swiper
      dir="rtl"
      :modules="[Navigation, Pagination]"
      :slides-per-view="1.2"
      :space-between="12"
      :breakpoints="{
        480: { slidesPerView: 1.5, spaceBetween: 16 },
        640: { slidesPerView: 2.2, spaceBetween: 20 },
        768: { slidesPerView: 2.4, spaceBetween: 24 },
        1024: { slidesPerView: 3.2, spaceBetween: 28 },
        1280: { slidesPerView: 4.2, spaceBetween: 32 },
      }"
      :navigation="{
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      }"
      class="hero-swiper"
    >
      <SwiperSlide v-for="item in products" :key="item.id">
        <SharedProductCard :product="item" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});
</script>
