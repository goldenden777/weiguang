# 普通用户登录/注册功能归档

本目录保存了「普通用户」登录与注册相关代码，便于后续需要恢复该板块时快速添加。**机构用户/管理端登录不受影响**，仍使用 `src/pages/login.astro` 与 `src/components/login/LoginForm.vue`。

## 归档内容

| 归档文件 | 原路径（恢复时放回） |
|----------|----------------------|
| `pages/page-2651559.astro` | `src/pages/page-2651559.astro` |
| `components/page-2651559/PhoneRegisterForm.vue` | `src/components/page-2651559/PhoneRegisterForm.vue` |
| `data/auth.ts` | `src/data/auth.ts` |

## 恢复步骤

1. 将 `pages/page-2651559.astro` 复制到 `src/pages/`
2. 将 `components/page-2651559/PhoneRegisterForm.vue` 复制到 `src/components/page-2651559/`
3. 将 `data/auth.ts` 复制到 `src/data/`
4. 若需恢复「普通用户登录」入口：在 `CommonHeader.vue` 的访客区域，将「机构登录」改回「登录」，或增加「用户登录」按钮（`href="./login.html"` 或 `./page-2651559.html`）。机构/管理端登录逻辑（`login.astro`、`LoginForm.vue`、`auth.service.ts`、`lib/auth.ts`）未删除，仅页头按钮文案改为「机构登录」。
5. 若有入口链接到用户注册页（如底部导航「我的」改为注册），按需恢复

## 当前线上行为说明

- 门户页头仅保留「机构登录」按钮，指向 `login.html`，供机构/管理员使用。
- 用户注册页 `page-2651559.html` 及手机号注册组件已从工程中移除，本归档内保留完整代码。
