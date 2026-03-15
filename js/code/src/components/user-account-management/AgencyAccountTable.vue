
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
import EditAgencyDialog from './EditAgencyDialog.vue'

interface Agency {
  id: string
  account: string
  name: string
  orgName: string
  email?: string
  phone?: string
  status: 'active' | 'disabled'
  createdAt: string
}

const isClient = ref(true)
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'disabled'>('all')
const showResetPasswordDialog = ref(false)
const showEditDialog = ref(false)
const selectedAgency = ref<Agency | null>(null)

// 模拟数据
const mockAgencies: Agency[] = [
  {
    id: 'agency-1',
    account: 'weiguang_org',
    name: '陈运营',
    orgName: '微光志愿者联盟',
    email: 'chen@weiguang.org',
    phone: '13800138000',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 'agency-2',
    account: 'qingdao_help',
    name: '李主任',
    orgName: '青岛助学基金会',
    email: 'li@qingdao-help.org',
    phone: '13900139000',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: 'agency-3',
    account: 'elderly_care',
    name: '王经理',
    orgName: '老年关爱中心',
    email: 'wang@elderly-care.org',
    phone: '13700137000',
    status: 'disabled',
    createdAt: '2024-01-10',
  },
  {
    id: 'agency-4',
    account: 'env_protect',
    name: '张协调',
    orgName: '环保志愿者协会',
    email: 'zhang@env-protect.org',
    phone: '13600136000',
    status: 'active',
    createdAt: '2024-03-05',
  },
]

const agencies = ref<Agency[]>(mockAgencies)

const filteredAgencies = computed(() => {
  return agencies.value.filter(agency => {
    const matchesSearch = 
      agency.account.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      agency.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      agency.orgName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = 
      statusFilter.value === 'all' || agency.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

onMounted(() => {
  isClient.value = false
  requestAnimationFrame(() => {
    isClient.value = true
  })
})

const handleResetPassword = (agency: Agency) => {
  selectedAgency.value = agency
  showResetPasswordDialog.value = true
}

const handleEdit = (agency: Agency) => {
  selectedAgency.value = agency
  showEditDialog.value = true
}

const handleToggleStatus = (agency: Agency) => {
  const index = agencies.value.findIndex(a => a.id === agency.id)
  if (index !== -1) {
    agencies.value[index].status = agency.status === 'active' ? 'disabled' : 'active'
  }
}

const handleDelete = (agency: Agency) => {
  agencies.value = agencies.value.filter(a => a.id !== agency.id)
}

const handleAgencyUpdated = (updatedAgency: Agency) => {
  const index = agencies.value.findIndex(a => a.id === updatedAgency.id)
  if (index !== -1) {
    agencies.value[index] = updatedAgency
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
          placeholder="搜索账号、姓名或机构名称..."
          class="w-full"
        />
      </div>
      <div class="flex gap-2">
        <Button
          v-for="status in ['all', 'active', 'disabled']"
          :key="status"
          :variant="statusFilter === status ? 'default' : 'outline'"
          @click="statusFilter = status as any"
          size="sm"
        >
          {{ status === 'all' ? '全部' : status === 'active' ? '活跃' : '禁用' }}
        </Button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/50">
            <TableHead>账号</TableHead>
            <TableHead>联系人</TableHead>
            <TableHead>机构名称</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="agency in filteredAgencies" :key="agency.id">
            <TableCell class="font-mono text-sm">{{ agency.account }}</TableCell>
            <TableCell>{{ agency.name }}</TableCell>
            <TableCell>{{ agency.orgName }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ agency.email }}</TableCell>
            <TableCell>
<Badge 
                :variant="agency.status === 'active' ? 'default' : 'secondary'"
                :class="agency.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : ''"
              >
                {{ agency.status === 'active' ? '活跃' : '已禁用' }}
              </Badge>
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ agency.createdAt }}</TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <SafeIcon name="MoreHorizontal" :size="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(agency)">
                    <SafeIcon name="Edit" :size="16" class="mr-2" />
                    编辑信息
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleResetPassword(agency)">
                    <SafeIcon name="RotateCcw" :size="16" class="mr-2" />
                    重置密码
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(agency)">
                    <SafeIcon 
                      :name="agency.status === 'active' ? 'Ban' : 'CheckCircle'" 
                      :size="16" 
                      class="mr-2" 
                    />
                    {{ agency.status === 'active' ? '禁用账号' : '启用账号' }}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    @click="handleDelete(agency)"
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
    <div v-if="filteredAgencies.length === 0" class="text-center py-12">
      <SafeIcon name="Users" :size="48" class="mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground">未找到符合条件的执行机构账号</p>
    </div>

    <!-- 统计信息 -->
    <div class="text-sm text-muted-foreground">
      共 {{ filteredAgencies.length }} 个账号
    </div>

    <!-- 重置密码对话框 -->
    <ResetPasswordDialog 
      v-if="selectedAgency"
      v-model:open="showResetPasswordDialog"
      :agency="selectedAgency"
      client:load
    />

    <!-- 编辑对话框 -->
    <EditAgencyDialog 
      v-if="selectedAgency"
      v-model:open="showEditDialog"
      :agency="selectedAgency"
      @updated="handleAgencyUpdated"
      client:load
    />
  </div>
</template>
