import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-api-realtime',
  imports: [CodeBlock, RouterLink],
  templateUrl: './realtime.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemApiRealtime {
  protected readonly pollingBasic = `// СТУПЕНЬ 2. Самое простое, что вообще можно придумать:
// спрашивать сервер по таймеру. Это называется ОПРОС (по-английски polling).

// Внутри — обычный HTTP-запрос. Тот самый fetch, что и на всех остальных
// страницах. Ничего нового сервер уметь не должен, ни одной новой строки там.
async function loadMessages() {
  const res = await fetch('/api/messages');
  const messages = await res.json();
  render(messages);
}

loadMessages();                              // сразу при открытии экрана
const timer = setInterval(loadMessages, 5000);   // и потом каждые 5 секунд

// ОБЯЗАТЕЛЬНО убрать таймер, когда экран закрылся.
// Иначе он продолжит стучать в сервер и складывать данные в компонент,
// которого уже нет на странице. Это одна из самых частых утечек на фронтенде.
clearInterval(timer);

// В React очистка возвращается из useEffect:
//
//   useEffect(() => {
//     const id = setInterval(loadMessages, 5000);
//     return () => clearInterval(id);   // ← вот эта строка
//   }, []);

// ЧТО ПОЛУЧИЛОСЬ ХОРОШЕГО (не спешите морщиться, список длиннее, чем кажется):
//   • это работает СЕЙЧАС, на любом сервере, вообще без переделок бэкенда;
//   • это работает через любой корпоративный прокси и любой мобильный интернет;
//   • обрыв связи чинится сам собой: следующий тик просто сходит ещё раз;
//   • отлаживается в обычной вкладке «Сеть» в инструментах разработчика;
//   • ломать тут просто нечего.`;

  protected readonly pollingSmart = `// Опрос — совершенно нормальное решение. Но его легко сделать
// в разы дешевле. Четыре приёма, каждый экономит гору лишних запросов.

// ПРИЁМ 1. Не опрашивать, когда на вкладку никто не смотрит.
// Человек ушёл читать почту — обновлять экран, который он не видит, незачем.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopPolling();
  else startPolling();      // вернулся — сразу спрашиваем и продолжаем цикл
});

// ПРИЁМ 2. Спрашивать «что нового ПОСЛЕ вот этого», а не «отдай всё».
// Сервер тогда почти всегда отвечает пустым массивом — а это несколько байт
// вместо двухсот сообщений с текстами и аватарками.
let lastSeenId = 0;

async function askForNews() {
  const res = await fetch('/api/messages?after=' + lastSeenId);
  const fresh = await res.json();

  if (fresh.length > 0) {
    lastSeenId = fresh[fresh.length - 1].id;
    appendMessages(fresh);
  }
  return fresh.length > 0;
}

// ПРИЁМ 3. Растягивать паузу, когда ничего не происходит.
// Идёт живой разговор — спрашиваем часто. Полчаса тишины — раз в минуту.
let delay = 3000;

async function loop() {
  const gotSomething = await askForNews();

  // Что-то пришло — возвращаемся к быстрому темпу.
  // Пусто — увеличиваем паузу в полтора раза, но не больше минуты.
  delay = gotSomething ? 3000 : Math.min(delay * 1.5, 60000);

  setTimeout(loop, delay);
}

// ПРИЁМ 4. setTimeout В КОНЦЕ ОТВЕТА, а не setInterval.
// Разница принципиальная. setInterval выпускает новый запрос каждые 5 секунд
// независимо от того, вернулся ли предыдущий. На плохой связи, где ответ идёт
// 12 секунд, запросы наложатся друг на друга и устроят лавину.
// setTimeout после ответа гарантирует: в воздухе всегда ровно один запрос.

loop();`;

  protected readonly longPolling = `// СТУПЕНЬ 3. ДЛИННЫЙ ОПРОС (long polling).
// Идея в одной фразе: клиент задаёт вопрос, а сервер НЕ ОТВЕЧАЕТ,
// пока не появится, что сказать. Запрос просто висит открытым.

// ─────────── СЕРВЕР (Express) ───────────

// Список тех, кто прямо сейчас висит и ждёт ответа.
// Это НЕ соединения в каком-то особом смысле — это обычные объекты res,
// которым мы просто ещё не вызвали res.json().
const waiting = new Set();

app.get('/api/messages/wait', (req, res) => {
  const after = Number(req.query.after ?? 0);

  // Может, новости появились, пока клиент бежал к нам? Тогда отвечаем сразу.
  const fresh = store.messagesAfter(after);
  if (fresh.length > 0) {
    return res.json(fresh);
  }

  // Новостей нет. И вот здесь самое главное: мы НЕ отвечаем.
  // Запоминаем res и выходим из функции. Запрос остался открытым.
  waiting.add(res);

  // СТРАХОВКА. Держать вечно нельзя: прокси, балансировщики и мобильные сети
  // убивают запросы, которые молчат минуту-другую. Поэтому через 30 секунд
  // честно отвечаем пустотой, а клиент тут же спросит снова.
  const timeout = setTimeout(() => {
    waiting.delete(res);
    res.json([]);
  }, 30000);

  // Клиент мог закрыть вкладку, пока мы держали его запрос.
  // Без этой уборки список waiting будет расти, пока сервер не съест память.
  req.on('close', () => {
    clearTimeout(timeout);
    waiting.delete(res);
  });
});

// Кто-то написал сообщение — будим всех, кто ждёт.
function onNewMessage(message) {
  store.add(message);

  for (const res of waiting) {
    res.json([message]);
  }
  waiting.clear();
}

// ─────────── КЛИЕНТ ───────────

let lastSeenId = 0;

async function loop() {
  try {
    // Этот await спокойно может висеть 30 секунд — и это НОРМАЛЬНО.
    const res = await fetch('/api/messages/wait?after=' + lastSeenId);
    const fresh = await res.json();

    if (fresh.length > 0) {
      lastSeenId = fresh[fresh.length - 1].id;
      appendMessages(fresh);
    }

    loop();     // ответ получен — немедленно задаём вопрос заново
  } catch {
    // Сеть отвалилась. Не долбимся в закрытую дверь, ждём и пробуем.
    setTimeout(loop, 3000);
  }
}

loop();`;

  protected readonly sseFull = `// СТУПЕНЬ 4. SSE — Server-Sent Events, дословно «события, посылаемые сервером».
// Это обычный HTTP-ответ, который сервер НИКОГДА не закрывает,
// а по мере появления новостей подливает в него новые строчки.
// Клиент читает их по одной, как из ручейка.

// ─────────── СЕРВЕР (Express) ───────────

const clients = new Set();

app.get('/api/stream', (req, res) => {
  // Три заголовка — и это весь протокол целиком. Больше знать нечего.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',  // «внутри не JSON, а поток событий»
    'Cache-Control': 'no-cache',          // ни в коем случае не кэшировать
    Connection: 'keep-alive',             // соединение держим открытым
  });

  // Подсказка браузеру: если я оборвусь — подожди 3 секунды и приходи снова.
  res.write('retry: 3000\\n\\n');

  clients.add(res);

  // ЕСЛИ КЛИЕНТ ПЕРЕПОДКЛЮЧИЛСЯ — браузер сам пришлёт номер последнего
  // события, которое он успел получить. Нам остаётся дослать пропущенное.
  // Заголовок называется Last-Event-ID, и это подарок, которого нет у вебсокета.
  const lastId = Number(req.headers['last-event-id'] ?? 0);
  for (const message of store.messagesAfter(lastId)) {
    res.write(formatEvent(message));
  }

  // Вкладку закрыли — убираем из списка, иначе память кончится.
  req.on('close', () => clients.delete(res));
});

// Формат событий до смешного простой: несколько строк вида «имя: значение»
// и ОБЯЗАТЕЛЬНАЯ пустая строка в конце — она означает «событие закончилось».
function formatEvent(message) {
  return (
    'id: ' + message.id + '\\n' +          // номер — его браузер запомнит
    'event: message\\n' +                  // имя события, придумываем сами
    'data: ' + JSON.stringify(message) + '\\n\\n'
  );
}

function broadcast(message) {
  const chunk = formatEvent(message);
  for (const res of clients) res.write(chunk);
}

// Раз в 20 секунд шлём комментарий — строку, начинающуюся с двоеточия.
// Клиент её проигнорирует, а вот прокси и мобильный оператор увидят,
// что по соединению что-то ходит, и не станут его закрывать.
setInterval(() => {
  for (const res of clients) res.write(': ping\\n\\n');
}, 20000);

// ─────────── КЛИЕНТ ───────────
// Ни одной библиотеки: EventSource встроен в браузер.

const source = new EventSource('/api/stream');

// Событие с тем именем, которое сервер написал в строке «event:».
source.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);   // e.data — это то, что было после «data: »
  appendMessage(msg);
});

// Соединение установлено — или ВОССТАНОВЛЕНО после обрыва.
source.addEventListener('open', () => setStatus('на связи'));

// Соединение оборвалось. Внимание: писать тут ничего не надо.
// Браузер УЖЕ поставил таймер и переподключится сам. Это второй подарок SSE.
source.addEventListener('error', () => setStatus('переподключаюсь'));

// Закрыть навсегда, когда экран больше не нужен:
// source.close();`;

  protected readonly wsHandshakeRaw = `GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Cookie: session=abc123

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`;

  protected readonly wsServerAndClient = `// СТУПЕНЬ 5. WEBSOCKET — постоянный канал, по которому говорят ОБА.

// ─────────── СЕРВЕР (библиотека ws, ставится как npm i ws) ───────────

import { WebSocketServer } from 'ws';

// Отдельный порт открывать НЕ надо. Вебсокет живёт на том же порту,
// что и обычный HTTP-сервер, потому что начинается он как обычный запрос.
const httpServer = app.listen(3000);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', (socket, req) => {
  // Сюда мы попадаем ОДИН раз на одного подключившегося человека.
  // Дальше socket живёт минутами и часами. Это и есть «труба».
  console.log('подключился, всего соединений:', wss.clients.size);

  // А вот и то, ради чего всё затевалось:
  // СЕРВЕР ЗАГОВОРИЛ ПЕРВЫМ. Его никто ни о чём не спрашивал.
  socket.send(JSON.stringify({ type: 'welcome', text: 'Привет!' }));

  socket.on('message', (raw) => {
    // По трубе едет просто текст. Никаких методов, адресов и кодов ответа
    // здесь нет вообще — весь смысл придумываем мы сами.
    const msg = JSON.parse(raw.toString());
    if (msg.type === 'chat') broadcast(msg);
  });

  socket.on('close', () => console.log('отключился'));
  socket.on('error', (err) => console.error('соединение сломалось', err));
});

// Разослать всем подключённым. Обратите внимание: тут нет никакого
// «ответа на запрос». Мы просто пишем в тридцать труб подряд.
function broadcast(message) {
  const text = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(text);
  }
}

// ─────────── КЛИЕНТ ───────────
// WebSocket встроен в браузер, ставить нечего.
// ws:// относится к http:// так же, как wss:// к https://.
// На боевом сайте — ТОЛЬКО wss://, иначе всё едет открытым текстом.

const socket = new WebSocket('wss://example.com/ws');

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'chat', text: 'Привет всем' }));
});

socket.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);   // e.data — строка (или двоичные данные)
  appendMessage(msg);
});

socket.addEventListener('close', (e) => {
  // Сюда мы попадём ОБЯЗАТЕЛЬНО. Вопрос не «если», а «когда».
  console.log('соединение закрылось, код', e.code);
});

socket.addEventListener('error', () => {
  // Подробностей браузер не даёт принципиально, из соображений безопасности.
  // Реальную причину ищите в логах сервера, а не здесь.
});

// ГЛАВНОЕ ОТЛИЧИЕ ОТ fetch, и его надо прочувствовать.
// У fetch есть ответ НА КОНКРЕТНЫЙ ЗАПРОС: написали await — получили результат.
// Здесь ответа «на запрос» нет вообще. Есть поток входящих сообщений,
// и связывать пришедшее с отправленным вы будете сами, своими руками.`;

  protected readonly wsReconnect = `// ГРАБЛИ №1: СОЕДИНЕНИЕ ОБЯЗАТЕЛЬНО ОБОРВЁТСЯ.
// Метро, лифт, переход с вайфая на мобильный интернет, выкладка новой версии
// сервера, лимит времени на прокси. Поэтому переподключение — это не
// улучшение «когда будет время», а обязательная часть кода с первого дня.

let socket = null;
let attempt = 0;
let closedOnPurpose = false;

function connect() {
  socket = new WebSocket('wss://example.com/ws');

  socket.addEventListener('open', () => {
    attempt = 0;              // получилось — сбрасываем счётчик попыток
    setStatus('на связи');
    resync();                 // догружаем пропущенное, см. следующий пример
  });

  socket.addEventListener('close', () => {
    if (closedOnPurpose) return;   // мы сами закрыли — переподключаться незачем

    setStatus('нет связи, переподключаюсь');

    // НАРАСТАЮЩАЯ ПАУЗА. Представьте: сервер прилёг на минуту, а десять тысяч
    // вкладок ломятся к нему каждую секунду. Он не встанет уже никогда.
    // Поэтому пауза удваивается: 1с, 2с, 4с, 8с, 16с — и дальше не больше 30.
    const base = Math.min(1000 * 2 ** attempt, 30000);
    attempt = attempt + 1;

    // РАЗБРОС (по-английски jitter). Без него все десять тысяч вкладок
    // проснутся В ОДНУ И ТУ ЖЕ СЕКУНДУ и устроят серверу второй удар.
    // Добавляем случайность и размазываем толпу по времени.
    const wait = base * (0.7 + Math.random() * 0.3);

    setTimeout(connect, wait);
  });
}

connect();

// Уходим со страницы — закрываемся честно, чтобы сервер не держал
// мёртвую трубу и не тратил на неё память.
window.addEventListener('beforeunload', () => {
  closedOnPurpose = true;
  socket?.close();
});`;

  protected readonly wsKeepAlive = `// ГРАБЛИ №2: МОЛЧАЩЕЕ СОЕДИНЕНИЕ УБИВАЮТ.
// Корпоративные прокси, домашние роутеры и мобильные операторы закрывают
// соединения, по которым долго ничего не ходит. Ночью в чате тихо —
// и к утру отвалились все, причём никто об этом даже не узнал.
// Лечение: пинг-понг. Раз в 30 секунд шлём что-нибудь бессмысленное.

// НА СЕРВЕРЕ. Библиотека ws умеет служебные кадры ping и pong —
// браузер отвечает на них сам, писать код на клиенте не нужно.
setInterval(() => {
  for (const client of wss.clients) {
    if (client.isAlive === false) {
      client.terminate();       // не ответил на прошлый пинг — считаем мёртвым
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 30000);

wss.on('connection', (socket) => {
  socket.isAlive = true;
  socket.on('pong', () => {
    socket.isAlive = true;      // ответил — значит живой, отметили
  });
});

// Зачем вообще выкидывать мёртвых: соединение, которое физически давно
// оборвалось, продолжает занимать память сервера и попадать в рассылки.
// Тысяча таких призраков — и сервер тратит силы на разговор с пустотой.


// ГРАБЛИ №3: ПОКА СВЯЗИ НЕ БЫЛО, СООБЩЕНИЯ ПОТЕРЯЛИСЬ.
// Вебсокет ничего не помнит и ничего не переспрашивает. Оборвалось на
// 40 секунд — всё, что сервер разослал за это время, до вас не доехало.
// И вам об этом никто не скажет: экран будет выглядеть нормально.

let lastSeenId = 0;

// ЕДИНСТВЕННОЕ место, где меняется список. Через него проходит всё:
// и то, что приехало по вебсокету, и то, что догрузили запросом.
function apply(message) {
  if (message.id <= lastSeenId) return;   // уже видели — молча выходим
  lastSeenId = message.id;
  appendMessage(message);
}

// Догрузка обычным HTTP-запросом. Вызывается при КАЖДОМ открытии соединения.
async function resync() {
  const res = await fetch('/api/messages?after=' + lastSeenId);
  if (!res.ok) return;
  for (const message of await res.json()) apply(message);
}

// ПРАВИЛО, КОТОРОЕ СПАСАЕТ ПРОЕКТЫ:
// вебсокет — это УСКОРИТЕЛЬ, а не единственный источник данных.
//   • первая загрузка экрана — обычным HTTP;
//   • восстановление после обрыва — обычным HTTP;
//   • вебсокет только приносит то, что появилось, пока вы смотрели на экран.
// Если выключить вебсокет совсем, приложение должно остаться рабочим —
// просто перестанет обновляться само.`;

  protected readonly wsAuth = `// ГРАБЛИ №4: АВТОРИЗАЦИЯ. А кто это вообще подключился?

// Проблема в том, что у конструктора WebSocket в браузере НЕТ параметра
// для заголовков. Написать привычное Authorization: Bearer ... просто негде:
//
//   new WebSocket(url, protocols)     // и всё, третьего аргумента не бывает

// СПОСОБ 1, самый частый и самый простой: ОБЫЧНАЯ СЕССИОННАЯ COOKIE.
// Рукопожатие — это обычный HTTP-запрос, значит браузер приложит к нему куки
// сам, как к любому другому запросу. На сервере читаем их из req.headers.

const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', async (req, socket, head) => {
  const user = await getUserFromCookies(req.headers.cookie);

  if (!user) {
    // Отказываем ДО того, как соединение станет вебсокетом.
    // Это ещё обычный HTTP, поэтому и ответ обычный, текстом.
    socket.write('HTTP/1.1 401 Unauthorized\\r\\n\\r\\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.user = user;                    // прикалываем человека к соединению
    wss.emit('connection', ws, req);   // и только теперь пускаем внутрь
  });
});

// СПОСОБ 2: первым сообщением после открытия прислать токен.
// До этого момента соединение считается «не представившимся»: ничего ему
// не рассылаем и через 5 секунд молчания закрываем.
socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'auth', token: accessToken }));
});

// ЧЕГО ДЕЛАТЬ НЕ НАДО: класть токен в адрес.
//   wss://example.com/ws?token=eyJhbGciOi...        ← плохая идея
// Адреса оседают в логах прокси, в отчётах об ошибках и в истории.
// Токен оттуда достанут без всякого взлома.

// И ГЛАВНОЕ, О ЧЁМ ЗАБЫВАЮТ ПОЧТИ ВСЕ.
// Пустить человека в трубу — это только вход в здание. Права надо проверять
// на КАЖДОЕ входящее сообщение: «а он вообще состоит в комнате, куда пишет?»
// Ровно то же правило, что и в обычных обработчиках: клиенту не верим ни в чём.
socket.on('message', async (raw) => {
  const msg = JSON.parse(raw.toString());

  if (!(await canWriteToRoom(socket.user.id, msg.roomId))) {
    return;   // молча игнорируем: подсказывать чужому нечего
  }
  broadcastToRoom(msg.roomId, msg);
});`;

  protected readonly wsScaleRedis = `// ГРАБЛИ №5, САМЫЕ БОЛЬНЫЕ: ДВА СЕРВЕРА.
//
// Пока копия сервера одна, всё работает идеально. Запустили вторую ради
// нагрузки — и половина сообщений перестала доходить. Причём «через раз»,
// что бесит сильнее всего: воспроизвести невозможно, в логах пусто.
//
// ПОЧЕМУ. Соединение Ани физически висит в оперативной памяти ПЕРВОЙ копии,
// а соединение Бориса — во ВТОРОЙ. Аня пишет, первая копия честно проходит
// по своему списку wss.clients — а Бориса в этом списке просто нет.
// Он висит в другом процессе, возможно вообще на другой машине.

// РЕШЕНИЕ: общий канал, который слышат ВСЕ копии. Чаще всего это Redis
// в режиме публикации и подписки (pub/sub). Аналогия — рация: копия не
// кричит в свою комнату, а говорит в рацию, а рацию слышат все комнаты.

import { createClient } from 'redis';

const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = publisher.duplicate();   // подписчику нужно своё соединение
await publisher.connect();
await subscriber.connect();

// ШАГ 1. Пришло сообщение от Ани. НЕ рассылаем его сразу своим —
// вместо этого говорим в рацию.
function onIncoming(message) {
  publisher.publish('chat', JSON.stringify(message));
}

// ШАГ 2. Рацию слушают ВСЕ копии, включая ту, которая только что говорила.
subscriber.subscribe('chat', (raw) => {
  // ШАГ 3. И вот здесь каждая копия рассылает своим подключённым.
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(raw);
  }
});

// ВАЖНАЯ ДЕТАЛЬ, НА КОТОРОЙ СПОТЫКАЮТСЯ: рассылка теперь идёт ТОЛЬКО
// из обработчика подписки. Если по привычке оставить ещё и прямую рассылку
// внутри onIncoming, свои клиенты получат сообщение дважды.

// ЕЩЁ ОДНА ЛОВУШКА: «ЛИПКИЕ СЕССИИ».
// Балансировщик должен отправлять запросы одного человека на одну и ту же
// копию. Для чистого вебсокета это обычно не нужно: соединение одно и живёт
// долго. А вот для Socket.IO с запасным транспортом — нужно почти всегда,
// иначе рукопожатие и следующий запрос попадут на разные машины.`;

  protected readonly socketIo = `// Socket.IO — библиотека ПОВЕРХ вебсокета. Важно понимать: это не протокол,
// а надстройка со своим форматом сообщений. Сервер Socket.IO НЕ поймёт
// обычный WebSocket-клиент, а клиент Socket.IO не подключится к серверу на ws.

// ─────────── СЕРВЕР ───────────
import { Server } from 'socket.io';
const io = new Server(httpServer);

io.on('connection', (socket) => {
  // 1. СОБЫТИЯ ПО ИМЕНАМ. Не надо самому придумывать поле type
  //    и вручную разбирать JSON в большом switch.
  socket.on('chat:send', (payload) => {
    io.to(payload.roomId).emit('chat:new', payload);
  });

  // 2. КОМНАТЫ ИЗ КОРОБКИ: рассылка не всем подряд, а нужной группе.
  socket.on('room:join', (roomId) => socket.join(roomId));

  // 3. ПОДТВЕРЖДЕНИЯ: почти привычный запрос-ответ поверх трубы.
  //    Клиент узнает, что сервер сообщение действительно принял.
  socket.on('message:read', (id, ack) => {
    markRead(id);
    ack({ ok: true });
  });
});

// ─────────── КЛИЕНТ ───────────
import { io as connect } from 'socket.io-client';

const socket = connect('https://example.com');

socket.on('chat:new', (msg) => appendMessage(msg));
socket.emit('chat:send', { roomId: 'general', text: 'Привет' });

// ЧТО ОНА ДАЁТ ПОВЕРХ ГОЛОГО ВЕБСОКЕТА — фактически весь список граблей выше:
//   • переподключение с нарастающей паузой — уже написано за вас;
//   • пинг-понг против засыпающих прокси — тоже;
//   • комнаты и рассылка по группам;
//   • события по именам вместо самодельного разбора сообщений;
//   • подтверждения доставки;
//   • ЗАПАСНОЙ ТРАНСПОРТ: если вебсокет не проходит через корпоративный
//     прокси, библиотека тихо переключится на длинный опрос и продолжит
//     работать. Пользователь вообще ничего не заметит;
//   • готовый адаптер для нескольких копий сервера через Redis.

// ЧЕМ ПЛАТИТЕ:
//   • лишние килобайты в сборке клиента;
//   • свой протокол вместо стандартного: мобильное приложение или чужой
//     сервис не подключатся к вам обычными средствами;
//   • «липкие сессии» на балансировщике становятся почти обязательными;
//   • легко перестать понимать, что происходит под капотом, — а когда
//     сломается, разбираться придётся всё равно.`;

  protected readonly stateOnClient = `// Данные теперь приезжают САМИ, в непредсказуемый момент. Куда их класть?

// ПЛОХО: завести отдельный список «то, что пришло по вебсокету» рядом
// со списком, загруженным обычным запросом. Получится два источника правды
// и вечный вопрос «а какой из них сейчас настоящий». Экран начнёт мигать.

// ХОРОШО: у экрана ОДИН список, а вебсокет просто правит его.
// С библиотекой запросов вроде TanStack Query это выглядит так:

socket.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);

  // ВАРИАНТ А: точечно дописать в уже загруженный список.
  // Быстро, экран не мигает, лишнего запроса на сервер нет.
  queryClient.setQueryData(['messages', msg.roomId], (old = []) => {
    if (old.some((m) => m.id === msg.id)) return old;   // защита от дубля
    return [...old, msg];
  });

  // ВАРИАНТ Б: пометить данные устаревшими и дать библиотеке перезапросить.
  // Дороже на один запрос, зато вы гарантированно видите то же, что в базе.
  // queryClient.invalidateQueries({ queryKey: ['messages', msg.roomId] });
});

// КАК ВЫБРАТЬ МЕЖДУ А И Б:
//   • сообщение маленькое и самодостаточное («вот новое сообщение целиком»)
//     → вариант А, дописываем руками;
//   • событие означает «что-то поменялось, подробности сложные»
//     (пересчиталась корзина, изменился статус заказа и ещё пять полей)
//     → вариант Б, пусть библиотека сходит и заберёт свежую правду.

// ТРИ ПРАВИЛА, КОТОРЫЕ ЭКОНОМЯТ ДНИ ОТЛАДКИ:
//
// 1. Сообщение может прийти ДВАЖДЫ. Переподключение, догрузка, повтор
//    на сервере — причин много. Всегда проверяйте по id, не видели ли уже.
//    Свойство «применили один раз или пять — результат одинаковый»
//    называется идемпотентностью, и оно тут обязательно.
//
// 2. Сообщения могут прийти НЕ ПО ПОРЯДКУ. Сортируйте сами: по номеру или
//    по времени, проставленному СЕРВЕРОМ (часы на устройствах врут).
//
// 3. Маленькое событие «что-то изменилось» надёжнее, чем «вот новое
//    состояние целиком». Событие + перезапрос почти никогда не разъедется
//    с базой, а самодельная сборка состояния из кусочков — разъедется.`;

  protected readonly chatServer = `// ═══════════ МИНИ-ЧАТ: СЕРВЕР ЦЕЛИКОМ ═══════════
// npm i express ws

import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());

// Вместо базы — обычный массив. В настоящем проекте здесь была бы база,
// но на суть это не влияет.
const messages = [];
let nextId = 1;

// ─── ЧАСТЬ 1. ОБЫЧНЫЙ HTTP: первая загрузка и догрузка пропущенного. ───
// Эта часть нужна ВСЕГДА, даже когда вебсокет работает идеально.
app.get('/api/messages', (req, res) => {
  const after = Number(req.query.after ?? 0);
  res.json(messages.filter((m) => m.id > after));
});

const httpServer = app.listen(3000, () => console.log('жду на порту 3000'));

// ─── ЧАСТЬ 2. ВЕБСОКЕТ: живые сообщения. ───
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', async (socket, req) => {
  // ПРОПУСК. Рукопожатие — обычный HTTP-запрос, куки приехали в заголовках.
  const user = await getUserFromCookies(req.headers.cookie);
  if (!user) {
    // Коды закрытия от 4000 и выше — свои, прикладные. Клиент по ним поймёт,
    // что переподключаться бессмысленно: само это не починится.
    socket.close(4001, 'нужно войти');
    return;
  }

  socket.user = user;
  socket.isAlive = true;
  socket.on('pong', () => {
    socket.isAlive = true;
  });

  socket.on('message', (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(raw.toString());
    } catch {
      return;   // прислали не JSON — молча игнорируем; падать нам нельзя
    }
    if (incoming.type !== 'chat') return;

    // КЛИЕНТУ НЕ ВЕРИМ НИ В ЧЁМ — точно так же, как в обычном обработчике.
    // Берём у него только текст, и то подрезанный.
    const text = String(incoming.text ?? '').trim().slice(0, 2000);
    if (text.length === 0) return;

    const message = {
      id: nextId,
      author: user.name,                      // ← из пропуска, а не из запроса
      text,
      createdAt: new Date().toISOString(),    // ← часы сервера, а не устройства
    };
    nextId = nextId + 1;
    messages.push(message);

    broadcast(message);
  });
});

function broadcast(message) {
  const payload = JSON.stringify({ type: 'message', message });
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(payload);
  }
}

// ─── ЧАСТЬ 3. ПИНГ-ПОНГ: выкидываем тех, кто уже не отвечает. ───
setInterval(() => {
  for (const client of wss.clients) {
    if (client.isAlive === false) {
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 30000);`;

  protected readonly chatClient = `// ═══════════ МИНИ-ЧАТ: КЛИЕНТ ЦЕЛИКОМ ═══════════
// Ни одной библиотеки: WebSocket и fetch встроены в браузер.

let socket = null;
let attempt = 0;
let lastSeenId = 0;
let closedOnPurpose = false;

// ─── ШАГ 1. Единственное место, где меняется список сообщений. ───
// Через него проходит ВСЁ: и вебсокет, и догрузка запросом.
// Отсюда же берётся защита от дублей и от сообщений «из прошлого».
function apply(message) {
  if (message.id <= lastSeenId) return;
  lastSeenId = message.id;
  renderMessage(message);
}

// ─── ШАГ 2. Загрузка истории обычным HTTP. ───
// Вызывается и при старте, и после КАЖДОГО переподключения.
async function loadHistory() {
  const res = await fetch('/api/messages?after=' + lastSeenId);
  if (!res.ok) return;
  for (const message of await res.json()) apply(message);
}

// ─── ШАГ 3. Соединение с переподключением. ───
function connect() {
  // location.host — тот же адрес, откуда открыта страница.
  // wss:// — защищённая версия. На боевом сайте только она.
  socket = new WebSocket('wss://' + location.host + '/ws');

  socket.addEventListener('open', async () => {
    attempt = 0;
    setStatus('на связи');
    // ДОГРУЖАЕМ ТО, ЧТО ПРОПУСТИЛИ, пока связи не было. Обычным HTTP.
    await loadHistory();
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') apply(data.message);
  });

  socket.addEventListener('close', (event) => {
    if (closedOnPurpose) return;

    // 4001 мы придумали сами на сервере: «нужно войти».
    // Переподключаться бессмысленно — само не заработает.
    if (event.code === 4001) {
      setStatus('нужно войти заново');
      return;
    }

    setStatus('нет связи, переподключаюсь');
    const base = Math.min(1000 * 2 ** attempt, 30000);
    attempt = attempt + 1;
    setTimeout(connect, base * (0.7 + Math.random() * 0.3));
  });

  socket.addEventListener('error', () => {
    // Ничего не делаем: после ошибки всегда придёт close, а вся логика там.
  });
}

// ─── ШАГ 4. Отправка. ───
function send(text) {
  // Труба может быть закрыта прямо сейчас. Проверяем ВСЕГДА.
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    setStatus('нет связи — сообщение не отправлено');
    return;
  }
  socket.send(JSON.stringify({ type: 'chat', text }));
}

// ─── ШАГ 5. Запуск и честное закрытие. ───
loadHistory().then(connect);

window.addEventListener('beforeunload', () => {
  closedOnPurpose = true;
  socket?.close();
});

// ЧТО ЗДЕСЬ ВАЖНОГО, кроме самого чата:
//   • история грузится обычным HTTP — вебсокет только добавляет новое;
//   • после каждого обрыва история догружается заново, дыр не остаётся;
//   • дубли отсекаются по номеру, так что догрузка безопасна;
//   • переподключение с нарастающей паузой и разбросом;
//   • отдельно обработан случай «переподключаться бессмысленно».
// Уберите любой из этих пунктов — и чат будет тихо терять сообщения.`;
}
