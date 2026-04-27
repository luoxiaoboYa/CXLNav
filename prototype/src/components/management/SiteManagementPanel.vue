<template>
  <section class="management-panel">
    <SectionHeader title="站点管理" description="默认入口，承接最常用的整理与维护动作。" />

    <div class="toolbar">
      <div class="status-tabs" aria-label="站点状态筛选">
        <button
          v-for="status in statusTabs"
          :key="status"
          :class="['tab-button', { active: activeStatus === status }]"
          type="button"
          @click="activeStatus = status"
        >
          {{ status }} {{ getStatusCount(status) }}
        </button>
      </div>
      <button type="button" @click="openAdd">新增站点</button>
    </div>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="table-list">
      <article v-for="item in visibleRecords" :key="item.id" class="row-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.category }}</p>
        </div>
        <strong>{{ item.status }}</strong>
        <div class="row-actions">
          <span>{{ item.updatedAt }}</span>
          <button type="button" @click="openEdit(item.id)">编辑</button>
          <button v-if="usingBackend" type="button" @click="deleteSite(item.id)">删除</button>
        </div>
      </article>
    </div>

    <p v-if="visibleRecords.length === 0" class="empty-state">当前状态下暂无站点。</p>

    <SiteEditorModal
      :categories="categories"
      :open="isEditorOpen"
      :site="activeSite"
      :tags="tags"
      @close="closeModal"
      @save="saveSite"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import SiteEditorModal from '../SiteEditorModal.vue'
import { siteManagementRecords } from '../../data/settings'
import { api, getStoredToken, type CategoryDto, type PersonalSiteDto, type SitePayload, type TagDto } from '../../services/api'

type SiteRow = {
  id: string
  name: string
  category: string
  status: (typeof statusTabs)[number]
  updatedAt: string
}

const isEditorOpen = ref(false)
const activeSiteId = ref<string | null>(null)
const statusTabs = ['全部状态', '已整理', '待整理', '待补标签'] as const
const activeStatus = ref<(typeof statusTabs)[number]>('全部状态')
const remoteSites = ref<PersonalSiteDto[]>([])
const categories = ref<CategoryDto[]>([])
const tags = ref<TagDto[]>([])
const usingBackend = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

const fallbackRows = siteManagementRecords.map((item) => ({
  id: item.name,
  name: item.name,
  category: item.category,
  status: item.status as (typeof statusTabs)[number],
  updatedAt: item.updatedAt
}))

const rows = computed<SiteRow[]>(() => {
  if (!usingBackend.value) {
    return fallbackRows
  }

  return remoteSites.value.map((site) => ({
    id: site.id,
    name: site.title || site.url,
    category: site.category?.name ?? '未分类',
    status: toStatusLabel(site.organizeStatus),
    updatedAt: formatTime(site.updatedAt)
  }))
})

const activeSite = computed(() => {
  if (!usingBackend.value || !activeSiteId.value) {
    return undefined
  }

  return remoteSites.value.find((site) => site.id === activeSiteId.value)
})

const visibleRecords = computed(() =>
  activeStatus.value === '全部状态'
    ? rows.value
    : rows.value.filter((item) => item.status === activeStatus.value)
)

const getStatusCount = (status: (typeof statusTabs)[number]) => {
  if (status === '全部状态') {
    return rows.value.length
  }

  return rows.value.filter((item) => item.status === status).length
}

const loadRemoteData = async () => {
  if (!getStoredToken()) {
    usingBackend.value = false
    statusMessage.value = '当前未登录，展示原型站点数据；登录后自动使用后端接口。'
    return
  }

  try {
    const [siteResponse, categoryResponse, tagResponse] = await Promise.all([
      api.listPersonalSites(),
      api.listCategories(),
      api.listTags()
    ])
    remoteSites.value = siteResponse.items
    categories.value = categoryResponse.items
    tags.value = tagResponse.items
    usingBackend.value = true
    statusMessage.value = '已连接后端个人站点接口。'
  } catch (error) {
    usingBackend.value = false
    errorMessage.value = error instanceof Error ? error.message : '站点接口暂不可用，已展示原型数据。'
  }
}

const openEdit = (siteId: string) => {
  activeSiteId.value = siteId
  isEditorOpen.value = true
}

const openAdd = () => {
  activeSiteId.value = null
  isEditorOpen.value = true
}

const closeModal = () => {
  activeSiteId.value = null
  isEditorOpen.value = false
}

const saveSite = async (payload: SitePayload) => {
  statusMessage.value = ''
  errorMessage.value = ''

  if (!usingBackend.value) {
    statusMessage.value = '当前展示原型数据；请先登录再保存到后端。'
    closeModal()
    return
  }

  if (!payload.url?.trim()) {
    errorMessage.value = '站点链接不能为空。'
    return
  }

  if (activeSiteId.value) {
    const response = await api.updatePersonalSite(activeSiteId.value, payload)
    remoteSites.value = remoteSites.value.map((site) => site.id === activeSiteId.value ? response.site : site)
    statusMessage.value = `已更新站点“${response.site.title}”。`
  } else {
    const response = await api.createPersonalSite(payload)
    remoteSites.value = [response.site, ...remoteSites.value]
    statusMessage.value = `已新增站点“${response.site.title}”。`
  }

  closeModal()
}

const deleteSite = async (siteId: string) => {
  await api.deletePersonalSite(siteId)
  remoteSites.value = remoteSites.value.filter((site) => site.id !== siteId)
  statusMessage.value = '已删除站点。'
}

const toStatusLabel = (organizeStatus: string): (typeof statusTabs)[number] => {
  if (organizeStatus === 'complete') {
    return '已整理'
  }

  if (organizeStatus === 'missing_tags') {
    return '待补标签'
  }

  return '待整理'
}

const formatTime = (value: string | null) => {
  if (!value) {
    return '未记录'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

onMounted(() => {
  void loadRemoteData()
})
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
  align-items: center;
  justify-content: space-between;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

button {
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 999px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
  padding: 10px 12px;
  font: inherit;
}

.tab-button {
  background: rgba(24, 35, 90, 0.62);
  color: var(--color-text-muted, #9aa8d4);
}

.tab-button.active {
  border-color: rgba(139, 233, 253, 0.62);
  background: rgba(61, 90, 254, 0.34);
  color: var(--color-text, #edf3ff);
  font-weight: 700;
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
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 8% 0%, rgba(139, 233, 253, 0.1), transparent 22%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

h3,
p {
  margin: 0;
}

p,
span {
  color: var(--color-text-muted, #9aa8d4);
}

.status-message,
.empty-state {
  margin: 0;
  color: var(--color-accent, #8be9fd);
  font-weight: 700;
}

.error-message {
  margin: 0;
  color: var(--danger-text, #ff9fba);
  font-weight: 700;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-items: start;
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
