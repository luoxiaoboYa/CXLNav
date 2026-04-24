<template>
  <section class="page">
    <SiteEditorForm />

    <div class="actions">
      <button type="button">保存草稿</button>
      <button type="button" class="primary">保存并返回</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import SiteEditorForm from '../components/SiteEditorForm.vue'
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 10px 12px;
  font: inherit;
}

.actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}
</style>
