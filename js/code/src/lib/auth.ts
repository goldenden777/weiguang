/**
 * 前端登录态：基于 sessionStorage，与 LoginForm 写入格式一致。
 * 用于权限守卫、退出登录、展示当前用户。
 */

export type UserRole = 'admin' | 'agency'

export interface CurrentUser {
  account: string
  role: UserRole
  name: string
}

const STORAGE_KEY = 'currentUser'

function isClient(): boolean {
  return typeof window !== 'undefined'
}

/** 从 sessionStorage 读取当前用户，未登录返回 null */
export function getCurrentUser(): CurrentUser | null {
  if (!isClient()) return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as CurrentUser
    if (!data?.account || !data?.role) return null
    return data
  } catch {
    return null
  }
}

/** 写入当前用户（登录成功时由 LoginForm 写 sessionStorage，此处仅用于兼容或测试） */
export function setCurrentUser(user: CurrentUser): void {
  if (!isClient()) return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

/** 清除登录态并跳转到登录页，可选带上 returnUrl */
export function logout(returnUrl?: string): void {
  if (!isClient()) return
  sessionStorage.removeItem(STORAGE_KEY)
  const base = './login.html'
  const url = returnUrl ? `${base}?redirect=${encodeURIComponent(returnUrl)}` : base
  window.location.href = url
}

/** 是否已登录 */
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}

/** 当前用户角色是否匹配（已登录且 role 一致） */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser()
  return user !== null && user.role === role
}

/** 登录页 URL，可带 redirect 参数 */
export function loginUrl(redirect?: string): string {
  const base = './login.html'
  if (redirect) return `${base}?redirect=${encodeURIComponent(redirect)}`
  return base
}
