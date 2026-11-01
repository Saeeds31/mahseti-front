<template>
  <nuxt-link to="/">
    <figure class="m-0" :style="{ width: width, height: height }">
      <img src="/icons/mahseti.svg" alt="" />
    </figure>
  </nuxt-link>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: "150px",
  },
  height: {
    type: String,
    default: "150px",
  },
});
</script>
