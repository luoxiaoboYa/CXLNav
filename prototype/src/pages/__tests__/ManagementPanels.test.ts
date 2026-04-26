import { fireEvent, render, screen } from '@testing-library/vue'

import ManagementPage from '../ManagementPage.vue'

describe('management center panels', () => {
  test('switches between focused management panels', async () => {
    render(ManagementPage)

    expect(screen.getByRole('heading', { name: '站点管理' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '待整理中心' }))
    expect(screen.getByRole('heading', { name: '待整理中心' })).toBeInTheDocument()
    expect(screen.getByText('登录后合并原则')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '分类管理' }))
    expect(screen.getByRole('heading', { name: '分类管理' })).toBeInTheDocument()
    expect(screen.getAllByText('默认导出路径').length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('button', { name: '标签管理' }))
    expect(screen.getByRole('heading', { name: '标签管理' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '合并标签' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('button', { name: '书签路径管理' }))
    expect(screen.getByRole('heading', { name: '书签路径管理' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '批量迁移站点' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '分享 / 推荐管理' }))
    expect(screen.getByRole('heading', { name: '分享 / 推荐管理' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '后台治理能力' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '导入 / 导出' }))
    expect(screen.getByRole('heading', { name: '导入 / 导出' })).toBeInTheDocument()
    expect(screen.getByText('默认按 CXSearch 当前结构导出')).toBeInTheDocument()
    expect(screen.getByLabelText('导入预览清单')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '确认导入' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '个人中心' }))
    expect(screen.getByRole('heading', { name: '个人中心' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '账号安全' }))
    expect(screen.getByRole('heading', { name: '账号安全' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '插件管理' }))
    expect(screen.getByRole('heading', { name: '插件管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '预览插件快捷收藏' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '回收站' }))
    expect(screen.getByRole('heading', { name: '回收站' })).toBeInTheDocument()
  })
})
