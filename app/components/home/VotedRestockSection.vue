<!-- app/components/home/VotedRestockSection.vue -->
<template>
  <section class="relative pt-10 px-28 max-md:px-8 max-lg:px-12">
    <h2 class="mb-3 text-lg font-semibold text-gray-800">
      محصولاتی که به درخواست شما شارژ شد
    </h2>

    <HomeSlidersHomeOfferSlider :title="props.title" :products="props.products" />
  </section>
</template>

<script setup>
const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
});
</script>
