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
  '分类管理',
  '标签管理',
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
  gap: 10px;
}

.sidebar-item {
  padding: 12px 14px;
  border: 1px solid #d7d2c6;
  border-radius: 14px;
  background: #fbf8f2;
  color: #61685f;
  text-align: left;
  font: inherit;
}

.sidebar-item.active {
  background: #deeee7;
  color: #1b6a52;
  font-weight: 700;
}
</style>
