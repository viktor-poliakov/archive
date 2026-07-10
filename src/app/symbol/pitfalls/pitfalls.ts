import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-symbol-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class SymbolPitfalls {
  protected readonly coercionExample = `const id = Symbol('id');

// НЕЛЬЗЯ неявно превратить символ в строку или число:
\`id: \${id}\`; // TypeError: Cannot convert a Symbol value to a string
id + '';     // TypeError
+id;         // TypeError: Cannot convert a Symbol value to a number

// МОЖНО — явно и осознанно:
String(id);     // 'Symbol(id)'
id.toString();  // 'Symbol(id)'
id.description;  // 'id'`;

  protected readonly jsonExample = `const id = Symbol('id');

// символ как ЗНАЧЕНИЕ — молча пропадает
JSON.stringify({ token: Symbol('secret') }); // '{}'

// символ как КЛЮЧ — тоже пропадает
JSON.stringify({ [id]: 42, name: 'Anna' }); // '{"name":"Anna"}'

// сам по себе символ сериализуется в undefined
JSON.stringify(id); // undefined`;

  protected readonly spreadExample = `const id = Symbol('id');
const user = { name: 'Anna', [id]: 42 };

// for...in и Object.keys символ НЕ видят...
Object.keys(user); // ['name']

// ...но копирование объекта его ПЕРЕНОСИТ:
const copy = { ...user };
copy[id]; // 42 — символьный ключ скопировался!

const assigned = Object.assign({}, user);
assigned[id]; // 42 — тоже на месте`;

  protected readonly dotExample = `const id = Symbol('id');
const user = {};

user.id = 'string key';  // это СТРОКОВЫЙ ключ 'id', не символ!
user[id] = 'symbol key'; // а это символьный ключ

user.id;    // 'string key'
user['id']; // 'string key' — то же самое
user[id];   // 'symbol key' — отдельное свойство`;
}
