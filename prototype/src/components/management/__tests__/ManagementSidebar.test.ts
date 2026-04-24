import { render, screen } from '@testing-library/vue'

import ManagementSidebar from '../ManagementSidebar.vue'

describe('management sidebar', () => {
  test('lists the approved management sections', () => {
    render(ManagementSidebar)

    expect(screen.getByText('站点管理')).toBeInTheDocument()
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
})
