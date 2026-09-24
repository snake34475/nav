import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type NavLink = { title: string; desc: string; url: string; logo: string }
type NavGroup = { name: string; web: NavLink[] }
type NavCategory = { name: string; children: NavGroup[] }

const root = resolve(import.meta.dirname, '..')
const data = JSON.parse(readFileSync(resolve(root, 'src/assets/data.json'), 'utf8')) as NavCategory[]
const issues: string[] = []

for (const category of data) for (const group of category.children) for (const link of group.web) {
  const label = `${category.name} / ${group.name} / ${link.title || '未命名'}`
  if (!link.title.trim()) issues.push(`${label}: 标题不能为空`)
  if (!link.desc.trim()) issues.push(`${label}: 简介不能为空`)
  if (link.desc.trim().length < 12 || link.desc.trim().length > 42) issues.push(`${label}: 简介应为 12–42 个字符`)
  try { new URL(link.url.trim()) } catch { issues.push(`${label}: URL 无效`) }
  if (/^(https?:|\/\/)/i.test(link.logo)) issues.push(`${label}: 图标不得使用远程地址`)
  if (!existsSync(resolve(root, 'public', link.logo))) issues.push(`${label}: 本地图标不存在 (${link.logo})`)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else {
  const links = data.flatMap((category) => category.children.flatMap((group) => group.web))
  console.log(`导航数据有效：${links.length} 个站点，全部图标均为本地资源。`)
}
