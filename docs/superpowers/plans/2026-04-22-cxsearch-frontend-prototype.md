# CXSearch Frontend Prototype Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue 3 + TypeScript high-fidelity frontend prototype for CXSearch that implements the approved information architecture, homepage layout, and management-center structure.

**Architecture:** Create a standalone prototype app under `prototype/` using Vite, Vue Router, and custom CSS tokens/components. The app should separate high-frequency browsing pages from low-frequency management pages, with shared shell/navigation and focused page components. Because the current workspace has no application code yet, this plan assumes a new prototype workspace is created from scratch.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Vitest, Vue Testing Library, CSS variables, custom components

---

## Planned File Structure

### App Shell

- Create: `prototype/package.json`
- Create: `prototype/tsconfig.json`
- Create: `prototype/vite.config.ts`
- Create: `prototype/index.html`
- Create: `prototype/src/main.ts`
- Create: `prototype/src/App.vue`
- Create: `prototype/src/router/index.ts`

### Shared Styles and Layout

- Create: `prototype/src/styles/tokens.css`
- Create: `prototype/src/styles/base.css`
- Create: `prototype/src/layouts/AppShell.vue`
- Create: `prototype/src/components/AppTopNav.vue`
- Create: `prototype/src/components/ThemeToggle.vue`
- Create: `prototype/src/components/SearchBar.vue`
- Create: `prototype/src/components/CardTile.vue`
- Create: `prototype/src/components/SectionHeader.vue`

### Pages

- Create: `prototype/src/pages/HomePage.vue`
- Create: `prototype/src/pages/MySitesPage.vue`
- Create: `prototype/src/pages/DiscoverPage.vue`
- Create: `prototype/src/pages/ManagementPage.vue`
- Create: `prototype/src/pages/AuthPage.vue`
- Create: `prototype/src/pages/SiteEditorPage.vue`
- Create: `prototype/src/pages/ExtensionPopupPage.vue`

### Management Center Subviews

- Create: `prototype/src/components/management/ManagementSidebar.vue`
- Create: `prototype/src/components/management/SiteManagementPanel.vue`
- Create: `prototype/src/components/management/CategoryManagementPanel.vue`
- Create: `prototype/src/components/management/TagManagementPanel.vue`
- Create: `prototype/src/components/management/ShareManagementPanel.vue`
- Create: `prototype/src/components/management/ImportExportPanel.vue`
- Create: `prototype/src/components/management/DisplayPreferencesPanel.vue`

### Prototype Data

- Create: `prototype/src/data/home.ts`
- Create: `prototype/src/data/sites.ts`
- Create: `prototype/src/data/discover.ts`
- Create: `prototype/src/data/settings.ts`

### Tests

- Create: `prototype/src/pages/__tests__/HomePage.test.ts`
- Create: `prototype/src/pages/__tests__/ManagementPage.test.ts`
- Create: `prototype/src/components/__tests__/AppTopNav.test.ts`
- Create: `prototype/src/components/management/__tests__/ManagementSidebar.test.ts`

### Docs

- Create: `prototype/README.md`

---

## Chunk 1: Scaffold the Prototype App

### Task 1: Initialize the Vite + Vue + TS workspace

**Files:**
- Create: `prototype/package.json`
- Create: `prototype/tsconfig.json`
- Create: `prototype/vite.config.ts`
- Create: `prototype/index.html`

- [ ] **Step 1: Write the package manifest and base config**

Include dependencies for:

- `vue`
- `vue-router`
- `vite`
- `typescript`
- `vitest`
- `@testing-library/vue`
- `jsdom`

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: install completes without missing-package errors

- [ ] **Step 3: Start the dev server once**

Run: `npm run dev`
Expected: Vite dev server starts and prints a local URL

- [ ] **Step 4: Add a README with run/test commands**

Document:

- install
- dev
- test
- build

- [ ] **Step 5: Commit**

```bash
git add prototype/package.json prototype/tsconfig.json prototype/vite.config.ts prototype/index.html prototype/README.md
git commit -m "chore: scaffold cxsearch prototype app"
```

### Task 2: Add the application entrypoint and router skeleton

**Files:**
- Create: `prototype/src/main.ts`
- Create: `prototype/src/App.vue`
- Create: `prototype/src/router/index.ts`

- [ ] **Step 1: Write a failing navigation test**

