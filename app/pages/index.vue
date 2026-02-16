<template>
  <main>
    <div
      v-if="pending"
      class="min-h-screen flex flex-col items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 space-y-12 animate-pulse">
        <div class="h-96 bg-gray-200 rounded-inner" />
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="h-64 bg-gray-200 rounded-inner" />
        </div>
        <div class="h-48 bg-gray-200 rounded-inner" />
      </div>
    </div>

    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center text-center py-20"
    >
      <div>
        <p class="text-red-500 text-xl mb-6">خطایی در بارگذاری صفحه رخ داد</p>
        <button @click="refresh" class="btn">دوباره تلاش کن</button>
      </div>
    </div>

    <div v-else-if="home" class="space-y-10">
      <HomeSlider :sliders="home.sliders" />
      <HomeCategories :categories="home.selected_categories" />
      <HomeDiscountProducts
        :discounted-products="home.top_discounted_products"
      />
      <HomeBanners
        v-if="home.banners?.after_discount?.length"
        :banners="home.banners.after_discount"
      />
      <HomeNewProducts :products="home.new_products" />

      <HomePoints />
      <HomeSend />

      <HomeBanners
        v-if="home.banners?.after_new_product?.length"
        :banners="home.banners.after_new_product"
      />
      <HomeBanners
        v-if="home.banners?.before_blog?.length"
        :banners="home.banners.before_blog"
      />

      <HomeArticles :list="home.blogs" />
    </div>

    <div
      v-else
      class="min-h-screen flex items-center justify-center text-center py-20 text-muted text-xl"
    >
      محتوای صفحه اصلی در دسترس نیست.
    </div>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useHomeStore } from "@/store/home";
import { useApi } from "@/composables/api/useApi";
import { usePageLoading } from "@/composables/usePageLoading";

const homeStore = useHomeStore();
const { getHome, getBase } = useApi();
const { fetchWishlist } = useWishlist();
const { loadPageWithBase } = usePageLoading();

// بارگذاری همزمان base + home + wishlist
const pending = ref(true);
const error = ref(null);

try {
  await loadPageWithBase(
    [
      async () => {
        if (homeStore.home) return homeStore.home;
        const response = await getHome();
        const fetchedData = response?.data?.data || response?.data;
        homeStore.setHome(fetchedData);
        return fetchedData;
      },
      async () => await fetchWishlist(),
    ],
    "در حال بارگذاری صفحه اصلی...",
    getBase,
  );
} catch (err) {
  error.value = err;
  console.error("خطا در بارگذاری صفحه اصلی:", err);
} finally {
  pending.value = false;
}

const home = computed(() => homeStore.home);

const refresh = async () => {
  pending.value = true;
  error.value = null;
  try {
    await loadPageWithBase(
      [
        async () => {
          const response = await getHome();
          const fetchedData = response?.data?.data || response?.data;
          homeStore.setHome(fetchedData);
          return fetchedData;
        },
      ],
      "در حال بارگذاری مجدد...",
    );
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
};

console.log("home : ", home);
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
