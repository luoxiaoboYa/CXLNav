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
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { importExportRecords } from '../../data/settings'
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
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
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
  background: #fbf8f2;
}

h3,
p,
dt,
dd {
  margin: 0;
}

p,
dd {
  color: #61685f;
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
}

.flow-panel {
  display: grid;
  gap: 8px;
  border: 1px dashed #b8c9be;
  background: #f5fbf8;
}

button {
  justify-self: start;
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #fbf8f2;
  padding: 10px 12px;
  font: inherit;
}

@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
