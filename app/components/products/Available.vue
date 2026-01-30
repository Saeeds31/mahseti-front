<template>
  <!-- حالت نمایش -->
  <div class="border rounded-inner p-4 mb-6 mt-2">
    <h3 class="font-semibold mb-1">حالت نمایش</h3>
    <div class="flex justify-between mt-8">
      <p class="text-muted text-sm">فقط کالا های موجود</p>
      <label class="switch">
        <input type="checkbox" v-model="localOnlyAvailable" />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  onlyAvailable: { type: Boolean, default: false }
})
const emit = defineEmits(["update:onlyAvailable"])

const localOnlyAvailable = ref(props.onlyAvailable)

watch(localOnlyAvailable, val => emit("update:onlyAvailable", val))
watch(() => props.onlyAvailable, val => (localOnlyAvailable.value = val))


</script>

<style scoped>
/* سوییچ ساده */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-light);
  transition: 0.4s;
  border-radius: 28px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--bg-secondary);
}
input:checked + .slider:before {
  transform: translateX(22px);
}
</style>
