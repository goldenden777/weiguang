
        
export type UserRole = 'admin' | 'agency';

export interface UserModel {
  uid: string;
  account: string;
  name: string;
  role: UserRole;
  avatar?: string;
  orgName?: string; // 仅限执行机构
  orgDescription?: string;
  status: 'active' | 'disabled';
}

export const CURRENT_USER: UserModel = {
  uid: 'u-admin-01',
  account: 'admin_root',
  name: '超级管理员',
  role: 'admin',
  status: 'active'
};

export const MOCK_AGENCIES: UserModel[] = [
  {
    uid: 'agency-1',
    account: 'weiguang_org',
    name: '陈运营',
    role: 'agency',
    orgName: '微光志愿者联盟',
    orgDescription: '专注于青岛本地社区陪伴与扶贫互助的非营利组织。',
    status: 'active'
  }
];
        
      