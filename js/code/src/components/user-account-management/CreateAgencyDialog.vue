
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
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  open: boolean
}

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const formData = ref({
  account: '',
  password: '',
  name: '',
  orgName: '',
  email: '',
  phone: '',
  description: '',
})

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.account.trim()) {
    errors.value.account = '账号不能为空'
  }
  if (!formData.value.password.trim()) {
    errors.value.password = '密码不能为空'
  }
  if (formData.value.password.length < 6) {
    errors.value.password = '密码至少6个字符'
  }
  if (!formData.value.name.trim()) {
    errors.value.name = '联系人姓名不能为空'
  }
  if (!formData.value.orgName.trim()) {
    errors.value.orgName = '机构名称不能为空'
  }
  if (!formData.value.email.trim()) {
    errors.value.email = '邮箱不能为空'
  }
  if (!formData.value.phone.trim()) {
    errors.value.phone = '电话不能为空'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重置表单
    formData.value = {
      account: '',
      password: '',
      name: '',
      orgName: '',
      email: '',
      phone: '',
      description: '',
    }
    
    emit('update:open', false)
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenChange = (value: boolean) => {
  if (!value) {
    formData.value = {
      account: '',
      password: '',
      name: '',
      orgName: '',
      email: '',
      phone: '',
      description: '',
    }
    errors.value = {}
  }
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>创建执行机构账号</DialogTitle>
        <DialogDescription>
          填写以下信息为执行机构创建新的登录账号
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 账号 -->
        <div class="space-y-2">
          <Label for="account">账号</Label>
          <Input
            id="account"
            v-model="formData.account"
            placeholder="输入账号"
            :class="{ 'border-destructive': errors.account }"
          />
          <p v-if="errors.account" class="text-xs text-destructive">{{ errors.account }}</p>
        </div>

        <!-- 密码 -->
        <div class="space-y-2">
          <Label for="password">初始密码</Label>
          <Input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="输入初始密码"
            :class="{ 'border-destructive': errors.password }"
          />
          <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
        </div>

        <!-- 联系人姓名 -->
        <div class="space-y-2">
          <Label for="name">联系人姓名</Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="输入联系人姓名"
            :class="{ 'border-destructive': errors.name }"
          />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- 机构名称 -->
        <div class="space-y-2">
          <Label for="orgName">机构名称</Label>
          <Input
            id="orgName"
            v-model="formData.orgName"
            placeholder="输入机构名称"
            :class="{ 'border-destructive': errors.orgName }"
          />
          <p v-if="errors.orgName" class="text-xs text-destructive">{{ errors.orgName }}</p>
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

        <!-- 电话 -->
        <div class="space-y-2">
          <Label for="phone">电话</Label>
          <Input
            id="phone"
            v-model="formData.phone"
            placeholder="输入联系电话"
            :class="{ 'border-destructive': errors.phone }"
          />
          <p v-if="errors.phone" class="text-xs text-destructive">{{ errors.phone }}</p>
        </div>

        <!-- 机构描述 -->
        <div class="space-y-2">
          <Label for="description">机构描述（可选）</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="输入机构简介"
            rows="3"
          />
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
            {{ isSubmitting ? '创建中...' : '创建账号' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
