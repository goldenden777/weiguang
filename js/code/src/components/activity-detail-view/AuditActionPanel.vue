
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Activity {
  id: string
  title: string
  agencyName: string
  status: string
}

interface Props {
  activity: Activity
  isProcessing: boolean
  isClient: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  approve: []
  reject: []
  back: []
}>()
</script>

<template>
<div class="space-y-4">
    <Card class="shadow-md border-t-4 border-t-primary overflow-hidden">
      <CardHeader class="border-b bg-muted/20 py-4">
        <CardTitle class="text-base flex items-center gap-2">
          <SafeIcon name="ShieldCheck" :size="18" class="text-primary" />
          管理员审核控制台
        </CardTitle>
      </CardHeader>
      <CardContent class="p-6 space-y-6">
        <!-- Status Info -->
        <div class="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div>
            <p class="text-[10px] uppercase font-bold text-orange-600 tracking-wider mb-0.5">审核流转状态</p>
            <p class="text-sm font-bold text-orange-700 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              待处理 / 待上架
            </p>
          </div>
          <SafeIcon name="Clock" :size="24" class="text-orange-300" />
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <!-- Approve Button -->
          <Button
            class="w-full h-12 shadow-lg shadow-primary/20 text-base font-bold"
            variant="default"
            size="lg"
            @click="emits('approve')"
            :disabled="!isClient || isProcessing"
          >
            <SafeIcon v-if="!isProcessing" name="CheckCircle" :size="20" class="mr-2" />
            <span v-if="isProcessing" class="inline-block animate-spin mr-2">
              <SafeIcon name="Loader2" :size="20" />
            </span>
            {{ isProcessing ? '正在提交...' : '通过并立即上架' }}
          </Button>

          <div class="grid grid-cols-2 gap-3">
            <!-- Reject Button -->
            <Button
              variant="outline"
              size="lg"
              class="h-11 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive font-medium"
              @click="emits('reject')"
              :disabled="!isClient || isProcessing"
            >
              <SafeIcon name="XCircle" :size="18" class="mr-2" />
              驳回修改
            </Button>

            <!-- Back Button -->
            <Button
              variant="ghost"
              size="lg"
              class="h-11"
              @click="emits('back')"
              :disabled="isProcessing"
            >
              稍后处理
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Quick Info Summary -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
            <div class="w-10 h-10 rounded bg-white flex items-center justify-center border shrink-0">
               <SafeIcon name="FileText" :size="18" class="text-muted-foreground" />
            </div>
            <div class="overflow-hidden">
              <p class="text-[10px] text-muted-foreground font-bold uppercase truncate">提报单编号</p>
              <p class="text-sm font-mono font-medium truncate">{{ activity.id }}</p>
            </div>
          </div>
          
          <div class="p-3 rounded-lg bg-muted/40 border">
            <p class="text-[10px] text-muted-foreground font-bold uppercase mb-1">提报单位全称</p>
            <p class="text-sm font-medium leading-relaxed">{{ activity.agencyName }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tips -->
    <Card class="bg-accent/50 border-accent">
      <CardContent class="pt-4">
        <div class="flex gap-3">
          <SafeIcon name="AlertCircle" :size="18" class="text-primary flex-shrink-0 mt-0.5" />
          <div class="text-xs text-muted-foreground space-y-1">
            <p class="font-semibold text-foreground">审核提示</p>
            <p>• 通过审核后，活动将自动上架并对外展示</p>
            <p>• 驳回时请填写具体理由，便于机构改进</p>
            <p>• 审核操作将被记录在案便于追溯</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
