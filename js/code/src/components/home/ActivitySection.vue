
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ActivityCard from '@/components/common/ActivityCard.vue'

defineOptions({ name: 'ActivitySection' })
import EmptyState from '@/components/common/EmptyState.vue'
import type { ActivityModel } from '@/data/activity'
import { ACTIVITY_CATEGORIES } from '@/data/activity'
import { getActivities } from '@/services/activity.service'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { cn } from '@/lib/utils'

interface Props {
  sectionType: 'latest' | 'popular' | 'available'
  title: string
}

const props = defineProps<Props>()

const activities = ref<ActivityModel[]>([])
const loadError = ref('')
const isClient = ref(true)
const selectedDateRange = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')

onMounted(async () => {
  isClient.value = false
  loadError.value = ''
  try {
    activities.value = await getActivities()
  } catch {
    loadError.value = '加载失败，请刷新重试'
    activities.value = []
  }
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

// Get current date helpers
const getCurrentWeekRange = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const weekStart = new Date(now.getFullYear(), now.getMonth(), diff)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return { start: weekStart, end: weekEnd }
}

const getCurrentMonthRange = () => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: monthStart, end: monthEnd }
}

const isDateInRange = (dateStr: string, range: string) => {
  const date = new Date(dateStr)
  
  switch (range) {
    case 'week': {
      const { start, end } = getCurrentWeekRange()
      return date >= start && date <= end
    }
    case 'month': {
      const { start, end } = getCurrentMonthRange()
      return date >= start && date <= end
    }
    default:
      return true
  }
}

// Filter and sort activities
const filteredActivities = computed(() => {
  let list = [...activities.value]

  // Apply section-specific filtering
  switch (props.sectionType) {
    case 'latest':
      list = list.sort((a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )
      break
    case 'popular':
      list = list
        .filter(a => a.status === 'published')
        .sort((a, b) => b.currentParticipants - a.currentParticipants)
      break
    case 'available':
      list = list.filter(
        a => a.status === 'published' && a.currentParticipants < a.maxParticipants
      )
      break
  }

  // Apply global filters
  if (selectedDateRange.value !== 'all') {
    list = list.filter(a =>
      isDateInRange(a.startDate, selectedDateRange.value)
    )
  }

  if (selectedCategory.value !== 'all') {
    list = list.filter(a => a.category === selectedCategory.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(a =>
      a.title.toLowerCase().includes(keyword) ||
      a.agencyName.toLowerCase().includes(keyword) ||
      a.location.toLowerCase().includes(keyword)
    )
  }

  return list.slice(0, 6)
})

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit' 
  })
}

// Get category name
const getCategoryName = (categoryId: string) => {
  return ACTIVITY_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
}

// Convert activity model to card format
const toActivityCard = (activity: ActivityModel) => {
  let status: 'available' | 'full' | 'ended' = 'available'
  
  if (activity.status === 'closed') {
    status = 'ended'
  } else if (activity.currentParticipants >= activity.maxParticipants) {
    status = 'full'
  }

  return {
    id: activity.id,
    title: activity.title,
    date: formatDate(activity.startDate),
    location: activity.location,
    summary: activity.brief,
    category: getCategoryName(activity.category),
    status,
    organization: activity.agencyName,
    imageUrl: activity.coverImage ?? '',
  }
}

// Listen to filter changes from parent
const updateFilters = (filters: any) => {
  selectedDateRange.value = filters.dateRange
  selectedCategory.value = filters.category
  searchKeyword.value = filters.keyword
}

// Expose method for parent to call
defineExpose({
  updateFilters,
})
</script>

<template>
  <section class="space-y-4">
    <!-- Section Header -->
<div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div 
          :class="cn(
            'w-1.5 h-5 rounded-full',
            sectionType === 'popular' ? 'bg-secondary' : 'bg-primary'
          )"
        ></div>
        <h2 class="text-base font-bold text-foreground tracking-tight">{{ title }}</h2>
      </div>
      <a href="./page-2659759.html" class="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-primary transition-colors">
        查看更多
        <SafeIcon name="ChevronRight" :size="14" />
      </a>
    </div>

    <!-- 加载失败提示 -->
    <p v-if="loadError" class="text-sm text-destructive py-2">{{ loadError }}</p>

    <!-- Activities List (popular section uses same grid; carousel temporarily disabled for path compatibility) -->
    <div v-else-if="!loadError && (filteredActivities.length > 0 || isClient)" class="grid grid-cols-1 gap-4">
      <ActivityCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="toActivityCard(activity)"
        variant="grid"
        allow-favorite
      />
    </div>

    <!-- Empty State -->
    <EmptyState 
      v-else-if="!loadError"
      type="no-activities"
      actionText="调整筛选条件"
      @action="() => {}"
    />
  </section>
</template>
