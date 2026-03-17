/**
 * 报名相关接口
 * 当前实现：Mock + localStorage 持久化（用于静态站/演示环境）。
 * 对接后端时替换为 fetch/axios，保持本文件导出函数签名不变。
 */
import type { EnrollmentModel } from '@/data/enrollment'
import { MOCK_ENROLLMENTS } from '@/data/enrollment'
import { MOCK_ACTIVITIES } from '@/data/activity'

/** 报名查询参数（门户用户自助查询） */
export interface EnrollmentQueryParams {
  phone: string
  enrollmentId?: string
}

/** 提交报名请求体 */
export interface SubmitEnrollmentParams {
  activityId: string
  userName: string
  userPhone: string
  idCard?: string
  participantCount: number
  remark?: string
}

/**
 * 按手机号（及可选报名编号）查询报名记录
 * 约定：GET /api/enrollments/query?phone=xxx&enrollmentId=xxx 或 POST /api/enrollments/query，返回 EnrollmentModel[]
 */
export async function queryEnrollmentsByPhone(
  phone: string,
  enrollmentId?: string
): Promise<EnrollmentModel[]> {
  await _delay()
  let list = _getAllEnrollments().filter((e) => e.userPhone === phone.trim())
  if (enrollmentId?.trim()) {
    const id = enrollmentId.trim().toUpperCase()
    list = list.filter((e) => e.id.toUpperCase().includes(id))
  }
  return list
}

/**
 * 按活动 ID 获取该活动的报名列表（管理端/机构端）
 * 约定：GET /api/activities/:activityId/enrollments，返回 EnrollmentModel[]
 */
export async function getEnrollmentsByActivityId(activityId: string): Promise<EnrollmentModel[]> {
  await _delay()
  return _getAllEnrollments().filter((e) => e.activityId === activityId)
}

/**
 * 提交报名
 * 约定：POST /api/activities/:activityId/enrollments，body: SubmitEnrollmentParams，返回 { enrollmentId, message }
 */
export async function submitEnrollment(
  activityId: string,
  params: SubmitEnrollmentParams
): Promise<{ enrollmentId: string; message?: string }> {
  await _delay(300)
  const id = `BM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const activity = MOCK_ACTIVITIES.find((a) => a.id === activityId)
  const model: EnrollmentModel = {
    id,
    activityId,
    activityTitle: activity?.title ?? params.activityId,
    userName: params.userName,
    userPhone: params.userPhone,
    idCard: params.idCard,
    participantCount: params.participantCount,
    remark: params.remark,
    status: 'pending',
    submitTime: _formatDateTime(new Date()),
  }

  const list = _getAllEnrollments()
  list.unshift(model)
  _savePersistedEnrollments(list)
  return { enrollmentId: id, message: '报名成功，工作人员将尽快联系您' }
}

/**
 * 更新报名状态（机构/管理员在报名数据详情页中「确认」或「取消」报名）
 * 约定：PATCH /api/enrollments/:enrollmentId/status，body: { status: 'confirmed' | 'canceled' }
 * 当前：Mock 仅返回成功，实际更新由调用方在前端先更新本地列表；对接后端后改为请求 API 并重新拉取列表。
 */
export async function updateEnrollmentStatus(
  _enrollmentId: string,
  status: 'confirmed' | 'canceled'
): Promise<{ success: boolean; message?: string }> {
  await _delay(200)
  const list = _getAllEnrollments()
  const idx = list.findIndex((e) => e.id === _enrollmentId)
  if (idx !== -1) {
    list[idx] = { ...list[idx], status }
    _savePersistedEnrollments(list)
  }
  return { success: true, message: status === 'confirmed' ? '已确认' : '已取消' }
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}

const STORAGE_KEY = 'wg:enrollments:v1'

function _getAllEnrollments(): EnrollmentModel[] {
  const persisted = _loadPersistedEnrollments()
  // 合并时以 id 去重，持久化优先（允许覆盖同 id 的 mock）
  const map = new Map<string, EnrollmentModel>()
  for (const e of [...persisted, ...MOCK_ENROLLMENTS]) map.set(e.id, e)
  // 按时间倒序（submitTime 是字符串，尽量把持久化的放前面）
  return Array.from(map.values()).sort((a, b) => String(b.submitTime).localeCompare(String(a.submitTime)))
}

function _loadPersistedEnrollments(): EnrollmentModel[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as EnrollmentModel[]
  } catch {
    return []
  }
}

function _savePersistedEnrollments(list: EnrollmentModel[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

function _formatDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
