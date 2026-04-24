<template>
  <section class="sites-page">
    <header class="page-header">
      <div>
        <h1>我的站点</h1>
        <p>把完整浏览、筛选和整理动作放在这里，首页只保留最高频入口。</p>
      </div>

      <div class="header-actions">
        <button class="add-button" type="button" @click="openAddModal">新增站点</button>

        <div class="mode-switch" aria-label="显示模式" role="group">
          <button
            :aria-pressed="viewMode === 'simple'"
            :class="['mode-button', { active: viewMode === 'simple' }]"
            aria-label="切换到简洁模式"
            title="切换到简洁模式"
            type="button"
            @click="viewMode = 'simple'"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <rect x="4" y="5" width="6" height="6" rx="1.5" />
              <rect x="14" y="5" width="6" height="6" rx="1.5" />
              <rect x="4" y="13" width="6" height="6" rx="1.5" />
              <rect x="14" y="13" width="6" height="6" rx="1.5" />
            </svg>
          </button>
          <button
            :aria-pressed="viewMode === 'detail'"
            :class="['mode-button', { active: viewMode === 'detail' }]"
            aria-label="切换到详情模式"
            title="切换到详情模式"
            type="button"
            @click="viewMode = 'detail'"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5 7h14" />
              <path d="M5 12h14" />
              <path d="M5 17h14" />
              <circle cx="8" cy="7" r="1.5" />
              <circle cx="8" cy="12" r="1.5" />
              <circle cx="8" cy="17" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <SearchBar placeholder="搜索我的站点、分类或标签…" />

    <div class="layout">
      <aside data-testid="category-sidebar" class="panel sidebar-panel sticky-sidebar">
        <SectionHeader title="分类" description="用侧边栏承接分类浏览，筛选动作更直观。" />
        <nav aria-label="分类导航" class="category-nav">
          <button
            aria-label="全部分类"
            :class="['category-button', { active: activeCategory === '全部分类' }]"
            type="button"
            @click="activeCategory = '全部分类'"
          >
            <span>全部分类</span>
            <strong aria-hidden="true">{{ mySiteEntries.length }}</strong>
          </button>
          <button
            v-for="item in categoryItems"
            :key="item.name"
            :aria-label="item.name"
            :class="['category-button', { active: activeCategory === item.name }]"
            type="button"
            @click="activeCategory = item.name"
          >
            <span>{{ item.name }}</span>
            <strong aria-hidden="true">{{ item.count }}</strong>
          </button>
        </nav>
      </aside>

      <section data-testid="sites-content-column" class="content-column">
        <section class="toolbar panel">
          <div class="toolbar-group">
            <span class="toolbar-label">标签筛选</span>
            <div class="tag-filter">
              <button
                v-for="tag in siteTags"
                :key="tag"
                :class="['tag-chip', { active: selectedTags.includes(tag) }]"
                type="button"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <p class="result-summary">当前展示 {{ filteredSites.length }} 个站点</p>
        </section>

        <section class="panel">
          <SectionHeader
            title="浏览结果"
            description="分类放左侧，标签用 Tag 多选，新增和编辑都统一进入弹窗。"
          />

          <div v-if="viewMode === 'simple'" class="card-grid">
            <article v-for="site in filteredSites" :key="site.title" class="site-card">
              <div class="card-top">
                <RouterLink class="site-link" :to="getSiteDetailPath(site.title)">
                  <h2>{{ site.title }}</h2>
                </RouterLink>
                <div class="card-actions">
                  <RouterLink class="ghost-action" :to="getSiteDetailPath(site.title)">查看详情</RouterLink>
                  <button class="ghost-action" type="button" @click="openEditModal(site)">编辑</button>
                </div>
              </div>
              <p>{{ site.description }}</p>
              <ul class="card-tags">
                <li>{{ site.category }}</li>
                <li v-for="tag in site.tags" :key="`${site.title}-${tag}`">{{ tag }}</li>
              </ul>
            </article>
          </div>

          <div v-else class="detail-list">
            <article v-for="site in filteredSites" :key="site.title" class="detail-card">
              <div class="detail-top">
                <div>
                  <RouterLink class="site-link" :to="getSiteDetailPath(site.title)">
                    <h2>{{ site.title }}</h2>
                  </RouterLink>
                  <p>{{ site.description }}</p>
                </div>
                <div class="detail-actions">
                  <span class="updated-at">{{ site.updatedAt }}</span>
                  <RouterLink class="ghost-action" :to="getSiteDetailPath(site.title)">查看详情</RouterLink>
                  <button class="ghost-action" type="button" @click="openEditModal(site)">编辑</button>
                </div>
              </div>
              <p class="detail-note">{{ site.detail }}</p>
              <ul class="detail-tags">
                <li>{{ site.category }}</li>
                <li v-for="tag in site.tags" :key="`${site.title}-detail-${tag}`">{{ tag }}</li>
              </ul>
            </article>
          </div>
        </section>
      </section>
    </div>

    <SiteEditorModal :open="isEditorOpen" :site="editingSite" @close="closeModal" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import SearchBar from '../components/SearchBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import SiteEditorModal from '../components/SiteEditorModal.vue'
