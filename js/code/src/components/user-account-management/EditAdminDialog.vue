
<script setup lang="ts">
import { ref, watch } from 'vue'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Admin {
  id: string
  account: string
  name: string
  email?: string
  role: 'super_admin' | 'admin_audit' | 'admin_edit'
  status: 'active' | 'disabled'
  createdAt: string
}

interface Props {
  open: boolean
  admin: Admin
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'updated': [admin: Admin]
}>()

const formData = ref<Admin>({ ...props.admin })
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const roleOptions = [
  { value: 'super_admin', label: '超级管理员' },
  { value: 'admin_audit', label: '审核管理员' },
  { value: 'admin_edit', label: '编辑管理员' },
]

watch(() => props.admin, (newAdmin) => {
  formData.value = { ...newAdmin }
}, { deep: true })

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = '姓名不能为空'
  }
  if (!formData.value.email?.trim()) {
    errors.value.email = '邮箱不能为空'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('updated', formData.value)
    emit('update:open', false)
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenChange = (value: boolean) => {
  if (!value) {
    formData.value = { ...props.admin }
    errors.value = {}
  }
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>编辑管理员信息</DialogTitle>
        <DialogDescription>
          修改 <span class="font-semibold">{{ admin.account }}</span> 的账号信息和权限
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 账号（只读） -->
        <div class="space-y-2">
          <Label for="account">账号</Label>
          <Input
            id="account"
            :value="formData.account"
            disabled
            class="bg-muted"
          />
        </div>

        <!-- 姓名 -->
        <div class="space-y-2">
          <Label for="name">姓名</Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="输入姓名"
            :class="{ 'border-destructive': errors.name }"
          />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- 邮箱 -->
        <div class="space-y-2">
          <Label for="email">邮箱</Label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="输入邮箱地址"
            :class="{ 'border-destructive': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
        </div>

        <!-- 角色 -->
        <div class="space-y-2">
          <Label for="role">管理员角色</Label>
          <Select v-model="formData.role">
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
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
            {{ isSubmitting ? '保存中...' : '保存修改' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
