<template>
  <section class="management-page">
    <header class="page-header">
      <div>
        <h1>管理中心</h1>
        <p>通过左侧子导航收口所有低频但必要的维护动作。</p>
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
</script>

<style scoped>
.management-page {
  display: grid;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
}

.page-header p {
  margin: 8px 0 0;
  color: #61685f;
}

.layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sidebar-panel,
.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.hero-panel {
  background: linear-gradient(135deg, rgba(27, 106, 82, 0.08), rgba(255, 253, 248, 0.96));
}

.main-column {
  min-height: 420px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
