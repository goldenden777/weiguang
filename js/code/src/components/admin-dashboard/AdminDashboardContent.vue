
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon.vue'
import StatisticsCard from './StatisticsCard.vue'
import PendingTasksWidget from './PendingTasksWidget.vue'
import ActivityTrendChart from './ActivityTrendChart.vue'
import QuickActionPanel from './QuickActionPanel.vue'
import RecentActivityFeed from './RecentActivityFeed.vue'
import { MOCK_ACTIVITIES } from '@/data/activity'

const isClient = ref(true)

// Mock statistics data
const statistics = ref({
  totalActivities: 24,
  pendingReview: 3,
  publishedActivities: 18,
  totalEnrollments: 156,
  agenciesCount: 8,
  categoriesCount: 5,
})

// Mock pending tasks
const pendingTasks = ref([
  {
    id: 'task-1',
    title: '暑期支教计划：点亮山区孩子的梦想',
    agency: '益启航教育中心',
    submittedDate: '2026-03-10',
    daysWaiting: 2,
  },
  {
    id: 'task-2',
    title: '社区志愿服务周末活动',
    agency: '社区服务中心',
    submittedDate: '2026-03-11',
    daysWaiting: 1,
  },
  {
    id: 'task-3',
    title: '环保宣传教育活动',
    agency: '环保志愿者协会',
    submittedDate: '2026-03-12',
    daysWaiting: 0,
  },
])

// Mock trend data for chart
const trendData = ref([
  { month: '1月', activities: 8, enrollments: 45 },
  { month: '2月', activities: 12, enrollments: 78 },
  { month: '3月', activities: 18, enrollments: 156 },
])

// Mock recent activities
const recentActivities = ref([
  {
    id: 'act-001',
    title: '青岛崂山"守护夕阳"老年人陪伴活动',
    agency: '微光志愿者联盟',
    action: '已上架',
    timestamp: '2小时前',
    type: 'published',
  },
  {
    id: 'act-002',
    title: '暑期支教计划：点亮山区孩子的梦想',
    agency: '益启航教育中心',
    action: '待审核',
    timestamp: '1天前',
    type: 'pending',
  },
  {
    id: 'act-003',
    title: '金沙滩净滩行动：保护蔚蓝海岸线',
    agency: '海蓝环保社团',
    action: '已下架',
    timestamp: '3天前',
    type: 'offline',
  },
])

onMounted(() => {
  isClient.value = false
  
  // Simulate data loading
  setTimeout(() => {
    isClient.value = true
  }, 100)
})

const navigateTo = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path
  }
}
</script>

