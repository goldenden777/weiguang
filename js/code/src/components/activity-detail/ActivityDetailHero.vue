
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MOCK_ACTIVITIES } from '@/data/activity'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'

const props = defineProps<{ activityId?: string }>()
const isClient = ref(true)
const idFromUrl = ref('act-001')
const effectiveId = computed(() => props.activityId ?? idFromUrl.value)
const activity = computed(() => {
  return MOCK_ACTIVITIES.find(a => a.id === effectiveId.value) || MOCK_ACTIVITIES[0]
})

const statusConfig = {
  published: { label: '可报名', class: 'bg-success text-success-foreground' },
  pending: { label: '待审核', class: 'bg-primary text-primary-foreground' },
  rejected: { label: '已驳回', class: 'bg-destructive text-destructive-foreground' },
  draft: { label: '草稿', class: 'bg-muted text-muted-foreground' },
  closed: { label: '已结束', class: 'bg-muted text-muted-foreground' },
  full: { label: '名额已满', class: 'bg-muted text-muted-foreground' },
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    weekday: 'long'
  })
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

const categoryMap: Record<string, string> = {
  'elderly': '助老',
  'education': '助学兴教',
  'environment': '生态环保',
  'community': '社区服务',
  'medical': '医疗卫生'
}

onMounted(() => {
  isClient.value = false
  if (typeof window !== 'undefined' && !props.activityId) {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) idFromUrl.value = id
  }
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Cover Image（无封面时不请求 undefined） -->
    <div class="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-card">
      <img
        v-if="activity.coverImage"
        :src="activity.coverImage ?? ''"
        :alt="activity.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
        <SafeIcon name="Image" :size="48" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      
      <!-- Status Badge -->
      <Badge 
        :class="statusConfig[activity.status].class"
        class="absolute top-4 right-4"
      >
        {{ statusConfig[activity.status].label }}
      </Badge>

      <!-- Participant Info Overlay -->
      <div class="absolute bottom-4 left-4 right-4 text-white">
        <div class="flex items-center gap-2 text-sm">
          <SafeIcon name="Users" :size="16" />
          <span>{{ activity.currentParticipants }}/{{ activity.maxParticipants }} 人已报名</span>
        </div>
      </div>
    </div>

<!-- Title & Basic Info -->
    <div class="px-4 space-y-4 text-left">
      <h1 class="text-2xl font-bold tracking-tight text-foreground leading-tight">
        {{ activity.title }}
      </h1>
      
      <div class="flex flex-col gap-3 text-sm text-muted-foreground">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <SafeIcon name="Calendar" :size="16" class="text-primary" />
          </div>
          <span class="text-foreground/80">{{ formatDate(activity.startDate) }} {{ formatTime(activity.startDate) }}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <SafeIcon name="MapPin" :size="16" class="text-primary" />
          </div>
          <span class="text-foreground/80">{{ activity.location }}</span>
        </div>
      </div>

      <!-- Category & Organization -->
      <div class="flex flex-wrap items-center gap-3 pt-2">
<Badge variant="secondary" class="rounded-sm font-medium">{{ categoryMap[activity.category] || activity.category }}</Badge>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
          <span>主办：{{ activity.agencyName }}</span>
        </div>
      </div>
    </div>

    <!-- Brief Description -->
    <div class="mx-4 bg-muted/50 rounded-xl p-4 border border-border/50">
      <p class="text-sm text-muted-foreground leading-relaxed">
        {{ activity.brief }}
      </p>
    </div>
  </div>
</template>
