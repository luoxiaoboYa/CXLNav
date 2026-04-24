<template>
  <section class="management-panel">
    <SectionHeader title="分享 / 推荐管理" description="集中处理系统推荐和用户分享的流转状态。" />

    <div class="table-list">
      <article v-for="item in shareRecords" :key="item.title" class="row-card">
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.source }}</p>
        </div>
        <strong>{{ item.status }}</strong>
        <button type="button">查看详情</button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { shareRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.table-list {
  display: grid;
  gap: 16px;
}

.row-card {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 0.8fr auto;
  gap: 12px;
  align-items: center;
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
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #fbf8f2;
  padding: 10px 12px;
  font: inherit;
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
