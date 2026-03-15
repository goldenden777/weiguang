
<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface EditedActivity {
  title: string
  content: string
  process: string
  precautions: string
  maxParticipants: number
  coverImage: string
  images: string[]
}

interface Props {
  original: EditedActivity
  edited: EditedActivity
  changePercentage: number
  isClient: boolean
}

const props = defineProps<Props>()

const changes = computed(() => {
  const result: Array<{ field: string; original: string; edited: string; changed: boolean }> = []

  if (props.original.title !== props.edited.title) {
    result.push({
      field: '活动标题',
      original: props.original.title,
      edited: props.edited.title,
      changed: true,
    })
  }

  if (props.original.content !== props.edited.content) {
    result.push({
      field: '活动简介',
      original: props.original.content.substring(0, 50) + '...',
      edited: props.edited.content.substring(0, 50) + '...',
      changed: true,
    })
  }

  if (props.original.process !== props.edited.process) {
    result.push({
      field: '活动流程',
      original: '已修改',
      edited: '已修改',
      changed: true,
    })
  }

  if (props.original.precautions !== props.edited.precautions) {
    result.push({
      field: '注意事项',
      original: '已修改',
      edited: '已修改',
      changed: true,
    })
  }

  if (props.original.maxParticipants !== props.edited.maxParticipants) {
    result.push({
      field: '最大人数',
      original: props.original.maxParticipants.toString(),
      edited: props.edited.maxParticipants.toString(),
      changed: true,
    })
  }

  if (props.original.coverImage !== props.edited.coverImage) {
    result.push({
      field: '封面图片',
      original: '已修改',
      edited: '已修改',
      changed: true,
    })
  }

  if (JSON.stringify(props.original.images) !== JSON.stringify(props.edited.images)) {
    result.push({
      field: '图片素材',
      original: `${props.original.images.length} 张`,
      edited: `${props.edited.images.length} 张`,
      changed: true,
    })
  }

  return result
})

const hasChanges = computed(() => changes.value.length > 0)
</script>

<template>
<Card class="shadow-sm">
    <CardHeader class="pb-4">
      <CardTitle class="text-lg flex items-center gap-2">
        <SafeIcon name="History" :size="18" class="text-primary" />
        版本对比
      </CardTitle>
      <CardDescription>
        <div class="flex items-center justify-between mt-2">
          <span>修改项目数：</span>
          <Badge :variant="hasChanges ? 'default' : 'outline'">
            {{ changes.length }} 项
          </Badge>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Change List -->
<div v-if="hasChanges" class="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar hover:no-scrollbar">
        <div
          v-for="(change, index) in changes"
          :key="index"
          class="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ change.field }}</span>
            <SafeIcon name="ArrowRight" :size="14" class="text-muted-foreground" />
          </div>
          <div class="text-xs space-y-1">
            <div class="line-clamp-1 text-muted-foreground">
              <span class="font-mono">原：{{ change.original }}</span>
            </div>
            <div class="line-clamp-1 text-primary">
              <span class="font-mono">新：{{ change.edited }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Changes -->
      <div v-else class="py-6 text-center">
        <SafeIcon name="CheckCircle" :size="32" class="mx-auto text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground">暂无修改</p>
      </div>

      <!-- Change Progress -->
      <div v-if="isClient" class="pt-4 border-t border-border">
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-muted-foreground">变更程度</span>
            <span class="font-medium">{{ changePercentage }}%</span>
          </div>
          <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              class="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
              :style="{ width: `${changePercentage}%` }"
            />
          </div>
        </div>
      </div>

<!-- Preview Info -->
      <div class="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
        <div class="flex items-start gap-2">
          <SafeIcon name="Info" :size="14" class="mt-0.5 flex-shrink-0 text-amber-500" />
          <p>提示：黄色高亮显示为本次修改的内容，请仔细核对。</p>
        </div>
        <div class="flex items-start gap-2">
          <SafeIcon name="Info" :size="14" class="mt-0.5 flex-shrink-0" />
          <p>修改内容将在保存后立即生效，所有用户将看到最新版本。</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>
