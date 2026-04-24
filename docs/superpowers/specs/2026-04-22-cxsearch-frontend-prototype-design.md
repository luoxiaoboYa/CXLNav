# CXSearch Frontend Prototype Design

**Date:** 2026-04-22
**Scope:** Frontend high-fidelity prototype only
**Out of Scope:** Backend implementation, browser extension implementation, API design details

## 1. Goal

Produce a high-fidelity frontend prototype for CXSearch that focuses on personal navigation first, preserves lightweight discovery, and keeps management actions out of the homepage.

The current design target is a content-navigation product, not an admin dashboard.

## 2. Confirmed Product Direction

- This phase only covers the frontend UI prototype.
- Fidelity target is high-fidelity prototype.
- Visual direction is content-navigation oriented.
- Homepage priority is personal sites first.
- Homepage layout direction is card browsing.
- Homepage management style is lightweight.
- Add/edit/classification management moves to dedicated pages.

## 3. Homepage Structure Decision

The selected homepage structure is:

- **A: left-dominant layout**

This means:

- The left main column is the primary stage.
- The largest homepage block is the user's frequently visited sites.
- Discovery and recommendation content remains visible but stays in a secondary supporting column.

Rejected directions:

- Pure personal-only homepage: too tool-like, insufficient discovery.
- Dual-homepage structure: too heavy for the current prototype stage.

## 4. Navigation Principles

### 4.1 Top Navigation

Top navigation should only keep long-term, high-frequency destinations.

Confirmed top navigation:

- `首页`
- `我的站点`
- `推荐发现`

Right-side global actions:

- `全局搜索`
- `新增站点`
- `主题切换`
- `齿轮设置`
- `账号`

### 4.2 Management Entry

`管理中心` is removed from the primary top navigation.

Instead:

- a gear icon (`齿轮设置`) on the right opens the unified management center page

This keeps the product feeling lighter and more content-focused.

## 5. Information Architecture

### 5.1 Primary Sections

#### 首页

Purpose:

- fastest entry point for daily use
- frequently visited sites first
- lightweight browsing, not deep management

Contains:

- frequent visits
- category browsing
- recent activity
- lightweight recommendation summaries

#### 我的站点

Purpose:

- full browsing view for personal content
- deeper filtering and searching than homepage

Contains:

- full personal site list
- category filtering
- tag filtering
- search results

#### 推荐发现

Purpose:

- full recommendation/discovery browsing
- system recommendations and user-shared content

Contains:

- system recommendations
- user shares
- popular content
- discovery feeds

#### 管理中心

Entry:

- right-side gear icon

Purpose:

- all management and maintenance actions
- no high-frequency browsing responsibilities

#### 登录 / 注册

Purpose:

- authentication and account access

## 6. Homepage Module Structure

Homepage modules are ordered by priority.

### 6.1 Primary Layer

#### Frequent Visits Main Block

This is the dominant homepage block.

Rules:

- largest visual area on first screen
- fastest click path
- card-based
- optimized for repeated daily use

Suggested content:

- top frequent sites
- recently used high-frequency items
- direct jump actions

### 6.2 Secondary Layer

#### Personal Category Browsing

Purpose:

- bridge from high-frequency usage into broader personal browsing

#### Recent Visits / Recent Additions

Purpose:

- add time-based awareness
- make homepage feel alive, not static

### 6.3 Supporting Layer

#### System Recommendations

Purpose:

- lightweight discovery reminder

#### User Shares

Purpose:

- supporting community/discovery content

#### Quick Actions

Purpose:

- lightweight actions only

Suggested quick actions:

- add site
- import bookmarks
- switch theme or view-related quick controls

## 7. Theme and Display Rules

### 7.1 Theme Switching

Theme switching remains a top-level global action.

Reason:

- it is global
- it is relatively high-frequency
- it should not be buried in the management center

### 7.2 Simple / Detailed Mode

Simple/detailed display mode is **not** a permanent top-navigation item.

Rule:

- show it only on content-browsing pages when useful

Recommended placement:

- homepage: optional, low emphasis
- my sites: recommended
- discover: optional if card density requires it
- management center: not needed

Management center should still include a preference for default mode.

## 8. Management Center Structure

Management center is a dedicated page with:

- left sidebar navigation
- right main content area

Default landing section:

- `站点管理`

Confirmed sidebar items:

- `站点管理`
- `分类管理`
- `标签管理`
- `分享 / 推荐管理`
- `导入 / 导出`
- `显示与偏好`

### 8.1 Responsibility of Each Section

#### 站点管理

- add/edit/delete
- bulk maintenance
- incomplete or abnormal site handling

#### 分类管理

- create/edit/delete personal categories

#### 标签管理

- create/edit/delete tags
- clean duplicate or invalid tags

#### 分享 / 推荐管理

- manage personal shares and recommendation submissions

#### 导入 / 导出

- import browser bookmarks
- export site data
- export bookmark-compatible format

#### 显示与偏好

- default theme preference
- default simple/detailed mode preference
- homepage display preference

## 9. Core UX Boundaries

To prevent role confusion:

- Homepage does not become a management dashboard.
- Recommendation content does not take over the homepage.
- Management actions do not spread back into primary navigation.
- High-frequency global actions remain easy to reach.

## 10. Prototype Pages to Deliver

The prototype should cover at least these pages:

- 登录 / 注册页
- 首页
- 我的站点页
- 推荐发现页
- 管理中心页
- 站点添加 / 编辑页
- 插件弹窗页
- 模式 / 主题相关设置页

## 11. Working Notes

- Current working directory is **not** a git repository, so this design document cannot be committed in the current state.
- The next step after this spec is an implementation plan for the frontend prototype phase.
