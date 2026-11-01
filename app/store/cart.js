// store/cart.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const isLoading = ref(false);
  const addToCartMessage = ref("");

  const broadcastCartUpdate = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("cart-updated"));
  };

  const loadFromLocalStorage = () => {
    if (process.client) {
      const savedCart = localStorage.getItem("guest-cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          items.value = parsed.items || [];
        } catch (error) {
          items.value = [];
        }
      }
    }
    broadcastCartUpdate();
  };

  const saveToLocalStorage = () => {
    if (!process.client) return;

    localStorage.setItem(
      "guest-cart",
      JSON.stringify({
        items: items.value,
        timestamp: new Date().toISOString(),
      }),
    );

    const totalQuantity = items.value.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );

    localStorage.setItem(
      "cart-summary",
      JSON.stringify({
        items: items.value,
        totalQuantity,
        subtotal: subtotal.value,
        product_discount_total: product_discount_total.value,
        timestamp: new Date().toISOString(),
      }),
    );

    broadcastCartUpdate();
  };

  const addItem = (product) => {
    const existingItem = items.value.find(
      (item) => item.variant_id === product.variant_id,
    );

    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
      existingItem.line_original_total =
        existingItem.price_original * existingItem.quantity;
      existingItem.line_final_total =
        existingItem.price_final * existingItem.quantity;
      existingItem.line_discount =
        existingItem.line_original_total - existingItem.line_final_total;
      saveToLocalStorage();
    } else {
      items.value.push({
        ...product,
        size: product.size || "",
        color: product.color || "",
        quantity: product.quantity || 1,
      });
    }

    saveToLocalStorage();
  };

  const removeItem = (variantId) => {
    items.value = items.value.filter((item) => item.variant_id != variantId);
    saveToLocalStorage();
  };

  const increaseQuantity = (variantId) => {
    const item = items.value.find((item) => item.variant_id === variantId);

    if (item) {
      item.quantity++;
      item.line_original_total = item.price_original * item.quantity;
      item.line_final_total = item.price_final * item.quantity;
      item.line_discount = item.line_original_total - item.line_final_total;

      saveToLocalStorage();
    }
  };

  const decreaseQuantity = (variantId) => {
    const item = items.value.find((item) => item.variant_id === variantId);
    if (item && item.quantity > 1) {
      item.quantity--;
      item.line_original_total = item.price_original * item.quantity;
      item.line_final_total = item.price_final * item.quantity;
      item.line_discount = item.line_original_total - item.line_final_total;

      saveToLocalStorage();
    } else if (item && item.quantity === 1) {
      removeItem(variantId);
    }
  };

  const clearCart = () => {
    items.value = [];
    if (process.client) {
      localStorage.removeItem("guest-cart");
      localStorage.setItem(
        "cart-summary",
        JSON.stringify({
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          product_discount_total: 0,
          timestamp: new Date().toISOString(),
        }),
      );
      broadcastCartUpdate();
    }
  };

  const syncWithServer = async (api) => {
    if (items.value.length === 0) return;

    isLoading.value = true;
    try {
      const variantIds = items.value.map((item) => item.variant_id);
      const quantities = items.value.map((item) => item.quantity);
      await api.get("/front/cart", {
        params: {
          variant_ids: variantIds.join(","),
          quantities: quantities.join(","),
        },
      });
      clearCart(); // پاک کردن cart محلی بعد از sync
    } catch (error) {
      console.error("❌ Failed to sync cart:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.line_original_total || 0);
    }, 0);
  });

  const product_discount_total = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.line_discount || 0);
    }, 0);
  });

  return {
    items,
    product_discount_total,
    isLoading,
    totalItems,
    subtotal,
    loadFromLocalStorage,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    addToCartMessage,
    clearCart,
    syncWithServer,
  };
});
