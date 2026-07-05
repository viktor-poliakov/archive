import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-cancellation',
  imports: [CodeBlock, RouterLink],
  templateUrl: './cancellation.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiCancellation {
  protected readonly abortBasicExample = `// Контроллер создаёт сигнал и умеет его "дёрнуть".
const controller = new AbortController();

// Передаём сигнал в fetch...
const promise = fetch('https://api.example.com/big-report', {
  signal: controller.signal,
});

// ...и в любой момент обрываем запрос
controller.abort();

// Промис fetch тут же отклонится ошибкой с именем 'AbortError'.
// Контроллер одноразовый: для нового запроса нужен новый AbortController.`;

  protected readonly abortCatchExample = `async function load(url, signal) {
  try {
    const res = await fetch(url, { signal });
    return await res.json();
  } catch (err) {
    // Отмена — это НЕ сбой сети. Обычно её пользователю не показывают:
    // он сам ушёл со страницы или начал новый поиск.
    if (err.name === 'AbortError') {
      console.log('Request cancelled');
      return null;
    }
    throw err; // всё остальное — настоящие ошибки, пробрасываем дальше
  }
}`;

  protected readonly timeoutSignalExample = `// Способ 1: короткий и современный — AbortSignal.timeout(ms).
// Сигнал сам сработает через заданное время и оборвёт запрос.
async function fetchWithTimeout(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return await res.json();
  } catch (err) {
    // При таймауте fetch реджектит промис ошибкой с именем 'TimeoutError'
    if (err.name === 'TimeoutError') {
      throw new Error('Server did not respond within 5 seconds');
    }
    throw err;
  }
}

// Способ 2: ручной таймер + AbortController — если запрос нужно
// отменять не только по времени, но и по другим причинам.
async function fetchManual(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer); // не забываем убрать таймер
  }
}`;

  protected readonly anySignalExample = `// AbortSignal.any объединяет несколько сигналов в один:
// сработает первый из них. Удобно совместить ручную отмену и таймаут.
const controller = new AbortController();

const res = await fetch(url, {
  signal: AbortSignal.any([
    controller.signal,          // пользователь нажал "Отмена"
    AbortSignal.timeout(5000),  // ...или прошло 5 секунд
  ]),
});

// Отменить вручную по-прежнему можно через controller.abort()`;

  protected readonly searchRaceExample = `// Живой поиск: на каждый ввод летит запрос. Ответы могут прийти
// не по порядку — медленный ответ на "ab" затрёт быстрый на "abc".
// Решение: перед новым запросом отменяем предыдущий.
let currentController = null;

async function search(query) {
  // Отменяем прошлый запрос, если он ещё летит
  currentController?.abort();

  const controller = new AbortController();
  currentController = controller;

  try {
    const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null; // отменили — это норма
    throw err;
  }
}`;

  protected readonly unmountExample = `// Одним контроллером можно оборвать и запрос, и подписки на события —
// сигнал принимает не только fetch, но и addEventListener.
const controller = new AbortController();
const { signal } = controller;

fetch('/api/data', { signal }).then(handleData);
window.addEventListener('resize', onResize, { signal });

// При уходе со страницы / размонтировании компонента один вызов
// снимает и запрос, и слушатель события:
function cleanup() {
  controller.abort();
}`;
}
