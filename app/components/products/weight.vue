<template>
  <div class="p-4 border rounded-inner mt-2">
    <!-- header با toggle -->
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-bold">وزن</h2>
      <button @click="toggleCollapse">
        <IconArrowTop v-if="collapsed" />
        <IconArrowBottom v-else />
      </button>
    </div>

    <!-- لیست وزن‌ها -->
    <div v-show="!collapsed" class="grid grid-cols-3 gap-2 py-4">
      <div
        v-for="(item, index) in weight"
        :key="index"
        @click="selectWeight(item)"
        class="cursor-pointer text-center border p-2 rounded-inner transition-colors duration-200 text-xs"
        :class="{
          'bg-secondary text-primery border-black':
            localSelectedWeight.includes(item),
          'bg-primary text-muted border-border-light':
            !localSelectedWeight.includes(item),
        }"
      >
        <span>{{ item }} گرم</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  selectedWeight: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:selectedWeight"]);

const collapsed = ref(false);
const weight = [50, 100, 150, 200, 250, 500];
const localSelectedWeight = ref([...props.selectedWeight]);

// همگام‌سازی تغییرات به parent
watch(localSelectedWeight, (val) => {
  emit("update:selectedWeight", val);
});

// وقتی parent مقدار رو تغییر داد (مثلاً ریست فیلتر)
watch(
  () => props.selectedWeight,
  (val) => {
    localSelectedWeight.value = [...val]; // کپی بگیریم
  },
  { deep: true }
);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

// تابع جدید: فقط یک وزن رو انتخاب کن
function selectWeight(item) {
  // اگر همون آیتم قبلاً انتخاب شده بود، می‌تونی تصمیم بگیری:
  // گزینه ۱: لغو انتخاب کنه (آرایه خالی بشه)
  // گزینه ۲: همون بمونه (هیچ تغییری نکنه)

  if (localSelectedWeight.value.includes(item)) {
    // اگر بخوای با کلیک دوباره روی همون، انتخاب لغو بشه:
    localSelectedWeight.value = [];
  } else {
    // فقط این یکی انتخاب بشه
    localSelectedWeight.value = [item];
  }
}
</script>