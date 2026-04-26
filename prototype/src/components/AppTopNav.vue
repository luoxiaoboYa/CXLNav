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
      <RouterLink aria-label="设置" to="/settings">设置</RouterLink>`r`n      <RouterLink aria-label="设计稿" to="/ui-design">设计稿</RouterLink>
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
  display: grid;
  grid-template-columns: 160px auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #d7d2c6;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
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
  border: 1px solid #d7d2c6;
  border-radius: 999px;
  background: #ffffff;
  color: #1f251f;
  padding: 8px 12px;
  text-decoration: none;
  font: inherit;
}

.info-chip {
  color: #526059;
}

.weather-chip {
  background: #f4f7f4;
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
  }

  .nav-links,
  .context-info,
  .actions {
    flex-wrap: wrap;
  }
}
</style>
