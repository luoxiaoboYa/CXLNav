<template>
  <section class="management-panel">
    <SectionHeader title="标签管理" description="让筛选和浏览模式有稳定的标签语义。" />

    <div class="toolbar">
      <div>
        <strong>标签维护</strong>
        <p>{{ usingBackend ? '新增、重命名、删除会直接写入后端个人标签。' : '未登录或接口不可用时展示原型数据。' }}</p>
      </div>
      <button type="button" class="primary-button" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? '收起新增标签' : '新增标签' }}
      </button>
    </div>

    <form v-if="showCreateForm" class="create-panel" aria-label="新增标签表单" @submit.prevent="createTag">
      <label>
        <span>标签名称</span>
        <input v-model="draftName" type="text" placeholder="例如：AI" />
      </label>
      <label>
        <span>使用意图</span>
        <input v-model="draftIntent" type="text" placeholder="例如：标记常用 AI 工具" />
      </label>
      <button type="submit">保存标签</button>
    </form>

    <p v-if="createMessage" class="inline-message">{{ createMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="tag-list">
      <article v-for="item in visibleTags" :key="item.id" class="tag-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.intent }}</p>
          <p v-if="item.mergeSuggestion" class="merge-hint">{{ item.mergeSuggestion }}</p>
        </div>
        <div class="tag-actions">
          <span>{{ item.usageCount }} 次使用</span>
          <button type="button" @click="renameTag(item)">重命名</button>
          <button type="button">合并标签</button>
          <button v-if="usingBackend" type="button" @click="deleteTag(item.id)">删除标签</button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import { tagRecords } from '../../data/settings'
import { api, getStoredToken, type TagDto } from '../../services/api'

type TagView = {
  id: string
  name: string
  usageCount: number
  intent: string
  mergeSuggestion?: string
}

const showCreateForm = ref(false)
const draftName = ref('')
const draftIntent = ref('')
const createMessage = ref('')
const errorMessage = ref('')
const tags = ref<TagDto[]>([])
const usingBackend = ref(false)

const fallbackTags = tagRecords.map((item) => ({ id: item.name, ...item }))

const visibleTags = computed<TagView[]>(() => {
  if (!usingBackend.value) {
    return fallbackTags
  }

  return tags.value.map((item) => ({
    id: item.id,
    name: item.name,
    usageCount: item.usageCount,
    intent: '个人标签，可用于筛选、整理和站点多标签关联。',
    mergeSuggestion: item.usageCount === 0 ? '当前未使用，可作为新整理规则候选' : undefined
  }))
})

const loadTags = async () => {
  if (!getStoredToken()) {
    usingBackend.value = false
    return
  }

  try {
    const response = await api.listTags()
    tags.value = response.items
    usingBackend.value = true
  } catch (error) {
    usingBackend.value = false
    errorMessage.value = error instanceof Error ? error.message : '标签接口暂不可用，已展示原型数据。'
  }
}

const createTag = async () => {
  const name = draftName.value.trim() || '未命名标签'
  const intent = draftIntent.value.trim() || '暂未填写使用意图'
  createMessage.value = ''
  errorMessage.value = ''

  if (!usingBackend.value) {
    createMessage.value = `已创建个人标签“${name}”，用途为“${intent}”；登录后会写入真实后端。`
    draftName.value = ''
    draftIntent.value = ''
    showCreateForm.value = false
    return
  }

  const response = await api.createTag({ name })
  tags.value = [response.tag, ...tags.value]
  createMessage.value = `已创建个人标签“${response.tag.name}”。`
  draftName.value = ''
  draftIntent.value = ''
  showCreateForm.value = false
}

const renameTag = async (item: TagView) => {
  if (!usingBackend.value) {
    createMessage.value = '原型数据不执行真实重命名；登录后可修改后端标签。'
    return
  }

  const response = await api.updateTag(item.id, { name: `${item.name}（已编辑）` })
  tags.value = tags.value.map((tag) => tag.id === item.id ? response.tag : tag)
  createMessage.value = `已重命名为“${response.tag.name}”。`
}

const deleteTag = async (tagId: string) => {
  await api.deleteTag(tagId)
  tags.value = tags.value.filter((tag) => tag.id !== tagId)
  createMessage.value = '已删除标签，并解除关联站点的该标签。'
}

onMounted(() => {
  void loadTags()
})
</script>

<style scoped>
.management-panel,
.tag-list {
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
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #fbf8f2;
}

.create-panel {
  justify-content: flex-start;
  padding: 14px;
  border: 1px dashed #b8c9be;
  border-radius: 18px;
  background: #f5fbf8;
}

label {
  display: grid;
  gap: 8px;
}

.tag-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
}

.tag-actions {
  display: grid;
  gap: 8px;
  justify-items: start;
}

h3,
p {
  margin: 0;
}

p,
span {
  color: #61685f;
}

.merge-hint {
  margin-top: 8px;
  color: #1b6a52;
}

.inline-message {
  color: #1b6a52;
  font-weight: 700;
}

.error-message {
  color: #7b4a17;
  font-weight: 700;
}

button,
input {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  padding: 8px 10px;
  font: inherit;
}

button {
  background: #fbf8f2;
}

.primary-button {
  border-color: #1b6a52;
  background: #1b6a52;
  color: #ffffff;
}

@media (max-width: 960px) {
  .tag-card {
    flex-direction: column;
  }
}
</style>
