<template>
  <div class="container">
    <SharedBreadCrumb :items="[
      { label: 'سبد خرید', href: '/cart' },
      { label: 'انتخاب آدرس و روش ارسال', href: '/shipping' },
      { label: 'پرداخت', href: '/payment' },
    ]" />
    <CartProgressSteps :current-step="3" />

    <div class="bg-primary rounded-inner shadow pad">
      <h2 class="text-xl font-semibold mb-6 border-b pb-3">
        انتخاب شیوه پرداخت
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <!-- ستون راست: انتخاب روش پرداخت -->
        <div class="flex flex-col gap-6">
          <!-- انتخاب نوع پرداخت -->
          <div class="space-y-4">
            <h3 class="font-bold text-base lg:text-lg">انتخاب روش پرداخت</h3>

            <!-- پرداخت اینترنتی -->
            <label
              class="border rounded-inner p-4 cursor-pointer flex items-start gap-3 hover:border-secondary transition-all duration-200"
              :class="{
                'border-secondary bg-secondary-fade':
                  paymentMethod === 'online',
              }">
              <input type="radio" name="paymentMethod" value="online" v-model="paymentMethod" class="mt-1 shrink-0" />
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-1">
                  <IconPaymentWay />
                  <span class="font-bold text-sm lg:text-base">پرداخت اینترنتی</span>
                </div>
                <span class="text-muted text-xs lg:text-sm">پرداخت با کلیه کارت‌های عضو شتاب</span>
              </div>
            </label>

            <!-- پرداخت از کیف پول -->
            <label v-if="wallet && wallet.balance"
              class="border rounded-inner p-4 cursor-pointer flex items-start gap-3 hover:border-secondary transition-all duration-200"
              :class="{
                'border-secondary bg-secondary-fade':
                  paymentMethod === 'wallet',

              }">
              <input type="radio" name="paymentMethod" value="wallet" v-model="paymentMethod" class="mt-1 shrink-0" />
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-1">
                  <IconPaymentWay />
                  <span class="font-bold text-sm lg:text-base">پرداخت از کیف پول</span>
                </div>
                <span class="text-muted text-xs lg:text-sm">استفاده از موجودی کیف پول
                  شما({{ wallet.balance.toLocaleString("fa-IR") }} تومان)</span>
              </div>
            </label>
            <label
              class="border rounded-inner p-4 cursor-pointer flex items-start gap-3 hover:border-secondary transition-all duration-200"
              :class="{
                'border-secondary bg-white': paymentMethod === 'card_transfer',
              }">
              <input type="radio" name="paymentMethod" value="card_transfer" v-model="paymentMethod"
                class="mt-1 shrink-0" />
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-1">
                  <IconPaymentWay />
                  <span class="fa font-bold text-sm lg:text-base text-black transition-colors duration-200">
                    کارت به کارت
                  </span>
                </div>
                <span class="fa text-muted text-xs lg:text-sm">پرداخت از طریق کارت به کارت و آپلود رسید</span>
              </div>
            </label>
          </div>

          <!-- انتخاب درگاه پرداخت (فقط برای پرداخت اینترنتی) -->
          <div v-if="paymentMethod === 'online'" class="space-y-3">
            <h3 class="font-bold text-base lg:text-lg">انتخاب درگاه پرداخت</h3>
            <div class="flex gap-4 flex-wrap">
              <!-- درگاه پارسیان -->
              <button type="button" aria-label="انتخاب درگاه پارسیان" :class="[
                'relative rounded-xl h-[100px] w-[140px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105',
                selected === 1
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-accent text-black border border-accent',
              ]" @click="selected = 1">

                <span class="text-xs lg:text-sm font-medium mt-8">درگاه پارسیان</span>
              </button>
              <!-- درگاه زرین‌پال -->
              <button type="button" aria-label="انتخاب درگاه زرین‌پال" :class="[
                'relative rounded-xl h-[100px] w-[140px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105',
                selected === 2
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-accent text-black border border-accent',
              ]" @click="selected = 2">

                <span class="text-xs lg:text-sm font-medium mt-8">درگاه زرین‌پال</span>
              </button>




            </div>
            <div class="bg-red-200 text-black rounded-2xl p-3 px-5">
              بسته به حجم سفارشات شما عزیزان متعاقبا بسته های ارسالی تان بین 24 تا 48 ساعت زمان برای بسته بندی و ارسال
              نیاز دارد
            </div>
            <div class="flex flex-col gap-2">
              <label for="">توضیحات سفارش:</label>
              <textarea name="" class="resize-none w-full p-3 rounded-xl border-1 border-gray-500" id=""
                v-model="user_note" placeholder="توضیحات خود را در خصوص سفارش وارد کنید"></textarea>

            </div>
          </div>
          <div v-if="paymentMethod === 'card_transfer'"
            class="mt-4 p-4 bg-yellow-50 rounded-inner border border-yellow-300">
            <p class="text-sm text-yellow-800">
              <span class="font-bold">راهنمای پرداخت کارت به کارت:</span>
            </p>
            <ul class="text-xs text-yellow-700 mt-2 space-y-2">
              <li>پس از ثبت سفارش، مبلغ را به یکی از روش‌های زیر واریز کنید</li>

              <!-- شماره کارت -->
              <li class="flex items-center justify-between bg-white/50 p-2 rounded-inner">
                <div>
                  <span class="font-bold">شماره کارت: </span>
                  <span class="font-mono" dir="ltr">{{ bankCardNumber }}</span>
                </div>
                <button @click="copyText(bankCardNumber)"
                  class="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors">
                  کپی
                </button>
              </li>

              <!-- شماره حساب -->
              <!-- <li class="flex items-center justify-between bg-white/50 p-2 rounded-inner">
                <div>
                  <span class="font-bold">شماره حساب: </span>
                  <span class="font-mono" dir="ltr">{{ bankAccountNumber }}</span>
                </div>
                <button @click="copyText(bankAccountNumber)"
                  class="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors">
                  کپی
                </button>
              </li> -->

              <!-- شماره شبا -->
              <li class="flex items-center justify-between bg-white/50 p-2 rounded-inner">
                <div>
                  <span class="font-bold">شماره شبا: </span>
                  <span class="font-mono" dir="ltr">{{ bankShebaNumber }}</span>
                </div>
                <button @click="copyText(bankShebaNumber)"
                  class="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors">
                  کپی
                </button>
              </li>

              <li class="text-xs text-gray-600 mt-2">
                <span class="font-bold">صاحب حساب: </span>
                {{ bankAccountOwner }}
              </li>

              <li class="text-red-600 font-bold text-sm mt-2">
                ⚠️ توجه: پس از واریز، رسید را در صفحه سفارش آپلود کنید. برای ثبت رسید تا 15 دقیقه بعد از سفارش زمان
                دارید!
              </li>
            </ul>
          </div>
          <!-- دکمه مرحله قبل -->
          <nuxt-link to="/shipping" class="btnborderBlack w-full mt-auto text-center">
            مرحله قبل
          </nuxt-link>
        </div>

        <!-- ستون چپ: خلاصه سفارش -->
        <div class="space-y-4 flex flex-col">
          <!-- نوع سفارش -->
          <div class="grid grid-cols-1  gap-4"
            :class="[selectedReservation && selectedReservation.order_id ? 'md:grid-cols-1' : 'md:grid-cols-3']">
            <label class="border rounded-inner p-4 cursor-pointer transition" :class="{
              'border-secondary bg-secondary-fade':
                reservationType === 'none'
            }">
              <div class="flex items-center gap-3">
                <input v-model="reservationType" type="radio" value="none" name="reservation_type" />

                <div>
                  <div class="font-semibold">
                    سفارش عادی
                  </div>

                  <div class="text-xs text-muted mt-1">
                    بدون رزرو
                    {{ selectedReservation && selectedReservation.order_id ? ` به همراه سفارش
                    ${selectedReservation.order_id}` : '' }}
                  </div>
                </div>
              </div>
            </label>

            <label v-if="!selectedReservation || !selectedReservation.order_id"
              class="border rounded-inner p-4 cursor-pointer transition" :class="{
                'border-secondary bg-secondary-fade':
                  reservationType === 'three_days'
              }">
              <div class="flex items-center gap-3">
                <input v-model="reservationType" type="radio" value="three_days" name="reservation_type" />

                <div>
                  <div class="font-semibold">
                    رزرو ۳ روزه
                  </div>

                  <div class="text-xs text-muted mt-1">
                    رزرو سفارش برای ۳ روز
                  </div>
                </div>
              </div>
            </label>

            <label v-if="!selectedReservation || !selectedReservation.order_id"
              class="border rounded-inner p-4 cursor-pointer transition" :class="{
                'border-secondary bg-secondary-fade':
                  reservationType === 'seven_days'
              }">
              <div class="flex items-center gap-3">
                <input v-model="reservationType" type="radio" value="seven_days" name="reservation_type" />

                <div>
                  <div class="font-semibold">
                    رزرو ۷ روزه
                  </div>

                  <div class="text-xs text-muted mt-1">
                    رزرو سفارش برای ۷ روز
                  </div>
                </div>
              </div>
            </label>
          </div>

          <!-- اطلاعات آدرس -->
          <div v-if="isFetchingSummary" class="bg-accent rounded-inner p-4 text-center">
            <SharedLoadingSpinner size="sm" />
          </div>
          <div v-else-if="selectedAddress"
            class="bg-accent rounded-inner p-4 text-xs lg:text-sm leading-relaxed space-y-2">
            <p class="font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
              <IconLocAdders class="shrink-0" />
              <span>مشخصات تحویل گیرنده</span>
            </p>
            <p>
              <span class="text-muted ml-1">نام:</span>
              <span class="font-semibold text-secondary">{{
                selectedAddress.receiver_name
              }}</span>
            </p>
            <p>
              <span class="text-muted ml-1">آدرس:</span>
              <span class="font-medium">
                {{ selectedAddress.province?.name }}
                -
                {{ selectedAddress.city?.name }}
                ,
                {{
                  selectedAddress.address_line
                }}

              </span>
            </p>
            <p>
              <span class="text-muted ml-1">شماره تماس:</span>
              <span class="font-medium">{{ selectedAddress.phone }}</span>
            </p>
          </div>
          <div v-else class="bg-accent rounded-inner p-4 text-center text-xs lg:text-sm text-muted">
            اطلاعات آدرس یافت نشد
          </div>

          <!-- خلاصه مالی -->
          <div class="bg-accent rounded-inner p-4 space-y-3 text-xs lg:text-sm">
            <h3 class="font-bold text-sm lg:text-base mb-3">خلاصه سفارش</h3>

            <div class="flex justify-between items-center">
              <span class="text-muted">مجموع قیمت کالاها:</span>
              <span class="font-medium">{{ subtotal.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div class="flex justify-between items-center" :class="discount > 0 ? 'text-red-500' : 'text-muted'">
              <span>تخفیف محصولات:</span>
              <span class="font-medium">{{ discount > 0 ? "-" : "" }}
                {{ discount.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div v-if="apiCouponDiscount > 0" class="flex justify-between items-center text-green-600">
              <span>تخفیف کوپن ({{ couponCode }}):</span>
              <span class="font-semibold">- {{ apiCouponDiscount.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-muted">هزینه ارسال:</span>
              <span class="font-medium" :class="shippingCost === 0 ? 'text-green-600' : ''">
                {{
                  shippingCost === 0
                    ? "0 تومان"
                    : `${shippingCost.toLocaleString("fa-IR")} تومان`
                }}
              </span>
            </div>

            <div class="flex justify-between items-center" v-if="shippingCost === 0">
              <span class="text-muted">شیوه ارسال:</span>
              <span class="font-medium" :class="shippingCost === 0 ? 'text-green-600' : ''">
                {{
                  checkoutSummary?.shipping_method?.name
                }}
              </span>
            </div>

            <div class="border-t my-2 border-muted"></div>

            <div class="flex justify-between items-center font-bold text-base lg:text-lg">
              <span>پرداخت نهایی:</span>
              <span class="text-secondary">{{ total.toLocaleString("fa-IR") }} تومان</span>
            </div>
          </div>

          <!-- دکمه پرداخت -->
          <button v-if="paymentMethod !== 'card_transfer'" @click="handlePayment" :disabled="isProcessing" :class="[
            'btn w-full',
            isProcessing ? 'opacity-50 cursor-not-allowed' : '',
          ]">
            <span v-if="isProcessing">در حال پردازش...</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span>تکمیل و پرداخت</span>
              <span>←</span>
            </span>
          </button>
          <button v-else @click="handleCardTransferOrder" :disabled="isProcessing" :class="[
            'btn w-full bg-yellow-600 hover:bg-yellow-700',
            isProcessing ? 'opacity-50 cursor-not-allowed' : '',
          ]">
            <span v-if="isProcessing">در حال ثبت سفارش...</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span>ثبت سفارش کارت به کارت</span>
              <span>←</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composables/api/useApi";
import { toast } from "vue3-toastify";

definePageMeta({
  middleware: "auth",
});

const { getCheckoutSummary } = useApi();
const { $api } = useNuxtApp();

const paymentMethod = ref("online"); // 'online' یا 'wallet'
const selected = ref(1); // برای انتخاب درگاه پرداخت
const cartData = ref(null);
const couponCode = ref(""); // کد تخفیف
const isProcessing = ref(false); // برای جلوگیری از کلیک مکرر
const checkoutSummary = ref(null); // داده‌های checkout summary از API
const isFetchingSummary = ref(false); // برای نمایش loading
const shippingInfo = ref(null); // اطلاعات shipping از API
const reservationStorageKey = "selected-reservation";
const selectedReservation = ref(null);
let user_note = ref('');

const bankCardNumber = ref("5894-6311-7108-1854");
const bankAccountNumber = ref("4006051640119");
const bankShebaNumber = ref("IR780130100000000333237675");
const bankAccountOwner = ref("مهدیه خراسانی - بانک رفاه");
const copyText = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('متن با موفقیت کپی شد');
      })
      .catch(() => {
        // fallback
        copyTextFallback(text);
      });
  } else {
    copyTextFallback(text);
  }
};

