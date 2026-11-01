import { defineStore } from "pinia";
export const useHomeStore = defineStore("home", {
  state: () => ({
    home: null,
    isLoaded: false,
  }),
  actions: {
    setHome(data) {
      this.home = data;
      this.isLoaded = true;
    },
    clearHome() {
      this.home = null;
      this.isLoaded = false;
    },
  },
});
