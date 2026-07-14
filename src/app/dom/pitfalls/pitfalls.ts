import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomPitfalls {
  protected readonly xssExample = `// пришло от пользователя (комментарий, имя и т.п.)
const comment = '<img src=x onerror="alert(document.cookie)">';

// ОПАСНО: innerHTML выполнит вредоносную разметку (атака XSS)
box.innerHTML = comment;

// БЕЗОПАСНО: textContent покажет это как обычный текст
box.textContent = comment;`;

  protected readonly nullExample = `const el = document.querySelector('.maybe-missing');
// если такого элемента нет — el === null

el.textContent = 'Hi'; // TypeError: Cannot set properties of null

// сначала проверяем результат поиска
if (el) {
  el.textContent = 'Hi';
}`;

  protected readonly liveCollectionExample = `const live = document.getElementsByTagName('li'); // ЖИВАЯ коллекция
const snapshot = document.querySelectorAll('li');  // статический снимок

live.length;     // 3
snapshot.length; // 3

document.querySelector('ul').append(document.createElement('li'));

live.length;     // 4 — обновилась сама!
snapshot.length; // 3 — снимок не меняется`;

  protected readonly liveLoopExample = `// на странице 4 элемента с class="item": A, B, C, D
const items = document.getElementsByClassName('item'); // живая коллекция

for (let i = 0; i < items.length; i++) {
  items[i].remove();
}

// почему пропускает — по шагам (после каждого remove коллекция сдвигается):
// i=0: items[0] = A → удалили. Осталось [B, C, D], B сдвинулся на индекс 0
// i=1: items[1] = C → удалили. B (теперь на индексе 0) ПЕРЕПРЫГНУЛИ. Осталось [B, D]
// i=2: длина уже 2, условие 2 < 2 ложно → цикл остановился
// ИТОГ: удалены A и C, а B и D остались — половина пропущена!

// надёжно: снять статический снимок — он не меняется во время перебора
document.querySelectorAll('.item').forEach((el) => el.remove()); // удалит ВСЕ`;

  protected readonly reflowExample = `const list = document.querySelector('ul');

// МЕДЛЕННО: тысяча отдельных правок живого дерева
for (let i = 0; i < 1000; i++) {
  list.append(document.createElement('li'));
}

// БЫСТРО: собрать во фрагменте и вставить один раз
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  fragment.append(document.createElement('li'));
}
list.append(fragment); // одна вставка в дерево вместо тысячи`;

  protected readonly whitespaceExample = `// <ul>
//   <li>a</li>
//   <li>b</li>
// </ul>
const ul = document.querySelector('ul');

ul.childNodes.length; // 5 — переносы строк это тоже текстовые узлы!
ul.children.length;   // 2 — а среди элементов только два <li>`;
}
