
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

interface Props {
  status: 'pending' | 'approved' | 'rejected' | 'offline'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const statusConfig = {
  pending: { label: '待审核', class: 'bg-primary/10 text-primary hover:bg-primary/20' },
  approved: { label: '已上架', class: 'bg-success/10 text-[hsl(142_71%_45%)] hover:bg-success/20' },
  rejected: { label: '已驳回', class: 'bg-destructive/10 text-destructive hover:bg-destructive/20' },
  offline: { label: '已下架', class: 'bg-muted text-muted-foreground hover:bg-muted' },
}
</script>

<template>
  <Badge 
    :class="[
      statusConfig[status].class,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
    ]"
    variant="outline"
  >
    {{ statusConfig[status].label }}
  </Badge>
</template>
