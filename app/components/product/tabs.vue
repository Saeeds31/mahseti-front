<template>
  <Section class="flex flex-col lg:flex-row gap-4">
    <!-- Left -->
    <div class="w-full lg:w-[70%]">
      <productTabsSectionTab :description="description" />
    </div>

    <!-- Right -->
    <div class="w-full lg:w-[30%] flex flex-col gap-8">
      <productTabsRating />
      <productTabsAdvertisementBox />
    </div>
  </Section>
</template>

<script setup>

const props = defineProps({
  description: {
    type: String,
    default: '',
  },

})

</script>
