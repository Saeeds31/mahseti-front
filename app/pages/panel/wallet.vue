<template>
  <div class="p-8 border rounded-inner shadow">
    <h3 class="font-bold text-xl pb-4 mb-4 border-b">کیف پول</h3>

    <!-- اطلاعات کیف پول -->
    <div v-if="!walletData" class="text-center py-8">
      <SharedLoadingSpinner size="lg" />
    </div>

    <div v-else class="space-y-6">
      <!-- موجودی کیف پول -->
      <div class="bg-primary p-6 rounded-inner border">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-muted text-sm mb-2">موجودی کیف پول</p>
            <p class="text-2xl font-bold">
              {{ wallet?.balance?.toLocaleString() || '0' }} تومان
            </p>
          </div>
          <Wallet class="w-12 h-12 text-gold" />
        </div>
      </div>

      <!-- فرم شارژ کیف پول -->
      <div class="bg-primary p-6 rounded-inner border">
        <h4 class="font-semibold mb-4">شارژ کیف پول</h4>
        <form @submit.prevent="handleCharge" class="space-y-4">
          <div>
            <label for="amount" class="block text-sm mb-2">مبلغ (تومان)</label>
            <input
              id="amount"
              v-model.number="chargeAmount"
              type="number"
              min="10000"
              step="1000"
              class="w-full px-4 py-2 border rounded-inner focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="حداقل 10,000 تومان"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="isCharging || !chargeAmount || chargeAmount < 10000"
            class="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isCharging ? 'در حال انتقال به درگاه...' : 'شارژ کیف پول' }}
          </button>
        </form>
      </div>

      <!-- تراکنش‌های کیف پول -->
      <div class="bg-primary p-6 rounded-inner border">
        <h4 class="font-semibold mb-4 pb-4 border-b">تراکنش‌های اخیر</h4>

        <div v-if="!transactionsData" class="text-center py-4">
          <SharedLoadingSpinner size="md" />
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-4">
          <p class="text-muted text-sm">هیچ تراکنشی یافت نشد</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex justify-between items-center p-4 border rounded-inner hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-3">
              <component
                :is="getTransactionIcon(transaction.type)"
                :class="getTransactionColor(transaction.type)"
                class="w-5 h-5"
              />
              <div>
                <p class="font-medium text-sm">
                  {{ getTransactionTitle(transaction.type) }}
                </p>
                <p class="text-xs text-muted">{{ transaction.date }}</p>
                <p v-if="transaction.description" class="text-xs text-muted mt-1">
                  {{ transaction.description }}
                </p>
              </div>
            </div>
            <div class="text-left">
              <p
                :class="transaction.type === 'credit' ? 'text-green-600' : 'text-red'"
                class="font-semibold"
              >
                {{ transaction.type === 'credit' ? '+' : '-' }}
                {{ transaction.amount?.toLocaleString() }} تومان
              </p>
              <p class="text-xs text-muted mt-1">
                {{ getStatusText(transaction.status) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApi } from '@/composables/api/useApi'
import { Wallet, ArrowUpCircle, ArrowDownCircle, ShoppingCart, CheckCircle, Clock, XCircle } from 'lucide-vue-next'
import { ref } from 'vue'

definePageMeta({
  layout: 'panel',
  middleware: 'auth'
})

const { getWallet, getWalletTransactions, chargeWallet } = useApi()

// دریافت اطلاعات کیف پول
const { data: walletData, refresh: refreshWallet } = await useAsyncData(
  'userWallet',
  async () => {
    try {
      return await getWallet()
    } catch (error) {
      console.error('❌ Failed to fetch wallet:', error)
      return { data: null }
    }
  },
  {
    lazy: true,
    server: false
  }
)

// دریافت تراکنش‌های کیف پول
const { data: transactionsData, refresh: refreshTransactions } = await useAsyncData(
  'walletTransactions',
  async () => {
    try {
      return await getWalletTransactions()
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error)
      return { data: [] }
    }
  },
  {
    lazy: true,
    server: false
  }
)

const wallet = computed(() => walletData.value?.data || null)
const transactions = computed(() => transactionsData.value?.data || [])

const chargeAmount = ref(null)
const isCharging = ref(false)

async function handleCharge() {
  if (!chargeAmount.value || chargeAmount.value < 10000) {
    return
  }

  isCharging.value = true
  try {
    const response = await chargeWallet(chargeAmount.value)
    console.log('✅ Charge response:', response)

    // اگر API یک URL درگاه برگرداند، کاربر را به آنجا هدایت کنید
    if (response.data?.payment_url) {
      window.location.href = response.data.payment_url
    } else {
      // در غیر این صورت، داده‌ها را رفرش کنید
      await refreshWallet()
      await refreshTransactions()
      chargeAmount.value = null
    }
  } catch (error) {
    console.error('❌ Charge failed:', error)
    const toast = useToast()
    toast.add({
      title: 'خطا',
      description: 'شارژ کیف پول با خطا مواجه شد. لطفا دوباره تلاش کنید.',
      color: 'red'
    })
  } finally {
    isCharging.value = false
  }
}

function getTransactionIcon(type) {
  switch (type) {
    case 'credit':
      return ArrowUpCircle
    case 'debit':
      return ArrowDownCircle
    case 'purchase':
      return ShoppingCart
    default:
      return Wallet
  }
}

function getTransactionColor(type) {
  switch (type) {
    case 'credit':
      return 'text-green-600'
    case 'debit':
    case 'purchase':
      return 'text-red'
    default:
      return 'text-gray-600'
  }
}

function getTransactionTitle(type) {
  switch (type) {
    case 'credit':
      return 'واریز به کیف پول'
    case 'debit':
      return 'برداشت از کیف پول'
    case 'purchase':
      return 'خرید'
    default:
      return 'تراکنش'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'completed':
    case 'success':
      return 'موفق'
    case 'pending':
      return 'در انتظار'
    case 'failed':
    case 'cancelled':
      return 'ناموفق'
    default:
      return status
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
