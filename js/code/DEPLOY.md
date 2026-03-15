# 线下活动系统 - 云端部署说明

本系统为 **静态站点**（Astro 构建），部署时只需将构建产物放到任意静态 Web 服务器或对象存储即可。

---

## 一、在本地打包

在项目根目录（即包含 `package.json` 的 `js/code` 目录）执行：

```bash
# 1. 安装依赖（若尚未安装）
npm install

# 2. 执行构建（生产环境）
npm run build
```

构建成功后，会在当前目录下生成 **`dist`** 文件夹，其中即为可部署的静态文件。

- 入口页：`dist/home.html`（门户首页）
- 所有页面均为独立 `.html` 文件，资源使用相对路径（`./`），适合任意目录或子路径部署。

---

## 二、打包结果说明

| 内容       | 说明 |
|------------|------|
| `dist/*.html` | 各页面入口（如 `home.html`、`activity-detail.html`、`login.html`、`admin-dashboard.html` 等） |
| `dist/*.js`   | 前端脚本（带 hash，按需加载） |
| `dist/*.css`  | 样式文件（若有） |
| `dist/_astro/` | Astro 构建的静态资源目录 |

**无需**将 `node_modules`、`src`、`astro.config.mjs` 等源码上传服务器，**只需上传 `dist` 目录下的全部内容**。

---

## 三、云端部署方式

### 方式 A：使用 Nginx（推荐）

1. 将 `dist` 目录内**所有文件**上传到服务器，例如放到 `/var/www/activity-system`。
2. Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;   # 改为你的域名或 IP

    root /var/www/activity-system;
    index home.html;              # 可选：默认首页

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # 若部署在子路径，例如 https://your-domain.com/activity/
    # root 改为 /var/www/html;
    # location /activity/ { alias /var/www/activity-system/; }
}
```

3. 重载 Nginx：`sudo nginx -s reload`。

访问：`http://your-domain.com/home.html` 或配置 `index home.html` 后访问根路径。

---

### 方式 B：使用 Apache

1. 将 `dist` 内所有文件上传到站点目录（如 `htdocs` 或 VirtualHost 的 DocumentRoot）。
2. 确保启用 `mod_rewrite`，并允许 `.htaccess`（若使用）。根目录可放：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>
```

这样访问 `/activity-detail` 时可解析到 `activity-detail.html`。

---

### 方式 C：对象存储 + CDN（如阿里云 OSS、腾讯云 COS）

1. 将 `dist` 目录内所有文件上传到 Bucket，保持相对路径结构。
2. 将 Bucket 配置为**静态网站托管**，默认首页设为 `home.html`（或你希望的入口）。
3. 绑定自定义域名并开启 CDN（可选），可提升访问速度。

---

### 方式 D：Docker 静态服务（可选）

若希望用 Docker 跑一个简单 HTTP 服务，可在 `js/code` 同级目录建 `Dockerfile`：

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY dist/ /app/
EXPOSE 3000
CMD ["serve", "-s", "/app", "-l", "3000"]
```

构建前请在本地先执行 `npm run build`，并将 `dist` 复制到 Docker 构建上下文。运行后访问 `http://服务器IP:3000/home.html`。

---

## 四、重要说明

1. **当前为纯前端静态站点**  
   登录、活动/报名等数据来自前端 Mock。对接真实后端时，需修改 `src/services/` 下对应接口为真实 API 地址（可配合环境变量区分开发/生产）。

2. **链接与路径**  
   站内链接均为相对路径（如 `./home.html`、`./login.html`），可部署在任意域名或子路径；若部署在子路径（如 `/activity/`），需在构建或 Nginx 中做 base 配置，或使用与当前相同的相对路径。

3. **本地预览构建结果**  
   打包完成后可在本机执行：  
   `npm run preview`  
   会启动本地静态服务，用于检查 `dist` 是否正常。

---

## 五、快速检查清单

- [ ] 在 `js/code` 目录执行 `npm install` 和 `npm run build`
- [ ] 确认生成 `dist` 目录且内含若干 `.html` 与资源文件
- [ ] 将 `dist` 内全部内容上传到服务器或对象存储
- [ ] Web 服务器或静态托管已配置默认首页（如 `home.html`）或正确解析 `.html` 路径
- [ ] 浏览器访问 `http://你的域名或IP/home.html` 能正常打开门户首页

完成以上步骤即可在云端正常使用本系统。
