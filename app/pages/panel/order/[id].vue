<template>
  <!-- لودینگ -->
  <div v-if="loading" class="flex justify-center items-center p-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span class="mr-3 text-muted">در حال بارگذاری...</span>
  </div>

  <!-- خطا -->
  <div v-else-if="error" class="p-8 border rounded-inner shadow bg-white text-center">
    <div class="text-red-500 text-lg font-semibold">خطا در بارگذاری اطلاعات</div>
    <p class="text-muted mt-2">{{ error }}</p>
    <button @click="fetchOrder" class="mt-4 px-6 py-2 bg-primary text-white rounded-inner">
      تلاش مجدد
    </button>
  </div>

  <div v-else class="p-8 border rounded-inner shadow bg-white">
    <!-- Header -->
    <div class="flex gap-3 items-center mb-4 pb-4 border-b">
      <MoveRight class="w-5 h-5" />
      <h2 class="text-lg font-semibold">جزئیات سفارش</h2>
      <span class="mr-auto text-sm text-muted">#{{ orderData?.id || '---' }}</span>

      <!-- نشان‌دهنده سفارش والد -->
      <span v-if="orderData?.parent_order_id" class="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
        سفارش فرزند
      </span>
    </div>

    <!-- وضعیت سفارش و پرداخت -->
    <div class="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-inner">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">وضعیت سفارش:</span>
        <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="getStatusClass(orderData?.status)">
          {{ getStatusText(orderData?.status) }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">وضعیت پرداخت:</span>
        <span class="px-3 py-1 rounded-full text-sm font-semibold"
          :class="getPaymentStatusClass(orderData?.payment_status)">
          {{ getPaymentStatusText(orderData?.payment_status) }}
        </span>
      </div>

      <!-- نوع رزرو -->
      <div v-if="orderData?.reservation_type !== 'none'" class="flex items-center gap-2">
        <span class="text-sm text-muted">نوع رزرو:</span>
        <span class="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
          {{ getReservationTypeText(orderData?.reservation_type) }}
          -

          <span   class="font-bold text-green-950">
            نگه داشته شده تا تاریخ:{{ new Date(orderData.reserved_until).toLocaleDateString('fa') }}
          </span>
        </span>
      </div>

      <!-- <div class="mr-auto text-sm text-muted">
        تاریخ ثبت: {{ formatDate(orderData?.created_at) }}
      </div> -->
    </div>
    <div v-if="orderData?.payment_method === 'card_transfer'" class="mb-6 p-4 rounded-inner border"
      :class="getCardTransferClass()">

      <!-- در انتظار آپلود رسید -->
      <div v-if="orderData.status === 'card_transfer_pending' || orderData.status === 'card_transfer_send_again'">
        <div class="flex items-center gap-3 mb-3">
          <IconClock class="w-5 h-5 text-yellow-600" />
          <span class="font-semibold text-yellow-700">
            لطفاً رسید پرداخت کارت به کارت را آپلود کنید
          </span>
        </div>
        <div class="mt-4 p-4 bg-yellow-50 rounded-inner border border-yellow-300">
          <p class="text-sm text-yellow-800">
            <span class="font-bold">راهنمای پرداخت کارت به کارت:</span>
          </p>
          <ul v-if="remainingSeconds > 0" class="text-xs text-yellow-700 mt-2 space-y-2">
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
          </ul>
        </div>
        <!-- تایمر -->
        <div class="flex items-center gap-3 bg-yellow-50 p-3 rounded-inner">
          <span class="text-sm text-gray-600">زمان باقی‌مانده برای آپلود:</span>
          <span class="font-mono text-lg font-bold text-yellow-700" v-if="remainingSeconds > 0">
            {{ formatTimer(remainingSeconds) }}
          </span>
          <span v-else-if="orderData.status === 'card_transfer_send_again'" class="text-red-600 font-bold">
            در اصرع وقت رسید خود را بارگذاری کنید - رد رسید قبلی به علت:
            {{ orderData.card_transfer_receipt?.description }}
          </span>
          <span v-else class="text-red-600 font-bold">زمان تمام شد!</span>
        </div>

        <!-- دکمه آپلود رسید -->
        <button v-if="remainingSeconds > 0 || orderData.status === 'card_transfer_send_again'"
          @click="openUploadReceiptModal"
          class="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-inner hover:bg-yellow-700 transition-colors">
          آپلود رسید پرداخت
        </button>
      </div>

      <!-- در انتظار بررسی ادمین -->
      <div v-else-if="orderData.status === 'card_transfer_review'">
        <div class="flex items-center gap-3">
          <IconClock class="w-5 h-5 text-blue-600" />
          <span class="font-semibold text-blue-700">
            رسید شما در انتظار بررسی ادمین است
          </span>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          پس از تأیید رسید، وضعیت سفارش به‌روزرسانی می‌شود
        </p>
      </div>

      <!-- رسید رد شده -->
      <div v-else-if="orderData.status === 'cancelled' && orderData.cardTransferReceipt?.status === 'rejected'">
        <div class="flex items-center gap-3">
          <IconX class="w-5 h-5 text-red-600" />
          <span class="font-semibold text-red-700">
            رسید شما رد شده است
          </span>
        </div>
        <p v-if="orderData.cardTransferReceipt?.description" class="text-sm text-gray-600 mt-2">
          دلیل: {{ orderData.cardTransferReceipt.description }}
        </p>
      </div>

      <!-- رسید تأیید شده -->
      <div v-else-if="orderData.cardTransferReceipt?.status === 'approved'">
        <div class="flex items-center gap-3">
          <IconCheck class="w-5 h-5 text-green-600" />
          <span class="font-semibold text-green-700">
            رسید شما تأیید شده است ✓
          </span>
        </div>
      </div>
    </div>
    <div v-if="orderData?.cardTransferReceipt?.image_url" class="mb-6 p-4 bg-gray-50 rounded-inner">
      <h4 class="font-semibold mb-2">رسید پرداخت</h4>
      <img :src="$getImageUrl(orderData.cardTransferReceipt.image_url)" alt="رسید پرداخت"
        class="max-w-xs max-h-48 object-contain rounded-inner border"
        @click="openImagePreview($getImageUrl(orderData.cardTransferReceipt.image_url))" />
      <div v-if="orderData.cardTransferReceipt.tracking_code" class="mt-2 text-sm">
        <span class="text-muted">کد پیگیری:</span>
        <span class="font-medium">{{ orderData.cardTransferReceipt.tracking_code }}</span>
      </div>
    </div>
    <!-- اطلاعات سفارش -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-b py-6">
      <div>
        <span class="text-muted text-sm block">کد سفارش</span>
        <span class="font-bold">{{ orderData?.id || '---' }}</span>
      </div>
      <!-- <div>
        <span class="text-muted text-sm block">تاریخ سفارش</span>
        <span class="font-bold">{{ formatDate(orderData?.created_at) }}</span>
      </div> -->
      <div>
        <span class="text-muted text-sm block">تحویل گیرنده</span>
        <span class="font-bold">{{ orderData?.address?.receiver_name || '---' }}</span>
      </div>
      <div>
        <span class="text-muted text-sm block">شماره موبایل</span>
        <span class="font-bold">{{ orderData?.user?.mobile || '---' }}</span>
      </div>
      <div class="col-span-2">
        <span class="text-muted text-sm block">آدرس</span>
        <span class="font-bold">{{ orderData?.address?.address_line || '---' }}</span>
      </div>
    </div>

    <!-- اطلاعات حمل و نقل -->
    <div class="border-b py-6">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-strong font-semibold">🚚 {{ orderData?.shipping?.title || 'ارسال عادی' }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span class="text-muted text-sm block">زمان تحویل</span>
          <span class="font-bold">{{ formatDate(orderData?.delivery_date) || '---' }}</span>
        </div>
        <div>
          <span class="text-muted text-sm block">هزینه ارسال</span>
          <span class="font-bold">{{ formatPrice(orderData?.shipping?.cost) }} تومان</span>
        </div>
        <div>
          <span class="text-muted text-sm block">روش پرداخت</span>
          <span class="font-bold">{{ getPaymentMethodText(orderData?.payment_method) }}</span>
        </div>
        <div
          v-if="orderData.card_transfer_receipt?.status == 'rejected' && orderData.payment_method == 'card_transfer'">
          <span class="text-muted text-sm block">دلیل رد رسید:</span>
          <span class="font-bold text-primary">{{
            orderData.card_transfer_receipt?.description
          }}</span>
        </div>
        <div v-if="orderData?.reserved_until">
          <span class="text-muted text-sm block">زمان انقضای رزرو</span>
          <span class="font-bold">{{ formatDate(orderData?.reserved_until) }}</span>
        </div>
      </div>
    </div>

    <!-- لیست محصولات سفارش اصلی -->
    <div class="border-b py-6" v-if="orderData?.items?.length">
      <h3 class="font-semibold mb-4">محصولات سفارش</h3>
      <div class="space-y-4">
        <!-- آیتم سفارش اصلی -->
        <div v-for="item in orderData.items" :key="item.id"
          class="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-inner">
          <div class="flex-1">
            <div class="flex items-start gap-4">
              <img v-if="item.product?.main_image" :src="$getImageUrl(item.product.main_image)"
                :alt="item.product.title" class="w-20 h-20 object-cover rounded-inner" />
              <div class="flex-1">
                <h4 class="font-semibold">{{ item.product?.title || 'نامشخص' }}</h4>
                <div class="text-sm text-muted mt-1 space-y-0.5">
                  <div v-if="item.variant?.values?.length">
                    <span v-for="(value, index) in item.variant.values" :key="index" class="inline-block">
                      <span class="font-medium">{{ getAttributeName(value.attribute_id) }}:</span>
                      {{ decodeURIComponent(value.value) }}
                      <span v-if="index < item.variant.values.length - 1" class="mx-1">•</span>
                    </span>
                  </div>
                  <div>کد: {{ item.product?.sku || '---' }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
            <div>
              <span class="text-muted">تعداد: </span>
              <span class="font-medium">{{ item.quantity }}</span>
            </div>
            <div>
              <span class="text-muted">قیمت واحد: </span>
              <span class="font-medium">{{ formatPrice(item.price) }} تومان</span>
            </div>
            <div>
              <span class="text-muted">جمع: </span>
              <span class="font-bold">{{ formatPrice(item.price * item.quantity) }} تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- سفارش‌های فرزند -->
    <div v-if="orderData?.child_orders?.length" class="border-b py-6">
      <h3 class="font-semibold mb-4 flex items-center gap-2">
        <span>📦 سفارش‌های مرتبط</span>
        <span class="text-sm text-muted">({{ orderData.child_orders.length }} سفارش)</span>
      </h3>

      <div class="space-y-6">
        <div v-for="child in orderData.child_orders" :key="child.id"
          class="border rounded-inner p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <!-- هدر سفارش فرزند -->
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-dashed">
            <div class="flex items-center gap-3">
              <span class="font-semibold text-sm">سفارش #{{ child.id }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="getStatusClass(child.status)">
                {{ getStatusText(child.status) }}
              </span>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="getPaymentStatusClass(child.payment_status)">
                {{ getPaymentStatusText(child.payment_status) }}
              </span>
            </div>
            <span class="text-xs text-muted">{{ formatDate(child.created_at) }}</span>
          </div>

          <!-- آیتم‌های سفارش فرزند -->
          <div class="space-y-3">
            <div v-for="item in child.items" :key="item.id"
              class="flex flex-col md:flex-row gap-4 p-3 bg-white rounded-inner">
              <div class="flex-1">
                <div class="flex items-start gap-4">
                  <img v-if="item.product?.main_image" :src="$getImageUrl(item.product.main_image)"
                    :alt="item.product.title" class="w-16 h-16 object-cover rounded-inner" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm">{{ item.product?.title || 'نامشخص' }}</h4>
                    <div class="text-xs text-muted mt-1 space-y-0.5">
                      <div v-if="item.variant?.values?.length">
                        <span v-for="(value, index) in item.variant.values" :key="index" class="inline-block">
                          <span class="font-medium">{{ getAttributeName(value.attribute_id) }}:</span>
                          {{ decodeURIComponent(value.value) }}
                          <span v-if="index < item.variant.values.length - 1" class="mx-1">•</span>
                        </span>
                      </div>
                      <div>کد: {{ item.product?.sku || '---' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                <div>
                  <span class="text-muted">تعداد: </span>
                  <span class="font-medium">{{ item.quantity }}</span>
                </div>
                <div>
                  <span class="text-muted">قیمت واحد: </span>
                  <span class="font-medium">{{ formatPrice(item.price) }} تومان</span>
                </div>
                <div>
                  <span class="text-muted">جمع: </span>
                  <span class="font-bold">{{ formatPrice(item.price * item.quantity) }} تومان</span>
                </div>
              </div>
            </div>
          </div>

          <!-- جمع سفارش فرزند -->
          <div class="mt-3 pt-3 border-t border-dashed flex flex-wrap items-center justify-between gap-2 text-sm">
            <div class="flex items-center gap-4">
              <span class="text-muted">تعداد اقلام: <span class="font-medium">{{ child.items?.length || 0
              }}</span></span>
              <span class="text-muted">هزینه ارسال: <span class="font-medium">{{ formatPrice(child.shipping?.cost) }}
                  تومان</span></span>
            </div>
            <div class="font-bold text-primary">
              جمع: {{ formatPrice(child.total) }} تومان
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- جمع کل -->
    <div class="py-6">
      <div class="max-w-md mr-auto">
        <div class="flex justify-between py-2 text-sm">
          <span class="text-muted">جمع سبد خرید</span>
          <span class="font-medium">{{ formatPrice(orderData?.subtotal) }} تومان</span>
        </div>

        <!-- جمع سبد خرید فرزندان -->
        <div v-if="orderData?.child_orders?.length"
          class="flex justify-between py-2 text-sm text-gray-600 border-t border-dashed">
          <span class="text-muted">جمع سفارش‌های مرتبط</span>
          <span class="font-medium">{{ formatPrice(childOrdersSubtotal) }} تومان</span>
        </div>

        <div v-if="orderData?.discount_amount > 0" class="flex justify-between py-2 text-sm text-green-600">
          <span>تخفیف</span>
          <span>-{{ formatPrice(orderData.discount_amount) }} تومان</span>
        </div>
        <div class="flex justify-between py-2 text-sm">
          <span class="text-muted">هزینه ارسال</span>
          <span class="font-medium">{{ formatPrice(orderData?.shipping?.cost) }} تومان</span>
        </div>

        <!-- جمع کل با احتساب سفارش‌های فرزند -->
        <div class="flex justify-between py-3 border-t border-dashed font-bold text-lg">
          <span>جمع کل</span>
          <span>{{ formatPrice(totalWithChildren) }} تومان</span>
        </div>

        <div v-if="orderData?.child_orders?.length" class="text-xs text-muted mt-1 text-left">
          * شامل {{ orderData.child_orders.length }} سفارش مرتبط
        </div>
      </div>
    </div>

    <!-- دکمه‌های اقدام -->
    <div class="flex flex-wrap gap-3 pt-4 border-t">
      <button @click="goBack" class="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-inner transition-colors">
        بازگشت
      </button>
      <button
        v-if="orderData?.status === 'paid' || orderData?.status === 'delivered' || orderData?.status === 'reserved'"
        @click="printOrder"
        class="px-6 py-2 bg-primary text-white hover:bg-primary-dark rounded-inner transition-colors">
        چاپ فاکتور
      </button>
    </div>
  </div>
  <UploadReceiptModal :show="showUploadModal" :order-id="orderData?.id" @close="showUploadModal = false"
    @uploaded="onReceiptUploaded" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MoveRight } from 'lucide-vue-next';
import { useApi } from '~/composables/api/useApi';
import UploadReceiptModal from '~/components/card-transfer/UploadReceiptModal.vue';
import { toast } from 'vue3-toastify';

const { $getImageUrl } = useNuxtApp();
const showUploadModal = ref(false);

const openUploadReceiptModal = () => {
  showUploadModal.value = true;
};

const onReceiptUploaded = (receipt) => {
  showUploadModal.value = false;
  // رفرش کردن اطلاعات سفارش
  fetchOrder();
  toast.success('رسید با موفقیت آپلود شد');
};
definePageMeta({
  layout: 'panel',
  middleware: 'auth'
});

const route = useRoute();
const router = useRouter();
const { getOrder } = useApi();

const orderData = ref(null);
const loading = ref(true);
const error = ref(null);

const orderId = computed(() => route.params.id);

// محاسبه جمع سفارش‌های فرزند
const childOrdersSubtotal = computed(() => {
  if (!orderData.value?.child_orders?.length) return 0;
  return orderData.value.child_orders.reduce((sum, child) => sum + (child.total || 0), 0);
});

// محاسبه جمع کل با احتساب سفارش‌های فرزند
const totalWithChildren = computed(() => {
  if (!orderData.value) return 0;
  const mainTotal = orderData.value.total || 0;
  return mainTotal + childOrdersSubtotal.value;
});

// تابع دریافت نام ویژگی
const getAttributeName = (id) => {
  const names = { 1: 'سایز', 2: 'رنگ' };
  return names[id] || 'ویژگی';
};

const fetchOrder = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getOrder(orderId.value);
    if (response && response.order) {
      orderData.value = response.order;
    } else {
      error.value = 'سفارش مورد نظر یافت نشد';
    }
    if (orderData.value.status === 'card_transfer_pending') {
      startTimer();
    }
  } catch (err) {
    console.error('Error fetching order:', err);
    error.value = err.response?.data?.message || 'خطا در ارتباط با سرور';
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  if (!price && price !== 0) return '۰';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const bankCardNumber = ref("5894-6311-7108-1854");
const bankAccountNumber = ref("4006051640119");
const bankShebaNumber = ref("IR780130100000000333237675");
const bankAccountOwner = ref("مهدیه خراسانی - بانک رفاه");
const formatDate = (date) => {
  if (!date) return '---';
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  } catch {
    return date;
  }
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    reserved: 'رزرو شده',
    completed: 'تکمیل شده',
    card_transfer_pending: "در انتظار آپلود رسید",
    card_transfer_review: "در حال پردازش رسید",
    card_transfer_send_again: "در انتظار آپلود مجدد رسید",
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده',
    failed: 'ناموفق'
  };
  return statusMap[status] || status || 'نامشخص';
};

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    reserved: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-rose-100 text-rose-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusText = (status) => {
  const statusMap = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    unpaid: 'پرداخت نشده',
    failed: 'ناموفق',
    refunded: 'بازگشت وجه'
  };
  return statusMap[status] || status || 'نامشخص';
};

