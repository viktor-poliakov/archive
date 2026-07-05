import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-query-params',
  imports: [CodeBlock, RouterLink],
  templateUrl: './query-params.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiQueryParams {
  protected readonly anatomyExample = `GET /users?page=2&limit=20&search=ada HTTP/1.1
Host: api.example.com

# ?           — начинается query-строка
# page=2      — пара ключ=значение
# &           — разделитель между парами
# limit=20    — ещё одна пара
# search=ada  — и ещё одна`;

  protected readonly encodingExample = `const search = 'ada lovelace & co';

// ПЛОХО: склеили руками. Пробел и '&' ломают URL — сервер решит,
// что после "& co" начался новый, мусорный параметр.
const bad = \`https://api.example.com/users?q=\${search}\`;
// .../users?q=ada lovelace & co   ← невалидно

// ХОРОШО: encodeURIComponent кодирует все опасные символы
const good = \`https://api.example.com/users?q=\${encodeURIComponent(search)}\`;
// .../users?q=ada%20lovelace%20%26%20co`;

  protected readonly urlSearchParamsExample = `// URLSearchParams сам кодирует пробелы и спецсимволы,
// поэтому руками собирать строку с '?' и '&' не нужно
const params = new URLSearchParams({
  page: '2',
  limit: '20',
  search: 'ada lovelace',
});

// параметры можно менять и после создания
params.set('limit', '50');      // заменит значение ключа
params.append('role', 'admin'); // добавит ещё одну пару

const url = \`https://api.example.com/users?\${params}\`;
// https://api.example.com/users?page=2&limit=50&search=ada+lovelace&role=admin

const res = await fetch(url);
const list = await res.json();`;

  protected readonly arrayParamsExample = `// Один и тот же ключ может встречаться несколько раз
const params = new URLSearchParams();
params.append('tag', 'js');
params.append('tag', 'web');
params.toString(); // 'tag=js&tag=web'

// При чтении get() вернёт только первое значение, getAll() — все
const parsed = new URLSearchParams('tag=js&tag=web');
parsed.get('tag');    // 'js'
parsed.getAll('tag'); // ['js', 'web']

// ВНИМАНИЕ: единого стандарта для массивов нет — бэкенды ждут разное:
//   ?tag=js&tag=web       повтор ключа (самый частый вариант)
//   ?tag[]=js&tag[]=web   с квадратными скобками
//   ?tag=js,web           через запятую
// Формат всегда уточняйте по документации своего API.`;

  protected readonly paginationExample = `# Пагинация: отдаём страницу, а не всю коллекцию
GET /users?page=2&limit=20

# То же через смещение вместо номера страницы
GET /users?offset=20&limit=20

# Фильтрация: сузить выборку по полям
GET /users?status=active&role=admin

# Сортировка: минус = по убыванию, плюс/без знака = по возрастанию
GET /users?sort=-createdAt

# Всё вместе — параметры свободно комбинируются
GET /users?status=active&sort=-createdAt&page=1&limit=20`;

  protected readonly parseExample = `// Прочитать параметры из текущего адреса (полезно в SPA)
const url = new URL(location.href);
const page = url.searchParams.get('page') ?? '1';
const tags = url.searchParams.getAll('tag');

// Тот же разбор работает и для произвольной строки
const sp = new URLSearchParams('?page=2&limit=20');
sp.get('page');         // '2'  — значение ВСЕГДА строка
Number(sp.get('page')); // 2    — число получаем сами
sp.has('limit');        // true`;
}
