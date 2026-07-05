import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiPitfalls {
  protected readonly namingExample = `# Плохо: глагол в URL, действие "вшито" в путь
POST /createUser
GET  /getUserOrders?userId=42

# Хорошо: URL — это существительное (ресурс),
# а действие задаёт HTTP-метод
POST /users              # создать пользователя
GET  /users/42           # получить пользователя 42
GET  /users/42/orders    # получить заказы пользователя 42
POST /users/42/orders    # создать заказ для пользователя 42`;

  protected readonly versioningExample = `# Версия в пути — самый распространённый вариант
GET /v1/users/42
GET /v2/users/42   # новый формат ответа, старые клиенты живут на v1

# Иногда версию передают в заголовке
GET /users/42 HTTP/1.1
Accept: application/vnd.myapp.v2+json`;

  protected readonly paginationResponseExample = `{
  "data": [
    { "id": 41, "name": "Anna" },
    { "id": 42, "name": "Bob" }
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 137
  }
}`;

  protected readonly errorFormatExample = `{
  "error": {
    "code": "validation_failed",
    "message": "Email is already in use",
    "field": "email"
  }
}`;

  protected readonly errorHandlingExample = `async function createUser(payload) {
  const res = await fetch('/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // fetch НЕ бросает исключение на 4xx/5xx — проверяем сами
  const body = await res.json();
  if (!res.ok) {
    // единый формат: у ошибки всегда есть code и message
    throw new Error(body.error.code + ': ' + body.error.message);
  }
  return body;
}`;

  protected readonly idempotencyExample = `// POST не идемпотентен: два одинаковых запроса = два заказа.
// При обрыве сети клиент не знает, дошёл ли первый запрос.
// Idempotency-Key решает это: клиент придумывает ключ один раз
// и посылает его при каждом повторе.
async function createOrder(payload, idempotencyKey) {
  const res = await fetch('/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey, // например crypto.randomUUID()
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

const key = crypto.randomUUID();
await createOrder({ productId: 7, qty: 1 }, key);
// повтор с тем же ключом сервер распознает и вернёт тот же результат,
// а не создаст второй заказ
await createOrder({ productId: 7, qty: 1 }, key);`;
}