const getPaymentStatusClass = (status) => {
  const classMap = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentMethodText = (method) => {
  const methodMap = {
    wallet: 'کیف پول',
    online: 'درگاه اینترنتی',
    cash: 'پرداخت نقدی',
    card_transfer: 'کارت به کارت'
  };
  return methodMap[method] || method || 'نامشخص';
};

const getReservationTypeText = (type) => {
  const typeMap = {
    three_days: 'رزرو ۳ روزه',
    seven_days: 'رزرو ۷ روزه',
    none: 'بدون رزرو'
  };
  return typeMap[type] || type || 'نامشخص';
};

const goBack = () => {
  router.back();
};

const printOrder = () => {
  window.print();
};
const getCardTransferClass = () => {
  if (orderData.value?.status === 'card_transfer_pending') {
    return 'border-yellow-300 bg-yellow-50';
  }
  if (orderData.value?.status === 'card_transfer_review') {
    return 'border-blue-300 bg-blue-50';
  }
  if (orderData.value?.status === 'cancelled') {
    return 'border-red-300 bg-red-50';
  }
  return 'border-green-300 bg-green-50';
};
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
const remainingSeconds = ref(0);
let timerInterval = null;

// تابع تایمر
const startTimer = () => {
  if (!orderData.value?.receipt_remaining_seconds) return;

  remainingSeconds.value = Math.ceil(Math.max(0, orderData.value.receipt_remaining_seconds));

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--;
    } else {
      clearInterval(timerInterval);
      // زمان تمام شد، سفارش رو دوباره fetch کن
      fetchOrder();
    }
  }, 1000);
};
// باز کردن پیش‌نمایش تصویر
const openImagePreview = (imageUrl) => {
  // باز کردن تصویر در مودال یا new window
  window.open(imageUrl, '_blank');
};
// فرمت تایمر
const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
onMounted(() => {
  fetchOrder();
});
</script>

<style scoped>
.text-muted {
  color: #6b7280;
}

.text-strong {
  color: #1f2937;
}

.rounded-inner {
  border-radius: 8px;
}

.border-dashed {
  border-style: dashed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
@media print {

  header,
  footer,
  aside {
    display: none !important;
  }

  .p-8 {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
</style>