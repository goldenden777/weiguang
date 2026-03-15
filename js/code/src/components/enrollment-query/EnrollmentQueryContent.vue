<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EnrollmentModel, EnrollmentStatus } from '@/data/enrollment'
import { queryEnrollmentsByPhone } from '@/services/enrollment.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const schema = toTypedSchema(
  z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的11位手机号'),
    enrollmentId: z.string().optional(),
  })
)

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { phone: '', enrollmentId: '' },
})

const [phone, phoneAttrs] = defineField('phone')
const [enrollmentId, enrollmentIdAttrs] = defineField('enrollmentId')

const hasSearched = ref(false)
const queryResult = ref<EnrollmentModel[]>([])
const queryError = ref('')

const statusMap: Record<EnrollmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: '待确认', variant: 'secondary' },
  confirmed: { label: '已确认', variant: 'default' },
  canceled: { label: '已取消', variant: 'destructive' },
}

const onSubmit = handleSubmit(async (values) => {
  queryError.value = ''
  try {
    const list = await queryEnrollmentsByPhone(
      values.phone.trim(),
      values.enrollmentId?.trim() || undefined
    )
    queryResult.value = list
    hasSearched.value = true
  } catch (e) {
    queryError.value = '查询失败，请稍后重试'
    hasSearched.value = true
    queryResult.value = []
  }
})

const isEmpty = computed(() => hasSearched.value && queryResult.value.length === 0)

const goToActivity = (activityId: string) => {
  window.location.href = `./activity-detail.html?id=${activityId}`
}
</script>

<template>
  <div class="space-y-8">
    <!-- 查询表单 -->
    <Card class="border-border/60 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg flex items-center gap-2">
          <SafeIcon name="Search" :size="20" class="text-primary" />
          查询我的报名
        </CardTitle>
        <p class="text-sm text-muted-foreground">
          请输入报名时填写的手机号，可选择性填写报名编号以精确查询。
        </p>
      </CardHeader>
      <CardContent class="space-y-4">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="phone">手机号</Label>
            <Input
              id="phone"
              v-model="phone"
              v-bind="phoneAttrs"
              type="tel"
              placeholder="请输入11位手机号"
              maxlength="11"
              class="max-w-xs"
            />
            <p v-if="errors.phone" class="text-sm text-destructive">{{ errors.phone }}</p>
          </div>
          <div class="space-y-2">
            <Label for="enrollmentId">报名编号（选填）</Label>
            <Input
              id="enrollmentId"
              v-model="enrollmentId"
              v-bind="enrollmentIdAttrs"
              type="text"
              placeholder="如 BM-20260312-001"
              class="max-w-xs font-mono"
            />
          </div>
          <Button type="submit" class="w-full sm:w-auto">
            <SafeIcon name="Search" :size="16" class="mr-2" />
            查询
          </Button>
        </form>
      </CardContent>
    </Card>

    <!-- 查询结果 -->
    <div v-if="hasSearched" class="space-y-4">
      <Alert v-if="queryError" variant="destructive">
        <AlertDescription>{{ queryError }}</AlertDescription>
      </Alert>
      <h2 class="text-lg font-semibold text-foreground">
        查询结果
        <span v-if="queryResult.length > 0" class="text-muted-foreground font-normal text-sm">
          共 {{ queryResult.length }} 条
        </span>
      </h2>

      <EmptyState
        v-if="isEmpty"
        type="no-results"
        action-text="返回活动列表"
        action-href="./home.html"
      />

      <div v-else class="space-y-4">
        <Card
          v-for="item in queryResult"
          :key="item.id"
          class="border-border/60 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          <CardContent class="p-0">
            <div class="p-4 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <code class="text-sm font-mono font-medium text-foreground">{{ item.id }}</code>
                <Badge :variant="statusMap[item.status].variant" class="shrink-0">
                  {{ statusMap[item.status].label }}
                </Badge>
              </div>
              <h3 class="font-semibold text-foreground leading-tight">
                {{ item.activityTitle }}
              </h3>
              <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span class="flex items-center gap-1">
                  <SafeIcon name="Calendar" :size="14" />
                  {{ item.submitTime }}
                </span>
                <span class="flex items-center gap-1">
                  <SafeIcon name="Users" :size="14" />
                  {{ item.participantCount }} 人
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="w-full sm:w-auto"
                @click="goToActivity(item.activityId)"
              >
                <SafeIcon name="ExternalLink" :size="14" class="mr-2" />
                查看活动详情
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