Create `prototype/src/components/__tests__/AppTopNav.test.ts` skeleton that expects top navigation items:

```ts
expect(screen.getByText('首页')).toBeInTheDocument()
expect(screen.getByText('我的站点')).toBeInTheDocument()
expect(screen.getByText('推荐发现')).toBeInTheDocument()
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm run test -- AppTopNav.test.ts`
Expected: FAIL because nav component/router shell does not exist yet

- [ ] **Step 3: Create app entry, app shell mount, and routes**

Routes:

- `/`
- `/my-sites`
- `/discover`
- `/settings`
- `/auth`
- `/site-editor`
- `/extension-popup`

- [ ] **Step 4: Run the test again after shell exists**

Run: `npm run test -- AppTopNav.test.ts`
Expected: still failing or partially passing until nav component is added in Chunk 2

- [ ] **Step 5: Commit**

```bash
git add prototype/src/main.ts prototype/src/App.vue prototype/src/router/index.ts prototype/src/components/__tests__/AppTopNav.test.ts
git commit -m "feat: add prototype app entry and route skeleton"
```

---

## Chunk 2: Shared Shell, Tokens, and Global Navigation

### Task 3: Implement design tokens and base styling

**Files:**
- Create: `prototype/src/styles/tokens.css`
- Create: `prototype/src/styles/base.css`
- Modify: `prototype/src/main.ts`

- [ ] **Step 1: Write a minimal visual smoke test target**

Document expected CSS variables in code comments or test utility expectations:

- brand color token
- surface token
- border token
- spacing scale

- [ ] **Step 2: Add CSS variables and global reset**

Include tokens for:

- light theme
- dark theme
- spacing
- radius
- typography

- [ ] **Step 3: Import styles from main entry**

- [ ] **Step 4: Run app locally**

Run: `npm run dev`
Expected: shell loads with global styles applied and no CSS import errors

- [ ] **Step 5: Commit**

```bash
git add prototype/src/styles/tokens.css prototype/src/styles/base.css prototype/src/main.ts
git commit -m "feat: add shared design tokens and base styles"
```

### Task 4: Implement top navigation and app shell

**Files:**
- Create: `prototype/src/layouts/AppShell.vue`
- Create: `prototype/src/components/AppTopNav.vue`
- Create: `prototype/src/components/ThemeToggle.vue`
- Modify: `prototype/src/App.vue`

- [ ] **Step 1: Expand the failing nav test**

Require these visible items:

```ts
expect(screen.getByText('首页')).toBeInTheDocument()
expect(screen.getByText('我的站点')).toBeInTheDocument()
expect(screen.getByText('推荐发现')).toBeInTheDocument()
expect(screen.getByLabelText('主题切换')).toBeInTheDocument()
expect(screen.getByLabelText('设置')).toBeInTheDocument()
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm run test -- AppTopNav.test.ts`
Expected: FAIL because shell/top nav is incomplete

- [ ] **Step 3: Implement the shell**

Requirements:

- top nav center only includes `首页`, `我的站点`, `推荐发现`
- right action area includes search trigger, add site, theme toggle, settings gear, account
- settings gear routes to `/settings`

- [ ] **Step 4: Re-run the nav test**

Run: `npm run test -- AppTopNav.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add prototype/src/layouts/AppShell.vue prototype/src/components/AppTopNav.vue prototype/src/components/ThemeToggle.vue prototype/src/App.vue prototype/src/components/__tests__/AppTopNav.test.ts
git commit -m "feat: implement shared shell and top navigation"
```

---

## Chunk 3: Homepage First

### Task 5: Build homepage data fixtures

**Files:**
- Create: `prototype/src/data/home.ts`

- [ ] **Step 1: Define typed mock data**

Include:

- frequent visit cards
- personal categories
- recent items
- system recommendation summary
- user share summary
- quick actions

- [ ] **Step 2: Add enough records to expose layout density issues**

Use at least:

