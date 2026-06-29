import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-iteration',
  imports: [CodeBlock, RouterLink],
  templateUrl: './iteration.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsIteration {
  protected readonly forInExample = `const user = { name: 'Ann', age: 30 };

for (const key in user) {
  console.log(key, '=', user[key]);
}
// name = Ann
// age = 30`;

  protected readonly objectStaticExample = `const user = { name: 'Ann', age: 30 };

Object.keys(user);   // ['name', 'age']        — только ключи
Object.values(user); // ['Ann', 30]            — только значения
Object.entries(user); // [['name','Ann'], ['age',30]] — пары [ключ, значение]

// удобно перебирать через for...of с деструктуризацией:
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}`;

  protected readonly fromEntriesExample = `const prices = { apple: 50, banana: 30, cherry: 90 };

// оставим только товары дороже 40 рублей
const expensive = Object.fromEntries(
  Object.entries(prices).filter(([, price]) => price > 40),
);

console.log(expensive); // { apple: 50, cherry: 90 }`;

  protected readonly hasOwnExample = `const user = { name: 'Ann' };

// собственное свойство — то, что лежит на самом объекте
Object.hasOwn(user, 'name'); // true

// 'toString' приходит из прототипа, своим оно не является
Object.hasOwn(user, 'toString'); // false
'toString' in user;              // true — а 'in' видит и прототип

// до Object.hasOwn (ES2022) использовали так:
user.hasOwnProperty('name'); // true`;

  protected readonly forInPrototypeExample = `const base = { shared: 'from prototype' };
const obj = Object.create(base); // obj наследует base
obj.own = 'own';

// for...in обходит И свои, И унаследованные свойства
for (const key in obj) {
  console.log(key); // own, shared
}

// чтобы взять только свои — фильтруем или берём Object.keys
console.log(Object.keys(obj)); // ['own']`;
}
