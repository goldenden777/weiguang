
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Badge } from '@/components/ui/badge'
import { getCurrentUser } from '@/lib/auth'
import { type EnrollmentModel, type EnrollmentStatus } from '@/data/enrollment'
import { MOCK_ACTIVITIES } from '@/data/activity'
import { getEnrollmentsByActivityId, updateEnrollmentStatus } from '@/services/enrollment.service'

// 从 URL ?id= 读取活动 ID，避免固定显示错误活动
const activityId = ref('')
const activityTitle = ref('')
const organization = ref('')

// UI State
const isMounted = ref(false)
const isClient = computed(() => isMounted.value)
const searchQuery = ref('')
const statusFilter = ref<EnrollmentStatus | 'all'>('all')
const currentPage = ref(1)
const itemsPerPage = 10

// 当前活动的报名列表（ref 以便在「确认/取消」后本地更新状态，对接后端后可改为接口拉取）
const enrollmentsList = ref<EnrollmentModel[]>([])
const enrollments = computed<EnrollmentModel[]>(() => enrollmentsList.value)
const isLoading = ref(false)

// Computed (enrollments 已是按 activityId 过滤的列表)
const filteredEnrollments = computed(() => {
  return enrollments.value.filter((enrollment: EnrollmentModel) => {
    const matchesSearch = 
      enrollment.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      enrollment.userPhone.includes(searchQuery.value) ||
      enrollment.id.includes(searchQuery.value)
    
    const matchesStatus = statusFilter.value === 'all' || enrollment.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredEnrollments.value.length / itemsPerPage)
})

const paginatedEnrollments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEnrollments.value.slice(start, end)
})

const stats = computed(() => {
  const total = enrollments.value.length
  const confirmed = enrollments.value.filter(e => e.status === 'confirmed').length
  const pending = enrollments.value.filter(e => e.status === 'pending').length
  const canceled = enrollments.value.filter(e => e.status === 'canceled').length
  const totalParticipants = enrollments.value.reduce((sum, e) => sum + e.participantCount, 0)
  
  return { total, confirmed, pending, canceled, totalParticipants }
})

// 管理员从全量活动进入时返回全量活动列表，机构返回机构活动列表
const backToListHref = computed(() => {
  const user = getCurrentUser()
  return user?.role === 'admin' ? './admin-all-activities.html' : './agency-activity-list.html'
})

