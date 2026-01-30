<template>
  <section class="mt-20 sm:mt-28 lg:mt-40">
    <homeTitleSection
      class="mt-12 sm:mt-16 lg:mt-20"
      titleBlack="مجوز های"
      titleStrong="ویتامیکس فروت"
      description="میوه های خشک سالم و خوشمزه میان وعده ای انرژی بخش برای هر روز"
    />

    <!-- Desktop Grid -->
    <div class="hidden md:flex gap-4 lg:gap-6 mt-8">
      <figure class="w-[25%]">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 1" />
      </figure>
      <figure class="w-[25%]">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 2" />
      </figure>
      <figure class="w-[25%]">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 3" />
      </figure>
      <figure class="w-[25%]">
        <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 4" />
      </figure>
    </div>

    <!-- Mobile Swiper -->
    <div class="block md:hidden mt-8">
      <Swiper
        :slides-per-view="1.2"
        :space-between="16"
        :centeredSlides="false"
        :pagination="{ clickable: true }"
        :modules="[SwiperPagination]"
        class="certificates-swiper"
      >
        <SwiperSlide>
          <figure>
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 1" />
          </figure>
        </SwiperSlide>
        <SwiperSlide>
          <figure>
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 2" />
          </figure>
        </SwiperSlide>
        <SwiperSlide>
          <figure>
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 3" />
          </figure>
        </SwiperSlide>
        <SwiperSlide>
          <figure>
            <img class="rounded w-full h-auto object-cover" src="../../assets/images/qq.png" alt="مجوز 4" />
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
.certificates-swiper {
  padding-bottom: 40px;
}
.certificates-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.certificates-swiper :deep(.swiper-pagination-bullet) {
  background: var(--border-light);
  opacity: 1;
  width: 8px;
  height: 8px;
  transition: all 0.3s ease;
}

.certificates-swiper :deep(.swiper-pagination-bullet-active) {
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
  .certificates-swiper {
    padding-bottom: 40px;
  }

  .certificates-swiper :deep(.swiper-pagination-bullet) {
    width: 6px;
    height: 6px;
  }

  .certificates-swiper :deep(.swiper-pagination-bullet-active) {
    width: 20px;
  }
}
</style>