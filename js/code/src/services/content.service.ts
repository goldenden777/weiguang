/**
 * 内容管理接口：Banner、新闻、页脚、站点基础信息
 * 约定见 API_CONTRACT.md 第 7 节。对接真实后端时替换为 fetch，未对接时使用 Mock。
 */
import type {
  BannerModel,
  NewsModel,
  FooterConfig,
  SiteBasicConfig,
  NewsCategory,
} from '@/data/content'
import {
  MOCK_BANNERS,
  MOCK_NEWS,
  MOCK_FOOTER_CONFIG,
  MOCK_SITE_BASIC,
} from '@/data/content'

const API_BASE = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE != null
  ? String((import.meta as any).env.VITE_API_BASE)
  : '/api'

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = sessionStorage.getItem('token') ?? sessionStorage.getItem('authToken')
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ data?: T; ok: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) return { ok: false }
    const data = (await res.json()) as T | { code?: number; data?: T }
    const unwrapped = data && typeof data === 'object' && 'data' in data ? (data as { data: T }).data : data
    return { data: unwrapped as T, ok: true }
  } catch {
    return { ok: false }
  }
}

// ---------- Banner ----------

export async function getBanners(): Promise<BannerModel[]> {
  const { ok, data } = await request<BannerModel[]>('GET', '/content/banners')
  if (ok && Array.isArray(data)) return data
  return [...MOCK_BANNERS]
}

export async function getBannerById(id: string): Promise<BannerModel | null> {
  const { ok, data } = await request<BannerModel>('GET', `/content/banners/${encodeURIComponent(id)}`)
  if (ok && data) return data
  return MOCK_BANNERS.find((b) => b.id === id) ?? null
}

export async function createBanner(
  payload: Omit<BannerModel, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string }> {
  const { ok, data } = await request<{ id: string }>('POST', '/content/banners', payload)
  if (ok && data?.id) return { id: data.id }
  return { id: `banner-${Date.now()}` }
}

export async function updateBanner(id: string, payload: Partial<BannerModel>): Promise<boolean> {
  const { ok } = await request('PUT', `/content/banners/${encodeURIComponent(id)}`, payload)
  return ok
}

export async function deleteBanner(id: string): Promise<boolean> {
  const { ok } = await request('DELETE', `/content/banners/${encodeURIComponent(id)}`)
  return ok
}

// ---------- News ----------

export interface NewsListParams {
  page?: number
  pageSize?: number
  category?: NewsCategory
  isTop?: boolean
}

export interface NewsListResult {
  list: NewsModel[]
  total: number
}

export async function getNewsList(params?: NewsListParams): Promise<NewsListResult> {
  const page = params?.page ?? 1
  const pageSize = params?.pageSize ?? 10
  const q = new URLSearchParams()
  q.set('page', String(page))
  q.set('pageSize', String(pageSize))
  if (params?.category) q.set('category', params.category)
  if (params?.isTop !== undefined) q.set('isTop', String(params.isTop))
  const { ok, data } = await request<NewsListResult>(`GET`, `/content/news?${q.toString()}`)
  if (ok && data && Array.isArray(data.list)) return data
  const list = [...MOCK_NEWS]
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  }
}

export async function getNewsById(id: string): Promise<NewsModel | null> {
  const { ok, data } = await request<NewsModel>('GET', `/content/news/${encodeURIComponent(id)}`)
  if (ok && data) return data
  return MOCK_NEWS.find((n) => n.id === id) ?? null
}

export async function createNews(
  payload: Omit<NewsModel, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string }> {
  const { ok, data } = await request<{ id: string }>('POST', '/content/news', payload)
  if (ok && data?.id) return { id: data.id }
  return { id: `news-${Date.now()}` }
}

export async function updateNews(id: string, payload: Partial<NewsModel>): Promise<boolean> {
  const { ok } = await request('PUT', `/content/news/${encodeURIComponent(id)}`, payload)
  return ok
}

export async function deleteNews(id: string): Promise<boolean> {
  const { ok } = await request('DELETE', `/content/news/${encodeURIComponent(id)}`)
  return ok
}

// ---------- Footer ----------

export async function getFooterConfig(): Promise<FooterConfig> {
  const { ok, data } = await request<FooterConfig>('GET', '/content/footer')
  if (ok && data) return data
  return { ...MOCK_FOOTER_CONFIG }
}

export async function saveFooterConfig(payload: FooterConfig): Promise<boolean> {
  const { ok } = await request('PUT', '/content/footer', payload)
  return ok
}

// ---------- Site Basic ----------

export async function getSiteBasicConfig(): Promise<SiteBasicConfig> {
  const { ok, data } = await request<SiteBasicConfig>('GET', '/content/site-basic')
  if (ok && data) return data
  return { ...MOCK_SITE_BASIC }
}

export async function saveSiteBasicConfig(payload: SiteBasicConfig): Promise<boolean> {
  const { ok } = await request('PUT', '/content/site-basic', payload)
  return ok
}
