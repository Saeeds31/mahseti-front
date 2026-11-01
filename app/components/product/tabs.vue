<!-- app/components/product/tabs.vue -->
<template>
  <Section class="flex flex-col lg:flex-row gap-4">
    <div class="w-full ">
      <ProductTabsSectionTab :specifications="props.specifications" :description="props.description" />
    </div>
  </Section>
  <section class="relative pt-10 ">
    <h2 class="mb-3 text-lg font-semibold text-gray-800 text-right">
      {{ title }}
    </h2>
    <HomeSlidersHomeOfferSlider :products="similarProducts" />
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
// ایمپورت useApi اضافه شد
import { useApi } from "@/composables/api/useApi";

// تعریف کامل Props شامل productId
const props = defineProps({
  specifications: Array,
  description: {
    type: String,
    default: "",
  },
  products: {
    // این prop در منطق جدید استفاده نمی‌شود اما برای سازگاری نگه داشته شده است
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "محصولات مشابه ",
  },
  productId: {
    type: [String, Number],
    required: true,
  },
});
console.log("🔵 tabs.vue setup, productId:", props.productId, typeof props.productId);

const { getSimilarProducts } = useApi();
const { data: similarData } = await useAsyncData(
  () => `similar-products-${props.productId}`,
  () => {
    if (!props.productId) return null;
    return getSimilarProducts(props.productId);
  },
  {
    watch: [() => props.productId],
  }
);
const similarProducts = computed(() => {
  return similarData.value?.data?.similar_products || [];
});
</script>
