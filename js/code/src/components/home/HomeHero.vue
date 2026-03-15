<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { BannerModel } from '@/data/content'
import { getBanners } from '@/services/content.service'

const isClient = ref(true)
const banners = ref<BannerModel[]>([])

const effectiveBanners = computed(() => {
  const now = new Date().toISOString()
  return banners.value
    .filter((b) => b.startTime <= now && b.endTime >= now)
    .sort((a, b) => a.sortOrder - b.sortOrder)
})

const hasBanners = computed(() => effectiveBanners.value.length > 0)
const defaultTitle = '点亮微光，传递希望'
const defaultSubtitle = '发现身边的公益活动，用行动温暖这座城市。'

onMounted(async () => {
  isClient.value = false
  try {
    banners.value = await getBanners()
  } catch {
    // keep empty, fallback to static
  }
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

const scrollToActivities = () => {
  const element = document.querySelector('[data-activities-section]')
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

function isExploreLink(b: BannerModel) {
  return !b.linkUrl || b.linkUrl === '#' || b.linkUrl === './home.html' || b.linkUrl === ''
}
</script>

<template>
  <!-- 有后台配置的 Banner 时使用轮播 -->
  <section v-if="hasBanners" class="relative overflow-hidden pt-0 pb-0">
    <Carousel class="w-full" :opts="{ loop: true }">
      <CarouselContent class="-ml-0">
        <CarouselItem v-for="b in effectiveBanners" :key="b.id" class="pl-0">
          <div
            class="relative flex min-h-[280px] w-full bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${b.imageUrl})` }"
          >
            <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-900/40 z-0" />
            <div class="relative z-10 flex w-full flex-col justify-center px-6">
              <div class="space-y-3">
                <h1 class="text-2xl font-bold leading-tight text-white">
                  {{ b.title || defaultTitle }}
                </h1>
                <p class="max-w-[240px] text-xs leading-relaxed text-white/80">
                  {{ b.subtitle || defaultSubtitle }}
                </p>
              </div>
              <div class="mt-4 flex gap-3">
                <Button
                  v-if="isExploreLink(b)"
                  size="sm"
                  class="h-9 rounded-full px-4 text-xs font-semibold"
                  @click="scrollToActivities"
                >
                  {{ b.buttonText || '立即探索' }}
                </Button>
                <Button
                  v-else
                  size="sm"
                  class="h-9 rounded-full px-4 text-xs font-semibold"
                  as="a"
                  :href="b.linkUrl"
                >
                  {{ b.buttonText || '立即探索' }}
                </Button>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="left-2 border-0 bg-white/20 text-white hover:bg-white/30" />
      <CarouselNext class="right-2 border-0 bg-white/20 text-white hover:bg-white/30" />
    </Carousel>
    <div class="absolute bottom-0 left-0 right-0 z-20 h-4 rounded-t-[20px] bg-background" />
  </section>

  <!-- 无 Banner 时使用静态默认 Hero -->
  <section
    v-else
    class="relative overflow-hidden pt-0 pb-0 bg-cover bg-center bg-no-repeat"
    style="background-image: url('https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/356179cb-468f-4921-8105-fda73edb3c76.png')"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-900/40 z-0" />
    <div class="relative z-10 px-6">
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
              <SafeIcon name="Heart" :size="18" color="white" :stroke-width="2.5" />
            </div>
            <span class="text-base font-bold text-white">微光公益</span>
          </div>
          <h1 class="text-2xl font-bold leading-tight text-white">{{ defaultTitle }}</h1>
          <p class="max-w-[240px] text-xs leading-relaxed text-white/80">{{ defaultSubtitle }}</p>
        </div>
        <div class="flex gap-3">
          <Button size="sm" class="h-9 rounded-full px-4 text-xs font-semibold" @click="scrollToActivities">
            立即探索
          </Button>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0 z-20 h-4 rounded-t-[20px] bg-background" />
  </section>
</template>
