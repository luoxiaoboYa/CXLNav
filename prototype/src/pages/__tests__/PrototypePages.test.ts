import { fireEvent, render, screen } from '@testing-library/vue'

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
    expect(screen.getByRole('button', { name: 'Google OAuth（二期）' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'GitHub OAuth（二期）' })).toBeDisabled()
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
    expect(screen.getByRole('heading', { name: '插件第一版边界' })).toBeInTheDocument()
    expect(screen.getByText('共享到推荐库必须回到 Web 主站完成。')).toBeInTheDocument()
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
    expect(screen.getAllByRole('heading', { name: 'GitHub' }).length).toBeGreaterThan(0)
    expect(screen.getByText('开发文档')).toBeInTheDocument()
    expect(screen.getByLabelText('个人站点操作')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '共享到推荐库' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '个人站点详情' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '状态与整理' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '私人信息边界' })).toBeInTheDocument()
    expect(screen.getByText('公开主站点详情')).toBeInTheDocument()
    expect(screen.getByText('公开功能站点详情')).toBeInTheDocument()
    expect(screen.getByText(/平台标签只作为建议/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回我的站点' })).toBeInTheDocument()

    await fireEvent.click(screen.getByLabelText('个人站点操作').querySelector('button')!)

    expect(screen.getByLabelText('共享申请流程')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '共享到推荐库' })).toBeInTheDocument()
    expect(screen.getByText(/个人备注、个人标签、书签路径和打开频率不会公开/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提交共享申请' })).toBeInTheDocument()
  })
})
