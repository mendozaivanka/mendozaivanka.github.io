# mendozaivanka.github.io

**Live:** https://mendozaivanka.github.io/ · **Status (2026-11-01):** migrated from Render to GitHub Pages; Timpla
moves to its own repo next.

The portfolio of Ivanka Mendoza, AI & automation engineer in Metro Manila: case studies from work (RAG, anomaly
detection, fine-tuned local models), the CV, and links to the coffee family of open-data sites (Timpla, Sinturon,
Pigâ, Sangkap), which live in their own repos and are served under this domain.

## Layout

| Path | What |
| --- | --- |
| `src/pages/` | `/` (bento + coffee atlas), `/projects/`, `/projects/<slug>/` case studies, `/cv/`, `/resume/`, `/tools/`, `/nordic-rose/`, `404`, redirect stubs for `/tala/` and `/tanim/*` |
| `src/data/` | All content: `projects.ts`, `cv.ts`, `tools.ts`, `site.ts` (name, nav, socials, the coffee family) |
| `src/lib/data/` | The data layer pages read through, with strict zod schemas (`schemas.ts`) and `local` / `http` sources |
| `src/components/` | Site components; `ui/` holds the shadcn/ui components |
| Nordic Rose files | `src/data/tokens.ts`, `src/styles/nordic-rose.css`, `src/components/{ui/*,RoseMark,RoseDemo,ThemeMenu,ContrastSwitch}`, `src/lib/{utils,theme,contrast,toast}.ts`, `src/pages/nordic-rose.astro`, `scripts/{gen-tokens.ts,sync-nordic-rose.mjs}`: vendored, edit them in the private `mendozaivanka/nordic-rose` repo |
| `scripts/` | `build-resume-pdf.ts` (CV PDF), `export-data.ts` (content as JSON), `check-attribution.sh` |
| `.github/workflows/` | `ci.yml` (checks on every push and PR), `deploy.yml` (GitHub Pages on push to `main`) |

## Run it locally

Node 24 (`.node-version`) and npm.

```sh
npm install
npm run hooks        # once per clone: enables the commit-msg hook
npm run dev          # http://localhost:4321
npm run build        # type-check, content validation, WCAG contrast check, static build to dist/
npm run preview
```

## Common changes

- **Content:** edit `src/data/*.ts`. A new field needs the TypeScript type and the zod schema updated together.
- **CV:** edit `src/data/cv.ts`, then `npm run resume:pdf` and commit `public/Ivanka-Mendoza-CV.pdf`. The phone number
  stays off the public site (`cv.profile.phone` is `null`).
- **Design system:** change it in `../nordic-rose`, then `npm run design:sync` here and commit. CI runs
  `npm run design:check` and fails if a vendored file was edited in this repo.
- **A coffee site goes live:** set its `href` and `status` in `coffee` in `src/data/site.ts`.

## Deploying

Every push to `main` builds and deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions). There are no
PR preview URLs; CI builds every PR, and `npm run preview` shows a build locally.

## Free-tier catches

- GitHub Pages on the Free plan needs a public repo. Limits: 1 GB published site, a soft 100 GB/month of bandwidth,
  10 minutes per deploy.
- Pages serves static files only and cannot redirect on the server: old URLs use meta-refresh stub pages.
- The design system repo is private, so its files are copied in (vendored) rather than installed at build time.

## Commit messages

No AI attribution lines (co-author trailers, "Generated with…"). The `commit-msg` hook rejects them locally and CI
checks every pushed commit.

## Licence

Code MIT. Writing, CV and case-study text © Ivanka Mendoza.
