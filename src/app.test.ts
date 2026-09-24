import { beforeEach, describe, expect, it } from 'vitest'
import { assetUrl, createNavPage, slugify } from './app'
import type { NavCategory } from './nav-data'

const fixture: NavCategory[] = [{
  name: { zh: '测试分类' }, icon: '•', groups: [{
    name: { zh: '测试分组' }, links: [{ title: { zh: '测试站点' }, description: { zh: '测试描述' }, url: 'https://example.com', logo: 'missing.png' }],
  }],
}]

describe('静态导航页面', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="app"></div>' })

  it('生成稳定锚点和 GitHub Pages 资源路径', () => {
    expect(slugify('测试 分类!')).toBe('测试-分类')
    expect(assetUrl('fallback-logo.svg')).toContain('fallback-logo.svg')
  })

  it('渲染导航、外链安全属性和中文内容', () => {
    createNavPage(document.querySelector<HTMLElement>('#app')!, fixture)
    const card = document.querySelector<HTMLAnchorElement>('.site-card')!
    expect(document.body.textContent).toContain('测试站点')
    expect(card.target).toBe('_blank')
    expect(card.rel).toBe('noopener noreferrer')
    expect(document.querySelector('.nav-group')?.getAttribute('href')).toBe('#测试分类-测试分组')
  })

  it('在 logo 加载失败时使用本地默认图标', () => {
    createNavPage(document.querySelector<HTMLElement>('#app')!, fixture)
    const image = document.querySelector<HTMLImageElement>('.site-logo')!
    image.dispatchEvent(new Event('error'))
    expect(image.src).toContain('fallback-logo.svg')
  })

  it('可切换移动端菜单', () => {
    createNavPage(document.querySelector<HTMLElement>('#app')!, fixture)
    const button = document.querySelector<HTMLButtonElement>('.menu-button')!
    button.click()
    expect(document.querySelector('.app-shell')?.classList.contains('menu-open')).toBe(true)
    expect(button.getAttribute('aria-expanded')).toBe('true')
  })
})
