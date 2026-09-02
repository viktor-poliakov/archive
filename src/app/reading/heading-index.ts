/** Заголовки разделов и подразделов внутри статьи. */
export const HEADING_SELECTOR = '.doc h2, .doc h3';

export interface HeadingEntry {
  readonly slug: string;
  readonly text: string;
  readonly el: HTMLElement;
}

/**
 * Слаг из текста заголовка — юникодный, без транслитерации.
 *
 * Транслитерация отвергнута сознательно: это таблица на семь десятков записей
 * с неоднозначностями (щ, ъ, ь, ё, й), а любая её правка молча ломает все уже
 * сохранённые закладки. HTML5 разрешает в id любой символ, кроме пробела.
 *
 * NFC, а не NFKC: последний схлопывает № в «No» и ① в «1», то есть меняет текст.
 * Всё, что не буква и не цифра, схлопывается в дефис — так выпадают «», —, …,
 * →, ≠, ↔, № и эмодзи (⚠️ = U+26A0 + U+FE0F).
 *
 * ВНИМАНИЕ: алгоритм — часть контракта хранилища. Меняете его — поднимайте
 * версию ключей в reading-storage.ts, иначе старые закладки будут указывать
 * в пустоту.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Проходит по заголовкам статьи и проставляет им id. Контентные страницы
 * заголовкам id не задают (проверено: ни одного атрибута на 2575 заголовках),
 * поэтому конфликта нет, а сама операция идемпотентна — повторный проход
 * ничего не меняет.
 *
 * textContent сам декодирует HTML-сущности и вытягивает текст из вложенных
 * <code> и <em>, поэтому работать с сырой разметкой не нужно.
 */
export function collectHeadings(root: ParentNode): HeadingEntry[] {
  const used = new Map<string, number>();
  const entries: HeadingEntry[] = [];

  root.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((el, index) => {
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    const base = slugify(text) || `h-${index}`;

    // Дублей текста заголовка внутри страницы сейчас нет ни на одной из 319
    // страниц, но суффикс оставляем: иначе будущий дубль тихо съест чужой якорь.
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    const slug = seen === 0 ? base : `${base}-${seen + 1}`;

    if (!el.id) el.id = slug;
    entries.push({ slug, text, el });
  });

  return entries;
}
