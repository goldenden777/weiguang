
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ActivityModel } from '@/data/activity'
import ActivityCard from '@/components/common/ActivityCard.vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface Props {
  activities: ActivityModel[]
  toActivityCard: (activity: ActivityModel) => any
}

const props = defineProps<Props>()
const api = ref<CarouselApi>()
const current = ref(0)
const count = ref(0)

const setApi = (val: CarouselApi) => {
  api.value = val
}

watch(api, (api) => {
  if (!api) return

  count.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap()

  api.on('select', () => {
    current.value = api.selectedScrollSnap()
  })
})

const scrollTo = (index: number) => {
  api.value?.scrollTo(index)
}
</script>

<template>
  <div class="relative w-full group">
    <Carousel
      @init-api="setApi"
      :opts="{
        align: 'start',
        loop: true,
      }"
      class="w-full"
    >
<CarouselContent class="-ml-3">
        <CarouselItem 
          v-for="activity in activities" 
          :key="activity.id"
          class="pl-3 basis-[85%]"
        >
          <div class="py-1">
            <ActivityCard
              :activity="toActivityCard(activity)"
              variant="grid"
              allow-favorite
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Custom Thin Progress Indicator for Mobile -->
    <div class="flex justify-start gap-1.5 mt-4 px-1">
      <div
        v-for="index in count"
        :key="index"
        @click="scrollTo(index - 1)"
        :class="cn(
          'h-1 rounded-full transition-all duration-300 cursor-pointer',
          current === index - 1 
            ? 'bg-primary w-6' 
            : 'bg-muted w-3'
        )"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transition for the active dot width */
button {
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
}
</style>
