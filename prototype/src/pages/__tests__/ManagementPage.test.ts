import { render, screen } from '@testing-library/vue'

import ManagementPage from '../ManagementPage.vue'
import router from '../../router'

describe('management page route', () => {
  test('maps /settings to the management center page', async () => {
    const settingsRoute = router.resolve('/settings')

    expect(settingsRoute.name).toBe('settings')
    expect(settingsRoute.matched.at(-1)?.components?.default).toBe(ManagementPage)

    render(ManagementPage)

    expect(await screen.findByRole('heading', { name: '管理中心' })).toBeInTheDocument()
  })
})
