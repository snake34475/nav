import type { NavCategory, NavGroup, NavLink } from './nav-data'
import { navigation } from './nav-data'

const fallbackLogo = 'fallback-logo.svg'
const categorySymbols: Record<string, string> = {
  ai: '✦',
  常用网站: '◉',
  其他站点: '◇',
  娱乐: '◌',
  开发者工具: '⌘',
  博主网站: '⌂',
}

export const slugify = (value: string): string =>
  value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')

export const assetUrl = (asset: string): string => `${import.meta.env.BASE_URL}${asset.replace(/^\//, '')}`

const element = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

const groupId = (category: NavCategory, group: NavGroup) => slugify(`${category.name.zh}-${group.name.zh}`)

const createLinkCard = (link: NavLink): HTMLAnchorElement => {
  const card = element('a', 'site-card')
  card.href = link.url
  card.target = '_blank'
  card.rel = 'noopener noreferrer'
  card.setAttribute('aria-label', `在新标签页打开 ${link.title.zh}`)

  const image = element('img', 'site-logo')
  image.src = assetUrl(link.logo)
  image.alt = ''
  image.loading = 'lazy'
  image.addEventListener('error', () => {
    if (!image.src.endsWith(fallbackLogo)) image.src = assetUrl(fallbackLogo)
  })

  const copy = element('span', 'site-copy')
  copy.append(element('strong', 'site-title', link.title.zh), element('span', 'site-description', link.description.zh))
  card.append(image, copy, element('span', 'site-arrow', '↗'))
  return card
}

const createCategory = (category: NavCategory): HTMLElement => {
  const section = element('section', 'category')
  section.id = slugify(category.name.zh)
  const heading = element('h2', 'category-title')
  heading.append(element('span', 'category-mark', categorySymbols[category.name.zh] ?? '•'), document.createTextNode(category.name.zh))
  section.append(heading)

  category.groups.forEach((group) => {
    const groupSection = element('section', 'link-group')
    groupSection.id = groupId(category, group)
    groupSection.append(element('h3', 'group-title', group.name.zh))
    const grid = element('div', 'site-grid')
    group.links.forEach((link) => grid.append(createLinkCard(link)))
    groupSection.append(grid)
    section.append(groupSection)
  })
  return section
}

export const createNavPage = (root: HTMLElement, data: NavCategory[] = navigation): void => {
  root.replaceChildren()
  const shell = element('div', 'app-shell')
  const overlay = element('button', 'menu-overlay')
  overlay.type = 'button'
  overlay.setAttribute('aria-label', '关闭导航菜单')

  const header = element('header', 'topbar')
  const brand = element('a', 'brand', '笑然导航')
  brand.href = '#top'
  const menuButton = element('button', 'menu-button', '目录')
  menuButton.type = 'button'
  menuButton.setAttribute('aria-expanded', 'false')
  menuButton.setAttribute('aria-controls', 'site-navigation')
  header.append(brand, menuButton)

  const sidebar = element('aside', 'sidebar')
  sidebar.id = 'site-navigation'
  const navigationLabel = element('p', 'sidebar-label', '导航目录')
  const nav = element('nav', 'nav-list')
  nav.setAttribute('aria-label', '网站分类')
  data.forEach((category) => {
    const categoryLink = element('a', 'nav-category', category.name.zh)
    categoryLink.href = `#${slugify(category.name.zh)}`
    nav.append(categoryLink)
    category.groups.forEach((group) => {
      const link = element('a', 'nav-group', group.name.zh)
      link.href = `#${groupId(category, group)}`
      nav.append(link)
    })
  })
  const aboutLink = element('a', 'nav-category', '关于本站')
  aboutLink.href = '#about'
  nav.append(aboutLink)
  sidebar.append(navigationLabel, nav)

  const main = element('main', 'content')
  main.id = 'top'
  const intro = element('section', 'hero')
  intro.append(element('p', 'eyebrow', '本地 · 轻量 · 无追踪'), element('h1', undefined, '常用网站，一处抵达'), element('p', 'hero-copy', '收集开发、AI、设计与日常使用的优质网站。所有导航数据和界面资源均存放在本项目中。'))
  main.append(intro)
  data.forEach((category) => main.append(createCategory(category)))

  const about = element('section', 'about')
  about.id = 'about'
  about.append(element('p', 'eyebrow', '关于本站'), element('h2', undefined, '为常用收藏留一处清晰入口'), element('p', undefined, '这里整理了日常使用的程序员、设计、AI 与常用资源网站。点击任意卡片会在新标签页打开对应站点。'))
  main.append(about)
  const footer = element('footer', 'footer', `© ${new Date().getFullYear()} 笑然导航 · 静态构建于 GitHub Pages`)
  main.append(footer)

  const backToTop = element('button', 'back-to-top', '↑')
  backToTop.type = 'button'
  backToTop.setAttribute('aria-label', '回到页面顶部')
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

  const closeMenu = () => {
    shell.classList.remove('menu-open')
    menuButton.setAttribute('aria-expanded', 'false')
  }
  menuButton.addEventListener('click', () => {
    const open = shell.classList.toggle('menu-open')
    menuButton.setAttribute('aria-expanded', String(open))
  })
  overlay.addEventListener('click', closeMenu)
  nav.addEventListener('click', closeMenu)
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 500), { passive: true })

  shell.append(header, sidebar, overlay, main, backToTop)
  root.append(shell)
}
