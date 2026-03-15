
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  title: string
  value: number
  icon: string
  color?: string
  href?: string
}

withDefaults(defineProps<Props>(), {
  color: 'text-primary',
  href: '#'
})
</script>

<template>
  <a :href="href" class="block group">
<Card class="h-full border-border/40 hover:border-foreground/10 transition-all duration-300 hover:shadow-lg">
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">{{ title }}</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold tracking-tight">{{ value }}</span>
              <span v-if="value > 10" class="text-[10px] text-emerald-500 font-medium flex items-center">
                <SafeIcon name="TrendingUp" :size="10" class="mr-0.5" />
                +12%
              </span>
            </div>
          </div>
          <div :class="['w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform', color]">
            <SafeIcon :name="icon" :size="24" />
          </div>
        </div>
      </CardContent>
    </Card>
  </a>
</template>
