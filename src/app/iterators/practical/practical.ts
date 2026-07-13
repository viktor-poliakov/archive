import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-iterators-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class IteratorsPractical {
  protected readonly treeExample = `// обход дерева в глубину одним генератором (yield* для рекурсии)
const tree = {
  value: 1,
  children: [
    { value: 2, children: [] },
    { value: 3, children: [{ value: 4, children: [] }] },
  ],
};

function* walk(node) {
  yield node.value;
  for (const child of node.children) {
    yield* walk(child); // делегируем обход поддерева
  }
}

[...walk(tree)]; // [1, 2, 3, 4]`;

  protected readonly pipelineExample = `// map и filter как ГЕНЕРАТОРЫ: обрабатывают по одному элементу,
// не создавая промежуточных массивов
function* map(iterable, fn) {
  for (const x of iterable) yield fn(x);
}
function* filter(iterable, fn) {
  for (const x of iterable) if (fn(x)) yield x;
}

const result = filter(
  map([1, 2, 3, 4], (x) => x * 10),
  (x) => x > 20,
);

[...result]; // [30, 40]

// как течёт КАЖДЫЙ элемент — сразу через весь конвейер, по одному:
// 1 → ×10 → 10 → 10 > 20? нет → отброшен
// 2 → ×10 → 20 → 20 > 20? нет → отброшен
// 3 → ×10 → 30 → 30 > 20? да  → наружу
// 4 → ×10 → 40 → 40 > 20? да  → наружу`;

  protected readonly asyncIterExample = `// сервер отдаёт данные постранично, например:
// GET /api/list → { items: ['a', 'b'], nextUrl: '/api/list?page=2' }
// GET ?page=2   → { items: ['c', 'd'], nextUrl: null }  // последняя страница

async function* fetchPages(startUrl) {
  let url = startUrl;
  while (url) {
    const res = await fetch(url);
    const page = await res.json();
    yield page.items;   // отдаём порцию — массив записей этой страницы
    url = page.nextUrl; // ссылка на следующую страницу (или null в конце)
  }
}

// fetchPages(...) НЕ качает всё сразу — возвращает асинхронный итератор.
// for await...of на каждом витке просит следующую страницу и ЖДЁТ её:
for await (const items of fetchPages('/api/list')) {
  console.log(items); // 1-й виток: ['a', 'b'];  2-й виток: ['c', 'd']
}`;

  protected readonly exhaustedExample = `function* gen() {
  yield 1;
  yield 2;
}

const g = gen();
[...g]; // [1, 2] — прошли до конца
[...g]; // [] — итератор ИСЧЕРПАН, повторно перебрать нельзя!

// поэтому for...of обычно вызывают на ФУНКЦИИ-генераторе,
// которая при каждом вызове даёт свежий генератор:
[...gen()]; // [1, 2]
[...gen()]; // [1, 2] — новый генератор каждый раз`;
}
