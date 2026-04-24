<template>
  <section class="management-panel">
    <SectionHeader title="站点管理" description="默认入口，承接最常用的整理与维护动作。" />

    <div class="toolbar">
      <label>
        <span>状态筛选</span>
        <select aria-label="状态筛选">
          <option>全部状态</option>
          <option>已整理</option>
          <option>待整理</option>
          <option>待补标签</option>
        </select>
      </label>
      <button type="button" @click="openAdd">新增站点</button>
    </div>

    <div class="table-list">
      <article v-for="item in siteManagementRecords" :key="item.name" class="row-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.category }}</p>
        </div>
        <strong>{{ item.status }}</strong>
        <div class="row-actions">
          <span>{{ item.updatedAt }}</span>
          <button type="button" @click="openEdit(item.name)">编辑</button>
        </div>
      </article>
    </div>

    <SiteEditorModal :open="isEditorOpen" :site="activeSite" @close="closeModal" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import SiteEditorModal from '../SiteEditorModal.vue'
import { mySiteEntries } from '../../data/sites'
import { siteManagementRecords } from '../../data/settings'

const isEditorOpen = ref(false)
const activeSiteName = ref<string | null>(null)

const activeSite = computed(() =>
  mySiteEntries.find((site) => site.title === activeSiteName.value) ?? undefined
)

const openEdit = (siteName: string) => {
  activeSiteName.value = siteName
  isEditorOpen.value = true
}

const openAdd = () => {
  activeSiteName.value = null
  isEditorOpen.value = true
}

const closeModal = () => {
  activeSiteName.value = null
  isEditorOpen.value = false
}
</script>

<style scoped>
.management-panel {
  display: grid;
  gap: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
}

label {
  display: grid;
  gap: 8px;
}

select,
button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 10px 12px;
  font: inherit;
}

.table-list {
  display: grid;
  gap: 12px;
}

.row-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) 0.8fr 0.9fr;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
}

h3,
p {
  margin: 0;
}

p,
span {
  color: #61685f;
}

.row-actions {
  display: grid;
  gap: 8px;
  justify-items: start;
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
