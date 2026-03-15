# 微光公益 - 线下活动系统

青岛微光慈善基金会公益活动发布、报名与管理的静态站点。支持门户浏览与报名、机构活动提报、管理员审核与配置等能力。

## 技术栈

- **Astro 5**：静态站点生成，多页面
- **Vue 3**：交互组件（表单、列表、弹窗等）
- **Tailwind CSS**：样式
- **TypeScript**：类型
- 其他：VeeValidate + Zod（表单校验）、Reka UI（组件库）、Pinia（可选）

构建输出为**静态 HTML/JS/CSS**，可直接部署到任意静态托管或 CDN。

---

## 环境要求

- **Node.js**：建议 18.x 或 20.x（LTS）
- **包管理**：npm / pnpm / yarn 均可

---

## 安装与运行

### 安装依赖

```bash
cd js/code
npm install
```

### 本地开发

```bash
npm run dev
```

启动后**必须**在浏览器中访问终端里显示的地址（如 `http://localhost:4321`），再点击进入首页等页面。

- 不要用「打开文件」方式直接打开 `dist/home.html`（`file://`），否则会出现 `GET http://vite/client`、`http://src/styles/global.css` 等 ERR_NAME_NOT_RESOLVED。
- 若使用代理或 hosts 将域名指向本机，请用 **`http://localhost:4321`** 访问开发环境，不要用其他域名（如 `http://vite/`），否则脚本/样式路径会解析错误。
- 修改代码会热更新。

### 构建

```bash
npm run build
```

产物在 `dist/` 目录，为静态文件（`.html`、`.js`、`.css` 等），可直接部署。

### 本地预览构建结果

```bash
npm run preview
```

用于在本地验证 `dist/` 的访问效果。

### 代码检查（ESLint）

项目已配置 **ESLint**（Astro + Vue + TypeScript），用于自动检查语法与常见缺陷（未使用变量、错误用法等）。首次使用前请先安装依赖（见上文）。

```bash
# 检查整个项目，报错会列出文件和行号
npm run lint

# 自动修复可修复的问题（如部分格式、未使用变量）
npm run lint:fix
```

在 VS Code / Cursor 中可安装 **ESLint** 扩展（`dbaeumer.vscode-eslint`），并开启「保存时自动修复」，即可在编辑时看到红线并自动修复部分问题。

---

## 常见问题（控制台报错）

- **GET http://localhost:4321/undefined 404**  
  已通过防护避免：首页轮播、活动卡片、新闻等处的图片/链接在数据为 `undefined` 或字符串 `"undefined"` 时会使用默认图或 `#`，不再发起 `/undefined` 请求。若仍出现，请检查是否有其他组件直接使用未校验的 `:src` / `:href`。

- **GET http://vite/client、http://src/styles/global.css、http://fs/... net::ERR_NAME_NOT_RESOLVED**  
  通常是因为用 **文件协议**（`file://`）打开了构建后的 `dist/*.html`，或通过非 dev 的域名访问。请务必使用 **`npm run dev`** 后通过终端显示的地址（如 `http://localhost:4321`）访问，不要直接双击打开 `home.html` 等文件。

- **Vue: Feature flags __VUE_OPTIONS_API__ ... are not explicitly defined**  
  项目已在 `astro.config.mjs` 的 `vite.define` 中注入这些标志。若在开发环境下仍看到该提示，多为 Vue esm-bundler 在 dev 时的已知表现，不影响功能。

- **Vue warn: Skipping lazy hydration for component 'undefined'**  
  已为首页用到的轮播等组件设置 `defineOptions({ name: '...' })`，以减少该警告。若在其他页面出现，可为对应 Vue 组件补充 `name`。

---

## 项目结构（简要）

```
js/code/
├── src/
│   ├── components/     # Vue 组件与 UI 组件
│   │   ├── auth/       # 登录守卫、登录页跳转
│   │   ├── common/     # 公共头尾、侧栏、空状态等
│   │   ├── home/       # 首页活动列表与筛选
│   │   ├── activity-detail/   # 活动详情与报名
│   │   ├── enrollment-query/ # 报名查询
│   │   ├── login/      # 登录表单
│   │   └── ui/        # 基础 UI 组件（Button、Card 等）
│   ├── data/          # 静态配置与 Mock 数据（类型与常量）
│   ├── layouts/       # Astro 布局（BaseLayout）
│   ├── lib/           # 工具与前端鉴权（auth.ts）
│   ├── pages/         # Astro 页面，对应路由 *.html
│   ├── services/      # 数据层：活动、报名、配置、归档、用户、登录等接口封装
│   └── styles/        # 全局样式（Tailwind + CSS 变量）
├── astro.config.mjs   # Astro 配置（Vue、Tailwind、静态输出）
├── package.json
└── API_CONTRACT.md    # 与后端对接的接口约定说明
```

- **页面入口**：`src/pages/*.astro` 对应构建后的 `*.html`（如 `home.astro` → `home.html`）。
- **数据与接口**：业务数据通过 `src/services/*.service.ts` 获取，当前为前端 Mock；类型与 Mock 数据在 `src/data/`。对接真实 API 时只需修改各 service 内部实现，并参考 `API_CONTRACT.md`。

---

## 主要页面与权限

| 路径 | 说明 | 权限 |
|------|------|------|
| `index.html` | 重定向到首页 | 无 |
| `home.html` | 门户首页（活动列表） | 访客 |
| `activity-detail.html?id=xxx` | 活动详情与报名 | 访客 |
| `enrollment-query.html` | 报名查询（手机号） | 访客 |
| `enrollment-success.html` | 报名成功页 | 访客 |
| `login.html` | 管理端 / 机构端登录 | 无（已登录会按角色跳转） |
| `admin-dashboard.html` 等 | 管理员工作台、活动审核、用户与系统配置等 | 需管理员登录 |
| `agency-dashboard.html` 等 | 机构工作台、活动提报、报名数据等 | 需机构登录 |

登录态保存在浏览器 `sessionStorage`（键 `currentUser`），关闭标签页后失效。

---

## 对接后端 API

1. 阅读 **`API_CONTRACT.md`**，按其中的路径、请求/响应格式实现接口。
2. 在项目中配置 API 根地址（如环境变量 `VITE_API_BASE` 或写死在 service 内）。
3. 在 `src/services/` 下对应文件中，将当前 Mock 实现替换为 `fetch` 或 `axios` 调用，保持**函数签名与返回值类型**不变，以便页面与组件无需大改。
4. 登录接口若返回 token，在登录成功后写入 sessionStorage，并在后续请求头中携带（如 `Authorization: Bearer <token>`）。

---

## 演示账号（当前 Mock）

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | `admin_root` | `admin123` |
| 执行机构 | `weiguang_org` | `agency123` |

---

## 许可证与说明

本项目为青岛微光慈善基金会线下活动系统前端，私有使用。如有问题可联系项目维护方。
