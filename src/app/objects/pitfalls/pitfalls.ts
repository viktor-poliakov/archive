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
