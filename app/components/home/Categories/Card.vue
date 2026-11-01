<template>
  <NuxtLink :to="item.id == 0 ? '/products' : `/products?category_ids=${item.id}`" :class="[
    'min-w-[25vw] relative overflow-hidden rounded-2xl text-white transition-transform hover:scale-[1.02]',
    ' flex flex-row justify-between items-center ',
    imageSrc ? '' : item.gradient + ' p-6'
  ]">

    <img v-if="imageSrc" :src="imageSrc" :class="[
      'object-contain z-0',
    ]" :alt="item.title" />
    <div v-else :class="[
      'z-10',
      item.big
        ? 'flex flex-col gap-3 items-start text-right w-full'
        : 'flex flex-col gap-1 items-start', item.id == 0 ? '!items-center' : ''
    ]">
      <h3 :class="item.big ? 'text-2xl font-bold' : 'text-lg font-bold'">
        {{ item.title }}
      </h3>

      <p :class="[item.big
        ? 'text-base opacity-90 leading-relaxed'
        : 'text-sm opacity-90 leading-relaxed',
      item.id == 0 ? 'text-center' : ''
      ]">
        {{ item.description }}
      </p>

      <button :class="[
        'border border-white/70 cursor-pointer rounded-xl text-sm bg-white text-blue-800 hover:bg-blue-900 hover:text-white transition',
        item.big ? 'mt-4 px-6 py-2.5' : 'mt-2 px-4 py-1.5',
      ]">
        {{ item.buttonText }}
      </button>
    </div>

  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

console.error(props.item)

const { $getImageUrl } = useNuxtApp();

const imageSrc = computed(() => {
  const img = props.item?.image;
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return $getImageUrl(img);
});
</script>
