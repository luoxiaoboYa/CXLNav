<template>
  <section class="management-panel">
    <SectionHeader title="书签路径管理" description="管理分类下的有序路径树，服务浏览器书签导入导出。" />

    <div class="path-toolbar">
      <button type="button">新增路径</button>
      <button type="button">合并路径</button>
      <button type="button">批量迁移站点</button>
    </div>

    <div class="path-list">
      <article v-for="item in bookmarkPathRecords" :key="item.fullPath" class="path-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.fullPath }}</p>
        </div>
        <dl>
          <div>
            <dt>所属分类</dt>
            <dd>{{ item.category }}</dd>
          </div>
          <div>
            <dt>站点数量</dt>
            <dd>{{ item.siteCount }}</dd>
          </div>
        </dl>
        <p class="hint">{{ item.actionHint }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { bookmarkPathRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.path-list {
  display: grid;
  gap: 16px;
}

.path-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.path-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

dl div {
  padding: 10px;
  border-radius: 14px;
  background: #fbf8f2;
}

h3,
p,
dt,
dd {
  margin: 0;
}

p,
dd,
.hint {
  color: #61685f;
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
}

button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #fbf8f2;
  padding: 10px 12px;
  font: inherit;
}

@media (max-width: 960px) {
  dl {
    grid-template-columns: 1fr;
  }
}
</style>
