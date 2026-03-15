
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  setTimeout(() => {
    isClient.value = true
  }, 100)
})
</script>

<template>
  <div v-if="pendingActivities.length === 0" class="py-12">
    <EmptyState 
      type="no-tasks"
      actionText="返回工作台"
      actionHref="./admin-dashboard.html"
    />
  </div>

  <div v-else class="space-y-4">
    <Card 
      v-for="activity in pendingActivities"
      :key="activity.id"
      class="overflow-hidden hover:shadow-card transition-shadow"
    >
      <CardHeader class="pb-3">
        <div class="flex items-start justify-between gap-2">
          <CardTitle class="text-base line-clamp-2">{{ activity.title }}</CardTitle>
          <Badge variant="outline" class="text-xs flex-shrink-0">
            {{ getCategoryName(activity.category) }}
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="pb-3 space-y-3">
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2 text-muted-foreground">
            <SafeIcon name="Building2" :size="16" />
            <span>{{ activity.agencyName }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <SafeIcon name="Calendar" :size="16" />
            <span>提报于 {{ formatDate(activity.createTime) }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <SafeIcon name="Clock" :size="16" />
            <span>活动日期 {{ formatDate(activity.startDate) }}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter class="pt-3 border-t border-border">
        <Button
          variant="default"
          size="sm"
          class="w-full"
          @click="handleViewDetail(activity.id)"
        >
          <SafeIcon name="Eye" :size="16" class="mr-2" />
          查看详情并审核
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
