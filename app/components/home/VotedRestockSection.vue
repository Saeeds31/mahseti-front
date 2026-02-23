<!-- app/components/home/VotedRestockSection.vue -->
<template>
  <section class="relative pt-10 px-28 max-md:px-8 max-lg:px-12">
    <h2 class="mb-3 text-lg font-semibold text-gray-800">
      {{ title }}
    </h2>

      <HomeSlidersHomeOfferSlider :products="products" />
  </section>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "محصولاتی که به درخواست شما زیاد شارژ شد",
  },
});
</script>
