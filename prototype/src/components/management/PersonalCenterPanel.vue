<template>
  <section class="management-panel">
    <SectionHeader title="个人中心" description="集中查看账号基础信息和当前默认工作区。" />

    <div class="profile-grid">
      <article v-for="item in profileRecords" :key="item.label" class="info-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue'
import { profileRecords } from '../../data/settings'
</script>

<style scoped>
.management-panel,
.profile-grid {
  display: grid;
  gap: 16px;
}

.profile-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.info-card {
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--control-background, rgba(24, 35, 90, 0.76));
}

span {
  color: var(--color-text-muted, #9aa8d4);
}

@media (max-width: 960px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
