<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon.vue'
import ContentBannerTab from './ContentBannerTab.vue'
import ContentNewsTab from './ContentNewsTab.vue'
import ContentNavTab from './ContentNavTab.vue'
import ContentFooterTab from './ContentFooterTab.vue'
import ContentSiteTab from './ContentSiteTab.vue'

const activeTab = ref('banner')
</script>

<template>
  <div class="flex-1 flex flex-col gap-6">
    <!-- 上方：说明 + 标签栏（与全量活动管理筛选卡同一风格） -->
    <Card class="border-none shadow-sm">
      <CardContent class="p-6">
        <p class="text-sm text-muted-foreground leading-relaxed mb-6">
          管理首页 Banner、往期动态、页脚与站点基础信息；导航栏配置升级中。
        </p>
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="inline-flex h-auto w-full flex-wrap gap-2 rounded-lg bg-slate-50 p-2">
            <TabsTrigger
              value="banner"
              class="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <SafeIcon name="Image" :size="18" />
              <span class="hidden sm:inline">首页 Banner</span>
            </TabsTrigger>
            <TabsTrigger
              value="news"
              class="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <SafeIcon name="Newspaper" :size="18" />
              <span class="hidden sm:inline">往期动态</span>
            </TabsTrigger>
            <TabsTrigger
              value="nav"
              class="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <SafeIcon name="Menu" :size="18" />
              <span class="hidden sm:inline">导航栏</span>
            </TabsTrigger>
            <TabsTrigger
              value="footer"
              class="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <SafeIcon name="PanelBottom" :size="18" />
              <span class="hidden sm:inline">页脚配置</span>
            </TabsTrigger>
            <TabsTrigger
              value="site"
              class="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <SafeIcon name="Globe" :size="18" />
              <span class="hidden sm:inline">站点信息</span>
            </TabsTrigger>
          </TabsList>

          <!-- 下方：列表/表单区（与全量活动管理列表卡一致，留足间距） -->
          <TabsContent value="banner" class="mt-8">
            <ContentBannerTab />
          </TabsContent>
          <TabsContent value="news" class="mt-8">
            <ContentNewsTab />
          </TabsContent>
          <TabsContent value="nav" class="mt-8">
            <ContentNavTab />
          </TabsContent>
          <TabsContent value="footer" class="mt-8">
            <ContentFooterTab />
          </TabsContent>
          <TabsContent value="site" class="mt-8">
            <ContentSiteTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>
