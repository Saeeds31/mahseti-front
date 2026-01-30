

<template>
  <section class="flex gap-4 container gap py-18">
    <nuxt-link v-for="(item, index) in banners" :key="index" :style="{ width: `${item.ratio}%` }" to="">
      <figure v-if="item.image_desktop" >
        <img class="w-full" :src="$getImageUrl(item.image_desktop)" alt="" />
      </figure>
      <figure v-if="item.image_mobile" >
        <img class="w-full" :src="$getImageUrl(item.image_mobile)" alt="" />
      </figure>
    </nuxt-link>
  </section>
</template>


<script setup>
const { $getImageUrl } = useNuxtApp();

defineProps({
  banners: Array,
});
</script> 
