# Vercel NOT_FOUND 错误：排查、修复与原理

本文档结合本仓库的 Vercel 部署场景，说明 NOT_FOUND（404）的**修复步骤**、**根因**、**概念**、**预警信号**和**替代方案**。

---

## 1. 建议的修复步骤（本仓库）

按下面顺序操作，通常即可消除 NOT_FOUND：

### 1.1 设置 Root Directory（最关键）

1. 打开 Vercel 控制台 → 选择本项目 → **Settings** → **General**。
2. 找到 **Root Directory**。
3. 填写：**`js/code`**（不要留空，不要填仓库根目录）。
4. 保存后，**重新部署**（Redeploy）一次。

这样 Vercel 会在 `js/code` 下执行 `npm install` / `npm run build`，并按照 `js/code/vercel.json` 使用 `dist` 作为输出目录。

### 1.2 确认构建与输出

1. **Deployments** → 选择最新一次部署 → 打开 **Building** 日志。
2. 确认：
   - 在 **Root Directory** 下执行了 `npm run build`（即 Astro 构建）。
   - 构建成功，且日志中能看到 `dist` 或类似输出目录被生成。
3. 若构建失败，先根据日志修构建错误（如依赖、Node 版本等），再重新部署。

### 1.3 确认访问路径

- 使用**无后缀**路径：`https://你的域名/home`、`https://你的域名/page-2659759`。
- 本仓库 `vercel.json` 中启用了 `cleanUrls: true`，访问 `/page-2659759` 会映射到 `page-2659759.html`。
- 若直接访问 `/home.html`，一般会被重定向到 `/home`，也应能打开。

### 1.4 无后端时的 404（接口 404）

若控制台出现对 `/api/content/news`、`/api/content/banners` 等接口的 404：

- 在 Vercel 的 **Environment Variables** 中增加：**`VITE_USE_MOCK=true`**（若项目使用该变量）。
- 或在 `js/code` 下参考 `.env.example` 配置本地/生产环境变量，使前端走 Mock 而不请求不存在的 API。

---

## 2. 根因说明：代码/配置实际做了什么 vs 应该做什么

### 2.1 实际发生了什么

- **期望**：用户访问 `https://xxx.vercel.app/home` 时，Vercel 能：
  1. 在正确目录（即包含 `package.json` 和 `vercel.json` 的目录）执行构建；
  2. 使用构建产物目录（本项目中为 `dist`）作为静态文件根目录；
  3. 根据 `cleanUrls` 把 `/home` 映射到 `home.html`，并返回该文件。

- **若 Root Directory 未设置或设错**（例如留空或指向仓库根）：
  1. Vercel 会在**仓库根目录**查找 `package.json` 并尝试构建。本仓库根目录没有 `package.json`（它在 `js/code` 下），构建可能失败或根本不会按预期执行。
  2. 即使某次构建跑在了别处，**输出目录**也会按“根目录”的理解来解析。`vercel.json` 在 `js/code` 下，若 Root 不是 `js/code`，Vercel 可能不会从 `js/code/dist` 提供静态文件。
  3. 结果：请求的路径在 Vercel 看来“没有对应文件”，于是返回 **NOT_FOUND**（HTTP 404）。

### 2.2 什么条件会触发 NOT_FOUND

- Root Directory ≠ `js/code`，导致构建/输出目录错误。
- 构建失败，没有生成 `dist` 或生成在了错误位置。
- `vercel.json` 不在“当前 Root Directory”下，导致 `outputDirectory` / `cleanUrls` 未生效。
- 访问的路径在 `dist` 中确实不存在（例如拼写错误或路由与文件名不一致）。

### 2.3 容易产生的误解

- 认为“把整个仓库连根目录推上去，Vercel 会自动找到前端项目”。  
  **事实**：Vercel 默认以仓库根为 Root； monorepo 或前端在子目录时，必须显式设置 **Root Directory**。
- 认为“有 `vercel.json` 就够了”。  
  **事实**：`vercel.json` 只有在 **Root Directory 所指目录**下才会被当作该项目的配置；放在子目录而 Root 在根目录时，可能不会被正确应用。

---

## 3. 概念：为什么会有 NOT_FOUND，以及正确心智模型

### 3.1 为什么存在 NOT_FOUND

- NOT_FOUND（404）是 HTTP 标准语义：“请求的 URL 在服务器上找不到对应资源”。
- Vercel 在静态/混合部署中会按“构建产物 + 路由/重写规则”查找文件；找不到时就返回 NOT_FOUND，避免把错误页面当正常内容返回。

### 3.2 正确心智模型

