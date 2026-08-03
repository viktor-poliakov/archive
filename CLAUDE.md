# CLAUDE.md

Guidance for Claude Code working in this repository.

This is a **Russian-language JavaScript & TypeScript learning-docs site** — an Angular 22 SPA. Almost all real work is **authoring or editing content pages**; the app shell (sidebar, routing, code highlighting) is already built and rarely changes.

> **Adding or editing a content page?** The full recipe — folder layout, component/template skeletons, registration, and the build-breaking gotchas — lives in [`src/app/CLAUDE.md`](src/app/CLAUDE.md). Read that first; it saves opening example pages and the 570-line routes file.

## Commands

- `npm start` — dev server (`ng serve`) at http://localhost:4200, hot-reloads on save. (The Claude Code preview uses the `dev` config in `.claude/launch.json`, port **4300**.)
- `npm run build` — production build into `dist/`. **This is how you verify a page**: Angular's strict template type-check catches the common authoring mistakes (unescaped `{`/`<`, missing `[code]` bindings).
- `npm run watch` — development build that rebuilds on change.
- `npm test` — unit tests with Vitest via the Angular `@angular/build:unit-test` builder.
- `npx ng test --include='**/app.spec.ts'` — run a single spec file.

## Architecture

Angular 22 **standalone** application — there are **no NgModules**.

- **Bootstrap**: `src/main.ts` → `bootstrapApplication(App, appConfig)`. App-wide providers live in `src/app/app.config.ts`, not a module.
- **Content model**: one page = one standalone component at `src/app/[typescript/]<section>/<child>/<child>.{ts,html}`. Prose lives in the `.html`; code samples are `protected readonly` backtick-string fields on the component, rendered by `<app-code-block [code]="field" lang="typescript" />` (Shiki highlighting).
- **Navigation is the single source of truth**: `src/app/nav/nav.data.ts` exports `NAV_SECTIONS`, from which **both** the sidebar and the routes are generated. The two top-level sections are `javascript` and `typescript`.
- **Routing** (`src/app/app.routes.ts`): routes are generated from the nav data. A leaf renders its real component **only if registered in `PAGE_OVERRIDES`**; otherwise it falls back to the mock `SectionPage`. A new page stays invisible until you add its `PAGE_OVERRIDES` entry.
- **Shared UI**: `CodeBlock` (`src/app/code/`); page styles in `src/app/content/doc.scss` (`.doc`, `.doc__section`, `.note`, `.rules`, `table.compare`, `figure.diagram`).
- **State**: prefer signals (`signal`, `computed`, signal inputs) over `@Input`/manual change detection.
- **File naming**: this project drops the `.component.ts` suffix — the root component is `app.ts` / `app.html` / `app.scss` (class `App`). Follow the same flat naming.

## Notes

- **Strict TS**: `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch` all on. Index-signature properties need bracket notation. TypeScript is `~6.0.2` (inferred type predicates work — `arr.filter(x => x != null)` narrows).
- Styles are SCSS globally (`src/styles.scss`) and per-component (`inlineStyleLanguage: scss`). Static assets go in `public/`.
- Formatting is Prettier (`.prettierrc`); editor settings in `.editorconfig`.
- ⚠️ **Angular template brace trap**: in a page `.html`, every literal `{` `}` `<` `>` in prose, `<code>`, or SVG must be HTML-escaped (`&#123;` `&#125;` `&lt;` `&gt;`) or the build fails with `NG5002`. It does **not** apply inside the `.ts` backtick code strings. Full details in `src/app/CLAUDE.md`.
