
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface UserInfo {
  id: string
  name: string
  phone: string
  avatar: string
  gender: string
  address: string
  idCard?: string
  registrationDate: string
  enrollmentCount: number
}

// Mock user data
const mockUser: UserInfo = {
  id: 'user-001',
  name: '张三',
  phone: '13800001111',
  avatar: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/5778400c-5b84-413c-a48b-67868bf8f089.png',
  gender: '男',
  address: '青岛市市南区香港中路18号青岛中心大厦',
  idCard: '370202199001011234',
  registrationDate: '2026-03-15',
  enrollmentCount: 3,
}

const userInfo = ref<UserInfo>(mockUser)

onMounted(() => {
  // In a real app, fetch user data here
  console.log('User info component mounted')
})

const handleEdit = () => {
  // Logic for opening edit profile
}

const handleReturn = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}
</script>

<template>
  <div class="w-full px-5 py-6 space-y-6 flex flex-col items-stretch text-left ltr">
    <!-- Profile Header Card -->
    <Card class="border-none shadow-sm bg-gradient-to-b from-primary/5 to-background">
      <CardContent class="pt-8 pb-6">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-24 h-24 rounded-full p-1 bg-white shadow-md border border-primary/10">
              <img
                :src="userInfo.avatar"
                :alt="userInfo.name"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow-sm">
              <SafeIcon name="UserCheck" :size="14" color="white" />
            </div>
          </div>

          <div class="text-center space-y-1">
            <h2 class="text-xl font-bold text-foreground tracking-tight">{{ userInfo.name }}</h2>
            <div class="flex items-center justify-center">
              <Badge variant="secondary" class="bg-primary/10 text-primary border-none text-[10px] px-2 py-0">
                初级志愿者
              </Badge>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-0 w-full mt-6 divide-x divide-border border-t border-border/50 pt-6">
            <div class="flex flex-col items-center justify-center px-4">
              <span class="text-2xl font-bold text-primary">{{ userInfo.enrollmentCount }}</span>
              <span class="text-[11px] text-muted-foreground mt-1">参与活动</span>
            </div>
            <div class="flex flex-col items-center justify-center px-4">
              <span class="text-2xl font-bold text-primary">{{ userInfo.registrationDate.split('-')[0] }}</span>
              <span class="text-[11px] text-muted-foreground mt-1">注册年份</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Detailed Info List -->
    <div class="space-y-4">
      <!-- Contact Info Section -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
          <SafeIcon name="ShieldCheck" :size="14" class="text-primary" />
          账户信息
        </h3>
        <Card class="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <CardContent class="p-0 divide-y divide-border/50">
            <div class="flex items-center justify-between p-4 bg-white rounded-t-lg">
              <span class="text-sm text-muted-foreground">手机号码</span>
              <span class="text-sm font-medium tracking-wide">{{ userInfo.phone }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-white">
              <span class="text-sm text-muted-foreground">认证状态</span>
              <div class="flex items-center gap-1 text-success">
                <SafeIcon name="CheckCircle2" :size="14" />
                <span class="text-sm font-medium text-success">已实名</span>
              </div>
            </div>
            <div v-if="userInfo.idCard" class="flex items-center justify-between p-4 bg-white rounded-b-lg">
              <span class="text-sm text-muted-foreground">身份证号</span>
              <span class="text-sm font-medium tracking-widest text-foreground/80">
                {{ userInfo.idCard.slice(0, 6) }}****{{ userInfo.idCard.slice(-4) }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Profile Info Section -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
          <SafeIcon name="User" :size="14" class="text-primary" />
          基本资料
        </h3>
        <Card class="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <CardContent class="p-0 divide-y divide-border/50">
            <div class="flex items-center justify-between p-4 bg-white rounded-t-lg">
              <span class="text-sm text-muted-foreground">性别</span>
              <span class="text-sm font-medium">{{ userInfo.gender }}</span>
            </div>
            <div class="flex items-start justify-between p-4 bg-white">
              <span class="text-sm text-muted-foreground shrink-0 mt-0.5">联系地址</span>
              <span class="text-sm font-medium text-right max-w-[200px] break-words leading-relaxed text-foreground/80">
                {{ userInfo.address }}
              </span>
            </div>
            <div class="flex items-center justify-between p-4 bg-white rounded-b-lg">
              <span class="text-sm text-muted-foreground">注册时间</span>
              <span class="text-sm font-medium text-foreground/80">{{ userInfo.registrationDate }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-3 py-6">
      <Button 
        class="w-full h-12 text-sm font-bold shadow-sm shadow-primary/20"
        @click="handleEdit"
      >
        <SafeIcon name="UserPen" :size="16" class="mr-2" />
        编辑个人资料
      </Button>

      <div class="grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          class="h-11 text-xs border-border bg-white font-medium"
          @click="handleReturn"
        >
          <SafeIcon name="ChevronLeft" :size="14" class="mr-1" />
          返回上页
        </Button>

        <Button 
          variant="outline"
          class="h-11 text-xs border-border bg-white font-medium"
          as="a"
          href="./home.html"
        >
          <SafeIcon name="Home" :size="14" class="mr-1" />
          回到首页
        </Button>
      </div>
    </div>

    <!-- Security Information -->
    <div class="bg-muted/30 rounded-xl p-4 flex items-start gap-3 border border-border/50">
      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <SafeIcon name="Shield" :size="16" class="text-primary" />
      </div>
      <div class="space-y-1">
        <p class="text-[11px] font-bold text-foreground">账户安全提示</p>
        <p class="text-[10px] text-muted-foreground leading-relaxed">
          微光公益严格保护您的个人隐私和数据安全。您的身份证件信息仅用于活动保险投保。
        </p>
      </div>
    </div>
    
    <!-- Extra padding for tab bar -->
    <div class="h-12"></div>
  </div>
</template>

<style scoped>
.ltr {
  direction: ltr;
}
</style>
