import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-fetch',
  imports: [CodeBlock, RouterLink],
  templateUrl: './fetch.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiFetch {
  protected readonly signatureExample = `// fetch сразу возвращает Promise<Response>,
// а не готовые данные — сеть отвечает не мгновенно
const promise = fetch('https://api.example.com/users');

console.log(promise); // Promise { <pending> } — ответа ещё нет

// await «дожидается», пока промис выполнится, и достаёт Response
const response = await promise;
console.log(response.status); // 200`;

  protected readonly getExample = `// GET — метод по умолчанию, метод указывать не нужно
async function loadUser(id) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);

  // res.json() тоже возвращает промис: тело читается из потока,
  // поэтому его результат снова нужно await
  const user = await res.json();
  return user;
}

const user = await loadUser(42);
console.log(user.name); // 'Ada Lovelace'`;

  protected readonly postExample = `// POST создаёт новый ресурс. Тело — строка,
// поэтому объект превращаем в JSON через JSON.stringify
async function createUser(payload) {
  const res = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return res.json();
}

const created = await createUser({ name: 'Grace', role: 'admin' });
console.log(created.id); // 101 — сервер вернул созданный ресурс`;

  protected readonly putExample = `// PUT заменяет ресурс целиком. Опции такие же, как у POST,
// меняется только метод и URL (указываем, что именно меняем)
async function replaceUser(id, payload) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return res.json();
}

await replaceUser(42, { name: 'Ada Lovelace', role: 'user' });`;

  protected readonly deleteExample = `// DELETE удаляет ресурс. Тела обычно нет — что удалять,
// понятно из URL. Часто ответ приходит со статусом 204 без тела
async function deleteUser(id) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: 'DELETE',
  });

  return res.ok; // true при статусе 2xx
}

await deleteUser(42); // true`;

  protected readonly curlFetchExample = `// Тот же запрос, что и в curl ниже, но из JavaScript
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Grace', role: 'admin' }),
});
const created = await res.json();`;

  protected readonly curlExample = `# То же самое из терминала. -X задаёт метод,
# -H — заголовок, -d — тело запроса
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Grace","role":"admin"}'`;
}
