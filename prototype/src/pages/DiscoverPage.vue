<template>
  <section class="discover-page">
    <header class="page-header">
      <div>
        <h1>推荐发现</h1>
        <p>把系统和用户推荐收拢到一个列表里，热门只作为标记展示，不再拆成三块。</p>
      </div>
    </header>

    <SearchBar placeholder="搜索推荐专题、用户推荐或热门内容…" />

    <section class="panel">
      <SectionHeader title="推荐列表" description="统一按热门度排序，通过来源和热门标记区分内容出处。" />
      <div class="feed-list">
        <article v-for="item in discoverFeed" :key="item.title" class="feed-card">
          <div class="feed-top">
            <div class="feed-meta">
              <span class="source-chip">来源：{{ item.source }}</span>
              <span v-if="item.hot" class="hot-chip">热门</span>
            </div>
            <ul class="tag-list">
              <li v-for="tag in item.tags" :key="`${item.title}-${tag}`">{{ tag }}</li>
            </ul>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import SearchBar from '../components/SearchBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { discoverFeed } from '../data/discover'
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
.feed-card p {
  margin: 8px 0 0;
  color: #61685f;
}

.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
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

.source-chip,
.hot-chip,
.tag-list li {
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf3ef;
  color: #1b6a52;
  font-size: 0.78rem;
}

.hot-chip {
  background: #f9e7db;
  color: #b35d24;
}

h3,
.tag-list {
  margin: 0;
}

.tag-list {
  padding: 0;
  list-style: none;
}
</style>
