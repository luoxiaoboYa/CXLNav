import { render, screen } from '@testing-library/vue'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ManagementSidebar from '../ManagementSidebar.vue'

const currentDir = dirname(fileURLToPath(import.meta.url))

describe('management sidebar', () => {
  test('lists the approved management sections', () => {
    render(ManagementSidebar)

    expect(screen.getByText('站点管理')).toBeInTheDocument()
    expect(screen.getByText('待整理中心')).toBeInTheDocument()
    expect(screen.getByText('分类管理')).toBeInTheDocument()
    expect(screen.getByText('标签管理')).toBeInTheDocument()
    expect(screen.getByText('分享 / 推荐管理')).toBeInTheDocument()
    expect(screen.getByText('个人中心')).toBeInTheDocument()
    expect(screen.getByText('账号安全')).toBeInTheDocument()
    expect(screen.getByText('插件管理')).toBeInTheDocument()
    expect(screen.getByText('回收站')).toBeInTheDocument()
    expect(screen.getByText('导入 / 导出')).toBeInTheDocument()
    expect(screen.getByText('显示与偏好')).toBeInTheDocument()
  })

  test('keeps sidebar surfaces theme-driven for bright mode', () => {
    const sidebarSource = readFileSync(join(currentDir, '../ManagementSidebar.vue'), 'utf8')
    const managementPageSource = readFileSync(join(currentDir, '../../../pages/ManagementPage.vue'), 'utf8')

    expect(managementPageSource).not.toContain('rgba(8, 11, 31, 0.22)')
    expect(sidebarSource).not.toContain('rgba(61, 90, 254, 0.34)')
    expect(sidebarSource).toContain('--sidebar-active-background')
    expect(managementPageSource).toContain('--sidebar-panel-background')
  })
})
