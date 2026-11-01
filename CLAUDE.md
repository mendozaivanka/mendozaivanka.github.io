# mendozaivanka.github.io

Astro 7 static site + React 19 islands + shadcn/ui (Tailwind v4), styled with the Nordic Rose design system.
Deployed to GitHub Pages from `main` by `.github/workflows/deploy.yml`. README.md has the details.

- **Content** lives in `src/data/*.ts` (projects, cv, tools, site). Pages read projects, CV and tools only through
  `@/lib/data` (`await getProjects()` etc.). New content type → schema in `src/lib/data/schemas.ts`, a method on
  `DataSource` (`sources/types.ts`), implement it in every source, and a getter in `src/lib/data/index.ts`.
- **New field** on existing content → update the TS type *and* the strict zod schema; `astro check` catches mismatches.
- **Config** comes from the environment (`.env.example`): `SITE_URL`, `DEPLOY_ADAPTER`, `DATA_SOURCE`, `DATA_API_URL`,
  `DATA_API_TOKEN`. Don't hard-code URLs or hosts.
- **Design system:** Nordic Rose files are vendored from `../nordic-rose` (tokens, `nordic-rose.css`, `components/ui`,
  RoseMark, RoseDemo, ThemeMenu, ContrastSwitch, `lib/{utils,theme,contrast,toast}`, `pages/nordic-rose.astro`). Never
  edit them here: change `../nordic-rose`, then `npm run design:sync`. The build fails on WCAG contrast regressions.
  Colour classes: `primary`, `primary-strong`, `rosas-1..5`, `fjord`, `fjord-ink`, `moss`, `sand`, `heather`.
- **Timpla and the other coffee sites** are separate repos served at `/<repo>/` on this domain. This repo only links to
  them (`coffee` in `src/data/site.ts`) and keeps `/tanim/*` redirect stubs.
- **CV changed** → `npm run resume:pdf` and commit the regenerated PDF. The phone number stays off the public site.
- **Commits and PRs carry no AI attribution** (no Co-Authored-By Claude, no "Generated with Claude Code").
- Verify with `npm run build` (type-check + content validation + build). Commit/push only when asked.
