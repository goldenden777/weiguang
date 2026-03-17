
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { toast } from 'vue-sonner'

// Mock enrollment data
const mockEnrollment = {
  id: 'BM-20260312-001',
  activityTitle: '青岛崂山"守护夕阳"老年人陪伴活动',
  userName: '张三',
  submitTime: '2026-03-12 10:30:00',
  activityDate: '2026-03-20 09:00',
  activityLocation: '青岛市崂山区',
}

const isClient = ref(true)
const copySuccess = ref(false)

const copyEnrollmentId = async () => {
  try {
    await navigator.clipboard.writeText(mockEnrollment.id)
    copySuccess.value = true
    toast.success('报名编号已复制到剪贴板')
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    toast.error('复制失败，请手动复制')
  }
}

const handlePrint = () => {
  window.print()
}

onMounted(() => {
  isClient.value = false
  // Trigger animation on next frame
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
<Card class="border-none shadow-none bg-background overflow-hidden">
    <!-- Success Header -->
    <div class="px-6 py-6 text-center">
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-in fade-in zoom-in duration-700">
          <SafeIcon name="CheckCircle" :size="40" class="text-success" />
        </div>
      </div>
      <h2 class="text-2xl font-bold text-foreground mb-3 tracking-tight">
        报名提交成功
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed px-4">
        工作人员将在 48 小时内完成信息核实，请保持手机通畅。
      </p>
      <div class="mt-3 px-4">
        <div class="rounded-xl border border-border/50 bg-primary/5 px-4 py-3 text-left">
          <p class="text-sm text-foreground font-medium leading-relaxed">
            提醒：你可以随时回到首页，通过「报名查询」输入手机号查看报名订单。
          </p>
          <p class="text-xs text-muted-foreground mt-1 leading-relaxed">
            建议保存报名编号，便于后续精确查询。
          </p>
        </div>
      </div>
    </div>

    <CardContent class="px-4 space-y-6">
      <!-- Enrollment Number Section -->
      <div class="bg-muted/30 rounded-xl p-5 space-y-4 border border-border/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">报名编号</span>
          <Badge variant="secondary" class="bg-success/20 text-success-foreground hover:bg-success/20 border-none text-[10px]">
            审核中
          </Badge>
        </div>
        <div class="flex items-center justify-between gap-3">
          <code class="text-xl font-mono font-bold text-foreground break-all">
            {{ mockEnrollment.id }}
          </code>
          <Button
            size="sm"
            variant="ghost"
            @click="copyEnrollmentId"
            class="h-8 px-3 shrink-0"
            :class="[
              'transition-all duration-300',
              copySuccess ? 'text-success' : 'text-primary'
            ]"
          >
            <SafeIcon 
              :name="copySuccess ? 'Check' : 'Copy'" 
              :size="14" 
              class="mr-1.5"
            />
            <span class="text-xs">{{ copySuccess ? '已复制' : '复制' }}</span>
          </Button>
        </div>
      </div>

      <!-- Activity Information -->
      <div class="space-y-4 px-1">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <h3 class="font-bold text-base text-foreground">预约服务信息</h3>
        </div>
        <div class="grid gap-5">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <SafeIcon name="FileText" :size="16" class="text-primary" />
            </div>
            <div class="space-y-1">
              <p class="text-[11px] text-muted-foreground uppercase tracking-tight">活动课题</p>
              <p class="text-sm font-semibold text-foreground leading-snug">{{ mockEnrollment.activityTitle }}</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <SafeIcon name="Calendar" :size="16" class="text-primary" />
            </div>
            <div class="space-y-1">
              <p class="text-[11px] text-muted-foreground uppercase tracking-tight">预计时间</p>
              <p class="text-sm font-semibold text-foreground">{{ mockEnrollment.activityDate }}</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <SafeIcon name="MapPin" :size="16" class="text-primary" />
            </div>
            <div class="space-y-1">
              <p class="text-[11px] text-muted-foreground uppercase tracking-tight">服务地点</p>
              <p class="text-sm font-semibold text-foreground">{{ mockEnrollment.activityLocation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Participant Information -->
      <div class="space-y-4 pt-4 border-t border-border">
        <h3 class="font-semibold text-foreground">参与者信息</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">姓名</span>
            <span class="font-medium text-foreground">{{ mockEnrollment.userName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">参与人数</span>
            <span class="font-medium text-foreground">1 人</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">报名状态</span>
            <Badge class="bg-primary/10 text-primary border-primary/20">
              待确认
            </Badge>
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Action Buttons（不自动跳转，由用户自行决定） -->
    <div class="px-4 py-8 flex flex-col gap-3">
      <Button
        variant="default"
        class="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20"
        as="a"
        href="./enrollment-query.html"
      >
        <SafeIcon name="Search" :size="18" class="mr-2" />
        用手机号查询我的报名
      </Button>
      <Button
        variant="outline"
        class="w-full h-12 text-base font-medium rounded-xl"
        as="a"
        href="./home.html"
      >
        <SafeIcon name="Home" :size="18" class="mr-2" />
        返回首页
      </Button>
      <Button
        variant="secondary"
        class="w-full h-12 text-sm font-medium rounded-xl border-none bg-muted/50"
        @click="handlePrint"
      >
        <SafeIcon name="Printer" :size="16" class="mr-2" />
        保存当前报名凭证
      </Button>
    </div>
  </Card>
</template>

<style scoped>
@media print {
  :global(header),
  :global(footer),
  .action-buttons {
    display: none;
  }
}
</style>
