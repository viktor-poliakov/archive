import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-proxy-reflect-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ProxyReflectPractical {
  protected readonly validationExample = `// проверяем данные при записи
function createUser() {
  return new Proxy({}, {
    set(obj, prop, value) {
      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
        throw new TypeError('age must be a non-negative number');
      }
      obj[prop] = value;
      return true;
    },
  });
}

const user = createUser();
user.age = 30; // ок
user.age = -5; // TypeError: age must be a non-negative number`;

  protected readonly defaultsExample = `// значение по умолчанию для отсутствующих ключей
function withDefault(obj, fallback) {
  return new Proxy(obj, {
    get(target, prop) {
      return prop in target ? target[prop] : fallback;
    },
  });
}

const scores = withDefault({ math: 5 }, 0);
scores.math;    // 5
scores.physics; // 0 — вместо undefined`;

  protected readonly reactiveExample = `// упрощённая реактивность: реагируем на изменения (так работает Vue 3)
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value) {
      target[prop] = value;
      onChange(prop, value); // сообщаем об изменении
      return true;
    },
  });
}

const state = reactive({ count: 0 }, (prop, value) => {
  console.log(\`\${prop} → \${value}\`);
});

state.count = 1; // лог: 'count → 1'`;

  protected readonly negativeIndexExample = `// массив с отрицательными индексами: arr[-1] — последний элемент
function withNegativeIndex(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (index < 0) return target[target.length + index];
      return Reflect.get(target, prop, receiver);
    },
  });
}

const list = withNegativeIndex(['a', 'b', 'c']);
list[-1]; // 'c'
list[0];  // 'a'`;
}
