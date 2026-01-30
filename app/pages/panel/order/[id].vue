<template>
  <div class="p-8 border rounded-inner shadow">
    <!-- Card اصلی -->

    <!-- Header -->
    <div class="flex gap-3 items-center mb-4 pb-4 border-b">
      <MoveRight />
      <h2 class="text-lg font-semibold">جزئیات سفارشات</h2>
    </div>

    <!-- اطلاعات سفارش -->
    <div class="grid grid-cols-3 gap-6 border-b py-6">
      <div>
        <span class="text-muted">کد سفارش: </span>
        <span class="font-bold">{{ order.code }}</span>
      </div>
      <div>
        <span class="text-muted">تاریخ سفارش: </span>
        <span class="font-bold">{{ order.date }}</span>
      </div>
      <div>
        <span class="text-muted">تحویل گیرنده: </span>
        <span class="font-bold">{{ order.receiver }}</span>
      </div>
      <div>
        <span class="text-muted">شماره موبایل: </span>
        <span class="font-bold">{{ order.mobile }}</span>
      </div>
      <div class="col-span-2">
        <span class="text-muted">آدرس: </span>
        <span class="font-bold">{{ order.address }}</span>
      </div>
    </div>

    <!-- اتمحصول -->
    <div class="border rounded-inner p-4 mt-6">
      <div>
        <!-- آیکون کامیون -->
        <span class="text-strong"> ارسال عادی</span>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-6">
        <div class="p-2">
          <span class="text-muted">زمان تحویل: </span>
          <span class="font-bold">{{ order.date }}</span>
        </div>
        <div class="p-2 border-b-4 border-red-700 text-red-700 font-bold">
          لغو شده
        </div>

        <div class="p-2">
          <span class="text-muted">کد سفارش: </span>
          <span class="font-bold">{{ order.code }}</span>
        </div>

        <div class="p-2">
          <span class="text-muted">کد سفارش: </span>
          <span class="font-bold">{{ order.code }}</span>
        </div>
      </div>

      <div></div>
    </div>
  </div>
  ّ
</template>

<script setup>
import { MoveRight } from "lucide-vue-next";
definePageMeta({
  layout: "panel",
  middleware: 'auth'
});

const order = {
  code: "789456123",
  date: "1 اردیبهشت 1403",
  receiver: "حمید رضا خواجوی",
  mobile: "09123456789",
  address: "گرگان، سراج، مجتمع آفتاب دو، واحد 216",
  amount: "250,000",
  paymentDate: "31 اردیبهشت 1403",
  deliveryStatus: "ارسال عادی",
  deliveryDate: "31 اردیبهشت 1403",
  cancelled: true,
  product: {
    name: "اسپرسو آتنااس",
    weight: "250 گرم",
    price: "250,000",
  },
};
</script>

<style>
/* اگر میخوای از متغیرهای CSS خودت استفاده کنی */
.text-muted {
  color: var(--text-muted);
}
.text-red-600 {
  color: var(--red);
}
.text-green-600 {
  color: var(--text-strong);
}
.rounded-inner {
  border-radius: 8px;
}
.bg-primary {
  background-color: var(--bg-primary);
}
</style>
