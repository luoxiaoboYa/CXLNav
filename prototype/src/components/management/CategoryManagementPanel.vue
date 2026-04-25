<template>
  <section class="management-panel">
    <SectionHeader title="分类管理" description="维护稳定的信息架构，避免分类边界继续模糊。" />

    <div class="card-grid">
      <article v-for="item in categoryRecords" :key="item.name" class="info-card">
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
          <button type="button">编辑分类</button>
          <button type="button">调整排序</button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { categoryRecords } from '../../data/settings'
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
  background: #fbf8f2;
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
  color: #61685f;
}

dt {
  margin-bottom: 4px;
  font-weight: 700;
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

  .meta-list {
    grid-template-columns: 1fr;
  }
}
</style>
