<template>
  <label class="search-bar">
    <span class="sr-only">站点搜索</span>
    <input :placeholder="placeholder" type="search" />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  placeholder: string
}>()
</script>

<style scoped>
.search-bar {
  display: block;
}

input {
  width: 100%;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(139, 233, 253, 0.34);
  border-radius: 16px;
  background: var(--control-background);
  color: var(--color-text);
  font: inherit;
  outline: none;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 18px 42px rgba(8, 11, 31, 0.28);
}

input::placeholder {
  color: var(--color-text-muted);
}

input:focus {
  border-color: var(--color-accent);
  box-shadow:
    0 0 0 3px rgba(139, 233, 253, 0.14),
    0 18px 42px rgba(61, 90, 254, 0.24);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
