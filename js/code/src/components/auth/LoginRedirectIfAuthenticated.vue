<script setup lang="ts">
import { onMounted } from 'vue'
import { getCurrentUser } from '@/lib/auth'

onMounted(() => {
  const user = getCurrentUser()
  if (!user) return
  const url = user.role === 'admin' ? './admin-dashboard.html' : './agency-dashboard.html'
  window.location.replace(url)
})
</script>

<template>
  <span class="sr-only" aria-hidden="true"></span>
</template>
