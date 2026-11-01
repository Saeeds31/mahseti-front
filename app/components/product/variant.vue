<script setup>
import { computed, ref, watch } from "vue";
import ProductVerityWeight from "~/components/product/verity/weight.vue";
import ProductVerityCount from "~/components/product/verity/count.vue";

import { useCartStore } from "~/store/cart";
const cartStore = useCartStore();
let addToCartMessage = computed(() => cartStore.addToCartMessage);

const props = defineProps({
  primaryAttribute: { type: Object, default: null },
  secondaryAttribute: { type: Object, default: null },
  primaryLabel: { type: String, default: "گزینه ۱" },
  secondaryLabel: { type: String, default: "گزینه ۲" },
  nestedMap: { type: Object, default: () => ({}) },
  variants: { type: Array, default: () => [] },
  showError: { type: Boolean, default: false },
});

const emit = defineEmits([
  "update:selectedVariant",
  "update:quantity",
  "update:selectedPrimaryId",
  "update:selectedSecondaryId",
]);

const selectedPrimaryId = ref(null);
const selectedSecondaryId = ref(null);
const quantity = ref(1);

// 🔹 emit اولیه حذف شد (بهتره از watch استفاده بشه)

const isDualAttribute = computed(
  () => !!props.primaryAttribute && !!props.secondaryAttribute,
);

/**
 * بررسی می‌کنه که آیا یه value (رنگ یا سایز) حداقل یه ترکیب موجود داره یا نه
 */
const hasAnyAvailableVariant = (attributeId, valueId) => {
  // 🔹 attribute اول (رنگ در داده تو)
  if (attributeId === props.primaryAttribute?.id) {
    const map = props.nestedMap?.[valueId];
    if (!map) {
      return props.variants.some(
        (v) =>
          v.is_available === true &&
          v.stock > 0 &&
          v.values?.some((val) => val.id === valueId),
      );
    }
    return Object.values(map).some(
      (variant) => variant.is_available === true && variant.stock > 0,
    );
  }

  // 🔹 attribute دوم (سایز در داده تو)
  if (attributeId === props.secondaryAttribute?.id) {
    for (const primaryKey of Object.keys(props.nestedMap || {})) {
      const variant = props.nestedMap[primaryKey]?.[valueId];
      if (variant?.is_available === true && variant.stock > 0) {
        return true;
      }
    }
    return false;
  }

  return true;
};

/**
 * گزینه‌های attribute اول (رنگ)
 */
const primaryOptions = computed(() => {
  const attribute = props.primaryAttribute;
  if (!attribute?.values?.length) return [];

  return attribute.values.map((value) => {
    if (isDualAttribute.value) {
      // 🔹 دو‌تنوعی: چک کن آیا این رنگ حداقل یه سایز موجود داره
      const available = hasAnyAvailableVariant(attribute.id, value.id);
      return {
        id: value.id,
        value: value.value,
        label: value.value,
        isAvailable: available,
      };
    }

    // 🔹 تک‌تنوعی: از is_available و stock خودش استفاده کن
    const variant = props.variants.find(
      (v) => v.values?.length === 1 && v.values[0].id === value.id,
    );
    const available = variant
      ? variant.is_available === true && variant.stock > 0
      : value.is_available !== false;
    return {
      id: value.id,
      value: value.value,
      label: value.value,
      isAvailable: available,
    };
  });
});

/**
 * گزینه‌های attribute دوم (سایز)
 */
const secondaryOptions = computed(() => {
  const attribute = props.secondaryAttribute;
  if (!attribute?.values?.length) return [];

  // 🔹 حالت دو‌تنوعی و هنوز رنگ انتخاب نشده → همه آزاد
  if (isDualAttribute.value && !selectedPrimaryId.value) {
    return attribute.values.map((value) => ({
      id: value.id,
      value: value.value,
      label: value.value,
      isAvailable: true,
    }));
  }

  // 🔹 حالت دو‌تنوعی و رنگ انتخاب شده → بر اساس nestedMap
  if (isDualAttribute.value && selectedPrimaryId.value) {
    const map = props.nestedMap?.[selectedPrimaryId.value] ?? {};
    return attribute.values.map((value) => {
      const variant = map[value.id];
      // اگه توی nestedMap نبود یا موجود نبود → ناموجود
      const available = variant
        ? variant.is_available === true && variant.stock > 0
        : false;
      return {
        id: value.id,
        value: value.value,
        label: value.value,
        isAvailable: available,
      };
    });
  }

  // 🔹 حالت تک‌تنوعی (فقط سایز)
  return attribute.values.map((value) => {
    const variant = props.variants.find(
      (v) => v.values?.length === 1 && v.values[0].id === value.id,
    );
    const available = variant
      ? variant.is_available === true && variant.stock > 0
      : value.is_available !== false;
    return {
      id: value.id,
      value: value.value,
      label: value.value,
      isAvailable: available,
    };
  });
});

const secondaryRequired = computed(() => !!props.secondaryAttribute);

const resolveVariant = (primaryId, secondaryId) => {
  if (!primaryId) return null;

  if (secondaryId) {
    const forward = props.nestedMap?.[primaryId]?.[secondaryId];
    if (forward) return forward;

    const backward = props.nestedMap?.[secondaryId]?.[primaryId];
    if (backward) return backward;
  }

  return props.variants.find((variant) =>
    variant.values?.some((value) => value.id === primaryId),
  );
};

watch(selectedPrimaryId, () => {
  emit("update:selectedPrimaryId", selectedPrimaryId.value);

  if (!secondaryRequired.value) return;
  if (!selectedPrimaryId.value) {
    selectedSecondaryId.value = null;
    return;
  }

  const allowedMap = props.nestedMap?.[selectedPrimaryId.value];
  if (!allowedMap) {
    selectedSecondaryId.value = null;
    return;
  }

  const allowedIds = Object.keys(allowedMap).map(Number);
  if (!allowedIds.includes(selectedSecondaryId.value)) {
    // 🔹 اولین گزینه‌ای که در nestedMap هست و موجوده رو انتخاب کن
    const firstAvailable = secondaryOptions.value.find(
      (option) => option.isAvailable,
    );
    selectedSecondaryId.value = firstAvailable?.id ?? null;
  }
});

watch(selectedSecondaryId, () => {
  emit("update:selectedSecondaryId", selectedSecondaryId.value);
});

watch([selectedPrimaryId, selectedSecondaryId], ([primaryId, secondaryId]) => {
  if (!primaryId) {
    emit("update:selectedVariant", null);
    return;
  }

  if (secondaryRequired.value && !secondaryId) {
    emit("update:selectedVariant", null);
    return;
  }

  const variant = resolveVariant(primaryId, secondaryId);
  emit("update:selectedVariant", variant?.id ?? null);
});

watch(quantity, (newQuantity) => {
  emit("update:quantity", newQuantity);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <ProductVerityWeight v-if="primaryOptions.length" v-model="selectedPrimaryId" :options="primaryOptions"
      :label="primaryLabel" :show-error="showError && !selectedPrimaryId" />

    <!-- 🔹 :disabled حذف شد تا سایزها قبل از انتخاب رنگ آزاد باشن -->
    <ProductVerityWeight v-if="secondaryOptions.length" v-model="selectedSecondaryId" :options="secondaryOptions"
      :label="secondaryLabel"
      :show-error="showError && secondaryRequired && !selectedSecondaryId" />

    <ProductVerityCount v-model="quantity" />
    <span class="text-red-500" v-if="addToCartMessage">{{ addToCartMessage }}</span>
  </div>
</template>