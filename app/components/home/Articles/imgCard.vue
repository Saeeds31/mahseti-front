<template>
  <article
    v-if="card"
    class="relative h-full w-full overflow-hidden rounded-2xl group"
  >
    <!-- Image -->
    <img
      :src="$getImageUrl(card.image)"
      :alt="card.title || 'عکس مقاله'"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>

    <!-- Content -->
    <div class="relative z-10 flex h-full flex-col justify-end p-6 text-white">

      <!-- Meta -->
      <div class="mb-2 flex items-center gap-4 text-sm text-white/80">
        <span v-if="card.author && card.author.full_name">{{ card.author.full_name }}</span>
        <span v-if="card.author && card.author.full_name">•</span>
        <span v-if="card.created_at">{{ new Date(card.created_at).toLocaleDateString('fa-IR') }}</span>
        <span v-if="card.read_time">•</span>
        <span v-if="card.read_time">{{ card.read_time }} دقیقه</span>
      </div>

      <!-- Title -->
      <h2 class="mb-3 max-w-2xl text-xl font-bold leading-relaxed sm:text-2xl">
        {{ card.title }}
      </h2>

      <!-- Excerpt -->
      <p class="mb-6 max-w-3xl text-sm leading-7 text-white/90 line-clamp-3">
        {{ card.short_description || 'توضیحات مقاله' }}
      </p>

      <!-- Button -->
      <NuxtLink
        :to="`/blog/${card.id}`"
        class="w-fit btn"
      >
        خواندن مقاله ←
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
defineProps({
  card: {
    type: Object,
    required: true,
  },
})
</script>
