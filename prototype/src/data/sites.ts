export type SiteRecord = {
  id?: string
  title: string
  url: string
  description: string
  category: string
  bookmarkPath: string
  tags: string[]
  detail: string
  updatedAt: string
  lastOpenedAt: string
  organizeStatus: 'complete' | 'missing_description' | 'missing_tags' | 'duplicate_suspected' | 'link_problem' | 'path_pending' | 'stale'
  securityStatus: 'unchecked' | 'checking' | 'safe' | 'unreachable' | 'risky' | 'blocked'
  archiveStatus: 'active' | 'archived'
  shareStatus: 'none' | 'pending' | 'published' | 'rejected'
  recommendationHint?: string
}

export const siteCategories = ['全部分类', '设计资源', '开发文档', '效率工具', '灵感收藏']

export const siteTags = ['高频', '协作', '学习', '素材', '待整理']

export const mySiteEntries: SiteRecord[] = [
  {
    title: 'GitHub',
    url: 'https://github.com',
    description: '仓库、Issue 与 PR 的高频工作入口。',
    category: '开发文档',
    bookmarkPath: '开发 / 代码托管 / 高频',
    tags: ['高频', '协作'],
    detail: '最近整理了 3 个项目仓库，建议把常用仓库再拆成前端与工具两组。',
    updatedAt: '今天 09:20',
    lastOpenedAt: '今天 10:10',
    organizeStatus: 'complete',
    securityStatus: 'safe',
    archiveStatus: 'active',
    shareStatus: 'published',
    recommendationHint: '推荐库中也有更完整说明'
  },
  {
    title: 'Figma Community',
    url: 'https://www.figma.com/community',
    description: '组件、插件与视觉参考的集中入口。',
    category: '设计资源',
    bookmarkPath: '设计 / 素材 / 社区',
    tags: ['素材', '学习'],
    detail: '本周新增 12 个界面参考，适合进一步按表单、仪表盘和导航分类。',
    updatedAt: '今天 08:10',
    lastOpenedAt: '今天 09:42',
    organizeStatus: 'missing_tags',
    securityStatus: 'safe',
    archiveStatus: 'active',
    shareStatus: 'none',
    recommendationHint: '推荐库中有平台标签建议'
  },
  {
    title: 'Notion Workspace',
    url: 'https://www.notion.so',
    description: '需求、复盘与资料归档。',
    category: '效率工具',
    bookmarkPath: '工作 / 知识库',
    tags: ['协作'],
    detail: '当前最活跃的是需求池和周计划，适合补上标签规范。',
    updatedAt: '昨天',
    lastOpenedAt: '昨天',
    organizeStatus: 'path_pending',
    securityStatus: 'checking',
    archiveStatus: 'active',
    shareStatus: 'pending'
  },
  {
    title: 'Awwwards',
    url: 'https://www.awwwards.com',
    description: '高质量视觉灵感与交互案例。',
    category: '灵感收藏',
    bookmarkPath: '设计 / 灵感 / 网站案例',
    tags: ['学习', '素材'],
    detail: '最近收藏偏向内容导航型站点，可以整理出一个首页布局专题。',
    updatedAt: '昨天',
    lastOpenedAt: '6 天前',
    organizeStatus: 'stale',
    securityStatus: 'safe',
    archiveStatus: 'archived',
    shareStatus: 'none'
  },
  {
    title: 'Linear',
    url: 'https://linear.app',
    description: '任务流转与节奏追踪。',
    category: '效率工具',
    bookmarkPath: '工作 / 项目管理',
    tags: ['高频', '协作'],
    detail: '适合放在简洁模式的首屏高优先级区域，减少切换成本。',
    updatedAt: '2 天前',
    lastOpenedAt: '今天 08:30',
    organizeStatus: 'complete',
    securityStatus: 'safe',
    archiveStatus: 'active',
    shareStatus: 'none'
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: '前端 API 与兼容性检索。',
    category: '开发文档',
    bookmarkPath: '开发 / 前端 / API',
    tags: ['学习', '待整理'],
    detail: '建议补齐标签，区分 CSS、API 与性能相关文章。',
    updatedAt: '3 天前',
    lastOpenedAt: '3 天前',
    organizeStatus: 'missing_description',
    securityStatus: 'unreachable',
    archiveStatus: 'active',
    shareStatus: 'rejected'
  }
]

export const findSiteByTitle = (title: string) => mySiteEntries.find((site) => site.title === title)

export const getSiteDetailPath = (site: SiteRecord | string) => {
  const key = typeof site === 'string' ? site : site.id ?? site.title
  return `/my-sites/${encodeURIComponent(key)}`
}
