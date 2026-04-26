<template>
  <section class="editor-form">
    <header class="form-header">
      <h2>{{ heading }}</h2>
      <p>{{ description }}</p>
    </header>

    <div class="form-grid">
      <label>
        <span>站点名称</span>
        <input v-model="draft.title" aria-label="站点名称" type="text" placeholder="例如 GitHub" @input="emitChange" />
      </label>

      <label>
        <span>站点链接</span>
        <input v-model="draft.url" aria-label="站点链接" type="url" placeholder="https://example.com" @input="emitChange" />
      </label>

      <label>
        <span>分类</span>
        <select v-model="draft.categoryId" aria-label="分类" @change="emitChange">
          <option value="">不选择分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label>
        <span>标签</span>
        <select v-model="draft.tagIds" aria-label="标签" multiple @change="emitChange">
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </label>

      <label class="full-width">
        <span>简介</span>
        <textarea
          v-model="draft.description"
          aria-label="简介"
          rows="4"
          placeholder="补充这个站点适合什么场景"
          @input="emitChange"
        ></textarea>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import type { SiteRecord } from '../data/sites'
import type { CategoryDto, PersonalSiteDto, SitePayload, TagDto } from '../services/api'

const props = withDefaults(
  defineProps<{
    heading?: string
    description?: string
    site?: Partial<PersonalSiteDto> | Partial<SiteRecord>
    categories?: CategoryDto[]
    tags?: TagDto[]
  }>(),
  {
    heading: '站点添加 / 编辑',
    description: '保持轻量录入，但给后续分类、标签和展示模式留出结构。',
    site: () => ({}),
    categories: () => [],
    tags: () => []
  }
)

const emit = defineEmits<{
  change: [payload: SitePayload]
}>()

const draft = reactive({
  title: '',
  url: '',
  categoryId: '',
  tagIds: [] as string[],
  description: ''
})

const resetDraft = () => {
  const category = props.site.category
  const siteTags = props.site.tags

  draft.title = props.site.title ?? ''
  draft.url = props.site.url ?? ''
  draft.categoryId = typeof category === 'string'
    ? props.categories.find((item) => item.name === category)?.id ?? ''
    : category?.id ?? ''
  draft.tagIds = Array.isArray(siteTags)
    ? siteTags.map((tag) => typeof tag === 'string' ? props.tags.find((item) => item.name === tag)?.id ?? '' : tag.id).filter(Boolean)
    : []
  draft.description = props.site.description ?? ''
  emitChange()
}

const emitChange = () => {
  emit('change', {
    title: draft.title,
    url: draft.url,
    categoryId: draft.categoryId || undefined,
    tagIds: draft.tagIds,
    description: draft.description,
    source: 'manual'
  })
}

watch(() => props.site, resetDraft, { immediate: true, deep: true })
</script>

<style scoped>
.editor-form {
  display: grid;
  gap: 20px;
}

.form-header h2,
.form-header p {
  margin: 0;
}

.form-header p {
  margin-top: 8px;
  color: #61685f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
}

.full-width {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 10px 12px;
  font: inherit;
}

select[multiple] {
  min-height: 92px;
}

@media (max-width: 960px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }
}
</style>
