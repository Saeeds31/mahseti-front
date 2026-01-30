<template>
  <div class="border rounded-inner p-4 mb-6 mt-2">
    <h3 class="font-semibold mb-3">محدوده قیمت</h3>
    <div class="flex gap-2 items-center">
      <input
        type="number"
        v-model.number="localPriceRange[0]"
        class="border p-2 rounded w-full"
        placeholder="حداقل"
        min="0"
      />
      <span class="px-2">تا</span>
      <input
        type="number"
        v-model.number="localPriceRange[1]"
        class="border p-2 rounded w-full"
        placeholder="حداکثر"
        min="0"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  priceRange: {
    type: Array,
    default: () => [0, 2000000]
  }
})

const emit = defineEmits(['update:priceRange'])

const localPriceRange = ref([...props.priceRange])

// همگام‌سازی با parent + لاگ‌گیری
watch(localPriceRange, (newVal, oldVal) => {
  console.log('emit: update:priceRange')
  console.log('مقدار جدید:', newVal)        // [min, max]
  console.log('مقدار قبلی:', oldVal)
  console.log('آرایه کامل:', [...newVal])  // برای اطمینان از اینکه کپی درست است
  emit('update:priceRange', newVal)
}, { deep: true })

// در صورت تغییر prop از parent
watch(() => props.priceRange, (newVal) => {
  console.log('prop priceRange از parent تغییر کرد:', newVal)
  localPriceRange.value = [...newVal]  // بهتره کپی بگیریم تا reactivity حفظ بشه
}, { deep: true })
</script>