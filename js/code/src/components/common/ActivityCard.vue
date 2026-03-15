
<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

defineOptions({ name: 'ActivityCard' })
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Activity {
  id: string
  title: string
  date: string
  location: string
  summary: string
  category: string
  status: 'available' | 'full' | 'ended'
  organization: string
  imageUrl?: string
  /** 报名人数上限，用于活动列表页展示「限X人报名参加」 */
  maxParticipants?: number
}

interface Props {
  activity: Activity
  variant?: 'grid' | 'list' | 'mobileList'
  showActions?: boolean
  allowFavorite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'grid',
  showActions: false,
  allowFavorite: false
})

const isFavorite = ref(false)

const toggleFavorite = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  isFavorite.value = !isFavorite.value
}

const statusConfig = {
  available: { label: '可报名', class: 'bg-success text-success-foreground border-transparent' },
  full: { label: '名额已满', class: 'bg-[#f7f802] text-black border-transparent' },
  ended: { label: '已结束', class: 'bg-muted text-muted-foreground border-transparent' },
}
</script>

<template>
  <Card 
    :class="[
      'overflow-hidden',
      variant === 'grid' ? 'charity-card-hover cursor-pointer' : 'hover:shadow-sm transition-shadow',
      variant === 'mobileList' ? 'rounded-xl' : ''
    ]"
  >
    <a 
      v-if="variant === 'grid'" 
      :href="`./activity-detail.html?id=${activity.id}`"
      class="block"
    >
      <!-- Image -->
      <div class="relative aspect-video bg-muted">
        <img
          v-if="activity.imageUrl"
          :src="activity.imageUrl || ''"
          :alt="activity.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <SafeIcon name="Image" :size="48" class="text-muted-foreground" />
</div>
        <div class="absolute top-2 right-2 flex items-center gap-2">
          <Button
            v-if="allowFavorite"
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white border-none shadow-none"
            @click="toggleFavorite"
          >
            <SafeIcon 
              name="Heart" 
              :size="18" 
              :class="isFavorite ? 'fill-destructive text-destructive' : 'text-white'"
            />
          </Button>
          <Badge 
            :class="statusConfig[activity.status].class"
            class="shadow-sm"
          >
            {{ statusConfig[activity.status].label }}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div class="flex items-start justify-between gap-2">
<CardTitle class="text-lg line-clamp-2 leading-tight">{{ activity.title }}</CardTitle>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mt-2">
          <div class="flex items-center gap-1 shrink-0">
            <SafeIcon name="Calendar" :size="14" class="shrink-0" />
            <span class="whitespace-nowrap">{{ activity.date }}</span>
          </div>
          <div class="flex items-center gap-1 min-w-0">
            <SafeIcon name="MapPin" :size="14" class="shrink-0" />
            <span class="truncate">{{ activity.location }}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p class="text-sm text-muted-foreground line-clamp-2">{{ activity.summary }}</p>
        <div class="flex items-center gap-2 mt-4">
          <Badge variant="outline">{{ activity.category }}</Badge>
          <span class="text-xs text-muted-foreground">{{ activity.organization }}</span>
        </div>
      </CardContent>
    </a>

    <!-- Mobile List Variant：左图右文，日期绿点、地点红点，底部限人数+橙色进入活动 -->
    <template v-else-if="variant === 'mobileList'">
      <a
        :href="`./activity-detail.html?id=${activity.id}`"
        class="flex overflow-hidden rounded-xl"
      >
        <div class="h-24 w-24 flex-shrink-0 rounded-l-xl overflow-hidden bg-muted">
          <img
            v-if="activity.imageUrl"
            :src="activity.imageUrl || ''"
            :alt="activity.title"
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full flex items-center justify-center">
            <SafeIcon name="Image" :size="28" class="text-muted-foreground" />
          </div>
        </div>
        <div class="flex-1 min-w-0 p-4 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-base leading-tight line-clamp-2 text-foreground">{{ activity.title }}</h3>
            <p class="text-sm text-muted-foreground line-clamp-2 mt-0.5">{{ activity.summary }}</p>
            <div class="flex flex-col gap-0.5 mt-2 text-xs text-muted-foreground">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ activity.date }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ activity.location }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs text-muted-foreground">
              <template v-if="activity.maxParticipants != null">限{{ activity.maxParticipants }}人报名参加</template>
              <template v-else>{{ activity.organization }}</template>
            </span>
            <span
              class="inline-flex items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-medium px-4 py-2 hover:bg-orange-600 transition-colors"
            >
              进入活动
            </span>
          </div>
        </div>
      </a>
    </template>

    <!-- List Variant (desktop) -->
    <template v-else>
      <div class="flex flex-col md:flex-row">
        <div class="md:w-48 aspect-video md:aspect-square bg-muted flex-shrink-0">
          <img
            v-if="activity.imageUrl"
            :src="activity.imageUrl || ''"
            :alt="activity.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <SafeIcon name="Image" :size="32" class="text-muted-foreground" />
          </div>
        </div>
        
        <div class="flex-1 p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold">{{ activity.title }}</h3>
                <Badge :class="statusConfig[activity.status].class">
                  {{ statusConfig[activity.status].label }}
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{{ activity.summary }}</p>
              <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <SafeIcon name="Calendar" :size="14" />
                  <span>{{ activity.date }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <SafeIcon name="MapPin" :size="14" />
                  <span>{{ activity.location }}</span>
                </div>
                <Badge variant="outline">{{ activity.category }}</Badge>
                <span class="text-xs">{{ activity.organization }}</span>
              </div>
            </div>
            
            <div v-if="showActions" class="flex flex-col gap-2">
              <Button size="sm" variant="outline">
                查看详情
              </Button>
              <Button size="sm" variant="ghost">
                编辑
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
