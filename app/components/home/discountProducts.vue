<!-- app/components/home/OffersSection.vue -->
<template>
  <section class="w-full py-10 mb-56">
    <div class="relative w-full h-[350px] bg-[#0D44D0] py-7">
      <h2 class="text-white text-lg font-semibold pr-6 mb-12 max-md:mb-14 text-right">
        پیشنهادات ویژه ماه ستی
      </h2>

      <div class="absolute max-md:w-[25%] right-2 top-1/2 -translate-y-1/3">
        <img src="/sample/offer-banner.svg" class="w-full h-full object-contain" alt="" />
      </div>

      <div class="relative pr-56 max-md:pr-28 h-full -top-20">
        <ClientOnly>
          <HomeSlidersHomeOfferSlider :products="offers" />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/composables/api/useApi";

const offers = ref<any[]>([]);
const { getHome } = useApi();

const fetchOffers = async () => {
  try {
    const res = await getHome();
    const home = res?.data?.data || res?.data || res;
    offers.value = home?.top_discounted_products || [];
  } catch {
    offers.value = [];
  }
};

onMounted(fetchOffers);
</script>
