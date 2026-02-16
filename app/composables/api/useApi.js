// composables/api/useApi.js
export const useApi = () => {
  const { $api } = useNuxtApp();

  const getBase = async () => {
    const res = await $api.get("/front/base");
    return res.data;
  };

  const getHome = async () => {
    const res = await $api.get("/front/home");
    return res.data;
  };

  // const getProducts = async (params = {}) => {
  //   const res = await $api.get("/front/products", {
  //     params: {
  //       search: params.search || undefined,
  //       in_stock: params.in_stock,
  //       min_price: params.min_price || undefined,
  //       max_price: params.max_price || undefined,
  //       category_id: params.category_id || undefined,
  //       sort: params.sort || undefined,
  //     },
  //   });

  //   return res.data;
  // };

  const getProducts = async (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries({
        search: params.search ?? undefined,
        in_stock: params.in_stock ?? undefined,
        min_price: params.min_price ?? undefined,
        max_price: params.max_price ?? undefined,
        category_id: params.category_id ?? undefined,
        weight: params.weight ?? undefined,
        sort_by: params.sort_by ?? undefined,
        page: params.page ?? undefined,
      }).filter(([, v]) => v !== undefined && v !== ""),
    );

    const res = await $api.get("/front/products", { params: cleaned });
    return res.data;
  };


  const getShopFilters = async () => {
    const res = await $api.get("/front/shop-filters");
    return res.data;
  };

  const getBlogs = async (params = {}) => {
    const res = await $api.get("/front/articles", {
      params: {
        page: params.page || 1,
      },
    });
    return res.data;
  };

  const getBlogDetail = async (id) => {
    const res = await $api.get(`/front/articles/${id}`);
    return res.data;
  };

  const submitContact = async (data) => {
    const res = await $api.post("/front/contacts", {
      full_name: data.full_name,
      mobile: data.mobile,
      subject: data.subject,
      body: data.body,
    });
    return res.data;
  };

  const getProduct = async (id) => {
    const res = await $api.get(`/front/products/${id}`);
    return res.data;
  };

  const getProductComments = async (id) => {
    // این endpoint در کالکشن نیست؛ نیاز به تایید بک‌اند
    const res = await $api.get(`/front/products/${id}/comments`);
    return res.data;
  };

  const addToCart = async (variant_id, quantity, productData = {}) => {
    const token = process.client ? localStorage.getItem("auth-token") : null;

    if (!token) {
      const { useCartStore } = await import("~/store/cart");
      const cartStore = useCartStore();

      cartStore.addItem({
        variant_id,
        quantity,
        ...productData,
      });

      return { success: true, message: "محصول به سبد خرید اضافه شد" };
    }

    const res = await $api.post("/front/cart/add", {
      variant_id,
      quantity,
    });
    return res.data;
  };

  const getCart = async () => {
    const res = await $api.get("/front/cart");
    return res.data;
  };

  const increaseCartItem = async (itemId) => {
    const res = await $api.get(`/front/cart/increase/${itemId}`);
    return res.data;
  };

  const decreaseCartItem = async (itemId) => {
    const res = await $api.get(`/front/cart/decrease/${itemId}`);
    return res.data;
  };

  const deleteCartItem = async (itemId) => {
    const res = await $api.delete(`/front/cart/delete/${itemId}`);
    return res.data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await $api.post(`/front/cart/update/${itemId}`, {
      quantity,
    });
    return res.data;
  };

  const addToWishlist = async (product_id) => {
    const res = await $api.post("/front/wishlist", {
      product_id,
    });
    return res.data;
  };

  const removeFromWishlist = async (product_id) => {
    const res = await $api.delete(`/front/wishlist/${product_id}`);
    return res.data;
  };

  const getWishlist = async () => {
    const res = await $api.get("/front/wishlist");
    return res.data;
  };

  const checkCoupon = async (code, subtotal) => {
    const res = await $api.post("/front/coupons/check", {
      code,
      subtotal,
    });
    return res.data;
  };

  const getOrders = async (params = {}) => {
    const res = await $api.get("/front/user/orders", {
      params: {
        status: params.status || undefined,
        from_date: params.from_date || undefined,
        to_date: params.to_date || undefined,
      },
    });
    return res.data;
  };

  const getUserProfile = async () => {
    const res = await $api.get("/front/user/profile");
    return res.data;
  };

  const updateUserProfile = async (data) => {
    const res = await $api.put("/front/user/profile", {
      full_name: data.full_name,
      birth_date: data.birth_date || undefined,
      mobile: data.mobile,
      email: data.email || undefined,
      national_code: data.national_code || undefined,
      password: data.password || undefined,
      password_confirmation: data.password_confirmation || undefined,
    });
    return res.data;
  };

  const getWallet = async () => {
    const res = await $api.get("/front/user/wallet");
    return res.data;
  };

  const getWalletTransactions = async () => {
    const res = await $api.get("/front/user/wallet/transaction");
    return res.data;
  };

  const chargeWallet = async (amount) => {
    const res = await $api.post("/front/user/wallet/charge", {
      amount,
    });
    return res.data;
  };

  const getCheckoutSummary = async (data) => {
    // مطابق کالکشن: POST /front/order
    const res = await $api.post("/front/order", {
      address_id: data.address_id,
      shipping_method_id: data.shipping_method_id,
      coupon_code: data.coupon_code || "",
    });
    return res.data;
  };

  return {
    getBase,
    getHome,
    getProducts,
    getShopFilters,
    getBlogs,
    getBlogDetail,
    submitContact,
    getProduct,
    getProductComments,
    addToCart,
    getCart,
    increaseCartItem,
    decreaseCartItem,
    deleteCartItem,
    updateCartItem,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkCoupon,
    getOrders,
    getUserProfile,
    updateUserProfile,
    getWallet,
    getWalletTransactions,
    chargeWallet,
    getCheckoutSummary,
  };
};
