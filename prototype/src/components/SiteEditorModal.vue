<template>
  <div v-if="open" class="modal-mask">
    <section aria-labelledby="site-editor-modal-title" aria-modal="true" class="modal-card" role="dialog">
      <div class="modal-top">
        <div>
          <h2 id="site-editor-modal-title">新增 / 编辑站点</h2>
          <p>统一用弹窗完成录入和修改，后续开发可以直接复用这套表单结构。</p>
        </div>
        <button aria-label="关闭弹窗" class="ghost-button" type="button" @click="emit('close')">
          关闭
        </button>
      </div>

      <SiteEditorForm
        :description="'保持轻量录入，同时保留分类、标签和说明字段。'"
        :site="site"
      />

      <div class="modal-actions">
        <button class="ghost-button" type="button" @click="emit('close')">取消</button>
        <button class="primary-button" type="button">保存站点</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SiteRecord } from '../data/sites'

import SiteEditorForm from './SiteEditorForm.vue'

defineProps<{
  open: boolean
  site?: Partial<SiteRecord & { url: string }>
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(31, 37, 31, 0.42);
}

.modal-card {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: 24px;
  border: 1px solid #d7d2c6;
  border-radius: 28px;
  background: #fffdf8;
  box-shadow: 0 24px 60px rgba(31, 37, 31, 0.18);
}

.modal-top,
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.modal-top {
  margin-bottom: 20px;
}

.modal-top h2,
.modal-top p {
  margin: 0;
}

.modal-top p {
  margin-top: 8px;
  color: #61685f;
}

.modal-actions {
  margin-top: 20px;
  justify-content: end;
}

.ghost-button,
.primary-button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  padding: 10px 14px;
  background: #ffffff;
  color: #1f251f;
  font: inherit;
}

.primary-button {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

@media (max-width: 720px) {
  .modal-mask {
    padding: 12px;
  }

  .modal-top,
  .modal-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
