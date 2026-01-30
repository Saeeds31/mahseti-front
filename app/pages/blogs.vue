<template>
  <main class="container">
    <div v-if="pending" class="min-h-screen flex flex-col items-center justify-center">
      <div class="w-full max-w-7xl mx-auto px-4 space-y-12 animate-pulse">
        <div class="h-96 bg-gray-200 rounded-inner" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="h-64 bg-gray-200 rounded-inner" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="min-h-screen flex items-center justify-center text-center py-20">
      <div>
        <p class="text-red-500 text-xl mb-6">خطایی در بارگذاری مقالات رخ داد</p>
        <button @click="refresh" class="btn">
          دوباره تلاش کن
        </button>
      </div>
    </div>

    <div v-else-if="blogs && blogs.length > 0">
      <sharedBreadCrumb :items="[{ label: 'مقالات', href: '/blogs' }]" />

      <!-- Grid اول -->
      <div  class="grid grid-cols-3 grid-rows-3 gap-4">
        <div class="col-span-3">
          <HomeArticlesImgCard v-if="blogs[0]" :card="blogs[0]" />
        </div>

        <div class="col-span-2 row-span-2 row-start-2">
          <HomeArticlesImgCard v-if="blogs[1]" :card="blogs[1]" />
        </div>

        <div class="col-start-3 row-start-2">
          <HomeArticlesImgCard v-if="blogs[2]" :card="blogs[2]" />
        </div>

        <div class="col-start-3 row-start-3">
          <HomeArticlesImgCard v-if="blogs[3]" :card="blogs[3]" />
        </div>
      </div>

      <!-- Grid دوم -->
      <div id="productList" class="grid grid-cols-3 gap-4 mt-8">
        <HomeArticlesBigCard
          v-for="blog in blogs.slice(4)"
          :key="blog.id"
          :card="blog"
        />
      </div>

      <!-- Pagination -->
      <ProductsPagination
        v-if="pagination"
        v-model="currentPage"
        :total-items="pagination.total"
        :items-per-page="pagination.per_page"
        class="mt-6"
      />
    </div>

    <div v-else class="min-h-screen flex items-center justify-center text-center py-20 text-muted text-xl">
      مقاله‌ای یافت نشد.
    </div>
  </main>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useBlogStore } from '@/store/blog'
import { useApi } from '@/composables/api/useApi'

const blogStore = useBlogStore()
const { getBlogs } = useApi()

const currentPage = ref(1)

const {
  pending,
  error,
  refresh
} = await useAsyncData('blogs', async () => {
  const response = await getBlogs({ page: currentPage.value })
  const fetchedData = response?.data || response

  blogStore.setBlogs(fetchedData)
  return fetchedData
})

const blogs = computed(() => blogStore.blogs)
const pagination = computed(() => blogStore.pagination)

watch(currentPage, async () => {
  const response = await getBlogs({ page: currentPage.value })
  const fetchedData = response?.data || response
  blogStore.setBlogs(fetchedData)

  document
    .getElementById('productList')
    ?.scrollIntoView({ behavior: 'smooth' })
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
