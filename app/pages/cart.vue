<template>
  <div class="container">
    <SharedBreadCrumb :items="[{ label: 'سبد خرید', href: '/cart' }]" />
    <CartProgressSteps :current-step="1" />
    <div v-if="showLoader" class="pad sjadow rounded mx-auto flex flex-col justify-center items-center w-full">
      <img class="w-[20%]" src="@/assets/images/shopping.png" />
      <h2 class="text-md mb-7 text-muted">در حال دریافت اطلاعات سبد خرید</h2>
      <SharedLoadingSpinner size="lg" />

    </div>
    <template v-else>

      <div v-if="cartItems.length === 0"
        class="pad sjadow rounded mx-auto flex flex-col justify-center items-center w-full" alt="">
        <img class="w-[20%]" src="@/assets/images/shopping.png" />
        <h2 class="text-md mb-7 text-muted">سبد خرید شما خالی است</h2>
      </div>

      <div v-else class="bg-primary rounded-inner shadow pad mb-8">
        <div class="overflow-x-auto">
          <table id="cartsTable" class="w-full md:min-w-[600px]">
            <thead class="">
              <tr class="border-b ">
                <th class="text-right pb-4 font-semibold ">سبد خرید شما</th>
                <th class="text-center pb-4 font-semibold hidden md:table-cell">قیمت</th>
                <th class="text-center pb-4 font-semibold  hidden md:table-cell">تخفیف</th>
                <th class="text-center pb-4 font-semibold  hidden md:table-cell">تعداد</th>
                <th class="text-center pb-4 font-semibold  hidden md:table-cell">قیمت نهایی</th>
                <th class="text-center pb-4 font-semibold hidden md:table-cell">حذف</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartItems" :key="item.id || item.variant_id"
                class="max-w-4xl mx-auto border-b py-3 grid gap-2 grid-cols-1 md:table-row">
                <td class="py-4 ">
                  <div class="flex flex-col md:flex-row items-center gap-4">
                    <div
                      class="p-2 w-18 h-18 rounded-inner bg-accent flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                      <img v-if="item.image" :src="resolveImage(item.image)" :alt="item.title"
                        class="w-full h-full object-cover" />
                      <span v-else>📦</span>
                    </div>
                    <div class="flex flex-col gap-2">
                      <nuxt-link :to="`/product/${item.product_id}`" class="font-semibold">{{ item.title }}</nuxt-link>
                      <p v-if="item.size" class="text-sm text-muted">
                        سایز: {{ item.size }}
                      </p>
                      <p v-if="item.color" class="text-sm text-muted">
                        رنگ: {{ item.color }}
                      </p>
                      <p class="mt-3 p-1 px-5 border bg-red-700 max-w-[340px] text-sm rounded-2xl text-white"
                        v-if="item.alert_message">
                        {{
                          item.alert_message }}</p>
                    </div>
                  </div>
                </td>
                <td class="text-center whitespace-nowrap flex items-center justify-between md:table-cell">
                  <span class="block md:hidden">قیمت اصلی :</span>
                  <span>
                    {{
                      (
                        item.line_original_total || item.price * item.quantity
                      ).toLocaleString("fa-IR")
                    }}
                    <span class="text-muted">تومان</span>
                  </span>
                </td>
                <td class="text-center whitespace-nowrap flex items-center justify-between md:table-cell">
                  <span class="block md:hidden">تخفیف:</span>
                  <span>

                    {{
                      (
                        item.line_discount || item.price * item.quantity
                      ).toLocaleString("fa-IR")
                    }}
                    <span class="text-muted">تومان</span>
                  </span>
                </td>
                <td class="text-center whitespace-nowrap flex items-center justify-between md:table-cell">
                  <span class="block md:hidden"> تعداد :</span>
                  <div class="flex items-center justify-center gap-2">
                    <button @click="increaseQuantity(item.id || item.variant_id)"
                      class="w-6 h-6 rounded-inner border flex items-center justify-center hover:bg-secondary transition">
                      <Plus :size="16" />
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="decreaseQuantity(item.id || item.variant_id)"
                      class="w-6 h-6 rounded-inner border flex items-center justify-center hover:bg-secondary transition">
                      <Minus :size="16" />
                    </button>
                  </div>
                </td>
                <td class="text-center whitespace-nowrap flex items-center justify-between md:table-cell">
                  <span class="block md:hidden">قیمت نهایی :</span>
                  <span>

                    {{
                      (
                        item.line_final_total || item.price * item.quantity
                      ).toLocaleString("fa-IR")
                    }}
                    <span class="text-muted">تومان</span>
                  </span>
                </td>

                <td class="text-center whitespace-nowrap flex items-center justify-between md:table-cell">
                  <span class="block md:hidden">حذف آیتم :</span>
                  <button @click="removeItem(item.id || item.variant_id)"
                    class="text-red-500 hover:text-red-700 transition">
                    <Trash2 :size="20" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8 bg-accent-fade rounded-inner py-4 px-8 flex flex-col md:flex-row justify-between">
          <form @submit="applyCoupon" class="flex gap-3 items-start flex-col">
            <div class="flex flex-col md:flex-row gap-3 w-full">
              <input v-model="couponCode" class="bg-primery border py-2 px-4 rounded-inner flex-1" type="text"
                placeholder="کد تخفیف خود را وارد کنید ..." :disabled="isCheckingCoupon" />
              <button type="submit" class="btn" :disabled="isCheckingCoupon">
                {{ isCheckingCoupon ? "در حال بررسی..." : "اعمال کد تخفیف" }}
              </button>
            </div>
            <p v-if="couponError" class="text-red-500 text-sm">
              {{ couponError }}
            </p>
            <p v-if="couponDiscount > 0" class="text-green-500 text-sm">
              تخفیف کوپن: {{ couponDiscount.toLocaleString("fa-IR") }} تومان
            </p>
          </form>
          <div>
            <div class="flex justify-between mb-2">
              <span>مجموع قیمت :</span>
              <span class="font-semibold">{{ subtotal.toLocaleString("fa-IR") }} تومان</span>
            </div>
            <div class="flex justify-between mb-2">
              <span>تخفیف محصولات:</span>
              <span class="font-semibold">{{ discount.toLocaleString("fa-IR") }} تومان</span>
            </div>
            <div v-if="couponDiscount > 0" class="flex justify-between mb-2">
              <span>تخفیف کوپن:</span>
              <span class="font-semibold text-green-600">{{ couponDiscount.toLocaleString("fa-IR") }} تومان</span>
            </div>
            <div class="flex justify-between mb-4 text-strong font-bold text-lg">
              <span>پرداخت:</span>
              <span>{{ totalPrice.toLocaleString("fa-IR") }} تومان</span>
            </div>
          </div>
        </div>

        <!-- Active Reservations -->
        <div v-if="isLoggedIn && (isLoadingReservations || activeReservations.length > 0)"
          class="mt-6 bg-accent-fade rounded-inner p-5">
          <!-- Loading -->
          <div v-if="isLoadingReservations" class="flex items-center gap-3 text-muted">
            <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>

            <span>در حال بررسی رزروهای شما...</span>
          </div>

          <!-- Reservations -->
          <template v-else>
            <div class="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 class="font-bold text-lg">
                  رزروهای فعال شما
                </h3>

                <p class="text-sm text-muted mt-1">
                  در صورت تمایل می‌توانید یکی از رزروهای خود را برای ادامه سفارش انتخاب کنید.
                </p>
              </div>

              <div class="shrink-0 text-sm px-3 py-1 rounded-full bg-primary">
                {{ activeReservations.length }} رزرو فعال
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Reservation -->
              <button v-for="reservation in activeReservations" :key="reservation.id" type="button"
                @click="selectReservation(reservation)"
                class="text-right border rounded-inner p-4 transition-all duration-200" :class="selectedReservation === reservation.id
                  ? 'border-primary ring-2 ring-primary/20 bg-primary'
                  : 'border-gray-200 hover:border-primary hover:bg-primary/50'
                  ">
                <div class="flex items-start justify-between gap-3">

                  <div class="flex items-center gap-3">

                    <!-- Radio -->
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" :class="selectedReservation === reservation.id
                      ? 'border-primary'
                      : 'border-gray-400'
                      ">
                      <div v-if="selectedReservation === reservation.id" class="w-2.5 h-2.5 rounded-full bg-blue-700">
                      </div>
                    </div>

                    <div>
                      <div class="font-semibold">
                        سفارش #{{ reservation.id }}
                      </div>

                      <div class="text-sm text-muted mt-1">
                        {{ reservation.reservation_type_label || 'رزرو فعال' }}
                      </div>
                    </div>

                  </div>

                  <div class="text-left">
                    <div class="font-bold">
                      {{ Number(reservation.total || 0).toLocaleString("fa-IR") }}
                    </div>

                    <div class="text-xs text-muted">
                      تومان
                    </div>
                  </div>

                </div>

                <div class="mt-4 pt-3 border-t flex items-center justify-between text-sm">

                  <span class="text-muted">
                    مهلت رزرو
                  </span>

                  <span class="font-medium">
                    {{ formatReservationDate(reservation.reserved_until) }}
                  </span>

                </div>

              </button>

            </div>

            <!-- Don't use reservation -->
            <div class="mt-4 pt-4 border-t">

              <button type="button" @click="selectReservation(null)" class="rounded-xl p-3 text-sm transition" :class="selectedReservation === null
                ? 'text-black font-semibold'
                : 'text-white bg-blue-400'
                ">
                ✓ بدون استفاده از رزرو ادامه می‌دهم
              </button>

            </div>
          </template>
        </div>

        <!-- Continue -->
        <div class="flex justify-end mt-5">
          <button @click="goToShipping" class="btn">
            ادامه فرایند
          </button>
        </div>
      </div>
    </template>
    <AuthLoginModal v-if="loginModal" />
  </div>
