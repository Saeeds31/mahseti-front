<template>
  <div class="p-4 border rounded-lg">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold">دسته‌بندی</h3>
      <button @click="collapsed = !collapsed">
        <IconArrowTop v-if="collapsed" />
        <IconArrowBottom v-else />
      </button>
    </div>

    <div v-show="!collapsed" class="flex flex-col gap-2">
      <label
        v-for="item in categories"
        :key="item.id"
        class="flex justify-between items-center border-b last:border-b-0 pb-1"
      >
        <span>{{ item.title }}</span>
        <input
          type="checkbox"
          :value="item.id"
          v-model="localSelectedCategories"
          class="ml-2 accent-green-600"
        />
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedCategories: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedCategories'])

const collapsed = ref(false)
const localSelectedCategories = ref([...props.selectedCategories])

// ارسال تغییرات به parent
watch(localSelectedCategories, (val) => {
  emit('update:selectedCategories', val)
})

// آپدیت local اگر prop تغییر کند
watch(() => props.selectedCategories, (val) => {
  localSelectedCategories.value = [...val]
})
</script>
