<template>
  <div v-if="card" class="bg-accent-fade rounded-inner overflow-hidden shadow-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <!-- تصویر -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img
        v-if="card.image"
        :src="$getImageUrl(card.image)"
        :alt="card.title"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
      <!-- اگر تصویر نداشت، placeholder نشون بده -->
      <div v-if="!card.image" class="absolute inset-0 flex items-center justify-center bg-gray-200">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- محتوا -->
    <div class="p-6">
      <h3 class="text-lg font-bold mb-3 line-clamp-2 leading-relaxed">
        {{ card.title }}
      </h3>

      <!-- توضیحات کوتاه — بدون v-html (امن) -->
      <p class="text-muted text-sm mb-5 line-clamp-3 leading-7">
        {{ card.short_description || 'توضیحات مقاله' }}
      </p>

      <!-- پایین کارت -->
      <div class="flex items-center justify-between">
        <div class="text-strong font-medium text-sm" >
         {{ new Date(card.created_at).toLocaleDateString("fa") }}
        </div>

        <NuxtLink :to="`/blog/${card.id}`" class="btn btn-sm">
          مشاهده بیشتر
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

// Props
const props = defineProps({
  card: {
    type: Object,
    required: true,
    default: () => ({})
  }
})



</script>

