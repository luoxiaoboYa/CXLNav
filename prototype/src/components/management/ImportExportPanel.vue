<template>
  <section class="management-panel">
    <SectionHeader title="导入 / 导出" description="处理批量迁移、备份和外部书签接入。" />

    <div class="card-grid">
      <article v-for="item in importExportRecords" :key="item.title" class="info-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <button type="button">{{ item.action }}</button>
      </article>
    </div>
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

h3,
p {
  margin: 0;
}

p {
  color: #61685f;
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
