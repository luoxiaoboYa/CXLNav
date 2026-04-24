<template>
  <div class="section-header">
    <div>
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

p {
  margin: 6px 0 0;
  color: #61685f;
  line-height: 1.5;
}
</style>
