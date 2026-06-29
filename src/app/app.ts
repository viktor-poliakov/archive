import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Контент скроллится внутри <main class="content">, а не в окне,
  // поэтому стандартное scrollPositionRestoration роутера не помогает —
  // плавно прокручиваем этот контейнер наверх сами при каждой навигации.
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.content()?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
