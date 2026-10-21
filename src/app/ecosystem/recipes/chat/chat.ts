import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-recipes-chat',
  imports: [CodeBlock, RouterLink],
  templateUrl: './chat.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemRecipesChat {
  protected readonly chatIceberg = `

═══ ОДНО СООБЩЕНИЕ ГЛАЗАМИ ЛЕНЫ И ДИМЫ ═══

  кто     Лена, управляющая «Пенки», — в канал «#смены» (14 участников)
  что     «Дима, выйдешь завтра в 8 вместо Вики?»
  где     Лена — с телефона в метро; Дима — с телефона за стойкой
          и с ноутбука в подсобке

  ЧТО ОНИ ВИДЯТ — четыре действия
    1. Лена пишет и нажимает «Отправить» — часики → одна галочка
    2. Дима получает уведомление, открывает чат
    3. у Лены галочки становятся синими — «прочитано»
    4. Дима отвечает «Да, выйду» — ответ появляется ПОД вопросом


═══ ЧТО В ЭТО ВРЕМЯ ДЕЛАЕТ «ЛЕТУЧКА» ═══

  НА ТЕЛЕФОНЕ ЛЕНЫ
     1. создаёт временный номер сообщения clientMsgId — случайный UUID
     2. сразу показывает сообщение серым с часиками («отправляется»)
     3. отправляет по открытому соединению; нет ответа 10 секунд —
        повторяет С ТЕМ ЖЕ clientMsgId

  НА СЕРВЕРЕ
     4. проверяет: Лена — участник «#смены», беседа — её компании
     5. «уже было сообщение с этим clientMsgId?» — повтор не создаёт дубль
     6. выдаёт номер в беседе: 42 — одним атомарным запросом
     7. записывает сообщение в базу — с этой секунды оно существует
     8. отвечает телефону Лены: «принято, clientMsgId → № 42» — одна галочка
     9. публикует событие в шину: «в #смены новое сообщение № 42»
    10. каждый сервер раздаёт его своим соединениям участников «#смены»
    11. у кого соединения нет — задача на push (если канал не заглушён)
    12. счётчик непрочитанных растёт у 13 участников (у Лены — нет)

  НА ТЕЛЕФОНЕ ДИМЫ
    13. получает № 42, видит, что последний был № 41 — пропусков нет
    14. сообщает «доставлено до № 42» — у Лены вторая галочка
    15. Дима открыл беседу → «прочитано до № 42» — у Лены синие галочки,
        у Димы счётчик сбрасывается на телефоне И на ноутбуке


═══ ЧТО ЛОМАЕТСЯ У НАСТОЯЩИХ ЛЮДЕЙ ═══

  ситуация                              без защиты               защита (раздел)
  ─────────────────────────────────────────────────────────────────────────────
  Лена в лифте, ответ сервера потерялся дубль сообщения          clientMsgId («Отправка»)
  часы у Димы отстают на 2 минуты       ответ выше вопроса       номер в беседе («Порядок»)
  Дима полчаса в метро                  пропущенные сообщения    догрузка с номера («Обрыв»)
  прочитал на телефоне                  на ноутбуке «5 новых»    указатель прочтения
  приложение у Вики закрыто             ничего не узнает         push («Уведомления»)
  Лена и Дима на разных серверах        сообщение «потерялось»   шина событий («Масштаб»)


═══ КАК НЕ НАДО ═══

  «id сообщения генерирует база, клиенту номер не нужен»                 [!error]
  «сортируем по времени отправки с телефона»                             [!error]
  «непрочитанные посчитаем на клиенте, сервер про это не знает»          [!error]

  Как надо: временный номер от клиента, порядковый номер от сервера,
  указатель прочтения у участника — с первой версии.
`;

  protected readonly buildOrBuyChat = `

═══ ПЯТЬ ПУТЕЙ К ЧАТУ ═══

  1. ГРУППА В МЕССЕНДЖЕРЕ
     код           ноль
     данные        не ваши: уволился сотрудник — переписка ушла с ним
     риски 2026    работа зарубежных мессенджеров в РФ ограничивается;
                   строить на них процесс компании — рискованно
     подходит      маленькой команде просто договориться

  2. ГОТОВЫЙ ПРОДУКТ НА СВОЁМ СЕРВЕРЕ
     примеры       Mattermost, Rocket.Chat, серверы протокола Matrix
     даёт          каналы, файлы, поиск, мобильные приложения из коробки
     отнимает      свой сервер в эксплуатации; трудно встроить в свой продукт
     подходит      внутренний чат компании

  3. ОБЛАЧНЫЙ СЕРВИС ЧАТА
     даёт          чат через API и готовые компоненты интерфейса
     отнимает      оплата и юрлицо, серверы вне РФ, данные пользователей
                   из РФ — вопрос закона о персональных данных
     подходит      продукт не для российского рынка

  4. СЕРВЕР РЕАЛЬНОГО ВРЕМЕНИ + СВОЯ ЛОГИКА
     пример        Centrifugo — открытый сервер: держит соединения
                   (WebSocket, SSE и другие) и доставляет события
     ваше          беседы, права, история, непрочитанные — в вашей базе
     подходит      чат внутри продукта, тысячи соединений

  5. ВСЁ СВОЁ
     ваше          всё: соединения, доставка, хранение
     подходит      чат — ваш продукт; учёба; первая версия


═══ РЕШЕНИЕ «ЛЕТУЧКИ» ═══

  сейчас         один сервер Node.js держит WebSocket сам + PostgreSQL
                 → сотни соединений без усилий, минимум движущихся частей
  потом          соединения — в сервер реального времени, логика — в приложении
  условие        протокол с первого дня: события с номерами, догрузка по номеру,
                 права — на сервере приложения → смена транспорта не трогает
                 клиентов


═══ КАК НЕ НАДО ═══

  «Сделаем свой Telegram: каналы, боты, звонки, стикеры — в первой версии»  [!error]
  «Возьмём облачный чат-сервис, а где лежат данные — не важно»              [!error]
  «Рабочий процесс кофейни — в группе зарубежного мессенджера навсегда»     [!error]
`;

  protected readonly messageJourney = `

═══ ПУТЬ СООБЩЕНИЯ ЛЕНЫ ПО МИЛЛИСЕКУНДАМ (условно) ═══

  мс     где              что происходит
  ───────────────────────────────────────────────────────────────────────
     0   телефон Лены     clientMsgId = 'b7e1…', сообщение серое с часиками
    40   сервер A         получил по WebSocket; проверил членство в «#смены»
    45   сервер A         UPDATE conversations SET last_seq = last_seq + 1
                          RETURNING last_seq → 42
    55   PostgreSQL       INSERT INTO messages (… seq = 42, client_msg_id = 'b7e1…')
    60   сервер A → Лена  { type: 'ack', clientMsgId: 'b7e1…', seq: 42 }
                          у Лены: часики → одна галочка
    62   сервер A → шина  PUBLISH conv:7f3a { type: 'message', seq: 42, … }
    64   сервер B         получил из шины: у него соединения Димы (телефон, ноутбук)
    70   телефон Димы     показал № 42 — предыдущий был 41, пропусков нет
    75   телефон Димы →   { type: 'delivered', conversationId, upToSeq: 42 }
    90   Лена             вторая галочка
   100   воркер push      Вика без соединения, канал не заглушён → push в очередь
         …
  4 с    Дима открыл      { type: 'read', upToSeq: 42 } → у Лены синие галочки;
                          у Димы на ноутбуке счётчик «#смены» гаснет сам


═══ ТРИ ПРАВИЛА ПУТИ ═══

  1. База — источник правды. Реальное время только ускоряет показ.
  2. «Принято» отправителю — сразу после записи, не после раздачи всем.
  3. Каждое событие несёт номер — клиент видит пропуск и догружает.


═══ КАК НЕ НАДО ═══

  ws.send(всем); await db.insert(сообщение)    — раздали, а запись упала     [!error]
  ждать доставки всем 14 участникам, прежде чем ответить Лене «принято»     [!error]
  событие без номера: { text: '…' }           — пропуск не заметить         [!error]
`;

  protected readonly wsServer = `
// ═══ 1. HTTP И WEBSOCKET НА ОДНОМ ПОРТУ ═══
import http from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import { app } from './http-app';                         // обычный Express: история, файлы, вход
import { sessionFromCookie, userFromAccessToken } from './auth';
import { handleClientEvent } from './events';
import { subscribeUser, unsubscribeUser } from './bus';   // шина событий — раздел о масштабе

const server = http.createServer(app);
// noServer — сами решаем, пускать ли, ДО согласия на WebSocket; maxPayload — кадр больше 64 КБ закроет соединение
const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

const ALLOWED_ORIGINS = new Set(['https://app.letuchka.example']);

type Conn = WebSocket & { userId?: string; missed: number };

// ═══ 2. ОТКРЫТИЕ: ORIGIN И COOKIE — ДО ТОГО, КАК СОГЛАСИТЬСЯ ═══
server.on('upgrade', async (req, socket, head) => {
  const origin = req.headers.origin;
  // Браузер всегда присылает Origin. Чужой сайт — отказ: защита от перехвата WebSocket с чужого сайта.
  // Мобильное приложение Origin может не прислать — оно войдёт токеном первым сообщением
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    socket.write('HTTP/1.1 403 Forbidden\\r\\n\\r\\n');
    socket.destroy();
    return;
  }
  const session = origin ? await sessionFromCookie(req.headers.cookie) : null;
  wss.handleUpgrade(req, socket, head, (ws) => onConnection(ws as Conn, session?.userId ?? null));
});

// ═══ 3. РЕЕСТР: ПОЛЬЗОВАТЕЛЬ → ЕГО СОЕДИНЕНИЯ НА ЭТОМ СЕРВЕРЕ ═══
const connections = new Map<string, Set<Conn>>(); // у Лены их может быть три: телефон, ноутбук, вкладка

function register(conn: Conn, userId: string): void {
  conn.userId = userId;
  const set = connections.get(userId) ?? new Set<Conn>();
  if (set.size === 0) subscribeUser(userId); // первое соединение человека на этом сервере — подписка на user:<id>
  set.add(conn);
  connections.set(userId, set);
}

function unregister(conn: Conn): void {
  if (!conn.userId) return;
  const set = connections.get(conn.userId);
  set?.delete(conn);
  if (set && set.size === 0) {
    connections.delete(conn.userId);
    unsubscribeUser(conn.userId);
  }
}

const safeJson = (raw: unknown): Record<string, unknown> | null => {
  try {
    const value = JSON.parse(String(raw));
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
};

// ═══ 4. СОЕДИНЕНИЕ: ВХОД, СОБЫТИЯ, ЗАКРЫТИЕ ═══
function onConnection(conn: Conn, cookieUserId: string | null): void {
  conn.missed = 0;
  conn.on('pong', () => { conn.missed = 0; }); // ответ на сердцебиение

  if (cookieUserId) {
    register(conn, cookieUserId);
  } else {
    // Мобильное приложение: ждём { type: 'auth', token } не дольше 5 секунд — и больше ничего не принимаем
    const timer = setTimeout(() => conn.close(4001, 'auth timeout'), 5_000);
    conn.once('message', async (raw) => {
      clearTimeout(timer);
      const msg = safeJson(raw);
      const userId = msg?.['type'] === 'auth' ? await userFromAccessToken(String(msg['token'])) : null;
      if (!userId) {
        conn.close(4001, 'unauthorized'); // 4001 — «войдите заново»: переподключаться с тем же токеном бессмысленно
        return;
      }
      register(conn, userId);
      conn.send(JSON.stringify({ type: 'auth_ok' }));
    });
  }

  conn.on('message', async (raw) => {
    if (!conn.userId) return; // до входа событий не принимаем
    const event = safeJson(raw);
    if (!event || typeof event['type'] !== 'string') {
      conn.close(4400, 'bad message');
      return;
    }
    try {
      await handleClientEvent(conn, conn.userId, event); // send, read, typing… — разделы ниже
    } catch (err) {
      console.error('ws event failed', { userId: conn.userId, type: event['type'], err }); // без текста сообщения в логе
      conn.send(JSON.stringify({ type: 'error', ref: event['ref'] ?? null, code: 'internal' }));
    }
  });

  conn.on('close', () => unregister(conn));
}

// ═══ 5. СЕРДЦЕБИЕНИЕ: PING КАЖДЫЕ 25 СЕКУНД, ДВА ПРОПУСКА — СОЕДИНЕНИЕ МЁРТВО ═══
const HEARTBEAT_MS = 25_000;
setInterval(() => {
  for (const ws of wss.clients) {
    const conn = ws as Conn;
    if (conn.missed >= 2) {
      conn.terminate(); // не close: «вежливо» прощаться не с кем — на том конце никого нет
      continue;
    }
    conn.missed++;
    conn.ping();
  }
}, HEARTBEAT_MS);
// И ещё: таймаут тишины у прокси перед сервером должен быть больше 25 секунд
// (у nginx по умолчанию proxy_read_timeout — 60 секунд)

// ═══ 6. ДОСТАВИТЬ СОБЫТИЕ ЧЕЛОВЕКУ — ВО ВСЕ ЕГО СОЕДИНЕНИЯ НА ЭТОМ СЕРВЕРЕ ═══
export function deliverToUser(userId: string, event: object): void {
  const data = JSON.stringify(event);
  for (const conn of connections.get(userId) ?? []) {
    if (conn.readyState === conn.OPEN) conn.send(data);
  }
}

// ═══ 7. ВЫКЛАДКА: ЗАКРЫТЬ ВЕЖЛИВО ═══
process.on('SIGTERM', () => {
  // 1012 — «сервис перезапускается»: клиенты переподключатся к другому серверу,
  // с разбросом по времени, чтобы не прийти всей толпой в одну секунду
  for (const ws of wss.clients) ws.close(1012, 'restart');
  server.close();
});

server.listen(8080);

// ═══ КАК НЕ НАДО ═══
// new WebSocket('wss://api.letuchka.example/ws?token=' + accessToken)   // [!error] токен в адресе — в логах
// wss.on('connection', …) без проверки Origin                            // [!error] чужой сайт откроет с cookie
// «онлайн, пока есть объект соединения»                                 // [!error] без сердцебиения — мёртвые «онлайн»
`;

  protected readonly chatSchema = `
-- ═══ 1. БЕСЕДЫ ═══
CREATE TABLE conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations (id), -- компания-владелец: изоляция как в рецепте про SaaS
  kind            text NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
  title           text,                        -- у личной беседы названия нет: показываем имя собеседника
  direct_key      text,                        -- только у личной: 'uid_меньший:uid_больший'
  last_seq        bigint NOT NULL DEFAULT 0,   -- последний выданный номер сообщения в ЭТОЙ беседе
  version         bigint NOT NULL DEFAULT 0,   -- растёт при правках, удалениях, переименовании, смене участников
  last_message_at timestamptz,                 -- для сортировки списка бесед
  created_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  CHECK ((kind = 'direct') = (direct_key IS NOT NULL))
);
-- Одна личная беседа на пару в компании — даже если оба нажали «написать» одновременно
CREATE UNIQUE INDEX conversations_direct_key ON conversations (organization_id, direct_key) WHERE kind = 'direct';

-- ═══ 2. УЧАСТНИКИ — ВСЁ, ЧТО У РАЗНЫХ ЛЮДЕЙ В ОДНОЙ БЕСЕДЕ РАЗНОЕ ═══
CREATE TABLE conversation_members (
  conversation_id    uuid NOT NULL REFERENCES conversations (id),
  user_id            uuid NOT NULL REFERENCES users (id),
  organization_id    uuid NOT NULL,               -- дублируем ради политик строк
  role               text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  visible_from_seq   bigint NOT NULL DEFAULT 1,   -- в закрытой группе новичок видит историю «с этого момента»
  last_delivered_seq bigint NOT NULL DEFAULT 0,   -- до какого номера дошло до его устройств
  last_read_seq      bigint NOT NULL DEFAULT 0,   -- «прочитал до номера» — источник непрочитанных и синих галочек
  notify_level       text NOT NULL DEFAULT 'all' CHECK (notify_level IN ('all', 'mentions', 'none')),
  muted_until        timestamptz,                 -- «заглушить до 9 утра»
  joined_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX conversation_members_user_idx ON conversation_members (user_id); -- «мои беседы» — при каждом входе

-- ═══ 3. СООБЩЕНИЯ ═══
CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations (id),
  organization_id uuid NOT NULL,
  seq             bigint NOT NULL,                 -- номер в беседе: 1, 2, 3… — ставит сервер
  sender_id       uuid REFERENCES users (id),      -- NULL у системных: «Дима вступил в канал»
  client_msg_id   uuid,                            -- временный номер от клиента — защита от дублей
  kind            text NOT NULL CHECK (kind IN ('text', 'image', 'file', 'voice', 'system')),
  body            text,                            -- у удалённого — NULL
  reply_to_seq    bigint,                          -- «ответ на сообщение № …»
  created_at      timestamptz NOT NULL DEFAULT now(), -- время ставит сервер, не телефон
  edited_at       timestamptz,
  deleted_at      timestamptz,                     -- «сообщение удалено» — строка остаётся, номер не «едет»
  UNIQUE (conversation_id, seq),                   -- один номер — одно сообщение
  UNIQUE (sender_id, client_msg_id),               -- повтор отправки не создаст второе сообщение
  CHECK (length(body) <= 4000)
);

-- ═══ 4. ВЛОЖЕНИЯ ═══
CREATE TABLE attachments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id      uuid REFERENCES messages (id),   -- NULL, пока файл загружен, а сообщение ещё не отправлено
  organization_id uuid NOT NULL,
  uploader_id     uuid NOT NULL REFERENCES users (id),
  storage_key     text NOT NULL UNIQUE,            -- ключ в объектном хранилище; сам файл — не в базе
  content_type    text NOT NULL,                   -- 'image/jpeg', 'audio/ogg'…
  size_bytes      bigint NOT NULL CHECK (size_bytes BETWEEN 1 AND 52428800), -- до 50 МБ
  width           integer, height integer,         -- у фото — для места под картинку до загрузки
  duration_ms     integer,                         -- у голосовых
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ═══ 5. ЗАПРОСЫ ═══
-- Список бесед Лены с числом непрочитанных — одним запросом
SELECT c.id, c.kind,
       coalesce(c.title, other.name)            AS title,   -- у личной — имя собеседника
       c.last_message_at,
       greatest(c.last_seq - m.last_read_seq, 0) AS unread  -- непрочитанные = последний номер − указатель
FROM conversation_members m
JOIN conversations c ON c.id = m.conversation_id
LEFT JOIN LATERAL (
  SELECT u.name FROM conversation_members om JOIN users u ON u.id = om.user_id
   WHERE om.conversation_id = c.id AND om.user_id <> $1 LIMIT 1
) other ON c.kind = 'direct'
WHERE m.user_id = $1 AND c.archived_at IS NULL
ORDER BY c.last_message_at DESC NULLS LAST
LIMIT 50;
-- '#смены'        channel  21:14  0
-- 'Дима'          direct   21:10  2
-- 'Пенка, кухня'  group    18:02  0
-- Свои сообщения непрочитанными не считаются: отправляя № 43, сервер сдвигает указатель автора до 43

-- Найти или создать личную беседу Лены и Димы — ровно одну
INSERT INTO conversations (organization_id, kind, direct_key)
VALUES ($1, 'direct', $2)                         -- $2 = 'меньший_uuid:больший_uuid'
ON CONFLICT (organization_id, direct_key) WHERE kind = 'direct' DO NOTHING
RETURNING id;
-- пусто → беседа уже есть: SELECT id FROM conversations WHERE organization_id = $1 AND direct_key = $2

-- ═══ КАК НЕ НАДО ═══
-- CREATE TABLE message_reads (user_id, message_id, read boolean)  -- [!error] строка на каждого на каждое сообщение
-- ORDER BY created_at                                            -- [!error] порядок — по номеру в беседе
-- DELETE FROM messages WHERE id = $1                              -- [!error] номера «поедут», клиенты запутаются
`;

  protected readonly sendMessage = `
// ═══ 1. СЕРВЕР: ПРИНЯТЬ СООБЩЕНИЕ РОВНО ОДИН РАЗ ═══
import { withTenant, type Tenant } from './tenant';
import { publishToUsers } from './bus';
import { enqueue } from './db';
import { allow } from './rate-limit';

type SendEvent = { type: 'send'; conversationId: string; clientMsgId: string; body: string; replyToSeq?: number };
type Reply =
  | { type: 'ack'; clientMsgId: string; seq: number; createdAt: string }
  | { type: 'nack'; clientMsgId: string; code: 'empty' | 'too_long' | 'not_member' | 'rate_limited' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Stored = { ok: true; seq: number; createdAt: string; duplicate: boolean; memberIds: string[] } | { ok: false };

export async function handleSend(tenant: Tenant, ev: SendEvent): Promise<Reply> {
  const body = typeof ev.body === 'string' ? ev.body.trim() : '';
  if (!UUID.test(String(ev.clientMsgId))) throw new Error('bad clientMsgId');
  if (!body) return { type: 'nack', clientMsgId: ev.clientMsgId, code: 'empty' };
  if (body.length > 4000) return { type: 'nack', clientMsgId: ev.clientMsgId, code: 'too_long' };
  // Не больше 20 сообщений за 10 секунд: защита от зависшего клиента и от спама
  if (!(await allow('send:' + tenant.userId, 20, 10))) return { type: 'nack', clientMsgId: ev.clientMsgId, code: 'rate_limited' };

  const stored = await withTenant(tenant, async (client): Promise<Stored> => {
    // Запираем строку беседы: сообщения одной беседы получают номера строго по очереди,
    // а два одновременных повтора одного сообщения выстроятся друг за другом
    const conv = await client.query('SELECT id FROM conversations WHERE id = $1 FOR UPDATE', [ev.conversationId]);
    if (!conv.rowCount) return { ok: false };
    // Участник ли он ПРЯМО СЕЙЧАС — его могли удалить минуту назад
    const member = await client.query(
      'SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [ev.conversationId, tenant.userId],
    );
    if (!member.rowCount) return { ok: false };

    // Повтор? Такое сообщение уже есть — отвечаем ТЕМ ЖЕ номером, ничего не записывая
    const again = await client.query<{ seq: string; created_at: Date }>(
      'SELECT seq, created_at FROM messages WHERE sender_id = $1 AND client_msg_id = $2',
      [tenant.userId, ev.clientMsgId],
    );
    if (again.rows[0]) {
      return { ok: true, seq: Number(again.rows[0].seq), createdAt: again.rows[0].created_at.toISOString(), duplicate: true, memberIds: [] };
    }

    // Номер — следующий в ЭТОЙ беседе
    const next = await client.query<{ last_seq: string }>(
      'UPDATE conversations SET last_seq = last_seq + 1, last_message_at = now() WHERE id = $1 RETURNING last_seq',
      [ev.conversationId],
    );
    const seq = Number(next.rows[0].last_seq); // bigint из pg приходит строкой
    const inserted = await client.query<{ created_at: Date }>(
      \`INSERT INTO messages (conversation_id, organization_id, seq, sender_id, client_msg_id, kind, body, reply_to_seq)
       VALUES ($1, $2, $3, $4, $5, 'text', $6, $7)
       RETURNING created_at\`, // уникальная пара (sender_id, client_msg_id) — последний рубеж против дублей
      [ev.conversationId, tenant.organizationId, seq, tenant.userId, ev.clientMsgId, body, ev.replyToSeq ?? null],
    );
    // Автор прочитал всё до своего сообщения: его счётчик непрочитанных не растёт
    await client.query(
      'UPDATE conversation_members SET last_read_seq = greatest(last_read_seq, $3) WHERE conversation_id = $1 AND user_id = $2',
      [ev.conversationId, tenant.userId, seq],
    );
    const members = await client.query<{ user_id: string }>(
      'SELECT user_id FROM conversation_members WHERE conversation_id = $1',
      [ev.conversationId],
    );
    // Push тем, кто не в сети, — задачей той же транзакцией; кому именно — решит воркер
    await enqueue(client, 'push.new_message', { conversationId: ev.conversationId, seq });
    return { ok: true, seq, createdAt: inserted.rows[0].created_at.toISOString(), duplicate: false, memberIds: members.rows.map((m) => m.user_id) };
  });

  if (!stored.ok) return { type: 'nack', clientMsgId: ev.clientMsgId, code: 'not_member' };
  if (!stored.duplicate) {
    // Раздаём ПОСЛЕ COMMIT: откатилась транзакция — никто не увидит несуществующего сообщения.
    // Упали между COMMIT и рассылкой — получатели догрузят № seq по разрыву в номерах или при переподключении
    await publishToUsers(stored.memberIds, {
      type: 'message',
      conversationId: ev.conversationId,
      seq: stored.seq,
      senderId: tenant.userId,
      clientMsgId: ev.clientMsgId, // другие устройства автора узнают своё сообщение и не покажут его дважды
      body,
      createdAt: stored.createdAt,
    });
  }
  return { type: 'ack', clientMsgId: ev.clientMsgId, seq: stored.seq, createdAt: stored.createdAt };
}

// ═══ 2. КЛИЕНТ: ОЧЕРЕДЬ НЕОТПРАВЛЕННОГО НА УСТРОЙСТВЕ ═══
// LocalStore — локальная база устройства: IndexedDB в браузере, SQLite в мобильном приложении
type Outgoing = { clientMsgId: string; conversationId: string; body: string; attempts: number; state: 'sending' | 'failed' };
declare const store: {
  put(id: string, item: Outgoing): Promise<void>;
  get(id: string): Promise<Outgoing | undefined>;
  remove(id: string): Promise<void>;
  all(): Promise<Outgoing[]>;
};
declare const socket: { send(event: object): void };
declare const ui: {
  showPending(item: Outgoing): void;              // серое с часиками
  confirm(clientMsgId: string, seq: number): void; // часики → галочка, встаёт на место по номеру
  markFailed(clientMsgId: string, reason: string): void;
};

const RETRY_AFTER_MS = 10_000;
const MAX_ATTEMPTS = 5;

export async function sendText(conversationId: string, body: string): Promise<void> {
  // Номер создаётся ОДИН раз — здесь — и уходит в каждой попытке без изменений.
  // В браузере — crypto.randomUUID(); в React Native — аналог из expo-crypto
  const item: Outgoing = { clientMsgId: crypto.randomUUID(), conversationId, body, attempts: 0, state: 'sending' };
  await store.put(item.clientMsgId, item); // сначала — на диск: переживёт закрытие приложения
  ui.showPending(item);
  attempt(item);
}

function attempt(item: Outgoing): void {
  item.attempts++;
  socket.send({ type: 'send', conversationId: item.conversationId, clientMsgId: item.clientMsgId, body: item.body });
  setTimeout(() => void onTimeout(item.clientMsgId), RETRY_AFTER_MS);
}

async function onTimeout(clientMsgId: string): Promise<void> {
  const item = await store.get(clientMsgId);
  if (!item || item.state === 'failed') return; // уже подтверждено (удалено из очереди) или отмечено неудачей
  if (item.attempts >= MAX_ATTEMPTS) {
    item.state = 'failed';
    await store.put(item.clientMsgId, item);
    ui.markFailed(item.clientMsgId, 'no_response'); // «не отправлено» — «повторить» или «удалить»
    return;
  }
  attempt(item); // тот же clientMsgId: сервер не создаст дубль
}

export async function onServerReply(reply: Reply): Promise<void> {
  if (reply.type === 'ack') {
    await store.remove(reply.clientMsgId);
    ui.confirm(reply.clientMsgId, reply.seq);
  } else {
    const item = await store.get(reply.clientMsgId);
    if (item) await store.put(item.clientMsgId, { ...item, state: 'failed' });
    ui.markFailed(reply.clientMsgId, reply.code); // повторять бессмысленно: сервер отказал по существу
  }
}

// После переподключения — всё, что ещё «отправляется», уходит снова, с теми же номерами
export async function resendOutbox(): Promise<void> {
  for (const item of await store.all()) if (item.state === 'sending') attempt(item);
}

// ═══ КАК НЕ НАДО ═══
// socket.send({ …, clientMsgId: crypto.randomUUID() }) — новый номер в каждой попытке  // [!error] дубль
// INSERT INTO messages … без проверки, что автор — участник беседы                     // [!error]
// created_at: ev.sentAt — время с часов телефона                                       // [!error]
// publishToUsers(…) до COMMIT                                                          // [!error] покажем то, чего нет
`;

  protected readonly ordering = `
// ═══ 1. СОСТОЯНИЕ БЕСЕДЫ НА УСТРОЙСТВЕ ═══
type ChatMessage = {
  seq: number;
  senderId: string | null;
  clientMsgId: string | null;
  body: string | null;       // null — сообщение удалено
  createdAt: string;         // время с часов СЕРВЕРА — только для показа
};

type ConversationState = {
  lastSeq: number;                    // последний показанный номер: до него пропусков нет
  messages: Map<number, ChatMessage>; // номер → сообщение
  buffer: Map<number, ChatMessage>;   // пришли с опережением и ждут, пока догрузим пропуск
  fetching: boolean;
};

declare function fetchRange(conversationId: string, fromSeq: number, toSeq: number): Promise<ChatMessage[]>;
declare function render(conversationId: string): void;
declare const pending: Map<string, { clientMsgId: string; body: string }>; // свои неподтверждённые — с часиками

// ═══ 2. ПРИМЕНИТЬ ВХОДЯЩЕЕ — ЕДИНСТВЕННОЕ МЕСТО, ГДЕ МЕНЯЕТСЯ ЛЕНТА ═══
export async function applyIncoming(conversationId: string, state: ConversationState, msg: ChatMessage): Promise<void> {
  if (msg.seq <= state.lastSeq) return; // повтор — уже показано, молча пропускаем

  if (msg.seq > state.lastSeq + 1) {
    // Пропуск: было 43, пришло 45. Не показываем 45, пока не догрузим 44
    state.buffer.set(msg.seq, msg);
    if (!state.fetching) await fillGap(conversationId, state, msg.seq - 1);
    return;
  }
  accept(state, msg);  // ровно следующий номер — показываем
  drainBuffer(state);  // и всё, что дожидалось его в буфере
  render(conversationId);
}

function accept(state: ConversationState, msg: ChatMessage): void {
  state.messages.set(msg.seq, msg);
  state.lastSeq = msg.seq;
  // Своё сообщение вернулось эхом или пришло с другого устройства: убираем копию с часиками
  if (msg.clientMsgId) pending.delete(msg.clientMsgId);
}

function drainBuffer(state: ConversationState): void {
  for (let next = state.lastSeq + 1; state.buffer.has(next); next++) {
    const msg = state.buffer.get(next);
    state.buffer.delete(next);
    if (msg) accept(state, msg);
  }
}

async function fillGap(conversationId: string, state: ConversationState, toSeq: number): Promise<void> {
  state.fetching = true;
  try {
    // Обычный HTTP: «дай сообщения с 44 по 44» — сервер проверит права и visible_from_seq
    const missing = await fetchRange(conversationId, state.lastSeq + 1, toSeq);
    for (const msg of missing.sort((a, b) => a.seq - b.seq)) {
      if (msg.seq === state.lastSeq + 1) accept(state, msg);
    }
    // Сервер отдал не всё (сообщение нам видеть не положено) — считаем пропуск пройденным
    if (state.lastSeq < toSeq) state.lastSeq = toSeq;
    drainBuffer(state);
    render(conversationId);
  } finally {
    state.fetching = false;
  }
}

// ═══ 3. ЧТО ПОКАЗАТЬ: ПОДТВЕРЖДЁННЫЕ ПО НОМЕРУ, НЕПОДТВЕРЖДЁННЫЕ — ВНИЗУ ═══
export function visibleList(state: ConversationState) {
  const confirmed = [...state.messages.values()].sort((a, b) => a.seq - b.seq); // по номеру, НЕ по времени
  const sending = [...pending.values()].map((p) => ({ ...p, status: 'sending' as const }));
  return { confirmed, sending }; // sending рисуются после confirmed, с часиками
}

// ═══ 4. СЕРВЕР: «ДАЙ С 44 ПО 44» ═══
// GET /api/conversations/:id/messages?from=44&to=44
//   SELECT seq, sender_id, client_msg_id,
//          CASE WHEN deleted_at IS NULL THEN body END AS body, created_at
//     FROM messages
//    WHERE conversation_id = $1 AND seq BETWEEN greatest($2, $4) AND $3   -- $4 — visible_from_seq участника
//    ORDER BY seq;

// ═══ КАК НЕ НАДО ═══
// list.sort((a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt));  // [!error] часы телефонов врут
// показать 45, не дождавшись 44                                      // [!error] дыра в ленте навсегда
// seq = id из общего bigserial всей таблицы                          // [!error] пропуски ничего не значат
`;

  protected readonly resync = `
// ═══ 1. СЕРВЕР: ВЕРСИЯ БЕСЕДЫ И ЖУРНАЛ ЕЁ ИЗМЕНЕНИЙ ═══
// Всё, кроме нового сообщения, меняет версию беседы — под той же блокировкой строки, что и номера:
//   UPDATE conversations SET version = version + 1 WHERE id = $1 RETURNING version;     → 8
//   INSERT INTO conversation_changes (conversation_id, version, kind, payload)
//   VALUES ($1, 8, 'message_edited', '{"seq": 40}');
//
// CREATE TABLE conversation_changes (
//   conversation_id uuid NOT NULL REFERENCES conversations (id),
//   version         bigint NOT NULL,
//   kind            text NOT NULL,   -- 'message_edited', 'message_deleted', 'renamed', 'member_added', 'member_removed'
//   payload         jsonb NOT NULL,
//   created_at      timestamptz NOT NULL DEFAULT now(),
//   PRIMARY KEY (conversation_id, version)
// );
import express from 'express';
import { db } from './db';
import { requireUser } from './auth';

export const app = express();

// ═══ 2. СЕРВЕР: СВОДКА ПО ВСЕМ БЕСЕДАМ ЧЕЛОВЕКА ═══
app.get('/api/sync/summary', requireUser, async (_req, res) => {
  const { rows } = await db.query<{ id: string; last_seq: string; version: string; last_read_seq: string }>(
    \`SELECT c.id, c.last_seq, c.version, m.last_read_seq
       FROM conversation_members m
       JOIN conversations c ON c.id = m.conversation_id
      WHERE m.user_id = $1 AND c.archived_at IS NULL\`,
    [res.locals['userId']],
  );
  // Десятки строк по три числа — короткий ответ, даже если человек в пятидесяти беседах
  res.json({
    conversations: rows.map((r) => ({
      id: r.id,
      lastSeq: Number(r.last_seq),
      version: Number(r.version),
      lastReadSeq: Number(r.last_read_seq),
    })),
  });
});
// GET /api/conversations/:id/changes?after=7 — изменения после версии 7:
//   SELECT version, kind, payload FROM conversation_changes
//    WHERE conversation_id = $1 AND version > $2 ORDER BY version LIMIT 500;

// ═══ 3. КЛИЕНТ: ПЕРЕПОДКЛЮЧЕНИЕ С НАРАСТАЮЩЕЙ ПАУЗОЙ И РАЗБРОСОМ ═══
type ServerEvent = { type: string; [key: string]: unknown };
declare const tokens: { access: string };
declare function refreshTokenThenReconnect(): Promise<void>;
declare function applyEvent(event: ServerEvent): Promise<void>; // ведёт в applyIncoming из раздела о порядке
declare function resendOutbox(): Promise<void>;                 // из раздела об отправке

let attemptNo = 0;

function nextDelayMs(): number {
  const base = Math.min(30_000, 1_000 * 2 ** attemptNo); // 1, 2, 4, 8, 16, 30, 30… секунд
  attemptNo++;
  return base / 2 + Math.random() * (base / 2);          // случайная половина паузы: толпа размазывается
}

export function connect(): void {
  const ws = new WebSocket('wss://api.letuchka.example/ws');
  let syncing = true;
  const buffer: ServerEvent[] = [];

  ws.onopen = () => ws.send(JSON.stringify({ type: 'auth', token: tokens.access }));

  ws.onmessage = async (message) => {
    const event = JSON.parse(String(message.data)) as ServerEvent;
    if (event.type === 'auth_ok') {
      attemptNo = 0;                                 // подключились — паузы снова с начала
      await resync();                                // догоняем пропущенное
      syncing = false;
      for (const ev of buffer.splice(0)) await applyEvent(ev); // то, что пришло во время догрузки
      await resendOutbox();                          // и неотправленное — с теми же clientMsgId
      return;
    }
    if (syncing) {
      buffer.push(event); // пока догружаем — копим, иначе 48 появится раньше 43–47
      return;
    }
    await applyEvent(event);
  };

  ws.onclose = (closeEvent) => {
    if (closeEvent.code === 4001) {
      void refreshTokenThenReconnect(); // «войдите заново»: со старым токеном пробовать бессмысленно
      return;
    }
    if (!navigator.onLine) {
      // Сети нет вовсе — ждём, когда появится, а не тратим батарею (в React Native — модуль NetInfo)
      window.addEventListener('online', () => connect(), { once: true });
      return;
    }
    setTimeout(connect, nextDelayMs());
  };
}

// ═══ 4. КЛИЕНТ: ДОГНАТЬ ПО СВОДКЕ ═══
type Summary = { id: string; lastSeq: number; version: number; lastReadSeq: number };
type Local = { id: string; lastSeq: number; version: number };
declare const api: { get<T>(url: string): Promise<T> };
declare const localDb: {
  allConversations(): Local[];
  conversation(id: string): Local | undefined;
  removeConversation(id: string): void;
  putMessages(id: string, messages: unknown[], opts: { earlierAvailable: boolean }): void;
  applyChanges(id: string, changes: unknown[]): void;
  setCounters(id: string, counters: { lastSeq: number; version: number; lastReadSeq: number }): void;
};

const PAGE = 50;

async function resync(): Promise<void> {
  const { conversations } = await api.get<{ conversations: Summary[] }>('/api/sync/summary');

  // Бесед, которых нет в сводке, у нас быть не должно — нас из них удалили
  const onServer = new Set(conversations.map((c) => c.id));
  for (const local of localDb.allConversations()) {
    if (!onServer.has(local.id)) localDb.removeConversation(local.id);
  }

  for (const s of conversations) {
    const local = localDb.conversation(s.id); // undefined — нас добавили в новую беседу
    const localSeq = local?.lastSeq ?? 0;

    if (s.lastSeq > localSeq) {
      // Пропущено много — берём последние 50, а более ранние догрузятся при прокрутке вверх
      const from = s.lastSeq - localSeq > PAGE ? s.lastSeq - PAGE + 1 : localSeq + 1;
      const messages = await api.get<unknown[]>(\`/api/conversations/\${s.id}/messages?from=\${from}&to=\${s.lastSeq}\`);
      localDb.putMessages(s.id, messages, { earlierAvailable: from > localSeq + 1 }); // «есть более ранние»
    }
    if (local && s.version > local.version) {
      const changes = await api.get<unknown[]>(\`/api/conversations/\${s.id}/changes?after=\${local.version}\`);
      localDb.applyChanges(s.id, changes); // правки, удаления, название, участники
    }
    // Свои числа — ТОЛЬКО после применения: оборвалось посреди — следующая сводка покажет ту же разницу.
    // lastReadSeq с сервера заодно сбросит счётчик, если всё прочитано на ноутбуке
    localDb.setCounters(s.id, { lastSeq: s.lastSeq, version: s.version, lastReadSeq: s.lastReadSeq });
  }
}

// ═══ КАК НЕ НАДО ═══
// ws.onclose = () => connect();                        // [!error] перезапуск сервера → толпа у входа
// после auth_ok сразу применять события, без догрузки   // [!error] 48 раньше 43–47, дыры в ленте
// localDb.setCounters(…) ДО загрузки сообщений          // [!error] оборвалось — пропущенное потеряно
`;

  protected readonly history = `
// ═══ 1. ТРИ ВИДА ЗАПРОСА ИСТОРИИ ═══
//   ?before=9951   50 сообщений с номером меньше 9951 — листаем вверх
//   ?after=120     50 сообщений с номером больше 120 — листаем вниз, к концу
//   ?around=4381   25 до и 25 после — ответ, результат поиска, первое непрочитанное
//   без параметров последние 50
import { withTenant, type Tenant } from './tenant';

const PAGE = 50;
type Query = { before?: number; after?: number; around?: number };

const SELECT = \`SELECT seq, sender_id, kind,
       CASE WHEN deleted_at IS NULL THEN body END AS body,   -- у удалённого — только заглушка
       created_at, edited_at, deleted_at, reply_to_seq
  FROM messages
 WHERE conversation_id = $1 AND seq >= $2\`;               // $2 — visible_from_seq участника

export async function loadHistory(tenant: Tenant, conversationId: string, q: Query) {
  return withTenant(tenant, async (client) => {
    // Права: участник ли он, и с какого номера ему видна история
    const member = await client.query<{ visible_from_seq: string }>(
      'SELECT visible_from_seq FROM conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, tenant.userId],
    );
    if (!member.rows[0]) return null; // не участник — 404, как с чужими данными в рецепте про SaaS
    const from = Number(member.rows[0].visible_from_seq);

    if (q.around !== undefined) {
      const older = await client.query(SELECT + ' AND seq < $3 ORDER BY seq DESC LIMIT 25', [conversationId, from, q.around]);
      const newer = await client.query(SELECT + ' AND seq >= $3 ORDER BY seq ASC LIMIT 25', [conversationId, from, q.around]);
      return [...older.rows.reverse(), ...newer.rows];
    }
    if (q.after !== undefined) {
      const { rows } = await client.query(SELECT + ' AND seq > $3 ORDER BY seq ASC LIMIT ' + PAGE, [conversationId, from, q.after]);
      return rows;
    }
    // before или «последние»: идём от больших номеров к меньшим по индексу (conversation_id, seq)
    const before = q.before ?? Number.MAX_SAFE_INTEGER;
    const { rows } = await client.query(SELECT + ' AND seq < $3 ORDER BY seq DESC LIMIT ' + PAGE, [conversationId, from, before]);
    return rows.reverse(); // в ленту — по возрастанию номера
  });
}

// ═══ 2. ПЛАН ЗАПРОСА: ПО ИНДЕКСУ, БЕЗ ПЕРЕБОРА ═══
// EXPLAIN SELECT … WHERE conversation_id = $1 AND seq < 9951 ORDER BY seq DESC LIMIT 50;
//   Limit
//     -> Index Scan Backward using messages_conversation_id_seq_key on messages
// База сразу встаёт на номер 9951 и читает 50 строк назад — одинаково быстро на любой глубине.
// Индекс уже есть: его создало ограничение UNIQUE (conversation_id, seq)

// ═══ 3. КЛИЕНТ: ДОГРУЗКА СВЕРХУ, НЕ СДВИГАЯ ТО, НА ЧТО СМОТРЯТ ═══
declare const api: { get<T>(url: string): Promise<T> };
declare function prependMessages(list: HTMLElement, messages: unknown[]): void;

export async function loadOlder(list: HTMLElement, conversationId: string, oldestSeq: number): Promise<number> {
  const older = await api.get<{ seq: number }[]>(\`/api/conversations/\${conversationId}/messages?before=\${oldestSeq}\`);
  const heightBefore = list.scrollHeight;
  prependMessages(list, older);                       // вставили до 50 сообщений над текущими
  list.scrollTop += list.scrollHeight - heightBefore; // сдвинули прокрутку ровно на их высоту — экран не «прыгнул»
  return older.length ? older[0].seq : oldestSeq;     // новый самый старый номер
}
// Вызывается, когда до верха осталось меньше экрана: IntersectionObserver
// следит за невидимым «датчиком» над первым сообщением

// ═══ 4. ОТКРЫТЬ НА ПЕРВОМ НЕПРОЧИТАННОМ ═══
// у Лены в «#смены»: last_read_seq = 4380, last_seq = 4400
//   → GET …/messages?around=4381 и разделитель «Новые сообщения» перед № 4381
//   → дальше вниз — ?after=…, вверх — ?before=…, пока не встретимся с реальным временем

// ═══ КАК НЕ НАДО ═══
// SELECT … ORDER BY seq DESC OFFSET $2 LIMIT 50   // [!error] новые сдвигают страницы, глубоко — медленно
// WHERE created_at < $2                          // [!error] одинаковое время — сообщения теряются на стыке
// история без проверки visible_from_seq          // [!error] новичок прочитает закрытое прошлое группы
`;

  protected readonly readReceipts = `
// ═══ 1. СЕРВЕР: «ПРОЧИТАЛ ДО НОМЕРА» — УКАЗАТЕЛЬ ТОЛЬКО РАСТЁТ ═══
import { withTenant, type Tenant } from './tenant';
import { publishToUsers } from './bus';

type ReadEvent = { type: 'read'; conversationId: string; upToSeq: number };

export async function handleRead(tenant: Tenant, ev: ReadEvent): Promise<void> {
  const result = await withTenant(tenant, async (client) => {
    // greatest(старое, новое): опоздавшее «прочитал до 40» после «до 47» указатель не вернёт.
    // least(…, c.last_seq): нельзя «прочитать» сообщение, которого ещё нет
    const { rows } = await client.query<{ last_read_seq: string }>(
      \`UPDATE conversation_members m
          SET last_read_seq = greatest(m.last_read_seq, least($3, c.last_seq))
         FROM conversations c
        WHERE c.id = m.conversation_id AND m.conversation_id = $1 AND m.user_id = $2
       RETURNING m.last_read_seq\`,
      [ev.conversationId, tenant.userId, ev.upToSeq],
    );
    if (!rows[0]) return null; // не участник
    const members = await client.query<{ user_id: string }>(
      'SELECT user_id FROM conversation_members WHERE conversation_id = $1',
      [ev.conversationId],
    );
    const size = members.rows.length;
    return { lastReadSeq: Number(rows[0].last_read_seq), memberIds: members.rows.map((m) => m.user_id), size };
  });
  if (!result) return;
  // Всем участникам — ради синих галочек; в больших каналах — только себе (свои устройства гасят счётчик)
  const recipients = result.size <= 50 ? result.memberIds : [tenant.userId];
  await publishToUsers(recipients, {
    type: 'read',
    conversationId: ev.conversationId,
    userId: tenant.userId,
    upToSeq: result.lastReadSeq,
  });
}

// ═══ 2. «ПРОЧИТАЛИ 9 ИЗ 13» — ИЗ УКАЗАТЕЛЕЙ, БЕЗ ТАБЛИЦЫ «КТО ЧТО ПРОЧИТАЛ» ═══
// Для страницы сообщений — одним запросом: для каждого сообщения автора считаем,
// у скольких ДРУГИХ участников указатель не меньше его номера
//   SELECT msg.seq,
//          count(m.user_id) FILTER (WHERE m.last_read_seq >= msg.seq AND m.user_id <> msg.sender_id) AS read_by,
//          count(m.user_id) FILTER (WHERE m.user_id <> msg.sender_id)                              AS total
//     FROM messages msg
//     JOIN conversation_members m ON m.conversation_id = msg.conversation_id
//    WHERE msg.conversation_id = $1 AND msg.sender_id = $2 AND msg.seq BETWEEN $3 AND $4
//    GROUP BY msg.seq;
//   → № 44: read_by 9, total 13 → «прочитали 9 из 13»

// ═══ 3. УПОМИНАНИЯ — ОТДЕЛЬНАЯ ПОМЕТКА «@» ═══
// CREATE TABLE message_mentions (
//   conversation_id uuid NOT NULL, seq bigint NOT NULL, user_id uuid NOT NULL,
//   PRIMARY KEY (user_id, conversation_id, seq)
// );
// При отправке сервер находит в тексте @имена участников и пишет строки — той же транзакцией.
// Непрочитанные упоминания Димы:
//   SELECT mm.conversation_id, count(*) AS unread_mentions
//     FROM message_mentions mm
//     JOIN conversation_members m ON m.conversation_id = mm.conversation_id AND m.user_id = mm.user_id
//    WHERE mm.user_id = $1 AND mm.seq > m.last_read_seq
//    GROUP BY mm.conversation_id;

// ═══ 4. ОБЩИЙ СЧЁТЧИК НА ЗНАЧКЕ ПРИЛОЖЕНИЯ ═══
//   SELECT coalesce(sum(greatest(c.last_seq - m.last_read_seq, 0)), 0) AS badge
//     FROM conversation_members m JOIN conversations c ON c.id = m.conversation_id
//    WHERE m.user_id = $1
//      AND m.notify_level <> 'none'
//      AND (m.muted_until IS NULL OR m.muted_until < now());   -- заглушённые в значок не входят

// ═══ 5. КЛИЕНТ: «ПРОЧИТАНО» — КОГДА БЫЛО НА ЭКРАНЕ АКТИВНОГО ПРИЛОЖЕНИЯ ═══
declare const socket: { send(event: object): void };

let pendingRead: { conversationId: string; upToSeq: number } | null = null;
let readTimer: ReturnType<typeof setTimeout> | null = null;

// IntersectionObserver вызывает это, когда сообщение показалось в видимой области
export function onMessageVisible(conversationId: string, seq: number): void {
  if (document.visibilityState !== 'visible' || !document.hasFocus()) return; // вкладка в фоне — не прочитано
  if (!pendingRead || pendingRead.conversationId !== conversationId || seq > pendingRead.upToSeq) {
    pendingRead = { conversationId, upToSeq: seq };
  }
  // Не чаще раза в секунду: пролистал 20 сообщений — уйдёт одно событие с последним номером
  readTimer ??= setTimeout(() => {
    if (pendingRead) socket.send({ type: 'read', ...pendingRead });
    pendingRead = null;
    readTimer = null;
  }, 1_000);
}

// ═══ КАК НЕ НАДО ═══
// UPDATE conversation_members SET last_read_seq = $3 …   // [!error] опоздавшее событие вернёт указатель назад
// onMessageReceived → socket.send({ type: 'read' })     // [!error] пришло ≠ прочитано
// INSERT INTO message_reads (message_id, user_id) — на каждого и каждое  // [!error] лавина строк
`;

  protected readonly ephemeral = `
// ═══ 1. «ПЕЧАТАЕТ…» — ПЕРЕСЛАТЬ И ЗАБЫТЬ ═══
import { redis } from './redis';
import { publishToUsers } from './bus';
import { onlineMembersOf, isMember } from './membership';

type TypingEvent = { type: 'typing'; conversationId: string };

export async function handleTyping(userId: string, ev: TypingEvent): Promise<void> {
  if (!(await isMember(ev.conversationId, userId))) return;
  // Ничего не пишем в базу и не нумеруем: через 5 секунд это уже неправда
  const recipients = (await onlineMembersOf(ev.conversationId)).filter((id) => id !== userId);
  await publishToUsers(recipients, { type: 'typing', conversationId: ev.conversationId, userId });
}

// Клиент: не чаще раза в 3 секунды, пока человек набирает текст
declare const socket: { send(event: object): void };
let lastTypingSentAt = 0;
export function onInput(conversationId: string): void {
  const now = Date.now();
  if (now - lastTypingSentAt < 3_000) return;
  lastTypingSentAt = now;
  socket.send({ type: 'typing', conversationId });
}
// Получатель показывает «Дима печатает…» и прячет через 5 секунд без нового события
// или сразу, когда от Димы пришло сообщение

// ═══ 2. «В СЕТИ» — ЗАПИСЬ, КОТОРАЯ ИСЧЕЗАЕТ САМА ═══
const PRESENCE_TTL_SECONDS = 60; // больше двух интервалов сердцебиения (по 25 секунд)

// Вызывается при каждом pong от устройства пользователя
export async function touchPresence(userId: string, connectionId: string): Promise<void> {
  // Ключ на каждое соединение: телефон и ноутбук Лены продлевают свои записи независимо
  await redis.set('presence:' + userId + ':' + connectionId, '1', { EX: PRESENCE_TTL_SECONDS });
}

export async function isOnline(userId: string): Promise<boolean> {
  // Есть хоть одна непросроченная запись — в сети. Сервер упал, никому не сообщив, —
  // записи просто перестали продлеваться и через минуту исчезли сами
  const keys = await redis.scanAll('presence:' + userId + ':*');
  return keys.length > 0;
}

// «Был в сети 20 минут назад» — в базу РЕДКО: когда закрывается последнее соединение человека
//   UPDATE users SET last_seen_at = now() WHERE id = $1;

// ═══ 3. СТАТУС — ТОЛЬКО ТЕМ, КТО СМОТРИТ ═══
// Лена открыла личную переписку с Димой → { type: 'presence_subscribe', userIds: [дима] }
// Сервер запоминает «соединение Лены смотрит на Диму» и шлёт ей изменения его статуса;
// закрыла переписку → presence_unsubscribe. Рассылать изменения статуса каждого человека
// всем, кто с ним когда-либо переписывался, — лавина событий
const watchers = new Map<string, Set<string>>(); // за кем следят → соединения, которые следят

export function subscribePresence(connectionId: string, userIds: string[]): void {
  for (const id of userIds.slice(0, 50)) { // ограничение: подписка не на всю компанию сразу
    const set = watchers.get(id) ?? new Set<string>();
    set.add(connectionId);
    watchers.set(id, set);
  }
}

// ═══ КАК НЕ НАДО ═══
// INSERT INTO messages (kind) VALUES ('typing')                // [!error] мимолётное в вечное хранилище
// UPDATE users SET last_seen_at = now() — на каждое сердцебиение // [!error] 80 обновлений в секунду ради пустяка
// const online = new Set<string>() — в памяти одного сервера    // [!error] соседний сервер не узнает
// push «Дима печатает…»                                         // [!error] к моменту доставки — уже неправда
`;

  protected readonly multiDevice = `

═══ ТРИ УСТРОЙСТВА ЛЕНЫ — ОДНА «ЛЕТУЧКА» ═══

  устройства     iPhone (push: APNs) · ноутбук (веб, без push) · планшет у кассы
                 (Android, push: RuStore)
  у каждого      своя сессия, своё соединение, своя локальная база, свой push-токен


═══ СЦЕНА 1. ЛЕНА ОТПРАВЛЯЕТ С ТЕЛЕФОНА ═══

  телефон    clientMsgId 'b7e1…' → серое с часиками
  сервер     № 42 → рассылка ВСЕМ участникам, включая саму Лену
  ноутбук    видит № 42 от Лены — показывает справа, как своё
  планшет    то же
  телефон    видит № 42 с clientMsgId 'b7e1…' — это его сообщение:
             не дублирует, а превращает часики в галочку


═══ СЦЕНА 2. ЛЕНА ЧИТАЕТ НА НОУТБУКЕ ═══

  ноутбук    { type: 'read', upToSeq: 47 }
  сервер     указатель Лены → 47 (у УЧАСТНИКА, не у устройства)
             событие «Лена прочитала до 47» — участникам И в её соединения
  планшет    подключён → счётчик «#смены» гаснет сразу
  телефон    спит → счётчик исправит синхронизация при открытии;
             значок на иконке — со следующим push (в нём общий счётчик);
             уже показанное уведомление: Android уберёт по фоновому
             служебному push, iOS — тоже через фоновое, но не всегда


═══ СЦЕНА 3. КУДА ОТПРАВЛЯТЬ PUSH ═══

  Лена что-то делала на ноутбуке 40 секунд назад   → push НЕ отправляем
  ноутбук закрыт, последняя активность 10 мин назад → push на iPhone и планшет
  открыла на планшете                               → указатель сдвинулся для всех


═══ СЦЕНА 4. ПЛАНШЕТ У КАССЫ ПРОПАЛ ═══

  Настройки → Устройства:
    iPhone Лены            сейчас
    Ноутбук в кабинете     2 часа назад
    Планшет «Касса 1»      вчера, 21:40      [Выйти на этом устройстве]

  «Выйти» = удалить сессию И push-токен этого устройства
          + закрыть его соединение, если оно открыто
  без удаления push-токена — на потерянный планшет продолжат приходить
  уведомления с текстом рабочих сообщений


═══ КАК НЕ НАДО ═══

  указатель прочтения хранится на устройстве                           [!error]
  событие о своём сообщении без clientMsgId — дубль на телефоне        [!error]
  push на телефон, пока человек активно пишет с ноутбука                [!error]
  «выйти на устройстве» удаляет сессию, но не push-токен                [!error]
`;

  protected readonly pushDecision = `
// ═══ 1. ЗАДАЧА «PUSH О НОВОМ СООБЩЕНИИ» — ЗАПУСКАЕТСЯ ЧЕРЕЗ 5 СЕКУНД ═══
// В коде отправки мы поставили задачу push.new_message той же транзакцией; воркер берёт её
// не раньше чем через 5 секунд — чтобы успеть заметить, что сообщение уже прочитали
import type pg from 'pg';
import { db } from './db';
import { sendPush, type PushToken } from './push'; // единый слой: APNs, FCM, RuStore — страница «Почта, push и SMS»
import { lastActiveAt } from './presence';

type Job = { conversationId: string; seq: number };

type Recipient = {
  user_id: string;
  last_read_seq: string;
  notify_level: 'all' | 'mentions' | 'none';
  muted_until: Date | null;
  quiet_from: string | null; // '23:00' — тихие часы человека
  quiet_to: string | null;   // '08:00'
  timezone: string;
  mentioned: boolean;
  show_text: boolean;        // настройка человека И компании
};

export async function pushNewMessage(job: Job): Promise<void> {
  const { rows: [msg] } = await db.query<{ sender_id: string; sender_name: string; body: string | null; title: string | null; kind: string }>(
    \`SELECT m.sender_id, u.name AS sender_name, m.body, c.title, c.kind
       FROM messages m JOIN users u ON u.id = m.sender_id JOIN conversations c ON c.id = m.conversation_id
      WHERE m.conversation_id = $1 AND m.seq = $2 AND m.deleted_at IS NULL\`,
    [job.conversationId, job.seq],
  );
  if (!msg) return; // сообщение удалили за эти 5 секунд — молчим

  const { rows } = await db.query<Recipient>(
    \`SELECT cm.user_id, cm.last_read_seq, cm.notify_level, cm.muted_until,
            us.quiet_from, us.quiet_to, us.timezone, us.show_text AND org.allow_push_text AS show_text,
            EXISTS (SELECT 1 FROM message_mentions mm
                     WHERE mm.conversation_id = $1 AND mm.seq = $2 AND mm.user_id = cm.user_id) AS mentioned
       FROM conversation_members cm
       JOIN user_settings us ON us.user_id = cm.user_id
       JOIN conversations c ON c.id = cm.conversation_id
       JOIN organizations org ON org.id = c.organization_id
      WHERE cm.conversation_id = $1\`,
    [job.conversationId, job.seq],
  );

  for (const r of rows) {
    if (!(await shouldNotify(r, msg.sender_id, job.seq))) continue;
    const tokens = await tokensOf(db, r.user_id);
    if (tokens.length === 0) continue;
    await sendPush(tokens, {
      title: msg.kind === 'direct' ? msg.sender_name : (msg.title ?? 'Беседа'),
      // Текст — только если разрешено; иначе нейтрально. Через серверы Apple/Google — минимум данных
      body: r.show_text ? msg.sender_name + ': ' + (msg.body ?? 'вложение').slice(0, 120) : 'Новое сообщение',
      groupId: job.conversationId,             // уведомления одной беседы — в одну стопку
      badge: await badgeOf(db, r.user_id),      // общий счётчик на значке приложения
      data: { conversationId: job.conversationId, seq: job.seq }, // нажатие откроет беседу на этом сообщении
      silentIfGrouped: true,                   // звук — только у первого в стопке
    });
  }
}

// ═══ 2. ШЕСТЬ ВОПРОСОВ ═══
async function shouldNotify(r: Recipient, senderId: string, seq: number): Promise<boolean> {
  if (r.user_id === senderId) return false;                                   // 1. не автор
  const muted = r.notify_level === 'none' || (r.muted_until !== null && r.muted_until > new Date());
  if (muted && !r.mentioned) return false;                                    // 2. заглушено, но упоминание пробивает
  if (r.notify_level === 'mentions' && !r.mentioned) return false;            // 3. только упоминания
  const active = await lastActiveAt(r.user_id);                               // любое устройство
  if (active && Date.now() - active.getTime() < 2 * 60_000) return false;     // 4. работает на другом устройстве
  if (inQuietHours(r) && !r.mentioned) return false;                          // 5. тихие часы
  if (Number(r.last_read_seq) >= seq) return false;                           // 6. за 5 секунд уже прочитал
  return true;
}

function inQuietHours(r: Recipient): boolean {
  if (!r.quiet_from || !r.quiet_to) return false;
  // Время человека — в ЕГО часовом поясе, а не сервера
  const local = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: r.timezone }).format(new Date());
  return r.quiet_from > r.quiet_to
    ? local >= r.quiet_from || local < r.quiet_to   // через полночь: 23:00–08:00
    : local >= r.quiet_from && local < r.quiet_to;
}

async function tokensOf(client: pg.Pool, userId: string): Promise<PushToken[]> {
  // У одного человека — несколько токенов разных служб: iPhone (apns), планшет (rustore)…
  const { rows } = await client.query<PushToken>('SELECT id, transport, token FROM push_tokens WHERE user_id = $1', [userId]);
  return rows;
}

async function badgeOf(client: pg.Pool, userId: string): Promise<number> {
  const { rows } = await client.query<{ badge: string }>(
    \`SELECT coalesce(sum(greatest(c.last_seq - m.last_read_seq, 0)), 0) AS badge
       FROM conversation_members m JOIN conversations c ON c.id = m.conversation_id
      WHERE m.user_id = $1 AND m.notify_level <> 'none' AND (m.muted_until IS NULL OR m.muted_until < now())\`,
    [userId],
  );
  return Number(rows[0].badge);
}

// ═══ 3. МЁРТВЫЕ ТОКЕНЫ — УДАЛЯТЬ СРАЗУ ═══
// sendPush возвращает для каждого токена результат; «токен больше не действует»
// (у APNs — ответ 410, у FCM — UNREGISTERED) → DELETE FROM push_tokens WHERE id = $1

// ═══ КАК НЕ НАДО ═══
// for (const m of members) sendPush(m, msg)              // [!error] автору, заглушённым, ночью — всем
// отправлять сразу, без паузы и повторной проверки       // [!error] звенит о прочитанном на ноутбуке
// body: msg.body целиком, вложения и ссылки в push       // [!error] лишнее — через чужие серверы на экран блокировки
`;

  protected readonly attachments = `
// ═══ 1. РАЗРЕШЕНИЕ НА ЗАГРУЗКУ: ПРАВА, РАЗМЕР, ТИП, МЕСТО ═══
import { randomUUID } from 'node:crypto';
import { PutObjectCommand, GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { withTenant, type Tenant } from './tenant';

// Любое S3-совместимое хранилище, в том числе у российских облачных провайдеров
const s3 = new S3Client({ region: 'ru-central1', endpoint: process.env.S3_ENDPOINT });
const BUCKET = 'letuchka-attachments'; // закрытый: без публичного доступа

const ALLOWED = new Map<string, number>([
  ['image/jpeg', 20 * 1024 * 1024],
  ['image/png', 20 * 1024 * 1024],
  ['audio/ogg', 10 * 1024 * 1024],  // голосовые
  ['audio/mp4', 10 * 1024 * 1024],
  ['application/pdf', 50 * 1024 * 1024],
]);

type UploadRequest = { conversationId: string; contentType: string; sizeBytes: number; width?: number; height?: number; durationMs?: number };

export async function requestUpload(tenant: Tenant, req: UploadRequest) {
  const limit = ALLOWED.get(req.contentType);
  if (!limit) return { ok: false as const, reason: 'type_not_allowed' };
  if (!Number.isInteger(req.sizeBytes) || req.sizeBytes < 1 || req.sizeBytes > limit) return { ok: false as const, reason: 'too_big' };

  return withTenant(tenant, async (client) => {
    const member = await client.query('SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2', [req.conversationId, tenant.userId]);
    if (!member.rowCount) return { ok: false as const, reason: 'not_member' };
    // Место по тарифу компании — как лимиты в рецепте про SaaS
    const quota = await client.query<{ fits: boolean }>('SELECT storage_used_bytes + $2 <= storage_limit_bytes AS fits FROM organizations WHERE id = $1', [tenant.organizationId, req.sizeBytes]);
    if (!quota.rows[0]?.fits) return { ok: false as const, reason: 'storage_full' };

    // Ключ — случайный: по нему нельзя перебрать чужие файлы
    const key = tenant.organizationId + '/' + randomUUID();
    const { rows } = await client.query<{ id: string }>(
      \`INSERT INTO attachments (organization_id, uploader_id, storage_key, content_type, size_bytes, width, height, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id\`,
      [tenant.organizationId, tenant.userId, key, req.contentType, req.sizeBytes, req.width ?? null, req.height ?? null, req.durationMs ?? null],
    );
    // Подписанная ссылка: положить ровно этот файл этого типа — в течение 5 минут
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: req.contentType, ContentLength: req.sizeBytes }),
      { expiresIn: 300 },
    );
    return { ok: true as const, attachmentId: rows[0].id, uploadUrl };
  });
}

// ═══ 2. СООБЩЕНИЕ С ВЛОЖЕНИЕМ: ФАЙЛ ДОЛЖЕН БЫТЬ НА МЕСТЕ ═══
export async function verifyUploaded(storageKey: string, expectedType: string, expectedSize: number): Promise<boolean> {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: storageKey }));
    return head.ContentType === expectedType && head.ContentLength === expectedSize;
  } catch {
    return false; // файла нет — сообщение с ним не отправляем
  }
}
// Дальше — обычный handleSend, только kind = 'image' и UPDATE attachments SET message_id = … ;
// фоновая задача делает превью для ленты и проверяет, что внутри действительно картинка

// ═══ 3. СКАЧИВАНИЕ: ПРОВЕРКА УЧАСТИЯ И КОРОТКАЯ ССЫЛКА ═══
export async function downloadUrl(tenant: Tenant, attachmentId: string): Promise<string | null> {
  return withTenant(tenant, async (client) => {
    const { rows } = await client.query<{ storage_key: string }>(
      \`SELECT a.storage_key
         FROM attachments a
         JOIN messages m ON m.id = a.message_id AND m.deleted_at IS NULL
         JOIN conversation_members cm ON cm.conversation_id = m.conversation_id AND cm.user_id = $2
        WHERE a.id = $1 AND m.seq >= cm.visible_from_seq\`, // видит беседу и это место её истории
      [attachmentId, tenant.userId],
    );
    if (!rows[0]) return null;
    return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: rows[0].storage_key }), { expiresIn: 3600 });
  });
}

// ═══ 4. НА ТЕЛЕФОНЕ — ДО ЗАГРУЗКИ ═══
// • уменьшить до 2048 точек по длинной стороне и сжать: 6 МБ → ~400 КБ
// • убрать метаданные — в них бывают координаты места съёмки
// • запомнить ширину и высоту: лента оставит под фото место нужного размера и не «прыгнет»
// • голосовое: сжатый звук, длительность, «волна» из ~40 чисел для дорожки громкости, максимум 5 минут

// ═══ КАК НЕ НАДО ═══
// socket.send({ type: 'photo', base64: '…6 МБ…' })            // [!error] файл через соединение чата
// INSERT INTO attachments (data bytea)                        // [!error] файлы в базе данных
// публичный бакет и ссылки /photos/1234.jpg                   // [!error] перебор чужих файлов
// загрузили оригинал с камеры с координатами в метаданных     // [!error] утечка адреса
`;

  protected readonly pubsub = `
// ═══ 1. ШИНА: ДВА СОЕДИНЕНИЯ С REDIS — ПУБЛИКОВАТЬ И СЛУШАТЬ ═══
import { createClient } from 'redis';
import { deliverToUser } from './ws-server'; // рассылка в соединения на ЭТОМ сервере

const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = publisher.duplicate(); // подписанное соединение Redis не может делать ничего другого
await publisher.connect();
await subscriber.connect();

const channel = (userId: string) => 'user:' + userId;

// ═══ 2. ПОДПИСКА — ТАМ, ГДЕ ЕСТЬ СОЕДИНЕНИЯ ЧЕЛОВЕКА ═══
// Вызывается из register(): первое соединение человека на этом сервере
export async function subscribeUser(userId: string): Promise<void> {
  await subscriber.subscribe(channel(userId), (message) => {
    // Событие пришло из шины — раздаём его во ВСЕ соединения человека на этом сервере
    deliverToUser(userId, JSON.parse(message));
  });
}

// Последнее соединение человека на этом сервере закрылось — подписка больше не нужна
export async function unsubscribeUser(userId: string): Promise<void> {
  await subscriber.unsubscribe(channel(userId));
}

// ═══ 3. ПУБЛИКАЦИЯ — В ЛИЧНЫЕ КАНАЛЫ УЧАСТНИКОВ ═══
export async function publishToUsers(userIds: string[], event: object): Promise<void> {
  const payload = JSON.stringify(event);
  // multi — одной пачкой: беседа на 14 человек — 14 публикаций за один обмен с Redis
  const batch = publisher.multi();
  for (const id of userIds) batch.publish(channel(id), payload);
  await batch.exec();
  // На каналы тех, у кого нет соединений ни на одном сервере, никто не подписан —
  // событие никуда не уходит, и это правильно: для них сработает push, а сообщение лежит в базе
}

// ═══ 4. ВАЖНОЕ СВОЙСТВО: ШИНА НИЧЕГО НЕ ХРАНИТ ═══
// Сервер B перезапускался в момент публикации — событие для его клиентов потеряно.
// Это не страшно: клиенты переподключатся к другому серверу и догонят пропущенное по сводке,
// а пропуск в номерах заметят и без переподключения. Надёжность — в базе, скорость — в шине.
// Нужна шина с хранением — Redis Streams, NATS JetStream; для чата с синхронизацией обычно не нужна

// ═══ 5. ВЫКЛАДКА ПО ОДНОМУ СЕРВЕРУ ═══
//   1. сервер A получает SIGTERM → закрывает свои соединения кодом 1012 «перезапуск»
//   2. клиенты переподключаются с паузой 0,5–1 с со случайной добавкой → балансировщик ведёт их на B и C
//   3. новый A поднимается, проходит проверку здоровья → балансировщик снова шлёт на него
//   4. только потом — следующий сервер

// ═══ КАК НЕ НАДО ═══
// for (const id of members) deliverToUser(id, event)   // [!error] только своим соединениям — второй сервер не узнает
// subscriber.subscribe('chat:all', …)                  // [!error] каждый сервер получает ВСЁ и фильтрует сам
// перезапустить все серверы разом                       // [!error] толпа переподключений и простой
`;

  protected readonly storage = `
-- ═══ 1. СКОЛЬКО ВСЁ ВЕСИТ — ИЗМЕРИТЬ, А НЕ ГАДАТЬ ═══
SELECT pg_size_pretty(pg_total_relation_size('messages')) AS with_indexes,
       (SELECT count(*) FROM messages)                    AS rows;
-- 2 GB · 6 400 000 строк после первых пяти месяцев «Летучки» (цифры условные)

-- ═══ 2. ЗАПРОСЫ ЧАТА ИДУТ ПО ИНДЕКСУ — ПРОВЕРКА ═══
EXPLAIN (ANALYZE, BUFFERS)
SELECT seq, body FROM messages
 WHERE conversation_id = $1 AND seq < $2
 ORDER BY seq DESC LIMIT 50;
-- Index Scan Backward using messages_conversation_id_seq_key …  Execution Time: 0.3 ms
-- При шести миллионах строк — так же, как при шести тысячах: размер таблицы почти не влияет

-- ═══ 3. КОГДА ЗАБОЛИТ: СЕКЦИИ ПО БЕСЕДЕ ═══
-- Уникальность в секционированной таблице обязана включать ключ секционирования.
-- (conversation_id, seq) его включает — поэтому делим по хэшу беседы:
-- все сообщения одной беседы — в одной секции, номер внутри беседы по-прежнему уникален
CREATE TABLE messages_v2 (
  conversation_id uuid NOT NULL,
  seq             bigint NOT NULL,
  organization_id uuid NOT NULL,
  sender_id       uuid,
  client_msg_id   uuid,
  kind            text NOT NULL,
  body            text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  PRIMARY KEY (conversation_id, seq)
) PARTITION BY HASH (conversation_id);

CREATE TABLE messages_v2_p0 PARTITION OF messages_v2 FOR VALUES WITH (MODULUS 8, REMAINDER 0);
CREATE TABLE messages_v2_p1 PARTITION OF messages_v2 FOR VALUES WITH (MODULUS 8, REMAINDER 1);
-- … и так до p7
-- Секции по времени (PARTITION BY RANGE (created_at)) удаляют старое дешевле — целой секцией,
-- но уникальность тогда должна включать created_at, и номер в беседе база уже не охраняет сама

-- ═══ 4. СРОК ХРАНЕНИЯ: УДАЛЯТЬ ПАЧКАМИ ═══
-- organizations.retention_days: 365 / 1095 / NULL — «без ограничения»
-- Задача раз в сутки повторяет этот запрос с паузой 1–2 секунды, пока он удаляет хоть что-то.
-- Сначала вложения: их storage_key уходят в очередь на удаление из хранилища
WITH doomed AS (
  SELECT m.id
    FROM messages m
    JOIN organizations o ON o.id = m.organization_id
   WHERE o.retention_days IS NOT NULL
     AND m.created_at < now() - make_interval(days => o.retention_days)
   LIMIT 5000                                   -- пачка, а не миллион строк одним запросом
), files AS (
  DELETE FROM attachments a USING doomed d WHERE a.message_id = d.id
  RETURNING a.storage_key
), queued AS (
  INSERT INTO storage_deletions (storage_key) SELECT storage_key FROM files
)
DELETE FROM messages WHERE id IN (SELECT id FROM doomed);
-- Если сервис — организатор распространения информации, закон требует хранить содержимое
-- сообщений определённый срок: короткие сроки в настройках компании нужно сверить с юристом

-- ═══ 5. ПОСЛЕ МАССОВЫХ УДАЛЕНИЙ ═══
-- Место освобождает автоочистка (autovacuum) — следите, что она успевает:
SELECT relname, n_dead_tup, last_autovacuum
  FROM pg_stat_user_tables
 WHERE relname IN ('messages', 'attachments');

-- ═══ КАК НЕ НАДО ═══
-- DELETE FROM messages WHERE created_at < now() - interval '1 year';  -- [!error] миллион строк — база встала
-- секции и отдельная «база для чатов» с первого дня                  -- [!error] сложность без пользы
-- удалили сообщения, а файлы в хранилище остались                    -- [!error] «удалённое» живёт по ссылке
`;

  protected readonly search = `
-- ═══ 1. ПОИСКОВАЯ СТРОКА СООБЩЕНИЯ ═══
-- У удалённого body = NULL — его поисковая строка пуста, и найти его нельзя
ALTER TABLE messages ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('russian', coalesce(body, ''))) STORED;
CREATE INDEX messages_search_idx ON messages USING gin (search_vector);

-- ═══ 2. ПОИСК С ПРАВАМИ: ТОЛЬКО МОИ БЕСЕДЫ И ВИДИМАЯ МНЕ ИСТОРИЯ ═══
-- $1 — кто ищет · $2 — запрос · $3 — «от кого» · $4 — «в какой беседе» · $5 — «с какой даты» (NULL — без фильтра)
WITH q AS (
  SELECT websearch_to_tsquery('russian', $2) AS query      -- 'молоко поставщик' → молок & поставщик
)
SELECT m.conversation_id,
       coalesce(c.title, 'личная переписка')            AS conversation,
       m.seq,                                           -- нажатие откроет беседу «окном» вокруг этого номера
       u.name                                           AS author,
       m.created_at,
       ts_headline('russian', m.body, q.query,
                   'StartSel=«, StopSel=», MaxFragments=1, MaxWords=18') AS snippet
FROM messages m
JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
                            AND cm.user_id = $1          -- участник ПРЯМО СЕЙЧАС: удалили из канала — не найдёт
JOIN conversations c ON c.id = m.conversation_id
LEFT JOIN users u    ON u.id = m.sender_id
CROSS JOIN q
WHERE m.search_vector @@ q.query
  AND m.seq >= cm.visible_from_seq                       -- только видимая ему часть истории
  AND m.deleted_at IS NULL
  AND ($3::uuid IS NULL OR m.sender_id = $3)
  AND ($4::uuid IS NULL OR m.conversation_id = $4)
  AND ($5::timestamptz IS NULL OR m.created_at >= $5)
ORDER BY round(ts_rank(m.search_vector, q.query)::numeric, 2) DESC, -- примерно одинаково подходящие —
         m.created_at DESC                                         -- среди них свежее выше
LIMIT 20;
-- '#поставки' | 4120 | Лена | 14.10 | «Поставщик обещал «молоко» в четверг до 9:00»
-- '#поставки' | 3877 | Лена | 02.10 | «…«молоко» привезут в среду…»

-- ═══ 3. ОПЕЧАТКИ В ИМЕНАХ: ПОХОЖЕСТЬ ПО ТРОЙКАМ БУКВ ═══
-- Полнотекстовый поиск опечаток не прощает: «малоко» не найдёт «молоко».
-- Для имён людей и названий бесед подходит расширение pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX users_name_trgm ON users USING gin (name gin_trgm_ops);

SELECT name
  FROM users
 WHERE organization_id = $1 AND name % 'Лина'        -- «от: Лина» найдёт и «Лена»
 ORDER BY similarity(name, 'Лина') DESC
 LIMIT 5;

-- ═══ КАК НЕ НАДО ═══
-- WHERE body ILIKE '%молоко%'                           -- [!error] перебор всей таблицы, без морфологии
-- искать по всей компании, права проверить потом        -- [!error] найдёт закрытые группы, выдаст их число
-- права — при записи в индекс, а не при поиске          -- [!error] удалённый из канала всё ещё найдёт
`;

  protected readonly chatSecurity = `
// ═══ 1. ПРАВА — В КАЖДОМ ОБРАБОТЧИКЕ, ОДНОЙ ФУНКЦИЕЙ ═══
import type pg from 'pg';
import { lookup } from 'node:dns/promises';
import net from 'node:net';

type Action = 'send' | 'read' | 'typing' | 'upload' | 'edit_own' | 'delete_own' | 'delete_any' | 'pin' | 'add_member' | 'remove_member';
const ADMIN_ONLY = new Set<Action>(['delete_any', 'pin', 'add_member', 'remove_member']);

class NotFound extends Error {}
class Forbidden extends Error {}

export async function authorize(client: pg.PoolClient, userId: string, conversationId: string, action: Action): Promise<'admin' | 'member'> {
  const { rows } = await client.query<{ role: 'admin' | 'member' }>(
    'SELECT role FROM conversation_members WHERE conversation_id = $1 AND user_id = $2',
    [conversationId, userId],
  );
  const role = rows[0]?.role;
  if (!role) throw new NotFound(); // не участник — «не найдено»: не подтверждаем, что беседа существует
  if (ADMIN_ONLY.has(action) && role !== 'admin') throw new Forbidden();
  return role;
}
// Правка и удаление своего — автор прямо в условии запроса:
//   UPDATE messages SET body = $4, edited_at = now()
//    WHERE conversation_id = $1 AND seq = $2 AND sender_id = $3 AND deleted_at IS NULL

// ═══ 2. ПОКАЗ СООБЩЕНИЯ: ТОЛЬКО КАК ТЕКСТ, ССЫЛКИ — ТОЛЬКО БЕЗОПАСНЫЕ ═══
const URL_IN_TEXT = /\\bhttps?:\\/\\/[^\\s<>"]+/g;

export function renderMessageBody(container: HTMLElement, body: string): void {
  container.replaceChildren();
  let last = 0;
  for (const match of body.matchAll(URL_IN_TEXT)) {
    const start = match.index ?? 0;
    container.append(document.createTextNode(body.slice(last, start))); // текст — узлом текста, а не HTML
    container.append(toSafeLink(match[0]) ?? document.createTextNode(match[0]));
    last = start + match[0].length;
  }
  container.append(document.createTextNode(body.slice(last)));
}

function toSafeLink(raw: string): HTMLAnchorElement | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null; // никаких javascript: и data:
  const link = document.createElement('a');
  link.href = url.href;
  link.textContent = raw;                  // видимая часть — тоже как текст
  link.target = '_blank';
  link.rel = 'noopener noreferrer nofollow'; // новая вкладка не сможет управлять нашей
  return link;
}
// Во фреймворках то же даёт обычная интерполяция — {{ body }} в Angular и Vue, {body} в React:
// она экранирует сама. Опасны innerHTML, [innerHTML], v-html и dangerouslySetInnerHTML

// ═══ 3. ПРЕДПРОСМОТР ССЫЛКИ — БЕЗ SSRF ═══
const internal = new net.BlockList();
internal.addSubnet('10.0.0.0', 8);
internal.addSubnet('172.16.0.0', 12);
internal.addSubnet('192.168.0.0', 16);
internal.addSubnet('127.0.0.0', 8);
internal.addSubnet('169.254.0.0', 16);   // здесь живёт служебный адрес облака с ключами доступа
internal.addSubnet('100.64.0.0', 10);
internal.addAddress('0.0.0.0');
internal.addAddress('::1', 'ipv6');
internal.addSubnet('fc00::', 7, 'ipv6');
internal.addSubnet('fe80::', 10, 'ipv6');

declare function readLimited(response: Response, maxBytes: number): Promise<string>;

export async function fetchPreview(raw: string): Promise<{ title: string } | null> {
  const url = new URL(raw);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.port && url.port !== '443' && url.port !== '80') return null;

  // На какие адреса указывает имя? Хоть один внутренний — не идём
  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.some((a) => internal.check(a.address, a.family === 6 ? 'ipv6' : 'ipv4'))) return null;

  const response = await fetch(url, {
    redirect: 'manual',                     // перенаправление могло бы увести внутрь — не следуем
    signal: AbortSignal.timeout(3_000),
    headers: { 'User-Agent': 'LetuchkaPreview/1.0' },
  });
  if (!response.ok) return null;
  if (!(response.headers.get('content-type') ?? '').startsWith('text/html')) return null;
  const html = await readLimited(response, 256 * 1024); // не больше 256 КБ
  const title = /<title[^>]*>([^<]{1,200})<\\/title>/i.exec(html)?.[1]?.trim();
  return title ? { title } : null;
}
// Оговорка: между проверкой адреса и самим запросом имя может «переключиться» на другой адрес.
// Надёжнее всего — делать такие запросы из отдельного сервиса без доступа к внутренней сети

// ═══ 4. ОГРАНИЧЕНИЯ — НЕ ТОЛЬКО НА СООБЩЕНИЯ ═══
export const LIMITS = {
  messagesPer10s: 20,
  connectionsPerUser: 10,      // одна учётная запись не откроет тысячу соединений
  uploadsPerMinute: 10,
  searchesPerMinute: 30,
  conversationsPerHour: 20,
  frameBytes: 64 * 1024,       // размер одного кадра WebSocket
} as const;

// ═══ КАК НЕ НАДО ═══
// element.innerHTML = message.body;                 // [!error] одно сообщение — чужой код у всех в канале
// await fetch(urlFromMessage);                      // [!error] сервер откроет внутренний адрес по просьбе
// logger.info('message sent', { body });            // [!error] переписка всех компаний — в системе логов
// if (event.type === 'typing') relay(event)  — без проверки участия  // [!error] разведка чужих бесед
`;

  protected readonly encryptionChoices = `
═══ ШАГ 1. ОТ КОГО МЫ ЗАЩИЩАЕМ ПЕРЕПИСКУ ═══

  Угроза                                     Что от неё закрывает            Цена
  ─────────────────────────────────────────  ──────────────────────────────  ──────────────────
  Подслушивают Wi-Fi в кофейне               в пути: wss:// и https://       почти ноль
  Украли диск или резервную копию            шифрование на диске             почти ноль
  Утёк дамп базы через ошибку в коде         права, проверка кода, секреты   дисциплина
  Сотрудник сервиса заглядывает в базу       журнал доступа; полностью — E2E E2E — очень дорого
  Сервер взломан, злоумышленник внутри       только сквозное (E2E)           очень дорого

═══ ШАГ 2. ОБЯЗАТЕЛЬНЫЙ МИНИМУМ — ДЛЯ ЛЮБОГО ЧАТА ═══

  [ ] Везде wss:// и https://, включая загрузку файлов; ws:// и http:// закрыты
  [ ] Заголовок HSTS на домене: браузер больше никогда не пойдёт по незащищённому http
  [ ] Диски базы, реплик и резервных копий зашифрованы (галочка у облачного провайдера)
  [ ] Хранилище файлов закрытое, ссылки на скачивание — подписанные и короткоживущие
  [ ] Доступ к боевой базе — у двух человек, по личным учётным записям, с журналом
  [ ] Текст сообщений не попадает в логи, отчёты об ошибках и аналитику
  [ ] Ключи и пароли — в хранилище секретов, а не в репозитории

═══ ШАГ 3. ЕСЛИ СКВОЗНОЕ ВСЁ-ТАКИ НУЖНО ═══

  Брать готовое:       протокол Signal          — личные беседы и небольшие группы
                       MLS (RFC 9420)           — группы на сотни и тысячи участников
  Никогда:             «своё» шифрование; один общий ключ беседы навсегда;
                       ключ, зашитый в код приложения
  Продумать заранее:   как перенести ключи на новый телефон (иначе история пропадёт)
                       что видит новый участник группы
                       push без текста: текст расшифровывает само приложение при показе
                       поиск — только на устройстве, по тому, что на нём есть
                       жалоба = расшифрованная копия, которую присылает жалующийся
                       юрист: ч. 4.1 ст. 10.1 закона об информации

═══ РЕШЕНИЕ «ЛЕТУЧКИ» ═══

  Сквозное:     нет — переписка принадлежит компании: выгрузка, сроки хранения,
                новый сотрудник читает историю канала смен
  Минимум:      да, все семь пунктов шага 2
  На сайте:     «Переписка передаётся по зашифрованному соединению и хранится
                на зашифрованных дисках в России. Доступ к ней есть у участников
                бесед и, по правилам вашей компании, у её администраторов».
`;

  protected readonly moderation = `
// ═══ 1. ЖАЛОБА: КОПИЯ СОДЕРЖИМОГО — В МОМЕНТ ЖАЛОБЫ ═══
// CREATE TABLE reports (
//   id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id uuid NOT NULL,
//   reporter_id     uuid NOT NULL REFERENCES users (id),
//   message_id      uuid NOT NULL REFERENCES messages (id),
//   sender_id       uuid NOT NULL,
//   reason          text NOT NULL CHECK (reason IN ('spam', 'abuse', 'personal_data', 'other')),
//   comment         text,
//   body_snapshot   text,              -- текст на момент жалобы: автор может удалить сообщение через минуту
//   status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'rejected')),
//   resolved_by     uuid,
//   resolved_at     timestamptz,
//   created_at      timestamptz NOT NULL DEFAULT now(),
//   UNIQUE (reporter_id, message_id)   -- десять нажатий одного человека — одна жалоба
// );
import type pg from 'pg';
import { createHash } from 'node:crypto';
import { db } from './db';
import { withTenant, type Tenant } from './tenant';
import { publishToUsers } from './bus';
import { redis } from './redis';
import { authorize } from './authorize';
import { audit } from './audit';

type ReportReason = 'spam' | 'abuse' | 'personal_data' | 'other';

export async function reportMessage(
  tenant: Tenant,
  conversationId: string,
  seq: number,
  reason: ReportReason,
  comment: string | null,
): Promise<void> {
  await withTenant(tenant, async (client) => {
    await authorize(client, tenant.userId, conversationId, 'read'); // жаловаться можно только на то, что видишь
    const { rows } = await client.query<{ id: string; sender_id: string | null; body: string | null }>(
      \`SELECT m.id, m.sender_id, m.body
         FROM messages m
         JOIN conversation_members cm ON cm.conversation_id = m.conversation_id AND cm.user_id = $3
        WHERE m.conversation_id = $1 AND m.seq = $2 AND m.seq >= cm.visible_from_seq\`,
      [conversationId, seq, tenant.userId],
    );
    const message = rows[0];
    if (!message || message.sender_id === null) return; // на системные «Дима вступил в канал» не жалуются
    await client.query(
      \`INSERT INTO reports (organization_id, reporter_id, message_id, sender_id, reason, comment, body_snapshot)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (reporter_id, message_id) DO NOTHING\`,
      [tenant.organizationId, tenant.userId, message.id, message.sender_id, reason, comment?.slice(0, 500) ?? null, message.body],
    );
  });
  // Администраторам компании — «новая жалоба» в их панели; автор сообщения о жалобе не узнаёт.
  // Вложения такого сообщения задача очистки не трогает, пока жалоба открыта
}

// ═══ 2. БЛОКИРОВКА — ПРАВИЛО СЕРВЕРА, А НЕ ФИЛЬТР В ПРИЛОЖЕНИИ ═══
// CREATE TABLE user_blocks (
//   blocker_id uuid NOT NULL REFERENCES users (id),   -- кто заблокировал
//   blocked_id uuid NOT NULL REFERENCES users (id),   -- кого
//   created_at timestamptz NOT NULL DEFAULT now(),
//   PRIMARY KEY (blocker_id, blocked_id)
// );

// В handleSend — до выдачи номера. Для личной беседы:
export async function directBlocked(client: pg.PoolClient, conversationId: string, senderId: string): Promise<boolean> {
  const { rowCount } = await client.query(
    \`SELECT 1
       FROM conversations c
       JOIN conversation_members other ON other.conversation_id = c.id AND other.user_id <> $2
       JOIN user_blocks b ON b.blocker_id = other.user_id AND b.blocked_id = $2
      WHERE c.id = $1 AND c.kind = 'direct'\`,
    [conversationId, senderId],
  );
  // true → nack с кодом 'cannot_message': сообщение не сохраняется, не доставляется,
  // счётчик у получателя не растёт. Текст у отправителя нейтральный: «Не удалось отправить»
  return (rowCount ?? 0) > 0;
}
// В группе блокировка не выгоняет человека из беседы: у заблокировавшего его сообщения свёрнуты,
// а к шести вопросам из раздела про уведомления добавляется седьмой:
//   if (await hasBlocked(r.user_id, senderId)) return false;   // заблокировал автора — push молчит

// ═══ 3. УДАЛЕНИЕ АДМИНИСТРАТОРОМ — ВЕРСИЯ, ЖУРНАЛ, СОБЫТИЕ ═══
export async function deleteByAdmin(tenant: Tenant, conversationId: string, seq: number, reason: string): Promise<void> {
  const memberIds = await withTenant(tenant, async (client) => {
    await authorize(client, tenant.userId, conversationId, 'delete_any'); // не администратор — Forbidden
    await client.query('SELECT id FROM conversations WHERE id = $1 FOR UPDATE', [conversationId]); // та же очередь, что у номеров
    const deleted = await client.query(
      'UPDATE messages SET body = NULL, deleted_at = now() WHERE conversation_id = $1 AND seq = $2 AND deleted_at IS NULL',
      [conversationId, seq],
    );
    if (!deleted.rowCount) return null; // уже удалено — повторное нажатие ничего не меняет
    const v = await client.query<{ version: string }>(
      'UPDATE conversations SET version = version + 1 WHERE id = $1 RETURNING version',
      [conversationId],
    );
    await client.query(
      \`INSERT INTO conversation_changes (conversation_id, version, kind, payload)
       VALUES ($1, $2, 'message_deleted', $3)\`, // кто был не в сети — узнает при догоняющей синхронизации
      [conversationId, v.rows[0].version, JSON.stringify({ seq, by: 'admin' })],
    );
    // Кто, когда, где и почему — но без текста: он остался только в копии жалобы, если она была
    await audit(client, { actorId: tenant.userId, action: 'message.delete_any', conversationId, seq, reason });
    const m = await client.query<{ user_id: string }>('SELECT user_id FROM conversation_members WHERE conversation_id = $1', [conversationId]);
    return m.rows.map((r) => r.user_id);
  });
  // Номер № seq остаётся на месте: у всех на нём «Сообщение удалено администратором»
  if (memberIds) await publishToUsers(memberIds, { type: 'message_deleted', conversationId, seq, by: 'admin' });
}

// ═══ 4. ИСКЛЮЧЕНИЕ ИЗ КАНАЛА — СОБЫТИЯ ПРЕКРАЩАЮТСЯ СРАЗУ ═══
export async function removeMember(tenant: Tenant, conversationId: string, userId: string): Promise<void> {
  const remaining = await withTenant(tenant, async (client) => {
    await authorize(client, tenant.userId, conversationId, 'remove_member');
    await client.query('SELECT id FROM conversations WHERE id = $1 FOR UPDATE', [conversationId]);
    const removed = await client.query(
      'DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId],
    );
    if (!removed.rowCount) return null;
    const v = await client.query<{ version: string }>(
      'UPDATE conversations SET version = version + 1 WHERE id = $1 RETURNING version',
      [conversationId],
    );
    await client.query(
      \`INSERT INTO conversation_changes (conversation_id, version, kind, payload)
       VALUES ($1, $2, 'member_removed', $3)\`,
      [conversationId, v.rows[0].version, JSON.stringify({ userId })],
    );
    await audit(client, { actorId: tenant.userId, action: 'member.remove', conversationId, targetUserId: userId });
    const m = await client.query<{ user_id: string }>('SELECT user_id FROM conversation_members WHERE conversation_id = $1', [conversationId]);
    return m.rows.map((r) => r.user_id);
  });
  if (!remaining) return;
  await publishToUsers(remaining, { type: 'member_removed', conversationId, userId });
  await publishToUsers([userId], { type: 'conversation_removed', conversationId }); // его приложения убирают беседу и её кэш
}
// Рассылка берёт участников из базы на каждое сообщение (раздел «Масштаб»), handleSend и authorize
// проверяют участие на каждом действии — после COMMIT исключённый не получит ни сообщений, ни «печатает…»

// ═══ 5. МЕДЛЕННЫЙ РЕЖИМ И ОГРАНИЧЕНИЯ ДЛЯ НОВИЧКОВ ═══
// В handleSend — до транзакции, рядом с общим ограничением «20 сообщений за 10 секунд»
type Gate = { ok: true } | { ok: false; code: 'slow_mode' | 'new_account_limit'; retryAfterSec?: number };

export async function checkSendGates(
  userId: string,
  conv: { id: string; slowModeSec: number },     // 0 — режим выключен; хранится в настройках беседы
  sender: { createdAt: Date; role: 'admin' | 'member' },
  msg: { hasLink: boolean; hasAttachment: boolean },
): Promise<Gate> {
  // Сначала то, что отказывает без побочных эффектов: отказ не должен «съесть» минуту медленного режима
  const accountAgeMs = Date.now() - sender.createdAt.getTime();
  if (accountAgeMs < 24 * 3_600_000 && (msg.hasLink || msg.hasAttachment)) {
    return { ok: false, code: 'new_account_limit' }; // «Ссылки и файлы — через сутки после регистрации»
  }
  if (conv.slowModeSec > 0 && sender.role !== 'admin') {
    const key = \`slow:\${conv.id}:\${userId}\`;
    // NX — записать, только если ключа ещё нет; EX — ключ сам исчезнет через slowModeSec секунд
    const first = await redis.set(key, '1', 'EX', conv.slowModeSec, 'NX');
    if (first === null) {
      const ttl = await redis.ttl(key);
      return { ok: false, code: 'slow_mode', retryAfterSec: Math.max(ttl, 1) }; // «Следующее сообщение — через 42 с»
    }
  }
  return { ok: true };
}

// ═══ 6. ПРОСТОЕ ПРАВИЛО ПРОТИВ РАССЫЛОК — ЛОВИТ БОЛЬШЕ, ЧЕМ КАЖЕТСЯ ═══
export async function looksLikeBlast(userId: string, conversationId: string, body: string): Promise<boolean> {
  const hash = createHash('sha256').update(body.trim().toLowerCase()).digest('hex').slice(0, 16);
  const key = \`blast:\${userId}:\${hash}\`;      // сам текст в Redis не кладём — только его отпечаток
  await redis.sadd(key, conversationId);           // множество бесед, куда ушёл ЭТОТ текст
  await redis.expire(key, 60, 'NX');               // окно — минута; NX: срок ставится один раз и не продлевается
  return (await redis.scard(key)) >= 10;           // один текст в 10 бесед за минуту — так не пишет человек
}
// true → не банить, а: (1) запретить отправку на 30 минут, (2) завести карточку в очереди проверки,
// (3) сообщить администратору компании: «похоже, учётную запись Димы взломали — проверьте»

// ═══ 7. НЕЙРОСЕТЬ ПОМЕЧАЕТ — ЧЕЛОВЕК РЕШАЕТ ═══
type Verdict = { label: 'ok' | 'abuse' | 'spam'; confidence: number };
declare function classify(text: string): Promise<Verdict>; // любая модель-классификатор

// Фоном, ПОСЛЕ доставки: сообщение не ждёт модель. И только в компаниях, которые это включили:
// отправить текст сторонней модели — это передача данных, она должна быть в договоре
export async function screenMessage(organizationId: string, messageId: string, body: string): Promise<void> {
  const verdict = await classify(body);
  if (verdict.label === 'ok' || verdict.confidence < 0.8) return;
  await db.query(
    \`INSERT INTO moderation_queue (organization_id, message_id, source, label, confidence)
     VALUES ($1, $2, 'model', $3, $4)\`,
    [organizationId, messageId, verdict.label, verdict.confidence],
  );
  // Ничего не удаляем и никого не блокируем: администратор увидит карточку и решит сам
}

// ═══ 8. СОТРУДНИК УВОЛЕН — ВЫХОД НА ВСЕХ УСТРОЙСТВАХ ПРЯМО СЕЙЧАС ═══
declare function requireOrgAdmin(client: pg.PoolClient, userId: string): Promise<void>;

export async function forceLogout(tenant: Tenant, userId: string): Promise<void> {
  await withTenant(tenant, async (client) => {
    await requireOrgAdmin(client, tenant.userId); // владелец или администратор компании
    await client.query('UPDATE users SET disabled_at = now() WHERE id = $1', [userId]);
    await client.query('UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL', [userId]);
    await client.query('DELETE FROM push_tokens WHERE user_id = $1', [userId]); // и push на его телефон больше не придут
    await audit(client, { actorId: tenant.userId, action: 'user.force_logout', targetUserId: userId });
  });
  // Получив это событие, каждый сервер соединений закроет сокеты человека с кодом 4001 — «войдите заново»
  await publishToUsers([userId], { type: 'session_revoked' });
}
// Короткий токен доступа ещё несколько минут может казаться действительным, поэтому сервер
// сверяет disabled_at при каждом подключении и раз в минуту — на уже открытом соединении

// ═══ КАК НЕ НАДО ═══
// if (blockedIds.includes(m.senderId)) hide(m);     // [!error] только в приложении: push всё равно звенит
// DELETE FROM messages WHERE id = $1                 // [!error] номер «уехал», у жалобы пропало доказательство
// if (verdict.label === 'abuse') banUser(senderId);  // [!error] «кофемашину пора убить» — и бариста без доступа
// reports хранит только message_id                   // [!error] автор удалит сообщение — проверять нечего
`;

  protected readonly legalChat = `
═══ СТАТЬЯ 10.1 ЗАКОНА ОБ ИНФОРМАЦИИ (149-ФЗ) — КАРТА ДЛЯ РАЗРАБОТЧИКА ═══
Редакция на 2026 год, в пересказе. Не юридическая консультация.

ВСЕМ ОРГАНИЗАТОРАМ РАСПРОСТРАНЕНИЯ ИНФОРМАЦИИ
  Обязанность                                      Что это значит для системы
  ───────────────────────────────────────────────  ─────────────────────────────────────────────
  Уведомить Роскомнадзор о начале деятельности     юристу: до запуска, а не после письма
  Хранить в России сведения о фактах приёма,       журнал «кто, кому, когда, с какого адреса»
    передачи и обработки сообщений                   и данные пользователей — 3 года;
    и о пользователях                                серверы и резервные копии — в России
  Хранить в России содержимое сообщений            до 6 месяцев; порядок и объём —
                                                     по постановлению правительства
  Предоставлять сведения уполномоченным            порядок обработки запросов,
    органам в случаях, установленных законом         ответственный человек, журнал
  Сообщения кодируются дополнительно (E2E)?        решать вместе с юристом ДО того,
    → передавать сведения для декодирования          как писать код шифрования

СЕРВИСАМ ОБМЕНА МГНОВЕННЫМИ СООБЩЕНИЯМИ — ДОПОЛНИТЕЛЬНО
  Идентифицировать пользователей по номеру         вход по номеру телефона;
    телефона по договору с оператором связи          договор с оператором подвижной связи
  В течение суток по требованию ограничить         в админке сервиса — «запретить отправку»
    пользователю передачу запрещённых сообщений      с журналом: когда пришло, когда исполнено
  Дать возможность отказаться от сообщений         блокировка собеседника — на сервере
    других пользователей                             (раздел «Модерация»)
  Не доставлять сообщения от неидентифициро-       без подтверждённого номера писать нельзя
    ванных пользователей без согласия получателя     или только тем, кто это разрешил
  Обеспечить конфиденциальность сообщений          в пути и на диске — шифрование,
                                                     строгие права, текст не в логах

ПЕРСОНАЛЬНЫЕ ДАННЫЕ (152-ФЗ) — КАК В РЕЦЕПТЕ ПРО SAAS
  Сотрудники компаний-клиентов                     обработка по поручению компании — в оферте
  Собственные посетители и пользователи сайта      политика обработки, согласия
  Базы с данными граждан России                    в России — вместе с репликами, копиями
                                                     и хранилищем файлов

ВОПРОСЫ ЮРИСТУ ДО ЗАПУСКА «ЛЕТУЧКИ»
  1. Являемся ли мы организатором распространения информации и сервисом
     обмена мгновенными сообщениями — и с какого момента?
  2. Как сочетать сроки хранения по закону с настройкой компании
     «хранить переписку год» и с удалением по её требованию?
  3. Нужен ли договор с оператором связи, если в чат входят только
     по приглашению компании?
  4. Как оформить поручение на обработку данных сотрудников в оферте?
`;

  protected readonly chatMetrics = `
// ═══ 1. МЕТРИКИ СЕРВЕРА СОЕДИНЕНИЙ (библиотека prom-client) ═══
import client from 'prom-client';
import WebSocket from 'ws';
import { randomUUID } from 'node:crypto';

export const wsConnections = new client.Gauge({
  name: 'chat_ws_connections',
  help: 'Открытые соединения на этом сервере',
});
export const sendAckSeconds = new client.Histogram({
  name: 'chat_send_ack_seconds',
  help: 'От получения события send до отправки ack',
  buckets: [0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});
export const nacks = new client.Counter({ name: 'chat_nack_total', help: 'Отказы в отправке', labelNames: ['code'] as const });
export const wsCloses = new client.Counter({ name: 'chat_ws_close_total', help: 'Закрытые соединения', labelNames: ['code'] as const });
export const resyncs = new client.Counter({ name: 'chat_resync_total', help: 'Догоняющие синхронизации' });
export const pushes = new client.Counter({ name: 'chat_push_total', help: 'Push-уведомления', labelNames: ['transport', 'result'] as const });

// Где они растут — в обработчиках из предыдущих разделов:
//   register(conn)        → wsConnections.inc()
//   conn.on('close', …)   → wsConnections.dec(); wsCloses.inc({ code: String(code) })
//   handleSend            → const stop = sendAckSeconds.startTimer(); … stop();   отказ → nacks.inc({ code })
//   GET /api/sync         → resyncs.inc()
//   push-воркер           → pushes.inc({ transport: 'apns', result: 'ok' })
// Ни одной метки с id пользователя или беседы: тысячи разных значений — тысячи рядов, Prometheus захлебнётся

// ═══ 2. КОНТРОЛЬНАЯ ПАРА — ОТДЕЛЬНАЯ ПРОГРАММА НА ДРУГОМ ХОСТИНГЕ ═══
// Два бота в служебной компании; срок хранения переписки у неё — сутки, контрольные сообщения не копятся
const CHAT_URL = process.env['CANARY_URL'] ?? 'wss://api.letuchka.example/ws';
const TOKEN_A = process.env['CANARY_TOKEN_A'] ?? '';
const TOKEN_B = process.env['CANARY_TOKEN_B'] ?? '';
const CONVERSATION_ID = process.env['CANARY_CONVERSATION'] ?? '';

const roundtrip = new client.Histogram({
  name: 'chat_canary_roundtrip_seconds',
  help: 'Путь контрольного сообщения от бота А до бота Б',
  buckets: [0.1, 0.25, 0.5, 1, 2, 5],
});
const consecutiveFailures = new client.Gauge({ name: 'chat_canary_consecutive_failures', help: 'Сбоев подряд' });
let failuresInRow = 0;

function connect(token: string, opened: WebSocket[]): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CHAT_URL);
    opened.push(ws); // закроем в любом случае — даже если вход не удался
    const timer = setTimeout(() => reject(new Error('connect timeout')), 5_000);
    ws.once('open', () => ws.send(JSON.stringify({ type: 'auth', token })));
    ws.once('message', (raw) => {
      clearTimeout(timer);
      const ev = JSON.parse(String(raw));
      if (ev.type === 'auth_ok') resolve(ws);
      else reject(new Error('auth failed'));
    });
    ws.once('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// Каждую минуту — новые соединения: проверяется и вход, а балансировщик раскладывает ботов
// по разным серверам, и за несколько проверок пройдены все пути «сервер → Redis → сервер»
async function probe(): Promise<void> {
  const opened: WebSocket[] = [];
  try {
    const [a, b] = await Promise.all([connect(TOKEN_A, opened), connect(TOKEN_B, opened)]);
    const clientMsgId = randomUUID();
    const arrived = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('not delivered in 5 s')), 5_000);
      b.on('message', (raw) => {
        const ev = JSON.parse(String(raw));
        if (ev.type === 'message' && ev.clientMsgId === clientMsgId) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
    const sentAt = Date.now();
    a.send(JSON.stringify({ type: 'send', conversationId: CONVERSATION_ID, clientMsgId, body: 'canary:' + clientMsgId.slice(0, 4) }));
    await arrived;
    roundtrip.observe((Date.now() - sentAt) / 1000);
    failuresInRow = 0;
  } catch (err) {
    failuresInRow++;
    console.error('canary failed', { reason: String(err), inRow: failuresInRow });
  } finally {
    consecutiveFailures.set(failuresInRow);
    for (const ws of opened) ws.terminate();
  }
}
setInterval(() => void probe(), 60_000);

// ═══ 3. ТРЕВОГИ — ПРАВИЛА ДЛЯ PROMETHEUS ═══
// Контрольное сообщение не дошло три проверки подряд — будить дежурного:
//   chat_canary_consecutive_failures >= 3
// Сама контрольная пара не отвечает — тоже тревога: молчание проверки — не «всё хорошо»:
//   up{job="chat-canary"} == 0
// 95% подтверждений дольше секунды — пять минут подряд (for: 5m):
//   histogram_quantile(0.95, sum by (le) (rate(chat_send_ack_seconds_bucket[5m]))) > 1
// Соединений на треть меньше, чем две минуты назад, — массовый обрыв, а не «пошли спать»:
//   sum(chat_ws_connections) < 0.67 * sum(chat_ws_connections offset 2m)
// Больше 5% push с ошибкой за 10 минут — истёк ключ или сертификат сервиса доставки:
//   sum(rate(chat_push_total{result="error"}[10m])) / sum(rate(chat_push_total[10m])) > 0.05

// ═══ КАК НЕ НАДО ═══
// logger.info('send', { userId, body })                    // [!error] переписка — в системе логов
// sendAckSeconds.labels(conversationId)                     // [!error] метка на каждую беседу — миллион рядов
// проверка аптайма: GET /health → 200                       // [!error] сервер жив, а сообщения не ходят
`;

  protected readonly chatStack = `
═══ СТЕК «ЛЕТУЧКИ» НА ЗАПУСКЕ ═══

  Часть             Выбор                                    Почему
  ────────────────  ───────────────────────────────────────  ──────────────────────────────────────
  Сервер            Node.js + TypeScript, библиотека ws      тысячи молчащих соединений;
                                                               общие типы событий с клиентами
  HTTP API          тот же процесс                           история, файлы, настройки —
                                                               меньше частей, меньше поломок
  База              PostgreSQL, управляемая, в России        сообщения, участники, жалобы,
                                                               очередь задач, поиск
  Временное         Redis, управляемый                       шина событий, «в сети», «печатает…»,
                                                               ограничения частоты
  Файлы             объектное хранилище S3 в России          закрытое, подписанные ссылки
  Push              APNs, FCM, RuStore Push                  задача — строкой в базе,
                                                               в одной транзакции с сообщением
  Перед серверами   nginx                                    TLS, балансировка, вебсокеты
  Веб-клиент        любой SPA-фреймворк + IndexedDB          открывается мгновенно, догоняет
                                                               по сводке
  Мобильные         см. рецепт «Мобильное приложение с бэком»
  Наблюдаемость     Prometheus + Grafana, Sentry,            контрольная пара — снаружи
                    логи без текстов
  Машины            2 сервера приложения + управляемые база и Redis

═══ NGINX: БЕЗ ЭТИХ СТРОК ВЕБСОКЕТ НЕ ЖИВЁТ ═══

  upstream chat_servers {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
  }
  location /ws {
    proxy_pass http://chat_servers;
    proxy_http_version 1.1;                    # вебсокет начинается с запроса HTTP/1.1
    proxy_set_header Upgrade $http_upgrade;    # передать дальше просьбу «перейти на вебсокет»
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 75s;                    # больше сердцебиения (25 с) с хорошим запасом
  }

═══ НЕ БРАТЬ В ПЕРВУЮ ВЕРСИЮ ═══

  Kafka и другие распределённые очереди   хватает таблицы задач и Redis
  Cassandra, ScyllaDB                     PostgreSQL с правильными индексами держит
                                            сотни миллионов сообщений
  Микросервисы                            один процесс, внутри — модули
  Kubernetes                              две машины и выкладка по очереди
  Сквозное шифрование                     см. раздел «Шифрование»
  Звонки и видео                          отдельная огромная тема: WebRTC и медиасерверы
  Свой сервер реального времени с нуля    когда понадобится — готовый, например Centrifugo
`;

  protected readonly loadTest = `
// ═══ НАГРУЗОЧНЫЙ ТЕСТ «ЛЕТУЧКИ»: 5 000 СОЕДИНЕНИЙ ПИШУТ, ЧИТАЮТ, ОБРЫВАЮТСЯ ═══
// Запуск с отдельной машины:  k6 run -e WS_URL=wss://staging.letuchka.example/ws chat-load.js
// Только тестовый стенд и тестовые учётные записи — никогда боевые серверы
import { WebSocket } from 'k6/websockets';
import { SharedArray } from 'k6/data';
import { Trend, Counter, Rate } from 'k6/metrics';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// Заранее созданные тестовые пользователи: [{ id, token, conversationIds: [...] }, ...]
// Каждые 10 человек — одна «кофейня»: общий канал смен и несколько личных бесед
const users = new SharedArray('users', () => JSON.parse(open('./loadtest-users.json')));

const ackMs = new Trend('chat_ack_ms', true);           // «Отправить» → сервер подтвердил
const deliveryMs = new Trend('chat_delivery_ms', true); // отправил один → событие пришло другому
const nacks = new Counter('chat_nacks');
const unacked = new Counter('chat_unacked');            // отправлено, а подтверждения не дождались
const serverCloses = new Counter('chat_server_closes'); // соединение закрыл сервер, а не «человек»
const sessionOk = new Rate('chat_session_ok');          // вошёл и проработал без ошибок

export const options = {
  scenarios: {
    chat: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10m', target: 5000 }, // плавный рост — 500 новых людей в минуту
        { duration: '20m', target: 5000 }, // держим; в середине перезапускаем один сервер вручную
        { duration: '3m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    chat_ack_ms: ['p(95)<500'],
    chat_delivery_ms: ['p(95)<1000'],
    chat_session_ok: ['rate>0.99'],
    ws_connecting: ['p(95)<1000'], // встроенная метрика k6: время установки соединения
  },
};

const SESSION_MS = 5 * 60_000; // «сессия» — 5 минут, потом человек уходит и приходит снова
const SEND_EVERY_MS = 30_000;  // пишет раз в 30 секунд — в разы чаще живого бариста

let closedByServer = false;    // переменные модуля живут у виртуального пользователя между сессиями

export default function () {
  // Живой клиент после обрыва ждёт случайную паузу — и тест тоже, иначе шторм будет нечестным
  if (closedByServer) sleep(1 + Math.random() * 9);
  closedByServer = false;

  const user = users[(exec.vu.idInTest - 1) % users.length];
  const pending = new Map(); // clientMsgId → когда отправили
  const ws = new WebSocket(__ENV.WS_URL);
  let authed = false;
  let failed = false;
  let leaving = false;
  let sender = null;
  let leave = null;

  ws.addEventListener('open', () => {
    ws.send(JSON.stringify({ type: 'auth', token: user.token })); // токен — первым сообщением, не в адресе
  });

  ws.addEventListener('message', (e) => {
    const ev = JSON.parse(e.data);
    if (ev.type === 'auth_ok') {
      authed = true;
      sender = setInterval(() => {
        const clientMsgId = uuidv4();
        const conversationId = user.conversationIds[Math.floor(Math.random() * user.conversationIds.length)];
        pending.set(clientMsgId, Date.now());
        // Время отправки — прямо в тексте: все пользователи живут на одной машине k6, часы у них общие
        ws.send(JSON.stringify({ type: 'send', conversationId, clientMsgId, body: 'lt ' + Date.now() }));
      }, SEND_EVERY_MS + Math.random() * 5_000); // у каждого свой ритм — не все в одну секунду
      leave = setTimeout(() => {
        leaving = true;
        ws.close();
      }, SESSION_MS);
    } else if (ev.type === 'ack') {
      const sentAt = pending.get(ev.clientMsgId);
      if (sentAt) ackMs.add(Date.now() - sentAt);
      pending.delete(ev.clientMsgId);
    } else if (ev.type === 'nack') {
      nacks.add(1, { code: ev.code });
      failed = true;
      pending.delete(ev.clientMsgId);
    } else if (ev.type === 'message' && ev.senderId !== user.id && String(ev.body).startsWith('lt ')) {
      deliveryMs.add(Date.now() - Number(ev.body.slice(3)));
    }
  });

  ws.addEventListener('error', () => {
    failed = true;
  });

  ws.addEventListener('close', () => {
    if (sender) clearInterval(sender);
    if (leave) clearTimeout(leave);
    // Настоящий клиент переотправит их с тем же clientMsgId — здесь просто считаем
    unacked.add(pending.size);
    if (!leaving) {
      closedByServer = true;
      serverCloses.add(1); // перезапуск сервера — ожидаемо; важно, как быстро все вернутся
    }
    sessionOk.add(authed && !failed);
  });
}
`;

  protected readonly chatLaunch = `
═══ ПЕРЕД ЗАПУСКОМ «ЛЕТУЧКИ» ═══

СОЕДИНЕНИЕ
  [ ] Везде wss://; Origin проверяется; токен приходит первым сообщением, не в адресе
  [ ] Сердцебиение каждые 25 с, два пропуска — разрыв; таймауты nginx и балансировщика ≥ 60 с
  [ ] Переподключение — с растущей паузой и случайной добавкой
  [ ] При выкладке сервер закрывает соединения кодом 1012, клиенты расходятся по живым серверам

СООБЩЕНИЯ
  [ ] clientMsgId + уникальный индекс (sender_id, client_msg_id): двойное нажатие — одно сообщение
  [ ] Номер в беседе выдаётся под блокировкой строки беседы, в одной транзакции с записью
  [ ] Дыра в номерах — догрузка, а не показ; после переподключения — синхронизация по сводке
  [ ] История — по номерам (before / after / around), ни одного OFFSET
  [ ] Непрочитанные — last_seq − last_read_seq; указатель только растёт (greatest)

УВЕДОМЛЕНИЯ И ФАЙЛЫ
  [ ] Push — после шести вопросов и паузы 5 с; группировка; счётчик на значке
  [ ] Протухшие токены устройств удаляются по ответу сервиса доставки
  [ ] Файлы — напрямую в закрытое хранилище по подписанной ссылке; тип и размер проверены

БЕЗОПАСНОСТЬ И ЗАКОН
  [ ] Права проверяются в каждом обработчике; «не участник» = «не найдено»
  [ ] Сообщения показываются как текст; ссылки — только http и https
  [ ] Предпросмотр ссылок не ходит по внутренним адресам; таймаут и лимит размера
  [ ] Жалобы с копией содержимого; блокировка — на сервере; журнал действий администраторов
  [ ] Данные — в России; ответы юриста о статье 10.1 и о персональных данных получены

НАБЛЮДАЕМОСТЬ
  [ ] Контрольная пара снаружи, тревога после трёх сбоев подряд
  [ ] Графики соединений, подтверждений, отказов, закрытий и push; в логах — ни одного текста

НАГРУЗКА И РЕПЕТИЦИИ
  [ ] Нагрузочный тест на 3× ожидаемого пика пройден, с перезапуском сервера посередине
  [ ] Лимит открытых файлов ≥ 65 535 у серверов соединений; соединения nginx — с запасом
  [ ] Выключили Redis на минуту — после возвращения клиенты догнали пропущенное
  [ ] Базу восстановили из резервной копии на тестовом стенде — время записано
  [ ] Выложили новую версию в рабочее время — никто не заметил
`;
}
