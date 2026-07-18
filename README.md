# 健康品质验货

这是从“品质验货”项目提取的纯架构版本，保留前后端代码、数据库结构、页面组件、导入处理、测试和 GitHub Pages 预览能力，不包含源项目的业务数据库、上传文件、备份、真实供应商、企业印章、个人管理员姓名或生产服务器运维工作流。

## 本地开发

```bash
npm ci
Copy-Item .env.example .env
npm run dev
```

前端由 Vite 启动，后端 API 默认端口为 `4002`。首次运行时，程序会在本地创建空的 `data/` 目录和 SQLite 数据库。

管理员名称和密码通过环境变量设置：

```text
ADMIN_NAME=系统管理员
ADMIN_PASSWORD=请设置强密码
VITE_ADMIN_NAME=系统管理员
```

不要把 `.env`、数据库、上传件或备份提交到 Git。

## 数据边界

以下目录被整体忽略，不属于架构仓库：

- `data/`：SQLite 数据库、旧版 JSON 数据、维度表和报告上传件
- `backups/`：本地备份
- `dist/`：构建产物

仓库内的测试仅使用“供应商A/B/C”等通用占位值。`public/assets/quality-seal.svg` 也是无企业信息的占位图，正式使用前应替换为经过授权的印章资源。

## 常用命令

```bash
npm run dev
npm test
npm run build
npm run backup
```

`npm run backup` 仅备份当前部署环境中的本地运行数据；本仓库不附带任何源项目备份。

## GitHub Pages

推送到 `main` 后，保留的 Pages 工作流会构建静态预览：

https://sunlizhu521-alt.github.io/jiankangpinzhiyanhuo/

静态预览使用浏览器本地存储，不是多人共享的生产数据入口。
