
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon.vue'
import ResetPasswordDialog from './ResetPasswordDialog.vue'
import EditAdminDialog from './EditAdminDialog.vue'

interface Admin {
  id: string
  account: string
  name: string
  email?: string
  role: 'super_admin' | 'admin_audit' | 'admin_edit'
  status: 'active' | 'disabled'
  createdAt: string
}

const isClient = ref(true)
const searchQuery = ref('')
const roleFilter = ref<'all' | 'super_admin' | 'admin_audit' | 'admin_edit'>('all')
const showResetPasswordDialog = ref(false)
const showEditDialog = ref(false)
const selectedAdmin = ref<Admin | null>(null)

// 模拟数据
const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    account: 'admin_root',
    name: '超级管理员',
    email: 'root@weiguang.org',
    role: 'super_admin',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 'admin-2',
    account: 'admin_audit',
    name: '审核专员',
    email: 'audit@weiguang.org',
    role: 'admin_audit',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 'admin-3',
    account: 'admin_edit',
    name: '编辑专员',
    email: 'edit@weiguang.org',
    role: 'admin_edit',
    status: 'active',
    createdAt: '2024-02-01',
  },
]

const admins = ref<Admin[]>(mockAdmins)

const roleConfig = {
  super_admin: { label: '超级管理员', class: 'bg-destructive/10 text-destructive' },
  admin_audit: { label: '审核管理员', class: 'bg-primary/10 text-primary' },
  admin_edit: { label: '编辑管理员', class: 'bg-secondary/10 text-secondary' },
}

const filteredAdmins = computed(() => {
  return admins.value.filter(admin => {
    const matchesSearch = 
      admin.account.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      admin.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = 
      roleFilter.value === 'all' || admin.role === roleFilter.value
    
    return matchesSearch && matchesRole
  })
})

onMounted(() => {
  isClient.value = false
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

const handleResetPassword = (admin: Admin) => {
  selectedAdmin.value = admin
  showResetPasswordDialog.value = true
}

const handleEdit = (admin: Admin) => {
  selectedAdmin.value = admin
  showEditDialog.value = true
}

const handleToggleStatus = (admin: Admin) => {
  const index = admins.value.findIndex(a => a.id === admin.id)
  if (index !== -1) {
    admins.value[index].status = admin.status === 'active' ? 'disabled' : 'active'
  }
}

const handleDelete = (admin: Admin) => {
  admins.value = admins.value.filter(a => a.id !== admin.id)
}

const handleAdminUpdated = (updatedAdmin: Admin) => {
  const index = admins.value.findIndex(a => a.id === updatedAdmin.id)
  if (index !== -1) {
    admins.value[index] = updatedAdmin
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 搜索和筛选 -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          placeholder="搜索账号或姓名..."
          class="w-full"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <Button
          :variant="roleFilter === 'all' ? 'default' : 'outline'"
          @click="roleFilter = 'all'"
          size="sm"
        >
          全部
        </Button>
        <Button
          :variant="roleFilter === 'super_admin' ? 'default' : 'outline'"
          @click="roleFilter = 'super_admin'"
          size="sm"
        >
          超级管理员
        </Button>
        <Button
          :variant="roleFilter === 'admin_audit' ? 'default' : 'outline'"
          @click="roleFilter = 'admin_audit'"
          size="sm"
        >
          审核管理员
        </Button>
        <Button
          :variant="roleFilter === 'admin_edit' ? 'default' : 'outline'"
          @click="roleFilter = 'admin_edit'"
          size="sm"
        >
          编辑管理员
        </Button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/50">
            <TableHead>账号</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="admin in filteredAdmins" :key="admin.id">
            <TableCell class="font-mono text-sm">{{ admin.account }}</TableCell>
            <TableCell>{{ admin.name }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ admin.email }}</TableCell>
            <TableCell>
              <Badge 
                :class="roleConfig[admin.role].class"
                variant="outline"
              >
                {{ roleConfig[admin.role].label }}
              </Badge>
            </TableCell>
            <TableCell>
<Badge 
                :variant="admin.status === 'active' ? 'default' : 'secondary'"
                :class="admin.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : ''"
              >
                {{ admin.status === 'active' ? '活跃' : '已禁用' }}
              </Badge>
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ admin.createdAt }}</TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <SafeIcon name="MoreHorizontal" :size="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(admin)">
                    <SafeIcon name="Edit" :size="16" class="mr-2" />
                    编辑权限
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleResetPassword(admin)">
                    <SafeIcon name="RotateCcw" :size="16" class="mr-2" />
                    重置密码
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(admin)">
                    <SafeIcon 
                      :name="admin.status === 'active' ? 'Ban' : 'CheckCircle'" 
                      :size="16" 
                      class="mr-2" 
                    />
                    {{ admin.status === 'active' ? '禁用账号' : '启用账号' }}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    @click="handleDelete(admin)"
                    class="text-destructive focus:text-destructive"
                  >
                    <SafeIcon name="Trash2" :size="16" class="mr-2" />
                    删除账号
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredAdmins.length === 0" class="text-center py-12">
      <SafeIcon name="Users" :size="48" class="mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground">未找到符合条件的管理员账号</p>
    </div>

    <!-- 统计信息 -->
    <div class="text-sm text-muted-foreground">
      共 {{ filteredAdmins.length }} 个账号
    </div>

    <!-- 重置密码对话框 -->
    <ResetPasswordDialog 
      v-if="selectedAdmin"
      v-model:open="showResetPasswordDialog"
      :admin="selectedAdmin"
      client:load
    />

    <!-- 编辑对话框 -->
    <EditAdminDialog 
      v-if="selectedAdmin"
      v-model:open="showEditDialog"
      :admin="selectedAdmin"
      @updated="handleAdminUpdated"
      client:load
    />
  </div>
</template>
