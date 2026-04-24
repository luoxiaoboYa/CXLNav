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
        <button type="button">编辑分类</button>
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

h3,
p {
  margin: 0;
}

p,
span {
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
