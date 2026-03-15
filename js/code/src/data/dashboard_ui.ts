
        
export interface NavItem {
  title: string;
  iconName: string;
  url: string;
  pageId: string;
}

export const ADMIN_NAV: NavItem[] = [
  { title: '控制台概览', iconName: 'LayoutDashboard', url: './admin-dashboard.html', pageId: 'admin_dashboard' },
  { title: '审核管理', iconName: 'ClipboardCheck', url: './activity-audit-list.html', pageId: 'activity_audit_list' },
  { title: '全量活动', iconName: 'Database', url: './admin-all-activities.html', pageId: 'admin_all_activities' },
  { title: '机构管理', iconName: 'Users', url: './user-account-management.html', pageId: 'user_account_management' },
  { title: '内容管理', iconName: 'FileText', url: './content-management.html', pageId: 'content_management' },
  { title: '系统配置', iconName: 'Settings', url: './system-config-center.html', pageId: 'system_config_center' },
];

export const AGENCY_NAV: NavItem[] = [
  { title: '工作台', iconName: 'LayoutDashboard', url: './agency-dashboard.html', pageId: 'agency_dashboard' },
  { title: '提报活动', iconName: 'PlusCircle', url: './activity-proposal-form.html', pageId: 'activity_proposal_form' },
  { title: '我的活动', iconName: 'ListTodo', url: './agency-activity-list.html', pageId: 'agency_activity_list' },
];

export const DASHBOARD_STATS_CARDS = [
  { label: '待审核活动', key: 'pending', iconName: 'Clock', color: 'text-orange-500' },
  { label: '正在报名', key: 'published', iconName: 'PlayCircle', color: 'text-green-500' },
  { label: '已完成活动', key: 'closed', iconName: 'CheckCircle2', color: 'text-blue-500' },
  { label: '驳回活动', key: 'rejected', iconName: 'AlertCircle', color: 'text-red-500' },
];
        
      