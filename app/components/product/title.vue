<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold">{{ title }}</h1>

      <!-- دکمه شِیر -->
      <button class="cursor-pointer" @click="shareContent">
        <iconShared />
      </button>
    </div>

    <!-- قیمت -->
    <div class="flex items-center gap-4 flex-wrap mt-4">
      <div class="text-xl text-strong">
        {{ Number(price).toLocaleString('fa') }} تومان
      </div>

      <div v-if="oldPrice && oldPrice != price" class="text-xl text-muted line-through decoration-red-600">
        {{ Number(oldPrice).toLocaleString('fa') }} تومان
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";

const props = defineProps({
  title: String,
  price: Number,
  oldPrice: Number,
});

/* --- تابع شیر کردن --- */
const shareContent = async () => {
  const shareData = {
    title: props.title,
    text: `مشاهده محصول: ${props.title}`,
    url: window.location.href, // لینک همین صفحه
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
    }
  } else {

    toast.error('مرورگر شما از اشتراک‌گذاری پشتیبانی نمی‌کند.')
  }
};
</script>
