<!-- app/components/product/image.vue -->
<script setup>
   const { $getImageUrl } = useNuxtApp();

import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, FreeMode, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  thumbnails: {
    type: Array,
    required: true,
  },
});

const thumbsSwiper = ref(null);
const mainSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const setMainSwiper = (swiper) => {
  mainSwiper.value = swiper;
};

const goNext = () => {
  if (mainSwiper.value) {
    mainSwiper.value.slideNext();
  }
};

const goPrev = () => {
  if (mainSwiper.value) {
    mainSwiper.value.slidePrev();
  }
};
</script>

<template>
  <div class="">
    <!-- اسلایدر اصلی -->
    <Swiper
      @swiper="setMainSwiper"
      :modules="[Thumbs]"
      :thumbs="{ swiper: thumbsSwiper }"
      :loop="true"
      class="main-swiper relative rounded-xl overflow-hidden shadow"
    >
      <SwiperSlide v-for="(image, index) in images" :key="index">
        <figure class="flex justify-center items-center p-10 bg-accent">
          <img
            :src="$getImageUrl(image)"
            alt="تصویر محصول"
            class="w-[40%] object-cover aspect-square"
          />
        </figure>
      </SwiperSlide>
    </Swiper>

    <!-- تصاویر کوچک با فلش‌های کناری -->
    <div class="flex items-center gap-4 mt-3">
      <!-- فلش قبلی -->


            <div
        @click="goNext"
        class="cursor-pointer flex-shrink-0"
      >
        <div
          class="icon-btn w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <!-- اسلایدر thumbnail -->
<Swiper
  @swiper="setThumbsSwiper"
  :slides-per-view="2"
  :space-between="16"
  :free-mode="true"
  :watch-slides-progress="true"
  :loop="true"
  :modules="[FreeMode, Thumbs]"
  class="thumbs-swiper flex-1"
  :breakpoints="{

    480: { 
      slidesPerView: 3, 
      spaceBetween: 10 
    },
    768: { 
      slidesPerView: 4, 
      spaceBetween: 12 
    },
    1024: { 
      slidesPerView: 4, 
      spaceBetween: 14 
    },
    1280: { 
      slidesPerView: 4, 
      spaceBetween: 16 
    }
  }"
>
  <SwiperSlide
    v-for="(thumb, index) in thumbnails"
    :key="index"
    class="cursor-pointer"
  >
    <figure
      class="bg-accent w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-transparent hover:border-strong transition-all"
    >
      <img :src="$getImageUrl(thumb)" class="p-2 rounded-lg" />
    </figure>
  </SwiperSlide>
</Swiper>


      <!-- فلش بعدی -->
      <div
        @click="goPrev"
        class="cursor-pointer flex-shrink-0"
      >
        <div
          class="icon-btn w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-6 h-6 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* استایل فلشها وقتی هاور میشن */
.icon-btn {
  background-color: var(--bg-accent);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background-color: var(--bg-secondary);
  color: white;
}

/* وقتی اسلایدر فعاله، thumbnail برجسته بشه */
:deep(.swiper-slide-thumb-active img) {
  opacity: 1 !important;
  border-color: var(--bg-secondary) !important;
  box-shadow: 0 0 0 3px rgba(114, 183, 66, 0.3);
}
</style>