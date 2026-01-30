<template>
  <div>
    <SharedLoadingOverlay
      :show="loadingStore.isGlobalLoading"
      :message="loadingStore.loadingMessage"
    />

    <sharedHeader />
    <div class="container mx-auto my-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside class="lg:col-span-1">
        <panelUserSidebar />
      </aside>
      <main class="lg:col-span-3 space-y-6">
        <slot />
      </main>
    </div>
    <sharedFooter />
    <AuthLoginModal />
  </div>
</template>

<script setup>
import { useLoadingStore } from '~/store/loading'

const loadingStore = useLoadingStore()
</script>