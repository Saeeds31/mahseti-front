<!-- app/components/home/OffersSection.vue -->
<template>
  <section class="w-full py-10 mb:10 md:mb-56">
    <div class="relative w-full h-[350px] bg-[#1c1395] py-7">
      <h2 class="text-white text-lg font-semibold pr-6 mb-12 max-md:mb-14 text-right">
        جدیدترین های ماه ستی
      </h2>

      <div class="absolute md:max-w-[210px] max-w-[120px] right-2 top-1/2 -translate-y-1/3">
        <img src="/static-files/new_products.png" class="w-full h-full object-contain" alt="" />
      </div>

      <div class="relative pr-56 max-md:pr-[125px] h-full -top-10">
        <ClientOnly>
          <HomeSlidersHomeOfferSlider :products="new_products" />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const props=defineProps(['new_products'])
</script>
