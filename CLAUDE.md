# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (`ng serve`) at http://localhost:4200, hot-reloads on save
- `npm run build` — production build into `dist/` (default config is `production`)
- `npm run watch` — development build that rebuilds on change
- `npm test` — run unit tests with Vitest via the Angular `@angular/build:unit-test` builder
- `npx ng test --include='**/app.spec.ts'` — run a single spec file
- `npx ng generate component <name>` — scaffold a component (SCSS styles, `app` selector prefix)

## Architecture

Angular 22 standalone application — there are **no NgModules**. Key conventions that differ from older Angular:

- **Bootstrap path**: `src/main.ts` → `bootstrapApplication(App, appConfig)`. App-wide providers (router, global error listeners) live in `src/app/app.config.ts`, not a module.
- **Routing**: routes are defined as a flat array in `src/app/app.routes.ts` (currently empty) and wired via `provideRouter`. Add routes here; lazy-load with `loadComponent`.
- **Components are standalone**: each declares its own `imports` array in the `@Component` decorator (e.g. `App` imports `RouterOutlet`). There is no shared module to register declarations in.
- **Signals over decorators for state**: component state uses `signal()` (see `App.title`). Prefer signals, `computed`, and signal-based inputs over `@Input`/manual change detection.
- **File naming**: this project drops the `.component.ts` suffix — the root component lives in `app.ts` / `app.html` / `app.scss` as the class `App`. Follow the same flat naming when adding files.

## Notes

- TypeScript is strict: `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noImplicitOverride`, and `noFallthroughCasesInSwitch` are all on. Index-signature properties must be accessed with bracket notation.
- Styles are SCSS globally (`src/styles.scss`) and per-component (`inlineStyleLanguage: scss`).
- Static assets go in `public/` (copied to the build root).
- Formatting is Prettier (`.prettierrc`); editor settings in `.editorconfig`.
