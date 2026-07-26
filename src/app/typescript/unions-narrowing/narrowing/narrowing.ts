import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-narrowing',
  imports: [CodeBlock, RouterLink],
  templateUrl: './narrowing.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingNarrowing {
  protected readonly unionMembers = `// У значения типа union доступны только ОБЩИЕ для всех членов свойства
function shout(id: string | number): string {
  // .toUpperCase() есть у string, но НЕ у number → у union его нет
  return id.toUpperCase();
  // ❌ Property 'toUpperCase' does not exist on type 'string | number'.
  //    Property 'toUpperCase' does not exist on type 'number'.
}

// .toString() есть и у строки, и у числа — общий член, его вызвать можно:
function asText(id: string | number): string {
  return id.toString(); // ✅ работает для любого значения из union
}`;

  protected readonly controlFlowNarrow = `function printId(id: string | number): void {
  if (typeof id === 'string') {
    // TS проследил проверку: в этой ветке id заведомо строка
    console.log(id.toUpperCase()); // ✅ id сужен до string
  } else {
    // сюда попадём, только если id НЕ строка → остаётся number
    console.log(id.toFixed(2));    // ✅ id сужен до number
  }
  // после if/else тип снова широкий: id: string | number
}`;

  protected readonly typeofNarrow = `type Value = string | number | boolean | undefined;

function describe(v: Value): string {
  if (typeof v === 'string')  return 'строка длиной ' + v.length;   // v: string
  if (typeof v === 'number')  return 'число ' + v.toFixed(2);       // v: number
  if (typeof v === 'boolean') return v ? 'включено' : 'выключено';  // v: boolean
  return 'значение не задано'; // сюда дойдёт только undefined → v: undefined
}`;

  protected readonly typeofNullPitfall = `// Подвох: typeof null === 'object' — историческая ошибка самого JavaScript!
function safeLength(x: string | null): number {
  if (typeof x === 'object') {
    // сюда попадёт именно null (а не строка) — TS сузит x до null
    return 0;
  }
  return x.length; // ✅ x здесь уже string
}

// Поэтому null удобнее отсеивать прямой проверкой, а не через typeof:
function safeLength2(x: string | null): number {
  if (x === null) return 0;
  return x.length; // ✅ x: string
}`;

  protected readonly truthiness = `// if (x) одним махом отсекает и null, и undefined, и другие falsy
function greet(name: string | null | undefined): string {
  if (name) {
    return 'Привет, ' + name.toUpperCase(); // ✅ name сужен до string
  }
  return 'Привет, гость';
}`;

  protected readonly truthinessPitfall = `// Ловушка: falsy-значения 0, '', NaN тоже «проваливают» проверку if (x)!
function render(count: number | undefined): string {
  if (count) {
    return 'повторов: ' + count;
  }
  return 'счётчик не задан';
  // ❗ count === 0 — валидное число, но улетит в ветку «не задан» по ошибке
}

// Правильно — сравнивать с undefined явно, тогда 0 обработается как число:
function renderSafe(count: number | undefined): string {
  if (count !== undefined) {
    return 'повторов: ' + count; // ✅ сюда дойдёт и 0
  }
  return 'счётчик не задан';
}`;

  protected readonly equalityNarrow = `type Status = 'idle' | 'loading' | 'done';

function label(status: Status | null): string {
  // !== null убирает null из union
  if (status !== null) {
    // здесь status: 'idle' | 'loading' | 'done'
    return status.toUpperCase(); // ✅
  }
  return 'статус не получен';
}

// Равенство сужает и ОБЕ переменные сразу, если сравнить их между собой:
function sameKind(a: string | number, b: string | boolean): void {
  if (a === b) {
    // общими могут быть только строки → и a, и b здесь сужены до string
    console.log(a.length, b.length); // ✅
  }
}`;

  protected readonly switchNarrow = `type Status = 'idle' | 'loading' | 'success' | 'error';

function color(status: Status): string {
  switch (status) {
    case 'idle':    return 'gray';
    case 'loading': return 'blue';
    case 'success': return 'green'; // здесь status сужен до 'success'
    case 'error':   return 'red';
  }
  // default не нужен: TS видит, что все варианты union разобраны
}`;

  protected readonly inNarrow = `// Разные варианты ответа API различаются набором свойств
type ApiSuccess = { ok: true; data: string[] };
type ApiError = { ok: false; message: string };
type ApiResponse = ApiSuccess | ApiError;

function handle(res: ApiResponse): void {
  // свойство data есть только у ApiSuccess
  if ('data' in res) {
    console.log('получено: ' + res.data.join(', ')); // ✅ res: ApiSuccess
  } else {
    console.error('ошибка: ' + res.message);          // ✅ res: ApiError
  }
}`;

  protected readonly instanceofNarrow = `// instanceof проверяет, каким классом создан объект
function toISO(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString(); // ✅ date сужен до Date
  }
  return date; // сюда дойдёт только string
}

// Работает и с вашими классами — с учётом иерархии наследования
class ValidationError extends Error {
  constructor(public field: string) {
    super('invalid');
  }
}

function report(err: Error): string {
  if (err instanceof ValidationError) {
    return 'Поле ' + err.field + ' заполнено неверно'; // ✅ err: ValidationError
  }
  return err.message; // обычный Error
}`;

  protected readonly arrayIsArray = `// Частый кейс: значение приходит либо как один элемент, либо как массив
function toArray(tags: string | string[]): string[] {
  if (Array.isArray(tags)) {
    return tags;   // ✅ tags сужен до string[]
  }
  return [tags];   // ✅ здесь tags — одиночная string
}

toArray('news');            // ['news']
toArray(['news', 'sport']); // ['news', 'sport']

// Почему не typeof? Массив — это объект, typeof [] === 'object',
// поэтому отличить его от объекта помогает именно Array.isArray.`;

  protected readonly assignmentNarrow = `let value: string | number;

value = 'hello';
value.toUpperCase(); // ✅ после присваивания строки value сужен до string

value = 42;
value.toFixed(2);    // ✅ теперь value сужен до number
value.toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'number'.

// TS помнит ОБЪЯВЛЕННЫЙ тип (string | number), но внутри потока
// отслеживает актуальный — по последнему присваиванию`;

  protected readonly earlyReturn = `type User = { name: string; email?: string };

declare function sendMail(to: string): void;

// Без early return — «лесенка» вложенных if, читать тяжело
function notifyBad(user: User | null): void {
  if (user) {
    if (user.email) {
      sendMail(user.email); // полезное действие спрятано вглубь
    }
  }
}

// С guard clause — отсекаем «плохие» случаи в начале, дальше линейный код
function notify(user: User | null): void {
  if (!user) return;        // после этого user сужен до User
  if (!user.email) return;  // а тут user.email сужен до string
  sendMail(user.email);     // ✅ плоский «счастливый путь», без вложенности
}`;

  protected readonly exhaustiveNever = `type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.r ** 2;
    case 'square': return shape.size ** 2;
    default: {
      // Сюда поток дойти не должен: все варианты уже разобраны.
      // shape здесь имеет тип never — «пустое множество».
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
// Добавите новый вид фигуры в Shape — и default перестанет
// присваиваться в never: компилятор напомнит дописать case. ✅`;

  protected readonly predicateBridge = `// typeof / in / instanceof не покрывают все проверки.
// Свою проверку можно «научить» сужать тип — функцией-предикатом (x is T):
function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.length > 0;
}

function handle(input: unknown): void {
  if (isNonEmptyString(input)) {
    console.log(input.trim()); // ✅ TS доверяет предикату: input сужен до string
  }
}`;
}
