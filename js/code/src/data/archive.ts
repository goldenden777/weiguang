
export interface ArchiveMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface ActivityArchiveModel {
  id: string;
  activityId: string;
  summary: string; 
  totalImpact: string; 
  mediaList: ArchiveMedia[];
  publishDate: string;
}

export const MOCK_ARCHIVES: ActivityArchiveModel[] = [
  {
    id: 'arch-001',
    activityId: 'act-003',
    summary: '本次净滩行动圆满结束，志愿者们表现出了极高的参与热情，共采集塑料瓶200余个，渔网残骸50公斤。',
    totalImpact: '清理废弃物约120公斤，覆盖海岸线1.5公里。',
    mediaList: [
      { 
        type: 'image', 
        url: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/107cf35b-bcee-451a-9b3c-6303549f2282.png', 
        caption: '志愿者净滩现场' 
      },
      { 
        type: 'image', 
        url: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/e2227bd9-09b0-4fb3-af35-a0f6b517b077.png', 
        caption: '活动成果展示' 
      }
    ],
    publishDate: '2026-03-21'
  }
];
      