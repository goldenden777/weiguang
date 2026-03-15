
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import SafeIcon from '@/components/common/SafeIcon.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import AdminActivityFilter from './AdminActivityFilter.vue'
import ActivityActionMenu from './ActivityActionMenu.vue'
import { MOCK_ACTIVITIES, ACTIVITY_CATEGORIES, type ActivityModel } from '@/data/activity'

interface FilterState {
  searchText: string
  agencyId: string
  category: string
  status: string
  dateRange: 'all' | 'week' | 'month' | 'custom'
}

const isMounted = ref(false)
const currentPage = ref(1)
const pageSize = 10

const filterState = ref<FilterState>({
  searchText: '',
  agencyId: '',
  category: '',
  status: '',
  dateRange: 'all',
})

// Mock data with various statuses for demonstration
const mockActivitiesWithStatus: ActivityModel[] = [
  ...MOCK_ACTIVITIES,
  {
    id: 'act-004',
    title: '社区志愿服务周末活动',
    startDate: '2026-04-15',
    endDate: '2026-04-15',
    location: '青岛市市南区文化广场',
    brief: '组织志愿者参与社区卫生整治和文化宣传。',
    content: '通过周末志愿服务，提升社区文明程度。',
    status: 'published',
    category: 'community',
    agencyName: '社区发展中心',
    agencyId: 'agency-4',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/1df6e81e-c9ae-4e6b-9953-f6cc911f73b3.png',
    maxParticipants: 30,
    currentParticipants: 18,
    contactPerson: '张主任',
    contactPhone: '13777778888',
    createTime: '2026-03-05',
  },
  {
    id: 'act-005',
    title: '健康义诊进社区',
    startDate: '2026-04-20',
    endDate: '2026-04-20',
    location: '青岛市李沧区社区卫生服务中心',
    brief: '邀请医疗专家为社区居民提供免费义诊服务。',
    content: '包括健康咨询、血压测量、常见病诊疗等建议。',
    status: 'closed',
    category: 'medical',
    agencyName: '医疗志愿者协会',
    agencyId: 'agency-5',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/63fbadef-a907-46af-a21f-03b47db46297.png',
    maxParticipants: 100,
    currentParticipants: 85,
    contactPerson: '李医生',
    contactPhone: '13999999999',
    createTime: '2026-03-08',
  },
]

// Get unique agencies for filter
const agencies = computed(() => {
  const uniqueAgencies = Array.from(
    new Map(mockActivitiesWithStatus.map(a => [a.agencyId, a])).values()
  )
  return uniqueAgencies.map(a => ({
    id: a.agencyId,
    name: a.agencyName,
  }))
})

// Map status to filter value
const statusMap: Record<string, string> = {
  'pending': 'pending',
  'published': 'approved',
  'closed': 'offline',
  'full': 'approved',
  'draft': 'pending',
  'rejected': 'rejected',
}

