
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { toast } from 'vue-sonner'

interface Props {
  isClient: boolean
}

defineProps<Props>()

interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: '助老',
    description: '关爱老年人的公益活动',
    color: '#FF6B6B',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: '助学',
    description: '教育和学习相关的公益活动',
    color: '#4ECDC4',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: '环保',
    description: '环境保护和生态相关的活动',
    color: '#95E1D3',
    createdAt: '2024-01-16',
  },
  {
    id: '4',
    name: '社区服务',
    description: '社区建设和服务相关的活动',
    color: '#FFE66D',
    createdAt: '2024-01-16',
  },
  {
    id: '5',
    name: '健康卫生',
    description: '健康和卫生相关的公益活动',
    color: '#A8E6CF',
    createdAt: '2024-01-17',
  },
]

const categories = ref<Category[]>(mockCategories)
const isDialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({
  name: '',
  description: '',
  color: '#4ECDC4',
})

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A8E6CF',
  '#FF8B94', '#FFB4A2', '#E5989B', '#B5838D', '#6D6875',
]

const openDialog = (category?: Category) => {
  if (category) {
    isEditing.value = true
    editingId.value = category.id
    formData.value = {
      name: category.name,
      description: category.description,
      color: category.color,
    }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      name: '',
      description: '',
      color: '#4ECDC4',
    }
  }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  setTimeout(() => {
    formData.value = { name: '', description: '', color: '#4ECDC4' }
    isEditing.value = false
    editingId.value = null
  }, 300)
}

const handleSave = () => {
  if (!formData.value.name.trim()) {
    toast.error('分类名称不能为空')
    return
  }

  if (isEditing.value && editingId.value) {
    const index = categories.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: formData.value.name,
        description: formData.value.description,
        color: formData.value.color,
      }
      toast.success('分类已更新')
    }
  } else {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.value.name,
      description: formData.value.description,
      color: formData.value.color,
      createdAt: new Date().toISOString().split('T')[0],
    }
    categories.value.push(newCategory)
    toast.success('分类已添加')
  }

  closeDialog()
}

const handleDelete = (id: string) => {
  if (confirm('确定要删除此分类吗？')) {
    categories.value = categories.value.filter(c => c.id !== id)
    toast.success('分类已删除')
  }
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle class="text-lg">活动分类管理</CardTitle>
          <CardDescription>管理活动的分类标签，用户可按分类筛选活动</CardDescription>
        </div>
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="() => openDialog()" :disabled="!isClient">
              <SafeIcon name="Plus" :size="16" class="mr-2" />
              新增分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{{ isEditing ? '编辑分类' : '新增分类' }}</DialogTitle>
              <DialogDescription>
                {{ isEditing ? '修改分类信息' : '创建新的活动分类' }}
              </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="categoryName">分类名称</Label>
                <Input
                  id="categoryName"
                  v-model="formData.name"
                  placeholder="如：助老、助学、环保"
                />
              </div>

              <div class="space-y-2">
                <Label for="categoryDesc">分类描述</Label>
                <Input
                  id="categoryDesc"
                  v-model="formData.description"
                  placeholder="简要描述此分类的含义"
                />
              </div>

              <div class="space-y-2">
                <Label>分类颜色</Label>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="color in colorOptions"
                    :key="color"
                    :style="{ backgroundColor: color }"
                    :class="[
                      'w-10 h-10 rounded-lg transition-all',
                      formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : 'hover:scale-110'
                    ]"
                    @click="formData.color = color"
                  />
                </div>
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
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>分类名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>颜色</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead class="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="category in categories" :key="category.id">
                <TableCell class="font-medium">{{ category.name }}</TableCell>
                <TableCell class="text-muted-foreground">{{ category.description }}</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded border border-border"
                      :style="{ backgroundColor: category.color }"
                    />
                    <span class="text-xs font-mono">{{ category.color }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">{{ category.createdAt }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="() => openDialog(category)"
                      :disabled="!isClient"
                    >
                      <SafeIcon name="Edit" :size="16" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-destructive hover:text-destructive hover:bg-destructive/10"
                      @click="() => handleDelete(category.id)"
                      :disabled="!isClient"
                    >
                      <SafeIcon name="Trash2" :size="16" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Category Preview -->
        <div class="mt-8 pt-8 border-t border-border">
          <h3 class="font-semibold mb-4">分类预览</h3>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="category in categories"
              :key="category.id"
              :style="{ backgroundColor: category.color + '20', color: category.color, borderColor: category.color }"
              variant="outline"
            >
              {{ category.name }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
