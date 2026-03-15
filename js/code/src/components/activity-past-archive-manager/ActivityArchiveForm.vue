
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'
import MediaUploadSection from './MediaUploadSection.vue'
import type { ActivityModel } from '@/data/activity'
import type { ActivityArchiveModel, ArchiveMedia } from '@/data/archive'

interface Props {
  activity: ActivityModel
  existingArchive?: ActivityArchiveModel
}

interface Emits {
  published: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isClient = ref(true)
const isSaving = ref(false)
const isPublishing = ref(false)
const activeTab = ref('summary')

// 表单数据
const formData = ref({
  summary: '',
  totalImpact: '',
  mediaList: [] as ArchiveMedia[]
})

const isFormValid = computed(() => {
  return formData.value.summary && formData.value.summary.trim().length > 0 && 
         formData.value.totalImpact && formData.value.totalImpact.trim().length > 0 &&
         formData.value.mediaList.length > 0
})

onMounted(() => {
  isClient.value = false
  
  // 加载现有数据
  if (props.existingArchive) {
    formData.value = {
      summary: props.existingArchive.summary,
      totalImpact: props.existingArchive.totalImpact,
      mediaList: [...props.existingArchive.mediaList]
    }
  }
  
  setTimeout(() => {
    isClient.value = true
  }, 0)
})

const handleMediaAdded = (media: ArchiveMedia) => {
  formData.value.mediaList.push(media)
}

const handleMediaRemoved = (index: number) => {
  formData.value.mediaList.splice(index, 1)
}

const handleSave = async () => {
  isSaving.value = true
  try {
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('草稿已保存', formData.value)
  } finally {
    isSaving.value = false
  }
}

const handlePublish = async () => {
  if (!isFormValid.value) return
  
  isPublishing.value = true
  try {
    // 模拟发布
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('回顾已发布', formData.value)
    emit('published')
  } finally {
    isPublishing.value = false
  }
}

import { computed } from 'vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>编辑活动回顾</CardTitle>
      <CardDescription>
        为已结束的活动添加总结、成果数据和多媒体内容
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- 提示信息 -->
      <Alert v-if="!isFormValid" class="bg-amber-50 border-amber-200">
        <SafeIcon name="AlertCircle" :size="16" class="text-amber-600" />
        <AlertDescription class="text-amber-800">
          请填写活动总结、成果数据并至少上传一张媒体文件后再发布
        </AlertDescription>
      </Alert>

      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="summary">活动总结</TabsTrigger>
          <TabsTrigger value="impact">成果数据</TabsTrigger>
          <TabsTrigger value="media">
            多媒体
            <Badge v-if="isClient || formData.mediaList.length > 0" variant="secondary" class="ml-2">
              {{ formData.mediaList.length }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <!-- 活动总结标签页 -->
        <TabsContent value="summary" class="space-y-4 mt-4">
          <div class="space-y-2">
            <Label for="summary">活动总结</Label>
<Textarea
              id="summary"
              v-model="formData.summary"
              placeholder="请输入活动总结，包括活动亮点、志愿者表现、参与者反馈等..."
              class="min-h-[240px] resize-none leading-relaxed text-sm md:text-base"
            />
            <p class="text-xs text-muted-foreground">
              {{ (formData.summary || '').length }} / 1000 字符
            </p>
          </div>
        </TabsContent>

        <!-- 成果数据标签页 -->
        <TabsContent value="impact" class="space-y-4 mt-4">
          <div class="space-y-2">
            <Label for="impact">成果概报</Label>
<Textarea
              id="impact"
              v-model="formData.totalImpact"
              placeholder="请输入活动成果数据，如：受助人数、清理垃圾重量、募集资金、参与志愿者数等..."
              class="min-h-[240px] resize-none leading-relaxed text-sm md:text-base"
            />
            <p class="text-xs text-muted-foreground">
              {{ (formData.totalImpact || '').length }} / 500 字符
            </p>
          </div>

          <!-- 成果数据示例 -->
          <div class="bg-muted/50 rounded-lg p-4 space-y-2">
            <p class="text-sm font-medium">成果数据示例：</p>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li>• 参与志愿者：50 人</li>
              <li>• 受助老人：20 户</li>
              <li>• 清理垃圾：120 公斤</li>
              <li>• 募集资金：5000 元</li>
            </ul>
          </div>
        </TabsContent>

        <!-- 多媒体标签页 -->
        <TabsContent value="media" class="space-y-4 mt-4">
          <MediaUploadSection
            :media-list="formData.mediaList"
            @media-added="handleMediaAdded"
            @media-removed="handleMediaRemoved"
          />
        </TabsContent>
      </Tabs>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          @click="handleSave"
          :disabled="isSaving"
        >
          <SafeIcon v-if="!isSaving" name="Save" :size="16" class="mr-2" />
          <span v-if="isSaving" class="inline-block animate-spin mr-2">
            <SafeIcon name="Loader2" :size="16" />
          </span>
          {{ isSaving ? '保存中...' : '保存草稿' }}
        </Button>

        <Button
          variant="default"
          @click="handlePublish"
          :disabled="!isFormValid || isPublishing"
        >
          <SafeIcon v-if="!isPublishing" name="Upload" :size="16" class="mr-2" />
          <span v-if="isPublishing" class="inline-block animate-spin mr-2">
            <SafeIcon name="Loader2" :size="16" />
          </span>
          {{ isPublishing ? '发布中...' : '确认发布回顾' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
:deep(.tabs-content) {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
