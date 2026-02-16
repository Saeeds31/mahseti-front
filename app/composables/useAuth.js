// composables/useAuth.js
import { useSettingStore } from "~/store/settings";
import { useCartStore } from "~/store/cart";

export const useAuth = () => {
  const { $api } = useNuxtApp();

  // State مشترک برای مدیریت مودال لاگین
  const loginModal = useState("loginModal", () => false);
  const step = useState("authStep", () => "mobile");
  const mobile = useState("authMobile", () => "");
  const password = useState("authPassword", () => "");
  const fullName = useState("authFullName", () => "");
  const otp = useState("authOtp", () => "");
  const timer = useState("authTimer", () => 0);
  const btnLoader = useState("authBtnLoader", () => false);

  const openModal = () => {
    console.log("🔓 Opening login modal");
    loginModal.value = true;
    step.value = "mobile";
  };

  const closeModal = () => {
    console.log("🔒 Closing login modal");
    loginModal.value = false;
    mobile.value = "";
    password.value = "";
    fullName.value = "";
    otp.value = "";
    step.value = "mobile";
  };

  const checkMobile = async () => {
    if (!mobile.value) {
      alert("لطفاً شماره موبایل را وارد کنید");
      return;
    }

    btnLoader.value = true;
    try {
      const response = await $api.post("/front/check-mobile", {
        mobile: mobile.value,
      });
      console.log("📱 Check mobile response:", response.data);

      // چک کردن همه حالات ممکن
      if (response.data.status === "login" || response.data.exists === true) {
        // کاربر قدیمی - به صفحه password می‌ره
        step.value = "login";
      } else {
        // کاربر جدید - OTP ارسال می‌شه
        await sendOtpAgain();
        step.value = "token";
      }
    } catch (error) {
      console.error("❌ Check mobile error:", error);
      alert("خطا در بررسی شماره موبایل");
    } finally {
      btnLoader.value = false;
    }
  };

  const sendOtpAgain = async () => {
    btnLoader.value = true;
    try {
      await $api.post("/front/send-otp", { mobile: mobile.value });
      console.log("📲 OTP sent");

      // شروع تایمر 120 ثانیه
      timer.value = 120;
      const interval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error("❌ Send OTP error:", error);
      alert("خطا در ارسال کد تایید");
    } finally {
      btnLoader.value = false;
    }
  };

  const verifyOtp = async () => {
    if (!otp.value) {
      alert("لطفاً کد تایید را وارد کنید");
      return;
    }

    btnLoader.value = true;
    try {
      const response = await $api.post("/front/verify-otp", {
        mobile: mobile.value,
        token: otp.value,
      });
      console.log("✅ OTP verified:", response.data);

      if (response.data.is_new_user) {
        step.value = "register";
      } else {
        // لاگین موفق - ذخیره در localStorage
        localStorage.setItem("auth-token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Sync کردن سبد خرید محلی با سرور
        await syncCartWithServer();

        closeModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Verify OTP error:", error);
      alert("کد تایید نامعتبر است");
    } finally {
      btnLoader.value = false;
    }
  };

  const loginWithPassword = async () => {
    if (!password.value) {
      alert("لطفاً رمز عبور را وارد کنید");
      return;
    }

    btnLoader.value = true;
    try {
      const response = await $api.post("/front/login-password", {
        mobile: mobile.value,
        password: password.value,
      });
      console.log("✅ Login successful:", response.data);

      // ذخیره در localStorage
      localStorage.setItem("auth-token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Sync کردن سبد خرید محلی با سرور
      await syncCartWithServer();

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("نام کاربری یا رمز عبور اشتباه است");
    } finally {
      btnLoader.value = false;
    }
  };

  const register = async () => {
    if (!fullName.value || !password.value) {
      alert("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    btnLoader.value = true;
    try {
      const response = await $api.post("/front/register", {
        mobile: mobile.value,
        password: password.value,
        full_name: fullName.value,
      });
      console.log("✅ Registration successful:", response.data);

      // ذخیره در localStorage
      localStorage.setItem("auth-token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Sync کردن سبد خرید محلی با سرور
      await syncCartWithServer();

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("خطا در ثبت نام");
    } finally {
      btnLoader.value = false;
    }
  };

  const showTokenSection = () => {
    sendOtpAgain();
    step.value = "token";
  };

  // Sync کردن محصولات localStorage با سرور بعد از لاگین
  const syncCartWithServer = async () => {
    try {
      const cartStore = useCartStore();

      // بارگذاری cart از localStorage
      cartStore.loadFromLocalStorage();

      // اگر محصولی در localStorage نیست، نیازی به sync نداریم
      if (cartStore.items.length === 0) {
        return;
      }

      // ارسال هر محصول به سرور
      for (const item of cartStore.items) {
        await $api.post("/front/cart/add", {
          variant_id: item.variant_id,
          quantity: item.quantity,
        });
      }

      // پاک کردن localStorage بعد از sync موفق
      cartStore.clearCart();
    } catch (error) {
      console.error("❌ Failed to sync cart:", error);
      // اگر خطا داد، localStorage رو پاک نمی‌کنیم تا کاربر محصولاتش رو از دست نده
    }
  };

  return {
    loginModal,
    step,
    mobile,
    password,
    fullName,
    otp,
    timer,
    btnLoader,
    openModal,
    closeModal,
    checkMobile,
    verifyOtp,
    loginWithPassword,
    register,
    sendOtpAgain,
    showTokenSection,
  };
};

export const useApiAuth = () => {
  const { $api } = useNuxtApp();
  const settingStore = useSettingStore();

  const checkMobile = async (mobile) => {
    return await $api.post("/front/check-mobile", { mobile });
  };

  const verifyOtp = async (mobile, token) => {
    return await $api.post("/front/verify-otp", { mobile, token });
  };

  const sendOtp = async (mobile) => {
    return await $api.post("/front/send-otp", { mobile });
  };

  const loginWithPassword = async (mobile, password) => {
    return await $api.post("/front/login-password", { mobile, password });
  };

  const register = async (mobile, password, full_name) => {
    return await $api.post("/front/register", { mobile, password, full_name });
  };

  // const getProfile = async () => {
  //   return await $api.get('/front/profile')
  // }

  // const updateProfile = async (data) => {
  //   return await $api.put('/front/profile', data)
  // }

  const logout = async () => {
    try {
      await $api.post("/front/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // پاک کردن از localStorage
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      settingStore.user = null;

      // پاک کردن header Authorization
      if ($api.defaults?.headers?.common) {
        delete $api.defaults.headers.common.Authorization;
      }
    }
  };

  return {
    checkMobile,
    verifyOtp,
    sendOtp,
    loginWithPassword,
    register,
    //   getProfile,
    //   updateProfile,
    logout,
  };
};
