import { Component } from '@angular/core';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-hoisting',
  imports: [CodeBlock],
  templateUrl: './hoisting.html',
  styleUrls: ['../content/doc.scss'],
})
export class Hoisting {
  protected readonly varExample = `console.log(message); // undefined, а не ошибка
var message = 'Hello';
console.log(message); // 'Hello'`;

  protected readonly varAsEngineSees = `var message;          // объявление «поднято» наверх
console.log(message); // undefined
message = 'Hello';    // присваивание осталось на месте
console.log(message); // 'Hello'`;

  protected readonly tdzExample = `console.log(count); // ReferenceError: Cannot access 'count' before initialization
let count = 5;`;

  protected readonly funcDeclarationExample = `greet(); // 'Hi!' — работает, хотя функция объявлена ниже

function greet() {
  console.log('Hi!');
}`;

  protected readonly funcExpressionExample = `greet(); // TypeError: greet is not a function

var greet = function () {
  console.log('Hi!');
};`;

  protected readonly funcExpressionLetExample = `greet(); // ReferenceError: Cannot access 'greet' before initialization

const greet = () => {
  console.log('Hi!');
};`;

  protected readonly duplicateExample = `sayHi(); // 'Second' — побеждает последнее объявление

function sayHi() {
  console.log('First');
}

function sayHi() {
  console.log('Second');
}`;

  protected readonly patternExample = `// Главную логику читаем сверху, детали — ниже
start();

function start() {
  const user = loadUser();
  render(user);
}

function loadUser() {
  return { name: 'Anna' };
}

function render(user) {
  console.log('Hello, ' + user.name);
}`;
}
