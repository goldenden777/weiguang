# Git 初始化与账号配置说明

请在**本机**打开终端（PowerShell 或 CMD），进入本项目根目录后按顺序执行以下命令。

---

## 一、进入项目目录

```powershell
cd "d:\基金会\线下活动系统"
```

如你的项目不在该路径，请改成你的实际路径。

---

## 二、初始化 Git（若尚未初始化）

若之前未初始化，或曾初始化失败，可先删除旧的 `.git` 再初始化（**慎用**，会丢失已有 Git 历史）：

```powershell
# 仅当需要重新初始化时执行（会清空已有 Git 历史）
# Remove-Item -Recurse -Force .git
git init
```

若已经是 Git 仓库，直接做第三步即可。

---

## 三、设置你的 Git 用户名和邮箱

**仅对本仓库生效（推荐）** — 已按你的信息写好，直接执行即可：

```powershell
git config user.name "goldenden777"
git config user.email "goldenden@126.com"
```

**对当前电脑上所有仓库生效**（可选）：

```powershell
git config --global user.name "goldenden777"
git config --global user.email "goldenden@126.com"
```

---

## 四、检查是否配置成功

```powershell
git config user.name
git config user.email
```

终端会分别输出你设置的名字和邮箱。

---

## 五、可选：添加 .gitignore 后再做首次提交

若希望忽略 `node_modules`、构建产物等，可先添加 `.gitignore`，再提交：

```powershell
# 查看状态
git status

# 添加所有文件到暂存区（.gitignore 会生效）
git add .

# 首次提交
git commit -m "初始提交：线下活动系统"
```

完成以上步骤后，Git 初始化与账号配置即完成。
