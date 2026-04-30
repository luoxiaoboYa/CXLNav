import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

import App from '../../App.vue'
import router from '../../router'
import { resetAuthState } from '../../services/auth'

describe('app shell navigation', () => {
  afterEach(() => {
    resetAuthState()
    vi.restoreAllMocks()
  })

  test('shows the approved top navigation items', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.queryByText('我的站点')).not.toBeInTheDocument()
    expect(screen.getByText('推荐发现')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '注册 / 登录' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '新增站点' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '新增站点' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '设计稿' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('主题切换')).toBeInTheDocument()
    expect(screen.queryByLabelText('设置')).not.toBeInTheDocument()
    expect(screen.getByText('4月23日 周四')).toBeInTheDocument()
    expect(screen.getByText('天气 多云 24°C')).toBeInTheDocument()
  })

  test('shows the current user name in the auth action after login', async () => {
    localStorage.setItem('cxsearch_api_token', 'test-token')
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = input.toString()

      if (url.includes('/auth/me')) {
        return Promise.resolve(new Response(JSON.stringify({
          user: {
            id: 'user-1',
            username: 'coreaccount',
            email: 'core-account@example.com',
            nickname: 'Core Account',
            avatarUrl: null,
            role: 'user',
            status: 'active'
          }
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }))
      }

      return Promise.resolve(new Response(JSON.stringify({}), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }))
    })

    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await waitFor(() => expect(screen.getByRole('link', { name: 'Core Account' })).toBeInTheDocument())
    expect(screen.queryByRole('link', { name: '注册 / 登录' })).not.toBeInTheDocument()
  })

  test('keeps the auth page navigation minimal before login', async () => {
    router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('link', { name: 'CXSearch' })).toHaveAttribute('href', '/')
    expect(screen.getByText('天气 多云 24°C')).toBeInTheDocument()
    expect(screen.getByLabelText('主题切换')).toBeInTheDocument()
    expect(screen.queryByText('4月23日 周四')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '首页' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '我的站点' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '推荐发现' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '搜索' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '设置' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '注册 / 登录' })).not.toBeInTheDocument()
  })

  test('links the logged-in auth page user name to the management center', async () => {
    localStorage.setItem('cxsearch_api_token', 'test-token')
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = input.toString()

      if (url.includes('/auth/me')) {
        return Promise.resolve(new Response(JSON.stringify({
          user: {
            id: 'user-1',
            username: 'coreaccount',
            email: 'core-account@example.com',
            nickname: 'Core Account',
            avatarUrl: null,
            role: 'user',
            status: 'active'
          }
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }))
      }

      return Promise.resolve(new Response(JSON.stringify({}), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }))
    })

    router.push('/auth')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await waitFor(() => expect(screen.getByRole('link', { name: 'Core Account' })).toHaveAttribute('href', '/settings'))
    expect(screen.queryByRole('link', { name: '注册 / 登录' })).not.toBeInTheDocument()
  })

  test('switches between the dark and bright K6 themes', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(document.querySelector('[data-theme="dark"]')).toBeInTheDocument()

    await fireEvent.click(screen.getByLabelText('主题切换'))

    expect(document.querySelector('[data-theme="light"]')).toBeInTheDocument()
    expect(screen.getByLabelText('主题切换')).toHaveTextContent('明亮主题')
  })
})
