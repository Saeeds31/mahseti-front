<template>
  <div class="pagination-container mt-10">
    <div class="flex items-center gap-2 flex-wrap justify-center">
      <!-- دکمه صفحه بعد (سمت راست) -->
      <button
        @click="prevPage"
        :disabled="currentPageInternal === 1"
        class="page-btn arrow-btn"
        aria-label="صفحه قبل"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
             viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- نمایش صفحات -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <div v-if="page === '...'" class="page-btn ellipsis">...</div>
        <button
          v-else
          @click="goToPage(page)"
          :class="['page-btn', { active: currentPageInternal === page }]"
          :aria-label="`صفحه ${toPersianNum(page)}`"
          :aria-current="currentPageInternal === page ? 'page' : undefined"
        >
          {{ toPersianNum(page) }}
        </button>
      </template>

      <!-- دکمه صفحه بعد (سمت چپ) -->
      <button
        @click="nextPage"
        :disabled="currentPageInternal === totalPages"
        class="page-btn arrow-btn"
        aria-label="صفحه بعد"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
             viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- نمایش اطلاعات صفحه فعلی -->
    <div class="page-info">
      صفحه {{ toPersianNum(currentPageInternal) }} از {{ toPersianNum(totalPages) }}
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 25
  }
})

const emit = defineEmits(['update:modelValue', 'page-change'])

// internal state برای v-model
const currentPageInternal = ref(props.modelValue)

// همگام‌سازی با prop در صورت تغییر
watch(() => props.modelValue, (val) => {
  currentPageInternal.value = val
})

// ارسال تغییرات به parent
watch(currentPageInternal, (val) => {
  emit('update:modelValue', val)
  emit('page-change', val)
})

// تبدیل اعداد انگلیسی به فارسی
const toPersianNum = (num) => {
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
  return num.toString().split('').map(d => persianDigits[d] || d).join('')
}

// محاسبه صفحات قابل نمایش
const visiblePages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = currentPageInternal.value

  if (total <= 7) {
    for (let i=1; i<=total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1,2,3,4,5,'...',total)
    } else if (current >= total-3) {
      pages.push(1,'...',total-4,total-3,total-2,total-1,total)
    } else {
      pages.push(1,'...',current-1,current,current+1,'...',total)
    }
  }
  return pages
})

// متدها
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) currentPageInternal.value = page
}

const nextPage = () => {
  if (currentPageInternal.value < props.totalPages) currentPageInternal.value++
}

const prevPage = () => {
  if (currentPageInternal.value > 1) currentPageInternal.value--
}
</script>

<style scoped>
.pagination-container {
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 8px; }

.page-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background-color: var(--bg-primary);
  color: var(--text);
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.page-btn:hover:not(.active):not(.ellipsis):not(:disabled) {
  background-color: var(--accent);
  border-color: var(--bg-secondary-fade);
}

.page-btn.active {
  background-color: var(--bg-secondary);
  color: var(--text-primery);
  border-color: var(--bg-secondary);
}

.page-btn.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.arrow-btn {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
}

.arrow-btn:hover:not(:disabled) {
  background-color: var(--bg-secondary-fade);
  border-color: var(--bg-secondary);
}

.arrow-btn:hover:not(:disabled) svg {
  stroke: var(--bg-secondary);
}

.page-info {
  color: var(--text-muted);
  font-size: 14px;
  text-align: center;
}

@media (max-width: 768px) {
  .page-btn { min-width: 32px; height: 32px; font-size: 13px; }
}
</style>
