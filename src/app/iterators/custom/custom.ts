import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsCustom {
  protected readonly rangeManualExample = `// сделаем объект-диапазон итерируемым: добавим метод [Symbol.iterator]
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    // возвращаем ИТЕРАТОР — объект с методом next()
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};`;

  protected readonly rangeUsageExample = `// теперь range работает везде, где нужен iterable:
for (const n of range) {
  console.log(n); // 1, 2, 3
}

[...range];         // [1, 2, 3]
Array.from(range);  // [1, 2, 3]
Math.max(...range); // 3`;
}
