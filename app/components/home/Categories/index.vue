<template>
  <section class="container gap">
    <HomeTitleSection
      titleBlack="دسته بندی های"
      titleStrong="ما"
      description=" راحتی، تنوع، پوشش زیبا، و تجربه خریدی فراموش‌نشدنی"
    />

    <Swiper
      :space-between="16"
      :breakpoints="{
        0: {
          slidesPerView: 1.2,
          spaceBetween: 16,
        },
        640: {
          slidesPerView: 2.2,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
      }"
    >
      <SwiperSlide v-for="(item, index) in categories" :key="index">
        <HomeCategoriesCard :item="item" />
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});
</script>
