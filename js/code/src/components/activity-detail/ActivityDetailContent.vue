
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MOCK_ACTIVITIES } from '@/data/activity'

defineOptions({ name: 'ActivityDetailContent' })
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'

const props = defineProps<{ activityId?: string }>()
const isClient = ref(true)
const idFromUrl = ref('act-001')
const effectiveId = computed(() => props.activityId ?? idFromUrl.value)
const activity = computed(() => {
  return MOCK_ACTIVITIES.find(a => a.id === effectiveId.value) || MOCK_ACTIVITIES[0]
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

const sections = [
  {
    id: 'purpose',
    title: '活动目的',
    icon: 'Target',
    content: '通过组织志愿者进入社区，为行动不便的老人清理家庭卫生，并进行基础健康监测和谈心，传递温暖与关怀。'
  },
  {
    id: 'process',
    title: '活动流程',
    icon: 'ListChecks',
    items: [
      '09:00 - 09:30：志愿者集合与培训',
      '09:30 - 11:30：分组进入社区开展服务',
      '11:30 - 12:00：总结反馈与合影留念',
      '12:00：活动结束，志愿者自由离场'
    ]
  },
  {
    id: 'precautions',
    title: '注意事项',
    icon: 'AlertCircle',
    items: [
      '请穿着舒适的运动服装和鞋类',
      '自备防晒霜和饮用水',
      '尊重老人隐私，文明礼貌地进行服务',
      '如有特殊情况，请提前告知工作人员',
      '活动期间请遵守安全规则，听从工作人员指挥'
    ]
  }
]
</script>

<template>
  <div class="space-y-8">
    <!-- Main Content -->
<div class="space-y-8">
      <div v-for="section in sections" :key="section.id" class="space-y-4 text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SafeIcon :name="section.icon" :size="18" class="text-primary" />
          </div>
          <h2 class="text-lg font-bold border-l-4 border-primary pl-3">{{ section.title }}</h2>
        </div>

        <!-- Purpose Section -->
        <div v-if="section.id === 'purpose'" class="text-sm text-foreground/80 leading-relaxed px-1">
          {{ section.content }}
        </div>

        <!-- Process/Precautions Section -->
        <div v-else class="space-y-3">
          <div 
            v-for="(item, index) in section.items" 
            :key="index"
            class="flex items-start gap-3 p-3 rounded-xl bg-accent/40 border border-border/40"
          >
            <div class="shrink-0 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center mt-0.5">
              {{ index + 1 }}
            </div>
            <p class="text-sm text-foreground/90 leading-snug">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-border" />

    <!-- Organization Info -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <SafeIcon name="Building2" :size="20" />
          执行机构
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <p class="text-sm text-muted-foreground mb-1">机构名称</p>
          <p class="font-semibold">{{ activity.agencyName }}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-1">对接人</p>
          <p class="font-semibold">{{ activity.contactPerson }}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-1">联系电话</p>
          <a 
            v-if="activity.contactPhone"
            :href="`tel:${activity.contactPhone}`"
            class="font-semibold text-primary hover:underline"
          >
            {{ activity.contactPhone }}
          </a>
          <span v-else class="font-semibold text-muted-foreground">{{ activity.contactPhone || '—' }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Disclaimer -->
    <Card class="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle class="text-base flex items-center gap-2 text-destructive">
          <SafeIcon name="AlertTriangle" :size="18" />
          免责声明
        </CardTitle>
      </CardHeader>
      <CardContent class="text-sm text-foreground leading-relaxed">
        <p>
          参与者在参加本活动期间，应遵守相关法律法规和活动规则。参与者因个人原因（包括但不限于身体状况、个人行为等）导致的任何伤害或损失，由参与者自行承担责任。组织方已为参与者购买保险，具体保险条款请咨询工作人员。
        </p>
      </CardContent>
    </Card>
  </div>
</template>
