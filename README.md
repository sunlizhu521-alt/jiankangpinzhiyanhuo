# 健康品质验货

这是从“品质验货”项目提取的架构版本，保留前后端代码、数据库结构、页面组件、导入处理、测试和 GitHub Pages 预览能力，不包含源项目的业务数据库、上传文件、备份、真实供应商、企业印章或生产服务器运维工作流。

## 本地开发

```bash
npm ci
Copy-Item .env.example .env
npm run dev
```

前端由 Vite 启动，后端 API 默认端口为 `4002`。首次运行时，程序会在本地创建空的 `data/` 目录和 SQLite 数据库。

系统保留两个内置管理员。孙立柱是主管理员；胡远刚是第二管理员，拥有管理员角色和全部页面权限。密码只通过服务器环境变量设置：

```text
ADMIN_NAME=孙立柱
ADMIN_PASSWORD=请设置强密码
SECOND_ADMIN_NAME=胡远刚
SECOND_ADMIN_PASSWORD=请设置强密码
VITE_ADMIN_NAME=孙立柱
```

不要把真实密码、`.env`、数据库、上传件或备份提交到 Git。GitHub Pages 是纯静态预览，不能安全承载预设密码；两个管理员账号用于服务器模式。

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

仓库保留了手动触发的 Pages 工作流。首次使用前，请在仓库 `Settings → Pages` 中将 Source 设置为 `GitHub Actions`，然后在 Actions 页面手动运行 `Deploy GitHub Pages`：

https://sunlizhu521-alt.github.io/jiankangpinzhiyanhuo/

静态预览使用浏览器本地存储，不是多人共享的生产数据入口。
