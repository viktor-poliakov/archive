import {
  afterNextRender,
  effect,
  inject,
  Injectable,
  Injector,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { findNav } from '../nav/nav.lookup';
import { collectHeadings, HeadingEntry } from './heading-index';
import { loadBookmark, saveBookmark } from './reading-storage';
import { ReadingAnchor } from './reading.types';

/** Куда ставим заголовок при возврате к закладке. */
const RESTORE_OFFSET = 16;
/** Столько кадров подряд цель не должна двигаться, чтобы считать раскладку устоявшейся. */
const STABLE_FRAMES = 12;
const RESTORE_TIMEOUT_MS = 4000;
const INDEX_RETRY_FRAMES = 30;

/**
 * Подгонку отменяем по ВВОДУ, а не по событию scroll: скролл мы генерируем
 * сами каждый кадр и свой от пользовательского не отличим.
 */
const ABORT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

const FLAG_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
  '<path d="M6 3h12v18l-6-4.5L6 21V3z" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linejoin="round" /></svg>';

/**
 * Одна закладка на всё приложение: новая перетирает старую.
 *
 * Ставится кнопкой у заголовка — кнопки вставляются в разметку в рантайме,
 * потому что все 319 контентных страниц написаны обычным HTML и добавить в них
 * компонент можно было бы только правкой каждой.
 *
 * Контент скроллится внутри <main class="content">, а не в окне, поэтому
 * роутерные scrollPositionRestoration и anchorScrolling бесполезны — они
 * работают через viewport. Всей прокруткой заведует этот сервис.
 */
@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private readonly container = signal<HTMLElement | null>(null);
  private readonly headings = signal<readonly HeadingEntry[]>([]);
  private readonly pageTitle = signal('');

  /** Единственная закладка; null — её нет. */
  readonly bookmark = signal<ReadingAnchor | null>(loadBookmark());

  /** Открыт ли вопрос «перейти к закладке?». */
  readonly promptOpen = signal(false);

  private pendingRestore: ReadingAnchor | null = null;
  private cancelRestore: () => void = () => {};

  constructor() {
    // Эффект ждёт оба условия — контейнер отрендерился И известен URL. Так
    // снимается гонка «первый NavigationEnd пришёл раньше, чем вью App».
    effect(() => {
      const el = this.container();
      const url = this.url();
      if (el) untracked(() => this.handleNavigation(el, url));
    });

    // Спрашиваем один раз за запуск приложения, а не при каждом переходе.
    if (this.bookmark() !== null) this.promptOpen.set(true);
  }

  /** Вызывается оболочкой, когда отрендерился <main class="content">. */
  setScrollContainer(el: HTMLElement): void {
    if (this.container() === el) return;
    this.container.set(el);
  }

  /** Ответ «да» в диалоге: перейти к закладке. */
  acceptPrompt(): void {
    this.promptOpen.set(false);
    const anchor = this.bookmark();
    if (anchor) this.openBookmark(anchor);
  }

  /** Ответ «нет»: просто закрыть. Закладку НЕ трогаем. */
  dismissPrompt(): void {
    this.promptOpen.set(false);
  }

  private openBookmark(anchor: ReadingAnchor): void {
    const url = `/${anchor.path}`;
    if (this.router.url === url) {
      // Та же страница: NavigationEnd не придёт, подгоняем сразу.
      this.beginRestore(anchor);
      return;
    }
    this.pendingRestore = anchor;
    void this.router.navigateByUrl(url);
  }

  // ── навигация и индексация ───────────────────────────────────────────────

  private handleNavigation(el: HTMLElement, url: string): void {
    this.cancelRestore();
    this.headings.set([]);
    this.pageTitle.set('');

    const pending = this.pendingRestore;
    this.pendingRestore = null;
    const isRestore = pending !== null && `/${pending.path}` === url;

    if (isRestore) {
      // Мгновенно: плавная анимация подралась бы с покадровой подгонкой.
      el.scrollTop = 0;
    } else {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Ленивый чанк загружен к NavigationEnd, но вью ещё нет.
    afterNextRender(
      () => {
        if (!this.indexPage(el)) this.retryIndex(el, INDEX_RETRY_FRAMES);
        if (isRestore && pending) this.beginRestore(pending);
      },
      { injector: this.injector },
    );
  }

  /**
   * MutationObserver здесь не нужен и вреден: Shiki подменяет innerHTML каждого
   * блока кода, наблюдатель сработал бы десятки раз подряд, а заголовки при
   * этом не меняются.
   */
  private indexPage(el: HTMLElement): boolean {
    const doc = el.querySelector('.doc');
    if (!doc) return false;

    const entries = collectHeadings(doc);
    this.headings.set(entries);
    this.pageTitle.set(doc.querySelector('.doc__title')?.textContent?.trim() ?? '');
    this.mountButtons(entries);
    return true;
  }

  private retryIndex(el: HTMLElement, framesLeft: number): void {
    if (framesLeft <= 0) return;
    requestAnimationFrame(() => {
      if (!this.indexPage(el)) this.retryIndex(el, framesLeft - 1);
    });
  }

  // ── кнопки у заголовков ──────────────────────────────────────────────────

  /**
   * Кнопка живёт ВНУТРИ заголовка и стоит первой, в одной строке с текстом.
   * Внутри только SVG без текста, поэтому textContent заголовка не меняется
   * и слаг при повторной индексации остаётся прежним.
   */
  private mountButtons(entries: readonly HeadingEntry[]): void {
    for (const entry of entries) {
      if (entry.el.querySelector('.heading-bookmark')) continue;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'heading-bookmark';
      button.innerHTML = FLAG_SVG;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.toggleAt(entry);
      });
      entry.el.insertBefore(button, entry.el.firstChild);
    }
    this.syncButtons();
  }

  /** Закрашенным показывается ровно один заголовок — тот, что заложен. */
  private syncButtons(): void {
    const active = this.bookmark();
    const path = findNav(this.url())?.path ?? null;

    for (const entry of this.headings()) {
      const button = entry.el.querySelector<HTMLElement>('.heading-bookmark');
      if (!button) continue;

      const on = active !== null && active.path === path && active.slug === entry.slug;
      button.classList.toggle('heading-bookmark--on', on);
      button.setAttribute('aria-pressed', String(on));
      const label = on ? 'Убрать закладку' : 'Заложить это место';
      button.title = label;
      button.setAttribute('aria-label', label);

      const path2 = button.querySelector('path');
      if (path2) path2.setAttribute('fill', on ? 'currentColor' : 'none');
    }
  }

  /** Повторный клик по заложенному заголовку снимает закладку. */
  private toggleAt(entry: HeadingEntry): void {
    const match = findNav(this.url());
    if (!match || match.kind === 'section' || match.kind === 'group') return;

    const active = this.bookmark();
    const isSame = active !== null && active.path === match.path && active.slug === entry.slug;

    this.setBookmark(
      isSame
        ? null
        : {
            path: match.path,
            slug: entry.slug,
            heading: entry.text,
            title: this.pageTitle() || match.label,
            sectionId: match.section.id,
            savedAt: Date.now(),
          },
    );
  }

  private setBookmark(anchor: ReadingAnchor | null): void {
    this.bookmark.set(anchor);
    saveBookmark(anchor);
    this.syncButtons();
  }

  // ── возврат к закладке ───────────────────────────────────────────────────

  /**
   * Возвращает читателя к заголовку и удерживает его там, пока раскладка не
   * устоится. Подсветка кода приезжает асинхронно и меняет высоту страницы
   * волнами уже после навигации, поэтому восстанавливать пиксельное смещение
   * бесполезно — держим ЭЛЕМЕНТ у верхней кромки и каждый кадр пересчитываем
   * цель заново.
   */
  private beginRestore(anchor: ReadingAnchor): void {
    const el = this.container();
    if (!el || (anchor.slug === null && anchor.heading === null)) return;

    const deadline = performance.now() + RESTORE_TIMEOUT_MS;
    let lastTarget = Number.NaN;
    let stable = 0;
    let frame = 0;

    const stop = (): void => {
      cancelAnimationFrame(frame);
      for (const type of ABORT_EVENTS) el.removeEventListener(type, stop);
      this.cancelRestore = () => {};
    };

    this.cancelRestore = stop;
    for (const type of ABORT_EVENTS) {
      el.addEventListener(type, stop, { passive: true, once: true });
    }

    const tick = (): void => {
      if (performance.now() > deadline) {
        stop();
        return;
      }

      // Индекс мог ещё не построиться: ленивый чанк рендерится не мгновенно.
      if (this.headings().length === 0) this.indexPage(el);

      const target = this.findHeadingEl(anchor);
      if (!target) {
        frame = requestAnimationFrame(tick);
        return;
      }

      // Считаем через прямоугольники, а не offsetTop: у .code-block стоит
      // position: relative, поэтому offsetParent по странице неоднороден.
      const delta = target.getBoundingClientRect().top - el.getBoundingClientRect().top;
      const max = Math.max(0, el.scrollHeight - el.clientHeight);
      const next = Math.max(0, Math.min(el.scrollTop + delta - RESTORE_OFFSET, max));

      if (Math.abs(el.scrollTop - next) > 1) el.scrollTop = next;

      stable = Math.abs(next - lastTarget) <= 1 ? stable + 1 : 0;
      lastTarget = next;

      if (stable >= STABLE_FRAMES) {
        stop();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
  }

  /** Сначала по слагу, затем по тексту — на случай переименования заголовка. */
  private findHeadingEl(anchor: ReadingAnchor): HTMLElement | null {
    const items = this.headings();

    const bySlug = anchor.slug === null ? undefined : items.find((i) => i.slug === anchor.slug);
    if (bySlug) return bySlug.el;

    const wanted = anchor.heading?.toLowerCase();
    const byText = wanted ? items.find((i) => i.text.toLowerCase() === wanted) : undefined;
    return byText?.el ?? null;
  }
}
