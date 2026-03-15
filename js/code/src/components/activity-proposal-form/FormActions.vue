
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  isSubmitting: boolean
  completionPercentage: number
}

defineProps<Props>()

const emit = defineEmits<{
  'save-draft': []
  'submit': []
  'cancel': []
}>()
</script>

<template>
<div class="flex items-center justify-between p-8 border-t border-border bg-muted/20">
    <Button 
      variant="ghost"
      @click="emit('cancel')"
      :disabled="isSubmitting"
      class="text-muted-foreground hover:text-foreground"
    >
      <SafeIcon name="ChevronLeft" :size="18" class="mr-2" />
      返回列表
    </Button>

    <div class="flex items-center gap-4">
      <Button 
        variant="outline"
        @click="emit('save-draft')"
        :disabled="isSubmitting"
        class="min-w-[120px]"
      >
        <SafeIcon name="Save" :size="16" class="mr-2" />
        保存草稿
      </Button>

      <div class="flex flex-col items-end gap-1">
        <p v-if="completionPercentage < 100 && !isSubmitting" class="text-xs text-muted-foreground">
          请完成所有带 * 的必填项（当前 {{ completionPercentage }}%）
        </p>
        <Button 
          variant="default"
          @click="emit('submit')"
          :disabled="isSubmitting"
          class="min-w-[160px] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <SafeIcon 
            v-if="isSubmitting"
            name="Loader2" 
            :size="16" 
            class="mr-2 animate-spin" 
          />
          <SafeIcon 
            v-else
            name="Send" 
            :size="16" 
            class="mr-2" 
          />
          {{ isSubmitting ? '提交中...' : '提交审核' }}
        </Button>
      </div>
    </div>
  </div>
</template>
