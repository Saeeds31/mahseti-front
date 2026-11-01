<!-- app/components/cart/Sidebar.vue -->
<template>
  <Transition name="overlay">
    <div v-if="show" class="fixed inset-0 bg-black/50 z-40 transition-opacity" @click="emit('close')"></div>
  </Transition>

  <Transition name="slide">
    <div v-if="show" class="fixed top-0 left-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-bold">سبد خرید</h2>
        <button @click="emit('close')" class="text-muted hover:text-strong">
          <X :size="24" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="normalizedItems.length > 0" class="space-y-4">
          <div v-for="item in normalizedItems" :key="item.id || item.variant_id"
            class="flex gap-3 border rounded-inner p-3">
            <img :src="resolveImage(item.image)" :alt="item.title" class="w-20 h-20 object-cover rounded-inner" />
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-sm">
                  <nuxt-link :to="`/product/${item.product_id}`">
                    {{ item.title }}
                  </nuxt-link>
                </h3>
                <p v-if="item.variant && item.variant.attributes" v-for="attr in item.variant.attributes" :key="item.id"
                  class="text-xs text-muted">
                  {{ attr.name }}: {{ attr.value }}
                </p>

              </div>

              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-2">
                  <button @click="decreaseQuantity(item)"
                    class="w-6 h-6 rounded border border-muted flex items-center justify-center hover:bg-secondary hover:text-white transition">
                    <Minus :size="14" />
                  </button>
                  <span class="text-sm w-6 text-center">{{
                    item.quantity
                  }}</span>
                  <button @click="increaseQuantity(item)"
                    class="w-6 h-6 rounded border border-muted flex items-center justify-center hover:bg-secondary hover:text-white transition">
                    <Plus :size="14" />
                  </button>
                </div>

                <button @click="removeItem(item)" class="text-red-500 hover:text-red-700 transition">
                  <Trash2 :size="18" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <p class="text-secondary font-bold mt-2">
                  {{
                    (
                      item.line_final_total || item.price_final * item.quantity
                    ).toLocaleString("fa-IR")
                  }}
                  تومان
                </p>

                <p v-if="item.price_original != item.price_final"
                  class="text-gray-400 decoration-red-600 text-sm   line-through font-bold mt-2">
                  {{
                    (
                      item.line_original_total || item.price_original * item.quantity
                    ).toLocaleString("fa-IR")
                  }}
                  تومان
                </p>
              </div>

            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-muted">سبد خرید خالی است</div>
      </div>

      <div class="border-t p-4 space-y-3">
        <div class="flex justify-between items-center mb-4">
          <span class="font-semibold">جمع کل:</span>
          <span class="font-bold text-lg text-secondary">
            {{ totalPrice.toLocaleString("fa-IR") }} تومان
          </span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="font-semibold">تخفیف محصولات:</span>
          <span class="font-bold text-lg text-secondary">
            {{ totalDiscount.toLocaleString("fa-IR") }} تومان
          </span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="font-semibold">مبلغ قابل پرداخت:</span>
          <span class="font-bold text-lg text-secondary">
            {{ payableAmount.toLocaleString("fa-IR") }} تومان
          </span>
        </div>

        <nuxt-link to="/cart" @click="emit('close')" class="btn w-full text-center block">
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
import { computed, watch, onMounted, onBeforeUnmount } from "vue";
import { X, Plus, Minus, Trash2 } from "lucide-vue-next";
import { useApi } from "@/composables/api/useApi";
import { useCartStore } from "~/store/cart";
import { toast } from "vue3-toastify";

const { $getImageUrl } = useNuxtApp();

const props = defineProps({
  show: Boolean,
  cartItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "cart-updated", "open"]);
const openSidebar = () => {
  emit("open");
};
onMounted(() => {
  if (typeof window === "undefined") return;
  window.addEventListener("open-cart-sidebar", openSidebar);
});

onBeforeUnmount(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("open-cart-sidebar", openSidebar);
});
const { increaseCartItem, decreaseCartItem, deleteCartItem } = useApi();
const cartStore = useCartStore();


const normalizedItems = computed(() => {
  return props.cartItems || []
});


const totalPrice = computed(() => {
  if (!normalizedItems.value.length) return 0;
  return normalizedItems.value.reduce((sum, item) => {
    const itemTotal = item.line_original_total || item.price * item.quantity;
    return sum + itemTotal;
  }, 0);
});
const totalDiscount = computed(() => {
  if (!normalizedItems.value.length) return 0;
  return normalizedItems.value.reduce((sum, item) => {
    const itemTotal = item.line_discount || 0;
    return sum + itemTotal;
  }, 0);
});
const payableAmount = computed(() => {
  if (!normalizedItems.value.length) return 0;
  return normalizedItems.value.reduce((sum, item) => {
    const itemTotal = item.line_final_total || item.price_final * item.quantity;
    return sum + itemTotal;
  }, 0);
});
const resolveImage = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return $getImageUrl(src);
};

const increaseQuantity = async (item) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    cartStore.increaseQuantity(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await increaseCartItem(item.id);
    emit("cart-updated");
  } catch (error) {
    console.error("❌ Failed to increase quantity:", error);
    toast.error("خطا در افزایش تعداد محصول");
  }
};

const decreaseQuantity = async (item) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    cartStore.decreaseQuantity(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await decreaseCartItem(item.id);
    emit("cart-updated");
  } catch (error) {
    console.error("❌ Failed to decrease quantity:", error);
    toast.error("خطا در کاهش تعداد محصول");
  }
};

const removeItem = async (item) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    cartStore.removeItem(item.variant_id);
    emit("cart-updated");
    return;
  }

  try {
    await deleteCartItem(item.id);
    emit("cart-updated");
  } catch (error) {
    console.error("❌ Failed to remove item:", error);
    toast.error("خطا در حذف محصول");
  }
};

watch(
  () => props.cartItems,
  (newVal) => {
  },
  { deep: true },
);
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
