import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-data-timeseries',
  imports: [CodeBlock, RouterLink],
  templateUrl: './timeseries.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemDataTimeseries {
  protected readonly onePoint = `-- ОДНА ТОЧКА ВРЕМЕННОГО РЯДА. Больше в ней ничего нет и не бывает.

-- 1. КОГДА измерили — момент времени с часовым поясом.
-- 2. ЧТО измерили — имя показателя.
-- 3. ГДЕ и У КОГО измерили — метки, они же ярлычки.
-- 4. СКОЛЬКО получилось — само число.

measured_at = 2026-08-15 10:31:04+03
metric      = api_duration_ms
labels      = { host: 'web-01', route: '/api/orders', status: '200' }
value       = 137.4

-- Читается это так: «пятнадцатого августа в 10:31:04 на сервере web-01
-- обработчик /api/orders ответил кодом 200 за 137,4 миллисекунды».

-- А вот следующая точка того же ряда, десятью секундами позже.
-- Обратите внимание: изменились ровно две вещи — время и значение.
-- Имя показателя и все метки — те же самые.

measured_at = 2026-08-15 10:31:14+03
metric      = api_duration_ms
labels      = { host: 'web-01', route: '/api/orders', status: '200' }
value       = 141.9

-- ВАЖНОЕ СЛОВО. «Ряд» — это НЕ вся таблица метрик.
-- Ряд — это одно конкретное сочетание имени и меток:
--   api_duration_ms { host=web-01, route=/api/orders, status=200 }
-- Поменяйте в метках одну букву — и это уже ДРУГОЙ ряд,
-- со своей отдельной линией на графике и своим местом на диске.
-- Из этого простого факта вырастет половина проблем этой страницы.`;

  protected readonly naiveMetricsTable = `-- БОЛЬНОЙ ВАРИАНТ. Именно так выглядит первая таблица метрик почти у всех.
-- Две недели она работает прекрасно. Дальше начинается интересное.

CREATE TABLE metrics (
  id          BIGSERIAL PRIMARY KEY,     -- суррогатный ключ на каждую точку
  metric      TEXT             NOT NULL, -- 'api_duration_ms'
  host        TEXT             NOT NULL, -- 'web-01'
  route       TEXT             NOT NULL, -- '/api/orders'
  value       DOUBLE PRECISION NOT NULL, -- 137.4
  measured_at TIMESTAMPTZ      NOT NULL  -- 2026-08-15 10:31:04+03
);

-- Без индекса по времени запрос «за последний час» читает всю таблицу,
-- поэтому индекс ставят сразу же.
CREATE INDEX metrics_measured_at_idx ON metrics (measured_at);

-- Пишем точку. Выглядит совершенно невинно.
INSERT INTO metrics (metric, host, route, value, measured_at)
VALUES ('api_duration_ms', 'web-01', '/api/orders', 137.4, now());

-- ЧТО ЗДЕСЬ НЕ ТАК — четыре беды, и все четыре придут в один и тот же месяц.

-- БЕДА 1. ПЕРВИЧНЫЙ КЛЮЧ, КОТОРЫЙ НИКОМУ НЕ НУЖЕН.
--   Номер отдельной точки не используется НИ В ОДНОМ запросе: вы никогда
--   не спросите «покажи точку номер 8 431 902». Но платите вы за него
--   всегда: 8 байт в каждой строке плюс отдельное дерево индекса на диске.

-- БЕДА 2. ИНДЕКС РАСТЁТ БЫСТРЕЕ, ЧЕМ ВЫ ГОТОВЫ.
--   B-дерево по времени приходится дописывать при каждой вставке.
--   Пока верхушка дерева помещается в оперативную память — всё быстро.
--   Когда перестала — каждая вставка превращается в поход на диск.
--   Это не плавное замедление, а обрыв: вчера база принимала
--   десятки тысяч вставок в секунду, сегодня — единицы тысяч.

-- БЕДА 3. УБОРКА СТАРОГО — САМАЯ ДОРОГАЯ ОПЕРАЦИЯ СУТОК.
DELETE FROM metrics WHERE measured_at < now() - INTERVAL '90 days';
--   PostgreSQL не стирает строки сразу: он помечает их мёртвыми,
--   а место освобождает фоновый уборщик (autovacuum) — потом и не спеша.
--   Сорок миллионов помеченных строк означают распухшую таблицу,
--   распухший индекс и уборщика, который жуёт диск часами.
--   И всё это происходит ОДНОВРЕМЕННО с записью новых точек.

-- БЕДА 4. ОДИН И ТОТ ЖЕ ТЕКСТ, ПОВТОРЁННЫЙ МИЛЛИАРД РАЗ.
--   Строка 'api_duration_ms' лежит в таблице ровно столько раз,
--   сколько у вас точек. Слово 'web-01' — тоже. Это гигабайты
--   совершенно одинаковых букв, которые вы храните и копируете в бэкапы.`;

  protected readonly volumeMath = `# АРИФМЕТИКА, КОТОРУЮ СТОИТ ПРОДЕЛАТЬ ДО ВЫБОРА ХРАНИЛИЩА.
# Дано скромное хозяйство: 100 серверов, с каждого снимаем 50 метрик,
# точка раз в 10 секунд. Это не «крупный проект» — это средний магазин.

# Сколько отдельных рядов мы вообще ведём:
echo $(( 100 * 50 ))                      # 5000 рядов — пока не страшно

# Сколько точек прилетает в секунду:
echo $(( 100 * 50 / 10 ))                 # 500 точек в секунду

# Сколько за сутки (на каждый ряд 6 точек в минуту, в сутках 1440 минут):
echo $(( 5000 * 6 * 1440 ))               # 43 200 000 точек в сутки

# Сколько за год:
echo $(( 5000 * 6 * 1440 * 365 ))         # 15 768 000 000 — почти 16 миллиардов

# Теперь переведём это в место на диске. В обычной таблице PostgreSQL
# одна такая строка со всеми служебными полями занимает около 100 байт:
# заголовок строки, id, два текста, число, отметка времени.

echo $(( 5000 * 6 * 1440 * 100 / 1024 / 1024 / 1024 ))        # ~4 ГБ в сутки
echo $(( 5000 * 6 * 1440 * 365 * 100 / 1024 / 1024 / 1024 ))  # ~1468 ГБ в год

# Полтора терабайта в год — и это ещё БЕЗ индекса, который прибавит
# заметную долю сверху, и без резервных копий, которые тоже где-то лежат.

# А теперь честный вопрос, ради которого всё и считалось:
# как часто вам понадобится точность «раз в 10 секунд»
# для данных прошлого марта? Ответ почти всегда — никогда.`;

  protected readonly hypertable = `-- ЗДОРОВЫЙ ВАРИАНТ на TimescaleDB — расширении для обычного PostgreSQL.
-- Никакой новой базы ставить не надо: это та же самая база, тот же SQL,
-- те же драйверы и та же ORM. Меняется только устройство таблицы внутри.

CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE api_latency (
  measured_at TIMESTAMPTZ      NOT NULL,  -- время всегда первым и всегда NOT NULL
  service     TEXT             NOT NULL,  -- 'shop-api'
  route       TEXT             NOT NULL,  -- '/api/orders'
  status      SMALLINT         NOT NULL,  -- 200, 404, 500
  duration_ms DOUBLE PRECISION NOT NULL
);
-- Заметьте: НИКАКОГО id. Он не нужен, а места и времени стоит.

-- Вот эта строка и превращает обычную таблицу в «гипертаблицу»:
SELECT create_hypertable(
  'api_latency',
  'measured_at',
  chunk_time_interval => INTERVAL '1 day'   -- один кусок = одни сутки
);

-- Что произошло физически. Снаружи api_latency осталась одной таблицей:
-- вы пишете в неё обычным INSERT и читаете обычным SELECT. Внутри же
-- база завела отдельную маленькую таблицу на каждые сутки и сама
-- раскладывает по ним строки, глядя на measured_at. Такие куски
-- называются чанками (chunk — «кусок»).

-- Индекс тоже теперь не один огромный, а свой маленький в каждом куске.
CREATE INDEX ON api_latency (route, measured_at DESC);

-- Запрос за последний час трогает РОВНО ОДИН кусок — сегодняшний.
-- Остальные 89 база даже не открывает: она по границам кусков видит,
-- что нужного времени там быть не может. Это называется отсечением
-- лишних кусков (constraint exclusion).
SELECT avg(duration_ms)
FROM api_latency
WHERE route = '/api/orders'
  AND measured_at > now() - INTERVAL '1 hour';

-- Посмотреть, на что база порезала таблицу, можно так:
SELECT chunk_name, range_start, range_end
FROM timescaledb_information.chunks
WHERE hypertable_name = 'api_latency'
ORDER BY range_start DESC
LIMIT 5;`;

  protected readonly compressionRetention = `-- СЖАТИЕ И СРОК ХРАНЕНИЯ — две настройки, которые пишут один раз
-- и больше о них не вспоминают. Обе работают фоном, без вашего участия.

-- 1. СЖАТИЕ. Говорим базе, как именно раскладывать данные внутри куска.
ALTER TABLE api_latency SET (
  timescaledb.compress,

  -- По каким колонкам ГРУППИРОВАТЬ: одинаковые значения этих меток
  -- сложатся рядом, и повторяющийся текст схлопнется в одно упоминание.
  timescaledb.compress_segmentby = 'service, route',

  -- По какой колонке СОРТИРОВАТЬ внутри группы. Отсортированное время
  -- сжимается лучше всего: вместо самих отметок хранят разницу между
  -- соседними, а она у нас всегда одна и та же — 10 секунд.
  timescaledb.compress_orderby = 'measured_at DESC'
);

-- Сжимать данные СРАЗУ нельзя: свежие куски ещё дописываются.
-- Поэтому политика: «кусок старше семи суток — сжать».
SELECT add_compression_policy('api_latency', INTERVAL '7 days');

-- 2. СРОК ХРАНЕНИЯ. «Куску больше 90 суток — выбросить целиком».
SELECT add_retention_policy('api_latency', INTERVAL '90 days');

-- ВОТ РАДИ ЧЕГО ВСЁ ЭТО ЗАТЕВАЛОСЬ.
-- Удаление старого теперь НЕ выглядит так:
--     DELETE FROM api_latency WHERE measured_at < ...   -- 43 млн строк
-- Оно выглядит так:
--     DROP TABLE _hyper_1_42_chunk;                      -- одна команда
-- База просто отпускает целый файл на диске. Ни построчного обхода,
-- ни мёртвых строк, ни перестройки индекса, ни работы для уборщика.
-- Разница между этими двумя способами — не проценты, а порядки.

-- Проверить, сколько места отыграло сжатие:
SELECT
  pg_size_pretty(before_compression_total_bytes) AS "было",
  pg_size_pretty(after_compression_total_bytes)  AS "стало"
FROM hypertable_compression_stats('api_latency');`;

  protected readonly continuousAggregate = `-- ДАУНСЕМПЛИНГ: заранее посчитанная поминутная сводка.
-- Она пересчитывается сама, по мере того как приходят новые точки.

CREATE MATERIALIZED VIEW api_latency_1m
WITH (timescaledb.continuous) AS
SELECT
  -- time_bucket округляет время вниз до границы корзины.
  -- 10:31:04 и 10:31:57 попадут в одну корзину 10:31:00.
  time_bucket(INTERVAL '1 minute', measured_at) AS bucket,
  service,
  route,
  count(*)          AS requests,   -- сколько было запросов
  avg(duration_ms)  AS avg_ms,     -- среднее время
  max(duration_ms)  AS max_ms,     -- самый медленный
  sum(CASE WHEN status >= 500 THEN 1 ELSE 0 END) AS errors
FROM api_latency
GROUP BY bucket, service, route;

-- Политика обновления: раз в минуту досчитывать то, что накопилось.
SELECT add_continuous_aggregate_policy('api_latency_1m',
  start_offset      => INTERVAL '3 hours',   -- насколько глубоко пересматривать
  end_offset        => INTERVAL '1 minute',  -- не трогать самую свежую минуту
  schedule_interval => INTERVAL '1 minute'   -- как часто просыпаться
);

-- Сводке можно назначить свой, гораздо более длинный срок хранения.
-- Сырые точки живут 90 суток, поминутная сводка — два года.
SELECT add_retention_policy('api_latency_1m', INTERVAL '2 years');

-- ЛОВУШКА, В КОТОРУЮ ПОПАДАЮТ ВСЕ. Сводки складываются НЕ ВСЕ.
--   count и sum сложить можно: сумма сумм — это сумма.
--   max и min тоже можно: максимум максимумов — это максимум.
--   avg — УЖЕ НЕЛЬЗЯ: среднее средних врёт, если в корзинах
--   было разное число запросов. Считать надо sum/count, а не avg(avg).
--   Перцентили (p95, p99) не складываются в принципе — про них
--   отдельный разговор ниже.
-- Поэтому в сводку кладут sum и count, а среднее считают при чтении:
SELECT bucket, sum(requests) AS n, sum(avg_ms * requests) / sum(requests) AS avg_ms
FROM api_latency_1m
WHERE bucket > now() - INTERVAL '6 hours'
GROUP BY bucket
ORDER BY bucket;`;

  protected readonly cardinalityTrap = `// БОЛЬНОЙ КОД. Автор искренне хотел «побольше подробностей»,
// и каждая строчка по отдельности выглядит разумной.

import client from 'prom-client';

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Время ответа',
  labelNames: [
    'route',        // 20 значений — нормально
    'method',       // 5 значений — нормально
    'status',       // 6 значений — нормально
    'user_id',      // 300 000 значений — КАТАСТРОФА
    'order_id',     // растёт вечно — КАТАСТРОФА ХУЖЕ ПЕРВОЙ
    'request_id',   // у КАЖДОГО запроса свой — конец
  ],
});

app.use((req, res, next) => {
  const done = requestDuration.startTimer();
  res.on('finish', () => {
    done({
      route: req.route?.path ?? 'unknown',
      method: req.method,
      status: res.statusCode,
      user_id: req.user?.id ?? 'anon',
      order_id: req.body?.orderId ?? 'none',
      request_id: req.id,          // uuid, уникальный для каждого запроса
    });
  });
  next();
});

// ЧТО ПРОИЗОЙДЁТ. Число рядов — это ПРОИЗВЕДЕНИЕ числа значений меток.
//   20 * 5 * 6                       = 600 рядов. Прекрасно.
//   20 * 5 * 6 * 300 000             = 180 000 000 рядов. Всё.
//   а с request_id каждый новый запрос заводит НОВЫЙ ряд навсегда.
//
// Причём заметьте: ваш процесс Node.js держит счётчики в ПАМЯТИ,
// пока их не заберут. То есть первым ляжет не хранилище, а сам
// веб-сервер: память кончится за час, и это будет выглядеть как
// «утечка памяти неизвестного происхождения».`;

  protected readonly cardinalityFix = `// ЗДОРОВЫЙ ВАРИАНТ. Правило простое до грубости:
// МЕТКА — ЭТО ТО, ПО ЧЕМУ ВЫ БУДЕТЕ ГРУППИРОВАТЬ И ФИЛЬТРОВАТЬ НА ГРАФИКЕ.
// Всё остальное метке не место.

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Время ответа HTTP-обработчика в секундах',
  labelNames: ['route', 'method', 'status'],   // и всё, три метки
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

app.use((req, res, next) => {
  const done = requestDuration.startTimer();
  res.on('finish', () => {
    done({
      // ШАБЛОН маршрута, а не настоящий адрес!
      // '/api/orders/:id' — одно значение метки на все заказы.
      // '/api/orders/8431' — отдельное значение на КАЖДЫЙ заказ.
      route: req.route?.path ?? 'unknown',
      method: req.method,
      status: res.statusCode,
    });
  });
  next();
});

// А куда девать user_id, order_id и request_id, если они всё-таки нужны?
// В ЛОГИ. Это принципиально другое хранилище с другой механикой:
// логи ищут по тексту и хранят недолго, а метрики считают и хранят долго.
logger.info('request finished', {
  requestId: req.id,
  userId: req.user?.id,
  orderId: req.body?.orderId,
  route: req.route?.path,
  status: res.statusCode,
  durationMs: Date.now() - startedAt,
});

// ПРОВЕРОЧНЫЙ ВОПРОС ПЕРЕД ДОБАВЛЕНИЕМ ЛЮБОЙ МЕТКИ:
// «Я собираюсь строить отдельную линию на графике для каждого
//  значения этой метки?» Для 20 маршрутов — да, это осмысленный график.
// Для 300 000 пользователей — нет, такой график не нарисует никто.`;

  protected readonly promClientMetrics = `// ТРИ ТИПА МЕТРИК. Их действительно всего три, и путать их дорого.
// Библиотека prom-client, но названия и смысл одинаковы почти везде.

import express from 'express';
import client from 'prom-client';

// Реестр — коробка, в которой лежат все метрики этого процесса.
const registry = new client.Registry();
registry.setDefaultLabels({ service: 'shop-api', instance: process.env.HOSTNAME });

// Полезно сразу включить стандартные метрики процесса:
// память, загрузка процессора, задержки цикла событий.
client.collectDefaultMetrics({ register: registry });

// ТИП 1. СЧЁТЧИК (counter) — число, которое только РАСТЁТ.
// Годится для «сколько всего раз что-то случилось»: заказы, ошибки, письма.
// Никогда не уменьшается — обнуляется только при перезапуске процесса.
const ordersCreated = new client.Counter({
  name: 'orders_created_total',        // окончание _total — общепринятое
  help: 'Сколько всего заказов оформлено с момента запуска',
  labelNames: ['payment_method'],
  registers: [registry],
});

// ТИП 2. ДАТЧИК (gauge) — число, которое ходит ВВЕРХ И ВНИЗ.
// Годится для «сколько прямо сейчас»: очередь, соединения, свободное место.
const queueDepth = new client.Gauge({
  name: 'email_queue_depth',
  help: 'Сколько задач сейчас лежит в очереди писем',
  registers: [registry],
});

// ТИП 3. ГИСТОГРАММА (histogram) — РАСПРЕДЕЛЕНИЕ значений.
// Годится для «сколько это заняло»: время ответа, размер ответа.
// Внутри это набор счётчиков-корзин: «сколько запросов уложилось
// в 10 мс», «сколько в 25 мс», «сколько в 50 мс» и так далее.
// Именно из этих корзин потом считаются перцентили.
const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Время ответа HTTP-обработчика в секундах',
  labelNames: ['route', 'method', 'status'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});

const app = express();

app.use((req, res, next) => {
  const done = requestDuration.startTimer();
  res.on('finish', () => {
    done({ route: req.route?.path ?? 'unknown', method: req.method, status: res.statusCode });
  });
  next();
});

app.post('/api/orders', async (req, res) => {
  const order = await db.createOrder(req.body);
  ordersCreated.inc({ payment_method: order.paymentMethod });  // +1 к счётчику
  res.status(201).json(order);
});

// Раз в 15 секунд обновляем датчик: это моментальный замер, а не событие.
setInterval(async () => {
  queueDepth.set(await emailQueue.getWaitingCount());
}, 15000);

// ГЛАВНАЯ СТРАНИЦА ВСЕЙ ЭТОЙ ИСТОРИИ. Обычный HTTP-адрес,
// который отдаёт текущие значения всех метрик простым текстом.
// Никуда ничего не отправляется: мы просто ВЫКЛАДЫВАЕМ цифры на витрину.
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.listen(3000);`;

  protected readonly prometheusScrape = `# Настройка Prometheus. Обратите внимание: ЗДЕСЬ перечислены адреса
# ваших приложений. Не наоборот. Prometheus сам ходит и забирает цифры —
# приложение о существовании Prometheus вообще не знает.

global:
  scrape_interval: 15s        # как часто обходить всех по кругу
  scrape_timeout: 10s         # сколько ждать ответа от одного адреса
  external_labels:
    env: production           # метка, которая допишется ко ВСЕМ рядам

scrape_configs:
  # Наш магазин: два веб-сервера, оба отдают /metrics.
  - job_name: shop-api
    metrics_path: /metrics
    static_configs:
      - targets:
          - web-01.internal:3000
          - web-02.internal:3000

  # Отдельная работа — фоновые обработчики очередей.
  # Им можно назначить свой интервал: они меняются медленнее.
  - job_name: shop-workers
    scrape_interval: 30s
    metrics_path: /metrics
    static_configs:
      - targets:
          - worker-01.internal:3001

  # Сам Prometheus тоже отдаёт метрики о себе — это удобно.
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']

# ЧТО ЭТО ДАЁТ НА ПРАКТИКЕ:
# 1. Приложение не держит соединения с хранилищем и не умеет «терять» точки:
#    оно вообще ничего не отправляет, оно просто отвечает на GET /metrics.
# 2. Лежащее приложение видно СРАЗУ и бесплатно: Prometheus не смог
#    забрать метрики — значит, встроенная метрика up стала равна нулю.
# 3. Хранилище само решает, сколько нагрузки оно потянет, — и не тонет
#    под пиком, потому что темп задаёт оно, а не тысяча клиентов.
# ЧЕГО НЕ ДАЁТ: адреса надо знать заранее. Разовые скрипты и задачи,
# которые живут 200 миллисекунд, забрать таким способом невозможно —
# для них заводят промежуточный «шлюз», куда они цифры всё-таки шлют.`;

  protected readonly naiveWrite = `// БОЛЬНОЙ КОД. Каждая точка — отдельный поход по сети.
// На ноутбуке разработчика работает идеально. В бою — не работает вовсе.

async function recordDuration(route, ms) {
  await fetch('http://tsdb.internal:8086/api/v2/write?bucket=metrics', {
    method: 'POST',
    body: 'api_duration,route=' + route + ' value=' + ms,
  });
}

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    // await тут даже не поставили — и слава богу, иначе ответ
    // пользователю ждал бы ещё и записи метрики.
    recordDuration(req.route?.path ?? 'unknown', Date.now() - startedAt);
  });
  next();
});

// ЧТО ЗДЕСЬ НЕ ТАК — по пунктам.

// 1. НА КАЖДЫЙ ЗАПРОС ПОЛЬЗОВАТЕЛЯ ПРИХОДИТСЯ ВТОРОЙ ЗАПРОС ПО СЕТИ.
//    Вы удвоили сетевую нагрузку ради цифры в 8 байт. Установка
//    соединения, заголовки, ответ — всё это стоит на порядки дороже
//    самих данных, которые вы передаёте.

// 2. ХРАНИЛИЩЕ ПОЛУЧАЕТ НАГРУЗКУ, НА КОТОРУЮ НЕ РАССЧИТАНО.
//    Базы временных рядов быстрые на ПАКЕТНОЙ записи: пять тысяч точек
//    одним запросом они проглотят мгновенно. Пять тысяч отдельных
//    запросов положат их — не объёмом данных, а числом обращений.

// 3. ПИК НАГРУЗКИ НА САЙТ = ПИК НАГРУЗКИ НА МЕТРИКИ.
//    Ровно в тот момент, когда сайту тяжелее всего, вы добиваете его
//    удвоенным потоком запросов. Приборы гасят двигатель.

// 4. ОШИБКА ЗАПИСИ МЕТРИКИ РОНЯЕТ ЗАПРОС ПОЛЬЗОВАТЕЛЯ.
//    Здесь await забыли случайно — и это спасло положение. Поставьте
//    его, «чтобы правильно», и недоступность хранилища метрик
//    превратится в недоступность магазина.`;

  protected readonly bufferedWrite = `// ЗДОРОВЫЙ ВАРИАНТ. Между приложением и хранилищем ставим буфер —
// обычный массив в памяти, который сбрасывается пачкой.

const buffer = [];

const MAX_BATCH = 5000;      // сбрасываем, когда набралось столько точек
const FLUSH_EVERY_MS = 1000; // ...или когда прошла секунда — что раньше
const MAX_BUFFER = 50000;    // выше этого начинаем ВЫБРАСЫВАТЬ точки

// Запись точки — теперь это push в массив. Ни сети, ни ожидания,
// ни возможности упасть. Единицы микросекунд.
function recordDuration(route, ms) {
  if (buffer.length >= MAX_BUFFER) {
    droppedPoints.inc();   // да, потерю точек тоже считают метрикой
    return;
  }
  buffer.push({ measuredAt: Date.now(), route, value: ms });
}

async function flush() {
  if (buffer.length === 0) return;

  // Забираем всё накопленное и СРАЗУ очищаем буфер,
  // чтобы новые точки копились, пока мы отправляем старые.
  const batch = buffer.splice(0, buffer.length);

  try {
    await sendBatch(batch);          // ОДИН запрос на тысячи точек
  } catch (err) {
    // Хранилище недоступно. Приложение из-за этого падать не должно:
    // метрики — это приборы, а не товар. Кладём пачку обратно в начало,
    // если в буфере есть место, иначе честно теряем её и говорим об этом.
    if (buffer.length + batch.length <= MAX_BUFFER) {
      buffer.unshift(...batch);
    } else {
      droppedPoints.inc(batch.length);
    }
    logger.warn('не удалось записать метрики', { count: batch.length, err });
  }
}

const timer = setInterval(flush, FLUSH_EVERY_MS);
timer.unref();   // таймер не должен мешать процессу завершиться

// ОБЯЗАТЕЛЬНАЯ ЧАСТЬ, ПРО КОТОРУЮ ЗАБЫВАЮТ ВСЕ.
// При выкладке новой версии процесс получает сигнал и завершается.
// Всё, что осталось в буфере, исчезнет вместе с памятью процесса —
// и в графиках появится дырка ровно в момент каждого обновления.
process.on('SIGTERM', async () => {
  clearInterval(timer);
  await flush();               // досылаем остатки
  process.exit(0);
});

// ЧЕМ МЫ ЗАПЛАТИЛИ ЗА ЭТО, И ЭТО НАДО ПОНИМАТЬ ЧЕСТНО:
// точки теперь доезжают до хранилища с задержкой до секунды,
// а при внезапной гибели процесса (не SIGTERM, а падение по питанию)
// последняя секунда измерений теряется навсегда. Для метрик это
// приемлемо: одна пропавшая точка из графика ничего не решает.
// Для денег и заказов — недопустимо, и именно поэтому их пишут
// в обычную базу транзакцией, а не через буфер.`;

  protected readonly bucketQueries = `-- КАК СМОТРЯТ ВРЕМЕННЫЕ РЯДЫ. Почти любой запрос устроен одинаково:
-- окно времени + разбиение на корзины + агрегат внутри корзины.

-- 1. САМЫЙ ЧАСТЫЙ ЗАПРОС В МИРЕ: график за последний час по минутам.
SELECT
  time_bucket(INTERVAL '1 minute', measured_at) AS bucket,
  count(*)         AS requests,
  avg(duration_ms) AS avg_ms,
  max(duration_ms) AS max_ms
FROM api_latency
WHERE measured_at > now() - INTERVAL '1 hour'   -- окно — ВСЕГДА первым делом
  AND route = '/api/orders'
GROUP BY bucket
ORDER BY bucket;
-- 60 строк на выходе — ровно 60 точек графика. Обратите внимание:
-- сырых строк база прочитала около 360 000, а отдала 60. Именно поэтому
-- график рисуется быстро, даже если данных в базе терабайт.

-- 2. СКОЛЬЗЯЩЕЕ СРЕДНЕЕ. Сырой график дёргается, и по нему ничего
-- не видно. Усредняем каждую точку с четырьмя предыдущими — линия
-- становится гладкой, а тенденция — заметной.
SELECT
  bucket,
  avg_ms,
  avg(avg_ms) OVER (ORDER BY bucket ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS smooth_ms
FROM api_latency_1m
WHERE bucket > now() - INTERVAL '6 hours'
ORDER BY bucket;

-- 3. СКОРОСТЬ ИЗМЕНЕНИЯ. Счётчик сам по себе бесполезен: «всего заказов
-- 1 482 903» ни о чём не говорит. Интересна ПРОИЗВОДНАЯ — сколько
-- заказов в минуту. Её считают как разницу с предыдущей точкой.
SELECT
  bucket,
  orders_total,
  orders_total - lag(orders_total) OVER (ORDER BY bucket) AS orders_per_minute
FROM orders_counter_1m
WHERE bucket > now() - INTERVAL '3 hours'
ORDER BY bucket;
-- Тонкость: при перезапуске приложения счётчик обнулится, и разница
-- окажется огромным отрицательным числом. В Prometheus функция rate()
-- умеет это распознавать сама; в SQL такую проверку пишут руками.

-- 4. ПОСЛЕДНЕЕ ИЗВЕСТНОЕ ЗНАЧЕНИЕ КАЖДОГО РЯДА — «что сейчас».
SELECT DISTINCT ON (route)
  route, measured_at, duration_ms
FROM api_latency
WHERE measured_at > now() - INTERVAL '5 minutes'
ORDER BY route, measured_at DESC;`;

  protected readonly percentileQuery = `-- ПОЧЕМУ СРЕДНЕЕ ВРЕМЯ ОТВЕТА ВРЁТ. Возьмём 100 запросов за минуту.
-- 95 из них уложились в 50 мс, а 5 висели по 4 секунды —
-- скажем, потому что попали на холодный кэш или на блокировку в базе.

--   среднее = (95 * 50 + 5 * 4000) / 100 = 247,5 мс
-- Двести сорок семь миллисекунд. Выглядит как «в целом нормально,
-- надо бы чуть ускорить». А на самом деле пять человек из ста
-- смотрели в белый экран четыре секунды и половина из них ушла.

-- Ни один реальный пользователь не получил ответ за 247 мс:
-- одни получили за 50, другие за 4000. Среднее описывает
-- НЕСУЩЕСТВУЮЩЕГО пользователя.

-- Смотреть надо перцентили. Перцентиль 95 (пишут p95) — это число,
-- ниже которого уложились 95 % запросов. То есть «худшее время,
-- которое видят 95 человек из ста».

SELECT
  time_bucket(INTERVAL '5 minutes', measured_at) AS bucket,
  count(*) AS requests,
  avg(duration_ms) AS avg_ms,
  percentile_cont(0.50) WITHIN GROUP (ORDER BY duration_ms) AS p50,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
  percentile_cont(0.99) WITHIN GROUP (ORDER BY duration_ms) AS p99,
  max(duration_ms) AS worst
FROM api_latency
WHERE measured_at > now() - INTERVAL '3 hours'
  AND route = '/api/orders'
GROUP BY bucket
ORDER BY bucket;

-- На нашем примере получится примерно так:
--   avg_ms = 247,5   p50 = 50   p95 = 50   p99 = 4000   worst = 4000
-- Вот теперь видно всё: половине быстро, подавляющему большинству
-- быстро, и есть отдельный хвост из очень медленных запросов.

-- КАК ЭТО ЧИТАЮТ НА ПРАКТИКЕ:
--   p50 растёт  — стало хуже вообще всем, ищите общую причину.
--   p50 стоит, а p99 растёт — беда достаётся редким запросам:
--                 самым тяжёлым пользователям, самым большим корзинам,
--                 запросам, попавшим на фоновую задачу или на блокировку.
--   p99 всегда заметно выше p50 — это НОРМА, а не поломка.

-- ЧЕСТНАЯ ОГОВОРКА ПРО ЦЕНУ. percentile_cont точен, но чтобы его
-- посчитать, базе надо отсортировать все значения в корзине. На сырых
-- данных за три часа это нормально, на трёх месяцах — уже тяжело.
-- Поэтому в больших сводках берут ПРИБЛИЖЁННЫЕ перцентили
-- (в TimescaleDB Toolkit это percentile_agg, в Prometheus —
-- histogram_quantile по корзинам гистограммы). Они дают небольшую
-- погрешность, зато складываются между собой и считаются мгновенно.`;

  protected readonly alertRules = `# Правила Prometheus: сначала считаем показатель, потом сравниваем с порогом.
# Выражения написаны на языке PromQL — это НЕ SQL, он устроен иначе:
# в нём нет таблиц и строк, есть только ряды и операции над ними.

groups:
  - name: shop-api
    interval: 30s
    rules:
      # ЗАРАНЕЕ ПОСЧИТАННЫЙ ПОКАЗАТЕЛЬ (recording rule).
      # rate(...[5m]) — средняя скорость роста счётчика за пять минут.
      # Именно rate, а не сам счётчик: счётчик только растёт и сам
      # по себе ничего не значит.
      - record: job:http_request_rate5m
        expr: sum(rate(http_request_duration_seconds_count[5m])) by (job, route)

      # p95 времени ответа, посчитанный из корзин гистограммы.
      # by (le, route) обязателен: le — это и есть границы корзин.
      - record: job:http_p95_5m
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job, route))

      # ПОРОГОВОЕ УВЕДОМЛЕНИЕ (alerting rule).
      # for: 10m — ключевая строка. Без неё вас будят каждый раз,
      # когда показатель дёрнулся на одну точку. С ней уведомление
      # сработает, только если условие держится десять минут подряд.
      - alert: ApiSlow
        expr: job:http_p95_5m{job="shop-api"} > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "p95 времени ответа выше 500 мс уже 10 минут"

      # Доля ошибок больше 5 % — считаем как отношение двух скоростей.
      - alert: ApiErrors
        expr: |
          sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m])) by (job)
          /
          sum(rate(http_request_duration_seconds_count[5m])) by (job)
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Больше 5 % запросов отвечают ошибкой"

      # Метрика up появляется сама: 1 — приложение ответило на опрос,
      # 0 — не ответило. Это самое дешёвое уведомление в вашей жизни.
      - alert: InstanceDown
        expr: up{job="shop-api"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Экземпляр не отвечает на опрос метрик"`;

  protected readonly inspectCardinality = `# КАК ПОСМОТРЕТЬ, НЕ ВЗОРВАЛАСЬ ЛИ У ВАС КАРДИНАЛЬНОСТЬ.
# Делать это надо не когда база легла, а раз в пару недель — спокойно.

# 1. Сколько всего рядов сейчас в Prometheus (метрика о самом себе):
curl -s 'http://prometheus:9090/api/v1/query?query=prometheus_tsdb_head_series'

# 2. Какие метрики породили больше всего рядов — встроенный отчёт:
curl -s 'http://prometheus:9090/api/v1/status/tsdb' | jq '.data.seriesCountByMetricName'

# 3. Сколько значений у конкретной метки. Если тут четырёхзначное число —
#    у вас в метке лежит что-то, чему там не место.
curl -s 'http://prometheus:9090/api/v1/label/route/values' | jq '.data | length'

# 4. То же самое, если ряды лежат в PostgreSQL с TimescaleDB:
psql -c "SELECT count(*) FROM (SELECT DISTINCT service, route, status FROM api_latency) t;"

# 5. И проверка глазами — просто посмотреть, что отдаёт приложение.
#    Если /metrics весит мегабайты, вы уже в беде: этот текст
#    целиком читается при КАЖДОМ опросе, то есть раз в 15 секунд.
curl -s http://localhost:3000/metrics | wc -l
curl -s http://localhost:3000/metrics | grep '^http_request_duration_seconds_bucket' | wc -l

# ОРИЕНТИРЫ, О КОТОРЫХ ПОЛЕЗНО ДОГОВОРИТЬСЯ ЗАРАНЕЕ:
#   до нескольких тысяч рядов  — обычное приложение, беспокоиться не о чем;
#   десятки тысяч              — нормально для хозяйства из сотни машин;
#   миллионы                   — либо вы очень большая компания и знаете,
#                                что делаете, либо в метку попал идентификатор.
# Третий вариант встречается на порядок чаще первых двух.`;

  protected readonly latencyStory = `-- ПРАКТИЧЕСКИЙ СЮЖЕТ ЦЕЛИКОМ: измеряем время ответа своего API.
-- Всё, что нужно, — одна гипертаблица, одна сводка и две политики.

-- ШАГ 1. Сырые данные. Метки — только то, по чему будем группировать.
CREATE TABLE api_latency (
  measured_at TIMESTAMPTZ      NOT NULL,
  service     TEXT             NOT NULL,   -- 'shop-api' или 'shop-workers'
  route       TEXT             NOT NULL,   -- ШАБЛОН: '/api/orders/:id'
  method      TEXT             NOT NULL,   -- 'GET', 'POST'
  status      SMALLINT         NOT NULL,   -- 200, 404, 500
  duration_ms DOUBLE PRECISION NOT NULL
);
SELECT create_hypertable('api_latency', 'measured_at', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX ON api_latency (service, route, measured_at DESC);

-- Прикинем число рядов: 2 сервиса * 20 маршрутов * 4 метода * 6 кодов
-- = 960 рядов. Ровно столько линий вы теоретически можете нарисовать.
-- Добавили бы сюда user_id — получили бы сотни миллионов.

-- ШАГ 2. Поминутная сводка со всем, что понадобится на графиках.
CREATE MATERIALIZED VIEW api_latency_1m
WITH (timescaledb.continuous) AS
SELECT
  time_bucket(INTERVAL '1 minute', measured_at) AS bucket,
  service, route,
  count(*) AS requests,
  sum(duration_ms) AS total_ms,                       -- сумма, а не среднее!
  sum(CASE WHEN status >= 500 THEN 1 ELSE 0 END) AS errors,
  max(duration_ms) AS max_ms
FROM api_latency
GROUP BY bucket, service, route;

-- ШАГ 3. Сроки хранения. Пирамида в три этажа.
SELECT add_compression_policy('api_latency', INTERVAL '2 days');   -- сжать через 2 суток
SELECT add_retention_policy('api_latency', INTERVAL '14 days');    -- сырое живёт 2 недели
SELECT add_retention_policy('api_latency_1m', INTERVAL '1 year');  -- сводка живёт год

-- ШАГ 4. То, на что вы будете смотреть каждый день.

-- Что происходит прямо сейчас: последние 30 минут по маршрутам.
SELECT
  route,
  sum(requests) AS n,
  round(sum(total_ms) / sum(requests))::int AS avg_ms,
  sum(errors) AS errors,
  max(max_ms) AS worst_ms
FROM api_latency_1m
WHERE bucket > now() - INTERVAL '30 minutes'
GROUP BY route
ORDER BY n DESC;

-- Стало ли хуже: сравниваем сегодняшний час с тем же часом неделю назад.
-- Это гораздо честнее сравнения «с предыдущим часом»: у трафика
-- есть суточный ритм и недельный, и в понедельник утром всегда
-- не так, как в субботу ночью.
SELECT
  'сейчас' AS period,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95
FROM api_latency
WHERE measured_at > now() - INTERVAL '1 hour'
UNION ALL
SELECT
  'неделю назад',
  percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms)
FROM api_latency
WHERE measured_at BETWEEN now() - INTERVAL '7 days 1 hour' AND now() - INTERVAL '7 days';`;
}
