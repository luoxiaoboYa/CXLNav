<template>
  <section class="home-page">
    <section class="galaxy-hero">
      <div class="hero-copy">
        <p class="eyebrow">星图导航</p>
        <h1>URL Galaxy</h1>
        <p>把常用站点、分类和推荐资源放进同一个网址星系，先快速抵达，再按轨道继续探索。</p>
        <SearchBar placeholder="搜索 GitHub、设计资源、AI 工具或任意标签…" />
      </div>

      <div class="galaxy-map" aria-label="常访问星图">
        <div class="galaxy-core">
          <span>36 stars mapped</span>
          <strong>CXSearch</strong>
        </div>
        <article
          v-for="(item, index) in frequentVisits"
          :key="item.title"
          :class="['orbit-card', `orbit-${index + 1}`]"
        >
          <span>{{ item.title.charAt(0) }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.tags.join(' / ') }}</small>
        </article>
      </div>
    </section>

    <section class="hero-layout">
      <section class="panel featured-panel">
        <SectionHeader title="常访问" description="首页最大板块，优先承接日常高频入口。" />
        <div class="featured-grid">
          <CardTile
            v-for="(item, index) in frequentVisits"
            :key="item.title"
            :description="item.description"
            :featured="index < 2"
            :tags="item.tags"
            :title="item.title"
          />
        </div>
      </section>

      <aside class="hero-side" aria-label="轨道推荐">
        <p class="rail-label">轨道推荐</p>
        <section class="panel">
          <SectionHeader title="系统推荐" description="首屏保留辅助推荐，但不让右侧跟着整页一起拉长。" />
          <CardTile
            :description="supportingRecommendations[0].description"
            :tags="supportingRecommendations[0].tags"
            :title="supportingRecommendations[0].title"
            tone="warm"
          />
        </section>

        <section class="panel">
          <SectionHeader title="用户分享" description="社区内容留在右侧辅助位，深入浏览再去推荐发现页。" />
          <CardTile
            :description="supportingRecommendations[1].description"
            :tags="supportingRecommendations[1].tags"
            :title="supportingRecommendations[1].title"
            tone="cool"
          />
        </section>
      </aside>
    </section>

    <section class="panel category-orbits">
      <SectionHeader title="个人分类浏览" description="从首页继续进入完整的个人内容结构。" />
      <div class="triple-grid">
        <CardTile
          v-for="item in categoryGroups"
          :key="item.title"
          :description="item.description"
          :tags="item.tags"
          :title="item.title"
        />
      </div>
    </section>

    <section class="panel activity-panel">
      <SectionHeader title="最近动态" description="补充时间维度，让首页还能承接最近操作。" />
      <div class="double-grid">
        <CardTile
          v-for="item in recentGroups"
          :key="item.title"
          :description="item.description"
          :tags="item.tags"
          :title="item.title"
        />
      </div>
    </section>

    <section class="panel discovery-panel">
      <SectionHeader title="继续发现" description="首屏之后回到主内容流，避免右侧出现大块空白。" />
      <div class="triple-grid">
        <CardTile
          v-for="item in continueDiscovery"
          :key="item.title"
          :description="item.description"
          :tags="item.tags"
          :title="item.title"
        />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import CardTile from '../components/CardTile.vue'
import SearchBar from '../components/SearchBar.vue'
import SectionHeader from '../components/SectionHeader.vue'
import {
  categoryGroups,
  continueDiscovery,
  frequentVisits,
  recentGroups,
  supportingRecommendations
} from '../data/home'
</script>

<style scoped>
.home-page {
  display: grid;
  gap: 22px;
  color: var(--color-text);
}

.galaxy-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.05fr);
  gap: 24px;
  min-height: 430px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 22%, rgba(139, 233, 253, 0.2), transparent 25%),
    radial-gradient(circle at 82% 18%, rgba(109, 93, 252, 0.3), transparent 28%),
    var(--panel-strong-background);
}

