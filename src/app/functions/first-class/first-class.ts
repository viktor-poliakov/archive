import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-first-class',
  imports: [CodeBlock, RouterLink],
  templateUrl: './first-class.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsFirstClass {
  protected readonly callbackExample = `function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

// передаём функцию как аргумент (callback)
repeat(3, (i) => console.log('step', i));`;

  protected readonly higherOrderExample = `const numbers = [1, 2, 3, 4];

const even = numbers.filter((n) => n % 2 === 0); // [2, 4]
const doubled = numbers.map((n) => n * 2);       // [2, 4, 6, 8]`;

  protected readonly closureExample = `function createCounter() {
  let count = 0;
  return () => ++count; // помнит count даже после выхода из createCounter
}

const next = createCounter();
next(); // 1
next(); // 2`;
}
