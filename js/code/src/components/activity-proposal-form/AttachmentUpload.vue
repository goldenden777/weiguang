
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Attachments {
  plan?: File
  images: File[]
  videos: File[]
}

interface Props {
  modelValue: Attachments
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Attachments]
}>()

const attachments = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const planInputRef = ref<HTMLInputElement>()
const imagesInputRef = ref<HTMLInputElement>()
const videosInputRef = ref<HTMLInputElement>()

const handlePlanUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    attachments.value = {
      ...attachments.value,
      plan: file
    }
  }
}

const handleImagesUpload = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  attachments.value = {
    ...attachments.value,
    images: [...attachments.value.images, ...files]
  }
}

const handleVideosUpload = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  attachments.value = {
    ...attachments.value,
    videos: [...attachments.value.videos, ...files]
  }
}

const removePlan = () => {
  attachments.value = {
    ...attachments.value,
    plan: undefined
  }
}

const removeImage = (index: number) => {
  attachments.value = {
    ...attachments.value,
    images: attachments.value.images.filter((_, i) => i !== index)
  }
}

const removeVideo = (index: number) => {
  attachments.value = {
    ...attachments.value,
    videos: attachments.value.videos.filter((_, i) => i !== index)
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Info Alert -->
    <Alert class="bg-primary/10 border-primary/20 text-primary">
      <SafeIcon name="Info" :size="16" class="mr-2" />
      <AlertDescription>
        上传清晰的活动方案、宣传图片和视频有助于提高审核通过率。所有文件将严格保密。
      </AlertDescription>
    </Alert>

    <!-- Activity Plan -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">活动方案</CardTitle>
        <CardDescription>上传Word或PDF格式的详细活动方案</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div 
          v-if="!attachments.plan"
          @click="planInputRef?.click()"
          class="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <SafeIcon name="FileUp" :size="32" class="mx-auto mb-2 text-muted-foreground" />
          <p class="font-medium">点击上传或拖拽文件</p>
          <p class="text-sm text-muted-foreground">支持 Word (.doc, .docx) 和 PDF 格式，单个文件不超过 10MB</p>
        </div>

        <div v-else class="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div class="flex items-center gap-3">
            <SafeIcon name="File" :size="24" class="text-primary" />
            <div>
              <p class="font-medium">{{ attachments.plan.name }}</p>
              <p class="text-sm text-muted-foreground">{{ formatFileSize(attachments.plan.size) }}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            @click="removePlan"
          >
            <SafeIcon name="X" :size="18" />
          </Button>
        </div>

        <input
          ref="planInputRef"
          type="file"
          accept=".doc,.docx,.pdf"
          class="hidden"
          @change="handlePlanUpload"
        />
      </CardContent>
    </Card>

    <!-- Images (首张作封面/海报) -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">宣传图片 / 海报</CardTitle>
        <CardDescription>上传活动相关的宣传图片（最多5张），首张将作为活动封面/海报展示</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <p class="text-sm text-muted-foreground rounded-md bg-muted/50 px-3 py-2 border border-border/50">
          <strong>海报尺寸建议：</strong>首图建议 1200×675 像素（16:9）或 800×450 像素，以便在活动列表与详情页获得最佳展示效果；其余图片比例不限。
        </p>
        <div 
          v-if="attachments.images.length < 5"
          @click="imagesInputRef?.click()"
          class="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <SafeIcon name="ImagePlus" :size="32" class="mx-auto mb-2 text-muted-foreground" />
          <p class="font-medium">点击上传或拖拽图片</p>
          <p class="text-sm text-muted-foreground">支持 JPG、PNG 格式，单个文件不超过 5MB</p>
        </div>

        <div v-if="attachments.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="(image, index) in attachments.images"
            :key="index"
            class="relative group"
          >
            <div class="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                :src="URL.createObjectURL(image)"
                :alt="image.name"
                class="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeImage(index)"
            >
              <SafeIcon name="X" :size="16" />
            </Button>
            <p class="text-xs text-muted-foreground mt-1 truncate">{{ image.name }}</p>
          </div>
        </div>

        <input
          ref="imagesInputRef"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          class="hidden"
          @change="handleImagesUpload"
        />
      </CardContent>
    </Card>

    <!-- Videos -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">宣传视频</CardTitle>
        <CardDescription>上传活动相关的宣传视频（最多3个）</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div 
          v-if="attachments.videos.length < 3"
          @click="videosInputRef?.click()"
          class="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <SafeIcon name="Video" :size="32" class="mx-auto mb-2 text-muted-foreground" />
          <p class="font-medium">点击上传或拖拽视频</p>
          <p class="text-sm text-muted-foreground">支持 MP4、MOV 格式，单个文件不超过 100MB</p>
        </div>

        <div v-if="attachments.videos.length > 0" class="space-y-2">
          <div 
            v-for="(video, index) in attachments.videos"
            :key="index"
            class="flex items-center justify-between p-4 bg-muted rounded-lg"
          >
            <div class="flex items-center gap-3">
              <SafeIcon name="Video" :size="24" class="text-primary" />
              <div>
                <p class="font-medium">{{ video.name }}</p>
                <p class="text-sm text-muted-foreground">{{ formatFileSize(video.size) }}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              @click="removeVideo(index)"
            >
              <SafeIcon name="X" :size="18" />
            </Button>
          </div>
        </div>

        <input
          ref="videosInputRef"
          type="file"
          accept="video/mp4,video/quicktime"
          multiple
          class="hidden"
          @change="handleVideosUpload"
        />
      </CardContent>
    </Card>
  </div>
</template>
