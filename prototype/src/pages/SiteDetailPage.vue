<template>
  <section class="site-detail-page">
    <header class="page-header">
      <div>
        <h2 class="eyebrow">站点详情</h2>
        <h1>{{ site?.title ?? '未找到站点' }}</h1>
        <p class="page-summary">
          {{
            site?.description ??
            '当前原型里没有找到对应站点，后续开发时这里会接真实数据和异常状态处理。'
          }}
        </p>
      </div>

      <div class="header-actions">
        <button class="primary-action" type="button">打开站点</button>
        <button class="ghost-link" type="button">编辑</button>
        <button class="ghost-link" type="button">{{ site?.archiveStatus === 'archived' ? '恢复' : '归档' }}</button>
        <RouterLink class="ghost-link" to="/my-sites">返回我的站点</RouterLink>
      </div>
    </header>

    <section v-if="site" class="detail-layout">
      <article class="panel hero-panel">
        <div class="hero-top">
          <span class="meta-chip">{{ site.category }}</span>
          <span class="meta-chip">{{ site.bookmarkPath }}</span>
          <span class="meta-chip">{{ getSecurityLabel(site.securityStatus) }}</span>
          <span class="updated-at">{{ site.updatedAt }}</span>
        </div>

        <p class="detail-copy">{{ site.detail }}</p>

        <p v-if="site.recommendationHint" class="recommendation-hint">
          {{ site.recommendationHint }}，可查看公开说明或补充自己的推荐理由。
        </p>

        <ul class="tag-list">
          <li v-for="tag in site.tags" :key="tag">{{ tag }}</li>
        </ul>
      </article>

      <section class="panel action-panel" aria-label="个人站点操作">
        <button class="primary-action" type="button" :disabled="!canShare" @click="shareFlowVisible = true">
          共享到推荐库
        </button>
        <button class="ghost-link" type="button">查看推荐库说明</button>
        <button class="ghost-link" type="button">补充备注</button>
        <button class="ghost-link" type="button">重新检测</button>
        <button class="danger-action" type="button">删除</button>
      </section>

      <section v-if="shareFlowVisible" class="panel share-flow-panel" aria-label="共享申请流程">
        <div>
          <span class="meta-chip">共享申请</span>
          <h2>共享到推荐库</h2>
          <p>共享只提交公开信息，个人备注、个人标签、书签路径和打开频率不会公开。</p>
        </div>

        <div class="share-form-grid">
          <label>
            <span>公开标题</span>
            <input type="text" :value="site.title" />
          </label>
          <label>
            <span>公开分类</span>
            <select>
              <option>{{ site.category }}</option>
              <option>设计资源</option>
              <option>效率工具</option>
            </select>
          </label>
          <label class="full-width">
            <span>推荐理由</span>
            <textarea rows="3" placeholder="说明为什么值得推荐，公开展示给其他用户。"></textarea>
          </label>
        </div>

        <ol class="flow-steps">
          <li>URL 协议、内网地址、跳转链和超时校验。</li>
          <li>重复检测：完整 URL 已存在时引导补充推荐理由，不重复创建推荐对象。</li>
          <li>新主站点进入后台审核；已审核主站点下的功能站点可走快速审核。</li>
          <li>审核通过后进入推荐发现，举报或风险命中后进入复审。</li>
        </ol>

        <div class="header-actions">
          <button class="primary-action" type="button">提交共享申请</button>
          <button class="ghost-link" type="button" @click="shareFlowVisible = false">取消</button>
        </div>
      </section>

      <section class="detail-grid three-columns">
        <article class="panel">
          <h2>个人站点详情</h2>
          <ul class="info-list">
            <li>站点名称：{{ site.title }}</li>
            <li>站点链接：{{ site.url }}</li>
            <li>分类：{{ site.category }}</li>
            <li>书签路径：{{ site.bookmarkPath }}</li>
            <li>标签：{{ site.tags.join(' / ') }}</li>
            <li>最近打开：{{ site.lastOpenedAt }}</li>
            <li>最近更新时间：{{ site.updatedAt }}</li>
          </ul>
        </article>

        <article class="panel">
          <h2>状态与整理</h2>
          <ul class="info-list">
            <li>整理状态：{{ getOrganizeLabel(site.organizeStatus) }}</li>
            <li>安全状态：{{ getSecurityLabel(site.securityStatus) }}</li>
            <li>归档状态：{{ site.archiveStatus === 'archived' ? '已归档' : '正常' }}</li>
            <li>共享状态：{{ getShareLabel(site.shareStatus) }}</li>
            <li>风险或未校验站点不能发起共享。</li>
          </ul>
        </article>

        <article class="panel">
          <h2>私人信息边界</h2>
          <ul class="info-list">
            <li>个人备注、个人标签、书签路径和使用频率不会公开。</li>
            <li>删除个人站点不会删除已发布的公开推荐内容。</li>
            <li>从推荐库收藏时，平台标签只作为建议。</li>
          </ul>
        </article>
      </section>

      <section class="detail-grid">
        <article class="panel public-panel">
          <span class="meta-chip">公开主站点详情</span>
          <h2>{{ publicMainSite.title }}</h2>
          <p>{{ publicMainSite.description }}</p>
          <ul class="info-list">
            <li>分类：{{ publicMainSite.category }}</li>
            <li>平台标签：{{ publicMainSite.tags.join(' / ') }}</li>
            <li>收藏数：{{ publicMainSite.favoriteCount }}</li>
            <li>可操作：打开官网 / 收藏到我的站点 / 补充推荐理由 / 举报</li>
          </ul>
        </article>

        <article class="panel public-panel">
          <span class="meta-chip">公开功能站点详情</span>
          <h2>{{ publicFeatureSite.title }}</h2>
          <p>{{ publicFeatureSite.description }}</p>
          <ul class="info-list">
            <li>所属主站点：{{ publicFeatureSite.parent }}</li>
            <li>平台标签：{{ publicFeatureSite.tags.join(' / ') }}</li>
            <li>推荐理由：{{ publicFeatureSite.reason }}</li>
            <li>可操作：打开 / 收藏 / 查看所属主站点 / 举报</li>
          </ul>
        </article>
      </section>
    </section>

    <section v-else class="panel empty-state">
      <h2>站点不存在</h2>
      <p>请返回我的站点重新选择。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { findSiteByTitle } from '../data/sites'

