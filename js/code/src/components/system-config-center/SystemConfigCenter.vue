
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'
import BasicSettingsTab from './BasicSettingsTab.vue'
import CategoryManagementTab from './CategoryManagementTab.vue'
import FormFieldsConfigTab from './FormFieldsConfigTab.vue'
import { toast } from 'vue-sonner'
import { updateSiteConfig, resetSiteConfig } from '@/data/config'

const isClient = ref(true)
const activeTab = ref('basic')
const isSaving = ref(false)
const basicRef = ref<InstanceType<typeof BasicSettingsTab> | null>(null)

onMounted(() => {
  isClient.value = false
  // Simulate initialization delay
  setTimeout(() => {
    isClient.value = true
  }, 0)
})

const handleSave = async () => {
  isSaving.value = true
  try {
    // 目前先落地“基础设置”的保存（Logo/站点名等），其余 tab 后续再扩展
    const basic = basicRef.value?.getValue?.()
    if (!basic) {
      throw new Error('basic_not_ready')
    }
    if (basic) {
      const ok = updateSiteConfig({
        siteName: basic.siteName,
        contactPhone: basic.contactPhone,
        contactEmail: basic.contactEmail,
        contactAddress: basic.contactAddress,
        disclaimer: basic.disclaimer,
        successMessage: basic.successMessage,
      })
      if (!ok) throw new Error('persist_failed')
    }
    toast.success('保存成功')
  } catch (error) {
    toast.error('保存失败：页面未就绪或浏览器禁止/空间不足（可尝试刷新后重试或关闭无痕模式）')
  } finally {
    isSaving.value = false
  }
}

const handleReset = () => {
  if (confirm('确定要重置所有配置到默认值吗？此操作不可撤销。')) {
    const ok = resetSiteConfig()
    basicRef.value?.resetToCurrentConfig?.()
    toast[ok ? 'success' : 'error'](ok ? '已重置为默认配置' : '重置失败')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header with Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p class="text-sm text-muted-foreground">
            在此管理网站的全局配置，包括基础信息、活动分类和报名表单字段
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            @click="handleReset"
            :disabled="isSaving || !isClient"
          >
            <SafeIcon name="RotateCcw" :size="16" class="mr-2" />
            重置默认
          </Button>
          <Button
            @click="handleSave"
            :disabled="isSaving || !isClient"
          >
            <SafeIcon 
              :name="isSaving ? 'Loader' : 'Save'" 
              :size="16" 
              :class="isSaving ? 'mr-2 animate-spin' : 'mr-2'"
            />
            {{ isSaving ? '保存中...' : '保存配置' }}
          </Button>
        </div>
      </div>

      <!-- Tabs -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="basic" class="flex items-center gap-2">
            <SafeIcon name="Settings" :size="16" />
            <span class="hidden sm:inline">基础设置</span>
          </TabsTrigger>
          <TabsTrigger value="categories" class="flex items-center gap-2">
            <SafeIcon name="Tags" :size="16" />
            <span class="hidden sm:inline">分类管理</span>
          </TabsTrigger>
          <TabsTrigger value="fields" class="flex items-center gap-2">
            <SafeIcon name="FormInput" :size="16" />
            <span class="hidden sm:inline">表单字段</span>
          </TabsTrigger>
        </TabsList>

        <!-- Basic Settings Tab -->
        <TabsContent value="basic" class="mt-6">
          <BasicSettingsTab ref="basicRef" :is-client="isClient" />
        </TabsContent>

        <!-- Category Management Tab -->
        <TabsContent value="categories" class="mt-6">
          <CategoryManagementTab :is-client="isClient" />
        </TabsContent>

        <!-- Form Fields Config Tab -->
        <TabsContent value="fields" class="mt-6">
          <FormFieldsConfigTab :is-client="isClient" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
