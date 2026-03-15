
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/common/PageHeader.vue'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { MOCK_ACTIVITIES, type ActivityModel } from '@/data/activity'
import { MOCK_ARCHIVES, type ActivityArchiveModel } from '@/data/archive'
import ActivityArchiveForm from './ActivityArchiveForm.vue'
import ArchivePreviewCard from './ArchivePreviewCard.vue'

interface ArchiveActivity extends ActivityModel {
  archiveData?: ActivityArchiveModel
}

const isClient = ref(true)
const selectedActivityId = ref<string | null>(null)
const closedActivities = ref<ArchiveActivity[]>([])
const activeTab = ref('list')

// 获取已结束的活动列表
const getClosedActivities = () => {
  const closed = MOCK_ACTIVITIES.filter(act => act.status === 'closed' || new Date(act.endDate) < new Date())
  return closed.map(act => ({
    ...act,
    archiveData: MOCK_ARCHIVES.find(arch => arch.activityId === act.id)
  }))
}

const selectedActivity = computed(() => {
  return closedActivities.value.find(act => act.id === selectedActivityId.value)
})

const unArchivedCount = computed(() => {
  return closedActivities.value.filter(act => !act.archiveData).length
})

const handleActivitySelect = (activityId: string) => {
  selectedActivityId.value = activityId
  activeTab.value = 'edit'
}

const handleArchivePublished = () => {
  // 更新已发布状态
  if (selectedActivity.value) {
    const index = closedActivities.value.findIndex(act => act.id === selectedActivity.value!.id)
    if (index !== -1) {
      closedActivities.value[index].archiveData = {
        id: `arch-${Date.now()}`,
        activityId: selectedActivity.value.id,
        summary: '',
        totalImpact: '',
        mediaList: [],
        publishDate: new Date().toISOString().split('T')[0]
      }
    }
  }
  selectedActivityId.value = null
  activeTab.value = 'list'
}

onMounted(() => {
  isClient.value = false
  closedActivities.value = getClosedActivities()
  
  // 模拟数据加载
  setTimeout(() => {
    isClient.value = true
  }, 0)
})

const breadcrumbs = [
  { label: '管理员控制台', href: './admin-dashboard.html' },
  { label: '全量活动管理', href: './admin-all-activities.html' },
  { label: '往期活动回顾' }
]
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <PageHeader 
      title="往期活动回顾发布"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <Button variant="outline" as="a" href="./admin-all-activities.html">
          <SafeIcon name="ArrowLeft" :size="16" />
          返回活动管理
        </Button>
      </template>
    </PageHeader>

    <div class="flex-1 container mx-auto px-4 py-6">
      <Tabs v-model="activeTab" class="w-full">
        <!-- 列表标签 -->
        <TabsList class="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">
            已结束活动
            <Badge v-if="isClient || unArchivedCount > 0" variant="secondary" class="ml-2">
              {{ unArchivedCount }}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="edit" :disabled="!selectedActivityId">
            编辑回顾
          </TabsTrigger>
        </TabsList>

        <!-- 活动列表标签页 -->
        <TabsContent value="list" class="space-y-4 mt-6">
          <div class="grid gap-4">
            <div v-if="closedActivities.length === 0" class="text-center py-12">
              <SafeIcon name="CalendarOff" :size="48" class="mx-auto text-muted-foreground mb-4" />
              <p class="text-muted-foreground">暂无已结束的活动</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="activity in closedActivities"
                :key="activity.id"
                class="group"
              >
                <Card 
                  :class="[
                    'cursor-pointer transition-all',
                    selectedActivityId === activity.id ? 'ring-2 ring-primary' : 'hover:shadow-card'
                  ]"
                  @click="handleActivitySelect(activity.id)"
                >
                  <CardContent class="p-4">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2">
                          <h3 class="font-semibold text-base truncate">{{ activity.title }}</h3>
                          <Badge 
                            v-if="activity.archiveData"
                            variant="outline"
                            class="bg-success/10 text-success border-success/20"
                          >
                            <SafeIcon name="CheckCircle" :size="12" class="mr-1" />
                            已发布
                          </Badge>
                          <Badge v-else variant="outline" class="bg-muted">
                            待发布
                          </Badge>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div class="flex items-center gap-1">
                            <SafeIcon name="Calendar" :size="14" />
                            <span>{{ activity.endDate }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <SafeIcon name="MapPin" :size="14" />
                            <span>{{ activity.location }}</span>
                          </div>
                          <span class="text-xs">{{ activity.agencyName }}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <SafeIcon name="ChevronRight" :size="18" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- 编辑标签页 -->
        <TabsContent value="edit" class="mt-6">
          <div v-if="selectedActivity" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 左侧：活动预览 -->
            <div class="lg:col-span-1">
              <ArchivePreviewCard :activity="selectedActivity" />
            </div>

            <!-- 右侧：编辑表单 -->
            <div class="lg:col-span-2">
              <ActivityArchiveForm 
                :activity="selectedActivity"
                :existing-archive="selectedActivity.archiveData"
                @published="handleArchivePublished"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
