
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { SMS_CONFIG, REGISTER_UI_TEXT } from '@/data/auth'

// UI State Control (1→0→1 Process)
const isClient = ref(true)

// Form State
const phone = ref('')
const verificationCode = ref('')
const step = ref<'phone' | 'code'>('phone')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

// SMS Countdown
const countdown = ref(0)
const isCountingDown = computed(() => countdown.value > 0)

// Form Validation
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone.value)
})

const isCodeValid = computed(() => {
  return verificationCode.value.length === 6
})

const canSubmit = computed(() => {
  return step.value === 'phone' ? isPhoneValid.value : isCodeValid.value
})

// Mock SMS Send
const sendVerificationCode = async () => {
  if (!isPhoneValid.value) {
    error.value = '请输入有效的手机号码'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Start countdown
    countdown.value = SMS_CONFIG.countdownSeconds
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    step.value = 'code'
  } catch (err) {
    error.value = '发送验证码失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// Mock Verification
const verifyCode = async () => {
  if (!isCodeValid.value) {
    error.value = '请输入6位验证码'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock verification - in real app, compare with server
    if (verificationCode.value === SMS_CONFIG.mockCode) {
      success.value = true
      
      // Redirect after 1.5s
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = './page-2651560.html'
        }
      }, 1500)
    } else {
      error.value = '验证码错误，请重新输入'
      verificationCode.value = ''
    }
  } catch (err) {
    error.value = '验证失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// Handle Submit
const handleSubmit = async () => {
  if (step.value === 'phone') {
    await sendVerificationCode()
  } else {
    await verifyCode()
  }
}

// Go Back to Phone Input
const goBackToPhone = () => {
  step.value = 'phone'
  verificationCode.value = ''
  error.value = ''
  countdown.value = 0
}

// Handle Return to Home
const returnToHome = () => {
  if (typeof window !== 'undefined') {
    window.location.href = './home.html'
  }
}

// SSG → Hydration → Client Enhancement
onMounted(() => {
  // State 0: Pre-client state
  isClient.value = false
  phone.value = ''
  verificationCode.value = ''
  step.value = 'phone'
  error.value = ''
  success.value = false
  countdown.value = 0

  // State 1: Client enhancement
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Success State -->
    <div
      v-if="success || (isClient && success)"
      class="space-y-8 text-center py-16 px-4"
    >
      <div class="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <SafeIcon name="CheckCircle" :size="40" class="text-success" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-bold tracking-tight">注册成功！</h2>
        <p class="text-sm text-muted-foreground leading-relaxed">正在为您准备个人空间，请稍候...</p>
      </div>
    </div>

    <!-- Form State -->
    <div v-else class="space-y-8">
      <!-- Phone Input Step -->
<div v-if="step === 'phone' || (isClient && step === 'phone')" class="space-y-6 animate-in fade-in duration-300">
        <div class="space-y-3">
          <Label for="phone" class="text-sm font-semibold inline-block text-foreground/70">手机号码</Label>
          <Input
            id="phone"
            v-model="phone"
            type="tel"
            :placeholder="REGISTER_UI_TEXT.phonePlaceholder"
            class="h-12 text-base px-4 border-muted-foreground/20 focus:border-primary transition-all shadow-sm"
            :disabled="isLoading"
            @keyup.enter="handleSubmit"
          />
          <p class="text-xs text-muted-foreground/60 leading-relaxed lg:whitespace-nowrap">
            我们将保护您的隐私安全，验证码将以短信形式发送。
          </p>
        </div>

        <!-- Error Alert -->
        <Alert v-if="error || (isClient && error)" variant="destructive" class="py-3 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <SafeIcon name="AlertCircle" :size="16" class="mt-0.5" />
          <AlertDescription class="text-xs font-medium pl-1">{{ error }}</AlertDescription>
        </Alert>

        <!-- Actions -->
        <div class="space-y-3 pt-2">
          <Button
            @click="handleSubmit"
            :disabled="!canSubmit || isLoading"
            class="w-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-all"
          >
            <SafeIcon v-if="isLoading" name="Loader2" :size="18" class="mr-2 animate-spin" />
            {{ isLoading ? '正在发送...' : REGISTER_UI_TEXT.sendCodeBtn }}
          </Button>

          <Button
            variant="outline"
            @click="returnToHome"
            class="w-full h-12 text-sm font-medium border-muted-foreground/20 text-muted-foreground hover:bg-muted"
          >
            返回门户首页
          </Button>
        </div>
      </div>

      <!-- Code Verification Step -->
      <div v-if="step === 'code' || (isClient && step === 'code')" class="space-y-6 animate-in fade-in duration-300">
        <!-- Back Button -->
        <button
          @click="goBackToPhone"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-all mt-[-8px] pl-1"
        >
          <SafeIcon name="ArrowLeft" :size="14" />
          返回修改手机号
        </button>

<div class="space-y-4">
          <div class="space-y-1.5">
            <Label for="code" class="text-sm font-semibold text-foreground/70">短信验证码</Label>
            <p class="text-[13px] text-muted-foreground">
              验证码已发送至 <span class="font-medium text-foreground tracking-tight">+86 {{ phone }}</span>
            </p>
          </div>
          
          <Input
            id="code"
            v-model="verificationCode"
            type="text"
            :placeholder="REGISTER_UI_TEXT.codePlaceholder"
            maxlength="6"
            class="h-14 text-2xl tracking-[0.3em] text-center px-4 border-muted-foreground/20 focus:border-primary shadow-sm"
            :disabled="isLoading"
            @keyup.enter="handleSubmit"
          />
        </div>

        <!-- Resend Code -->
        <div class="text-center bg-muted/30 py-3 rounded-lg border border-dashed border-muted-foreground/10">
          <button
            v-if="!isCountingDown || isClient && !isCountingDown"
            @click="sendVerificationCode"
            :disabled="isLoading"
            class="text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground"
          >
            重新发送验证码
          </button>
          <p v-else class="text-sm text-muted-foreground">
            {{ countdown }}秒后可重新发送
          </p>
        </div>

        <!-- Error Alert -->
        <Alert v-if="error || isClient && error" variant="destructive" class="animate-in fade-in slide-in-from-top-2 duration-200">
          <SafeIcon name="AlertCircle" :size="16" />
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <!-- Submit Button -->
        <Button
          @click="handleSubmit"
          :disabled="!canSubmit || isLoading"
          class="w-full h-12 text-base font-medium"
        >
          <SafeIcon v-if="isLoading" name="Loader2" :size="18" class="mr-2 animate-spin" />
          {{ isLoading ? '验证中...' : REGISTER_UI_TEXT.submitBtn }}
        </Button>
      </div>

      <!-- Mock Code Hint (Development Only) -->
      <div v-if="isClient && step === 'code'" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-xs text-amber-800">
          <strong>测试提示：</strong>验证码为 <code class="font-mono font-bold">{{ SMS_CONFIG.mockCode }}</code>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for step changes */
.animate-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
