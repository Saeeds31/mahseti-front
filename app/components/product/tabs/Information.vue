<template>
  <div class="mt-10 ">
    <!-- <h3 class="text-2xl">آناناس طبیعی</h3> -->
    <div class="leading-9 mt-6 whitespace-pre-line" v-html="props.description"></div>
  </div>
</template>

<script setup>
   const props = defineProps({
     description: {
       type: String,
       default: '',
     },

   })

</script>