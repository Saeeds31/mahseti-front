<template>
  <div class="flex justify-center items-center mb-8 flex-wrap">
    <div class="flex items-center gap-2 md:gap-4">

      <!-- Step 1 -->
      <div class="flex items-center gap-1 md:gap-2">
        <div class="scale-75 md:scale-100">
          <IconBagActive class="w-4 h-4 md:w-6 md:h-6" />
        </div>

        <span
          class="text-xs md:text-base font-semibold transition-all"
          :class="currentStep >= 1 ? 'text-strong' : 'text-muted'"
        >
          سبد خرید شما
        </span>
      </div>

      <!-- Line 1 -->
      <div
        class="w-2 md:w-16 border-t-dash transition-all"
        :class="currentStep >= 2 ? 'bg-secondary' : 'bg-accent'"
      ></div>

      <!-- Step 2 -->
      <div class="flex items-center gap-1 md:gap-2">

        <div class="scale-75 md:scale-100">
          <IconLocationActive class="w-4 h-4 md:w-6 md:h-6" v-if="currentStep >= 2" />
          <IconLocation class="w-4 h-4 md:w-6 md:h-6" v-else />
        </div>

        <span
          class="text-xs md:text-base transition-all"
          :class="currentStep >= 2 ? 'text-strong font-semibold' : 'text-muted'"
        >
          اطلاعات ارسال
        </span>
      </div>

      <!-- Line 2 -->
      <div
        class="w-2 md:w-16 border-t-dash transition-all"
        :class="currentStep > 2 ? 'bg-secondary' : 'bg-accent'"
      ></div>

      <!-- Step 3 -->
      <div class="flex items-center gap-1 md:gap-2">

        <div class="scale-75 md:scale-100">
          <IconPaymentActive class="w-4 h-4 md:w-6 md:h-6" v-if="currentStep >= 3" />
          <IconPayment class="w-4 h-4 md:w-6 md:h-6" v-else />
        </div>

        <span
          class="text-xs md:text-base transition-all"
          :class="currentStep >= 3 ? 'text-strong font-semibold' : 'text-muted'"
        >
          اطلاعات پرداخت
        </span>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 3
  }
})
</script>
<style scoped>
.border-t-dash{
   border-top: 1px dashed var(--text-muted);
}

.border-gray{
   border-color: var(--text-muted);
}

.border-active{
   border-color: var(var(--text-strong));
}
</style>