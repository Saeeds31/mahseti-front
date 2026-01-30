<template>
  <div class="bg-primary relative mt-10 sm:mt-14 md:mt-16">
    <!-- درصد تخفیف -->
    <div
      v-if="product?.real_discount && product.real_discount !== '0'"
      class="absolute top-0 left-0 bg-[var(--red)] text-primery font-light rounded-br-[16px] rounded-tl-[16px] h-[70px] w-[26px] sm:h-[85px] sm:w-[30px] flex items-center justify-center"
    >
      <span class="transform -rotate-90 text-sm sm:text-base md:text-lg">
        {{ product.real_discount }}%
      </span>
    </div>

    <!-- کارت بالا -->
    <div class="shadow mb-3 border rounded-t-[16px] overflow-visible relative">
      <!-- تصویر -->
<figure
  v-if="product?.main_image"
  class="absolute -top-16 sm:-top-20 md:-top-24 left-1/2 -translate-x-1/2 z-10"
>
  <img
    :src="$getImageUrl(product.main_image)"
    :alt="product.title ?? 'محصول'"
    class="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px] object-contain"
  />
</figure>



      <!-- اطلاعات -->
      <div class="px-3 sm:px-5 pt-16" v-if="product?.title">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-base sm:text-lg">
            {{ product.title }}
          </h3>

          <!-- قلب علاقه‌مندی -->
          <button
            @click.stop="toggleFavorite"
            class="text-[var(--red)] transition-transform active:scale-90"
          >
            <!-- قلب پر -->
<IconFavFull  v-if="isFavoriteComputed" />

            <!-- قلب توخالی -->
            <IconFavLine v-else />
          </button>
        </div>

        <!-- وزن‌ها -->
        <p class="text-muted text-[11px] sm:text-xs mb-3">
          ۵۰ گرم، ۱۰۰ گرم، ۲۵۰ گرم، ۵۰۰ گرم
        </p>
      </div>
    </div>

    <!-- قیمت + دکمه -->
    <div
      class="border px-3 sm:px-5 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-b-[16px] shadow gap-3"
    >
      <div>
        <div class="text-[var(--text)] font-semibold text-base sm:text-lg">
          {{ product?.final_price?.toLocaleString() ?? "۰" }} تومان
        </div>

        <div
          v-if="product?.price !== product?.final_price"
          class="text-sm line-through decoration-[var(--red)]"
        >
          {{ product?.price?.toLocaleString() ?? "۰" }} تومان
        </div>
      </div>

      <button
        class="btn w-full sm:w-auto !text-xs sm:!text-sm"
        @click="goToProduct"
      >
        مشاهده
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWishlist } from '@/composables/useWishlist'
import { useRouter } from 'vue-router'

const { $getImageUrl } = useNuxtApp()
const router = useRouter()

const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlist()

const props = defineProps({
  product: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
})

const emit = defineEmits(['favorite-removed'])

onMounted(() => {
  fetchWishlist()
})

const isFavoriteComputed = computed(() => {
  if (props.isFavorite) return true
  return isInWishlist(props.product.id)
})

const toggleFavorite = async () => {
  const token = process.client ? localStorage.getItem('auth-token') : null
  if (!token) return

  const wasAdded = await toggleWishlist(props.product.id)
  if (!wasAdded) emit('favorite-removed', props.product.id)
}

const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
}
</script>
