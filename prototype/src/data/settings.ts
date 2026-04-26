export type SiteManagementRecord = {
  name: string
  category: string
  status: string
  updatedAt: string
}

export type OrganizeRecord = {
  title: string
  reason: string
  source: string
  suggestedAction: string
  priority: string
}

export type CategoryRecord = {
  name: string
  count: number
  description: string
  pendingCount: number
  exportPath: string
}

export type TagRecord = {
  name: string
  usageCount: number
  intent: string
  mergeSuggestion?: string
}

export type BookmarkPathRecord = {
  name: string
  category: string
  fullPath: string
  siteCount: number
  actionHint: string
}

export type ShareRecord = {
  title: string
  source: string
  status: string
  type: string
  reviewHint: string
}

export type ImportExportRecord = {
  title: string
  description: string
  action: string
  mode: string
  defaultChoice: string
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

export const organizeRecords: OrganizeRecord[] = [
  {
    title: 'MDN Web Docs',
    reason: '缺少个人说明，无法解释为什么常用。',
    source: '浏览器书签导入',
    suggestedAction: '补充用途说明和常用标签',
    priority: '高'
  },
  {
    title: 'Vue Router / Router 文档',
    reason: '规范化 URL 后疑似重复。',
    source: '登录后本地与云端合并',
    suggestedAction: '合并标签，保留最早收藏时间',
    priority: '中'
  },
  {
    title: '旧版图标资源站',
    reason: '长期未打开，且链接校验显示疑似失效。',
    source: '站点管理',
    suggestedAction: '重新检测或移入归档',
    priority: '低'
  }
]

export const categoryRecords: CategoryRecord[] = [
  { name: '设计资源', count: 14, description: '灵感、组件、图标和视觉素材。', pendingCount: 3, exportPath: '设计资源 / 素材' },
  { name: '开发文档', count: 20, description: '规范、API 和框架文档。', pendingCount: 5, exportPath: '开发文档 / 前端' },
  { name: '效率工具', count: 8, description: '任务、表格、协作与记录。', pendingCount: 1, exportPath: '效率工具 / 工作流' }
]

export const tagRecords: TagRecord[] = [
  { name: '高频', usageCount: 12, intent: '首页和简洁模式优先展示。' },
  { name: '学习', usageCount: 9, intent: '适合沉淀为专题浏览集合。', mergeSuggestion: '可与“教程”合并评估' },
  { name: '待整理', usageCount: 4, intent: '提示需要补全说明和分类。', mergeSuggestion: '整理完成后批量移除' }
]

export const bookmarkPathRecords: BookmarkPathRecord[] = [
  { name: '前端 / Vue / 官方', category: '开发文档', fullPath: '开发文档 / 前端 / Vue / 官方', siteCount: 6, actionHint: '可批量迁移到“前端框架”' },
  { name: '素材 / 图标', category: '设计资源', fullPath: '设计资源 / 素材 / 图标', siteCount: 4, actionHint: '导出时保留目录层级' },
  { name: '工作流 / 协作', category: '效率工具', fullPath: '效率工具 / 工作流 / 协作', siteCount: 3, actionHint: '同名路径只在当前分类下生效' }
]

export const shareRecords: ShareRecord[] = [
  { title: '内容导航案例集', source: '系统推荐', status: '已上架', type: '功能站点', reviewHint: '系统推荐无需共享申请' },
  { title: '设计师资源站书签流', source: '用户分享', status: '待审核', type: '功能站点', reviewHint: '等待管理员审核公开描述' },
  { title: 'AI 工具导航专题', source: '热门内容', status: '推荐中', type: '主站点', reviewHint: '热门只是排序标记，不是独立来源' }
]

export const importExportRecords: ImportExportRecord[] = [
  {
    title: '浏览器书签导入',
    description: '把现有书签批量导入到 CXSearch 原型数据中。',
    action: '选择文件',
    mode: '标准导入 / 简化导入',
    defaultChoice: '默认保留多个收藏位置'
  },
  {
    title: '浏览器书签导出',
    description: '导出为浏览器可重新导入的 HTML 文件。',
    action: '导出书签',
    mode: '当前结构 / 原始结构 / 扁平分类',
    defaultChoice: '默认按 CXSearch 当前结构导出'
  },
  {
    title: '导出 JSON 备份',
    description: '导出站点、分类和标签，便于后续迁移或恢复。',
    action: '导出备份',
    mode: '完整备份',
    defaultChoice: '保留备注、来源、共享状态和偏好'
  },
  {
    title: '恢复 JSON 备份',
    description: '从 CXSearch JSON 备份恢复平台完整数据。',
    action: '选择备份',
    mode: '合并恢复',
    defaultChoice: 'MVP 不做覆盖恢复'
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
  { title: '登录方式', status: 'MVP 使用邮箱 + 密码', hint: 'Google / GitHub OAuth 已调整为二期占位。' },
  { title: '密码状态', status: '已支持找回密码入口', hint: '注册表单已包含确认密码。' },
  { title: '设备提醒', status: '最近一次登录：今天 09:20', hint: '后续可扩展为登录设备列表。' }
]

export const recycleRecords: RecycleRecord[] = [
  { title: '旧版设计素材导航', source: '我的站点', removedAt: '今天 08:10' },
  { title: '测试用低保真原型集', source: '分享 / 推荐管理', removedAt: '昨天' },
  { title: '重复导入的开发文档集合', source: '站点管理', removedAt: '3 天前' }
]
