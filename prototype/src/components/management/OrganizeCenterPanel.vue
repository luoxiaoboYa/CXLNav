<template>
  <section class="management-panel">
    <SectionHeader title="待整理中心" description="集中处理导入、登录合并和日常使用产生的问题项。" />

    <div class="rule-strip" aria-label="待整理规则">
      <span>缺少说明</span>
      <span>疑似重复</span>
      <span>长期未打开</span>
      <span>链接疑似失效</span>
      <span>登录合并冲突</span>
    </div>

    <div class="status-tabs" aria-label="待整理状态筛选">
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

    <div class="task-list">
      <article v-for="item in visibleRecords" :key="item.title" class="task-card">
        <div>
          <strong>{{ item.priority }}优先级</strong>
          <h3>{{ item.title }}</h3>
          <p>{{ item.reason }}</p>
          <p v-if="actionMessages[item.title]" class="action-result">{{ actionMessages[item.title] }}</p>
        </div>
        <dl>
          <div>
            <dt>来源</dt>
            <dd>{{ item.source }}</dd>
          </div>
          <div>
            <dt>建议处理</dt>
            <dd>{{ item.suggestedAction }}</dd>
          </div>
          <div>
            <dt>当前状态</dt>
            <dd>{{ getRecordStatus(item.title) }}</dd>
          </div>
        </dl>
        <div class="actions">
          <button type="button" @click="startOrganizing(item)">立即整理</button>
          <button
            v-if="getRecordStatus(item.title) === '整理中'"
            type="button"
            class="complete"
            @click="completeOrganizing(item)"
          >
            标记完成
          </button>
          <button type="button" class="secondary" @click="deferOrganizing(item)">稍后处理</button>
        </div>
      </article>
    </div>

    <p v-if="visibleRecords.length === 0" class="empty-state">当前状态下暂无待处理项。</p>

    <section class="merge-note">
      <h3>登录后合并原则</h3>
      <p>URL 去重、标签取并集、最近使用时间取最新；标题、分类、备注和书签路径冲突不阻塞登录，统一进入待整理中心。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import SectionHeader from '../SectionHeader.vue'
import { organizeRecords, type OrganizeRecord } from '../../data/settings'

type OrganizeStatus = '待整理' | '整理中' | '稍后处理' | '已完成'

const statusTabs = ['全部', '待整理', '整理中', '稍后处理', '已完成'] as const

const activeStatus = ref<(typeof statusTabs)[number]>('全部')
const recordStatuses = reactive<Record<string, OrganizeStatus>>(
  Object.fromEntries(organizeRecords.map((item) => [item.title, '待整理'])) as Record<string, OrganizeStatus>
)
const actionMessages = reactive<Record<string, string>>({})

const getRecordStatus = (title: string) => recordStatuses[title] ?? '待整理'

const visibleRecords = computed(() =>
  activeStatus.value === '全部'
    ? organizeRecords
    : organizeRecords.filter((item) => getRecordStatus(item.title) === activeStatus.value)
)

const getStatusCount = (status: (typeof statusTabs)[number]) => {
  if (status === '全部') {
    return organizeRecords.length
  }

  return organizeRecords.filter((item) => getRecordStatus(item.title) === status).length
}

const startOrganizing = (item: OrganizeRecord) => {
  recordStatuses[item.title] = '整理中'
  actionMessages[item.title] = `已进入整理流程：${item.suggestedAction}。保存后状态会变为“已完成”，仍可从整理中 Tab 找回。`
  activeStatus.value = '整理中'
}

const deferOrganizing = (item: OrganizeRecord) => {
  recordStatuses[item.title] = '稍后处理'
  actionMessages[item.title] = '已放入稍后处理，不再阻塞导入或登录合并；稍后处理 Tab 会保留提醒。'
  activeStatus.value = '稍后处理'
}

const completeOrganizing = (item: OrganizeRecord) => {
  recordStatuses[item.title] = '已完成'
  actionMessages[item.title] = '已完成整理：从待处理队列移出，历史结果可在“已完成”Tab 查看。'
  activeStatus.value = '已完成'
}
</script>

<style scoped>
.management-panel,
.task-list,
.task-card,
.merge-note {
  display: grid;
  gap: 16px;
}

.rule-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rule-strip span {
  padding: 8px 10px;
  border: 1px solid rgba(139, 233, 253, 0.26);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.12);
  color: var(--color-accent, #8be9fd);
  font-weight: 700;
}

.task-card {
  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.9fr) auto;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--color-border, rgba(139, 233, 253, 0.22));
  border-radius: 18px;
  background:
    radial-gradient(circle at 10% 0%, rgba(139, 233, 253, 0.12), transparent 26%),
    var(--control-background, rgba(24, 35, 90, 0.76));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

h3,
p,
dl,
dt,
dd {
  margin: 0;
}

.task-card strong {
  color: var(--color-accent, #8be9fd);
}

p,
dd {
  color: var(--color-text-muted, #9aa8d4);
}

dl,
.actions {
  display: grid;
  gap: 8px;
}

dt {
  font-weight: 700;
}

button {
  border: 1px solid var(--color-primary, #6d5dfc);
  border-radius: 12px;
  background: var(--primary-action-background, #6d5dfc);
  color: var(--primary-action-text, var(--color-text, #edf3ff));
  padding: 10px 12px;
  font: inherit;
}

button.secondary {
  border-color: var(--color-border, rgba(139, 233, 253, 0.22));
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text, #edf3ff);
}

button.complete {
  border-color: rgba(139, 233, 253, 0.5);
  background: rgba(139, 233, 253, 0.14);
  color: var(--color-accent, #8be9fd);
}

.tab-button {
  border-color: var(--color-border, rgba(139, 233, 253, 0.22));
  background: var(--control-background, rgba(24, 35, 90, 0.76));
  color: var(--color-text-muted, #9aa8d4);
}

.tab-button.active {
  border-color: rgba(139, 233, 253, 0.62);
  background: rgba(61, 90, 254, 0.34);
  color: var(--color-text, #edf3ff);
  font-weight: 700;
}

.action-result,
.empty-state {
  margin-top: 8px;
  color: var(--color-accent, #8be9fd);
  font-weight: 700;
}

.merge-note {
  padding: 14px;
  border: 1px dashed rgba(139, 233, 253, 0.34);
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 12%, rgba(139, 233, 253, 0.1), transparent 32%),
    var(--muted-panel-background, rgba(8, 11, 31, 0.28));
}

@media (max-width: 960px) {
  .task-card {
    grid-template-columns: 1fr;
  }
}
</style>
