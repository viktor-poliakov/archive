import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsPitfalls {
  protected readonly fewerParamsExample = `// map передаёт в колбэк ТРИ аргумента: элемент, его индекс и весь массив.
const nums = [10, 20, 30];
nums.map((value, index, array) => value + index + array.length); // можно взять все три

// Но обычно берут только первый — и это НЕ ошибка:
nums.map((value) => value * 2); // ✅ [20, 40, 60] — лишние аргументы просто отбрасываются

// Правило: функцию с МЕНЬШИМ числом параметров можно поставить туда,
// где ждут функцию с БОЛЬШИМ. Лишние аргументы вызывающий код передаст,
// а функция их проигнорирует.
type Handler = (a: number, b: number) => void;

const short = (a: number) => console.log(a);
const h: Handler = short; // ✅ short берёт меньше параметров — подходит
h(1, 2);                  // второй аргумент прилетит, но внутри не используется

// А наоборот нельзя — функция не может требовать БОЛЬШЕ, чем ей дадут:
const long = (a: number, b: number, c: number) => console.log(c);
const h2: Handler = long;
// ❌ Type '(a: number, b: number, c: number) => void' is not assignable to type 'Handler'.
//    Target signature provides too few arguments. Expected 3 or more, but got 2.`;

  protected readonly voidReturnExample = `// Если контекст ждёт функцию, возвращающую void, то фактически
// вернуть можно ЧТО УГОДНО — результат всё равно никто не использует.
type Log = (msg: string) => void;

const log: Log = (msg) => msg.length; // ✅ вернули number, хотя тип возврата — void
                                      //    значение просто отбрасывается

// Именно поэтому это классическое место работает без ошибок:
const out: number[] = [];
[1, 2, 3].forEach((n) => out.push(n)); // push возвращает number, а forEach ждёт void — ок`;

  protected readonly optionalVsUndefinedExample = `// ?: параметр можно ВООБЩЕ не передавать.
function greet(name?: string) {
  return \`Привет, \${name ?? 'гость'}!\`;
}
greet();       // ✅ можно вызвать без аргумента
greet('Аня');  // ✅ и с аргументом

// : T | undefined без ? — аргумент передать ОБЯЗАТЕЛЬНО (пусть даже undefined).
function greet2(name: string | undefined) {
  return \`Привет, \${name ?? 'гость'}!\`;
}
greet2();          // ❌ Expected 1 arguments, but got 0.
greet2(undefined); // ✅ приходится осознанно передать «пусто»
greet2('Аня');     // ✅`;

  protected readonly strictFunctionTypesExample = `type MyEvent = { type: string };
type MyClick = { type: string; x: number; y: number }; // подтип: есть ещё x и y

// Небезопасная подстановка: функция лезет в x/y, но её ставят туда,
// где могут прислать любой MyEvent — БЕЗ полей x и y.

// (1) Записано как ПОЛЕ-функция — strictFunctionTypes проверяет строго и ловит ошибку:
type FieldHandler = (e: MyEvent) => void;
const fieldFn: FieldHandler = (e: MyClick) => e.x + e.y;
// ❌ Type '(e: MyClick) => number' is not assignable to type 'FieldHandler'.
//    Types of parameters 'e' and 'e' are incompatible.
//    Property 'x' is missing in type 'MyEvent' but required in type 'MyClick'.

// (2) Записано как МЕТОД — та же подстановка МОЛЧА проходит (бивариантность, «дырка»):
interface MethodHandler {
  on(e: MyEvent): void; // синтаксис метода: on(...)
}
const obj: MethodHandler = {
  on: (e: MyClick) => e.x + e.y, // ✅ ошибки нет — параметры метода проверяются мягко
};`;

  protected readonly functionTypeExample = `// Тип Function — это фактически «any для функций»: его можно вызвать
// с любыми аргументами, а результат имеет тип any. Никаких проверок.
function invoke(fn: Function) {
  return fn(1, 'два', true); // аргументы не проверяются, вернётся any
}
invoke(Math.max);         // компилятор молчит...
invoke((x: number) => x); // ...и здесь тоже, хотя аргументы не совпадают

// Точная сигнатура ловит ошибки и сохраняет типы:
type NumFn = (x: number) => number;
function invoke2(fn: NumFn) {
  return fn(1); // ✅ TypeScript знает: аргумент — number, результат — number
}
invoke2(Math.abs);          // ✅ подходит по форме
invoke2((s: string) => 0);
// ❌ Argument of type '(s: string) => number' is not assignable to parameter of type 'NumFn'.
//    Types of parameters 's' and 'x' are incompatible.
//    Type 'number' is not assignable to type 'string'.`;

  protected readonly overloadsVsUnionExample = `// Перегрузки многословны: три строки сигнатур ради одной функции,
// и они легко расходятся с реализацией при правках.
function len(x: string): number;
function len(x: unknown[]): number;
function len(x: string | unknown[]): number {
  return x.length;
}

// Часто то же самое короче выражается ОБЪЕДИНЕНИЕМ:
function len2(x: string | unknown[]): number {
  return x.length;
}

// А связь «тип аргумента → тип результата» — ДЖЕНЕРИКОМ (в отличие от
// перегрузок он не теряет конкретный тип):
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2, 3]);  // number | undefined
const s = first(['a', 'b']); // string | undefined`;

  protected readonly implicitAnyExample = `// Параметр без аннотации — это неявный any. При noImplicitAny
// (входит в strict) это ошибка ещё до запуска:
function double(x) {
  return x * 2;
}
// ❌ Parameter 'x' implicitly has an 'any' type.

// Решение — аннотировать параметр:
function double2(x: number) {
  return x * 2; // ✅
}

// В КОЛБЭКАХ тип часто выводится из контекста — тогда аннотация не нужна:
[1, 2, 3].map((x) => x * 2); // ✅ x автоматически выведен как number`;

  protected readonly thisLossExample = `const counter = {
  count: 0,
  // Явно объявляем ожидаемый this — тогда TypeScript будет за ним следить.
  inc(this: { count: number }) {
    this.count++;
  },
};

counter.inc(); // ✅ вызвали через объект — this === counter

// Оторвали метод от объекта — this потерян:
const fn = counter.inc;
fn();
// ❌ The 'this' context of type 'void' is not assignable to
//    method's 'this' of type '{ count: number; }'.

// Решение 1 — стрелка, вызывающая метод через объект:
const safe = () => counter.inc();
safe(); // ✅ this === counter

// Решение 2 — bind жёстко привязывает this:
const bound = counter.inc.bind(counter);
bound(); // ✅ this зафиксирован на counter`;
}
