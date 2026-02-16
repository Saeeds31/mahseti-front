<template>
  <section
    class="w-full flex flex-col lg:flex-row gap-6 mt-6 lg:mt-10 px-4 md:px-8 lg:px-12 xl:px-28 items-start"
  >
    <div class="lg:w-3/4 w-full">
      <div
        v-if="pending"
        class="w-full h-[450px] flex items-center justify-center"
      >
        در حال بارگذاری...
      </div>

      <div
        v-else-if="error"
        class="w-full h-[450px] flex items-center justify-center text-red-500"
      >
        خطا در دریافت اسلایدر
      </div>

      <HomeHeroSlider v-else :slides="slides" />
    </div>

    <div class="lg:w-1/4 w-full hidden lg:block self-start">
      <SharedProductCard
        v-if="featuredProduct"
        :product="featuredProduct"
        class="!mt-0 !h-[450px]"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHeroSliderStore } from "~/store/heroSlider";
import { useApi } from "@/composables/api/useApi";

const heroSliderStore = useHeroSliderStore();
const { slides, pending, error } = storeToRefs(heroSliderStore);

const featuredProduct = ref(null);
const { getHome } = useApi();

const fetchFeaturedProduct = async () => {
  try {
    const res = await getHome();
    const home = res?.data?.data || res?.data || res; // مسیر مقاوم

    featuredProduct.value =
      home?.top_discounted_products?.[0] || home?.new_products?.[0] || null;
  } catch (e) {
    featuredProduct.value = null;
  }
};

onMounted(() => {
  heroSliderStore.fetchSlides();
  fetchFeaturedProduct();
});
</script>
