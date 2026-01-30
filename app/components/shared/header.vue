<template>
  <header class="mb-4">
    <div class="bg-secondary h-2 rounded-t-[8px]"></div>

    <!-- Desktop Header -->
    <div class="hidden md:block">
      <div class="container w-full flex justify-between py-2">
        <div class="flex items-center gap-5">
          <sharedLogo :width="'100px'" height="'67px'" />
          <headerSearch />
        </div>

        <div class="flex items-center gap-2">
          <headerBtnProfile />

          <nuxt-link to="/cart" class="relative">
            <iconCart class="icon-btn p-2 rounded-full" />
            <span v-if="cartItemsCount > 0" class="cart-badge">
              {{ cartItemsCount }}
            </span>
          </nuxt-link>

          <nuxt-link to="/panel/favorites">
            <iconFavorite class="icon-btn p-2 rounded-full" />
          </nuxt-link>
        </div>
      </div>

      <div class="container py-2 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <headerMenu />
        </div>

        <div class="flex items-center">
          <div>
            <h3 :style="{ color: 'var(--gold)' }">تلفن تماس</h3>
            <div>{{ phoneNumber }}</div>
          </div>
          <iconPhone />
        </div>
      </div>
      <div class="border-b h-1"></div>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden">
      <div class="container w-full flex justify-between items-center py-3">
        <!-- Hamburger Menu (Left) -->
        <button @click="toggleMenu" class="icon-btn p-2 rounded-full">
          <iconMenu />
        </button>

        <!-- Logo (Center) -->
        <sharedLogo :width="'80px'" :height="'54px'" />

        <!-- Profile (Right) -->

        <div class="flex gap-2">
          <nuxt-link to="/cart" class="relative">
            <iconCart class="icon-btn p-2 rounded-full" />
            <span v-if="cartItemsCount > 0" class="cart-badge">
              {{ cartItemsCount }}
            </span>
          </nuxt-link>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <transition name="slide">
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 bg-black/30 bg-opacity-50 z-50"
          @click="toggleMenu"
        >
          <div
            class="fixed right-0 top-0 h-full w-80 bg-primary shadow pad"
            @click.stop
          >
            <!-- Close Button -->
            <button
              @click="toggleMenu"
              class="mb-6 icon-btn p-2 rounded-full absolute left-2"
            >
              <iconClose />
            </button>

            <!-- Menu Content -->
            <div class="flex flex-col gap-6 mt-10">
              
              <div class=" flex justify-between items-center">
               <headerBtnProfile />
                <nuxt-link to="/panel/favorites">
                  <iconFavorite class="icon-btn p-2 rounded-full" />
                </nuxt-link>
              </div>
              <headerMenu />
              <div class="w-full flex justify-between gap-4">
                <div class="flex items-center gap-3">
                  <iconPhone />
                  <div>
                    <h3 :style="{ color: 'var(--gold)' }" class="text-sm">
                      تلفن تماس
                    </h3>
                    <div>{{ phoneNumber }}</div>
                  </div>
                </div>
              </div>
              <headerSearch />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "@/composables/api/useApi";

const { getBase } = useApi();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// محاسبه تعداد آیتم‌های سبد خرید از localStorage
const cartItemsCount = computed(() => {
  if (typeof window === "undefined") return 0;

  try {
    const savedCart = localStorage.getItem("cart-summary");
    if (!savedCart) return 0;

    const cartData = JSON.parse(savedCart);
    return cartData?.totalQuantity || cartData?.items?.length || 0;
  } catch (error) {
    console.error("Error reading cart count:", error);
    return 0;
  }
});

// دریافت تنظیمات از API
const { data: baseData } = await useAsyncData(
  "headerBaseData",
  async () => {
    try {
      return await getBase();
    } catch (error) {
      console.error("❌ Failed to fetch base data in header:", error);
      return { data: { settings: [] } };
    }
  },
  {
    lazy: true,
    server: false,
  }
);

// شماره تلفن از settings
const phoneNumber = computed(() => {
  const settings = baseData.value?.data?.settings;
  // بررسی اینکه settings یک آرایه است
  if (!Array.isArray(settings)) {
    return "09338789456";
  }
  const phoneSettings = settings.find(
    (s) =>
      s.key === "support_phone" ||
      s.key === "phone" ||
      s.key === "contact_phone"
  );
  return phoneSettings?.value || "09338789456";
});
</script>

