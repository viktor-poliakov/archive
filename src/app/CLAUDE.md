# Authoring a content page

Every page under this folder is one standalone Angular component (a `.ts` + `.html` pair).
**The fastest, safest way to add a page is to copy a sibling page in the same section folder and adapt it** — conventions vary slightly between older and newer sections, and copying a neighbour guarantees you match the local style. This file documents the shared rules so you don't have to reverse-engineer them from examples.

## JS vs TS page layout

| | JavaScript page | TypeScript page |
|---|---|---|
| Folder | `src/app/<section>/<child>/` | `src/app/typescript/<section>/<child>/` |
| `styleUrls` | `['../../content/doc.scss']` | `['../../../content/doc.scss']` |
| `PAGE_OVERRIDES` key | `javascript/<section>/<child>` | `typescript/<section>/<child>` |
| `import()` path | `./<section>/<child>/<child>` | `./typescript/<section>/<child>/<child>` |

Note the asymmetry: **JavaScript content lives directly under `src/app/<section>/…`** (no `javascript/` folder) but is **registered under the `javascript/…` key**. TypeScript content lives under `src/app/typescript/…` and is registered under `typescript/…`.

### selector & class name are NOT uniform across sections

Examples: `app-classes-basics` / `ClassesBasics` (JS); `app-typescript-classes-basics` / `TypescriptClassesBasics` (TS); but `app-basic-types-primitives` / `BasicTypesPrimitives` (older TS section, no `typescript` prefix). Only two hard rules:

1. the `selector` must be globally unique;
2. the **exported class name must match** the `m.<Name>` you write in the `PAGE_OVERRIDES` entry.

Copy a sibling in the same folder and you'll match the section's convention automatically.

## Steps to add a page

1. **Create the folder + two files**: `<child>.ts` and `<child>.html`.
2. **Component** (`.ts`) — standalone; import `CodeBlock` (plus `RouterLink` if you link to other pages). Put every code sample in a `protected readonly` backtick field.
3. **Template** (`.html`) — breadcrumbs + `.doc__section` blocks. Mind the brace trap below.
4. **Register** in [`app.routes.ts`](app.routes.ts) → `PAGE_OVERRIDES`. **Skip this and the page silently renders the mock `SectionPage`** — the component becomes dead code.
5. **Add the nav entry** in [`nav/nav.data.ts`](nav/nav.data.ts) under `NAV_SECTIONS` if the child/sub isn't listed yet (this generates the sidebar link and the route).
6. **Verify**: `npm run build`.

> **Verifying an example's TS semantics** (exact error text, does-it-compile): don't trust memory — compile a scratch file with the project's own tsc. TS 6.x needs `--ignoreConfig` when you pass a file while a `tsconfig.json` is present:
> `npx tsc --ignoreConfig --noEmit --strict --target es2020 --lib es2020,dom scratch.ts`
> Error codes/messages differ from intuition (e.g. two interfaces with a same-named field of conflicting types is `TS2416` "not assignable to the same property in base type", **not** "incorrectly implements").

## Component skeleton (TS page — for JS, adjust the two `../` counts)

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlock } from '../../../code/code-block'; // JS page: ../../code/code-block

@Component({
  selector: 'app-typescript-<section>-<child>',
  imports: [CodeBlock, RouterLink],
  templateUrl: './<child>.html',
  styleUrls: ['../../../content/doc.scss'], // JS page: ../../content/doc.scss
})
export class Typescript<Section><Child> {
  protected readonly example = `const answer: number = 42;`;
}
```

`CodeBlock` API: `[code]` (required string) and `lang` (defaults to `'typescript'`).

**Only languages registered in [`code/highlighter.service.ts`](code/highlighter.service.ts) are highlighted** — anything else silently falls back to plain `text`, with no build error to warn you. Currently registered: `javascript`, `typescript`, `html`, `css`, `json`, `bash`, `http`, `yaml`, `graphql`, `proto`, `sql`, `python`, `go`, `java`, `kotlin`, `csharp`, `php`, `ruby`, `rust`, `cpp`. Need another one? Add an `import('shiki/langs/<name>.mjs')` to the `langs` array there (check `node_modules/@shikijs/langs/` for the exact grammar id — e.g. the Protobuf file is `proto.mjs` and its id is `proto`).

## Template skeleton

```html
<article class="doc" style="--accent: #3178c6">
<nav class="breadcrumbs">
  <span class="breadcrumbs__root">TypeScript</span>
  <span class="breadcrumbs__sep">/</span>
  <a routerLink="/typescript/<section>">Раздел</a>
  <span class="breadcrumbs__sep">/</span>
  <span class="breadcrumbs__current">Заголовок</span>
