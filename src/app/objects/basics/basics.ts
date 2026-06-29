import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsBasics {
  protected readonly literalExample = `const user = {
  name: 'Ann',
  age: 30,
  isAdmin: false,
};

// объект — это набор пар «ключ: значение»`;

  protected readonly accessExample = `const user = { name: 'Ann', age: 30 };

// доступ через точку — когда ключ известен заранее
console.log(user.name); // 'Ann'

// доступ через скобки — когда ключ в переменной
// или содержит пробел/дефис
const key = 'age';
console.log(user[key]);     // 30
console.log(user['age']);   // 30

const settings = { 'main-color': 'red' };
console.log(settings['main-color']); // только так, через точку нельзя`;

  protected readonly computedExample = `const field = 'email';

const user = {
  name: 'Ann',
  [field]: 'ann@mail.com', // вычисляемый ключ: имя берётся из переменной
};

console.log(user.email); // 'ann@mail.com'`;

  protected readonly keysAreStringsExample = `const obj = {};

obj[1] = 'number';
obj['1'] = 'string';

// ключ 1 и ключ '1' — это один и тот же ключ:
// число молча превратилось в строку '1'
console.log(obj[1]); // 'string'
console.log(Object.keys(obj)); // ['1'] — всего один ключ`;

  protected readonly mutateExample = `const user = { name: 'Ann' };

user.age = 30;       // добавили новое свойство
user.name = 'Bob';   // изменили существующее
delete user.age;     // удалили свойство

console.log(user); // { name: 'Bob' }`;

  protected readonly inExample = `const user = { name: 'Ann', age: 0 };

// 'in' честно проверяет наличие ключа — даже если значение falsy (0, '', null)
console.log('age' in user);   // true
console.log('email' in user); // false`;

  protected readonly undefinedExample = `const config = { timeout: undefined };

// сравнение с undefined может обмануть:
// свойство есть, но его значение само по себе undefined
console.log(config.timeout === undefined); // true — будто ключа нет
console.log('timeout' in config);          // true — а ключ есть

// тот же изъян у typeof
console.log(typeof config.timeout === 'undefined'); // true — снова «обман»`;

  protected readonly hasOwnExample = `const user = { name: 'Ann' };

// Object.hasOwn — только собственные свойства (не из прототипа)
console.log(Object.hasOwn(user, 'name'));     // true
console.log(Object.hasOwn(user, 'toString')); // false — это из прототипа

// 'in' же видит и унаследованные свойства
console.log('toString' in user); // true

// старый аналог Object.hasOwn — метод hasOwnProperty
console.log(user.hasOwnProperty('name')); // true`;

  protected readonly otherWaysExample = `const user = { name: 'Ann', age: 0 };

// безопасный доступ через ?. — удобно для вложенных объектов,
// но falsy-значения (0, '') тоже дадут «ложное отсутствие»
console.log(user.age ?? 'none'); // 0  — здесь ок, ?? ловит только null/undefined

// проверка через список ключей — наглядно, но медленнее
console.log(Object.keys(user).includes('name')); // true`;
}
