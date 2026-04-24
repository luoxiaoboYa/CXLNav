import { render, screen } from '@testing-library/vue'

import App from '../../App.vue'
import router from '../../router'

describe('remaining prototype routes', () => {
  test('renders the auth page structure', async () => {
    await router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '登录与注册' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '继续登录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '使用谷歌登录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '使用 Git 登录' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '忘记密码' })).toBeInTheDocument()
    expect(screen.getByText('初始账号')).toBeInTheDocument()
  })

  test('renders the site editor page structure', async () => {
    await router.push('/site-editor')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '站点添加 / 编辑' })).toBeInTheDocument()
    expect(screen.getByLabelText('站点名称')).toBeInTheDocument()
  })

  test('renders the extension popup page structure', async () => {
    await router.push('/extension-popup')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '插件快捷收藏' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '保存到我的站点' })).toBeInTheDocument()
  })

  test('renders the site detail page structure', async () => {
    await router.push('/my-sites/GitHub')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '站点详情' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByText('开发文档')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回我的站点' })).toBeInTheDocument()
  })
})
