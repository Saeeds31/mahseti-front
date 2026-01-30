<template>
  <div>
    <SharedLoadingOverlay
      :show="loadingStore.isGlobalLoading"
      :message="loadingStore.loadingMessage"
    />

    <sharedHeader />
    <main>
      <slot />
    </main>
    <sharedFooter />
  </div>
</template>

<script setup>
import { useLoadingStore } from '~/store/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
</script>
