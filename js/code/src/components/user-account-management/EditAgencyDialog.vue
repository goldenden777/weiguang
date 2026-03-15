
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
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Agency {
  id: string
  account: string
  name: string
  orgName: string
  email?: string
  phone?: string
  status: 'active' | 'disabled'
  createdAt: string
}

interface Props {
  open: boolean
  agency: Agency
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'updated': [agency: Agency]
}>()

const formData = ref<Agency>({ ...props.agency })
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

watch(() => props.agency, (newAgency) => {
  formData.value = { ...newAgency }
}, { deep: true })

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = '联系人姓名不能为空'
  }
  if (!formData.value.orgName.trim()) {
    errors.value.orgName = '机构名称不能为空'
  }
  if (!formData.value.email?.trim()) {
    errors.value.email = '邮箱不能为空'
  }
  if (!formData.value.phone?.trim()) {
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
    
    emit('updated', formData.value)
    emit('update:open', false)
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenChange = (value: boolean) => {
  if (!value) {
    formData.value = { ...props.agency }
    errors.value = {}
  }
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>编辑执行机构信息</DialogTitle>
        <DialogDescription>
          修改 <span class="font-semibold">{{ agency.account }}</span> 的账号信息
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
