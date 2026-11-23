<template>
  <div class="w-full rounded-2xl">
    <Swiper
      :key="isMobile ? 'mobile' : 'desktop'"
      :modules="[Autoplay, Pagination, Navigation]"
      :slides-per-view="1"
      :loop="false"
      :autoplay="{ delay: 3500, disableOnInteraction: false }"
      :pagination="true"
      :navigation="{ nextEl: '.hero-next', prevEl: '.hero-prev' }"
      class="hero-swiper"
      dir="rtl"
    >
      <SwiperSlide v-for="slide in visibleSlides" :key="slide.id" class="w-full">
        <nuxt-link
          :to="slide.link"
          class="block w-full rounded-[20px] overflow-hidden bg-[#f9dada]"
          :class="isMobile ? 'aspect-[9/16]' : 'aspect-[16/9]'"
        >
          <img
            :src="$getImageUrl(slide.image)"
            :alt="slide.title || 'banner'"
            class="w-full h-full object-cover"
          />
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { $getImageUrl } = useNuxtApp();
const props = defineProps<{ slides: any[] }>();

// breakpoint موبایل (هم‌راستا با 580px قبلی)
const isMobile = ref(false);
let mq: MediaQueryList | null = null;
const update = () => { isMobile.value = !!mq?.matches; };

onMounted(() => {
  mq = window.matchMedia("(max-width: 580px)");
  update();
  mq.addEventListener("change", update);
});
onBeforeUnmount(() => mq?.removeEventListener("change", update));

// فقط اسلایدهای مربوط به دستگاه فعلی
const visibleSlides = computed(() => {
  const type = isMobile.value ? "mobile" : "desktop";
  const filtered = props.slides.filter((s) => s.type === type);
  // اگر برای یک نوع بنری نبود، همه را نشان بده تا خالی نماند
  return filtered.length ? filtered : props.slides;
});
</script>
<style scoped>

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
