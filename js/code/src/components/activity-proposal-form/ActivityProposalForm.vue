
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'
import BasicInfoSection from './BasicInfoSection.vue'
import ContentSection from './ContentSection.vue'
import BudgetMaterialsSection from './BudgetMaterialsSection.vue'
import ContactPersonSection from './ContactPersonSection.vue'
import AttachmentUpload from './AttachmentUpload.vue'
import FormActions from './FormActions.vue'
import ProposalPreview from './ProposalPreview.vue'

interface FormData {
  // Basic Info
  title: string
  category: string
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  brief: string

  // Content
  purpose: string
  process: string
  precautions: string

  // Budget & Materials
  budget: number
  materials: string

  // Contact Person
  contactPerson: string
  contactPhone: string
  contactEmail: string

  // Attachments
  attachments: {
    plan?: File
    images: File[]
    videos: File[]
  }
}

const isClient = ref(true)
const activeTab = ref('basic')
const isSubmitting = ref(false)
const showSuccessAlert = ref(false)
const formErrors = reactive<Record<string, string>>({})

const formData = reactive<FormData>({
  title: '',
  category: '',
  startDate: '',
  endDate: '',
  location: '',
  maxParticipants: 0,
  brief: '',
  purpose: '',
  process: '',
  precautions: '',
  budget: 0,
  materials: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  attachments: {
    images: [],
    videos: [],
  },
})

const completionPercentage = computed(() => {
  const checks = [
    !!formData.title,
    !!formData.category,
    !!formData.startDate,
    !!formData.endDate,
    !!formData.location,
    formData.maxParticipants > 0,
    !!formData.brief,
    !!formData.purpose,
    !!formData.process,
    !!formData.contactPerson,
    !!formData.contactPhone,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
})

const validateForm = (): boolean => {
  formErrors.title = !formData.title ? '活动标题不能为空' : ''
  formErrors.category = !formData.category ? '请选择活动分类' : ''
  formErrors.startDate = !formData.startDate ? '请选择开始日期' : ''
  formErrors.endDate = !formData.endDate ? '请选择结束日期' : ''
  formErrors.location = !formData.location ? '活动地点不能为空' : ''
  formErrors.maxParticipants = formData.maxParticipants <= 0 ? '参与人数必须大于0' : ''
  formErrors.brief = !formData.brief ? '活动简介不能为空' : ''
  formErrors.contactPerson = !formData.contactPerson ? '对接人名称不能为空' : ''
  formErrors.contactPhone = !formData.contactPhone ? '对接人电话不能为空' : ''

  return !Object.values(formErrors).some(error => error)
}

const handleSaveDraft = async () => {
  // Save to localStorage or backend
  const draftData = JSON.stringify(formData)
  if (typeof window !== 'undefined') {
    localStorage.setItem('activity_proposal_draft', draftData)
  }
  showSuccessAlert.value = true
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 3000)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Clear draft
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activity_proposal_draft')
    }

    // Redirect to dashboard
    if (typeof window !== 'undefined') {
      window.location.href = './agency-dashboard.html'
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}

