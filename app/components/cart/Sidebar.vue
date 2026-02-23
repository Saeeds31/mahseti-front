<template>
  <Transition name="overlay">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="emit('close')"
    ></div>
  </Transition>

  <Transition name="slide">
    <div
      v-if="show"
      class="fixed top-0 left-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-bold">سبد خرید</h2>
        <button @click="emit('close')" class="text-muted hover:text-strong">
          <X :size="24" />
        </button>
      </div>

      <!-- محتوای سبد خرید -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartItems && cartItems.length > 0" class="space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-3 border rounded-inner p-3"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="w-20 h-20 object-cover rounded-inner"
            />
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-sm">{{ item.title }}</h3>
                <p
                  class="text-xs text-muted mt-1"
                  v-if="
                    item.variant &&
                    item.variant.attributes &&
                    item.variant.attributes.length > 0
                  "
                >
                  {{ item.variant.attributes[0].value }}
                </p>
              </div>

              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-2">
                  <button
                    @click="decreaseQuantity(item)"
                    class="w-6 h-6 rounded border border-muted flex items-center justify-center hover:bg-secondary hover:text-white transition"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="text-sm w-6 text-center">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="w-6 h-6 rounded border border-muted flex items-center justify-center hover:bg-secondary hover:text-white transition"
                  >
                    <Plus :size="14" />
                  </button>
                </div>

                <button
                  @click="removeItem(item)"
                  class="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 :size="18" />
                </button>
              </div>

              <p class="text-secondary font-bold mt-2">
                {{
                  (
                    item.line_final_total || item.price * item.quantity
                  ).toLocaleString("fa-IR")
                }}
                تومان
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-muted">سبد خرید خالی است</div>
      </div>

      <!-- Footer با دکمه‌ها -->
      <div class="border-t p-4 space-y-3">
        <div class="flex justify-between items-center mb-4">
          <span class="font-semibold">جمع کل:</span>
          <span class="font-bold text-lg text-secondary">
            {{ totalPrice.toLocaleString("fa-IR") }} تومان
          </span>
        </div>

        <nuxt-link
          to="/cart"
          @click="emit('close')"
          class="btn w-full text-center block"
        >
          مشاهده سبد خرید
        </nuxt-link>

        <button @click="emit('close')" class="btnborderBlack w-full">
          ادامه خرید
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from "vue";
import { X, Plus, Minus, Trash2 } from "lucide-vue-next";
import { useApi } from "@/composables/api/useApi";
import { useCartStore } from "~/store/cart";
const toast = useToast();

const props = defineProps({
  show: Boolean,
  cartItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "cart-updated"]);

const { increaseCartItem, decreaseCartItem, deleteCartItem } = useApi();
const cartStore = useCartStore();

// Debug: مشاهده تغییرات show prop
watch(
  () => props.show,
  (newVal) => {
    console.log("🎭 Sidebar show prop changed:", newVal);
    console.log("🛒 Cart items:", props.cartItems);
  },
);

watch(
  () => props.cartItems,
  (newVal) => {
    console.log("📦 Cart items updated in sidebar:", newVal);
  },
  { deep: true },
);

const totalPrice = computed(() => {
  if (!props.cartItems || props.cartItems.length === 0) return 0;
  return props.cartItems.reduce((sum, item) => {
    // استفاده از line_final_total اگر موجود باشد، در غیر این صورت محاسبه کن
    const itemTotal = item.line_final_total || item.price * item.quantity;
    return sum + itemTotal;
  }, 0);
});

// افزایش تعداد
const increaseQuantity = async (item) => {
  console.log("➕ Increasing quantity for item:", item);

  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    cartStore.increaseQuantity(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await increaseCartItem(item.id);
    emit("cart-updated");
    console.log("✅ Quantity increased successfully");
  } catch (error) {
    console.error("❌ Failed to increase quantity:", error);
    const toast = useToast();
    toast.add({
      title: "خطا",
      description: "خطا در افزایش تعداد محصول",
      color: "red",
    });
  }
};

// کاهش تعداد
const decreaseQuantity = async (item) => {
  console.log("➖ Decreasing quantity for item:", item);

  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    cartStore.decreaseQuantity(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await decreaseCartItem(item.id);
    emit("cart-updated");
    console.log("✅ Quantity decreased successfully");
  } catch (error) {
    console.error("❌ Failed to decrease quantity:", error);
    const toast = useToast();
    toast.add({
      title: "خطا",
      description: "خطا در کاهش تعداد محصول",
      color: "red",
    });
  }
};

// حذف محصول
const removeItem = async (item) => {
  console.log("🗑️ Removing item:", item);

  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    cartStore.removeItem(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await deleteCartItem(item.id);
    emit("cart-updated");
    console.log("✅ Item removed successfully");
  } catch (error) {
    console.error("❌ Failed to remove item:", error);
    const toast = useToast();
    toast.add({
      title: "خطا",
      description: "خطا در حذف محصول",
      color: "red",
    });
  }
};
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
