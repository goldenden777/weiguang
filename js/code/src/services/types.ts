/**
 * 接口层通用类型约定
 * 与后端对接时，可统一采用以下结构；当前实现为前端 Mock，仅保证类型一致。
 */

/** 单条数据接口统一包装（可选，部分接口直接返回 T） */
export interface ApiResult<T> {
  code: number
  data: T
  message?: string
}

/** 列表接口统一包装（分页可选） */
export interface ListResult<T> {
  code: number
  data: T[]
  total?: number
  message?: string
}

/** 分页请求参数 */
export interface PageParams {
  page?: number
  pageSize?: number
}
