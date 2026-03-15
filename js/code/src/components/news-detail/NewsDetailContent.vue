<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { getNewsById } from '@/services/content.service'
import type { NewsModel } from '@/data/content'
import { NEWS_CATEGORY_LABELS } from '@/data/content'

const news = ref<NewsModel | null>(null)
const loading = ref(true)
const notFound = ref(false)

onMounted(async () => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  if (!id) {
    notFound.value = true
    loading.value = false
    return
  }
  try {
    news.value = await getNewsById(id)
    if (!news.value) notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div v-if="loading" class="py-16 text-center text-muted-foreground">加载中…</div>
    <div v-else-if="notFound || !news" class="py-16 text-center text-muted-foreground">未找到该新闻</div>
    <Card v-else class="overflow-hidden border-0 shadow-none">
      <div v-if="news.coverImage" class="aspect-video w-full overflow-hidden bg-muted">
        <img :src="news.coverImage" :alt="news.title" class="h-full w-full object-cover" />
      </div>
      <CardContent class="px-4 py-6 sm:px-8">
        <h1 class="text-xl font-bold tracking-tight sm:text-2xl">{{ news.title }}</h1>
        <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{{ news.publishTime.slice(0, 10) }}</span>
          <span>{{ NEWS_CATEGORY_LABELS[news.category] }}</span>
          <span>{{ news.source }} · {{ news.author }}</span>
        </div>
        <div v-if="news.summary" class="mt-4 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          {{ news.summary }}
        </div>
        <div
          class="prose prose-sm mt-6 max-w-none dark:prose-invert"
          v-html="news.body"
        />
      </CardContent>
    </Card>
    <div class="mt-8 text-center">
      <a
        href="./home.html"
        class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <SafeIcon name="ArrowLeft" :size="16" />
        返回首页
      </a>
    </div>
  </div>
</template>
