<template>
  <div id="homeSlider" class=" container py-8 rounded relative overflow-hidden">
    <figure class="w-full">
      <!-- برای دسکتاپ -->
      <img
        class="hidden md:block w-full  absolute inset-0 -z-10"
        src="../../assets/images/sliderBack.png"
        alt=""
      />

      <!-- برای موبایل -->
      <img
        class="block md:hidden w-full  rounded absolute inset-0 -z-10"
        src="../../assets/images/sliderBack3.png"
        alt=""
      />
    </figure>

    <div
      class="flex flex-col w-full justify-center items-center md:my-4  md:mt-10 px-4"
    >
      <h1
        class="text-xl sm:text-3xl md:text-4xl lg:text-[50px] font-bold text-center"
      >
        <span class="text-strong">ویتامیکس فروت</span>
       فروشگاه
      </h1>
      <p
        class="w-full sm:w-[80%] md:w-[70%] lg:w-[50%] text-center text-sm sm:text-base md:text-lg mt-3 md:mt-4"
      >
        میوه خشک، میان‌وعده‌ای سالم و خوش‌طعم برای روزهای پرمشغله. پر از
        ویتامین، فیبر و انرژی طبیعی که باعث میشه هم سرحال باشی هم حس سبکی کنی.
      </p>
    </div>

    <Swiper
      v-if="sliders && sliders.length"
      :modules="modules"
      :loop="true"
      :centered-slides="true"
      :grab-cursor="true"
      :speed="700"
      :slides-per-view="3"
      :space-between="60"
      :effect="'coverflow'"
      :coverflow-effect="coverflowConfig"
      :pagination="{ clickable: true }"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      class="w-[80%] mx-auto custom-swiper mt-0 xl:mt-12"
    >
      <SwiperSlide v-for="(slide, i) in sliders" :key="i" class="product-slide gap-6">
        <div class="slide-item">
          <img
            :src="$getImageUrl(slide.image) "
            :alt="slide.title || 'slide-' + i"
            class="product-image"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import imgslider from "../../assets/images/headerProduct.png";
const modules = [EffectCoverflow, Pagination, Autoplay];
// مرکز بزرگ‌تر و کناری‌ها محو و نصفه دیده بشن
const coverflowConfig = {
  rotate: 0,
  stretch: 0,
  depth: 100,
  modifier: 1.5,
  slideShadows: false,
};


const { $getImageUrl } = useNuxtApp();

defineProps({
  sliders: Array,
});




</script>

<style scoped>
/* حالت سه‌تایی زیبا با وسط بزرگ‌تر */
.custom-swiper :deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(0.65);
  opacity: 0.4;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* وسطی بزرگ‌تر */
.custom-swiper :deep(.swiper-slide-active) {
  transform: scale(1.3);
  opacity: 1;
  z-index: 3;
}

/* کناری‌ها کمی بزرگ‌تر از بقیه ولی محو‌تر */
.custom-swiper :deep(.swiper-slide-next),
.custom-swiper :deep(.swiper-slide-prev) {
  transform: scale(0.75);
  opacity: 0.6;
}

/* smooth حرکت نرم */
.custom-swiper :deep(.swiper-wrapper) {
  transition-timing-function: cubic-bezier(0.22, 0.9, 0.32, 1);
}

/* عکس محصول */
.product-image {
  height: 380px;
  object-fit: contain;
}

/* pagination */
.custom-swiper :deep(.swiper-pagination-bullet) {
  background-color: var(--bg-secondary-fade);
  opacity: 0.6;
  transition: all 0.25s ease;
  margin-top: 20px;
}
.custom-swiper :deep(.swiper-pagination-bullet-active) {
  background-color: var(--bg-secondary);
  opacity: 1;
  transform: scale(1.4);
}

/* ریسپانسیو */
@media (max-width: 575px) {
  .custom-swiper :deep(.swiper-slide) {
    transform: scale(1);
    opacity: 1;
  }
  .product-image {
    height: 180px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .custom-swiper {
    padding: 0 40px;
  }
  .custom-swiper :deep(.swiper-slide) {
    transform: scale(0.9);
  }
  .custom-swiper :deep(.swiper-slide-active) {
    transform: scale(1.05);
  }
}
</style>

