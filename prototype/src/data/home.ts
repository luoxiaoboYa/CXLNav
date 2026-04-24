export type HomeCard = {
  title: string
  description: string
  tags: string[]
}

export const frequentVisits: HomeCard[] = [
  { title: 'GitHub', description: '日常开发协作与代码浏览。', tags: ['开发', '高频'] },
  { title: 'Figma', description: '界面设计与原型协作。', tags: ['设计', '高频'] },
  { title: 'Notion', description: '资料归档与需求记录。', tags: ['文档'] },
  { title: 'Linear', description: '任务流转与节奏跟踪。', tags: ['项目'] }
]

export const categoryGroups: HomeCard[] = [
  { title: '设计资源', description: '灵感、配色、组件与动效素材。', tags: ['14 个站点'] },
  { title: '开发文档', description: '接口文档、框架指南与工具集合。', tags: ['20 个站点'] },
  { title: '效率工具', description: '任务、表格、知识整理与协作。', tags: ['8 个站点'] }
]

export const recentGroups: HomeCard[] = [
  { title: '最近访问', description: '回到你刚刚打开过的站点。', tags: ['时间维度'] },
  { title: '最近新增', description: '继续整理刚收藏的新内容。', tags: ['新增'] }
]

export const supportingRecommendations: HomeCard[] = [
  { title: '系统精选', description: '今天值得看的一组优质站点。', tags: ['系统推荐'] },
  { title: '社区分享', description: '用户最近推荐的工具与资源。', tags: ['用户分享'] }
]

export const continueDiscovery: HomeCard[] = [
  {
    title: 'AI 工具导航专题',
    description: '适合继续沉淀成一个专题集合，方便后续统一回看和取舍。',
    tags: ['热门', '系统推荐']
  },
  {
    title: '设计系统案例集',
    description: '把组件规范、布局范式和交互细节整理成一条浏览路径。',
    tags: ['用户分享', '灵感']
  },
  {
    title: '效率工作流清单',
    description: '把高频工具组合成一条完整工作流，减少页面间来回跳转。',
    tags: ['热门', '效率']
  }
]
