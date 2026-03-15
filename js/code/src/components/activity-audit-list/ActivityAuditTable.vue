
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { MOCK_ACTIVITIES, ACTIVITY_CATEGORIES, type ActivityModel } from '@/data/activity'

const isClient = ref(true)

// Mock pending activities
const pendingActivities = ref<ActivityModel[]>(
  MOCK_ACTIVITIES.filter(a => a.status === 'pending')
)

const getCategoryName = (categoryId: string) => {
  return ACTIVITY_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const handleViewDetail = (activityId: string) => {
  window.location.href = `./activity-detail-view.html?id=${activityId}`
}

onMounted(() => {
  isClient.value = false
  // Simulate API call
  setTimeout(() => {
    isClient.value = true
  }, 100)
})
</script>

<template>
  <div class="bg-white rounded-lg border border-border overflow-hidden shadow-soft">
    <div v-if="pendingActivities.length === 0" class="p-12">
      <EmptyState 
        type="no-tasks"
        actionText="返回工作台"
        actionHref="./admin-dashboard.html"
      />
    </div>

    <div v-else class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow class="bg-accent hover:bg-accent">
            <TableHead class="w-[30%]">活动名称</TableHead>
            <TableHead class="w-[15%]">执行机构</TableHead>
            <TableHead class="w-[12%]">分类</TableHead>
            <TableHead class="w-[12%]">提报时间</TableHead>
            <TableHead class="w-[12%]">活动日期</TableHead>
            <TableHead class="w-[19%] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            v-for="activity in pendingActivities" 
            :key="activity.id"
            class="hover:bg-accent/50 transition-colors"
          >
            <TableCell class="font-medium">
              <div class="line-clamp-2">{{ activity.title }}</div>
            </TableCell>
            <TableCell>
              <span class="text-sm">{{ activity.agencyName }}</span>
            </TableCell>
            <TableCell>
              <Badge variant="outline" class="text-xs">
                {{ getCategoryName(activity.category) }}
              </Badge>
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">
              {{ formatDate(activity.createTime) }}
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">
              {{ formatDate(activity.startDate) }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="handleViewDetail(activity.id)"
                  class="text-xs"
                >
                  <SafeIcon name="Eye" :size="14" class="mr-1" />
                  查看详情
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-xs text-primary hover:text-primary hover:bg-primary/10"
                >
                  <SafeIcon name="ChevronRight" :size="14" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination (optional) -->
    <div v-if="pendingActivities.length > 0" class="flex items-center justify-between px-6 py-4 border-t border-border bg-accent/30">
      <span class="text-sm text-muted-foreground">
        共 {{ pendingActivities.length }} 条记录
      </span>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <SafeIcon name="ChevronLeft" :size="16" />
        </Button>
        <span class="text-sm text-muted-foreground">第 1 页</span>
        <Button variant="outline" size="sm" disabled>
          <SafeIcon name="ChevronRight" :size="16" />
        </Button>
      </div>
    </div>
  </div>
</template>
