<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { ActivityModel } from '@/data/activity'
import { getActivityById } from '@/services/activity.service'
import ActivityDetailHero from '@/components/activity-detail/ActivityDetailHero.vue'
import ActivityDetailContent from '@/components/activity-detail/ActivityDetailContent.vue'
import ActivityDetailSidebar from '@/components/activity-detail/ActivityDetailSidebar.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const urlId = ref<string | null>(null)
const activity = ref<ActivityModel | null>(null)
const loading = ref(false)

const notFound = computed(() => {
  if (loading.value) return false
  return urlId.value === null || activity.value === null
})

const showContent = computed(() => activity.value !== null)

onMounted(async () => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  urlId.value = id
  if (!id) return
  loading.value = true
  try {
    activity.value = await getActivityById(id)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="px-4 py-16 text-center text-muted-foreground text-sm">
    加载中…
  </div>
  <template v-else-if="notFound">
    <div class="px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
      <EmptyState
        type="activity-not-found"
        action-text="返回活动列表"
        action-href="./home.html"
      />
    </div>
  </template>
  <template v-else-if="showContent">
    <ActivityDetailHero :activity-id="activity!.id" />
    <div class="px-4 py-6 space-y-8">
      <ActivityDetailContent :activity-id="activity!.id" />
      <ActivityDetailSidebar :activity-id="activity!.id" />
    </div>
  </template>
</template>
