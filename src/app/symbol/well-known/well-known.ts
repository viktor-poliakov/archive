import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-symbol-well-known',
  imports: [CodeBlock, RouterLink],
  templateUrl: './well-known.html',
  styleUrls: ['../../content/doc.scss'],
})
export class SymbolWellKnown {
  protected readonly iteratorExample = `// [Symbol.iterator] делает объект перебираемым (for...of, спред, ...)
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

[...range]; // [1, 2, 3] — движок сам вызвал range[Symbol.iterator]()`;

  protected readonly toPrimitiveExample = `// [Symbol.toPrimitive] задаёт, как объект превращается в примитив.
// hint — «подсказка», какой примитив нужен: 'number', 'string' или 'default'
const money = {
  amount: 1000,
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;         // ждут число
    if (hint === 'string') return \`$\${this.amount}\`;   // ждут строку
    return \`Money(\${this.amount})\`;                     // 'default'
  },
};

+money;      // 1000          — арифметика → hint 'number'
\`\${money}\`;   // '$1000'       — шаблонная строка → hint 'string'
money + '';  // 'Money(1000)' — сложение → hint 'default'`;

  protected readonly toStringTagExample = `// [Symbol.toStringTag] задаёт «тег» объекта в Object.prototype.toString
const collection = {
  [Symbol.toStringTag]: 'Collection',
};

Object.prototype.toString.call(collection); // '[object Collection]'

// именно так «представляются» встроенные типы:
Object.prototype.toString.call(new Set()); // '[object Set]'
Object.prototype.toString.call(new Map()); // '[object Map]'`;

  protected readonly hasInstanceExample = `// [Symbol.hasInstance] настраивает поведение оператора instanceof.
// метод статический — его зовут на том, что стоит СПРАВА от instanceof
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}

4 instanceof Even; // true
3 instanceof Even; // false`;
}
