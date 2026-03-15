
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import StatisticsCard from './StatisticsCard.vue'
import ActivityOverviewCard from './ActivityOverviewCard.vue'
import { MOCK_ACTIVITIES, type ActivityStatus } from '@/data/activity'

const isClient = ref(true)

// Mock data for current agency
const currentAgencyId = 'agency-1'
const agencyActivities = MOCK_ACTIVITIES.filter(a => a.agencyId === currentAgencyId)

// Calculate statistics
const statistics = computed(() => {
  const stats = {
    pending: 0,
    published: 0,
    rejected: 0,
    closed: 0,
    totalEnrollments: 0,
  }

  agencyActivities.forEach(activity => {
    if (activity.status === 'pending') stats.pending++
    else if (activity.status === 'published') stats.published++
    else if (activity.status === 'rejected') stats.rejected++
    else if (activity.status === 'closed') stats.closed++
    
    if (activity.status === 'published') {
      stats.totalEnrollments += activity.currentParticipants
    }
  })

  return stats
})

// Recent activities (last 3)
const recentActivities = computed(() => {
  return agencyActivities
    .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    .slice(0, 3)
})

// Pending tasks
const pendingTasks = computed(() => {
  const tasks = []
  if (statistics.value.pending > 0) {
    tasks.push({
      id: 'pending',
      type: 'pending',
      title: `有 ${statistics.value.pending} 个活动待审核`,
      description: '请及时查看审核进度',
      icon: 'Clock',
      color: 'text-primary',
    })
  }
  if (statistics.value.rejected > 0) {
    tasks.push({
      id: 'rejected',
      type: 'rejected',
      title: `有 ${statistics.value.rejected} 个活动被驳回`,
      description: '请查看驳回原因并重新提交',
      icon: 'AlertCircle',
      color: 'text-destructive',
    })
  }
  return tasks
})

