<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'
</script>

<template>
  <div class="space-y-6">
    <Card class="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
      <CardHeader class="border-b border-border bg-white py-5 px-6">
        <CardTitle class="text-lg">导航栏配置</CardTitle>
        <CardDescription class="mt-1.5">管理门户顶部与底部导航链接。该功能即将开放。</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 bg-white p-6">
        <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-slate-50/50 py-16">
          <div class="flex items-center gap-3 rounded-lg bg-slate-100 px-6 py-4 text-muted-foreground">
            <SafeIcon name="Construction" :size="22" />
            <span class="text-base font-medium">升级中…</span>
          </div>
          <p class="mt-5 text-sm text-muted-foreground">敬请期待。</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
