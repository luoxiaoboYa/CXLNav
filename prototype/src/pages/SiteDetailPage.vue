<template>
  <section class="site-detail-page">
    <header class="page-header">
      <div>
        <h2 class="eyebrow">站点详情</h2>
        <h1>{{ site?.title ?? '未找到站点' }}</h1>
        <p class="page-summary">
          {{
            site?.description ??
            '当前原型里没有找到对应站点，后续开发时这里会接真实数据和异常状态处理。'
          }}
        </p>
      </div>

      <div class="header-actions">
        <RouterLink class="ghost-link" to="/my-sites">返回我的站点</RouterLink>
      </div>
    </header>

    <section v-if="site" class="detail-layout">
      <article class="panel hero-panel">
        <div class="hero-top">
          <span class="meta-chip">{{ site.category }}</span>
          <span class="updated-at">{{ site.updatedAt }}</span>
        </div>

        <p class="detail-copy">{{ site.detail }}</p>

        <ul class="tag-list">
          <li v-for="tag in site.tags" :key="tag">{{ tag }}</li>
        </ul>
      </article>

      <section class="detail-grid">
        <article class="panel">
          <h2>推荐保留信息</h2>
          <ul class="info-list">
            <li>站点名称：{{ site.title }}</li>
            <li>分类：{{ site.category }}</li>
            <li>标签：{{ site.tags.join(' / ') }}</li>
            <li>最近更新时间：{{ site.updatedAt }}</li>
          </ul>
        </article>

        <article class="panel">
          <h2>后续开发提示</h2>
          <ul class="info-list">
            <li>这里适合继续补站点截图、收藏来源和备注历史。</li>
            <li>编辑入口可以后续接回弹窗表单，保持录入与详情一致。</li>
            <li>相关推荐可以按同分类或同标签在右侧扩展。</li>
          </ul>
        </article>
      </section>
    </section>

    <section v-else class="panel empty-state">
      <h2>站点不存在</h2>
      <p>请返回我的站点重新选择。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { findSiteByTitle } from '../data/sites'

const route = useRoute()
const siteTitle = computed(() => String(route.params.siteTitle ?? ''))
const site = computed(() => findSiteByTitle(siteTitle.value))
</script>

<style scoped>
.site-detail-page,
.detail-layout,
.detail-grid {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
}

.eyebrow,
.page-summary,
.updated-at,
.empty-state p {
  margin: 0;
  color: #61685f;
}

.eyebrow {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1b6a52;
}

h1,
h2 {
  margin: 0;
}

.page-summary {
  margin-top: 8px;
  max-width: 720px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: end;
}

.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.hero-panel {
  background: linear-gradient(135deg, rgba(27, 106, 82, 0.08), rgba(255, 253, 248, 0.96));
}

.hero-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.meta-chip,
.tag-list li,
.ghost-link {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d7d2c6;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #1f251f;
  text-decoration: none;
  font: inherit;
}

.detail-copy {
  margin: 16px 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
}

.tag-list,
.info-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-list {
  display: grid;
  gap: 10px;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.empty-state {
  display: grid;
  gap: 8px;
}

@media (max-width: 960px) {
  .page-header,
  .detail-grid,
  .hero-top {
    grid-template-columns: 1fr;
    display: grid;
  }

  .header-actions {
    justify-content: start;
  }
}
</style>
