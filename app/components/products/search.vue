<template>
  <form 
    @submit.prevent="onSubmit" 
    class="relative w-full border rounded-inner mt-2 p-4"
  >
    <h3 class="font-semibold mb-3">جستجو کنید</h3>
    <input
      v-model="localQuery"
      class="border py-3 px-7 rounded-inner w-full text-xs pr-4 pl-12 outline-none"
      type="search"
      placeholder="جستجو ..."
    />
    <button
      type="submit"
      class="absolute left-7 top-[65%] -translate-y-1/2"
    >
      <iconSearch class="w-4 h-4" />
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const localQuery = ref(props.modelValue)

// همگام‌سازی با parent
watch(localQuery, (val) => {
  emit('update:modelValue', val)
})

// ارسال جستجو
function onSubmit() {
  emit('search', localQuery.value)
}
</script>
