<template>
  <section v-if="slides && slides.length"
    class="w-full flex flex-col lg:flex-row gap-6 mt-6 lg:mt-10 px-4 md:px-8 lg:px-12 xl:px-28 items-start">
    <div class=" w-full">
      <div v-if="pending" class="w-full h-[450px] flex items-center justify-center">
        در حال بارگذاری...
      </div>

      <div v-else-if="error" class="w-full h-[450px] flex items-center justify-center text-red-500">
        خطا در دریافت اسلایدر
      </div>

      <HomeHeroSlider v-else :slides="sliders" />
    </div>

  </section>
</template>

<script setup>
const props = defineProps(['slides'])
</script>
