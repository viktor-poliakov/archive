/**
 * Точка в тексте: страница плюс якорь заголовка. Одна и та же форма
 * используется и для «продолжить чтение», и для закладок.
 */
export interface ReadingAnchor {
  /** Канонический путь без ведущего слэша: 'javascript/functions/pure'. */
  readonly path: string;
  /** Слаг заголовка; null — начало страницы. */
  readonly slug: string | null;
  /**
   * Текст заголовка на момент сохранения. Показывается в интерфейсе и служит
   * запасным ключом, если слаг протух после переименования заголовка.
   */
  readonly heading: string | null;
  /**
   * Текст <h1 class="doc__title">. Хранится отдельно, потому что он часто
   * НЕ совпадает с label из навигации: nav «Чистые функции» против
   * заголовка «Чистые функции (pure functions)».
   */
  readonly title: string;
  /** Только id секции: цвет и подпись берём из NAV_SECTIONS при отрисовке,
   *  чтобы правка палитры доезжала и до старых записей. */
  readonly sectionId: string;
  readonly savedAt: number;
}

/** Устойчивый ключ записи: страница плюс якорь. */
export function anchorKey(anchor: ReadingAnchor): string {
  return `${anchor.path}#${anchor.slug ?? ''}`;
}
