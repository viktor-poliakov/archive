import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-symbol-as-keys',
  imports: [CodeBlock, RouterLink],
  templateUrl: './as-keys.html',
  styleUrls: ['../../content/doc.scss'],
})
export class SymbolAsKeys {
  protected readonly useAsKeyExample = `const id = Symbol('id');

// символ как ключ — только через квадратные скобки
const user = {
  name: 'Anna',
  [id]: 42, // вычисляемый ключ-символ
};

user[id];  // 42 — читаем по тому же символу
user.name; // 'Anna'`;

  protected readonly collisionExample = `// две независимые библиотеки помечают чужой объект своим «id»
const libA = Symbol('id');
const libB = Symbol('id'); // описание совпало, но символы РАЗНЫЕ

const user = { name: 'Anna' };
user[libA] = 'from library A';
user[libB] = 'from library B';

user[libA]; // 'from library A'
user[libB]; // 'from library B' — не затёрли друг друга

// а со строковым ключом была бы беда:
const obj = {};
obj['id'] = 'from library A';
obj['id'] = 'from library B'; // перезаписали!
obj['id']; // 'from library B' — данные библиотеки A потеряны`;

  protected readonly hiddenExample = `const id = Symbol('id');
const user = { name: 'Anna', age: 30, [id]: 42 };

Object.keys(user);    // ['name', 'age'] — символьного ключа нет
JSON.stringify(user); // '{"name":"Anna","age":30}' — и здесь нет

for (const key in user) {
  console.log(key); // 'name', затем 'age' — символ пропущен
}`;

  protected readonly revealExample = `const id = Symbol('id');
const user = { name: 'Anna', [id]: 42 };

// только символьные ключи
Object.getOwnPropertySymbols(user); // [Symbol(id)]

// все ключи объекта: и строковые, и символьные
Reflect.ownKeys(user); // ['name', Symbol(id)]`;
}
