<!-- pages/products/index.js -->
<template>
  <main class="container mx-auto p-4 md:p-6" dir="rtl">
    <sharedBreadCrumb :items="[{ label: 'محصولات', href: '/products' }]" />

    <section class="flex flex-col lg:flex-row gap-6 mt-10">
      <!-- سایدبار فیلتر -->
      <ProductsAside
        class="hidden lg:block"
        v-model:selectedCategories="filters.categories"
        v-model:selectedWeight="filters.weights"
        v-model:onlyAvailable="filters.inStock"
        v-model:priceRange="filters.priceRange"
        v-model:query="filters.search"
        @apply-filter="applyFilters"
      />

      <!-- نمایش محصولات -->
      <div class="flex-1">
        <ProductsSort class="hidden lg:block" v-model="sortBy" />
        <ProductsFilterMobile
          class="lg:hidden"
          v-model:selectedCategories="filters.categories"
          v-model:selectedWeight="filters.weights"
          v-model:onlyAvailable="filters.inStock"
          v-model:priceRange="filters.priceRange"
          v-model:query="filters.search"
          v-model:sortBy="sortBy"
          @apply-filter="applyFilters"
        />

        <div v-if="pending" class="text-center text-gray-500 mt-6">
          <SharedLoadingSpinner size="lg" />
        </div>

        <div v-else-if="error" class="text-center text-red-500 mt-6">
          خطا در دریافت محصولات
        </div>

        <div
          v-else-if="!products?.length"
          class="text-center text-gray-500 mt-6"
        >
          محصولی یافت نشد.
        </div>

        <div
          v-else
          id="productList"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          <SharedProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
          />
        </div>

        <ProductsPagination
          v-if="!pending && !error && products?.length"
          v-model="currentPage"
          :total-pages="totalPages"
          class="mt-6"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "@/composables/api/useApi";
import { usePageLoading } from "@/composables/usePageLoading";

const { getProducts, getBase } = useApi();
const { fetchWishlist } = useWishlist();
const { loadPageWithBase } = usePageLoading();
const route = useRoute();
const router = useRouter();

// state فیلترها
const filters = ref({
  search: route.query.search || "",
  categories: route.query.category_id ? [Number(route.query.category_id)] : [],
  weights: [],
  inStock: route.query.in_stock === "1",
  priceRange: [
    route.query.min_price ? Number(route.query.min_price) : 0,
    route.query.max_price ? Number(route.query.max_price) : 2000000,
  ],
});

// state مرتب‌سازی
const sortBy = ref(route.query.sort_by || "relevance");
const currentPage = ref(Number(route.query.page) || 1);

const apiParams = computed(() => ({
  search: filters.value.search || undefined,
  in_stock: filters.value.inStock ? 1 : undefined,
  min_price: filters.value.priceRange[0] || undefined,
  max_price: filters.value.priceRange[1] || undefined,
  category_id: filters.value.categories[0] || undefined,
  weight: filters.value.weights.length
    ? filters.value.weights.join(",")
    : undefined,
  sort_by: sortBy.value || undefined,
  page: currentPage.value || undefined,
}));

// بارگذاری همزمان base + products + wishlist
const pending = ref(true);
const error = ref(null);
const data = ref(null);

try {
  await loadPageWithBase(
    [
      async () => {
        const response = await getProducts(apiParams.value);
        data.value = response;
        return response;
      },
      async () => await fetchWishlist()
    ],
    'در حال بارگذاری محصولات...',
    getBase
  );
} catch (err) {
  error.value = err;
  console.error('خطا در بارگذاری محصولات:', err);
} finally {
  pending.value = false;
}

const products = computed(() => data.value?.data?.data || []);
const paginationData = computed(() => data.value?.data || {});
const totalPages = computed(() => paginationData.value.last_page || 1);

const refresh = async () => {
  pending.value = true;
  error.value = null;
  try {
    await loadPageWithBase(
      [
        async () => {
          const response = await getProducts(apiParams.value);
          data.value = response;
          return response;
        }
      ],
      'در حال بارگذاری مجدد...'
    );
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// تابع تغییر URL وقتی کاربر روی دکمه اعمال فیلتر کلیک می‌کند
async function applyFilters() {
  const query = {};

  if (apiParams.value.search) query.search = apiParams.value.search;
  if (apiParams.value.in_stock) query.in_stock = apiParams.value.in_stock;
  if (apiParams.value.min_price) query.min_price = apiParams.value.min_price;
  if (apiParams.value.max_price) query.max_price = apiParams.value.max_price;
  if (apiParams.value.category_id)
    query.category_id = apiParams.value.category_id;
  if (filters.value.weights.length)
    query.weight = filters.value.weights.join(",");
  if (sortBy.value && sortBy.value !== "relevance")
    query.sort_by = sortBy.value;

  // وقتی فیلتر اعمال میشه، صفحه به ۱ برگرده
  currentPage.value = 1;

  await router.push({ query });
}

// watch برای تغییرات sortBy
watch(sortBy, () => {
  applyFilters();
});

// watch برای تغییرات currentPage
watch(currentPage, async (newPage) => {
  const query = { ...route.query };
  if (newPage > 1) {
    query.page = newPage;
  } else {
    delete query.page;
  }
  await router.push({ query });
});

// watch روی route.query برای رفرش داده‌ها
watch(
  () => route.query,
  (newQuery) => {
    // update filters from URL
    filters.value.search = newQuery.search || "";
    filters.value.inStock = newQuery.in_stock === "1";
    filters.value.categories = newQuery.category_id
      ? [Number(newQuery.category_id)]
      : [];
    filters.value.weights = newQuery.weight
      ? newQuery.weight.split(",").map(Number)
      : [];
    filters.value.priceRange = [
      newQuery.min_price ? Number(newQuery.min_price) : 0,
      newQuery.max_price ? Number(newQuery.max_price) : 2000000,
    ];
    sortBy.value = newQuery.sort_by || "relevance";
    currentPage.value = Number(newQuery.page) || 1;
    refresh();
  }
);
</script>
