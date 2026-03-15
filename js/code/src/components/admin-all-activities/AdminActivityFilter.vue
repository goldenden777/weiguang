
<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { ACTIVITY_CATEGORIES } from '@/data/activity'

interface Agency {
  id: string
  name: string
}

interface Props {
  searchText: string
  agencyId: string
  category: string
  status: string
  dateRange: 'all' | 'week' | 'month' | 'custom'
  agencies: Agency[]
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:searchText': [value: string]
  'update:agencyId': [value: string]
  'update:category': [value: string]
  'update:status': [value: string]
  'update:dateRange': [value: 'all' | 'week' | 'month' | 'custom']
  change: []
}>()

const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已上架' },
  { value: 'rejected', label: '已驳回' },
  { value: 'offline', label: '已下架' },
]

const dateRangeOptions = [
  { value: 'all', label: '全部日期' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自定义' },
]

const handleReset = () => {
  emits('update:searchText', '')
  emits('update:agencyId', '')
  emits('update:category', '')
  emits('update:status', '')
  emits('update:dateRange', 'all')
  emits('change')
}

const handleFilterChange = () => {
  emits('change')
}
</script>

<template>
<Card class="border-none shadow-sm">
    <CardContent class="p-6">
      <div class="space-y-6">
        <!-- Search Row -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SafeIcon name="Search" :size="18" />
            </div>
<Input
              :value="searchText"
              @input="(e) => emits('update:searchText', (e.target as HTMLInputElement).value)"
              @change="handleFilterChange"
              placeholder="搜索活动名称、执行机构关键词..."
              class="pl-10 w-full"
            />
          </div>
          <Button
            variant="outline"
            @click="handleReset"
            class="md:w-auto"
          >
            <SafeIcon name="RotateCcw" :size="16" class="mr-2" />
            重置
          </Button>
        </div>

<!-- Filter Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Agency Filter -->
          <Select :model-value="agencyId" @update:model-value="(v) => { emits('update:agencyId', v); handleFilterChange() }">
            <SelectTrigger>
              <SelectValue placeholder="选择执行机构" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部机构</SelectItem>
              <SelectItem v-for="agency in agencies" :key="agency.id" :value="agency.id">
                {{ agency.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Category Filter -->
          <Select :model-value="category" @update:model-value="(v) => { emits('update:category', v); handleFilterChange() }">
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部分类</SelectItem>
              <SelectItem v-for="cat in ACTIVITY_CATEGORIES" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Status Filter -->
          <Select :model-value="status" @update:model-value="(v) => { emits('update:status', v); handleFilterChange() }">
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部状态</SelectItem>
              <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Date Range Filter -->
          <Select :model-value="dateRange" @update:model-value="(v) => emits('update:dateRange', v as any)">
            <SelectTrigger>
              <SelectValue placeholder="选择日期范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in dateRangeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
