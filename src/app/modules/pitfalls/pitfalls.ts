import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-modules-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ModulesPitfalls {
  protected readonly liveBindingExample = `// counter.js
export let count = 0;
export function increment() {
  count++;
}

// app.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 — импорт видит АКТУАЛЬНОЕ значение (живая связь)

count = 5; // ОШИБКА: импортированное имя доступно только для чтения`;

  protected readonly singletonExample = `// store.js — модуль выполняется один раз, объект общий для всех импортёров
export const store = { items: [] };

// fileA.js
import { store } from './store.js';
store.items.push('a');

// fileB.js
import { store } from './store.js';
console.log(store.items); // ['a'] — это тот же самый объект`;

  protected readonly circularExample = `// a.js
import { b } from './b.js';
export const a = 'A';
console.log(b); // может быть undefined: b.js мог ещё не доисполниться

// b.js
import { a } from './a.js';
export const b = 'B';

// Циклы лучше разрывать — вынести общее в третий, независимый модуль`;

  protected readonly esmCjsExample = `// CommonJS (Node, исторический формат): синхронный, динамический
const fs = require('fs');
module.exports = { helper };

// ES Modules (стандарт): статический, асинхронный,
// живые связи, top-level await
import fs from 'node:fs';
export { helper };`;
}
