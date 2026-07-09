import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-for-of',
  imports: [CodeBlock, RouterLink],
  templateUrl: './for-of.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsForOf {
  protected readonly forOfExample = `const nums = [10, 20, 30];

for (const n of nums) {
  if (n === 20) continue; // continue / break работают как обычно
  console.log(n); // 10, затем 30
}

// for...of даёт ЗНАЧЕНИЯ. Нужен индекс — берём entries():
for (const [i, n] of nums.entries()) {
  console.log(i, n); // 0 10 / 1 20 / 2 30
}`;

  protected readonly consumersExample = `const set = new Set(['a', 'b', 'c']);

// все эти конструкции используют ОДИН протокол итерации:
[...set];                    // ['a', 'b', 'c'] — spread
const [first, second] = set; // деструктуризация: 'a', 'b'
Array.from(set);             // ['a', 'b', 'c'] — Array.from
new Map([['x', 1]]);         // Map принимает iterable пар

// строку тоже можно развернуть — она итерируема
[...'hi'];                   // ['h', 'i']
Math.max(...[3, 1, 2]);      // 3 — spread в аргументы функции`;
}
