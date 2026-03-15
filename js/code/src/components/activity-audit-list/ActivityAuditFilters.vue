
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const isClient = ref(true)

// Filter states
const searchKeyword = ref('')
const selectedAgency = ref('')
const selectedCategory = ref('')
const selectedDateRange = ref('all')

// Mock agencies for demo
const agencies = [
  { id: 'agency-1', name: '微光志愿者联盟' },
  { id: 'agency-2', name: '益启航教育中心' },
  { id: 'agency-3', name: '海蓝环保社团' },
]

const dateRanges = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自定义' },
]

const emit = defineEmits<{
  filterChange: [filters: {
    keyword: string
    agency: string
    category: string
    dateRange: string
  }]
}>()

const handleFilterChange = () => {
  emit('filterChange', {
    keyword: searchKeyword.value,
    agency: selectedAgency.value,
    category: selectedCategory.value,
    dateRange: selectedDateRange.value,
  })
}

const handleReset = () => {
  searchKeyword.value = ''
  selectedAgency.value = ''
  selectedCategory.value = ''
  selectedDateRange.value = 'all'
  handleFilterChange()
}

onMounted(() => {
  isClient.value = false
  // Simulate data loading
  setTimeout(() => {
    isClient.value = true
  }, 0)
})
</script>

<template>
  <div class="bg-white rounded-lg border border-border p-6 mb-6 shadow-soft">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">筛选条件</h2>
      <Button 
        variant="ghost" 
        size="sm"
        @click="handleReset"
        class="text-muted-foreground hover:text-foreground"
      >
        <SafeIcon name="RotateCcw" :size="16" class="mr-1" />
        重置
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Search -->
      <div class="lg:col-span-2">
        <Input
          v-model="searchKeyword"
          placeholder="搜索活动名称或机构名称..."
          @input="handleFilterChange"
          class="w-full"
        />
      </div>

      <!-- Agency Filter -->
      <Select v-model="selectedAgency" @update:model-value="handleFilterChange">
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
      <Select v-model="selectedCategory" @update:model-value="handleFilterChange">
        <SelectTrigger>
          <SelectValue placeholder="选择活动分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">全部分类</SelectItem>
          <SelectItem v-for="cat in ACTIVITY_CATEGORIES" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- Date Range Filter -->
      <Select v-model="selectedDateRange" @update:model-value="handleFilterChange">
        <SelectTrigger>
          <SelectValue placeholder="选择时间范围" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="range in dateRanges" :key="range.value" :value="range.value">
            {{ range.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
