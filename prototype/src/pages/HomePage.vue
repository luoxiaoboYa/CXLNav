<template>
  <section class="home-page">
    <SearchBar placeholder="搜索我的站点、标签、详情，也可以切换到推荐范围…" />

    <section class="hero-layout">
      <div class="hero-main">
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
      </div>

      <aside class="hero-side">
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

    <section class="panel">
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

    <section class="panel">
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

    <section class="panel">
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
  gap: 20px;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.85fr);
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
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.featured-panel {
  background: linear-gradient(135deg, rgba(27, 106, 82, 0.08), rgba(255, 253, 248, 0.96));
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
  .hero-layout,
  .featured-grid,
  .double-grid,
  .triple-grid {
    grid-template-columns: 1fr;
  }
}
</style>
