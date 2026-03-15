
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon.vue'
import type { ActivityModel } from '@/data/activity'

interface Props {
  activity: ActivityModel
  isClient: boolean
}

const props = defineProps<Props>()

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showStatusDialog = ref(false)
const newStatus = ref<'published' | 'closed'>('published')

const handleEdit = () => {
  // Navigate to edit page
  window.location.href = `./activity-detail-view.html?id=${props.activity.id}&mode=edit`
}

const handleViewEnrollments = () => {
  window.location.href = `./enrollment-data-detail.html?id=${props.activity.id}`
}

const handleAdvancedEdit = () => {
  window.location.href = `./activity-advanced-editor.html?id=${props.activity.id}`
}

const handleArchiveManager = () => {
  window.location.href = `./activity-past-archive-manager.html?id=${props.activity.id}`
}

const handleStatusChange = (status: 'published' | 'closed') => {
  newStatus.value = status
  showStatusDialog.value = true
}

const confirmStatusChange = () => {
  // API call would go here
  console.log(`Activity ${props.activity.id} status changed to ${newStatus.value}`)
  showStatusDialog.value = false
}

const handleDelete = () => {
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  // API call would go here
  console.log(`Activity ${props.activity.id} deleted`)
  showDeleteDialog.value = false
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        :disabled="!isClient"
class="group-hover:opacity-100 transition-opacity"
      >
        <SafeIcon name="Settings2" :size="16" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56 p-2">
      <DropdownMenuItem @click="handleViewEnrollments" class="cursor-pointer py-2">
        <SafeIcon name="Users" :size="16" class="mr-2 text-primary" />
        查看报名数据 (数据流)
      </DropdownMenuItem>

      <DropdownMenuItem @click="handleEdit" class="cursor-pointer py-2">
        <SafeIcon name="FileText" :size="16" class="mr-2 text-slate-500" />
        审核详情查看
      </DropdownMenuItem>

      <DropdownMenuItem @click="handleAdvancedEdit" class="cursor-pointer py-2">
        <SafeIcon name="ShieldAlert" :size="16" class="mr-2 text-amber-500" />
        高级内容管控
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem 
        v-if="activity.status === 'closed' || activity.status === 'full'"
        @click="handleArchiveManager" 
        class="cursor-pointer py-2"
      >
        <SafeIcon name="History" :size="16" class="mr-2 text-indigo-500" />
        归档往期回顾
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        v-if="activity.status !== 'published'"
        @click="handleStatusChange('published')"
        class="cursor-pointer py-2 font-medium text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
      >
        <SafeIcon name="PlayCircle" :size="16" class="mr-2" />
        恢复活动上架
      </DropdownMenuItem>

      <DropdownMenuItem
        v-if="activity.status === 'published'"
        @click="handleStatusChange('closed')"
        class="cursor-pointer py-2 font-medium text-amber-600 focus:bg-amber-50 focus:text-amber-700"
      >
        <SafeIcon name="PauseCircle" :size="16" class="mr-2" />
        紧急下架管控
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        @click="handleDelete"
        class="cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
      >
        <SafeIcon name="Trash2" :size="16" class="mr-2" />
        彻底删除活动
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Status Change Dialog -->
  <Dialog v-model:open="showStatusDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ newStatus === 'published' ? '上架活动' : '下架活动' }}
        </DialogTitle>
        <DialogDescription>
          {{ newStatus === 'published' ? '确认要上架此活动吗？上架后用户将能看到此活动。' : '确认要下架此活动吗？下架后用户将无法看到此活动。' }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="showStatusDialog = false">
          取消
        </Button>
        <Button @click="confirmStatusChange">
          确认
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete Dialog -->
  <Dialog v-model:open="showDeleteDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>删除活动</DialogTitle>
        <DialogDescription>
          确认要删除此活动吗？此操作无法撤销。
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="showDeleteDialog = false">
          取消
        </Button>
        <Button variant="destructive" @click="confirmDelete">
          删除
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
