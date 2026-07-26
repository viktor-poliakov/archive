import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-return-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './return-types.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsReturnTypes {
  protected readonly placementExample = `// Тип возврата пишут ПОСЛЕ круглых скобок с параметрами,
// через двоеточие — и уже перед телом в фигурных скобках.
function toNumber(s: string): number {
  return Number(s);
}
//                           ^^^^^^
//        тип возврата: функция обещает отдать наружу number

const n = toNumber('42'); // n: number — TypeScript знает результат

// Аннотацию можно и не писать — тип выведется из return сам:
function toNumber2(s: string) {
  return Number(s); // тип возврата выведен как number
}

// Обе записи дают один и тот же тип результата.
// Но явное : number (а) документирует намерение и
// (б) заставляет TS проверить ТЕЛО на соответствие обещанию.`;

  protected readonly catchBugExample = `// БЕЗ явного типа ошибка в теле остаётся незамеченной здесь:
// неверный тип «протекает» наружу и всплывает далеко от причины.
function area(r: number) {
  return String(Math.PI * r * r); // упс: вернули string вместо number
}

const a = area(2); // a выведен как string (а мы-то ждали число)
const total = a * 2;
// ❌ ошибка вылезет ЗДЕСЬ, в чужом месте, а не в area:
// The left-hand side of an arithmetic operation must be of type
// 'any', 'number', 'bigint' or an enum type.

// С явным : number TS ловит ту же ошибку В ИСТОЧНИКЕ — в теле:
function area2(r: number): number {
  return String(Math.PI * r * r);
  // ❌ Type 'string' is not assignable to type 'number'.
}`;

  protected readonly voidBasicExample = `// void — тип возврата функции, которая НЕ отдаёт полезного значения.
// Такая функция нужна ради действия (побочного эффекта), а не результата.
function logMsg(m: string): void {
  console.log('[log]', m);
  // здесь нет return со значением — просто выполнили действие
}

// Пустой return; (без значения) тоже допустим — для раннего выхода:
function warnIfEmpty(text: string): void {
  if (text === '') return; // выходим досрочно, ничего не возвращая
  console.warn('Непустой текст:', text);
}

const r = logMsg('привет'); // r: void
// Значение типа void бесполезно как данные: по сути это undefined,
// и использовать его в вычислениях нельзя.`;

  protected readonly voidCallbackExample = `const list: number[] = [];

// forEach ожидает колбэк, возвращающий void.
// Но Array.push возвращает number (новую длину массива) —
// и это ДОПУСТИМО: результат такого колбэка просто игнорируется.
[1, 2, 3].forEach((n) => list.push(n)); // OK, хотя push -> number

// Благодаря этому стрелку можно писать в одну строку,
// не оборачивая тело в { ... return; }.
// TypeScript намеренно разрешает «вернуть больше, чем просят»,
// когда в этом месте ждут именно void.`;

  protected readonly neverExample = `// never — функция НИКОГДА не возвращает управление вызвавшему коду.

// Вариант 1: всегда бросает исключение.
function fail(msg: string): never {
  throw new Error(msg);
  // строки после throw уже не выполнятся — возврата не происходит
}

// Вариант 2: бесконечный цикл, из которого нет выхода.
function loopForever(): never {
  while (true) {
    // ...работаем вечно, наружу не выходим
  }
}

// Сравните с void — эта функция ВОЗВРАЩАЕТ управление,
// просто без полезного значения:
function done(): void {
  // тело отработало и вернуло управление вызвавшему коду
}`;

  protected readonly asyncExample = `// async-функция ВСЕГДА возвращает Promise.
// Число из return автоматически оборачивается в Promise<number>.
async function load(): Promise<number> {
  return 42; // тип результата — Promise<number>, а не просто number
}

const p = load(); // p: Promise<number>

async function main() {
  const value = await load(); // value: number — await разворачивает Promise
  console.log(value);
}

// Если внутренний тип не совпал с обещанным — TS ругается:
async function loadWrong(): Promise<number> {
  return 'сорок два';
  // ❌ Type 'string' is not assignable to type 'number'.
}

// Асинхронная функция без полезного результата — это Promise<void>:
async function save(): Promise<void> {
  await Promise.resolve(); // поработали асинхронно, значения не отдаём
}`;

  protected readonly unionReturnExample = `interface User {
  id: number;
  name: string;
}

// Функция может вернуть ОБЪЕДИНЕНИЕ: либо User, либо null.
function findUser(id: number): User | null {
  if (id === 1) return { id: 1, name: 'Аня' };
  return null; // не нашли — честно возвращаем null
}

const u = findUser(1); // u: User | null

// Вызывающий ОБЯЗАН разобрать оба случая, иначе ошибка:
u.name; // ❌ 'u' is possibly 'null'.

if (u !== null) {
  u.name; // ✅ здесь тип сузился до User — обращаться безопасно
}

// Точно так же можно вернуть и объектный тип целиком:
function makePoint(x: number, y: number): { x: number; y: number } {
  return { x, y };
}`;

  protected readonly guardExample = `// Некоторые типы возврата описывают не «какое значение отдаём»,
// а ПРОВЕРКУ, которая влияет на типы во время выполнения.

// Предикат типа: возврат «x is string» сообщает компилятору,
// что при результате true аргумент — точно string.
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

// Сигнатура-утверждение: «asserts x is string» —
// если функция не бросила ошибку, дальше x считается string.
function assertString(x: unknown): asserts x is string {
  if (typeof x !== 'string') throw new Error('ожидалась строка');
}`;
}
