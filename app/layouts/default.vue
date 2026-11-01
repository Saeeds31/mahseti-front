<!-- /app/layouts/default.vue -->
<template>
  <div>
    <SharedLoadingOverlay
      :show="loadingStore.isGlobalLoading"
      :message="loadingStore.loadingMessage"
    />

    <SharedHeader />
    <main>
      <slot />
    </main>

    <!-- Global Cart Sidebar (available on all pages) -->
    <CartSidebar
      :show="showCartSidebar"
      :cart-items="cartItems"
      @close="closeSidebar"
      @open="openSidebar"
      @cart-updated="loadCartData"
    />

    <sharedFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLoadingStore } from "~/store/loading";
import { useCategoryStore } from "~/store/menu";
import { storeToRefs } from "pinia";
import { useApi } from "@/composables/api/useApi";

const loadingStore = useLoadingStore();
const categoryStore = useCategoryStore();

// ---- Cart Sidebar (global state in layout) ----
const showCartSidebar = ref(false);
const cartItems = ref([]);

const openSidebar = () => {
  showCartSidebar.value = true;
};
const closeSidebar = () => {
  showCartSidebar.value = false;
};

const loadCartData = async () => {
  if (!process.client) return;

  const token = localStorage.getItem("auth-token");

  if (token) {
    try {
      const { getCart } = useApi();
      const response = await getCart();
      cartItems.value = response.items || [];
    } catch (err) {
      console.error("❌ Error loading cart (API):", err);
      cartItems.value = [];
    }
  } else {
    const guestCart = localStorage.getItem("guest-cart");
    if (guestCart) {
      try {
        const cartData = JSON.parse(guestCart);
        cartItems.value = cartData.items || [];
      } catch (err) {
        console.error("❌ Error loading cart (localStorage):", err);
        cartItems.value = [];
      }
    } else {
      cartItems.value = [];
    }
  }
};

onMounted(() => {
  loadCartData();

  if (typeof window !== "undefined") {
    // هم برای همگام‌سازی داده‌ها و هم برای باز کردن سایدبار
    window.addEventListener("storage", loadCartData);
    window.addEventListener("cart-updated", loadCartData);
    window.addEventListener("open-cart-sidebar", openSidebar);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("storage", loadCartData);
    window.removeEventListener("cart-updated", loadCartData);
    window.removeEventListener("open-cart-sidebar", openSidebar);
  }
});

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
