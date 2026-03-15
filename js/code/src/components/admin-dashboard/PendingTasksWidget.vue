
<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Task {
  id: string
  title: string
  agency: string
  submittedDate: string
  daysWaiting: number
}

interface Props {
  tasks: Task[]
  isClient: boolean
}

defineProps<Props>()

const emits = defineEmits<{
  viewTask: [taskId: string]
}>()

const getUrgencyColor = (daysWaiting: number) => {
  if (daysWaiting >= 3) return 'bg-destructive/10 text-destructive'
  if (daysWaiting >= 1) return 'bg-secondary/10 text-secondary'
  return 'bg-primary/10 text-primary'
}

const getUrgencyLabel = (daysWaiting: number) => {
  if (daysWaiting >= 3) return '紧急'
  if (daysWaiting >= 1) return '待处理'
  return '新提交'
}
</script>

<template>
<Card class="transition-all duration-300 shadow-sm border-none ring-1 ring-border/40" :class="isClient ? 'opacity-100' : 'opacity-75'">
    <CardHeader class="pb-3 px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CardTitle class="text-base">工作待办</CardTitle>
          <Badge variant="destructive" class="h-5 px-1.5 text-[10px] font-bold">
            {{ tasks.length }}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" class="h-8 text-primary font-medium" @click="emits('viewTask', '')">
          全部处理
        </Button>
      </div>
    </CardHeader>
    <CardContent class="px-6 pb-6">
      <div class="space-y-3">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all cursor-pointer group"
          @click="emits('viewTask', task.id)"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">{{ task.title }}</h4>
            <Badge :class="getUrgencyColor(task.daysWaiting)" variant="outline" class="flex-shrink-0 text-[10px] py-0 px-1.5 h-4">
              {{ getUrgencyLabel(task.daysWaiting) }}
            </Badge>
          </div>
          <p class="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <SafeIcon name="Building" :size="12" />
            {{ task.agency }}
          </p>
          <div class="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
            <span class="text-[10px] font-medium text-muted-foreground bg-white px-2 py-0.5 rounded shadow-sm">
              已等待 {{ task.daysWaiting }} 天
            </span>
            <span class="text-xs font-semibold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              前往审核
              <SafeIcon name="ArrowRight" :size="14" class="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
