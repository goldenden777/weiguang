
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon.vue'
import AgencyAccountTable from './AgencyAccountTable.vue'
import AdminAccountTable from './AdminAccountTable.vue'
import CreateAgencyDialog from './CreateAgencyDialog.vue'
import CreateAdminDialog from './CreateAdminDialog.vue'

const isClient = ref(true)
const activeTab = ref('agency')
const showCreateAgencyDialog = ref(false)
const showCreateAdminDialog = ref(false)

onMounted(() => {
  isClient.value = false
  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
<div class="flex-1 bg-slate-50/50">
    <div class="px-6 lg:px-10 py-8">
      <Tabs v-model="activeTab" class="w-full">
        <div class="flex items-center justify-between mb-6">
          <TabsList class="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="agency">执行机构管理</TabsTrigger>
            <TabsTrigger value="admin">管理员管理</TabsTrigger>
          </TabsList>
          
          <Button 
            v-if="isClient || activeTab === 'agency'"
            @click="showCreateAgencyDialog = true"
            class="gap-2"
          >
            <SafeIcon name="Plus" :size="18" />
            <span class="hidden sm:inline">创建执行机构账号</span>
            <span class="sm:hidden">新建</span>
          </Button>
          
          <Button 
            v-if="isClient || activeTab === 'admin'"
            @click="showCreateAdminDialog = true"
            class="gap-2"
          >
            <SafeIcon name="Plus" :size="18" />
            <span class="hidden sm:inline">创建管理员账号</span>
            <span class="sm:hidden">新建</span>
          </Button>
        </div>

        <!-- 执行机构管理标签页 -->
        <TabsContent value="agency" class="space-y-4">
          <AgencyAccountTable client:load />
        </TabsContent>

        <!-- 管理员管理标签页 -->
        <TabsContent value="admin" class="space-y-4">
          <AdminAccountTable client:load />
        </TabsContent>
      </Tabs>
    </div>

    <!-- 创建执行机构对话框 -->
    <CreateAgencyDialog 
      v-model:open="showCreateAgencyDialog"
      client:load
    />

    <!-- 创建管理员对话框 -->
    <CreateAdminDialog 
      v-model:open="showCreateAdminDialog"
      client:load
    />
  </div>
</template>
