import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-closures-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClosuresBasics {
  protected readonly outerScopeExample = `let multiplier = 3;

// scale объявлена НЕ внутри другой функции,
// но всё равно замкнута над multiplier из внешней области
function scale(n) {
  return n * multiplier;
}

scale(10);      // 30
multiplier = 5; // меняем переменную снаружи
scale(10);      // 50 — та же функция видит новое значение`;

  protected readonly counterExample = `function createCounter() {
  let count = 0;

  // эту функцию мы возвращаем наружу
  return function () {
    count += 1;
    return count;
  };
}

const next = createCounter();
next(); // 1
next(); // 2
next(); // 3`;

  protected readonly greeterExample = `function makeGreeter(greeting) {
  // greeting попадает в "рюкзак" возвращаемой функции
  return function (name) {
    return greeting + ', ' + name + '!';
  };
}

const sayHello = makeGreeter('Hello');
const sayHi = makeGreeter('Hi');

sayHello('Anna'); // 'Hello, Anna!'
sayHi('Bob');     // 'Hi, Bob!'`;

  protected readonly whereExample = `// 1. setTimeout: колбэк помнит message
function notifyLater(message) {
  setTimeout(function () {
    console.log(message); // message всё ещё доступен через секунду
  }, 1000);
}

// 2. метод массива: колбэк помнит factor
function scaleAll(numbers, factor) {
  return numbers.map(function (n) {
    return n * factor; // factor взят из замыкания
  });
}

scaleAll([1, 2, 3], 10); // [10, 20, 30]`;
}
