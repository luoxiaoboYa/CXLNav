<template>
  <section class="management-panel">
    <SectionHeader title="显示与偏好" description="只在这里放主题、密度和默认视图偏好。" />

    <div class="preferences-list">
      <label class="preference-field">
        <span>默认显示模式</span>
        <select aria-label="默认显示模式">
          <option>简洁模式</option>
          <option>详情模式</option>
        </select>
      </label>

      <label class="preference-field">
        <span>首页推荐密度</span>
        <select aria-label="首页推荐密度">
          <option>适中</option>
          <option>精简</option>
          <option>丰富</option>
        </select>
      </label>
    </div>

    <div class="summary-grid">
      <article v-for="item in preferenceRecords" :key="item.label" class="summary-card">
        <h3>{{ item.label }}</h3>
        <p>{{ item.value }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { preferenceRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.preferences-list,
.summary-grid {
  display: grid;
  gap: 16px;
}

.preferences-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.preference-field {
  display: grid;
  gap: 8px;
}

select {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 10px 12px;
  font: inherit;
}

.summary-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-card {
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
  margin-top: 8px;
  color: #61685f;
}

@media (max-width: 960px) {
  .preferences-list,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
