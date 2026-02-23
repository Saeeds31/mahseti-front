<!-- app/components/home/newProducts.vue -->
<template>
  <section class="container gap">
    <HomeTitleSection titleBlack="محصولات" titleStrong="ماه ستی " />

    <!-- Filters -->
    <div
      v-if="categoriesList.length"
      class="flex flex-wrap justify-center gap-3 mt-2"
    >
      <button
        v-for="cat in categoriesList"
        :key="cat.value"
        @click="setActive(cat.value)"
        class="py-2.5 px-4 font-medium text-sm md:text-base rounded-lg border-2 transition-all duration-200"
        :class="[
          activeCategory === cat.value
            ? 'bg-[#ED2E68] text-white border-[#ED2E68] shadow-md'
            : 'bg-white text-gray-600 border-gray-300 hover:border-[#ED2E68] hover:text-[#ED2E68]',
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Products -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4">
      <shared-product-card
        v-for="(product, index) in visibleProducts"
        :key="product.id ?? index"
        :product="product"
      />
    </div>

    <div class="flex justify-center mt-10">
      <nuxt-link
        class="bg-[#ED2E68] text-white px-5 py-3 rounded-xl text-[0.95rem]"
        to="/products"
      >
        مشاهده بیشتر
      </nuxt-link>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  category: { type: [Array, Object], default: () => [] },
  products: { type: Array, default: () => [] },
});

onMounted(() => {
  console.log("category prop:", props.category);
  console.log("products sample:", props.products?.[0]);
  console.log("product categories sample:", props.products?.[0]?.categories);
  
});

const activeCategory = ref("all");

const rawCategories = computed(() => {
  if (Array.isArray(props.category)) return props.category;

  if (props.category?.selected_categories && Array.isArray(props.category.selected_categories)) {
    return props.category.selected_categories;
  }

  if (props.category?.data?.selected_categories && Array.isArray(props.category.data.selected_categories)) {
    return props.category.data.selected_categories;
  }

  return [];
});

const categoriesList = computed(() => {
  const mapped = rawCategories.value.map((c) => ({
    value: c.id ?? c.slug ?? c.title,
    label: c.title ?? "دسته‌بندی",
  }));
  return [{ value: "all", label: "همه" }, ...mapped];
});

const normalize = (v) => (v == null ? null : String(v));

const visibleProducts = computed(() => {
  if (activeCategory.value === "all") return props.products || [];

  return (props.products || []).filter((p) => {
    // حالت 1: categories array
    if (Array.isArray(p.categories)) {
      return p.categories.some(
        (c) =>
          normalize(c.id) === normalize(activeCategory.value) ||
          normalize(c.slug) === normalize(activeCategory.value)
      );
    }

    // حالت 2: category_id
    if (p.category_id != null) {
      return normalize(p.category_id) === normalize(activeCategory.value);
    }

    // حالت 3: category_ids
    if (Array.isArray(p.category_ids)) {
      return p.category_ids.map(normalize).includes(normalize(activeCategory.value));
    }

    return false;
  });
});

const setActive = (value) => {
  activeCategory.value = value;
};
</script>

