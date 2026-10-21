import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-recipes-admin-tool',
  imports: [CodeBlock, RouterLink],
  templateUrl: './admin-tool.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemRecipesAdminTool {

  protected readonly adminVsDb = `
═══ ОДНА ПРАВКА — ДВА СПОСОБА ═══

  ПРЯМО В БАЗЕ, вторник, 11:04
    UPDATE menu_items SET price_kopecks = 26000;            ← забыли WHERE
    → 60 строк изменено, у воды и круассанов теперь цена 260 ₽
    → гости видят странные цены 40 минут, пока кто-то не позвонил
    → кто это сделал и какая цена была раньше — неизвестно:
      старых цен нигде нет, восстанавливали по фотографии меню

  В АДМИНКЕ, вторник, 11:04
    Лена: «Цены» → фильтр «молоко: овсяное» → «+20 ₽ ко всем»
    → предпросмотр: «Изменится 14 позиций в 3 кофейнях:
                     Раф овсяный 280 → 300 ₽, Латте овсяный 260 → 280 ₽, …»
    → причина (обязательно): «поставщик поднял цену на овсяное молоко»
    → подтверждение → изменение через API, как и любое другое
    → в журнале: 11:04:37 · Лена · price.bulk_update · 14 позиций ·
                 было/стало по каждой · причина
    → ошиблась? «Отменить» в течение часа — из того же журнала

═══ ЧТО АДМИНКА ДОБАВЛЯЕТ К ЛЮБОЙ ПРАВКЕ ═══

  1. Кто       личная учётная запись, вход со вторым фактором
  2. Можно ли  роль и место: Лена — все кофейни, старший бариста — только своя
  3. Правила   то же действие, что в продукте: возврат — через платёжный сервис
  4. Масштаб   предпросмотр: «изменится 14 позиций», а не «выполнено»
  5. Защита    подтверждение, причина, лимит суммы, второй человек
  6. След      журнал: кто, когда, что было, что стало, почему
`;

  protected readonly buildOrBuyAdmin = `
═══ КАК ВЫБИРАЛА «ПЕНКА» ═══

  Вопрос                                  Ответ «Пенки»
  ──────────────────────────────────────  ────────────────────────────────────────
  Сколько людей будет пользоваться?        7 — объём маленький, логика важнее красоты
  Сложные действия есть?                   да: возврат, бонусы, массовые цены, рассылки
  Правила уже живут в бэкенде?             да: отмена, возврат, журнал заказа, бонусы
  Общие типы с продуктом нужны?            да: заказ, меню, статусы — один пакет
  Персональные данные гостей в админке?    да: телефоны → данные остаются в России
  Кто будет поддерживать?                  та же студия, что и продукт

  Решение: каркас админки внутри общего репозитория,
           каждое действие — вызов API бэкенда, без прямого доступа к базе

═══ КОГДА РЕШЕНИЕ БЫЛО БЫ ДРУГИМ ═══

  Десятки простых таблиц, логики почти нет,
  разработчиков нет                         → конструктор, развёрнутый на своём сервере
  Продукт на Python и Django                → встроенная админка Django + свои действия
  Особый интерфейс (карта курьеров,
  диспетчерская в реальном времени)         → своё приложение для этой части

═══ ЧТО ПРОВЕРИТЬ У КОНСТРУКТОРА ДО ВЫБОРА ═══

  [ ] Ходит ли он в ваш API, или его тянут подключить прямо к базе
  [ ] Где хранит настройки, кэш, журналы — можно ли развернуть у себя
  [ ] Есть ли роли, ограничения по строкам («только своя кофейня»), журнал
  [ ] Как устроен вход: личные учётные записи, второй фактор, вход через ваш SSO
  [ ] Сколько стоит на 7, 20 и 50 сотрудников и что будет, если сервис уйдёт с рынка
`;

  protected readonly adminJobs = `
═══ ДЕЛА КОМАНДЫ «ПЕНКИ» — ПО ЧАСТОТЕ ═══

  Дело                                       Кто               Как часто     Версия
  ─────────────────────────────────────────  ────────────────  ────────────  ──────
  Найти гостя по телефону или номеру заказа   управляющая       10 раз в день   1
  Посмотреть заказ: состав, платёж, журнал    управляющая       10 раз в день   1
  Возврат за заказ (весь или часть)           управляющая       3 раза в день   1
  Компенсация бонусами («извините»)           управляющая       2 раза в день   1
  Стоп-лист «закончилось»                     старший бариста   5 раз в день    1
  Ёмкость окон на смену                       старший бариста   раз в день      1
  Меню: цены, новые позиции, фото             управляющая       раз в неделю    1
  Выручка и продажи по кофейням               владелица         раз в день      1
  Выгрузка продаж за месяц                    бухгалтер         раз в месяц     1
  Учётные записи планшетов                    старший бариста   раз в месяц     2
  Массовое изменение цен                      управляющая       раз в квартал   2
  Рекламная рассылка                          владелица         раз в месяц     2
  Минимальная версия, флаги возможностей      разработчик       раз в месяц     2
  Посмотреть приложение глазами гостя         управляющая       раз в неделю    3
  Удалить аккаунт по письму гостя             управляющая       раз в месяц     —  (гость сам, в приложении)
  Перенести бонусы со старого номера          разработчик       раз в полгода   —  (сценарием)

  Версия 1 — первые две недели работы; 2 — следующий месяц; 3 — когда понадобится;
  «—» — в админку не попадает: либо это уже умеет сам гость, либо слишком редко
`;

  protected readonly adminArchitecture = `
// ═══ ОДНА ФУНКЦИЯ ВОЗВРАТА — ДЛЯ ГОСТЯ И ДЛЯ АДМИНКИ ═══
import express from 'express';
import { db, type Tx } from './db';
import { transition } from './orders';
import { enqueueRefund } from './payments';
import { returnSpent } from './loyalty';
import { audit } from './audit';

// Кто совершает действие — гость, сотрудник или сама система. Попадает в журнал заказа и журнал админки
export type Actor =
  | { kind: 'guest'; userId: string }
  | { kind: 'staff'; staffId: string; name: string }
  | { kind: 'timer' };

// Код продукта: отменить заказ и вернуть деньги. Ничего не знает о том, откуда пришёл запрос
export async function cancelOrderWithRefund(tx: Tx, orderId: string, actor: Actor, reason: string): Promise<boolean> {
  const moved = await transition(tx, orderId, 'cancelled', actor); // проверит, можно ли из текущего состояния
  if (!moved) return false;
  await returnSpent(tx, orderId);                                  // списанные бонусы — обратно
  await enqueueRefund(tx, orderId, reason);                        // задача на возврат через платёжный сервис
  return true;                                                     // место в окне и событие на планшет — внутри transition
}
// Уже выданный заказ не отменяют: для него — частичный возврат отдельной функцией, с той же проверкой прав

const app = express();

// ═══ ВХОД ГОСТЯ: ОТМЕНА ИЗ ПРИЛОЖЕНИЯ ═══
app.post('/api/orders/:id/cancel', requireGuest, async (req, res) => {
  const ok = await db.tx((tx) => cancelOrderWithRefund(tx, req.params.id, { kind: 'guest', userId: req.guest.id }, 'guest_cancelled'));
  res.status(ok ? 200 : 409).json({ ok });
});

// ═══ ВХОД СОТРУДНИКА: ВОЗВРАТ ИЗ АДМИНКИ ═══
const admin = express.Router();
admin.use(requireStaffSession);   // вход сотрудника: сессия + второй фактор (следующий раздел)

admin.post('/orders/:id/refund', requirePermission('refund.create'), async (req, res) => {
  const reason = String(req.body?.reason ?? '').trim();
  if (reason.length < 5) {
    res.status(400).json({ code: 'reason_required' }); // без причины — нельзя
    return;
  }
  const staff = req.staff;
  const ok = await db.tx(async (tx) => {
    const done = await cancelOrderWithRefund(tx, req.params.id, { kind: 'staff', staffId: staff.id, name: staff.name }, reason);
    // Журнал админки — в ТОЙ ЖЕ транзакции: откатилось действие — нет и записи
    if (done) await audit(tx, { staffId: staff.id, action: 'order.refund', target: 'order:' + req.params.id, reason });
    return done;
  });
  res.status(ok ? 200 : 409).json({ ok });
});

app.use('/admin/api', admin); // только для сотрудников; приложение гостя сюда не ходит

// Заглушки для примера: настоящие — в разделах про вход и права
declare function requireGuest(req: express.Request, res: express.Response, next: express.NextFunction): void;
declare function requireStaffSession(req: express.Request, res: express.Response, next: express.NextFunction): void;
declare function requirePermission(p: string): express.RequestHandler;
declare global {
  namespace Express {
    interface Request { guest: { id: string }; staff: { id: string; name: string } }
  }
}

// ═══ КАК НЕ НАДО ═══
// admin.post('/orders/:id/cancel', (req) => db.query("UPDATE orders SET status = 'cancelled' …"))
//                                    // [!error] деньги не вернулись, бонусы не вернулись, планшет не узнал
// app.get('/admin', (req, res) => req.user.is_admin ? … : …)   // [!error] админка внутри сайта гостей
`;

  protected readonly adminAuth = `
// ═══ 1. TOTP: ОДИН И ТОТ ЖЕ КОД НА СЕРВЕРЕ И В ПРИЛОЖЕНИИ (RFC 6238) ═══
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { db } from './db';
import { redis } from './redis';

// Секрет создаётся при настройке и показывается сотруднику один раз — QR-кодом для приложения-генератора
export const newTotpSecret = () => randomBytes(20); // хранится в базе зашифрованным

function totpAt(secret: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));                       // номер 30-секундного шага с 1970 года
  const mac = createHmac('sha1', secret).update(counter).digest();
  const offset = mac[mac.length - 1] & 0x0f;                    // «динамическое усечение» из стандарта
  const code = (mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(code).padStart(6, '0');                         // 6 цифр: 004271
}

export function verifyTotp(secret: Buffer, code: string, now = Date.now()): number | null {
  const step = Math.floor(now / 1000 / 30);
  for (const s of [step - 1, step, step + 1]) {                 // ±30 секунд: часы телефона могут отставать
    const expected = Buffer.from(totpAt(secret, s));
    const given = Buffer.from(code.padStart(6, '0').slice(-6));
    if (timingSafeEqual(expected, given)) return s;              // вернём шаг — чтобы код нельзя было повторить
  }
  return null;
}

// ═══ 2. ВХОД: ПАРОЛЬ + КОД, ПОПЫТКИ ОГРАНИЧЕНЫ ═══
type Staff = { id: string; password_hash: string; totp_secret: Buffer; disabled_at: Date | null; last_totp_step: number | null };

export async function login(email: string, password: string, code: string, ip: string) {
  // Не больше 5 попыток за 15 минут на почту и 20 — на адрес
  const byEmail = await redis.incr('admin-login:' + email.toLowerCase());
  if (byEmail === 1) await redis.expire('admin-login:' + email.toLowerCase(), 900);
  const byIp = await redis.incr('admin-login-ip:' + ip);
  if (byIp === 1) await redis.expire('admin-login-ip:' + ip, 900);
  if (byEmail > 5 || byIp > 20) return { ok: false, code: 'too_many_attempts' } as const;

  const { rows } = await db.query<Staff>('SELECT * FROM staff WHERE lower(email) = lower($1)', [email]);
  const staff = rows[0];
  // Одинаковый ответ на «нет такой почты» и «неверный пароль»: не подсказываем, кто у нас работает
  if (!staff || staff.disabled_at || !(await argon2.verify(staff.password_hash, password))) {
    return { ok: false, code: 'invalid_credentials' } as const;
  }
  const step = verifyTotp(staff.totp_secret, code);
  if (step === null || (staff.last_totp_step !== null && step <= staff.last_totp_step)) {
    return { ok: false, code: 'invalid_credentials' } as const; // код уже использован — повтор не пройдёт
  }
  await db.query('UPDATE staff SET last_totp_step = $2, last_login_at = now(), last_login_ip = $3 WHERE id = $1', [staff.id, step, ip]);
  await redis.del('admin-login:' + email.toLowerCase());

  const sessionId = randomBytes(32).toString('base64url');
  const idHash = createHash('sha256').update(sessionId).digest('hex'); // в базе — только отпечаток
  await db.query(
    \`INSERT INTO staff_sessions (id_hash, staff_id, expires_at, last_seen_at, verified_at)
     VALUES ($1, $2, now() + interval '8 hours', now(), now())\`,
    [idHash, staff.id],
  );
  return { ok: true, sessionId } as const;
  // Cookie: admin_session=<sessionId>; HttpOnly; Secure; SameSite=Strict; Path=/; Domain=admin.penka.example
}

// ═══ 3. КАЖДЫЙ ЗАПРОС: СЕССИЯ ЖИВА? ═══
// SELECT … FROM staff_sessions s JOIN staff st ON st.id = s.staff_id
//  WHERE s.id_hash = $1 AND s.expires_at > now()
//    AND s.last_seen_at > now() - interval '30 minutes'   -- полчаса без действий — выход
//    AND s.revoked_at IS NULL AND st.disabled_at IS NULL  -- уволенного не пустит ни одна старая сессия
// и UPDATE staff_sessions SET last_seen_at = now() …

// ═══ 4. ПОВТОРНЫЙ КОД ПЕРЕД ОПАСНЫМ ДЕЙСТВИЕМ ═══
// Крупный возврат, рассылка всем, изменение ролей: verified_at сессии должен быть не старше 5 минут,
// иначе API отвечает 401 { code: 'reauth_required' }, и админка просит код из приложения ещё раз

// ═══ 5. УВОЛЬНЕНИЕ ═══
// UPDATE staff SET disabled_at = now() WHERE id = $1;
// UPDATE staff_sessions SET revoked_at = now() WHERE staff_id = $1 AND revoked_at IS NULL;
// Запись не удаляется: в журнале действий её строки должны указывать на конкретного человека
`;

  protected readonly permissions = `
// ═══ 1. РАЗРЕШЕНИЯ И РОЛИ ═══
export type Permission =
  | 'guest.view' | 'guest.view_pii'               // смотреть гостя / видеть телефон целиком
  | 'guest.view_as'                               // смотреть приложение глазами гостя
  | 'refund.create' | 'refund.approve'
  | 'points.adjust'
  | 'menu.edit' | 'stoplist.edit' | 'slots.edit'
  | 'reports.view' | 'reports.money'
  | 'push.campaign'
  | 'settings.edit' | 'audit.view'
  | 'staff.manage' | 'tablets.manage';

type Role = 'owner' | 'manager' | 'shift_lead' | 'accountant' | 'developer';

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  owner:      ['guest.view', 'guest.view_pii', 'guest.view_as', 'refund.create', 'refund.approve', 'points.adjust', 'menu.edit',
               'stoplist.edit', 'slots.edit', 'reports.view', 'reports.money', 'push.campaign', 'staff.manage',
               'tablets.manage', 'audit.view'],
  manager:    ['guest.view', 'guest.view_pii', 'guest.view_as', 'refund.create', 'points.adjust', 'menu.edit',
               'stoplist.edit', 'slots.edit', 'reports.view', 'reports.money', 'audit.view'],
  shift_lead: ['stoplist.edit', 'slots.edit', 'reports.view', 'tablets.manage'],    // только своя кофейня
  accountant: ['reports.view', 'reports.money'],                                      // без guest.* вообще
  developer:  ['settings.edit', 'audit.view'],                                        // без guest.view_pii
};

// Лимиты по сумме: сам — до лимита, больше — через одобрение
const LIMITS: Partial<Record<Role, { refundKopecks: number; pointsPerAdjust: number }>> = {
  owner:   { refundKopecks: Number.POSITIVE_INFINITY, pointsPerAdjust: Number.POSITIVE_INFINITY },
  manager: { refundKopecks: 300_000, pointsPerAdjust: 500 },   // 3 000 ₽ и 500 бонусов за раз
};

export type StaffContext = { id: string; roles: Role[]; shopIds: string[] | 'all' };

// ═══ 2. ОДНА ФУНКЦИЯ ПРОВЕРКИ — ЧТО И ГДЕ ═══
export function can(staff: StaffContext, permission: Permission, shopId?: string): boolean {
  const has = staff.roles.some((r) => ROLE_PERMISSIONS[r].includes(permission));
  if (!has) return false;                                   // по умолчанию — запрещено
  if (shopId === undefined || staff.shopIds === 'all') return true;
  return staff.shopIds.includes(shopId);                    // «только своя кофейня»
}

export function refundLimit(staff: StaffContext): number {
  return Math.max(0, ...staff.roles.map((r) => LIMITS[r]?.refundKopecks ?? 0));
}

// ═══ 3. ПРОВЕРКА В ОБРАБОТЧИКЕ — НА СЕРВЕРЕ, ВСЕГДА ═══
import type { Request, Response, NextFunction } from 'express';

export function requirePermission(permission: Permission, shopFrom?: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const staff = (req as Request & { staff: StaffContext }).staff;
    const shopId = shopFrom?.(req);
    if (!can(staff, permission, shopId)) {
      res.status(403).json({ code: 'forbidden', permission }); // и строку в журнал: попытки — тоже сигнал
      return;
    }
    next();
  };
}

// Стоп-лист: право И место — кофейня берётся из адреса запроса, а не из того, что прислал интерфейс
// admin.put('/shops/:shopId/stop-list', requirePermission('stoplist.edit', (req) => req.params['shopId']), …)

// ═══ КАК НЕ НАДО ═══
// if (staff.role !== 'accountant') showRefundButton()      // [!error] спрятали кнопку — и только
// const ALL = Object.values(PERMISSIONS)  — новой роли по умолчанию  // [!error] новое действие сразу у всех
// stopList.update(req.body.shopId, …)  без проверки места    // [!error] старший с Садовой правит Ленина
`;

  protected readonly auditLog = `
-- ═══ 1. ТАБЛИЦА ЖУРНАЛА ═══
CREATE TABLE audit_log (
  id           bigserial PRIMARY KEY,
  at           timestamptz NOT NULL DEFAULT now(),
  staff_id     uuid REFERENCES staff (id),   -- кто; NULL — сама система (таймер, задача)
  session_hash text,                         -- из какой сессии — отпечаток, не сама сессия
  ip           inet,
  action       text NOT NULL,                -- 'order.refund_payment', 'points.adjust', 'guest.view_pii', 'denied'
  target_type  text NOT NULL,                -- 'order', 'guest', 'menu_item', 'setting', 'staff'
  target_id    text NOT NULL,
  shop_id      text,                         -- чтобы показать «всё по Садовой»
  changes      jsonb,                        -- только изменившееся: {"price_kopecks": [26000, 28000]}
  reason       text,
  batch_id     uuid                          -- массовое действие: все его строки с одним batch_id
);
CREATE INDEX ON audit_log (target_type, target_id, at DESC); -- вкладка «История» в карточке
CREATE INDEX ON audit_log (staff_id, at DESC);               -- «что делала Лена на этой неделе»
CREATE INDEX ON audit_log (action, at DESC);

-- ═══ 2. ТОЛЬКО ДОБАВЛЯТЬ: ПРАВА И ПРАВИЛО В САМОЙ БАЗЕ ═══
-- app_backend — учётная запись, под которой бэкенд работает с базой
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM app_backend;
GRANT INSERT, SELECT ON audit_log TO app_backend;
GRANT USAGE ON SEQUENCE audit_log_id_seq TO app_backend;

CREATE FUNCTION audit_log_append_only() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only'; -- даже владелец таблицы не перепишет историю случайно
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();
CREATE TRIGGER audit_log_no_truncate BEFORE TRUNCATE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION audit_log_append_only();

-- ═══ 3. ЗАПИСЬ — В ТОЙ ЖЕ ТРАНЗАКЦИИ, ЧТО И ДЕЙСТВИЕ ═══
BEGIN;
  UPDATE menu_items SET price_kopecks = 28000, version = version + 1
   WHERE id = 'latte-oat' AND version = 7;
  INSERT INTO audit_log (staff_id, action, target_type, target_id, changes, reason)
  VALUES ('5b0c…', 'menu.price_update', 'menu_item', 'latte-oat',
          '{"price_kopecks": [26000, 28000]}', 'поставщик поднял цену на овсяное молоко');
COMMIT; -- либо обе строки, либо ни одной

-- ═══ 4. ВОПРОСЫ, НА КОТОРЫЕ ОТВЕЧАЕТ ЖУРНАЛ ═══
-- «Кто начислял этому гостю бонусы вручную — и почему?»
SELECT a.at, s.name, a.changes, a.reason
  FROM audit_log a
  JOIN staff s ON s.id = a.staff_id
 WHERE a.action = 'points.adjust' AND a.target_type = 'guest' AND a.target_id = $1
 ORDER BY a.at DESC;

-- Еженедельная сводка для владелицы: кто сколько сделал чувствительного
SELECT s.name,
       count(*) FILTER (WHERE a.action LIKE 'order.refund%') AS refunds,
       count(*) FILTER (WHERE a.action = 'points.adjust')     AS manual_points,
       count(*) FILTER (WHERE a.action = 'guest.view_pii')    AS phones_viewed,
       count(*) FILTER (WHERE a.action = 'denied')            AS denied_attempts
  FROM audit_log a
  JOIN staff s ON s.id = a.staff_id
 WHERE a.at > now() - interval '7 days'
 GROUP BY s.name
 ORDER BY refunds DESC;

-- ═══ КАК НЕ НАДО ═══
-- changes = to_jsonb(весь гость целиком)               -- [!error] телефоны гостей — ещё и в журнале
-- UPDATE audit_log SET reason = 'исправила опечатку'    -- [!error] журнал, который правят, ничего не доказывает
-- console.log('refund', orderId)  вместо таблицы        -- [!error] через неделю ротация логов всё сотрёт
`;

  protected readonly guestCard = `
// ═══ 1. ПОИСК: ТОЛЬКО ПО ТОЧНЫМ ПРИЗНАКАМ ═══
import { db } from './db';
import { redis } from './redis';
import { audit } from './audit';
import { can, type StaffContext } from './permissions';

class Forbidden extends Error {}
class NotFound extends Error {}
class TooManyRequests extends Error {}
declare function normalizePhone(raw: string): string | null;   // '8 999 123-45-67' → '+79991234567'
declare function notifyOwner(text: string, staffId: string): Promise<void>;

type GuestRow = { id: string; name: string | null; phone: string; created_at: Date };
type SearchQuery = { phone?: string; shopId?: string; date?: string; orderNumber?: number; paymentId?: string };

export async function searchGuests(staff: StaffContext, q: SearchQuery) {
  if (!can(staff, 'guest.view')) throw new Forbidden();
  // 200 поисков в час — с огромным запасом для работы и слишком мало, чтобы выкачать базу
  const n = await redis.incr('admin-search:' + staff.id);
  if (n === 1) await redis.expire('admin-search:' + staff.id, 3600);
  if (n > 200) {
    await notifyOwner('Необычно много поисков гостей', staff.id);
    throw new TooManyRequests();
  }

  let rows: GuestRow[] = [];
  if (q.phone) {
    const phone = normalizePhone(q.phone);
    if (phone) rows = (await db.query<GuestRow>('SELECT id, name, phone, created_at FROM users WHERE phone = $1 AND deleted_at IS NULL', [phone])).rows;
  } else if (q.shopId && q.date && q.orderNumber) {
    // «№ 31» повторяется каждый день в каждой кофейне — нужны все три признака
    rows = (await db.query<GuestRow>(
      \`SELECT u.id, u.name, u.phone, u.created_at
         FROM orders o JOIN users u ON u.id = o.user_id
        WHERE o.shop_id = $1 AND o.business_date = $2 AND o.number = $3\`,
      [q.shopId, q.date, q.orderNumber],
    )).rows;
  } else if (q.paymentId) {
    rows = (await db.query<GuestRow>(
      \`SELECT u.id, u.name, u.phone, u.created_at
         FROM payments p JOIN orders o ON o.id = p.order_id JOIN users u ON u.id = o.user_id
        WHERE p.id = $1\`, // номер платежа со скриншота из банка
      [q.paymentId],
    )).rows;
  }
  // «телефон содержит 45» и «все гости» не поддерживаются — намеренно
  return rows.map((u) => ({ id: u.id, name: maskName(u.name), phone: maskPhone(u.phone), since: u.created_at }));
}

// ═══ 2. МАСКИРОВАНИЕ ПО УМОЛЧАНИЮ ═══
export function maskPhone(phone: string): string {
  return phone.replace(/^\\+7(\\d{3})\\d{5}(\\d{2})$/, '+7 $1 ***-**-$2'); // +79991234567 → +7 999 ***-**-67
}
export function maskName(name: string | null): string {
  if (!name) return 'Гость';
  const [first, last] = name.trim().split(/\\s+/);
  return last ? first + ' ' + last[0] + '.' : first; // «Катя Крылова» → «Катя К.»
}

// ═══ 3. «ПОКАЗАТЬ НОМЕР» — ОТДЕЛЬНОЕ ДЕЙСТВИЕ С ЗАПИСЬЮ В ЖУРНАЛ ═══
export async function revealPhone(staff: StaffContext, guestId: string, reason: string): Promise<string> {
  if (!can(staff, 'guest.view_pii')) throw new Forbidden();
  return db.tx(async (tx) => {
    const { rows } = await tx.query<{ phone: string }>('SELECT phone FROM users WHERE id = $1 AND deleted_at IS NULL', [guestId]);
    if (!rows[0]) throw new NotFound();
    await audit(tx, { staffId: staff.id, action: 'guest.view_pii', targetType: 'guest', targetId: guestId, reason });
    return rows[0].phone; // «звонок гостю по жалобе» — причина видна в журнале
  });
}

// ═══ 4. КАРТОЧКА: ВСЁ О ГОСТЕ ОДНИМ ОТВЕТОМ API ═══
type PaymentRow = { id: string; order_id: string; amount_kopecks: number; status: string; created_at: Date };

export async function guestCard(staff: StaffContext, guestId: string) {
  if (!can(staff, 'guest.view')) throw new Forbidden();
  const [profile, orders, payments, points, history] = await Promise.all([
    db.query('SELECT id, name, phone, created_at, points, app_version, platform FROM users WHERE id = $1', [guestId]),
    db.query('SELECT id, number, shop_id, business_date, status, total_kopecks FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [guestId]),
    db.query<PaymentRow>(
      \`SELECT p.id, p.order_id, p.amount_kopecks, p.status, p.created_at
         FROM payments p JOIN orders o ON o.id = p.order_id
        WHERE o.user_id = $1 ORDER BY p.created_at DESC LIMIT 20\`,
      [guestId],
    ),
    db.query('SELECT delta, kind, order_id, created_at FROM loyalty_entries WHERE user_id = $1 ORDER BY id DESC LIMIT 20', [guestId]),
    db.query(
      \`SELECT a.at, s.name AS staff, a.action, a.changes, a.reason
         FROM audit_log a LEFT JOIN staff s ON s.id = a.staff_id
        WHERE a.target_type = 'guest' AND a.target_id = $1
        ORDER BY a.at DESC LIMIT 20\`,
      [guestId],
    ),
  ]);
  const p = profile.rows[0];
  if (!p) throw new NotFound();

  // Подсказка управляющей: у одного заказа больше одного успешного платежа — подсветить
  const paidByOrder = new Map<string, number>();
  for (const pay of payments.rows) {
    if (pay.status === 'succeeded') paidByOrder.set(pay.order_id, (paidByOrder.get(pay.order_id) ?? 0) + 1);
  }
  const doublePaid = [...paidByOrder].filter(([, count]) => count > 1).map(([orderId]) => orderId);

  return {
    guest: { id: p.id, name: maskName(p.name), phone: maskPhone(p.phone), since: p.created_at, points: p.points, app: p.app_version + ', ' + p.platform },
    orders: orders.rows,
    payments: payments.rows,
    points: points.rows,
    history: history.rows,
    warnings: doublePaid.map((orderId) => ({ kind: 'double_payment', orderId })),
  };
}

// ═══ КАК НЕ НАДО ═══
// SELECT * FROM users WHERE phone LIKE '%' || $1 || '%'   // [!error] поиск «по кусочку» выкачивает базу
// GET /admin/api/guests?limit=100000 → CSV                // [!error] база гостей — на флешке уходящего сотрудника
// phone: u.phone  — в каждой строке результатов            // [!error] номера — на каждом снимке экрана
`;

  protected readonly listEndpoint = `
// ═══ ТАБЛИЦА ЗАКАЗОВ: ФИЛЬТРЫ И СОРТИРОВКА — ТОЛЬКО ИЗ СПИСКА ═══
// /admin/orders?shop=sadovaya&status=paid&from=2026-10-14&to=2026-10-20&sort=-created_at&after=…
// Состояние таблицы живёт в адресе: ссылкой можно поделиться, «назад» работает, можно в закладки
import { replica } from './db';                       // таблицы и отчёты читают реплику
import { can, type StaffContext } from './permissions';

class BadRequest extends Error {}
class Forbidden extends Error {}

// Имя из адреса → столбец в запросе и поле в ответе. Ничего, кроме этого списка
const SORTS = {
  created_at: { column: 'o.created_at', field: 'created_at' },
  pickup:     { column: 'o.pickup_slot', field: 'pickup_slot' },
  total:      { column: 'o.total_kopecks', field: 'total_kopecks' },
} as const;
const STATUSES = new Set(['awaiting_payment', 'paid', 'accepted', 'preparing', 'ready', 'picked_up', 'cancelled', 'unclaimed']);
const PAGE = 50;

const encodeCursor = (value: unknown, id: string) => Buffer.from(JSON.stringify([value, id])).toString('base64url');
const decodeCursor = (s: string) => JSON.parse(Buffer.from(s, 'base64url').toString()) as [unknown, string];
const isDate = (s: string) => /^\\d{4}-\\d{2}-\\d{2}$/.test(s);

export async function listOrders(staff: StaffContext, query: Record<string, string | undefined>) {
  const where: string[] = [];
  const params: unknown[] = [];
  const param = (value: unknown) => {
    params.push(value);
    return '$' + params.length; // значения — всегда параметрами, никогда не вклеиваются в текст запроса
  };

  // Кофейня: только из тех, к которым у сотрудника есть доступ
  const shop = query['shop'];
  if (shop) {
    if (!can(staff, 'reports.view', shop)) throw new Forbidden();
    where.push('o.shop_id = ' + param(shop));
  } else if (staff.shopIds !== 'all') {
    where.push('o.shop_id = ANY(' + param(staff.shopIds) + ')');
  }
  const status = query['status'];
  if (status) {
    if (!STATUSES.has(status)) throw new BadRequest('status');
    where.push('o.status = ' + param(status));
  }
  const from = query['from'];
  const to = query['to'];
  if (from && isDate(from)) where.push('o.business_date >= ' + param(from));
  if (to && isDate(to)) where.push('o.business_date <= ' + param(to));

  const rawSort = query['sort'] ?? '-created_at';
  const desc = rawSort.startsWith('-');
  const sort = SORTS[rawSort.replace(/^-/, '') as keyof typeof SORTS];
  if (!sort) throw new BadRequest('sort'); // ?sort=1;DROP TABLE orders — сюда не доберётся

  // «Следующие после»: значение сортировки и id последней строки прошлой страницы
  const after = query['after'];
  if (after) {
    const [value, id] = decodeCursor(after);
    where.push('(' + sort.column + ', o.id) ' + (desc ? '<' : '>') + ' (' + param(value) + ', ' + param(id) + ')');
  }

  const dir = desc ? ' DESC' : ' ASC';
  const sql =
    'SELECT o.id, o.number, o.shop_id, o.status, o.pickup_slot, o.total_kopecks, o.created_at FROM orders o' +
    (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY ' + sort.column + dir + ', o.id' + dir +
    ' LIMIT ' + PAGE;
  const { rows } = await replica.query<Record<string, unknown> & { id: string }>(sql, params);
  const last = rows.at(-1);
  return {
    rows, // время в интерфейсе — по часовому поясу кофейни: new Intl.DateTimeFormat('ru-RU', { timeZone: shop.timeZone })
    next: rows.length === PAGE && last ? encodeCursor(last[sort.field], last.id) : null,
  };
}

// ═══ КАК НЕ НАДО ═══
// 'ORDER BY ' + req.query.sort                           // [!error] имя столбца из адреса — SQL-инъекция
// 'WHERE status = \\'' + req.query.status + '\\''          // [!error] значение вклеено в текст запроса
// OFFSET 50000 LIMIT 50                                  // [!error] сотая страница — секунды, строки «прыгают»
`;

  protected readonly optimisticLock = `
// ═══ 1. ПРОВЕРКИ — ОДНИ НА ВСЕХ (packages/shared) ═══
import { z } from 'zod';

export const MenuItemPatch = z
  .object({
    title: z.string().trim().min(2).max(40, 'Длиннее 40 символов не помещается в карточку приложения'),
    description: z.string().trim().max(300),
    priceKopecks: z.number().int().min(100).max(500_000, 'Цена не может быть больше 5000 ₽ — проверьте, не лишний ли ноль'),
    isDrink: z.boolean(),
  })
  .partial()                       // приходят только изменённые поля
  .strict();                       // неизвестное поле — ошибка, а не «тихо проигнорируем»

// ═══ 2. СЕРВЕР: СОХРАНИТЬ, ТОЛЬКО ЕСЛИ НОМЕР РЕДАКЦИИ СОВПАЛ ═══
import { db } from './db';
import { audit } from './audit';

type Result =
  | { ok: true; version: number }
  | { ok: false; code: 'conflict'; current: Record<string, unknown>; changedBy: string | null; changedAt: Date }
  | { ok: false; code: 'invalid'; errors: Record<string, string> };

const COLUMNS = { title: 'title', description: 'description', priceKopecks: 'price_kopecks', isDrink: 'is_drink' } as const;

export async function updateMenuItem(staffId: string, itemId: string, baseVersion: number, patchRaw: unknown, reason: string): Promise<Result> {
  const parsed = MenuItemPatch.safeParse(patchRaw);
  if (!parsed.success) {
    return { ok: false, code: 'invalid', errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  }
  const patch = parsed.data;
  const keys = Object.keys(patch) as (keyof typeof COLUMNS)[];

  return db.tx(async (tx): Promise<Result> => {
    const before = (await tx.query('SELECT * FROM menu_items WHERE id = $1 FOR UPDATE', [itemId])).rows[0];
    if (before.version !== baseVersion) {
      // Кто-то сохранил раньше: показываем, что сейчас и кто поменял, — решает человек
      const last = (await tx.query<{ name: string; at: Date }>(
        \`SELECT s.name, a.at FROM audit_log a JOIN staff s ON s.id = a.staff_id
          WHERE a.target_type = 'menu_item' AND a.target_id = $1 ORDER BY a.at DESC LIMIT 1\`,
        [itemId],
      )).rows[0];
      return { ok: false, code: 'conflict', current: before, changedBy: last?.name ?? null, changedAt: last?.at ?? before.updated_at };
    }
    const sets = keys.map((k, i) => COLUMNS[k] + ' = $' + (i + 3));          // имена столбцов — только из COLUMNS
    const { rows } = await tx.query<{ version: number }>(
      'UPDATE menu_items SET ' + sets.join(', ') + ', version = version + 1, updated_at = now() WHERE id = $1 AND version = $2 RETURNING version',
      [itemId, baseVersion, ...keys.map((k) => patch[k])],
    );
    // Было/стало — только изменившиеся поля; отсюда же потом «Отменить»
    const changes = Object.fromEntries(keys.filter((k) => before[COLUMNS[k]] !== patch[k]).map((k) => [COLUMNS[k], [before[COLUMNS[k]], patch[k]]]));
    await audit(tx, { staffId, action: 'menu.update', targetType: 'menu_item', targetId: itemId, changes, reason });
    return { ok: true, version: rows[0].version };
  });
}

// ═══ 3. АДМИНКА: ОТПРАВЛЯЕМ ТОЛЬКО ИЗМЕНЁННОЕ И НОМЕР РЕДАКЦИИ ═══
// const changed = diff(initialValues, formValues);   // { priceKopecks: 28000 }
// PATCH /admin/api/menu-items/latte-oat  { baseVersion: 7, patch: changed, reason: '…' }
// 409 → окно «Пока вы редактировали, Лена изменила цену: 260 → 280 ₽ (11:00). Оставить её цену? Перезаписать?»

// ═══ КАК НЕ НАДО ═══
// PUT /menu-items/latte-oat  { …вся форма целиком… }         // [!error] старая цена из чужого окна затрёт новую
// UPDATE menu_items SET price_kopecks = $2 WHERE id = $1    // [!error] без версии — последний молча побеждает
`;

  protected readonly dangerousActions = `
// ═══ 1. ЗАЯВКА ВМЕСТО ДЕЙСТВИЯ, ЕСЛИ СУММА БОЛЬШЕ ЛИМИТА ═══
// CREATE TABLE approvals (
//   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   action       text NOT NULL,               -- 'order.refund_payment'
//   payload      jsonb NOT NULL,              -- { "paymentId": "…", "amountKopecks": 600000 }
//   reason       text NOT NULL,
//   requested_by uuid NOT NULL REFERENCES staff (id),
//   decided_by   uuid REFERENCES staff (id),
//   status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'executed')),
//   created_at   timestamptz NOT NULL DEFAULT now(),
//   expires_at   timestamptz NOT NULL DEFAULT now() + interval '24 hours'
// );
import { db } from './db';
import { audit } from './audit';
import { can, refundLimit, type StaffContext } from './permissions';
import { refundPayment } from './payments';

class Forbidden extends Error {}
class ReauthRequired extends Error {} // админка попросит код второго фактора ещё раз
declare function verifiedRecently(staff: StaffContext, minutes: number): boolean;
declare function notifyOwner(text: string): Promise<void>;

export async function requestRefund(staff: StaffContext, paymentId: string, amountKopecks: number, reason: string) {
  if (!can(staff, 'refund.create')) throw new Forbidden();
  if (reason.trim().length < 5) return { ok: false, code: 'reason_required' } as const;

  if (amountKopecks <= refundLimit(staff)) {
    // Ступень 2: подтверждение уже было в интерфейсе — делаем сразу
    await db.tx(async (tx) => {
      await refundPayment(tx, paymentId, amountKopecks, { kind: 'staff', staffId: staff.id }, reason);
      await audit(tx, { staffId: staff.id, action: 'order.refund_payment', targetType: 'payment', targetId: paymentId, changes: { amountKopecks }, reason });
    });
    return { ok: true, status: 'done' } as const;
  }

  // Ступень 3: сверх лимита — повторный код и заявка второму человеку
  if (!verifiedRecently(staff, 5)) throw new ReauthRequired();
  const { rows } = await db.query<{ id: string }>(
    "INSERT INTO approvals (action, payload, reason, requested_by) VALUES ('order.refund_payment', $1, $2, $3) RETURNING id",
    [{ paymentId, amountKopecks }, reason, staff.id],
  );
  await notifyOwner('Лена просит вернуть ' + amountKopecks / 100 + ' ₽ — нужно ваше одобрение'); // имя — из профиля, тут для примера
  return { ok: true, status: 'pending_approval', approvalId: rows[0].id } as const;
}

// ═══ 2. ОДОБРЕНИЕ: ДРУГИМ ЧЕЛОВЕКОМ, ДО ИСТЕЧЕНИЯ, ОДИН РАЗ ═══
export async function approve(staff: StaffContext, approvalId: string) {
  if (!can(staff, 'refund.approve')) throw new Forbidden();
  if (!verifiedRecently(staff, 5)) throw new ReauthRequired();
  return db.tx(async (tx) => {
    const { rows } = await tx.query('SELECT * FROM approvals WHERE id = $1 FOR UPDATE', [approvalId]);
    const a = rows[0];
    if (!a || a.status !== 'pending') return { ok: false, code: 'not_pending' } as const;  // уже решено — второй клик ничего не сделает
    if (a.expires_at < new Date()) {
      await tx.query("UPDATE approvals SET status = 'expired' WHERE id = $1", [approvalId]);
      return { ok: false, code: 'expired' } as const;
    }
    if (a.requested_by === staff.id) return { ok: false, code: 'self_approval' } as const; // свою заявку — нельзя, даже владелице

    await refundPayment(tx, a.payload.paymentId, a.payload.amountKopecks, { kind: 'staff', staffId: a.requested_by }, a.reason);
    await tx.query("UPDATE approvals SET status = 'executed', decided_by = $2 WHERE id = $1", [approvalId, staff.id]);
    await audit(tx, {
      staffId: staff.id, action: 'approval.approve', targetType: 'approval', targetId: approvalId,
      changes: { requestedBy: a.requested_by, amountKopecks: a.payload.amountKopecks }, reason: a.reason,
    });
    return { ok: true } as const;
  });
}

// ═══ 3. ПОДТВЕРЖДЕНИЕ, КОТОРОЕ НЕЛЬЗЯ ПРОЛИСТАТЬ (в админке) ═══
// Ступень 2:  «Вернуть 410 ₽ гостье Кате К. за заказ № 12 на карту •• 4417?»  [Причина: ____] [Вернуть]
// Ступень 4:  «Уведомление получат 1 834 гостя. Введите 1834, чтобы подтвердить:» [____]
//             → «Рассылка начнётся в 16:10. [Отменить]»  — десять минут на «ой»

// ═══ КАК НЕ НАДО ═══
// if (confirm('Вы уверены?')) refund()          // [!error] через неделю нажимают не читая
// approve(…) без проверки requested_by          // [!error] сама попросила — сама одобрила
// одобрение без срока                           // [!error] забытая заявка выполнится через месяц
`;

  protected readonly bulkOperation = `
// ═══ 1. ПРОБНЫЙ ПРОГОН: ЧТО ИЗМЕНИТСЯ — БЕЗ СОХРАНЕНИЯ ═══
import { randomUUID } from 'node:crypto';
import { db, replica } from './db';
import { enqueue } from './jobs';
import { audit } from './audit';

type PriceBulk = { filter: { milk?: string; shopIds?: string[] }; deltaKopecks: number };

export async function previewPriceBulk(op: PriceBulk) {
  const { rows } = await replica.query<{ id: string; title: string; shop_id: string; price_kopecks: number }>(
    \`SELECT id, title, shop_id, price_kopecks FROM menu_items
      WHERE ($1::text IS NULL OR options_milk @> ARRAY[$1])
        AND ($2::text[] IS NULL OR shop_id = ANY($2))\`,
    [op.filter.milk ?? null, op.filter.shopIds ?? null],
  );
  return {
    count: rows.length,                                       // «Изменится 14 позиций»
    shops: new Set(rows.map((r) => r.shop_id)).size,          // «в трёх кофейнях»
    examples: rows.slice(0, 20).map((r) => ({ title: r.title, from: r.price_kopecks, to: r.price_kopecks + op.deltaKopecks })),
    tooExpensive: rows.filter((r) => r.price_kopecks + op.deltaKopecks > 500_000).length, // правила — уже здесь
  };
}

// ═══ 2. ЗАПУСК: ОПЕРАЦИЯ — СТРОКА В БАЗЕ, ВЫПОЛНЕНИЕ — ФОНОВАЯ ЗАДАЧА ═══
// CREATE TABLE bulk_operations (
//   id uuid PRIMARY KEY, kind text, params jsonb, reason text, started_by uuid,
//   total int, done int DEFAULT 0, failed int DEFAULT 0,
//   status text DEFAULT 'running',   -- running · stopped · finished · undone
//   created_at timestamptz DEFAULT now()
// );
// CREATE TABLE bulk_items (operation_id uuid, target_id text, state text DEFAULT 'pending', error text,
//                          PRIMARY KEY (operation_id, target_id));
export async function startPriceBulk(staffId: string, op: PriceBulk, confirmedCount: number, reason: string) {
  const preview = await previewPriceBulk(op);
  if (confirmedCount !== preview.count) return { ok: false, code: 'count_mismatch' } as const; // ввели не то число
  const id = randomUUID();
  await db.tx(async (tx) => {
    await tx.query(
      'INSERT INTO bulk_operations (id, kind, params, reason, started_by, total) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, 'menu.price_bulk', op, reason, staffId, preview.count],
    );
    await tx.query(
      \`INSERT INTO bulk_items (operation_id, target_id)
       SELECT $1, id FROM menu_items
        WHERE ($2::text IS NULL OR options_milk @> ARRAY[$2]) AND ($3::text[] IS NULL OR shop_id = ANY($3))\`,
      [id, op.filter.milk ?? null, op.filter.shopIds ?? null],
    ); // список целей фиксируется сейчас: позиция, добавленная через минуту, в операцию не попадёт
    await enqueue(tx, 'bulk.run', { operationId: id });
  });
  return { ok: true, operationId: id } as const;
}

// ═══ 3. ВОРКЕР: ПАЧКАМИ ПО 100, С ОСТАНОВКОЙ И ПРОДОЛЖЕНИЕМ ═══
declare function applyPriceDelta(tx: unknown, itemId: string, delta: number, batchId: string, staffId: string, reason: string): Promise<void>;

export async function runBulk(operationId: string): Promise<void> {
  for (;;) {
    const op = (await db.query('SELECT * FROM bulk_operations WHERE id = $1', [operationId])).rows[0];
    if (op.status !== 'running') return;                     // нажали «Стоп» — выходим после текущей пачки
    const batch = (await db.query<{ target_id: string }>(
      "SELECT target_id FROM bulk_items WHERE operation_id = $1 AND state = 'pending' LIMIT 100",
      [operationId],
    )).rows;
    if (batch.length === 0) {
      await db.query("UPDATE bulk_operations SET status = 'finished' WHERE id = $1", [operationId]);
      return;
    }
    for (const item of batch) {
      try {
        await db.tx(async (tx) => {
          // Тот же код, что при изменении по одному: проверки, версия, журнал с batch_id
          await applyPriceDelta(tx, item.target_id, op.params.deltaKopecks, operationId, op.started_by, op.reason);
          await tx.query("UPDATE bulk_items SET state = 'done' WHERE operation_id = $1 AND target_id = $2", [operationId, item.target_id]);
          await tx.query('UPDATE bulk_operations SET done = done + 1 WHERE id = $1', [operationId]);
        }); // объект и отметка «сделано» — одной транзакцией: после перезапуска его не тронут второй раз
      } catch (err) {
        await db.query("UPDATE bulk_items SET state = 'failed', error = $3 WHERE operation_id = $1 AND target_id = $2", [operationId, item.target_id, String(err)]);
        await db.query('UPDATE bulk_operations SET failed = failed + 1 WHERE id = $1', [operationId]);
      }
    }
  }
}
// «Отменить всё»: такая же операция в обратную сторону по строкам журнала с batch_id = operationId
// Рассылка — та же схема, плюс ограничение скорости сервиса уведомлений и «не с 21:00 до 9:00»

// ═══ КАК НЕ НАДО ═══
// UPDATE menu_items SET price_kopecks = price_kopecks + 2000 WHERE …  — по кнопке  // [!error] ни предпросмотра, ни отмены
// for (const g of allGuests) await sendPush(g)  — в обработчике запроса           // [!error] браузер висит, кому ушло — неизвестно
`;

  protected readonly impersonation = `
// ═══ 1. ВЫДАТЬ КЛЮЧ ПРОСМОТРА: ДВЕ ЛИЧНОСТИ, ТОЛЬКО ЧТЕНИЕ, 15 МИНУТ ═══
import { SignJWT, jwtVerify } from 'jose';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { audit } from './audit';
import { can, type StaffContext } from './permissions';

const KEY = new TextEncoder().encode(process.env['ACCESS_TOKEN_KEY'] ?? ''); // тот же ключ, что у обычных токенов гостя

class Forbidden extends Error {}

export async function startViewAs(staff: StaffContext & { name: string }, guestId: string, reason: string) {
  if (!can(staff, 'guest.view_as')) throw new Forbidden();             // отдельное разрешение
  if (reason.trim().length < 10) return { ok: false, code: 'reason_required' } as const;

  const token = await new SignJWT({
    act: { sub: staff.id, name: staff.name },  // «кто смотрит на самом деле» — так это поле называет стандарт RFC 8693
    scope: 'read',                             // только чтение
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(guestId)                       // «чьими глазами»
    .setIssuedAt()
    .setExpirationTime('15m')                  // и без продления
    .sign(KEY);

  await db.tx(async (tx) => {
    await audit(tx, { staffId: staff.id, action: 'guest.view_as_start', targetType: 'guest', targetId: guestId, reason });
    // Прозрачность: гость увидит в истории аккаунта «сотрудник поддержки просматривал ваши данные, 20.10, 10:02»
    await tx.query("INSERT INTO account_events (user_id, kind, details) VALUES ($1, 'support_viewed', $2)", [guestId, { reason }]);
  });
  return { ok: true, token, expiresInSec: 900 } as const;
}

// ═══ 2. КАЖДЫЙ ЗАПРОС API ПРОДУКТА: РЕЖИМ ПРОСМОТРА — ТОЛЬКО ЧТЕНИЕ ═══
const SAFE = new Set(['GET', 'HEAD']);
// Даже чтение бывает опасным: секрет QR-карты позволил бы потратить бонусы гостя на кассе
const DENY_EVEN_READ = ['/api/card-secret', '/api/account/export'];

export async function guestAuth(req: Request, res: Response, next: NextFunction) {
  const raw = (req.get('Authorization') ?? '').replace(/^Bearer /, '');
  try {
    const { payload } = await jwtVerify(raw, KEY);
    const act = payload['act'] as { sub: string; name: string } | undefined;
    if (act) {
      if (!SAFE.has(req.method) || DENY_EVEN_READ.some((p) => req.path.startsWith(p))) {
        res.status(403).json({ code: 'view_only' }); // оформить заказ, списать бонусы, удалить аккаунт — нет
        return;
      }
      res.set('X-View-As', act.name);                 // приложение рисует плашку «Вы смотрите как…»
    }
    (req as Request & { guestId: string; actor: string }).guestId = String(payload.sub);
    (req as Request & { guestId: string; actor: string }).actor = act ? 'staff:' + act.sub : 'guest';
    next();
  } catch {
    res.status(401).json({ code: 'unauthorized' });
  }
}

// ═══ КАК НЕ НАДО ═══
// const token = issueGuestToken(guestId)  — обычный ключ гостя сотруднику   // [!error] в журналах — «гость сам»
// if (isImpersonating) hideCheckoutButton()  — только в приложении          // [!error] запрос можно отправить и без кнопки
`;

  protected readonly reports = `
-- ═══ 1. ВЫРУЧКА ПО ДНЯМ: ДЕНЬГИ, А НЕ ЗАКАЗЫ; ДЕНЬ — ПО ВРЕМЕНИ КОФЕЙНИ ═══
-- Определение, написанное и на экране отчёта:
-- выручка = успешные оплаты − успешные возвраты, по дню операции в часовом поясе кофейни;
-- бонусы — скидка, в выручку не входят
WITH money AS (
  SELECT o.shop_id, p.paid_at AS at, p.amount_kopecks AS kopecks
    FROM payments p JOIN orders o ON o.id = p.order_id
   WHERE p.status = 'succeeded'
  UNION ALL
  SELECT o.shop_id, r.refunded_at, -r.amount_kopecks           -- возврат — минусом, в день возврата
    FROM refunds r JOIN payments p ON p.id = r.payment_id JOIN orders o ON o.id = p.order_id
   WHERE r.status = 'succeeded'
)
SELECT m.shop_id,
       (m.at AT TIME ZONE s.time_zone)::date AS day,              -- 'Asia/Yekaterinburg': полночь — местная
       sum(m.kopecks)                        AS revenue_kopecks
  FROM money m
  JOIN shops s ON s.id = m.shop_id
 WHERE m.at >= $1 AND m.at < $2
 GROUP BY m.shop_id, day
 ORDER BY day, m.shop_id;

-- ═══ 2. ИТОГИ ДНЯ — ЗАРАНЕЕ, РАЗ В НОЧЬ ═══
CREATE TABLE daily_sales (
  shop_id           text NOT NULL,
  day               date NOT NULL,
  revenue_kopecks   bigint NOT NULL,
  orders            integer NOT NULL,
  app_orders        integer NOT NULL,    -- сколько из них — через приложение и сайт
  points_spent      integer NOT NULL,    -- бонусами «оплачено» — как скидка
  computed_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (shop_id, day)
);
-- В 03:00 по времени кофейни пересчитываем ВЧЕРА И ПОЗАВЧЕРА:
-- поздний вебхук или вчерашний возврат должны попасть в итоги, а не потеряться
INSERT INTO daily_sales (shop_id, day, revenue_kopecks, orders, app_orders, points_spent)
SELECT …                                                         -- тот же расчёт, что выше, по двум дням
ON CONFLICT (shop_id, day) DO UPDATE
   SET revenue_kopecks = EXCLUDED.revenue_kopecks,
       orders          = EXCLUDED.orders,
       app_orders      = EXCLUDED.app_orders,
       points_spent    = EXCLUDED.points_spent,
       computed_at     = now();

-- Утренний экран владелицы: сотни строк вместо сотен тысяч
SELECT day, shop_id, revenue_kopecks, orders,
       round(revenue_kopecks::numeric / nullif(orders, 0)) AS avg_check_kopecks
  FROM daily_sales
 WHERE day >= current_date - 30
 ORDER BY day DESC, shop_id;

-- ═══ 3. ЧТО ПРОДАЁТСЯ ЛУЧШЕ — С РЕПЛИКИ ═══
SELECT oi.title,
       sum(oi.quantity)                   AS sold,
       sum(oi.quantity * oi.unit_kopecks) AS gross_kopecks
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
 WHERE o.status = 'picked_up'
   AND o.shop_id = $1 AND o.business_date BETWEEN $2 AND $3
 GROUP BY oi.title
 ORDER BY sold DESC
 LIMIT 20;

-- ═══ 4. ВЫГРУЗКА БУХГАЛТЕРУ — БЕЗ ЛЮДЕЙ ═══
-- дата, кофейня, номер заказа, сумма, способ оплаты, номер платежа, возврат —
-- но не имя, не телефон и не почта гостя: для учёта они не нужны

-- ═══ КАК НЕ НАДО ═══
-- SELECT sum(total_kopecks) FROM orders WHERE status = 'picked_up'   -- [!error] не деньги: бонусы внутри, возвратов нет
-- GROUP BY created_at::date                                          -- [!error] день по Гринвичу, вечер уехал в завтра
-- отчёт за год на основной базе в 08:30                              -- [!error] гости ждут, пока Ольга смотрит график
`;

  protected readonly productSettings = `
// ═══ 1. НАСТРОЙКИ — В БАЗЕ, С ПРОВЕРКОЙ ПО СМЫСЛУ ═══
import { z } from 'zod';
import { db } from './db';
import { audit } from './audit';
import { compareVersions } from '@penka/shared';

const semver = z.string().regex(/^\\d+\\.\\d+\\.\\d+$/, 'Формат версии: 1.4.0');

export const Settings = z.object({
  minSupported: z.object({ ios: semver, android: semver }), // магазины пропускают версии в разные дни
  features: z.record(z.string(), z.boolean()),              // { payWithPoints: true, delivery: false }
  pointsRatePercent: z.number().min(0).max(20),             // 5 — сколько процентов возвращается бонусами
  maxPointsSharePercent: z.number().min(0).max(50),         // 30 — какую часть заказа можно оплатить бонусами
  defaultSlotCapacity: z.number().int().min(1).max(40),
  promoQuietHours: z.object({ from: z.string(), to: z.string() }), // '21:00' — '09:00'
});
// Здесь нет и не будет ключей и паролей: у секретов своё хранилище

// CREATE TABLE settings_history (
//   id bigserial PRIMARY KEY, key text, old_value jsonb, new_value jsonb,
//   changed_by uuid, reason text, apply_at timestamptz, applied_at timestamptz
// );

// ═══ 2. ПОСЛЕДСТВИЯ ДО НАЖАТИЯ: КОГО ЗАДЕНЕТ НОВАЯ МИНИМАЛЬНАЯ ВЕРСИЯ ═══
declare function publishedVersion(platform: 'ios' | 'android'): Promise<string>; // что сейчас доступно в магазине

export async function previewMinSupported(platform: 'ios' | 'android', version: string) {
  const published = await publishedVersion(platform);
  if (compareVersions(version, published) > 0) {
    // В магазине ещё 1.4 — экран «Обновите» увидели бы все, а обновиться было бы не на что
    return { ok: false, code: 'not_published_yet', published } as const;
  }
  const { rows } = await db.query<{ affected: number; total: number }>(
    \`SELECT count(DISTINCT user_id) FILTER (
              WHERE string_to_array(app_version, '.')::int[] < string_to_array($2, '.')::int[]) AS affected,
            count(DISTINCT user_id) AS total
       FROM app_sessions
      WHERE platform = $1 AND last_seen_at > now() - interval '30 days'\`,
    [platform, version],
  ); // массивы чисел сравниваются по частям: {1,10,0} > {1,9,3} — как и положено версиям
  const { affected, total } = rows[0];
  return { ok: true, affected, percent: total ? Math.round((affected / total) * 100) : 0 } as const;
  // В админке: «Версии ниже 1.2.0 на iOS у 112 гостей (6 %) — они увидят экран „Обновите приложение“»
}

// ═══ 3. ИЗМЕНЕНИЕ: СЕЙЧАС ИЛИ ПО РАСПИСАНИЮ, С ИСТОРИЕЙ И ВОЗВРАТОМ ═══
export async function changeSetting(staffId: string, key: keyof z.infer<typeof Settings>, value: unknown, reason: string, applyAt: Date | null) {
  const parsed = Settings.shape[key].safeParse(value);
  if (!parsed.success) return { ok: false, code: 'invalid', message: parsed.error.issues[0]?.message } as const;
  await db.tx(async (tx) => {
    const old = (await tx.query('SELECT value FROM settings WHERE key = $1 FOR UPDATE', [key])).rows[0]?.value ?? null;
    const h = await tx.query<{ id: number }>(
      'INSERT INTO settings_history (key, old_value, new_value, changed_by, reason, apply_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [key, old, parsed.data, staffId, reason, applyAt],
    );
    if (!applyAt) {
      await tx.query('UPDATE settings SET value = $2, updated_at = now() WHERE key = $1', [key, parsed.data]);
      await tx.query('UPDATE settings_history SET applied_at = now() WHERE id = $1', [h.rows[0].id]);
    } // запланированное применит задача в назначенное время — и тоже отметит applied_at
    await audit(tx, { staffId, action: 'setting.change', targetType: 'setting', targetId: key, changes: { [key]: [old, parsed.data] }, reason });
  });
  return { ok: true } as const;
}
// «Вернуть как было» — changeSetting с old_value из нужной строки settings_history

// ═══ КАК НЕ НАДО ═══
// MIN_SUPPORTED=1.5.0 в переменных окружения + перезапуск   // [!error] без проверки, без истории, без отката
// settings.yookassaSecretKey                                // [!error] секрет в таблице, которую видит админка
`;

  protected readonly adminSecurity = `
// ═══ 1. ЗАГОЛОВКИ: СЦЕНАРИИ ТОЛЬКО СВОИ, ВСТРАИВАНИЕ ЗАПРЕЩЕНО ═══
import type { Request, Response, NextFunction } from 'express';

export function adminSecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",          // всё — только с admin.penka.example
      "script-src 'self'",           // сценарии — только свои файлы, никаких встроенных и чужих
      "img-src 'self' https://img.penka.example",
      "frame-ancestors 'none'",      // админку нельзя показать внутри чужой страницы
      "form-action 'self'",
    ].join('; '),
  );
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'no-referrer');        // адреса карточек не утекают на внешние сайты
  res.set('X-Robots-Tag', 'noindex, nofollow');     // поисковикам здесь нечего делать
  next();
}

// ═══ 2. ИЗМЕНЯЮЩИЕ ЗАПРОСЫ — ТОЛЬКО СО СТРАНИЦЫ АДМИНКИ ═══
const ADMIN_ORIGIN = 'https://admin.penka.example';

export function requireSameOrigin(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD') return next();
  if (req.get('Origin') !== ADMIN_ORIGIN) {
    res.status(403).json({ code: 'bad_origin' }); // запрос пришёл с чужой страницы — не выполняем
    return;
  }
  next();
}
// Плюс cookie сессии с SameSite=Strict — две независимые защиты от подделки запроса (CSRF)

// ═══ 3. ДАННЫЕ ГОСТЕЙ — ТОЛЬКО ТЕКСТОМ ═══
// Angular и React экранируют сами:   <td>{{ guest.name }}</td>   — безопасно
// Опасно — вставка HTML в обход:     [innerHTML]="guest.name"  ·  dangerouslySetInnerHTML  ·  el.innerHTML = …
// Если нужен перенос строк в комментарии к заказу — CSS white-space: pre-line, а не замена \\n на <br>

// ═══ 4. ВЫГРУЗКИ БЕЗ ФОРМУЛ (CSV-инъекция) ═══
const FORMULA_START = /^[=+\\-@\\t\\r]/;

export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (FORMULA_START.test(s)) s = "'" + s;              // '=HYPERLINK(…) — редактор покажет как текст
  return '"' + s.replace(/"/g, '""') + '"';            // кавычки внутри — удваиваем, всё значение — в кавычках
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map(csvCell).join(';');
  const lines = rows.map((r) => columns.map((c) => csvCell(r[c])).join(';'));
  return '\\uFEFF' + [header, ...lines].join('\\r\\n');  // BOM — чтобы табличный редактор понял кириллицу
}
// Отрицательные суммы в выгрузке — числами в своей колонке, а не строкой «-410»: строка получит апостроф

// ═══ КАК НЕ НАДО ═══
// <div [innerHTML]="order.comment"></div>                 // [!error] «мина» гостя сработает у управляющей
// app.post('/admin/api/refund', handler)  без проверки Origin  // [!error] чужая страница вернёт деньги за вас
// rows.map((r) => r.name).join(';')  — выгрузка «как есть»  // [!error] =HYPERLINK(…) в файле бухгалтера
`;

  protected readonly dataFix = `
// ═══ СЦЕНАРИЙ ПРАВКИ ДАННЫХ: ПРОВЕРКА, ПРОБНЫЙ ПРОГОН, ТРАНЗАКЦИЯ, ЖУРНАЛ ═══
// scripts/2026-10-20-move-points.ts — лежит в репозитории, прошёл проверку вторым разработчиком
// Пробный прогон:   npx tsx scripts/2026-10-20-move-points.ts --from=… --to=… --ticket=SUP-214
// Настоящий запуск: то же самое + --apply
import { parseArgs } from 'node:util';
import { db } from '../src/db';

const { values } = parseArgs({
  options: {
    from: { type: 'string' },       // id старого аккаунта гостя
    to: { type: 'string' },         // id нового
    ticket: { type: 'string' },     // номер обращения: «зачем» — обязательно
    staff: { type: 'string' },      // кто запускает — попадёт в журнал
    apply: { type: 'boolean', default: false },
  },
});
const { from, to, ticket, staff, apply } = values;
if (!from || !to || !ticket || !staff) throw new Error('Нужны --from, --to, --ticket и --staff');

await db.tx(async (tx) => {
  // Повторный запуск безвреден: если перенос уже был — выходим
  const done = await tx.query(
    "SELECT 1 FROM loyalty_entries WHERE user_id = $1 AND kind = 'manual' AND comment = $2",
    [to, 'перенос с ' + from + ' по ' + ticket],
  );
  if (done.rowCount) {
    console.log('Уже перенесено ранее — ничего не делаю');
    return;
  }
  const { rows } = await tx.query<{ points: number }>('SELECT points FROM users WHERE id = $1 FOR UPDATE', [from]);
  const points = rows[0]?.points ?? 0;
  console.log((apply ? 'ПЕРЕНОШУ' : 'ПРОБНЫЙ ПРОГОН: перенёс бы') + ' ' + points + ' бонусов с ' + from + ' на ' + to);
  if (!apply || points === 0) return; // без --apply транзакция просто закончится без изменений

  // Через журнал бонусов, как и всё остальное: минус у старого, плюс у нового
  await tx.query("INSERT INTO loyalty_entries (user_id, delta, kind, actor, comment) VALUES ($1, $2, 'manual', $3, $4)",
    [from, -points, 'staff:' + staff, 'перенос на ' + to + ' по ' + ticket]);
  await tx.query("INSERT INTO loyalty_entries (user_id, delta, kind, actor, comment) VALUES ($1, $2, 'manual', $3, $4)",
    [to, points, 'staff:' + staff, 'перенос с ' + from + ' по ' + ticket]);
  await tx.query('UPDATE users SET points = points - $2 WHERE id = $1', [from, points]);
  await tx.query('UPDATE users SET points = points + $2 WHERE id = $1', [to, points]);
  await tx.query(
    "INSERT INTO audit_log (staff_id, action, target_type, target_id, changes, reason) VALUES ($1, 'script.run', 'script', $2, $3, $4)",
    [staff, '2026-10-20-move-points', { from, to, points }, ticket],
  );
  console.log('Готово. Изменено: 4 строки бонусов, 2 баланса');
}); // одна транзакция: ошибка на любом шаге — не изменится ничего

// ═══ КАК НЕ НАДО ═══
// psql prod -c "UPDATE users SET points = points + 340 WHERE phone = '+7999…'"   // [!error] ни проверки, ни журнала, ни отмены
// сценарий без пробного прогона и без флага --apply                             // [!error] первый же запуск — по-настоящему
`;

  protected readonly adminUx = `
═══ УДОБСТВО АДМИНКИ: ЧЕК-ЛИСТ ПОСЛЕ ЧАСА РЯДОМ С УПРАВЛЯЮЩЕЙ ═══

ПОИСК И ПЕРЕХОДЫ
  [ ] Строка поиска всегда наверху, клавиша «/» ставит в неё курсор
  [ ] Номер заказа принимается в любом виде: «№31», «31», «#31», «Заказ 31»
  [ ] Телефон — в любом виде: «8 999 123-45-67», «+7(999)1234567»
  [ ] Всё кликабельно: номер заказа → заказ, гость → карточка, платёж → платёж
  [ ] Адреса карточек постоянные: их можно отправить коллеге и открыть через месяц

ТАБЛИЦЫ
  [ ] Видны 30–40 строк без прокрутки; статус — словом и цветом
  [ ] Фильтры и сортировка — в адресе страницы
  [ ] Время — по часовому поясу кофейни, деньги — «410,00 ₽»
  [ ] Кнопка «скопировать» у номеров заказов и платежей

ДЕЙСТВИЯ
  [ ] Частые действия — прямо из карточки, с уже подставленным гостем и заказом
  [ ] Опасные кнопки — красные, отдельно от безопасных, не в одном ряду с «Сохранить»
  [ ] После действия — понятное подтверждение: «Возврат 410 ₽ отправлен, придёт за 1–5 дней»
  [ ] Долгие действия — с прогрессом, а не с замершей страницей

ОШИБКИ
  version_mismatch  → «Пока вы редактировали, Лена изменила цену. Посмотреть изменения?»
  forbidden         → «Возврат больше 3 000 ₽ делает владелица. Отправить ей запрос?»
  reauth_required   → «Подтвердите действие кодом из приложения»
  network           → «Нет связи с сервером. Ваши изменения не сохранены — попробуйте ещё раз»

ГДЕ И КАК РАБОТАЮТ
  [ ] Управляющая — ноутбук в зале: телефоны гостей замаскированы
  [ ] Владелица — телефон по дороге: отчёты нормально выглядят на маленьком экране
  [ ] Старший бариста — планшет на стойке: стоп-лист крупными кнопками
`;

  protected readonly permissionTests = `
// ═══ ТАБЛИЦА ПРАВ — ПРЯМО В ТЕСТЕ (Vitest + Supertest, тестовый стенд) ═══
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { adminRoutes } from '../src/admin/routes';          // список всех адресов API админки
import { loginAs, createOrderWithPayment } from './helpers'; // создают сотрудника и данные на тестовом стенде

type Role = 'owner' | 'manager' | 'shift_lead' | 'accountant' | 'developer';
type Verdict = 'allow' | 'deny';
const row = (owner: Verdict, manager: Verdict, shift_lead: Verdict, accountant: Verdict, developer: Verdict) =>
  ({ owner, manager, shift_lead, accountant, developer }) as Record<Role, Verdict>;

//                                                         владелица  управляющая  старший  бухгалтер  разработчик
const MATRIX: Record<string, Record<Role, Verdict>> = {
  'GET /admin/api/guests/search':                     row('allow', 'allow', 'deny',  'deny',  'deny'),
  'POST /admin/api/guests/:id/reveal-phone':          row('allow', 'allow', 'deny',  'deny',  'deny'),
  'POST /admin/api/payments/:id/refund':              row('allow', 'allow', 'deny',  'deny',  'deny'),
  'POST /admin/api/approvals/:id/approve':            row('allow', 'deny',  'deny',  'deny',  'deny'),
  'PUT /admin/api/shops/:shopId/stop-list':           row('allow', 'allow', 'allow', 'deny',  'deny'),
  'GET /admin/api/reports/revenue':                   row('allow', 'allow', 'deny',  'allow', 'deny'),
  'PUT /admin/api/settings/:key':                     row('deny',  'deny',  'deny',  'deny',  'allow'),
};

const ORIGIN = 'https://admin.penka.example';
const fill = (path: string) => path.replace(':shopId', 'sadovaya').replace(/:\\w+/g, '00000000-0000-4000-8000-000000000001');

function send(method: string, path: string, cookie: string) {
  const agent = request(app);
  const req = method === 'GET' ? agent.get(path) : method === 'PUT' ? agent.put(path) : agent.post(path);
  return req.set('Cookie', cookie).set('Origin', ORIGIN).send({ reason: 'тестовая причина' });
}

describe('у каждого адреса админки есть решение «кому можно»', () => {
  it('новый адрес без строки в таблице роняет тест', () => {
    const missing = adminRoutes().filter((r) => !(r in MATRIX));
    expect(missing).toEqual([]); // забыли решить — по умолчанию было бы «запрещено», но решить надо явно
  });
});

for (const [route, byRole] of Object.entries(MATRIX)) {
  const [method, path] = route.split(' ');
  describe(route, () => {
    for (const role of Object.keys(byRole) as Role[]) {
      it(role + ' → ' + byRole[role], async () => {
        const cookie = await loginAs(role, { shopIds: ['sadovaya'] });
        const res = await send(method, fill(path), cookie);
        if (byRole[role] === 'deny') expect(res.status).toBe(403);
        else expect(res.status).not.toBe(403); // 404 на выдуманный id — тоже «не запрещено»
      });
    }
  });
}

// ═══ МЕСТО, СУММА И ОПАСНЫЕ СЦЕНАРИИ ═══
describe('ограничения по месту и сумме', () => {
  it('старший бариста с Садовой не меняет стоп-лист на Ленина', async () => {
    const cookie = await loginAs('shift_lead', { shopIds: ['sadovaya'] });
    const res = await request(app).put('/admin/api/shops/lenina/stop-list').set('Cookie', cookie).set('Origin', ORIGIN).send({ items: ['croissant'] });
    expect(res.status).toBe(403);
  });

  it('возврат 3 000 ₽ — сразу, 3 001 ₽ — заявка владелице', async () => {
    const cookie = await loginAs('manager', { shopIds: 'all' });
    const small = await createOrderWithPayment(300_000);
    const big = await createOrderWithPayment(300_100);
    const r1 = await request(app).post('/admin/api/payments/' + small.paymentId + '/refund').set('Cookie', cookie).set('Origin', ORIGIN)
      .send({ amountKopecks: 300_000, reason: 'тест лимита' });
    const r2 = await request(app).post('/admin/api/payments/' + big.paymentId + '/refund').set('Cookie', cookie).set('Origin', ORIGIN)
      .send({ amountKopecks: 300_100, reason: 'тест лимита' });
    expect(r1.body.status).toBe('done');
    expect(r2.body.status).toBe('pending_approval');
  });
});

describe('одобрение', () => {
  it('свою заявку одобрить нельзя — даже владелице', async () => {
    // владелица создаёт заявку и пытается одобрить её сама → { code: 'self_approval' }, денег не ушло
  });
  it('второй клик «Одобрить» не делает второго возврата', async () => {
    // два одновременных approve → один 'ok', второй 'not_pending'; в платёжный сервис ушёл один возврат
  });
  it('заявка старше суток не выполняется', async () => {
    // время на тестовом стенде сдвигается вперёд → { code: 'expired' }
  });
});

// ═══ КАК НЕ НАДО ═══
// все тесты — под ролью «владелица»          // [!error] у неё есть всё, «нельзя» не проверено ни разу
// expect(res.status).toBe(200)  — только «можно»   // [!error] бухгалтер с правом на возврат тест пройдёт
`;

  protected readonly adminPrivacy = `
═══ ЧТО ИЗ ЗАКОНА О ПЕРСОНАЛЬНЫХ ДАННЫХ СТАНОВИТСЯ ФУНКЦИЕЙ АДМИНКИ ═══
В общем виде, на октябрь 2026 года; применимость к вашей компании — с юристом

  Требование                                   Где это в админке «Пенки»
  ───────────────────────────────────────────  ─────────────────────────────────────────────
  Правила доступа к персональным данным        роли и права; бухгалтер и разработчик —
                                                 без телефонов и имён
  Регистрация и учёт действий с ними           журнал действий, включая «посмотрела телефон»
  Ответственный за организацию обработки        Ольга; раз в квартал — пересмотр доступа
  Сотрудники ознакомлены с правилами            подпись под положением — до выдачи доступа
  Обработка по поручению                        договор со студией: что делает, как защищает
  Данные граждан России — в России              база, реплики, копии, админка — в российском облаке;
                                                 облачный конструктор за границей —
                                                 трансграничная передача, уведомление РКН
  Утечка — уведомление Роскомнадзора            журнал показывает, кто и что видел;
                                                 план «что делать» написан заранее
  Отзыв согласия, удаление по просьбе           удаление аккаунта гостем в приложении;
                                                 в журнале — ссылки, а не телефоны

═══ ТРИ ПРАВИЛА ДЛЯ ЭКРАНОВ ═══

  1. Показывать персональные данные только тем, кому они нужны для работы
  2. По умолчанию — маскировать; целиком — по кнопке и с записью в журнал
  3. Не давать выгружать списки гостей с контактами — выгрузки бухгалтеру без людей
`;

  protected readonly adminStack = `
═══ СТЕК АДМИНКИ «ПЕНКИ» ═══

  Часть               Выбор                                         Почему
  ──────────────────  ────────────────────────────────────────────  ─────────────────────────────────
  Веб-приложение      каркас админок (таблицы, формы, фильтры)       готовые таблицы, свои действия
                      в общем репозитории: apps/admin
  Адрес               admin.penka.example                           свои cookie и заголовки
  API                 /admin/api/* в том же бэкенде                  общий код и правила продукта
  Типы и проверки     packages/shared (zod)                          одно правило — одно место
  Вход                почта + пароль (argon2) + TOTP                 без SMS, без общих учёток
  Сессии              таблица staff_sessions, 8 ч / 30 мин           уволенного не пустит ни одна
  Права               таблица ролей в коде + проверка на сервере     по умолчанию запрещено
  Журнал              audit_log в PostgreSQL, только INSERT          права в базе + правило
  Отчёты              реплика + daily_sales                          час пик гостей не страдает
  Массовые операции   очередь фоновых задач продукта                 прогресс, «Стоп», продолжение
  Правки данных       сценарии в репозитории, пробный прогон         проверка вторым человеком
  Тестовый стенд      выдуманные данные                              ни одного настоящего телефона

═══ ПЕРВАЯ ВЕРСИЯ — ДВЕ НЕДЕЛИ ═══

  вход со вторым фактором · роли · журнал · поиск и карточка гостя ·
  возврат и бонусы с лимитами · меню и стоп-листы · выручка по дням

═══ ПОТОМ ═══

  через месяц   одобрение крупных возвратов · массовые цены · рассылки · настройки
  через полгода просмотр глазами гостя
  никогда       кнопки для дел раз в полгода — для них сценарии

═══ НЕ БРАТЬ ═══

  Конструктор с прямым доступом к боевой базе      правила продукта в нём не работают
  Общую учётную запись «admin»                     в журнале не будет людей
  Копию боевой базы на тестовый стенд              телефоны гостей там, где их не охраняют
`;

  protected readonly adminLaunch = `
═══ ПЕРЕД ЗАПУСКОМ АДМИНКИ «ПЕНКИ» ═══

ВХОД И ПРАВА
  [ ] У каждого сотрудника — своя учётная запись; общих нет
  [ ] Второй фактор включён у всех; без него войти нельзя
  [ ] Сессия 8 часов, бездействие 30 минут; опасное — с повторным кодом
  [ ] Роли выданы по таблице; старшие бариста — только своя кофейня
  [ ] Тест «таблица прав» проходит; новых адресов без строки в таблице нет

ДЕЙСТВИЯ
  [ ] Все действия вызывают API бэкенда; прямого доступа к базе у админки нет
  [ ] Возврат и бонусы — с причиной и лимитом; сверх лимита — заявка владелице
  [ ] Массовые операции — пробный прогон, ввод числа, фон, «Стоп», отмена целиком
  [ ] У записей меню и настроек — номер редакции

ЖУРНАЛ И ДАННЫЕ
  [ ] Журнал пишется в той же транзакции; UPDATE и DELETE на нём запрещены в базе
  [ ] Телефоны замаскированы; «Показать номер» пишет в журнал
  [ ] Поиск только по точным признакам, с ограничением частоты
  [ ] Выгрузки — без людей и без формул

БЕЗОПАСНОСТЬ
  [ ] Отдельный адрес, CSP с frame-ancestors 'none', проверка Origin
  [ ] Данные гостей нигде не вставляются как HTML
  [ ] Тестовый стенд — на выдуманных данных

В ДЕНЬ ЗАПУСКА
  [ ] Закрыт прямой доступ к боевой базе для «мелких правок»
  [ ] Возвраты — только через админку, не через кабинет платёжного сервиса
  [ ] Встреча с командой на полчаса: где что, зачем второй код и причина
  [ ] Сотрудники подписали положение об обработке персональных данных

ЧЕРЕЗ НЕДЕЛЮ
  [ ] Сводка журнала: кто что делал, сколько отказов «нельзя» и почему
  [ ] Час рядом с управляющей: где она спотыкается
`;
}
