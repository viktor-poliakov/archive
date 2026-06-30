import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-closures-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClosuresPractical {
  protected readonly moduleExample = `const counter = (function () {
  let count = 0; // приватное состояние, снаружи не видно

  // наружу отдаём только методы
  return {
    increment() {
      count += 1;
      return count;
    },
    reset() {
      count = 0;
    },
  };
})();

counter.increment(); // 1
counter.increment(); // 2
counter.reset();
counter.increment(); // 1

counter.count; // undefined — напрямую к count не подобраться`;

  protected readonly factoryExample = `function makeAdder(x) {
  // x запоминается в замыкании
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

add5(2);  // 7
add10(2); // 12`;

  protected readonly memoizeExample = `function memoize(fn) {
  const cache = new Map(); // кэш живёт в замыкании между вызовами

  return function (n) {
    if (cache.has(n)) {
      return cache.get(n); // готовый ответ
    }
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const square = memoize((n) => n * n);

square(4); // 16 — вычислено и сохранено
square(4); // 16 — взято из кэша, без повторного счёта`;

  protected readonly onceExample = `function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const init = once(() => {
  console.log('setup done');
  return 42;
});

init(); // печатает 'setup done', возвращает 42
init(); // ничего не печатает, снова возвращает 42`;
}
