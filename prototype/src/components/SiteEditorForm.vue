<template>
  <section class="editor-form">
    <header class="form-header">
      <h2>{{ heading }}</h2>
      <p>{{ description }}</p>
    </header>

    <div class="form-grid">
      <label>
        <span>站点名称</span>
        <input aria-label="站点名称" type="text" :value="siteName" placeholder="例如 GitHub" />
      </label>

      <label>
        <span>站点链接</span>
        <input aria-label="站点链接" type="url" :value="siteUrl" placeholder="https://example.com" />
      </label>

      <label>
        <span>分类</span>
        <select aria-label="分类" :value="siteCategory">
          <option v-for="category in editableCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <label>
        <span>标签</span>
        <input
          aria-label="标签"
          type="text"
          :value="siteTagText"
          :placeholder="siteTags.join(', ')"
        />
      </label>

      <label class="full-width">
        <span>简介</span>
        <textarea
          aria-label="简介"
          rows="4"
          :value="siteDescription"
          placeholder="补充这个站点适合什么场景"
        ></textarea>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { siteCategories, siteTags, type SiteRecord } from '../data/sites'

const props = withDefaults(
  defineProps<{
    heading?: string
    description?: string
    site?: Partial<SiteRecord & { url: string }>
  }>(),
  {
    heading: '站点添加 / 编辑',
    description: '保持轻量录入，但给后续分类、标签和展示模式留出结构。',
    site: () => ({})
  }
)

const editableCategories = computed(() => siteCategories.filter((category) => category !== '全部分类'))
const siteName = computed(() => props.site.title ?? '')
const siteUrl = computed(() => props.site.url ?? '')
const siteCategory = computed(() => props.site.category ?? editableCategories.value[0] ?? '')
const siteTagText = computed(() => props.site.tags?.join(', ') ?? '')
const siteDescription = computed(() => props.site.description ?? '')
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

@media (max-width: 960px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }
}
</style>
