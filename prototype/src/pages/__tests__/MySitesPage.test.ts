import { fireEvent, render, screen } from '@testing-library/vue'

import App from '../../App.vue'
import router from '../../router'

describe('my sites page', () => {
  test('uses sidebar categories, multi-select tags, icon view toggles, and modal add flow', async () => {
    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '我的站点' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '分类导航' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '开发文档' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '高频' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '学习' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到简洁模式' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到详情模式' })).toBeInTheDocument()
    expect(screen.queryByText('分类概览')).not.toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '切换到详情模式' }))

    const categorySidebar = screen.getByTestId('category-sidebar')
    const contentColumn = screen.getByTestId('sites-content-column')

    expect(categorySidebar).toHaveClass('sidebar-panel')
    expect(categorySidebar).toHaveClass('sticky-sidebar')
    expect(contentColumn).toContainElement(screen.getByText('标签筛选'))
    expect(contentColumn).toContainElement(screen.getByText(/当前展示 \d+ 个站点/))
    expect(contentColumn).toContainElement(screen.getByRole('heading', { name: '浏览结果' }))
    expect(screen.getByLabelText('站点状态概览')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '待整理' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '已归档' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('书签路径').length).toBeGreaterThan(0)
    expect(screen.getAllByText('共享状态').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '共享到推荐库' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: '查看详情' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getAllByRole('link', { name: '查看详情' })[0])
    expect(await screen.findByRole('heading', { name: '站点详情' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'GitHub' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('link', { name: '返回我的站点' }))
    await fireEvent.click(await screen.findByRole('button', { name: '新增站点' }))
    expect(await screen.findByRole('dialog', { name: '新增 / 编辑站点' })).toBeInTheDocument()
  })
})
