import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-void-never',
  imports: [CodeBlock, RouterLink],
  templateUrl: './void-never.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesVoidNever {
  protected readonly voidBasicExample = `// Функция ничего осмысленного не возвращает — её тип возврата void
function logMessage(text: string): void {
  console.log(text);
  // здесь нет return со значением
}

// Аннотацию можно не писать — TypeScript выведет void сам:
function warn(text: string) {
  console.warn(text);
}
// тип warn выведен как: (text: string) => void

const result = logMessage("Привет");
// result имеет тип void — смотреть на него бессмысленно, там undefined`;

  protected readonly voidVsUndefinedExample = `// void — «результат не важен, не смотри на него»
function a(): void {
  // return можно не писать вовсе
}

// undefined — «я ОБЯЗАН вернуть значение, и это значение — undefined»
function b(): undefined {
  return undefined; // без return будет ошибка: функция обязана вернуть значение
}

// На переменных разница видна так:
let v: void = undefined;      // ✅ void спокойно принимает undefined
let u: undefined = undefined; // ✅

// Но осмысленное значение в void положить нельзя:
let x: void = 5; // ❌ Type 'number' is not assignable to type 'void'`;

  protected readonly voidCallbackExample = `// Тип колбэка говорит: «верни void» = «твой результат мне не нужен»
type Callback = (item: number) => void;

const numbers: number[] = [];

// Array.prototype.push возвращает number (новую длину массива),
// но forEach ждёт колбэк с типом возврата void — и это ОК:
[1, 2, 3].forEach((n) => numbers.push(n));
// ✅ возвращённое push число просто отбрасывается

// То же явно: функция, возвращающая number, подходит под тип «верни void»
const handler: Callback = (item) => item * 2;
// ✅ ошибки нет, хотя стрелка возвращает number`;

  protected readonly voidCallbackWrongExample = `type Callback = (item: number) => void;

const handler: Callback = (item) => item * 2;

// Правило работает только в одну сторону: снаружи результат считается void.
const value = handler(10);
// value имеет тип void — TypeScript «забыл», что внутри вернули number

const doubled = value * 2;
// ❌ значение типа void нельзя умножать
//    (An arithmetic operand must be of type 'number', ...)`;

  protected readonly neverThrowExample = `// Функция никогда не возвращает управление — всегда бросает исключение.
// Её тип возврата — never (не void: она вообще НЕ доходит до конца).
function fail(message: string): never {
  throw new Error(message);
}

function getName(user: { name?: string }): string {
  if (user.name) {
    return user.name;
  }
  fail("У пользователя нет имени");
  // return тут не нужен: TypeScript знает, что сюда исполнение не дойдёт
}`;

  protected readonly neverInfiniteExample = `// Бесконечный цикл — управление тоже никогда не вернётся: тип never
function startEventLoop(): never {
  while (true) {
    // обрабатываем очередь задач, выхода из функции нет
  }
}

// Сравните с void: такая функция завершается, просто без значения
function tick(): void {
  console.log("тик"); // выполнилась и вернула управление
}`;

  protected readonly neverNarrowingExample = `// never появляется сам, когда все варианты типа исчерпаны сужением
function handle(value: string | number) {
  if (typeof value === "string") {
    value; // здесь value: string
  } else if (typeof value === "number") {
    value; // здесь value: number
  } else {
    // string и number кончились — сюда попасть НЕВОЗМОЖНО
    value; // value: never
  }
}`;

  protected readonly exhaustiveGoodExample = `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default: {
      // Все варианты разобраны — сюда shape приходит как never.
      // Присваивание проходит: never присваивается любому never.
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}`;

  protected readonly exhaustiveBrokenExample = `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number }; // ← добавили вариант

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    // забыли обработать "triangle"!
    default: {
      const _exhaustive: never = shape;
      // ❌ Type '{ kind: "triangle"; ... }' is not assignable to type 'never'.
      //    Компилятор поймал незакрытый вариант ещё до запуска.
      return _exhaustive;
    }
  }
}`;

  protected readonly assertNeverExample = `// Удобно вынести проверку в отдельную функцию-помощник
function assertNever(value: never): never {
  throw new Error("Необработанный вариант: " + JSON.stringify(value));
}

type Status = "loading" | "success" | "error";

function render(status: Status): string {
  switch (status) {
    case "loading":
      return "Загрузка...";
    case "success":
      return "Готово";
    case "error":
      return "Ошибка";
    default:
      // Ловит и на этапе сборки (если добавили статус и забыли case),
      // и в рантайме (если пришло неожиданное значение).
      return assertNever(status);
  }
}`;

  protected readonly neverInUnionExample = `// never «исчезает» в объединении: он не добавляет ни одного значения
type A = string | never; // = string
type B = number | never; // = number

// never — нейтральный элемент для | (как 0 для сложения): T | never = T.
// Поэтому в exhaustiveness-проверке пустой остаток и превращается в never.

// А в пересечении never, наоборот, всё «поглощает»:
type C = string & never; // = never`;
}