<style>
.icon-btn {
  background-color: var(--bg-secondary-fade);
  cursor: pointer;
}
.icon-btn:hover {
  background-color: var(--bg-secondary);
  transition: 0.4s;
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--red);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-enter-active .fixed.right-0,
.slide-leave-active .fixed.right-0 {
  transition: transform 0.3s ease;
}
.slide-enter-from .fixed.right-0,
.slide-leave-to .fixed.right-0 {
  transform: translateX(100%);
}
</style>

<!-- <template>
    <header>
        <section id="topHeader"
            class="flex items-center justify-between p-4 border-b-[1px_solid_#1213] main-container-with-padding">
            <button @click="showMenu = true" id="menuBar" class="show-mobile-block">
                <svg-menu-bar />
            </button>
            <SharedDropDownMenu v-if="showMenu" @closeMenu="showMenu = false" :menus="menus" />
            <div class="flex items-center justify-between gap-4">
                <nuxt-link to="/" v-if="settings?.shop_info?.logo">
                    <img id="logo" :src="$getImageUrl(settings.shop_info.logo)" :alt="settings.shop_info.name">
                </nuxt-link>
                <form @submit.prevent="searchContent()" class="show-desktop-block relative">
                    <input v-model="search" class="py-[8px] px-[32px] w-[350px] rounded-[24px] border border-gray-300"
                        type="text" placeholder="جستجو کنید ...">
                    <button
                        class="absolute bg-[var(--button-base)] w-[32px] h-[32px] rounded-[50%] flex items-center justify-center left-[4px] top-2/4 -translate-y-1/2">
                        <svg-search v-if="!searchLoader" />
                        <svg-loader v-else />
                    </button>
                    <div id="productResult"
                        class="absolute bg-[linear-gradient(180deg,_transparent,_var(--button-base),_var(--button-base))] z-10 right-[2%] top-[70%] w-[96%] rounded-[8px] pt-[16px] [box-shadow:2px_11px_4px_#1213] max-h-[300px] overflow-auto"
                        v-if="resultProducts.length">
                        <ul>
                            <li class="border-b-[#1213]" v-for="(product, index) in resultProducts" :key="index">
                                <shared-product-search-card :product="product" />
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
            <div id="headerButtons" class="show-desktop-flex items-center gap-2">
                <button v-if="!user" @click="loginModal = true"
                    class="bg-[var(--button-base)] w-[48px] h-[48px] rounded-[50%] flex items-center justify-center">
                    <svg-user />
                </button>
                <nuxt-link v-else to="/user-dashboard"
                    class="bg-[var(--button-base)] w- h-[48px] rounded-[8px] py-[6px] px-[12px] flex items-center gap-2 justify-center">
                    <span>{{ user.full_name ?? user.mobile }}</span>
                    <svg-user />

                </nuxt-link>
                <button @click="showBask(true)"
                    class="bg-[var(--button-base)] w-[48px] h-[48px] rounded-[50%] flex items-center justify-center">
                    <svg-basket />
                </button>
                <nuxt-link v-if="user"
                    class="bg-[var(--button-base)] w-[48px] h-[48px] rounded-[50%] flex items-center justify-center"
                    to="/user-dashboard/favorites">
                    <SvgHeart />
                </nuxt-link>
            </div>
        </section>
        <section id="bottomHeader"
            class="show-desktop-flex items-center justify-between p-4 main-container-with-padding">
            <shared-menus :menus="menus" />
            <nuxt-link id="support" class="flex gap-[8px] items-center" v-if="settings?.shop_info?.support_phone"
                :to="`tel:${settings.shop_info.support_phone}`">
                <span class="flex flex-col gap-[6px] items-center">
                    <strong class="second-color">
                        تلفن تماس
                    </strong>
                    <i>{{ settings.shop_info.support_phone }}</i>
                </span>
                <svg-phone />
            </nuxt-link>
        </section>
        <section id="loginModal" v-if="loginModal"
            class="fixed bg-[#1213] backdrop-filter backdrop-blur-sm flex items-center justify-center left-0 right-0 top-0 bottom-0 z-[100]">
            <div id="modalContainer" class="bg-[white] p-[16px] rounded-[16px] relative w-modal">
                <button @click="loginModal = false">
                    <svg-close />
                </button>
                <transition v-if="step == 'mobile'">
                    <div class="flex flex-col items-center gap-[8px]">
                        <h3>به <b class="color-base" v-if="settings?.shop_info?.name">{{ settings.shop_info.name }}</b> خوش آمدید</h3>
                        <p class="opacity-60 text-[14px]">لطفا برای ورود و یا عضویت شماره خود را وارد کنید</p>
                        <form class="relative w-4/5 mx-[auto] my-[16px]" @submit.prevent="loginOrRegister()">
                            <input class="pl-[16px] pr-[32px] py-[14px] rounded-[8px] w-full text-right"
                                v-model="mobile" type="tel" placeholder="شماره موبایل خورد را وارد کنید">
                            <svg-user class="absolute right-[2px] top-[16px] opacity-50" />
                            <button
                                class="flex items-center justify-center text-[white] bg-[var(--color-base)] mx-[auto] my-[8px] w-full px-[16px] py-[8px] rounded-[4px]">
                                <span v-if="!btnLoader">
                                    ورود
                                </span>
                                <span class="p-2" v-else>
                                    <svg-loader />

                                </span>

                            </button>
                        </form>
                    </div>

                </transition>
                <transition v-else-if="step == 'login'">
                    <div class="flex flex-col items-center gap-[8px]">
                        <p class="opacity-60 text-[14px]">لطفا برای ورود رمز عبور خود را وارد کنید</p>
                        <form class="relative w-4/5 mx-[auto] my-[16px]" @submit.prevent="loginWithPassword()">
                            <div class="relative">
                                <input v-model="password" placeholder="رمز عبور حداقل 6 کارکتری"
                                    class="w-full mx-[auto] my-[16px] pr-[36px] py-[12px] rounded-[8px]"
                                    type="password">
                                <SvgPassword class="absolute right-[6px] top-[26px]" />
                            </div>
                            <div class="grid grid-cols-[1fr] my-[8px] gap-2">
                                <button
                                    class="flex items-center justify-center text-[white] w-full bg-[var(--color-base)]   px-[16px] py-[8px] rounded-[4px]">
                                    <span v-if="!btnLoader">
                                        ورود
                                    </span>
                                    <span class="p-2" v-else>
                                        <svg-loader />

                                    </span>
                                </button>
                                <button type="button" @click="showTokenSection()"
                                    class="flex items-center justify-center text-[white] w-full bg-[var(--color-base)] mx-[auto] px-[16px] py-[8px] rounded-[4px]">
                                    <span>
                                        ورود با کد یکبار مصرف
                                    </span>
                                </button>
                            </div>

                        </form>
                    </div>
                </transition>
                <transition v-else-if="step == 'register'">
                    <div class="flex flex-col items-center gap-[8px]">
                        <p class="opacity-60 text-[14px]">لطفا برای عضویت اطلاعات زیر را کامل کنید</p>
                        <form class="relative w-4/5 mx-[auto] my-[16px]" @submit.prevent="register()">
                            <div class="relative">
                                <input v-model="fullName" placeholder=" نام کامل : علی احمدی"
                                    class="w-full mx-[auto] my-[16px] pr-[36px] py-[12px] rounded-[8px]" type="text">
                                <SvgUser class="absolute right-[6px] top-[26px]" />
                            </div>
                            <div class="relative">
                                <input v-model="password" placeholder="رمز عبور 6 کارکتری"
                                    class="w-full mx-[auto] my-[16px] pr-[36px] py-[12px] rounded-[8px]" type="text">
                                <SvgPassword class="absolute right-[6px] top-[26px]" />
                            </div>
                            <button
                                class="flex items-center justify-center text-[white] bg-[var(--color-base)] mx-[auto] my-[8px] w-full px-[16px] py-[8px] rounded-[4px]">
                                <span v-if="!btnLoader">
                                    ثبت اطلاعات
                                </span>
                                <span class="p-2" v-else>
                                    <svg-loader />
                                </span>
                            </button>
                        </form>
                    </div>
                </transition>
                <transition v-else-if="step == 'token'">
                    <div class="flex flex-col items-center gap-[8px]">

                        <h3 class="flex items-center justify-between gap-4">
                            <b class="color-base">{{ mobile }}</b>
                            <button @click="step = 'mobile'">
                                <SvgEdit />
                            </button>
                        </h3>
                        <p class="opacity-60 text-[14px]">برای عضویت لطفا کد ارسالی را وارد کنید</p>
                        <form class="relative w-4/5 mx-[auto] my-[16px]" @submit.prevent="checkOtp()">
                            <OtpInput v-model:code="otp" :length="6" class="mt-4" />
                            <div class="grid grid-cols-[1fr_1fr] my-[8px] gap-2">
                                <button
                                    class="flex items-center justify-center w-full text-[white] bg-[var(--color-base)] mx-[auto]  px-[16px] py-[8px] rounded-[4px]">
                                    <span v-if="!btnLoader">
                                        تایید کد
                                    </span>
                                    <span class="p-2" v-else>
                                        <svg-loader />
                                    </span>
                                </button>
                                <button type="button"
                                    class="flex items-center justify-center w-full text-[white] bg-[var(--second-color)] mx-[auto]  px-[16px] py-[8px] rounded-[4px]"
                                    @click="sendOtpAgain()">
                                    <span v-if="timer">
                                        {{ timer }}
                                    </span>
                                    <span v-else>
                                        ارسال مجدد کد
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </section>
        <aside ref="sideBar" id="sideBar"
            class="fixed left-[-1000px] z-[100] top-[0] w-[425px] h-screen overflow-hidden bg-[white] [box-shadow:10px_-2px_16px_#1213] flex flex-col justify-between">
            <div id="sidebarHeader"
                class="flex items-center justify-between p-[16px] border-b-[1px_solid_#1213] bg-[var(--color-base)] text-[white] h-[60px]">
                <h5>سبد خرید</h5>
                <button @click="showBask(false)">
                    <svg-close />
                </button>
            </div>
            <ul class="cards flex-grow">
                <SharedBasketCard v-for="(cards, index) in basketCards" :item="cards" :key="index" />
            </ul>
            <div id="sideBarFooter" class="flex flex-col gap-[8px] border-t-[1px_solid_#0052009e] h-[115px] pb-[8px]">
                <div class="flex justify-between p-[16px]">
                    <span>مجموع خرید:</span>
                    <b class="flex items-center gap-2">
                        <strong>520.000</strong>
                        <SvgToman />
                    </b>
                </div>
                <button
                    class="bg-[var(--color-base)] text-[white] w-[90%] mr-[5%] px-[16px] py-[8px] rounded-[8px]">ادامه
                    خرید</button>
            </div>
        </aside>
    </header>
