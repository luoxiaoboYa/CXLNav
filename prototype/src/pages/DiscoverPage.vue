<template>
  <section class="discover-page">
    <header class="page-header">
      <div>
        <h1>推荐发现</h1>
        <p>把系统和用户推荐收拢到一个列表里，热门只作为标记展示，不再拆成三块。</p>
      </div>
    </header>

    <SearchBar placeholder="搜索推荐专题、用户推荐或热门内容…" />

    <section class="discovery-summary" aria-label="推荐发现概览">
      <article v-for="item in summaryItems" :key="item.label" class="summary-card">
        <strong>{{ item.count }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </section>

    <section class="panel filter-panel">
      <div>
        <span class="filter-label">内容类型</span>
        <div class="filter-row">
          <button
            v-for="type in typeFilters"
            :key="type"
            :class="['filter-chip', { active: activeType === type }]"
            type="button"
            @click="activeType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div>
        <span class="filter-label">排序</span>
        <div class="filter-row">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            :class="['filter-chip', { active: activeSort === option.value }]"
            type="button"
            @click="activeSort = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="panel">
      <SectionHeader title="推荐列表" description="统一按热门度排序，通过来源和热门标记区分内容出处。" />
      <div class="feed-list">
        <article v-for="item in filteredFeed" :key="item.title" class="feed-card">
          <div class="feed-top">
            <div class="feed-meta">
              <span class="type-chip">{{ item.type }}</span>
              <span class="source-chip">来源：{{ item.source }}</span>
              <span v-if="item.hot" class="hot-chip">热门</span>
              <span v-if="item.collected" class="collected-chip">已收藏</span>
            </div>
            <ul class="tag-list">
              <li v-for="tag in item.tags" :key="`${item.title}-${tag}`">{{ tag }}</li>
            </ul>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p class="reason-copy">推荐理由：{{ item.reason }}</p>
          <dl class="recommendation-meta">
            <div>
              <dt>分类</dt>
              <dd>{{ item.category }}</dd>
            </div>
            <div v-if="item.parent">
              <dt>所属主站</dt>
              <dd>{{ item.parent }}</dd>
            </div>
            <div>
              <dt>收藏</dt>
              <dd>{{ item.favoriteCount }}</dd>
            </div>
            <div>
              <dt>打开</dt>
              <dd>{{ item.openCount }}</dd>
            </div>
          </dl>
          <div class="card-actions">
            <button class="primary-action" type="button" @click="selectedRecommendation = item">
              {{ item.collected ? '查看我的站点' : '收藏到我的站点' }}
            </button>
            <button class="ghost-action" type="button">补充推荐理由</button>
            <button class="ghost-action" type="button">举报</button>
          </div>
        </article>
      </div>
    </section>

    <section v-if="selectedRecommendation" class="panel collection-panel" aria-label="推荐收藏确认">
      <div>
        <span class="source-chip">收藏确认</span>
        <h2>{{ selectedRecommendation.title }}</h2>
        <p>从推荐库收藏到我的站点时，只复制公开标题、链接、描述和分类建议；平台标签只作为建议，不自动写入个人标签。</p>
      </div>

      <div class="collection-grid">
        <label>
          <span>保存到分类</span>
          <select>
            <option>{{ selectedRecommendation.category }}</option>
            <option>开发文档</option>
            <option>设计资源</option>
            <option>效率工具</option>
          </select>
        </label>
        <label>
          <span>个人备注</span>
          <input type="text" placeholder="补充只对自己可见的使用场景" />
        </label>
      </div>

      <div class="suggestion-box">
        <strong>平台标签建议</strong>
        <p>{{ selectedRecommendation.tags.join(' / ') }}</p>
      </div>

      <div class="card-actions">
        <button class="primary-action" type="button">确认收藏</button>
        <button class="ghost-action" type="button" @click="selectedRecommendation = null">取消</button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import SearchBar from '../components/SearchBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { discoverFeed } from '../data/discover'

const typeFilters = ['全部', '主站点', '功能站点'] as const
const sortOptions = [
  { label: '热门', value: 'hot' },
  { label: '最新共享', value: 'latest' },
  { label: '收藏量', value: 'favorite' }
] as const

const activeType = ref<(typeof typeFilters)[number]>('全部')
const activeSort = ref<(typeof sortOptions)[number]['value']>('hot')
const selectedRecommendation = ref<(typeof discoverFeed)[number] | null>(null)

const filteredFeed = computed(() => {
  const typedFeed = discoverFeed.filter((item) => activeType.value === '全部' || item.type === activeType.value)

  return [...typedFeed].sort((first, second) => {
    if (activeSort.value === 'favorite') {
      return second.favoriteCount - first.favoriteCount
    }

    if (activeSort.value === 'latest') {
      return discoverFeed.indexOf(first) - discoverFeed.indexOf(second)
    }

    return Number(second.hot) - Number(first.hot) || second.favoriteCount - first.favoriteCount
  })
})

const summaryItems = computed(() => [
  { label: '系统推荐', count: discoverFeed.filter((item) => item.source.includes('系统推荐')).length },
  { label: '用户共享', count: discoverFeed.filter((item) => item.source.includes('用户推荐')).length },
  { label: '主站点', count: discoverFeed.filter((item) => item.type === '主站点').length },
  { label: '功能站点', count: discoverFeed.filter((item) => item.type === '功能站点').length }
])
</script>

<style scoped>
.discover-page {
  display: grid;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
}

.page-header p,
.feed-card p,
.reason-copy,
.recommendation-meta {
  margin: 8px 0 0;
  color: #61685f;
}

.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.collection-panel {
  display: grid;
  gap: 16px;
  border-color: #b8c9be;
  background: #f5fbf8;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.collection-grid label {
  display: grid;
  gap: 8px;
}

.collection-grid input,
.collection-grid select {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
}

.suggestion-box {
  padding: 12px;
  border-radius: 16px;
  background: #ffffff;
}

.discovery-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: grid;
  gap: 4px;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 20px;
  background: #ffffff;
}

