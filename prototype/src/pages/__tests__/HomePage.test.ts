import { render, screen } from '@testing-library/vue'

import HomePage from '../HomePage.vue'

describe('homepage structure', () => {
  test('keeps first-screen support on the right but moves extended discovery back into the main flow', async () => {
    render(HomePage)

    const frequentVisits = screen.getByRole('heading', { name: '常访问' })
    const personalCategories = screen.getByRole('heading', { name: '个人分类浏览' })
    const systemRecommendations = screen.getByRole('heading', { name: '系统推荐' })
    const userShares = screen.getByRole('heading', { name: '用户分享' })
    const continueDiscovery = screen.getByRole('heading', { name: '继续发现' })

    expect(frequentVisits).toBeInTheDocument()
    expect(personalCategories).toBeInTheDocument()
    expect(systemRecommendations).toBeInTheDocument()
    expect(userShares).toBeInTheDocument()
    expect(continueDiscovery).toBeInTheDocument()

    expect(
      frequentVisits.compareDocumentPosition(continueDiscovery) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
