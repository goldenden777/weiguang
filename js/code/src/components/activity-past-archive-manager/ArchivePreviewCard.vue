
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { ActivityModel } from '@/data/activity'

interface Props {
  activity: ActivityModel
}

defineProps<Props>()

const getCategoryLabel = (categoryId: string) => {
  const categories: Record<string, string> = {
    elderly: '助老服务',
    education: '助学兴教',
    environment: '生态环保',
    community: '社区服务',
    medical: '医疗卫生',
  }
  return categories[categoryId] || categoryId
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
<Card class="sticky top-24">
    <CardHeader class="pb-3">
      <CardTitle class="text-lg">活动信息</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- 活动封面 -->
      <div class="aspect-video rounded-lg overflow-hidden bg-muted">
        <img
          v-if="activity.coverImage"
          :src="activity.coverImage"
          :alt="activity.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <SafeIcon name="Image" :size="32" class="text-muted-foreground" />
        </div>
      </div>

      <!-- 活动标题 -->
      <div>
        <h3 class="font-semibold text-base line-clamp-2">{{ activity.title }}</h3>
      </div>

      <!-- 活动分类 -->
      <div>
        <Badge variant="outline">
          {{ getCategoryLabel(activity.category) }}
        </Badge>
      </div>

      <!-- 活动信息 -->
      <div class="space-y-3 text-sm">
        <!-- 执行机构 -->
        <div class="flex items-start gap-3">
          <SafeIcon name="Building2" :size="16" class="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-muted-foreground text-xs">执行机构</p>
<p class="font-medium truncate text-sm lg:text-base">{{ activity.agencyName }}</p>
          </div>
        </div>

        <!-- 活动日期 -->
        <div class="flex items-start gap-3">
          <SafeIcon name="Calendar" :size="16" class="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-muted-foreground text-xs">活动日期</p>
            <p class="font-medium text-sm lg:text-base">
              {{ formatDate(activity.startDate) }}
              <span v-if="activity.startDate !== activity.endDate">
                至 {{ formatDate(activity.endDate) }}
              </span>
            </p>
          </div>
        </div>

        <!-- 活动地点 -->
        <div class="flex items-start gap-3">
          <SafeIcon name="MapPin" :size="16" class="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-muted-foreground text-xs">活动地点</p>
            <p class="font-medium line-clamp-2">{{ activity.location }}</p>
          </div>
        </div>

        <!-- 参与人数 -->
        <div class="flex items-start gap-3">
          <SafeIcon name="Users" :size="16" class="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-muted-foreground text-xs">参与人数</p>
            <p class="font-medium">
              {{ activity.currentParticipants }} / {{ activity.maxParticipants }} 人
            </p>
          </div>
        </div>

        <!-- 联系人 -->
        <div class="flex items-start gap-3">
          <SafeIcon name="Phone" :size="16" class="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-muted-foreground text-xs">联系人</p>
            <p class="font-medium">{{ activity.contactPerson }}</p>
            <p class="text-xs text-muted-foreground">{{ activity.contactPhone }}</p>
          </div>
        </div>
      </div>

      <!-- 活动简介 -->
      <div class="pt-3 border-t border-border">
        <p class="text-muted-foreground text-xs mb-2">活动简介</p>
        <p class="text-sm line-clamp-3">{{ activity.brief }}</p>
      </div>
    </CardContent>
  </Card>
</template>
