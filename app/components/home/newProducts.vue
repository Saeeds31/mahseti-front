<template>
  <section class="container gap">
    <!-- Title -->
    <homeTitleSection
      titleBlack="محصولات"
      titleStrong="ویتامیکس فروت"
      description="میوه‌های خشک ویتامیکس؛ ترکیبی از سلامتی، طعم طبیعی و لذتی ماندگار"
    />

     <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 ">
      <shared-product-card
        v-for="(product, index) in products"
        :key="index"
        :product="product"
      />
    </div>

    
 
    <div class="flex justify-center mt-10">
       <nuxt-link
      class="btn"
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