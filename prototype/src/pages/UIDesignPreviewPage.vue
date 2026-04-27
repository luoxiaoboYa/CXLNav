<template>
  <section class="design-page">
    <header class="hero">
      <div>
        <p class="eyebrow">CXSearch UI Direction Compare</p>
        <h1>多套 UI 视觉方案对比</h1>
        <p>先看方向，不接业务逻辑。你可以按整体气质选一版，再进入 UI 静态页面开发。</p>
      </div>
      <aside class="hero-note">
        <span>已确认方案</span>
        <strong>K6 太空探索 / 网址星图</strong>
        <p>最终使用星空、轨道和星标的视觉隐喻；后续静态页面按这套风格和配色展开。</p>
      </aside>
    </header>
    <section class="panel playful-panel">
      <SectionHeader title="趣味风格板" description="这部分完全跳出专业工具感，探索更可爱、艺术化、主题化的方向。" />
      <div class="playful-grid">
        <article v-for="style in playfulStyles" :key="style.key" :class="['playful-card', style.className]">
          <div class="playful-top">
            <span class="playful-mark">{{ style.key }}</span>
            <strong>{{ style.name }}</strong>
          </div>
          <p>{{ style.description }}</p>
          <div class="playful-scene">
            <div class="playful-orbit one"></div>
            <div class="playful-orbit two"></div>
            <div class="playful-note main-note">
              <strong>{{ style.sampleTitle }}</strong>
              <span>{{ style.sampleMeta }}</span>
            </div>
            <div class="playful-note small-note"></div>
            <div class="playful-note tiny-note"></div>
          </div>
          <div class="playful-footer">
            <span v-for="tag in style.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <SectionHeader title="方案总览" description="四套方案使用同一信息结构，只改变视觉气质、色彩、卡片和组件表达。" />
      <div class="direction-grid">
        <article v-for="direction in directions" :key="direction.key" class="direction-card" :style="directionStyle(direction)">
          <div class="direction-head">
            <span class="direction-key">{{ direction.key }}</span>
            <span class="direction-tag">{{ direction.tag }}</span>
          </div>
          <h3>{{ direction.name }}</h3>
          <p>{{ direction.description }}</p>
          <div class="direction-palette">
            <span v-for="color in direction.colors" :key="color" :style="{ background: color }"></span>
          </div>
          <div class="direction-actions">
            <button class="direction-primary" type="button">{{ direction.primaryAction }}</button>
            <button class="direction-secondary" type="button">查看站点</button>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <SectionHeader title="横向页面预览" description="同样的首页 / 站点卡片 / 管理入口，在不同视觉方案下的效果。" />
      <div class="preview-grid">
        <article v-for="direction in directions" :key="`${direction.key}-preview`" class="preview-card" :style="directionStyle(direction)">
          <div class="preview-topbar">
            <strong>CXSearch</strong>
            <span>首页</span>
            <span>我的站点</span>
            <span>推荐</span>
          </div>
          <div class="preview-hero">
            <p>{{ direction.tag }}</p>
            <h3>{{ direction.previewTitle }}</h3>
            <div class="preview-search">搜索 GitHub、设计灵感、AI 工具…</div>
          </div>
          <div class="preview-sites">
            <div class="preview-site personal">
              <span class="preview-icon">G</span>
              <div>
                <strong>GitHub</strong>
                <p>个人站点 · 高频协作</p>
              </div>
            </div>
            <div class="preview-site recommend">
              <span class="preview-icon alt">R</span>
              <div>
                <strong>内容导航案例集</strong>
                <p>系统推荐 · 热度 92</p>
              </div>
            </div>
          </div>
          <div class="preview-tabs">
            <span class="active">全部 12</span>
            <span>待整理 3</span>
            <span>已完成 9</span>
          </div>
        </article>
      </div>
    </section>

    <section class="panel playful-home-panel" aria-label="趣味风格首页方案">
      <SectionHeader title="趣味风格首页方案" description="下面把趣味风格板里的 6 个方向展开成首页草案，不改全站顶部导航，只看首页主体气质。" />
      <div class="playful-home-stack">
        <article
          v-for="style in playfulStyles"
          :key="`${style.key}-homepage`"
          :aria-label="`${style.name} 首页方案`"
          :class="['playful-home', `${style.className}-home`]"
        >
          <header class="playful-home-intro">
            <span>{{ style.key }}</span>
            <div>
              <strong>{{ style.key }} {{ style.name }}</strong>
              <p>{{ style.description }}</p>
            </div>
          </header>

          <div v-if="style.key === 'K1'" class="playful-home-screen garden-home">
            <div class="garden-hero">
              <span>今日小花园</span>
              <strong>常用站点正在开花</strong>
              <p>用花圃分区承接常访问、待整理和最近收藏。</p>
            </div>
            <div class="garden-bed">
              <article><span>🌼</span><strong>GitHub</strong><small>开发花圃</small></article>
              <article><span>🌷</span><strong>Figma</strong><small>灵感花圃</small></article>
              <article><span>🌱</span><strong>Notion</strong><small>新芽待整理</small></article>
            </div>
          </div>

          <div v-else-if="style.key === 'K2'" class="playful-home-screen doodle-home">
            <div class="doodle-note main">
              <strong>灵感便签夹</strong>
              <p>把今天要看的站点贴在首页。</p>
            </div>
            <div class="doodle-pin one">GitHub<br /><span>开发</span></div>
            <div class="doodle-pin two">Figma<br /><span>设计</span></div>
            <div class="doodle-pin three">AI Tools<br /><span>推荐</span></div>
            <div class="doodle-search">搜索便签、标签、灵感来源</div>
          </div>

          <div v-else-if="style.key === 'K3'" class="playful-home-screen pixel-home">
            <div class="pixel-status">BOOKMARK QUEST · LV.24</div>
            <div class="pixel-grid">
              <article>GITHUB<span>OPEN</span></article>
              <article>FIGMA<span>DESIGN</span></article>
              <article>NOTION<span>DOCS</span></article>
              <article>LINEAR<span>TASK</span></article>
            </div>
            <div class="pixel-command">A 打开 · B 编辑 · START 整理</div>
          </div>

          <div v-else-if="style.key === 'K4'" class="playful-home-screen magazine-home">
            <div class="magazine-masthead">WEB PICKS MONTHLY</div>
            <article class="magazine-cover">
              <span>Vol.04</span>
              <strong>本月值得收藏的网站</strong>
              <p>设计系统、AI 工具、开发文档与效率工作流。</p>
            </article>
            <div class="magazine-columns">
              <span>Design Systems</span>
              <span>AI Tools</span>
              <span>Dev Docs</span>
            </div>
          </div>

          <div v-else-if="style.key === 'K5'" class="playful-home-screen forest-home">
            <div class="forest-canopy">
              <strong>我的资源森林</strong>
              <span>新芽 5 · 成熟分类 8 · 待修枝 2</span>
            </div>
            <div class="forest-path">
              <article><strong>开发文档</strong><span>主干路径</span></article>
              <article><strong>设计资源</strong><span>灵感树冠</span></article>
              <article><strong>待整理</strong><span>新芽篮</span></article>
            </div>
          </div>

          <div v-else class="playful-home-screen galaxy-home">
            <div class="galaxy-core">
              <strong>URL Galaxy</strong>
              <span>36 stars mapped</span>
            </div>
            <div class="orbit orbit-one"><span>GitHub</span></div>
            <div class="orbit orbit-two"><span>Figma</span></div>
            <div class="orbit orbit-three"><span>AI Tools</span></div>
            <div class="galaxy-dock">探索 · 收藏 · 整理轨道</div>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <SectionHeader title="方案判断" description="我先给出取舍，方便你快速判断。" />
      <div class="judge-grid">
        <article v-for="direction in directions" :key="`${direction.key}-judge`" class="judge-card">
          <h3>{{ direction.key }}：{{ direction.name }}</h3>
          <dl>
            <div>
              <dt>适合</dt>
              <dd>{{ direction.bestFor }}</dd>
            </div>
            <div>
              <dt>优点</dt>
              <dd>{{ direction.pros }}</dd>
            </div>
            <div>
              <dt>风险</dt>
              <dd>{{ direction.cons }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>

    <section class="panel selected-panel">
      <SectionHeader title="当前详细方案：K6 太空探索 / 网址星图" description="已确认使用 K6 的星空底色、霓虹蓝紫和轨道卡片作为静态页面开发基础。" />
      <div class="palette">
        <article v-for="item in palette" :key="item.name" class="color-card">
          <span class="swatch" :style="{ background: item.value }"></span>
          <strong>{{ item.name }}</strong>
          <p>{{ item.usage }}</p>
          <code>{{ item.value }}</code>
        </article>
      </div>

      <div class="components">
        <article class="component-card">
          <h3>按钮</h3>
          <div class="row">
            <button class="btn primary" type="button">保存站点</button>
            <button class="btn secondary" type="button">稍后处理</button>
            <button class="btn danger" type="button">删除</button>
          </div>
        </article>
        <article class="component-card">
          <h3>状态 Tab</h3>
          <div class="row">
            <button class="tab active" type="button">全部 12</button>
            <button class="tab" type="button">待整理 3</button>
            <button class="tab" type="button">已完成 9</button>
          </div>
        </article>
        <article class="component-card">
          <h3>标签体系</h3>
          <div class="row">
            <span class="chip personal">个人标签</span>
            <span class="chip platform">平台标签</span>
            <span class="chip warning">待补标签</span>
          </div>
        </article>
        <article class="component-card">
          <h3>表单</h3>
          <label>
            <span>站点链接</span>
            <input value="https://router.vuejs.org" />
          </label>
        </article>
      </div>
    </section>

    <section class="decision">
      <div>
        <h2>最终决定</h2>
        <p>已确认使用 K6「太空探索 / 网址星图」。顶部导航结构保持现状，首页主体和后续页面视觉按星图风格推进。</p>
      </div>
      <RouterLink class="btn primary" to="/settings">回到管理中心</RouterLink>
    </section>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SectionHeader from '../components/SectionHeader.vue'

type Direction = {
  key: string
  name: string
  tag: string
  description: string
  primaryAction: string
  previewTitle: string
  bestFor: string
  pros: string
  cons: string
  colors: string[]
  vars: Record<string, string>
}

const playfulStyles = [
  {
    key: 'K1',
    name: '可爱治愈 / 书签花园',
    className: 'cute-style',
    description: '圆润软色、小表情和花园隐喻，让整理站点像照顾自己的小收藏。',
    sampleTitle: '今日常用小站',
    sampleMeta: '🌱 12 个已整理',
    tags: ['软萌', '低压力', '个人感']
  },
  {
    key: 'K2',
    name: '手绘涂鸦 / 灵感手帐',
    className: 'doodle-style',
    description: '手写线条、便签、马克笔高亮，适合灵感收藏和设计资源管理。',
    sampleTitle: '灵感便签夹',
    sampleMeta: '✦ 设计 / 素材 / 参考',
    tags: ['手绘', '贴纸', '创作感']
  },
  {
    key: 'K3',
    name: '像素复古 / 书签掌机',
    className: 'pixel-style',
    description: '像素边框、复古游戏 UI、方块按钮，辨识度强，像一台网址小掌机。',
    sampleTitle: 'BOOKMARK QUEST',
    sampleMeta: 'LV.24 收藏家',
    tags: ['像素', '复古', '游戏感']
  },
  {
    key: 'K4',
    name: '日系杂志 / 网站月刊',
    className: 'magazine-style',
    description: '大留白、精致排版、栏目式内容，推荐发现更像一本网站收藏杂志。',
    sampleTitle: 'Web Picks Monthly',
    sampleMeta: 'Vol. 04 / Tools & Design',
    tags: ['留白', '杂志', '内容感']
  },
  {
    key: 'K5',
    name: '自然植物 / 资源森林',
    className: 'nature-style',
    description: '叶片、年轮、成长隐喻，把分类和待整理做成资源森林。',
    sampleTitle: '我的资源森林',
    sampleMeta: '🍃 新芽 5 个待整理',
    tags: ['自然', '成长', '安静']
  },
  {
    key: 'K6',
    name: '太空探索 / 网址星图',
    className: 'space-style',
    description: '星空、轨道、星球分类，站点像星标，适合做非常有主题感的导航。',
    sampleTitle: 'URL Galaxy',
    sampleMeta: '☄ 36 stars mapped',
    tags: ['星图', '探索', '沉浸']
  }
]
const styleBoards = [
  {
    key: 'P1',
    name: 'Command Center / 命令中心',
    className: 'command-style',
    description: '以搜索和键盘操作为核心，适合高频打开、快速定位和开发者使用。',
    points: ['大搜索框占视觉中心', '卡片更紧凑', '状态信息弱化']
  },
  {
    key: 'P2',
    name: 'Bento Workspace / 模块工作台',
    className: 'bento-style',
    description: '用 Bento 卡片组织常用、待整理、推荐、导入任务，首页更像个人工作台。',
    points: ['模块分区明显', '首页更有层次', '适合 PC 大屏']
  },
  {
    key: 'P3',
    name: 'Editorial Library / 内容杂志',
    className: 'editorial-style',
    description: '更强调推荐发现和内容阅读，适合公开推荐库和资源分享场景。',
    points: ['标题更大', '推荐卡片更像文章', '社区感更强']
  },
  {
    key: 'P4',
    name: 'Dense Dashboard / 高密后台',
    className: 'dense-style',
    description: '压缩间距、提高列表密度，适合大量站点、标签、导入记录的重度管理。',
    points: ['信息密度最高', '管理效率强', '视觉温度较低']
  },
  {
    key: 'P5',
    name: 'Soft Personal / 柔和个人空间',
    className: 'soft-style',
    description: '圆角更大、留白更多、颜色更柔，适合个人收藏和低压力整理。',
    points: ['亲和力强', '移动端友好', '效率感稍弱']
  },
  {
    key: 'P6',
    name: 'Pro Graphite / 专业控制台',
    className: 'pro-style',
    description: '使用深浅石墨和金色点缀，偏专业软件和高级工作台。',
    points: ['高级感强', '适合重度用户', '新用户门槛略高']
  }
]
const directions: Direction[] = [
  {
    key: 'A',
    name: '暖白墨绿 / 个人知识库',
    tag: '温和 · 耐看 · 整理友好',
    description: '暖白背景搭配墨绿色，适合长期整理、分类、标签和待处理任务。',
    primaryAction: '保存站点',
    previewTitle: '把常用站点整理成自己的导航库',
    bestFor: '个人长期使用、知识沉淀、书签整理。',
    pros: '耐看、温和、信息压力低，管理中心不显得沉重。',
    cons: '视觉冲击力一般，公开产品感略弱。',
    colors: ['#f4f0e8', '#fffdf8', '#1b6a52', '#deeee7', '#b36b22'],
    vars: {
      '--d-bg': '#f4f0e8', '--d-surface': '#fffdf8', '--d-card': '#ffffff', '--d-text': '#1f251f', '--d-muted': '#61685f', '--d-primary': '#1b6a52', '--d-primary-soft': '#deeee7', '--d-accent': '#b36b22', '--d-accent-soft': '#fff2dc', '--d-border': '#d7d2c6', '--d-info': '#4c709a', '--d-info-soft': '#edf3f8'
    }
  },
  {
    key: 'B',
    name: '冷白蓝紫 / 科技导航',
    tag: '现代 · SaaS · 推荐平台',
    description: '冷白背景搭配蓝紫主色，更像公开产品和 AI 工具导航平台。',
    primaryAction: '加入导航',
    previewTitle: '发现、收藏和分享高质量工具资源',
    bestFor: '公开产品、推荐发现、资源分享社区。',
    pros: '更现代、更有产品感，推荐发现页更吸引人。',
    cons: '个人整理温度稍弱，管理中心容易像普通 SaaS 后台。',
    colors: ['#f8fafc', '#ffffff', '#4f46e5', '#e0e7ff', '#06b6d4'],
    vars: {
      '--d-bg': '#f8fafc', '--d-surface': '#ffffff', '--d-card': '#ffffff', '--d-text': '#111827', '--d-muted': '#64748b', '--d-primary': '#4f46e5', '--d-primary-soft': '#e0e7ff', '--d-accent': '#06b6d4', '--d-accent-soft': '#cffafe', '--d-border': '#dbe3ef', '--d-info': '#7c3aed', '--d-info-soft': '#ede9fe'
    }
  },
  {
    key: 'C',
    name: '深色霓虹 / 极客工具',
    tag: '暗黑 · 极客 · 搜索优先',
    description: '深色背景搭配霓虹绿蓝，适合开发者工具和插件优先体验。',
    primaryAction: '快速收藏',
    previewTitle: '用命令中心快速打开所有站点',
    bestFor: '开发者、极客用户、默认暗黑工具。',
    pros: '辨识度强，搜索和插件体验会很酷。',
    cons: '长期整理大量内容容易疲劳，普通用户接受度较低。',
    colors: ['#0f172a', '#111827', '#22c55e', '#164e35', '#38bdf8'],
    vars: {
      '--d-bg': '#0f172a', '--d-surface': '#111827', '--d-card': '#1e293b', '--d-text': '#e5f3ef', '--d-muted': '#94a3b8', '--d-primary': '#22c55e', '--d-primary-soft': '#164e35', '--d-accent': '#38bdf8', '--d-accent-soft': '#0c4a6e', '--d-border': '#334155', '--d-info': '#a78bfa', '--d-info-soft': '#312e81'
    }
  },
  {
    key: 'D',
    name: '极简黑白 / 内容优先',
    tag: '克制 · 高密度 · 低干扰',
    description: '黑白灰为主，主色只在确认操作出现，让内容和速度优先。',
    primaryAction: '保存',
    previewTitle: '一个低干扰的高级书签管理器',
    bestFor: '追求速度、干净、内容密度和低维护成本。',
    pros: '最耐看、最克制，内容密度最高。',
    cons: '品牌记忆点弱，推荐发现页吸引力不足。',
    colors: ['#f6f6f3', '#ffffff', '#111111', '#e7e5df', '#2f7d5c'],
    vars: {
      '--d-bg': '#f6f6f3', '--d-surface': '#ffffff', '--d-card': '#ffffff', '--d-text': '#111111', '--d-muted': '#666666', '--d-primary': '#111111', '--d-primary-soft': '#e7e5df', '--d-accent': '#2f7d5c', '--d-accent-soft': '#e4f1eb', '--d-border': '#d9d6ce', '--d-info': '#555555', '--d-info-soft': '#eeeeea'
    }
  },
  {
    key: 'E',
    name: '奶油橙棕 / 手账收藏',
    tag: '温暖 · 手账 · 收藏感',
    description: '奶油色背景搭配橙棕主色，像个人收藏夹和灵感手账。',
    primaryAction: '收进收藏',
    previewTitle: '把灵感和工具都收进一本数字手账',
    bestFor: '设计师、内容创作者、灵感收藏和素材整理。',
    pros: '亲和力强，收藏感明显，适合非技术用户。',
    cons: '效率工具感稍弱，大量后台操作会显得不够利落。',
    colors: ['#fbf1df', '#fffaf2', '#c96a3a', '#ffe3c7', '#8f5d3d'],
    vars: {
      '--d-bg': '#fbf1df', '--d-surface': '#fffaf2', '--d-card': '#ffffff', '--d-text': '#30251d', '--d-muted': '#7c6858', '--d-primary': '#c96a3a', '--d-primary-soft': '#ffe3c7', '--d-accent': '#8f5d3d', '--d-accent-soft': '#f7eadb', '--d-border': '#e5cdb4', '--d-info': '#7f6ab3', '--d-info-soft': '#eee8fb'
    }
  },
  {
    key: 'F',
    name: '清新薄荷 / 轻生活工具',
    tag: '清爽 · 轻快 · 低压力',
    description: '薄荷绿和浅青色组合，整体更轻快，适合日常快速访问。',
    primaryAction: '立即保存',
    previewTitle: '轻松管理每天都要打开的网站',
    bestFor: '普通个人用户、移动端优先、轻量收藏。',
    pros: '清爽、有呼吸感，移动端会显得很轻。',
    cons: '专业感和平台感不足，复杂管理页面可能偏轻。',
    colors: ['#effaf6', '#ffffff', '#0f9f7a', '#d8f5eb', '#14b8a6'],
    vars: {
      '--d-bg': '#effaf6', '--d-surface': '#ffffff', '--d-card': '#ffffff', '--d-text': '#16342b', '--d-muted': '#5f7c73', '--d-primary': '#0f9f7a', '--d-primary-soft': '#d8f5eb', '--d-accent': '#14b8a6', '--d-accent-soft': '#ccfbf1', '--d-border': '#cce4dc', '--d-info': '#3b82f6', '--d-info-soft': '#dbeafe'
    }
  },
  {
    key: 'G',
    name: '高级石墨 / 专业效率',
    tag: '稳重 · 专业 · 高级感',
    description: '石墨灰、米白和金色强调，偏高级效率软件和专业工作台。',
    primaryAction: '确认保存',
    previewTitle: '面向专业工作的个人资源控制台',
    bestFor: '重度用户、专业工作流、企业化审美。',
    pros: '成熟、克制、有高级感，适合长期重度使用。',
    cons: '亲和力较弱，初次打开可能显得严肃。',
    colors: ['#ece9e2', '#faf9f5', '#2f3430', '#e6e0d2', '#b08d57'],
    vars: {
      '--d-bg': '#ece9e2', '--d-surface': '#faf9f5', '--d-card': '#ffffff', '--d-text': '#20231f', '--d-muted': '#686c64', '--d-primary': '#2f3430', '--d-primary-soft': '#e6e0d2', '--d-accent': '#b08d57', '--d-accent-soft': '#f3ead8', '--d-border': '#cec8bb', '--d-info': '#56657a', '--d-info-soft': '#e7ebef'
    }
  },
  {
    key: 'H',
    name: '多巴胺彩色 / 年轻社区',
    tag: '活泼 · 年轻 · 分享感',
    description: '高明度色彩和卡片拼贴感，强调分享、发现和社区氛围。',
    primaryAction: '收藏一下',
    previewTitle: '发现大家正在用的好站和工具',
    bestFor: '年轻用户、公开推荐社区、内容运营活动。',
    pros: '吸引眼球、记忆点强，推荐发现更热闹。',
    cons: '长期个人整理容易疲劳，管理中心会显得不够稳。',
    colors: ['#fff7ed', '#ffffff', '#ec4899', '#fce7f3', '#8b5cf6'],
    vars: {
      '--d-bg': '#fff7ed', '--d-surface': '#ffffff', '--d-card': '#ffffff', '--d-text': '#2f1b2d', '--d-muted': '#7a6175', '--d-primary': '#ec4899', '--d-primary-soft': '#fce7f3', '--d-accent': '#8b5cf6', '--d-accent-soft': '#ede9fe', '--d-border': '#f1d4e3', '--d-info': '#06b6d4', '--d-info-soft': '#cffafe'
    }
  }
]

const palette = [
  { name: '星空底色', value: '#080b1f', usage: '首页主体背景' },
  { name: '深空面板', value: '#11183b', usage: '主内容区和轨道背景' },
  { name: '轨道卡片', value: '#18235a', usage: '站点卡片 / 悬浮信息' },
  { name: '星云紫', value: '#6d5dfc', usage: '主按钮 / 核心星球' },
  { name: '轨道蓝', value: '#3d5afe', usage: '描边 / 轨道线' },
  { name: '星光青', value: '#8be9fd', usage: '标签 / 高亮信息' },
  { name: '星光文本', value: '#edf3ff', usage: '主文本' },
  { name: '弱星尘', value: '#9aa8d4', usage: '次级文本' }
]

const directionStyle = (direction: Direction) => direction.vars
</script>

<style scoped>
.design-page { display: grid; gap: 24px; color: #1f251f; }
.hero, .panel, .decision { border: 1px solid #d7d2c6; border-radius: 28px; background: rgba(255,253,248,.96); }
.hero { display: grid; grid-template-columns: 1fr 320px; gap: 24px; padding: 32px; background: radial-gradient(circle at 16% 22%, rgba(139,233,253,.26), transparent 28%), radial-gradient(circle at 82% 18%, rgba(109,93,252,.34), transparent 30%), #080b1f; color: #edf3ff; }
.eyebrow { margin: 0 0 10px; color: #8be9fd; font-size: .82rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.hero h1 { margin: 0; font-size: clamp(2rem, 5vw, 4rem); line-height: 1.05; }
.hero p, .hero-note p { color: #b8c4f2; }
.decision p { color: #61685f; }
.hero-note { display: grid; gap: 10px; padding: 20px; border: 1px solid #3d5afe; border-radius: 24px; background: rgba(24,35,90,.82); }
.hero-note strong { color: #8be9fd; font-size: 1.35rem; }
.panel, .decision { display: grid; gap: 18px; padding: 24px; }
.direction-grid, .preview-grid, .judge-grid, .palette, .components { display: grid; gap: 16px; }
.direction-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.direction-card, .preview-card { color: var(--d-text); border: 1px solid var(--d-border); background: var(--d-surface); }
.direction-card { display: grid; gap: 14px; min-height: 320px; padding: 18px; border-radius: 24px; }
.direction-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
.direction-key { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 14px; background: var(--d-primary); color: var(--d-surface); font-weight: 900; }
.direction-tag { color: var(--d-primary); font-size: .82rem; font-weight: 800; }
.direction-card h3, .direction-card p, .judge-card h3, .judge-card dl, .preview-card h3, .preview-card p { margin: 0; }
.direction-card p, .preview-site p, .judge-card dd { color: var(--d-muted); }
.direction-palette { display: flex; gap: 8px; margin-top: auto; }
.direction-palette span { width: 28px; height: 28px; border: 1px solid var(--d-border); border-radius: 999px; }
.direction-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.direction-primary, .direction-secondary { border: 1px solid var(--d-border); border-radius: 12px; padding: 10px 12px; font: inherit; }
.direction-primary { border-color: var(--d-primary); background: var(--d-primary); color: var(--d-surface); }
.direction-secondary { background: var(--d-card); color: var(--d-text); }
.preview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.preview-card { display: grid; gap: 16px; padding: 18px; border-radius: 28px; background: var(--d-bg); }
.preview-topbar, .preview-tabs, .preview-sites { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.preview-topbar { color: var(--d-muted); font-size: .9rem; }
.preview-topbar strong { margin-right: auto; color: var(--d-text); }
.preview-hero { display: grid; gap: 10px; padding: 18px; border: 1px solid var(--d-border); border-radius: 22px; background: linear-gradient(135deg, var(--d-primary-soft), var(--d-surface)); }
.preview-hero p { color: var(--d-primary); font-size: .82rem; font-weight: 800; }
.preview-search { padding: 12px 14px; border: 1px solid var(--d-border); border-radius: 16px; background: var(--d-card); color: var(--d-muted); }
.preview-sites { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.preview-site { display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center; padding: 12px; border: 1px solid var(--d-border); border-radius: 18px; background: var(--d-card); }
.preview-site.recommend { background: linear-gradient(135deg, var(--d-info-soft), var(--d-card)); }
.preview-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 13px; background: var(--d-primary); color: var(--d-surface); font-weight: 900; }
.preview-icon.alt { background: var(--d-info); }
.preview-tabs span { padding: 8px 10px; border: 1px solid var(--d-border); border-radius: 999px; background: var(--d-card); color: var(--d-muted); font-size: .9rem; }
.preview-tabs .active { border-color: var(--d-primary); background: var(--d-primary-soft); color: var(--d-primary); font-weight: 800; }
.playful-home-panel { overflow: hidden; }
.playful-home-stack { display: grid; gap: 24px; }
.playful-home { display: grid; gap: 16px; padding: 18px; border: 2px solid transparent; border-radius: 30px; overflow: hidden; }
.playful-home-intro { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; }
.playful-home-intro > span { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 16px; font-weight: 900; }
.playful-home-intro strong { display: block; font-size: 1.08rem; }
.playful-home-intro p { margin: 6px 0 0; line-height: 1.55; }
.playful-home-screen { min-height: 360px; border-radius: 26px; overflow: hidden; position: relative; }
.garden-home { display: grid; grid-template-columns: .9fr 1.1fr; gap: 16px; padding: 18px; background: radial-gradient(circle at 20% 24%, #fff6b8, transparent 26%), #fff0c9; }
.garden-hero { display: grid; align-content: center; gap: 10px; padding: 20px; border-radius: 24px; background: #fff5f7; color: #50313d; }
.garden-hero strong { font-size: 1.8rem; line-height: 1.15; }
.garden-hero p { margin: 0; }
.garden-bed { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: end; }
.garden-bed article { display: grid; gap: 8px; justify-items: center; min-height: 210px; padding: 16px 10px; border-radius: 999px 999px 24px 24px; background: #dff7df; color: #3f7a4b; }
.garden-bed article:nth-child(2) { min-height: 260px; background: #ffd6e2; color: #8a3756; }
.garden-bed article:nth-child(3) { min-height: 170px; }
.garden-bed span { font-size: 2rem; }
.doodle-home { min-height: 380px; padding: 22px; background: repeating-linear-gradient(-8deg, #fffaf0, #fffaf0 14px, #f4ead8 15px); border: 2px solid #24211c; box-shadow: 7px 7px 0 #24211c; color: #2f2a22; }
.doodle-note, .doodle-pin, .doodle-search { position: absolute; border: 2px solid #24211c; box-shadow: 4px 4px 0 #24211c; }
.doodle-note.main { left: 26px; top: 26px; width: min(330px, 55%); padding: 18px; background: #ffe15d; transform: rotate(-2deg); }
.doodle-note strong { font-size: 1.55rem; }
.doodle-pin { display: grid; place-items: center; width: 140px; height: 110px; padding: 14px; font-weight: 900; text-align: center; }
.doodle-pin span { font-size: .82rem; font-weight: 700; }
.doodle-pin.one { right: 130px; top: 38px; background: #b8e6ff; transform: rotate(4deg); }
.doodle-pin.two { right: 42px; top: 152px; background: #ffd6e2; transform: rotate(-5deg); }
.doodle-pin.three { left: 42%; bottom: 34px; background: #dff7df; transform: rotate(2deg); }
.doodle-search { left: 26px; right: 26px; bottom: 26px; padding: 14px 16px; background: #fff; border-radius: 999px; }
.pixel-home { display: grid; gap: 14px; align-content: start; padding: 18px; border: 4px solid #1f1f1f; border-radius: 4px; background: #2b2550; color: #7cff6b; image-rendering: pixelated; }
.pixel-status, .pixel-command { padding: 12px; border: 4px solid #1f1f1f; background: #111; font-weight: 900; }
.pixel-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.pixel-grid article { display: grid; gap: 16px; min-height: 96px; padding: 14px; border: 4px solid #1f1f1f; background: #f8f2d8; color: #171717; font-weight: 900; }
.pixel-grid span { width: fit-content; padding: 5px 7px; background: #7cff6b; color: #171717; }
.magazine-home { display: grid; grid-template-columns: 1fr 1.2fr; gap: 18px; padding: 18px; background: #fbfaf6; color: #211f1b; }
.magazine-masthead { grid-column: 1 / -1; padding-bottom: 12px; border-bottom: 4px solid #211f1b; font-size: 1.7rem; font-weight: 900; }
.magazine-cover { display: grid; align-content: end; gap: 10px; min-height: 250px; padding: 18px; background: #ede7db; border-left: 8px solid #b63f2f; }
.magazine-cover strong { font-size: 2rem; line-height: 1.08; }
.magazine-cover p { margin: 0; }
.magazine-columns { display: grid; gap: 12px; }
.magazine-columns span { padding: 18px; background: #211f1b; color: #fbfaf6; font-weight: 900; }
.forest-home { display: grid; gap: 18px; padding: 20px; background: radial-gradient(circle at 16% 80%, #d5e8c8, transparent 34%), #f8fff4; color: #253b28; }
.forest-canopy { display: grid; gap: 8px; padding: 20px; border-radius: 30px; background: #4f7f52; color: #fff; }
.forest-canopy strong { font-size: 1.8rem; }
.forest-path { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; align-items: end; }
.forest-path article { display: grid; gap: 8px; min-height: 160px; padding: 16px; border-radius: 26px 26px 14px 14px; background: #edf6e8; border: 1px solid #b8d8aa; }
.forest-path article:nth-child(2) { min-height: 220px; }
.forest-path article:nth-child(3) { min-height: 120px; background: #fff7cf; }
.galaxy-home { min-height: 390px; background: radial-gradient(circle at 28% 38%, #fff 0 2px, transparent 3px), radial-gradient(circle at 80% 28%, #8be9fd 0 3px, transparent 4px), #11183b; color: #edf3ff; }
.galaxy-core { position: absolute; left: 50%; top: 50%; display: grid; gap: 8px; width: 180px; height: 180px; place-content: center; border-radius: 999px; background: #6d5dfc; text-align: center; transform: translate(-50%, -50%); box-shadow: 0 0 36px rgba(109, 93, 252, .58); }
.galaxy-core strong { font-size: 1.45rem; }
.orbit { position: absolute; display: grid; place-items: center; border: 1px solid rgba(139, 233, 253, .55); border-radius: 999px; }
.orbit span { padding: 9px 12px; border-radius: 999px; background: #18235a; color: #8be9fd; font-weight: 900; }
.orbit-one { left: 8%; top: 18%; width: 180px; height: 90px; }
.orbit-two { right: 8%; top: 22%; width: 150px; height: 150px; }
.orbit-three { left: 18%; bottom: 12%; width: 220px; height: 120px; }
.galaxy-dock { position: absolute; right: 22px; bottom: 22px; padding: 12px 14px; border-radius: 999px; background: #18235a; color: #8be9fd; }
.cute-style-home { background: #fff5f7; border-color: #ffd6e2; color: #50313d; }
.cute-style-home .playful-home-intro > span { background: #ff8fb3; color: #fff; }
.doodle-style-home { background: #fffaf0; border-color: #24211c; color: #2f2a22; }
.doodle-style-home .playful-home-intro > span { background: #ffe15d; color: #2f2a22; border: 2px solid #24211c; }
.pixel-style-home { background: #f8f2d8; border-color: #1f1f1f; border-radius: 6px; color: #171717; }
.pixel-style-home .playful-home-intro > span { background: #1f1f1f; color: #7cff6b; border-radius: 4px; }
.magazine-style-home { background: #fbfaf6; border-color: #d8d1c4; color: #211f1b; border-radius: 0; }
.magazine-style-home .playful-home-intro > span { background: #211f1b; color: #fbfaf6; border-radius: 999px; }
.nature-style-home { background: #edf6e8; border-color: #b8d8aa; color: #253b28; }
.nature-style-home .playful-home-intro > span { background: #4f7f52; color: #fff; }
.space-style-home { background: #080b1f; border-color: #3d5afe; color: #edf3ff; }
.space-style-home .playful-home-intro > span { background: #6d5dfc; color: #fff; box-shadow: 0 0 24px rgba(109, 93, 252, .55); }
.judge-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.judge-card { display: grid; gap: 12px; padding: 16px; border: 1px solid #d7d2c6; border-radius: 20px; background: #fff; }
.judge-card dl { display: grid; gap: 10px; }
.judge-card dt { margin-bottom: 4px; color: #1b6a52; font-weight: 800; }
.judge-card dd { margin: 0; line-height: 1.55; }
.selected-panel { background: radial-gradient(circle at 12% 16%, rgba(139,233,253,.16), transparent 26%), #11183b; color: #edf3ff; }
.palette { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.color-card, .component-card { border: 1px solid #3d5afe; border-radius: 20px; background: #18235a; color: #edf3ff; }
.color-card { display: grid; gap: 6px; padding: 14px; }
.swatch { width: 54px; height: 54px; border: 1px solid #3d5afe; border-radius: 16px; }
.color-card p, .color-card code, .component-card h3, .decision h2, .decision p { margin: 0; }
.color-card p { color: #b8c4f2; font-size: .9rem; }
.color-card code { color: #8be9fd; font-size: .82rem; }
.components { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.component-card { display: grid; gap: 14px; align-content: start; padding: 16px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.btn, .tab { border: 1px solid #d7d2c6; border-radius: 12px; padding: 10px 12px; font: inherit; text-decoration: none; }
.btn.primary { border-color: #6d5dfc; background: #6d5dfc; color: #fff; }
.btn.secondary { background: #11183b; color: #edf3ff; }
.btn.danger { border-color: #8be9fd; background: #18235a; color: #8be9fd; }
.tab { border-radius: 999px; background: #11183b; color: #b8c4f2; }
.tab.active { border-color: #8be9fd; background: #18235a; color: #8be9fd; font-weight: 800; }
.chip { padding: 6px 10px; border-radius: 999px; font-size: .84rem; font-weight: 700; }
.chip.personal { background: #18235a; color: #8be9fd; }
.chip.platform { background: #312e81; color: #edf3ff; }
.chip.warning { background: #2b2550; color: #d8c9ff; }
label { display: grid; gap: 8px; color: #61685f; }
input { border: 1px solid #d7d2c6; border-radius: 12px; padding: 10px 12px; color: #1f251f; font: inherit; }
.decision { grid-template-columns: 1fr auto; align-items: center; background: linear-gradient(135deg, #edf3ff, #fffdf8); }
.playful-panel { background: linear-gradient(135deg, #fffdf8, #f7f0ff); }
.playful-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.playful-card { position: relative; display: grid; gap: 14px; min-height: 390px; padding: 18px; border: 2px solid transparent; border-radius: 30px; overflow: hidden; }
.playful-card p { margin: 0; line-height: 1.65; }
.playful-top { display: flex; gap: 12px; align-items: center; position: relative; z-index: 1; }
.playful-mark { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 16px; font-weight: 900; }
.playful-scene { position: relative; min-height: 170px; border-radius: 26px; overflow: hidden; }
.playful-orbit, .playful-note { position: absolute; }
.playful-orbit.one { width: 140px; height: 140px; right: -32px; top: -28px; border-radius: 999px; }
.playful-orbit.two { width: 82px; height: 82px; left: 18px; bottom: 18px; border-radius: 999px; }
.playful-note { display: grid; gap: 6px; padding: 14px; border-radius: 20px; }
.main-note { left: 24px; top: 34px; width: min(220px, 70%); z-index: 1; }
.main-note span { font-size: .86rem; }
.small-note { right: 26px; bottom: 28px; width: 72px; height: 52px; }
.tiny-note { left: 42%; bottom: 18px; width: 46px; height: 34px; }
.playful-footer { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.playful-footer span { padding: 7px 10px; border-radius: 999px; font-size: .84rem; font-weight: 800; }
.cute-style { background: #fff5f7; border-color: #ffd6e2; color: #50313d; }
.cute-style .playful-mark, .cute-style .main-note { background: #ff8fb3; color: #fff; }
.cute-style .playful-scene { background: #fff0c9; }
.cute-style .playful-orbit { background: rgba(255, 143, 179, .28); }
.cute-style .small-note, .cute-style .tiny-note, .cute-style .playful-footer span { background: #dff7df; color: #3f7a4b; }
.doodle-style { background: #fffaf0; border-color: #24211c; color: #2f2a22; box-shadow: 6px 6px 0 #24211c; }
.doodle-style .playful-mark, .doodle-style .main-note { background: #ffe15d; color: #2f2a22; border: 2px solid #24211c; }
.doodle-style .playful-scene { background: repeating-linear-gradient(-8deg, #fffaf0, #fffaf0 14px, #f4ead8 15px); border: 2px solid #24211c; }
.doodle-style .playful-orbit { border: 3px dashed #ff7a59; }
.doodle-style .small-note, .doodle-style .tiny-note, .doodle-style .playful-footer span { background: #b8e6ff; color: #1f3542; border: 2px solid #24211c; }
.pixel-style { background: #f8f2d8; border-color: #1f1f1f; border-radius: 6px; color: #171717; image-rendering: pixelated; }
.pixel-style .playful-mark, .pixel-style .main-note { background: #1f1f1f; color: #7cff6b; border-radius: 4px; }
.pixel-style .playful-scene { background: #2b2550; border: 4px solid #1f1f1f; border-radius: 4px; }
.pixel-style .playful-orbit { background: #ffcc33; border-radius: 4px; }
.pixel-style .small-note, .pixel-style .tiny-note, .pixel-style .playful-footer span { background: #7cff6b; color: #1f1f1f; border-radius: 4px; }
.magazine-style { background: #fbfaf6; border-color: #d8d1c4; color: #211f1b; }
.magazine-style .playful-mark { background: #211f1b; color: #fbfaf6; border-radius: 999px; }
.magazine-style .playful-scene { background: #ede7db; border-radius: 0; }
.magazine-style .main-note { background: #fbfaf6; color: #211f1b; border-radius: 0; border-left: 5px solid #b63f2f; }
.magazine-style .playful-orbit { background: #b63f2f; border-radius: 0; transform: rotate(12deg); }
.magazine-style .small-note, .magazine-style .tiny-note, .magazine-style .playful-footer span { background: #211f1b; color: #fbfaf6; border-radius: 0; }
.nature-style { background: #edf6e8; border-color: #b8d8aa; color: #253b28; }
.nature-style .playful-mark, .nature-style .main-note { background: #4f7f52; color: #fff; }
.nature-style .playful-scene { background: radial-gradient(circle at 20% 70%, #d5e8c8, transparent 35%), #f8fff4; }
.nature-style .playful-orbit { background: rgba(122, 161, 91, .28); }
.nature-style .small-note, .nature-style .tiny-note, .nature-style .playful-footer span { background: #fff7cf; color: #5c5725; }
.space-style { background: #080b1f; border-color: #3d5afe; color: #edf3ff; }
.space-style .playful-mark, .space-style .main-note { background: #6d5dfc; color: #fff; box-shadow: 0 0 24px rgba(109, 93, 252, .55); }
.space-style .playful-scene { background: radial-gradient(circle at 28% 38%, #fff 0 2px, transparent 3px), radial-gradient(circle at 80% 28%, #8be9fd 0 3px, transparent 4px), #11183b; }
.space-style .playful-orbit { border: 1px solid rgba(139, 233, 253, .5); }
.space-style .small-note, .space-style .tiny-note, .space-style .playful-footer span { background: #18235a; color: #8be9fd; box-shadow: 0 0 18px rgba(139, 233, 253, .25); }
@media (max-width: 1180px) { .playful-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .playful-grid { grid-template-columns: 1fr; } }
.style-board-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.style-board { display: grid; gap: 14px; padding: 18px; border: 1px solid #d7d2c6; border-radius: 24px; background: #fff; }
.board-header { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.board-header span { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 14px; font-weight: 900; }
.style-board p, .style-board ul { margin: 0; color: #61685f; }
.style-board ul { display: grid; gap: 6px; padding-left: 18px; }
.board-canvas { display: grid; grid-template-columns: 56px 1fr; gap: 10px; min-height: 180px; padding: 12px; border-radius: 20px; overflow: hidden; }
.board-nav, .board-search, .board-card-row span, .board-list span { border-radius: 12px; }
.board-main { display: grid; gap: 10px; }
.board-search { height: 34px; }
.board-card-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.board-card-row span { height: 54px; }
.board-list { display: grid; gap: 8px; }
.board-list span { height: 22px; }
.command-style { background: #0f172a; color: #e5f3ef; border-color: #334155; }
.command-style p, .command-style ul { color: #94a3b8; }
.command-style .board-header span, .command-style .board-search { background: #22c55e; color: #0f172a; }
.command-style .board-canvas { background: #111827; }
.command-style .board-nav, .command-style .board-card-row span, .command-style .board-list span { background: #1e293b; }
.bento-style .board-header span, .bento-style .board-search { background: #4f46e5; color: #fff; }
.bento-style .board-canvas { background: #f8fafc; }
.bento-style .board-nav, .bento-style .board-card-row span, .bento-style .board-list span { background: #e0e7ff; }
.editorial-style { background: #fffaf2; }
.editorial-style .board-header span, .editorial-style .board-search { background: #c96a3a; color: #fff; }
.editorial-style .board-canvas { background: #fbf1df; grid-template-columns: 1fr; }
.editorial-style .board-nav { display: none; }
.editorial-style .board-card-row { grid-template-columns: 1.4fr .8fr .8fr; }
.editorial-style .board-card-row span, .editorial-style .board-list span { background: #ffe3c7; }
.dense-style .board-header span, .dense-style .board-search { background: #111; color: #fff; }
.dense-style .board-canvas { background: #f6f6f3; grid-template-columns: 84px 1fr; }
.dense-style .board-card-row span { height: 34px; background: #e7e5df; }
.dense-style .board-list span { height: 16px; background: #e7e5df; }
.soft-style { background: #effaf6; }
.soft-style .board-header span, .soft-style .board-search { background: #0f9f7a; color: #fff; }
.soft-style .board-canvas { background: #fff; border-radius: 28px; }
.soft-style .board-nav, .soft-style .board-card-row span, .soft-style .board-list span { background: #d8f5eb; border-radius: 18px; }
.pro-style { background: #ece9e2; }
.pro-style .board-header span, .pro-style .board-search { background: #2f3430; color: #f7efe1; }
.pro-style .board-canvas { background: #faf9f5; }
.pro-style .board-nav, .pro-style .board-card-row span, .pro-style .board-list span { background: #e6e0d2; }
@media (max-width: 1180px) { .playful-panel { background: linear-gradient(135deg, #fffdf8, #f7f0ff); }
.playful-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.playful-card { position: relative; display: grid; gap: 14px; min-height: 390px; padding: 18px; border: 2px solid transparent; border-radius: 30px; overflow: hidden; }
.playful-card p { margin: 0; line-height: 1.65; }
.playful-top { display: flex; gap: 12px; align-items: center; position: relative; z-index: 1; }
.playful-mark { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 16px; font-weight: 900; }
.playful-scene { position: relative; min-height: 170px; border-radius: 26px; overflow: hidden; }
.playful-orbit, .playful-note { position: absolute; }
.playful-orbit.one { width: 140px; height: 140px; right: -32px; top: -28px; border-radius: 999px; }
.playful-orbit.two { width: 82px; height: 82px; left: 18px; bottom: 18px; border-radius: 999px; }
.playful-note { display: grid; gap: 6px; padding: 14px; border-radius: 20px; }
.main-note { left: 24px; top: 34px; width: min(220px, 70%); z-index: 1; }
.main-note span { font-size: .86rem; }
.small-note { right: 26px; bottom: 28px; width: 72px; height: 52px; }
.tiny-note { left: 42%; bottom: 18px; width: 46px; height: 34px; }
.playful-footer { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.playful-footer span { padding: 7px 10px; border-radius: 999px; font-size: .84rem; font-weight: 800; }
.cute-style { background: #fff5f7; border-color: #ffd6e2; color: #50313d; }
.cute-style .playful-mark, .cute-style .main-note { background: #ff8fb3; color: #fff; }
.cute-style .playful-scene { background: #fff0c9; }
.cute-style .playful-orbit { background: rgba(255, 143, 179, .28); }
.cute-style .small-note, .cute-style .tiny-note, .cute-style .playful-footer span { background: #dff7df; color: #3f7a4b; }
.doodle-style { background: #fffaf0; border-color: #24211c; color: #2f2a22; box-shadow: 6px 6px 0 #24211c; }
.doodle-style .playful-mark, .doodle-style .main-note { background: #ffe15d; color: #2f2a22; border: 2px solid #24211c; }
.doodle-style .playful-scene { background: repeating-linear-gradient(-8deg, #fffaf0, #fffaf0 14px, #f4ead8 15px); border: 2px solid #24211c; }
.doodle-style .playful-orbit { border: 3px dashed #ff7a59; }
.doodle-style .small-note, .doodle-style .tiny-note, .doodle-style .playful-footer span { background: #b8e6ff; color: #1f3542; border: 2px solid #24211c; }
.pixel-style { background: #f8f2d8; border-color: #1f1f1f; border-radius: 6px; color: #171717; image-rendering: pixelated; }
.pixel-style .playful-mark, .pixel-style .main-note { background: #1f1f1f; color: #7cff6b; border-radius: 4px; }
.pixel-style .playful-scene { background: #2b2550; border: 4px solid #1f1f1f; border-radius: 4px; }
.pixel-style .playful-orbit { background: #ffcc33; border-radius: 4px; }
.pixel-style .small-note, .pixel-style .tiny-note, .pixel-style .playful-footer span { background: #7cff6b; color: #1f1f1f; border-radius: 4px; }
.magazine-style { background: #fbfaf6; border-color: #d8d1c4; color: #211f1b; }
.magazine-style .playful-mark { background: #211f1b; color: #fbfaf6; border-radius: 999px; }
.magazine-style .playful-scene { background: #ede7db; border-radius: 0; }
.magazine-style .main-note { background: #fbfaf6; color: #211f1b; border-radius: 0; border-left: 5px solid #b63f2f; }
.magazine-style .playful-orbit { background: #b63f2f; border-radius: 0; transform: rotate(12deg); }
.magazine-style .small-note, .magazine-style .tiny-note, .magazine-style .playful-footer span { background: #211f1b; color: #fbfaf6; border-radius: 0; }
.nature-style { background: #edf6e8; border-color: #b8d8aa; color: #253b28; }
.nature-style .playful-mark, .nature-style .main-note { background: #4f7f52; color: #fff; }
.nature-style .playful-scene { background: radial-gradient(circle at 20% 70%, #d5e8c8, transparent 35%), #f8fff4; }
.nature-style .playful-orbit { background: rgba(122, 161, 91, .28); }
.nature-style .small-note, .nature-style .tiny-note, .nature-style .playful-footer span { background: #fff7cf; color: #5c5725; }
.space-style { background: #080b1f; border-color: #3d5afe; color: #edf3ff; }
.space-style .playful-mark, .space-style .main-note { background: #6d5dfc; color: #fff; box-shadow: 0 0 24px rgba(109, 93, 252, .55); }
.space-style .playful-scene { background: radial-gradient(circle at 28% 38%, #fff 0 2px, transparent 3px), radial-gradient(circle at 80% 28%, #8be9fd 0 3px, transparent 4px), #11183b; }
.space-style .playful-orbit { border: 1px solid rgba(139, 233, 253, .5); }
.space-style .small-note, .space-style .tiny-note, .space-style .playful-footer span { background: #18235a; color: #8be9fd; box-shadow: 0 0 18px rgba(139, 233, 253, .25); }
@media (max-width: 1180px) { .playful-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .playful-grid { grid-template-columns: 1fr; } }
.style-board-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .playful-panel { background: linear-gradient(135deg, #fffdf8, #f7f0ff); }
.playful-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.playful-card { position: relative; display: grid; gap: 14px; min-height: 390px; padding: 18px; border: 2px solid transparent; border-radius: 30px; overflow: hidden; }
.playful-card p { margin: 0; line-height: 1.65; }
.playful-top { display: flex; gap: 12px; align-items: center; position: relative; z-index: 1; }
.playful-mark { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 16px; font-weight: 900; }
.playful-scene { position: relative; min-height: 170px; border-radius: 26px; overflow: hidden; }
.playful-orbit, .playful-note { position: absolute; }
.playful-orbit.one { width: 140px; height: 140px; right: -32px; top: -28px; border-radius: 999px; }
.playful-orbit.two { width: 82px; height: 82px; left: 18px; bottom: 18px; border-radius: 999px; }
.playful-note { display: grid; gap: 6px; padding: 14px; border-radius: 20px; }
.main-note { left: 24px; top: 34px; width: min(220px, 70%); z-index: 1; }
.main-note span { font-size: .86rem; }
.small-note { right: 26px; bottom: 28px; width: 72px; height: 52px; }
.tiny-note { left: 42%; bottom: 18px; width: 46px; height: 34px; }
.playful-footer { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.playful-footer span { padding: 7px 10px; border-radius: 999px; font-size: .84rem; font-weight: 800; }
.cute-style { background: #fff5f7; border-color: #ffd6e2; color: #50313d; }
.cute-style .playful-mark, .cute-style .main-note { background: #ff8fb3; color: #fff; }
.cute-style .playful-scene { background: #fff0c9; }
.cute-style .playful-orbit { background: rgba(255, 143, 179, .28); }
.cute-style .small-note, .cute-style .tiny-note, .cute-style .playful-footer span { background: #dff7df; color: #3f7a4b; }
.doodle-style { background: #fffaf0; border-color: #24211c; color: #2f2a22; box-shadow: 6px 6px 0 #24211c; }
.doodle-style .playful-mark, .doodle-style .main-note { background: #ffe15d; color: #2f2a22; border: 2px solid #24211c; }
.doodle-style .playful-scene { background: repeating-linear-gradient(-8deg, #fffaf0, #fffaf0 14px, #f4ead8 15px); border: 2px solid #24211c; }
.doodle-style .playful-orbit { border: 3px dashed #ff7a59; }
.doodle-style .small-note, .doodle-style .tiny-note, .doodle-style .playful-footer span { background: #b8e6ff; color: #1f3542; border: 2px solid #24211c; }
.pixel-style { background: #f8f2d8; border-color: #1f1f1f; border-radius: 6px; color: #171717; image-rendering: pixelated; }
.pixel-style .playful-mark, .pixel-style .main-note { background: #1f1f1f; color: #7cff6b; border-radius: 4px; }
.pixel-style .playful-scene { background: #2b2550; border: 4px solid #1f1f1f; border-radius: 4px; }
.pixel-style .playful-orbit { background: #ffcc33; border-radius: 4px; }
.pixel-style .small-note, .pixel-style .tiny-note, .pixel-style .playful-footer span { background: #7cff6b; color: #1f1f1f; border-radius: 4px; }
.magazine-style { background: #fbfaf6; border-color: #d8d1c4; color: #211f1b; }
.magazine-style .playful-mark { background: #211f1b; color: #fbfaf6; border-radius: 999px; }
.magazine-style .playful-scene { background: #ede7db; border-radius: 0; }
.magazine-style .main-note { background: #fbfaf6; color: #211f1b; border-radius: 0; border-left: 5px solid #b63f2f; }
.magazine-style .playful-orbit { background: #b63f2f; border-radius: 0; transform: rotate(12deg); }
.magazine-style .small-note, .magazine-style .tiny-note, .magazine-style .playful-footer span { background: #211f1b; color: #fbfaf6; border-radius: 0; }
.nature-style { background: #edf6e8; border-color: #b8d8aa; color: #253b28; }
.nature-style .playful-mark, .nature-style .main-note { background: #4f7f52; color: #fff; }
.nature-style .playful-scene { background: radial-gradient(circle at 20% 70%, #d5e8c8, transparent 35%), #f8fff4; }
.nature-style .playful-orbit { background: rgba(122, 161, 91, .28); }
.nature-style .small-note, .nature-style .tiny-note, .nature-style .playful-footer span { background: #fff7cf; color: #5c5725; }
.space-style { background: #080b1f; border-color: #3d5afe; color: #edf3ff; }
.space-style .playful-mark, .space-style .main-note { background: #6d5dfc; color: #fff; box-shadow: 0 0 24px rgba(109, 93, 252, .55); }
.space-style .playful-scene { background: radial-gradient(circle at 28% 38%, #fff 0 2px, transparent 3px), radial-gradient(circle at 80% 28%, #8be9fd 0 3px, transparent 4px), #11183b; }
.space-style .playful-orbit { border: 1px solid rgba(139, 233, 253, .5); }
.space-style .small-note, .space-style .tiny-note, .space-style .playful-footer span { background: #18235a; color: #8be9fd; box-shadow: 0 0 18px rgba(139, 233, 253, .25); }
@media (max-width: 1180px) { .playful-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .playful-grid { grid-template-columns: 1fr; } }
.style-board-grid { grid-template-columns: 1fr; } }
@media (max-width: 1180px) { .palette, .components { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 920px) { .hero, .preview-grid, .decision, .garden-home, .magazine-home, .forest-path { grid-template-columns: 1fr; } .preview-sites { grid-template-columns: 1fr; } .doodle-pin.one, .doodle-pin.two, .doodle-pin.three { position: static; transform: none; } .doodle-home { display: grid; gap: 12px; } .doodle-note.main, .doodle-search { position: static; width: auto; } }
@media (max-width: 640px) { .direction-grid, .judge-grid, .palette, .components, .garden-bed, .pixel-grid { grid-template-columns: 1fr; } .hero, .panel, .decision { padding: 18px; } .playful-home { padding: 14px; border-radius: 22px; } .garden-hero strong, .magazine-cover strong { font-size: 1.45rem; } .orbit-one, .orbit-two, .orbit-three { position: static; width: auto; height: auto; margin: 12px; } .galaxy-home { display: grid; gap: 10px; padding-top: 180px; } }
</style>
