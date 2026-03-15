
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MOCK_ACTIVITIES } from '@/data/activity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import EnrollmentForm from '@/components/activity-detail/EnrollmentForm.vue'

const props = defineProps<{ activityId?: string }>()
const isClient = ref(true)
const idFromUrl = ref('act-001')
const showForm = ref(false)
const effectiveId = computed(() => props.activityId ?? idFromUrl.value)
const activity = computed(() => {
  return MOCK_ACTIVITIES.find(a => a.id === effectiveId.value) || MOCK_ACTIVITIES[0]
})

const isEnrollable = computed(() => {
  return activity.value.status === 'published' && activity.value.currentParticipants < activity.value.maxParticipants
})

const remainingSpots = computed(() => {
  return activity.value.maxParticipants - activity.value.currentParticipants
})

const enrollmentPercentage = computed(() => {
  return Math.round((activity.value.currentParticipants / activity.value.maxParticipants) * 100)
})

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

const handleEnrollClick = () => {
  showForm.value = true
}

const handleFormClose = () => {
  showForm.value = false
}
</script>

<template>
<div class="space-y-6">
    <!-- Enrollment Card (Mobile Style) -->
    <div class="bg-background rounded-2xl border border-border p-6 shadow-sm space-y-6">
      <div class="space-y-3">
        <h3 class="text-lg font-bold">报名进度</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">已报 {{ activity.currentParticipants }} 人</span>
            <span class="text-muted-foreground">剩余 {{ remainingSpots }} 名额</span>
          </div>
          <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 rounded-full"
              :style="{ width: `${enrollmentPercentage}%` }"
            />
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-dashed border-border flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <SafeIcon name="Users" :size="20" class="text-muted-foreground" />
          </div>
          <div class="text-sm text-left">
            <p class="text-muted-foreground text-xs uppercase tracking-tight">主办机构</p>
            <p class="font-bold">{{ activity.agencyName }}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" class="rounded-full">查看资质</Button>
      </div>
    </div>

    <!-- Fixed Bottom Button -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/80 backdrop-blur-lg border-t border-border/50 p-4 z-40 flex items-center gap-4">
      <Button variant="outline" size="icon" class="shrink-0 rounded-xl">
        <SafeIcon name="Heart" :size="20" />
      </Button>
      <Button 
        v-if="isEnrollable"
        class="flex-1 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
        @click="handleEnrollClick"
      >
        立即报名
      </Button>
      <Button 
        v-else
        class="flex-1 h-12 rounded-xl text-base font-bold"
        disabled
      >
        {{ activity.status === 'full' ? '名额已满' : '活动已结束' }}
      </Button>
    </div>

    <!-- Enrollment Form Modal -->
    <EnrollmentForm 
      v-if="showForm || isClient"
      :activity="activity"
      :open="showForm"
      @close="handleFormClose"
    />
  </div>
</template>
