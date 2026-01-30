<template>
  <section class="container gap mb-10">
    <homeTitleSection
      titleBlack="مجله   "
      titleStrong="ویتامیکس فروت"
      description="جدیدترین مقالات و نکات مفید درباره میوه‌های خشک و سبک زندگی سالم"
    />

    <div class="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- دو کارت بزرگ -->
      <BigCard
        v-for="(item, index) in list.slice(0, 2)"
        :key="index"
        :card="item"
      />

      <!-- Swiper سمت چپ -->
      <div class="h-[500px]">
        <Swiper
          direction="vertical"
          slides-per-view="auto"
          :space-between="16"
          :mousewheel="true"
          :free-mode="true"
          class="h-full"
        >
          <SwiperSlide
            v-for="(item, index) in list"
            :key="index"
            class="!h-auto"
          >
            <SmallCard :smallcard="item" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <div class="lg:hidden w-full">
      <Swiper :slides-per-view="1.2" :space-between="16" class="w-full">
        <SwiperSlide
          v-for="(item, index) in list"
          :key="index"
          class="!h-auto"
        >
          <BigCard :card="item" />
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import BigCard from "./BigCard.vue";
import SmallCard from "./SmallCard.vue";
defineProps({
  list: Array,
});



</script>

<style scoped>
.swiper-slide {
  height: auto !important;
}
</style>
