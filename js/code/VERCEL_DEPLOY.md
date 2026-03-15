# Vercel 部署说明

为避免出现 **NOT_FOUND (404)**，请在 Vercel 控制台完成以下配置：

## 必须设置：根目录 (Root Directory)

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard) → 选择本项目
2. 进入 **Settings** → **General**
3. 找到 **Root Directory**，设置为：**`js/code`**
4. 保存后**重新部署**一次

这样 Vercel 会在 `js/code` 下执行 `npm run build`，产出在 `js/code/dist`，与 `vercel.json` 中的 `outputDirectory: "dist"` 一致。

## 已完成的配置

- **vercel.json** 已配置：
  - `cleanUrls: true`：访问 `/page-2659759` 即可，无需写 `.html`
  - `rewrites`：中文页面名（如 `/已上架活动列表`、`/已上架活动列表.html`）会重写到对应的 Astro 路由（如 `/page-2659759`）

部署后，使用中文或英文 URL 均可正常访问。
