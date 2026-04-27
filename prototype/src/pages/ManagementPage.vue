<template>
  <section class="management-page">
    <header class="page-header">
      <div>
        <span class="console-label">轨道控制台</span>
        <h1>管理中心</h1>
        <p>用一张维护星图收口站点、分类、标签、安全和导入导出等低频维护动作。</p>
      </div>

      <div class="console-metrics" aria-label="维护星图">
        <article>
          <span>维护星图</span>
          <strong>{{ panelCount }}</strong>
        </article>
        <article>
          <span>当前轨道</span>
          <strong>{{ activeItem }}</strong>
        </article>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar-panel">
        <ManagementSidebar :active-item="activeItem" @select="activeItem = $event" />
      </aside>

      <div class="main-column panel" :class="{ 'hero-panel': activeItem === '站点管理' }">
        <component :is="activePanel" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import CategoryManagementPanel from '../components/management/CategoryManagementPanel.vue'
import AccountSecurityPanel from '../components/management/AccountSecurityPanel.vue'
import BookmarkPathManagementPanel from '../components/management/BookmarkPathManagementPanel.vue'
import DisplayPreferencesPanel from '../components/management/DisplayPreferencesPanel.vue'
import ImportExportPanel from '../components/management/ImportExportPanel.vue'
import ManagementSidebar from '../components/management/ManagementSidebar.vue'
import OrganizeCenterPanel from '../components/management/OrganizeCenterPanel.vue'
import PersonalCenterPanel from '../components/management/PersonalCenterPanel.vue'
import PluginManagementPanel from '../components/management/PluginManagementPanel.vue'
import RecycleBinPanel from '../components/management/RecycleBinPanel.vue'
import ShareManagementPanel from '../components/management/ShareManagementPanel.vue'
import SiteManagementPanel from '../components/management/SiteManagementPanel.vue'
import TagManagementPanel from '../components/management/TagManagementPanel.vue'

const activeItem = ref('站点管理')

const panelMap = {
  站点管理: SiteManagementPanel,
  待整理中心: OrganizeCenterPanel,
  分类管理: CategoryManagementPanel,
  标签管理: TagManagementPanel,
  书签路径管理: BookmarkPathManagementPanel,
  '分享 / 推荐管理': ShareManagementPanel,
  个人中心: PersonalCenterPanel,
  账号安全: AccountSecurityPanel,
  插件管理: PluginManagementPanel,
  回收站: RecycleBinPanel,
  '导入 / 导出': ImportExportPanel,
  显示与偏好: DisplayPreferencesPanel
} as const

const activePanel = computed(() => panelMap[activeItem.value as keyof typeof panelMap])
const panelCount = computed(() => Object.keys(panelMap).length)
</script>

<style scoped>
.management-page {
  --management-surface: var(--panel-background, rgba(17, 24, 59, 0.84));
  --management-surface-strong: var(--panel-strong-background, linear-gradient(135deg, rgba(24, 35, 90, 0.96), rgba(17, 24, 59, 0.88)));
  --management-control: var(--control-background, rgba(24, 35, 90, 0.76));
  --management-muted: var(--color-text-muted, #9aa8d4);
  --management-text: var(--color-text, #edf3ff);
  --management-border: var(--color-border, rgba(139, 233, 253, 0.22));
  --management-accent: var(--color-accent, #8be9fd);
  --management-primary: var(--color-primary, #6d5dfc);
  display: grid;
  gap: 22px;
}

.page-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: stretch;
  padding: 24px;
  border: 1px solid var(--management-border);
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 22%, rgba(139, 233, 253, 0.18), transparent 28%),
    radial-gradient(circle at 86% 12%, rgba(109, 93, 252, 0.22), transparent 28%),
    var(--management-surface-strong);
  box-shadow: var(--shadow-glow, 0 18px 70px rgba(61, 90, 254, 0.22));
}

.page-header::after {
  content: "";
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 22px;
  pointer-events: none;
}

.console-label {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 10px;
  border: 1px solid rgba(139, 233, 253, 0.32);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.1);
  color: var(--management-accent);
  font-size: 0.82rem;
  font-weight: 800;
}

.page-header h1 {
  margin: 0;
  color: var(--management-text);
  font-size: 2.5rem;
  line-height: 1;
}

.page-header p {
  max-width: 680px;
  margin: 12px 0 0;
  color: var(--management-muted);
  line-height: 1.7;
}

.console-metrics {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(128px, 1fr));
  gap: 12px;
}

