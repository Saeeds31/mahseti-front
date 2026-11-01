<script setup>
import { useApi } from "@/composables/api/useApi";
import { useRoute } from "vue-router";
import { useProductStore } from "~/store/product.js"
const route = useRoute();
const { getProduct, getWishlist } = useApi();
const productId = computed(() => route.params.id);
const productStore = useProductStore();
const wishlistData = ref(null);
const commentsData = ref(null);

const { data: productData, error: productError, refresh } = useAsyncData(
  () => `product-detail-${productId.value}`,
  async () => {
    const id = productId.value;
    if (!id) return null;
    if (productStore.product[id]) return productStore.product[id];
    const res = await getProduct(id);
    productStore.product[id] = res.data;
    return res;
  },
  {
    watch: [() => productId.value],
    immediate: true,
    dedupe: 'defer',
  }
);

const productPayload = computed(() => productStore.product[productId.value] ?? {});
const productCore = computed(() => productPayload.value.product ?? {});
const specifications = computed(() => productPayload.value.specifications ?? []);
const attributeOrder = computed(
  () => productPayload.value.attributes_order ?? [],
);
const attributes = computed(() => productPayload.value.attributes ?? []);
const attributeMap = computed(() => {
  return attributes.value.reduce((acc, attr) => {
    acc[attr.id] = attr;
    return acc;
  }, {});
});

const primaryAttribute = computed(
  () =>
    attributeMap.value[attributeOrder.value?.[0]] ??
    attributes.value?.[0] ??
    null,
);
const secondaryAttribute = computed(
  () =>
    attributeMap.value[attributeOrder.value?.[1]] ??
    attributes.value?.[1] ??
    null,
);

// 🔹 اصلاح شد: id 1 = رنگ، id 2 = سایز
const attributeLabels = {
  1: "رنگ",
  2: "سایز",
};

const variantAttributes = computed(() => ({
  primary: primaryAttribute.value,
  secondary: secondaryAttribute.value,
  primaryLabel:
    attributeLabels[primaryAttribute.value?.id] ??
    (primaryAttribute.value ? "گزینه ۱" : null),
  secondaryLabel:
    attributeLabels[secondaryAttribute.value?.id] ??
    (secondaryAttribute.value ? "گزینه ۲" : null),
}));

const nestedMap = computed(() => productPayload.value.nested_map ?? {});
const variants = computed(() => productPayload.value.variants ?? []);

const refreshWishlist = async () => {
  try {
    const response = await getWishlist();
    wishlistData.value = response;
  } catch (error) {
    console.error("خطا در رفرش wishlist:", error);
  }
};

const selectedVariantId = ref(null);
const selectedQuantity = ref(1);
const selectedPrimaryId = ref(null);
const selectedSecondaryId = ref(null);

const showWeightError = ref(false);
const cartItems = ref([]);

const isInWishlist = computed(() => {
  const wishlistItems = wishlistData.value?.data || wishlistData.value?.items;

  if (!wishlistItems || !Array.isArray(wishlistItems)) {
    if (productData.value?.data?.wishlist !== undefined) {
      return productData.value.data.wishlist;
    }
    return false;
  }

  return wishlistItems.some((item) => item.product_id === parseInt(productId));
});

// 🔹 تشخیص اینکه هیچ تنوعی موجود نیست
const isCompletelyOutOfStock = computed(() => {
  const list = variants.value;
  if (!list?.length) return true;
  return !list.some(
    (variant) => variant.is_available === true && variant.stock > 0,
  );
});

const product = computed(() => {
  const core = productCore.value;
  if (!core?.id) return null;

  const mainImage = core.main_image ?? null;
  if (variants.value && variants.value.length == 1) {
    selectedVariantId.value = variants.value[0].id;
  }
  let images = [core.main_image];
  if (core?.images?.length) {
    images.push(...core.images.map((image) => image.path));
  }

  const thumbnails = [mainImage].filter(Boolean);

  return {
    id: core.id,
    title: core.title,
    video: core.video,
    description: core.description,
    price: core.price,
    final_price: core.final_price,
    // 🔹 اصلاح: بر اساس موجودی واقعی تنوع‌ها
    inStock: !isCompletelyOutOfStock.value,
    images,
    thumbnails,
    attributes: attributes.value,
    variants: variants.value,
    nested_map: nestedMap.value,
  };
});