// روش جایگزین برای کپی
const copyTextFallback = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    toast.success('متن با موفقیت کپی شد');
  } catch (err) {
    toast.error('خطا در کپی متن');
  }
  document.body.removeChild(textarea);
};

// تابع ثبت سفارش کارت به کارت
async function handleCardTransferOrder() {
  if (isProcessing.value) return;

  if (!selectedAddress.value) {
    toast.error("آدرس تحویل یافت نشد");
    return;
  }

  if (!selectedShippingMethod.value) {
    toast.error("روش ارسال یافت نشد");
    return;
  }

  isProcessing.value = true;

  try {
    const payload = {
      address_id: selectedAddress.value.id,
      shipping_id: selectedShippingMethod.value.id,
      payment_method: 'card_transfer',
      coupon_code: couponCode.value.trim() || "",
    };

    const response = await $api.post("/front/card-transfer/order", payload);

    toast.success(response.data?.message || "سفارش با موفقیت ثبت شد");

    localStorage.removeItem("cart-summary");

    // هدایت به صفحه جزئیات سفارش
    navigateTo(`/panel/order/${response.data.order_id}`);

  } catch (err) {
    console.error("❌ Card transfer order error:", err);
    toast.error(err.response?.data?.message || "خطا در ثبت سفارش");
  } finally {
    isProcessing.value = false;
  }
}
const getSelectedReservation = () => {
  if (!process.client) {
    return null;
  }

  const saved = localStorage.getItem(reservationStorageKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Invalid reservation storage:", error);

    localStorage.removeItem(reservationStorageKey);

    return null;
  }
};
onMounted(async () => {
  selectedReservation.value = getSelectedReservation();
  // بارگذاری اطلاعات cart از localStorage
  const savedCart = localStorage.getItem("cart-summary");
  if (savedCart) {
    try {
      cartData.value = JSON.parse(savedCart);

      // بارگذاری کد تخفیف از localStorage
      if (cartData.value.couponCode) {
        couponCode.value = cartData.value.couponCode;
      }

    } catch (err) {
      console.error("❌ Failed to parse cart data:", err);
    }
  }

  // بارگذاری اطلاعات shipping از localStorage
  const savedShipping = localStorage.getItem("shipping-info");
  if (savedShipping) {
    try {
      shippingInfo.value = JSON.parse(savedShipping);

      // بارگذاری checkout summary با استفاده از address_id و shipping_method_id
      if (
        shippingInfo.value?.address_id &&
        shippingInfo.value?.shipping_method_id
      ) {
        await fetchCheckoutSummary();
      } else {
        toast.error(
          "اطلاعات آدرس و روش ارسال یافت نشد. لطفاً به مرحله قبل بازگردید.");
      }
    } catch (err) {
      console.error("❌ Failed to parse shipping data:", err);
      toast.error("خطا در بارگذاری اطلاعات. لطفاً به مرحله قبل بازگردید.");
    }
  } else {
    toast.error(
      "اطلاعات آدرس و روش ارسال یافت نشد. لطفاً به مرحله قبل بازگردید.");
  }
});
const reservationType = ref("none");
// تابع برای fetch کردن checkout summary
const fetchCheckoutSummary = async () => {
  if (
    !shippingInfo.value?.address_id ||
    !shippingInfo.value?.shipping_method_id
  ) {
    return;
  }

  isFetchingSummary.value = true;

  try {
    const response = await getCheckoutSummary({
      address_id: shippingInfo.value.address_id,
      shipping_id: shippingInfo.value.shipping_method_id,
      coupon_code: couponCode.value || "",
      reservation_order_id:
        selectedReservation.value?.order_id || null,
      // payment_method
      // reservation_type
      // parent_order_id
      // gateway
    });

    checkoutSummary.value = response.data || response;

    // اگر کوپن از API برگشت، کد تخفیف رو آپدیت کن
    if (checkoutSummary.value?.coupon) {
      couponCode.value = checkoutSummary.value.coupon.code || "";
    }
  } catch (err) {
    console.error("❌ Failed to fetch checkout summary:", err);
  } finally {
    isFetchingSummary.value = false;
  }
};

