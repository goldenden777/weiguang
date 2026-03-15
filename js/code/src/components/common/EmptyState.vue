
<script setup lang="ts">
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

defineOptions({ name: 'EmptyState' })

interface Props {
  type?: 'no-activities' | 'no-enrollments' | 'no-tasks' | 'no-results' | 'activity-not-found'
  actionText?: string
  actionHref?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'no-results'
})

const emits = defineEmits<{
  action: []
}>()

const config = {
  'no-activities': {
    icon: 'CalendarOff',
    title: '暂无活动',
    description: '当前没有符合条件的活动，请尝试调整筛选条件或稍后再试',
  },
  'no-enrollments': {
    icon: 'Users',
    title: '暂无报名记录',
    description: '该活动还没有人报名，成为第一个参与者吧',
  },
  'no-tasks': {
    icon: 'CheckCircle',
    title: '暂无待处理任务',
    description: '当前没有需要审核的活动，保持良好状态',
  },
  'no-results': {
    icon: 'SearchX',
    title: '未找到结果',
    description: '没有找到符合条件的内容，请尝试其他关键词',
  },
  'activity-not-found': {
    icon: 'FileQuestion',
    title: '活动不存在',
    description: '该活动可能已结束或链接有误，请返回活动列表查看',
  },
}

const currentConfig = config[props.type]

const handleAction = () => {
  if (props.actionHref) {
    window.location.href = props.actionHref
  } else {
    emits('action')
  }
}
</script>

<template>
  <Empty>
    <EmptyHeader>
      <div class="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
        <SafeIcon :name="currentConfig.icon" :size="32" class="text-muted-foreground" />
      </div>
      <EmptyTitle>{{ currentConfig.title }}</EmptyTitle>
      <EmptyDescription>{{ currentConfig.description }}</EmptyDescription>
    </EmptyHeader>
    <EmptyContent v-if="actionText">
      <Button @click="handleAction">
        {{ actionText }}
      </Button>
    </EmptyContent>
  </Empty>
</template>
