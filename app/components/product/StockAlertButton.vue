<!-- components/product/StockAlertButton.vue -->
<template>
    <div class="flex items-center gap-2">
        <!-- حالت درخواست ثبت شده -->
        <button v-if="hasRequested" @click="handleCancelRequest" :disabled="isLoading"
            class="flex items-center justify-center gap-2 px-4 h-12 text-sm sm:text-base rounded-lg border-2 border-green-500 text-green-600 bg-green-50 hover:bg-green-100 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-wait">
            <Bell v-if="!isLoading" :size="18" class="text-green-500" />
            <Loader v-else :size="18" class="animate-spin text-green-500" />
            <span>وقتی موجود شد به شما اطلاع داده خواهد شد</span>
            <X v-if="!isLoading" :size="16" class="mr-1 text-green-500 hover:text-red-500" />
        </button>

        <!-- حالت درخواست نشده -->
        <button v-else @click="handleRegisterRequest" :disabled="isLoading"
            class="flex items-center justify-center gap-2 px-4 h-12 text-sm sm:text-base rounded-lg bg-[#1c1395] hover:bg-blue-600 text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-wait">
            <Bell v-if="!isLoading" :size="18" />
            <Loader v-else :size="18" class="animate-spin" />
            <span>موجود شد به من اطلاع بده</span>
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Bell, Loader, X } from "lucide-vue-next";
import { toast } from "vue3-toastify";
import { useApi } from "@/composables/api/useApi";
import { useAuth } from "~/composables/useAuth";

const { loginModal } = useAuth();

const props = defineProps({
    productId: {
        type: Number,
        required: true,
    },
    isInStock: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["request-updated"]);

const { getStockAlertStatus, registerStockAlert, cancelStockAlert } = useApi();
const hasRequested = ref(false);
const isLoading = ref(false);

// بررسی وضعیت درخواست
const checkStatus = async () => {
    if (!props.productId) return;

    try {
        const status = await getStockAlertStatus(props.productId);
        hasRequested.value = status.has_requested || false;

        // اگر محصول موجود شد و درخواست داشت، دکمه مخفی می‌شود
        if (props.isInStock && hasRequested.value) {
            // درخواست قبلی هنوز pending است ولی محصول موجود شده
            // می‌توانیم خودکار لغو کنیم یا به کاربر اطلاع دهیم
            toast.info("این محصول موجود شد!", {
                autoClose: 3000,
            });
        }
    } catch (error) {
        console.error("Error checking stock alert:", error);
    }
};
const route = useRoute()
// ثبت درخواست
const handleRegisterRequest = async () => {
    // کاربر لاگین است؟ (توکن چک شود)
    const token = process.client ? localStorage.getItem("auth-token") : null;

    if (!token) {
        toast.warning("لطفا ابتدا وارد حساب کاربری خود شوید", {
            autoClose: 3000,
        });
        localStorage.setItem('lastPage', route.fullPath)

        // ریدایرکت به صفحه لاگین
        setTimeout(() => {
            loginModal.value = true;
        }, 1000);
        return;
    }

    isLoading.value = true;
    try {
        await registerStockAlert(props.productId);
        hasRequested.value = true;
        toast.success("درخواست شما با موفقیت ثبت شد", {
            autoClose: 3000,
        });
        emit("request-updated", { productId: props.productId, status: "pending" });
    } catch (error) {
        console.error("Error registering stock alert:", error);
        toast.error(error.response?.data?.message || "خطا در ثبت درخواست");
    } finally {
        isLoading.value = false;
    }
};

// لغو درخواست
const handleCancelRequest = async () => {
    if (!hasRequested.value) return;

    isLoading.value = true;
    try {
        await cancelStockAlert(props.productId);
        hasRequested.value = false;
        toast.info("درخواست شما لغو شد", {
            autoClose: 2000,
        });
        emit("request-updated", { productId: props.productId, status: "cancelled" });
    } catch (error) {
        console.error("Error cancelling stock alert:", error);
        toast.error("خطا در لغو درخواست");
    } finally {
        isLoading.value = false;
    }
};

// وقتی محصول ID یا موجودی تغییر کرد، دوباره چک کن
watch(
    () => [props.productId, props.isInStock],
    () => {
        // اگر محصول موجود شد، نیازی به نمایش دکمه نیست
        if (props.isInStock) {
            hasRequested.value = false; // مخفی کردن دکمه
        } else {
            checkStatus(); // بررسی وضعیت برای محصول ناموجود
        }
    },
    { immediate: true }
);

onMounted(() => {
    // فقط اگر محصول ناموجود بود، وضعیت را چک کن
    if (!props.isInStock) {
        checkStatus();
    }
});
</script>