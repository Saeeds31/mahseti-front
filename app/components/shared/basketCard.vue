<template>
    <li class="flex items-center p-[16px] border-b-[#72b7428f] justify-between">
        <img class="w-[64px]" :src="item.main_image" :alt="item.title">
        <div class="content flex flex-col gap-[12px] flex-grow  pr-[8px]">
            <h4>{{ item.title }}</h4>
            <div class="flex gap-[16px]">
                <b class="flex items-center gap-2">
                    <strong>{{ Number(item.price).toLocaleString() }}</strong>
                    <SvgToman />
                </b>
                <del class="flex items-center gap-2 text-[12px] opacity-50">
                    <strong>{{ Number(item.old_price).toLocaleString() }}</strong>
                    <SvgToman />
                </del>
            </div>
        </div>
        <div class="grid grid-cols-[24px_24px_24px] gap-[8px]">
            <button @click="increaseItem">
                <svg-plus />
            </button>
            <input type="tell" class="border-[1px] border-[solid] border-[#1213] text-center rounded-[4px]"
                v-model="item.quantity">
            <button @click="decreaseItem">
                <svg-negative v-if="item.quantity > 1" />
                <svg-trash v-else />
            </button>
        </div>
    </li>
</template>
<script setup>
defineProps({
    item: {
        type: Object
    }
})
function increaseItem() { }
function decreaseItem() { }
</script>
<style scoped>
li {
    border-bottom: 2px dashed #72b7428f;
}

input {
    border: 1px solid #1213;
}

li .content  {
    border-right: 1px solid #1213;
}
</style>