import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-generators',
  imports: [CodeBlock, RouterLink],
  templateUrl: './generators.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsGenerators {
  protected readonly genBasicExample = `function* count() {
  console.log('старт');
  yield 1; // отдаём 1 и ПАУЗА
  console.log('после первого yield');
  yield 2; // отдаём 2 и ПАУЗА
  console.log('после второго yield');
}

const gen = count(); // тело ещё НЕ выполнялось — получили генератор
gen.next(); // печатает 'старт' → { value: 1, done: false }
gen.next(); // печатает 'после первого yield' → { value: 2, done: false }
gen.next(); // печатает 'после второго yield' → { value: undefined, done: true }`;

  protected readonly genIsIterableExample = `function* colors() {
  yield 'red';
  yield 'green';
  yield 'blue';
}

// генератор сам итерируем — работает с for...of и spread
for (const c of colors()) {
  console.log(c); // 'red', 'green', 'blue'
}

[...colors()]; // ['red', 'green', 'blue']`;

  protected readonly genRangeExample = `// тот же диапазон, что мы писали вручную через [Symbol.iterator], —
// теперь коротко и понятно
function* range(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}

[...range(1, 5)];                            // [1, 2, 3, 4, 5]
for (const n of range(1, 3)) console.log(n); // 1, 2, 3`;
}
