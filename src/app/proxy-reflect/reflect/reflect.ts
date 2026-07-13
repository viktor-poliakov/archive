import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-proxy-reflect-reflect',
  imports: [CodeBlock, RouterLink],
  templateUrl: './reflect.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ProxyReflectReflect {
  protected readonly basicExample = `const user = { name: 'Anna' };

// методы Reflect дублируют операции над объектами, но как обычные функции:
Reflect.get(user, 'name');           // 'Anna'  (то же, что user.name)
Reflect.set(user, 'age', 30);        // true    (то же, что user.age = 30)
Reflect.has(user, 'name');           // true    (то же, что 'name' in user)
Reflect.ownKeys(user);               // ['name', 'age']
Reflect.deleteProperty(user, 'age'); // true    (то же, что delete user.age)`;

  protected readonly inTrapExample = `// имена методов Reflect совпадают с именами ловушек 1:1.
// внутри ловушки Reflect даёт «поведение по умолчанию» одной строкой:
const proxy = new Proxy({ name: 'Anna' }, {
  get(target, prop, receiver) {
    console.log(\`read \${prop}\`);
    return Reflect.get(target, prop, receiver); // передать дальше как обычно
  },
});

proxy.name; // лог: 'read name', вернёт 'Anna'`;

  protected readonly receiverExample = `const target = {
  firstName: 'Anna',
  lastName: 'Smith',
  get fullName() {
    return \`\${this.firstName} \${this.lastName}\`;
  },
};

const proxy = new Proxy(target, {
  get(obj, prop, receiver) {
    // receiver — это сам proxy; передаём его в Reflect,
    // чтобы геттер внутри видел правильный this
    return Reflect.get(obj, prop, receiver);
  },
});

proxy.fullName; // 'Anna Smith'`;

  protected readonly statusExample = `// для операций, которые могут НЕ удаться (set, delete...),
// Reflect возвращает СТАТУС (true/false) вместо исключения
const frozen = Object.freeze({ x: 1 });

Reflect.set(frozen, 'x', 2); // false — записать не удалось (без ошибки)
frozen.x;                    // 1

// сравните: frozen.x = 2 в строгом режиме бросило бы TypeError`;
}