</template>

<script setup>
import { Plus, Minus, Trash2 } from "lucide-vue-next";
import { useApi } from "@/composables/api/useApi";
import { computed, ref, onMounted, watch } from "vue";
import { useSettingStore } from "~/store/settings";
import { useAuth } from "~/composables/useAuth";
import { useCartStore } from "~/store/cart";
const route = useRoute()
const { $getImageUrl } = useNuxtApp();

const {
  getCart,
  increaseCartItem,
  decreaseCartItem,
  deleteCartItem,
  checkCoupon,
  getActiveReservations,
} = useApi();
const { loginModal } = useAuth();
const cartStore = useCartStore();
const settingStore = useSettingStore();

const isLoggedIn = computed(() => !!settingStore.user);
const activeReservations = ref([]);
const selectedReservation = ref(null);
const isLoadingReservations = ref(false);

const reservationStorageKey = "selected-reservation";
const token = process.client ? localStorage.getItem("auth-token") : null;
const cacheKey = token ? `cart-${token.substring(0, 10)}` : "cart-guest";
let loading = ref(true);
const showLoader = ref(true);
const { data: cartData, refresh: refreshCart } = await useAsyncData(
  cacheKey,
  async () => {
    loading.value = true;
    const token = process.client ? localStorage.getItem("auth-token") : null;
    if (!token) {
      cartStore.loadFromLocalStorage();
      loading.value = false;
      return {
        items: cartStore.items,
        summary: {
          subtotal: cartStore.subtotal,
          product_discount_total: cartStore.product_discount_total,
        },
      };
    }

    try {
      return await getCart();
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error);
      return { items: [], summary: { subtotal: 0, product_discount_total: 0 } };
    } finally {
      loading.value = false;

    }
  },
);
watch(
  () => [cartData.value, loading.value, isLoadingReservations.value],
  ([data, isLoading, isResLoading]) => {
    if (!isLoading && !isResLoading && data) {
      // یک تاخیر کوچک برای نمایش نرم لودر
      setTimeout(() => {
        showLoader.value = false;
      }, 300);
    }
  },
  { immediate: true }
);
const formatReservationDate = (date) => {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("fa-IR");
  } catch {
    return date;
  }
};
watch(
  () => cartData.value?.items,
  (items) => {
  },
  { deep: true },
);

