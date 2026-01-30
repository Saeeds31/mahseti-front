<template>
  <nav class="my-6 flex items-center gap-2 text-sm">
    <!-- همیشه اولین آیتم صفحه اصلی -->
    <NuxtLink to="/" class="hover:text-strong transition-colors flex items-center gap-1">
      <iconHome />
      صفحه اصلی
    </NuxtLink>

    <span v-if="items.length > 0" class="text-muted">
      <iconArrowLeftCute />
    </span>

    <!-- بقیه آیتم‌ها -->
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="index !== items.length - 1"
        :to="item.href"
        class="hover:text-strong transition-colors"
      >
        {{ item.label }}
      </NuxtLink>

      <span v-if="index !== items.length - 1" class="text-muted">
        <iconArrowLeftCute />
      </span>

      <!-- آخرین آیتم -->
      <span
        v-else
        class="text-strong font-medium"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [
      { label: "درباره ما", href: "/about" },
    ],
  },
});
</script>
