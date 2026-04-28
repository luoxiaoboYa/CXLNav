<template>
  <section class="management-panel">
    <SectionHeader title="回收站" description="把误删内容和待恢复项统一收在管理中心里。" />

    <div class="stack-list">
      <article v-for="item in recycleRecords" :key="item.title" class="row-card">
        <div>
          <h3>{{ item.title }}</h3>
          <p>来源：{{ item.source }}</p>
        </div>
        <span>{{ item.removedAt }}</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { recycleRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.stack-list {
  display: grid;
  gap: 16px;
}

.row-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px;
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

p,
span {
  color: var(--color-text-muted, #9aa8d4);
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
