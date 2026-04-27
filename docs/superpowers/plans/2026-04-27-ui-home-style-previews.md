# UI Home Style Previews Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one homepage mockup for each playful K1-K6 direction on the existing UI design preview page.

**Architecture:** Keep the feature local to `UIDesignPreviewPage.vue` and reuse its existing `playfulStyles` data. Add a focused component test that verifies the new section renders the six playful homepage previews.

**Tech Stack:** Vue 3, Vue Test Utils through Testing Library, Vitest, Vite.

---

### Task 1: Test the New UI Design Section

**Files:**
- Create: `prototype/src/pages/__tests__/UIDesignPreviewPage.test.ts`

- [ ] Write a failing test that renders `UIDesignPreviewPage` and expects `趣味风格首页方案`.
- [ ] Assert that K1-K6 playful style names appear inside the new preview section.
- [ ] Run `npm run test -- UIDesignPreviewPage.test.ts` and confirm the test fails because the section does not exist.

### Task 2: Implement Homepage Mockups

**Files:**
- Modify: `prototype/src/pages/UIDesignPreviewPage.vue`

- [ ] Add a new section after the existing horizontal preview section.
- [ ] Render one homepage concept article for each item in `playfulStyles`.
- [ ] Give each style a distinct layout and metaphor, rather than sharing a single homepage shell.
- [ ] Add scoped CSS for garden, doodle, pixel, magazine, forest, and galaxy concepts.
- [ ] Run the focused test and then the prototype test suite.
