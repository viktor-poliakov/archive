import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';

import { findNav } from '../nav/nav.lookup';
import { BookmarkService } from './bookmark.service';

/**
 * Вопрос при запуске: «есть закладка, перейти к ней?».
 *
 * Нативный <dialog> взят не ради экономии: showModal() даёт ловушку фокуса,
 * закрытие по Esc и блокировку фона — всё то, что при своём оверлее пришлось
 * бы писать руками и всё равно забыть половину.
 */
@Component({
  selector: 'app-bookmark-prompt',
  templateUrl: './bookmark-prompt.html',
  styleUrl: './bookmark-prompt.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkPrompt {
  private readonly service = inject(BookmarkService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly open = this.service.promptOpen;
  protected readonly bookmark = this.service.bookmark;

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el) return;

      if (this.open()) {
        if (!el.open) el.showModal();
      } else if (el.open) {
        el.close();
      }
    });
  }

  /** Подпись раздела берём из навигации, а не из записи: правки названий
   *  доезжают и до старой закладки. */
  protected sectionLabel(): string {
    const anchor = this.bookmark();
    if (!anchor) return '';
    return findNav(anchor.path)?.section.label ?? anchor.sectionId;
  }

  protected sectionColor(): string {
    const anchor = this.bookmark();
    if (!anchor) return 'var(--purple)';
    return findNav(anchor.path)?.section.color ?? 'var(--purple)';
  }

  protected accept(): void {
    this.service.acceptPrompt();
  }

  protected dismiss(): void {
    this.service.dismissPrompt();
  }
}
