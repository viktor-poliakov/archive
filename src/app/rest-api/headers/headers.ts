import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-headers',
  imports: [CodeBlock, RouterLink],
  templateUrl: './headers.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiHeaders {
  protected readonly headersExample = `// Заголовки запроса задаются объектом headers.
// Здесь мы сообщаем серверу, что готовы принять ответ в формате JSON.
const res = await fetch('https://api.example.com/articles', {
  headers: { Accept: 'application/json' },
});

// А заголовки, которые прислал сервер, читаются через res.headers:
console.log(res.headers.get('Content-Type')); // 'application/json; charset=utf-8'`;

  protected readonly jsonExample = `{
  "id": 42,
  "name": "Ada Lovelace",
  "isAdmin": false,
  "roles": ["author", "editor"],
  "profile": { "city": "London" }
}`;

  protected readonly jsonJsExample = `// пришёл текст ответа — превращаем его в объект JS
const text = '{"id":42,"name":"Ada Lovelace","roles":["author"]}';
const user = JSON.parse(text);
user.name;      // "Ada Lovelace" — обычное свойство объекта
user.roles[0];  // "author"

// обратно: объект JS -> строка JSON для отправки на сервер
const body = JSON.stringify({ title: "Hello", draft: true });
// body === '{"title":"Hello","draft":true}'`;

  protected readonly fetchHeadersExample = `const res = await fetch("https://api.example.com/articles", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // формат тела, которое мы шлём
    Accept: "application/json",         // формат, который хотим в ответ
    Authorization: "Bearer " + token,   // кто мы такие
  },
  body: JSON.stringify({ title: "Hello", body: "World" }),
});

// fetch сам НЕ парсит JSON — просим его явно
const created = await res.json();`;
}
