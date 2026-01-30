<template>
  <div class="lg:hidden">
    <!-- Tabs Slider -->
    <div class="flex overflow-x-auto gap-2 py-3 px-3 border-b">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="openDrawer(tab.key)"
        class="flex items-center gap-2 px-4 py-2 bg-accent-fade rounded-lg whitespace-nowrap flex-shrink-0 text-sm"
      >
        <component :is="tab.icon" class="w-4 h-4 text-strong" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Overlay -->
    <div
      v-if="drawerOpen"
      class="fixed inset-0 bg-black/40 z-40"
      @click="drawerOpen = false"
    />

    <!-- Drawer -->
    <transition name="slide">
      <div
        v-if="drawerOpen"
        class="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-primary z-50 flex flex-col shadow "
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b">
          <div class="flex items-center gap-2">
            <component
              :is="tabs.find((t) => t.key === currentTab)?.icon"
              class="w-5 h-5 text-strong"
            />
            <h3 class="font-bold text">{{ currentTabLabel }}</h3>
          </div>

          <button @click="drawerOpen = false">
            <X class="w-5 h-5 text-muted" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <!-- دسته بندی -->
          <div v-if="currentTab === 'categories'">
            <ProductsFilters
              v-model:selectedCategories="localSelectedCategories"
              :categories="categories"
            />
          </div>

          <!-- قیمت -->
          <div v-else-if="currentTab === 'price'">
            <ProductsRangprice v-model:priceRange="localPriceRange" />
          </div>

          <!-- فیلتر -->
          <div v-else-if="currentTab === 'filter'" class="flex flex-col gap-6">
            <ProductsWeight v-model:selectedWeight="localSelectedWeight" />
            <ProductsAvailable v-model:onlyAvailable="localOnlyAvailable" />
            <ProductsSearch v-model="localQuery" @search="onSearch" />
          </div>

          <!-- مرتب سازی -->
          <div v-else-if="currentTab === 'sort'" class="flex flex-col divide-y">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option.value)"
              class="flex items-center justify-between py-4 px-2 transition"
            >
              <div class="flex items-center gap-3">
                <component
                  :is="option.icon"
                  class="w-5 h-5"
                  :class="
                    localSortBy === option.value ? 'text-strong' : 'text-muted'
                  "
                />

                <span
                  :class="
                    localSortBy === option.value
                      ? 'text-strong font-bold'
                      : 'text'
                  "
                >
                  {{ option.label }}
                </span>
              </div>

              <CheckCircle2
                v-if="localSortBy === option.value"
                class="w-5 h-5 text-strong"
              />
            </button>
          </div>
        </div>

        <!-- Footer -->
        <button
          class="btn w-full flex items-center justify-center gap-2 "
          @click="applyFilters"
        >
          <Filter class="w-4 h-4" />
          اعمال فیلتر
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  X,
  CheckCircle2,
  Filter,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Flame,
  Eye,
  BadgePercent,
  Sparkles,
} from "lucide-vue-next";

const tabs = [
  { key: "categories", label: "دسته بندی", icon: Layers },
  { key: "price", label: "محدوده قیمت", icon: SlidersHorizontal },
  { key: "filter", label: "فیلتر", icon: Filter },
  { key: "sort", label: "مرتب سازی", icon: ArrowUpDown },
];

const sortOptions = [
  { label: "مرتبط ترین", value: "relevance", icon: Tag },
  { label: "پرفروش ترین", value: "best_selling", icon: Flame },
  { label: "پربازدید ترین", value: "most_viewed", icon: Eye },
  { label: "تخفیف دار", value: "discounted", icon: BadgePercent },
  { label: "جدیدترین", value: "newest", icon: Sparkles },
];

import { ref, computed, watch } from "vue";
import { useApi } from "@/composables/api/useApi";

const { getShopFilters } = useApi();

const { data: filtersData } = await useAsyncData("shop-filters-mobile", () =>
  getShopFilters()
);

const categories = computed(() => filtersData.value?.data?.categories || []);

const props = defineProps({
  selectedCategories: { type: Array, default: () => [] },
  selectedWeight: { type: Array, default: () => [] },
  onlyAvailable: { type: Boolean, default: false },
  priceRange: { type: Array, default: () => [0, 2000000] },
  query: { type: String, default: "" },
  sortBy: { type: String, default: "relevance" },
});

const emit = defineEmits([
  "update:selectedCategories",
  "update:selectedWeight",
  "update:onlyAvailable",
  "update:priceRange",
  "update:query",
  "update:sortBy",
  "apply-filter",
]);

const drawerOpen = ref(false);
const currentTab = ref("");
const currentTabLabel = computed(
  () => tabs.find((t) => t.key === currentTab.value)?.label || ""
);

// state محلی
const localSelectedCategories = ref([...props.selectedCategories]);
const localSelectedWeight = ref([...props.selectedWeight]);
const localOnlyAvailable = ref(props.onlyAvailable);
const localPriceRange = ref([...props.priceRange]);
const localQuery = ref(props.query);
const localSortBy = ref(props.sortBy);

// فقط این‌ها real-time emit می‌شن
watch(localSelectedCategories, (v) => emit("update:selectedCategories", v));
watch(localSelectedWeight, (v) => emit("update:selectedWeight", v));
watch(localOnlyAvailable, (v) => emit("update:onlyAvailable", v));
watch(localQuery, (v) => emit("update:query", v));

function openDrawer(tab) {
  currentTab.value = tab;
  drawerOpen.value = true;
}

function onSearch() {
  // اگر از search استفاده می‌کنید، می‌تونید اینجا هم applyFilters رو صدا بزنید
  applyFilters();
}

function selectSort(value) {
  localSortBy.value = value;
  emit("update:sortBy", value);
  applyFilters();
}

function applyFilters() {
  emit("update:priceRange", localPriceRange.value);
  emit("apply-filter");
  drawerOpen.value = false;
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
