import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-json-stringify',
  imports: [CodeBlock, RouterLink],
  templateUrl: './stringify.html',
  styleUrls: ['../../content/doc.scss'],
})
export class JsonStringify {
  protected readonly basicExample = `const user = { name: 'Anna', age: 30, isAdmin: false };

JSON.stringify(user); // '{"name":"Anna","age":30,"isAdmin":false}'
JSON.stringify([1, 'two', true]); // '[1,"two",true]'
JSON.stringify('hello'); // '"hello"' — даже строка получает кавычки`;

  protected readonly droppedExample = `const data = {
  name: 'Anna',
  greet() {},       // функция
  age: undefined,   // undefined
  id: Symbol('id'), // символ
};

// в объекте undefined, функции и символы просто исчезают
JSON.stringify(data); // '{"name":"Anna"}'

// но в МАССИВЕ на их месте появляется null (иначе сместятся индексы)
JSON.stringify([1, undefined, () => {}, 2]); // '[1,null,null,2]'`;

  protected readonly spaceExample = `const user = { name: 'Anna', pets: ['cat', 'dog'] };

// третий аргумент — отступ: число пробелов (или строка)
JSON.stringify(user, null, 2);
// {
//   "name": "Anna",
//   "pets": [
//     "cat",
//     "dog"
//   ]
// }`;

  protected readonly replacerArrayExample = `const user = { name: 'Anna', age: 30, password: 'secret' };

// второй аргумент — массив: какие ключи оставить (белый список)
JSON.stringify(user, ['name', 'age']); // '{"name":"Anna","age":30}'`;

  protected readonly replacerFnExample = `const user = { name: 'Anna', age: 30, password: 'secret' };

// второй аргумент — функция: вызывается для каждого поля.
// вернуть undefined — выбросить поле (например, спрятать пароль)
const json = JSON.stringify(user, (key, value) => {
  if (key === 'password') return undefined;
  return value;
});

json; // '{"name":"Anna","age":30}'`;

  protected readonly toJsonExample = `// если у объекта есть метод toJSON, stringify вызовет именно его
const room = {
  number: 23,
  occupied: true,
  toJSON() {
    return \`Room \${this.number}\`; // объект сам решает, как выглядеть в JSON
  },
};

JSON.stringify(room);     // '"Room 23"'
JSON.stringify({ room }); // '{"room":"Room 23"}'

// именно так сериализуется Date — у неё есть встроенный toJSON:
JSON.stringify(new Date('2026-01-01')); // '"2026-01-01T00:00:00.000Z"'`;
}
