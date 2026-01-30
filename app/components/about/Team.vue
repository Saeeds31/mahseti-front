<template>
  <section class="mt-20 sm:mt-28 lg:mt-40">
    <homeTitleSection
      class="mt-12 sm:mt-16 lg:mt-20"
      titleBlack="معرفـی "
      titleStrong="تیم مدیـریـت"
      description="میوه های خشک سالم و خوشمزه میان وعده ای انرژی بخش برای هر روز"
    />

    <!-- Desktop Grid -->
    <div class="hidden md:flex gap-4 lg:gap-6 mt-8">
      <figure class="w-[25%] relative group cursor-pointer">
        <!-- <span class="absolute top-3 right-3 text-primery bg-secondary-fade py-1 px-3 rounded-inner border border-1-dark z-10">
          مدیریت
        </span> -->
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
        <div class="absolute bottom-3 sm:bottom-4 lg:bottom-5 right-3 sm:right-4 lg:right-5">
          <h4 class="font-bold text-primery text-base lg:text-lg">جناب علی رضا فاطمی فر</h4>
          <h5 class="font-bold text-[#f6f6f6] text-sm lg:text-base">کارشناس فضای مجازی</h5>
        </div>
      </figure>

      <figure class="w-[25%] relative group cursor-pointer">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
        <div class="absolute bottom-3 sm:bottom-4 lg:bottom-5 right-3 sm:right-4 lg:right-5">
          <h4 class="font-bold text-primery text-base lg:text-lg">جناب علی رضا فاطمی فر</h4>
          <h5 class="font-bold text-[#f6f6f6] text-sm lg:text-base">کارشناس فضای مجازی</h5>
        </div>
      </figure>

      <figure class="w-[25%] relative group cursor-pointer">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
        <div class="absolute bottom-3 sm:bottom-4 lg:bottom-5 right-3 sm:right-4 lg:right-5">
          <h4 class="font-bold text-primery text-base lg:text-lg">جناب علی رضا فاطمی فر</h4>
          <h5 class="font-bold text-[#f6f6f6] text-sm lg:text-base">کارشناس فضای مجازی</h5>
        </div>
      </figure>

      <figure class="w-[25%] relative group cursor-pointer">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
        <div class="absolute bottom-3 sm:bottom-4 lg:bottom-5 right-3 sm:right-4 lg:right-5">
          <h4 class="font-bold text-primery text-base lg:text-lg">جناب علی رضا فاطمی فر</h4>
          <h5 class="font-bold text-[#f6f6f6] text-sm lg:text-base">کارشناس فضای مجازی</h5>
        </div>
      </figure>
    </div>

    <!-- Mobile Swiper -->
    <div class="block md:hidden mt-8 px-4">
      <Swiper
        :slides-per-view="1.2"
        :space-between="16"
        :centeredSlides="false"
        :pagination="{ clickable: true }"
        :modules="[SwiperPagination]"
        class="team-swiper"
      >
        <SwiperSlide>
          <figure class="relative">
            <!-- <span class="absolute top-3 right-3 text-primery bg-secondary-fade py-1 px-3 rounded-inner border border-1-dark z-10">
              مدیریت
            </span> -->
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
            <div class="absolute bottom-3 right-3">
              <h4 class="font-bold text-primery text-base">جناب علی رضا فاطمی فر</h4>
              <h5 class="font-bold text-[#f6f6f6] text-sm">کارشناس فضای مجازی</h5>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide>
          <figure class="relative">
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
            <div class="absolute bottom-3 right-3">
              <h4 class="font-bold text-primery text-base">جناب علی رضا فاطمی فر</h4>
              <h5 class="font-bold text-[#f6f6f6] text-sm">کارشناس فضای مجازی</h5>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide>
          <figure class="relative">
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
            <div class="absolute bottom-3 right-3">
              <h4 class="font-bold text-primery text-base">جناب علی رضا فاطمی فر</h4>
              <h5 class="font-bold text-[#f6f6f6] text-sm">کارشناس فضای مجازی</h5>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide>
          <figure class="relative">
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/Mask group.png" alt="علی رضا فاطمی فر" />
            <div class="absolute bottom-3 right-3">
              <h4 class="font-bold text-primery text-base">جناب علی رضا فاطمی فر</h4>
              <h5 class="font-bold text-[#f6f6f6] text-sm">کارشناس فضای مجازی</h5>
            </div>
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

const SwiperPagination = Pagination
</script>


<style scoped>
.team-swiper {
  padding-bottom: 45px;
}

.team-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.team-swiper :deep(.swiper-pagination-bullet) {
  background: var(--border-light);
  opacity: 1;
  width: 8px;
  height: 8px;
  transition: all 0.3s ease;
}

.team-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--bg-secondary);
  width: 24px;
  border-radius: 4px;
}

/* Optional hover effect for desktop */
.group:hover img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

@media screen and (max-width: 768px) {
  .team-swiper {
    padding-bottom: 40px;
  }

  .team-swiper :deep(.swiper-pagination-bullet) {
    width: 6px;
    height: 6px;
  }

  .team-swiper :deep(.swiper-pagination-bullet-active) {
    width: 20px;
  }
}
</style>