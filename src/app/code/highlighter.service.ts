import { Injectable } from '@angular/core';
import type { HighlighterCore, ShikiTransformer } from 'shiki/core';

const THEME = 'dracula';

/**
 * Marks a line as an error: a trailing `[!error]`, optionally preceded by the
 * language's comment characters. The marker is stripped before highlighting, so
 * it never reaches the screen or the clipboard.
 */
const ERROR_MARKER = /[ \t]*(?:\/\/|#|--|;)?[ \t]*\[!error\][ \t]*$/;

/** Removes the markers so the copy button yields clean, runnable text. */
export function stripErrorMarkers(code: string): string {
  return code
    .split('\n')
    .map((line) => line.replace(ERROR_MARKER, ''))
    .join('\n');
}

/**
 * Tags lines ending in `[!error]` with a class the global stylesheet paints red.
 * A fresh instance per `codeToHtml` call keeps the line set from leaking between
 * concurrently highlighted blocks.
 */
function errorLineTransformer(): ShikiTransformer {
  let errorLines = new Set<number>();

  return {
    name: 'error-lines',
    preprocess(code) {
      errorLines = new Set();
      return code
        .split('\n')
        .map((line, index) => {
          if (!ERROR_MARKER.test(line)) return line;
          errorLines.add(index + 1);
          return line.replace(ERROR_MARKER, '');
        })
        .join('\n');
    },
    line(node, lineNumber) {
      if (!errorLines.has(lineNumber)) return;
      const existing = node.properties['class'];
      node.properties['class'] = existing ? `${existing} line--error` : 'line--error';
    },
  };
}

/**
 * Lazily creates a single Shiki highlighter and reuses it for every code block.
 * Uses Shiki's fine-grained imports so only the themes/languages we need (plus
 * the wasm engine) are bundled as lazy chunks — not the full language set.
 */
@Injectable({ providedIn: 'root' })
export class HighlighterService {
  private highlighter?: Promise<HighlighterCore>;

  async highlight(code: string, lang: string): Promise<string> {
    const highlighter = await this.getHighlighter();
    const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
    return highlighter.codeToHtml(code, {
      lang: language,
      theme: THEME,
      transformers: [errorLineTransformer()],
    });
  }

  private getHighlighter(): Promise<HighlighterCore> {
    if (!this.highlighter) {
      this.highlighter = this.create();
    }
    return this.highlighter;
  }

  private async create(): Promise<HighlighterCore> {
    const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/oniguruma'),
    ]);

    return createHighlighterCore({
      themes: [import('shiki/themes/dracula.mjs')],
      langs: [
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/http.mjs'),
        import('shiki/langs/yaml.mjs'),
        import('shiki/langs/graphql.mjs'),
        import('shiki/langs/proto.mjs'),
        import('shiki/langs/sql.mjs'),
        import('shiki/langs/python.mjs'),
        import('shiki/langs/go.mjs'),
        import('shiki/langs/java.mjs'),
        import('shiki/langs/kotlin.mjs'),
        import('shiki/langs/csharp.mjs'),
        import('shiki/langs/php.mjs'),
        import('shiki/langs/ruby.mjs'),
        import('shiki/langs/rust.mjs'),
        import('shiki/langs/cpp.mjs'),
      ],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    });
  }
}
