<template>
  <!-- Title -->
  <div class="text-center  mb-10">
    <h2 class="text-lg lg:text-3xl font-bold ">
      {{ titleBlack }}
      <span class="text-strong">{{ titleStrong }}</span>
    </h2>
    <p class="text-xs  lg:text-base mt-2 text-muted">
      {{ description }}
    </p>
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