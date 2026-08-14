import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-api-webhooks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './webhooks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemApiWebhooks {
  protected readonly pollingPain = `// СЦЕНА. Человек нажал «Оплатить». Его увели на страницу банка.
// Деньги где-то в пути. Банк ответит «прошло» через две секунды.
// Или через минуту. Или через три. Заранее не знает никто, включая банк.

// СПОСОБ ПЕРВЫЙ, САМЫЙ ОЧЕВИДНЫЙ: спрашивать банк в цикле, пока не ответит.

async function waitForPayment(paymentId) {
  // Спрашиваем раз в три секунды и не дольше пяти минут.
  const maxAttempts = 100;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Каждая строчка ниже — это настоящий поход по сети к чужому серверу.
    const payment = await bankApi.getPayment(paymentId);

    if (payment.status === 'succeeded') {
      await markOrderPaid(payment.orderId);
      return;
    }

    if (payment.status === 'failed') {
      await markOrderFailed(payment.orderId);
      return;
    }

    // Ничего не изменилось. Спим и спрашиваем ещё раз. И ещё. И ещё.
    await sleep(3000);
  }
}

// ЧЕМ ЭТО ПЛОХО — по пунктам, чтобы было видно всю картину:
//
// 1. Если банк ответил на сороковой секунде, то из четырнадцати запросов
//    полезным оказался ровно один. Остальные тринадцать — впустую.
//
// 2. Узнаём мы не в момент события, а ДО ТРЁХ СЕКУНД ПОСЛЕ него.
//    Хотите узнавать быстрее — спрашивайте чаще, то есть мусорьте сильнее.
//
// 3. Чужие сервисы считают ваши запросы. За лишние либо берут деньги,
//    либо в какой-то момент отвечают 429 «слишком часто» и перестают отвечать.
//
// 4. Всё это время в памяти вашего сервера живёт функция, которая
//    не обслуживает никого — она просто ждёт.
//
// 5. Самое неприятное: если сервер перезапустится в середине ожидания
//    (выложили новую версию, обновили систему), цикл исчезнет вместе
//    с процессом. Про этот платёж не узнает уже никто и никогда.`;

  protected readonly returnUrlPain = `// СПОСОБ ВТОРОЙ: дождаться, пока банк вернёт человека обратно на наш сайт.
// Банку при создании платежа дают адрес возврата.

const payment = await bankApi.createPayment({
  amount: 349000,
  orderId: '1042',
  returnUrl: 'https://shop.example.com/orders/1042/thanks',
});

// А у нас есть страница, на которую человек и приземлится:
app.get('/orders/:id/thanks', async (req, res) => {
  // Соблазн: «раз он тут, значит оплатил» — и отметить заказ оплаченным.
  await db.markOrderPaid(req.params.id);   // ← ОЧЕНЬ ПЛОХАЯ ИДЕЯ
  res.render('thanks');
});

// ПОЧЕМУ ЭТО НЕ РАБОТАЕТ. Возврат зависит от ЧЕЛОВЕКА и его браузера,
// а деньги от человека уже не зависят. Достаточно любой мелочи:
//
//   • он закрыл вкладку сразу после ввода кода из смс;
//   • в метро пропала связь ровно на возврате;
//   • телефон разрядился;
//   • браузер открыл платёж в новом окне, а старое человек уже закрыл;
//   • он честно вернулся, но по дороге нажал «назад».
//
// Во всех этих случаях деньги СПИСАНЫ, а заказ у вас не оплачен.
// И наоборот: адрес возврата видно в браузере, его может открыть кто угодно
// вручную — и получить оплаченный заказ, не заплатив ни рубля.
//
// ВЫВОД: страница возврата годится ровно для одного — сказать человеку
// «спасибо, ждём подтверждения». Менять состояние заказа по ней нельзя.`;

  protected readonly eventBody = `{
  "id": "evt_1Pxk29Cz8QhT4m",
  "type": "payment.succeeded",
  "created_at": "2026-04-11T09:14:02Z",
  "data": {
    "payment_id": "pay_7bC1xR",
    "order_id": "1042",
    "amount": 349000,
    "currency": "RUB",
    "status": "succeeded",
    "paid_at": "2026-04-11T09:14:01Z",
    "payment_method": "card",
    "card_last4": "4242"
  }
}`;

  protected readonly firstHandler = `import express from 'express';

const app = express();
app.use(express.json());

// ЭТО САМЫЙ ОБЫЧНЫЙ МАРШРУТ. Точно такой же, как /api/products.
// В вебхуке нет ничего волшебного: это POST-запрос, который просто
// прислали не вы. Единственное отличие от привычного вам маршрута —
// сюда стучится не браузер вашего пользователя, а чужая программа.
app.post('/webhooks/payments', (req, res) => {
  const event = req.body;

  console.log('Пришло событие:', event.type, event.id);

  // Событий у платёжного сервиса обычно несколько десятков,
  // а интересуют нас два-три. Остальные спокойно игнорируем.
  if (event.type === 'payment.succeeded') {
    console.log('Оплачен заказ номер', event.data.order_id);
  }

  // ОТВЕТИТЬ ОБЯЗАТЕЛЬНО. Молчание отправитель считает неудачной доставкой
  // и через некоторое время пришлёт это же событие ещё раз.
  res.sendStatus(200);
});

app.listen(3000);

// Работает ли этот код? Да, работает.
// Можно ли его так оставить? КАТЕГОРИЧЕСКИ НЕТ.
// Почему — в следующем разделе. Это самый важный раздел страницы.`;

  protected readonly fakeEvent = `# Адрес вашего обработчика — НЕ ТАЙНА. Его видно в личном кабинете сервиса,
# он попадает в скриншоты, в переписку в чате, в код на GitHub, в логи.
# А теперь смотрите, что может сделать человек, который его узнал.
# Одна команда из терминала — и у вас «оплачен» заказ, за который не платили:

curl -X POST https://shop.example.com/webhooks/payments \\
  -H "Content-Type: application/json" \\
  -d '{"id":"evt_fake","type":"payment.succeeded","data":{"order_id":"1042","amount":349000}}'

# Заметьте: ему не нужно ничего взламывать. Не нужен доступ к вашей базе,
# не нужен пароль, не нужно быть вашим пользователем. Достаточно знать
# адрес и примерно догадываться о формате — а формат описан
# в публичной документации платёжного сервиса.

# Вывод, который стоит повесить над рабочим столом:
# ОБРАБОТЧИК ВЕБХУКА БЕЗ ПРОВЕРКИ ПОДПИСИ — ЭТО ПУБЛИЧНАЯ КНОПКА
# «СЧИТАТЬ ЛЮБОЙ ЗАКАЗ ОПЛАЧЕННЫМ», ВЫСТАВЛЕННАЯ В ИНТЕРНЕТ.`;

  protected readonly verifySignature = `import express from 'express';
import crypto from 'node:crypto';

const app = express();

// Секрет вы взяли в личном кабинете сервиса и положили в переменную окружения.
// Это длинная случайная строка, которую знают ровно двое: отправитель и вы.
// По сети она НИКОГДА не ездит — ни в заголовке, ни в теле, нигде.
const WEBHOOK_SECRET = process.env.PAYMENTS_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('Не задан PAYMENTS_WEBHOOK_SECRET — сервер не запускается');
}

app.post(
  '/webhooks/payments',

  // ЛОВУШКА ПЕРВАЯ. Подпись считают по СЫРОМУ телу — байт в байт,
  // ровно как оно приехало по сети. Поэтому здесь стоит express.raw,
  // а не express.json: нам нужны исходные байты, а не разобранный объект.
  express.raw({ type: 'application/json' }),

  (req, res) => {
    const rawBody = req.body;                          // это Buffer с байтами
    const theirSignature = req.get('X-Signature') || '';

    // Считаем свой отпечаток: тем же алгоритмом, тем же секретом,
    // по тем же самым байтам. Если у отправителя тот же секрет —
    // строка получится символ в символ такая же.
    const ourSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (!safeCompare(ourSignature, theirSignature)) {
      // Не совпало. Это не наш отправитель — или тело по дороге изменили.
      // Отвечаем отказом и НИЧЕГО не делаем. И обязательно пишем в журнал.
      logger.warn('Вебхук с неверной подписью', { ip: req.ip });
      return res.sendStatus(400);
    }

    // И только ЗДЕСЬ, ниже проверки, мы имеем право разобрать JSON
    // и поверить тому, что внутри.
    const event = JSON.parse(rawBody.toString('utf8'));
    handleEvent(event);

    res.sendStatus(200);
  },
);

// ЛОВУШКА ВТОРАЯ. Сравнивать подписи обычным === нельзя.
// Обычное сравнение строк останавливается на первом же несовпавшем символе.
// Значит, неправильная догадка с первого символа отвергается чуть быстрее,
// чем догадка, у которой совпали первые десять символов. Разница
// в микроскопические доли секунды — но её можно измерить, если послать
// миллион запросов, и по ней подобрать подпись символ за символом.
// timingSafeEqual сравнивает ВСЕГДА за одно и то же время.
function safeCompare(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  // Длины сравнить обычным способом можно и нужно: timingSafeEqual
  // на буферах разной длины выбрасывает ошибку.
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
}`;

  protected readonly rawBodyTrap = `// ПОЧЕМУ ПОДПИСЬ «НЕ СХОДИТСЯ»: ошибка, из-за которой люди теряют полдня,
// а потом в отчаянии выключают проверку подписи совсем.

app.use(express.json());   // ← вот здесь всё и сломалось

app.post('/webhooks/payments', (req, res) => {
  // req.body — это уже РАЗОБРАННЫЙ объект. Исходного текста больше нет,
  // express.json() его прочитал и выбросил.
  const rawBody = JSON.stringify(req.body);   // ← НЕ то же самое!

  const ourSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  // Подпись не совпадёт почти никогда. Причина в том, что JSON.stringify
  // собирает текст ПО-СВОЕМУ, а не так, как его собрал отправитель:
  //   • он не ставит переносы строк и пробелы, а отправитель мог их ставить;
  //   • порядок полей после разбора и обратной сборки может отличаться;
  //   • русские буквы и эмодзи могли быть записаны экранированными кодами;
  //   • число 349000.0 превратится в 349000.
  //
  // Отпечаток считается по БАЙТАМ. Один лишний пробел — совершенно другой
  // отпечаток. Поэтому исходные байты надо сохранить и подписывать именно их.
});

// ПРАВИЛЬНО: на маршрут вебхука ставим express.raw, а express.json
// оставляем всем остальным маршрутам. Порядок регистрации важен:
// маршрут вебхука объявляем ДО общего app.use(express.json()).`;

  protected readonly fastAck = `// ПЛОХО: делаем всю работу внутри обработчика вебхука.
app.post('/webhooks/payments', verifySignature, async (req, res) => {
  const event = req.event;

  await db.markOrderPaid(event.data.order_id);      // 30 мс — ладно
  await warehouse.reserveItems(event.data.order_id); // 900 мс — чужой сервис
  await mailer.sendReceipt(event.data.order_id);     // 4000 мс — почта тормозит
  await analytics.track('purchase', event.data);     // 600 мс
  await pdf.generateInvoice(event.data.order_id);    // 2500 мс

  res.sendStatus(200);   // ← отправитель ждал ответа больше восьми секунд
});

// ЧТО ПРОИЗОЙДЁТ. У отправителя стоит ограничение на ожидание ответа —
// обычно несколько секунд. Не дождавшись, он обрывает соединение и считает
// доставку НЕУДАЧНОЙ. А значит, пришлёт это же событие ещё раз.
// Вы снова начнёте всю восьмисекундную работу, снова не успеете —
// и получите бесконечный круг: письмо клиенту уйдёт пять раз,
// товар зарезервируется пять раз, а событие так и останется «недоставленным».


// ХОРОШО: проверили, записали, ответили. Работа — потом и отдельно.
app.post('/webhooks/payments', verifySignature, async (req, res) => {
  const event = req.event;

  // Единственное, что делаем прямо сейчас, — кладём записку в очередь.
  // Это быстрая операция: записать несколько сотен байт.
  await queue.add('payment-event', event, {
    jobId: event.id,   // ← про это в разделе о дубликатах
  });

  // Отвечаем за считанные миллисекунды. Отправитель доволен и уходит.
  res.sendStatus(200);
});

// А всю настоящую работу делает отдельная программа-работник,
// в своём темпе, и её никто не торопит.
worker.process('payment-event', async (job) => {
  const event = job.data;

  await db.markOrderPaid(event.data.order_id);
  await warehouse.reserveItems(event.data.order_id);
  await mailer.sendReceipt(event.data.order_id);
  await analytics.track('purchase', event.data);
  await pdf.generateInvoice(event.data.order_id);
});

// БОНУС, о котором сразу не думают: если почтовый сервис лежит,
// падает только задача в очереди — её повторят позже. Вебхук при этом
// уже принят, и отправитель ничего не заметил.`;

  protected readonly dedupeHandler = `// ЗАЩИТА ОТ ДУБЛИКАТОВ. Свойство «повторный вызов ничего не ломает»
// называется ИДЕМПОТЕНТНОСТЬЮ. Слово страшное, смысл бытовой:
// нажать кнопку лифта пять раз — то же самое, что нажать один раз.

// Таблица, в которой мы помним, что уже видели.
// Ключевая деталь: поле event_id объявлено УНИКАЛЬНЫМ в самой базе.
// Это не украшение: два одновременных запроса не смогут вставить
// одну и ту же строку дважды — база физически не даст.
//
//   CREATE TABLE processed_webhook_events (
//     event_id    TEXT PRIMARY KEY,
//     received_at TIMESTAMPTZ NOT NULL DEFAULT now()
//   );

async function handleEvent(event) {
  try {
    // Пытаемся ЗАНЯТЬ идентификатор события. Если он уже занят —
    // база выбросит ошибку нарушения уникальности.
    await db.query(
      'INSERT INTO processed_webhook_events (event_id) VALUES (?)',
      [event.id],
    );
  } catch (err) {
    if (isUniqueViolation(err)) {
      // Это событие мы уже обрабатывали. Спокойно выходим.
      // Никакой ошибки не произошло — это штатная ситуация.
      logger.info('Дубликат вебхука, пропускаем', { eventId: event.id });
      return;
    }
    throw err;   // другая ошибка базы — пусть падает и повторяется
  }

  // Сюда мы попадаем ровно один раз на каждое событие.
  await doTheActualWork(event);
}

// ПОЧЕМУ ПРОВЕРКА «СНАЧАЛА SELECT, ПОТОМ INSERT» РАБОТАЕТ ХУЖЕ:
//
//   const seen = await db.findEvent(event.id);   // оба запроса: не видели
//   if (seen) return;                            // оба: идём дальше
//   await db.saveEvent(event.id);                // оба сохранили
//   await doTheActualWork(event);                // РАБОТА СДЕЛАНА ДВАЖДЫ
//
// Между SELECT и INSERT есть промежуток. Если два одинаковых события
// пришли в одну и ту же миллисекунду (а они приходят именно так),
// оба запроса успеют проскочить проверку. Уникальный ключ в базе
// такого промежутка не оставляет — решение принимает сама база.`;

  protected readonly orderingFix = `// ТРЕТИЙ ЗАКОН: ПОРЯДОК СОБЫТИЙ НЕ ГАРАНТИРОВАН.
// Отправитель послал их по порядку. Пришли они как получилось.

// Почему так выходит: события летят по разным сетевым маршрутам,
// первое могло попасть на перегруженную копию вашего сервера,
// второе — на свободную. Или первое не дошло, его повторили через
// пять секунд, а второе за это время дошло с первого раза.

// ПЛОХО: слепо доверяем тому, что написано в теле события.
async function handleEvent(event) {
  if (event.type === 'order.created') {
    await db.createOrder(event.data);
  }
  if (event.type === 'payment.succeeded') {
    // А если этот вебхук пришёл ПЕРВЫМ — заказа ещё нет в базе,
    // и мы либо упадём, либо тихо ничего не сделаем.
    await db.markOrderPaid(event.data.order_id);
  }
}


// СПОСОБ ПЕРВЫЙ: смотреть на время события и не откатывать состояние назад.
async function applyStatus(orderId, newStatus, eventTime) {
  const order = await db.findOrder(orderId);

  // Пришло событие СТАРЕЕ того, что мы уже применили? Значит, оно опоздало.
  // Применять его нельзя — оно откатит заказ в прошлое.
  if (order && order.statusUpdatedAt > new Date(eventTime)) {
    logger.info('Опоздавшее событие, игнорируем', { orderId });
    return;
  }

  await db.updateOrderStatus(orderId, newStatus, eventTime);
}


// СПОСОБ ВТОРОЙ И ЛУЧШИЙ: не верить телу вообще, а перепроверить у источника.
// Тело вебхука воспринимаем как ЗВОНОК В ДВЕРЬ, а не как посылку:
// «эй, тут что-то поменялось у платежа pay_7bC1xR, сходи посмотри сам».
async function handleEvent(event) {
  if (event.type === 'payment.succeeded') {
    // Обычный GET-запрос к API отправителя за ТЕКУЩИМ состоянием.
    const payment = await bankApi.getPayment(event.data.payment_id);

    // Что бы ни было написано в теле вебхука, правда — вот здесь.
    // Если платёж успели отменить, мы увидим это, а не устаревшее «оплачен».
    if (payment.status !== 'succeeded') return;

    await applyStatus(payment.order_id, 'paid', payment.paid_at);
  }
}

// Плата за второй способ — один дополнительный запрос к чужому API.
// Отдаётся эта плата ровно один раз на событие, а не сто раз в цикле,
// как было при опросе. Для денег такая перепроверка обязательна.`;

  protected readonly tunnelSetup = `# ПРОБЛЕМА. Вебхук — это запрос ИЗВНЕ на ваш сервер.
# А ваш ноутбук в интернете не виден: у него нет публичного адреса,
# он сидит за домашним роутером. Постучаться к нему банк не может.
# Открывать порт наружу на домашнем роутере — плохая и небезопасная идея.

# РЕШЕНИЕ: ТУННЕЛЬ. Это программа, которая делает две вещи:
#   1) сама подключается изнутри к публичному серверу-посреднику;
#   2) всё, что приходит посреднику, проталкивает по этому соединению к вам.
# Аналогия: вы не можете принимать посылки на съёмной квартире,
# поэтому арендуете ячейку на почте и договариваетесь, что курьер
# с почты привезёт всё вам домой.

# Самый известный инструмент — ngrok.
ngrok http 3000

# В терминале появится публичный адрес вида
#   https://xxxx-xx-xx-xx-xx.ngrok-free.app  ->  http://localhost:3000
# Этот адрес и вписываем в личном кабинете платёжного сервиса,
# добавив путь обработчика:
#   https://xxxx-xx-xx-xx-xx.ngrok-free.app/webhooks/payments

# Альтернативы, если ngrok почему-то не подходит:
cloudflared tunnel --url http://localhost:3000    # от Cloudflare, бесплатно
localtunnel --port 3000                           # простой вариант с npm

# ЧЕТЫРЕ ПРИЁМА, КОТОРЫЕ ЭКОНОМЯТ ЧАСЫ ОТЛАДКИ:
#
# 1. Тестовый режим сервиса (песочница). Отдельные ключи, ненастоящие деньги,
#    карта вида 4242 4242 4242 4242. Всё как в бою, но платить не надо.
#
# 2. Кнопка «отправить тестовое событие» в личном кабинете. Даёт проверить
#    обработчик, вообще не создавая платёж.
#
# 3. Журнал доставок. Сервис показывает каждую попытку: что отправил,
#    что вы ответили, сколько ждал. Рядом — кнопка «отправить повторно».
#    Починили ошибку — нажали, и то же самое событие приезжает снова.
#
# 4. У ngrok есть свой веб-интерфейс на localhost:4040 — там видно
#    все прошедшие запросы целиком и есть своя кнопка повтора.
#    Она удобнее: не нужно каждый раз ходить в чужой кабинет.

# ГРАБЛИ: у бесплатного туннеля адрес меняется при каждом перезапуске.
# Перезапустили ngrok — не забудьте обновить адрес в личном кабинете,
# иначе будете полчаса гадать, почему события «перестали приходить».`;

  protected readonly outgoingWebhooks = `// ОБРАТНАЯ СТОРОНА: теперь ВЫ рассылаете вебхуки своим клиентам.
// Всё, на что вы жаловались, теперь ваша обязанность.

async function deliverWebhook(subscription, event) {
  const body = JSON.stringify(event);

  // 1. ПОДПИСЬ. У каждого подписчика СВОЙ секрет — если утечёт один,
  //    остальные не пострадают, и отзывать придётся ровно один.
  const signature = crypto
    .createHmac('sha256', subscription.secret)
    .update(body)
    .digest('hex');

  // 2. ПОВТОРЫ С НАРАСТАЮЩЕЙ ПАУЗОЙ. Если у клиента сервер прилёг,
  //    долбить его раз в секунду — значит мешать ему подняться.
  //    Пауза растёт: 10 секунд, минута, пять минут, полчаса, два часа.
  const delays = [10, 60, 300, 1800, 7200, 21600];

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const startedAt = Date.now();

    try {
      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
          'X-Event-Id': event.id,
          'X-Event-Timestamp': String(event.created_at),
        },
        body,

        // 3. ОГРАНИЧЕНИЕ ВРЕМЕНИ ОЖИДАНИЯ. Без него один медленный
        //    подписчик подвесит вашу рассылку всем остальным.
        signal: AbortSignal.timeout(5000),
      });

      // 4. ЖУРНАЛ ДОСТАВОК. Клиент должен видеть, что вы ему присылали,
      //    что он ответил и сколько это заняло. Без журнала любой разбор
      //    превращается в спор «я отправлял» — «а я не получал».
      await db.saveDeliveryAttempt({
        subscriptionId: subscription.id,
        eventId: event.id,
        attempt,
        statusCode: response.status,
        durationMs: Date.now() - startedAt,
      });

      if (response.ok) {
        await db.markSubscriptionHealthy(subscription.id);
        return;
      }

      // Ответ 4xx означает «запрос плохой». Повторять его бессмысленно:
      // тот же запрос даст тот же результат. Исключение — 429.
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return;
      }
    } catch (err) {
      // Сюда попадают обрыв связи, недоступный адрес и наш собственный таймаут.
      await db.saveDeliveryAttempt({
        subscriptionId: subscription.id,
        eventId: event.id,
        attempt,
        error: err.message,
      });
    }

    if (attempt < delays.length) {
      await sleep(delays[attempt] * 1000);
    }
  }

  // 5. ОТКЛЮЧЕНИЕ МЁРТВОГО АДРЕСА. Клиент выкатил новую версию и снёс
  //    обработчик, а вы полгода стучитесь в стену. Считаем неудачи подряд
  //    и после разумного количества — приостанавливаем подписку и пишем письмо.
  await db.markSubscriptionFailing(subscription.id);
}`;

  protected readonly timestampGuard = `// АТАКА ПОВТОРОМ (по-английски replay attack — «атака переигрыванием»).
//
// Смотрите, какая тонкость. Подпись доказывает, что тело НЕ ИЗМЕНЕНО
// и составлено тем, кто знает секрет. Но она НЕ доказывает, что запрос
// свежий. Настоящий подписанный запрос вместе с его подписью можно
// перехватить или найти в старых логах — и отправить вам ещё раз.
// Подпись сойдётся: тело-то не менялось.
//
// Аналогия: настоящий чек из магазина остаётся настоящим и через год.
// Если по нему каждый раз выдают товар — достаточно принести один и тот же
// чек десять раз. Поэтому на чеке пишут дату, а на входе смотрят, свежая ли она.

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function verifyWebhook(req) {
  const rawBody = req.body;                        // Buffer, сырые байты
  const timestamp = req.get('X-Event-Timestamp');  // отметка времени отправителя
  const theirSignature = req.get('X-Signature');

  if (!timestamp || !theirSignature) {
    throw new WebhookError('Нет обязательных заголовков');
  }

  // ШАГ 1. Свежесть. Событию больше пяти минут — не принимаем.
  // Число берут не с потолка: оно должно покрывать нормальное расхождение
  // часов между двумя серверами и обычные сетевые задержки.
  const ageMs = Math.abs(Date.now() - Number(timestamp) * 1000);
  if (ageMs > FIVE_MINUTES_MS) {
    throw new WebhookError('Событие слишком старое');
  }

  // ШАГ 2. Подпись считается по СВЯЗКЕ «время + тело», а не по одному телу.
  // Иначе отметку времени можно было бы просто подменить: она не защищена.
  const payload = Buffer.concat([
    Buffer.from(timestamp + '.', 'utf8'),
    rawBody,
  ]);

  const ourSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (!safeCompare(ourSignature, theirSignature)) {
    throw new WebhookError('Подпись не совпала');
  }

  return JSON.parse(rawBody.toString('utf8'));
}`;

  protected readonly fullPaymentHandler = `import express from 'express';
import crypto from 'node:crypto';

const app = express();
const WEBHOOK_SECRET = process.env.PAYMENTS_WEBHOOK_SECRET;

// ============================================================
// ЧАСТЬ 1. ОБРАБОТЧИК. Его работа — впустить или не впустить,
// записать в очередь и попрощаться. Больше он не делает НИЧЕГО.
// ============================================================

app.post(
  '/webhooks/payments',

  // Сырое тело + ограничение размера. Без ограничения любой желающий
  // пришлёт вам стомегабайтное «событие» и займёт всю память сервера.
  express.raw({ type: 'application/json', limit: '256kb' }),

  async (req, res) => {
    let event;

    try {
      // Проверка свежести и подписи — из предыдущего примера.
      event = verifyWebhook(req);
    } catch (err) {
      logger.warn('Отклонён вебхук', { reason: err.message, ip: req.ip });
      return res.sendStatus(400);
    }

    // Событий у сервиса десятки, нам нужны два. Остальные вежливо
    // подтверждаем и выбрасываем — иначе отправитель будет считать
    // их недоставленными и повторять вечно.
    const interesting = ['payment.succeeded', 'payment.canceled'];
    if (!interesting.includes(event.type)) {
      return res.sendStatus(200);
    }

    // Кладём записку в очередь. jobId равен идентификатору события —
    // очередь сама отбросит второй экземпляр с тем же ключом.
    await queue.add('payment-event', event, { jobId: event.id });

    // Всё. Мы уложились в считанные миллисекунды.
    res.sendStatus(200);
  },
);

// ============================================================
// ЧАСТЬ 2. РАБОТНИК. Здесь происходит настоящая работа,
// и его никто не торопит.
// ============================================================

worker.process('payment-event', async (job) => {
  const event = job.data;

  // ЗАЩИТА ОТ ДУБЛИКАТОВ. Уникальный ключ в базе — последняя линия обороны
  // на случай, если очередь всё-таки пропустила событие дважды.
  const isNew = await tryRememberEvent(event.id);
  if (!isNew) {
    logger.info('Дубликат события, выходим', { eventId: event.id });
    return;
  }

  // ПЕРЕПРОВЕРКА У ИСТОЧНИКА. Телу вебхука не верим: спрашиваем банк,
  // что с этим платежом ПРЯМО СЕЙЧАС. Так решается и проблема порядка,
  // и проблема устаревших данных.
  const payment = await bankApi.getPayment(event.data.payment_id);

  const order = await db.findOrder(payment.order_id);
  if (!order) {
    // Заказа ещё нет — событие обогнало своего товарища.
    // Бросаем ошибку: очередь повторит задачу позже, к тому времени
    // заказ, скорее всего, уже создастся.
    throw new Error('Заказ ещё не создан, попробуем позже');
  }

  if (payment.status === 'canceled') {
    await db.markOrderCanceled(order.id);
    return;
  }

  if (payment.status !== 'succeeded') {
    logger.info('Платёж ещё не финальный, ждём следующего события');
    return;
  }

  // СВЕРКА СУММЫ. Самая недооценённая проверка во всей интеграции.
  // Человек мог руками поменять сумму на странице оплаты, могла
  // сработать чужая скидка, мог прийти платёж по другому заказу.
  // Цена заказа известна нам самим — сверяем с тем, что реально пришло.
  if (payment.amount !== order.totalAmount || payment.currency !== order.currency) {
    logger.error('Сумма платежа не совпала с суммой заказа', {
      orderId: order.id,
      expected: order.totalAmount,
      received: payment.amount,
    });

    // Заказ НЕ оплачиваем. Отправляем разбираться человеку.
    await db.flagOrderForReview(order.id, 'amount-mismatch');
    return;
  }

  // Всё сошлось. Только теперь меняем состояние заказа.
  await db.markOrderPaid(order.id, {
    paymentId: payment.payment_id,
    paidAt: payment.paid_at,
  });

  // А всё остальное — снова в очередь, отдельными задачами.
  // Если почта прилегла, это не должно ломать оплату заказа.
  await queue.add('send-receipt', { orderId: order.id });
  await queue.add('reserve-stock', { orderId: order.id });
});

// Вот и весь вебхук. Шесть проверок, из которых нельзя выбросить ни одну:
// свежесть, подпись, интересность, дубликат, состояние у источника, сумма.`;
}