<template>
<div class="flex min-h-[calc(100vh-64px)] bg-slate-50">
    <!-- Sidebar Navigation -->
    <aside class="w-64 border-r border-border bg-background flex flex-col hidden lg:flex">
      <div class="p-6">
        <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">管理控制</h2>
        <nav class="space-y-1">
          <a href="./admin-dashboard.html" class="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
            <SafeIcon name="LayoutDashboard" :size="18" />
            概览信息
          </a>
          <a href="./activity-audit-list.html" class="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">
            <SafeIcon name="CheckSquare" :size="18" />
            活动审核
            <Badge v-if="statistics.pendingReview > 0" variant="destructive" class="ml-auto h-5 px-1 min-w-[20px] flex items-center justify-center">{{ statistics.pendingReview }}</Badge>
          </a>
          <a href="./admin-all-activities.html" class="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">
            <SafeIcon name="Table" :size="18" />
            全量活动
          </a>
          <a href="./user-account-management.html" class="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">
            <SafeIcon name="Users" :size="18" />
            用户管理
          </a>
          <a href="./system-config-center.html" class="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">
            <SafeIcon name="Settings" :size="18" />
            系统配置
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-6">
        <Card class="bg-primary/5 border-none shadow-none">
          <CardContent class="p-4">
            <p class="text-xs text-muted-foreground leading-relaxed">如有技术问题，请联系系统运维人员或访问帮助中心。</p>
            <Button variant="link" size="sm" class="px-0 h-auto mt-2 text-primary">技术支持</Button>
          </CardContent>
        </Card>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Page Header Section -->
      <div class="bg-background border-b border-border shadow-sm">
        <div class="px-8 py-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>管理端</span>
                <SafeIcon name="ChevronRight" :size="12" />
                <span class="text-foreground font-medium underline underline-offset-4">控制台概览</span>
              </div>
              <h1 class="text-2xl font-bold tracking-tight">管理员控制台</h1>
              <p class="text-muted-foreground text-sm mt-1">全局动态监控与活动审核中心。</p>
            </div>
            <div class="flex items-center gap-3">
              <Button variant="outline" size="sm" class="bg-background">
                <SafeIcon name="RefreshCw" :size="16" class="mr-2" />
                刷新数据
              </Button>
              <Button variant="default" size="sm" class="px-4 shadow-sm">
                <SafeIcon name="Download" :size="16" class="mr-2" />
                导出月度报表
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-8 py-8 space-y-8 max-w-[1600px] mx-auto">
        <!-- Statistics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticsCard
            title="待审核活动"
            :value="statistics.pendingReview"
            icon="Clock"
            color="primary"
            :is-client="isClient"
          />
          <StatisticsCard
            title="活跃活动"
            :value="statistics.publishedActivities"
            icon="Zap"
            color="success"
            :is-client="isClient"
          />
          <StatisticsCard
            title="总报名人数"
            :value="statistics.totalEnrollments"
            icon="Users2"
            color="secondary"
            :is-client="isClient"
          />
          <StatisticsCard
            title="注册执行机构"
            :value="statistics.agenciesCount"
            icon="Building"
            color="primary"
            :is-client="isClient"
          />
        </div>

        <!-- Dashboard Layout: 2:1 column ratio -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left: Detailed Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Activity Trend -->
            <ActivityTrendChart
              :data="trendData"
              :is-client="isClient"
            />

            <!-- Data Management Matrix -->
            <Card>
              <CardHeader class="pb-3 border-b border-border/50">
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="text-lg">管理功能矩阵</CardTitle>
                    <CardDescription>系统全量数据与模块配置入口</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" class="text-primary h-8" @click="navigateTo('./admin-all-activities.html')">查看全图</Button>
                </div>
              </CardHeader>
              <CardContent class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    class="group flex flex-col p-4 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    @click="navigateTo('./activity-audit-list.html')"
                  >
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                      <SafeIcon name="CheckCircle2" :size="20" />
                    </div>
                    <span class="font-semibold mb-1">审核流水线</span>
                    <p class="text-xs text-muted-foreground">处理执行机构发起的活动提报请求，进行合规性审查。</p>
                  </div>

                  <div 
                    class="group flex flex-col p-4 rounded-xl border border-border/60 hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer"
                    @click="navigateTo('./admin-all-activities.html')"
                  >
                    <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                      <SafeIcon name="BarChart3" :size="20" />
                    </div>
                    <span class="font-semibold mb-1">活动数据治理</span>
                    <p class="text-xs text-muted-foreground">对已上线活动进行内容修正、强制下架或往期归档管理。</p>
                  </div>

                  <div 
                    class="group flex flex-col p-4 rounded-xl border border-border/60 hover:border-blue-500/50 hover:bg-blue-50 transition-all cursor-pointer"
                    @click="navigateTo('./user-account-management.html')"
                  >
                    <div class="w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                      <SafeIcon name="ShieldCheck" :size="20" />
                    </div>
                    <span class="font-semibold mb-1">组织与权限</span>
                    <p class="text-xs text-muted-foreground">管理机构准入、账号分配以及平台层级的管理权限。</p>
                  </div>

                  <div 
                    class="group flex flex-col p-4 rounded-xl border border-border/60 hover:border-violet-500/50 hover:bg-violet-50 transition-all cursor-pointer"
                    @click="navigateTo('./system-config-center.html')"
                  >
                    <div class="w-10 h-10 rounded-lg bg-violet-100/50 flex items-center justify-center text-violet-600 mb-3 group-hover:scale-110 transition-transform">
                      <SafeIcon name="Sliders" :size="20" />
                    </div>
                    <span class="font-semibold mb-1">参数配置中心</span>
                    <p class="text-xs text-muted-foreground">定制报名表单字段、活动标签分类以及全站通用协议。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right: Status and Feed -->
          <div class="space-y-8">
            <!-- Pending Tasks -->
            <PendingTasksWidget
              :tasks="pendingTasks"
              :is-client="isClient"
              @view-task="(taskId) => navigateTo('./activity-audit-list.html')"
            />

            <!-- Activity Feed -->
            <RecentActivityFeed
              :activities="recentActivities"
              :is-client="isClient"
            />
            
            <!-- System Pulse (Decorative/Simple Info) -->
            <Card class="bg-slate-900 text-white overflow-hidden relative">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <SafeIcon name="Cpu" :size="80" />
              </div>
              <CardHeader>
                <CardTitle class="text-base font-medium flex items-center gap-2 text-white">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  系统健康度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="opacity-70">API 服务器响应</span>
                      <span>99.9%</span>
                    </div>
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div class="w-[99%] h-full bg-emerald-400"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="opacity-70">存储空间使用</span>
                      <span>42%</span>
                    </div>
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div class="w-[42%] h-full bg-blue-400"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
