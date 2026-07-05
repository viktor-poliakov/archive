import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiBasics {
  protected readonly resourceJsonExample = `{
  "id": 42,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "admin",
  "createdAt": "2026-01-15T09:30:00Z"
}`;

  protected readonly collectionJsonExample = `{
  "data": [
    { "id": 42, "name": "Ada Lovelace" },
    { "id": 43, "name": "Alan Turing" }
  ],
  "total": 2
}`;

  protected readonly firstFetchExample = `// GET-запрос на ресурс "пользователь с id 42"
const response = await fetch('https://api.example.com/users/42');

// fetch НЕ считает 404 или 500 ошибкой — проверяем статус сами
if (!response.ok) {
  throw new Error('HTTP ' + response.status);
}

// тело ответа приходит как текст, .json() разбирает его в объект
const user = await response.json();

console.log(user.name); // 'Ada Lovelace'`;
}
