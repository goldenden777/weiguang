
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { MOCK_ACTIVITIES } from '@/data/activity'
import EditorFormSection from './EditorFormSection.vue'
import VersionComparisonPanel from './VersionComparisonPanel.vue'

interface EditedActivity {
  title: string
  content: string
  process: string
  precautions: string
  maxParticipants: number
  coverImage: string
  images: string[]
}

const isClient = ref(true)
const activeTab = ref('basic')
const isSaving = ref(false)
const hasChanges = ref(false)

// Mock: Get activity from URL params (default to first activity)
const currentActivity = ref(MOCK_ACTIVITIES[0])

const editedData = ref<EditedActivity>({
  title: currentActivity.value.title,
  content: currentActivity.value.content,
  process: '1. 签到报到\n2. 活动介绍\n3. 分组进行\n4. 总结反馈',
  precautions: '• 请穿着舒适的运动服装\n• 自备防晒用品\n• 活动期间请遵守安全规则',
  maxParticipants: currentActivity.value.maxParticipants,
  coverImage: currentActivity.value.coverImage,
  images: [
    'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/63fbadef-a907-46af-a21f-03b47db46297.png',
    'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/6fa022c3-0dda-468f-bebb-ecd5ceb52ce4.png',
  ],
})

const originalData = ref<EditedActivity>({ ...editedData.value })

onMounted(() => {
  isClient.value = false
  
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

const handleDataChange = (newData: Partial<EditedActivity>) => {
  editedData.value = { ...editedData.value, ...newData }
  hasChanges.value = JSON.stringify(editedData.value) !== JSON.stringify(originalData.value)
}

const handleSave = async () => {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSaving.value = false
  hasChanges.value = false
  originalData.value = { ...editedData.value }
  
  // Show success message (would use toast in real app)
  alert('活动内容已成功保存！')
  
  // Redirect back
  if (typeof window !== 'undefined') {
    window.location.href = './admin-all-activities.html'
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm('您有未保存的修改，确定要放弃吗？')) {
      if (typeof window !== 'undefined') {
        window.location.href = './admin-all-activities.html'
      }
    }
  } else {
    if (typeof window !== 'undefined') {
      window.location.href = './admin-all-activities.html'
    }
  }
}

const changePercentage = computed(() => {
  const original = JSON.stringify(originalData.value)
  const edited = JSON.stringify(editedData.value)
  return original === edited ? 0 : 100
})
</script>

<template>
<div class="max-w-7xl mx-auto px-6 py-4">
    <!-- Warning Alert -->
    <Alert class="mb-8 border-primary/20 bg-primary/5 shadow-sm">
      <SafeIcon name="AlertCircle" :size="18" class="text-primary" />
      <AlertTitle class="ml-2">专业编辑模式</AlertTitle>
      <AlertDescription class="ml-2">
        您当前正处于高级内容编辑模式。对已上架活动（ID: {{"ACT-001" || currentActivity.id}}）的所有修改都将直接映射到 C 端用户界面。
      </AlertDescription>
    </Alert>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Main Editor -->
      <div class="lg:col-span-8">
        <Card class="shadow-md border-border/60">
          <CardHeader>
            <CardTitle>编辑活动内容</CardTitle>
            <CardDescription>
              修改活动的流程、图片、报名限制等信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs v-model="activeTab" class="w-full">
              <TabsList class="grid w-full grid-cols-4">
                <TabsTrigger value="basic">基础信息</TabsTrigger>
                <TabsTrigger value="process">流程详情</TabsTrigger>
                <TabsTrigger value="images">图片素材</TabsTrigger>
                <TabsTrigger value="enrollment">报名限制</TabsTrigger>
              </TabsList>

              <!-- Basic Info Tab -->
              <TabsContent value="basic" class="space-y-4 mt-6">
                <EditorFormSection
                  :is-client="isClient"
                  section="basic"
                  :data="editedData"
                  @update="handleDataChange"
                />
              </TabsContent>

              <!-- Process Tab -->
              <TabsContent value="process" class="space-y-4 mt-6">
                <EditorFormSection
                  :is-client="isClient"
                  section="process"
                  :data="editedData"
                  @update="handleDataChange"
                />
              </TabsContent>

              <!-- Images Tab -->
              <TabsContent value="images" class="space-y-4 mt-6">
                <EditorFormSection
                  :is-client="isClient"
                  section="images"
                  :data="editedData"
                  @update="handleDataChange"
                />
              </TabsContent>

              <!-- Enrollment Tab -->
              <TabsContent value="enrollment" class="space-y-4 mt-6">
                <EditorFormSection
                  :is-client="isClient"
                  section="enrollment"
                  :data="editedData"
                  @update="handleDataChange"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

<!-- Version Comparison Panel -->
      <div class="lg:col-span-4 sticky top-24">
        <VersionComparisonPanel
          :is-client="isClient"
          :original="originalData"
          :edited="editedData"
          :change-percentage="changePercentage"
        />

        <!-- Action Buttons -->
        <div class="mt-6 space-y-3">
          <Button
            class="w-full"
            :disabled="!hasChanges || isSaving"
            @click="handleSave"
          >
            <SafeIcon v-if="isSaving" name="Loader2" :size="16" class="mr-2 animate-spin" />
            <span v-else>{{ hasChanges ? '保存修改' : '无修改' }}</span>
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :disabled="isSaving"
            @click="handleCancel"
          >
            取消
          </Button>
        </div>

        <!-- Change Summary -->
        <Card class="mt-6 bg-muted/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm">修改摘要</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">修改状态：</span>
              <span :class="hasChanges ? 'text-primary font-medium' : 'text-muted-foreground'">
                {{ hasChanges ? '有未保存修改' : '无修改' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">变更程度：</span>
              <span class="font-medium">{{ changePercentage }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">活动状态：</span>
              <span class="text-success font-medium">已上架</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.tabs-content) {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