</nav>

<h1 class="doc__title">Заголовок</h1>
<p class="doc__lead">Короткое вводное описание страницы.</p>

<section class="doc__section">
  <h2>Подзаголовок</h2>
  <p>Обычный текст. Литеральные скобки экранируем: &#123; ключ: значение &#125;.</p>
  <app-code-block [code]="example" lang="typescript" />
  <ul class="rules">
    <li><strong>Правило</strong> — короткое пояснение.</li>
  </ul>
  <p class="note"><strong>Заметка.</strong> Важное уточнение или ссылка на <a routerLink="/typescript/...">другую страницу</a>.</p>
</section>
</article>
```

## `doc.scss` class vocabulary

- `article.doc` with an inline `style="--accent: <#hex>"` (the section's accent color) — page root.
- `nav.breadcrumbs` → `.breadcrumbs__root`, `.breadcrumbs__sep`, `.breadcrumbs__current`.
- `.doc__title` (`<h1>`), `.doc__lead` (intro `<p>`), `.doc__section` (wraps each `<h2>` block).
- `.rules` — annotated `<ul>`; `.note` — callout `<p>`; `table.compare` — comparison table; `figure.diagram` — inline `<svg>` + `<figcaption>` (see `typescript/classes/basics/basics.html` for a rich diagram example).

## ⚠️ Brace / angle-bracket trap (this WILL break the build)

Inside the `.html` template, Angular reads a raw `{` as the start of an ICU expression and fails with `NG5002 Invalid ICU message`. In prose, inline `<code>`, and SVG `<text>`, escape every literal:

- `{` → `&#123;`  ·  `}` → `&#125;`  ·  `<` → `&lt;`  ·  `>` → `&gt;`

This does **not** apply inside the backtick code strings in the `.ts` — those are highlighted by Shiki, not parsed by Angular, so write real `{`/`<` there. Grep `&#123;` in any existing page for examples.

**Entity escaping does not work for a _double_ brace.** To show interpolation syntax like `{{ count }}` in prose or a table (Vue/Angular examples), `&#123;&#123;` is **not** a fix: the HTML parser decodes entities before interpolation scanning, so Angular still sees `{{ count }}` and fails with `TS2339: Property 'count' does not exist on type <Component>`. Write the real characters inside `ngNonBindable` instead — it's a built-in compiler attribute, no import required:

```html
<code ngNonBindable>{{ count }}</code>
```

## Registration snippet (`app.routes.ts` → `PAGE_OVERRIDES`)

```ts
// TS page:
'typescript/<section>/<child>': () =>
  import('./typescript/<section>/<child>/<child>').then((m) => m.Typescript<Section><Child>),

// JS page (folder is NOT under a javascript/ dir, but the key is):
'javascript/<section>/<child>': () =>
  import('./<section>/<child>/<child>').then((m) => m.<Section><Child>),
```

## Nav entry snippet (`nav/nav.data.ts` → `NAV_SECTIONS`)

A leaf child: `{ id: '<child>', label: 'Заголовок в меню' }`. A child with a third level nests them: `{ id: '<child>', label: '…', children: [ { id: '<sub>', label: '…' } ] }` (the child then redirects to its first sub).
