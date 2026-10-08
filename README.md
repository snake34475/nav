# nav

个人导航站「笑然导航」——常用网站，一处抵达。本地 · 轻量 · 无追踪。

**线上地址**：https://snake34475.github.io/nav/

## 技术栈

Vite + TypeScript 静态站点（无框架），由 GitHub Actions 自动构建发布到 GitHub Pages。

## 与 [my-pages](https://github.com/snake34475/my-pages) 的关系

本站导航数据分两层：

| 层 | 数据来源 | 更新方式 |
|---|---|---|
| 静态收藏分类 | 本仓库 `src/assets/data.json` | 改这里 → push → 自动构建 |
| 「我的页面」分类 | **my-pages 仓库**根目录的 `nav.json` | 在 my-pages 改清单并 push，本站刷新即见，**无需构建** |

即：收录自己做的功能页，去 [my-pages](https://github.com/snake34475/my-pages) 仓库维护 `nav.json`；本仓库只负责展示与拉取逻辑（见 `src/remote-pages.ts`）。

## 本地开发

```bash
npm install
npm run dev        # 开发热更新
npm run build      # 生产构建
npm run typecheck  # TypeScript 类型检查
npm test           # vitest 单元测试
```

## 目录速览

```
src/
  main.ts          # 入口：异步拉取远程清单 → 合并数据 → 渲染
  app.ts           # 整站 DOM 渲染（卡片、侧边目录、分类区块）
  nav-data.ts      # data.json → 类型化导航数据
  remote-pages.ts  # 运行时 fetch my-pages 的 nav.json（含超时与兜底）
  assets/data.json # 静态收藏分类数据
scripts/           # 数据加工/校验/图标下载辅助脚本
.github/workflows/deploy.yml  # push main 自动构建部署
```
