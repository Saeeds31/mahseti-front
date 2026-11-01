<!-- app/components/about/HeroCollage.vue -->
<template>
  <section class="overflow-hidden">
    <img
      :src="imageSrc"
      class="w-full h-auto object-cover"
      :alt="alt"
      :onerror="fallbackAttr"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageSrc: { type: String, required: true },
  alt: { type: String, required: true },
  fallbackSrc: { type: String, default: '/contact/Group.svg' }
})

const fallbackAttr = computed(() => `this.src='${props.fallbackSrc}'`)
</script>
