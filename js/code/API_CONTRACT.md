# 接口约定说明

本文档描述前端「数据层」与后端的接口约定，便于后续对接真实 API。当前前端通过 `src/services/*.service.ts` 使用 Mock 数据，对接时仅需替换各 service 内部实现为 `fetch`/`axios`，保持导出函数签名与本文档一致即可。

---

## 通用约定

- **Base URL**：由环境变量或配置提供，如 `VITE_API_BASE=/api`。
- **请求体**：JSON，`Content-Type: application/json`。
- **响应体**：建议统一包装为 `{ code: number, data: T, message?: string }`，或列表为 `{ code, data: T[], total?: number }`。若后端不包装，前端可在 service 层做一层适配。
- **鉴权**：管理端/机构端接口在 Header 中携带 `Authorization: Bearer <token>`（登录接口返回 token 后由前端写入 sessionStorage/localStorage）。

---

## 1. 活动

### 1.1 获取活动列表

- **方法/路径**：`GET /api/activities` 或 `POST /api/activities/list`
- **Query/Body（可选）**：`status`, `category`, `agencyId`, `page`, `pageSize`
- **响应**：`ActivityModel[]`（见 `src/data/activity.ts` 中 `ActivityModel`）

### 1.2 获取单条活动

- **方法/路径**：`GET /api/activities/:id`
- **响应**：`ActivityModel | null`（404 或 null 表示不存在）

### 1.3 活动分类列表

- **方法/路径**：`GET /api/activities/categories`（可选，当前为前端静态配置）
- **响应**：`ActivityCategory[]`（见 `src/data/activity.ts`）

---

## 2. 报名

### 2.1 按手机号查询报名（门户用户自助查询）

- **方法/路径**：`GET /api/enrollments/query?phone=xxx` 或 `POST /api/enrollments/query` body: `{ phone, enrollmentId? }`
- **响应**：`EnrollmentModel[]`（见 `src/data/enrollment.ts`）

### 2.2 按活动获取报名列表（管理端/机构端）

- **方法/路径**：`GET /api/activities/:activityId/enrollments`
- **鉴权**：需要
- **响应**：`EnrollmentModel[]`

### 2.3 提交报名

- **方法/路径**：`POST /api/activities/:activityId/enrollments`
- **请求体**：`{ userName, userPhone, idCard?, participantCount, remark? }`
- **响应**：`{ enrollmentId: string, message?: string }`

### 2.4 更新报名状态（机构/管理员在「报名数据详情」中操作）

- **方法/路径**：`PATCH /api/enrollments/:enrollmentId/status` 或 `PUT /api/enrollments/:enrollmentId`
- **鉴权**：需要
- **请求体**：`{ status: 'confirmed' | 'canceled' }`（将待确认改为已确认或已取消）
- **响应**：`{ success: boolean, message?: string }` 或更新后的 `EnrollmentModel`

---

## 3. 站点配置

- **方法/路径**：`GET /api/config/site`
- **响应**：`SiteConfig`（见 `src/data/config.ts`），包含 siteName、logoUrl、contactPhone、enrollmentFields 等。

---

## 4. 往期归档

### 4.1 归档列表

- **方法/路径**：`GET /api/archives`
- **响应**：`ActivityArchiveModel[]`（见 `src/data/archive.ts`）

### 4.2 某活动的归档

- **方法/路径**：`GET /api/activities/:activityId/archive`
- **响应**：`ActivityArchiveModel | null`

---

## 5. 用户/机构（管理端）

### 5.1 执行机构列表

- **方法/路径**：`GET /api/users/agencies`
- **鉴权**：需要（管理员）
- **响应**：`UserModel[]`（见 `src/data/user.ts`，role=agency）

---

## 6. 鉴权

### 6.1 登录

- **方法/路径**：`POST /api/auth/login`
- **请求体**：`{ account: string, password: string }`
- **响应**：`{ token: string, user: { account, role, name } }` 或 `{ code, data: { token, user } }`
- **说明**：前端将 token 与 user 写入 sessionStorage/localStorage，后续请求在 Header 中携带 token。

---

## 类型定义位置

- 活动：`src/data/activity.ts`（ActivityModel, ActivityCategory, ActivityStatus）
- 报名：`src/data/enrollment.ts`（EnrollmentModel, EnrollmentStatus）
- 配置：`src/data/config.ts`（SiteConfig, FormFieldConfig）
- 归档：`src/data/archive.ts`（ActivityArchiveModel, ArchiveMedia）
- 用户：`src/data/user.ts`（UserModel, UserRole）
- 前端登录态：`src/lib/auth.ts`（CurrentUser）
- 内容管理：`src/data/content.ts`（BannerModel, NewsModel, FooterConfig, SiteBasicConfig）

后端可按上述类型字段实现接口，若有扩展字段可协商后在前端类型中补充。

---

## 7. 内容管理（管理端维护，鉴权：管理员）

### 7.1 首页 Banner

- **列表**：`GET /api/content/banners`  
  - 响应：`BannerModel[]`（见 `src/data/content.ts`）。门户可只取当前时间在 `startTime`～`endTime` 内且按 `sortOrder` 排序的条目。
- **单条**：`GET /api/content/banners/:id`  
  - 响应：`BannerModel | null`
- **新增**：`POST /api/content/banners`  
  - 请求体：`Omit<BannerModel, 'id' | 'createdAt' | 'updatedAt'>`
  - 响应：`{ id: string }` 或 `BannerModel`
- **更新**：`PUT /api/content/banners/:id`  
  - 请求体：`Partial<BannerModel>`
  - 响应：`BannerModel` 或 `{ success: boolean }`
- **删除**：`DELETE /api/content/banners/:id`  
  - 响应：`{ success: boolean }`

### 7.2 新闻动态

- **分页列表**：`GET /api/content/news?page=1&pageSize=10&category=&isTop=`  
  - 响应：`{ list: NewsModel[], total: number }`（见 `src/data/content.ts`）
- **单条**：`GET /api/content/news/:id`  
  - 响应：`NewsModel | null`
- **新增**：`POST /api/content/news`  
  - 请求体：`Omit<NewsModel, 'id' | 'createdAt' | 'updatedAt'>`
  - 响应：`{ id: string }` 或 `NewsModel`
- **更新**：`PUT /api/content/news/:id`  
  - 请求体：`Partial<NewsModel>`
  - 响应：`NewsModel` 或 `{ success: boolean }`
- **删除**：`DELETE /api/content/news/:id`  
  - 响应：`{ success: boolean }`

### 7.3 导航栏

- 暂不实现编辑接口；后台仅保留「导航栏」入口，展示「升级中」提示。后续可扩展 `GET/PUT /api/content/nav` 等。

### 7.4 页脚配置

- **获取**：`GET /api/content/footer`  
  - 响应：`FooterConfig`
- **保存**：`PUT /api/content/footer`  
  - 请求体：`FooterConfig`
  - 响应：`{ success: boolean }` 或 `FooterConfig`

### 7.5 站点基础信息

- **获取**：`GET /api/content/site-basic`  
  - 响应：`SiteBasicConfig`
- **保存**：`PUT /api/content/site-basic`  
  - 请求体：`SiteBasicConfig`
  - 响应：`{ success: boolean }` 或 `SiteBasicConfig`
