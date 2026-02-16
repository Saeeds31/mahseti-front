<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/composables/api/useApi";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const offers = ref<any[]>([]);
const { getHome } = useApi();

const fetchOffers = async () => {
  try {
    const res = await getHome();
    const home = res?.data?.data || res?.data || res;
    offers.value = home?.top_discounted_products || [];
  } catch {
    offers.value = [];
  }
};

onMounted(fetchOffers);
</script>

<template>
  <section class="w-full py-10 mb-56">
    <!-- باکس آبی -->
    <div class="relative w-full h-[350px] bg-[#0D44D0] py-5">
      <!-- عنوان دستی -->
      <h2 class="text-white text-lg font-semibold pr-6 mb-8 max-md:mb-14 text-right">
        پیشنهادات ویژه ماه ستی
      </h2>

      <!-- بنر درصد -->
      <div class="absolute max-md:w-[25%] right-2 top-1/2 -translate-y-1/3">
        <img
          src="/sample/offer-banner.svg"
          class="w-full h-full object-contain"
          alt=""
        />
      </div>

      <!-- اسلایدر -->
      <div class="relative pr-56 max-md:pr-28 h-full -top-20">
        <ClientOnly>
          <div class="relative w-full h-full">
            <!-- Navigation Buttons -->
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
              <SwiperSlide v-for="item in offers" :key="item.id">
                <SharedProductCard :product="item" />
              </SwiperSlide>
            </Swiper>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
