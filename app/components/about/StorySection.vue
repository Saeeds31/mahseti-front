<!-- app/components/about/StorySection.vue -->
<template>
  <section class="mx-auto pt-12">
    <div class="flex flex-col md:flex-row items-center gap-10 md:gap-20">
      <div class="w-full md:w-7/12 text-right">
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8">
          {{ title }}
        </h1>

        <div
          class="space-y-6 text-gray-800 text-justify font-normal text-sm md:text-base"
        >
          <p v-for="(text, index) in paragraphs" :key="index" class="leading-8">
            {{ text }}
          </p>

          <p
            v-if="highlight"
            class="font-medium leading-9 text-base text-gray-800"
          >
            {{ highlight }}
          </p>
        </div>
      </div>

      <div class="w-full flex justify-center md:w-5/12">
        <img
          :src="imageSrc"
          class="object-cover"
          :alt="imageAlt"
          :onerror="fallbackAttr"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  paragraphs: { type: Array, required: true },
  highlight: { type: String, default: "" },
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, required: true },
  fallbackSrc: { type: String, default: "/contact/Group.svg" },
});

const fallbackAttr = computed(() => `this.src='${props.fallbackSrc}'`);
</script>
