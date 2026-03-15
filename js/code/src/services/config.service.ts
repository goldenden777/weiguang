/**
 * 站点配置接口
 * 当前实现：前端静态配置；对接后端时可为 GET /api/config/site，返回 SiteConfig。
 */
import type { SiteConfig } from '@/data/config'
import { SITE_CONFIG } from '@/data/config'

/**
 * 获取站点配置（名称、Logo、联系方式、报名字段等）
 * 约定：GET /api/config/site，返回 SiteConfig
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  await _delay()
  return { ...SITE_CONFIG }
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}
