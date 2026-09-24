import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

type ReportEntry = {
  original: { title: string }
  iconUrl?: string
  iconContentType?: string
}
type Report = { entries: ReportEntry[] }

const root = resolve(import.meta.dirname, '..')
const report = JSON.parse(await readFile(resolve(root, 'reports/nav-enrichment.json'), 'utf8')) as Report
const outputDirectory = resolve(root, 'public/assets/images/logos/curated')
const timeoutMs = 10_000

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9\p{L}]+/gu, '-').replace(/^-|-$/g, '')
const extensionFor = (contentType: string, url: string) => {
  if (contentType.includes('svg') || url.startsWith('data:image/svg')) return 'svg'
  if (contentType.includes('icon') || contentType.includes('x-icon')) return 'ico'
  if (contentType.includes('jpeg')) return 'jpg'
  if (contentType.includes('webp')) return 'webp'
  return extname(new URL(url).pathname).slice(1).toLowerCase() || 'png'
}

async function bytesFor(url: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  if (url.startsWith('data:')) {
    const [header, payload] = url.split(',', 2)
    const contentType = header.match(/^data:([^;,]+)/)?.[1] ?? 'image/svg+xml'
    return { bytes: header.includes(';base64') ? Buffer.from(payload, 'base64') : Buffer.from(decodeURIComponent(payload)), contentType }
  }
  const response = await fetch(url, { headers: { 'user-agent': 'static-nav-maintenance/1.0' }, signal: AbortSignal.timeout(timeoutMs) })
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  if (!response.ok || !(contentType.startsWith('image/') || contentType.includes('icon'))) throw new Error(`无效图标响应：${response.status} ${contentType}`)
  return { bytes: new Uint8Array(await response.arrayBuffer()), contentType }
}

await mkdir(outputDirectory, { recursive: true })
const result: Record<string, string> = {}
for (const entry of report.entries) {
  if (!entry.iconUrl) continue
  try {
    const downloaded = await bytesFor(entry.iconUrl)
    const filename = `${slugify(entry.original.title)}.${extensionFor(downloaded.contentType || entry.iconContentType || '', entry.iconUrl)}`
    await writeFile(resolve(outputDirectory, filename), downloaded.bytes)
    result[entry.original.title] = `assets/images/logos/curated/${filename}`
  } catch (error) {
    console.warn(`未下载 ${entry.original.title}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
await writeFile(resolve(root, 'reports/nav-icon-map.json'), `${JSON.stringify(result, null, 2)}\n`)
console.log(`已下载 ${Object.keys(result).length} 个审校图标。`)
