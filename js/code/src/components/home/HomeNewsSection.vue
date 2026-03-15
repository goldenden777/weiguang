<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { getNewsList } from '@/services/content.service'
import type { NewsModel } from '@/data/content'
import { NEWS_CATEGORY_LABELS } from '@/data/content'

const props = withDefaults(
  defineProps<{ pageSize?: number; showViewAll?: boolean }>(),
  { pageSize: 6, showViewAll: true }
)

const list = ref<NewsModel[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await getNewsList({ page: page.value, pageSize: props.pageSize })
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  page.value = p
  load()
}

onMounted(() => load())
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">往期动态</h2>
      <a
        v-if="showViewAll && total > props.pageSize"
        href="./news-list.html"
        class="text-sm font-medium text-primary hover:underline"
      >
        查看更多
      </a>
    </div>
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-20 animate-pulse rounded-xl bg-muted" />
    </div>
    <div v-else-if="list.length === 0" class="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
      暂无往期动态
    </div>
    <div v-else class="space-y-3">
      <a
        v-for="item in list"
        :key="item.id"
        :href="`./news-detail.html?id=${item.id}`"
        class="group flex overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        <!-- 左侧：仅够显示日期与置顶的窄蓝色条 -->
        <div class="flex w-14 flex-shrink-0 flex-col sm:w-16">
          <!-- 非置顶：蓝色块上方灰色分类标签 -->
          <div
            v-if="!item.isTop"
            class="flex items-center justify-center border-b border-border/50 bg-muted/50 px-1 py-1 text-[9px] text-muted-foreground"
          >
            {{ NEWS_CATEGORY_LABELS[item.category] }}
          </div>
          <!-- 蓝色日期块（斜角），仅容纳年、月日、置顶 -->
          <div
            class="relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center bg-primary px-1 py-2 text-white"
            style="clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)"
          >
            <span class="text-[9px] opacity-90">{{ item.publishTime.slice(0, 4) }}</span>
            <span class="text-xs font-semibold">{{ item.publishTime.slice(5, 7) }}-{{ item.publishTime.slice(8, 10) }}</span>
            <span
              v-if="item.isTop"
              class="mt-0.5 rounded border border-primary bg-white px-1 py-0.5 text-[9px] font-medium text-primary"
            >
              置顶
            </span>
          </div>
        </div>
        <!-- 右侧：标题+摘要 | 查看详情与图片上下叠放 -->
        <div class="flex min-w-0 flex-1 bg-card">
          <div class="min-w-0 flex-1 p-3">
            <h3 class="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">{{ item.title }}</h3>
            <p class="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{{ item.summary }}</p>
          </div>
          <!-- 查看详情在上、图片在下，上下叠放 -->
          <div class="flex flex-shrink-0 flex-col items-center gap-1.5 p-2 pr-3">
            <span
              class="flex w-full items-center justify-center gap-0.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-[11px] font-medium"
            >
              查看详情
              <SafeIcon name="ChevronRight" :size="10" />
            </span>
            <div class="h-20 w-20 overflow-hidden rounded bg-muted sm:h-24 sm:w-24">
              <img
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-muted-foreground"
              >
                <SafeIcon name="Newspaper" :size="20" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div v-if="total > props.pageSize" class="flex justify-center gap-2 pt-4">
      <Button variant="outline" size="sm" :disabled="page <= 1" @click="goPage(page - 1)">
        上一页
      </Button>
      <span class="flex items-center px-2 text-sm text-muted-foreground">
        {{ page }} / {{ Math.ceil(total / props.pageSize) }}
      </span>
      <Button
        variant="outline"
        size="sm"
        :disabled="page * props.pageSize >= total"
        @click="goPage(page + 1)"
      >
        下一页
      </Button>
    </div>
  </section>
</template>
