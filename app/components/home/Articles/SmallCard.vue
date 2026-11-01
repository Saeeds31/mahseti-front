<template>
  <NuxtLink :to="`/blog/${smallcard.id}`">
    <div
      class="bg-accent-fade rounded-inner p-4 flex items-center gap-4 shadow-hover cursor-pointer hover:shadow transition"
    >
      <img
        :src='smallcard.image'
        class="w-20 h-20 rounded-inner object-cover flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm text-muted mb-1">{{ new Date(smallcard.created_at).toLocaleDateString("fa") }}</p>
        <h4 class="text-sm font-semibold line-clamp-2 leading-relaxed">
          {{smallcard.title}}
        </h4>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  smallcard: {
    type: Object,
    required: true
  }
});
</script>
