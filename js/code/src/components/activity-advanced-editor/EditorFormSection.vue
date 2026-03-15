
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  section: 'basic' | 'process' | 'images' | 'enrollment'
  data: EditedActivity
  isClient: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  update: [data: Partial<EditedActivity>]
}>()

const localData = ref({ ...props.data })
const uploadedImages = ref<string[]>([...props.data.images])

const handleTitleChange = (value: string) => {
  localData.value.title = value
  emits('update', { title: value })
}

const handleContentChange = (value: string) => {
  localData.value.content = value
  emits('update', { content: value })
}

const handleProcessChange = (value: string) => {
  localData.value.process = value
  emits('update', { process: value })
}

const handlePrecautionsChange = (value: string) => {
  localData.value.precautions = value
  emits('update', { precautions: value })
}

const handleMaxParticipantsChange = (value: string) => {
  const num = parseInt(value) || 0
  localData.value.maxParticipants = num
  emits('update', { maxParticipants: num })
}

const handleCoverImageChange = (value: string) => {
  localData.value.coverImage = value
  emits('update', { coverImage: value })
}

const handleImageUpload = (index: number, value: string) => {
  uploadedImages.value[index] = value
  emits('update', { images: uploadedImages.value })
}

const addImageSlot = () => {
  uploadedImages.value.push('')
  emits('update', { images: uploadedImages.value })
}

const removeImageSlot = (index: number) => {
  uploadedImages.value.splice(index, 1)
  emits('update', { images: uploadedImages.value })
}
</script>

<template>
  <!-- Basic Info Section -->
  <div v-if="section === 'basic'" class="space-y-6">
    <!-- Title -->
    <div class="space-y-2">
      <Label for="title">活动标题</Label>
      <Input
        id="title"
        :value="localData.title"
        placeholder="输入活动标题"
        @input="(e) => handleTitleChange((e.target as HTMLInputElement).value)"
      />
      <p class="text-xs text-muted-foreground">
        {{ localData.title.length }}/100 字符
      </p>
    </div>

    <!-- Content -->
<div class="space-y-2">
      <Label for="content">活动简介</Label>
      <Textarea
        id="content"
        :value="localData.content"
        placeholder="输入活动简介，包含活动背景、目的等"
        class="min-h-[260px] leading-relaxed"
        @input="(e) => handleContentChange((e.target as HTMLTextAreaElement).value)"
      />
      <p class="text-xs text-muted-foreground">
        {{ localData.content.length }}/1000 字符
      </p>
    </div>

    <!-- Cover Image URL -->
    <div class="space-y-2">
      <Label for="coverImage">封面图片 URL</Label>
      <Input
        id="coverImage"
        :value="localData.coverImage"
        placeholder="输入图片 URL"
        @input="(e) => handleCoverImageChange((e.target as HTMLInputElement).value)"
      />
<div v-if="localData.coverImage && isClient" class="mt-3 rounded-lg overflow-hidden border border-border bg-slate-50">
        <div class="aspect-video w-full relative">
          <img
            :src="localData.coverImage"
            alt="封面预览"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Process Section -->
  <div v-else-if="section === 'process'" class="space-y-6">
    <!-- Activity Process -->
    <div class="space-y-2">
      <Label for="process">活动流程</Label>
<Textarea
        id="process"
        :value="localData.process"
        placeholder="按行输入活动流程，例如：&#10;1. 签到报到&#10;2. 活动介绍&#10;3. 分组进行&#10;4. 总结反馈"
        class="min-h-[280px] font-mono text-sm leading-relaxed"
        @input="(e) => handleProcessChange((e.target as HTMLTextAreaElement).value)"
      />
      <p class="text-xs text-muted-foreground">
        提示：请按时间顺序填写活动流程，确保流程清晰易懂（支持 Markdown 格式）
      </p>
    </div>

    <!-- Precautions -->
    <div class="space-y-2">
      <Label for="precautions">注意事项</Label>
      <Textarea
        id="precautions"
        :value="localData.precautions"
        placeholder="输入参与者需要注意的事项，例如：&#10;• 请穿着舒适的运动服装&#10;• 自备防晒用品&#10;• 活动期间请遵守安全规则"
        class="min-h-[200px]"
        @input="(e) => handlePrecautionsChange((e.target as HTMLTextAreaElement).value)"
      />
      <p class="text-xs text-muted-foreground">
        支持 Markdown 格式，建议使用列表
      </p>
    </div>
  </div>

  <!-- Images Section -->
  <div v-else-if="section === 'images'" class="space-y-6">
<div class="bg-muted/50 p-4 rounded-lg">
      <p class="text-sm text-muted-foreground">
        <SafeIcon name="Info" :size="16" class="inline mr-2" />
        图片建议尺寸：建议上传1920x1080像素，支持JPG/PNG格式，不超过5MB
      </p>
    </div>

    <!-- Image Slots -->
    <div class="space-y-4">
      <div
        v-for="(image, index) in uploadedImages"
        :key="index"
        class="space-y-2"
      >
        <div class="flex items-center justify-between">
          <Label :for="`image-${index}`">图片 {{ index + 1 }}</Label>
          <Button
            v-if="uploadedImages.length > 1"
            variant="ghost"
            size="sm"
            @click="removeImageSlot(index)"
          >
            <SafeIcon name="Trash2" :size="16" class="text-destructive" />
          </Button>
        </div>
        <Input
          :id="`image-${index}`"
          :value="image"
          placeholder="输入图片 URL"
          @input="(e) => handleImageUpload(index, (e.target as HTMLInputElement).value)"
        />
        <div v-if="image && isClient" class="rounded-lg overflow-hidden border border-border">
          <img
            :src="image"
            :alt="`图片 ${index + 1}`"
            class="w-full h-32 object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Add Image Button -->
    <Button
      variant="outline"
      class="w-full"
      @click="addImageSlot"
    >
      <SafeIcon name="Plus" :size="16" class="mr-2" />
      添加图片
    </Button>
  </div>

  <!-- Enrollment Limits Section -->
  <div v-else-if="section === 'enrollment'" class="space-y-6">
    <!-- Max Participants -->
    <div class="space-y-2">
      <Label for="maxParticipants">最大参与人数</Label>
      <Input
        id="maxParticipants"
        type="number"
        :value="localData.maxParticipants"
        placeholder="输入最大参与人数"
        min="1"
@input="(e) => handleMaxParticipantsChange((e.target as HTMLInputElement).value)"
      />
      <p class="text-xs text-muted-foreground">
        注意：修改报名人数限制将立即生效，请谨慎操作
      </p>
    </div>

    <!-- Enrollment Info -->
    <Card class="bg-muted/50 border-0">
      <CardContent class="pt-6 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">当前报名人数：</span>
          <span class="font-medium">12 人</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">剩余名额：</span>
          <span class="font-medium">{{ Math.max(0, localData.maxParticipants - 12) }} 人</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">报名截止日期：</span>
          <span class="font-medium">2026-04-09</span>
        </div>
      </CardContent>
    </Card>

    <!-- Warning -->
    <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
      <p class="text-sm text-destructive">
        <SafeIcon name="AlertTriangle" :size="16" class="inline mr-2" />
        <strong>注意：</strong>如果新的最大人数小于当前报名人数，系统将自动关闭报名。
      </p>
    </div>
  </div>
</template>
