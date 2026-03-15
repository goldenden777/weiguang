
<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormData {
  contactPerson: string
  contactPhone: string
  contactEmail: string
}

interface Props {
  modelValue: FormData
  errors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: FormData]
}>()

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const updateField = (field: keyof FormData, value: string) => {
  formData.value = {
    ...formData.value,
    [field]: value,
  }
}

const isValidPhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>

<template>
<div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Person Name -->
      <div class="space-y-2">
        <Label for="apf-contact-person" class="text-base">对接人名称 <span class="text-destructive">*</span></Label>
      <Input
        id="apf-contact-person"
        v-model="formData.contactPerson"
        placeholder="请输入对接人的真实姓名"
        @input="updateField('contactPerson', $event.target.value)"
      />
      <p class="text-sm text-muted-foreground">活动期间的主要联系人</p>
      <p v-if="props.errors?.contactPerson" class="text-sm text-destructive">
        {{ props.errors.contactPerson }}
      </p>
    </div>

<!-- Contact Phone -->
      <div class="space-y-2">
        <Label for="apf-contact-phone" class="text-base">对接人电话 <span class="text-destructive">*</span></Label>
        <Input
          id="apf-contact-phone"
          v-model="formData.contactPhone"
          type="tel"
          placeholder="请输入对接人的手机号码"
          @input="updateField('contactPhone', $event.target.value)"
        />
        <p v-if="props.errors?.contactPhone" class="text-sm text-destructive">
          {{ props.errors.contactPhone }}
        </p>
        <p v-else-if="formData.contactPhone && !isValidPhone(formData.contactPhone)" class="text-sm text-destructive">
          请输入有效的手机号码
        </p>
      </div>
    </div>

    <!-- Contact Email -->
    <div class="space-y-2">
      <Label for="apf-contact-email" class="text-base">对接人邮箱</Label>
      <Input
        id="apf-contact-email"
        v-model="formData.contactEmail"
        type="email"
        placeholder="请输入对接人的常用电子邮箱（选填）"
        @input="updateField('contactEmail', $event.target.value)"
      />
      <p v-if="formData.contactEmail && !isValidEmail(formData.contactEmail)" class="text-sm text-destructive">
        请输入有效的邮箱地址
      </p>
    </div>
  </div>
</template>
