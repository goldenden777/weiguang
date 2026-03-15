<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { BannerModel } from '@/data/content'
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '@/services/content.service'
import { toast } from 'vue-sonner'

const list = ref<BannerModel[]>([])
const loading = ref(false)
const dialogOpen = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  imageUrl: '',
  linkUrl: '',
  title: '',
  subtitle: '',
  buttonText: '立即探索',
  startTime: '',
  endTime: '',
  sortOrder: 0,
})

const bannerImageInputRef = ref<HTMLInputElement | null>(null)
const BANNER_IMAGE_MAX_SIZE = 2 * 1024 * 1024 // 2MB
const BANNER_IMAGE_RECOMMEND = '1200×675（16:9）或 800×450'

function triggerBannerImageUpload() {
  bannerImageInputRef.value?.click()
}

function onBannerImageChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > BANNER_IMAGE_MAX_SIZE) {
    toast.error('图片大小不能超过 2MB')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.imageUrl = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function openCreate() {
  editingId.value = null
  form.value = {
    imageUrl: '',
    linkUrl: '',
    title: '',
    subtitle: '',
    buttonText: '立即探索',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    sortOrder: list.value.length,
  }
  dialogOpen.value = true
}

function openEdit(item: BannerModel) {
  editingId.value = item.id
  form.value = {
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
    title: item.title,
    subtitle: item.subtitle,
    buttonText: item.buttonText,
    startTime: item.startTime.slice(0, 16),
    endTime: item.endTime.slice(0, 16),
    sortOrder: item.sortOrder,
  }
  dialogOpen.value = true
}

async function save() {
  if (!form.value.imageUrl?.trim() || !form.value.title?.trim()) {
    toast.error('请填写图片地址和标题')
    return
  }
  const startTime = new Date(form.value.startTime).toISOString()
  const endTime = new Date(form.value.endTime).toISOString()
  const payload = { ...form.value, startTime, endTime }
  saving.value = true
  try {
    if (editingId.value) {
      await updateBanner(editingId.value, payload)
      toast.success('已更新')
      const idx = list.value.findIndex((b) => b.id === editingId.value)
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...payload }
    } else {
      const { id } = await createBanner(payload)
      toast.success('已添加')
      list.value.push({ ...payload, id } as BannerModel)
    }
    dialogOpen.value = false
    loadList()
  } catch (e) {
    toast.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(item: BannerModel) {
  if (!confirm(`确定删除「${item.title}」吗？`)) return
  try {
    await deleteBanner(item.id)
    toast.success('已删除')
    list.value = list.value.filter((b) => b.id !== item.id)
    loadList()
  } catch {
    toast.error('删除失败')
  }
}

async function loadList() {
  loading.value = true
  try {
    list.value = await getBanners()
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
            <CardTitle class="text-lg">首页 Banner</CardTitle>
            <CardDescription class="mt-1.5">管理轮播图，支持定时上线/下线。门户将按当前时间与上下线时间自动展示。</CardDescription>
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
          暂无 Banner，点击「新增」添加
        </div>
        <ul v-else class="space-y-4">
          <li
            v-for="(item, index) in list"
            :key="item.id"
            class="flex items-center gap-5 rounded-lg border border-border/60 bg-slate-50/50 px-5 py-4 transition-colors hover:bg-slate-50"
          >
            <span class="w-8 shrink-0 text-center text-sm font-medium text-muted-foreground">{{ index + 1 }}</span>
            <div class="h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-muted">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="h-full w-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-foreground truncate">{{ item.title }}</p>
              <p class="mt-0.5 text-sm text-muted-foreground truncate">{{ item.subtitle }}</p>
              <p class="mt-1 text-xs text-muted-foreground">上线 {{ item.startTime.slice(0, 10) }} — 下线 {{ item.endTime.slice(0, 10) }}</p>
            </div>
            <div class="flex shrink-0 gap-3">
              <Button variant="outline" size="sm" @click="openEdit(item)">编辑</Button>
              <Button variant="ghost" size="sm" class="text-destructive hover:bg-destructive/10" @click="remove(item)">删除</Button>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>

  <Dialog v-model:open="dialogOpen">
    <DialogContent class="max-w-lg border-border/60 shadow-lg">
      <DialogHeader>
        <DialogTitle class="text-lg">{{ editingId ? '编辑 Banner' : '新增 Banner' }}</DialogTitle>
        <DialogDescription>填写图片、链接、标题与上下线时间</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <Label>Banner 图片</Label>
          <p class="text-xs text-muted-foreground">推荐尺寸：{{ BANNER_IMAGE_RECOMMEND }}。支持 JPG、PNG、WebP，单张不超过 2MB。</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="shrink-0">
              <div class="h-24 w-40 overflow-hidden rounded-lg border bg-muted">
                <img v-if="form.imageUrl" :src="form.imageUrl" alt="预览" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
                  <SafeIcon name="Image" :size="24" />
                </div>
              </div>
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <input
                ref="bannerImageInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onBannerImageChange"
              />
              <Button type="button" variant="outline" size="sm" class="h-10" @click="triggerBannerImageUpload">
                <SafeIcon name="Upload" :size="16" class="mr-2" />
                上传本地图片
              </Button>
              <Input v-model="form.imageUrl" placeholder="或填写图片地址 https://..." class="h-10" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label>跳转链接</Label>
          <Input v-model="form.linkUrl" placeholder="./home.html" class="h-10" />
        </div>
        <div class="space-y-2">
          <Label>标题</Label>
          <Input v-model="form.title" placeholder="主标题" class="h-10" />
        </div>
        <div class="space-y-2">
          <Label>副标题</Label>
          <Input v-model="form.subtitle" placeholder="副标题" class="h-10" />
        </div>
        <div class="space-y-2">
          <Label>按钮文案</Label>
          <Input v-model="form.buttonText" placeholder="立即探索" class="h-10" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>上线时间</Label>
            <Input v-model="form.startTime" type="datetime-local" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>下线时间</Label>
            <Input v-model="form.endTime" type="datetime-local" class="h-10" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>排序（数字越小越靠前）</Label>
          <Input v-model.number="form.sortOrder" type="number" min="0" class="h-10" />
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
