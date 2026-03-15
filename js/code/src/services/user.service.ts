/**
 * 用户/机构相关接口（管理端）
 * 当前实现：前端 Mock；对接后端时替换为 fetch，保持本文件导出函数签名不变。
 */
import type { UserModel } from '@/data/user'
import { MOCK_AGENCIES } from '@/data/user'

/**
 * 获取执行机构列表（管理端用户管理用）
 * 约定：GET /api/users/agencies，返回 UserModel[]（role=agency）
 */
export async function getAgencies(): Promise<UserModel[]> {
  await _delay()
  return [...MOCK_AGENCIES]
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}
