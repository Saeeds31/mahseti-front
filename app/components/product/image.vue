<!-- app/components/product/image.vue -->
<script setup>
const { $getImageUrl } = useNuxtApp();

import { ref, onMounted, onUnmounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  video: {
    type: String,
    default: null,
  },
  thumbnails: {
    type: Array,
    required: true,
  },
});

// استیت برای نمایش ویدیو
const showVideo = ref(false);

// استیت برای نمایش زوم تصویر
const showZoom = ref(false);
const currentZoomIndex = ref(0);

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

// توابع مخصوص زوم برای ورق زدن در مودال
const zoomNext = () => {
  if (currentZoomIndex.value < props.images.length - 1) {
    currentZoomIndex.value++;
  } else {
    currentZoomIndex.value = 0; // لوپ به اول
  }
};

const zoomPrev = () => {
  if (currentZoomIndex.value > 0) {
    currentZoomIndex.value--;
  } else {
    currentZoomIndex.value = props.images.length - 1; // لوپ به آخر
  }
};

// تابع باز کردن زوم
const openZoom = (index) => {
  currentZoomIndex.value = index;
  showZoom.value = true;
  document.body.style.overflow = 'hidden';
};

// تابع بستن زوم
const closeZoom = () => {
  showZoom.value = false;
  document.body.style.overflow = '';
};

// مدیریت کلید ESC و کلیدهای جهتی
const handleKeydown = (e) => {
  if (!showZoom.value) return;
  
  if (e.key === 'Escape') {
    closeZoom();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    zoomNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    zoomPrev();
  }
};

// افزودن و حذف event listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// وقتی زوم بسته میشه، ایندکس رو ریست میکنیم
watch(showZoom, (newVal) => {
  if (!newVal) {
    currentZoomIndex.value = 0;
  }
});
</script>

<template>
  <div class="">
    <!-- اسلایدر اصلی -->
    <Swiper @swiper="setMainSwiper" :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }" :loop="true"
      class="main-swiper relative rounded-xl overflow-hidden shadow">
      <SwiperSlide v-for="(image, index) in images" :key="index">
        <figure class="flex justify-center items-center p-10 bg-white relative">
          <img 
            :src="$getImageUrl(image)" 
            alt="تصویر محصول" 
            class="md:w-[60%] w-full object-cover aspect-square cursor-zoom-in scale-125 transition-transform duration-300"
            @click="openZoom(index)"
          />
          <!-- دکمه پلی ویدیو - فقط روی اولین اسلاید -->
          <button v-if="index === 0 && video" @click.stop="showVideo = true"
            class="absolute bottom-2 left-2 flex items-center justify-center m-auto w-20 h-20 bg-primary rounded-full z-10 hover:scale-110 transition-transform duration-300 pulse-animation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
              <g id="SVGRepo_bgCarrier" stroke-width="0" />
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
                  fill="#72b742" />
              </g>
            </svg>
          </button>
        </figure>
      </SwiperSlide>
    </Swiper>

    <!-- مودال نمایش ویدیو -->
    <div v-if="showVideo && video" @click.self="showVideo = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-4xl mx-4">
        <!-- دکمه بستن -->
        <button @click="showVideo = false"
          class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- ویدیو -->
        <video :src="$getImageUrl(video)" controls autoplay class="w-full rounded-xl shadow-2xl">
          مرورگر شما از ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>
    </div>

    <!-- مودال زوم تصویر -->
    <div v-if="showZoom" @click.self="closeZoom"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- دکمه بستن -->
        <button @click="closeZoom"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- دکمه قبلی در زوم -->
        <button @click.stop="zoomPrev" 
          class="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- دکمه بعدی در زوم -->
        <button @click.stop="zoomNext" 
          class="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- تصویر زوم شده -->
        <div class="relative w-full h-full flex items-center justify-center">
          <img 
            :src="$getImageUrl(images[currentZoomIndex])" 
            alt="تصویر زوم شده" 
            class="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
            @click="closeZoom"
          />
        </div>

        <!-- شمارنده تصویر -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
          {{ currentZoomIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>

    <!-- تصاویر کوچک با فلش‌های کناری -->
    <div class="flex items-center gap-4 mt-3">
      <!-- فلش قبلی -->
      <div @click="goNext" class="cursor-pointer flex-shrink-0">
        <div class="icon-btn w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- اسلایدر thumbnail -->
      <Swiper @swiper="setThumbsSwiper" :slides-per-view="2" :space-between="16" :free-mode="true"
        :watch-slides-progress="true" :loop="true" :modules="[FreeMode, Thumbs]" class="thumbs-swiper flex-1 !pt-2 !pb-2"
        :breakpoints="{
          480: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 14,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        }">
        <SwiperSlide v-for="(thumb, index) in thumbnails" :key="index" class="cursor-pointer">
          <figure
            class="bg-white shadow w-20 h-24 md:w-24 md:h-32 hover:scale-105 object-cover rounded-lg border-2 border-transparent hover:border-strong transition-all">
            <img :src="$getImageUrl(thumb)" class="p-2 rounded-lg" />
          </figure>
        </SwiperSlide>
      </Swiper>

      <!-- فلش بعدی -->
      <div @click="goPrev" class="cursor-pointer flex-shrink-0">
        <div class="icon-btn w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
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
:deep(.swiper-slide-thumb-active figure) {
  opacity: 1 !important;
  border-color: var(--bg-secondary) !important;
  box-shadow: 0 0 0 3px rgba(114, 183, 66, 0.3);
}

/* انیمیشن پالس برای دکمه ویدیو */
.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 0 0 rgba(114, 183, 66, 0.7);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(114, 183, 66, 0.7);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(114, 183, 66, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(114, 183, 66, 0);
  }
}

/* انیمیشن برای محو شدن مودال */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* بهبود نمایش تصویر در زوم */
.cursor-zoom-in {
  cursor: zoom-in;
}

.cursor-zoom-out {
  cursor: zoom-out;
}
</style>