export type DiscoverRecord = {
  title: string
  description: string
  source: string
  type: '主站点' | '功能站点'
  hot?: boolean
  tags: string[]
  category: string
  reason: string
  favoriteCount: number
  openCount: number
  parent?: string
  collected?: boolean
}

export const discoverFeed: DiscoverRecord[] = [
  {
    title: '内容导航案例集',
    description: '基于你最近浏览的站点结构，系统整理出一组首页信息架构参考。',
    source: '系统推荐',
    type: '功能站点',
    hot: true,
    tags: ['信息架构', '首页布局'],
    category: '设计资源',
    reason: '适合参考首页信息分层，但收藏时平台标签只作为建议。',
    favoriteCount: 128,
    openCount: 980,
    parent: '设计资源导航'
  },
  {
    title: '高频工具整合清单',
    description: '适合和“我的站点”联动使用，帮助你压缩常用工具入口数量。',
    source: '系统推荐 · 效率整理',
    type: '主站点',
    tags: ['效率', '整理策略'],
    category: '效率工具',
    reason: '通用推荐，不依赖个人行为数据，适合 MVP 阶段验证推荐库价值。',
    favoriteCount: 86,
    openCount: 612,
    collected: true
  },
  {
    title: '设计师的资源站书签流',
    description: '社区用户分享了一套按项目阶段整理素材站点的方法。',
    source: '用户推荐',
    type: '功能站点',
    hot: true,
    tags: ['设计资源', '书签流'],
    category: '设计资源',
    reason: '用户补充了从灵感、素材到交付的路径说明，可收藏后按自己的路径整理。',
    favoriteCount: 74,
    openCount: 431,
    parent: 'Figma Community'
  },
  {
    title: 'AI 工具导航专题',
    description: '本周点击和收藏都在上升，适合继续沉淀为专题合集。',
    source: '系统推荐 · 热门延展',
    type: '主站点',
    hot: true,
    tags: ['趋势', '专题'],
    category: 'AI 工具',
    reason: '热门收藏不是独立来源，只作为通用推荐中的排序和标记。',
    favoriteCount: 203,
    openCount: 1460
  },
  {
    title: '前端文档检索组合',
    description: '把规范、API 与兼容性文档拆成三层入口，检索效率更高。',
    source: '用户推荐 · 结构优化',
    type: '功能站点',
    tags: ['开发文档', '检索'],
    category: '开发文档',
    reason: '分享者推荐把 MDN、Can I Use 和规范入口分开收藏，减少重复搜索。',
    favoriteCount: 57,
    openCount: 390,
    parent: 'MDN Web Docs'
  },
  {
    title: '无代码原型工具榜单',
    description: '近期讨论度较高，适合做对比收藏和后续专题整理。',
    source: '用户推荐 · 热门延展',
    type: '主站点',
    hot: true,
    tags: ['产品设计', '工具对比'],
    category: '产品设计',
    reason: '适合从推荐库收藏到我的站点，再选择是否添加平台标签。',
    favoriteCount: 91,
    openCount: 705
  }
]
