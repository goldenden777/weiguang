
<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  title: string
  value: number
  icon: string
  color?: 'primary' | 'secondary' | 'success'
  isClient: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-[hsl(142_71%_45%)]',
}

const bgColorClasses = {
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  success: 'bg-[hsl(142_71%_45%_/_0.1)]',
}
</script>

<template>
<Card class="overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-md ring-1 ring-border/40" :class="isClient ? 'opacity-100' : 'opacity-75'">
    <CardContent class="p-5">
      <div class="flex items-center justify-between">
        <div :class="[bgColorClasses[color], 'p-3 rounded-xl']">
          <SafeIcon :name="icon" :size="20" :class="colorClasses[color]" />
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold text-muted-foreground uppercase mb-1">{{ title }}</p>
          <p class="text-2xl font-bold tracking-tight">{{ value }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
