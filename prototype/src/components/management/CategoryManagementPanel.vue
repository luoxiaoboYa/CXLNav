<template>
  <section class="management-panel">
    <SectionHeader title="分类管理" description="维护稳定的信息架构，避免分类边界继续模糊。" />

    <div class="toolbar">
      <div>
        <strong>分类维护</strong>
        <p>{{ usingBackend ? '新增和删除会直接写入后端个人分类。' : '未登录或接口不可用时展示原型数据。' }}</p>
      </div>
      <button type="button" class="primary-button" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? '收起新增分类' : '新增分类' }}
      </button>
    </div>

    <form v-if="showCreateForm" class="create-panel" aria-label="新增分类表单" @submit.prevent="createCategory">
      <label>
        <span>分类名称</span>
        <input v-model="draftName" type="text" placeholder="例如：AI 工具" />
      </label>
      <label>
        <span>排序值</span>
        <input v-model.number="draftSortOrder" type="number" placeholder="例如：10" />
      </label>
      <button type="submit">保存分类</button>
    </form>

    <p v-if="createMessage" class="inline-message">{{ createMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="card-grid">
      <article v-for="item in visibleCategories" :key="item.id" class="info-card">
        <div class="head">
          <h3>{{ item.name }}</h3>
          <span>{{ item.count }} 个站点</span>
        </div>
        <p>{{ item.description }}</p>
        <dl class="meta-list">
          <div>
            <dt>待整理</dt>
            <dd>{{ item.pendingCount }} 个</dd>
          </div>
          <div>
            <dt>默认导出路径</dt>
            <dd>{{ item.exportPath }}</dd>
          </div>
        </dl>
        <div class="actions">
          <button type="button" @click="renameCategory(item)">编辑分类</button>
          <button type="button">调整排序</button>
          <button v-if="usingBackend" type="button" @click="deleteCategory(item.id)">删除分类</button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import { categoryRecords } from '../../data/settings'
import { api, getStoredToken, type CategoryDto } from '../../services/api'

type CategoryView = {
  id: string
  name: string
  count: number
  description: string
  pendingCount: number
  exportPath: string
  sortOrder: number
}

const showCreateForm = ref(false)
const draftName = ref('')
const draftSortOrder = ref(0)
const createMessage = ref('')
const errorMessage = ref('')
const categories = ref<CategoryDto[]>([])
const usingBackend = ref(false)

const fallbackCategories = categoryRecords.map((item) => ({
  id: item.name,
  name: item.name,
  count: item.count,
  description: item.description,
  pendingCount: item.pendingCount,
  exportPath: item.exportPath,
  sortOrder: 0
}))

const visibleCategories = computed<CategoryView[]>(() => {
  if (!usingBackend.value) {
    return fallbackCategories
  }

  return categories.value.map((item) => ({
    id: item.id,
    name: item.name,
    count: 0,
    description: '个人自定义分类，可用于站点归类、筛选和导出路径。',
    pendingCount: 0,
    exportPath: `${item.name} / 默认路径`,
    sortOrder: item.sortOrder
  }))
})

const loadCategories = async () => {
  if (!getStoredToken()) {
    usingBackend.value = false
    return
  }

  try {
    const response = await api.listCategories()
    categories.value = response.items
    usingBackend.value = true
  } catch (error) {
    usingBackend.value = false
    errorMessage.value = error instanceof Error ? error.message : '分类接口暂不可用，已展示原型数据。'
  }
}

const createCategory = async () => {
  const name = draftName.value.trim() || '未命名分类'
  createMessage.value = ''
  errorMessage.value = ''

  if (!usingBackend.value) {
    createMessage.value = `已创建“${name}”草稿；登录后会写入真实后端。`
    draftName.value = ''
    showCreateForm.value = false
    return
  }

  const response = await api.createCategory({ name, sortOrder: draftSortOrder.value || 0 })
  categories.value = [...categories.value, response.category].sort((first, second) => first.sortOrder - second.sortOrder)
  createMessage.value = `已创建分类“${response.category.name}”。`
  draftName.value = ''
  draftSortOrder.value = 0
  showCreateForm.value = false
}

const renameCategory = async (item: CategoryView) => {
  if (!usingBackend.value) {
    createMessage.value = '原型数据不执行真实编辑；登录后可修改后端分类。'
    return
  }

  const response = await api.updateCategory(item.id, { name: `${item.name}（已编辑）`, sortOrder: item.sortOrder })
  categories.value = categories.value.map((category) => category.id === item.id ? response.category : category)
  createMessage.value = `已更新分类“${response.category.name}”。`
}

const deleteCategory = async (categoryId: string) => {
  await api.deleteCategory(categoryId)
  categories.value = categories.value.filter((category) => category.id !== categoryId)
  createMessage.value = '已删除分类，关联站点会保留但清空分类。'
}

onMounted(() => {
  void loadCategories()
})
</script>

<style scoped>
.management-panel,
.card-grid {
  display: grid;
  gap: 16px;
}

.toolbar,
.create-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  justify-content: space-between;
}

.toolbar {
  padding: 14px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

.create-panel {
  justify-content: flex-start;
  padding: 14px;
  border: 1px dashed rgba(139, 233, 253, 0.34);
  border-radius: 18px;
  background: var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

label {
  display: grid;
  gap: 8px;
}

.card-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.meta-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.meta-list div {
  padding: 10px;
  border-radius: 14px;
  background: var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

h3,
p,
dt,
dd {
  margin: 0;
}

p,
span,
dd {
  color: var(--color-text-muted, #9aa8d4);
}

.inline-message {
  color: var(--color-accent, #8be9fd);
  font-weight: 700;
}

.error-message {
  color: #7b4a17;
  font-weight: 700;
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
}

button {
  justify-self: start;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 12px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
  padding: 10px 12px;
  font: inherit;
}

input {
  min-width: 220px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 12px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
  padding: 10px 12px;
  font: inherit;
}

.primary-button {
  border-color: var(--color-primary, #6d5dfc);
  background: var(--primary-action-background, #6d5dfc);
  color: var(--primary-action-text, var(--color-text, #edf3ff));
}

@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .meta-list {
    grid-template-columns: 1fr;
  }
}
</style>
