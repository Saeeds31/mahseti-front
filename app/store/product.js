import { defineStore } from "pinia";
export const useProductStore = defineStore("product", {
  state: () => ({
    product: {},
  }),
  actions: {
    setProducts(data) {
      this.product[data.id] = data;
    },
  },
});
