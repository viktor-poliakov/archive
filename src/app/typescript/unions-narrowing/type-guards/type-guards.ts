import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-type-guards',
  imports: [CodeBlock, RouterLink],
  templateUrl: './type-guards.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingTypeGuards {
  protected readonly builtinNarrowing = `// Встроенные проверки TypeScript понимает "из коробки" и сужает тип прямо в ветке.

// typeof — для примитивов:
function printId(id: string | number): void {
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // ✅ здесь id сужен до string
  } else {
    console.log(id.toFixed(2));    // ✅ здесь id сужен до number
  }
}

// in — по наличию свойства:
type Admin = { role: 'admin'; permissions: string[] };
type Guest = { role: 'guest' };

function describe(user: Admin | Guest): void {
  if ('permissions' in user) {
    console.log(user.permissions.length); // ✅ user сужен до Admin
  }
}

// instanceof — по классу:
function logValue(value: Date | string): void {
  if (value instanceof Date) {
    console.log(value.toISOString()); // ✅ value сужен до Date
  }
}`;

  protected readonly boolNoNarrow = `type Cat = { kind: 'cat'; meow(): void };
type Dog = { kind: 'dog'; bark(): void };
type Animal = Cat | Dog;

// Сложную проверку вынесли в отдельную функцию — она возвращает обычный boolean
function isDog(animal: Animal): boolean {
  return animal.kind === 'dog';
}

function handle(animal: Animal): void {
  if (isDog(animal)) {
    // Мы-то знаем, что здесь собака. Но компилятор — нет:
    animal.bark();
    // ❌ Property 'bark' does not exist on type 'Animal'.
    //    Property 'bark' does not exist on type 'Cat'.
    // Тип так и остался Cat | Dog — обычный boolean НЕ сужает тип у вызывающего
  }
}`;

  protected readonly predicateGuard = `type Cat = { kind: 'cat'; meow(): void };
type Dog = { kind: 'dog'; bark(): void };
type Animal = Cat | Dog;

// Тот же код, но возвращаемый тип — ПРЕДИКАТ "animal is Dog"
function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog';
}

function handle(animal: Animal): void {
  if (isDog(animal)) {
    animal.bark(); // ✅ animal сужен до Dog — компилятор поверил "справке"
  } else {
    animal.meow(); // ✅ а в ветке else автоматически осталось Cat
  }
}`;

  protected readonly boolVsPredicate = `type Cat = { kind: 'cat'; meow(): void };
type Dog = { kind: 'dog'; bark(): void };
type Animal = Cat | Dog;

// Одно и то же тело, разница ТОЛЬКО в возвращаемом типе:

function looksLikeDog(a: Animal): boolean {
  return a.kind === 'dog';
}
// ↑ вернёт true/false, но для компилятора это просто "какой-то boolean"

function isDog(a: Animal): a is Dog {
  return a.kind === 'dog';
}
// ↑ вернёт то же true/false, НО ещё и сообщает компилятору: "если true — это Dog"

declare const pet: Animal;

if (looksLikeDog(pet)) {
  pet; // тип по-прежнему Cat | Dog — не сузился
}

if (isDog(pet)) {
  pet; // тип Dog — сузился ✅
}`;

  protected readonly isStringIsNumber = `// Крошечные переиспользуемые guard'ы удобно держать в utils.
// Параметр — unknown: такой guard принимает вообще что угодно и сужает результат.
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function format(value: unknown): string {
  if (isString(value)) {
    return value.trim();      // ✅ value: string
  }
  if (isNumber(value)) {
    return value.toFixed(2);  // ✅ value: number
  }
  return String(value);
}`;

  protected readonly objectShapeGuard = `// Реальный кейс: пришёл ответ от API — его тип unknown.
// Проверяем ФОРМУ объекта (нужные поля нужных типов) перед использованием.
type User = { id: number; name: string };

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as Record<string, unknown>)['id'] === 'number' &&
    'name' in data &&
    typeof (data as Record<string, unknown>)['name'] === 'string'
  );
}

const response: unknown = JSON.parse('{"id": 1, "name": "Anna"}');

if (isUser(response)) {
  console.log(response.name.toUpperCase()); // ✅ response: User
} else {
  console.log('Это не User — формат ответа не тот');
}`;

  protected readonly filterNarrow = `// Обычный filter НЕ меняет тип элементов массива:
const values: (string | null)[] = ['a', null, 'b', null, 'c'];

const bad = values.filter((x) => x !== null);
// тип bad: (string | null)[] — null убрали в рантайме, но тип остался прежним
bad.forEach((s) => s.toUpperCase());
// ❌ 's' is possibly 'null'.

// Стрелка с предикатом (x): x is string сужает тип результата:
const good = values.filter((x): x is string => x !== null);
// тип good: string[] ✅
good.forEach((s) => console.log(s.toUpperCase())); // ✅ s: string, ошибок нет`;

  protected readonly isPresentGuard = `// Универсальный guard "значение есть" (не null и не undefined) — частый инструмент.
function isPresent<T>(value: T | null | undefined): value is T {
  return value != null; // != (не !==) ловит СРАЗУ и null, и undefined
}

const ids: (number | undefined)[] = [1, undefined, 2, undefined, 3];

// guard можно передавать в filter напрямую, без стрелки:
const clean = ids.filter(isPresent);
// тип clean: number[] ✅

const sum = clean.reduce((acc, n) => acc + n, 0); // ✅ n: number, а не number | undefined`;

  protected readonly assertBasic = `// Assertion-функция: если условие ложно — бросает ошибку и прерывает выполнение.
// Возвращаемый тип "asserts condition" говорит компилятору:
// "ниже этой строки condition гарантированно истинно".
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

function getLength(value: string | null): number {
  assert(value !== null, 'value не должен быть null');
  // после assert компилятор считает, что value !== null:
  return value.length; // ✅ value: string, предупреждения "possibly null" нет
}`;

  protected readonly assertIsDog = `type Cat = { kind: 'cat'; meow(): void };
type Dog = { kind: 'dog'; bark(): void };
type Animal = Cat | Dog;

// "asserts animal is Dog" — сужает КОНКРЕТНЫЙ аргумент до Dog.
function assertIsDog(animal: Animal): asserts animal is Dog {
  if (animal.kind !== 'dog') {
    throw new Error('Ожидалась собака, а пришло: ' + animal.kind);
  }
}

function walk(animal: Animal): void {
  assertIsDog(animal);
  // ниже этой строки выполнение идёт ТОЛЬКО если animal — Dog:
  animal.bark(); // ✅ animal: Dog
}`;

  protected readonly assertVsGuard = `declare const pet: Animal;
declare function isDog(a: Animal): a is Dog;
declare function assertIsDog(a: Animal): asserts a is Dog;

// guard задаёт ВОПРОС — обычно внутри if. Доступны обе ветки:
if (isDog(pet)) {
  pet.bark(); // ветка "да, собака"
} else {
  pet.meow(); // ветка "нет, кот" — тоже рабочая
}

// assert ставит ТРЕБОВАНИЕ. Ветки "нет" не существует:
assertIsDog(pet);
pet.bark(); // сюда мы дошли ⇒ pet точно Dog; иначе assert бросил бы ошибку выше`;

  protected readonly unsoundGuard = `// ⚠️ Компилятор НЕ проверяет тело guard'а на честность — верит предикату на слово.
function isString(value: unknown): value is string {
  return typeof value === 'number'; // ← ЛОЖЬ: проверяем number, а обещаем string
}

const x: unknown = 42;

if (isString(x)) {
  // ошибки компиляции НЕТ — TypeScript поверил, что x: string
  console.log(x.toUpperCase());
  // 💥 TypeError: x.toUpperCase is not a function — падение в РАНТАЙМЕ
}`;

  protected readonly unsoundAssert = `type User = { id: number; name: string };

// Такой же риск у assert: пустое тело "проходит" всегда.
function assertIsUser(data: unknown): asserts data is User {
  // забыли реально проверить поля — assert ничего не бросает
}

const raw: unknown = 'просто строка';
assertIsUser(raw);

// компилятор спокоен и считает raw: User, но в рантайме полей нет:
console.log(raw.name.toUpperCase());
// 💥 TypeError: Cannot read properties of undefined (reading 'toUpperCase')`;
}