const currentPrice = computed(() => {
  if (!selectedVariantId.value || !product.value?.variants) {
    return product.value?.final_price || 0;
  }

  const selectedVariant = product.value.variants.find(
    (v) => v.id === selectedVariantId.value,
  );
  return selectedVariant?.final_price || product.value?.final_price || 0;
});

const oldPrice = computed(() => {
  if (!selectedVariantId.value || !product.value?.variants) {
    return product.value?.price || 0;
  }

  const selectedVariant = product.value.variants.find(
    (v) => v.id === selectedVariantId.value,
  );
  return selectedVariant?.price || product.value?.price || 0;
});

const handleQuantityChange = (quantity) => {
  selectedQuantity.value = quantity;
};

const handleWishlistUpdated = async () => {
  await refreshWishlist();
};

const handleShowWeightError = () => {
  showWeightError.value = true;
};

const loadCartData = async () => {
  if (!process.client) return;

  const token = localStorage.getItem("auth-token");

  if (token) {
    try {
      const { getCart } = useApi();
      const response = await getCart();
      cartItems.value = response.items || [];
    } catch (err) {
      console.error("❌ Error loading cart from API:", err);
      cartItems.value = [];
    }
  } else {
    const guestCart = localStorage.getItem("guest-cart");
    if (guestCart) {
      try {
        const cartData = JSON.parse(guestCart);
        cartItems.value = cartData.items || [];
      } catch (err) {
        console.error("❌ Error loading cart from localStorage:", err);
        cartItems.value = [];
      }
    } else {
      cartItems.value = [];
    }
  }
};

const handleCartUpdated = async () => {
  // await loadCartData();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("open-cart-sidebar"));
  }
};


watch(
  isInWishlist,
  (newValue) => { },
  { immediate: true },
);
</script>

<template>
  <main class="container">
    <SharedBreadCrumb :items="[
      { label: 'محصولات', href: '/products' },
      { label: product?.title || 'محصول', href: `/product/${productId}` },
    ]" />
    <div v-if="product" class="t-0">
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <ProductImage :images="product.images" :video="product.video" :thumbnails="product.images" />

        <div class="flex flex-col justify-between h-full">
          <div id="info" class="space-y-6 lg:space-y-8">
            <ProductTitle :title="product.title" :price="currentPrice" :oldPrice="oldPrice"
              :in-stock="product.inStock" />

            <!-- 🔹 label ها دیگه برعکس نیستن -->
            <ProductVariant v-model:selectedVariant="selectedVariantId" v-model:quantity="selectedQuantity"
              v-model:selectedPrimaryId="selectedPrimaryId" v-model:selectedSecondaryId="selectedSecondaryId"
              :primary-attribute="variantAttributes.primary" :secondary-attribute="variantAttributes.secondary"
              :primary-label="variantAttributes.primaryLabel" :secondary-label="variantAttributes.secondaryLabel"
              :nested-map="nestedMap" :variants="variants" :show-error="showWeightError" />
          </div>
          <ProductBuy :price="currentPrice" :old-price="oldPrice" :in-stock="product.inStock"
            :variant-id="selectedVariantId" :variants="variants" :quantity="selectedQuantity" :product-id="product.id"
            :product-title="product.title" :product-image="product.images[0]" :is-in-wishlist="isInWishlist"
            @wishlist-updated="handleWishlistUpdated" @show-weight-error="handleShowWeightError"
            @cart-updated="handleCartUpdated" />
        </div>
      </section>
      <ProductTabs class="mt-16 lg:mt-24" :specifications="specifications" :description="product.description"
        :comments="commentsData" :productId="productId" />
      <ProductRelatedProducts class="mt-16 lg:mt-24" />
    </div>
    <div v-else class="text-center py-16">
      <SharedLoadingSpinner size="xl" />
    </div>
  </main>
</template>