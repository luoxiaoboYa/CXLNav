import { render, screen } from '@testing-library/vue'

import App from '../../App.vue'
import router from '../../router'

describe('app shell navigation', () => {
  test('shows the approved top navigation items', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('我的站点')).toBeInTheDocument()
    expect(screen.getByText('推荐发现')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '注册 / 登录' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '新增站点' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '新增站点' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('主题切换')).toBeInTheDocument()
    expect(screen.getByLabelText('设置')).toBeInTheDocument()
    expect(screen.getByText('4月23日 周四')).toBeInTheDocument()
    expect(screen.getByText('天气 多云 24°C')).toBeInTheDocument()
  })
})
