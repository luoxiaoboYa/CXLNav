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
  border: 1px solid #d7d2c6;
  border-radius: 14px;
  background: #ffffff;
  color: #1f251f;
  font: inherit;
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
