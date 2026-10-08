/**
 * 远程「我的页面」分类：运行时从 my-pages 仓库拉取 nav.json 清单并注入导航。
 *
 * 数据源：my-pages 仓库根目录的 nav.json，数组结构：
 *   [{ "title": "...", "desc": "...", "url": "https://.../xxx.html", "logo": "emoji 或图片 URL" }]
 *
 * raw.githubusercontent.com 自带 Access-Control-Allow-Origin: *，可直接跨域 fetch。
 * 加载失败时降级为一张指向 my-pages 目录页的固定卡片，不影响站点其余部分。
 * my-pages 更新清单后，本站无需改代码、无需重新构建，刷新页面即可看到新条目。
 */
import type { NavCategory, NavLink } from './nav-data'

/** my-pages 清单地址（换成自定义域名时改这里即可） */
export const REMOTE_MANIFEST_URL =
  'https://raw.githubusercontent.com/snake34475/my-pages/main/nav.json'

/** my-pages 目录页地址（fetch 失败时的兜底入口） */
export const REMOTE_FALLBACK_URL = 'https://snake34475.github.io/my-pages/'

/** 清单中单条记录的结构（logo 可选，desc 可选） */
type RemoteLink = { title: string; desc?: string; url: string; logo?: string }

const toNavLink = (item: RemoteLink): NavLink => ({
  title: { zh: item.title },
  description: { zh: item.desc ?? '' },
  url: item.url.trim(),
  logo: item.logo ?? '📄',
})

const buildRemoteCategory = (links: RemoteLink[]): NavCategory => ({
  name: { zh: '我的页面' },
  icon: 'mypages',
  groups: [
    {
      name: { zh: '功能页' },
      links: links.map(toNavLink),
    },
  ],
})

/** fetch 失败 / 清单为空时的兜底分类 */
const fallbackCategory = (): NavCategory =>
  buildRemoteCategory([
    {
      title: 'my-pages 目录页',
      desc: 'HTML 页面集合总目录（远程清单加载失败，已降级）',
      url: REMOTE_FALLBACK_URL,
      logo: '🗂️',
    },
  ])

/**
 * 拉取远程清单并组装成 NavCategory。
 * 带超时保护（默认 5 秒），任何异常都降级为兜底分类，绝不阻塞首屏渲染。
 */
export const fetchRemoteCategory = async (timeoutMs = 5000): Promise<NavCategory> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    // 加时间戳参数绕开 raw CDN 的约 5 分钟缓存，保证更新即时可见
    const response = await fetch(`${REMOTE_MANIFEST_URL}?_=${Date.now()}`, {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = (await response.json()) as RemoteLink[]
    if (!Array.isArray(data) || data.length === 0) throw new Error('清单为空或格式不对')
    return buildRemoteCategory(data.filter((item) => item && item.title && item.url))
  } catch (error) {
    console.warn('[nav] 远程页面清单加载失败，已降级为目录页入口。', error)
    return fallbackCategory()
  } finally {
    clearTimeout(timer)
  }
}
