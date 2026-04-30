<template>
  <header class="top-nav" :class="{ 'auth-nav': isAuthRoute }">
    <RouterLink class="brand" to="/">CXSearch</RouterLink>

    <nav v-if="!isAuthRoute" aria-label="主导航" class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/my-sites">我的站点</RouterLink>
      <RouterLink to="/discover">推荐发现</RouterLink>
    </nav>

    <div class="context-info" aria-label="日期与天气">
      <span v-if="!isAuthRoute" class="info-chip">4月23日 周四</span>
      <span class="info-chip weather-chip">天气 多云 24°C</span>
    </div>

    <div class="actions">
      <button v-if="!isAuthRoute" type="button" aria-label="搜索">搜索</button>
      <ThemeToggle />
      <RouterLink v-if="!isAuthRoute && isAuthenticated" aria-label="设置" to="/settings">设置</RouterLink>
      <RouterLink v-if="!isAuthRoute || auth.state.user" :aria-label="authActionLabel" :to="authActionTarget">
        {{ authActionLabel }}
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '../services/auth'

const auth = useAuth()
const route = useRoute()
const isAuthRoute = computed(() => route.path === '/auth')
const isAuthenticated = computed(() => Boolean(auth.state.user))
const authActionLabel = computed(() => {
  const user = auth.state.user
  return user?.nickname || user?.username || user?.email || '注册 / 登录'
})
const authActionTarget = computed(() => auth.state.user ? '/settings' : '/auth')

onMounted(() => {
  void auth.loadMe()
})
</script>

<style scoped>
.top-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 160px auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--nav-background);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(8, 11, 31, 0.18);
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0;
  text-decoration: none;
}

.nav-links,
.context-info,
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.context-info {
  justify-content: center;
  flex-wrap: wrap;
}

.nav-links a,
.brand,
.info-chip,
.actions a,
.actions button {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--control-background);
  color: var(--color-text);
  padding: 8px 12px;
  text-decoration: none;
  font: inherit;
  line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
}

.nav-links a:hover,
.brand:hover,
.actions a:hover,
.actions button:hover,
.nav-links a.router-link-active {
  border-color: rgba(139, 233, 253, 0.62);
  background: var(--control-background-hover);
  color: var(--color-text);
}

.info-chip {
  color: var(--color-text-muted);
}

.weather-chip {
  background: rgba(139, 233, 253, 0.1);
  color: var(--color-accent);
}

.auth-nav {
  grid-template-columns: 160px 1fr auto;
}

.auth-nav .context-info {
  justify-content: center;
}

@media (max-width: 1120px) {
  .top-nav:not(.auth-nav) {
    grid-template-columns: 160px 1fr auto;
  }

  .top-nav:not(.auth-nav) .context-info {
    grid-column: 2 / 4;
    justify-content: flex-start;
  }
}

@media (max-width: 860px) {
  .top-nav {
    grid-template-columns: 1fr;
    position: static;
  }

  .nav-links,
  .context-info,
  .actions {
    flex-wrap: wrap;
  }
}
</style>
