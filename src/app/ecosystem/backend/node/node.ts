import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-backend-node',
  imports: [CodeBlock, RouterLink],
  templateUrl: './node.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemBackendNode {
  protected readonly whatIsNode = `// Node.js — это НЕ язык и НЕ фреймворк. Это ПРОГРАММА, которая умеет
// выполнять JavaScript вне браузера. Внутри неё две главные части.

// ЧАСТЬ 1. Движок V8 — тот самый, что стоит в Chrome.
// Он умеет ровно одно: выполнять JavaScript. Про файлы и сеть он не знает
// вообще ничего — это не его дело.
const sum = [1, 2, 3].reduce((a, b) => a + b);   // ← это делает V8

// ЧАСТЬ 2. Обвязка (библиотека libuv и модули Node).
// Она даёт то, чего в языке нет: доступ к диску, к сети, к процессам.
import fs from 'node:fs/promises';                // ← это даёт обвязка
const text = await fs.readFile('./orders.csv', 'utf8');

// ВЫВОД, КОТОРЫЙ СНИМАЕТ ПОЛОВИНУ ПУТАНИЦЫ:
// язык JavaScript одинаковый в браузере и в Node.
// Отличается ОКРУЖЕНИЕ — то, что доступно вокруг языка.`;

  protected readonly browserVsNode = `// ЧЕГО НЕТ В NODE, хотя есть в браузере.
// Всё это относится к странице, а страницы на сервере нет:
document.querySelector('h1');   // ReferenceError: document is not defined
window.innerWidth;              // ReferenceError: window is not defined
localStorage.getItem('theme');  // ReferenceError: localStorage is not defined
alert('привет');                // ReferenceError: alert is not defined


// ЧЕГО НЕТ В БРАУЗЕРЕ, но есть в Node.
// Всё это браузер запрещает намеренно — ради вашей безопасности:

import fs from 'node:fs/promises';
await fs.writeFile('./report.csv', data);         // писать на диск
await fs.readdir('/var/log');                     // читать чужие папки

import process from 'node:process';
process.env.DATABASE_URL;                          // секреты окружения
process.exit(1);                                   // завершить программу

import { exec } from 'node:child_process';
exec('pg_dump shop > backup.sql');                 // запускать другие программы

import net from 'node:net';
net.createServer();                                // слушать сетевой порт напрямую


// ЧТО ЕСТЬ И ТАМ И ТАМ — общая часть языка и часть современных возможностей:
JSON.parse('{}');
await fetch('https://api.example.com/rates');      // fetch есть в Node с 18-й версии
crypto.randomUUID();
new URL('https://example.com/path');
setTimeout(() => {}, 1000);`;

  protected readonly blockingProblem = `// НАПОМИНАНИЕ ИЗ РАЗДЕЛА ПРО БРАУЗЕР: JavaScript выполняется в ОДНОМ потоке.
// В браузере это значило «страница подвисает».
// На сервере это значит «подвисают ВСЕ пользователи сразу». Разница огромна.

import express from 'express';
const app = express();

// Обычный обработчик: отвечает за миллисекунду.
app.get('/api/products', async (req, res) => {
  const products = await db.findProducts();
  res.json(products);
});

// А вот этот — катастрофа. Он считает отчёт прямо в потоке.
app.get('/api/report', (req, res) => {
  let total = 0;
  for (let i = 0; i < 5_000_000_000; i++) {   // ← десять секунд чистых вычислений
    total += i;
  }
  res.json({ total });
});

// ЧТО ПРОИЗОЙДЁТ. Один человек открыл /api/report.
// В эти десять секунд сервер НЕ ОТВЕЧАЕТ ВООБЩЕ НИКОМУ:
// ни на /api/products, ни на страницу входа, ни на проверку здоровья.
// Балансировщик решит, что копия умерла, и перезапустит её.
// Тысяча человек увидит ошибку из-за одного отчёта.`;

  protected readonly nonBlockingIO = `// А ТЕПЕРЬ ГЛАВНЫЙ ФОКУС NODE. Ожидание — это НЕ работа.

app.get('/api/orders', async (req, res) => {
  // Строка ниже занимает 40 миллисекунд «времени», но НОЛЬ времени потока.
  // Node отправляет запрос в базу и говорит потоку: «свободен, займись другими».
  const orders = await db.findOrders();     // ← ждём базу

  // Когда база ответит, Node вернётся сюда и продолжит с этой строки.
  res.json(orders);
});

// РАЗНИЦА, КОТОРУЮ ВАЖНО ПОЧУВСТВОВАТЬ:
//
//   ЖДАТЬ базу, диск, чужой сервис  → поток СВОБОДЕН, можно взять ещё сто запросов
//   СЧИТАТЬ в цикле, жать картинку  → поток ЗАНЯТ, все остальные стоят
//
// Поэтому Node прекрасно держит тысячи одновременных соединений,
// пока каждое из них большую часть времени ЖДЁТ, а не считает.
// А типичное веб-приложение именно этим и занимается: ждёт базу.`;

  protected readonly cpuFix = `// ЧТО ДЕЛАТЬ С ТЯЖЁЛЫМИ ВЫЧИСЛЕНИЯМИ. Три способа, по возрастанию честности.

// СПОСОБ 1 (лучший): вообще не считать это в запросе.
// Кладём задачу в очередь и сразу отвечаем «принято».
app.post('/api/report', async (req, res) => {
  const job = await queue.add('build-report', req.body);
  res.status(202).json({ jobId: job.id });   // 202 = «принято в работу»
});
// Пользователь потом заберёт готовый отчёт по этому номеру.


// СПОСОБ 2: отдать вычисление отдельному потоку.
// Worker threads — настоящие потоки ОС внутри процесса Node.
import { Worker } from 'node:worker_threads';

app.get('/api/hash', (req, res) => {
  const worker = new Worker('./heavy-compute.js', {
    workerData: { input: req.query.data },
  });
  // Главный поток свободен и продолжает обслуживать всех остальных.
  worker.on('message', (result) => res.json(result));
});


// СПОСОБ 3: нарезать работу на кусочки и отдавать передышку между ними.
// Годится для «средних» задач, где заводить воркер избыточно.
async function processMany(records) {
  for (let i = 0; i < records.length; i++) {
    processRecord(records[i]);

    // Каждую тысячу записей отпускаем поток на один оборот.
    // За этот оборот Node успеет обслужить накопившиеся запросы.
    if (i % 1000 === 0) {
      await new Promise((done) => setImmediate(done));
    }
  }
}`;

  protected readonly expressExample = `// EXPRESS — самый распространённый каркас. Ему больше пятнадцати лет,
// он есть в любом учебнике, и почти любой вопрос уже кто-то задал до вас.

import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/products/:id', async (req, res) => {
  const product = await db.findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Не найдено' });
  }
  res.json(product);
});

app.listen(3000);

// ПЛЮСЫ: минимум магии, огромное сообщество, тысячи готовых дополнений.
// МИНУС: он ничего вам не навязывает — а значит, структуру проекта,
// проверку данных, работу с ошибками и всё остальное вы придумываете сами.
// На проекте из трёх человек это свобода. На проекте из тридцати — хаос.`;

  protected readonly fastifyExample = `// FASTIFY — то же самое, но быстрее и со встроенной проверкой данных.

import Fastify from 'fastify';

const app = Fastify({ logger: true });   // журнал уже внутри

app.get('/api/products/:id', {
  // СХЕМА — описание того, что можно прислать и что мы вернём.
  // Fastify по ней САМ проверит вход и отвергнет мусор до вашего кода.
  schema: {
    params: {
      type: 'object',
      properties: { id: { type: 'integer' } },
      required: ['id'],
    },
  },
}, async (req, reply) => {
  // Сюда мы попадём, только если id — действительно целое число.
  const product = await db.findProduct(req.params.id);
  if (!product) {
    return reply.code(404).send({ error: 'Не найдено' });
  }
  return product;      // просто вернуть — Fastify сам превратит в JSON
});

await app.listen({ port: 3000 });

// БОНУС, О КОТОРОМ РЕДКО ДУМАЮТ: из этих же схем автоматически
// собирается документация API. Одно описание — и проверка, и справочник.`;

  protected readonly nestExample = `// NESTJS — тяжёлый каркас «всё в комплекте», очень похожий на Angular
// и на Spring из мира Java. Классы, декораторы, внедрение зависимостей.

import { Controller, Get, Param, NotFoundException, Injectable } from '@nestjs/common';

// СЕРВИС — здесь живут правила. Он ничего не знает про HTTP.
@Injectable()
export class ProductsService {
  async findOne(id: number) {
    const product = await this.db.findProduct(id);
    if (!product) throw new NotFoundException('Товар не найден');
    return product;
  }
}

// КОНТРОЛЛЕР — только про HTTP: какой адрес, какой метод, что вернуть.
@Controller('api/products')
export class ProductsController {
  // Сервис не создаётся руками — каркас сам его подставит.
  constructor(private readonly products: ProductsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(Number(id));
  }
}

// ЗАЧЕМ ТАКАЯ ЦЕРЕМОННОСТЬ. В обмен на многословность вы получаете
// одинаковую структуру во всех проектах: любой новый человек знает,
// что правила лежат в сервисах, а HTTP — в контроллерах.
// На команде из двадцати человек это дороже краткости.
// На проекте из трёх экранов — избыточно.`;

  protected readonly fullService = `// Маленький, но целый сервис: всё, о чём говорилось на прошлой странице.

import express from 'express';
import { z } from 'zod';                    // проверка формы данных

const app = express();
app.use(express.json());

// СЛОЙ 1. Каждому запросу — номер и строчка в журнале.
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  console.log(JSON.stringify({ id: req.id, method: req.method, path: req.url }));
  next();
});

// СХЕМА. Описываем, что считаем правильным телом запроса.
const CreateOrderSchema = z.object({
  productId: z.number().int().positive(),
  qty: z.number().int().min(1).max(100),
});

app.post('/api/orders', async (req, res, next) => {
  try {
    // 1. Кто пришёл
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Войдите в аккаунт' });
    }

    // 2. Что прислали — одной строкой вместо десяти проверок вручную
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Неверные данные заказа' });
    }
    const { productId, qty } = parsed.data;

    // 3. Можно ли
    const product = await db.findProduct(productId);
    if (!product) return res.status(404).json({ error: 'Товара нет' });
    if (product.stock < qty) {
      return res.status(409).json({ error: 'Недостаточно на складе' });
    }

    // 4. Делаем — цену берём из базы, а не от клиента
    const order = await db.createOrder({
      userId: user.id,
      productId,
      qty,
      total: product.price * qty,
    });

    // 5. Медленное — в очередь, не заставляя человека ждать
    await queue.add('order-email', { orderId: order.id });

    res.status(201).json(order);
  } catch (err) {
    next(err);        // отдаём общему ловцу ошибок
  }
});

// ПОСЛЕДНИЙ СЛОЙ. Ловит всё, что упало в любом обработчике.
// Четыре аргумента вместо трёх — так Express понимает, что это ловец ошибок.
app.use((err, req, res, next) => {
  console.error(JSON.stringify({ id: req.id, message: err.message }));
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(process.env.PORT ?? 3000);`;

  protected readonly typescriptServer = `// TypeScript на сервере полезнее, чем на клиенте. Причина простая:
// на клиенте ошибку увидит один пользователь, на сервере — все сразу.

interface CreateOrderBody {
  productId: number;
  qty: number;
}

// Тип на теле запроса заставляет думать заранее.
app.post('/api/orders', async (req: Request<{}, {}, CreateOrderBody>, res) => {
  const { productId, qty } = req.body;
  // Здесь редактор уже знает, что это числа, и подскажет опечатку в имени поля.
});

// НО ОСТОРОЖНО, ЭТО ЛОВУШКА НОМЕР ОДИН.
// Тип — это ОБЕЩАНИЕ на этапе компиляции. Он НЕ проверяет данные во время работы.
// Клиент может прислать что угодно, и TypeScript этому никак не помешает:
// он к тому моменту уже исчез из кода.

// ПОЭТОМУ на границе с внешним миром типов НЕДОСТАТОЧНО — нужна проверка.
import { z } from 'zod';

const CreateOrderSchema = z.object({
  productId: z.number().int().positive(),
  qty: z.number().int().min(1),
});

// Из схемы можно вывести тип — и получить одно описание вместо двух.
type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

const data = CreateOrderSchema.parse(req.body);   // упадёт, если пришёл мусор
// теперь и типы верны, И данные действительно проверены`;

  protected readonly denoExample = `// DENO — та же идея (JavaScript на сервере), но переделанная с нуля
// тем же человеком, который когда-то создал Node, с учётом его ошибок.

// ОТЛИЧИЕ 1: разрешения. По умолчанию программа НЕ МОЖЕТ НИЧЕГО.
// Запуск без разрешений — и попытка прочитать файл упадёт:
//   deno run server.ts                            → ошибка доступа
//   deno run --allow-net --allow-read server.ts   → работает
//
// Зачем: случайно установленный вредоносный пакет не сможет
// прочитать ваши ключи и отправить их на чужой сервер — ему просто не дали сеть.

// ОТЛИЧИЕ 2: TypeScript работает сразу, без настройки и сборки.
interface Product {
  id: number;
  name: string;
}

// ОТЛИЧИЕ 3: сервер поднимается встроенными средствами, без библиотек.
Deno.serve({ port: 3000 }, (req: Request): Response => {
  const url = new URL(req.url);

  if (url.pathname === '/api/products') {
    const products: Product[] = [{ id: 1, name: 'Кружка' }];
    return Response.json(products);
  }

  return new Response('Не найдено', { status: 404 });
});

// Обратите внимание на Request и Response — это те же самые объекты,
// что и в браузере при работе с fetch. Deno намеренно использует
// браузерные стандарты вместо своих выдуманных.`;

  protected readonly bunExample = `// BUN — ставка на скорость. Это одновременно среда запуска,
// пакетный менеджер, сборщик и запускалка тестов в одной программе.

// Тот же сервер:
Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/api/products') {
      return Response.json([{ id: 1, name: 'Кружка' }]);
    }

    return new Response('Не найдено', { status: 404 });
  },
});

// ГДЕ ВЫИГРЫШ ЗАМЕТЕН БОЛЬШЕ ВСЕГО — не в обработке запросов,
// а в скучных ежедневных операциях:
//   bun install   — установка пакетов в разы быстрее npm
//   bun test      — тесты без отдельной библиотеки
//   bun run       — запуск TypeScript без сборки

// ЧЕСТНО О РИСКЕ: Bun моложе остальных. Совместимость с Node очень высокая,
// но не стопроцентная, и на редких пакетах можно наткнуться на сюрприз.
// Многие команды используют Bun как инструмент разработки,
// а в бою продолжают запускать проверенный Node.`;

  protected readonly runningInProduction = `# Как Node-приложение живёт на боевом сервере.

# ПРОБЛЕМА 1: один процесс использует одно ядро процессора.
# На машине с восемью ядрами семь простаивают.
# Решение — запустить по копии на ядро. Они поделят один порт между собой.
pm2 start server.js -i max

# ПРОБЛЕМА 2: программа упала ночью — и лежит до утра.
# Решение — менеджер процессов, который поднимает её обратно.
pm2 start server.js --name shop-api

# ПРОБЛЕМА 3: как выложить новую версию, не оборвав тех, кто сейчас на сайте.
# Решение — перезапуск по одной копии: пока обновляется первая,
# остальные обслуживают людей.
pm2 reload shop-api

# В КОНТЕЙНЕРАХ ВСЁ ЭТО ВЫГЛЯДИТ ИНАЧЕ. Там одна копия = один контейнер,
# а перезапуском и количеством копий занимается оркестратор (Kubernetes).
# Тогда pm2 внутри контейнера не нужен — он только мешает.

# ОБЯЗАТЕЛЬНАЯ СТРОКА, КОТОРУЮ ЗАБЫВАЮТ:
NODE_ENV=production
# Без неё многие библиотеки (включая Express) работают в режиме разработки:
# медленнее и с подробными ошибками, которые видит посторонний.`;

  protected readonly whenNode = `// ЧЕСТНЫЙ ТЕСТ: подходит ли Node вашей задаче?
// Задайте один вопрос — ЧЕМ ЗАНЯТ СЕРВЕР БОЛЬШУЮ ЧАСТЬ ВРЕМЕНИ?

// ЖДЁТ  → Node отличный выбор
//   ждёт ответа базы
//   ждёт ответа чужого API
//   ждёт, пока клиент дошлёт данные
//   держит тысячу открытых соединений чата, где почти всегда тишина

// СЧИТАЕТ → Node плохой выбор
//   обрабатывает видео
//   пережимает тысячи изображений
//   считает большую математическую модель
//   разбирает файл на четыре гигабайта

// ТИПИЧНОЕ ВЕБ-ПРИЛОЖЕНИЕ на 95% состоит из ожидания.
// Именно поэтому Node на нём так хорош — и именно поэтому
// его репутация «медленного» несправедлива: он не медленный,
// он просто не про вычисления.`;
}
