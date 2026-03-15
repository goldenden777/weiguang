
<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbEntry {
  label: string
  href?: string
}

interface Props {
  title: string
  breadcrumbs?: BreadcrumbEntry[]
}

withDefaults(defineProps<Props>(), {
  breadcrumbs: () => []
})
</script>

<template>
  <div class="border-b border-border bg-background">
    <div class="container mx-auto px-4 py-6">
      <!-- Breadcrumbs -->
      <Breadcrumb v-if="breadcrumbs.length > 0" class="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem v-for="(item, index) in breadcrumbs" :key="index">
            <BreadcrumbLink v-if="item.href" :href="item.href">
              {{ item.label }}
            </BreadcrumbLink>
            <BreadcrumbPage v-else>
              {{ item.label }}
            </BreadcrumbPage>
            <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <!-- Title & Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-2xl lg:text-3xl font-bold">{{ title }}</h1>
        <div class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
