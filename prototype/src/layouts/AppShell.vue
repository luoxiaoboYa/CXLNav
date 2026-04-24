<template>
  <div class="shell">
    <AppTopNav />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppTopNav from '../components/AppTopNav.vue'
</script>

<style scoped>
.shell {
  min-height: 100vh;
  background: #f4f0e8;
  color: #1f251f;
}

.content {
  padding: 24px;
}
</style>
