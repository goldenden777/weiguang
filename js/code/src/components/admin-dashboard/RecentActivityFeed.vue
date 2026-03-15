
<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Activity {
  id: string
  title: string
  agency: string
  action: string
  timestamp: string
  type: 'published' | 'pending' | 'offline'
}

interface Props {
  activities: Activity[]
  isClient: boolean
}

defineProps<Props>()

const typeConfig = {
  published: {
    icon: 'CheckCircle',
    color: 'bg-success/10 text-[hsl(142_71%_45%)]',
    label: '已上架',
  },
  pending: {
    icon: 'Clock',
    color: 'bg-primary/10 text-primary',
    label: '待审核',
  },
  offline: {
    icon: 'XCircle',
    color: 'bg-muted text-muted-foreground',
    label: '已下架',
  },
}
</script>

<template>
  <Card class="transition-all duration-300" :class="isClient ? 'opacity-100' : 'opacity-75'">
    <CardHeader>
      <CardTitle>最近活动</CardTitle>
      <CardDescription>平台最近的活动动态</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
        >
          <!-- Icon -->
          <div :class="[typeConfig[activity.type].color, 'p-2 rounded-lg flex-shrink-0']">
            <SafeIcon :name="typeConfig[activity.type].icon" :size="18" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm line-clamp-2">{{ activity.title }}</h4>
            <p class="text-xs text-muted-foreground mt-1">{{ activity.agency }}</p>
            <div class="flex items-center gap-2 mt-2">
              <Badge variant="outline" :class="typeConfig[activity.type].color">
                {{ activity.action }}
              </Badge>
              <span class="text-xs text-muted-foreground">{{ activity.timestamp }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
