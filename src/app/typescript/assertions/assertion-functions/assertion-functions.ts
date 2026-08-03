import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-assertion-functions',
  imports: [CodeBlock, RouterLink],
  templateUrl: './assertion-functions.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsAssertionFunctions {
  protected readonly painRepeatedChecks = `// Достали элемент со страницы. Его тип — HTMLElement | null:
// getElementById честно предупреждает, что элемента может и не быть.
const input = document.getElementById('email'); // HTMLElement | null

// Мы-то знаем, что элемент точно есть. Но компилятор — нет,
// поэтому заставляет проверять на null ПЕРЕД КАЖДЫМ обращением:
if (input) input.classList.add('active'); // проверка №1
// ...десятки строк спустя...
if (input) input.textContent = 'Привет';  // проверка №2 — снова то же самое!
// ...и так на каждое обращение к input.

// Хочется по-другому: проверить ОДИН раз в начале — и дальше
// пользоваться input без null, как будто его уже «пропустили внутрь».`;

  protected readonly assertSyntax1 = `// Assertion-функция. Ключевое: она НЕ возвращает true/false.
// Она БРОСАЕТ исключение, если условие ложно. А если НЕ бросила
// (вернулась молча) — компилятор считает условие выполненным.
// Вся магия — в типе-аннотации после скобок: «asserts condition».
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Проверка не прошла');
  }
}

const input = document.getElementById('email'); // HTMLElement | null

assert(input !== null, 'Поле email не найдено на странице');

// Строка выше не бросила исключение → TS делает вывод:
// раз мы дошли сюда, значит input !== null. Ниже input уже сужен.
input.classList.add('active'); // ✅ input: HTMLElement, без | null
input.textContent = 'Привет';  // ✅ и здесь тоже — проверок больше не нужно`;

  protected readonly assertSyntax2 = `// Второй вид записи: «asserts v is Type».
// Утверждает не абстрактное условие, а КОНКРЕТНЫЙ тип переменной.
function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== 'string') {
    throw new Error('Ожидалась строка, а пришло: ' + typeof v);
  }
}

function shout(raw: unknown): string {
  assertIsString(raw);
  // После вызова raw имеет тип string во ВСЁМ остальном теле функции —
  // не только внутри какого-то if, а до самого конца.
  return raw.toUpperCase() + '!'; // ✅ строковые методы доступны
}`;

  protected readonly guardVsAssert = `// Одна и та же проверка «это строка?» двумя способами.
// Разница — в ОБЛАСТИ, где действует сужение.

// 1) Type guard: ВОЗВРАЩАЕТ boolean. Сужает ТОЛЬКО внутри if.
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function withGuard(v: unknown) {
  if (isString(v)) {
    v.toUpperCase(); // ✅ здесь, ВНУТРИ if, v — это string
  }
  v.toUpperCase();
  // ❌ 'v' is of type 'unknown'.
  //    Снаружи if сужение уже НЕ действует — снова unknown.
}

// 2) Assertion-функция: БРОСАЕТ. Сужает ВЕСЬ код НИЖЕ вызова.
function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== 'string') throw new Error('not a string');
}
function withAssert(v: unknown) {
  assertIsString(v);
  v.toUpperCase(); // ✅ и тут, и во всех строках ниже v — string
  v.trim();        // ✅ никакого if не нужно
}`;

  protected readonly practiceApi = `// Практика: проверяем «форму» ответа сервера ОДИН раз — дальше спокойно.
interface User {
  id: number;
  name: string;
}

// Assert-функция проверяет в РАНТАЙМЕ, что unknown действительно похож на User.
function assertIsUser(data: unknown): asserts data is User {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as Record<string, unknown>).id !== 'number' ||
    typeof (data as Record<string, unknown>).name !== 'string'
  ) {
    throw new Error('Ответ сервера не похож на User');
  }
}

async function loadUser(id: number): Promise<User> {
  const res = await fetch('/api/users/' + id);
  const data: unknown = await res.json(); // json() отдаёт непроверенные данные

  assertIsUser(data);
  // Ниже data: User — это ПРОВЕРЕНО в рантайме, а не «на честном слове».
  // Сравните с приведением as: as ничего не проверяет и в рантайме молчит.
  return data;
}`;

  protected readonly assertNever = `// Родственный приём — проверка «сюда попасть невозможно».
// Тип never означает «значений не бывает» (см. страницу про never).
// Такая функция ловит забытую ветку исчерпывающего switch.
function assertNever(value: never): never {
  throw new Error('Необработанный случай: ' + JSON.stringify(value));
}

type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.r ** 2;
    case 'square':
      return shape.side ** 2;
    default:
      // Пока все case разобраны, сюда shape приходит как never — всё ок.
      // Добавят новый вид фигуры и забудут case — здесь будет ОШИБКА
      // компиляции: shape уже не never. Забыть ветку не получится.
      return assertNever(shape);
  }
}`;

  protected readonly mustAnnotate = `// НЮАНС 1: аннотацию «: asserts ...» нельзя опустить.
// Без неё TS видит ОБЫЧНУЮ функцию и не сужает ничего.

// ❌ Забыли ": asserts condition" — это просто функция, бросающая ошибку:
function assertLoose(condition: unknown) {
  if (!condition) throw new Error('fail');
}
function a(v: string | null) {
  assertLoose(v !== null);
  v.toUpperCase();
  // ❌ 'v' is possibly 'null'.
  //    Сужения нет — компилятор не знает, что это assert.
}

// ✅ С аннотацией всё работает — она и делает функцию «утверждающей»:
function assert(condition: unknown): asserts condition {
  if (!condition) throw new Error('fail');
}
function b(v: string | null) {
  assert(v !== null);
  v.toUpperCase(); // ✅ v: string
}`;

  protected readonly constAnnotation = `// НЮАНС 2: если assert-функцию присвоить переменной (const assert = ...),
// нужна ЯВНАЯ аннотация ТИПА переменной — иначе TS откажется сужать.

// ❌ У переменной нет аннотации типа — только тело стрелки:
const assertLoose = (condition: unknown): asserts condition => {
  if (!condition) throw new Error('fail');
};
function bad(v: string | null) {
  assertLoose(v !== null);
  // ❌ Assertions require every name in the call target to be declared
  //    with an explicit type annotation.
  v.toUpperCase();
}

// ✅ Пишем тип переменной ЯВНО — и всё встаёт на место:
const assert: (condition: unknown) => asserts condition = (condition) => {
  if (!condition) throw new Error('fail');
};
function good(v: string | null) {
  assert(v !== null);
  v.toUpperCase(); // ✅ v: string
}`;

  protected readonly nodeAssert = `// Связь с Node.js: встроенный модуль node:assert устроен похоже —
// его типы тоже размечены как assertion-функция.
import assert from 'node:assert';

function readPort(raw: string): number {
  const port = Number(raw);
  assert(!Number.isNaN(port), 'PORT должен быть числом');
  // Ниже TS считает условие выполненным — assert размечен как asserts.
  // Плюс в рантайме Node сам бросит AssertionError, если что не так.
  return port;
}`;
}
