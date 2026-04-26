export type AuthUser = {
  id: string
  email: string
  nickname: string
  avatarUrl: string | null
  role: string
  status: string
}

export type CategoryDto = {
  id: string
  scope: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type TagDto = {
  id: string
  scope: string
  name: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

export type PersonalSiteDto = {
  id: string
  title: string
  url: string
  normalizedUrl: string
  faviconUrl: string | null
  description: string | null
  purpose: string | null
  personalNote: string | null
  category: { id: string; name: string } | null
  bookmarkPath: { id: string; fullPath: string } | null
  tags: Array<{ id: string; name: string }>
  source: string
  sourcePath: string | null
  sourceRecommendationId: string | null
  securityStatus: string
  organizeStatus: string
  archiveStatus: string
  shareStatus: string
  createdAt: string
  updatedAt: string
  lastOpenedAt: string | null
}

export type SitePayload = {
  title?: string
  url: string
  description?: string
  purpose?: string
  personalNote?: string
  categoryId?: string
  bookmarkPathId?: string
  tagIds?: string[]
  source?: string
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8080/api/v1'
const TOKEN_KEY = 'cxsearch_api_token'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(TOKEN_KEY)
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  const token = getStoredToken()

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = payload?.error?.message ?? `请求失败：${response.status}`
    throw new Error(message)
  }

  return payload as T
}

export const api = {
  async register(payload: { email: string; password: string; nickname: string }) {
    const response = await request<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    setStoredToken(response.token)
    return response
  },

  async login(payload: { email: string; password: string }) {
    const response = await request<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    setStoredToken(response.token)
    return response
  },

  me() {
    return request<{ user: AuthUser }>('/auth/me')
  },

  logout() {
    setStoredToken(null)
    return Promise.resolve({ success: true })
  },

  listCategories() {
    return request<{ items: CategoryDto[]; total: number }>('/categories?scope=personal')
  },

  createCategory(payload: { name: string; scope?: string; sortOrder?: number }) {
    return request<{ category: CategoryDto }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ scope: 'personal', ...payload })
    })
  },

  updateCategory(categoryId: string, payload: { name?: string; sortOrder?: number }) {
    return request<{ category: CategoryDto }>(`/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  },

  deleteCategory(categoryId: string) {
    return request<{ success: boolean }>(`/categories/${categoryId}`, { method: 'DELETE' })
  },

  listTags() {
    return request<{ items: TagDto[]; total: number }>('/tags?scope=personal')
  },

  createTag(payload: { name: string; scope?: string }) {
    return request<{ tag: TagDto }>('/tags', {
      method: 'POST',
      body: JSON.stringify({ scope: 'personal', ...payload })
    })
  },

  updateTag(tagId: string, payload: { name: string }) {
    return request<{ tag: TagDto }>(`/tags/${tagId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  },

  deleteTag(tagId: string) {
    return request<{ success: boolean }>(`/tags/${tagId}`, { method: 'DELETE' })
  },

  listPersonalSites(params = new URLSearchParams()) {
    const query = params.toString()
    return request<{
      items: PersonalSiteDto[]
      page: number
      pageSize: number
      total: number
      summary: { activeCount: number; archivedCount: number; todoCount: number }
    }>(`/personal-sites${query ? `?${query}` : ''}`)
  },

  createPersonalSite(payload: SitePayload) {
    return request<{ site: PersonalSiteDto; warnings: unknown[]; recommendationMatch: unknown | null }>('/personal-sites', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  updatePersonalSite(siteId: string, payload: SitePayload) {
    return request<{ site: PersonalSiteDto }>(`/personal-sites/${siteId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  },

  deletePersonalSite(siteId: string) {
    return request<{ success: boolean }>(`/personal-sites/${siteId}?confirmShared=true`, { method: 'DELETE' })
  }
}
