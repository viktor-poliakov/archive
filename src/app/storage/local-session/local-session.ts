import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-storage-local-session',
  imports: [CodeBlock, RouterLink],
  templateUrl: './local-session.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StorageLocalSession {
  protected readonly crudExample = `// записать и прочитать (ключ и значение — строки)
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');   // 'dark'
localStorage.getItem('missing'); // null — если ключа нет

localStorage.removeItem('theme'); // удалить одну пару
localStorage.clear();             // удалить всё для этого сайта`;

  protected readonly objectExample = `const settings = { theme: 'dark', fontSize: 14 };

// хранить можно ТОЛЬКО строки → объект сериализуем в JSON
localStorage.setItem('settings', JSON.stringify(settings));

// при чтении — разбираем строку обратно в объект
const saved = JSON.parse(localStorage.getItem('settings'));
saved.fontSize; // 14`;

  protected readonly iterateExample = `localStorage.setItem('a', '1');
localStorage.setItem('b', '2');

localStorage.length; // 2 — сколько пар хранится
localStorage.key(0); // 'a' — ключ по индексу

// перебрать все пары
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}`;

  protected readonly sessionExample = `// API у sessionStorage точно такой же...
sessionStorage.setItem('draft', 'Hello');
sessionStorage.getItem('draft'); // 'Hello'

// ...но данные живут, только пока открыта ЭТА вкладка,
// и в каждой вкладке они свои (в отличие от localStorage)`;

  protected readonly storageEventExample = `// событие storage срабатывает в ДРУГИХ вкладках того же сайта,
// когда localStorage изменили в ЭТОЙ вкладке — удобно синхронизировать вкладки
window.addEventListener('storage', (event) => {
  event.key;      // какой ключ изменился
  event.oldValue; // прежнее значение
  event.newValue; // новое значение
});`;
}
