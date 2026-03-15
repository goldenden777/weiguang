
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

interface Image {
  id: string
  url: string
}

interface Props {
  attachments?: Attachment[]
  images?: Image[]
}

withDefaults(defineProps<Props>(), {
  attachments: () => [],
  images: () => []
})

const getFileIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'FileText',
    xlsx: 'Sheet',
    xls: 'Sheet',
    doc: 'FileText',
    docx: 'FileText',
    zip: 'Archive',
    rar: 'Archive',
  }
  return iconMap[type] || 'File'
}

const handleDownload = (attachment: Attachment) => {
  // Simulate download
  alert(`下载文件：${attachment.name}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Attachments -->
    <Card v-if="attachments.length > 0">
      <CardHeader>
        <CardTitle class="text-lg">附件文件</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div 
            v-for="attachment in attachments"
            :key="attachment.id"
            class="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <SafeIcon :name="getFileIcon(attachment.type)" :size="20" class="text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ attachment.name }}</p>
                <p class="text-xs text-muted-foreground">{{ attachment.size }}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              @click="handleDownload(attachment)"
            >
              <SafeIcon name="Download" :size="16" class="mr-1" />
              下载
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

<!-- Images -->
    <Card v-if="images.length > 0">
      <CardHeader>
        <CardTitle class="text-lg flex items-center gap-2">
          <SafeIcon name="Image" :size="20" class="text-primary" />
          活动宣传素材
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            v-for="image in images"
            :key="image.id"
            class="relative aspect-video rounded-xl overflow-hidden bg-muted group cursor-pointer border border-border shadow-sm"
          >
            <img
              v-if="image.url"
              :src="image.url"
              :alt="image.id"
              class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-muted">
              <SafeIcon name="Image" :size="32" class="text-muted-foreground" />
            </div>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <SafeIcon name="Maximize2" :size="20" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
