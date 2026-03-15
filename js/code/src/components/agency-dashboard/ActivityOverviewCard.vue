
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { ActivityModel } from '@/data/activity'

interface Props {
  activity: ActivityModel
}

defineProps<Props>()

const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'offline'> = {
  pending: 'pending',
  published: 'approved',
  rejected: 'rejected',
  closed: 'offline',
  draft: 'pending',
  full: 'approved',
}
</script>

<template>
  <a :href="`./agency-activity-list.html?id=${activity.id}`" class="block group">
<Card class="h-full border-border/50 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden">
      <!-- Image -->
      <div class="relative aspect-[16/9] bg-muted overflow-hidden">
        <img
          v-if="activity.coverImage"
          :src="activity.coverImage"
          :alt="activity.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <SafeIcon name="Image" :size="40" class="text-muted-foreground" />
        </div>
      </div>

      <CardHeader class="pb-3">
        <div class="flex items-start justify-between gap-2">
          <CardTitle class="text-base line-clamp-2">{{ activity.title }}</CardTitle>
          <StatusBadge :status="statusMap[activity.status]" size="sm" />
        </div>
      </CardHeader>

      <CardContent class="space-y-3">
        <!-- Date & Location -->
        <div class="space-y-2 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <SafeIcon name="Calendar" :size="14" />
            <span>{{ activity.startDate }}</span>
          </div>
          <div class="flex items-center gap-2">
            <SafeIcon name="MapPin" :size="14" />
            <span class="line-clamp-1">{{ activity.location }}</span>
          </div>
        </div>

        <!-- Category & Participants -->
        <div class="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="outline" class="text-xs">{{ activity.category }}</Badge>
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <SafeIcon name="Users" :size="12" />
            <span>{{ activity.currentParticipants }}/{{ activity.maxParticipants }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </a>
</template>
