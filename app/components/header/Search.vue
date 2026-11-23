<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useApi } from "~/composables/api/useApi";
import { useCategoryStore } from "~/store/menu.js";

const query = ref("");
const results = ref<any[]>([]);
const loading = ref(false);
const searched = ref(false);
const showResults = ref(false);

// --- UI ---
const open = ref(false);
const selectedCategory = ref<any>(null);
const dropdownRef = ref<HTMLElement | null>(null);

// --- Categories ---
const categories = ref<any[]>([{ id: 0, title: "همه دسته‌ها" }]);

const toggleDropdown = () => (open.value = !open.value);

const selectCategory = (category: any) => {
  selectedCategory.value = category;
  open.value = false;
};

const { $getImageUrl } = useNuxtApp();
const router = useRouter();
const categoryStore = useCategoryStore();
const { getProductSearch } = useApi();

const fetchCategories = async () => {
  try {
    const res = await categoryStore.fetchFilters();
    const list = res?.data?.categories || [];
    categories.value = [{ id: 0, title: "همه دسته‌ها" }, ...list];
    if (!selectedCategory.value) {
      selectedCategory.value = categories.value[0];
    }
  } catch (err) {
    categories.value = [{ id: 0, title: "همه دسته‌ها" }];
  }
};

// --- ساخت آدرس صفحه فروشگاه ---
const buildShopUrl = () => {
  const params = new URLSearchParams();
  if (query.value.trim()) params.set("search", query.value.trim());
  if (selectedCategory.value && selectedCategory.value.id !== 0) {
    params.set("category_ids", String(selectedCategory.value.id));
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
};

// --- رفتن به صفحه فروشگاه (Enter یا دکمه جستجو) ---
const handleSearch = () => {
  showResults.value = false;
  router.push(buildShopUrl());
  query.value = "";
};

// --- جستجوی زنده ---
let timer: ReturnType<typeof setTimeout> | null = null;
let requestId = 0;

const fetchResults = async () => {
  const q = query.value.trim();

  if (q.length < 2) {
    requestId++; // پاسخ‌های در راه را باطل کن
    results.value = [];
    searched.value = false;
    loading.value = false;
    showResults.value = false;
    return;
  }

  const currentId = ++requestId;
  loading.value = true;
  showResults.value = true;

  try {
    const params: Record<string, any> = { search: q };
    if (selectedCategory.value && selectedCategory.value.id !== 0) {
      params.category_ids = selectedCategory.value.id;
    }

    const res: any = await getProductSearch(params);
    console.log(res);
    
    // پاسخ‌های قدیمی را نادیده بگیر
    if (currentId !== requestId) return;

    // ⚠️ مسیر لیست را مطابق پاسخ واقعی API چک کنید
    const list =res

    results.value = Array.isArray(list) ? list.slice(0, 6) : [];
  } catch (e) {
    if (currentId !== requestId) return;
    results.value = [];
  } finally {
    if (currentId === requestId) {
      loading.value = false;
      searched.value = true;
    }
  }
};

watch([query, selectedCategory], () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(fetchResults, 300);
});

// --- بستن دراپ‌داون و نتایج با کلیک بیرون ---
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false;
    showResults.value = false;
  }
};

const onFocus = () => {
  if (query.value.trim().length >= 2 && searched.value) showResults.value = true;
};

onMounted(() => {
  fetchCategories();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (timer) clearTimeout(timer);
});

function offResult() {
  results.value = [];
  query.value = "";
  searched.value = false;
  showResults.value = false;
}
</script>

<template>
  <div ref="dropdownRef" class="relative w-full md:w-100">
    <!-- باکس جستجو -->
    <div class="relative w-full">
      <div class="flex items-center bg-white rounded-xl border overflow-hidden h-12">
        <!-- Input -->
        <input @keyup.enter="handleSearch" @focus="onFocus" v-model="query" type="text" placeholder="جستجوی محصولات …"
          class="flex-1 text-sm font-normal px-4 max-md:px-2 outline-none text-right" />

        <!-- دکمه دراپ‌داون دسته‌بندی -->
        <button type="button"
          class="flex items-center px-4 max-md:px-1 h-full text-gray-700 border-l hover:bg-gray-50 transition-colors"
          @click.stop="toggleDropdown">
          <span class="text-xs font-normal text-gray-400 whitespace-nowrap">
            {{ selectedCategory ? selectedCategory.title : "همه دسته‌ها" }}
          </span>
          <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- دکمه جستجو -->
        <button type="button"
          class="w-16 max-md:w-10 h-full bg-[#1c1395] hover:bg-blue-900 transition-colors flex items-center justify-center"
          @click="handleSearch">
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <svg v-else class="w-6 h-6 text-white max-md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>

      <!-- لیست بازشوی دسته‌بندی‌ها -->
      <div v-if="open"
        class="absolute top-full left-0 md:left-auto md:right-auto bg-white shadow-lg rounded-xl w-[200px] mt-2 z-50 py-2 border"
        style="left: 64px">
        <button v-for="cat in categories" :key="cat.id" type="button"
          class="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 transition-colors block text-gray-700 z-50"
          @click="selectCategory(cat)">
          {{ cat.title }}
        </button>
      </div>
    </div>

    <!-- نتایج جستجو: لیست تک‌ستونه -->
    <div v-if="showResults && results.length"
      class="absolute top-full right-0 w-full bg-white rounded-xl shadow-xl mt-2 z-[1000] border overflow-hidden">
      <div class="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
        <NuxtLink v-for="item in results" :key="item.id" :to="`/product/${item.id}`" @click="offResult()"
          class="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors">
          <!-- عکس کوچک محصول -->
          <img :src="$getImageUrl(item.main_image)" :alt="item.title || item.name"
            class="w-12 h-12 object-cover rounded-lg border shrink-0" />

          <!-- عنوان و قیمت -->
          <div class="flex-1 min-w-0 text-right">
            <p class="text-sm font-medium text-gray-700 line-clamp-1">
              {{ item.title || item.name }}
            </p>
            <p class="text-xs font-bold mt-1 text-green-600">
              {{ item.price ? Number(item.price).toLocaleString() + " تومان" : "ناموجود" }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- دکمه مشاهده همه نتایج -->
      <button type="button"
        class="w-full py-2 text-xs font-medium text-[#1c1395] bg-gray-50 hover:bg-gray-100 border-t transition-colors"
        @click="handleSearch">
        مشاهده همه نتایج
      </button>
    </div>

    <!-- پیام یافت نشد -->
    <p v-else-if="showResults && searched && !loading && results.length === 0"
      class="absolute top-full right-0 w-full mt-2 z-40 bg-white border rounded-xl shadow text-center py-4 text-sm text-gray-500">
      نتیجه‌ای یافت نشد
    </p>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>