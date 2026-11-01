<!-- app/components/product/buy.vue -->
<template>
  <div class="space-y-6 mt-4">
    <div class="flex gap-4">
      <button v-if="props.inStock" @click="handleAddToCart" :disabled="isAddingToCart"
        class="btn px-10 h-12 w-[90%] flex items-center justify-center gap-2 text-sm sm:text-base transition" :class="{
          'opacity-60 cursor-wait': isAddingToCart,
          'bg-green-600 hover:bg-green-700 text-white':
            !isAddingToCart,
        }">
        <ShoppingCart v-if="!isAddingToCart" :size="22" />
        <Loader v-else :size="22" class="animate-spin" />
        <span>
          {{
            isAddingToCart
              ? "در حال افزودن..."
              : "افزودن به سبد خرید"
          }}
        </span>
      </button>


      <template v-else>
        <!-- دکمه ناموجود (کوچک‌تر) -->
        <button disabled
          class="btn px-4 h-12 w-[20%] flex items-center justify-center gap-2 text-sm sm:text-base transition !bg-red-400 hover:!bg-red-700 !text-white cursor-not-allowed">
          <span>ناموجود</span>
        </button>
        <!-- دکمه اطلاع‌رسانی -->
        <StockAlertButton :product-id="props.productId" :is-in-stock="props.inStock"
          @request-updated="handleStockAlertUpdated" />
      </template>

      <button @click="toggleWishlist" :class="[
        'w-[48px]  cursor-pointer rounded-lg flex justify-center items-center transition-transform active:scale-90',
        isInWishlist ? 'bg-secondary' : 'bg-secondary-fade',
      ]">
        <IconFavLineWhite />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ShoppingCart as IconShoppingCart } from "lucide-vue-next";
import { useApi } from "@/composables/api/useApi";
import { ShoppingCart, Loader, Check } from "lucide-vue-next";
import { toast } from "vue3-toastify";
import StockAlertButton from "@/components/product/StockAlertButton.vue";
import { useCartStore } from "~/store/cart";
const cartStore = useCartStore();

const props = defineProps({
  price: Number,
  oldPrice: Number,
  inStock: Boolean,
  variantId: Number,
  variants: Array,
  quantity: {
    type: Number,
    default: 1,
  },
  productId: Number,
  productTitle: String,
  productImage: String,

  weight: {
    type: String,
    default: "",
  },
  isInWishlist: {
    type: Boolean,
    default: false,
  },

});

const emit = defineEmits([
  "wishlist-updated",
  "show-weight-error",
  "cart-updated",
]);

const { addToCart, addToWishlist, removeFromWishlist } = useApi();
const isAddingToCart = ref(false);

const handleAddToCart = async () => {
  if (!props.variantId) {
    toast.error("لطفا یکی از ویژگی ها را انتخاب کنید");
    emit("show-weight-error");
    return;
  }

  isAddingToCart.value = true;
  let selectedVariant = props.variants.find(vari => vari.id == props.variantId)
  if (!selectedVariant) return;
  selectedVariant.attributes = [];
  selectedVariant.values.forEach(vals => {
    selectedVariant.attributes.push({ name: vals.attribute, value: vals.value });
  });
  try {
    const productData = {
      id: props.productId,
      product_id: props.productId,
      name: props.productTitle,
      title: props.productTitle,
      variant: selectedVariant,
      price_original: selectedVariant.price,
      price_final: selectedVariant.final_price,
      line_original_total: selectedVariant.price * props.quantity,
      line_final_total: selectedVariant.final_price * props.quantity,
      line_discount: (selectedVariant.price - selectedVariant.final_price) * props.quantity,
      image: props.productImage,
      weight: props.weight,
    };

    const result = await addToCart(
      props.variantId,
      props.quantity,
      productData,
    );
    emit("cart-updated");
  } catch (error) {
    console.log(error);
    cartStore.addToCartMessage = error.response.data.message || "خطا در افزودن به سبد خرید";
    setTimeout(() => {
      cartStore.addToCartMessage = ""
    }, 5000);
    toast.error(error.response.data.message || "خطا در افزودن به سبد خرید");

  } finally {
    isAddingToCart.value = false;
  }
};

const toggleWishlist = async () => {

  if (!props.productId) {
    console.warn("⚠️ No product ID!");
    return;
  }

  try {
    if (props.isInWishlist) {
      await removeFromWishlist(props.productId);
    } else {
      await addToWishlist(props.productId);
    }
    emit("wishlist-updated");
  } catch (error) {
    console.error("❌ Wishlist toggle error:", error);
    toast.error("خطا در تغییر وضعیت علاقه‌مندی");
  }
};

</script>
