import { render, screen, within } from '@testing-library/vue'

import UIDesignPreviewPage from '../UIDesignPreviewPage.vue'

describe('UI design preview page', () => {
  test('renders distinct homepage style concepts without changing app navigation', () => {
    render(UIDesignPreviewPage, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const section = screen.getByLabelText('趣味风格首页方案')

    expect(within(section).getByRole('heading', { name: '趣味风格首页方案' })).toBeInTheDocument()
    expect(within(section).getByText('K1 可爱治愈 / 书签花园')).toBeInTheDocument()
    expect(within(section).getByText('K2 手绘涂鸦 / 灵感手帐')).toBeInTheDocument()
    expect(within(section).getByText('K3 像素复古 / 书签掌机')).toBeInTheDocument()
    expect(within(section).getByText('K4 日系杂志 / 网站月刊')).toBeInTheDocument()
    expect(within(section).getByText('K5 自然植物 / 资源森林')).toBeInTheDocument()
    expect(within(section).getByText('K6 太空探索 / 网址星图')).toBeInTheDocument()
    expect(within(section).getAllByLabelText(/首页方案$/)).toHaveLength(6)
    expect(screen.getByText('已确认方案')).toBeInTheDocument()
    expect(screen.getAllByText('K6 太空探索 / 网址星图').length).toBeGreaterThan(1)
    expect(screen.getByText('星空底色')).toBeInTheDocument()
  })
})
