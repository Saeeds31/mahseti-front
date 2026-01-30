<template>
   <productVerityWeight v-model="selectedWeight" :weight="weight" :show-error="props.showError" />
    <productVerityCount v-model="quantity" />
</template>


<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weight: {
    type: Array,
    default: () => [50, 100, 150, 200, 250, 500]
  },
  variants: {
    type: Array,
    default: () => []
  },
  attributes: {
    type: Array,
    default: () => []
  },
  showError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectedVariant', 'update:quantity'])

const selectedWeight = ref(null)
const quantity = ref(1)

// emit initial quantity
emit('update:quantity', quantity.value)

// وقتی وزن تغییر کرد، variant مناسب را پیدا کن
watch(selectedWeight, (newWeight) => {
  if (!newWeight) return

  console.log('🔍 Finding variant for weight:', newWeight)
  console.log('📦 Available variants:', props.variants)

  const variant = props.variants.find(v => {
    const weightValue = v.values?.[0]?.value
    console.log('Checking variant:', v.id, 'weight:', weightValue)
    return weightValue === newWeight
  })

  if (variant) {
    console.log('✅ Found variant:', variant.id)
    emit('update:selectedVariant', variant.id)
  } else {
    console.log('❌ No variant found for weight:', newWeight)
  }
})

// وقتی تعداد تغییر کرد
watch(quantity, (newQuantity) => {
  console.log('🔢 Quantity changed to:', newQuantity)
  emit('update:quantity', newQuantity)
})
</script>
