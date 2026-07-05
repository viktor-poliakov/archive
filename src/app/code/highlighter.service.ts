import { Injectable } from '@angular/core';
import type { HighlighterCore } from 'shiki/core';

const THEME = 'dracula';

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
    return highlighter.codeToHtml(code, { lang: language, theme: THEME });
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
      ],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    });
  }
}