onMounted(() => {
  isClient.value = false

  // Load draft if exists
  if (typeof window !== 'undefined') {
    const draft = localStorage.getItem('activity_proposal_draft')
    if (draft) {
      try {
        const draftData = JSON.parse(draft)
        Object.assign(formData, draftData)
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }

  // Trigger animation
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Success Alert -->
    <Alert v-if="showSuccessAlert" class="bg-success/10 border-success/20 text-success">
      <SafeIcon name="CheckCircle" :size="16" class="mr-2" />
      <AlertDescription>
        草稿已保存，您可以随时返回继续编辑
      </AlertDescription>
    </Alert>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left: Form Tabs -->
      <div class="lg:col-span-8 space-y-6">
        <Card class="overflow-hidden border-none shadow-md">
          <Tabs v-model="activeTab" class="w-full">
            <div class="bg-muted/30 px-6 pt-2 border-b">
              <TabsList class="w-full justify-start rounded-none bg-transparent p-0 gap-8 h-12">
                <TabsTrigger 
                  value="basic"
                  class="rounded-none border-b-4 border-transparent px-2 h-full data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-semibold text-base"
                >
            <SafeIcon name="Info" :size="16" class="mr-2" />
            基础信息
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SafeIcon name="FileText" :size="16" class="mr-2" />
            活动内容
          </TabsTrigger>
          <TabsTrigger 
            value="budget"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SafeIcon name="DollarSign" :size="16" class="mr-2" />
            预算物资
          </TabsTrigger>
          <TabsTrigger 
            value="contact"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SafeIcon name="User" :size="16" class="mr-2" />
            对接人
          </TabsTrigger>
          <TabsTrigger 
            value="attachments"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SafeIcon name="Paperclip" :size="16" class="mr-2" />
            附件
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SafeIcon name="Eye" :size="16" class="mr-2" />
            预览
          </TabsTrigger>
</TabsList>
            </div>

            <div class="min-h-[500px]">
              <TabsContent value="basic" class="p-8 m-0 focus-visible:ring-0">
                <BasicInfoSection 
                  :model-value="formData"
                  @update:model-value="(v) => Object.assign(formData, v)"
                  :errors="formErrors"
                />
              </TabsContent>

              <TabsContent value="content" class="p-8 m-0 focus-visible:ring-0">
                <ContentSection 
                  :model-value="formData"
                  @update:model-value="(v) => Object.assign(formData, v)"
                  :errors="formErrors"
                />
              </TabsContent>

              <TabsContent value="budget" class="p-8 m-0 focus-visible:ring-0">
                <BudgetMaterialsSection 
                  :model-value="formData"
                  @update:model-value="(v) => Object.assign(formData, v)"
                  :errors="formErrors"
                />
              </TabsContent>

              <TabsContent value="contact" class="p-8 m-0 focus-visible:ring-0">
                <ContactPersonSection 
                  :model-value="formData"
                  @update:model-value="(v) => Object.assign(formData, v)"
                  :errors="formErrors"
                />
              </TabsContent>

              <TabsContent value="attachments" class="p-8 m-0 focus-visible:ring-0">
                <AttachmentUpload 
                  v-model="formData.attachments"
                />
              </TabsContent>

              <TabsContent value="preview" class="p-0 m-0 focus-visible:ring-0 max-h-[70vh] overflow-y-auto">
                <ProposalPreview :form-data="formData" />
              </TabsContent>
            </div>
          </Tabs>

          <!-- Form Actions Included inside the left card bottom for better structure -->
          <FormActions 
            :is-submitting="isSubmitting"
            :completion-percentage="completionPercentage"
            @save-draft="handleSaveDraft"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </Card>
      </div>

      <!-- Right: Sidebar -->
      <div class="lg:col-span-4 space-y-6 sticky top-24">
        <!-- Progress Card -->
        <Card class="border-none shadow-md">
          <CardHeader>
            <div class="flex items-center justify-between mb-2">
              <CardTitle class="text-lg">提报进度</CardTitle>
              <div class="text-2xl font-bold text-primary">{{ completionPercentage }}%</div>
            </div>
            <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                :style="{ width: `${completionPercentage}%` }"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              请确保所有必填项（带 <span class="text-destructive">*</span>）均已填写完整，以便管理员快速审核。
            </p>
            <div class="space-y-3">
              <div v-for="(step, idx) in [
                { id: 'basic', name: '基本信息', icon: 'Info' },
                { id: 'content', name: '活动内容', icon: 'FileText' },
                { id: 'contact', name: '对接人信息', icon: 'User' }
              ]" :key="idx" class="flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors"
                :class="activeTab === step.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'"
              >
                <div class="w-6 h-6 rounded-full bg-background border flex items-center justify-center text-xs">
                  {{ idx + 1 }}
                </div>
                <span>{{ step.name }}</span>
                <SafeIcon v-if="formData[step.id === 'contact' ? 'contactPerson' : step.id === 'content' ? 'purpose' : 'title']" name="Check" :size="14" class="ml-auto text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Help/Tips Card -->
        <Card class="bg-gradient-to-br from-primary/5 to-secondary/5 border-none shadow-sm">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <SafeIcon name="Lightbulb" :size="18" class="text-secondary" />
              提报小贴士
            </CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-2 text-muted-foreground">
            <p>• <b>清晰的标题：</b> 包含地点、受众和活动类型。</p>
            <p>• <b>丰富的图文：</b> 好的封面图和详细流程会更吸引志愿者。</p>
            <p>• <b>预算合理性：</b> 物资清单越详细，财务审核越快。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
