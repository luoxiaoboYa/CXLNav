import { fireEvent, render, screen } from '@testing-library/vue'

import App from '../../App.vue'
import router from '../../router'

describe('prototype entry points', () => {
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

  test('opens extension popup preview from plugin management', async () => {
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
