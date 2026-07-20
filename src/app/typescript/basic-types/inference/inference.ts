import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-inference',
  imports: [CodeBlock, RouterLink],
  templateUrl: './inference.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesInference {
  protected readonly basicInference = `// TS сам подставляет тип по значению — аннотация тут лишняя
let count = 42;      // выведен тип: number
let title = 'Hello'; // выведен тип: string
let done = false;    // выведен тип: boolean

// Наведите курсор на переменную в редакторе — увидите выведенный тип.
// Он такой же строгий, как если бы вы написали его руками:
count = 'oops'; // ❌ Type 'string' is not assignable to type 'number'`;

  protected readonly letVsConst = `// let можно переприсвоить → TS расширяет литерал до примитива
let a = 3; // тип: number  (не 3 — ведь значение ещё может смениться)
a = 10;    // ок

// const менять нельзя → TS фиксирует точный литеральный тип
const b = 3; // тип: 3  (ровно тройка, и ничем другим не станет)

// то же и со строками:
let s1 = 'red';   // тип: string
const s2 = 'red'; // тип: 'red'`;

  protected readonly wideningContract = `type Color = 'red' | 'green' | 'blue';

function paint(c: Color): void {
  // ...
}

const ok = 'red'; // тип: 'red' — узкий литерал
paint(ok);        // ок: 'red' точно входит в Color

let bad = 'red';  // тип: string — расширился до примитива!
paint(bad);       // ❌ Argument of type 'string' is not assignable
                  //    to parameter of type 'Color'
                  //    (string слишком широк: вдруг там окажется 'yellow')`;

  protected readonly objectWidening = `// У объектов и массивов свойства изменяемы → они тоже расширяются,
// даже под const:
const point = { x: 3, y: 4 };
// тип: { x: number; y: number }  — НЕ { x: 3; y: 4 }
point.x = 100; // ок, поэтому и тип number, а не литерал 3

// Нужна точность? Заморозьте значение через as const:
const origin = { x: 0, y: 0 } as const;
// тип: { readonly x: 0; readonly y: 0 }`;

  protected readonly returnInference = `// Тип возврата выводится из return — писать его необязательно
function double(n: number) {
  return n * 2; // number * number → number
}
// double: (n: number) => number

const label = double(21); // label: number

// Несколько return с разными типами → объединение (union)
function parse(input: string) {
  if (input === '') return null;
  return input.length;
}
// parse: (input: string) => number | null`;

  protected readonly contextualArray = `const nums = [1, 2, 3]; // number[]

// Тип n НЕ указан, но TS знает: nums — это number[], значит n: number
const doubled = nums.map((n) => n * 2); // doubled: number[]

// Поэтому ошибку в колбэке ловим сразу:
nums.map((n) => n.toUpperCase());
// ❌ Property 'toUpperCase' does not exist on type 'number'`;

  protected readonly contextualEvent = `const button = document.querySelector('button');

// event не аннотирован, но из строки 'click' TS выводит event: MouseEvent
button?.addEventListener('click', (event) => {
  console.log(event.clientX, event.clientY); // подсказки по MouseEvent работают
  event.foo; // ❌ Property 'foo' does not exist on type 'MouseEvent'
});`;

  protected readonly bestCommonType = `// «Лучший общий тип»: TS ищет один тип, покрывающий ВСЕ элементы
const ids = [1, 2, 3];      // number[]
const mix = [1, 'a', 2];    // (string | number)[]
const flags = [true, null]; // (boolean | null)[]

// Работает и для объектов — берётся общая форма:
const shapes = [{ kind: 'circle' }, { kind: 'square' }];
// shapes: { kind: string }[]`;

  protected readonly publicApiAnnotation = `// Публичная функция — фиксируем контракт аннотациями явно.
// Тип возврата тоже: тогда ошибка ловится ЗДЕСЬ, а не у вызывающих.
export function getUser(id: number): { id: number; name: string } {
  return { id };
  // ❌ Property 'name' is missing in type '{ id: number; }'
  //    but required in type '{ id: number; name: string; }'
}

// Без аннотации возврата тип «уехал» бы молча, и падало бы
// в другом файле у того, кто читает user.name.`;

  protected readonly emptyArrayPitfall = `// Пустой массив анализировать не из чего → тип any[], контроль потерян
const tags = [];    // тип: any[]
tags.push(123);     // молча ок
tags.push('hello'); // тоже ок — TS уже ничего не проверяет

// Правильно — аннотировать тип элемента заранее:
const names: string[] = [];
names.push('Anna'); // ок
names.push(42);     // ❌ Argument of type 'number' is not assignable to 'string'`;

  protected readonly implicitAnyParam = `// У обычного параметра нет значения, из которого можно вывести тип →
// под strict это ошибка implicit any:
function greet(name) {
  // ❌ Parameter 'name' implicitly has an 'any' type
  return \`Hi, \${name}\`;
}

// Аннотируйте параметр — возврат выведется сам:
function greetOk(name: string) {
  return \`Hi, \${name}\`; // тип возврата выведен: string
}

// Исключение — параметр со значением по умолчанию, тут вывод работает:
function inc(step = 1) {
  return step + 1; // step: number
}`;
}
