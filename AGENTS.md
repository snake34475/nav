# AGENTS.md — nav

给 AI 编码代理的操作约定。改本仓库前先读完。

## 仓库定位

个人导航站「笑然导航」，Vite + TypeScript 静态站点，由
`.github/workflows/deploy.yml` 构建并发布到 GitHub Pages。
本地开发：`npm install` 后 `npm run dev`；校验：`npm run typecheck && npm test && npm run build`。

## 数据流（两层，务必区分）

### 1. 静态分类（编译期）
- 数据：`src/assets/data.json` → 经 `src/nav-data.ts` 转成 `navigation` 数组
- 修改/新增普通导航条目 → 改 data.json → push 触发 deploy.yml 重新构建
- schema：`[{ name, en_name?, icon, children: [{ name, en_name?, web: [{ title, desc, url, logo }] }] }]`

### 2. 「我的页面」分类（运行时动态）
- 实现：`src/remote-pages.ts`，在 `src/main.ts` 异步 boot 时 fetch 兄弟仓库
  **snake34475/my-pages** 根目录的 `nav.json`，组装成分类追加到静态数据末尾
- **收录/更新 my-pages 的功能页 → 不要改本仓库**，改 my-pages 仓库的 `nav.json` 即可，
  本站刷新即见，无需构建
- 修改内容源地址改 `remote-pages.ts` 里的 `REMOTE_MANIFEST_URL`
- 容错：5 秒超时；fetch 失败/清单为空时降级为一张指向 my-pages 目录页的兜底卡片，
  不阻塞首屏、不抛错

## 渲染要点（src/app.ts）

- `createNavPage(root, data)` 渲染整站：顶栏 + 侧边目录（随 data 生成）+ 分类区块 + 关于页
- `createLogo()` 处理三种 logo：`http(s)://` 外链图片 / emoji 文本（≤4 码点、不含点号斜杠）/
  项目内相对路径 `assets/...`（走 `assetUrl()` 加 BASE_URL 前缀，加载失败回退 fallback-logo.svg）
- 分类符号映射在 `categorySymbols`，未命中的分类显示 `•`
- 静态分类的结构测试在 `src/app.test.ts`，改 app.ts 后跑 `npm test`

## 与 my-pages 的协作边界

- 本仓库负责：导航站界面、静态收藏分类、远程清单的拉取与渲染逻辑
- my-pages 仓库负责：功能页内容与收录清单（nav.json）
- 收录数据出现两边都不对的情况时，以 my-pages 的 nav.json 为唯一真源
