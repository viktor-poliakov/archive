export interface NavChild {
  id: string;
  label: string;
  /** Optional third-level items shown nested under this child in the sidebar. */
  children?: NavChild[];
}

export interface NavSection {
  id: string;
  label: string;
  /** Single-glyph badge shown when the sidebar is collapsed. */
  short: string;
  /** Accent color (Dracula palette) used for the section. */
  color: string;
  children: NavChild[];
}

/**
 * Single source of truth for the left menu.
 * Routes (see app.routes.ts) and the sidebar are both generated from this list,
 * so adding a section here automatically wires up its route and submenu.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    short: 'JS',
    color: '#f1fa8c',
    children: [
      { id: 'variables', label: 'Переменные' },
      { id: 'hoisting', label: 'Hoisting' },
      {
        id: 'functions',
        label: 'Функции',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'declarations', label: 'Объявление' },
          { id: 'parameters', label: 'Параметры и возврат' },
          { id: 'first-class', label: 'Функции как значения' },
          { id: 'properties', label: 'Свойства функции' },
          { id: 'this', label: 'Контекст this' },
          { id: 'pure', label: 'Чистые функции' },
          { id: 'pitfalls', label: 'Нюансы и паттерны' },
        ],
      },
      {
        id: 'closures',
        label: 'Замыкания',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'lexical-environment', label: 'Лексическое окружение' },
          { id: 'practical', label: 'Практическое применение' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'objects',
        label: 'Объекты',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'methods', label: 'Методы' },
          { id: 'iteration', label: 'Перебор свойств' },
          { id: 'references', label: 'Копирование и ссылки' },
          { id: 'destructuring', label: 'Деструктуризация' },
          { id: 'prototypes', label: 'Прототипы и наследование' },
          { id: 'pitfalls', label: 'Нюансы и паттерны' },
        ],
      },
      {
        id: 'context',
        label: 'Контекст',
        children: [
          { id: 'basics', label: 'Что такое this' },
          { id: 'binding-rules', label: 'Правила и приоритет' },
          { id: 'default-binding', label: 'Привязка по умолчанию' },
          { id: 'losing-context', label: 'Потеря контекста' },
          { id: 'call-apply-bind', label: 'call, apply, bind' },
          { id: 'arrow', label: 'Стрелочные функции' },
          { id: 'classes-new', label: 'this в классах и new' },
        ],
      },
      {
        id: 'arrays',
        label: 'Массивы',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'add-remove', label: 'Добавление и удаление' },
          { id: 'iteration', label: 'Перебор' },
          { id: 'search', label: 'Поиск' },
          { id: 'transform', label: 'Преобразование' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'event-loop',
        label: 'Event Loop',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'macro-micro', label: 'Макро- и микрозадачи' },
          { id: 'rendering', label: 'Отрисовка и rAF' },
          { id: 'pitfalls', label: 'Подводные камни' },
        ],
      },
      {
        id: 'events',
        label: 'События',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'propagation', label: 'Погружение, цель, всплытие' },
          { id: 'target', label: 'target и currentTarget' },
          { id: 'delegation', label: 'Делегирование' },
          { id: 'custom-events', label: 'Свои события' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
    ],
  },
  {
    id: 'react',
    label: 'React',
    short: 'R',
    color: '#8be9fd',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'hooks', label: 'Hooks' },
      { id: 'components', label: 'Components' },
      { id: 'state', label: 'State management' },
    ],
  },
  {
    id: 'angular',
    label: 'Angular',
    short: 'A',
    color: '#ff5555',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'signals', label: 'Signals' },
      { id: 'components', label: 'Components' },
      { id: 'routing', label: 'Routing' },
    ],
  },
  {
    id: 'vue',
    label: 'Vue',
    short: 'V',
    color: '#50fa7b',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'composition', label: 'Composition API' },
      { id: 'components', label: 'Components' },
      { id: 'pinia', label: 'Pinia' },
    ],
  },
  {
    id: 'pattern',
    label: 'Pattern',
    short: 'P',
    color: '#bd93f9',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'creational', label: 'Creational' },
      { id: 'structural', label: 'Structural' },
      { id: 'behavioral', label: 'Behavioral' },
    ],
  },
] as const;
