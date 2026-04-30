import { reactive } from 'vue'

import { api, getStoredToken, setStoredToken, type AuthUser } from './api'

type AuthState = {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string
}

const state = reactive<AuthState>({
  token: getStoredToken(),
  user: null,
  loading: false,
  error: ''
})

const setSession = (token: string | null, user: AuthUser | null) => {
  state.token = token
  state.user = user
  setStoredToken(token)
}

export const resetAuthState = () => {
  setSession(null, null)
  state.loading = false
  state.error = ''
}

export const hasAuthSession = () => Boolean(state.token || getStoredToken())

export const useAuth = () => {
  const login = async (identifier: string, password: string) => {
    state.loading = true
    state.error = ''
    try {
      const response = await api.login({ identifier, password })
      setSession(response.token, response.user)
      return response.user
    } catch (error) {
      state.error = error instanceof Error ? error.message : '登录失败'
      throw error
    } finally {
      state.loading = false
    }
  }

  const register = async (username: string, email: string, password: string, nickname: string) => {
    state.loading = true
    state.error = ''
    try {
      const response = await api.register({ username, email, password, nickname })
      setSession(response.token, response.user)
      return response.user
    } catch (error) {
      state.error = error instanceof Error ? error.message : '注册失败'
      throw error
    } finally {
      state.loading = false
    }
  }

  const loadMe = async () => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setSession(null, null)
      return null
    }

    if (state.token !== storedToken) {
      state.token = storedToken
      state.user = null
    }

    if (state.user) {
      return state.user
    }

    try {
      const response = await api.me()
      state.user = response.user
      return response.user
    } catch {
      setSession(null, null)
      return null
    }
  }

  const logout = async () => {
    await api.logout()
    setSession(null, null)
  }

  return {
    state,
    login,
    register,
    loadMe,
    logout
  }
}
