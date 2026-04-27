# K6 UI Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the confirmed K6 "space exploration / URL galaxy" visual direction to the prototype shell and homepage.

**Architecture:** Keep app navigation structure and routes unchanged. Put K6 color tokens on `AppShell`, restyle shared tiles/search to consume those tokens, and redesign `HomePage` as a galaxy-style homepage while preserving the existing content sections.

**Tech Stack:** Vue 3, scoped CSS, Vue Testing Library, Vitest.

---

### Task 1: Homepage K6 Contract

**Files:**
- Modify: `prototype/src/pages/__tests__/HomePage.test.ts`
- Modify: `prototype/src/pages/HomePage.vue`

- [x] Add a failing test that expects the homepage to expose K6-specific copy: `URL Galaxy`, `星图导航`, and `轨道推荐`.
- [x] Run `npm run test -- HomePage.test.ts` and confirm the test fails because the K6 homepage is not implemented.
- [x] Redesign `HomePage.vue` with a galaxy hero, orbit-style frequent visits, a right-side recommendation console, category orbit entries, recent activity, and continued discovery.
- [x] Run the focused test and confirm it passes.

### Task 2: Shared K6 Styling

**Files:**
- Modify: `prototype/src/layouts/AppShell.vue`
- Modify: `prototype/src/components/AppTopNav.vue`
- Modify: `prototype/src/components/SearchBar.vue`
- Modify: `prototype/src/components/CardTile.vue`

- [x] Add K6 CSS variables to `AppShell`.
- [x] Restyle the shell background, top nav, search input, and card tiles using the variables.
- [x] Preserve existing navigation text, links, and responsive behavior.
- [x] Run `npm run test` and `npm run build`.
