
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { SITE_CONFIG } from '@/data/config'

interface Props {
  headerHeight?: string
  variant?: 'agency' | 'admin'
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: '64px',
  variant: 'agency',
})

const currentPath = ref('')
const isClient = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname
    isClient.value = true
  }
})

const isActive = (href: string) => {
  return currentPath.value.includes(href.replace('./', '').replace('.html', ''))
}

// Agency sidebar items
const agencySidebarItems = [
  {
    title: '工作台',
    href: './agency-dashboard.html',
    icon: 'LayoutDashboard',
  },
  {
    title: '我的活动',
    href: './agency-activity-list.html',
    icon: 'ListTodo',
  },
  {
    title: '新建活动',
    href: './activity-proposal-form.html',
    icon: 'Plus',
  },
]

// Admin sidebar items
const adminSidebarItems = [
  {
    title: '工作台',
    href: './admin-dashboard.html',
    icon: 'LayoutDashboard',
  },
  {
    title: '待审核活动',
    href: './activity-audit-list.html',
    icon: 'CheckCircle',
  },
  {
    title: '全量活动管理',
    href: './admin-all-activities.html',
    icon: 'ListTodo',
  },
{
    title: '用户管理',
    href: './user-account-management.html',
    icon: 'Users',
  },
  {
    title: '内容管理',
    href: './content-management.html',
    icon: 'FileText',
  },
  {
    title: '系统配置',
    href: './system-config-center.html',
    icon: 'Settings',
  },
]

const sidebarItems = props.variant === 'agency' ? agencySidebarItems : adminSidebarItems
</script>

<template>
<SidebarProvider class="min-h-screen bg-slate-50">
    <Sidebar class="border-r border-border shadow-sm" :style="{ '--header-height': headerHeight } as any">
      <SidebarHeader class="border-b border-border">
<div class="flex items-center space-x-2 px-2">
          <div v-if="SITE_CONFIG?.logoUrl" class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/10">
            <img :src="SITE_CONFIG.logoUrl" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div v-else class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <SafeIcon name="Heart" :size="20" color="white" :stroke-width="2.5" />
          </div>
          <span class="font-bold text-sm">{{ SITE_CONFIG?.siteName || '微光公益' }}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in sidebarItems" :key="item.href">
                <SidebarMenuButton
                  as-child
                  :is-active="isActive(item.href)"
                  class="cursor-pointer"
                >
                  <a :href="item.href" class="flex items-center gap-2">
                    <SafeIcon :name="item.icon" :size="18" />
                    <span>{{ item.title }}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              class="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <SafeIcon name="LogOut" :size="18" />
              <span>退出登录</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset class="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div class="flex items-center gap-2 border-b border-border px-4 h-16">
        <SidebarTrigger />
      </div>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
