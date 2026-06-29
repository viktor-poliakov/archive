import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsPitfalls {
  protected readonly getSetExample = `const user = {
  firstName: 'Ann',
  lastName: 'Lee',

  // геттер — читается как свойство, но вычисляется на лету
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },

  // сеттер — срабатывает при присваивании
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  },
};

console.log(user.fullName); // 'Ann Lee'  — без скобок, как свойство
user.fullName = 'Bob Kim';  // сработал set
console.log(user.firstName); // 'Bob'`;

  protected readonly definePropertyExample = `const user = {};

// задаём свойство и сразу описываем его поведение
Object.defineProperty(user, 'id', {
  value: 42,
  writable: false,   // нельзя перезаписать
  enumerable: false, // не попадёт в for...in и Object.keys
  configurable: false, // нельзя удалить или переопределить дескриптор
});

console.log(user.id); // 42
user.id = 99;         // молча игнорируется (в strict mode — ошибка)
console.log(user.id); // 42 — значение защищено
console.log(Object.keys(user)); // [] — id скрыт от перебора`;

  protected readonly defaultFlagsExample = `const a = {};
a.name = 'Ann'; // обычное присваивание

// у такого свойства все флаги по умолчанию true
console.log(Object.getOwnPropertyDescriptor(a, 'name'));
// { value: 'Ann', writable: true, enumerable: true, configurable: true }

const b = {};
Object.defineProperty(b, 'name', { value: 'Ann' });

// а через defineProperty пропущенные флаги по умолчанию false!
console.log(Object.getOwnPropertyDescriptor(b, 'name'));
// { value: 'Ann', writable: false, enumerable: false, configurable: false }`;

  protected readonly defineGetterExample = `const user = { firstName: 'Ann', lastName: 'Lee' };

// defineProperty умеет задавать и геттер/сеттер
Object.defineProperty(user, 'fullName', {
  get() {
    return this.firstName + ' ' + this.lastName;
  },
  enumerable: true,
});

console.log(user.fullName); // 'Ann Lee'`;

  protected readonly freezeExample = `const config = Object.freeze({ theme: 'dark' });

config.theme = 'light'; // молча игнорируется (в strict mode — ошибка)
config.lang = 'ru';     // тоже не добавится

console.log(config.theme); // 'dark'
console.log(Object.isFrozen(config)); // true`;

  protected readonly optionalChainExample = `const user = { name: 'Ann' }; // address нет

// без ?. — ошибка: чтение city у undefined
// console.log(user.address.city);

// с ?. — цепочка безопасно останавливается и даёт undefined
console.log(user.address?.city); // undefined

// ?? подставит запасное значение вместо null/undefined
const city = user.address?.city ?? 'unknown';
console.log(city); // 'unknown'`;

  protected readonly spreadMergeExample = `const defaults = { theme: 'light', lang: 'ru' };
const userPrefs = { theme: 'dark' };

// слияние: правые значения перекрывают левые
const settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: 'dark', lang: 'ru' }

// иммутабельное обновление: новый объект вместо мутации
const next = { ...settings, lang: 'en' };
console.log(settings.lang); // 'ru' — исходный не тронут`;

  protected readonly jsonExample = `const data = {
  name: 'Ann',
  age: undefined,        // пропадёт
  greet() {},            // пропадёт
  created: new Date(),   // станет строкой
};

console.log(JSON.stringify(data)); // {"name":"Ann","created":"2026-..."}`;
}
