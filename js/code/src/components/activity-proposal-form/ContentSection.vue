
<script setup lang="ts">
import { computed } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface FormData {
  purpose: string
  process: string
  precautions: string
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

const updateField = (field: keyof FormData, value: string) => {
  formData.value = {
    ...formData.value,
    [field]: value,
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Purpose -->
    <div class="space-y-2">
      <Label for="apf-purpose">活动目的 <span class="text-destructive">*</span></Label>
      <Textarea
        id="apf-purpose"
        v-model="formData.purpose"
        placeholder="请详细说明本次活动的目的和意义，如：为辖区内孤寡老人提供居家清洁与心理疏导服务"
        rows="5"
        @input="updateField('purpose', $event.target.value)"
      />
<p class="text-xs text-muted-foreground">
        应侧重描述该活动能解决什么社会问题或带来哪些具体改变 | {{ formData.purpose.length }}/500 字符
      </p>
      <p v-if="props.errors?.purpose" class="text-sm text-destructive">
        {{ props.errors.purpose }}
      </p>
    </div>

    <!-- Process -->
    <div class="space-y-2">
      <Label for="apf-process">活动流程 <span class="text-destructive">*</span></Label>
      <Textarea
        id="apf-process"
        v-model="formData.process"
        placeholder="请详细描述活动的具体流程，包括时间安排、各环节内容等。例如：
09:00-09:30 志愿者集合与培训
09:30-11:30 入户服务（清洁卫生、健康监测）
11:30-12:00 总结反馈"
        rows="6"
        @input="updateField('process', $event.target.value)"
      />
<p class="text-xs text-muted-foreground">
        时间节点建议以 30-60 分钟为区间进行拆解，确保志愿者能清晰预知行程 | {{ formData.process.length }}/800 字符
      </p>
      <p v-if="props.errors?.process" class="text-sm text-destructive">
        {{ props.errors.process }}
      </p>
    </div>

    <!-- Precautions -->
    <div class="space-y-2">
      <Label for="apf-precautions">注意事项</Label>
      <Textarea
        id="apf-precautions"
        v-model="formData.precautions"
        placeholder="请列出参与者需要注意的事项，如：
- 请穿着舒适的服装和鞋子
- 自备防晒用品
- 活动中请遵守安全规则
- 尊重服务对象的隐私"
        rows="5"
        @input="updateField('precautions', $event.target.value)"
      />
<p class="text-xs text-muted-foreground">
        请重点注明特殊声明，如：患有特定疾病者不宜参加、需自备交通工具等 | {{ formData.precautions.length }}/500 字符
      </p>
    </div>
  </div>
</template>
