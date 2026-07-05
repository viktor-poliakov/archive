import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-async-await',
  imports: [CodeBlock, RouterLink],
  templateUrl: './async-await.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesAsyncAwait {
  protected readonly sugarExample = `// то же самое, записанное двумя способами

// 1. через промисы и .then
function loadUser() {
  return fetch('/api/user')
    .then((response) => response.json())
    .then((user) => user.name);
}

// 2. через async/await — читается сверху вниз, как синхронный код
async function loadUserAsync() {
  const response = await fetch('/api/user');
  const user = await response.json();
  return user.name;
}

// обе функции возвращают промис и делают одно и то же`;

  protected readonly returnsPromiseExample = `async function getStatus() {
  return 'ok'; // обычное значение
}

// getStatus() вернула НЕ строку, а промис, исполненный этой строкой
const result = getStatus();
console.log(result); // Promise { <fulfilled>: 'ok' }

// чтобы достать значение — снова await или .then
getStatus().then((value) => console.log(value)); // "ok"

// throw превращается в отклонённый промис
async function fail() {
  throw new Error('Boom');
}
fail().catch((error) => console.log(error.message)); // "Boom"`;

  protected readonly beforeAfterExample = `async function load() {
  console.log('before await'); // выполнится синхронно
  await Promise.resolve();     // точка приостановки
  console.log('after await');  // продолжение — микрозадача
}

console.log('script start');
load();
console.log('script end');

// Порядок вывода:
// "script start"
// "before await"   — всё до await идёт сразу
// "script end"     — управление вернулось наружу
// "after await"    — микрозадача, уже после синхронного кода`;

  protected readonly tryCatchExample = `async function loadProfile(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      // throw попадёт в этот же catch
      throw new Error('Request failed: ' + response.status);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    // ловит и reject от fetch (нет сети), и наш throw
    console.log('Failed to load:', error.message);
    return null; // отдаём запасное значение
  } finally {
    console.log('done'); // выполнится в любом случае
  }
}`;

  protected readonly sequentialExample = `// ПОСЛЕДОВАТЕЛЬНО: второй запрос стартует только после первого
async function loadSequential() {
  const user = await fetch('/api/user');     // ~1 c
  const posts = await fetch('/api/posts');   // ещё ~1 c
  return [user, posts];                       // итого ~2 c
}

// ПАРАЛЛЕЛЬНО: оба запроса стартуют сразу, ждём оба вместе
async function loadParallel() {
  const [user, posts] = await Promise.all([
    fetch('/api/user'),   // стартует сразу
    fetch('/api/posts'),  // стартует сразу
  ]);
  return [user, posts];   // итого ~1 c — по самому долгому
}`;

  protected readonly loopExample = `const ids = [1, 2, 3];

// forEach НЕ ждёт: колбэк async, но его промисы игнорируются
ids.forEach(async (id) => {
  const user = await fetch(\`/api/users/\${id}\`);
  console.log(user); // порядок случайный, ошибки теряются
});
console.log('this runs before the loads finish — forEach does not wait');

// for...of — честно по очереди, один за другим
async function loadInOrder() {
  for (const id of ids) {
    const user = await fetch(\`/api/users/\${id}\`);
    console.log(user); // строго по порядку 1, 2, 3
  }
}

// нужны все сразу и параллельно — map + Promise.all
async function loadAll() {
  const users = await Promise.all(
    ids.map((id) => fetch(\`/api/users/\${id}\`)),
  );
  return users; // порядок сохранён, запросы параллельны
}`;
}
