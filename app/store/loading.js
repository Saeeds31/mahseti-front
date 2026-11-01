import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isGlobalLoading: false,
    loadingMessage: ''
  }),

  actions: {
    showLoading(message = 'در حال بارگذاری...') {
      this.isGlobalLoading = true
      this.loadingMessage = message
    },

    hideLoading() {
      this.isGlobalLoading = false
      this.loadingMessage = ''
    }
  }
})
