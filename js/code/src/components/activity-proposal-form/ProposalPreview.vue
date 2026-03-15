<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { ACTIVITY_CATEGORIES } from '@/data/activity'

interface FormData {
  title: string
  category: string
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  brief: string
  purpose: string
  process: string
  precautions: string
  budget: number
  materials: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
}

const props = defineProps<{ formData: FormData }>()

const categoryName = computed(() => {
  if (!props.formData.category) return '未选择'
  const cat = ACTIVITY_CATEGORIES.find(c => c.id === props.formData.category)
  return cat?.name ?? props.formData.category
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '未选择'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  if (!amount || amount <= 0) return '未填写'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}

const fullContent = computed(() => {
  const parts = []
  if (props.formData.purpose) parts.push('活动目的：\n' + props.formData.purpose)
  if (props.formData.process) parts.push('活动流程：\n' + props.formData.process)
  if (props.formData.precautions) parts.push('注意事项：\n' + props.formData.precautions)
  return parts.join('\n\n') || '暂无详细内容'
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center gap-2 text-muted-foreground text-sm mb-4">
      <SafeIcon name="Eye" :size="18" />
      <span>以下为活动在门户/详情页的呈现效果，便于核对填报内容。</span>
    </div>

    <!-- 封面占位 -->
    <div class="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-dashed border-border">
      <div class="text-center text-muted-foreground text-sm">
        <SafeIcon name="Image" :size="48" class="mx-auto mb-2 opacity-50" />
        <p>封面图将在附件上传后于审核/发布时展示</p>
      </div>
      <Badge class="absolute top-3 right-3 bg-primary/90">预览</Badge>
    </div>

    <!-- 标题与基础信息 -->
    <Card class="border-l-4 border-l-primary">
      <CardHeader class="pb-3">
        <CardTitle class="text-xl font-bold leading-tight">
          {{ formData.title || '（未填写活动标题）' }}
        </CardTitle>
        <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
          <span class="inline-flex items-center gap-1.5">
            <SafeIcon name="Tag" :size="14" />
            {{ categoryName }}
          </span>
          <span v-if="formData.startDate || formData.endDate" class="inline-flex items-center gap-1.5">
            <SafeIcon name="Calendar" :size="14" />
            {{ formatDate(formData.startDate) }} 至 {{ formatDate(formData.endDate) }}
          </span>
          <span v-if="formData.maxParticipants > 0" class="inline-flex items-center gap-1.5">
            <SafeIcon name="Users" :size="14" />
            限 {{ formData.maxParticipants }} 人
          </span>
        </div>
        <p v-if="formData.location" class="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <SafeIcon name="MapPin" :size="14" />
          {{ formData.location }}
        </p>
      </CardHeader>
    </Card>

    <!-- 活动简介 -->
    <Card v-if="formData.brief">
      <CardHeader class="py-4">
        <CardTitle class="text-base flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          活动简介
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{{ formData.brief }}</p>
      </CardContent>
    </Card>

    <!-- 详细内容 -->
    <Card>
      <CardHeader class="py-4">
        <CardTitle class="text-base flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          详细内容及流程说明
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
          <p class="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{{ fullContent }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- 预算与物资 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card v-if="formData.budget > 0">
        <CardContent class="py-4">
          <p class="text-xs text-muted-foreground font-medium uppercase mb-1">预估预算</p>
          <p class="text-lg font-semibold text-primary">{{ formatCurrency(formData.budget) }}</p>
        </CardContent>
      </Card>
      <Card v-if="formData.materials">
        <CardContent class="py-4">
          <p class="text-xs text-muted-foreground font-medium uppercase mb-1">所需物资</p>
          <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ formData.materials }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- 对接人 -->
    <Card v-if="formData.contactPerson || formData.contactPhone">
      <CardHeader class="py-4">
        <CardTitle class="text-base flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          项目执行对接人
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="flex flex-wrap gap-6 items-center py-3 px-4 bg-accent/30 rounded-xl">
          <div v-if="formData.contactPerson" class="flex items-center gap-3">
            <SafeIcon name="User" :size="20" class="text-primary" />
            <div>
              <p class="text-xs text-muted-foreground">负责人</p>
              <p class="font-medium">{{ formData.contactPerson }}</p>
            </div>
          </div>
          <div v-if="formData.contactPhone" class="flex items-center gap-3">
            <SafeIcon name="Phone" :size="20" class="text-primary" />
            <div>
              <p class="text-xs text-muted-foreground">电话</p>
              <p class="font-medium">{{ formData.contactPhone }}</p>
            </div>
          </div>
          <div v-if="formData.contactEmail" class="flex items-center gap-3">
            <SafeIcon name="Mail" :size="20" class="text-primary" />
            <div>
              <p class="text-xs text-muted-foreground">邮箱</p>
              <p class="font-medium text-sm">{{ formData.contactEmail }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <p class="text-xs text-muted-foreground text-center pt-4 border-t">
      预览随表单内容实时更新，提交前请在此核对信息是否正确。
    </p>
  </div>
</template>
