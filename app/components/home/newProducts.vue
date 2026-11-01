<!-- app/components/home/newProducts.vue -->
<template>
  <section class="container gap">
    <HomeTitleSection titleBlack="محصولات" titleStrong="ماه ستی " />

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex items-center gap-2">

        <!-- دکمه راست -->
        <button v-if="isMobile" @click="scrollRight"
          class="shrink-0 w-10 h-10 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <!-- کانتینر اسکرول -->
        <div ref="scrollContainer" class="flex-1 overflow-x-auto flex gap-3 py-2"
          style="scrollbar-width: none; -ms-overflow-style: none;">
          <div class="flex gap-3" style="flex-wrap: nowrap;">
            <button v-for="cat in selectedCategoryList" :key="cat.id" @click="setActive(cat.id)"
              class="whitespace-nowrap py-2.5 px-4 font-medium text-sm md:text-base rounded-lg border-2 transition-all duration-200 shrink-0"
              :class="[
                activeCategory === cat.id
                  ? 'bg-[#1c1395] text-white border-[#1c1395] shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#1c1395] hover:text-[#1c1395]',
              ]">
              {{ cat.title }}
            </button>
          </div>
        </div>
        <!-- دکمه چپ -->
        <button v-if="isMobile" @click="scrollLeft"
          class="shrink-0 w-10 h-10 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

      </div>
    </div>

    <!-- Products -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 max-md:gap-x-2 mt-4 space-y-4">
      <shared-product-card class="relative" :saveLoc="true" :activeTab="activeCategory"
        v-for="(product, index) in visibleProducts" :key="product.id ?? index" :product="product" />
    </div>
    <div class="w-full flex items-center justify-center">
      <NuxtLink :to="`/products?category_ids=${activeCategory}`"
        class="inline-flex items-center justify-center rounded-lg bg-lime-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">
        مشاهده همه
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  selectedCategoryList: { type: Array, default: () => [] },
});

const activeCategory = ref(props.selectedCategoryList.length ? props.selectedCategoryList[0].id : null);
const scrollContainer = ref(null);
const isMobile = ref(false);

const visibleProducts = computed(() => {
  if (!activeCategory.value) return [];
  let finded = props.selectedCategoryList.find(item => item.id == activeCategory.value)
  return finded ? finded.list : []
});

const setActive = (value) => {
  activeCategory.value = value;
};

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
/* مخفی کردن اسکرول بار */
.flex-1::-webkit-scrollbar {
  display: none;
}
</style>