</template>
<script setup>

import { useSettingStore } from '../../store/settings.js'
import { storeToRefs } from 'pinia'
const otp = ref("")
const sideBar = ref()
const { $getImageUrl, $toast, $api } = useNuxtApp()
const settingStore = useSettingStore()
const { settings, menus, user } = storeToRefs(settingStore)
let search = ref("");
let searchLoader = ref(false);
let resultProducts = ref([]);
let loginModal = ref(false);
let mobile = ref("");
let btnLoader = ref(false);
let step = ref("mobile");
let timer = ref(0);
let iv = ref(null);
let showMenu = ref(false);
let password = ref("")
let fullName = ref("")
async function searchContent() {
    if (searchLoader.value) return;
    searchLoader.value = true;
    try {
        await $api.get("/products/search?search=" + search.value).then(
            (res) => {
                resultProducts.value = res.data;
            }
        )
    } catch (error) {
        console.log(error);

    } finally {
        searchLoader.value = false
    }
}
async function loginOrRegister() {
    if (btnLoader.value) return;
    const regex = /^09\d{9}$/;
    if (!regex.test(mobile.value)) {
        return $toast.warning('شماره موبایل به درستی وارد نشده است!', {
            timeout: 2000,
            position: 'top-right',
        })
    }
    btnLoader.value = true;
    try {
        const formData = new FormData();
        formData.append("mobile", mobile.value)
        await $api.post("/check-mobile", formData).then((res) => {
            step.value = res.data.status == 'login' ? 'login' : 'token';
            if (step.value == 'token') {
                runTimer();
            }
        })
    } catch (error) {
        console.log(error);

        $toast.warning(error?.response?.data?.errors?.mobile[0], {
            timeout: 2000,
            position: 'top-right',
        })
    } finally {
        btnLoader.value = false
    }
}
async function checkOtp() {
    if (btnLoader.value) return;
    if (otp.value.length != 6) {
        return $toast.warning('کد را به صورت کامل وارد کنید!', {
            timeout: 2000,
            position: 'top-right',
        })
    }
    btnLoader.value = true;
    try {
        const formData = new FormData();
        formData.append("mobile", mobile.value)
        formData.append("token", otp.value)
        await $api.post("/verify-otp", formData).then((res) => {
            if (res.data.status == 'need_register') {
                step.value = 'register'
            } else {
                localStorage.setItem('auth-token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                $api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
                user.value = res.data.user;
                $toast.success(`به ${settings.value?.shop_info?.name || 'فروشگاه'} خوش آمدید`, {
                    timeout: 2000,
                    position: 'top-right',
                })
                loginModal.value = false;
                step.value = "mobile"
            }
        })
    } catch (error) {
        console.log(error);

        $toast.warning(error?.response?.data?.errors?.mobile[0], {
            timeout: 2000,
            position: 'top-right',
        })
    } finally {
        btnLoader.value = false
    }
}
async function loginWithPassword() {
    if (btnLoader.value) return;

    if (password.value.length < 6) {
        return $toast.warning('رمز عبور باید به صورت کامل وارد شود', {
            timeout: 2000,
            position: 'top-right',
        })
    }
    btnLoader.value = true;
    try {
        const formData = new FormData();
        formData.append("mobile", mobile.value)
        formData.append("password", password.value)
        await $api.post("/login-password", formData).then((res) => {
            localStorage.setItem('auth-token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            $api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
            user.value = res.data.user;
            $toast.success(`به ${settings.value?.shop_info.name} خوش آمدید`, {
                timeout: 2000,
                position: 'top-right',
            })
            loginModal.value = false;
            step.value = "mobile"

        })
    } catch (error) {
        console.log(error);
        $toast.success(error?.response?.data?.errors?.mobile[0], {
            timeout: 2000,
            position: 'top-right',
        })
    } finally {
        btnLoader.value = false
    }
}
async function register() {
    if (btnLoader.value) return;

    if (password.value.length < 6 || fullName.value.length < 3) {
        return $toast.warning('نام و رمز عبور باید به صورت کامل وارد شود', {
            timeout: 2000,
            position: 'top-right',
        })
    }
    btnLoader.value = true;
    try {
        const formData = new FormData();
        formData.append("mobile", mobile.value)
        formData.append("password", password.value)
        formData.append("full_name", fullName.value)
        await $api.post("/register", formData).then((res) => {
            localStorage.setItem('auth-token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            $api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
            user.value = res.data.user;
            $toast.success(`به ${settings.value?.shop_info.name} خوش آمدید`, {
                timeout: 2000,
                position: 'top-right',
            })
            loginModal.value = false;
            step.value = "mobile"

        })
    } catch (error) {
        console.log(error);

        $toast.success(error?.response?.data?.errors?.mobile[0], {
            timeout: 2000,
            position: 'top-right',
        })
    } finally {
        btnLoader.value = false
    }
}
function runTimer() {
    timer.value = 60;
    iv.value = setInterval(() => {
        timer.value--;
        if (timer.value == 0) {
            clearInterval(iv.value)
        }
    }, 1000)
}
function sendOtpAgain() {
    if (timer.value != 0) return;
    try {
        const formData = new FormData();
        formData.append("mobile", mobile.value);
        $api.post('/send-otp', formData).then((res) => {
            if (res.data.success) {
                runTimer()
                $toast.success("کد مجددا برای شما ارسال شد", {
                    timeout: 2000,
                    position: 'top-right',
                })
            }
        })
    } catch (error) {
        console.log(error);

    }
}
function showTokenSection() {
    step.value = 'token';
    sendOtpAgain();
}
let basketCards = ref([
    { main_image: "/images/test/slide1.png", title: "میوه خشک شده", price: 50000, old_price: 52000, quantity: 4 },
    { main_image: "/images/test/slide1.png", title: "میوه خشک شده", price: 50000, old_price: null, quantity: 1 },
])
function showBask(flag) {

    if (flag) {
        sideBar.value.classList.add('showSideBar');
        if (sideBar.value.classList.contains('hideSideBar')) {
            setTimeout(() => {
                sideBar.value.classList.remove("hideSideBar")
            }, 500);
        }
    } else {
        sideBar.value.classList.add('hideSideBar');
        if (sideBar.value.classList.contains('showSideBar')) {
            setTimeout(() => {
                sideBar.value.classList.remove("showSideBar")
            }, 500);
        }
    }
}
</script>
<style>
.w-modal {
    width: max(30%, 340px);
}

section#loginModal form input {
    background-color: #0000000D;
}

div#sidebarHeader svg path {
    stroke: white;
}

div#sideBarFooter {
    border-top: 1px solid #0052009e;
}

#sideBar .cards {
    height: calc(100vh - 170px);
    overflow: auto;
}

.showSideBar {
    animation: showSideBar 0.4s linear forwards;
}

.hideSideBar {
    animation: hideSideBar 0.4s linear forwards;

}

@keyframes hideSideBar {
    from {
        left: 0;
    }

    to {
        left: -1000px;
    }
}

@keyframes showSideBar {
    from {
        left: -1000px;
    }

    to {
        left: 0;
    }
}

section#topHeader {
    border-bottom: 1px solid #D6D6D6;
}
</style> -->
