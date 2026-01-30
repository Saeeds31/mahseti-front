<template>
    <nuxt-link class="flex items-center gap-[16px] p-[8px]" :to="`/product/${product.id}`">
        <img class="w-[50px]" v-if="product.main_image" :src="$getImageUrl(product.main_image)" :alt="product.title">
        <img class="w-[50px]" v-else src="/images/no-image.png" :alt="product.title">
        <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-[8px]">
                <h3>
                    {{ product.title }}
                </h3>
                <h4 class="flex items-center gap-[4px]">
                    <span>{{ Number(product.price).toLocaleString() }}</span>
                    <SvgToman />
                </h4>
            </div>
            <nuxt-link class="bg-[var(--color-base)] text-[white] px-[8px] py-[4px] text-[14px] rounded-tl-[0] rounded-br-[0] rounded-tr-[6px] rounded-bl-[6px]" :to="`/product/${product.id}`">
                مشاهده
            </nuxt-link>
        </div>
    </nuxt-link>

</template>
<script setup>
const { $getImageUrl } = useNuxtApp()

defineProps({
    product: {
        type: Object
    }
})
</script>
<style>
h4 svg path {
    fill: var(--second-color);
}
</style>