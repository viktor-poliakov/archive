import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-union',
  imports: [CodeBlock, RouterLink],
  templateUrl: './union.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingUnion {
  protected readonly declareBasic = `// union: значение может быть ОДНИМ ИЗ перечисленных типов
let id: string | number;

id = 'user_42'; // ✅ строка подходит
id = 42;        // ✅ число тоже подходит

id = true;
// ❌ Type 'boolean' is not assignable to type 'string | number'
// В union перечислены только string и number — boolean среди них нет`;

  protected readonly literalUnion = `// Литеральное объединение: значение — одно из фиксированного набора
type SortOrder = 'asc' | 'desc';

let order: SortOrder = 'asc'; // ✅ одно из двух разрешённых значений
order = 'desc';               // ✅

order = 'up';
// ❌ Type '"up"' is not assignable to type 'SortOrder'
// 'up' не входит в набор 'asc' | 'desc'

// Очень частый практический кейс — статус заказа
type OrderStatus = 'new' | 'paid' | 'shipped' | 'cancelled';
const status: OrderStatus = 'paid'; // ✅ автодополнение подскажет все варианты`;

  protected readonly aliasUnion = `// Псевдоним type даёт объединению имя — его удобно переиспользовать
type Id = string | number;

function findUser(id: Id) {
  /* ... */
}
findUser('u_1'); // ✅
findUser(7);     // ✅

// Членов у объединения может быть сколько угодно.
// Классический пример — тип любого значения из JSON:
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };`;

  protected readonly nullableUnion = `interface User {
  id: number;
  name: string;
}

// null и undefined — самостоятельные типы. Чтобы разрешить «пустоту»,
// её добавляют в объединение ЯВНО: T | null или T | undefined.
type MaybeUser = User | null;

// «Не нашли пользователя» — честно отражаем это в типе результата
function findById(id: number): User | null {
  return id === 1 ? { id: 1, name: 'Anna' } : null;
}

let selected: User | undefined; // пока ничего не выбрано — undefined`;

  protected readonly commonMembersError = `function printId(id: string | number) {
  // Тип id — string | number. Без проверки TS разрешает только то,
  // что есть у ОБОИХ членов сразу (общее пересечение возможностей):
  console.log(id.toString()); // ✅ toString() есть и у string, и у number

  console.log(id.toUpperCase());
  // ❌ Property 'toUpperCase' does not exist on type 'string | number'.
  //    Property 'toUpperCase' does not exist on type 'number'.
  // toUpperCase есть у string, но НЕТ у number — значит небезопасно

  console.log(id.toFixed(2));
  // ❌ Property 'toFixed' does not exist on type 'string | number'.
  //    Property 'toFixed' does not exist on type 'string'.
}`;

  protected readonly commonObjectFields = `interface Circle {
  kind: 'circle';
  radius: number;
}
interface Square {
  kind: 'square';
  side: number;
}

type Shape = Circle | Square;

function describe(shape: Shape) {
  // Поле kind есть у ОБОИХ вариантов — читать можно
  console.log(shape.kind); // ✅ тип: 'circle' | 'square'

  console.log(shape.radius);
  // ❌ Property 'radius' does not exist on type 'Shape'.
  //    Property 'radius' does not exist on type 'Square'.
  // radius есть только у Circle, у Square его нет
}`;

  protected readonly narrowingBridge = `function printId(id: string | number) {
  if (typeof id === 'string') {
    // В этой ветке TS ЗНАЕТ, что id — строка. Тип сужен до string,
    // и строковые методы снова доступны:
    console.log(id.toUpperCase()); // ✅ 'USER_42'
  } else {
    // Сюда попадаем, только если id не строка → значит number
    console.log(id.toFixed(0));    // ✅ '42'
  }
}`;

  protected readonly arraysDiff = `// (string | number)[] — массив, где КАЖДЫЙ элемент строка ИЛИ число.
// Скобки важны: union применяется к элементу, а не ко всему массиву.
const mixed: (string | number)[] = ['a', 1, 'b', 2]; // ✅ можно мешать

// string[] | number[] — ЛИБО весь массив строк, ЛИБО весь массив чисел.
// Union применяется к массиву целиком.
let uniform: string[] | number[];
uniform = ['a', 'b', 'c']; // ✅ это массив строк
uniform = [1, 2, 3];       // ✅ это массив чисел

uniform = ['a', 1];
// ❌ Type '(string | number)[]' is not assignable to type 'string[] | number[]'
// Смешанный массив не является ни «массивом строк», ни «массивом чисел»`;

  protected readonly practiceFunctionParam = `// Параметр принимает несколько типов, а внутри мы разбираем их сужением
function formatValue(value: string | number | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'да' : 'нет'; // здесь value — boolean
  }
  if (typeof value === 'number') {
    return value.toFixed(2);     // здесь value — number
  }
  return value.trim();           // остаётся только string
}

formatValue(19.99); // '19.99'
formatValue(true);  // 'да'
formatValue('  hi'); // 'hi'`;

  protected readonly practiceReturnNull = `interface Product {
  id: number;
  title: string;
}

const catalog: Product[] = [
  { id: 1, title: 'Книга' },
  { id: 2, title: 'Ручка' },
];

// Поиск может ничего не найти — честно возвращаем Product | null
function findProduct(id: number): Product | null {
  return catalog.find((p) => p.id === id) ?? null;
}

const product = findProduct(5); // тип: Product | null

console.log(product.title);
// ❌ 'product' is possibly 'null'.
// Компилятор не даст обратиться к title, пока не проверим на null

if (product !== null) {
  console.log(product.title); // ✅ здесь product сужен до Product
}`;
}
