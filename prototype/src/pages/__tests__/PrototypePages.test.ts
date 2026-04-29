import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

import App from '../../App.vue'
import router from '../../router'
import { resetAuthState } from '../../services/auth'

const jsonResponse = (payload: unknown) =>
  Promise.resolve(new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  }))

describe('remaining prototype routes', () => {
  afterEach(() => {
    resetAuthState()
    vi.restoreAllMocks()
  })

  test('renders the auth page structure', async () => {
    await router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '账号登录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '继续登录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '创建账号' })).toBeInTheDocument()
    expect(screen.queryByText('使用账号名或邮箱继续访问你的个人站点库。')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '忘记密码' })).not.toBeInTheDocument()
    expect(screen.queryByText('二期快捷授权占位')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Google OAuth（二期）' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'GitHub OAuth（二期）' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('账号')).not.toBeInTheDocument()
    expect(screen.queryByText('初始账号')).not.toBeInTheDocument()
    expect(screen.queryByText('登录后管理中心会读取你的真实后端数据。')).not.toBeInTheDocument()
    expect(document.querySelector('.auth-layout')).toHaveClass('wide-auth')
  })

  test('keeps registration behind a secondary create account action', async () => {
    await router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.queryByLabelText('账号')).not.toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '创建账号' }))

    expect(screen.getByRole('heading', { name: '填写注册信息' })).toBeInTheDocument()
    expect(screen.queryByText('填写基础信息后即可进入管理中心。')).not.toBeInTheDocument()
    expect(screen.getByLabelText('账号')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '返回登录' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '返回登录' }))

    expect(screen.getByRole('heading', { name: '账号登录' })).toBeInTheDocument()
    expect(screen.queryByLabelText('账号')).not.toBeInTheDocument()
  })

  test('logs in with an account or email identifier without browser email validation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const url = input.toString()

      if (url.includes('/auth/login')) {
        return jsonResponse({
          token: 'test-token',
          user: {
            id: 'user-1',
            username: 'coreaccount',
            email: 'core-account@example.com',
            nickname: 'Core Account',
            avatarUrl: null,
            role: 'user',
            status: 'active'
          }
        })
      }

      return jsonResponse({})
    })

    await router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    const accountInput = screen.getByLabelText('账号 / 邮箱') as HTMLInputElement
    expect(accountInput.type).toBe('text')

    await fireEvent.update(accountInput, 'coreaccount')
    await fireEvent.update(screen.getByLabelText('密码'), 'password123')
    await fireEvent.click(screen.getByRole('button', { name: '继续登录' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          body: JSON.stringify({ identifier: 'coreaccount', password: 'password123' })
        })
      )
    })
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
