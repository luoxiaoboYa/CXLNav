<template>
  <nav aria-label="管理中心导航" class="management-sidebar">
    <button
      v-for="item in items"
      :key="item"
      :class="['sidebar-item', { active: item === activeItem }]"
      type="button"
      @click="emit('select', item)"
    >
      {{ item }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  select: [item: string]
}>()

const items = [
  '站点管理',
  '待整理中心',
  '分类管理',
  '标签管理',
  '书签路径管理',
  '分享 / 推荐管理',
  '个人中心',
  '账号安全',
  '插件管理',
  '回收站',
  '导入 / 导出',
  '显示与偏好'
]

withDefaults(
  defineProps<{
    activeItem?: string
  }>(),
  {
    activeItem: '站点管理'
  }
)
</script>

<style scoped>
.management-sidebar {
  display: grid;
  gap: 8px;
}

.sidebar-item {
  position: relative;
  padding: 12px 14px 12px 34px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 16px;
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text-muted, #9aa8d4);
  text-align: left;
  font: inherit;
  overflow: hidden;
}

.sidebar-item::before {
  content: "";
  position: absolute;
  left: 14px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  transform: translateY(-50%);
  box-shadow: 0 0 16px currentColor;
}

.sidebar-item.active {
  border-color: rgba(139, 233, 253, 0.62);
  background:
    radial-gradient(circle at 18% 20%, rgba(139, 233, 253, 0.22), transparent 38%),
    rgba(61, 90, 254, 0.34);
  color: var(--color-text, #edf3ff);
  font-weight: 700;
}
</style>
