/**
 * 活动相关接口
 * 当前实现：前端 Mock；对接后端时替换为 fetch/axios，保持本文件导出函数签名不变。
 */
import type { ActivityModel, ActivityCategory } from '@/data/activity'
import { MOCK_ACTIVITIES, ACTIVITY_CATEGORIES } from '@/data/activity'

/** 活动列表筛选（可选，用于后续分页/筛选扩展） */
export interface ActivityListParams {
  status?: ActivityModel['status']
  category?: string
  agencyId?: string
  page?: number
  pageSize?: number
}

/**
 * 获取活动列表
 * 约定：GET /api/activities 或 POST /api/activities/list，返回 ActivityModel[]
 */
export async function getActivities(params?: ActivityListParams): Promise<ActivityModel[]> {
  await _delay()
  let list = [...MOCK_ACTIVITIES]
  if (params?.status) list = list.filter((a) => a.status === params.status)
  if (params?.category) list = list.filter((a) => a.category === params.category)
  if (params?.agencyId) list = list.filter((a) => a.agencyId === params.agencyId)
  return list
}

/**
 * 根据 ID 获取单条活动
 * 约定：GET /api/activities/:id，返回 ActivityModel | null
 */
export async function getActivityById(id: string): Promise<ActivityModel | null> {
  await _delay()
  return MOCK_ACTIVITIES.find((a) => a.id === id) ?? null
}

/**
 * 获取活动分类列表（静态配置，一般不需后端接口）
 * 约定：GET /api/activities/categories，返回 ActivityCategory[]
 */
export async function getActivityCategories(): Promise<ActivityCategory[]> {
  await _delay()
  return [...ACTIVITY_CATEGORIES]
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}
