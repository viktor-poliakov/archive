import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { HighlighterService } from './highlighter.service';

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  private readonly highlighter = inject(HighlighterService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly code = input.required<string>();
  readonly lang = input('typescript');

  /** Shiki-highlighted markup; null until the highlighter has produced it. */
  protected readonly html = signal<SafeHtml | null>(null);
  protected readonly copied = signal(false);

  constructor() {
    effect(() => {
      const code = this.code();
      const lang = this.lang();
      this.highlighter.highlight(code, lang).then((markup) => {
        this.html.set(this.sanitizer.bypassSecurityTrustHtml(markup));
      });
    });
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