onMounted(async () => {
  await loadActiveReservations();
  if (process.client) {
    localStorage.removeItem("selected-reservation");
    const token = process.client ? localStorage.getItem("auth-token") : null;
    if (!token) {
      setTimeout(() => {
        refreshCart();

      }, 500);
    }

  }
  showLoader.value = false;

});
const loadActiveReservations = async () => {
  // فقط کاربر لاگین‌شده
  if (!isLoggedIn.value) {
    activeReservations.value = [];
    selectedReservation.value = null;

    if (process.client) {
      localStorage.removeItem(reservationStorageKey);
    }

    return;
  }

  isLoadingReservations.value = true;

  try {
    const result = await getActiveReservations();

    if (result?.success) {
      activeReservations.value = result.data || [];

      // اگر هیچ رزرو فعالی وجود ندارد
      if (activeReservations.value.length === 0) {
        selectedReservation.value = null;

        if (process.client) {
          localStorage.removeItem(reservationStorageKey);
        }

        return;
      }
    } else {
      activeReservations.value = [];
      selectedReservation.value = null;

      if (process.client) {
        localStorage.removeItem(reservationStorageKey);
      }

      return;
    }

    // بررسی رزرو ذخیره‌شده قبلی
    if (process.client) {
      const saved = localStorage.getItem(reservationStorageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          const exists = activeReservations.value.some(
            reservation => reservation.id === parsed.order_id
          );

          if (exists) {
            selectedReservation.value = parsed.order_id;
          } else {
            // رزرو ذخیره‌شده دیگر فعال نیست
            selectedReservation.value = null;
            localStorage.removeItem(reservationStorageKey);
          }
        } catch (error) {
          console.error("Invalid saved reservation:", error);

          selectedReservation.value = null;
          localStorage.removeItem(reservationStorageKey);
        }
      }
    }
  } catch (error) {
    console.error("❌ Failed to fetch active reservations:", error);

    activeReservations.value = [];
  } finally {
    isLoadingReservations.value = false;
  }
};

