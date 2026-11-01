<template>
  <nuxt-link @click="saveLocation()" :to="`/product/${product.id}`"
    class="w-full h-[390px] max-md:h-[320px] max-sm:h-[300px] rounded-2xl bg-white border-2 border-gray-200  flex flex-col justify-between  relative mt-0 overflow-hidden">
    <button @click="toggleFavorite"
      class="absolute top-3 left-3 gap-1 text-[var(--red)] transition-transform active:scale-90 z-10">
      <img src="/icons/heart.svg" alt="" v-if="isFavoriteComputed" />
      <img src="/icons/heart-red.svg" alt="" v-else />
    </button>
    <img v-if="imageSrc" :src="imageSrc" :alt="product.title ?? 'محصول'"
      class="w-full h-58 max-xl:h-44 max-md:h-34 object-contain rounded-lg scale-[1.5]" />
    <h2 class="md:min-h-[82px] text-base font-bold text-gray-900 leading-[1.6] line-clamp-2 text-right bg-white   relative p-4 pb-2">
      {{ product?.title ?? "محصول" }}
    </h2>
    <div class="flex items-center justify-between pt-2 mt-0 p-4 relative z-10 bg-white">
      <div v-if="product.status != 'unpublished'">
        <div class="text-lg max-md:text-sm font-bold text-gray-900">
          {{ Number(product?.final_price).toLocaleString("fa") ?? "۰" }}
          <span class="text-[13px] mr-1 text-gray-500">تومان</span>
        </div>

        <div v-if="product?.price != product?.final_price"
          class="text-sm line-through decoration-[var(--red)] text-gray-500">
          {{ Number(product?.price).toLocaleString("fa") ?? "۰" }} تومان
        </div>
      </div>
      <div v-else>
        <div class="text-red-700">ناموجود</div>
      </div>

      <div class="flex items-center gap-2">

        <button class="p-1 flex cursor-pointer justify-center rounded-md border border-lime-400 bg-lime-600"
          @click="goToProduct">
          <img src="/icons/bag.svg" alt="" />
        </button>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useWishlist } from "@/composables/useWishlist";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";


const { $getImageUrl } = useNuxtApp();
const router = useRouter();

const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlist();

const props = defineProps({
  product: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  saveLoc: { type: Boolean, default: false },
  activeTab: { type: String, default: "1" },

});
function saveLocation() {
  if (props.saveLoc) {

    localStorage.setItem("activeTab", props.activeTab);
    localStorage.setItem("lastPosition", window.scrollY);
  }
}
const emit = defineEmits(["favorite-removed"]);

onMounted(() => {
  fetchWishlist();
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

const imageSrc = computed(() => {
  const img = props.product?.main_image;
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return $getImageUrl(img);
});



</script>
