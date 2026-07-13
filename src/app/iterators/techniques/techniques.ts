import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-techniques',
  imports: [CodeBlock, RouterLink],
  templateUrl: './techniques.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsTechniques {
  protected readonly delegationExample = `function* letters() {
  yield 'a';
  yield 'b';
}
function* numbers() {
  yield 1;
  yield 2;
}
function* both() {
  yield* letters(); // делегируем: перебрать ВЕСЬ letters()
  yield* numbers(); // затем весь numbers()
  yield* [10, 20];  // yield* работает с любым iterable, не только генератором
}

[...both()]; // ['a', 'b', 1, 2, 10, 20]`;

  protected readonly infiniteExample = `// бесконечный генератор НЕ зависнет: значения выдаются
// по одному, только когда их просят
function* naturals() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

const gen = naturals();
gen.next().value; // 1
gen.next().value; // 2
gen.next().value; // 3
// ...можно продолжать сколько угодно`;

  protected readonly takeExample = `// naturals() — тот же бесконечный генератор, что и в примере выше
function* naturals() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

// берём первые n значений даже из БЕСКОНЕЧНОГО итератора — лениво
function* take(n, iterable) {
  let i = 0;
  for (const x of iterable) {
    if (i++ >= n) return; // взяли сколько нужно — останавливаемся
    yield x;
  }
}

[...take(5, naturals())]; // [1, 2, 3, 4, 5] — безопасно: взяли только 5`;

  protected readonly twoWayExample = `function* dialog() {
  const name = yield 'Как тебя зовут?'; // сюда попадёт то, что передали в next()
  yield \`Привет, \${name}!\`;
}

const g = dialog();
g.next().value;      // 'Как тебя зовут?' (первый next доводит до 1-го yield)
g.next('Аня').value; // 'Привет, Аня!' — 'Аня' стала значением name`;
}
