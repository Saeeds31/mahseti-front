<template>
  <NuxtLayout>
    <NuxtPage :key="route.fullPath" />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
</script>
