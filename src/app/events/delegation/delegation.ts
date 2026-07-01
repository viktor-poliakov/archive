import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-delegation',
  imports: [CodeBlock, RouterLink],
  templateUrl: './delegation.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsDelegation {
  protected readonly delegationExample = `const menu = document.querySelector('#menu');

// ОДИН обработчик на весь список вместо обработчика на каждый пункт
menu.addEventListener('click', (event) => {
  // ищем ближайший li вверх от места клика (клик мог попасть внутрь пункта)
  const item = event.target.closest('li');
  if (!item || !menu.contains(item)) return; // клик мимо пунктов — выходим

  console.log('clicked item:', item.dataset.id);
});`;

  protected readonly dynamicExample = `// добавляем новый пункт уже ПОСЛЕ установки обработчика
const li = document.createElement('li');
li.dataset.id = '42';
li.textContent = 'New item';
menu.append(li);

// клик по нему сработает без навешивания нового обработчика:
// событие всплывёт до menu, где обработчик уже есть`;

  protected readonly behaviorExample = `// «Поведение» через data-атрибуты: один обработчик на весь документ
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-counter]');
  if (!button) return;

  button.value = Number(button.value) + 1; // +1 к счётчику
});

// теперь любая такая кнопка работает без собственного JS:
// <input type="button" value="0" data-counter>`;
}
