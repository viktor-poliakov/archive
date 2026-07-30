import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-template-literals',
  imports: [CodeBlock, RouterLink],
  templateUrl: './template-literals.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesTemplateLiterals {
  protected readonly runtimeVsType = `// В РАНТАЙМЕ (мир значений) шаблонная строка склеивает ЗНАЧЕНИЯ:
const city = 'Париж';
const label = \`Город: \${city}\`; // значение: 'Город: Париж'

// Шаблонный литеральный ТИП живёт в МИРЕ ТИПОВ (этап компиляции)
// и склеивает не значения, а ТИПЫ — он задаёт ФОРМУ строки:
type CityLabel = \`Город: \${string}\`;

// CityLabel — это не одна строка, а МНОЖЕСТВО всех строк такой формы:
// 'Город: Париж', 'Город: Рим', 'Город: ' — что угодно после 'Город: '.
// В рантайме этого типа НЕТ: он существует только для проверок компилятора.`;

  protected readonly greetingPattern = `// Тип-ТРАФАРЕТ: строка начинается с 'Hello, ', а дальше — ЛЮБОЙ текст.
type Greeting = \`Hello, \${string}\`;

// Проверка «подходит ли строка под трафарет» идёт на КОМПИЛЯЦИИ:
const a: Greeting = 'Hello, world'; // ✅ форма совпала
const b: Greeting = 'Hello, Аня';   // ✅ после запятой может стоять что угодно
const c: Greeting = 'Hi';           // ❌ форма не та:
// Type '"Hi"' is not assignable to type '\`Hello, \${string}\`'.`;

  protected readonly cartesian = `// Если в «окно» \${...} подставить ОБЪЕДИНЕНИЕ, TypeScript переберёт
// ВСЕ комбинации — как таблица умножения (декартово произведение).
type Cell = \`\${'a' | 'b'}-\${'1' | '2'}\`;
// = 'a-1' | 'a-2' | 'b-1' | 'b-2'   (2 × 2 = 4 варианта)

// Два окна по 2 значения дают 2 × 2 = 4 строки. Три по 3 дали бы уже 27 —
// комбинации растут очень быстро, поэтому подставляйте небольшие объединения.`;

  protected readonly caseUtils = `// Встроенные утилиты меняют РЕГИСТР в литеральном типе-строке.
// Это операции над ТИПАМИ — в рантайме их не существует.
type A = Uppercase<'abc'>;      // = 'ABC'   — всё в ВЕРХНИЙ регистр
type B = Lowercase<'ABC'>;      // = 'abc'   — всё в нижний
type C = Capitalize<'hello'>;   // = 'Hello' — первая буква заглавная
type D = Uncapitalize<'Hello'>; // = 'hello' — первая буква строчная`;

  protected readonly eventNames = `// Практика: из имён действий получаем имена обработчиков событий.
// Capitalize раздаётся ПО ОБЪЕДИНЕНИЮ (применяется к каждому члену отдельно):
type Events = \`on\${Capitalize<'click' | 'hover'>}\`;
// шаг 1: Capitalize<'click' | 'hover'>  →  'Click' | 'Hover'
// шаг 2: подставляем в трафарет 'on...'  →  'onClick' | 'onHover'`;

  protected readonly endpoints = `// Типобезопасные HTTP-эндпоинты: метод + путь. Снова декартово произведение.
type Method = 'GET' | 'POST';
type Path = '/users' | '/posts';
type Endpoint = \`\${Method} \${Path}\`;
// = 'GET /users' | 'GET /posts' | 'POST /users' | 'POST /posts'  (2 × 2 = 4)

const ok: Endpoint = 'GET /users';   // ✅ такая комбинация есть в типе
const bad: Endpoint = 'GET /orders'; // ❌ такой комбинации в типе нет:
// Type '"GET /orders"' is not assignable to type 'Endpoint'.`;

  protected readonly cssVars = `// Типобезопасные имена CSS-переменных из набора размеров.
type Size = 'sm' | 'md' | 'lg';
type SizeVar = \`--size-\${Size}\`;
// = '--size-sm' | '--size-md' | '--size-lg'   (3 варианта)

function setSize(name: SizeVar, value: string) { /* ... */ }
setSize('--size-md', '16px'); // ✅ имя из разрешённого набора
setSize('--size-xl', '20px'); // ❌ 'xl' нет среди Size:
// Argument of type '"--size-xl"' is not assignable to parameter of type 'SizeVar'.`;

  protected readonly getterOne = `// Шаблон можно применить к ПАРАМЕТРУ типа. Соберём имя геттера из ключа:
type Getter<K extends string> = \`get\${Capitalize<K>}\`;

type G1 = Getter<'name'>; // Capitalize<'name'> = 'Name'  →  'getName'
type G2 = Getter<'age'>;  // Capitalize<'age'>  = 'Age'   →  'getAge'`;

  protected readonly gettersMapped = `// Мостик к отображённым (mapped) типам: пройдёмся по ВСЕМ ключам объекта
// и ПЕРЕИМЕНУЕМ их через as, склеив новое имя шаблонным типом.
interface User {
  name: string;
  age: number;
}

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// = {
//     getName: () => string;
//     getAge: () => number;
//   }
// K сузили как (string & K): ключ бывает number | symbol, а Capitalize
// принимает только строку — пересечение оставляет от ключа строковую часть.`;
}
