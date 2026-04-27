<template>
  <div class="shell" :data-theme="mode">
    <AppTopNav />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

import AppTopNav from '../components/AppTopNav.vue'
import { themeKey, type ThemeMode } from '../services/theme'

const mode = ref<ThemeMode>('dark')

const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

provide(themeKey, {
  mode,
  toggleTheme
})
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  background: #080b1f;
}

.shell {
  --color-bg: #080b1f;
  --color-bg-surface: #11183b;
  --color-card: #18235a;
  --color-card-raised: #202d70;
  --color-primary: #6d5dfc;
  --color-secondary: #3d5afe;
  --color-accent: #8be9fd;
  --color-text: #edf3ff;
  --color-text-muted: #9aa8d4;
  --color-border: rgba(139, 233, 253, 0.22);
  --shadow-glow: 0 18px 70px rgba(61, 90, 254, 0.22);
  --shell-background:
    radial-gradient(circle at 12% 8%, rgba(139, 233, 253, 0.18), transparent 24%),
    radial-gradient(circle at 78% 0%, rgba(109, 93, 252, 0.28), transparent 28%),
    linear-gradient(180deg, #080b1f 0%, #0b1030 52%, #080b1f 100%);
  --nav-background:
    linear-gradient(90deg, rgba(8, 11, 31, 0.94), rgba(17, 24, 59, 0.9)),
    radial-gradient(circle at 20% 0%, rgba(139, 233, 253, 0.12), transparent 32%);
  --panel-background: rgba(17, 24, 59, 0.84);
  --panel-strong-background: linear-gradient(135deg, rgba(24, 35, 90, 0.96), rgba(17, 24, 59, 0.88));
  --control-background: rgba(24, 35, 90, 0.76);
  --control-background-hover: rgba(61, 90, 254, 0.28);
  --chip-background: rgba(139, 233, 253, 0.12);
  --muted-panel-background: rgba(8, 11, 31, 0.28);
  --primary-action-background: #6d5dfc;
  --primary-action-text: #ffffff;
  --danger-text: #ff9fba;
  --danger-border: rgba(255, 159, 186, 0.45);
  min-height: 100vh;
  background: var(--shell-background);
  color: var(--color-text);
  font-family:
    Inter, "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.shell[data-theme='light'] {
  --color-bg: #f6f8ff;
  --color-bg-surface: #ffffff;
  --color-card: #edf2ff;
  --color-card-raised: #ffffff;
  --color-primary: #5b4df3;
  --color-secondary: #2f57e8;
  --color-accent: #008fb3;
  --color-text: #152044;
  --color-text-muted: #5e6b91;
  --color-border: rgba(61, 90, 254, 0.18);
  --shadow-glow: 0 18px 54px rgba(61, 90, 254, 0.16);
  --shell-background:
    radial-gradient(circle at 12% 8%, rgba(139, 233, 253, 0.34), transparent 24%),
    radial-gradient(circle at 82% 0%, rgba(109, 93, 252, 0.18), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef3ff 58%, #f6f8ff 100%);
  --nav-background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.92), rgba(238, 243, 255, 0.9)),
    radial-gradient(circle at 20% 0%, rgba(61, 90, 254, 0.12), transparent 32%);
  --panel-background: rgba(255, 255, 255, 0.84);
  --panel-strong-background: linear-gradient(135deg, rgba(237, 242, 255, 0.96), rgba(255, 255, 255, 0.9));
  --control-background: rgba(255, 255, 255, 0.82);
  --control-background-hover: rgba(61, 90, 254, 0.1);
  --chip-background: rgba(61, 90, 254, 0.08);
  --muted-panel-background: rgba(237, 242, 255, 0.74);
  --primary-action-background: #5b4df3;
  --primary-action-text: #ffffff;
  --danger-text: #b4234f;
  --danger-border: rgba(180, 35, 79, 0.28);
}

.content {
  position: relative;
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 24px;
}

:global(.page-header h1),
:global(.page-header h2),
:global(.panel h2),
:global(.panel h3),
:global(.form-header h2),
:global(.feed-card h3),
:global(.site-card h2),
:global(.detail-card h2),
:global(.site-preview h2),
:global(dt),
:global(.notice-panel strong),
:global(.suggestion-box strong) {
  color: var(--color-text) !important;
}

:global(.page-header) {
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background:
    radial-gradient(circle at 14% 16%, rgba(139, 233, 253, 0.14), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(109, 93, 252, 0.18), transparent 26%),
    var(--panel-background);
  padding: 22px;
}

