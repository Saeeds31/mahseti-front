<template>
  <main class="container gap">
    <SharedBreadCrumb :items="[
      { label: 'مقالات', href: '/blogs' },
      { label: article?.title || 'جزئیات مقاله', href: `/blog/${route.params.id}` }
    ]" />

    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <SharedLoadingSpinner size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 text-xl mb-6">خطا در بارگذاری مقاله</p>
      <button @click="refresh" class="btn">
        دوباره تلاش کن
      </button>
    </div>

    <div v-else-if="article">
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start border-b pb-5">
        <!-- Content -->
        <div class="space-y-6">
          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span v-if="article.author">نویسنده: {{ article.author }}</span>
            <span v-if="article.created_at">{{ formatDate(article.created_at) }}</span>
            <span v-if="article.views_count">{{ article.views_count }} بازدید</span>
          </div>

          <!-- Title -->
          <h1 class="text-2xl lg:text-3xl font-bold leading-relaxed">
            {{ article.title }}
          </h1>

          <!-- Excerpt/Summary -->
          <p class="text-muted leading-8" v-if="article.summary">
            {{ article.summary }}
          </p>

          <!-- Share -->
          <div class="flex items-center gap-3 pt-6">
            <a
              v-if="settings?.social?.instagram"
              :href="settings.social.instagram"
              target="_blank"
              class="cursor-pointer"
            >
              <IconInstagramGreen />
            </a>
            <a
              v-if="settings?.social?.telegram"
              :href="settings.social.telegram"
              target="_blank"
              class="cursor-pointer"
            >
              <IconTelegramGreen />
            </a>
            <a
              v-if="settings?.social?.whatsapp"
              :href="settings.social.whatsapp"
              target="_blank"
              class="cursor-pointer"
            >
              <IconWhatsAppGreen />
            </a>

            <button @click="copyLink" class="btnLight flex gap-2 items-center">
              <span>کپی کردن لینک</span>
              <IconCopyGreen />
            </button>
          </div>

          <!-- Reading Time -->
          <div class="flex items-center gap-2 text-sm text-muted pt-4" v-if="article.reading_time">
            <span class="text-strong">i</span>
            <span>این مقاله حدود {{ article.reading_time }} دقیقه زمان مطالعه دارد.</span>
          </div>
        </div>

        <!-- Image -->
        <div class="rounded overflow-hidden shadow h-full">
          <img
            v-if="article.image"
            :src="$getImageUrl(article.image)"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-accent flex items-center justify-center">
            <span class="text-muted">بدون تصویر</span>
          </div>
        </div>
      </section>

      <!-- Content Body -->
      <section class="py-10 prose prose-lg max-w-none" v-if="article.content">
        <div v-html="article.content"></div>
      </section>

      <!-- Comments Section -->
      <blogTabsComment />
    </div>

    <div v-else class="text-center py-20">
      <p class="text-muted text-xl">مقاله‌ای یافت نشد</p>
    </div>
  </main>
</template>

<script setup>
import { useApi } from '@/composables/api/useApi'
import { useSettingStore } from '@/store/settings'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { $getImageUrl } = useNuxtApp()
const { getBlogDetail } = useApi()

const settingStore = useSettingStore()
const { settings } = storeToRefs(settingStore)

// دریافت اطلاعات مقاله
const {
  pending,
  error,
  data: articleData,
  refresh
} = await useAsyncData(`blog-${route.params.id}`, async () => {
  try {
    const response = await getBlogDetail(route.params.id)
    return response.data
  } catch (err) {
    console.error('❌ Failed to fetch blog:', err)
    throw err
  }
})

const article = computed(() => articleData.value)

// تابع فرمت تاریخ
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
  } catch {
    return dateString
  }
}

// کپی لینک
const copyLink = async () => {
  const toast = useToast()

  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.add({
      title: 'موفقیت',
      description: 'لینک کپی شد',
      color: 'green'
    })
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.add({
      title: 'خطا',
      description: 'خطا در کپی کردن لینک',
      color: 'red'
    })
  }
}
</script>

<style scoped>
/* Prose styling for article content */
:deep(.prose) {
  color: var(--text);
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  color: var(--text);
  font-weight: bold;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

:deep(.prose p) {
  margin-bottom: 1em;
  line-height: 1.8;
}

:deep(.prose img) {
  border-radius: 8px;
  margin: 1.5em 0;
}

:deep(.prose a) {
  color: var(--text-strong);
  text-decoration: underline;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 1em 0;
  padding-right: 1.5em;
}

:deep(.prose li) {
  margin-bottom: 0.5em;
}
</style>
