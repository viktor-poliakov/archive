import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BookmarkPrompt } from './reading/bookmark-prompt';
import { BookmarkService } from './reading/bookmark.service';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, BookmarkPrompt],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Контент скроллится внутри <main class="content">, а не в окне, поэтому
  // стандартное scrollPositionRestoration роутера не помогает. Всей прокруткой
  // заведует BookmarkService: и сбросом наверх при обычной навигации, и
  // возвратом к закладке.
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');

  constructor() {
    const bookmarks = inject(BookmarkService);
    effect(() => {
      const el = this.content()?.nativeElement;
      if (el) bookmarks.setScrollContainer(el);
    });
  }
}
