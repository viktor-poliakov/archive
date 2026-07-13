import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-proxy-reflect-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ProxyReflectPitfalls {
  protected readonly identityExample = `const target = {};
const proxy = new Proxy(target, {});

proxy === target; // false — прокси это ОТДЕЛЬНЫЙ объект
// сравнение по ссылке отличает прокси от исходного объекта`;

  protected readonly setReturnExample = `const proxy = new Proxy({}, {
  set(obj, prop, value) {
    obj[prop] = value;
    // забыли вернуть true!
  },
});

proxy.x = 1; // TypeError: 'set' on proxy: trap returned falsish
// ловушки set и deleteProperty ОБЯЗАНЫ вернуть true при успехе`;

  protected readonly invariantExample = `const target = {};
Object.defineProperty(target, 'id', {
  value: 42,
  configurable: false, // свойство «зафиксировано»
  writable: false,
});

const proxy = new Proxy(target, {
  get() {
    return 'fake'; // пытаемся соврать про зафиксированное свойство
  },
});

proxy.id; // TypeError — ловушка не вправе противоречить реальному свойству`;

  protected readonly privateFieldsExample = `class Counter {
  #count = 0;
  increment() {
    return ++this.#count;
  }
}

const proxy = new Proxy(new Counter(), {});

proxy.increment(); // TypeError: доступ к приватному #count не проходит через прокси
// приватные поля (#) привязаны к самому объекту, а прокси — другой объект`;
}
