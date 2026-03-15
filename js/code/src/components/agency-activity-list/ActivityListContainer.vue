
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { ActivityModel } from '@/data/activity'
import { MOCK_ACTIVITIES } from '@/data/activity'

// Mock data for agency activities
const mockAgencyActivities: ActivityModel[] = [
  {
    id: 'act-001',
    title: '青岛崂山"守护夕阳"老年人陪伴活动',
    startDate: '2026-04-10',
    endDate: '2026-04-10',
    location: '青岛市崂山区宁夏路社区',
    brief: '为辖区内孤寡老人提供居家清洁与心理疏导服务。',
    content: '通过组织志愿者进入社区，为行动不便的老人清理家庭卫生，并进行基础健康监测和谈心。',
    status: 'published',
    category: 'elderly',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/63fbadef-a907-46af-a21f-03b47db46297.png',
    maxParticipants: 20,
    currentParticipants: 12,
    contactPerson: '王老师',
    contactPhone: '13800001111',
    createTime: '2026-03-01',
  },
  {
    id: 'act-002',
    title: '暑期支教计划：点亮山区孩子的梦想',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    location: '山东省平度市大泽山镇',
    brief: '开展为期一个月的暑期兴趣课辅导，包含绘画、英语。',
    content: '本活动旨在填补偏远地区由于师资匮乏导致的暑期素质教育空白。',
    status: 'pending',
    category: 'education',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/6fa022c3-0dda-468f-bebb-ecd5ceb52ce4.png',
    maxParticipants: 10,
    currentParticipants: 0,
    contactPerson: '李馆长',
    contactPhone: '13911112222',
    createTime: '2026-03-10',
  },
  {
    id: 'act-004',
    title: '社区垃圾分类宣传活动',
    startDate: '2026-03-25',
    endDate: '2026-03-25',
    location: '青岛市市南区文登路社区',
    brief: '向社区居民普及垃圾分类知识，提升环保意识。',
    content: '通过展板、讲座和互动游戏等形式，让居民了解垃圾分类的重要性。',
    status: 'rejected',
    category: 'community',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/1df6e81e-c9ae-4e6b-9953-f6cc911f73b3.png',
    maxParticipants: 30,
    currentParticipants: 0,
    auditRemark: '活动时间与其他活动冲突，建议调整至下周进行',
    contactPerson: '张主任',
    contactPhone: '13755557777',
    createTime: '2026-03-05',
  },
  {
    id: 'act-005',
    title: '春季植树造林活动',
    startDate: '2026-04-05',
    endDate: '2026-04-05',
    location: '青岛市城阳区绿色生态园',
    brief: '组织志愿者参与春季植树，美化城市环境。',
    content: '通过植树活动，提升志愿者的环保意识，为城市增添绿色。',
    status: 'closed',
    category: 'environment',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/63fbadef-a907-46af-a21f-03b47db46297.png',
    maxParticipants: 50,
    currentParticipants: 45,
    contactPerson: '李队长',
    contactPhone: '13666668888',
    createTime: '2026-02-20',
  },
]

// State
const isClient = ref(true)
const searchKeyword = ref('')
const selectedStatus = ref<string>('all')
const activities = ref<ActivityModel[]>(mockAgencyActivities)
const isLoading = ref(false)

// Status mapping
const statusMap = {
  pending: 'pending',
  rejected: 'rejected',
  published: 'approved',
  closed: 'offline',
}

const statusLabels = {
  all: '全部状态',
  pending: '待审核',
  rejected: '已驳回',
  published: '已上架',
  closed: '已下架',
}

// Computed
const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesKeyword = activity.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || activity.status === selectedStatus.value
    return matchesKeyword && matchesStatus
  })
})

const statusStats = computed(() => {
  return {
    total: activities.value.length,
    pending: activities.value.filter(a => a.status === 'pending').length,
    rejected: activities.value.filter(a => a.status === 'rejected').length,
    published: activities.value.filter(a => a.status === 'published').length,
    closed: activities.value.filter(a => a.status === 'closed').length,
  }
})

// Methods
const handleSearch = (value: string) => {
  searchKeyword.value = value
}

const handleStatusChange = (value: string) => {
  selectedStatus.value = value
}

const handleViewEnrollment = (activityId: string) => {
  window.location.href = `./enrollment-data-detail.html?id=${activityId}`
}

const handleEditActivity = (activityId: string) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity?.status === 'pending') {
    window.location.href = `./activity-proposal-form.html?id=${activityId}`
  }
}

const handleViewRejectionReason = (activity: ActivityModel) => {
  // Show rejection reason in a dialog or toast
  alert(`驳回原因：${activity.auditRemark || '暂无说明'}`)
}

// Lifecycle
onMounted(() => {
  isClient.value = false
  
  // Simulate data loading
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    isClient.value = true
  }, 300)
})

