import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-errors',
  imports: [CodeBlock, RouterLink],
  templateUrl: './errors.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiErrors {
  protected readonly naiveExample = `// НАИВНО и ОПАСНО: считаем, что раз обещание не упало,
// значит всё хорошо. Это не так.
async function loadUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);

  // Сервер вернул 404 "Not Found" — но fetch НЕ бросил ошибку,
  // промис успешно разрешился. res.json() распарсит тело ошибки
  // как будто это пользователь.
  const user = await res.json();
  return user; // вернём { error: "Not found" } вместо реальных данных
}

// catch сработает ТОЛЬКО при сетевом сбое (нет сети, обрыв,
// заблокировано CORS), но НЕ при ответе 404 или 500.
loadUser(999).catch((err) => console.error(err));`;

  protected readonly okCheckExample = `async function loadUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);

  // res.ok === true только для кодов 200–299.
  // Для 3xx, 4xx, 5xx ok будет false — проверяем это ЯВНО.
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
  }

  return res.json();
}`;

  protected readonly byStatusExample = `async function request(url, options) {
  const res = await fetch(url, options);
  if (res.ok) return res.json();

  switch (res.status) {
    case 400: {
      // Тело обычно содержит детали валидации — покажем их пользователю
      const body = await res.json();
      throw new ValidationError(body.errors);
    }
    case 401:
      // Токен протух — обновляем его или отправляем на логин
      await refreshToken();
      throw new UnauthorizedError();
    case 403:
      throw new Error('Forbidden: insufficient permissions');
    case 404:
      throw new Error('Resource not found');
    case 409:
      throw new Error('Conflict: resource changed, refresh your data');
    case 429: {
      // Слишком много запросов — сервер говорит, сколько ждать
      const retryAfter = res.headers.get('Retry-After');
      throw new RateLimitError(retryAfter);
    }
    default:
      if (res.status >= 500) {
        // Сбой на стороне сервера — такой запрос можно повторить
        throw new ServerError(res.status);
      }
      throw new Error(\`Необработанный статус: \${res.status}\`);
  }
}`;

  protected readonly networkExample = `async function safeRequest(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // Сюда попадаем ТОЛЬКО при сетевом сбое: нет соединения,
    // DNS не разрешился, обрыв, запрос заблокирован CORS.
    // Ответа от сервера нет вообще.
    throw new Error('Network unavailable, please retry', { cause: err });
  }

  // Ответ пришёл — теперь отдельно разбираем его статус.
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}\`);
  }
  return res.json();
}`;

  protected readonly retryExample = `// Повторяем ТОЛЬКО идемпотентные запросы (GET, PUT, DELETE)
// и только на кодах 429 и 503 — повторять POST опасно (создаст дубль).
async function retry(fn, { attempts = 4, baseDelay = 500 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const last = i === attempts - 1;
      // Повторяем только то, что имеет смысл повторять
      if (last || !isRetryable(err)) throw err;

      // Экспоненциальная задержка: 500, 1000, 2000, 4000 мс…
      // + случайный "джиттер", чтобы клиенты не били сервер разом.
      const delay = baseDelay * 2 ** i + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function isRetryable(err) {
  return err.status === 429 || err.status === 503 || err.network === true;
}`;

  protected readonly retryAfterExample = `// Сервер прислал Retry-After — уважаем его и ждём именно столько.
// Значение бывает в секундах ("120") или как HTTP-дата.
function retryAfterMs(headerValue) {
  if (!headerValue) return null;

  const seconds = Number(headerValue);
  if (!Number.isNaN(seconds)) {
    return seconds * 1000; // формат "120" — секунды
  }

  const date = Date.parse(headerValue); // формат HTTP-даты
  if (!Number.isNaN(date)) {
    return Math.max(0, date - Date.now());
  }
  return null;
}`;

  protected readonly apiFetchExample = `// Единый надёжный помощник: таймаут, проверка ok, разбор тела
// и осмысленные ошибки. Через него удобно делать все запросы.
class ApiError extends Error {
  constructor(status, body) {
    super(\`HTTP \${status}\`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body; // разобранное тело ошибки от сервера
  }
}

async function apiFetch(url, { timeout = 8000, ...options } = {}) {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeout),
    });
  } catch (err) {
    // Нет ответа: сеть или таймаут. Помечаем как сетевую ошибку.
    throw new Error('Request did not reach the server', { cause: err });
  }

  // Разбираем тело по заголовку Content-Type: JSON или текст.
  const type = res.headers.get('Content-Type') ?? '';
  const body = type.includes('application/json')
    ? await res.json()
    : await res.text();

  // Есть ответ, но статус неуспешный — это ошибка приложения.
  if (!res.ok) {
    throw new ApiError(res.status, body);
  }
  return body;
}

// Использование
try {
  const user = await apiFetch('/api/users/42');
  console.log(user.name);
} catch (err) {
  if (err.name === 'ApiError' && err.status === 404) {
    console.log('User not found');
  } else {
    console.log('Something went wrong:', err.message);
  }
}`;
}