.summary-card strong {
  color: #1b6a52;
  font-size: 1.5rem;
}

.summary-card span,
.filter-label {
  color: #61685f;
  font-size: 0.9rem;
}

.filter-panel {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
}

.filter-panel > div {
  display: grid;
  gap: 10px;
}

.filter-row,
.card-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-chip,
.primary-action,
.ghost-action {
  border: 1px solid #d7d2c6;
  border-radius: 999px;
  background: #ffffff;
  color: #1f251f;
  padding: 9px 12px;
  font: inherit;
}

.filter-chip.active,
.primary-action {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

.feed-list {
  display: grid;
  gap: 12px;
}

.feed-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #d7d2c6;
  border-radius: 20px;
  background: #ffffff;
}

.feed-top,
.feed-meta,
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.type-chip,
.source-chip,
.hot-chip,
.collected-chip,
.tag-list li {
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf3ef;
  color: #1b6a52;
  font-size: 0.78rem;
}

.type-chip {
  background: #e7eef9;
  color: #255f9f;
}

.hot-chip {
  background: #f9e7db;
  color: #b35d24;
}

.collected-chip {
  background: #deeee7;
  color: #1b6a52;
}

.reason-copy {
  padding: 12px;
  border-radius: 16px;
  background: #fbf8f2;
}

.recommendation-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.recommendation-meta div {
  padding: 10px;
  border-radius: 14px;
  background: #fbf8f2;
}

.recommendation-meta dt,
.recommendation-meta dd {
  margin: 0;
}

.recommendation-meta dt {
  margin-bottom: 4px;
  color: #1f251f;
  font-weight: 700;
}

h3,
.tag-list {
  margin: 0;
}

.tag-list {
  padding: 0;
  list-style: none;
}

@media (max-width: 960px) {
  .discovery-summary,
  .filter-panel,
  .recommendation-meta {
    display: grid;
    grid-template-columns: 1fr;
  }

  .collection-grid {
    grid-template-columns: 1fr;
  }
}
</style>
