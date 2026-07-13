import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-proxy-reflect-traps',
  imports: [CodeBlock, RouterLink],
  templateUrl: './traps.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ProxyReflectTraps {
  protected readonly hasExample = `// ловушка has перехватывает оператор in
const range = { start: 1, end: 10 };

const proxy = new Proxy(range, {
  has(obj, prop) {
    return Number(prop) >= obj.start && Number(prop) <= obj.end;
  },
});

5 in proxy;  // true
15 in proxy; // false`;

  protected readonly deletePropertyExample = `// ловушка deleteProperty перехватывает delete
const proxy = new Proxy({ a: 1, b: 2 }, {
  deleteProperty(obj, prop) {
    console.log(\`delete \${prop}\`);
    delete obj[prop];
    return true; // как и set, должна вернуть true при успехе
  },
});

delete proxy.a; // лог: 'delete a', вернёт true`;

  protected readonly ownKeysExample = `// ловушка ownKeys перехватывает перечисление ключей
const target = { name: 'Anna', _secret: 42 };

const proxy = new Proxy(target, {
  ownKeys(obj) {
    // спрячем «приватные» ключи (с _) из перечисления
    return Object.keys(obj).filter((key) => !key.startsWith('_'));
  },
});

Object.keys(proxy); // ['name'] — _secret скрыт`;

  protected readonly applyExample = `// ловушка apply перехватывает ВЫЗОВ функции
function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(fn, thisArg, args) {
    return fn(...args) * 2; // меняем результат вызова
  },
});

proxy(2, 3); // 10 — вместо обычных 5`;

  protected readonly constructExample = `// ловушка construct перехватывает оператор new
class User {
  constructor(name) {
    this.name = name;
  }
}

const proxy = new Proxy(User, {
  construct(Target, args) {
    console.log(\`new with \${args}\`);
    return new Target(...args);
  },
});

const user = new proxy('Anna'); // лог: 'new with Anna'
user.name;                      // 'Anna'`;
}
