<template>
  <section class="container gap">
    <!-- Title -->
    <HomeTitleSection titleBlack="محصولات" titleStrong="ماه ستی " />

    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4">
      <shared-product-card
        v-for="(product, index) in products"
        :key="index"
        :product="product"
      />
    </div>

    <div class="flex justify-center mt-10">
      <nuxt-link
        class="bg-[#ED2E68] text-white px-5 py-2 rounded-xl text-[0.95rem]"
        to="/products"
      >
        مشاهده بیشتر
      </nuxt-link>
    </div>
  </section>
</template>
<script setup>
// import { useSettingStore } from "~/store/settings";
// import { storeToRefs } from "pinia";
// const settingStore = useSettingStore();
// const { settings } = storeToRefs(settingStore);

defineProps({
  products: Array,
});
</script>
