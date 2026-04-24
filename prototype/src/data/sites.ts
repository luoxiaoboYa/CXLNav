export type SiteRecord = {
  title: string
  description: string
  category: string
  tags: string[]
  detail: string
  updatedAt: string
}

export const siteCategories = ['全部分类', '设计资源', '开发文档', '效率工具', '灵感收藏']

export const siteTags = ['高频', '协作', '学习', '素材', '待整理']

export const mySiteEntries: SiteRecord[] = [
  {
    title: 'GitHub',
    description: '仓库、Issue 与 PR 的高频工作入口。',
    category: '开发文档',
    tags: ['高频', '协作'],
    detail: '最近整理了 3 个项目仓库，建议把常用仓库再拆成前端与工具两组。',
    updatedAt: '今天 09:20'
  },
  {
    title: 'Figma Community',
    description: '组件、插件与视觉参考的集中入口。',
    category: '设计资源',
    tags: ['素材', '学习'],
    detail: '本周新增 12 个界面参考，适合进一步按表单、仪表盘和导航分类。',
    updatedAt: '今天 08:10'
  },
  {
    title: 'Notion Workspace',
    description: '需求、复盘与资料归档。',
    category: '效率工具',
    tags: ['协作'],
    detail: '当前最活跃的是需求池和周计划，适合补上标签规范。',
    updatedAt: '昨天'
  },
  {
    title: 'Awwwards',
    description: '高质量视觉灵感与交互案例。',
    category: '灵感收藏',
    tags: ['学习', '素材'],
    detail: '最近收藏偏向内容导航型站点，可以整理出一个首页布局专题。',
    updatedAt: '昨天'
  },
  {
    title: 'Linear',
    description: '任务流转与节奏追踪。',
    category: '效率工具',
    tags: ['高频', '协作'],
    detail: '适合放在简洁模式的首屏高优先级区域，减少切换成本。',
    updatedAt: '2 天前'
  },
  {
    title: 'MDN Web Docs',
    description: '前端 API 与兼容性检索。',
    category: '开发文档',
    tags: ['学习', '待整理'],
    detail: '建议补齐标签，区分 CSS、API 与性能相关文章。',
    updatedAt: '3 天前'
  }
]

export const findSiteByTitle = (title: string) => mySiteEntries.find((site) => site.title === title)

export const getSiteDetailPath = (title: string) => `/my-sites/${encodeURIComponent(title)}`
