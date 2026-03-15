
export type ActivityStatus = 'draft' | 'pending' | 'rejected' | 'published' | 'closed' | 'full';

export interface ActivityCategory {
  id: string;
  name: string;
  iconName: string;
}

export interface ActivityModel {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  brief: string;
  content: string;
  status: ActivityStatus;
  category: string;
  agencyName: string;
  agencyId: string;
  coverImage: string;
  maxParticipants: number;
  currentParticipants: number;
  auditRemark?: string;
  budget?: number;
  materials?: string;
  contactPerson: string;
  contactPhone: string;
  createTime: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  { id: 'elderly', name: '助老服务', iconName: 'Heart' },
  { id: 'education', name: '助学兴教', iconName: 'GraduationCap' },
  { id: 'environment', name: '生态环保', iconName: 'Leaf' },
  { id: 'community', name: '社区服务', iconName: 'Home' },
  { id: 'medical', name: '医疗卫生', iconName: 'Stethoscope' },
];

export const MOCK_ACTIVITIES: ActivityModel[] = [
  {
    id: 'act-001',
    title: '青岛崂山“守护夕阳”老年人陪伴活动',
    startDate: '2026-04-10',
    endDate: '2026-04-10',
    location: '青岛市崂山区宁夏路社区',
    brief: '为辖区内孤寡老人提供居家清洁与心理疏导服务。',
    content: '通过组织志愿者进入社区，为行动不便的老人清理家庭卫生，并进行基础健康监测和谈心。',
    status: 'published',
    category: 'elderly',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/8fc74045-3ce2-4260-9322-f8ce54fc785b.png',
    maxParticipants: 20,
    currentParticipants: 12,
    contactPerson: '王老师',
    contactPhone: '13800001111',
    createTime: '2026-03-01',
  },
  {
    id: 'act-002',
    title: '暑期支教计划：点亮山区孩子的梦想',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    location: '山东省平度市大泽山镇',
    brief: '开展为期一个月的暑期兴趣课辅导，包含绘画、英语。',
    content: '本活动旨在填补偏远地区由于师资匮乏导致的暑期素质教育空白。',
    status: 'pending',
    category: 'education',
    agencyName: '益启航教育中心',
    agencyId: 'agency-2',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/fd2afae6-2c4f-4acb-ac51-261dcc8853ef.png',
    maxParticipants: 10,
    currentParticipants: 0,
    contactPerson: '李馆长',
    contactPhone: '13911112222',
    createTime: '2026-03-10',
  },
  {
    id: 'act-003',
    title: '金沙滩净滩行动：保护蔚蓝海岸线',
    startDate: '2026-03-20',
    endDate: '2026-03-20',
    location: '黄岛区金沙滩景区',
    brief: '清理海滩垃圾，向游客普及垃圾分类与环保知识。',
    content: '周末组织志愿者集体清理海边塑料垃圾，维护城市名片。',
    status: 'full',
    category: 'environment',
    agencyName: '海蓝环保社团',
    agencyId: 'agency-3',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/51b629c8-c03f-4974-abc2-720c0d872711.png',
    maxParticipants: 50,
    currentParticipants: 50,
    contactPerson: '赵队长',
    contactPhone: '13655556666',
    createTime: '2026-02-28',
  },
  {
    id: 'act-004',
    title: '社区垃圾分类宣传活动',
    startDate: '2026-03-25',
    endDate: '2026-03-25',
    location: '青岛市市南区文登路社区',
    brief: '向社区居民普及垃圾分类知识，提升环保意识。',
    content: '通过展板、讲座和互动游戏等形式，让居民了解垃圾分类的重要性。',
    status: 'rejected',
    category: 'community',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/1df6e81e-c9ae-4e6b-9953-f6cc911f73b3.png',
    maxParticipants: 30,
    currentParticipants: 0,
    auditRemark: '活动时间与其他活动冲突，建议调整至下周进行',
    contactPerson: '张主任',
    contactPhone: '13755557777',
    createTime: '2026-03-05',
  },
  {
    id: 'act-005',
    title: '春季植树造林活动',
    startDate: '2026-04-05',
    endDate: '2026-04-05',
    location: '青岛市城阳区绿色生态园',
    brief: '组织志愿者参与春季植树，美化城市环境。',
    content: '通过植树活动，提升志愿者的环保意识，为城市增添绿色。',
    status: 'closed',
    category: 'environment',
    agencyName: '微光志愿者联盟',
    agencyId: 'agency-1',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/12/63fbadef-a907-46af-a21f-03b47db46297.png',
    maxParticipants: 50,
    currentParticipants: 45,
    contactPerson: '李队长',
    contactPhone: '13666668888',
    createTime: '2026-02-20',
  }
];
      