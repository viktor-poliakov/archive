import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-protocol',
  imports: [CodeBlock, RouterLink],
  templateUrl: './protocol.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsProtocol {
  protected readonly whyExample = `// for...of работает с тем, что ИТЕРИРУЕМО:
for (const x of [1, 2, 3]) console.log(x);       // массив — ок
for (const ch of 'hi') console.log(ch);          // строка — ок
for (const x of new Set([1, 2])) console.log(x); // Set — ок

// но обычный объект НЕ итерируем:
for (const x of { a: 1 }) console.log(x);
// TypeError: {a:1} is not iterable — у объекта нет [Symbol.iterator]`;

  protected readonly manualExample = `const arr = ['a', 'b'];

// достаём итератор у массива (обычно это делает for...of за нас)
const iterator = arr[Symbol.iterator]();

iterator.next(); // { value: 'a', done: false }
iterator.next(); // { value: 'b', done: false }
iterator.next(); // { value: undefined, done: true } — элементы кончились`;
}
