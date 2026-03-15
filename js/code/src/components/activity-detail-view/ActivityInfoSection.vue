
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Activity {
  title: string
  startDate: string
  endDate: string
  location: string
  brief: string
  content: string
  category: string
  maxParticipants: number
  currentParticipants: number
  budget?: number
  materials?: string
  contactPerson: string
  contactPhone: string
  contactEmail?: string
}

interface Props {
  activity: Activity
}

defineProps<Props>()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <Card>
<CardHeader class="border-b bg-muted/20">
      <CardTitle class="text-lg flex items-center gap-2">
        <SafeIcon name="Info" :size="20" class="text-primary" />
        提报活动详情
      </CardTitle>
    </CardHeader>
    <CardContent class="p-8 space-y-10">
      <!-- Activity Description & Core Info -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-1 space-y-4">
          <div class="p-4 rounded-xl bg-accent/50 space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5 text-primary">
                <SafeIcon name="Tag" :size="16" />
                <span class="text-xs font-bold uppercase tracking-wider">活动类型</span>
              </div>
              <p class="text-sm font-semibold">{{ activity.category }}</p>
            </div>
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-1.5 text-primary">
                <SafeIcon name="Users" :size="16" />
                <span class="text-xs font-bold uppercase tracking-wider">计划人数</span>
              </div>
              <p class="text-sm font-semibold">{{ activity.maxParticipants }} 人</p>
            </div>
            <Separator />
            <div v-if="activity.budget">
              <div class="flex items-center gap-2 mb-1.5 text-primary">
                <SafeIcon name="CircleDollarSign" :size="16" />
                <span class="text-xs font-bold uppercase tracking-wider">预估预算</span>
              </div>
              <p class="text-sm font-semibold text-secondary">{{ formatCurrency(activity.budget) }}</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 space-y-6">
          <div>
            <h3 class="text-base font-bold mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              活动简介
            </h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ activity.brief }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <SafeIcon name="Calendar" :size="18" class="text-primary" />
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground font-medium uppercase">起止时间</p>
                <p class="text-sm font-medium">{{ formatDate(activity.startDate).split(' ')[0] }} 至 {{ formatDate(activity.endDate).split(' ')[0] }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <SafeIcon name="MapPin" :size="18" class="text-primary" />
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground font-medium uppercase">具体地点</p>
                <p class="text-sm font-medium leading-tight">{{ activity.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Full Description -->
      <div class="space-y-4">
        <h3 class="text-base font-bold flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          详细内容及流程说明
        </h3>
        <div class="bg-muted/30 p-6 rounded-xl border border-dashed border-border">
          <p class="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{{ activity.content }}</p>
        </div>
      </div>

      <!-- Budget & Materials Detail -->
      <div v-if="activity.materials" class="space-y-4">
        <h3 class="text-base font-bold flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          所需物资储备
        </h3>
        <p class="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-border">{{ activity.materials }}</p>
      </div>

      <Separator />

      <!-- Contact Information -->
      <div class="space-y-5">
        <h3 class="text-base font-bold flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          项目执行对接人
        </h3>
        <div class="flex flex-wrap gap-8 items-center py-4 px-6 bg-accent/30 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center border shadow-sm">
              <SafeIcon name="User" :size="24" class="text-primary" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground font-medium">负责人姓名</p>
              <p class="text-base font-bold text-foreground">{{ activity.contactPerson }}</p>
            </div>
          </div>
          <div class="h-10 w-px bg-border hidden md:block"></div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <SafeIcon name="Phone" :size="20" class="text-green-600" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground font-medium">联系电话</p>
              <a :href="`tel:${activity.contactPhone}`" class="text-sm font-bold text-primary hover:underline">
                {{ activity.contactPhone }}
              </a>
            </div>
          </div>
          <div v-if="activity.contactEmail" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <SafeIcon name="Mail" :size="20" class="text-blue-600" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground font-medium">电子邮件</p>
              <a :href="`mailto:${activity.contactEmail}`" class="text-sm font-bold text-primary hover:underline">
                {{ activity.contactEmail }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
