
<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  isClient: boolean
}

defineProps<Props>()

const quickActions = [
  {
    icon: 'Plus',
    label: '创建机构账号',
    description: '为新的执行机构创建登录账号',
    href: '#',
  },
  {
    icon: 'Edit',
    label: '编辑分类标签',
    description: '管理活动分类和标签',
    href: '#',
  },
  {
    icon: 'FileText',
    label: '配置报名表单',
    description: '自定义报名表单字段',
    href: '#',
  },
  {
    icon: 'Settings',
    label: '基础设置',
    description: '网站名称、logo、联系方式等',
    href: '#',
  },
]
</script>

<template>
  <Card class="transition-all duration-300" :class="isClient ? 'opacity-100' : 'opacity-75'">
    <CardHeader>
      <CardTitle>快速操作</CardTitle>
      <CardDescription>常用的系统配置功能</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-2">
        <Button
          v-for="action in quickActions"
          :key="action.label"
          variant="ghost"
          class="w-full justify-start h-auto p-3"
          :href="action.href"
        >
          <SafeIcon :name="action.icon" :size="18" class="mr-3 text-primary flex-shrink-0" />
          <div class="text-left">
            <p class="font-medium text-sm">{{ action.label }}</p>
            <p class="text-xs text-muted-foreground">{{ action.description }}</p>
          </div>
          <SafeIcon name="ChevronRight" :size="16" class="ml-auto text-muted-foreground" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
