<!-- app/components/product/buy.vue -->
<template>
  <div class="space-y-6">
    <!-- دکمه‌ها -->
    <div class="flex gap-4">
      <button
        @click="handleAddToCart"
        :disabled="isAddingToCart"
        class="btn px-10 h-12 w-[90%] flex items-center justify-center gap-2 text-sm sm:text-base transition"
        :class="{
          'opacity-60 cursor-wait': isAddingToCart,
          'bg-green-600 hover:bg-green-700 text-white':
            isInCart && !isAddingToCart,
        }"
      >
        <!-- حالت عادی -->
        <ShoppingCart v-if="!isAddingToCart && !isInCart" :size="22" />

        <!-- لودینگ -->
        <Loader v-else-if="isAddingToCart" :size="22" class="animate-spin" />

        <!-- داخل سبد -->
        <Check v-else :size="22" />

        <span>
          {{
            isAddingToCart
              ? "در حال افزودن..."
              : isInCart
              ? "در سبد خرید"
              : "افزودن به سبد خرید"
          }}
        </span>
      </button>

     <button
  @click="toggleWishlist"
  :class="[
    'w-[10%] cursor-pointer rounded-lg flex justify-center items-center transition-transform active:scale-90',
    isInWishlist ? 'bg-secondary' : 'bg-secondary-fade'
  ]"
>
  <IconFavLineWhite  />
</button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ShoppingCart as IconShoppingCart } from "lucide-vue-next";
import { useApi } from "@/composables/api/useApi";
import { ShoppingCart, Loader, Check } from "lucide-vue-next";

const props = defineProps({
  price: Number,
  oldPrice: Number,
  inStock: Boolean,
  weight: String,
  variantId: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  productId: Number,
  productTitle: String,
  productImage: String,
  isInWishlist: {
    type: Boolean,
    default: false,
  },
  isInCart: {
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
  console.log(
    "🛒 Button clicked! Variant ID:",
    props.variantId,
    "Quantity:",
    props.quantity
  );

  if (!props.variantId) {
    console.warn("⚠️ No variant selected!");
    console.log("🚨 Emitting show-weight-error event");
    emit("show-weight-error");
    return;
  }

  isAddingToCart.value = true;

  try {
    // ارسال اطلاعات کامل محصول
    const productData = {
      id: props.productId,
      name: props.productTitle,
      title: props.productTitle,
      price: props.price,
      image: props.productImage,
      weight: props.weight,
    };

    const result = await addToCart(
      props.variantId,
      props.quantity,
      productData
    );
    console.log("🎉 Successfully added to cart:", result);

    // Emit event to show cart sidebar
    emit("cart-updated");
  } catch (error) {
    console.error("💥 Error adding to cart:", error);
    const toast = useToast()
    toast.add({
      title: 'خطا',
      description: 'خطا در افزودن به سبد خرید',
      color: 'red'
    })
  } finally {
    isAddingToCart.value = false;
  }
};

const toggleWishlist = async () => {
  console.log("❤️ Toggling wishlist for product:", props.productId);

  if (!props.productId) {
    console.warn("⚠️ No product ID!");
    return;
  }

  try {
    if (props.isInWishlist) {
      await removeFromWishlist(props.productId);
      console.log("💔 Removed from wishlist");
    } else {
      await addToWishlist(props.productId);
      console.log("❤️ Added to wishlist");
    }
    emit("wishlist-updated");
  } catch (error) {
    console.error("❌ Wishlist toggle error:", error);
    const toast = useToast()
    toast.add({
      title: 'خطا',
      description: 'خطا در تغییر وضعیت علاقه‌مندی',
      color: 'red'
    })
  }
};
</script>
