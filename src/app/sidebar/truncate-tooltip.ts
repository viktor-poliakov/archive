import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

/**
 * Показывает аккуратную всплывающую подсказку с полным текстом пункта меню —
 * но ТОЛЬКО когда текст реально обрезан троеточием (scrollWidth больше
 * clientWidth). Если текст помещается целиком, подсказка не появляется.
 *
 * Вешается на сам обрезаемый элемент (тот, у которого text-overflow: ellipsis).
 * Сама подсказка добавляется в <body>, чтобы её не обрезал overflow сайдбара,
 * и позиционируется справа от строки меню, по центру по вертикали.
 */
@Directive({
  selector: '[appTruncateTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '(click)': 'hide()',
  },
})
export class TruncateTooltip implements OnDestroy {
  /** Полный текст, который покажем в подсказке. */
  readonly text = input.required<string>({ alias: 'appTruncateTooltip' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private tip: HTMLElement | null = null;

  show(): void {
    if (this.tip || typeof document === 'undefined') {
      return;
    }

    const el = this.host.nativeElement;
    // Показываем только если содержимое действительно не помещается.
    if (el.scrollWidth - el.clientWidth <= 1) {
      return;
    }

    const tip = document.createElement('div');
    tip.className = 'nav-tooltip';
    tip.textContent = this.text();
    document.body.appendChild(tip);
    this.tip = tip;

    // Якорь позиционирования — вся строка меню, а не только текстовый span
    // (для строк-групп обрезается вложенный label, а встать нужно у края строки).
    const row = (el.closest('.submenu__item') ?? el).getBoundingClientRect();
    tip.style.top = `${row.top + row.height / 2}px`;
    tip.style.left = `${row.right + 10}px`;

    // Форсируем reflow, чтобы сработала transition (opacity 0 → 1), и сразу
    // показываем. Не используем requestAnimationFrame: в скрытой вкладке он
    // не срабатывает, и подсказка осталась бы невидимой.
    void tip.offsetWidth;
    tip.classList.add('nav-tooltip--visible');
  }

  hide(): void {
    this.tip?.remove();
    this.tip = null;
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
