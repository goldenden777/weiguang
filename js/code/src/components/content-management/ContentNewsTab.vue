<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { NewsModel, NewsCategory } from '@/data/content'
import { NEWS_CATEGORY_LABELS } from '@/data/content'
import {
  getNewsList,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '@/services/content.service'
import { toast } from 'vue-sonner'

const list = ref<NewsModel[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const dialogOpen = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  summary: '',
  body: '',
  coverImage: '',
  publishTime: '',
  isTop: false,
  source: '',
  author: '',
  category: 'foundation' as NewsCategory,
})

const categoryOptions = Object.entries(NEWS_CATEGORY_LABELS).map(([value, label]) => ({ value: value as NewsCategory, label }))

const coverImageInputRef = ref<HTMLInputElement | null>(null)
const COVER_IMAGE_MAX_SIZE = 2 * 1024 * 1024 // 2MB
const COVER_IMAGE_RECOMMEND = '1200×675（16:9）或 800×450，作为列表卡片封面'

function triggerCoverImageUpload() {
  coverImageInputRef.value?.click()
}

function onCoverImageChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > COVER_IMAGE_MAX_SIZE) {
    toast.error('图片大小不能超过 2MB')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.coverImage = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function openCreate() {
  editingId.value = null
  form.value = {
    title: '',
    summary: '',
    body: '',
    coverImage: '',
    publishTime: new Date().toISOString().slice(0, 16),
    isTop: false,
    source: '微光公益',
    author: '',
    category: 'foundation',
  }
  dialogOpen.value = true
}

async function openEdit(item: NewsModel) {
  editingId.value = item.id
  const detail = await getNewsById(item.id)
  if (!detail) return
  form.value = {
    title: detail.title,
    summary: detail.summary,
    body: detail.body,
    coverImage: detail.coverImage,
    publishTime: detail.publishTime.slice(0, 16),
    isTop: detail.isTop,
    source: detail.source,
    author: detail.author,
    category: detail.category,
  }
  dialogOpen.value = true
}

async function save() {
  if (!form.value.title?.trim()) {
    toast.error('请填写标题')
    return
  }
  if (!form.value.source?.trim() || !form.value.author?.trim()) {
    toast.error('请填写来源和作者')
    return
  }
  const payload = {
    ...form.value,
    publishTime: new Date(form.value.publishTime).toISOString(),
  }
  saving.value = true
  try {
    if (editingId.value) {
      await updateNews(editingId.value, payload)
      toast.success('已更新')
      const idx = list.value.findIndex((n) => n.id === editingId.value)
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...payload }
    } else {
      const { id } = await createNews(payload)
      toast.success('已添加')
      list.value.unshift({ ...payload, id } as NewsModel)
    }
    dialogOpen.value = false
    loadList()
  } catch (e) {
    toast.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(item: NewsModel) {
  if (!confirm(`确定删除「${item.title}」吗？`)) return
  try {
    await deleteNews(item.id)
    toast.success('已删除')
    list.value = list.value.filter((n) => n.id !== item.id)
    total.value = Math.max(0, total.value - 1)
    loadList()
  } catch {
    toast.error('删除失败')
  }
}

async function loadList() {
  loading.value = true
  try {
    const res = await getNewsList({ page: page.value, pageSize })
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

onMounted(() => loadList())
</script>

<template>
  <div class="space-y-6">
    <Card class="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
      <CardHeader class="border-b border-border bg-white py-5 px-6">
        <div class="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle class="text-lg">往期动态</CardTitle>
            <CardDescription class="mt-1.5">管理往期动态列表与详情，支持富文本正文、置顶、分类。门户首页以卡片分页展示。</CardDescription>
          </div>
          <Button class="shrink-0" @click="openCreate">
            <SafeIcon name="Plus" :size="16" class="mr-2" />
            新增
          </Button>
        </div>
      </CardHeader>
      <CardContent class="flex-1 bg-white p-6">
        <div v-if="loading" class="py-16 text-center text-sm text-muted-foreground">加载中…</div>
        <div v-else-if="list.length === 0" class="rounded-lg border border-dashed border-border/60 py-16 text-center text-sm text-muted-foreground">
          暂无动态，点击「新增」添加
        </div>
        <div v-else class="space-y-4">
          <ul class="space-y-4">
            <li
              v-for="item in list"
              :key="item.id"
              class="flex items-center gap-5 rounded-lg border border-border/60 bg-slate-50/50 px-5 py-4 transition-colors hover:bg-slate-50"
            >
              <div class="h-16 w-24 shrink-0 overflow-hidden rounded border bg-muted">
                <img v-if="item.coverImage" :src="item.coverImage" alt="" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground/50">
                  <SafeIcon name="Image" :size="22" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-foreground truncate">{{ item.title }}</span>
                  <span v-if="item.isTop" class="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">置顶</span>
                </div>
                <p class="mt-0.5 text-sm text-muted-foreground line-clamp-1">{{ item.summary }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ item.publishTime.slice(0, 10) }} · {{ NEWS_CATEGORY_LABELS[item.category] }} · {{ item.author }}</p>
              </div>
              <div class="flex shrink-0 gap-3">
                <Button variant="outline" size="sm" as="a" :href="`./news-detail.html?id=${item.id}`" target="_blank">预览</Button>
                <Button variant="outline" size="sm" @click="openEdit(item)">编辑</Button>
                <Button variant="ghost" size="sm" class="text-destructive hover:bg-destructive/10" @click="remove(item)">删除</Button>
              </div>
            </li>
          </ul>
          <div v-if="total > pageSize" class="flex items-center justify-between border-t border-border/60 pt-5">
            <p class="text-sm text-muted-foreground">共 {{ total }} 条</p>
            <div class="flex gap-3">
              <Button variant="outline" size="sm" :disabled="page <= 1" @click="page--; loadList()">上一页</Button>
              <Button variant="outline" size="sm" :disabled="page * pageSize >= total" @click="page++; loadList()">下一页</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <Dialog v-model:open="dialogOpen">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto border-border/60 shadow-lg">
      <DialogHeader>
        <DialogTitle class="text-lg">{{ editingId ? '编辑动态' : '新增动态' }}</DialogTitle>
        <DialogDescription>标题、摘要、正文（支持 HTML）、封面图、发布时间、置顶、来源、作者、分类</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <Label>标题 <span class="text-destructive">*</span></Label>
          <Input v-model="form.title" placeholder="动态标题" class="h-10" />
        </div>
        <div class="space-y-2">
          <Label>摘要</Label>
          <Input v-model="form.summary" placeholder="简短摘要" class="h-10" />
        </div>
        <div class="space-y-2">
          <Label>正文（支持 HTML）</Label>
          <Textarea v-model="form.body" placeholder="<p>正文内容...</p>" rows="6" class="font-mono text-sm resize-none" />
        </div>
        <div class="space-y-2">
          <Label>封面图</Label>
          <p class="text-xs text-muted-foreground">推荐尺寸：{{ COVER_IMAGE_RECOMMEND }}。支持 JPG、PNG、WebP，单张不超过 2MB。</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="shrink-0">
              <div class="h-24 w-40 overflow-hidden rounded-lg border bg-muted">
                <img v-if="form.coverImage" :src="form.coverImage" alt="封面预览" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
                  <SafeIcon name="Image" :size="24" />
                </div>
              </div>
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <input
                ref="coverImageInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onCoverImageChange"
              />
              <Button type="button" variant="outline" size="sm" class="h-10" @click="triggerCoverImageUpload">
                <SafeIcon name="Upload" :size="16" class="mr-2" />
                上传本地图片
              </Button>
              <Input v-model="form.coverImage" placeholder="或填写图片地址 https://..." class="h-10" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label>发布时间</Label>
          <Input v-model="form.publishTime" type="datetime-local" class="h-10" />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="isTop" v-model:checked="form.isTop" />
          <Label for="isTop" class="font-normal cursor-pointer">置顶</Label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>来源 <span class="text-destructive">*</span></Label>
            <Input v-model="form.source" placeholder="微光公益" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>作者 <span class="text-destructive">*</span></Label>
            <Input v-model="form.author" placeholder="作者名" class="h-10" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>分类</Label>
          <Select v-model="form.category">
            <SelectTrigger class="h-10">
              <SelectValue :placeholder="'选择分类'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="outline" @click="dialogOpen = false">取消</Button>
        <Button :disabled="saving" @click="save">
          {{ saving ? '保存中…' : '保存' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
