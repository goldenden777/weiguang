
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { ACTIVITY_CATEGORIES } from '@/data/activity'
import { cn } from '@/lib/utils'

const isClient = ref(true)

// Filter state
const selectedDateRange = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')

// Date range options
const dateRanges = [
  { value: 'all', label: '全部日期' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自定义日期' },
]

const emit = defineEmits<{
  filterChange: [{ dateRange: string; category: string; keyword: string }]
}>()

onMounted(() => {
  isClient.value = false
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

const handleFilterChange = () => {
  emit('filterChange', {
    dateRange: selectedDateRange.value,
    category: selectedCategory.value,
    keyword: searchKeyword.value,
  })
}

const resetFilters = () => {
  selectedDateRange.value = 'all'
  selectedCategory.value = 'all'
  searchKeyword.value = ''
  handleFilterChange()
}
</script>

<template>
<div class="space-y-3" data-activities-section>
    <!-- Mobile Search Bar (Full Width) -->
    <div class="relative">
      <SafeIcon 
        name="Search" 
        :size="16" 
        class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索公益活动"
        class="h-9 pl-9 rounded-full bg-muted/50 border-none text-xs focus-visible:ring-primary/30"
        @input="handleFilterChange"
      />
    </div>

    <!-- Category Pills (Wrap, full visibility & neat alignment) -->
    <div class="flex flex-wrap items-center gap-2">
      <a
        href="./page-2659759.html"
        :class="cn(
          'whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors inline-flex',
          'bg-primary text-primary-foreground hover:opacity-90'
        )"
      >
        全部
      </a>
      <button
        v-for="cat in ACTIVITY_CATEGORIES"
        :key="cat.id"
        @click="selectedCategory = cat.id; handleFilterChange()"
        :class="cn(
          'whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5',
          selectedCategory === cat.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )"
      >
        <SafeIcon :name="cat.iconName" :size="12" class="shrink-0" />
        {{ cat.name }}
      </button>
    </div>

    <!-- Date Filters (Chip Style, wrap for full visibility) -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="range in dateRanges"
        :key="range.value"
        @click="selectedDateRange = range.value; handleFilterChange()"
        :class="cn(
          'whitespace-nowrap px-3 py-1.5 rounded-md text-[11px] border transition-colors',
          selectedDateRange === range.value
            ? 'border-secondary bg-secondary/5 text-secondary'
            : 'border-border text-muted-foreground'
        )"
      >
        {{ range.label }}
      </button>
    </div>
  </div>
</template>
