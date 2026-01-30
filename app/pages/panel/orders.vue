<template>
  <div class="p-8 border rounded-inner shadow">
      <h3 class="font-bold text-xl  pb-4 mb-4 border-b">سفارش ها</h3>

    <div v-if="!ordersData" class="text-center py-8">
      <SharedLoadingSpinner size="lg" />
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-8">
      <p class="text-muted">هیچ سفارشی یافت نشد</p>
    </div>

    <div
      v-else
      v-for="order in orders"
      :key="order.id"
      class="border rounded-inner p-4 mx-auto shadow flex flex-col gap-4 bg-primary mb-4"
    >
      <!-- بالای کارت: وضعیت + بستن -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <component
            :is="getStatusIcon(order.status)"
            class="w-5 h-5 text-gray-600"
          />
          <span :class="getStatusColor(order.status)">{{
            getStatusText(order.status)
          }}</span>
        </div>
        <nuxt-link :to="`order/${order.id}`" class="text-muted">
          <ChevronLeft />
        </nuxt-link >
      </div>

      <!-- اطلاعات سفارش -->
      <div class="flex items-center text-sm text-muted gap-3 border-b pb-4">
        <span>{{ order.date }}</span>
        <span class="w-2 h-2 bg-accent rounded-full"></span>
        <span
          >کد سفارش: <span class="font-semibold">{{ order.code }}</span></span
        >
        <span class="w-2 h-2 bg-accent rounded-full"></span>
        <span
          >مبلغ:
          <span class="font-semibold">{{ order.amount }} تومان</span></span
        >
      </div>

      <!-- محصول -->
      <div class="flex items-center gap-4">
        <img
          :src="order.product.image"
          :alt="order.product.name"
          class="w-16 h-16 rounded"
        />
        <div class="flex flex-col gap-3">
          <span class="font-semibold text-sm">{{ order.product.name }}</span>
          <span class="text-muted text-xs">{{ order.product.weight }}</span>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { useApi } from '@/composables/api/useApi'

definePageMeta({
  layout: "panel",
  middleware: 'auth'
});

import {
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Disc,
  ChevronLeft,
} from "lucide-vue-next";
import { ref } from "vue";

const { getOrders } = useApi()

// دریافت سفارشات از API
const { data: ordersData } = await useAsyncData(
  'userOrders',
  async () => {
    try {
      return await getOrders()
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error)
      return { data: [] }
    }
  },
  {
    lazy: true,
    server: false
  }
)

// استفاده از داده‌های API
const orders = computed(() => ordersData.value?.data || []);

function getStatusIcon(status) {
  switch (status) {
    case "cancelled":
      return AlertCircle;
    case "pending":
      return Clock;
    case "delivered":
      return CheckCircle;
    default:
      return Clock;
  }
}

function getStatusText(status) {
  switch (status) {
    case "cancelled":
      return "لغو سیستمی";
    case "pending":
      return "در حال آماده‌سازی";
    case "delivered":
      return "تحویل داده شد";
    default:
      return "نامشخص";
  }
}

function getStatusColor(status) {
  switch (status) {
    case "cancelled":
      return "text-red";
    case "pending":
      return "text-gold";
    case "delivered":
      return "text-strong";
    default:
      return "text-muted";
  }
}
</script>

<style scoped>
/* استفاده از کلاس‌های CSS شما برای rounded و shadow */
</style>
