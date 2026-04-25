import { render, screen } from '@testing-library/vue'

import App from '../../App.vue'
import router from '../../router'

describe('discover page', () => {
  test('uses a unified recommendation feed with source labels and hot markers', async () => {
    await router.push('/discover')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '推荐发现' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '推荐列表' })).toBeInTheDocument()
    expect(screen.getByLabelText('推荐发现概览')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '主站点' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '功能站点' })).toBeInTheDocument()
    expect(screen.getByText('来源：系统推荐')).toBeInTheDocument()
    expect(screen.getByText('来源：用户推荐')).toBeInTheDocument()
    expect(screen.getAllByText('推荐理由：', { exact: false }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '收藏到我的站点' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '补充推荐理由' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('热门').length).toBeGreaterThan(0)
    expect(screen.queryByRole('heading', { name: '系统推荐' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '用户分享' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '热门内容' })).not.toBeInTheDocument()
  })
})
