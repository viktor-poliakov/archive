import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-auth',
  imports: [CodeBlock, RouterLink],
  templateUrl: './auth.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiAuth {
  protected readonly apiKeyExample = `// Вариант 1: ключ в заголовке (так делают чаще)
const res = await fetch('https://api.example.com/reports', {
  headers: {
    'X-API-Key': 'sk_live_8f2c...a91',
  },
});

// Вариант 2: ключ в query-параметре (менее удобно —
// URL попадает в логи серверов и историю браузера)
await fetch('https://api.example.com/reports?api_key=sk_live_8f2c...a91');`;

  protected readonly jwtExample = `// JWT — это три части через точку: header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9.dBjftJeZ4CVP

// Первые две части — просто base64url от JSON.
// header:  { "alg": "HS256", "typ": "JWT" }
// payload: { "sub": "42", "role": "admin", "exp": 1893456000 }

// Третья часть — подпись. Её ставит сервер своим секретом
// и он же проверяет: не подделали ли header и payload.
// Секрет наружу не отдаётся, поэтому клиент подпись подделать не может.`;

  protected readonly bearerRequest = `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.dBjftJeZ4CVP`;

  protected readonly basicExample = `// Basic: строка "login:password" в base64.
// base64('anna:s3cret') === 'YW5uYTpzM2NyZXQ='
Authorization: Basic YW5uYTpzM2NyZXQ=

// base64 — это НЕ шифрование, его тривиально раскодировать.
// Поэтому Basic допустим только поверх HTTPS, где весь
// запрос уже зашифрован на транспортном уровне.`;

  protected readonly fetchTokenExample = `const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.dBjftJeZ4CVP';

const res = await fetch('https://api.example.com/users/42', {
  headers: {
    // схема Bearer + сам токен через пробел
    Authorization: \`Bearer \${token}\`,
    Accept: 'application/json',
  },
});

if (res.status === 401) {
  // токен истёк или недействителен — обновляем и повторяем,
  // либо отправляем пользователя на страницу входа
  throw new Error('Unauthorized');
}

const user = await res.json();`;

  protected readonly refreshExample = `async function requestWithAuth(url) {
  let res = await fetch(url, {
    headers: { Authorization: \`Bearer \${getAccessToken()}\` },
  });

  // access-токен короткоживущий: если истёк — сервер вернёт 401.
  // Пробуем обменять долгоживущий refresh-токен на новый access
  // и повторяем исходный запрос ровно один раз.
  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(url, {
      headers: { Authorization: \`Bearer \${getAccessToken()}\` },
    });
  }

  return res;
}`;
}