onMounted(() => {
  isClient.value = false
  
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <div class="flex min-h-screen bg-muted/30">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-border bg-background hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)]">
      <div class="p-6 space-y-6">
        <div>
          <h3 class="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            核心管理
          </h3>
          <nav class="space-y-1">
            <a href="./agency-dashboard.html" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md bg-primary/10 text-primary">
              <SafeIcon name="LayoutDashboard" :size="18" class="mr-3" />
              工作台概览
            </a>
            <a href="./agency-activity-list.html" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors">
              <SafeIcon name="ListChecks" :size="18" class="mr-3" />
              活动管理
            </a>
          </nav>
        </div>

        <div>
          <h3 class="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            数据服务
          </h3>
          <nav class="space-y-1">
            <a href="./agency-activity-list.html" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors">
              <SafeIcon name="Users" :size="18" class="mr-3" />
              报名名单
            </a>
            <a href="#" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors">
              <SafeIcon name="BarChart3" :size="18" class="mr-3" />
              统计报表
            </a>
          </nav>
        </div>
      </div>
      
      <div class="mt-auto p-4 border-t border-border">
        <Card class="bg-primary/5 border-none">
          <CardContent class="p-4 text-center">
            <p class="text-xs text-muted-foreground mb-3">需要技术支持？</p>
            <Button variant="outline" size="sm" class="w-full text-xs">联系基金会</Button>
          </CardContent>
        </Card>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 overflow-auto">
      <div class="p-4 lg:p-8 space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav class="flex text-xs text-muted-foreground mb-2 space-x-2 items-center">
              <span>工作台</span>
              <SafeIcon name="ChevronRight" :size="12" />
              <span class="text-foreground font-medium">概览</span>
            </nav>
            <h1 class="text-2xl font-bold tracking-tight">欢迎回来，微光志愿者联盟</h1>
            <p class="text-sm text-muted-foreground mt-1">今天是 2026年3月12日，以下是您的机构动态。</p>
          </div>
          <div class="flex items-center gap-3">
            <Button variant="outline" class="hidden sm:flex" as="a" href="./agency-activity-list.html">
              <SafeIcon name="Settings" :size="16" class="mr-2" />
              机构设置
            </Button>
            <Button as="a" href="./activity-proposal-form.html" class="shadow-lg shadow-primary/20">
              <SafeIcon name="Plus" :size="18" class="mr-2" />
              新建活动提报
            </Button>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div 
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          :class="[isClient ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4', 'transition-all duration-500 delay-100']"
        >
          <StatisticsCard
            title="等待审核"
            :value="statistics.pending"
            icon="Clock"
            color="text-blue-500"
            href="./agency-activity-list.html"
          />
          <StatisticsCard
            title="正在公示"
            :value="statistics.published"
            icon="Globe"
            color="text-emerald-500"
            href="./agency-activity-list.html"
          />
          <StatisticsCard
            title="累计驳回"
            :value="statistics.rejected"
            icon="AlertCircle"
            color="text-rose-500"
            href="./agency-activity-list.html"
          />
          <StatisticsCard
            title="报名预约"
            :value="statistics.totalEnrollments"
            icon="TrendingUp"
            color="text-orange-500"
            href="./agency-activity-list.html"
          />
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <!-- Left: Recent Activities Area -->
          <section 
            class="xl:col-span-2 space-y-6"
            :class="[isClient ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-500 delay-200']"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-6 bg-primary rounded-full"></div>
                <h2 class="text-lg font-bold">近期提报活动</h2>
              </div>
              <Button variant="link" size="sm" as="a" href="./agency-activity-list.html" class="text-primary">
                查看全部清单
                <SafeIcon name="ArrowRight" :size="14" class="ml-1" />
              </Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActivityOverviewCard
                v-for="activity in recentActivities"
                :key="activity.id"
                :activity="activity"
              />
            </div>

            <Card v-if="recentActivities.length === 0" class="border-dashed py-12 text-center">
              <CardContent>
                <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon name="FilePlus" :size="32" class="text-muted-foreground" />
                </div>
                <h3 class="text-lg font-medium text-foreground">暂无活动记录</h3>
                <p class="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
                  您可以点击右上角的“新建活动提报”来发布您的第一个公益活动。
                </p>
              </CardContent>
            </Card>
          </section>

          <!-- Right: Tasks & Notifications -->
          <section 
            class="space-y-6"
            :class="[isClient ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-500 delay-300']"
          >
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-6 bg-secondary rounded-full"></div>
              <h2 class="text-lg font-bold">待办与通知</h2>
            </div>
            
            <div class="space-y-4">
              <template v-if="pendingTasks.length > 0">
                <Card 
                  v-for="task in pendingTasks"
                  :key="task.id"
                  class="group hover:border-primary/50 transition-colors"
                >
                  <CardContent class="p-4">
                    <div class="flex items-start gap-3">
                      <div :class="['w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0', task.color]">
                        <SafeIcon :name="task.icon" :size="20" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-0.5">
                          <h3 class="font-semibold text-sm truncate">{{ task.title }}</h3>
                          <span class="text-[10px] text-muted-foreground whitespace-nowrap ml-2">刚刚</span>
                        </div>
                        <p class="text-xs text-muted-foreground line-clamp-2">{{ task.description }}</p>
                        <div class="mt-3 flex items-center gap-2">
                          <Button size="xs" variant="secondary" class="h-7 text-[10px] px-3">查看详情</Button>
                          <Button size="xs" variant="ghost" class="h-7 text-[10px] px-2 text-muted-foreground">忽略</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </template>
              
              <Card class="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                <div class="absolute -right-4 -bottom-4 opacity-10">
                  <SafeIcon name="ShieldCheck" :size="120" />
                </div>
                <CardContent class="p-6 relative z-10">
                  <Badge class="mb-3 bg-secondary text-secondary-foreground border-none">公告</Badge>
                  <h4 class="font-bold text-lg mb-2">公益机构入驻细则调整</h4>
                  <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    为进一步规范平台活动提报流程，我们更新了资质审核标准及物资申请模板...
                  </p>
                  <Button variant="outline" size="sm" class="bg-transparent border-slate-700 text-white hover:bg-slate-700">阅读全文</Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
