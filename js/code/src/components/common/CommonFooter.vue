
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  variant?: 'simple' | 'full'
  layout?: 'mobile' | 'desktop'
}

withDefaults(defineProps<Props>(), {
  variant: 'full',
  layout: 'desktop'
})

const footerLinks = {
  about: [
    { name: '关于我们', href: './home.html' },
    { name: '联系方式', href: './home.html' },
    { name: '加入我们', href: './home.html' },
  ],
  legal: [
    { name: '隐私政策', href: './privacy.html' },
    { name: '服务条款', href: './home.html' },
    { name: '免责声明', href: './disclaimer.html' },
  ],
  help: [
    { name: '机构登录', href: './login.html' },
    { name: '常见问题', href: './home.html' },
    { name: '报名指南', href: './home.html' },
    { name: '志愿者手册', href: './home.html' },
  ],
}

const socialLinks = [
  { icon: 'Mail', href: 'mailto:contact@weiguang.org', label: '邮箱' },
  { icon: 'Phone', href: 'tel:0532-12345678', label: '电话' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
<!-- Unified Footer -->
  <footer :class="[
    'border-t border-border mt-auto bg-muted/30',
    layout === 'mobile' ? 'pb-24' : 'py-12'
  ]">
    <!-- Mobile Layout -->
    <div v-if="layout === 'mobile'" class="px-6 py-8 text-center space-y-4">
      <div class="flex items-center justify-center space-x-2">
        <div class="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
          <SafeIcon name="Heart" :size="14" class="text-muted-foreground" />
        </div>
        <span class="text-sm font-semibold text-muted-foreground">微光公益</span>
      </div>
      <p class="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[240px] mx-auto">
        传递温暖，汇聚微光<br/>
        青岛微光慈善基金会 版权所有<br/>
        鲁ICP备12345678号
      </p>
      <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <a href="./login.html" class="text-[10px] text-primary font-medium hover:underline">机构登录</a>
        <span class="w-px h-2 bg-border/50 hidden sm:inline"></span>
        <a href="./disclaimer.html" class="text-[10px] text-muted-foreground hover:text-primary transition-colors">免责声明</a>
        <span class="w-px h-2 bg-border/50"></span>
        <a href="./privacy.html" class="text-[10px] text-muted-foreground hover:text-primary transition-colors">隐私协议</a>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div v-else class="container mx-auto px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <SafeIcon name="Heart" :size="18" class="text-primary" />
            </div>
            <span class="text-xl font-bold">微光公益</span>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            致力于通过公益力量改善社区生活，连接志愿者与有需求的人群。
          </p>
          <div class="flex space-x-4">
            <Button v-for="social in socialLinks" :key="social.label" variant="ghost" size="icon" as="a" :href="social.href">
              <SafeIcon :name="social.icon" :size="18" />
            </Button>
          </div>
        </div>
        
        <div v-for="(links, category) in footerLinks" :key="category" class="space-y-4">
          <h4 class="font-semibold text-sm uppercase tracking-wider text-foreground">
            {{ category === 'about' ? '关于' : category === 'legal' ? '法律' : '帮助' }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in links" :key="link.name">
              <a :href="link.href" class="text-sm text-muted-foreground hover:text-primary transition-colors">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {{ currentYear }} 青岛微光慈善基金会. 版权所有</p>
        <div class="flex items-center space-x-6">
          <a href="./home.html" class="hover:text-primary transition-colors">鲁ICP备12345678号</a>
          <a href="./home.html" class="hover:text-primary transition-colors">鲁公网安备11010502030000号</a>
        </div>
      </div>
    </div>
  </footer>
</template>