// Methods
const handleExport = () => {
if (!isClient.value) return
  
  // In a real app, uses toast here
  console.log('Exporting data...')
  
  // Create CSV content
  const headers = ['报名编号', '姓名', '电话', '身份证号', '参与人数', '报名时间', '状态', '备注']
  const rows = filteredEnrollments.value.map(e => [
    e.id,
    e.userName,
    e.userPhone,
    e.idCard || '-',
    e.participantCount,
    e.submitTime,
    getStatusLabel(e.status),
    e.remark || '-',
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\r\n')
  
  // Download
  // Excel 在 Windows 上打开 UTF-8 CSV 常出现乱码；加 BOM 可让 Excel 正确识别 UTF-8
  const csvWithBom = `\uFEFF${csvContent}`
  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${activityTitle.value || '报名数据'}-报名数据.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 报名状态文案（与活动状态「待审核/已上架」区分，此处为报名单条状态）
const getStatusLabel = (status: EnrollmentStatus): string => {
  const labels: Record<EnrollmentStatus, string> = {
    pending: '待确认',
    confirmed: '已确认',
    canceled: '已取消',
  }
  return labels[status]
}

const getStatusBadgeClass = (status: EnrollmentStatus): string => {
  const classes: Record<EnrollmentStatus, string> = {
    pending: 'bg-primary/10 text-primary',
    confirmed: 'bg-success/10 text-[hsl(142_71%_45%)]',
    canceled: 'bg-muted text-muted-foreground',
  }
  return classes[status]
}

// 更新报名状态（在报名数据详情页操作，对接后端后改为调用 PATCH /api/enrollments/:id/status）
const updatingId = ref<string | null>(null)
const setEnrollmentStatus = async (enrollmentId: string, status: 'confirmed' | 'canceled') => {
  updatingId.value = enrollmentId
  try {
    await updateEnrollmentStatus(enrollmentId, status)
    const idx = enrollmentsList.value.findIndex(e => e.id === enrollmentId)
    if (idx !== -1) {
      enrollmentsList.value = enrollmentsList.value.map(e =>
        e.id === enrollmentId ? { ...e, status } : e
      )
    }
  } finally {
    updatingId.value = null
  }
}

async function fetchEnrollments() {
  if (!activityId.value) return
  isLoading.value = true
  try {
    enrollmentsList.value = await getEnrollmentsByActivityId(activityId.value)
    // 保持当前分页在合法范围内
    const nextTotal = Math.max(1, Math.ceil(enrollmentsList.value.length / itemsPerPage))
    if (currentPage.value > nextTotal) currentPage.value = nextTotal
  } finally {
    isLoading.value = false
  }
}

function initFromUrl() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id') || ''
  activityId.value = id
  if (id) {
    const activity = MOCK_ACTIVITIES.find(a => a.id === id)
    if (activity) {
      activityTitle.value = activity.title
      organization.value = activity.agencyName
    } else {
      activityTitle.value = '未知活动'
      organization.value = '-'
    }
  } else {
    activityTitle.value = '请从「我的活动」点击报名管理进入'
    organization.value = '-'
    enrollmentsList.value = []
  }
}

function onWindowFocus() {
  // 重新聚焦时刷新一次，方便“用户报名后后台打开的页面自动更新”
  void fetchEnrollments()
}

function onStorageChange(e: StorageEvent) {
  // 其他标签页提交报名会写 localStorage，触发本页刷新
  if (!e.key) return
  if (e.key === 'wg:enrollments:v1') {
    void fetchEnrollments()
  }
}

// Lifecycle：从 URL 读取活动 ID，并拉取该活动的报名列表
onMounted(() => {
  isMounted.value = true
  initFromUrl()
  if (activityId.value) void fetchEnrollments()
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', onWindowFocus)
    window.addEventListener('storage', onStorageChange)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('focus', onWindowFocus)
    window.removeEventListener('storage', onStorageChange)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 v-if="activityTitle" class="text-xl font-bold mb-6 text-foreground">
      {{ activityTitle }} - 报名数据
    </h1>
    <!-- Stats Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <Card class="bg-white shadow-sm border-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">总报名人数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground mt-1">参与人数：{{ stats.totalParticipants }}</p>
        </CardContent>
      </Card>

<Card class="bg-white shadow-sm border-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">已确认</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-[hsl(142_71%_45%)]">{{ stats.confirmed }}</div>
          <p class="text-xs text-muted-foreground mt-1">已确认人数</p>
        </CardContent>
      </Card>

      <Card class="bg-white shadow-sm border-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">待确认</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-primary">{{ stats.pending }}</div>
          <p class="text-xs text-muted-foreground mt-1">需处理申请</p>
        </CardContent>
      </Card>

      <Card class="bg-white shadow-sm border-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">已取消</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-destructive">{{ stats.canceled }}</div>
          <p class="text-xs text-muted-foreground mt-1">已关闭流程</p>
        </CardContent>
      </Card>

      <Card class="bg-white shadow-sm border-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">执行机构</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-sm font-semibold line-clamp-2">{{ organization }}</div>
          <p class="text-xs text-muted-foreground mt-1">活动执行方</p>
        </CardContent>
      </Card>
    </div>

<!-- 报名状态说明 -->
    <p class="text-sm text-muted-foreground mb-4">
      <strong>状态含义：</strong>待确认 = 用户已提交报名，机构尚未确认；已确认 = 机构已确认该报名；已取消 = 报名已取消。
    </p>
    <!-- Filters & Actions -->
    <Card class="mb-6 bg-white shadow-sm border-none">
      <CardHeader>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle class="text-lg">报名名单</CardTitle>
          <div class="flex flex-col md:flex-row gap-3">
            <Input
              v-model="searchQuery"
              placeholder="搜索姓名、电话或报名编号..."
              class="md:w-64"
              :disabled="!isClient"
            />
            <Select v-model="statusFilter" :disabled="!isClient">
              <SelectTrigger class="md:w-40">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待确认</SelectItem>
                <SelectItem value="confirmed">已确认</SelectItem>
                <SelectItem value="canceled">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Button
              @click="handleExport"
              variant="outline"
              :disabled="!isClient || filteredEnrollments.length === 0"
              class="gap-2"
            >
              <SafeIcon name="Download" :size="16" />
              <span class="hidden md:inline">导出Excel</span>
              <span class="md:hidden">导出</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>

<!-- Table -->
    <Card class="overflow-hidden bg-white shadow-sm border-none">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>报名编号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>电话</TableHead>
              <TableHead class="hidden md:table-cell">身份证号</TableHead>
              <TableHead class="text-center">参与人数</TableHead>
              <TableHead class="hidden lg:table-cell">报名时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead class="hidden md:table-cell">备注</TableHead>
              <TableHead class="text-right whitespace-nowrap">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="paginatedEnrollments.length > 0">
              <TableRow v-for="enrollment in paginatedEnrollments" :key="enrollment.id">
<TableCell class="font-mono text-sm whitespace-nowrap">{{ enrollment.id }}</TableCell>
                <TableCell class="font-medium whitespace-nowrap">{{ enrollment.userName }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ enrollment.userPhone }}</TableCell>
                <TableCell class="hidden md:table-cell text-sm text-muted-foreground">
                  {{ enrollment.idCard || '-' }}
                </TableCell>
                <TableCell class="text-center">{{ enrollment.participantCount }}</TableCell>
                <TableCell class="hidden lg:table-cell text-sm text-muted-foreground">
                  {{ enrollment.submitTime }}
                </TableCell>
                <TableCell>
                  <Badge :class="getStatusBadgeClass(enrollment.status)" variant="outline" class="text-xs px-2 py-0.5">
                {{ getStatusLabel(enrollment.status) }}
              </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell text-sm text-muted-foreground">
                  {{ enrollment.remark || '-' }}
                </TableCell>
                <TableCell class="text-right">
                  <template v-if="enrollment.status === 'pending'">
                    <Button
                      size="sm"
                      variant="default"
                      class="mr-1"
                      :disabled="updatingId === enrollment.id"
                      @click="setEnrollmentStatus(enrollment.id, 'confirmed')"
                    >
                      {{ updatingId === enrollment.id ? '处理中…' : '确认' }}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="updatingId === enrollment.id"
                      @click="setEnrollmentStatus(enrollment.id, 'canceled')"
                    >
                      取消
                    </Button>
                  </template>
                  <template v-else-if="enrollment.status === 'confirmed'">
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="updatingId === enrollment.id"
                      @click="setEnrollmentStatus(enrollment.id, 'canceled')"
                    >
                      {{ updatingId === enrollment.id ? '处理中…' : '取消报名' }}
                    </Button>
                  </template>
                  <span v-else class="text-muted-foreground text-sm">—</span>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else>
              <TableCell :colspan="9" class="text-center py-8 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <SafeIcon name="SearchX" :size="32" class="text-muted-foreground/50" />
                  <p>暂无符合条件的报名记录</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t border-border p-4 flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                @click="currentPage > 1 && (currentPage--)"
                :class="{ 'pointer-events-none opacity-50': currentPage === 1 }"
              />
            </PaginationItem>

<PaginationItem v-for="page in totalPages" :key="page">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="currentPage = page"
                :class="[
                  'h-9 w-9 p-0',
                  currentPage === page && 'bg-accent text-accent-foreground',
                ]"
              >
                {{ page }}
              </Button>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                @click="currentPage < totalPages && (currentPage++)"
                :class="{ 'pointer-events-none opacity-50': currentPage === totalPages }"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>

    <!-- Return Button -->
    <div class="mt-8 flex justify-center">
      <Button variant="outline" as="a" :href="backToListHref" class="gap-2">
        <SafeIcon name="ArrowLeft" :size="16" />
        返回活动列表
      </Button>
    </div>
  </div>
</template>
