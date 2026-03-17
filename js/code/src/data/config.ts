
import { reactive, toRaw } from 'vue'

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'tel' | 'textarea';
  required: boolean;
  placeholder: string;
}

export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail?: string;
  contactAddress?: string;
  disclaimer: string;
  successMessage: string;
  enrollmentFields: FormFieldConfig[];
}

const STORAGE_KEY = 'wg:site-config:v1'

const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "青岛微光慈善基金会",
  logoUrl: "https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/6c1ebe9f-386a-4af7-a485-1aa7f93a6fd2.png",
  contactPhone: "0532-88888888",
  contactEmail: "contact@weiguang.org",
  contactAddress: "山东省青岛市崂山区海尔路1号",
  disclaimer: "本活动为公益性质，报名参与者需身体健康，并遵守现场安全指引。参与过程中请自行妥善保管财务，基金会不承担非组织方原因造成的人身及财产损失责任。",
  successMessage: "报名成功，工作人员将尽快联系您",
  enrollmentFields: [
    { id: 'userName', label: '姓名', type: 'text', required: true, placeholder: '请输入真实姓名' },
    { id: 'userPhone', label: '手机号', type: 'tel', required: true, placeholder: '请输入11位手机号码' },
    { id: 'idCard', label: '身份证号', type: 'text', required: false, placeholder: '用于购买活动保险（可选）' },
    { id: 'participantCount', label: '参与人数', type: 'number', required: true, placeholder: '请填写人数' },
    { id: 'remark', label: '备注', type: 'textarea', required: false, placeholder: '如有特殊需求请注明' },
  ]
}

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function loadPersisted(): Partial<SiteConfig> | null {
  if (!isClient()) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    return parsed as Partial<SiteConfig>
  } catch {
    return null
  }
}

function persist(config: SiteConfig) {
  if (!isClient()) return
  try {
    // reactive 对象直接 JSON.stringify 可能被序列化为空对象；先 toRaw 再拷贝保证可序列化
    const raw = toRaw(config) as SiteConfig
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...raw }))
  } catch {
    // ignore
  }
}

function mergeWithDefault(persisted: Partial<SiteConfig> | null): SiteConfig {
  const base: SiteConfig = { ...DEFAULT_SITE_CONFIG }
  if (!persisted) return base
  // 仅覆盖已存在字段，避免结构变化导致报错
  return {
    ...base,
    ...persisted,
    enrollmentFields: Array.isArray((persisted as any).enrollmentFields)
      ? ((persisted as any).enrollmentFields as FormFieldConfig[])
      : base.enrollmentFields,
  }
}

export const SITE_CONFIG: SiteConfig = reactive(mergeWithDefault(loadPersisted())) as SiteConfig

/** 更新并持久化站点配置（用于系统配置中心） */
export function updateSiteConfig(patch: Partial<SiteConfig>) {
  Object.assign(SITE_CONFIG as any, patch)
  persist(SITE_CONFIG)
}

/** 重置为默认并持久化 */
export function resetSiteConfig() {
  Object.assign(SITE_CONFIG as any, DEFAULT_SITE_CONFIG)
  persist(SITE_CONFIG)
}