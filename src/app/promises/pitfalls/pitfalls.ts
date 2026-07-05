import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesPitfalls {
  protected readonly missingReturnExample = `function loadUser() {
  return fetch('/api/user')
    .then((response) => {
      // ЗАБЫЛИ return — следующий then не дождётся ответа
      response.json();
    })
    .then((user) => {
      console.log(user); // undefined, а не данные
    });
}`;

  protected readonly missingReturnFixedExample = `function loadUser() {
  return fetch('/api/user')
    .then((response) => {
      // с return цепочка ждёт, пока промис от json() выполнится
      return response.json();
    })
    .then((user) => {
      console.log(user); // теперь здесь настоящие данные
    });
}`;

  protected readonly floatingExample = `async function save() {
  // забыли await: код пойдёт дальше, не дождавшись сохранения
  saveToServer(); // "плавающий" промис

  console.log('saved'); // напечатается ДО реального сохранения
}

// если внутри saveToServer произойдёт reject,
// ошибку никто не поймает → unhandledrejection

// правильно: дождаться и дать ошибке всплыть
async function saveFixed() {
  await saveToServer();
  console.log('saved'); // теперь действительно после сохранения
}`;

  protected readonly sequentialExample = `// ПЛОХО: независимые запросы идут по очереди
async function loadDashboard() {
  const user = await fetchUser();     // ждём 300 мс
  const posts = await fetchPosts();   // ещё 300 мс
  const stats = await fetchStats();   // ещё 300 мс
  // итого ~900 мс, хотя запросы не зависят друг от друга
  return { user, posts, stats };
}

// ХОРОШО: запускаем параллельно и ждём все сразу
async function loadDashboardFast() {
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);
  // итого ~300 мс — время самого долгого запроса
  return { user, posts, stats };
}`;

  protected readonly eagerExample = `console.log('before new Promise');

const p = new Promise((resolve) => {
  // этот код выполнится СРАЗУ, ещё до then
  console.log('inside executor');
  resolve('done');
});

console.log('after new Promise');

// Вывод по порядку:
// "before new Promise"
// "inside executor"   ← работа уже пошла
// "after new Promise"`;

  protected readonly forEachExample = `const ids = [1, 2, 3];

// НЕ РАБОТАЕТ: forEach не ждёт await внутри колбэка
ids.forEach(async (id) => {
  await deleteItem(id); // все три уходят разом
});
console.log('done'); // напечатается ДО удалений

// Правильно, если нужно по очереди — for...of:
async function deleteAll() {
  for (const id of ids) {
    await deleteItem(id); // ждём каждый по очереди
  }
  console.log('done'); // теперь действительно после всех
}

// Правильно, если порядок не важен — Promise.all:
async function deleteAllParallel() {
  await Promise.all(ids.map((id) => deleteItem(id)));
  console.log('done');
}`;

  protected readonly swallowedExample = `// ПЛОХО: пустой catch прячет проблему
fetchUser()
  .then((user) => render(user))
  .catch(() => {}); // ошибка исчезла бесследно

// Лучше: хотя бы залогировать и/или показать пользователю
fetchUser()
  .then((user) => render(user))
  .catch((error) => {
    console.error('Failed to load user', error);
    showError('Could not load profile');
  });`;

  protected readonly orderExample = `console.log('1: sync start');

setTimeout(() => console.log('4: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: promise then'));

console.log('2: sync end');

// Вывод:
// "1: sync start"
// "2: sync end"
// "3: promise then"  ← микрозадача, раньше таймера
// "4: setTimeout"    ← макрозадача, в самом конце`;
}
