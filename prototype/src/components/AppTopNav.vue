<template>
  <header class="top-nav">
    <div class="brand">CXSearch</div>

    <nav aria-label="主导航" class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/my-sites">我的站点</RouterLink>
      <RouterLink to="/discover">推荐发现</RouterLink>
    </nav>

    <div class="context-info" aria-label="日期与天气">
      <span class="info-chip">4月23日 周四</span>
      <span class="info-chip weather-chip">天气 多云 24°C</span>
    </div>

    <div class="actions">
      <button type="button" aria-label="搜索">搜索</button>
      <ThemeToggle />
      <RouterLink aria-label="设置" to="/settings">设置</RouterLink>
      <RouterLink aria-label="注册 / 登录" to="/auth">注册 / 登录</RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import ThemeToggle from './ThemeToggle.vue'
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
  box-shadow: 0 14px 42px rgba(8, 11, 31, 0.32);
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0;
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

@media (max-width: 1120px) {
  .top-nav {
    grid-template-columns: 160px 1fr auto;
  }

  .context-info {
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
