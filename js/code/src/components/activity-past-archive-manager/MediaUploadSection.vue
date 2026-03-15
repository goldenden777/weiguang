
<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { ArchiveMedia } from '@/data/archive'

interface Props {
  mediaList: ArchiveMedia[]
}

interface Emits {
  mediaAdded: [media: ArchiveMedia]
  mediaRemoved: [index: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const uploadingType = ref<'image' | 'video' | null>(null)
const caption = ref('')

const handleFileSelect = async (event: Event, type: 'image' | 'video') => {
  const input = event.target as HTMLInputElement
  const files = input.files
  
  if (!files || files.length === 0) return
  
  uploadingType.value = type
  
  // 模拟文件上传
  for (const file of files) {
    // 这里应该上传到服务器，现在模拟生成 URL
    const mockUrl = URL.createObjectURL(file)
    
    const media: ArchiveMedia = {
      type,
      url: mockUrl,
      caption: caption.value || `${type === 'image' ? '活动照片' : '活动视频'}`
    }
    
    emit('mediaAdded', media)
  }
  
  uploadingType.value = null
  caption.value = ''
  input.value = ''
}

const getMediaIcon = (type: 'image' | 'video') => {
  return type === 'image' ? 'Image' : 'Video'
}

const getMediaTypeLabel = (type: 'image' | 'video') => {
  return type === 'image' ? '图片' : '视频'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 上传区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 图片上传 -->
      <Card class="border-2 border-dashed hover:border-primary transition-colors">
        <CardContent class="p-6">
          <div class="flex flex-col items-center justify-center space-y-3">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <SafeIcon name="Image" :size="24" class="text-primary" />
            </div>
            <div class="text-center">
              <p class="font-medium text-sm">上传活动照片</p>
              <p class="text-xs text-muted-foreground">支持 JPG、PNG、WebP</p>
            </div>
            <Label class="cursor-pointer">
              <Button variant="outline" size="sm" as-child>
                <span>选择图片</span>
              </Button>
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="(e) => handleFileSelect(e, 'image')"
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      <!-- 视频上传 -->
      <Card class="border-2 border-dashed hover:border-primary transition-colors">
        <CardContent class="p-6">
          <div class="flex flex-col items-center justify-center space-y-3">
            <div class="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <SafeIcon name="Video" :size="24" class="text-secondary" />
            </div>
            <div class="text-center">
              <p class="font-medium text-sm">上传活动视频</p>
              <p class="text-xs text-muted-foreground">支持 MP4、WebM</p>
            </div>
            <Label class="cursor-pointer">
              <Button variant="outline" size="sm" as-child>
                <span>选择视频</span>
              </Button>
              <input
                type="file"
                multiple
                accept="video/*"
                class="hidden"
                @change="(e) => handleFileSelect(e, 'video')"
              />
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 已上传媒体列表 -->
    <div v-if="mediaList.length > 0" class="space-y-3">
      <p class="text-sm font-medium">已上传媒体 ({{ mediaList.length }})</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(media, index) in mediaList"
          :key="index"
          class="relative group rounded-lg overflow-hidden bg-muted"
        >
          <!-- 媒体预览 -->
          <div class="aspect-video bg-muted flex items-center justify-center">
            <img
              v-if="media.type === 'image'"
              :src="media.url"
              :alt="media.caption"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex flex-col items-center justify-center space-y-2">
              <SafeIcon name="Video" :size="32" class="text-muted-foreground" />
              <span class="text-xs text-muted-foreground">视频预览</span>
            </div>
          </div>

          <!-- 媒体信息 -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-3">
            <div class="flex items-start justify-between">
              <Badge variant="outline" class="bg-background/80">
                {{ getMediaTypeLabel(media.type) }}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 bg-destructive/80 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                @click="emit('mediaRemoved', index)"
              >
                <SafeIcon name="Trash2" :size="16" />
              </Button>
            </div>
            <p v-if="media.caption" class="text-xs text-white line-clamp-2">
              {{ media.caption }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-8">
      <SafeIcon name="ImageOff" :size="32" class="mx-auto text-muted-foreground mb-2" />
      <p class="text-sm text-muted-foreground">还未上传任何媒体文件</p>
    </div>

    <!-- 上传提示 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
      <p class="text-sm font-medium text-blue-900">上传建议：</p>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• 建议上传 3-5 张高质量活动照片</li>
        <li>• 视频时长建议不超过 5 分钟</li>
        <li>• 为每个媒体文件添加描述性标题</li>
        <li>• 确保媒体内容与活动相关且无敏感信息</li>
      </ul>
    </div>
  </div>
</template>
