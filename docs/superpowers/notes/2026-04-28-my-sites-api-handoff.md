# My Sites API Handoff

Date: 2026-04-28

## Completed Today

- Wired `/my-sites` to use authenticated backend data from:
  - `GET /personal-sites`
  - `GET /categories?scope=personal`
  - `GET /tags?scope=personal`
- Kept the static prototype fallback when the user is unauthenticated or backend loading fails.
- Connected the add/edit modal save path:
  - New backend site uses `POST /personal-sites`.
  - Existing backend site uses `PATCH /personal-sites/{siteId}`.
  - The list refreshes after save.
- Updated detail links so backend-loaded sites use the backend site `id` instead of the display title.
- Wired the site detail page to load authenticated backend details from `GET /personal-sites/{siteId}`.
- Kept the old title-based prototype detail fallback for unauthenticated/static prototype routes such as `/my-sites/GitHub`.
- Added a unified future ideas backlog:
  - `docs/CXSearch-future-ideas-backlog.md`
  - `IDEA-001`: multi-identity bookmark lists.

## Verification

- `npm run test -- src/pages/__tests__/MySitesPage.test.ts`: 4 tests passed.
- `npm run test`: 10 test files / 22 tests passed.
- `npm run build`: passed.

## Continue Tomorrow

- Continue functional MVP integration, not visual review.
- Check the authenticated data indicator: users currently cannot tell whether `/my-sites` is showing backend data or prototype fallback data.
- Login form mismatch was fixed after this note:
  - MVP now supports true account/email login.
  - Register creates a unique `username`.
  - Login accepts `identifier`, which can be either username or email.
- Recommended next backend integration target:
  - Wire detail-page actions: open tracking, archive/restore, recheck, and delete.
- Keep browser extension UI simple later; reuse the current web/K6 style.
- Do not implement multi-identity bookmark lists yet. It is recorded as a future requirement only.
