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
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 12px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
  padding: 10px 12px;
  font: inherit;
}

.summary-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-card {
  padding: 16px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

h3,
p {
  margin: 0;
}

p {
  margin-top: 8px;
  color: var(--color-text-muted, #9aa8d4);
}

@media (max-width: 960px) {
  .preferences-list,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
