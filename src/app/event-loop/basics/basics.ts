import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-event-loop-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventLoopBasics {
  protected readonly stackExample = `function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n); // square ждёт, пока multiply вернёт число
}

function printSquare(n) {
  console.log(square(n));
}

printSquare(5); // 25`;

  protected readonly asyncExample = `console.log('start');

// setTimeout не останавливает код: секунду отсчитывает браузер,
// а колбэк вернётся в очередь и выполнится позже
setTimeout(() => {
  console.log('a second passed');
}, 1000);

console.log('end');

// сразу:        start, end
// через секунду: a second passed`;

  protected readonly orderExample = `console.log('1');

setTimeout(() => console.log('2'), 0); // отложенная задача

Promise.resolve().then(() => console.log('3')); // промис

console.log('4');

// порядок вывода: 1, 4, 3, 2`;
}
