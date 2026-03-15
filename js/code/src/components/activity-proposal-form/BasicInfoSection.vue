
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ACTIVITY_CATEGORIES } from '@/data/activity'
import { HelpCircle } from 'lucide-vue-next'

interface FormData {
  title: string
  category: string
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  brief: string
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

// 参与人数上限：文本框 + 仅数字，避免 type="number" 在各端的输入问题
const maxParticipantsStr = ref('')
watch(
  () => props.modelValue.maxParticipants,
  (n) => {
    const s = n <= 0 ? '' : String(n)
    if (maxParticipantsStr.value !== s) maxParticipantsStr.value = s
  },
  { immediate: true }
)
function onMaxParticipantsInput(e: Event) {
  const el = e.target as HTMLInputElement
  let raw = el.value.replace(/\D/g, '') // 只保留数字
  if (raw.length > 6) raw = raw.slice(0, 6) // 最多 6 位
  maxParticipantsStr.value = raw
  const num = raw === '' ? 0 : parseInt(raw, 10)
  updateField('maxParticipants', num)
}
</script>

<template>
<div class="space-y-8">
    <!-- Title -->
<div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <Label for="apf-title" class="text-base">活动标题 <span class="text-destructive">*</span></Label>
        <HelpCircle class="h-4 w-4 text-muted-foreground/60 cursor-help" />
      </div>
      <Input
        id="apf-title"
        v-model="formData.title"
        placeholder="请输入活动标题"
        @input="updateField('title', $event.target.value)"
      />
      <p class="text-xs text-muted-foreground">建议格式：[区域]+[受众]+[主题]，如“崂山区空巢老人温暖午餐项目”</p>
      <p v-if="props.errors?.title" class="text-sm text-destructive">
        {{ props.errors.title }}
      </p>
    </div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Category: native select to avoid dropdown not open/click in form -->
      <div class="space-y-2">
        <Label for="apf-category" class="text-base">活动分类 <span class="text-destructive">*</span></Label>
        <select
          id="apf-category"
          :value="formData.category"
          @change="updateField('category', (($event.target as HTMLSelectElement).value))"
          :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', !formData.category && 'text-muted-foreground')"
        >
          <option value="" disabled>请选择活动分类</option>
          <option v-for="cat in ACTIVITY_CATEGORIES" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <p v-if="props.errors?.category" class="text-sm text-destructive">
          {{ props.errors.category }}
        </p>
      </div>

      <!-- Max Participants -->
      <div class="space-y-2">
        <Label for="apf-max-participants" class="text-base">参与人数上限 <span class="text-destructive">*</span></Label>
        <input
          id="apf-max-participants"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :value="maxParticipantsStr"
          placeholder="请输入参与人数上限"
          :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')"
          @input="onMaxParticipantsInput"
        />
        <p class="text-xs text-muted-foreground">请根据场地承载量和物资准备情况合理设置，发布后不可轻易修改</p>
        <p v-if="props.errors?.maxParticipants" class="text-sm text-destructive">
          {{ props.errors.maxParticipants }}
        </p>
      </div>
    </div>

    <!-- Date Range: native input type="date" for reliable one-click and value sync -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-2">
        <Label for="apf-start-date" class="text-base">开始日期 <span class="text-destructive">*</span></Label>
        <input
          id="apf-start-date"
          type="date"
          :value="formData.startDate"
          @input="(e) => updateField('startDate', (e.target as HTMLInputElement).value)"
          :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')"
        />
        <p class="text-xs text-muted-foreground">系统将根据日期自动计算活动周期</p>
        <p v-if="props.errors?.startDate" class="text-sm text-destructive">
          {{ props.errors.startDate }}
        </p>
      </div>

      <div class="space-y-2">
        <Label for="apf-end-date" class="text-base">结束日期 <span class="text-destructive">*</span></Label>
        <input
          id="apf-end-date"
          type="date"
          :value="formData.endDate"
          @input="(e) => updateField('endDate', (e.target as HTMLInputElement).value)"
          :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')"
        />
        <p class="text-xs text-muted-foreground">请确保结束日期不早于开始日期</p>
        <p v-if="props.errors?.endDate" class="text-sm text-destructive">
          {{ props.errors.endDate }}
        </p>
      </div>
    </div>

<!-- Location -->
    <div class="space-y-2">
      <Label for="apf-location" class="text-base">活动地点 <span class="text-destructive">*</span></Label>
      <Input
        id="apf-location"
        v-model="formData.location"
        placeholder="请输入活动领域详细地点，如：青岛市崂山区宁夏路社区..."
@input="updateField('location', $event.target.value)"
      />
      <p class="text-xs text-muted-foreground">请务必填写具体的门牌号或地标建筑，以便志愿者精准导航</p>
      <p v-if="props.errors?.location" class="text-sm text-destructive">
        {{ props.errors.location }}
      </p>
    </div>

    <!-- Brief -->
    <div class="space-y-2">
      <Label for="apf-brief" class="text-base">活动简介 <span class="text-destructive">*</span></Label>
      <Textarea
        id="apf-brief"
        v-model="formData.brief"
        placeholder="请输入活动简介，简要说明活动的主要内容和目标（100-200字）"
        rows="4"
        @input="updateField('brief', $event.target.value)"
      />
      <p class="text-sm text-muted-foreground">{{ formData.brief.length }}/200 字符</p>
      <p v-if="props.errors?.brief" class="text-sm text-destructive">
        {{ props.errors.brief }}
      </p>
    </div>
  </div>
</template>
