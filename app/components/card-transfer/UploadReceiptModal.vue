<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-inner p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">آپلود رسید کارت به کارت</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">تصویر رسید *</label>
          
          <!-- منطقه آپلود فایل -->
          <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer"
               @click="$refs.fileInput.click()"
               @dragover.prevent
               @drop.prevent="handleDrop">
            
            <input type="file" 
                   ref="fileInput"
                   accept="image/*"
                   @change="handleFileSelect"
                   class="hidden" />
            
            <!-- آیکون آپلود -->
            <div v-if="!selectedFile" class="space-y-2">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-gray-600">
                <span class="font-semibold text-yellow-600">برای بارگذاری کلیک کنید</span>
              </p>
              <p class="text-xs text-gray-500">
                فایل‌های مجاز: JPEG, PNG, WebP (حداکثر ۲ مگابایت)
              </p>
            </div>
            
            <!-- نمایش فایل انتخاب شده -->
            <div v-else class="space-y-2">
              <svg class="w-12 h-12 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-green-600 font-medium">
                {{ selectedFile.name }}
              </p>
              <p class="text-xs text-gray-500">
                حجم: {{ (selectedFile.size / 1024).toFixed(1) }} کیلوبایت
              </p>
              <button @click.stop="removeFile" 
                      class="text-xs text-red-500 hover:text-red-700">
                حذف فایل
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">کد پیگیری (اختیاری)</label>
          <input v-model="trackingCode" 
                 type="text" 
                 placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
                 class="w-full border rounded p-2" />
        </div>
        
        <div class="flex gap-3 mt-4">
          <button @click="close" 
                  class="flex-1 px-4 py-2 border rounded hover:bg-gray-50 transition-colors">
            انصراف
          </button>
          <button @click="uploadReceipt" 
                  :disabled="!selectedFile || isUploading"
                  :class="[
                    'flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors',
                    (!selectedFile || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
                  ]">
            <span v-if="isUploading">در حال آپلود...</span>
            <span v-else>آپلود رسید</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  show: Boolean,
  orderId: Number,
});

const emit = defineEmits(['close', 'uploaded']);

const { $api } = useNuxtApp();

const selectedFile = ref(null);
const trackingCode = ref('');
const isUploading = ref(false);
const fileInput = ref(null);

const handleDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    validateAndSetFile(files[0]);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // اعتبارسنجی حجم (حداکثر ۲ مگابایت)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل باید کمتر از ۲ مگابایت باشد');
    fileInput.value.value = '';
    return;
  }
  
  // اعتبارسنجی نوع فایل
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    toast.error('فایل باید تصویر با فرمت JPEG، PNG یا WebP باشد');
    fileInput.value.value = '';
    return;
  }
  
  selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  fileInput.value.value = '';
};

const uploadReceipt = async () => {
  if (!selectedFile.value) {
    toast.error('لطفاً تصویر رسید را انتخاب کنید');
    return;
  }

  isUploading.value = true;

  try {
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    if (trackingCode.value) {
      formData.append('tracking_code', trackingCode.value);
    }

    const response = await $api.post(
      `/front/card-transfer/order/${props.orderId}/upload-receipt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    toast.success(response.data?.message || 'رسید با موفقیت آپلود شد');
    emit('uploaded', response.data.receipt);
    close();

  } catch (err) {
    console.error('خطا در آپلود:', err);
    toast.error(err.response?.data?.message || 'خطا در آپلود رسید');
  } finally {
    isUploading.value = false;
  }
};

const close = () => {
  selectedFile.value = null;
  trackingCode.value = '';
  fileInput.value.value = '';
  emit('close');
};
</script>