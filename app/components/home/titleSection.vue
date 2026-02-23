<template>
  <!-- Title -->
  <div class="text-center">
    <h2 class="text-lg lg:text-3xl font-bold">
      {{ titleBlack }}
      <span class="text-strong">{{ titleStrong }}</span>
    </h2>
    <p class="text-gray-500 py-2">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: "HomeTitleSection",
  props: {
    titleBlack: {
      type: String,
      required: true,
    },
    titleStrong: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>
