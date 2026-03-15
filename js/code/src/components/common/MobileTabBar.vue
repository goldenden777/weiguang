
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface TabItem {
  label: string
  icon: string
  href: string
}

const tabs: TabItem[] = [
  { label: '首页', icon: 'Home', href: './home.html' },
  { label: '活动', icon: 'Calendar', href: './page-2659759.html' },
  { label: '我的报名', icon: 'ClipboardList', href: './enrollment-query.html' },
]

const currentPath = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname
  }
})

const isActive = (href: string) => {
  return currentPath.value.includes(href.replace('./', '').replace('.html', ''))
}
</script>

<template>
<nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around z-50 px-6 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
    <a
      v-for="tab in tabs"
      :key="tab.label"
      :href="tab.href"
      class="flex flex-col items-center justify-center space-y-1 transition-colors group"
      :class="isActive(tab.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <SafeIcon :name="tab.icon" :size="20" :stroke-width="isActive(tab.href) ? 2.5 : 2" />
      <span class="text-[10px] font-medium">{{ tab.label }}</span>
    </a>
  </nav>
</template>
