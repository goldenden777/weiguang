
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon.vue'
import ActivityInfoSection from './ActivityInfoSection.vue'
import ActivityAttachmentSection from './ActivityAttachmentSection.vue'
import AuditActionPanel from './AuditActionPanel.vue'
import RejectReasonDialog from './RejectReasonDialog.vue'

// Mock data for SSG
const mockActivity = {
  id: 'act-002',
  title: '暑期支教计划：点亮山区孩子的梦想',
  startDate: '2026-07-15',
  endDate: '2026-08-15',
  location: '山东省平度市大泽山镇',
  brief: '开展为期一个月的暑期兴趣课辅导，包含绘画、英语。',
  content: '本活动旨在填补偏远地区由于师资匮乏导致的暑期素质教育空白。通过组织高校志愿者和社会爱心人士，为山区孩子提供免费的素质教育课程，包括美术、英语、科学等多个领域。预计参与学生50人，志愿者20人。',
  status: 'pending',
  category: '助学兴教',
  agencyName: '益启航教育中心',
  agencyId: 'agency-2',
  coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/39250b74-aa75-4f63-8a9b-b9a9e83ecf85.png',
  maxParticipants: 10,
  currentParticipants: 0,
  budget: 50000,
  materials: '教材、文具、投影仪、音响设备',
  contactPerson: '李馆长',
  contactPhone: '13911112222',
  contactEmail: 'li@yiqihang.org',
  createTime: '2026-03-10',
  attachments: [
    { id: 'att-1', name: '活动方案.pdf', size: '2.5MB', type: 'pdf' },
    { id: 'att-2', name: '预算表.xlsx', size: '1.2MB', type: 'xlsx' },
  ],
  images: [
    { id: 'img-1', url: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/ca6b6c5c-90a4-418e-a62d-e5b2a170e071.png' },
    { id: 'img-2', url: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/b9649303-c7c3-4229-8492-7a3bbe3e8f75.png' },
  ],
}

const isClient = ref(true)
const showRejectDialog = ref(false)
const isProcessing = ref(false)

onMounted(() => {
  isClient.value = false
  
  // Simulate loading activity data
  setTimeout(() => {
    isClient.value = true
  }, 0)
})

const handleApprove = async () => {
  isProcessing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isProcessing.value = false
  // Show success message and redirect
  alert('活动已通过审核并上架')
  window.location.href = './activity-audit-list.html'
}

const handleRejectSubmit = async (reason: string) => {
  isProcessing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isProcessing.value = false
  showRejectDialog.value = false
  // Show success message and redirect
  alert('活动已驳回，驳回理由已发送给执行机构')
  window.location.href = './activity-audit-list.html'
}

const handleBack = () => {
  window.history.back()
}
</script>

<template>
<div class="px-6 lg:px-10 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Main Content -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Activity Header -->
        <Card class="border-l-4 border-l-primary shadow-sm overflow-hidden">
          <CardHeader class="pb-6">
            <div class="flex items-start justify-between gap-6">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h1 class="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{{ mockActivity.title }}</h1>
                  <Badge variant="outline" class="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    待审核
                  </Badge>
                </div>
                <div class="flex items-center gap-4 text-muted-foreground">
                  <div class="flex items-center gap-1.5">
                    <SafeIcon name="Building2" :size="16" />
                    <span>提报机构：{{ mockActivity.agencyName }}</span>
                  </div>
                  <Separator orientation="vertical" class="h-4" />
                  <div class="flex items-center gap-1.5">
                    <SafeIcon name="Clock" :size="16" />
                    <span>提交时间：{{ mockActivity.createTime }}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                @click="handleBack"
                class="shrink-0"
                :disabled="!isClient || isProcessing"
              >
                <SafeIcon name="ArrowLeft" :size="16" class="mr-2" />
                返回
              </Button>
            </div>
          </CardHeader>
        </Card>

        <!-- Cover Image -->
        <div class="relative aspect-[21/9] rounded-xl overflow-hidden bg-muted border border-border group">
          <img
            :src="mockActivity.coverImage"
            :alt="mockActivity.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <!-- Activity Info Section -->
        <ActivityInfoSection :activity="mockActivity" />

        <!-- Attachment Section -->
        <ActivityAttachmentSection 
          :attachments="mockActivity.attachments"
          :images="mockActivity.images"
        />
      </div>

<!-- Audit Panel (Sticky) -->
      <div class="lg:col-span-4 sticky top-24">
        <AuditActionPanel
          :activity="mockActivity"
          :is-processing="isProcessing"
          :is-client="isClient"
          @approve="handleApprove"
          @reject="showRejectDialog = true"
          @back="handleBack"
        />
      </div>
    </div>
  </div>

  <!-- Reject Reason Dialog -->
  <RejectReasonDialog
    v-model:open="showRejectDialog"
    :is-processing="isProcessing"
    @submit="handleRejectSubmit"
  />
</template>
