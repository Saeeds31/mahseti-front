<template>
   <div>
      <productTabsForm />
      <productTabsCardcomment :comments="comments" />
   </div>
</template>

<script setup>
const props = defineProps({
  comments: {
    type: Object,
    default: null,
  },
})
</script>