# Bookmark Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the CXSearch prototype so categories, bookmark paths, and ordinary tags are modeled, displayed, filtered, and managed as separate concepts.

**Architecture:** Keep this as a prototype-level data and UI change. Extend the static `sites.ts` and `settings.ts` data models first, then update `MySitesPage`, detail page, editor form, and management panels to reflect the approved taxonomy. Avoid persistence and real bookmark parsing in this pass; show import/export rules through prototype preview content.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Vite, Vitest, Testing Library Vue.

---

## Chunk 1: Data Model and Display

### Task 1: Extend site taxonomy data

**Files:**
- Modify: `prototype/src/data/sites.ts`
- Test: `prototype/src/pages/__tests__/MySitesPage.test.ts`
- Test: `prototype/src/pages/__tests__/PrototypePages.test.ts`

- [ ] **Step 1: Write failing expectations for bookmark path display**

Update tests to expect that detailed site views can show ordinary tags and bookmark paths separately.

In `prototype/src/pages/__tests__/MySitesPage.test.ts`, after switching to detail mode, assert text like `书签路径` and a sample path such as `开发工具 / 代码托管`.

In `prototype/src/pages/__tests__/PrototypePages.test.ts`, the site detail test should assert `普通标签`, `书签路径`, and `原始导入路径`.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run prototype/src/pages/__tests__/MySitesPage.test.ts prototype/src/pages/__tests__/PrototypePages.test.ts`

Expected: FAIL because the fields are not modeled or rendered yet.

- [ ] **Step 3: Extend `SiteRecord`**

In `prototype/src/data/sites.ts`, update the type:

```ts
export type SiteRecord = {
  title: string
  description: string
  category: string
  bookmarkPath: string[]
  tags: string[]
  sourcePath?: string[]
  source: 'manual' | 'browser-import' | 'extension'
  detail: string
  updatedAt: string
}
```

Update every `mySiteEntries` item with realistic values:

```ts
bookmarkPath: ['开发工具', '代码托管'],
tags: ['高频', '协作'],
sourcePath: ['开发文档', '开发工具', '代码托管'],
source: 'browser-import'
```

- [ ] **Step 4: Add bookmark path helpers**

Add helpers in `prototype/src/data/sites.ts`:

```ts
export const getBookmarkPathText = (site: SiteRecord) => site.bookmarkPath.join(' / ')

export const getSourcePathText = (site: SiteRecord) => site.sourcePath?.join(' / ') ?? '平台内创建'
```

- [ ] **Step 5: Render path and tag separation**

Modify `prototype/src/pages/MySitesPage.vue` detail mode to show:

- `书签路径：开发工具 / 代码托管`
- `普通标签：高频 / 协作`

Modify `prototype/src/pages/SiteDetailPage.vue` to show category, bookmark path, ordinary tags, source path, and source.

- [ ] **Step 6: Run focused tests and verify pass**

Run: `npm test -- --run prototype/src/pages/__tests__/MySitesPage.test.ts prototype/src/pages/__tests__/PrototypePages.test.ts`

Expected: PASS in a Node version supported by Vite/Vitest. If current shell uses Node 14, switch to Node 18+ or 20+ first.

## Chunk 2: Filter Mode Switch

### Task 2: Add tag/path filter modes

**Files:**
- Modify: `prototype/src/pages/MySitesPage.vue`
- Test: `prototype/src/pages/__tests__/MySitesPage.test.ts`

- [ ] **Step 1: Write failing filter-mode test**

Extend `MySitesPage.test.ts` to assert:

- Default filter label is `按普通标签筛选`.
- A switch button named `切换为书签路径筛选` exists.
- After clicking it, the filter label changes to `按书签路径筛选`.
- Bookmark path options such as `开发工具 / 代码托管` are visible.

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- --run prototype/src/pages/__tests__/MySitesPage.test.ts`

Expected: FAIL because the mode switch does not exist.

- [ ] **Step 3: Add filter state**

In `MySitesPage.vue`, add:

```ts
const filterMode = ref<'tags' | 'bookmarkPath'>('tags')
const selectedBookmarkPath = ref<string | undefined>()
```

Compute path options from site records:

```ts
const bookmarkPathItems = computed(() => {
  const counts = new Map<string, number>()
  mySiteEntries.forEach((site) => {
    const path = getBookmarkPathText(site)
    counts.set(path, (counts.get(path) ?? 0) + 1)
  })
  return Array.from(counts.entries()).map(([path, count]) => ({ path, count }))
})
```

- [ ] **Step 4: Update filter UI**

Show a segmented control:

```text
筛选方式：[普通标签] [书签路径]
```

When mode is `tags`, show ordinary tag chips. When mode is `bookmarkPath`, show bookmark path chips.

- [ ] **Step 5: Update filtering logic**

Filtering should include:

- Category match always applies.
- In `tags` mode, selected ordinary tags apply.
- In `bookmarkPath` mode, selected bookmark path applies.

Switching modes should clear the other mode's selected filters to avoid hidden filters.

