import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './types.html',
  styleUrls: ['../content/doc.scss'],
})
export class Types {
  protected readonly dynamicExample = `let value = 'hello'; // сейчас это строка
value = 42;          // а теперь число — ошибки нет
value = true;        // теперь boolean

// тип «прикреплён» к значению, а не к переменной value`;

  protected readonly typesOverviewExample = `// --- 7 примитивов ---
const age = 42;               // number
const big = 9007199254740993n; // bigint
const name = 'Anna';          // string
const isActive = true;        // boolean
const nothing = null;         // null — намеренно «пусто»
let notSet;                   // undefined — значение не присвоено
const id = Symbol('id');      // symbol — уникальный идентификатор

// --- объект (всё остальное) ---
const user = { name: 'Anna' }; // object
const list = [1, 2, 3];        // тоже object (массив)
const greet = () => 'hi';      // тоже object (функция)`;

  protected readonly typeofExample = `typeof 42          // 'number'
typeof 10n         // 'bigint'
typeof 'Anna'      // 'string'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof Symbol()    // 'symbol'
typeof { a: 1 }    // 'object'
typeof [1, 2]      // 'object'  (массив — тоже объект)

typeof null        // 'object'   ← историческая ошибка языка
typeof function () {} // 'function' ← функции выделяют отдельно`;

  protected readonly copyExample = `// примитив копируется ПО ЗНАЧЕНИЮ — это независимая копия
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — a не изменилась

// объект копируется ПО ССЫЛКЕ — обе переменные смотрят на один объект
let user = { name: 'Anna' };
let alias = user;
alias.name = 'Bob';
console.log(user.name); // 'Bob' — изменение видно через обе переменные`;

  protected readonly wrapperExample = `const text = 'hello';

console.log(text.length);        // 5
console.log(text.toUpperCase()); // 'HELLO'

// text — примитив, у него нет методов. Но при обращении через точку движок
// на миг оборачивает строку в объект String, вызывает метод и выбрасывает обёртку.
// Поэтому writing 'new String(...)' вручную не нужно — это лишний объект.`;

  protected readonly numbersExample = `// NaN — «не число», результат некорректной операции
const result = Number('abc'); // NaN
console.log(NaN === NaN);     // false — NaN не равен даже сам себе
console.log(Number.isNaN(result)); // true — так проверяют на NaN

// Infinity — «бесконечность»
console.log(1 / 0); // Infinity

// дробные числа хранятся неточно
console.log(0.1 + 0.2); // 0.30000000000000004

// bigint — для очень больших целых
console.log(9007199254740991n + 2n); // 9007199254740993n`;

  protected readonly coercionExample = `// --- явное преобразование ---
Number('42');   // 42
String(42);     // '42'
Boolean(0);     // false

// --- неявное (JS приводит типы сам) ---
'5' + 1;  // '51' — с '+' строка «притягивает»: конкатенация
'5' - 1;  // 4    — с '-' строка превращается в число
'5' * 2;  // 10

// это частый источник багов: '+' ведёт себя не как остальные операторы`;

  protected readonly equalityExample = `// == приводит типы перед сравнением (нестрогое)
0 == '';       // false
0 == '0';      // true   ← '0' привели к числу 0
null == undefined; // true

// === сравнивает без приведения (строгое) — предпочитайте его
0 === '0';     // false
null === undefined; // false

// falsy-значения (в if() считаются как false):
// false, 0, -0, 0n, '', null, undefined, NaN — всё остальное truthy
if ('0') console.log('строка "0" — truthy!'); // выполнится`;
}