// Filter activities
const filteredActivities = computed(() => {
  return mockActivitiesWithStatus.filter(activity => {
    // Search text filter
    if (filterState.value.searchText) {
      const searchLower = filterState.value.searchText.toLowerCase()
      if (
        !activity.title.toLowerCase().includes(searchLower) &&
        !activity.agencyName.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }

    // Agency filter
    if (filterState.value.agencyId && activity.agencyId !== filterState.value.agencyId) {
      return false
    }

    // Category filter
    if (filterState.value.category && activity.category !== filterState.value.category) {
      return false
    }

    // Status filter
    if (filterState.value.status) {
      const activityStatus = statusMap[activity.status] || activity.status
      if (activityStatus !== filterState.value.status) {
        return false
      }
    }

    return true
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredActivities.value.length / pageSize))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredActivities.value.slice(start, end)
})

// Reset pagination when filters change
const handleFilterChange = () => {
  currentPage.value = 1
}

// Get category name by id
const getCategoryName = (categoryId: string) => {
  return ACTIVITY_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
}

// Get status badge type
const getStatusBadgeType = (status: string): 'pending' | 'approved' | 'rejected' | 'offline' => {
  const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'offline'> = {
    'pending': 'pending',
    'published': 'approved',
    'full': 'approved',
    'closed': 'offline',
    'draft': 'pending',
    'rejected': 'rejected',
  }
  return statusMap[status] || 'pending'
}

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div class="flex-1 flex flex-col gap-6 p-6">
    <!-- Filters -->
    <AdminActivityFilter
      v-model:searchText="filterState.searchText"
      v-model:agencyId="filterState.agencyId"
      v-model:category="filterState.category"
      v-model:status="filterState.status"
      v-model:dateRange="filterState.dateRange"
      :agencies="agencies"
      @change="handleFilterChange"
    />

    <!-- Activities Table -->
    <Card class="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
      <CardHeader class="border-b border-border bg-white py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <SafeIcon name="ListFilter" :size="20" class="text-primary" />
            <CardTitle class="text-lg">活动资源列表</CardTitle>
          </div>
          <div class="text-sm font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
            共计 {{ filteredActivities.length }} 项
          </div>
        </div>
      </CardHeader>

      <CardContent class="flex-1 flex flex-col p-0 bg-white">
        <!-- Table -->
        <div class="overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow class="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead class="w-[30%] font-semibold text-slate-900">活动详情</TableHead>
                <TableHead class="w-[15%] font-semibold text-slate-900">执行机构</TableHead>
                <TableHead class="w-[12%] font-semibold text-slate-900 text-center">分类</TableHead>
                <TableHead class="w-[10%] font-semibold text-slate-900 text-center">状态</TableHead>
                <TableHead class="w-[15%] font-semibold text-slate-900 text-center">报名进度</TableHead>
                <TableHead class="w-[10%] font-semibold text-slate-900">开始时间</TableHead>
                <TableHead class="w-[8%] text-right font-semibold text-slate-900 pr-6">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="activity in paginatedActivities"
                :key="activity.id"
                class="group border-b border-border hover:bg-primary/[0.02] transition-colors"
              >
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{{ activity.title }}</span>
                    <span class="text-xs text-muted-foreground line-clamp-1">{{ activity.location }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <SafeIcon name="ShieldCheck" :size="12" class="text-slate-400" />
                    </div>
                    <span class="text-sm text-slate-600">{{ activity.agencyName }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-center">
                  <span class="text-sm px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                    {{ getCategoryName(activity.category) }}
                  </span>
                </TableCell>
                <TableCell class="text-center">
                  <StatusBadge :status="getStatusBadgeType(activity.status)" size="sm" />
                </TableCell>
                <TableCell>
                  <div class="flex flex-col gap-1 w-full max-w-[140px] mx-auto">
                    <div class="flex justify-between text-[11px] font-medium text-slate-500">
                      <span>{{ (activity.currentParticipants / activity.maxParticipants * 100).toFixed(0) }}%</span>
                      <span>{{ activity.currentParticipants }}/{{ activity.maxParticipants }}</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-primary rounded-full transition-all duration-500"
                        :style="{ width: `${(activity.currentParticipants / activity.maxParticipants * 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1.5 text-sm text-slate-600">
                    <SafeIcon name="Calendar" :size="14" class="text-slate-400" />
                    {{ activity.startDate }}
                  </div>
                </TableCell>
                <TableCell class="text-right pr-6">
                  <ActivityActionMenu
                    :activity="activity"
                    :is-client="isMounted"
                  />
                </TableCell>
              </TableRow>

              <!-- Empty state -->
              <TableRow v-if="paginatedActivities.length === 0">
                <TableCell colspan="7" class="text-center py-20">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                      <SafeIcon name="SearchX" :size="32" class="text-slate-300" />
                    </div>
                    <p class="text-slate-400 font-medium tracking-wide">未找到符合搜索条件的活动资源</p>
                    <Button variant="outline" size="sm" @click="filterState.searchText = ''">清除搜索</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="border-t border-border p-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  v-if="currentPage > 1"
                  @click="currentPage--"
                  class="cursor-pointer"
                />
              </PaginationItem>

<PaginationItem v-for="page in totalPages" :key="page">
                <Button
                  variant="ghost"
                  size="sm"
                  :aria-current="currentPage === page ? 'page' : undefined"
                  @click="currentPage = page"
                  class="cursor-pointer"
                  :class="currentPage === page ? 'bg-accent text-accent-foreground' : ''"
                >
                  {{ page }}
                </Button>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  v-if="currentPage < totalPages"
                  @click="currentPage++"
                  class="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