const selectReservation = (reservation) => {
  if (!reservation) {
    selectedReservation.value = null;

    if (process.client) {
      localStorage.removeItem(reservationStorageKey);
    }

    return;
  }

  selectedReservation.value = reservation.id;

  if (process.client) {
    localStorage.setItem(
      reservationStorageKey,
      JSON.stringify({
        order_id: reservation.id,
        address_id: reservation.address_id,
        shipping_id: reservation.shipping_id,
        reservation_type: reservation.reservation_type,
        reserved_until: reservation.reserved_until,
        total: reservation.total,
        selected_at: new Date().toISOString(),
      })
    );
  }
};

const couponCode = ref("");
const couponDiscount = ref(0);
const couponError = ref("");
const isCheckingCoupon = ref(false);

const broadcastCartUpdate = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("cart-updated"));
};

const extractSizeColor = (item) => {
  let size = item?.size || null;
  let color = item?.color || null;

  const attrs = item?.variant?.attributes || [];

  if (Array.isArray(attrs)) {
    for (const a of attrs) {
      const name = String(a?.name || "").trim();
      const value = a?.value ?? null;
      if (!value) continue;

      if (!size && name.includes("سایز")) size = value;
      if (!color && name.includes("رنگ")) color = value;
    }
  }

  return { size, color };
};

const normalizeCartItem = (item) => {
  const { size, color } = extractSizeColor(item);

  const title =
    item?.title ??
    item?.name ??
    item?.product?.title ??
    item?.product?.name ??
    "";

  const image =
    item?.image ??
    item?.main_image ??
    item?.product?.main_image ??
    item?.variant?.image ??
    "";

  const priceRaw =
    item?.final_price ??
    item?.price ??
    item?.variant?.final_price ??
    item?.variant?.price ??
    item?.product?.final_price ??
    item?.product?.price ??
    item?.product_price ??
    item?.variant_price ??
    item?.unit_price ??
    0;

  const price = Number(priceRaw) || 0;

  return {
    ...item,
    title,
    image,
    price,
    price_final: price,
    size,
    color,
  };
};

const cartItems = computed(() => {
  const items = cartData.value?.items || [];
  const normalized = items.map(normalizeCartItem);
  return normalized;
});

watch(
  cartItems,
  (items) => {
  },
  { deep: true, immediate: true },
);

const subtotal = computed(() => {
  return cartData.value?.summary?.subtotal || 0;
});