const getStatusBadgeType = (status: string) => {
  const mapping: Record<string, 'pending' | 'approved' | 'rejected' | 'offline'> = {
    pending: 'pending',
    rejected: 'rejected',
    published: 'approved',
    closed: 'offline',
  }
  return mapping[status] || 'pending'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
</script>

<template>
<div class="max-w-7xl mx-auto space-y-8 bg-background">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="bg-primary/5 border-primary/10">
        <CardContent class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <SafeIcon name="LayoutGrid" :size="24" class="text-primary" />
          </div>
          <div>
            <div class="text-2xl font-bold text-primary">{{ statusStats.total }}</div>
            <p class="text-sm text-muted-foreground">活动总数</p>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-amber-50 border-amber-100">
        <CardContent class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <SafeIcon name="Clock" :size="24" class="text-amber-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-amber-600">{{ statusStats.pending }}</div>
            <p class="text-sm text-muted-foreground">待审核活动</p>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-green-50 border-green-100">
        <CardContent class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <SafeIcon name="CheckCircle" :size="24" class="text-green-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600">{{ statusStats.published }}</div>
            <p class="text-sm text-muted-foreground">已上架活动</p>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-red-50 border-red-100">
        <CardContent class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <SafeIcon name="XCircle" :size="24" class="text-red-600" />
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600">{{ statusStats.rejected }}</div>
            <p class="text-sm text-muted-foreground">被驳回活动</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg">
      <div class="flex flex-1 items-center gap-4 max-w-xl">
        <div class="relative w-full">
          <SafeIcon name="Search" :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="通过活动标题搜索..."
            :value="searchKeyword"
            @input="(e) => handleSearch((e.target as HTMLInputElement).value)"
            class="pl-10 h-11 bg-background"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-muted-foreground">状态筛选:</span>
        <Select :model-value="selectedStatus" @update:model-value="handleStatusChange">
          <SelectTrigger class="w-[180px] h-11 bg-background">
            <SelectValue :placeholder="statusLabels.all" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(label, key) in statusLabels" :key="key" :value="String(key)">
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Activity Grid -->
    <div class="min-h-[400px]">
      <div v-if="isLoading || !isClient" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-80 bg-muted rounded-xl animate-pulse" />
      </div>

      <div v-else-if="filteredActivities.length === 0" class="py-20 border-2 border-dashed rounded-xl">
        <EmptyState
          type="no-activities"
          actionText="创建一个新活动"
          actionHref="./activity-proposal-form.html"
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="group overflow-hidden border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col"
        >
          <!-- Image Header -->
          <div class="relative h-48 w-full overflow-hidden">
            <img
              v-if="activity.coverImage"
              :src="activity.coverImage"
              :alt="activity.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
              <SafeIcon name="Image" :size="48" class="text-slate-300" />
            </div>
            <!-- Floating Status Badge -->
            <div class="absolute top-4 right-4">
              <StatusBadge :status="getStatusBadgeType(activity.status)" />
            </div>
          </div>

          <!-- Content -->
          <CardContent class="p-6 flex-1 flex flex-col">
            <div class="mb-4 flex-1">
              <h3 class="text-lg font-bold leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                {{ activity.title }}
              </h3>
              
              <div class="space-y-2 text-sm text-muted-foreground">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded flex items-center justify-center bg-muted/50">
                    <SafeIcon name="Calendar" :size="14" class="text-primary/70" />
                  </div>
                  <span>{{ formatDate(activity.startDate) }} - {{ formatDate(activity.endDate) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded flex items-center justify-center bg-muted/50">
                    <SafeIcon name="MapPin" :size="14" class="text-primary/70" />
                  </div>
                  <span class="line-clamp-1">{{ activity.location }}</span>
                </div>
              </div>
            </div>

            <!-- Enrollment Stats -->
            <div class="bg-muted/30 rounded-lg p-4 mb-6">
              <div class="flex justify-between items-end mb-2">
                <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">招募进度</span>
                <span class="text-sm font-bold">
                  {{ activity.currentParticipants }} <span class="text-muted-foreground text-xs font-normal">/ {{ activity.maxParticipants }} 人</span>
                </span>
              </div>
              <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary transition-all duration-1000"
                  :style="{ width: `${(activity.currentParticipants / activity.maxParticipants) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Rejection Reason if any -->
            <div v-if="activity.status === 'rejected' && activity.auditRemark" 
                 class="mb-6 p-4 bg-destructive/5 border border-destructive/10 rounded-lg">
              <div class="flex gap-2">
                <SafeIcon name="AlertCircle" :size="16" class="text-destructive shrink-0 mt-0.5" />
                <p class="text-xs text-destructive">
                  <span class="font-bold">审核意见：</span>{{ activity.auditRemark }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2 pt-4 border-t border-border/50 mt-auto">
              <Button
                v-if="activity.status === 'published' || activity.status === 'closed' || activity.status === 'full'"
                variant="outline"
                class="flex-1"
                @click="handleViewEnrollment(activity.id)"
              >
                <SafeIcon name="Users" :size="16" class="mr-2" />
                报名管理
              </Button>

              <Button
                v-if="activity.status === 'pending' || activity.status === 'rejected'"
                variant="default"
                class="flex-1"
                @click="handleEditActivity(activity.id)"
              >
                <SafeIcon :name="activity.status === 'pending' ? 'Edit3' : 'RefreshCw'" :size="16" class="mr-2" />
                {{ activity.status === 'pending' ? '编辑' : '重新提交' }}
              </Button>

              <Button
                v-else
                variant="ghost"
                class="flex-1 hover:bg-primary/10 hover:text-primary"
                as="a"
                :href="`./activity-detail.html?id=${activity.id}`"
              >
                <SafeIcon name="Eye" :size="16" class="mr-2" />
                详情预览
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
