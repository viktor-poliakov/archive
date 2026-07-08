import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-variables',
  imports: [CodeBlock, RouterLink],
  templateUrl: './variables.html',
  styleUrls: ['../content/doc.scss'],
})
export class Variables {
  protected readonly declareExample = `let age = 25;         // можно менять
const name = 'Anna';  // нельзя переприсвоить
var city = 'Moscow';  // устаревший способ`;

  protected readonly letExample = `let count = 0;
count = count + 1; // 1 — переприсваивание разрешено

if (true) {
  let inner = 'visible only here';
}
// console.log(inner); // ошибка: inner не определён снаружи`;

  protected readonly constExample = `const PI = 3.14;
// PI = 3; // ошибка: Assignment to constant variable

const user = { name: 'Anna' };
user.name = 'Ivan'; // OK: меняем содержимое объекта, а не саму ссылку`;

  protected readonly varExample = `console.log(x); // undefined, а не ошибка — из-за hoisting
var x = 5;

if (true) {
  var y = 10;
}
console.log(y); // 10 — var «вытекает» из блока`;

  protected readonly shadowExample = `let name = 'outer';

function greet() {
  var name = 'inner'; // затеняет внешнюю name внутри функции
  console.log(name);  // 'inner'
}

greet();
console.log(name);    // 'outer' — внешняя переменная не изменилась`;

  protected readonly shadowBlockExample = `var x = 1;

if (true) {
  var x = 2; // тот же x! var не уважает границы блока
}

console.log(x); // 2 — внешняя переменная перезаписана

let y = 1;

if (true) {
  let y = 2; // новая переменная, видна только в этом блоке
}

console.log(y); // 1 — внешняя переменная не тронута`;

  protected readonly windowExample = `var a = 1;
let b = 2;
const c = 3;

console.log(window.a); // 1     — var попал в window
console.log(window.b); // undefined — let не попадает
console.log(window.c); // undefined — const не попадает`;

  protected readonly namingExample = `let userName = 'anna';   // хорошо
let _private = true;     // допустимо
let $element = null;     // допустимо
// let 1value = 5;       // ошибка: начинается с цифры
// let for = 5;          // ошибка: зарезервированное слово`;
}
