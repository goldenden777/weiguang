
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ActivityModel } from '@/data/activity'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { submitEnrollment } from '@/services/enrollment.service'

interface Props {
  activity: ActivityModel
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Form validation schema
const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, '姓名至少2个字符').max(50, '姓名不超过50个字符'),
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
    idCard: z.string().optional(),
    participantCount: z.number().min(1, '参与人数至少1人').max(10, '参与人数不超过10人'),
    remark: z.string().optional(),
    agreeDisclaimer: z.boolean().refine(v => v === true, '必须同意免责声明'),
  })
)

const { handleSubmit, values, resetForm, setFieldValue, setFieldError, validateField } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    phone: '',
    idCard: '',
    participantCount: 1,
    remark: '',
    agreeDisclaimer: false,
  },
})

const clearDisclaimerError = () => {
  nextTick(async () => {
    setFieldError('agreeDisclaimer', undefined)
    await validateField('agreeDisclaimer')
  })
}

const toggleDisclaimer = () => {
  const next = !values.agreeDisclaimer
  setFieldValue('agreeDisclaimer', next)
  if (next) clearDisclaimerError()
}

const onDisclaimerChecked = (checked: boolean) => {
  setFieldValue('agreeDisclaimer', !!checked)
  if (checked) clearDisclaimerError()
}

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const enrollmentNumber = ref('')

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  
  try {
    const { enrollmentId } = await submitEnrollment(props.activity.id, {
      activityId: props.activity.id,
      userName: values.name,
      userPhone: values.phone,
      idCard: values.idCard || undefined,
      participantCount: Number(values.participantCount),
      remark: values.remark || undefined,
    })
    enrollmentNumber.value = enrollmentId
    
    submitSuccess.value = true
  } catch (error) {
    console.error('Enrollment failed:', error)
  } finally {
    isSubmitting.value = false
  }
})

watch(() => props.open, (newVal) => {
  if (!newVal) {
    resetForm()
    submitSuccess.value = false
  }
})

const goHome = () => {
  if (typeof window === 'undefined') return
  window.location.href = './home.html'
}

const closeManually = () => {
  resetForm()
  submitSuccess.value = false
  emit('close')
}
</script>

<template>
<Dialog :open="open" @update:open="(val) => !val && emit('close')">
    <DialogContent class="max-w-[calc(100%-2rem)] w-full rounded-2xl mx-auto md:max-w-md">
      <!-- Success State -->
      <template v-if="submitSuccess">
        <DialogHeader class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <SafeIcon name="CheckCircle" :size="32" class="text-success" />
            </div>
          </div>
          <DialogTitle class="text-center">报名成功！</DialogTitle>
          <DialogDescription class="text-center">
            <p class="mt-2">工作人员将尽快与您联系</p>
            <p class="mt-4 font-semibold text-foreground">
              报名编号：<span class="text-primary">{{ enrollmentNumber }}</span>
            </p>
            <p class="text-xs text-muted-foreground mt-2">请妥善保管，用于查询报名状态</p>
          </DialogDescription>
        </DialogHeader>

        <div class="mt-6 space-y-3">
          <Button type="button" class="w-full" @click="goHome">
            <SafeIcon name="Home" :size="16" class="mr-2" />
            回到首页
          </Button>
          <Button type="button" variant="outline" class="w-full" @click="closeManually">
            我知道了（关闭）
          </Button>
        </div>
      </template>

      <!-- Form State -->
      <template v-else>
        <DialogHeader>
          <DialogTitle>报名参加活动</DialogTitle>
          <DialogDescription>
            {{ activity.title }}
          </DialogDescription>
        </DialogHeader>

        <form @submit="onSubmit" class="space-y-4">
          <!-- Name Field -->
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>姓名 <span class="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  placeholder="请输入您的姓名"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Phone Field -->
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>手机号 <span class="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  placeholder="请输入您的手机号"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- ID Card Field -->
          <FormField v-slot="{ componentField }" name="idCard">
            <FormItem>
              <FormLabel>身份证号（可选）</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  placeholder="请输入您的身份证号"
                  type="text"
                />
              </FormControl>
              <FormDescription>用于核实身份，信息将被加密保存</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Participant Count Field -->
          <FormField v-slot="{ componentField }" name="participantCount">
            <FormItem>
              <FormLabel>参与人数 <span class="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  placeholder="1"
                  type="number"
                  min="1"
                  max="10"
                />
              </FormControl>
              <FormDescription>最多可报名10人</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Remark Field -->
          <FormField v-slot="{ componentField }" name="remark">
            <FormItem>
              <FormLabel>备注（可选）</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  placeholder="如有特殊需求或说明，请在此填写"
                  class="resize-none"
                  rows="3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Disclaimer Checkbox（显式绑定 checked/update:checked，避免 vee-validate 与 reka-ui 绑定不匹配导致无法点击） -->
          <FormField name="agreeDisclaimer">
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  :checked="!!values.agreeDisclaimer"
                  class="cursor-pointer shrink-0 mt-0.5 h-5 w-5 rounded-full"
                  @update:checked="onDisclaimerChecked"
                  @click.stop="toggleDisclaimer"
                />
              </FormControl>
              <div
                class="space-y-1 leading-none text-sm font-normal cursor-pointer flex-1 select-none"
                role="button"
                tabindex="0"
                aria-label="同意免责声明"
                @click="toggleDisclaimer"
                @keydown.enter.space.prevent="toggleDisclaimer"
              >
                我已阅读并同意
                <a href="./disclaimer.html" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline" @click.stop>《免责声明》</a>
                <span class="text-destructive">*</span>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            class="w-full"
            :disabled="isSubmitting"
          >
            <SafeIcon v-if="isSubmitting" name="Loader2" :size="18" class="mr-2 animate-spin" />
            {{ isSubmitting ? '提交中...' : '提交报名' }}
          </Button>

          <!-- Cancel Button -->
          <Button 
            type="button"
            variant="outline"
            class="w-full"
            @click="emit('close')"
            :disabled="isSubmitting"
          >
            取消
          </Button>
        </form>
      </template>
    </DialogContent>
  </Dialog>
</template>
