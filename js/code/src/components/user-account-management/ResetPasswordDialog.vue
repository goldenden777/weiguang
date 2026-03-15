
<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Agency {
  id: string
  account: string
  name: string
  orgName?: string
}

interface Admin {
  id: string
  account: string
  name: string
}

interface Props {
  open: boolean
  agency?: Agency
  admin?: Admin
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const user = props.agency || props.admin

const validateForm = () => {
  errors.value = {}
  
  if (!newPassword.value.trim()) {
    errors.value.newPassword = '新密码不能为空'
  }
  if (newPassword.value.length < 6) {
    errors.value.newPassword = '密码至少6个字符'
  }
  if (!confirmPassword.value.trim()) {
    errors.value.confirmPassword = '确认密码不能为空'
  }
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = '两次输入的密码不一致'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    newPassword.value = ''
    confirmPassword.value = ''
    emit('update:open', false)
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenChange = (value: boolean) => {
  if (!value) {
    newPassword.value = ''
    confirmPassword.value = ''
    errors.value = {}
  }
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>重置密码</DialogTitle>
        <DialogDescription>
          为 <span class="font-semibold">{{ user?.account }}</span> 重置登录密码
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 新密码 -->
        <div class="space-y-2">
          <Label for="newPassword">新密码</Label>
          <Input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="输入新密码"
            :class="{ 'border-destructive': errors.newPassword }"
          />
          <p v-if="errors.newPassword" class="text-xs text-destructive">{{ errors.newPassword }}</p>
        </div>

        <!-- 确认密码 -->
        <div class="space-y-2">
          <Label for="confirmPassword">确认密码</Label>
          <Input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="再次输入新密码"
            :class="{ 'border-destructive': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="text-xs text-destructive">{{ errors.confirmPassword }}</p>
        </div>

        <!-- 提示 -->
        <div class="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground">
          <div class="flex gap-2">
            <SafeIcon name="AlertCircle" :size="16" class="flex-shrink-0 mt-0.5" />
            <p>密码重置后，用户需要使用新密码重新登录</p>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            @click="handleOpenChange(false)"
            :disabled="isSubmitting"
          >
            取消
          </Button>
          <Button
            type="submit"
            :disabled="isSubmitting"
            class="gap-2"
          >
            <SafeIcon v-if="isSubmitting" name="Loader2" :size="16" class="animate-spin" />
            {{ isSubmitting ? '重置中...' : '确认重置' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
