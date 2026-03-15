<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { SiteBasicConfig } from '@/data/content'
import { getSiteBasicConfig, saveSiteBasicConfig } from '@/services/content.service'
import { toast } from 'vue-sonner'

const loading = ref(false)
const saving = ref(false)
const form = ref<SiteBasicConfig>({
  siteName: '',
  logoUrl: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
})

const logoInputRef = ref<HTMLInputElement | null>(null)
const LOGO_MAX_SIZE = 2 * 1024 * 1024 // 2MB
const LOGO_RECOMMEND = '200×200px，支持 PNG、JPG，单张不超过 2MB'

function triggerLogoUpload() {
  logoInputRef.value?.click()
}

function onLogoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > LOGO_MAX_SIZE) {
    toast.error('图片大小不能超过 2MB')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.logoUrl = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

async function load() {
  loading.value = true
  try {
    form.value = await getSiteBasicConfig()
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!form.value.siteName?.trim()) {
    toast.error('请填写站点名称')
    return
  }
  saving.value = true
  try {
    await saveSiteBasicConfig(form.value)
    toast.success('站点基础信息已保存')
  } catch (e) {
    toast.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <Button :disabled="saving || loading" @click="save">
        <SafeIcon :name="saving ? 'Loader' : 'Save'" :size="16" :class="saving ? 'mr-2 animate-spin' : 'mr-2'" />
        {{ saving ? '保存中…' : '保存' }}
      </Button>
    </div>

    <div v-if="loading" class="py-16 text-center text-sm text-muted-foreground">加载中…</div>

    <template v-else>
      <Card class="border-none shadow-sm">
        <CardHeader class="py-5 px-6">
          <CardTitle class="text-lg">站点名称</CardTitle>
          <CardDescription class="mt-1.5">显示在门户页头与浏览器标签，与系统配置独立，门户优先读取此处</CardDescription>
        </CardHeader>
        <CardContent class="px-6 pb-6">
          <div class="space-y-2">
            <Label>站点名称</Label>
            <Input v-model="form.siteName" placeholder="青岛微光慈善基金会" class="h-10" />
          </div>
        </CardContent>
      </Card>

      <Card class="border-none shadow-sm">
        <CardHeader class="py-5 px-6">
          <CardTitle class="text-lg">网站 Logo</CardTitle>
          <CardDescription class="mt-1.5">门户页头展示的 Logo。推荐尺寸：{{ LOGO_RECOMMEND }}。</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4 px-6 pb-6">
          <div class="flex flex-col sm:flex-row gap-6">
            <div class="h-28 w-28 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
              <img v-if="form.logoUrl" :src="form.logoUrl" alt="Logo" class="h-full w-full object-contain" />
              <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
                <SafeIcon name="Image" :size="32" />
              </div>
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <Label>Logo</Label>
              <input
                ref="logoInputRef"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                class="hidden"
                @change="onLogoChange"
              />
              <Button type="button" variant="outline" size="sm" class="h-10" @click="triggerLogoUpload">
                <SafeIcon name="Upload" :size="16" class="mr-2" />
                上传本地图片
              </Button>
              <Input v-model="form.logoUrl" placeholder="或填写图片地址 https://..." class="h-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-none shadow-sm">
        <CardHeader class="py-5 px-6">
          <CardTitle class="text-lg">联系方式</CardTitle>
          <CardDescription class="mt-1.5">客服电话、邮箱、地址，用于页脚或联系展示</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4 px-6 pb-6">
          <div class="space-y-2">
            <Label>客服电话</Label>
            <Input v-model="form.contactPhone" placeholder="0532-88888888" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>联系邮箱（选填）</Label>
            <Input v-model="form.contactEmail" type="email" placeholder="contact@weiguang.org" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>联系地址（选填）</Label>
            <Input v-model="form.contactAddress" placeholder="山东省青岛市..." class="h-10" />
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
