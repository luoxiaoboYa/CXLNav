import { fireEvent, render, screen } from '@testing-library/vue'

import ManagementPage from '../ManagementPage.vue'

describe('management center panels', () => {
  test('switches between focused management panels', async () => {
    render(ManagementPage)

    expect(screen.getByRole('heading', { name: '站点管理' })).toBeInTheDocument()

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