const discount = computed(() => {
  return cartData.value?.summary?.product_discount_total || 0;
});

const totalDiscount = computed(() => {
  return discount.value + couponDiscount.value;
});

const totalPrice = computed(() => {
  return subtotal.value - totalDiscount.value;
});

const resolveImage = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return $getImageUrl(src);
};

const updateCartSummaryStorage = () => {
  if (typeof window === "undefined") return;

  const totalQuantity = cartItems.value.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const cartSummary = {
    items: cartItems.value,
    totalQuantity,
    subtotal: subtotal.value,
    product_discount_total: discount.value,
    couponDiscount: couponDiscount.value,
    totalPrice: totalPrice.value,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("cart-summary", JSON.stringify(cartSummary));
  broadcastCartUpdate();
};

watch(
  [cartItems, subtotal, discount, couponDiscount, totalPrice],
  () => {
    updateCartSummaryStorage();
  },
  { deep: true, immediate: true },
);

const increaseQuantity = async (id) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    const item = cartStore.items.find(
      (i) => i.id === id || i.variant_id === id,
    );
    if (item) {
      cartStore.increaseQuantity(item.variant_id);
      await refreshCart();
      updateCartSummaryStorage();
    }
    return;
  }

  try {
    await increaseCartItem(id);
    await refreshCart();
    updateCartSummaryStorage();
  } catch (error) {
    alert("خطا در افزایش تعداد محصول");
  }
};

const decreaseQuantity = async (id) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    const item = cartStore.items.find(
      (i) => i.id === id || i.variant_id === id,
    );
    if (item) {
      cartStore.decreaseQuantity(item.variant_id);
      await refreshCart();
      updateCartSummaryStorage();
    }
    return;
  }

  try {
    await decreaseCartItem(id);
    await refreshCart();
    updateCartSummaryStorage();
  } catch (error) {
    console.error("❌ Failed to decrease quantity:", error);
    alert("خطا در کاهش تعداد محصول");
  }
};

const removeItem = async (id) => {
  const token = process.client ? localStorage.getItem("auth-token") : null;

  if (!token) {
    const item = cartStore.items.find(
      (i) => i.id === id || i.variant_id === id,
    );
    if (item) {
      cartStore.removeItem(item.variant_id);
      await refreshCart();
      updateCartSummaryStorage();
    }
    return;
  }

  try {
    await deleteCartItem(id);
    await refreshCart();
    updateCartSummaryStorage();
  } catch (error) {
    console.error("❌ Failed to remove item:", error);
    alert("خطا در حذف محصول");
  }
};

const applyCoupon = async (event) => {
  event.preventDefault();

  if (!couponCode.value) {
    couponError.value = "لطفاً کد تخفیف را وارد کنید";
    return;
  }

  isCheckingCoupon.value = true;
  couponError.value = "";

  try {
    const result = await checkCoupon(couponCode.value, subtotal.value);

    if (result.success) {
      couponDiscount.value = result.discount || 0;
      alert("کد تخفیف با موفقیت اعمال شد");
    }
  } catch (error) {
    console.error("❌ Coupon check failed:", error);
    couponError.value = error.response?.data?.message || "کد تخفیف نامعتبر است";
    couponDiscount.value = 0;
  } finally {
    isCheckingCoupon.value = false;
  }
};
const goToShipping = () => {
  const totalQuantity = cartItems.value.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const cartSummary = {
    items: cartItems.value,
    totalQuantity,
    subtotal: subtotal.value,
    discount: discount.value,
    couponDiscount: couponDiscount.value,
    couponCode: couponCode.value,
    totalPrice: totalPrice.value,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("cart-summary", JSON.stringify(cartSummary));
  broadcastCartUpdate();

  const token = localStorage.getItem("auth-token");
  if (!token) {
    const loginModal = useState("loginModal");
    localStorage.setItem('lastPage', route.fullPath)
    loginModal.value = true;
  } else {
    navigateTo("/shipping");
  }
};
</script>

<style scoped>
.border-gradient {
  border: 1px solid;
  border-image-source: linear-gradient(90deg,
      rgba(214, 214, 214, 0.2) 0%,
      #5d5d5d 50%,
      rgba(214, 214, 214, 0.2) 100%);
}
</style>
