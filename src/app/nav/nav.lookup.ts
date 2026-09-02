import { NAV_SECTIONS, NavChild, NavSection } from './nav.data';

/**
 * 'group' — второй уровень, у которого есть дети: роутер редиректит такой URL
 * на первого ребёнка, поэтому собственной страницей группа не является.
 */
export type NavMatchKind = 'section' | 'group' | 'leaf';

export interface NavMatch {
  readonly kind: NavMatchKind;
  readonly section: NavSection;
  /** Родитель третьего уровня, если он есть. */
  readonly group: NavChild | null;
  /** Конечная страница: второй уровень без детей либо третий уровень. */
  readonly child: NavChild | null;
  /** Канонический путь без ведущего слэша: 'javascript/functions/pure'. */
  readonly path: string;
  /** Человекочитаемое имя для интерфейса. */
  readonly label: string;
}

/** '/javascript/functions/pure?a=1#b' → ['javascript', 'functions', 'pure'] */
export function splitUrl(url: string): string[] {
  const clean = url.split('#')[0].split('?')[0];
  return clean.split('/').filter(Boolean);
}

/**
 * Разбирает URL по дереву NAV_SECTIONS. Единственное место, где живёт эта
 * логика: до появления функции она была продублирована в сайдбаре и в
 * SectionPage. Возвращает null, если такого пути в навигации нет — это
 * важно для закладок, потому что катч-олл `{ path: '**' }` увёл бы битую
 * ссылку на корень молча.
 */
export function findNav(url: string): NavMatch | null {
  const segments = splitUrl(url);
  const section = NAV_SECTIONS.find((item) => item.id === segments[0]);
  if (!section) return null;

  const childId = segments[1];
  if (!childId) {
    return {
      kind: 'section',
      section,
      group: null,
      child: null,
      path: section.id,
      label: section.label,
    };
  }

  const child = section.children.find((item) => item.id === childId);
  if (!child) return null;

  const subId = segments[2];
  if (subId) {
    const sub = child.children?.find((item) => item.id === subId);
    if (!sub) return null;
    return {
      kind: 'leaf',
      section,
      group: child,
      child: sub,
      path: `${section.id}/${child.id}/${sub.id}`,
      label: sub.label,
    };
  }

  const isGroup = Boolean(child.children?.length);
  return {
    kind: isGroup ? 'group' : 'leaf',
    section,
    group: isGroup ? child : null,
    child: isGroup ? null : child,
    path: `${section.id}/${child.id}`,
    label: child.label,
  };
}
