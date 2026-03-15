
<script setup lang="ts">
import { computed } from 'vue'
import { HelpCircle } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface FormData {
  budget: number
  materials: string
}

interface Props {
  modelValue: FormData
  errors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: FormData]
}>()

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const updateField = (field: keyof FormData, value: any) => {
  formData.value = {
    ...formData.value,
    [field]: value,
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Budget -->
<div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <Label for="apf-budget">活动预算（元）</Label>
        <HelpCircle class="h-4 w-4 text-muted-foreground/60 cursor-help" />
      </div>
      <Input
        id="apf-budget"
        type="number"
        :value="formData.budget"
        placeholder="请输入活动预算总额"
        min="0"
        step="100"
        @input="updateField('budget', parseFloat($event.target.value) || 0)"
      />
<p class="text-xs text-muted-foreground">
        预算总额需与下方明细对应，大额预算（>1000元）需在附件中上传详细概算表
      </p>
      <p v-if="props.errors?.budget" class="text-sm text-destructive">
        {{ props.errors.budget }}
      </p>
    </div>

    <!-- Materials -->
    <div class="space-y-2">
      <Label for="apf-materials">所需物资</Label>
      <Textarea
        id="apf-materials"
        v-model="formData.materials"
        placeholder="请列出活动所需的物资清单，包括数量和规格。例如：
- 清洁用品：拖把5把、扫帚5把、垃圾袋100个
- 防护用品：一次性手套500双、口罩100个
- 宣传物料：宣传册200份、横幅2条
- 其他：矿泉水50瓶、应急医疗包2个"
        rows="6"
        @input="updateField('materials', $event.target.value)"
      />
<p class="text-xs text-muted-foreground">
        详细的规格说明（如：品牌、尺寸、型号）能显著加快物资采购审核速度 | {{ formData.materials.length }}/1000 字符
      </p>
    </div>
  </div>
</template>
