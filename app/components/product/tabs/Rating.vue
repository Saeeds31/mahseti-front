<!-- components/RatingDistribution.vue -->
<script setup>
import { ref, onMounted } from 'vue'

// داده‌های فیک (مثل API واقعی)
const ratingData = ref({
  average: 4.8,
  totalReviews: 128,
  distribution: [
    { stars: 5, count: 102, percentage: 80 },
    { stars: 4, count: 19,  percentage: 15 },
    { stars: 3, count: 4,   percentage: 3 },
    { stars: 2, count: 2,   percentage: 1.5 },
    { stars: 1, count: 1,   percentage: 0.8 }
  ]
})

</script>

<template>
  <div class="bg-white rounded-xl shadow p-6 space-y-6 border">
    <!-- امتیاز کلی -->

    <div class="flex justify-between">
<div class="flex justify-between">
  <div class="flex justify-center text-yellow-500 text-3xl gap-1">
    <span v-for="n in 5" :key="n">
      <!-- ستاره کامل -->
      <IconStarFull
        v-if="n <= Math.floor(ratingData.average)"
        class="w-8 h-8 text-yellow-500"
      />

      <!-- نیم ستاره -->
      <IconStarHalf
        v-else-if="n === Math.ceil(ratingData.average) && ratingData.average % 1 !== 0"
        class="w-8 h-8 text-yellow-400"
      />

      <!-- ستاره خالی -->
      <IconStarFull
        v-else
        class="w-8 h-8 text-gray-300"
      />
    </span>
  </div>
</div>


      <div class="text-4xl font-bold">{{ ratingData.average }}</div>
    </div>

    <!-- نمودار میله‌ای -->
    <div class="space-y-3">
  <div 
    v-for="item in ratingData.distribution" 
    :key="item.stars"
    class="flex items-center gap-3 text-sm"
  >
    <div class="flex-1 bg-accent-fade h-4 rounded-xl overflow-hidden relative">
      <div 
        class="h-full bg-gold transition-all duration-700 ease-out rounded-xl"
        :style="{ width: item.percentage + '%' }"
      ></div>
    </div>
    <span class="w-12 text-left ">{{ item.count }}</span>
  </div>
</div>

  </div>
</template>

<style scoped>
.bg-gold { background-color: #FFC727; }
</style>