import { getSiteDetailPath, mySiteEntries, siteTags, type SiteRecord } from '../data/sites'

const viewMode = ref<'simple' | 'detail'>('simple')
const activeCategory = ref('全部分类')
const selectedTags = ref<string[]>([])
const isEditorOpen = ref(false)
const editingSite = ref<SiteRecord | undefined>()

const categoryItems = computed(() => {
  const counts = new Map<string, number>()

  mySiteEntries.forEach((site) => {
    counts.set(site.category, (counts.get(site.category) ?? 0) + 1)
  })

  return Array.from(counts.entries()).map(([name, count]) => ({
    name,
    count
  }))
})

const filteredSites = computed(() =>
  mySiteEntries.filter((site) => {
    const matchesCategory =
      activeCategory.value === '全部分类' || site.category === activeCategory.value
    const matchesTags =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((tag) => site.tags.includes(tag))

    return matchesCategory && matchesTags
  })
)

const toggleTag = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((item) => item !== tag)
    : [...selectedTags.value, tag]
}

const openAddModal = () => {
  editingSite.value = undefined
  isEditorOpen.value = true
}

const openEditModal = (site: SiteRecord) => {
  editingSite.value = site
  isEditorOpen.value = true
}

const closeModal = () => {
  editingSite.value = undefined
  isEditorOpen.value = false
}
</script>

<style scoped>
.sites-page {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
}

.page-header h1,
.site-card h2,
.detail-card h2 {
  margin: 0;
}

.page-header p,
.site-card p,
.detail-card p,
.result-summary {
  margin: 8px 0 0;
  color: #61685f;
}

.header-actions,
.mode-switch,
.tag-filter,
.card-top,
.detail-actions,
.card-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-actions {
  flex-wrap: wrap;
  justify-content: end;
}

.add-button,
.mode-button,
.tag-chip,
.ghost-action {
  border: 1px solid #d7d2c6;
  background: #ffffff;
  color: #1f251f;
  font: inherit;
}

.add-button,
.ghost-action {
  border-radius: 999px;
  padding: 10px 14px;
}

.add-button {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

.mode-button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  padding: 0;
}

.mode-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
}

.mode-button rect {
  fill: currentColor;
  stroke: none;
}

.mode-button.active {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

.toolbar,
.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.toolbar-group {
  display: grid;
  gap: 10px;
}

.toolbar-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.tag-filter {
  flex-wrap: wrap;
}

.tag-chip {
  border-radius: 999px;
  padding: 8px 12px;
}

.tag-chip.active {
  background: #deeee7;
  border-color: #1b6a52;
  color: #1b6a52;
}

.layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.content-column,
.sidebar-panel,
.category-nav,
.detail-list {
  display: grid;
  gap: 12px;
}

.sticky-sidebar {
  position: sticky;
  top: 24px;
}

.category-button {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  border: 1px solid #d7d2c6;
  border-radius: 16px;
  background: #fbf8f2;
  color: #1f251f;
  padding: 12px 14px;
  font: inherit;
  text-align: left;
}

.category-button.active {
  background: #deeee7;
  border-color: #1b6a52;
  color: #1b6a52;
}

.card-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.site-card,
.detail-card {
  padding: 18px;
  border: 1px solid #d7d2c6;
  border-radius: 20px;
  background: #ffffff;
}

.card-top,
.detail-top {
  justify-content: space-between;
  align-items: start;
}

.card-actions {
  flex-wrap: wrap;
  justify-content: end;
}

.site-link {
  color: inherit;
  text-decoration: none;
}

.site-link h2 {
  transition: color 0.15s ease;
}

.site-link:hover h2 {
  color: #1b6a52;
}

.ghost-action {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
}

.card-tags,
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.card-tags li,
.detail-tags li {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1efe7;
}

.detail-top {
  display: flex;
  gap: 16px;
}

.detail-actions {
  align-items: end;
  flex-direction: column;
}

.updated-at {
  color: #8a907f;
  font-size: 0.85rem;
  white-space: nowrap;
}

.detail-note {
  line-height: 1.6;
}

@media (max-width: 960px) {
  .page-header,
  .layout,
  .card-grid,
  .detail-top {
    grid-template-columns: 1fr;
    display: grid;
  }

  .toolbar {
    display: grid;
  }

  .header-actions {
    justify-content: start;
  }

  .detail-actions {
    align-items: start;
  }

  .sticky-sidebar {
    position: static;
  }
}
</style>
