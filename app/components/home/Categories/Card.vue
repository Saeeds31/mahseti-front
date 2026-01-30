<template>
  <nuxt-link
    class="flex flex-col items-center gap-4  bg-accent rounded pad "
    :to="`/products?category_id=${item.id}`"
  >
    <img
      class="h-[120px] object-contain"
      :src="$getImageUrl(item.icon)"
      :alt="item.title"
    />
    <h4 class="text-strong font-bold">{{ item.title }}</h4>
    <div v-html="item.description" class="text-sm"></div>
    <iconArrowRight />
  </nuxt-link>
</template>
<script setup>
const { $getImageUrl } = useNuxtApp();

defineProps({
  item: Object,
});
</script>
