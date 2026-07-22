# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Amir Muntasser's personal site (arkmuntasser.com) — a VitePress + Vue 3 site with a fully custom theme (no default VitePress theme UI is used). Content lives in markdown files at the repo root and in `posts/`; presentation lives entirely in `.vitepress/theme/`.

## Commands

- `npm run docs:dev` — local dev server
- `npm run docs:build` — production build (also runs RSS + OG image generation via `buildEnd` in `.vitepress/config.mjs`)
- `npm run docs:preview` — preview a production build
- `npm run publish:atproto` — publish blog posts to AT Protocol (Bluesky) via `scripts/publish-atproto.mjs`; requires `.env` with `ATP_HANDLE` and `ATP_APP_PASSWORD` locally, or the same two vars set in Vercel project env vars for production builds
- There is no test suite (`npm test` is a stub) and no linter configured.

Deployed on Vercel (see `vercel.json`). Build output is `.vitepress/dist`; `vercel.json` sets `"cleanUrls": true` so Vercel's static server rewrites extensionless requests to the `.html` files VitePress emits (VitePress's own `cleanUrls: true` in `config.mjs` only rewrites internal links — it does not affect how the host serves files, so both settings are required together). The Vercel `buildCommand` runs `scripts/publish-atproto.mjs` before `docs:build`; a publish failure is swallowed (`|| echo ... &&`) so it never blocks the site deploy.

## Architecture

### Content vs. theme
- Root-level `.md` files (`index.md`, `about.md`, `blog.md`, etc.) and `posts/*.md` are content only. Frontmatter drives layout selection — see below.
- All Vue components, styles, and utilities live under `.vitepress/theme/`.
- `.vitepress/config.mjs` is the site config: head tags, OG/Twitter meta via `transformHead`, and a `buildEnd` hook that generates `rss.xml` and per-page OG images (`.vitepress/og-template.html` rendered with Puppeteer — uses `@sparticuz/chromium` on Vercel, local `puppeteer` otherwise).

### Layout routing (`.vitepress/theme/Layout.vue`)
There is no per-page layout frontmatter field; `Layout.vue` picks a layout by inspecting page state in this order: `page.isNotFound` → `frontmatter.home` (homepage) → `frontmatter.title === 'About'` → `frontmatter.title === 'Blog'` → `page.filePath` starts with `posts/` (blog post) → default page layout. When adding a new special page layout, extend this chain rather than adding a frontmatter-based system.

### Blog post frontmatter
Posts (`posts/*.md`) use: `title`, `date`, `excerpt`, `author` (array), `category` (array), `featured`, `weeknotes`, `updated`, `changelog` (array of strings). `PageHeader` and `Changelog` components render these directly. `getBlogPosts()` in `.vitepress/theme/utils/posts.js` uses `import.meta.glob` on `/posts/*.md` to build the listing used by `BlogPostList.vue`.

### External data fetching
Components pull live data client-side from third-party APIs via small fetch wrappers in `.vitepress/theme/utils/`:
- `bluesky.js` — Bluesky/AT Protocol author feed (public API)
- `github.js` — GitHub repos for the given username, excluding forks and specific repo names
- `popfeed.js` — reviews stored as AT Protocol records (`social.popfeed.feed.review`)

These are plain fetch-based functions (no SDK, no caching layer) consumed by components like `BlueskyFeed.vue`, `GithubProjects.vue`, `PopfeedReviews.vue`.

### AT Protocol integration
The site publishes itself and its posts as AT Protocol records under the `site.standard.*` and `at.markpub.*` lexicons (see `scripts/publish-atproto.mjs`). Record `rkey`s are deterministic (`self` for the publication, the post's filename minus `.md` for each document), so the `at://` URIs referencing them can be computed at build time without reading the script's output.

`config.mjs` emits these `at://` URIs in two places: a sitewide `<link rel="site.standard.publication">` (in the static `head` array) and, per post, a `<link rel="site.standard.document">` in `transformHead`. `public/.well-known/site.standard.publication` is a static plain-text file (copied verbatim into the build output by VitePress) containing the same publication `at://` URI, for discovery without parsing HTML. `scripts/set-icon.sh` updates the publication record's icon blob directly via curl against the PDS.

These four pieces — config head tags, the `.well-known` file, the publish script, and the icon script — must stay in sync with the DID (`did:plc:2lm4lab5fhnj6kaazrxopv37`) and handle (`arkmuntasser.com`) if either changes. The publish script derives its DID dynamically from login, so it can't drift; the other three hardcode it and would need manual updates.

### CSS conventions
- Global styles in `.vitepress/theme/style.css` define a cascade layer order: `theme.reset`, then within `theme`: `tokens, elements, components, widgets, utilities` (in that order — later layers win regardless of source order).
- Component `<style>` blocks declare `@layer theme.components { ... }` (or `theme.elements`, etc.) to slot into this system rather than relying on normal CSS specificity.
- Design tokens (color, radius, type scale) are defined as custom properties in `@layer tokens` in `style.css`, using OKLCH-relative color syntax (`oklch(from var(--brand-color) ...)`).
- Layout primitives (`.stack`, `.row`, `.pile`, `.breakout-container`) are utility classes defined once in `style.css` and reused across components rather than redefined per-component.
- **Typography sizes must use `rem`/`em`/`%`, never `px`.**
