<template>
  <section class="management-panel">
    <SectionHeader title="导入 / 导出" description="处理批量迁移、备份和外部书签接入。" />

    <div class="card-grid">
      <article v-for="item in importExportRecords" :key="item.title" class="info-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <dl>
          <div>
            <dt>模式</dt>
            <dd>{{ item.mode }}</dd>
          </div>
          <div>
            <dt>默认策略</dt>
            <dd>{{ item.defaultChoice }}</dd>
          </div>
        </dl>
        <button type="button">{{ item.action }}</button>
      </article>
    </div>

    <section class="flow-panel">
      <h3>导入预览规则</h3>
      <p>浏览器书签导入必须先预览，重复 URL 默认保留多个收藏位置，问题项进入待整理。</p>
    </section>

    <section class="preview-panel" aria-label="导入预览清单">
      <div>
        <h3>导入预览清单</h3>
        <p>选择书签 HTML 后先展示统计和冲突项，用户确认后才写入我的站点。</p>
      </div>

      <div class="status-tabs" aria-label="导入预览状态筛选">
        <button
          v-for="status in previewStatusTabs"
          :key="status"
          :class="['tab-button', { active: activePreviewStatus === status }]"
          type="button"
          @click="activePreviewStatus = status"
        >
          {{ status }} {{ getPreviewStatusCount(status) }}
        </button>
      </div>

      <div class="preview-grid">
        <article v-for="item in visiblePreviewItems" :key="item.title" class="preview-card">
          <strong>{{ item.status }}</strong>
          <h4>{{ item.title }}</h4>
          <p>{{ item.path }}</p>
          <span>{{ item.action }}</span>
        </article>
      </div>

      <p v-if="visiblePreviewItems.length === 0" class="empty-state">当前状态下暂无导入项。</p>

      <div class="preview-actions">
        <button type="button">确认导入</button>
        <button type="button">只导入无冲突项</button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import { importExportRecords } from '../../data/settings'

const previewItems = [
  { title: 'Vue Router', path: '开发文档 / 前端 / Vue', status: '可导入', action: '创建新站点' },
  { title: 'MDN Web Docs', path: '开发文档 / 前端 / 规范', status: '疑似重复', action: '保留多个收藏位置' },
  { title: '旧版素材站', path: '设计资源 / 素材', status: '链接异常', action: '导入后进入待整理中心' }
]

const previewStatusTabs = ['全部状态', '可导入', '疑似重复', '链接异常'] as const
const activePreviewStatus = ref<(typeof previewStatusTabs)[number]>('全部状态')

const visiblePreviewItems = computed(() =>
  activePreviewStatus.value === '全部状态'
    ? previewItems
    : previewItems.filter((item) => item.status === activePreviewStatus.value)
)

const getPreviewStatusCount = (status: (typeof previewStatusTabs)[number]) => {
  if (status === '全部状态') {
    return previewItems.length
  }

  return previewItems.filter((item) => item.status === status).length
}
</script>

<style scoped>
.management-panel,
.card-grid {
  display: grid;
  gap: 16px;
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

dl {
  display: grid;
  gap: 8px;
  margin: 0;
}

dl div,
.flow-panel {
  padding: 12px;
  border-radius: 16px;
  background: var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

h3,
p,
dt,
dd {
  margin: 0;
}

p,
dd {
  color: var(--color-text-muted, #9aa8d4);
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
}

.flow-panel {
  display: grid;
  gap: 8px;
  border: 1px dashed rgba(139, 233, 253, 0.34);
  background: var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

.preview-panel {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.preview-card {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 16px;
  background: var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

.preview-card strong {
  color: var(--color-accent, #8be9fd);
}

.preview-card h4,
.preview-card span {
  margin: 0;
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-state {
  margin: 0;
  color: var(--color-accent, #8be9fd);
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

.tab-button {
  color: var(--color-text-muted, #9aa8d4);
}

.tab-button.active {
  border-color: rgba(139, 233, 253, 0.62);
  background: rgba(61, 90, 254, 0.34);
  color: var(--color-text, #edf3ff);
  font-weight: 700;
}

@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
