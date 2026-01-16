# Docs workflow

The published documentation site is the VitePress site in `docs/`.

## What is included in the public docs site

The site is intentionally scoped to component docs at the docs root (no `/components` prefix).

- Root page: `docs/index.md` (Components catalog)
- Component pages: `docs/inputs/**`, `docs/views/**`, `docs/utilities/**` (including generated `docs/inputs/*.md`)

## Local development

- Start dev server: `npm run docs:dev`
- Build static site: `npm run docs:build`
- Preview build: `npm run docs:preview`

## Component docs generation

Component docs are generated from JSON.

- Source of truth: `docs/.vitepress/data/components.json`
- Validate JSON: `npm run docs:validate`
- Generate pages: `npm run docs:pages`
- Typical pre-build step: `npm run docs:prepare`

## Templates

Generated component pages are rendered from:

- `docs/.vitepress/templates/component-template.template.md`

(An optional rendered example can be produced with `npm run docs:template`.)
