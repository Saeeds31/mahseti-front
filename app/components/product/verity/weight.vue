<template>
  <div class="w-[80%]">
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="(item, index) in normalizedWeights"
        :key="index"
        @click="selectWeight(item)"
        class="cursor-pointer text-center border p-2 rounded-inner transition-colors duration-200 text-xs"
        :class="{
          'bg-secondary text-primery border-black': selectedWeight?.value === item.value,
          'bg-primary text text-muted border-border-light': selectedWeight?.value !== item.value
        }"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>

    <p v-if="props.showError && !selectedWeight" class="text-red-500 text-xs mt-2">
      لطفاً ابتدا سایز مورد نظر را انتخاب کنید
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  weight: {
    type: [Array, String],
    default: () => [50, 100, 150, 200, 250, 500],
  },
  showError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const selectedWeight = ref(null);

const safeDecode = (val) => {
  if (typeof val !== "string") return val;
  try {
    return decodeURIComponent(val);
  } catch (e) {
    return val;
  }
};

const normalizeToArray = (input) => {
  // اگر رشته بود (مثل "S,M,L" یا JSON string)
  if (typeof input === "string") {
    // اگر JSON string بود
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    // اگر کاما جدا شده بود
    if (input.includes(",")) return input.split(",").map((x) => x.trim());
    // اگر فقط یک مقدار بود
    return [input];
  }

  // اگر آرایه بود
  if (Array.isArray(input)) return input;

  return [];
};

const normalizedWeights = computed(() => {
  const arr = normalizeToArray(props.weight);

  return arr.map((item) => {
    // اگر آبجکت بود
    if (item && typeof item === "object") {
      const value = item.value ?? item.id ?? item.title ?? "";
      const label = safeDecode(item.title ?? item.label ?? item.value ?? "");
      return { value, label };
    }

    // اگر رشته یا عدد بود
    const label = safeDecode(String(item));
    return { value: item, label };
  });
});

function selectWeight(item) {
  selectedWeight.value = item;
  emit("update:modelValue", item.value);
}
</script>
