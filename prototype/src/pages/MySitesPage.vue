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

    <section class="status-overview" aria-label="站点状态概览">
      <article v-for="item in statusOverview" :key="item.label" class="status-card">
        <strong>{{ item.count }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </section>

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

          <div class="toolbar-group">
            <span class="toolbar-label">状态筛选</span>
            <div class="tag-filter">
              <button
                v-for="option in statusFilters"
                :key="option.value"
                :class="['tag-chip', { active: activeStatus === option.value }]"
                type="button"
                @click="activeStatus = option.value"
              >
                {{ option.label }}
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
              <div class="site-meta-row">
                <span>{{ site.bookmarkPath }}</span>
                <span>{{ getStatusLabel(site.organizeStatus) }}</span>
                <span v-if="site.archiveStatus === 'archived'">已归档</span>
              </div>
              <ul class="card-tags">
                <li>{{ site.category }}</li>
                <li v-for="tag in site.tags" :key="`${site.title}-${tag}`">{{ tag }}</li>
              </ul>
              <div class="quick-actions">
                <button class="ghost-action" type="button">打开</button>
                <button class="ghost-action" type="button">{{ site.archiveStatus === 'archived' ? '恢复' : '归档' }}</button>
                <button class="ghost-action" type="button" :disabled="!canShare(site)">共享到推荐库</button>
              </div>
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
              <dl class="detail-meta">
                <div>
                  <dt>书签路径</dt>
                  <dd>{{ site.bookmarkPath }}</dd>
                </div>
                <div>
                  <dt>最近打开</dt>
                  <dd>{{ site.lastOpenedAt }}</dd>
                </div>
                <div>
                  <dt>安全状态</dt>
                  <dd>{{ getSecurityLabel(site.securityStatus) }}</dd>
                </div>
                <div>
                  <dt>共享状态</dt>
                  <dd>{{ getShareLabel(site.shareStatus) }}</dd>
                </div>
              </dl>
              <p v-if="site.recommendationHint" class="recommendation-hint">
                {{ site.recommendationHint }} · 平台标签只作为建议，不会自动写入个人标签。
              </p>
              <ul class="detail-tags">
                <li>{{ site.category }}</li>
                <li v-for="tag in site.tags" :key="`${site.title}-detail-${tag}`">{{ tag }}</li>
              </ul>
              <div class="quick-actions">
                <button class="ghost-action" type="button">打开</button>
                <button class="ghost-action" type="button">补充说明</button>
                <button class="ghost-action" type="button">重新检测</button>
                <button class="ghost-action" type="button" :disabled="!canShare(site)">共享到推荐库</button>
              </div>
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
const activeStatus = ref<'all' | 'active' | 'todo' | 'archived' | 'link_problem' | 'risky'>('all')
const isEditorOpen = ref(false)
const editingSite = ref<SiteRecord | undefined>()

const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '正常', value: 'active' },
  { label: '待整理', value: 'todo' },
  { label: '已归档', value: 'archived' },
  { label: '链接异常', value: 'link_problem' },
  { label: '风险', value: 'risky' }
] as const

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
    const matchesStatus =
      activeStatus.value === 'all' ||
      (activeStatus.value === 'active' && site.archiveStatus === 'active') ||
      (activeStatus.value === 'todo' && site.organizeStatus !== 'complete') ||
      (activeStatus.value === 'archived' && site.archiveStatus === 'archived') ||
      (activeStatus.value === 'link_problem' && site.securityStatus === 'unreachable') ||
      (activeStatus.value === 'risky' && ['risky', 'blocked'].includes(site.securityStatus))

    return matchesCategory && matchesTags && matchesStatus
  })
)

const statusOverview = computed(() => [
  { label: '全部站点', count: mySiteEntries.length },
  { label: '待整理', count: mySiteEntries.filter((site) => site.organizeStatus !== 'complete').length },
  { label: '已归档', count: mySiteEntries.filter((site) => site.archiveStatus === 'archived').length },
  { label: '链接异常', count: mySiteEntries.filter((site) => site.securityStatus === 'unreachable').length }
])

const statusLabels: Record<SiteRecord['organizeStatus'], string> = {
  complete: '信息完整',
  missing_description: '缺少说明',
  missing_tags: '缺少标签',
  duplicate_suspected: '疑似重复',
  link_problem: '链接异常',
  path_pending: '路径待确认',
  stale: '长期未打开'
}

const securityLabels: Record<SiteRecord['securityStatus'], string> = {
  unchecked: '未校验',
  checking: '校验中',
  safe: '正常',
  unreachable: '无法访问',
  risky: '存在风险',
  blocked: '已阻止'
}

const shareLabels: Record<SiteRecord['shareStatus'], string> = {
  none: '未共享',
  pending: '审核中',
  published: '已发布',
  rejected: '审核拒绝'
}

const getStatusLabel = (status: SiteRecord['organizeStatus']) => statusLabels[status]
const getSecurityLabel = (status: SiteRecord['securityStatus']) => securityLabels[status]
const getShareLabel = (status: SiteRecord['shareStatus']) => shareLabels[status]

const canShare = (site: SiteRecord) => site.securityStatus === 'safe' && site.archiveStatus === 'active'

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
.card-actions,
.quick-actions,
.site-meta-row {
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

.status-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.status-card {
  display: grid;
  gap: 4px;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 20px;
  background: #ffffff;
}

.status-card strong {
  color: #1b6a52;
  font-size: 1.5rem;
}

.status-card span,
.site-meta-row,
.recommendation-hint,
.detail-meta {
  color: #61685f;
  font-size: 0.88rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
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

.ghost-action:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.site-meta-row,
.quick-actions {
  flex-wrap: wrap;
  margin-top: 14px;
}

.site-meta-row span,
.recommendation-hint {
  border-radius: 999px;
  background: #f8f2e8;
  padding: 6px 10px;
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

.detail-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0 0;
}

.detail-meta div {
  padding: 12px;
  border-radius: 16px;
  background: #fbf8f2;
}

.detail-meta dt,
.detail-meta dd {
  margin: 0;
}

.detail-meta dt {
  margin-bottom: 4px;
  font-weight: 700;
  color: #1f251f;
}

.recommendation-hint {
  margin: 14px 0 0;
  border-radius: 16px;
  background: #deeee7;
  color: #1b6a52;
}

@media (max-width: 960px) {
  .page-header,
  .layout,
  .card-grid,
  .detail-top,
  .status-overview,
  .detail-meta {
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
