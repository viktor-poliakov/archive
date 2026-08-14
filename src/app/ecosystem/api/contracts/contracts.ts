import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-api-contracts',
  imports: [CodeBlock, RouterLink],
  templateUrl: './contracts.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemApiContracts {
  protected readonly chatPain = `// Диалог, который повторяется в каждой команде мира.
//
//   Фронтенд: «А что придёт, если товара с таким номером нет?»
//   Бэкенд:   «Вроде 404 и объект с полем error»
//   Фронтенд: «А "вроде" — это точно?»
//   Бэкенд:   «Сейчас гляну в код… да, 404, поле error»
//
// Фронтенд пишет код ровно по этому ответу из чата:

async function loadProduct(id) {
  const response = await fetch('/api/products/' + id);

  if (response.status === 404) {
    // Договорились в чате: приходит объект с полем error
    const body = await response.json();
    return { notFound: true, message: body.error };
  }

  return response.json();
}

// ЧЕРЕЗ НЕДЕЛЮ бэкендер «немного причесал» ответы об ошибках.
//   было:  404  и тело  { "error": "Товар не найден" }
//   стало: 404  и тело  { "message": "Товар не найден", "code": "PRODUCT_NOT_FOUND" }
//
// Обратите внимание: код выше НЕ ПАДАЕТ. Он делает хуже — он молчит.
// body.error теперь undefined, и на экране появляется пустое место
// вместо объяснения. Ошибки в консоли нет. Тесты зелёные.
// Об этом узнают из письма в поддержку через две недели.`;

  protected readonly openApiTiny = `# Описание ОДНОГО маршрута на языке OpenAPI. Разберём построчно.

openapi: 3.1.0              # версия САМОГО ФОРМАТА описания, а не вашего API
info:
  title: API магазина       # человеческое имя — попадёт в шапку документации
  version: 1.4.0            # версия ВАШЕГО API — эту цифру двигаете вы сами

paths:                      # дальше идёт перечень всех адресов, какие есть
  /products/{productId}:    # адрес; в фигурных скобках — переменная часть
    get:                    # метод: что именно можно сделать по этому адресу
      summary: Получить один товар
      parameters:
        - name: productId
          in: path          # где искать этот параметр: прямо в адресе
          required: true    # без него обратиться нельзя
          schema:
            type: string    # и это строка, а не число
      responses:
        '200':                        # что вернётся, если всё хорошо
          description: Товар найден
          content:
            application/json:         # в каком формате отдаём
              schema:
                $ref: '#/components/schemas/Product'   # ссылка на описание формы
        '404':                        # а что вернётся, если товара нет —
          description: Товара с таким номером нет     # тот самый вопрос из чата,
          content:                                    # но теперь ответ записан
            application/problem+json:
              schema:
                $ref: '#/components/schemas/Problem'`;

  protected readonly openApiSchemas = `# А вот и сами «формы данных» — они вынесены отдельно,
# чтобы на них можно было ссылаться из любого маршрута.

components:
  schemas:
    Product:
      type: object

      # Строка required — самая важная во всём файле.
      # Это ОБЕЩАНИЕ: перечисленные поля будут в ответе ВСЕГДА.
      # Клиент имеет полное право писать код, полагаясь на это.
      required: [id, title, price, currency]

      properties:
        id:
          type: string
        title:
          type: string
          maxLength: 200
        price:
          type: integer
          description: Цена в копейках, целым числом
        currency:
          type: string
          enum: [RUB, USD, EUR]      # перечень допустимых значений, других нет
        discountPercent:
          type: integer
          minimum: 0
          maximum: 90
          # Этого поля НЕТ в списке required. Значит, оно может не прийти,
          # и клиент обязан это предусмотреть. Не «забыли написать»,
          # а сознательное «может быть, а может и не быть».

    # Рядом, точно так же, описывают и форму ОШИБКИ — схему Problem,
    # на которую ссылался ответ 404 в предыдущем примере.
    # Как она устроена, разбираем ниже, в разделе про единый формат ошибки.`;

  protected readonly codegenPipeline = `# Один и тот же файл openapi.yaml читают РАЗНЫЕ инструменты.
# Вы его написали один раз — а пользы получили четыре штуки.

# 1. ЖИВАЯ ДОКУМЕНТАЦИЯ. Страница со списком адресов и кнопкой
#    «попробовать»: заполнил поля, нажал — увидел настоящий ответ.
#    Её делают Swagger UI, Redoc, Scalar и другие похожие штуки.

# 2. ТИПЫ TYPESCRIPT ДЛЯ ФРОНТЕНДА — одной командой.
npx openapi-typescript ./openapi.yaml -o ./src/api/schema.d.ts

# 3. ГОТОВЫЙ КЛИЕНТ: функция на каждый маршрут, ничего не пишем руками.
npx @openapitools/openapi-generator-cli generate \\
    -i openapi.yaml -g typescript-fetch -o ./src/api

# 4. ЗАГЛУШКА-СЕРВЕР. Поднимает фальшивый сервер прямо из описания:
#    он отвечает выдуманными данными, но ПРАВИЛЬНОЙ ФОРМЫ.
#    Фронтенд начинает работу, не дожидаясь бэкенда.
npx @stoplight/prism-cli mock openapi.yaml

# Изменили описание — перезапустили команды. Всё сходится автоматически.`;

  protected readonly generatedTypes = `// Что появляется в редакторе после генерации типов.
// Обратите внимание: ни одной строчки этих типов никто не писал руками —
// они вытащены из того же openapi.yaml.

import type { paths } from './api/schema';

type Product =
  paths['/products/{productId}']['get']['responses']['200']['content']['application/json'];

async function showProduct(id: string): Promise<void> {
  const product = await getProduct(id);

  console.log(product.title);            // редактор подсказывает поле сам
  console.log(product.titel);            // ← опечатка. Ошибка ПРИ СБОРКЕ,
                                         //   а не пустое место у пользователя

  // А вот это TypeScript не пропустит: поля нет в required,
  // значит оно может отсутствовать, и его надо проверить.
  if (product.discountPercent !== undefined) {
    console.log('Скидка', product.discountPercent, '%');
  }
}

// САМОЕ ЦЕННОЕ ЗДЕСЬ. В тот день, когда бэкенд удалит поле price
// из описания, фронтенд перестанет собираться. Не «сломается у клиента
// через месяц», а именно перестанет собираться — сегодня, у автора правки.`;

  protected readonly breakingExamples = `// БЕЗОПАСНО: добавили НОВОЕ НЕОБЯЗАТЕЛЬНОЕ поле в ответ.
const wasSafe = { id: 'p-1', title: 'Кружка', price: 49000 };
const nowSafe = { id: 'p-1', title: 'Кружка', price: 49000, badge: 'новинка' };
// Старый клиент про badge не знает и просто его не читает. Он и не заметил.


// ЛОМАЕТ: удалили поле, на которое кто-то полагался.
const wasRemoved = { id: 'p-1', title: 'Кружка', price: 49000 };
const nowRemoved = { id: 'p-1', title: 'Кружка' };
// В приложении, которое уже стоит у людей на телефонах, теперь пишет
// «Цена: undefined ₽». Обновить его сегодня же не получится:
// магазин приложений проверяет обновления не один день.


// ЛОМАЕТ: переименовали поле. Это то же удаление, только выглядит невинно.
const wasRenamed = { id: 'p-1', productTitle: 'Кружка' };
const nowRenamed = { id: 'p-1', title: 'Кружка' };
// Для сервера это «навели порядок в именах».
// Для клиента это «поле productTitle исчезло».


// ЛОМАЕТ: поле запроса стало обязательным.
// Было: можно было не присылать warehouseId.
await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ productId: 'p-1', qty: 2 }),
});
// Стало: без warehouseId сервер отвечает 400.
// Все клиенты, написанные до этого дня, разом перестали оформлять заказы.


// ЛОМАЕТ: поменяли тип поля.
const wasType = { id: 501, total: 49000 };      // id — число
const nowType = { id: 'ord_501', total: 49000 }; // id — строка
// Клиентский код с order.id > 500 или с сортировкой по числу
// начинает вести себя странно, но молча.`;

  protected readonly silentBreak = `// САМОЕ ОПАСНОЕ ИЗМЕНЕНИЕ НА СВЕТЕ: имя поля осталось,
// тип поля остался, а СМЫСЛ поменялся.
// Ни один автоматический инструмент такого не поймает.

// Было: price — цена в КОПЕЙКАХ, целым числом.
const oldResponse = { id: 'p-1', price: 49000 };    // это 490 рублей

// Стало: price — цена в РУБЛЯХ. Тип формально тот же, число.
const newResponse = { id: 'p-1', price: 490 };      // это те же 490 рублей

// А клиент делает то, что делал всегда, — переводит копейки в рубли:
const humanPrice = (response.price / 100).toFixed(2);

//   было:  490.00 ₽   — верно
//   стало:   4.90 ₽   — неверно, и НИКАКОЙ ошибки нигде не появится

// Магазин месяц продаёт товары в сто раз дешевле, чем должен,
// а в логах и мониторинге всё зелёное.

// ВЫВОД, который стоит запомнить дословно:
// если смысл поля меняется — заводите НОВОЕ ПОЛЕ С НОВЫМ ИМЕНЕМ.
// Например priceKopecks и priceRub. Пусть некрасиво — зато никто не разорится.`;

  protected readonly additiveOnly = `// ПРАВИЛО «ТОЛЬКО РАСШИРЯТЬ»: старое не трогаем, новое добавляем рядом.
// Три приёма, которых хватает на годы жизни без единой версии.


// ПРИЁМ 1. Не менять старое поле, а положить новое рядом с ним.
res.json({
  id: order.id,
  total: order.totalKopecks,     // старое поле живёт и будет жить
  totalMoney: {                  // новое поле, более правильное
    amount: order.totalKopecks,
    currency: 'RUB',
  },
});
// Старые клиенты читают total и ничего не замечают.
// Новые читают totalMoney. Все довольны, никто не переписывался ночью.


// ПРИЁМ 2. Новый параметр запроса делаем НЕОБЯЗАТЕЛЬНЫМ и даём умолчание.
app.post('/api/orders', async (req, res) => {
  // Старые клиенты про deliveryType ничего не знают и не пришлют его.
  // Умолчание сохраняет ровно то поведение, которое у них было раньше.
  const deliveryType = req.body.deliveryType ?? 'courier';

  const order = await createOrder(req.body.productId, deliveryType);
  res.status(201).json(order);
});
// ГЛАВНОЕ: умолчание должно совпадать со старым поведением.
// Если раньше все заказы были курьерскими — умолчание 'courier', а не 'pickup'.


// ПРИЁМ 3. Переименование без поломки: какое-то время понимаем ОБА имени.

// На входе принимаем и новое, и старое написание:
const phone = req.body.phoneNumber ?? req.body.phone;

// На выходе отдаём оба поля с одинаковым значением:
res.json({
  phone: user.phone,          // старое имя, помечено в описании как устаревшее
  phoneNumber: user.phone,    // новое имя, его и рекомендуем
});

// Через полгода, когда в логах видно, что старое имя больше никто не шлёт,
// его убирают. Не «через полгода примерно», а по журналу обращений.`;

  protected readonly versioningRouter = `// Версия в адресе — тот вариант, который побеждает своей понятностью.
import express from 'express';

const app = express();

const v1 = express.Router();
const v2 = express.Router();

// ВАЖНО: бизнес-логика ОДНА. Версии — это только разные способы
// показать один и тот же заказ наружу.
async function getOrder(id) {
  return db.findOrder(id);       // единственный источник правды
}

v1.get('/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  // Старая форма ответа: сумма одним числом в копейках.
  res.json({ id: order.id, total: order.totalKopecks });
});

v2.get('/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  // Новая форма: сумма объектом, с валютой.
  res.json({
    id: order.id,
    totalMoney: { amount: order.totalKopecks, currency: order.currency },
  });
});

app.use('/api/v1', v1);
app.use('/api/v2', v2);

// ПРИЗНАК БЕДЫ: если у вас появились две копии всей бизнес-логики —
// createOrderV1 и createOrderV2 по четыреста строк каждая, —
// значит версии сделаны неправильно. Различаться должен только
// самый последний, тонкий слой: как превратить данные в ответ.`;

  protected readonly deprecationHeaders = `# Как вежливо предупредить, что старая версия скоро исчезнет.
# Сервер продолжает честно работать, но в КАЖДОМ ответе шепчет об этом.

GET /api/v1/orders/501 HTTP/1.1
Host: api.example.com
Authorization: Bearer …

HTTP/1.1 200 OK
Content-Type: application/json

# «Этот адрес объявлен устаревшим»
Deprecation: true

# «Он перестанет работать вот в этот момент». Дата, а не «когда-нибудь».
Sunset: Thu, 01 Jul 2027 00:00:00 GMT

# Ссылка на инструкцию по переезду — прямо в ответе, искать не надо.
Link: <https://docs.example.com/api/migration-v2>; rel="deprecation"

{"id":501,"total":49000}

# Смысл приёма: разработчик, который подключается к вам сегодня,
# узнаёт о скором отключении СРАЗУ, а не из письма, которое
# ушло на почту уволившегося коллеги полтора года назад.`;

  protected readonly rateLimitHttp = `# КАК ЛИМИТ ВЫГЛЯДИТ ДЛЯ КЛИЕНТА.

# Обычный ответ, пока лимит не исчерпан. Сервер сам сообщает,
# сколько запросов у вас осталось, — гадать не нужно.
HTTP/1.1 200 OK
X-RateLimit-Limit: 100        # всего разрешено в окне
X-RateLimit-Remaining: 42     # осталось прямо сейчас
X-RateLimit-Reset: 37         # через столько секунд счётчик обнулится

# А это ответ, когда лимит исчерпан.
HTTP/1.1 429 Too Many Requests
Retry-After: 12               # ГЛАВНЫЙ заголовок: подождите 12 секунд
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 12
Content-Type: application/problem+json

{
  "type": "https://api.example.com/errors/rate-limit",
  "title": "Слишком много запросов",
  "status": 429,
  "detail": "Разрешено 100 запросов в минуту. Повторите через 12 секунд.",
  "code": "RATE_LIMIT_EXCEEDED"
}

# Про имена заголовков. Написание с приставкой X- сложилось исторически
# и встречается чаще всего. Существует и более новое написание без X-
# (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset).
# Заголовок Retry-After — давняя часть самого HTTP, он есть везде.`;

  protected readonly tokenBucket = `// ВЕДРО С ЖЕТОНАМИ (token bucket) — так лимиты устроены почти везде.
// У каждого клиента своё персональное ведро.

const CAPACITY = 20;        // вместимость ведра — это и есть запас на всплеск
const REFILL_PER_SEC = 5;   // кран: столько жетонов доливается каждую секунду

const buckets = new Map();  // ключ клиента -> состояние его ведра

function takeToken(clientKey) {
  const now = Date.now();
  const bucket = buckets.get(clientKey) ?? { tokens: CAPACITY, updatedAt: now };

  // ШАГ 1. Доливаем жетоны за то время, что прошло с прошлого запроса.
  // Никаких таймеров: просто считаем, сколько бы натекло.
  const secondsPassed = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + secondsPassed * REFILL_PER_SEC);
  bucket.updatedAt = now;

  // ШАГ 2. Хватает ли на один запрос?
  if (bucket.tokens < 1) {
    // Не хватает. Честно считаем, через сколько появится хотя бы один жетон.
    const waitSeconds = Math.ceil((1 - bucket.tokens) / REFILL_PER_SEC);
    buckets.set(clientKey, bucket);
    return { allowed: false, retryAfter: waitSeconds };
  }

  // ШАГ 3. Хватает — забираем жетон и пропускаем.
  bucket.tokens -= 1;
  buckets.set(clientKey, bucket);
  return { allowed: true, remaining: Math.floor(bucket.tokens) };
}

// Промежуточный слой, который вешают перед всеми маршрутами сразу.
app.use((req, res, next) => {
  // Считаем по вошедшему пользователю, а если он не вошёл — по адресу.
  const result = takeToken(req.user?.id ?? req.ip);

  if (!result.allowed) {
    res.set('Retry-After', String(result.retryAfter));
    return res.status(429).json({ code: 'RATE_LIMIT_EXCEEDED' });
  }

  res.set('X-RateLimit-Remaining', String(result.remaining));
  next();
});

// ЧЕСТНОЕ ЗАМЕЧАНИЕ. Здесь ведро лежит в Map, то есть в памяти ОДНОГО
// процесса. А копий сервера обычно несколько, и каждая будет считать
// по-своему — лимит незаметно умножится на число копий.
// В настоящем проекте вёдра держат в общем хранилище, чаще всего в Redis.`;

  protected readonly retryOn429 = `// ЧТО ДЕЛАЕТ ХОРОШИЙ КЛИЕНТ, КОГДА ЕМУ ПРИЛЕТЕЛО 429.

async function requestWithRetry(url, options = {}, attempt = 1) {
  const response = await fetch(url, options);

  // 429 — «слишком часто», 503 — «сервер временно не может».
  // И то и другое имеет смысл повторить.
  // А вот 400 или 403 повторять бессмысленно: само не исправится.
  const worthRetrying = response.status === 429 || response.status === 503;

  if (!worthRetrying || attempt > 5) {
    return response;             // ограничение числа попыток обязательно
  }

  // ШАГ 1. Если сервер сам сказал, сколько ждать, — слушаемся его.
  // Он знает про свои лимиты больше нас.
  const retryAfterSec = Number(response.headers.get('Retry-After'));

  // ШАГ 2. Если не сказал — ждём всё дольше с каждой попыткой:
  // 1 с, 2 с, 4 с, 8 с. Это называется нарастающая пауза (backoff).
  const backoffMs = 1000 * Math.pow(2, attempt - 1);

  // ШАГ 3. Прибавляем случайную добавку — «разброс» (jitter).
  // Без неё тысяча клиентов, получивших 429 в одну секунду,
  // ровно через две секунды дружно придут снова и уронят сервер второй раз.
  const jitterMs = Math.random() * 1000;

  const waitMs = (retryAfterSec > 0 ? retryAfterSec * 1000 : backoffMs) + jitterMs;

  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return requestWithRetry(url, options, attempt + 1);
}

// ЧЕГО ДЕЛАТЬ НЕЛЬЗЯ НИКОГДА:
//   while (true) — повторять сразу и без счётчика попыток.
// Это превращает вашего клиента в маленькую атаку на чужой сервер,
// и вас там заблокируют — по-человечески, руками, надолго.`;

  protected readonly idempotencyClient = `// СТОРОНА КЛИЕНТА.
// Ключ придумывается ОДИН РАЗ на одно намерение пользователя
// и переиспользуется во всех повторах — иначе весь смысл теряется.

async function payOrder(orderId, amount) {
  // Создаём ключ ДО первой отправки. Это просто длинная случайная строка,
  // никакого тайного смысла в ней нет.
  const idempotencyKey = crypto.randomUUID();

  return requestWithRetry('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,     // ← вот он, весь фокус
    },
    body: JSON.stringify({ orderId, amount }),
  });
}

// САМАЯ ЧАСТАЯ ОШИБКА: сгенерировать ключ ВНУТРИ функции повтора.
// Тогда каждая попытка уедет со своим ключом, сервер посчитает их
// разными платежами — и человек заплатит трижды за одну кружку.

// ВТОРАЯ ПО ЧАСТОТЕ ОШИБКА: не сохранить ключ, когда операция долгая.
// Если пользователь обновил страницу и нажал «Оплатить» ещё раз —
// хорошо бы отправить ТОТ ЖЕ ключ. Поэтому ключ иногда кладут
// в локальное хранилище браузера вместе с номером заказа.`;

  protected readonly idempotencyServer = `// СТОРОНА СЕРВЕРА. У ключа три состояния: не видели, в работе, готово.

app.post('/api/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');

  if (!key) {
    // Для денежных операций ключ разумно требовать обязательно.
    return res.status(400).json({ code: 'IDEMPOTENCY_KEY_REQUIRED' });
  }

  // СОСТОЯНИЕ «ГОТОВО». Такой ключ уже отработал —
  // отдаём сохранённый ответ и НИЧЕГО не выполняем заново.
  // Ключ ищем в паре с пользователем: чужой ключ не должен
  // отдать вам чужой платёж.
  const saved = await db.findIdempotentResult(req.user.id, key);
  if (saved) {
    return res.status(saved.status).json(saved.body);
  }

  // СОСТОЯНИЕ «В РАБОТЕ». Занимаем ключ ДО начала работы,
  // чтобы два одновременных повтора не проскочили оба.
  // Надёжнее всего это делает уникальный индекс в базе данных.
  const locked = await db.tryLockIdempotencyKey(req.user.id, key);
  if (!locked) {
    return res.status(409).json({ code: 'REQUEST_IN_PROGRESS' });
  }

  // Только теперь — настоящее списание денег.
  const payment = await chargeCard(req.user, req.body.amount);

  // Запоминаем результат вместе с ключом. Хранят обычно сутки
  // или несколько суток — дольше повторов уже не бывает.
  await db.saveIdempotentResult(req.user.id, key, 201, payment);

  res.status(201).json(payment);
});

// ЕЩЁ ОДНА ТОНКОСТЬ. Хорошо бы сохранять и отпечаток тела запроса.
// Если пришёл тот же ключ, но с ДРУГОЙ суммой — это не повтор,
// а ошибка в клиенте. Правильный ответ на такое — 422, а не тихое
// повторение старого результата.`;

  protected readonly problemJson = `{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Недостаточно средств",
  "status": 402,
  "detail": "Не хватает 1240 рублей для оплаты заказа №501",
  "instance": "/api/v1/orders/501/payment",

  "code": "INSUFFICIENT_FUNDS",
  "requestId": "b0f1c3d4-9a77-4e21-8f0e-2c5b7a1d9e33",

  "errors": [
    {
      "field": "amount",
      "code": "TOO_LARGE",
      "message": "Сумма больше доступного остатка"
    }
  ]
}`;

  protected readonly schemaTests = `// ПРОВЕРКА 1. Тест на стороне сервера:
// ответ обязан совпадать с тем, что обещано в описании.

import Ajv from 'ajv';
import request from 'supertest';
import { productSchema } from './openapi-schemas';

test('GET /products/:id отвечает ровно тем, что обещано в OpenAPI', async () => {
  const response = await request(app).get('/api/products/p-1');

  const validate = new Ajv().compile(productSchema);
  const isValid = validate(response.body);

  // Если кто-то молча убрал поле price — тест покраснеет ЗДЕСЬ,
  // на машине автора правки, а не через месяц в мобильном приложении.
  expect(isValid, JSON.stringify(validate.errors)).toBe(true);
});


// ПРОВЕРКА 2. Контрактный тест между двумя сервисами.
// Смысл: сервис-потребитель записывает свои ожидания в файл,
// а сервис-поставщик прогоняет эти ожидания у себя в тестах.
// Так поставщик узнаёт о поломке ДО выкладки, а не после.
// Самый известный инструмент этого рода называется Pact.

// ПРОВЕРКА 3 — она же самая дешёвая и самая полезная:
// проверка запросов и ответов прямо на границе живого сервера.
// Промежуточный слой сверяет каждый ответ с описанием и, если
// они разошлись, пишет в лог громкое предупреждение.`;

  protected readonly ciDiff = `# ПРОВЕРКА 4. Сравнение старого и нового описания прямо в CI —
# на том шаге, где проверяются изменения перед вливанием в основную ветку.
# Инструмент читает два файла и говорит, что изменилось и опасно ли это.

oasdiff breaking main/openapi.yaml pr/openapi.yaml

# Пример вывода:
#
#   error  [response-property-removed]
#          GET /products/{productId}: из ответа 200 удалено поле 'price'
#
#   warning [response-property-enum-value-added]
#          GET /orders: в поле status добавлено значение 'partially_shipped'
#
# Нашлась хотя бы одна ошибка — сборка падает, и такая правка
# просто не попадает в основную ветку. Человека, который «случайно
# переименовал поле», останавливает машина, а не бдительность коллеги.

# Заметьте: предупреждение про новое значение перечня — не ошибка.
# Машина не может знать, готовы ли клиенты к новому значению.
# Это решение принимает человек — но теперь он хотя бы о нём знает.`;
}
