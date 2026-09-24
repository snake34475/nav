import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

type NavLink = { title: string; desc: string; url: string; logo: string }
type NavGroup = { name: string; web: NavLink[] }
type NavCategory = { name: string; children: NavGroup[] }

type Candidate = {
  original: Pick<NavLink, 'title' | 'desc' | 'url' | 'logo'>
  category: string
  group: string
  status?: number
  finalUrl?: string
  candidateTitle?: string
  candidateDescription?: string
  iconUrl?: string
  iconContentType?: string
  failure?: string
}

const root = resolve(import.meta.dirname, '..')
const dataPath = resolve(root, 'src/assets/data.json')
const reportPath = resolve(root, 'reports/nav-enrichment.json')
const timeoutMs = 10_000
const maxRedirects = 5
const concurrency = 5
const headers = {
  'user-agent': 'static-nav-maintenance/1.0 (+local offline review)',
  accept: 'text/html,application/xhtml+xml,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
}

const clean = (value?: string): string | undefined => {
  const normalized = value?.replace(/\s+/g, ' ').trim()
  return normalized || undefined
}

const attribute = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))
  return match?.[2]
}

const metaContent = (html: string, key: string): string | undefined => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  return clean(tags.find((tag) => attribute(tag, 'name')?.toLowerCase() === key || attribute(tag, 'property')?.toLowerCase() === key)?.match(/\bcontent\s*=\s*(["'])(.*?)\1/i)?.[2])
}

const titleFromHtml = (html: string): string | undefined => clean(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1])

async function fetchFollowingRedirects(url: string, accept: string): Promise<Response> {
  let current = url
  for (let redirects = 0; redirects <= maxRedirects; redirects += 1) {
    const response = await fetch(current, { headers: { ...headers, accept }, redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) })
    if (![301, 302, 303, 307, 308].includes(response.status)) return response
    const location = response.headers.get('location')
    if (!location) return response
    current = new URL(location, current).href
  }
  throw new Error(`重定向超过 ${maxRedirects} 次`)
}

async function findIcon(baseUrl: string, html: string): Promise<Pick<Candidate, 'iconUrl' | 'iconContentType'>> {
  const links = html.match(/<link\b[^>]*>/gi) ?? []
  const declared = links
    .filter((tag) => /\b(rel)\s*=\s*(["'])[^"']*(icon|apple-touch-icon)[^"']*\2/i.test(tag))
    .map((tag) => attribute(tag, 'href'))
    .filter((href): href is string => Boolean(href))
  const candidates = [...declared, '/favicon.ico']

  for (const href of candidates) {
    try {
      const iconUrl = new URL(href, baseUrl).href
      const response = await fetchFollowingRedirects(iconUrl, 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8')
      const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
      if (response.ok && (contentType.startsWith('image/') || contentType.includes('icon'))) {
        return { iconUrl: response.url, iconContentType: contentType }
      }
    } catch {
      // Try the next candidate. The report intentionally records only the final usable candidate.
    }
  }
  return {}
}

async function inspect(link: NavLink, category: string, group: string): Promise<Candidate> {
  const candidate: Candidate = { original: link, category, group }
  try {
    const response = await fetchFollowingRedirects(link.url.trim(), 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1')
    candidate.status = response.status
    candidate.finalUrl = response.url
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (!contentType.includes('html')) throw new Error(`非 HTML 响应：${contentType || 'unknown'}`)
    const html = await response.text()
    candidate.candidateTitle = metaContent(html, 'og:title') ?? titleFromHtml(html)
    candidate.candidateDescription = metaContent(html, 'description') ?? metaContent(html, 'og:description')
    Object.assign(candidate, await findIcon(response.url, html))
  } catch (error) {
    candidate.failure = error instanceof Error ? error.message : String(error)
  }
  return candidate
}

const data = JSON.parse(await readFile(dataPath, 'utf8')) as NavCategory[]
const entries = data.flatMap((category) => category.children.flatMap((group) => group.web.map((link) => ({ link, category: category.name, group: group.name }))))
const results = new Array<Candidate>(entries.length)
let nextIndex = 0
async function worker(): Promise<void> {
  while (nextIndex < entries.length) {
    const index = nextIndex++
    const entry = entries[index]
    results[index] = await inspect(entry.link, entry.category, entry.group)
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker))

await mkdir(resolve(root, 'reports'), { recursive: true })
await writeFile(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), entries: results }, null, 2)}\n`)
console.log(`已生成 ${results.length} 条候选报告：${reportPath}`)
