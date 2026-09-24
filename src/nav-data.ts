import rawData from './assets/data.json'

export type LocalizedText = {
  zh: string
  en?: string
}

export type NavLink = {
  title: LocalizedText
  description: LocalizedText
  url: string
  logo: string
}

export type NavGroup = {
  name: LocalizedText
  links: NavLink[]
}

export type NavCategory = {
  name: LocalizedText
  icon: string
  groups: NavGroup[]
}

type RawLink = { title: string; desc: string; url: string; logo: string }
type RawGroup = { name: string; en_name?: string; web: RawLink[] }
type RawCategory = { name: string; en_name?: string; icon: string; children: RawGroup[] }

const text = (zh: string, en?: string): LocalizedText => ({ zh, en })

export const navigation: NavCategory[] = (rawData as RawCategory[]).map((category) => ({
  name: text(category.name, category.en_name),
  icon: category.icon,
  groups: category.children.map((group) => ({
    name: text(group.name, group.en_name),
    links: group.web.map((link) => ({
      title: text(link.title),
      description: text(link.desc),
      url: link.url.trim(),
      logo: link.logo,
    })),
  })),
}))
