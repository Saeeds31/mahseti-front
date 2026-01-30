<!-- pages/product/[id].vue -->
<script setup>
import { useApi } from '@/composables/api/useApi'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { usePageLoading } from '@/composables/usePageLoading'

const route = useRoute();
const productId = route.params.id;
const { getProduct, getWishlist, getBase, getProductComments } = useApi();
const { loadPageWithBase } = usePageLoading();

// بارگذاری همزمان base + product + wishlist
const productData = ref(null);
const wishlistData = ref(null);
const commentsData = ref(null);

try {
  await loadPageWithBase(
    [
      async () => {
        const response = await getProduct(productId);
        productData.value = response;
        return response;
      },
      async () => {
        const response = await getWishlist();
        wishlistData.value = response;
        return response;
      },
      async () => {
        const response = await getProductComments(productId);
        commentsData.value = response;
        return response;
      }
    ],
    'در حال بارگذاری محصول...',
    getBase
  );
} catch (error) {
  console.error('خطا در بارگذاری محصول:', error);
}

console.log('📦 Fetched product data:', productData.value);

const refreshWishlist = async () => {
  try {
    const response = await getWishlist();
    wishlistData.value = response;
  } catch (error) {
    console.error('خطا در رفرش wishlist:', error);
  }
};

const selectedVariantId = ref(null)
const selectedQuantity = ref(1)
const showWeightError = ref(false)
const showCartSidebar = ref(false)
const cartItems = ref([])
const isInCart = ref(false)

// بررسی اینکه آیا محصول در wishlist است
const isInWishlist = computed(() => {
  console.log('🔍 Computing isInWishlist...')

  // همیشه از wishlist data چک کن (dynamic)
  const wishlistItems = wishlistData.value?.data || wishlistData.value?.items

  if (!wishlistItems || !Array.isArray(wishlistItems)) {
    // اگر wishlist data هنوز لود نشده، از product data استفاده کن
    if (productData.value?.data?.wishlist !== undefined) {
      console.log('✅ Using wishlist status from product API:', productData.value.data.wishlist)
      return productData.value.data.wishlist
    }
    console.log('⚠️ No wishlist data available, returning false')
    return false
  }

  const inList = wishlistItems.some(item => item.product_id === parseInt(productId))
  console.log('✅ Using wishlist status from wishlist items:', inList, '(', wishlistItems.length, 'items )')
  return inList
})

const product = computed(() => {
  if (!productData.value?.data) return null;

  const { product, attributes, variants, nested_map } = productData.value.data;

  console.log('📄 Raw product data:', product)
  console.log('📝 Product description from API:', product.description)
  console.log('🔍 Attributes:', attributes)

  // استخراج تصاویر محصول
  const mainImage = product.main_image;
  
  const images = [mainImage];
  const thumbnails = [mainImage];

  // استخراج مقادیر attributes
  const weights = attributes?.[0]?.values?.map(v => v.value) || [];

  console.log('⚖️ Extracted weights:', weights)

  return {
    id: product.id,
    title: product.title,
    description: product.description || 'بدون توضیحات',
    price: product.final_price,
    oldPrice: product.price !== product.final_price ? product.price : null,
    inStock: true,
    images,
    thumbnails,
    attributes,
    variants,
    nested_map,
    weights
  };
});

// قیمت بر اساس variant انتخابی
const currentPrice = computed(() => {
  if (!selectedVariantId.value || !product.value?.variants) {
    return product.value?.price || 0
  }

  const selectedVariant = product.value.variants.find(v => v.id === selectedVariantId.value)
  console.log('💰 Selected variant price:', selectedVariant?.price)
  return selectedVariant?.price || product.value?.price || 0
})

const handleVariantChange = (variantId) => {
  console.log('📦 Variant changed in parent:', variantId)
  selectedVariantId.value = variantId
  showWeightError.value = false

  // بررسی اینکه آیا این variant در سبد خرید هست
  if (cartItems.value.length > 0) {
    isInCart.value = cartItems.value.some(item => item.variant_id === variantId)
  }
}

const handleQuantityChange = (quantity) => {
  console.log('🔢 Quantity changed in parent:', quantity)
  selectedQuantity.value = quantity
}

