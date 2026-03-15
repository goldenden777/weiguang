
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { SITE_CONFIG, type FormFieldConfig } from '@/data/config'
import { toast } from 'vue-sonner'

interface Props {
  isClient: boolean
}

defineProps<Props>()

const fields = ref<FormFieldConfig[]>(JSON.parse(JSON.stringify(SITE_CONFIG.enrollmentFields)))
const isDialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const draggedItem = ref<FormFieldConfig | null>(null)

const formData = ref({
  label: '',
  type: 'text' as FormFieldConfig['type'],
  required: false,
  placeholder: '',
})

const fieldTypes = [
  { value: 'text', label: '文本输入' },
  { value: 'number', label: '数字输入' },
  { value: 'tel', label: '电话号码' },
  { value: 'textarea', label: '多行文本' },
]

const openDialog = (field?: FormFieldConfig) => {
  if (field) {
    isEditing.value = true
    editingId.value = field.id
    formData.value = {
      label: field.label,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder,
    }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    }
  }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  setTimeout(() => {
    formData.value = { label: '', type: 'text', required: false, placeholder: '' }
    isEditing.value = false
    editingId.value = null
  }, 300)
}

const handleSave = () => {
  if (!formData.value.label.trim()) {
    toast.error('字段标签不能为空')
    return
  }

  if (isEditing.value && editingId.value) {
    const index = fields.value.findIndex(f => f.id === editingId.value)
    if (index !== -1) {
      fields.value[index] = {
        ...fields.value[index],
        label: formData.value.label,
        type: formData.value.type,
        required: formData.value.required,
        placeholder: formData.value.placeholder,
      }
      toast.success('字段已更新')
    }
  } else {
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      label: formData.value.label,
      type: formData.value.type,
      required: formData.value.required,
      placeholder: formData.value.placeholder,
    }
    fields.value.push(newField)
    toast.success('字段已添加')
  }

  closeDialog()
}

const handleDelete = (id: string) => {
  if (confirm('确定要删除此字段吗？')) {
    fields.value = fields.value.filter(f => f.id !== id)
    toast.success('字段已删除')
  }
}

const handleDragStart = (field: FormFieldConfig) => {
  draggedItem.value = field
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (targetField: FormFieldConfig) => {
  if (!draggedItem.value || draggedItem.value.id === targetField.id) return

  const draggedIndex = fields.value.findIndex(f => f.id === draggedItem.value!.id)
  const targetIndex = fields.value.findIndex(f => f.id === targetField.id)

  if (draggedIndex !== -1 && targetIndex !== -1) {
    const temp = fields.value[draggedIndex]
    fields.value[draggedIndex] = fields.value[targetIndex]
    fields.value[targetIndex] = temp
    toast.success('字段顺序已更新')
  }

  draggedItem.value = null
}

const getFieldTypeLabel = (type: string) => {
  return fieldTypes.find(t => t.value === type)?.label || type
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle class="text-lg">报名表单字段配置</CardTitle>
          <CardDescription>自定义报名表单的字段，支持拖拽排序</CardDescription>
        </div>
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="() => openDialog()" :disabled="!isClient">
              <SafeIcon name="Plus" :size="16" class="mr-2" />
              新增字段
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{{ isEditing ? '编辑字段' : '新增字段' }}</DialogTitle>
              <DialogDescription>
                {{ isEditing ? '修改表单字段信息' : '添加新的表单字段' }}
              </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="fieldLabel">字段标签</Label>
                <Input
                  id="fieldLabel"
                  v-model="formData.label"
                  placeholder="如：姓名、手机号"
                />
              </div>

              <div class="space-y-2">
                <Label for="fieldType">字段类型</Label>
                <Select v-model="formData.type">
                  <SelectTrigger id="fieldType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="type in fieldTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="fieldPlaceholder">占位符文本</Label>
                <Input
                  id="fieldPlaceholder"
                  v-model="formData.placeholder"
                  placeholder="输入框中的提示文本"
                />
              </div>

              <div class="flex items-center space-x-2">
                <Checkbox
                  id="fieldRequired"
                  v-model:checked="formData.required"
                />
                <Label for="fieldRequired" class="font-normal cursor-pointer">
                  设为必填项
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" @click="closeDialog">取消</Button>
              <Button @click="handleSave">{{ isEditing ? '更新' : '创建' }}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div class="space-y-2">
          <div
            v-for="field in fields"
            :key="field.id"
            draggable
            @dragstart="handleDragStart(field)"
            @dragover="handleDragOver"
            @drop="handleDrop(field)"
            class="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-move"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <SafeIcon name="GripVertical" :size="16" class="text-muted-foreground flex-shrink-0" />
                  <h4 class="font-semibold">{{ field.label }}</h4>
                  <span v-if="field.required" class="text-destructive text-sm">*</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span class="px-2 py-1 bg-muted rounded text-xs">
                    {{ getFieldTypeLabel(field.type) }}
                  </span>
                  <span v-if="field.placeholder" class="text-xs italic">
                    "{{ field.placeholder }}"
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="() => openDialog(field)"
                  :disabled="!isClient"
                >
                  <SafeIcon name="Edit" :size="16" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive hover:text-destructive hover:bg-destructive/10"
                  @click="() => handleDelete(field.id)"
                  :disabled="!isClient"
                >
                  <SafeIcon name="Trash2" :size="16" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Preview -->
        <div class="mt-8 pt-8 border-t border-border">
          <h3 class="font-semibold mb-4">表单预览</h3>
          <div class="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div v-for="field in fields" :key="field.id" class="space-y-2">
              <label class="text-sm font-medium">
                {{ field.label }}
                <span v-if="field.required" class="text-destructive">*</span>
              </label>
              <div v-if="field.type === 'textarea'" class="w-full h-20 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground">
                {{ field.placeholder }}
              </div>
              <div v-else class="w-full h-10 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground flex items-center">
                {{ field.placeholder }}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
