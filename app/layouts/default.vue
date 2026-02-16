<!-- /app/layouts/default.vue -->
<template>
  <div>
    <SharedLoadingOverlay
      :show="loadingStore.isGlobalLoading"
      :message="loadingStore.loadingMessage"
    />

    <sharedHeader />
    <main>
      <slot />
    </main>
    <sharedFooter />
  </div>
</template>

<script setup>
import { useLoadingStore } from "~/store/loading";
import { useCategoryStore } from "~/store/menu";
import { storeToRefs } from "pinia";

const loadingStore = useLoadingStore();
const categoryStore = useCategoryStore();

try {
  // اگر از قبل داده داریم، Pinia آن را ذخیره می‌کند و fetchMenuData اجرا نمی‌شود (به خاطر if داخلی)
  await categoryStore.fetchMenuData();
} catch (error) {
  console.error(
    "Critical: Failed to pre-fetch menu data in default layout.",
    error,
  );
  // در اینجا می‌توانید یک پیام خطای کلی برای کاربر نهایی تنظیم کنید
}
</script>
