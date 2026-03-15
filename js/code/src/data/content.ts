/**
 * 内容管理相关类型：首页 Banner、新闻动态、页脚配置、站点基础信息
 * 与 API_CONTRACT.md 中「7. 内容管理」约定一致
 */

/** 首页 Banner 单条 */
export interface BannerModel {
  id: string
  imageUrl: string
  linkUrl: string
  title: string
  subtitle: string
  buttonText: string
  startTime: string // ISO 8601，定时上线
  endTime: string   // ISO 8601，定时下线
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

/** 新闻分类（可扩展） */
export type NewsCategory = 'foundation' | 'activity' | 'partner' | 'other'

/** 新闻动态单条 */
export interface NewsModel {
  id: string
  title: string
  summary: string
  body: string       // 富文本 HTML
  coverImage: string
  publishTime: string // ISO 8601
  isTop: boolean
  source: string
  author: string
  category: NewsCategory
  createdAt?: string
  updatedAt?: string
}

/** 页脚配置 */
export interface FooterConfig {
  friendLinks: { name: string; href: string }[]
  icpNumber: string
  policeRecord?: string
  contactPhone: string
  contactEmail: string
  workHours?: string
  copyright?: string
  updatedAt?: string
}

/** 站点基础信息（内容管理中的「站点基础信息」，与系统配置可并存，门户优先读此） */
export interface SiteBasicConfig {
  siteName: string
  logoUrl: string
  contactPhone: string
  contactEmail?: string
  contactAddress?: string
  updatedAt?: string
}

/** 新闻分类展示文案 */
export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  foundation: '基金会动态',
  activity: '活动报道',
  partner: '合作方',
  other: '其他',
}

// ---------- Mock 数据（对接真实 API 后由 service 从接口获取） ----------

export const MOCK_BANNERS: BannerModel[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/356179cb-468f-4921-8105-fda73edb3c76.png',
    linkUrl: './home.html',
    title: '点亮微光，传递希望',
    subtitle: '发现身边的公益活动，用行动温暖这座城市。',
    buttonText: '立即探索',
    startTime: '2026-01-01T00:00:00.000Z',
    endTime: '2027-12-31T23:59:59.999Z',
    sortOrder: 0,
  },
]

export const MOCK_NEWS: NewsModel[] = [
  {
    id: 'news-1',
    title: '微光公益 2026 年第一季度活动回顾',
    summary: '本季度共开展助老、助学、环保等公益活动 20 余场，参与志愿者超过 500 人次。',
    body: '<p>本季度共开展助老、助学、环保等公益活动 20 余场，参与志愿者超过 500 人次。感谢各合作机构与志愿者的支持。</p>',
    coverImage: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/356179cb-468f-4921-8105-fda73edb3c76.png',
    publishTime: '2026-03-15T10:00:00.000Z',
    isTop: true,
    source: '微光公益',
    author: '基金会秘书处',
    category: 'foundation',
  },
  {
    id: 'news-2',
    title: '「守护夕阳」老年人陪伴活动顺利开展',
    summary: '青岛崂山片区老年人陪伴活动于 4 月 10 日举行，志愿者为老人提供居家清洁与心理疏导。',
    body: '<p>青岛崂山片区老年人陪伴活动于 4 月 10 日举行，志愿者为老人提供居家清洁与心理疏导。</p>',
    coverImage: '',
    publishTime: '2026-04-12T09:00:00.000Z',
    isTop: false,
    source: '微光公益',
    author: '活动组',
    category: 'activity',
  },
]

export const MOCK_FOOTER_CONFIG: FooterConfig = {
  friendLinks: [
    { name: '中国慈善联合会', href: 'https://www.charityalliance.org.cn' },
  ],
  icpNumber: '鲁ICP备12345678号',
  policeRecord: '鲁公网安备11010502030000号',
  contactPhone: '0532-12345678',
  contactEmail: 'contact@weiguang.org',
  workHours: '周一至周五 09:00-18:00',
  copyright: '青岛微光慈善基金会 版权所有',
}

export const MOCK_SITE_BASIC: SiteBasicConfig = {
  siteName: '青岛微光慈善基金会',
  logoUrl: 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/6c1ebe9f-386a-4af7-a485-1aa7f93a6fd2.png',
  contactPhone: '0532-88888888',
  contactEmail: 'contact@weiguang.org',
  contactAddress: '山东省青岛市崂山区海尔路1号',
}