:global(.page-header p),
:global(.panel p),
:global(.site-card p),
:global(.detail-card p),
:global(.form-header p),
:global(.feed-card p),
:global(.result-summary),
:global(.recommendation-meta),
:global(.detail-meta),
:global(.info-list),
:global(.flow-steps),
:global(.filter-label),
:global(.toolbar-label),
:global(.updated-at),
:global(.divider),
:global(label),
:global(label span),
:global(dd),
:global(ul) {
  color: var(--color-text-muted) !important;
}

:global(.panel),
:global(.toolbar),
:global(.notice-panel),
:global(.summary-card),
:global(.status-card),
:global(.site-card),
:global(.detail-card),
:global(.feed-card),
:global(.modal-card),
:global(.panel-card),
:global(.info-card),
:global(.category-card),
:global(.tag-card),
:global(.path-card),
:global(.share-card),
:global(.option-card),
:global(.preview-card),
:global(.account-card),
:global(.plugin-card),
:global(.recycle-card),
:global(.import-card),
:global(.preference-card),
:global(.flow-panel),
:global(.preview-panel),
:global(.create-panel),
:global(.export-card),
:global(.path-row),
:global(.tag-row),
:global(.category-row),
:global(.import-row),
:global(.meta-list div),
:global(dl div) {
  border-color: var(--color-border) !important;
  background:
    radial-gradient(circle at 12% 0%, rgba(139, 233, 253, 0.08), transparent 24%),
    var(--panel-background) !important;
  color: var(--color-text) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

:global(.hero-panel),
:global(.featured-panel),
:global(.collection-panel),
:global(.share-flow-panel),
:global(.secondary-panel),
:global(.public-panel) {
  border-color: var(--color-border) !important;
  background: var(--panel-strong-background) !important;
}

:global(.summary-card strong),
:global(.status-card strong),
:global(.count),
:global(.stat-value) {
  color: var(--color-accent) !important;
}

:global(button),
:global(a.ghost-action),
:global(a.ghost-link),
:global(.text-link),
:global(.tag-chip),
:global(.filter-chip),
:global(.category-button),
:global(.meta-chip),
:global(.notice-tag),
:global(.type-chip),
:global(.source-chip),
:global(.hot-chip),
:global(.collected-chip),
:global(.status-chip),
:global(.label-chip),
:global(.inline-message),
:global(.error-message),
:global(.tag-list li),
:global(.card-tags li),
:global(.detail-tags li),
:global(.site-meta-row span) {
  border-color: var(--color-border) !important;
  background: var(--control-background) !important;
  color: var(--color-text) !important;
}

:global(.tag-chip.active),
:global(.filter-chip.active),
:global(.category-button.active),
:global(.mode-button.active),
:global(.primary-action),
:global(.primary-button),
:global(.primary),
:global(.add-button) {
  border-color: var(--color-primary) !important;
  background: var(--primary-action-background) !important;
  color: var(--primary-action-text) !important;
}

:global(button:disabled),
:global(.ghost-action:disabled) {
  cursor: not-allowed;
  opacity: 0.48;
}

:global(input),
:global(select),
:global(textarea) {
  border-color: var(--color-border) !important;
  background: var(--control-background) !important;
  color: var(--color-text) !important;
}

:global(input::placeholder),
:global(textarea::placeholder) {
  color: var(--color-text-muted) !important;
}

:global(.reason-copy),
:global(.recommendation-hint),
:global(.suggestion-box),
:global(.detail-meta div),
:global(.recommendation-meta div),
:global(.site-meta-row span),
:global(.detail-note),
:global(.secondary-panel),
:global(.drop-zone),
:global(.empty-state) {
  background: var(--muted-panel-background) !important;
  color: var(--color-text-muted) !important;
}

:global(.inline-message),
:global(.status-message) {
  color: var(--color-accent) !important;
}

:global(.error-message) {
  color: var(--danger-text) !important;
}

:global(.divider::before),
:global(.divider::after) {
  background: var(--color-border) !important;
}

:global(.modal-mask) {
  background: rgba(8, 11, 31, 0.72) !important;
  backdrop-filter: blur(12px);
}

:global(.danger-action) {
  border-color: var(--danger-border) !important;
  color: var(--danger-text) !important;
}

@media (max-width: 640px) {
  .content {
    padding: 14px;
  }
}
</style>
