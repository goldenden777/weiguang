
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'

import { setCurrentUser } from '@/lib/auth'
import { login as apiLogin } from '@/services/auth.service'

// Form state
const account = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const isClient = ref(true)
const rememberMe = ref(false)

const handleLogin = async () => {
  error.value = ''
  if (!account.value.trim()) {
    error.value = '请输入账号'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  isLoading.value = true
  try {
    const result = await apiLogin({ account: account.value, password: password.value })
    if (!result.success || !result.user) {
      error.value = result.message ?? '登录失败'
      return
    }
    if (typeof window !== 'undefined') {
      if (rememberMe.value) {
        localStorage.setItem('rememberedAccount', account.value)
      } else {
        localStorage.removeItem('rememberedAccount')
      }
      setCurrentUser(result.user)
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const defaultUrl = result.user.role === 'admin' ? './admin-dashboard.html' : './agency-dashboard.html'
      let targetUrl = defaultUrl
      if (redirect) {
        try {
          const ok = redirect.startsWith(window.location.origin) ||
            redirect.startsWith('./') ||
            (redirect.startsWith('/') && !redirect.startsWith('//'))
          if (ok) targetUrl = redirect
        } catch {
          /* 忽略无效 redirect */
        }
      }
      window.location.href = targetUrl
    }
  } finally {
    isLoading.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !isLoading.value) {
    handleLogin()
  }
}

onMounted(() => {
  // Client-side initialization
  isClient.value = false
  
// Clear sensitive data on mount
  password.value = ''
  
  // Restore remembered account
  if (typeof window !== 'undefined') {
    const savedAccount = localStorage.getItem('rememberedAccount')
    if (savedAccount) {
      account.value = savedAccount
      rememberMe.value = true
    }
  }

  // Restore client state
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <Card class="shadow-2xl border-white/20 bg-white/95 backdrop-blur-xl">
    <CardHeader class="space-y-2 pb-4">
      <div class="flex items-center justify-center mb-2">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <SafeIcon name="Heart" :size="32" color="white" :stroke-width="2.5" />
        </div>
      </div>
      <CardTitle class="text-center text-2xl font-bold tracking-tight">微光公益</CardTitle>
      <CardDescription class="text-center text-muted-foreground/80">后台管理系统登录</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Error Alert -->
      <Alert v-if="(error || !isClient)" variant="destructive" class="opacity-0 transition-opacity" :class="{ 'opacity-100': error && isClient }">
        <SafeIcon name="AlertCircle" :size="16" class="mr-2" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Account Input -->
        <div class="space-y-2">
          <Label for="account">账号</Label>
          <Input
            id="account"
            v-model="account"
            type="text"
            placeholder="请输入账号"
            :disabled="isLoading"
            @keydown="handleKeyDown"
            class="transition-all"
          />
          <p class="text-xs text-muted-foreground">
            演示账号：admin_root 或 weiguang_org
          </p>
        </div>

        <!-- Password Input -->
        <div class="space-y-2">
          <Label for="password">密码</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            :disabled="isLoading"
            @keydown="handleKeyDown"
            class="transition-all"
          />
          <p class="text-xs text-muted-foreground">
            演示密码：admin123 或 agency123
          </p>
        </div>

<!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center space-x-2">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
            />
            <Label for="remember" class="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              记住账号
            </Label>
          </div>
          <button type="button" class="text-xs text-primary hover:underline transition-all">
            忘记密码？
          </button>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full"
          :disabled="isLoading"
          size="lg"
        >
          <SafeIcon v-if="isLoading" name="Loader2" :size="18" class="mr-2 animate-spin" />
          {{ isLoading ? '登录中...' : '登录' }}
        </Button>
      </form>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-card px-2 text-muted-foreground">或</span>
        </div>
      </div>

      <!-- Demo Info -->
      <div class="bg-accent rounded-lg p-4 space-y-3">
        <h3 class="font-semibold text-sm">演示账号信息</h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-start gap-2">
            <SafeIcon name="Shield" :size="16" class="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">管理员账号</p>
              <p class="text-muted-foreground">账号：admin_root</p>
              <p class="text-muted-foreground">密码：admin123</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <SafeIcon name="Building2" :size="16" class="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">执行机构账号</p>
              <p class="text-muted-foreground">账号：weiguang_org</p>
              <p class="text-muted-foreground">密码：agency123</p>
            </div>
          </div>
        </div>
      </div>

<!-- Support Link -->
      <div class="text-center pt-2">
        <a href="#" class="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
          <SafeIcon name="HelpCircle" :size="12" class="mr-1" />
          遇到问题？联系技术支持
        </a>
      </div>
    </CardContent>
  </Card>
</template>
