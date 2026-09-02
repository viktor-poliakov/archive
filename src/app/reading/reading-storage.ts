import { findNav } from '../nav/nav.lookup';
import { ReadingAnchor } from './reading.types';

/**
 * Закладка ровно одна: новая перетирает старую. Версия — в суффиксе ключа:
 * изменили slugify — подняли v1 на v2, старая запись просто перестаёт
 * читаться, миграция не нужна.
 */
const BOOKMARK_KEY = 'archive:bookmark:v1';

function field(source: unknown, name: string): unknown {
  if (typeof source !== 'object' || source === null) return undefined;
  return (source as Record<string, unknown>)[name];
}

/**
 * Разбирает запись из хранилища. Кроме проверки типов делает главное:
 * убеждается, что путь до сих пор существует в навигации. Без этого битая
 * закладка молча уехала бы на корень через катч-олл `{ path: '**' }`.
 */
function parseAnchor(value: unknown): ReadingAnchor | null {
  const path = field(value, 'path');
  const title = field(value, 'title');
  const sectionId = field(value, 'sectionId');
  const savedAt = field(value, 'savedAt');
  const slug = field(value, 'slug');
  const heading = field(value, 'heading');

  if (typeof path !== 'string' || typeof title !== 'string') return null;
  if (typeof sectionId !== 'string' || typeof savedAt !== 'number') return null;
  if (slug !== null && typeof slug !== 'string') return null;
  if (heading !== null && typeof heading !== 'string') return null;

  const match = findNav(path);
  if (!match || match.kind === 'group') return null;

  return { path, slug, heading, title, sectionId, savedAt };
}

export function loadBookmark(): ReadingAnchor | null {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw === null ? null : parseAnchor(field(JSON.parse(raw), 'anchor'));
  } catch {
    // Испорченное руками значение не должно ронять приложение.
    return null;
  }
}

export function saveBookmark(anchor: ReadingAnchor | null): void {
  try {
    if (anchor === null) {
      localStorage.removeItem(BOOKMARK_KEY);
      return;
    }
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify({ v: 1, anchor }));
  } catch {
    // Приватный режим Safari бросает на setItem — работаем без сохранения.
  }
}