// محاسبه قیمت‌ها - از API اگر موجود باشه، وگرنه از localStorage
const subtotal = computed(() => {
  if (checkoutSummary.value?.summary?.subtotal !== undefined) {
    return checkoutSummary.value.summary.subtotal;
  }
  return cartData.value?.totalPrice || 0;
});

const shippingCost = computed(() => {
  if (checkoutSummary.value?.summary?.shipping_cost !== undefined) {
    return checkoutSummary.value.summary.shipping_cost;
  }
  return 0;
});

const discount = computed(() => {
  if (checkoutSummary.value?.summary?.product_discount !== undefined) {
    return checkoutSummary.value.summary.product_discount;
  }
  return cartData.value?.discount || 0;
});

const totalDiscount = computed(() => {
  if (checkoutSummary.value?.summary?.coupon_discount !== undefined) {
    return discount.value + checkoutSummary.value.summary.coupon_discount;
  }
  return discount.value;
});

// تخفیف کوپن از API
const apiCouponDiscount = computed(() => {
  if (checkoutSummary.value?.summary?.coupon_discount !== undefined) {
    return checkoutSummary.value.summary.coupon_discount;
  }
  return 0;
});

const total = computed(() => {
  if (checkoutSummary.value?.summary?.payable_amount !== undefined) {
    return checkoutSummary.value.summary.payable_amount;
  }
  return subtotal.value + shippingCost.value - totalDiscount.value;
});

