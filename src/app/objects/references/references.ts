import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-references',
  imports: [CodeBlock, RouterLink],
  templateUrl: './references.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsReferences {
  protected readonly referenceExample = `const a = { count: 1 };
const b = a; // b и a — это одна и та же ссылка на один объект

b.count = 99;

console.log(a.count); // 99 — изменили через b, поменялось и у a`;

  protected readonly compareExample = `const x = { id: 1 };
const y = { id: 1 };

// === сравнивает ссылки, а не содержимое
console.log(x === y); // false — это два разных объекта
console.log(x === x); // true  — это буквально один и тот же объект

// чтобы сравнить по содержимому, сравнивают вручную
// (или, упрощённо, через JSON.stringify)`;

  protected readonly mutateArgExample = `function addTax(order) {
  order.total *= 1.2; // мутируем объект, который пришёл снаружи
}

const order = { total: 100 };
addTax(order);

console.log(order.total); // 120 — функция изменила исходный объект`;

  protected readonly constExample = `const user = { name: 'Ann' };

user.name = 'Bob'; // ок: меняем содержимое объекта
user.age = 30;     // ок: добавляем свойство

// user = {};       // ошибка! const запрещает переприсвоить саму ссылку`;

  protected readonly shallowCopyExample = `const original = { name: 'Ann', age: 30 };

// две поверхностные копии — одинаковы по результату
const copy1 = { ...original };           // spread
const copy2 = Object.assign({}, original); // Object.assign

copy1.name = 'Bob';
console.log(original.name); // 'Ann' — оригинал не тронут`;

  protected readonly shallowProblemExample = `const original = {
  name: 'Ann',
  address: { city: 'Moscow' }, // вложенный объект
};

const copy = { ...original };

// верхний уровень скопирован, но вложенный объект — общий!
copy.address.city = 'Paris';
console.log(original.address.city); // 'Paris' — изменился и оригинал`;

  protected readonly deepCopyExample = `const original = {
  name: 'Ann',
  address: { city: 'Moscow' },
};

// глубокая копия — все уровни вложенности независимы
const deep = structuredClone(original);

deep.address.city = 'Paris';
console.log(original.address.city); // 'Moscow' — оригинал цел`;
}
