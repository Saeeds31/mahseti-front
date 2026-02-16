<template>
  <aside class="lg:w-[25%] w-full flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h3 class="font-semibold">فیلتر کردن</h3>
      <iconFilter />
    </div>

    <!-- دسته بندی -->
    <ProductsFilters
      v-model:selectedCategories="localSelectedCategories"
      :categories="categories"
    />

    <!-- جستجو -->
    <ProductsSearch v-model="localQuery" @search="onSearch" />

    <!-- وزن -->
    <ProductsWeight v-model:selectedWeight="localSelectedWeight" />

    <!-- فقط موجود -->
    <ProductsAvailable v-model:onlyAvailable="localOnlyAvailable" />


    <!-- محدوده قیمت -->
    <ProductsRangprice v-model:priceRange="localPriceRange" />


    <button
      class="btn w-full mt-5 py-2 px-4 !bg-pink-600 text-white rounded-lg hover:bg-green-500 transition-colors"
      @click="applyFilters"
    >
      اعمال فیلتر
    </button>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { useApi } from "@/composables/api/useApi";

const { getShopFilters } = useApi();

const { data: filtersData } = await useAsyncData("shop-filters", () =>
  getShopFilters()
);

const categories = computed(() => filtersData.value?.data?.categories || []);

const props = defineProps({
  selectedCategories: { type: Array, default: () => [] },
  selectedWeight: { type: Array, default: () => [] },
  onlyAvailable: { type: Boolean, default: false },
  priceRange: { type: Array, default: () => [0, 2000000] },
  query: { type: String, default: "" },
});

const emit = defineEmits([
  "update:selectedCategories",
  "update:selectedWeight",
  "update:onlyAvailable",
  "update:priceRange",
  "update:query",
  "apply-filter",
]);

// state محلی
const localSelectedCategories = ref([...props.selectedCategories]);
const localSelectedWeight = ref([...props.selectedWeight]);
const localOnlyAvailable = ref(props.onlyAvailable);
const localPriceRange = ref([...props.priceRange]); 
const localQuery = ref(props.query);

// فقط این‌ها real-time emit می‌شن
watch(localSelectedCategories, (v) => emit("update:selectedCategories", v));
watch(localSelectedWeight, (v) => emit("update:selectedWeight", v));
watch(localOnlyAvailable, (v) => emit("update:onlyAvailable", v));
watch(localQuery, (v) => emit("update:query", v));


function applyFilters() {
  emit("update:priceRange", localPriceRange.value);
  emit("apply-filter");
}
</script>