// آدرس و روش ارسال انتخاب شده - مستقیماً از checkout summary
const selectedAddress = computed(() => {
  return checkoutSummary.value?.address || null;
});

const selectedShippingMethod = computed(() => {
  return checkoutSummary.value?.shipping_method || null;
});
const wallet = computed(() => {
  return checkoutSummary.value?.wallet || null;
});

// وقتی می‌خواهید درگاه را ارسال کنید
const getSelectedGateway = () => {
  const gatewayMap = {
    1: 'parsian',
    2: 'zarinpal',
    3: 'zibal'
  };
  return gatewayMap[selected.value] || 'parsian';
};
// تابع ثبت سفارش
async function handlePayment() {
  const { $api } = useNuxtApp();

  if (isProcessing.value) return;

  // اعتبارسنجی
  if (!selectedAddress.value) {
    toast.error("آدرس تحویل یافت نشد");
    return;
  }

  if (!selectedShippingMethod.value) {
    toast.error("روش ارسال یافت نشد");
    return;
  }

  isProcessing.value = true;

  try {
    const payload = {
      address_id: selectedAddress.value.id,
      gateway: getSelectedGateway(),
      user_note: user_note.value,
      shipping_id: selectedShippingMethod.value.id,
      payment_method: paymentMethod.value === "wallet" ? "wallet" : "online",
      coupon_code: couponCode.value.trim() || "", // همیشه ارسال میشه، حتی اگه خالی باشه
    };

    if (reservationType.value && reservationType.value !== "none") {
      payload.reservation_type = reservationType.value;
    }

    if (selectedReservation.value?.order_id) {
      payload.parent_order_id = selectedReservation.value.order_id;
    }
    const response = await $api.post("/front/order", payload);
    if (process.client) {
      localStorage.removeItem("selected-reservation");
    }
    localStorage.removeItem("cart-summary");
    if (response.data?.gateway_url) {
      toast.error(response.data?.message || "سفارش شما با موفقیت ثبت شد , در حال انتقال به درگاه");
      window.location.href = response.data.gateway_url;
    } else {
      toast.error(response.data?.message || "سفارش شما با موفقیت ثبت شد ");
      navigateTo("/panel/orders");
    }
  } catch (err) {
    console.error("❌ Order error:", err);
    toast.error(err.response?.data?.message || "خطا در ثبت سفارش");
  } finally {
    isProcessing.value = false;
  }
}
</script>
