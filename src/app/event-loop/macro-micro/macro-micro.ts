import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-event-loop-macro-micro',
  imports: [CodeBlock, RouterLink],
  templateUrl: './macro-micro.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventLoopMacroMicro {
  protected readonly drainExample = `console.log('start');

setTimeout(() => console.log('timeout 1'), 0); // макрозадача

Promise.resolve()
  .then(() => console.log('promise 1')) // микрозадача
  .then(() => console.log('promise 2')); // и ещё одна

setTimeout(() => console.log('timeout 2'), 0); // макрозадача

console.log('end');

// start, end, promise 1, promise 2, timeout 1, timeout 2`;

  protected readonly nestedMicroExample = `setTimeout(() => console.log('macrotask'), 0);

Promise.resolve().then(() => {
  console.log('micro 1');
  // добавляем новую микрозадачу прямо во время разбора очереди
  Promise.resolve().then(() => console.log('micro 2'));
});

// вывод: micro 1, micro 2, macrotask
// micro 2 добавлен по ходу — и всё равно успевает раньше макрозадачи`;

  protected readonly awaitExample = `async function load() {
  console.log('before await');
  await Promise.resolve();    // здесь функция ставится на паузу
  console.log('after await'); // продолжение — это микрозадача
}

console.log('start');
load();
console.log('end');

// вывод: start, before await, end, after await`;
}