- [ ] **Step 6: Run focused test**

Run: `npm test -- --run prototype/src/pages/__tests__/MySitesPage.test.ts`

Expected: PASS in Node 18+ or 20+.

## Chunk 3: Editor and Management Panels

### Task 3: Reflect taxonomy in editor and management center

**Files:**
- Modify: `prototype/src/components/SiteEditorForm.vue`
- Modify: `prototype/src/components/management/ManagementSidebar.vue`
- Modify: `prototype/src/components/management/TagManagementPanel.vue`
- Create: `prototype/src/components/management/BookmarkPathManagementPanel.vue`
- Modify: `prototype/src/pages/ManagementPage.vue`
- Modify: `prototype/src/data/settings.ts`
- Test: `prototype/src/pages/__tests__/PrototypePages.test.ts`
- Test: `prototype/src/pages/__tests__/ManagementPanels.test.ts`
- Test: `prototype/src/components/management/__tests__/ManagementSidebar.test.ts`

- [ ] **Step 1: Write failing management tests**

Update tests to expect:

- Sidebar contains `书签路径管理`.
- Tag management description says ordinary tags are for usage/status/frequency.
- Bookmark path management page shows paths under categories.
- Site editor form has fields `书签路径` and `普通标签`.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run prototype/src/pages/__tests__/PrototypePages.test.ts prototype/src/pages/__tests__/ManagementPanels.test.ts prototype/src/components/management/__tests__/ManagementSidebar.test.ts`

Expected: FAIL because the new panel and form fields do not exist.

- [ ] **Step 3: Update editor form labels**

In `SiteEditorForm.vue`:

- Rename existing `标签` field to `普通标签`.
- Add or repurpose a field named `书签路径` with placeholder `例如 前端 / Vue / 官方`.
- Bind display values from `site.bookmarkPath` and `site.tags` separately.

- [ ] **Step 4: Add bookmark path settings data**

In `settings.ts`, add records like:

```ts
export const bookmarkPathRecords = [
  {
    category: '开发文档',
    path: '开发工具 / 代码托管',
    siteCount: 3
  }
]
```

- [ ] **Step 5: Create bookmark path management panel**

Create `BookmarkPathManagementPanel.vue` that shows:

- Category
- Path
- Site count
- Actions: `重命名路径`, `迁移站点`

- [ ] **Step 6: Wire sidebar and page rendering**

Add `书签路径管理` to `ManagementSidebar.vue` near `标签管理`.

Update `ManagementPage.vue` to render `BookmarkPathManagementPanel` for that item.

- [ ] **Step 7: Run focused tests**

Run: `npm test -- --run prototype/src/pages/__tests__/PrototypePages.test.ts prototype/src/pages/__tests__/ManagementPanels.test.ts prototype/src/components/management/__tests__/ManagementSidebar.test.ts`

Expected: PASS in Node 18+ or 20+.

## Chunk 4: Import / Export Prototype Rules

### Task 4: Show browser bookmark conversion rules

**Files:**
- Modify: `prototype/src/components/management/ImportExportPanel.vue`
- Modify: `prototype/src/data/settings.ts`
- Test: `prototype/src/pages/__tests__/ManagementPanels.test.ts`

- [ ] **Step 1: Write failing import/export test**

Update `ManagementPanels.test.ts` to click `导入 / 导出` and assert:

- `导入预览规则`
- `分类 / 书签路径 / 站点名称`
- `按原浏览器结构导出`
- `按 CXSearch 当前结构导出`
- `扁平导出到分类文件夹`

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- --run prototype/src/pages/__tests__/ManagementPanels.test.ts`

Expected: FAIL because the panel only shows generic import/export cards.

- [ ] **Step 3: Add prototype records**

In `settings.ts`, add conversion examples and export mode records:

```ts
export const bookmarkImportPreviewRecords = [
  {
    sourcePath: '开发 / 前端 / Vue / 官方 / Vue Router',
    category: '开发',
    bookmarkPath: '前端 / Vue / 官方',
    tags: '不自动生成普通标签'
  }
]
```

- [ ] **Step 4: Render conversion preview and export modes**

In `ImportExportPanel.vue`, add sections:

- `导入预览规则`
- source path to category/path/tags conversion example
- `导出模式`
- three mode cards

- [ ] **Step 5: Run focused test**

Run: `npm test -- --run prototype/src/pages/__tests__/ManagementPanels.test.ts`

Expected: PASS in Node 18+ or 20+.

---

## Validation

After all chunks pass focused tests, run:

```bash
npm test
npm run build
```

Expected: all tests pass and Vite build completes. Current environment previously showed Node 14 for `npm test`, which is too old for this Vite/Vitest stack; use Node 18+ or 20+ for validation.

## Notes

- Do not implement persistent CRUD in this pass.
- Do not parse real browser bookmark HTML yet.
- Keep this pass focused on prototype semantics, UI, and test coverage.
- This repository root may not be a git repository in the current environment; do not assume commits are available.
