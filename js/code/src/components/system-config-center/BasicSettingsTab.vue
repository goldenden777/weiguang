
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SITE_CONFIG } from '@/data/config'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  isClient: boolean
}

defineProps<Props>()

const formData = ref({
siteName: SITE_CONFIG.siteName,
  logoUrl: SITE_CONFIG.logoUrl,
  contactPhone: SITE_CONFIG.contactPhone,
  contactEmail: SITE_CONFIG.contactEmail || '',
  contactAddress: SITE_CONFIG.contactAddress || '',
  disclaimer: SITE_CONFIG.disclaimer,
  successMessage: SITE_CONFIG.successMessage,
})

const logoPreview = ref(SITE_CONFIG.logoUrl)
const isEditing = ref(false)
const logoInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  // Initialize logo preview
  logoPreview.value = formData.value.logoUrl
})

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      logoPreview.value = result
      formData.value.logoUrl = result // 同步到表单数据，以便保存
    }
    reader.readAsDataURL(file)
  }
}

const triggerLogoUpload = () => {
  logoInputRef.value?.click()
}

const removeLogo = () => {
  logoPreview.value = ''
  formData.value.logoUrl = ''
  if (logoInputRef.value) {
    logoInputRef.value.value = ''
  }
}

const handleReset = () => {
formData.value = {
    siteName: SITE_CONFIG.siteName,
    logoUrl: SITE_CONFIG.logoUrl,
    contactPhone: SITE_CONFIG.contactPhone,
    contactEmail: SITE_CONFIG.contactEmail || '',
    contactAddress: SITE_CONFIG.contactAddress || '',
    disclaimer: SITE_CONFIG.disclaimer,
    successMessage: SITE_CONFIG.successMessage,
  }
  logoPreview.value = SITE_CONFIG.logoUrl
  isEditing.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Site Name -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">网站名称</CardTitle>
        <CardDescription>显示在页面顶部和浏览器标签中</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="siteName">网站名称</Label>
            <Input
              id="siteName"
              v-model="formData.siteName"
              placeholder="请输入网站名称"
              :disabled="!isClient"
            />
          </div>
          <p class="text-xs text-muted-foreground">
            当前显示：<span class="font-semibold">{{ formData.siteName }}</span>
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Logo -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">网站Logo</CardTitle>
        <CardDescription>推荐尺寸：200x200px，支持PNG/JPG格式</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Logo Preview -->
            <div class="flex-shrink-0">
              <div class="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                <img
                  v-if="logoPreview"
                  :src="logoPreview"
                  alt="Logo Preview"
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center justify-center text-muted-foreground">
                  <SafeIcon name="Image" :size="32" />
                  <span class="text-xs mt-2">预览</span>
                </div>
              </div>
            </div>

<!-- Upload Section -->
            <div class="flex-1 space-y-4">
              <div class="space-y-2">
                <Label for="logoUpload">上传Logo</Label>
                <div class="flex items-center gap-3">
                  <input
                    ref="logoInputRef"
                    id="logoUpload"
                    type="file"
                    accept="image/png,image/jpeg"
                    @change="handleLogoChange"
                    class="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    @click="triggerLogoUpload"
                    :disabled="!isClient"
                    class="h-10"
                  >
                    <SafeIcon name="Upload" :size="16" class="mr-2" />
                    选择新Logo
                  </Button>
                  <Button
                    v-if="logoPreview"
                    variant="ghost"
                    size="sm"
                    @click="removeLogo"
                    :disabled="!isClient"
                    class="h-10 text-destructive hover:bg-destructive/10"
                  >
                    <SafeIcon name="X" :size="16" class="mr-2" />
                    移除
                  </Button>
                </div>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">
                  当前路径：<span class="font-mono bg-muted px-1 py-0.5 rounded break-all">{{ formData.logoUrl || '未设置' }}</span>
                </p>
                <p class="text-[10px] text-muted-foreground opacity-70">
                  支持格式：JPEG, PNG。最大限制：2MB。
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

<!-- Contact Info -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">联系方式</CardTitle>
        <CardDescription>用户遇到问题时的联系渠道，将显示在页脚或帮助中心</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div class="space-y-2">
            <Label for="contactPhone">电话号码</Label>
            <Input
              id="contactPhone"
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              :disabled="!isClient"
            />
          </div>
          <div class="space-y-2">
            <Label for="contactEmail">电子邮箱</Label>
            <Input
              id="contactEmail"
              v-model="formData.contactEmail"
              placeholder="请输入电子邮箱"
              type="email"
              :disabled="!isClient"
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <Label for="contactAddress">联系地址</Label>
            <Input
              id="contactAddress"
              v-model="formData.contactAddress"
              placeholder="请输入详细办公地址"
              :disabled="!isClient"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Disclaimer -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">免责声明</CardTitle>
        <CardDescription>在报名表单中显示，用户需勾选同意</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="disclaimer">免责声明内容</Label>
            <Textarea
              id="disclaimer"
              v-model="formData.disclaimer"
              placeholder="请输入免责声明"
              rows="6"
              :disabled="!isClient"
              class="resize-none"
            />
          </div>
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-xs font-semibold text-muted-foreground mb-2">预览：</p>
            <p class="text-sm text-foreground line-clamp-3">{{ formData.disclaimer }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Success Message -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">报名成功提示语</CardTitle>
        <CardDescription>用户成功报名后显示的提示信息</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="successMessage">提示语内容</Label>
            <Textarea
              id="successMessage"
              v-model="formData.successMessage"
              placeholder="请输入成功提示语"
              rows="3"
              :disabled="!isClient"
              class="resize-none"
            />
          </div>
          <div class="p-3 bg-success/10 rounded-lg border border-success/20">
            <p class="text-sm text-success font-semibold">✓ {{ formData.successMessage }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-2 pt-4">
      <Button
        variant="outline"
        @click="handleReset"
        :disabled="!isClient"
      >
        重置
      </Button>
      <Button
        @click="() => isEditing = !isEditing"
        :disabled="!isClient"
      >
        {{ isEditing ? '完成编辑' : '编辑' }}
      </Button>
    </div>
  </div>
</template>
