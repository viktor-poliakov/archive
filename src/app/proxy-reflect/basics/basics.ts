import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-proxy-reflect-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ProxyReflectBasics {
  protected readonly basicExample = `const target = { name: 'Anna', age: 30 };

const proxy = new Proxy(target, {
  // ловушка ЧТЕНИЯ свойства
  get(obj, prop) {
    console.log(\`read \${prop}\`);
    return obj[prop];
  },
  // ловушка ЗАПИСИ (обязана вернуть true при успехе)
  set(obj, prop, value) {
    console.log(\`write \${prop} = \${value}\`);
    obj[prop] = value;
    return true;
  },
});

proxy.name;     // лог: 'read name', вернёт 'Anna'
proxy.age = 31; // лог: 'write age = 31'
target.age;     // 31 — изменения ушли в исходный объект`;

  protected readonly emptyHandlerExample = `// пустой handler — прозрачная обёртка: ведёт себя как сам объект
const proxy = new Proxy({ x: 1 }, {});

proxy.x; // 1 — операция просто прошла к target напрямую`;
}
