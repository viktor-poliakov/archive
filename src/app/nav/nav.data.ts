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
      { id: 'types', label: 'Типы' },
      {
        id: 'operators',
        label: 'Операторы и приведение типов',
        children: [
          { id: 'arithmetic', label: 'Арифметические операторы' },
          { id: 'comparison', label: 'Сравнение' },
          { id: 'logical', label: 'Логические и условные' },
          { id: 'coercion', label: 'Приведение типов' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
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
        id: 'classes',
        label: 'Классы',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'static-private', label: 'Статика и приватность' },
          { id: 'inheritance', label: 'Наследование' },
          { id: 'under-the-hood', label: 'Под капотом и нюансы' },
        ],
      },
      {
        id: 'prototypes',
        label: 'proto и prototype',
        children: [
          { id: 'basics', label: 'Что такое прототип' },
          { id: 'proto-vs-prototype', label: '__proto__ vs prototype' },
          { id: 'constructors', label: 'Оператор new и конструкторы' },
          { id: 'chain', label: 'Цепочка и практика' },
        ],
      },
      {
        id: 'modules',
        label: 'Модули (ES Modules)',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'export', label: 'Экспорт' },
          { id: 'import', label: 'Импорт' },
          { id: 'dynamic', label: 'Динамический импорт' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'numbers',
        label: 'Числа и Math',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'methods', label: 'Методы и преобразование' },
          { id: 'math', label: 'Объект Math' },
          { id: 'precision', label: 'Точность и большие числа' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'strings',
        label: 'Строки',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'templates', label: 'Шаблонные строки' },
          { id: 'methods', label: 'Методы работы со строками' },
          { id: 'unicode', label: 'Юникод и кодирование' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'regex',
        label: 'Регулярные выражения',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'char-classes', label: 'Классы символов и якоря' },
          { id: 'quantifiers', label: 'Кванторы и жадность' },
          { id: 'groups', label: 'Группы и альтернация' },
          { id: 'methods', label: 'Методы' },
          { id: 'practical', label: 'Практика и подводные камни' },
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
        id: 'collections',
        label: 'Коллекции',
        children: [
          { id: 'map-set', label: 'Map и Set' },
          { id: 'weak', label: 'WeakMap и WeakSet' },
        ],
      },
      {
        id: 'iterators',
        label: 'Итераторы и генераторы',
        children: [
          { id: 'protocol', label: 'Протокол итерации' },
          { id: 'for-of', label: 'for...of и потребители' },
          { id: 'custom', label: 'Свой итератор' },
          { id: 'generators', label: 'Генераторы' },
          { id: 'techniques', label: 'Приёмы генераторов' },
          { id: 'practical', label: 'Практика и async-итераторы' },
        ],
      },
      {
        id: 'errors',
        label: 'Обработка ошибок',
        children: [
          { id: 'try-catch', label: 'try / catch / finally' },
          { id: 'throw', label: 'Оператор throw' },
          { id: 'error-object', label: 'Объект Error и типы' },
          { id: 'custom', label: 'Свои классы ошибок' },
          { id: 'propagation', label: 'Всплытие по стеку' },
          { id: 'pitfalls', label: 'Нюансы и подводные камни' },
        ],
      },
      {
        id: 'promises',
        label: 'Промисы',
        children: [
          { id: 'basics', label: 'Что такое промис' },
          { id: 'then-catch-finally', label: 'then, catch, finally' },
          { id: 'chaining', label: 'Цепочки' },
          { id: 'error-handling', label: 'Обработка ошибок' },
          { id: 'static-methods', label: 'Статические методы' },
          { id: 'async-await', label: 'async/await' },
          { id: 'creating', label: 'Создание и промисификация' },
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
      {
        id: 'rest-api',
        label: 'REST API',
        children: [
          { id: 'basics', label: 'Что такое REST' },
          { id: 'http', label: 'HTTP: запрос и ответ' },
          { id: 'methods', label: 'HTTP-методы' },
          { id: 'status-codes', label: 'Коды состояния' },
          { id: 'headers', label: 'Заголовки и форматы' },
          { id: 'fetch', label: 'Fetch API на практике' },
          { id: 'query-params', label: 'Query-параметры' },
          { id: 'files', label: 'Файлы и бинарные данные' },
          { id: 'cancellation', label: 'Отмена запроса' },
          { id: 'auth', label: 'Аутентификация' },
          { id: 'errors', label: 'Обработка ошибок' },
          { id: 'pitfalls', label: 'Проектирование и нюансы' },
        ],
      },
      {
        id: 'dates',
        label: 'Даты',
        children: [
          { id: 'basics', label: 'Основы' },
          { id: 'format', label: 'Форматирование и парсинг' },
          { id: 'pitfalls', label: 'Вычисления и подводные камни' },
          { id: 'temporal', label: 'Temporal API' },
        ],
      },
      {
        id: 'garbage-collection',
        label: 'Сборщик мусора',
        children: [
          { id: 'how-it-works', label: 'Как это работает' },
          { id: 'leaks', label: 'Утечки памяти' },
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
