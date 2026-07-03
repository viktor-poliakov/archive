import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-collections-map-set',
  imports: [CodeBlock, RouterLink],
  templateUrl: './map-set.html',
  styleUrls: ['../../content/doc.scss'],
})
export class CollectionsMapSet {
  protected readonly mapExample = `const user = { name: 'Anna' };

const visits = new Map();
visits
  .set(user, 5)       // ключ — ОБЪЕКТ (в обычном объекте так нельзя)
  .set('total', 100)  // ключ — строка
  .set(2024, 'year'); // ключ — число

visits.get(user);    // 5
visits.has('total'); // true
visits.size;         // 3
visits.delete(2024);`;

  protected readonly objKeyExample = `// у обычного объекта ключи приводятся к строке
const anna = { name: 'Anna' };
const bob = { name: 'Bob' };

const obj = {};
obj[anna] = 1;
obj[bob] = 2;
obj[anna]; // 2 — оба ключа стали '[object Object]' и перезаписали друг друга!

// Map хранит объекты-ключи как есть
const map = new Map();
map.set(anna, 1).set(bob, 2);
map.get(anna); // 1 — ключи различаются`;

  protected readonly mapIterExample = `const map = new Map([
  ['name', 'Anna'],
  ['age', 30],
]);

for (const [key, value] of map) {
  console.log(key, value); // 'name' 'Anna', затем 'age' 30
}

map.keys();   // итератор ключей
map.values(); // итератор значений

// объект ↔ Map
const fromObj = new Map(Object.entries({ a: 1, b: 2 }));
const backToObj = Object.fromEntries(map); // { name: 'Anna', age: 30 }`;

  protected readonly setExample = `const tags = new Set();
tags.add('js').add('ts').add('js'); // второй 'js' игнорируется

tags.has('ts'); // true
tags.size;      // 2
[...tags];      // ['js', 'ts']`;

  protected readonly dedupExample = `const numbers = [1, 2, 2, 3, 3, 3];

// убрать дубликаты: массив → Set → снова массив
const unique = [...new Set(numbers)]; // [1, 2, 3]`;
}
