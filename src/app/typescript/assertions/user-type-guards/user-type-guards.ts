import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-user-type-guards',
  imports: [CodeBlock, RouterLink],
  templateUrl: './user-type-guards.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsUserTypeGuards {
  protected readonly builtinsNotEnough = `// typeof и instanceof отлично различают ПРОСТЫЕ случаи.
declare function getSomething(): unknown;
const x: unknown = getSomething();

if (typeof x === 'string') {
  x.toUpperCase(); // ✅ x: string — сработал typeof
}

if (x instanceof Date) {
  x.getFullYear(); // ✅ x: Date — сработал instanceof
}

// Но как проверить, что x — это ОБЪЕКТ нужной ФОРМЫ?
//   { id: number; name: string } — это не класс, instanceof тут бессилен.
//   typeof вернёт лишь 'object' — слишком грубо, самой формы он не видит.
// А как выбрать один член объединения { kind: 'cat' } | { kind: 'dog' }?
// Для таких проверок встроенных операторов НЕ ХВАТАЕТ — нужен свой guard.`;

  protected readonly guardSyntax = `// Пользовательский type guard — это ОБЫЧНАЯ функция,
// но с особым возвращаемым типом: "v is string".
function isString(v: unknown): v is string {
  return typeof v === 'string';
}

// Разбор записи по частям:
//   v           — имя параметра, О КОТОРОМ мы делаем утверждение.
//   : unknown   — что функция ПРИНИМАЕТ на вход (здесь — что угодно).
//   : v is string — ТИП-ПРЕДИКАТ (type predicate). Читается так:
//                 «если функция вернула true, то v — это string».
//                 Это обещание, которое функция даёт компилятору.
//   return ...  — ТЕЛО: настоящая проверка. Должна вернуть boolean:
//                 true — значит "да, это string", false — "нет".`;

  protected readonly narrowingExample = `function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function printValue(v: unknown) {
  // ДО проверки компилятор про v не знает НИЧЕГО:
  // v.length; // ❌ 'v' is of type 'unknown'.

  if (isString(v)) {
    // TS ПОВЕРИЛ предикату и сузил тип прямо в этой ветке:
    console.log(v.length);        // ✅ здесь v: string
    console.log(v.toUpperCase()); // ✅ строковые методы доступны
  } else {
    // В ветке else TS вычёл string из типа:
    console.log(v);               // здесь v: unknown, но уже НЕ string
  }
}`;

  protected readonly isUserGuard = `interface User {
  id: number;
  name: string;
}

// Проверяем ФОРМУ объекта по шагам — от грубого к точному:
function isUser(v: unknown): v is User {
  return (
    typeof v === 'object' &&      // 1) это объект,
    v !== null &&                 // 2) и не null (внимание: typeof null === 'object'!),
    'id' in v &&                  // 3) есть поле id,
    'name' in v &&                // 4) есть поле name,
    typeof (v as User).id === 'number' &&    // 5) id — число,
    typeof (v as User).name === 'string'     // 6) name — строка.
  );
}

// Типичное применение — данные из сети (их форму TS знать не может):
const data: unknown = await fetch('/api/me').then((r) => r.json());

if (isUser(data)) {
  console.log(data.name.toUpperCase()); // ✅ здесь data: User — безопасно
} else {
  console.warn('сервер прислал не User'); // форма не совпала — не доверяем
}`;

  protected readonly isCatUnion = `// Объединение с общим полем-дискриминатором kind:
interface Cat {
  kind: 'cat';
  meow: () => void;
}
interface Dog {
  kind: 'dog';
  bark: () => void;
}
type Animal = Cat | Dog;

// Guard выбирает ОДИН член объединения по значению дискриминатора:
function isCat(a: Animal): a is Cat {
  return a.kind === 'cat';
}

function speak(a: Animal) {
  if (isCat(a)) {
    a.meow(); // ✅ здесь a: Cat — доступен meow
  } else {
    a.bark(); // ✅ TS понял: раз не Cat, значит Dog — доступен bark
  }
}`;

  protected readonly isDefinedFilter = `// Задача: из массива с «дырками» получить массив без null/undefined.
const raw: (string | null)[] = ['a', null, 'b', null, 'c'];

// Если функция-фильтр возвращает ПРОСТО boolean, тип элементов НЕ сужается —
// TS всё ещё видит (string | null)[]:
function keepNotNull(s: string | null): boolean {
  return s !== null;
}
const bad = raw.filter(keepNotNull);
// bad: (string | null)[]  ❌ в глазах типов null никуда не делся

// А guard-предикат СУЖАЕТ тип элементов массива:
function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

const good = raw.filter(isDefined);
// good: string[]  ✅ null и undefined отфильтрованы И на уровне типов
good.forEach((s) => s.toUpperCase()); // ✅ каждый s точно string`;

  protected readonly lyingGuard = `// ⚠️ ОПАСНО: предикат — это ОБЕЩАНИЕ. TS НЕ сверяет его с телом функции.
function isString(v: unknown): v is string {
  return typeof v === 'number'; // ❌ проверяем ЧИСЛО, а обещаем строку!
}
// Компилятор НЕ ругается — он верит предикату "v is string" на слово.

const v: unknown = 42;
if (isString(v)) {
  // TS уверен, что здесь v: string. Но на самом деле v === 42 (число)!
  v.toUpperCase();
  // ❌ TypeError: v.toUpperCase is not a function — падение уже в РАНТАЙМЕ.
}
// Мораль: за правильность ТЕЛА отвечаете ВЫ. Соврал guard — обманут весь код.`;

  protected readonly booleanVsPredicate = `const v: unknown = 'привет';

// 1) Обычная функция, возвращает boolean (БЕЗ предиката):
function isStrPlain(x: unknown): boolean {
  return typeof x === 'string';
}
if (isStrPlain(v)) {
  v.toUpperCase();
  // ❌ 'v' is of type 'unknown'. Проверка прошла, но ТИП не сузился:
  //    boolean ничего не сообщает компилятору про v.
}

// 2) Та же самая проверка, но с предикатом "x is string":
function isStr(x: unknown): x is string {
  return typeof x === 'string';
}
if (isStr(v)) {
  v.toUpperCase(); // ✅ здесь v: string — предикат сузил тип
}
// return в обеих функциях ОДИНАКОВЫЙ. Разница только в возвращаемом типе —
// и именно она включает (или не включает) сужение.`;
}
