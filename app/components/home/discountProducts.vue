<template>
  <section class="container gap pt-20 mostDiscountProductHeader">
    <!-- header of section -->
    <div
      id="mostDiscountProductHeader"
      class="flex flex-wrap justify-between items-center gap-4 mb-6"
    >
      <h2 class="text-lg lg:text-3xl font-bold">
        <span> تخفیفات  </span> 
        <b v-if="settings?.site?.site_name">{{ settings.site.site_name }}</b>
      </h2>
      <i class="flex-grow h-px bg-accent hidden sm:block"></i>
      <nuxt-link class="btn" to="/products?sort_by=discounted" >مشاهده بیشتر</nuxt-link>
    </div>

    <!-- swiper Desktop -->
    <div class="swiper-container p2 hidden md:block mt-10 relative">
      <swiper
        :modules="modules"
        :space-between="20"
        :pagination="false"
        :navigation="{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }"
        :breakpoints="breakpoints"
      >

        <swiper-slide v-for="(product, index) in discountedProducts" :key="index">
          <SharedProductCard :product="product" />
        </swiper-slide>
      </swiper>

      <!-- Custom Navigation Buttons -->
      <button class="custom-prev swiper-nav-btn">
        <ChevronRight :size="24" />
      </button>
      <button class="custom-next swiper-nav-btn">
        <ChevronLeft :size="24" />
      </button>
    </div>

    <!-- Grid Mobile (4 products: 2x2) -->
    <div class="grid grid-cols-2 gap-4 md:hidden px-4">
      <SharedProductCard
        v-for="(product, index) in discountedProducts"
        :key="index"
        :product="product"
      />
    </div>



  </section>
</template>

<script setup>
import { useSettingStore } from "~/store/settings";
import { storeToRefs } from "pinia";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import "swiper/css";
import "swiper/css/navigation";

const settingStore = useSettingStore();
const { settings } = storeToRefs(settingStore);
const modules = [Navigation];

const breakpoints = {
  768: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 35,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
};


defineProps({
  discountedProducts: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
i {
  flex-grow: 1;
  height: 1px;
  background: #e1e1e1;
  border-radius: 50%;
}

</style>

<style>
.mostDiscountProductHeader .swiper{
   padding: 5px !important;
}
.mostDiscountProductHeader .swiper-slide {
  padding-top:50px;
}

/* 🎨 استایل دکمه‌های نویگیشن سفارشی با آیکون‌های Lucide */
.swiper-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 50px;
  height: 50px;
  background: var(--bg-secondary-fade);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: var(--shadow);
}

.swiper-nav-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-50%) scale(1.1);
}

.swiper-nav-btn svg {
  color: var(--bg-secondary);
  transition: color 0.4s ease;
}

.swiper-nav-btn:hover svg {
  color: var(--bg-primary);
}

.custom-prev {
  right: -60px;
}

.custom-next {
  left: -60px;
}

/* حالت غیرفعال */
.swiper-nav-btn.swiper-button-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.swiper-nav-btn.swiper-button-disabled:hover {
  background: var(--bg-secondary-fade);
  transform: translateY(-50%) scale(1);
}

/* مخفی کردن دکمه‌های پیش‌فرض swiper */
.mostDiscountProductHeader .swiper-button-next,
.mostDiscountProductHeader .swiper-button-prev {
  display: none;
}

/* برای موبایل دکمه‌ها کوچکتر باشن */
@media screen and (max-width: 768px) {
  .swiper-nav-btn {
    width: 40px;
    height: 40px;
  }

  .swiper-nav-btn svg {
    width: 20px;
    height: 20px;
  }

  .custom-prev {
    right: -20px;
  }

  .custom-next {
    left: -20px;
  }
}

</style>





<!-- <template>
    <section id="mostDiscountProduct" class=" mx-[auto] my-[24px]">
        <div id="mostDiscountProductHeader" class="flex justify-between items-center gap-[16px] my-[16px]">
            <h2 class="text-[30px]">
                <span>تخفیفات</span>
                <b v-if="settings?.shop_info?.name">{{ settings.shop_info.name }}</b>
            </h2>
            <i class="flex-grow h-px bg-[#e1e1e1] rounded-[50%]"></i>
            <nuxt-link
                class="bg-[var(--color-base)] text-[white] px-[16px] py-[8px] rounded-tl-[0] rounded-br-[0] rounded-tr-[8px] rounded-bl-[8px]"
                to="/products?sort=most-discount">مشاهده بیشتر</nuxt-link>
        </div>
        <div class="swiper-container">
            <swiper :modules="modules" :space-between="20" :pagination="false" :navigation="true"
                :breakpoints="breakpoints">
                <swiper-slide v-for="(product, index) in list" :key="index">
                    <shared-product-card :product="product" />
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>

<script setup>
import { useSettingStore } from '~/store/settings'
import { storeToRefs } from 'pinia'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const settingStore = useSettingStore()
const { settings } = storeToRefs(settingStore)
const modules = [Navigation, Pagination]
const breakpoints = {
    640: {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    768: {
        slidesPerView: 3,
        spaceBetween: 30,
    },
    1024: {
        slidesPerView: 4,
        spaceBetween: 30,
    },
}
defineProps({
    list: Array
})
</script>
<style scoped>
#mostDiscountProduct{
    width: calc(90% + 60px);
}
#mostDiscountProductHeader{
    width: calc(100% - 60px);
    margin: auto;
}
.headers a {
    background: var(--color-base);
}

h2 b {
    color: var(--color-base);
}

i {
    flex-grow: 1;
    height: 1px;
    background: #e1e1e1;
    border-radius: 50%;
}

section#mostDiscountProduct .swiper {
    padding: 30px;
    padding-top: 60px;
}
</style>
<style>
.swiper-button-next,
.swiper-button-prev {
    background-color: #E1EFD8;
    border-radius: 50%;
}

.swiper-button-next svg,
.swiper-button-prev svg {
    fill: black !important;
    color: black;
    width: 14px;
}
</style> -->