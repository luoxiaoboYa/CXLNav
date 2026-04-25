<template>
  <section class="management-panel">
    <SectionHeader title="标签管理" description="让筛选和浏览模式有稳定的标签语义。" />

    <div class="tag-list">
      <article v-for="item in tagRecords" :key="item.name" class="tag-card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.intent }}</p>
          <p v-if="item.mergeSuggestion" class="merge-hint">{{ item.mergeSuggestion }}</p>
        </div>
        <div class="tag-actions">
          <span>{{ item.usageCount }} 次使用</span>
          <button type="button">重命名</button>
          <button type="button">合并标签</button>
        </div>
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

.tag-actions {
  display: grid;
  gap: 8px;
  justify-items: start;
}

h3,
p {
  margin: 0;
}

p,
span {
  color: #61685f;
}

.merge-hint {
  margin-top: 8px;
  color: #1b6a52;
}

button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #fbf8f2;
  padding: 8px 10px;
  font: inherit;
}

@media (max-width: 960px) {
  .tag-card {
    flex-direction: column;
  }
}
</style>