.galaxy-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 14% 68%, rgba(255, 255, 255, 0.82) 0 1px, transparent 2px),
    radial-gradient(circle at 74% 56%, rgba(139, 233, 253, 0.75) 0 2px, transparent 3px),
    radial-gradient(circle at 88% 82%, rgba(255, 255, 255, 0.72) 0 1px, transparent 2px);
  pointer-events: none;
}

.hero-copy,
.galaxy-map {
  position: relative;
  z-index: 1;
}

.hero-copy {
  display: grid;
  align-content: center;
  gap: 18px;
}

.eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 800;
}

.hero-copy h1 {
  margin: 0;
  font-size: 3.4rem;
  line-height: 1;
}

.hero-copy p:not(.eyebrow) {
  max-width: 620px;
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.galaxy-map {
  min-height: 360px;
}

.galaxy-core {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  width: 190px;
  height: 190px;
  place-content: center;
  gap: 8px;
  border: 1px solid rgba(139, 233, 253, 0.38);
  border-radius: 999px;
  background: radial-gradient(circle at 35% 30%, rgba(139, 233, 253, 0.25), transparent 24%), var(--color-primary);
  color: #ffffff;
  text-align: center;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 28px rgba(109, 93, 252, 0.34);
}

.galaxy-core span {
  color: #d7e2ff;
  font-size: 0.78rem;
}

.galaxy-core strong {
  font-size: 1.45rem;
}

.orbit-card {
  position: absolute;
  display: grid;
  gap: 4px;
  min-width: 142px;
  padding: 12px;
  border: 1px solid rgba(139, 233, 253, 0.42);
  border-radius: 18px;
  background: var(--control-background);
  box-shadow: 0 0 14px rgba(61, 90, 254, 0.12);
}

.orbit-card::before {
  content: "";
  position: absolute;
  inset: -18px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 999px;
  pointer-events: none;
}

.orbit-card > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 999px;
  background: var(--color-accent);
  color: #080b1f;
  font-weight: 900;
}

.orbit-card strong {
  color: var(--color-text);
}

.orbit-card small {
  color: var(--color-text-muted);
}

.orbit-1 {
  left: 6%;
  top: 12%;
}

.orbit-2 {
  right: 5%;
  top: 20%;
}

.orbit-3 {
  left: 16%;
  bottom: 12%;
}

.orbit-4 {
  right: 15%;
  bottom: 8%;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.85fr);
  gap: 20px;
  align-items: start;
}

.hero-main,
.hero-side {
  display: grid;
  gap: 20px;
}

.panel {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--panel-background);
}

.featured-panel {
  background: var(--panel-strong-background);
}

.hero-side {
  position: sticky;
  top: 20px;
}

.rail-label {
  margin: 0 0 10px;
  color: var(--color-accent);
  font-size: 0.86rem;
  font-weight: 800;
}

.category-orbits {
  background:
    radial-gradient(circle at 12% 18%, rgba(139, 233, 253, 0.12), transparent 24%),
    var(--panel-background);
}

.featured-grid,
.double-grid,
.triple-grid {
  display: grid;
  gap: 12px;
}

.featured-grid,
.double-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.triple-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 960px) {
  .galaxy-hero,
  .hero-layout,
  .featured-grid,
  .double-grid,
  .triple-grid {
    grid-template-columns: 1fr;
  }

  .galaxy-map {
    min-height: 520px;
  }

  .hero-side {
    position: static;
  }
}

@media (max-width: 640px) {
  .galaxy-hero {
    min-height: auto;
    padding: 18px;
  }

  .hero-copy h1 {
    font-size: 2.35rem;
  }

  .galaxy-map {
    display: grid;
    gap: 12px;
    min-height: auto;
  }

  .galaxy-core,
  .orbit-card {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    width: auto;
    height: auto;
    min-width: 0;
    transform: none;
  }
}
</style>