- **Root Directory**：Vercel 的“项目根”，所有与构建、输出、配置相关的路径都相对这个目录。
  - 构建命令在该目录执行；
  - `package.json`、`vercel.json` 应在该目录（或其预期位置）；
  - `outputDirectory` 等配置也是相对该目录。
- **输出目录**（如 `dist`）：构建产物所在目录；Vercel 从这里提供静态文件。
- **cleanUrls / rewrites**：把“友好 URL”（如 `/home`）映射到实际文件（如 `home.html`）或 SPA 的 `index.html`。

把“Root Directory → 构建 → 输出目录 → 路由/cleanUrls”想成一条链，任何一环错了，都可能变成 NOT_FOUND。

### 3.3 在框架/平台中的位置

- 在 Vercel 上：NOT_FOUND 属于**部署/路由**层，不是应用框架（如 Astro）内部的 404 页面。
- 框架可以自定义“应用内 404 页”（例如 Astro 的 404.astro），但若部署层就找不到静态文件，请求不会到达应用，只会得到 Vercel 的 NOT_FOUND。

---

## 4. 预警信号与类似坑

### 4.1 以后要注意的点

- **Monorepo 或前端在子目录**：一部署就 404 或构建报错，首先检查 **Root Directory** 是否指向含 `package.json` 和构建脚本的那一层（本仓库为 `js/code`）。
- **改过仓库结构**：若把前端从根目录移到子目录，记得在 Vercel 里改 Root Directory 并重新部署。
- **构建日志里没有 `dist` 或没有 `npm run build`**：说明构建未在正确目录执行或未成功，后续必然容易 NOT_FOUND。

### 4.2 类似场景

- 用 Netlify 部署子目录项目：需在 Netlify 中设置 **Base directory**（或 Publish directory），概念类似 Vercel 的 Root Directory。
- 用 GitHub Pages + 静态生成：若站点在子目录或使用 `docs/`，需正确设置 **Source** 和输出目录，否则也会 404。

### 4.3 代码/配置中的“味道”

- 仓库根目录没有 `package.json`，但部署时没有配置“根目录”为子目录。
- `vercel.json` 里写了 `outputDirectory: "dist"`，但构建日志显示构建跑在别的目录或没有生成 `dist`。
- 文档里写了“必须在 Settings 里设置 Root Directory”，但实际未设置——说明容易忽略这一步。

---

## 5. 替代方案与取舍

### 5.1 保持当前结构，只改 Vercel 配置（推荐）

- **做法**：Root Directory 设为 `js/code`，其余不变。
- **优点**：改一处配置即可，与现有 `vercel.json`、Astro 构建完全一致。
- **缺点**：无。

### 5.2 把构建产物提到仓库根（不推荐）

- **做法**：在 CI 或本地先把 `js/code` 的 `dist` 构建出来，再复制到仓库根，用仓库根做 Vercel 项目并设置 `outputDirectory` 指向该处。
- **优点**：Vercel 的 Root 可以是根目录。
- **缺点**：需要额外脚本、容易和源码不同步、不利于“从源码一键部署”，维护成本高。

### 5.3 使用 Vercel 的 Monorepo 支持

- **做法**：若仓库是 monorepo（多应用），在 Vercel 中为每个应用建一个项目，分别设置 Root Directory（如 `js/code`、`other-app`）。
- **优点**：一个仓库多项目，各自独立部署。
- **缺点**：需要为每个子项目在 Vercel 里单独配置。

### 5.4 若希望“根路径即项目”

- **做法**：把 `js/code` 的内容移动到仓库根（或把仓库根变成只有 `js/code` 内容），这样 Root Directory 可以留空。
- **优点**：符合“根即前端”的直觉。
- **缺点**：要调整仓库结构，可能影响其他协作或脚本。

---

## 6. 小结

| 项目 | 说明 |
|------|------|
| **立即修复** | Vercel → Settings → General → **Root Directory** = **`js/code`**，保存后重新部署。 |
| **根因** | Root 未设为 `js/code`，导致构建/输出目录错误，Vercel 无法从正确位置提供静态文件。 |
| **心智模型** | Root Directory → 构建 → outputDirectory → cleanUrls/rewrites，缺一不可。 |
| **预警** | 前端在子目录时，首先检查 Root Directory；构建日志要看到在正确目录执行并生成 `dist`。 |
| **推荐** | 保持当前仓库结构，仅配置 Vercel Root Directory 为 `js/code`。 |

按上述步骤操作后，若仍有 NOT_FOUND，可再检查：该次部署的 Building 日志、`dist` 是否包含目标 `.html` 文件、访问的 URL 是否与 `cleanUrls` 映射一致（如 `/home`、`/page-2659759`）。
