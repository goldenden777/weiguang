/**
 * 往期活动归档接口
 * 当前实现：前端 Mock；对接后端时替换为 fetch，保持本文件导出函数签名不变。
 */
import type { ActivityArchiveModel } from '@/data/archive'
import { MOCK_ARCHIVES } from '@/data/archive'

/**
 * 获取归档列表
 * 约定：GET /api/archives，返回 ActivityArchiveModel[]
 */
export async function getArchives(): Promise<ActivityArchiveModel[]> {
  await _delay()
  return [...MOCK_ARCHIVES]
}

/**
 * 根据活动 ID 获取该活动的归档
 * 约定：GET /api/activities/:activityId/archive，返回 ActivityArchiveModel | null
 */
export async function getArchiveByActivityId(
  activityId: string
): Promise<ActivityArchiveModel | null> {
  await _delay()
  return MOCK_ARCHIVES.find((a) => a.activityId === activityId) ?? null
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}
