import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiMethods {
  protected readonly getExample = `// GET — прочитать ресурс. Это метод по умолчанию,
// поэтому в fetch его можно не указывать.
const res = await fetch('https://api.example.com/users/42');
const user = await res.json(); // разбираем JSON-тело ответа в объект

console.log(res.status); // 200
console.log(user);       // { id: 42, name: 'John', role: 'admin' }`;

  protected readonly postExample = `// POST — создать новый ресурс. Данные едут в теле (body),
// а его формат объявляем заголовком Content-Type.
// Запрос идёт на коллекцию /users — id новому элементу присвоит сервер.
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', role: 'admin' }),
});

const created = await res.json();
console.log(res.status); // 201 — ресурс создан
console.log(created.id); // 42  — id присвоил сервер`;

  protected readonly putExample = `// PUT — заменить ресурс ЦЕЛИКОМ. В теле — полный объект;
// поля, которые не прислали, сервер затрёт.
await fetch('https://api.example.com/users/42', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Doe', role: 'user' }),
});`;

  protected readonly patchExample = `// PATCH — обновить ЧАСТИЧНО: шлём только изменяемые поля,
// остальное сервер оставит как было.
await fetch('https://api.example.com/users/42', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'user' }), // меняем только роль
});`;

  protected readonly deleteExample = `// DELETE — удалить ресурс. Тела запроса обычно нет.
const res = await fetch('https://api.example.com/users/42', {
  method: 'DELETE',
});

console.log(res.status); // 204 — удалено, тела в ответе нет`;

  protected readonly curlExample = `# GET — получить (флаги не нужны, это метод по умолчанию)
curl https://api.example.com/users/42

# POST — создать, тело в -d, тип в заголовке
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "John", "role": "admin" }'

# PUT — заменить ресурс целиком
curl -X PUT https://api.example.com/users/42 \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "John", "role": "user" }'

# DELETE — удалить
curl -X DELETE https://api.example.com/users/42`;

  protected readonly putVsPatchExample = `// Исходный ресурс на сервере:
// { "id": 42, "name": "John", "role": "admin", "active": true }

// PUT — прислать ПОЛНОЕ новое представление.
// Всё, что не указали, будет затёрто (здесь пропали role и active):
PUT /users/42
{ "name": "John Doe" }
// Результат: { "id": 42, "name": "John Doe" }

// PATCH — прислать ТОЛЬКО изменяемые поля.
// Остальное остаётся как было:
PATCH /users/42
{ "name": "John Doe" }
// Результат: { "id": 42, "name": "John Doe", "role": "admin", "active": true }`;

}
