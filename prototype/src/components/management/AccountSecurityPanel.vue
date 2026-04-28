<template>
  <section class="management-panel">
    <SectionHeader title="账号安全" description="原型阶段先收敛为登录方式、密码和设备提醒三个维度。" />

    <div class="stack-list">
      <article v-for="item in securityRecords" :key="item.title" class="row-card">
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.hint }}</p>
        </div>
        <strong>{{ item.status }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { securityRecords } from '../../data/settings'
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

p {
  margin-top: 8px;
  color: var(--color-text-muted, #9aa8d4);
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