- 6 frequent items
- 4 category groups
- 2 recommendation summaries

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add prototype/src/data/home.ts
git commit -m "feat: add homepage prototype fixtures"
```

### Task 6: Write homepage layout tests

**Files:**
- Create: `prototype/src/pages/__tests__/HomePage.test.ts`

- [ ] **Step 1: Write failing tests for homepage priorities**

Test expectations:

```ts
expect(screen.getByText('常访问')).toBeInTheDocument()
expect(screen.getByText('个人分类浏览')).toBeInTheDocument()
expect(screen.getByText('系统推荐')).toBeInTheDocument()
expect(screen.getByText('用户分享')).toBeInTheDocument()
```

Also assert DOM ordering so frequent visits render before recommendation summaries.

- [ ] **Step 2: Run the homepage test and confirm failure**

Run: `npm run test -- HomePage.test.ts`
Expected: FAIL because page is not implemented

- [ ] **Step 3: Commit**

```bash
git add prototype/src/pages/__tests__/HomePage.test.ts
git commit -m "test: add failing homepage structure tests"
```

### Task 7: Implement the homepage

**Files:**
- Create: `prototype/src/pages/HomePage.vue`
- Create: `prototype/src/components/SearchBar.vue`
- Create: `prototype/src/components/CardTile.vue`
- Create: `prototype/src/components/SectionHeader.vue`
- Modify: `prototype/src/router/index.ts`

- [ ] **Step 1: Implement the left-dominant homepage layout**

Requirements:

- left column is visually dominant
- frequent visits is the largest first-screen block
- recommendations stay in the right supporting column

- [ ] **Step 2: Add optional simple/detailed mode control only if homepage density needs it**

Keep it page-local, not in the top nav.

- [ ] **Step 3: Re-run homepage tests**

Run: `npm run test -- HomePage.test.ts`
Expected: PASS

- [ ] **Step 4: Manually verify responsive layout**

Run: `npm run dev`
Expected: homepage remains readable on desktop and mobile widths

- [ ] **Step 5: Commit**

```bash
git add prototype/src/pages/HomePage.vue prototype/src/components/SearchBar.vue prototype/src/components/CardTile.vue prototype/src/components/SectionHeader.vue prototype/src/router/index.ts
git commit -m "feat: implement homepage with dominant frequent-visits layout"
```

---

## Chunk 4: Browsing Pages

### Task 8: Implement My Sites page

**Files:**
- Create: `prototype/src/data/sites.ts`
- Create: `prototype/src/pages/MySitesPage.vue`

- [ ] **Step 1: Write a failing test for filters and view mode**

Test for:

- category filter
- tag filter
- page-local simple/detailed toggle

- [ ] **Step 2: Run the test to confirm failure**

Run: `npm run test -- MySitesPage.test.ts`
Expected: FAIL because page/test setup is incomplete

- [ ] **Step 3: Implement the page**

Requirements:

- richer browsing than homepage
- page-local display mode toggle
- no management-center responsibilities

- [ ] **Step 4: Run the relevant tests**

Run: `npm run test`
Expected: homepage and my-sites tests pass

- [ ] **Step 5: Commit**

```bash
git add prototype/src/data/sites.ts prototype/src/pages/MySitesPage.vue
git commit -m "feat: implement my sites browsing page"
```

### Task 9: Implement Discover page

**Files:**
- Create: `prototype/src/data/discover.ts`
- Create: `prototype/src/pages/DiscoverPage.vue`

- [ ] **Step 1: Write a failing test for discover sections**

Expect sections for:

- system recommendations
- user shares
- popular content

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm run test -- DiscoverPage.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the page**

Requirements:

- full discovery browsing
- recommendations expanded here, not on homepage

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: relevant browsing page tests pass

- [ ] **Step 5: Commit**

```bash
git add prototype/src/data/discover.ts prototype/src/pages/DiscoverPage.vue
git commit -m "feat: implement discover browsing page"
```

---

## Chunk 5: Management Center

### Task 10: Write failing tests for settings entry and sidebar

**Files:**
- Create: `prototype/src/pages/__tests__/ManagementPage.test.ts`
- Create: `prototype/src/components/management/__tests__/ManagementSidebar.test.ts`

- [ ] **Step 1: Write failing tests**

Require:

- settings gear routes to management page
- sidebar contains exactly these items:
  - `站点管理`
  - `分类管理`
  - `标签管理`
  - `分享 / 推荐管理`
  - `导入 / 导出`
  - `显示与偏好`

- [ ] **Step 2: Run the tests and confirm failure**

Run: `npm run test -- ManagementPage.test.ts ManagementSidebar.test.ts`
Expected: FAIL

- [ ] **Step 3: Commit**

```bash
git add prototype/src/pages/__tests__/ManagementPage.test.ts prototype/src/components/management/__tests__/ManagementSidebar.test.ts
git commit -m "test: add failing management center tests"
```

### Task 11: Implement management page shell and sidebar

**Files:**
- Create: `prototype/src/pages/ManagementPage.vue`
- Create: `prototype/src/components/management/ManagementSidebar.vue`
- Modify: `prototype/src/router/index.ts`

- [ ] **Step 1: Implement the management page layout**

Requirements:

- dedicated full page
- left sidebar
- right main content area
- default section is `站点管理`

- [ ] **Step 2: Re-run the management tests**

Run: `npm run test -- ManagementPage.test.ts ManagementSidebar.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add prototype/src/pages/ManagementPage.vue prototype/src/components/management/ManagementSidebar.vue prototype/src/router/index.ts
git commit -m "feat: implement management center shell"
```

### Task 12: Implement management subpanels

**Files:**
- Create: `prototype/src/components/management/SiteManagementPanel.vue`
- Create: `prototype/src/components/management/CategoryManagementPanel.vue`
- Create: `prototype/src/components/management/TagManagementPanel.vue`
- Create: `prototype/src/components/management/ShareManagementPanel.vue`
- Create: `prototype/src/components/management/ImportExportPanel.vue`
- Create: `prototype/src/components/management/DisplayPreferencesPanel.vue`
- Create: `prototype/src/data/settings.ts`
- Modify: `prototype/src/pages/ManagementPage.vue`

- [ ] **Step 1: Implement one focused panel per responsibility**

Do not merge unrelated management concerns into one oversized file.

- [ ] **Step 2: Add prototype controls and realistic mock content**

Include:

- list/table-like maintenance areas
- filter controls where relevant
- preference toggles only in display/preferences

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add prototype/src/components/management prototype/src/data/settings.ts prototype/src/pages/ManagementPage.vue
git commit -m "feat: add management center modules"
```

