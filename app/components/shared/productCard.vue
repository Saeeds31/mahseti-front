<!-- components/shared/productCard.vue -->
<template>
  <div
    class="w-full h-[460px] rounded-2xl bg-white border-2 border-gray-200 p-4 flex flex-col gap-4 relative mt-10"
  >
    <!-- درصد تخفیف -->
    <!-- <div
      v-if="product?.real_discount && product.real_discount !== '0'"
      class="absolute top-0 left-0 bg-[var(--red)] text-primery font-light rounded-br-[16px] rounded-tl-[16px] h-[70px] w-[26px] sm:h-[85px] sm:w-[30px] flex items-center justify-center"
    >
      <span class="transform -rotate-90 text-sm sm:text-base md:text-lg">
        {{ product.real_discount }}%
      </span>
    </div> -->

    <!-- Heart Toggle -->
    <button
      @click.stop="toggleFavorite"
      class="absolute top-3 left-3 gap-1 text-[var(--red)] transition-transform active:scale-90"
    >
      <img src="/icons/heart.svg" alt="" v-if="isFavoriteComputed" />
      <img src="/icons/heart-red.svg" alt="" v-else />
    </button>

    <!-- Colors + More -->
    <div
      ref="colorsBoxRef"
      class="absolute top-3 right-3 flex flex-col items-end gap-1"
    >
      <span
        v-for="(color, i) in visibleColors"
        :key="i"
        class="w-3 h-3 rounded-full border border-gray-300"
        :style="{ background: color }"
      />

      <button
        v-if="extraCount > 0"
        @click.stop="showMoreColors = !showMoreColors"
        class="w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold"
      >
        +{{ extraCount }}
      </button>

      <div
        v-if="showMoreColors"
        class="absolute top-7 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md p-2 flex flex-wrap gap-2 w-[110px] z-50"
      >
        <span
          v-for="(color, i) in allColors"
          :key="'all-' + i"
          class="w-5 h-5 rounded-full border border-gray-300"
          :style="{ background: color }"
        />
      </div>
    </div>

    <!-- Product Image -->
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="product.title ?? 'محصول'"
      class="w-full h-56 max-md:h-44 object-contain rounded-lg"
    />

    <p class="text-gray-500 text-xs">
      {{ product?.name ?? product?.title ?? "محصول" }}
    </p>

    <h3
      class="text-base font-bold text-gray-900 leading-[1.6] line-clamp-2 text-right"
    >
      {{ product?.title ?? "محصول" }}
    </h3>

    <div class="flex justify-between items-center">
      <p class="text-gray-500 text-sm">
        <span class="text-gray-900 font-medium text-base"> سایز : </span>
        {{ sizesText }}
      </p>

      <!-- <p class="text-gray-700 font-semibold text-sm">
        کد {{ product?.code || product?.sku || product?.barcode || "-" }}
      </p> -->
    </div>

    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="text-lg font-bold text-gray-900">
          {{ product?.final_price?.toLocaleString() ?? "۰" }}
          <span class="text-[13px] mr-1 text-gray-500">تومان</span>
        </div>

        <div
          v-if="product?.price !== product?.final_price"
          class="text-sm line-through decoration-[var(--red)] text-gray-500"
        >
          {{ product?.price?.toLocaleString() ?? "۰" }} تومان
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- <button
          class="p-2 flex justify-center rounded-md border border-gray-300"
          @click="goToProduct"
        >
          <img src="/icons/package-search.svg" alt="" />
        </button> -->

        <button
          class="p-1 flex justify-center rounded-md border border-lime-400 bg-lime-600"
          @click="goToProduct"
          :disabled="isAddingToCart"
        >
          <img src="/icons/bag.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useWishlist } from "@/composables/useWishlist";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/api/useApi";
import { useAuth } from "@/composables/useAuth";

const { loginModal } = useAuth();
const { $toast } = useNuxtApp();

const { $getImageUrl } = useNuxtApp();
const router = useRouter();

const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlist();
const { addToCart, getProduct } = useApi();

const props = defineProps({
  product: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
});

const emit = defineEmits(["favorite-removed"]);

onMounted(() => {
  fetchWishlist();
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

const isFavoriteComputed = computed(() => {
  if (props.isFavorite) return true;
  return isInWishlist(props.product.id);
});

const toggleFavorite = async () => {
  const token = process.client ? localStorage.getItem("auth-token") : null;
  if (!token) return;

  const wasAdded = await toggleWishlist(props.product.id);
  if (!wasAdded) emit("favorite-removed", props.product.id);
};

const goToProduct = () => {
  router.push(`/product/${props.product.id}`);
};

// Colors
const MAX_COLORS = 3;
const showMoreColors = ref(false);
const colorsBoxRef = ref(null);

const allColors = computed(() => props.product?.colors ?? []);
const visibleColors = computed(() => allColors.value.slice(0, MAX_COLORS));
const extraCount = computed(() => allColors.value.length - MAX_COLORS);

const onClickOutside = (e) => {
  if (colorsBoxRef.value && !colorsBoxRef.value.contains(e.target)) {
    showMoreColors.value = false;
  }
};

// Sizes text
const sizesText = computed(() => {
  // 1) اگر از API sizes دارید
  if (props.product?.sizes?.length) {
    return props.product.sizes.join(" - ");
  }

  // 2) استخراج از meta_description
  const md = props.product?.meta_description || "";
  if (!md) return "M ، L، XL";

  // خطی که شامل "سایز" باشد
  const sizeLine = md
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.includes("سایز"));

  if (!sizeLine) return "M ، L، XL";

  // اگر "فری سایز (38 تا 42)" بود
  if (sizeLine.includes("فری سایز")) {
    const paren = sizeLine.match(/\(([^)]+)\)/);
    return paren ? paren[1].trim() : "فری سایز";
  }

  // حالت "سایز : 80 تا 95" یا "سایز 75-80-85"
  const afterColon = sizeLine.split(":")[1];
  if (afterColon) return afterColon.trim();

  // اگر دو نقطه نداشت، بعد از کلمه "سایز" برگردان
  return sizeLine.replace(/سایز/gi, "").replace(/[：:]/g, "").trim();
});

// Product Image URL
const imageSrc = computed(() => {
  const img = props.product?.main_image;
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return $getImageUrl(img);
});

// Add To Cart
const isAddingToCart = ref(false);

const pickVariantId = (variants = []) => {
  if (!variants.length) return null;
  const inStock = variants.find(
    (v) => v.stock > 0 || v.in_stock === 1 || v.quantity > 0,
  );
  return (inStock || variants[0])?.id || null;
};

const handleAddToCart = async () => {
  try {
    const token = process.client ? localStorage.getItem("auth-token") : null;
    if (!token) {
      loginModal.value = true;
      return;
    }

    isAddingToCart.value = true;

    let variants = props.product?.variants || [];
    let variantId = pickVariantId(variants);

    if (!variantId) {
      const detail = await getProduct(props.product.id);
      variants = detail?.data?.variants || detail?.variants || [];
      variantId = pickVariantId(variants);
    }

    if (!variantId) {
      $toast.error("واریانت قابل افزودن یافت نشد");
      return;
    }

    await addToCart(variantId, 1, {
      id: props.product.id,
      name: props.product.title || props.product.name,
      title: props.product.title,
      price: props.product.final_price || props.product.price,
      image: props.product.main_image,
    });

    $toast.success("به سبد خرید اضافه شد");
  } catch (err) {
    console.error("Add to cart error:", err);
    $toast.error("خطا در افزودن به سبد خرید");
  } finally {
    isAddingToCart.value = false;
  }
};
</script>
