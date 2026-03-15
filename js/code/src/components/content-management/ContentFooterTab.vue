<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { FooterConfig } from '@/data/content'
import { getFooterConfig, saveFooterConfig } from '@/services/content.service'
import { toast } from 'vue-sonner'

const loading = ref(false)
const saving = ref(false)
const form = ref<FooterConfig>({
  friendLinks: [{ name: '', href: '' }],
  icpNumber: '',
  policeRecord: '',
  contactPhone: '',
  contactEmail: '',
  workHours: '',
  copyright: '',
})

function addFriendLink() {
  form.value.friendLinks.push({ name: '', href: '' })
}

function removeFriendLink(index: number) {
  form.value.friendLinks.splice(index, 1)
  if (form.value.friendLinks.length === 0) form.value.friendLinks.push({ name: '', href: '' })
}

async function load() {
  loading.value = true
  try {
    form.value = await getFooterConfig()
    if (!form.value.friendLinks?.length) form.value.friendLinks = [{ name: '', href: '' }]
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const payload: FooterConfig = {
      ...form.value,
      friendLinks: form.value.friendLinks.filter((l) => l.name?.trim() || l.href?.trim()),
    }
    if (payload.friendLinks.length === 0) payload.friendLinks = [{ name: '', href: '' }]
    await saveFooterConfig(payload)
    toast.success('页脚配置已保存')
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
          <CardTitle class="text-lg">友情链接</CardTitle>
          <CardDescription class="mt-1.5">页脚展示的友情链接，名称与地址必填其一</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4 px-6 pb-6">
          <div v-for="(link, index) in form.friendLinks" :key="index" class="flex gap-3">
            <Input v-model="link.name" placeholder="名称" class="h-10 flex-1" />
            <Input v-model="link.href" placeholder="https://..." class="h-10 flex-1" />
            <Button type="button" variant="ghost" size="icon" class="shrink-0 text-muted-foreground hover:text-destructive" @click="removeFriendLink(index)">
              <SafeIcon name="X" :size="16" />
            </Button>
          </div>
          <Button type="button" variant="outline" size="sm" @click="addFriendLink">
            <SafeIcon name="Plus" :size="14" class="mr-1.5" />
            添加链接
          </Button>
        </CardContent>
      </Card>

      <Card class="border-none shadow-sm">
        <CardHeader class="py-5 px-6">
          <CardTitle class="text-lg">备案信息</CardTitle>
          <CardDescription class="mt-1.5">ICP 备案号与公安备案号，将显示在页脚</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4 px-6 pb-6">
          <div class="space-y-2">
            <Label>备案号</Label>
            <Input v-model="form.icpNumber" placeholder="鲁ICP备12345678号" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>公安备案号（选填）</Label>
            <Input v-model="form.policeRecord" placeholder="鲁公网安备..." class="h-10" />
          </div>
        </CardContent>
      </Card>

      <Card class="border-none shadow-sm">
        <CardHeader class="py-5 px-6">
          <CardTitle class="text-lg">联系方式与版权</CardTitle>
          <CardDescription class="mt-1.5">页脚展示的电话、邮箱、工作时间及版权文案</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4 px-6 pb-6">
          <div class="space-y-2">
            <Label>联系电话</Label>
            <Input v-model="form.contactPhone" placeholder="0532-12345678" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>联系邮箱</Label>
            <Input v-model="form.contactEmail" type="email" placeholder="contact@weiguang.org" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>工作时间（选填）</Label>
            <Input v-model="form.workHours" placeholder="周一至周五 09:00-18:00" class="h-10" />
          </div>
          <div class="space-y-2">
            <Label>版权信息（选填）</Label>
            <Input v-model="form.copyright" placeholder="青岛微光慈善基金会 版权所有" class="h-10" />
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
