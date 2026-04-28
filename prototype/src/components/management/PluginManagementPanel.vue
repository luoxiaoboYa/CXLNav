<template>
  <section class="management-panel">
    <SectionHeader title="插件管理" description="集中查看插件状态、快捷收藏入口和弹窗预览。" />

    <div class="card-grid">
      <article class="info-card">
        <h3>浏览器插件状态</h3>
        <p>当前原型以“快捷收藏”作为主场景，后续可补充浏览器绑定和同步状态。</p>
        <strong>已启用原型流程</strong>
      </article>

      <article class="info-card">
        <h3>快捷收藏预览</h3>
        <p>进入弹窗页，确认收藏流程、字段密度和按钮层级是否合理。</p>
        <component
          :is="linkComponent"
          v-bind="linkProps"
        >
          预览插件快捷收藏
        </component>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { RouterLink, routerKey } from 'vue-router'

import SectionHeader from '../SectionHeader.vue'

const router = inject(routerKey, null)
const linkComponent = computed(() => (router ? RouterLink : 'a'))
const linkProps = computed(() => (router ? { to: '/extension-popup' } : { href: '/extension-popup' }))
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
  color: var(--color-text-muted, #9aa8d4);
}

a {
  justify-self: start;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 12px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
  padding: 10px 12px;
  text-decoration: none;
  font: inherit;
}

@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
