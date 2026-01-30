import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
  state: () => ({
    home: null,
  }),
  actions: {
    setHome(data) {
      this.home = data
    }
  }
})
