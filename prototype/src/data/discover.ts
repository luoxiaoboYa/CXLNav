export type DiscoverRecord = {
  title: string
  description: string
  source: string
  hot?: boolean
  tags: string[]
}

export const discoverFeed: DiscoverRecord[] = [
  {
    title: '内容导航案例集',
    description: '基于你最近浏览的站点结构，系统整理出一组首页信息架构参考。',
    source: '系统推荐',
    hot: true,
    tags: ['信息架构', '首页布局']
  },
  {
    title: '高频工具整合清单',
    description: '适合和“我的站点”联动使用，帮助你压缩常用工具入口数量。',
    source: '系统推荐 · 效率整理',
    tags: ['效率', '整理策略']
  },
  {
    title: '设计师的资源站书签流',
    description: '社区用户分享了一套按项目阶段整理素材站点的方法。',
    source: '用户推荐',
    hot: true,
    tags: ['设计资源', '书签流']
  },
  {
    title: 'AI 工具导航专题',
    description: '本周点击和收藏都在上升，适合继续沉淀为专题合集。',
    source: '系统推荐 · 热门延展',
    hot: true,
    tags: ['趋势', '专题']
  },
  {
    title: '前端文档检索组合',
    description: '把规范、API 与兼容性文档拆成三层入口，检索效率更高。',
    source: '用户推荐 · 结构优化',
    tags: ['开发文档', '检索']
  },
  {
    title: '无代码原型工具榜单',
    description: '近期讨论度较高，适合做对比收藏和后续专题整理。',
    source: '用户推荐 · 热门延展',
    hot: true,
    tags: ['产品设计', '工具对比']
  }
]