---

## Chunk 6: Remaining Prototype Pages and Verification

### Task 13: Implement auth, site editor, and extension popup prototype pages

**Files:**
- Create: `prototype/src/pages/AuthPage.vue`
- Create: `prototype/src/pages/SiteEditorPage.vue`
- Create: `prototype/src/pages/ExtensionPopupPage.vue`

- [ ] **Step 1: Add page placeholders with realistic structure**

Requirements:

- Auth page reflects login/register choices
- Site editor reflects add/edit form fields
- Extension popup reflects quick-save flow

- [ ] **Step 2: Wire routes**

Run: `npm run dev`
Expected: each route opens without runtime errors

- [ ] **Step 3: Commit**

```bash
git add prototype/src/pages/AuthPage.vue prototype/src/pages/SiteEditorPage.vue prototype/src/pages/ExtensionPopupPage.vue
git commit -m "feat: add remaining prototype pages"
```

### Task 14: Final responsive and UX verification

**Files:**
- Modify: any affected prototype files

- [ ] **Step 1: Verify desktop layout**

Run: `npm run dev`
Expected: homepage left column dominance is visually obvious on desktop

- [ ] **Step 2: Verify mobile layout**

Run: `npm run dev`
Expected: sections stack cleanly and top navigation/actions remain usable

- [ ] **Step 3: Verify theme switching**

Run: `npm run dev`
Expected: top-level theme toggle updates the UI without breaking contrast

- [ ] **Step 4: Verify page-local simple/detailed mode behavior**

Expected:

- not present in top nav
- available where content density benefits from it

- [ ] **Step 5: Run final test/build pass**

Run: `npm run test && npm run build`
Expected: all tests pass and build succeeds

- [ ] **Step 6: Commit**

```bash
git add prototype
git commit -m "feat: complete cxsearch frontend prototype"
```

---

## Execution Notes

- This plan assumes a new `prototype/` app because the current workspace only contains requirement/design documents.
- The current working directory is not a git repository, so commit steps require a git repo to exist first.
- Keep homepage responsibilities narrow: high-frequency browsing first, management second, discovery third.
- Keep `主题切换` global and visible.
- Keep `简洁 / 详情模式` page-local, not global.

Plan complete and saved to `docs/superpowers/plans/2026-04-22-cxsearch-frontend-prototype.md`. Ready to execute?
