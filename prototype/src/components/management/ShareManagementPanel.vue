<template>
  <section class="management-panel">
    <SectionHeader title="分享 / 推荐管理" description="集中处理系统推荐和用户分享的流转状态。" />

    <div class="status-tabs" aria-label="分享推荐状态筛选">
      <button
        v-for="status in statusTabs"
        :key="status"
        :class="['tab-button', { active: activeStatus === status }]"
        type="button"
        @click="activeStatus = status"
      >
        {{ status }} {{ getStatusCount(status) }}
      </button>
    </div>

    <div class="table-list">
      <article v-for="item in visibleRecords" :key="item.title" class="row-card">
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.source }} · {{ item.type }}</p>
          <p class="review-hint">{{ item.reviewHint }}</p>
        </div>
        <strong>{{ item.status }}</strong>
        <div class="row-actions">
          <button type="button">查看详情</button>
          <button type="button">审核记录</button>
        </div>
      </article>
    </div>

    <p v-if="visibleRecords.length === 0" class="empty-state">当前状态下暂无分享或推荐内容。</p>

    <section class="governance-panel">
      <h3>后台治理能力</h3>
      <ul>
        <li>前台重复共享只提示已有内容，不自动合并。</li>
        <li>历史重复、漏判重复由管理员手动合并。</li>
        <li>举报内容可先隐藏，再进入复审和下架流程。</li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import { shareRecords } from '../../data/settings'

const statusTabs = ['全部状态', '已上架', '待审核', '推荐中'] as const
const activeStatus = ref<(typeof statusTabs)[number]>('全部状态')

const visibleRecords = computed(() =>
  activeStatus.value === '全部状态'
    ? shareRecords
    : shareRecords.filter((item) => item.status === activeStatus.value)
)

const getStatusCount = (status: (typeof statusTabs)[number]) => {
  if (status === '全部状态') {
    return shareRecords.length
  }

  return shareRecords.filter((item) => item.status === status).length
}
</script>

<style scoped>
.management-panel,
.table-list {
  display: grid;
  gap: 16px;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.row-card {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 0.8fr auto;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
}

h3,
p {
  margin: 0;
}

p {
  color: #61685f;
}

.empty-state {
  margin: 0;
  color: #1b6a52;
  font-weight: 700;
}

.review-hint {
  margin-top: 8px;
  color: #1b6a52;
}

.row-actions {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.governance-panel {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px dashed #b8c9be;
  border-radius: 18px;
  background: #f5fbf8;
}

.governance-panel ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
}

button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #fbf8f2;
  padding: 10px 12px;
  font: inherit;
}

.tab-button {
  color: #61685f;
}

.tab-button.active {
  border-color: #1b6a52;
  background: #deeee7;
  color: #1b6a52;
  font-weight: 700;
}

@media (max-width: 960px) {
  .row-card {
    grid-template-columns: 1fr;
  }
}
</style>
