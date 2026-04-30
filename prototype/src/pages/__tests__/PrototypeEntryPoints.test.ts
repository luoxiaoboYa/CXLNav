import { fireEvent, render, screen } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

import App from '../../App.vue'
import router from '../../router'
import { setStoredToken } from '../../services/api'
import { resetAuthState } from '../../services/auth'

const jsonResponse = (payload: unknown) =>
  Promise.resolve(new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  }))

describe('prototype entry points', () => {
  afterEach(() => {
    resetAuthState()
    vi.restoreAllMocks()
  })

  test('navigates from top navigation to the auth page', async () => {
    await router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await fireEvent.click(screen.getByRole('link', { name: '注册 / 登录' }))
    expect(await screen.findByRole('heading', { name: '账号登录' })).toBeInTheDocument()
  })

  test('redirects anonymous visitors from private pages to auth with return target', async () => {
    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(router.currentRoute.value.path).toBe('/auth')
    expect(router.currentRoute.value.query.redirect).toBe('/my-sites')
    expect(await screen.findByRole('heading', { name: '账号登录' })).toBeInTheDocument()
  })

  test('returns to the requested private page after login', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
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

    await router.push('/auth?redirect=/settings')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await fireEvent.update(screen.getByLabelText('账号 / 邮箱'), 'coreaccount')
    await fireEvent.update(screen.getByLabelText('密码'), 'password123')
    await fireEvent.click(screen.getByRole('button', { name: '继续登录' }))

    expect(await screen.findByRole('heading', { name: '管理中心' })).toBeInTheDocument()
    expect(router.currentRoute.value.path).toBe('/settings')
  })

  test('opens extension popup preview from plugin management', async () => {
    setStoredToken('test-token')
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = input.toString()

      if (url.includes('/auth/me')) {
        return jsonResponse({
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

    await router.push('/settings')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await fireEvent.click(screen.getByRole('button', { name: '插件管理' }))
    expect(await screen.findByRole('heading', { name: '插件管理' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: '预览插件快捷收藏' }))
    expect(await screen.findByRole('heading', { name: '插件快捷收藏' })).toBeInTheDocument()
  })
})
