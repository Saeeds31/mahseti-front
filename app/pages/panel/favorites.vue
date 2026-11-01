<template>
  <div class="p-8 border rounded-inner shadow">
    <h3 class="font-bold text-xl pb-4 mb-4 border-b">علاقه مندی ها</h3>

    <div v-if="isLoading" class="text-center py-8">
      <SharedLoadingSpinner size="lg" />
    </div>

    <div v-else-if="wishlistItems.length === 0" class="text-center py-8">
      <p class="text-muted">هیچ محصولی در لیست علاقه‌مندی‌های شما وجود ندارد</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-3">
      <SharedProductCard
        v-for="item in wishlistItems"
        :key="item.id"
        :product="item.product"
        :is-favorite="true"
        @favorite-removed="handleFavoriteRemoved"
      />
    </div>
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { useApi } from '@/composables/api/useApi'
import { useWishlist } from '@/composables/useWishlist'
definePageMeta({
  layout: "panel",
  middleware: 'auth'
});

const { wishlistItems, isLoading, fetchWishlist } = useWishlist()

const handleFavoriteRemoved = async (productId) => {
  // رفرش لیست بعد از حذف
  await fetchWishlist()
}

onMounted(async () => {
  await fetchWishlist()
})
</script>