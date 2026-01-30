export const useApi = () => {
  const { $api } = useNuxtApp()

  const getBase = async () => {
    const res = await $api.get('/front/base')
    return res.data
  }

  const getHome = async () => {
    const res = await $api.get('/front/home')
    return res.data
  }

  const getProducts = async (params = {}) => {
    const res = await $api.get('/front/products/', {
      params: {
        search: params.search || undefined,
        in_stock: params.in_stock,
        min_price: params.min_price || undefined,
        max_price: params.max_price || undefined,
        category_id: params.category_id || undefined,
        sort: params.sort || undefined
      }
    })

    return res.data
  }

  const getShopFilters = async () => {
    const res = await $api.get('/front/shop-filters')
    return res.data
  }

  const getBlogs = async (params = {}) => {
    const res = await $api.get('/front/articles', {
      params: {
        page: params.page || 1
      }
    })
    return res.data
  }

  const getBlogDetail = async (id) => {
    const res = await $api.get(`/front/articles/${id}`)
    return res.data
  }

  const submitContact = async (data) => {
    const res = await $api.post('/front/contacts', {
      full_name: data.full_name,
      mobile: data.mobile,
      subject: data.subject,
      body: data.body
    })
    return res.data
  }

  const getProduct = async (id) => {
    const res = await $api.get(`/front/products/${id}`)
    return res.data
  }

  const getProductComments = async (id) => {
    console.log('💬 Fetching product comments...', id)
    try {
      const res = await $api.get(`/front/products/${id}/comments`)
      console.log('✅ Product comments data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get product comments error:', error.response?.data || error.message)
      throw error
    }
  }

  const addToCart = async (variant_id, quantity, productData = {}) => {
    console.log('🛒 Adding to cart:', { variant_id, quantity })

    // بررسی لاگین بودن
    const token = process.client ? localStorage.getItem('auth-token') : null

    if (!token) {
      // اگر لاگین نیست، در localStorage ذخیره می‌کنیم
      console.log('⚠️ User not logged in, saving to localStorage')
      const { useCartStore } = await import('~/store/cart')
      const cartStore = useCartStore()

      cartStore.addItem({
        variant_id,
        quantity,
        ...productData
      })

      return { success: true, message: 'محصول به سبد خرید اضافه شد' }
    }

    // اگر لاگین است، به سرور ارسال می‌کنیم
    try {
      const res = await $api.post('/front/cart/add', {
        variant_id,
        quantity
      })
      console.log('✅ Cart response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Add to cart error:', error.response?.data || error.message)
      throw error
    }
  }

  const getCart = async () => {
    console.log('🛒 Fetching cart...')
    try {
      const res = await $api.get('/front/cart')
      console.log('✅ Cart data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get cart error:', error.response?.data || error.message)
      throw error
    }
  }

  const increaseCartItem = async (itemId) => {
    console.log('➕ Increasing cart item:', itemId)
    try {
      const res = await $api.post(`/front/cart/increase/${itemId}`)
      console.log('✅ Increase response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Increase cart item error:', error.response?.data || error.message)
      throw error
    }
  }

  const decreaseCartItem = async (itemId) => {
    console.log('➖ Decreasing cart item:', itemId)
    try {
      const res = await $api.post(`/front/cart/decrease/${itemId}`)
      console.log('✅ Decrease response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Decrease cart item error:', error.response?.data || error.message)
      throw error
    }
  }

  const deleteCartItem = async (itemId) => {
    console.log('🗑️ Deleting cart item:', itemId)
    try {
      const res = await $api.delete(`/front/cart/delete/${itemId}`)
      console.log('✅ Delete response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Delete cart item error:', error.response?.data || error.message)
      throw error
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    console.log('🔄 Updating cart item:', itemId, 'New quantity:', quantity)
    try {
      const res = await $api.put(`/front/cart/update/${itemId}`, {
        quantity
      })
      console.log('✅ Update response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Update cart item error:', error.response?.data || error.message)
      throw error
    }
  }

  const addToWishlist = async (product_id) => {
    console.log('❤️ Adding to wishlist:', product_id)
    try {
      const res = await $api.post('/front/wishlist', {
        product_id
      })
      console.log('✅ Wishlist add response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Add to wishlist error:', error.response?.data || error.message)
      throw error
    }
  }

  const removeFromWishlist = async (product_id) => {
    console.log('💔 Removing from wishlist:', product_id)
    try {
      const res = await $api.delete(`/front/wishlist/${product_id}`)
      console.log('✅ Wishlist remove response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Remove from wishlist error:', error.response?.data || error.message)
      throw error
    }
  }

  const getWishlist = async () => {
    console.log('❤️ Fetching wishlist...')
    try {
      const res = await $api.get('/front/wishlist')
      console.log('✅ Wishlist data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get wishlist error:', error.response?.data || error.message)
      throw error
    }
  }

  const checkCoupon = async (code, subtotal) => {
    console.log('🎟️ Checking coupon:', code, 'Subtotal:', subtotal)
    try {
      const res = await $api.post('/front/coupons/check', {
        code,
        subtotal
      })
      console.log('✅ Coupon check response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Check coupon error:', error.response?.data || error.message)
      throw error
    }
  }


  const getOrders = async (params = {}) => {
    console.log('📦 Fetching orders...', params)
    try {
      const res = await $api.get('/front/user/orders', {
        params: {
          status: params.status || undefined,
          from_date: params.from_date || undefined,
          to_date: params.to_date || undefined
        }
      })
      console.log('✅ Orders data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get orders error:', error.response?.data || error.message)
      throw error
    }
  }

  const getUserProfile = async () => {
    console.log('👤 Fetching user profile...')
    try {
      const res = await $api.get('/front/user/profile')
      console.log('✅ User profile data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get user profile error:', error.response?.data || error.message)
      throw error
    }
  }

  const updateUserProfile = async (data) => {
    console.log('✏️ Updating user profile...', data)
    try {
      const res = await $api.put('/front/user/profile', {
        full_name: data.full_name,
        birth_date: data.birth_date || undefined,
        mobile: data.mobile,
        email: data.email || undefined,
        national_code: data.national_code || undefined,
        password: data.password || undefined,
        password_confirmation: data.password_confirmation || undefined
      })
      console.log('✅ Profile updated:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Update profile error:', error.response?.data || error.message)
      throw error
    }
  }

  const getWallet = async () => {
    console.log('💰 Fetching wallet...')
    try {
      const res = await $api.get('/front/user/wallet')
      console.log('✅ Wallet data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get wallet error:', error.response?.data || error.message)
      throw error
    }
  }

  const getWalletTransactions = async () => {
    console.log('📊 Fetching wallet transactions...')
    try {
      const res = await $api.get('/front/user/wallet/transaction')
      console.log('✅ Wallet transactions data:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get wallet transactions error:', error.response?.data || error.message)
      throw error
    }
  }

  const chargeWallet = async (amount) => {
    console.log('💳 Charging wallet...', amount)
    try {
      const res = await $api.post('/front/user/wallet/charge', {
        amount
      })
      console.log('✅ Wallet charge response:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Charge wallet error:', error.response?.data || error.message)
      throw error
    }
  }

  const getCheckoutSummary = async (data) => {
    console.log('📋 Fetching checkout summary...', data)
    try {
      const res = await $api.post('/front/checkout-summary', {
        address_id: data.address_id,
        shipping_method_id: data.shipping_method_id,
        coupon_code: data.coupon_code || ''
      })
      console.log('✅ Checkout summary:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Get checkout summary error:', error.response?.data || error.message)
      throw error
    }
  }

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
    getCheckoutSummary
  }
}
