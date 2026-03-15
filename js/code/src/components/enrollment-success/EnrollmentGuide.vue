
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'

const guides = [
  {
    icon: 'Phone',
    title: '工作人员确认',
    description: '我们的工作人员会在 1-2 个工作日内通过您提供的电话号码与您联系，确认您的参与意愿和具体信息。'
  },
  {
    icon: 'CheckCircle',
    title: '确认参与',
    description: '确认后，您将收到活动的详细安排、集合地点、注意事项等信息。请妥善保管这些信息。'
  },
  {
    icon: 'Users',
    title: '按时参与',
    description: '请按照约定的时间和地点准时参加活动。如有特殊情况无法参加，请提前通知工作人员。'
  },
  {
    icon: 'Heart',
    title: '活动反馈',
    description: '活动结束后，我们会邀请您填写反馈问卷，您的意见对我们改进服务非常重要。'
  }
]

const precautions = [
  '请确保您提供的联系电话正确无误，以便我们及时与您沟通',
  '如需修改报名信息，请在工作人员确认前联系我们',
  '活动当天请提前 15 分钟到达集合地点',
  '请遵守活动纪律，配合工作人员的安排',
  '如有健康问题或特殊需求，请提前告知工作人员'
]
</script>

<template>
<div class="space-y-8 pb-10">
    <!-- Next Steps -->
    <div class="px-1">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-1 h-4 bg-secondary rounded-full"></div>
        <h3 class="font-bold text-base text-foreground">后续参与流程</h3>
      </div>
      
      <div class="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
        <div
          v-for="(guide, index) in guides"
          :key="index"
          class="relative flex gap-5 items-start"
        >
          <!-- Timeline Icon -->
          <div class="relative z-10 flex-shrink-0">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border/60 shadow-sm transition-all duration-300">
              <SafeIcon 
                :name="guide.icon" 
                :size="16" 
                class="text-muted-foreground" 
              />
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 pt-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[9px] uppercase font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                STEP 0{{ index + 1 }}
              </span>
              <h4 class="font-bold text-sm text-foreground">
                {{ guide.title }}
              </h4>
            </div>
            <p class="text-xs text-muted-foreground leading-[1.6] bg-muted/40 p-4 rounded-xl border border-border/30">
              {{ guide.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Important Notes -->
    <div class="bg-destructive/5 rounded-2xl p-5 border border-destructive/10">
      <div class="flex items-center gap-2 mb-4">
        <SafeIcon name="AlertCircle" :size="18" class="text-destructive" />
        <span class="font-bold text-sm text-destructive">特别注意事项</span>
      </div>
      <ul class="space-y-3">
        <li v-for="(precaution, index) in precautions" :key="index" class="grid grid-cols-[18px_1fr] gap-1 items-start text-xs text-muted-foreground leading-relaxed">
          <span class="text-destructive/60 font-black pt-[1px]">•</span>
          <span>{{ precaution }}</span>
        </li>
      </ul>
    </div>

    <!-- Contact Information -->
    <Card class="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle class="text-base flex items-center gap-2">
          <SafeIcon name="HelpCircle" :size="18" class="text-primary" />
          需要帮助？
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 text-sm">
        <div class="flex items-center gap-3">
          <SafeIcon name="Phone" :size="16" class="text-primary flex-shrink-0" />
          <div>
            <p class="text-muted-foreground">联系电话</p>
            <p class="font-medium">0532-12345678</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <SafeIcon name="Mail" :size="16" class="text-primary flex-shrink-0" />
          <div>
            <p class="text-muted-foreground">电子邮箱</p>
            <p class="font-medium">contact@weiguang.org</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <SafeIcon name="Clock" :size="16" class="text-primary flex-shrink-0" />
          <div>
            <p class="text-muted-foreground">工作时间</p>
            <p class="font-medium">周一至周五 09:00-18:00</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Disclaimer -->
    <Card class="border-border/50 bg-muted/30">
      <CardContent class="pt-6">
        <div class="flex gap-3">
          <SafeIcon name="Shield" :size="16" class="text-muted-foreground flex-shrink-0 mt-1" />
          <div class="text-xs text-muted-foreground leading-relaxed">
            <p class="font-medium text-foreground mb-2">免责声明</p>
            <p>
              参与本活动即表示您已阅读并同意《活动免责声明》。活动期间如发生意外，基金会将按照相关规定进行处理。请确保您身体状况适合参加此类活动。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
