<template>
  <NuxtLink
    :to="item.link"
    :class="[
      'relative overflow-hidden rounded-2xl text-white transition-transform hover:scale-[1.02]',
      item.gradient,
      item.big
        ? 'p-8 flex flex-col justify-start items-start min-h-[450px]'
        : 'p-6 flex flex-row justify-between items-center h-[220px]',
    ]"
  >
    <div
      :class="[
        'z-10',
        item.big
          ? 'flex flex-col gap-3 items-start text-right w-full'
          : 'flex flex-col gap-1 items-start',
      ]"
    >
      <h3 :class="item.big ? 'text-2xl font-bold' : 'text-lg font-bold'">
        {{ item.title }}
      </h3>

      <p
        :class="
          item.big
            ? 'text-base opacity-90 leading-relaxed'
            : 'text-sm opacity-90 leading-relaxed'
        "
      >
        {{ item.description }}
      </p>

      <button
        :class="[
          'border border-white/70 rounded-xl text-sm hover:bg-white hover:text-gray-800 transition',
          item.big ? 'mt-4 px-6 py-2.5' : 'mt-2 px-4 py-1.5',
        ]"
      >
        {{ item.buttonText }}
      </button>
    </div>

    <img
      v-if="imageSrc"
      :src="imageSrc"
      :class="[
        'object-contain z-0',
        item.big
          ? 'absolute bottom-0 right-1/2 translate-x-1/2'
          : 'absolute bottom-0 left-4 h-[140px] w-auto',
      ]"
      :alt="item.title"
    />
  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const { $getImageUrl } = useNuxtApp();

const imageSrc = computed(() => {
  const img = props.item?.image;
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return $getImageUrl(img);
});
</script>