const handleWishlistUpdated = async () => {
  console.log('🔄 Refreshing wishlist data...')
  console.log('📊 BEFORE refresh - wishlistData.value:', wishlistData.value)

  await refreshWishlist()

  console.log('📊 AFTER refresh - wishlistData.value:', wishlistData.value)
  console.log('✅ Wishlist refreshed, isInWishlist computed will auto-update')
}

const handleShowWeightError = () => {
  console.log('⚠️ handleShowWeightError called!')
  console.log('⚠️ Setting showWeightError to true')
  showWeightError.value = true
  console.log('⚠️ showWeightError is now:', showWeightError.value)
}

const loadCartData = async () => {
  if (!process.client) return

  const token = localStorage.getItem('auth-token')

  if (token) {
    // اگر لاگین است، از API بخوان
    try {
      const { getCart } = useApi()
      const response = await getCart()
      cartItems.value = response.items || []
      console.log('✅ Cart loaded from API:', cartItems.value)
    } catch (err) {
      console.error('❌ Error loading cart from API:', err)
      cartItems.value = []
    }
  } else {
    // اگر لاگین نیست، از localStorage بخوان
    const guestCart = localStorage.getItem('guest-cart')
    if (guestCart) {
      try {
        const cartData = JSON.parse(guestCart)
        cartItems.value = cartData.items || []
        console.log('✅ Cart loaded from localStorage:', cartItems.value)
      } catch (err) {
        console.error('❌ Error loading cart from localStorage:', err)
        cartItems.value = []
      }
    } else {
      cartItems.value = []
    }
  }

  // بررسی اینکه آیا variant فعلی در سبد خرید هست
  if (selectedVariantId.value) {
    isInCart.value = cartItems.value.some(item => item.variant_id === selectedVariantId.value)
  }
}

const handleCartUpdated = async () => {
  console.log('🛒 Cart updated, showing sidebar')
  await loadCartData()
  showCartSidebar.value = true
}

// بارگذاری cart در هنگام mount
onMounted(async () => {
  console.log('🔄 Loading cart on mount...')
  await loadCartData()
})

// Watch برای نمایش وضعیت wishlist
watch(isInWishlist, (newValue) => {
  console.log('❤️ Wishlist status changed:', newValue ? 'IN WISHLIST ❤️' : 'NOT IN WISHLIST 💔')
}, { immediate: true })
</script>

<template>
  <main class="container">
    <sharedBreadCrumb :items="[
      { label: 'محصولات', href: '/products' },
      { label: product?.title || 'محصول', href: `/product/${productId}` }
    ]" />
    <div v-if="product" class="">
      <section
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
      >
        <ProductImage
          :images="product.images"
          :thumbnails="product.thumbnails"
        />
        <div class="flex flex-col justify-between h-full">
          <div id="info" class="space-y-6 lg:space-y-8">
            <ProductTitle
              :title="product.title"
              :price="currentPrice"
              :oldPrice="product.oldPrice"
            />

            <ProductVariant
              :weight="product.weights"
              :attributes="product.attributes"
              :variants="product.variants"
              :nested-map="product.nested_map"
              :show-error="showWeightError"
              @update:selectedVariant="handleVariantChange"
              @update:quantity="handleQuantityChange"
            />
          </div>
          <ProductBuy
            :price="currentPrice"
            :old-price="product.oldPrice"
            :in-stock="product.inStock"
            :variant-id="selectedVariantId"
            :quantity="selectedQuantity"
            :product-id="product.id"
            :product-title="product.title"
            :product-image="product.images[0]"
            :is-in-wishlist="isInWishlist"
            :is-in-cart="isInCart"
            @wishlist-updated="handleWishlistUpdated"
            @show-weight-error="handleShowWeightError"
            @cart-updated="handleCartUpdated"
          />
        </div>
      </section>
      <!-- تب‌های توضیحات، نظرات و ... -->
      <ProductTabs class="mt-16 lg:mt-24" :description="product.description" :comments="commentsData" />

      <!-- محصولات مرتبط -->
      <ProductRelatedProducts class="mt-16 lg:mt-24" />
    </div>
    <div v-else class="text-center py-16">
      <SharedLoadingSpinner size="xl" />
    </div>

    <!-- Cart Sidebar -->
    <CartSidebar
      :show="showCartSidebar"
      :cart-items="cartItems"
      @close="showCartSidebar = false"
      @cart-updated="loadCartData"
    />
  </main>
</template>