const route = useRoute()
const siteTitle = computed(() => String(route.params.siteTitle ?? ''))
const site = computed(() => findSiteByTitle(siteTitle.value))
const canShare = computed(() => site.value?.securityStatus === 'safe' && site.value.archiveStatus === 'active')
const shareFlowVisible = ref(false)

const organizeLabels = {
  complete: '信息完整',
  missing_description: '缺少说明',
  missing_tags: '缺少标签',
  duplicate_suspected: '疑似重复',
  link_problem: '链接异常',
  path_pending: '路径待确认',
  stale: '长期未打开'
}

const securityLabels = {
  unchecked: '未校验',
  checking: '校验中',
  safe: '正常',
  unreachable: '无法访问',
  risky: '存在风险',
  blocked: '已阻止'
}

const shareLabels = {
  none: '未共享',
  pending: '审核中',
  published: '已发布',
  rejected: '审核拒绝'
}

const publicMainSite = {
  title: 'GitHub',
  description: '公开推荐库里的主站点对象，展示公开标题、链接、描述、分类、平台标签和推荐理由。',
  category: '开发',
  tags: ['开源', '代码托管', '协作'],
  favoriteCount: 128
}

const publicFeatureSite = {
  title: 'GitHub Trending',
  description: '功能站点表示具体页面、项目、模板或文档，可关联到主站点，也可以独立存在。',
  parent: 'GitHub',
  tags: ['趋势', '开源项目'],
  reason: '每天查看开源趋势很方便。'
}

const getOrganizeLabel = (status: keyof typeof organizeLabels) => organizeLabels[status]
const getSecurityLabel = (status: keyof typeof securityLabels) => securityLabels[status]
const getShareLabel = (status: keyof typeof shareLabels) => shareLabels[status]
</script>

<style scoped>
.site-detail-page,
.detail-layout,
.detail-grid {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
}

.eyebrow,
.page-summary,
.updated-at,
.empty-state p {
  margin: 0;
  color: #61685f;
}

.eyebrow {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1b6a52;
}

h1,
h2 {
  margin: 0;
}

.page-summary {
  margin-top: 8px;
  max-width: 720px;
  line-height: 1.6;
}

.header-actions,
.action-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: end;
}

.action-panel {
  justify-content: start;
}

.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.share-flow-panel {
  display: grid;
  gap: 16px;
  border-color: #b8c9be;
  background: #f5fbf8;
}

.share-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.share-form-grid label {
  display: grid;
  gap: 8px;
}

.share-form-grid input,
.share-form-grid select,
.share-form-grid textarea {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
}

.full-width {
  grid-column: 1 / -1;
}

.flow-steps {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
  color: #61685f;
}

.hero-panel {
  background: linear-gradient(135deg, rgba(27, 106, 82, 0.08), rgba(255, 253, 248, 0.96));
}

.hero-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.meta-chip,
.tag-list li,
.ghost-link,
.primary-action,
.danger-action {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d7d2c6;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #1f251f;
  text-decoration: none;
  font: inherit;
}

.primary-action {
  border-color: #1b6a52;
  background: #1b6a52;
  color: #ffffff;
}

.primary-action:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.danger-action {
  border-color: #e4c7c2;
  color: #9d2f24;
}

.detail-copy {
  margin: 16px 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
}

.tag-list,
.info-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommendation-hint {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 16px;
  background: #deeee7;
  color: #1b6a52;
}

.info-list {
  display: grid;
  gap: 10px;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.three-columns {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.public-panel {
  display: grid;
  gap: 12px;
}

.public-panel p {
  margin: 0;
  color: #61685f;
  line-height: 1.6;
}

.empty-state {
  display: grid;
  gap: 8px;
}

@media (max-width: 960px) {
  .page-header,
  .detail-grid,
  .three-columns,
  .hero-top {
    grid-template-columns: 1fr;
    display: grid;
  }

  .header-actions {
    justify-content: start;
  }

  .share-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
