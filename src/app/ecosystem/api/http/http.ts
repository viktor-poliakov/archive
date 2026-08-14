import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-api-http',
  imports: [CodeBlock, RouterLink],
  templateUrl: './http.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemApiHttp {
  protected readonly rawRequest = `GET /api/products?page=2&sort=new HTTP/1.1
Host: shop.ru
Accept: application/json
Accept-Language: ru-RU,ru;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0
Cookie: session=8f3a91c4e7b2d05a
Connection: keep-alive
`;

  protected readonly rawPostRequest = `POST /api/orders HTTP/1.1
Host: shop.ru
Content-Type: application/json
Content-Length: 23
Cookie: session=8f3a91c4e7b2d05a

{"productId":8,"qty":2}`;

  protected readonly rawResponse = `HTTP/1.1 200 OK
Date: Wed, 12 Aug 2026 09:41:03 GMT
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
Set-Cookie: session=8f3a91c4e7b2d05a; Path=/; HttpOnly; Secure; SameSite=Lax

{
  "products": [
    { "id": 8, "name": "Кружка", "price": 490 }
  ],
  "page": 2
}`;

  protected readonly methodsByExample = `// МЕТОД — это глагол запроса. Адрес говорит «с ЧЕМ работаем»,
// метод говорит «ЧТО именно мы хотим с этим сделать».
// Один и тот же адрес + разный метод = совершенно разные действия.

// GET — «покажи». Тела у запроса нет: всё, что нужно сказать,
// пишут прямо в адрес. Поэтому GET-ссылку можно отправить в мессенджере.
await fetch('/api/products?page=2');

// POST — «прими и создай новое». Данные едут в ТЕЛЕ запроса.
// Именно поэтому браузер переспрашивает при обновлении страницы после формы.
await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Кружка', price: 490 }),
});

// PUT — «замени целиком». Вы присылаете вещь ПОЛНОСТЬЮ,
// и всё, что вы не прислали, будет затёрто пустотой. Это важно.
await fetch('/api/products/8', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Кружка большая', price: 590, color: 'белый' }),
});

// PATCH — «поправь только вот это». Присылают ТОЛЬКО изменившиеся поля.
// Остальное остаётся как было. В жизни используется чаще, чем PUT.
await fetch('/api/products/8', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 590 }),
});

// DELETE — «удали». Тело обычно не нужно: что удалять, видно из адреса.
await fetch('/api/products/8', { method: 'DELETE' });

// HEAD — «отдай только заголовки, тело не надо».
// Пригодится, чтобы узнать размер файла, не скачивая сам файл.
const head = await fetch('/files/report.pdf', { method: 'HEAD' });
console.log(head.headers.get('Content-Length'));

// OPTIONS — «а что тут вообще можно?». Этот метод вы почти никогда
// не пишете руками: браузер сам отправляет его перед «непростыми»
// запросами на чужой домен. Про это — в разделе про CORS ниже.`;

  protected readonly idempotencyExample = `// ДВА СЛОВА, КОТОРЫЕ РЕШАЮТ, МОЖНО ЛИ ПОВТОРЯТЬ ЗАПРОС.

// БЕЗОПАСНЫЙ (safe) — запрос НИЧЕГО не меняет на сервере.
// Спросили сто раз — сто раз получили ответ, мир не изменился.
await fetch('/api/products/8');            // GET — безопасный
await fetch('/api/products/8', { method: 'HEAD' });   // тоже безопасный

// ИДЕМПОТЕНТНЫЙ (idempotent) — запрос МЕНЯЕТ данные,
// но результат от десяти одинаковых повторов такой же, как от одного.
// Проверка на пальцах: «повторил — стало ХУЖЕ?»
await fetch('/api/products/8', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Кружка', price: 590 }),
});
// Отправьте это десять раз подряд — цена всё равно станет 590. Один раз.

// А вот POST — НЕ идемпотентный. Каждый повтор создаёт НОВУЮ вещь.
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: 8, qty: 2 }),
});
// Отправили десять раз — получили десять заказов и десять списаний.


// ОТСЮДА ПРАКТИЧЕСКОЕ ПРАВИЛО, КОТОРОЕ СПАСАЕТ ДЕНЬГИ.
// Пользователь нажал «Оплатить» дважды. Или связь моргнула,
// и ваш код автоматически повторил запрос. Что делать?

// Клиент придумывает УНИКАЛЬНЫЙ НОМЕР ПОПЫТКИ и шлёт его с запросом.
const attemptId = crypto.randomUUID();

async function pay(orderId) {
  return fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Ключ идемпотентности — так его называют в платёжных сервисах.
      'Idempotency-Key': attemptId,
    },
    body: JSON.stringify({ orderId, amount: 1290 }),
  });
}

// Сервер запоминает этот ключ. Пришёл второй запрос с тем же ключом —
// он НЕ списывает деньги ещё раз, а возвращает результат первой попытки.
// Мы своими руками сделали неидемпотентный POST идемпотентным.`;

  protected readonly urlAnatomy = `// URL (Uniform Resource Locator, «единообразный указатель ресурса») —
// это адрес. В браузере есть готовый разборщик, им удобно смотреть на части.

const url = new URL('https://shop.ru:443/catalog/8?page=2&sort=new#reviews');

console.log(url.protocol);   // 'https:'   — схема: по каким правилам стучаться
console.log(url.hostname);   // 'shop.ru'  — имя компьютера, который ищем
console.log(url.port);       // ''         — пусто: 443 и так подразумевается
console.log(url.pathname);   // '/catalog/8'      — что именно просим
console.log(url.search);     // '?page=2&sort=new' — уточнения к просьбе
console.log(url.hash);       // '#reviews'         — ЯКОРЬ, и он особенный

// Со строкой запроса удобнее работать не строкой, а через searchParams.
console.log(url.searchParams.get('page'));   // '2'
url.searchParams.set('page', '3');
console.log(url.toString());
// https://shop.ru/catalog/8?page=3&sort=new#reviews


// ГЛАВНЫЙ СЮРПРИЗ ДЛЯ НОВИЧКА: якорь на сервер НЕ УЕЗЖАЕТ.
// Всё, что стоит после решётки, браузер оставляет себе —
// в запросе этого нет вообще. Отсюда два следствия:
//   1. в логах сервера якорь вы не найдёте никогда;
//   2. смена якоря не вызывает новый запрос — этим и живёт
//      маршрутизация вида /#/about в старых одностраничных приложениях.


// А ЕЩЁ ОДНА ЧАСТАЯ ЛОВУШКА — пробелы и русские буквы в адресе.
// Их нельзя вставлять как есть: адрес обязан состоять из безопасных символов.
const query = 'красная кружка';
const safe = '/api/search?q=' + encodeURIComponent(query);
console.log(safe);   // '/api/search?q=%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D0%B0%D1%8F%20...'

// Символы %XX — это и есть «процентное кодирование».
// Сервер раскодирует их обратно сам, вручную ничего делать не надо.`;

  protected readonly headersEveryday = `// Заголовки — это служебные пометки на конверте.
// Их десятки, но в обычной жизни встречаются одни и те же.

// 1. КОГДА МЫ ОТПРАВЛЯЕМ ЗАПРОС — ставим заголовки сами.
const res = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    // «Внутри моего конверта лежит JSON» — иначе сервер не поймёт,
    // как разбирать тело, и вернёт 400 или молча положит undefined.
    'Content-Type': 'application/json',

    // «А в ответ я хочу JSON, а не HTML-страницу».
    Accept: 'application/json',

    // «Вот мой пропуск». Слово Bearer означает «предъявитель»:
    // кто принёс эту строку, тот и считается владельцем.
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9...',
  },
  body: JSON.stringify({ productId: 8, qty: 2 }),
});

// 2. КОГДА ПРИШЁЛ ОТВЕТ — заголовки можно прочитать.
console.log(res.headers.get('Content-Type'));   // 'application/json; charset=utf-8'
console.log(res.headers.get('Cache-Control'));  // 'no-store'

// Часто в заголовки кладут постраничную навигацию или ограничение частоты:
console.log(res.headers.get('X-RateLimit-Remaining'));  // сколько запросов осталось

// Заголовки, которые начинаются с X-, — это самодельные,
// придуманные конкретным сервисом. Стандарт их не описывает.


// ТРИ ЗАГОЛОВКА, КОТОРЫЕ ВЫ НЕ СТАВИТЕ НИКОГДА — ИХ СТАВИТ БРАУЗЕР САМ:
//   Host       — к какому сайту мы обращаемся (сайтов на машине сотни);
//   Cookie     — тот самый пропуск, браузер прикладывает его автоматически;
//   User-Agent — «кто я такой»: марка браузера и система.
// Более того, из кода страницы их подменить нельзя — браузер не даст.`;

  protected readonly statusInCode = `// Код ответа — трёхзначное число. Учить все не надо:
// достаточно понимать смысл ПЕРВОЙ цифры и знать десяток частых.

const res = await fetch('/api/orders/1042');

// ВНИМАНИЕ, ГЛАВНАЯ ЛОВУШКА fetch: он НЕ бросает ошибку на 404 и 500.
// Для fetch «сервер ответил 500» — это успешно доставленный ответ.
// Проверять надо руками:
if (!res.ok) {
  // res.ok — это просто «код в диапазоне 200–299»
  console.log('Сервер ответил кодом', res.status, res.statusText);
}

// РАЗБОР ПО ПЕРВОЙ ЦИФРЕ — она отвечает на вопрос «чья это проблема».
if (res.status >= 200 && res.status < 300) {
  // 2xx — получилось: 200 OK, 201 Created, 204 No Content
}
if (res.status >= 300 && res.status < 400) {
  // 3xx — «ищи в другом месте». Браузер обычно переходит сам,
  // и в коде вы этот случай почти никогда не видите.
}
if (res.status >= 400 && res.status < 500) {
  // 4xx — виноват запрос. Повторять тот же запрос БЕССМЫСЛЕННО.
  //   400 — прислали ерунду         404 — такого нет
  //   401 — «я не знаю, кто вы»     403 — «знаю, и вам нельзя»
  //   409 — конфликт                429 — слишком часто, притормозите
}
if (res.status >= 500) {
  // 5xx — виноват сервер. Вот это повторить как раз МОЖНО:
  //   беда обычно временная, и через пару секунд всё заработает.
}

// Подробный разбор кодов со стороны сервера — на странице «Что делает бэкенд».`;

  protected readonly redirectExample = `GET /tovary HTTP/1.1
Host: shop.ru


HTTP/1.1 301 Moved Permanently
Location: https://shop.ru/catalog
Content-Length: 0


GET /catalog HTTP/1.1
Host: shop.ru`;

  protected readonly cookieExchange = `POST /api/login HTTP/1.1
Host: shop.ru
Content-Type: application/json

{"email":"anna@shop.ru","password":"..."}


HTTP/1.1 200 OK
Set-Cookie: session=8f3a91c4e7b2d05a; Path=/; Max-Age=1209600; HttpOnly; Secure; SameSite=Lax
Content-Type: application/json

{"id":42,"name":"Анна"}


GET /api/orders HTTP/1.1
Host: shop.ru
Cookie: session=8f3a91c4e7b2d05a
Accept: application/json`;

  protected readonly cacheExchange = `GET /assets/app.js HTTP/1.1
Host: shop.ru


HTTP/1.1 200 OK
Content-Type: application/javascript
Cache-Control: public, max-age=31536000, immutable
ETag: "w8f3a1"

...здесь едет весь файл целиком...


GET /assets/app.js HTTP/1.1
Host: shop.ru
If-None-Match: "w8f3a1"


HTTP/1.1 304 Not Modified
ETag: "w8f3a1"`;

  protected readonly deployCacheBusting = `# ПОЧЕМУ ПОСЛЕ ВЫКЛАДКИ ПОЛЬЗОВАТЕЛЬ ВИДИТ СТАРЫЙ САЙТ

# Вы сказали браузеру: «файл app.js можно держать в кэше очень долго».
# Браузер послушался. Вы выложили новую версию — а он даже не переспросил:
# зачем, ему же разрешили не спрашивать целый год.

# РЕШЕНИЕ, КОТОРОЕ ИСПОЛЬЗУЮТ ВСЕ СБОРЩИКИ: имя файла зависит от содержимого.
# Изменился хотя бы один символ кода — изменился и кусок в имени файла.

ls dist/assets/
# app.a1b2c3d4.js       ← вчерашняя сборка
# app.9f8e7d6c.js       ← сегодняшняя: содержимое другое, значит и имя другое
# styles.4b5a6c7d.css

# А в index.html лежит ссылка именно на сегодняшнее имя.
# Получается двухслойная схема:
#   index.html            — кэшировать НЕЛЬЗЯ (Cache-Control: no-cache),
#                           он крошечный и должен приезжать свежим;
#   app.9f8e7d6c.js       — кэшировать МОЖНО хоть на год (immutable),
#                           потому что этот файл уже никогда не изменится.

# Итог: пользователь скачивает маленький index.html, видит в нём новое имя
# и только тогда идёт за новым кодом. Старые файлы просто перестают быть нужны.`;

  protected readonly corsExchange = `OPTIONS /api/orders HTTP/1.1
Host: api.shop.ru
Origin: https://shop.ru
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type


HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shop.ru
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: content-type
Access-Control-Max-Age: 86400


POST /api/orders HTTP/1.1
Host: api.shop.ru
Origin: https://shop.ru
Content-Type: application/json

{"productId":8,"qty":2}


HTTP/1.1 201 Created
Access-Control-Allow-Origin: https://shop.ru
Content-Type: application/json

{"id":1042}`;

  protected readonly curlPractice = `# curl — программа, которая делает ровно то же, что браузер,
# только показывает всё как есть. Она уже стоит на macOS, Linux
# и на современной Windows. Это лучший тренажёр для понимания HTTP.

# 1. САМОЕ ПОЛЕЗНОЕ: показать заголовки запроса и ответа.
#    Строки со стрелкой вправо — что мы отправили.
#    Строки со стрелкой влево — что нам ответили.
curl -v https://shop.ru/api/products

# 2. Только заголовки ответа, без тела (внутри это метод HEAD).
curl -I https://shop.ru/api/products

# 3. Отправить POST с телом в формате JSON.
curl -X POST https://shop.ru/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{"productId":8,"qty":2}'

# 4. Добавить пропуск — заголовок Authorization.
curl https://shop.ru/api/orders \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# 5. Пройти по переадресациям (по умолчанию curl этого НЕ делает —
#    и это отличный способ увидеть 301 своими глазами).
curl -IL http://shop.ru

# 6. Показать только код ответа — удобно для быстрой проверки.
curl -o /dev/null -s -w "%{http_code}\\n" https://shop.ru/api/products

# ЛАЙФХАК ИЗ DEVTOOLS: во вкладке Network нажмите на запросе правой кнопкой
# и выберите Copy as cURL. Браузер выдаст готовую команду со ВСЕМИ
# заголовками и куками. Её можно вставить в терминал и повторить запрос
# ровно так, как его отправила страница. Незаменимо, когда надо понять,
# «а точно ли фронтенд отправил то, что я думаю».`;
}
