import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesPitfalls {
  protected readonly excessLiteralExample = `type Point = { x: number; y: number };

// Пишем объект ПРЯМО в присваивании (объектный литерал).
// TypeScript включает "проверку лишних свойств" (excess property check):
const p: Point = { x: 1, y: 2, z: 3 };
// ❌ Object literal may only specify known properties,
//    and 'z' does not exist in type 'Point'.
//    Лишнее поле z подсвечено сразу — скорее всего это опечатка.`;

  protected readonly excessVariableExample = `type Point = { x: number; y: number };

// А теперь тот же объект сначала кладём в переменную.
const raw = { x: 1, y: 2, z: 3 }; // тип выведен как { x, y, z }
const p: Point = raw;             // ✅ проходит! Лишнее z "просочилось"

// То же с функцией:
function draw(pt: Point) {}

draw({ x: 1, y: 2, z: 3 }); // ❌ литерал — excess property check ловит z
draw(raw);                  // ✅ переменная — проходит тихо

// Итог: проверка на лишние поля работает ТОЛЬКО у литерала на месте.
// Через переменную действует обычное структурное правило.`;

  protected readonly structuralExample = `interface Named {
  name: string;
}

class Cat { name = 'Мурка'; meow() {} }
class Car { name = 'Tesla'; drive() {} }

function greet(x: Named) {
  return 'Привет, ' + x.name;
}

greet(new Cat());       // ✅ у Cat есть поле name нужной формы
greet(new Car());       // ✅ и у Car тоже — имя класса вообще не важно
greet({ name: 'Аня' }); // ✅ обычный объект подходит точно так же

// Совместимость определяется по ФОРМЕ (какие поля есть),
// а НЕ по имени типа, интерфейса или класса.`;

  protected readonly optionalVsUndefinedExample = `// Это ДВЕ разные вещи — их часто путают.
interface A {
  name?: string; // ключ можно НЕ указывать вовсе
}
interface B {
  name: string | undefined; // ключ ОБЯЗАН быть; значение — строка или undefined
}

const a1: A = {};                  // ✅ ключа нет — это допустимо
const b1: B = {};                  // ❌ Property 'name' is missing in type '{}'
const b2: B = { name: undefined }; // ✅ ключ есть, значение undefined

// Правило: name?: T разрешает ОТСУТСТВИЕ ключа,
// а name: T | undefined требует ключ, но допускает значение undefined.`;

  protected readonly optionalAccessExample = `interface User {
  name: string;
  address?: { city: string }; // адрес может отсутствовать
}

function cityOf(u: User): string {
  // ❌ u.address может быть undefined — так обращаться нельзя:
  // return u.address.city;
  //        ~~~~~~~~~ 'u.address' is possibly 'undefined'

  // ✅ Вариант 1: проверить вручную
  if (u.address) {
    return u.address.city; // здесь TS уже знает, что address есть
  }

  // ✅ Вариант 2: опциональная цепочка ?. и значение по умолчанию ??
  return u.address?.city ?? 'город не указан';
}`;

  protected readonly readonlyShallowExample = `interface Config {
  readonly url: string;
  readonly tags: string[];
}

const c: Config = { url: '/api', tags: ['a', 'b'] };

c.url = '/v2';  // ❌ Cannot assign to 'url' because it is a read-only property
c.tags = [];    // ❌ то же самое — переприсвоить сам массив нельзя

// НО readonly ПОВЕРХНОСТНЫЙ (shallow): защищена только ссылка,
// а СОДЕРЖИМОЕ вложенного массива/объекта — нет:
c.tags.push('hack'); // ✅ компилятор молчит, а массив изменился!
console.log(c.tags); // ['a', 'b', 'hack']

// И ещё: readonly существует ТОЛЬКО при компиляции. В готовом
// JavaScript этого ограничения нет — оно исчезает после сборки.`;

  protected readonly indexSignatureExample = `interface Scores {
  [key: string]: number; // "любой строковый ключ даёт number"
}

const s: Scores = { math: 5, physics: 4 };

s.math; // 5
s.math; // undefined — опечатка НЕ подсвечена!
// Тип обещает number для ЛЮБОГО ключа, поэтому обращение
// по несуществующему 'math' считается совершенно законным.

// Флаг компилятора noUncheckedIndexedAccess лечит это:
// теперь результат имеет тип number | undefined, и TS
// заставит проверить значение перед использованием.
const v = s.math; // при флаге тип v: number | undefined
v.toFixed(2);     // ❌ 'v' is possibly 'undefined'`;

  protected readonly emptyObjectTypeExample = `// object — любое НЕ примитивное значение (объект, массив, функция).
let o: object;
o = { a: 1 }; // ✅
o = [1, 2];   // ✅
o = 42;       // ❌ число — примитив, а не object

// А вот тип {} (и похожий на него Object) значит НЕ "пустой объект",
// а "почти что угодно, КРОМЕ null и undefined":
let anything: {};
anything = 42;     // ✅ (!) число подходит
anything = 'text'; // ✅ и строка тоже
anything = true;   // ✅ и boolean
anything = null;   // ❌ вот null и undefined — единственные, что не влезают

// Вывод: {} почти бесполезен как "объект". Нужен объект — берите
// конкретный тип, интерфейс или Record<string, unknown>.`;

  protected readonly declarationMergingExample = `// Два одноимённых interface в одной области НЕ конфликтуют —
// TypeScript тихо СЛИВАЕТ их в один (declaration merging):
interface Box {
  width: number;
}
interface Box {
  height: number; // не переопределяет, а ДОБАВЛЯЕТ поле
}

const b: Box = { width: 10, height: 20 }; // ✅ нужны ОБА поля
const bad: Box = { width: 10 };           // ❌ 'height' is missing

// Где стреляет: вы назвали свой interface так же, как уже
// существующий (свой или из библиотеки) — и он неожиданно
// "оброс" чужими полями.

// У type такого нет: два одинаковых type — это ошибка-дубликат.
type T = { a: number };
type T = { b: number }; // ❌ Duplicate identifier 'T'`;
}
