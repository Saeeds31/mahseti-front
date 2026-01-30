<template>
    <div class="flex gap-2 justify-center" style="direction: ltr;">
        <input v-for="(digit, index) in otp" :key="index" v-model="otp[index]" type="text" maxlength="1"
            class="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            @input="handleInput($event, index)" @keydown="handleKeydown($event, index)" @paste="handlePaste($event)"
            ref="inputs" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    length: { type: Number, default: 6 } // تعداد ارقام OTP
})

const emit = defineEmits(['update:code'])

const otp = ref(Array(props.length).fill(''))
const inputs = ref([])

watch(otp, (newOtp) => {
    const code = newOtp.join('')
    emit('update:code', code)
}, { deep: true })

const handleInput = (event, index) => {
    const value = event.target.value
    if (value && index < props.length - 1) {
        inputs.value[index + 1].focus()
    }
}

const handleKeydown = (event, index) => {
    if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
        inputs.value[index - 1].focus()
    }
}

const handlePaste = (event) => {
    event.preventDefault()
    const paste = event.clipboardData.getData('text').replace(/\D/g, '')
    if (paste.length >= props.length) {
        otp.value = paste.slice(0, props.length).split('')
        inputs.value[props.length - 1].focus()
    }
}
</script>