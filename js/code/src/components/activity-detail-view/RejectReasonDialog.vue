
<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  open: boolean
  isProcessing: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:open': [value: boolean]
  submit: [reason: string]
}>()

const reason = ref('')
const reasonError = ref('')

const handleSubmit = () => {
  reasonError.value = ''
  
  if (!reason.value.trim()) {
    reasonError.value = '请填写驳回理由'
    return
  }
  
  if (reason.value.trim().length < 10) {
    reasonError.value = '驳回理由至少需要10个字符'
    return
  }
  
  emits('submit', reason.value)
  reason.value = ''
}

const handleOpenChange = (value: boolean) => {
  if (!value) {
    reason.value = ''
    reasonError.value = ''
  }
  emits('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <SafeIcon name="AlertTriangle" :size="20" class="text-destructive" />
          填写驳回理由
        </DialogTitle>
        <DialogDescription>
          请详细说明驳回原因，以便执行机构改进活动方案
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="reason" class="text-base font-semibold">驳回理由 *</Label>
          <Textarea
            id="reason"
            v-model="reason"
            placeholder="请输入驳回理由，至少10个字符..."
            class="min-h-[120px] resize-none"
            :disabled="isProcessing"
          />
          <p v-if="reasonError" class="text-sm text-destructive">
            {{ reasonError }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ reason.length }} / 500 字符
          </p>
        </div>

        <!-- Common Reasons -->
        <div class="space-y-2">
          <Label class="text-sm font-semibold">常见驳回理由</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="item in [
                '活动信息不完整',
                '预算说明不清楚',
                '活动时间冲突',
                '场地信息有误',
                '资质文件缺失',
                '其他问题'
              ]"
              :key="item"
              variant="outline"
              size="sm"
              @click="reason = item"
              :disabled="isProcessing"
            >
              {{ item }}
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          @click="handleOpenChange(false)"
          :disabled="isProcessing"
        >
          取消
        </Button>
        <Button
          variant="destructive"
          @click="handleSubmit"
          :disabled="isProcessing"
        >
          <SafeIcon v-if="!isProcessing" name="Send" :size="16" class="mr-2" />
          <span v-if="isProcessing" class="inline-block animate-spin mr-2">
            <SafeIcon name="Loader2" :size="16" />
          </span>
          {{ isProcessing ? '提交中...' : '确认驳回' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
