import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

import App from '../../App.vue'
import router from '../../router'

const jsonResponse = (payload: unknown) =>
  Promise.resolve(new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  }))

describe('my sites page', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  test('uses sidebar categories, multi-select tags, icon view toggles, and modal add flow', async () => {
    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(screen.getByRole('heading', { name: '我的站点' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '分类导航' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '开发文档' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '高频' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '学习' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到简洁模式' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到详情模式' })).toBeInTheDocument()
    expect(screen.queryByText('分类概览')).not.toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '切换到详情模式' }))

    const categorySidebar = screen.getByTestId('category-sidebar')
    const contentColumn = screen.getByTestId('sites-content-column')

    expect(categorySidebar).toHaveClass('sidebar-panel')
    expect(categorySidebar).toHaveClass('sticky-sidebar')
    expect(contentColumn).toContainElement(screen.getByText('标签筛选'))
    expect(contentColumn).toContainElement(screen.getByText(/当前展示 \d+ 个站点/))
    expect(contentColumn).toContainElement(screen.getByRole('heading', { name: '浏览结果' }))
    expect(screen.getByLabelText('站点状态概览')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '待整理' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '已归档' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('书签路径').length).toBeGreaterThan(0)
    expect(screen.getAllByText('共享状态').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '共享到推荐库' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: '查看详情' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getAllByRole('link', { name: '查看详情' })[0])
    expect(await screen.findByRole('heading', { name: '站点详情' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'GitHub' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('link', { name: '返回我的站点' }))
    await fireEvent.click(await screen.findByRole('button', { name: '新增站点' }))
    expect(await screen.findByRole('dialog', { name: '新增 / 编辑站点' })).toBeInTheDocument()
  })

  test('loads authenticated personal sites, categories, and tags from the backend', async () => {
    localStorage.setItem('cxsearch_api_token', 'test-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = input.toString()

      if (url.includes('/personal-sites')) {
        return jsonResponse({
          items: [
            {
              id: 'site-backend-docs',
              title: 'Backend Docs',
              url: 'https://example.com/backend',
              normalizedUrl: 'https://example.com/backend',
              faviconUrl: null,
              description: '后端接口文档入口',
              purpose: null,
              personalNote: '联调重点入口',
              category: { id: 'cat-docs', name: 'Docs' },
              bookmarkPath: { id: 'path-api', fullPath: 'Docs / API' },
              tags: [{ id: 'tag-backend', name: 'Backend' }],
              source: 'manual',
              sourcePath: null,
              sourceRecommendationId: null,
              securityStatus: 'safe',
              organizeStatus: 'complete',
              archiveStatus: 'active',
              shareStatus: 'none',
              createdAt: '2026-04-28T01:00:00.000Z',
              updatedAt: '2026-04-28T02:00:00.000Z',
              lastOpenedAt: '2026-04-28T03:00:00.000Z'
            }
          ],
          page: 1,
          pageSize: 20,
          total: 1,
          summary: { activeCount: 1, archivedCount: 0, todoCount: 0 }
        })
      }

      if (url.includes('/categories')) {
        return jsonResponse({
          items: [
            {
              id: 'cat-docs',
              scope: 'personal',
              name: 'Docs',
              sortOrder: 1,
              createdAt: '2026-04-28T01:00:00.000Z',
              updatedAt: '2026-04-28T01:00:00.000Z'
            }
          ],
          total: 1
        })
      }

      if (url.includes('/tags')) {
        return jsonResponse({
          items: [
            {
              id: 'tag-backend',
              scope: 'personal',
              name: 'Backend',
              usageCount: 1,
              createdAt: '2026-04-28T01:00:00.000Z',
              updatedAt: '2026-04-28T01:00:00.000Z'
            }
          ],
          total: 1
        })
      }

      return jsonResponse({})
    })

    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(await screen.findByRole('heading', { name: 'Backend Docs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Docs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument()
    expect(screen.getByText('后端接口文档入口')).toBeInTheDocument()

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/personal-sites'),
        expect.objectContaining({
          headers: expect.any(Headers)
        })
      )
    })
  })

  test('creates a personal site through the backend and refreshes the list', async () => {
    localStorage.setItem('cxsearch_api_token', 'test-token')
    let personalSites: unknown[] = []
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const url = input.toString()

      if (url.includes('/personal-sites') && init?.method === 'POST') {
        personalSites = [
          {
            id: 'site-new',
            title: 'New Remote Site',
            url: 'https://example.com/new',
            normalizedUrl: 'https://example.com/new',
            faviconUrl: null,
            description: '新建远程站点',
            purpose: null,
            personalNote: null,
            category: null,
            bookmarkPath: null,
            tags: [],
            source: 'manual',
            sourcePath: null,
            sourceRecommendationId: null,
            securityStatus: 'unchecked',
            organizeStatus: 'complete',
            archiveStatus: 'active',
            shareStatus: 'none',
            createdAt: '2026-04-28T01:00:00.000Z',
            updatedAt: '2026-04-28T01:00:00.000Z',
            lastOpenedAt: null
          }
        ]
        return jsonResponse({ site: personalSites[0], warnings: [], recommendationMatch: null })
      }

      if (url.includes('/personal-sites')) {
        return jsonResponse({
          items: personalSites,
          page: 1,
          pageSize: 20,
          total: personalSites.length,
          summary: { activeCount: personalSites.length, archivedCount: 0, todoCount: 0 }
        })
      }

      if (url.includes('/categories')) {
        return jsonResponse({ items: [], total: 0 })
      }

      if (url.includes('/tags')) {
        return jsonResponse({ items: [], total: 0 })
      }

      return jsonResponse({})
    })

    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/personal-sites'), expect.any(Object)))
    await fireEvent.click(screen.getByRole('button', { name: '新增站点' }))
    await fireEvent.update(await screen.findByLabelText('站点名称'), 'New Remote Site')
    await fireEvent.update(screen.getByLabelText('站点链接'), 'https://example.com/new')
    await fireEvent.update(screen.getByLabelText('简介'), '新建远程站点')
    await fireEvent.click(screen.getByRole('button', { name: '保存站点' }))

    expect(await screen.findByRole('heading', { name: 'New Remote Site' })).toBeInTheDocument()
    expect(screen.getByText('新建远程站点')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/personal-sites'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  test('opens authenticated personal site details from the backend list', async () => {
    localStorage.setItem('cxsearch_api_token', 'test-token')
    const backendSite = {
      id: 'site-backend-docs',
      title: 'Backend Docs',
      url: 'https://example.com/backend',
      normalizedUrl: 'https://example.com/backend',
      faviconUrl: null,
      description: '后端接口文档入口',
      purpose: null,
      personalNote: '详情页展示后端备注',
      category: { id: 'cat-docs', name: 'Docs' },
      bookmarkPath: { id: 'path-api', fullPath: 'Docs / API' },
      tags: [{ id: 'tag-backend', name: 'Backend' }],
      source: 'manual',
      sourcePath: null,
      sourceRecommendationId: null,
      securityStatus: 'safe',
      organizeStatus: 'complete',
      archiveStatus: 'active',
      shareStatus: 'none',
      createdAt: '2026-04-28T01:00:00.000Z',
      updatedAt: '2026-04-28T02:00:00.000Z',
      lastOpenedAt: '2026-04-28T03:00:00.000Z'
    }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = input.toString()

      if (url.includes('/personal-sites/site-backend-docs')) {
        return jsonResponse({
          site: backendSite,
          recommendationInfo: { exists: false },
          validationLatest: null
        })
      }

      if (url.includes('/personal-sites')) {
        return jsonResponse({
          items: [backendSite],
          page: 1,
          pageSize: 20,
          total: 1,
          summary: { activeCount: 1, archivedCount: 0, todoCount: 0 }
        })
      }

      if (url.includes('/categories')) {
        return jsonResponse({ items: [backendSite.category], total: 1 })
      }

      if (url.includes('/tags')) {
        return jsonResponse({
          items: [
            {
              id: 'tag-backend',
              scope: 'personal',
              name: 'Backend',
              usageCount: 1,
              createdAt: '2026-04-28T01:00:00.000Z',
              updatedAt: '2026-04-28T01:00:00.000Z'
            }
          ],
          total: 1
        })
      }

      return jsonResponse({})
    })

    await router.push('/my-sites')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router]
      }
    })

    expect(await screen.findByRole('heading', { name: 'Backend Docs' })).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('link', { name: '查看详情' }))

    expect(await screen.findByText('详情页展示后端备注')).toBeInTheDocument()
    expect(screen.getByText('Docs / API')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/personal-sites/site-backend-docs'),
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    )
  })
})
