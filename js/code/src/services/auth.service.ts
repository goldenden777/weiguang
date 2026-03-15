/**
 * 登录/鉴权接口
 * 当前实现：前端 Mock 账号密码校验 + sessionStorage；对接后端时改为 POST /api/auth/login，返回 token + user。
 */
import type { CurrentUser } from '@/lib/auth'

export interface LoginParams {
  account: string
  password: string
}

export interface LoginResult {
  success: boolean
  user?: CurrentUser
  message?: string
}

const MOCK_USERS: Record<string, { password: string; role: CurrentUser['role']; name: string }> = {
  admin_root: { password: 'admin123', role: 'admin', name: '超级管理员' },
  weiguang_org: { password: 'agency123', role: 'agency', name: '陈运营' },
}

/**
 * 登录
 * 约定：POST /api/auth/login，body: { account, password }，返回 { token, user: { account, role, name } }
 * 当前：仅校验 Mock 账号密码，不返回 token，由调用方写入 sessionStorage 并跳转。
 */
export async function login(params: LoginParams): Promise<LoginResult> {
  await _delay(400)
  const user = MOCK_USERS[params.account.trim()]
  if (!user) return { success: false, message: '账号不存在' }
  if (user.password !== params.password) return { success: false, message: '密码错误' }
  return {
    success: true,
    user: {
      account: params.account.trim(),
      role: user.role,
      name: user.name,
    },
  }
}

function _delay(ms = 0): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve()
}
