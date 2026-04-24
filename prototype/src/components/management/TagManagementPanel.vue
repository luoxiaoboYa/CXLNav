<template>
  <section class="management-panel">
    <SectionHeader title="标签管理" description="让筛选和浏览模式有稳定的标签语义。" />

    <div class="tag-list">
      <article v-for="item in tagRecords" :key="item.name" class="tag-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.intent }}</p>
        </div>
        <span>{{ item.usageCount }} 次使用</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { tagRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.tag-list {
  display: grid;
  gap: 16px;
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

h3,
p {
  margin: 0;
}

p,
span {
  color: #61685f;
}

@media (max-width: 960px) {
  .tag-card {
    flex-direction: column;
  }
}
</style>
