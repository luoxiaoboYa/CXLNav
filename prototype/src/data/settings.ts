export type SiteManagementRecord = {
  name: string
  category: string
  status: string
  updatedAt: string
}

export type CategoryRecord = {
  name: string
  count: number
  description: string
}

export type TagRecord = {
  name: string
  usageCount: number
  intent: string
}

export type ShareRecord = {
  title: string
  source: string
  status: string
}

export type ImportExportRecord = {
  title: string
  description: string
  action: string
}

export type PreferenceRecord = {
  label: string
  value: string
}

export type ProfileRecord = {
  label: string
  value: string
}

export type SecurityRecord = {
  title: string
  status: string
  hint: string
}

export type RecycleRecord = {
  title: string
  source: string
  removedAt: string
}

export const siteManagementRecords: SiteManagementRecord[] = [
  { name: 'GitHub', category: '开发文档', status: '已整理', updatedAt: '今天 09:20' },
  { name: 'Figma Community', category: '设计资源', status: '待补标签', updatedAt: '今天 08:10' },
  { name: 'MDN Web Docs', category: '开发文档', status: '待整理', updatedAt: '3 天前' }
]

export const categoryRecords: CategoryRecord[] = [
  { name: '设计资源', count: 14, description: '灵感、组件、图标和视觉素材。' },
  { name: '开发文档', count: 20, description: '规范、API 和框架文档。' },
  { name: '效率工具', count: 8, description: '任务、表格、协作与记录。' }
]

export const tagRecords: TagRecord[] = [
  { name: '高频', usageCount: 12, intent: '首页和简洁模式优先展示。' },
  { name: '学习', usageCount: 9, intent: '适合沉淀为专题浏览集合。' },
  { name: '待整理', usageCount: 4, intent: '提示需要补全说明和分类。' }
]

export const shareRecords: ShareRecord[] = [
  { title: '内容导航案例集', source: '系统推荐', status: '已上架' },
  { title: '设计师资源站书签流', source: '用户分享', status: '待审核' },
  { title: 'AI 工具导航专题', source: '热门内容', status: '推荐中' }
]

export const importExportRecords: ImportExportRecord[] = [
  {
    title: '浏览器书签导入',
    description: '把现有书签批量导入到 CXSearch 原型数据中。',
    action: '选择文件'
  },
  {
    title: '导出 JSON 备份',
    description: '导出站点、分类和标签，便于后续迁移或恢复。',
    action: '导出备份'
  }
]

export const preferenceRecords: PreferenceRecord[] = [
  { label: '默认显示模式', value: '简洁模式' },
  { label: '首页主题', value: '暖白底 + 绿色强调' },
  { label: '推荐内容密度', value: '适中' }
]

export const profileRecords: ProfileRecord[] = [
  { label: '用户名', value: 'Elaine' },
  { label: '默认工作区', value: '产品灵感库' },
  { label: '常用入口', value: '我的站点 / 推荐发现 / 插件收藏' }
]

export const securityRecords: SecurityRecord[] = [
  { title: '登录方式', status: 'Google + Git 登录已接入原型', hint: '后续开发可绑定本地账号体系。' },
  { title: '密码状态', status: '已支持找回密码入口', hint: '注册表单已包含确认密码。' },
  { title: '设备提醒', status: '最近一次登录：今天 09:20', hint: '后续可扩展为登录设备列表。' }
]

export const recycleRecords: RecycleRecord[] = [
  { title: '旧版设计素材导航', source: '我的站点', removedAt: '今天 08:10' },
  { title: '测试用低保真原型集', source: '分享 / 推荐管理', removedAt: '昨天' },
  { title: '重复导入的开发文档集合', source: '站点管理', removedAt: '3 天前' }
]
