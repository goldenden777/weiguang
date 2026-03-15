
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ActivityCard from '@/components/common/ActivityCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
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
  maxParticipants?: number
}

// Mock data for SSG - 初始化时使用模拟数据
const mockActivities: Activity[] = [
  {
    id: '1',
    title: '青岛海滨公园环保清洁志愿服务',
    date: '2024年3月15日 09:00-12:00',
    location: '青岛市市南区海滨公园',
    summary: '参与海滨公园的环境卫生清洁工作，美化城市环境，传递环保理念。',
    category: '环保',
    status: 'available',
    organization: '青岛环保志愿者协会',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/fbb32d79-c0d4-4e1e-8ca1-caaa831664d9.png',
    maxParticipants: 50
  },
  {
    id: '2',
    title: '社区老年人关爱陪伴活动',
    date: '2024年3月20日 14:00-16:00',
    location: '青岛市北区社区养老中心',
    summary: '为社区老年人提供陪伴、健康咨询和文化娱乐活动，传递温暖关怀。',
    category: '助老',
    status: 'available',
    organization: '青岛社区服务中心',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/931c30f3-1409-4d0c-be3a-a9b509695cd1.png',
    maxParticipants: 30
  },
  {
    id: '3',
    title: '乡村儿童教育支教活动',
    date: '2024年3月25日 10:00-15:00',
    location: '青岛市即墨区乡村小学',
    summary: '为乡村儿童提供教育支持，开展知识讲座、兴趣班和学业辅导。',
    category: '助学',
    status: 'full',
    organization: '青岛教育志愿者团队',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/9214795d-7871-48b3-8684-e36e004968a0.png',
    maxParticipants: 20
  },
  {
    id: '4',
    title: '城市绿化美化志愿服务',
    date: '2024年4月01日 08:00-11:00',
    location: '青岛市中山公园',
    summary: '参与城市绿化工作，种植花草树木，美化城市环境。',
    category: '环保',
    status: 'available',
    organization: '青岛绿化志愿者协会',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/50a2c020-db0e-45bf-90a2-3419aa7d1a47.png',
    maxParticipants: 80
  },
  {
    id: '5',
    title: '残障人士康复训练陪伴',
    date: '2024年4月05日 13:00-15:00',
    location: '青岛市残疾人康复中心',
    summary: '为残障人士提供康复训练陪伴和心理支持，帮助他们重获生活信心。',
    category: '社区服务',
    status: 'available',
    organization: '青岛残疾人服务中心',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/24646e9a-413a-46a8-bb9e-d5fc9828abba.png',
    maxParticipants: 15
  },
  {
    id: '6',
    title: '流浪动物救助与领养活动',
    date: '2024年4月10日 10:00-16:00',
    location: '青岛市动物救助中心',
    summary: '参与流浪动物的救助、护理和领养工作，给予它们第二次生命。',
    category: '社区服务',
    status: 'ended',
    organization: '青岛动物保护协会',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/273ed29c-3374-4a0a-8207-36fd23e638fb.png',
    maxParticipants: 100
  },
]

// State management
const isClient = ref(true)
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const activities = ref<Activity[]>(mockActivities)

// Computed properties
const categories = computed(() => {
  const cats = new Set(activities.value.map(a => a.category))
  return Array.from(cats).sort()
})

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         activity.organization.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || activity.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Lifecycle
onMounted(() => {
  // 1→0→1 process: Start transition
  isClient.value = false
  
  // Simulate data loading if needed
  // In real app, fetch from API here
  
  // Use requestAnimationFrame to ensure smooth transition
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

// Event handlers
const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}

</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Page Header：左返回/关闭，中标题，右更多 -->
    <div class="sticky top-0 z-40 bg-background border-b border-border">
      <div class="flex h-14 items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <a href="./home.html" class="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="返回">
            <SafeIcon name="ChevronLeft" :size="20" />
          </a>
          <a href="./home.html" class="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="关闭">
            <SafeIcon name="X" :size="18" />
          </a>
        </div>
        <h1 class="text-lg font-bold absolute left-1/2 -translate-x-1/2">活动列表页</h1>
        <button type="button" class="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="更多">
          <SafeIcon name="MoreHorizontal" :size="20" />
        </button>
      </div>
      <!-- Search -->
      <div class="px-4 pb-3">
        <div class="relative">
          <SafeIcon name="Search" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="搜索公益活动"
            class="pl-9 h-10 rounded-lg bg-muted/50 border-0 text-sm"
          />
        </div>
        <!-- Category Filter -->
        <div class="flex gap-2 overflow-x-auto pt-3 pb-1 -mx-4 px-4 no-scrollbar">
          <Button
            v-for="category in categories"
            :key="category"
            :variant="selectedCategory === category ? 'default' : 'outline'"
            size="sm"
            class="whitespace-nowrap text-xs rounded-full"
            @click="selectedCategory = selectedCategory === category ? null : category"
          >
            {{ category }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 py-4 space-y-3">
      <!-- Activities List（参考图：卡片竖排、左图右文、绿/红点、底部限人数+橙色进入活动） -->
      <div v-if="filteredActivities.length > 0" class="space-y-3">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          :class="[
            'transition-all duration-300',
            isClient ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          ]"
        >
          <ActivityCard
            :activity="activity"
            variant="mobileList"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12">
        <EmptyState
          type="no-activities"
          action-text="返回首页"
          action-href="./home.html"
        />
      </div>

      <!-- Footer 提示 -->
      <p v-if="filteredActivities.length > 0" class="text-center text-sm text-muted-foreground py-6">
        —更多福利 敬请期待—
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for list items */
.transition-all {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
</style>
