import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-http',
  imports: [CodeBlock, RouterLink],
  templateUrl: './http.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiHttp {
  protected readonly rawRequest = `GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
User-Agent: my-app/1.0

`;

  protected readonly rawPostRequest = `POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 48

{"name": "Anna", "email": "anna@example.com"}`;

  protected readonly urlParts = `https://api.example.com/users/42?fields=name,email#top
\\___/   \\_____________/\\_______/\\________________/\\__/
схема        хост         путь        query     fragment`;

  protected readonly endpoints = `// Коллекция ресурсов: список всех пользователей
GET /users

// Один элемент коллекции по идентификатору
GET /users/42

// Query-параметры: фильтр и пагинация (не меняют путь к ресурсу)
GET /users?role=admin&page=2&limit=20

// Вложенный ресурс: заказы конкретного пользователя
GET /users/42/orders`;

  protected readonly rawResponse = `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 62
Cache-Control: max-age=60

{"id": 42, "name": "Anna", "email": "anna@example.com"}`;

  protected readonly fetchExample = `// fetch отправляет запрос и возвращает промис с ответом
const response = await fetch('https://api.example.com/users/42', {
  headers: { Accept: 'application/json' },
});

console.log(response.status);     // 200      — код из статусной строки
console.log(response.statusText); // 'OK'      — текст из статусной строки
console.log(response.ok);         // true      — код в диапазоне 200–299

// Тело приходит отдельно: его надо прочитать и разобрать
const user = await response.json(); // { id: 42, name: 'Anna', ... }`;

  protected readonly fullExchange = `>>> Запрос (клиент → сервер)
GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/json

<<< Ответ (сервер → клиент)
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id": 42, "name": "Anna", "email": "anna@example.com"}`;
}