.console-metrics article {
  display: grid;
  align-content: center;
  gap: 8px;
  min-height: 118px;
  padding: 16px;
  border: 1px solid rgba(139, 233, 253, 0.24);
  border-radius: 20px;
  background:
    radial-gradient(circle at 18% 18%, rgba(139, 233, 253, 0.14), transparent 34%),
    var(--management-control);
}

.console-metrics span {
  color: var(--management-muted);
  font-size: 0.84rem;
}

.console-metrics strong {
  color: var(--management-text);
  font-size: 1.35rem;
}

.layout {
  display: grid;
  grid-template-columns: 286px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sidebar-panel,
.panel {
  padding: 20px;
  border: 1px solid var(--management-border);
  border-radius: 24px;
  background: var(--management-surface);
}

.sidebar-panel {
  position: sticky;
  top: 92px;
  padding: 14px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 24% 12%, rgba(139, 233, 253, 0.1), transparent 28%),
    rgba(8, 11, 31, 0.22);
}

.hero-panel {
  background:
    radial-gradient(circle at 8% 0%, rgba(139, 233, 253, 0.13), transparent 26%),
    var(--management-surface-strong);
}

.main-column {
  min-height: 420px;
  overflow: hidden;
}

.main-column::before {
  content: "";
  display: block;
  height: 3px;
  margin: -20px -20px 18px;
  background: linear-gradient(90deg, var(--management-accent), var(--management-primary), transparent);
}

.management-page :deep(.management-panel),
.management-page :deep(.settings-panel) {
  color: var(--management-text);
}

.management-page :deep(.toolbar),
.management-page :deep(.row-card),
.management-page :deep(.task-card),
.management-page :deep(.panel-card),
.management-page :deep(.category-card),
.management-page :deep(.tag-card),
.management-page :deep(.path-card),
.management-page :deep(.share-card),
.management-page :deep(.option-card),
.management-page :deep(.preview-card),
.management-page :deep(.account-card),
.management-page :deep(.plugin-card),
.management-page :deep(.recycle-card),
.management-page :deep(.import-card),
.management-page :deep(.preference-card),
.management-page :deep(.governance-panel),
.management-page :deep(.merge-note),
.management-page :deep(.flow-panel),
.management-page :deep(.preview-panel),
.management-page :deep(.create-panel),
.management-page :deep(.info-card) {
  border-color: rgba(139, 233, 253, 0.2) !important;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--management-control) !important;
  color: var(--management-text) !important;
}

.management-page :deep(.rule-strip span) {
  border: 1px solid rgba(139, 233, 253, 0.26) !important;
  background: rgba(139, 233, 253, 0.12) !important;
  color: var(--management-accent) !important;
}

.management-page :deep(.task-card > div > strong),
.management-page :deep(.preview-card strong) {
  color: var(--management-accent) !important;
}

.management-page :deep(button),
.management-page :deep(.tab-button),
.management-page :deep(.ghost-action),
.management-page :deep(a) {
  border-color: var(--management-border) !important;
  background: rgba(24, 35, 90, 0.62) !important;
  color: var(--management-text) !important;
}

.management-page :deep(button:hover),
.management-page :deep(a:hover) {
  border-color: rgba(139, 233, 253, 0.5) !important;
  background: rgba(61, 90, 254, 0.22) !important;
}

.management-page :deep(.active),
.management-page :deep(.tab-button.active),
.management-page :deep(.primary-action),
.management-page :deep(.primary-button),
.management-page :deep(button.complete) {
  border-color: rgba(139, 233, 253, 0.62) !important;
  background:
    radial-gradient(circle at 18% 18%, rgba(139, 233, 253, 0.24), transparent 36%),
    rgba(61, 90, 254, 0.34) !important;
  color: #ffffff !important;
}

.management-page :deep(p),
.management-page :deep(span),
.management-page :deep(li),
.management-page :deep(dd) {
  color: var(--management-muted);
}

.management-page :deep(h2),
.management-page :deep(h3),
.management-page :deep(dt),
.management-page :deep(strong) {
  color: var(--management-text);
}

.management-page :deep(.status-message),
.management-page :deep(.empty-state),
.management-page :deep(.action-result),
.management-page :deep(.review-hint),
.management-page :deep(.merge-hint),
.management-page :deep(.inline-message) {
  color: var(--management-accent) !important;
}

@media (max-width: 960px) {
  .page-header,
  .console-metrics,
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar-panel {
    position: static;
  }
}
</style>
