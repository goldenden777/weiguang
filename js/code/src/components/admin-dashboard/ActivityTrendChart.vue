
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface TrendData {
  month: string
  activities: number
  enrollments: number
}

interface Props {
  data: TrendData[]
  isClient: boolean
}

const props = defineProps<Props>()

const maxActivities = ref(Math.max(...props.data.map(d => d.activities)))
const maxEnrollments = ref(Math.max(...props.data.map(d => d.enrollments)))

onMounted(() => {
  maxActivities.value = Math.max(...props.data.map(d => d.activities))
  maxEnrollments.value = Math.max(...props.data.map(d => d.enrollments))
})

const getActivityHeight = (value: number) => {
  return (value / maxActivities.value) * 100
}

const getEnrollmentHeight = (value: number) => {
  return (value / maxEnrollments.value) * 100
}
</script>

<template>
<Card class="transition-all duration-300 shadow-sm border-none ring-1 ring-border/40" :class="isClient ? 'opacity-100' : 'opacity-75'">
    <CardHeader class="border-b border-border/50">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-lg">活跃度趋势分析</CardTitle>
          <CardDescription>最近三个月的公益活动发布与人员报名详情</CardDescription>
        </div>
        <div class="flex bg-slate-100 p-1 rounded-lg">
          <Button variant="ghost" size="sm" class="h-7 text-xs px-3 bg-white shadow-sm">月度</Button>
          <Button variant="ghost" size="sm" class="h-7 text-xs px-3 text-muted-foreground">季度</Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <!-- Chart Legend -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary"></div>
            <span class="text-sm text-muted-foreground">活动数</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-secondary"></div>
            <span class="text-sm text-muted-foreground">报名数</span>
          </div>
        </div>

        <!-- Chart Bars -->
        <div class="flex items-end justify-around gap-4 h-48">
          <div
            v-for="item in data"
            :key="item.month"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <!-- Bars -->
            <div class="flex items-end justify-center gap-1 h-32 w-full">
              <!-- Activities Bar -->
              <div
                class="flex-1 bg-primary/80 rounded-t transition-all duration-300"
                :style="{ height: `${getActivityHeight(item.activities)}%` }"
                :title="`活动: ${item.activities}`"
              ></div>
              <!-- Enrollments Bar -->
              <div
                class="flex-1 bg-secondary/80 rounded-t transition-all duration-300"
                :style="{ height: `${getEnrollmentHeight(item.enrollments)}%` }"
                :title="`报名: ${item.enrollments}`"
              ></div>
            </div>
            <!-- Month Label -->
            <span class="text-xs font-medium text-muted-foreground">{{ item.month }}</span>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p class="text-xs text-muted-foreground">本月活动数</p>
            <p class="text-lg font-semibold">{{ data[data.length - 1].activities }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">本月报名数</p>
            <p class="text-lg font-semibold">{{ data[data.length - 1].enrollments }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
