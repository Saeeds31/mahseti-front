<!-- components/header/Search.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useApi } from "~/composables/api/useApi";

const { getShopFilters, getProducts } = useApi();

// --- State ---
const query = ref("");
const results = ref<any[]>([]);
const loading = ref(false);
const searched = ref(false);

// --- UI ---
const open = ref(false);
const selectedCategory = ref<any>(null);

// --- Categories ---
const categories = ref<any[]>([{ id: 0, title: "همه دسته‌ها" }]);

const toggleDropdown = () => (open.value = !open.value);

const selectCategory = (category: any) => {
  selectedCategory.value = category;
  open.value = false;
};

// --- Helpers ---
const getImageUrl = (img: string | null) => {
  if (!img) return "/images/placeholder.png";
  if (img.startsWith("http")) return img;
  return `https://api.mahseti.shop${img}`;
};

// --- Fetch Categories ---
const fetchCategories = async () => {
  try {
    const res: any = await getShopFilters();
    const list = res?.data?.categories || [];

    categories.value = [{ id: 0, title: "همه دسته‌ها" }, ...list];

    if (!selectedCategory.value) {
      selectedCategory.value = categories.value[0];
    }
  } catch (err) {
    categories.value = [{ id: 0, title: "همه دسته‌ها" }];
  }
};

// --- شرط مجاز بودن سرچ ---
const canSearch = computed(() => {
  const hasQuery = !!query.value.trim();
  const hasCategory =
    selectedCategory.value && selectedCategory.value.id !== 0;

  return hasQuery || hasCategory;
});

// --- Search ---
const handleSearch = async () => {
  if (!canSearch.value) return;

  loading.value = true;
  searched.value = true;
  open.value = false;
  results.value = [];

  try {
    const params: any = {
      search: query.value.trim() || undefined,
      in_stock: 1,
    };

    if (selectedCategory.value && selectedCategory.value.id !== 0) {
      params.category_id = selectedCategory.value.id;
    }

    const res: any = await getProducts(params);

    if (Array.isArray(res?.data)) {
      results.value = res.data;
    } else if (Array.isArray(res)) {
      results.value = res;
    } else {
      results.value = [];
    }
  } catch (err) {
    results.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);
</script>

<template>
  <div class="relative w-full md:w-110">
    <!-- باکس جستجو -->
    <div class="relative w-full">
      <div
        class="flex items-center bg-white rounded-xl border overflow-hidden h-12"
      >
        <!-- Input -->
        <input
          v-model="query"
          type="text"
          placeholder="جستجوی محصولات…"
          class="flex-1 text-sm font-normal px-4 max-md:px-2 outline-none text-right"
          @keyup.enter="handleSearch"
        />

        <!-- دکمه دراپ‌داون دسته‌بندی -->
        <button
          type="button"
          class="flex items-center px-4 max-md:px-1 h-full text-gray-700 border-l hover:bg-gray-50 transition-colors"
          @click.stop="toggleDropdown"
        >
          <span class="text-xs font-normal text-gray-400 whitespace-nowrap">
            {{ selectedCategory ? selectedCategory.title : "همه دسته‌ها" }}
          </span>
          <svg
            class="w-4 h-4 mr-1 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <!-- دکمه جستجو -->
        <button
          type="button"
          class="w-16 h-full bg-pink-600 hover:bg-pink-700 transition-colors flex items-center justify-center"
          @click="handleSearch"
        >
          <!-- لودینگ -->
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <!-- آیکون جستجو -->
          <svg
            v-else
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- لیست بازشوی دسته‌بندی‌ها -->
      <div
        v-if="open"
        class="absolute top-full left-0 md:left-auto md:right-auto bg-white shadow-lg rounded-xl w-[200px] mt-2 z-50 py-2 border"
        style="left: 64px"
      >
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 transition-colors block text-gray-700 z-50"
          @click="selectCategory(cat)"
        >
          {{ cat.title }}
        </button>
      </div>
    </div>

    <!-- نمایش نتایج جستجو -->
    <div
      v-if="results.length"
      class="absolute top-full right-0 w-full bg-white rounded-xl shadow-xl mt-2 z-50 max-h-[400px] overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-3 border"
    >
      <NuxtLink
        v-for="item in results"
        :key="item.id"
        :to="`/product/${item.id}`"
        class="border hover:shadow-md rounded-lg cursor-pointer p-2 flex flex-col items-center transition-all duration-200 group bg-white"
      >
        <!-- تصویر محصول -->
        <img
          :src="getImageUrl(item.image || item.main_image || item.cover)"
          :alt="item.title || item.name"
          class="w-16 h-16 md:w-20 md:h-20 object-cover rounded group-hover:scale-105 transition-transform"
          @error="$event.target.src = '/images/placeholder.png'"
        />

        <!-- عنوان -->
        <span
          class="text-xs mt-2 text-center font-medium line-clamp-2 text-gray-700"
        >
          {{ item.title || item.name }}
        </span>

        <!-- قیمت -->
        <span class="text-xs md:text-sm font-bold mt-1 text-green-600">
          {{ item.price ? Number(item.price).toLocaleString() : "ناموجود" }}
          تومان
        </span>
      </NuxtLink>
    </div>

    <!-- پیام یافت نشد -->
    <p
      v-else-if="searched && !loading && query && results.length === 0"
      class="absolute top-full right-0 w-full mt-2 z-50 bg-white border rounded-xl shadow text-center py-4 text-sm text-gray-500"
    >
      نتیجه‌ای یافت نشد
    </p>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
