<script setup lang="ts">
import { onMounted } from 'vue'
import { getCurrentUser, loginUrl, logout, type UserRole } from '@/lib/auth'

const props = withDefaults(
  defineProps<{ requiredRole?: UserRole | string }>(),
  { requiredRole: undefined }
)

onMounted(() => {
  const user = getCurrentUser()
  const redirect = window.location.href

  if (!user) {
    window.location.href = loginUrl(redirect)
    return
  }

  if (props.requiredRole) {
    const allowed = props.requiredRole.includes(',')
      ? props.requiredRole.split(',').map((r) => r.trim())
      : [props.requiredRole]
    if (allowed.length && !allowed.includes(user.role)) {
      // 已登录但角色不符，清除登录态后跳转登录页以便用正确角色重登
      logout(redirect)
      return
    }
  }
})
</script>

<template>
  <!-- 仅做权限检查与跳转，不渲染内容 -->
  <span class="sr-only" aria-hidden="true"></span>
</template>
