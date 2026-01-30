<template>
    <article
        class="articleCard h-[450px] flex flex-col items-start justify-end bg-[#F5F5F5] p-[16px] relative rounded-[16px] [box-shadow:0px_6px_5px_#0000005e]">
        <img class="absolute -top-[48px] w-[90%] right-[5%]" :src="$getImageUrl(article.image)" :alt="article.title">
        <h4 class="h-[48px]">{{ article.title }}</h4>
        <p class="text-justify mb-[16px] h-20">{{ shortDesc(article.short_description) }}</p>
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <SvgClock />
                <span>{{ article.read_time }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
                <SvgCalendar />
                <span>{{ new Date(article.created_at).toLocaleDateString("fa") }}</span>
            </div>
            <nuxt-link
                class="bg-[var(--color-base)] text-[white] px-[16px] py-[10px] rounded-tl-[0] rounded-br-[0] rounded-tr-[8px] rounded-bl-[8px]"
                :to="`/blog/${article.slug ?? article.id}`">
                مشاهده
            </nuxt-link>
        </div>
    </article>
</template>
<script setup>
const { $getImageUrl } = useNuxtApp();
function shortDesc(desc){
    if(!desc) return "";
    if(desc.split(" ").length>20){
        let sliced=desc.split(" ").slice(0,20);
        return sliced.join(" ")+ " ..."
    }else{
        return desc;
    }
}
defineProps({
    article: Object
})
</script>
<style>
article.articleCard {
    box-shadow: 0px 6px 5px #0000005e;
}
</style>