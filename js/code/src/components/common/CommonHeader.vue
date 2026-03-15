
<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'CommonHeader' })
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { SITE_CONFIG } from '@/data/config'
import { logout, getCurrentUser } from '@/lib/auth'

interface Props {
  variant?: 'guest' | 'agency' | 'admin'
  userName?: string
  mode?: 'mobile' | 'desktop'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'guest',
  userName: '用户',
  mode: 'desktop'
})

const isMobileMenuOpen = ref(false)
const currentPath = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname
  }
})

const guestNavItems = [
  { name: '首页', href: './home.html' },
  { name: '活动列表', href: './home.html' },
]

const isActive = (href: string) => {
  return currentPath.value.includes(href.replace('./', '').replace('.html', ''))
}

const displayName = ref(props.userName)
onMounted(() => {
  if (props.variant !== 'guest' && typeof window !== 'undefined') {
    const user = getCurrentUser()
    if (user?.name) displayName.value = user.name
  }
})

const handleLogout = () => {
  logout()
}
</script>

<template>
<header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
<div :class="[mode === 'desktop' ? 'px-6 lg:px-10' : 'container mx-auto px-4']">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-6 lg:space-x-12">
<a href="./home.html" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div v-if="SITE_CONFIG?.logoUrl" class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-background">
              <img v-if="SITE_CONFIG?.logoUrl" :src="SITE_CONFIG?.logoUrl || ''" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <SafeIcon name="Heart" :size="20" color="white" :stroke-width="2.5" />
            </div>
            <span class="text-xl font-bold tracking-tight">{{ SITE_CONFIG?.siteName || '微光公益' }}</span>
          </a>

          <!-- Desktop Navigation -->
          <nav v-if="mode === 'desktop' && variant === 'guest'" class="hidden md:flex items-center space-x-6">
            <a v-for="item in guestNavItems" :key="item.name" :href="item.href" 
               class="text-sm font-medium transition-colors hover:text-primary"
               :class="isActive(item.href) ? 'text-primary' : 'text-muted-foreground'">
              {{ item.name }}
            </a>
          </nav>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4">
<!-- Guest Actions -->
          <div v-if="variant === 'guest'" class="flex items-center gap-2">
            <div class="flex flex-col items-end">
              <Button
                variant="secondary"
                size="sm"
                as="a"
                href="./enrollment-query.html"
                class="shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium shadow-sm rounded-lg px-3 sm:px-4 h-9"
                title="用手机号查询我的报名"
              >
                <SafeIcon name="ClipboardList" :size="16" class="mr-1.5" />
                报名查询
              </Button>
              <span class="mt-0.5 text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">用手机号查我的报名</span>
            </div>
            <Button v-if="mode === 'desktop'" variant="ghost" size="sm" as="a" href="./home.html">
              <SafeIcon name="Home" :size="16" class="mr-2" />
              返回首页
            </Button>
          </div>

          <!-- Logged In User -->
          <DropdownMenu v-else>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 rounded-full p-0">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <SafeIcon name="User" :size="16" class="text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-40">
              <DropdownMenuItem as-child>
                <a 
                  :href="variant === 'agency' ? './agency-dashboard.html' : './admin-dashboard.html'"
                  class="cursor-pointer"
                >
                  <SafeIcon name="LayoutDashboard" :size="16" class="mr-2" />
                  工作台
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                class="cursor-pointer text-destructive focus:text-destructive"
                @select.prevent="handleLogout"
              >
                <SafeIcon name="LogOut" :size="16" class="mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>
  </header>
</template>
