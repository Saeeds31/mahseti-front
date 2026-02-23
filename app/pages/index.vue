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

      <!-- محصولات جدید با دیتا از products و فیلتر از shop-filters -->
      <HomeNewProducts
        :category="categoriesFromProducts"
        :products="homeProducts"
      />

      <HomeBannerTriple :items="banners" />

      <HomeVotedRestockSection :products="topDiscountedProducts" />

      <HomeBannerTriple
        v-if="bannersBeforeAbout.length"
        :items="bannersBeforeAbout"
      />

      <HomeBanners
        v-if="home.banners?.after_new_product?.length"
        :banners="home.banners.after_new_product"
      />
      <HomeBanners
        v-if="home.banners?.before_blog?.length"
        :banners="home.banners.before_blog"
      />
      <AboutHomeStor />
      <AboutFAQSection />
      />
      <!-- <HomeArticles :list="home.blogs" /> -->
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
import { computed, ref } from "vue";
import { useHomeStore } from "@/store/home";
import { useApi } from "@/composables/api/useApi";
import { usePageLoading } from "@/composables/usePageLoading";
import { useWishlist } from "@/composables/useWishlist";

const homeStore = useHomeStore();
const { getHome, getBase, getProducts } = useApi();
const { fetchWishlist } = useWishlist();
const { loadPageWithBase } = usePageLoading();

// وضعیت‌ها
const pending = ref(true);
const error = ref(null);

// داده‌های محصولات
const homeProducts = ref([]);

// استخراج دسته‌ها از خود محصولات
const categoriesFromProducts = computed(() => {
  const map = new Map();

  for (const p of homeProducts.value || []) {
    for (const c of p?.categories || []) {
      if (!map.has(c.id)) {
        map.set(c.id, {
          id: c.id,
          title: c.title,
          slug: c.slug,
          show_in_home: true,
          show_products_in_home: true,
        });
      }
    }
  }

  return Array.from(map.values());
});

// بارگذاری همزمان base + home + wishlist + محصولات
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
      async () => {
        const res = await getProducts({
          page: 1,
          in_stock: 1,
          sort_by: "latest",
        });
        homeProducts.value =
          res?.data?.data?.data || res?.data?.data || res?.data || [];
        return homeProducts.value;
      },
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

const topDiscountedProducts = computed(
  () => home.value?.top_discounted_products || [],
);

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
        async () => {
          const res = await getProducts({
            page: 1,
            in_stock: 1,
            sort_by: "latest",
          });
          homeProducts.value =
            res?.data?.data?.data || res?.data?.data || res?.data || [];
          return homeProducts.value;
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

const bannerAssets = {
  1: {
    image: "/banner/banner-sleep.svg",
    bgFrom: "#0288D1",
    bgTo: "#006FAD",
    button: "مشاهده و خرید",
  },
  2: {
    image: "/banner/banner-men.svg",
    bgFrom: "#009432",
    bgTo: "#006D26",
    button: "مشاهده و خرید",
  },
  3: {
    image: "/banner/banner-fantasy.svg",
    bgFrom: "#00C9A7",
    bgTo: "#00A98F",
    button: "مشاهده و خرید",
  },
  4: {
    image: "/banner/banner-top.svg",
    bgFrom: "#029C83",
    bgTo: "#018A73",
    button: "مشاهده و خرید",
  },
  5: {
    image: "/banner/banner-bra.svg",
    bgFrom: "#8CA61C",
    bgTo: "#6D8C1A",
    button: "مشاهده و خرید",
  },
  6: {
    image: "/banner/banner-socks.svg",
    bgFrom: "#7A0D8C",
    bgTo: "#A030C7",
    button: "مشاهده و خرید",
  },
};

const banners = computed(() => {
  const apiItems = home.value?.banners?.after_products || [];
  return apiItems.map((b) => {
    const asset = bannerAssets[b.id] || {};
    return {
      id: b.id,
      title: b.title,
      link: b.link,
      image: asset.image || "/banner/default.svg",
      bgFrom: asset.bgFrom || "#1f2937",
      bgTo: asset.bgTo || "#111827",
      button: asset.button || "مشاهده",
    };
  });
});

const bannersBeforeAbout = computed(() => {
  const apiItems = home.value?.banners?.before_about || [];
  return apiItems.map((b) => {
    const asset = bannerAssets[b.id] || {};
    return {
      id: b.id,
      title: b.title,
      link: b.link,
      image: asset.image || "/banner/default.svg",
      bgFrom: asset.bgFrom || "#1f2937",
      bgTo: asset.bgTo || "#111827",
      button: asset.button || "مشاهده",
    };
  });
});
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
