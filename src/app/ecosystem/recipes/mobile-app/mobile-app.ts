import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-recipes-mobile-app',
  imports: [CodeBlock, RouterLink],
  templateUrl: './mobile-app.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemRecipesMobileApp {

  protected readonly appVsSite = `
═══ ОДНА И ТА ЖЕ ОШИБКА: «СКИДКА 10% СЧИТАЕТСЯ ДВАЖДЫ» ═══

  НА САЙТЕ
    09:00  ошибку заметили
    09:20  исправили, выложили
    09:21  у всех гостей правильная цена — история закончилась

  В ПРИЛОЖЕНИИ, ЕСЛИ ЦЕНУ СЧИТАЕТ ПРИЛОЖЕНИЕ
    09:00  ошибку заметили
    10:00  исправили, собрали версию 1.1, отправили в магазины
    день 2 Google Play и RuStore пропустили; день 3 — App Store
    день 10 на 1.1 обновилось 60% гостей, остальные платят неправильную цену
    день 40 на 1.0 всё ещё 12% — у них выключено автообновление

  В ПРИЛОЖЕНИИ, ЕСЛИ ЦЕНУ СЧИТАЕТ СЕРВЕР
    09:00  ошибку заметили
    09:20  исправили на сервере
    09:21  у всех гостей, на любой версии, правильная цена

═══ ЧТО ИЗ ЭТОГО СЛЕДУЕТ ДЛЯ БЭКЕНДА ═══

  1. Цены, скидки, бонусы, доступность товара — считает сервер, приложение только показывает
  2. API меняется только так, чтобы старые версии продолжали работать
  3. Сервер знает версию каждого приложения и может сказать «обновитесь»
  4. Любой запрос может прийти дважды — оплата и заказ не должны задвоиться
  5. Push-токены телефонов хранятся на сервере, уведомления рассылает сервер
  6. Картинки и меню отдаются так, чтобы грузиться быстро даже по плохой связи
  7. Секретные ключи платёжного сервиса и SMS — только на сервере
`;

  protected readonly needAnApp = `
═══ ПЯТЬ ВОПРОСОВ ПЕРЕД ТЕМ, КАК ЗАКАЗЫВАТЬ ПРИЛОЖЕНИЕ ═══

  1. Как часто человек к вам приходит?
       раз в год (ремонт, нотариус)          → сайт
       раз в месяц (парикмахер, химчистка)    → сайт или мини-приложение
       несколько раз в неделю (кофе, обеды)   → приложение может окупиться

  2. Что приложение даст человеку каждый раз?
       «пять минут без очереди», «бонусы всегда с собой», «уведомление, что готово»
       нет ответа → не будет и установок

  3. Нужны ли уведомления, ради которых человек даст разрешение?
       «заказ готов», «курьер у двери» — да; «у нас акция» — разрешение не дадут

  4. Есть ли кому поддерживать приложение после выпуска?
       новые версии iOS и Android каждый год, требования магазинов, отзывы, падения
       нет — берите готовую платформу

  5. Проверили ли вы спрос дешёвым способом?
       страница заказа на сайте + QR-код на кассе — месяц работы, цифры вместо догадок

═══ ПРОВЕРКА «ПЕНКИ»: СТРАНИЦА ЗАКАЗА НА САЙТЕ, ЯНВАРЬ 2026 ═══

  Гостей за месяц, три кофейни         ≈ 18 000 чеков
  Заказали заранее через сайт         ≈ 2 600 (каждый седьмой)
  Из них — больше 4 раз за месяц      ≈ 340 человек
  Просьб «сделайте приложение»        ≈ 60 в отзывах и у кассы

  Решение: приложение — для постоянных гостей; сайт с заказом остаётся для всех остальных
  (цифры условные, но порядок величин типичный)
`;

  protected readonly techChoice = `
═══ ОДИН РЕПОЗИТОРИЙ — ТРИ КЛИЕНТА И СЕРВЕР ═══

  penka/
  ├─ apps/
  │  ├─ mobile/            приложение для гостей (React Native + Expo)
  │  │  ├─ app/            экраны: меню, корзина, заказ, бонусы, профиль
  │  │  ├─ src/api/        клиент API: таймауты, повторы, токены
  │  │  └─ app.config.ts   имя, иконка, идентификаторы, тексты разрешений
  │  ├─ api/               бэкенд (Node.js + TypeScript)
  │  ├─ web/               сайт с заказом заранее — тот, с которого всё началось
  │  └─ barista/           веб-экран для планшета на стойке
  └─ packages/
     └─ shared/            общие типы и проверки: MenuItem, Order, OrderStatus

═══ ЗАЧЕМ ОБЩИЙ ПАКЕТ ═══

  packages/shared/order.ts
    export type OrderStatus = 'awaiting_payment' | 'paid' | 'accepted' | 'preparing'
                            | 'ready' | 'picked_up' | 'cancelled' | 'unclaimed';

  Сервер     — проверяет переходы между статусами по этому типу
  Приложение — показывает «Готовится» и «Готово» по этому типу
  Планшет    — рисует кнопки «Принять» и «Готово» по этому типу

  Добавили новый статус — TypeScript подсветит каждое место во всех трёх клиентах,
  где его забыли обработать. Но в приложениях, которые уже стоят у людей,
  нового статуса нет — поэтому старые версии должны уметь показать незнакомый статус
  (об этом — в разделе про версии API)
`;

  protected readonly orderJourney = `
═══ ОДИН ЗАКАЗ КАТИ: КТО ЧТО ДЕЛАЕТ, ПО СЕКУНДАМ ═══

08:20:00  Приложение  открылось: меню показано сразу из копии на телефоне,
                      свежее меню и «закончилось» тихо подгружаются с бэкенда
08:20:02  CDN         отдаёт фото капучино и сырника нужного для экрана размера
08:21:10  Приложение  «Оформить»: отправляет состав, кофейню, время и ключ повтора
08:21:10  Бэкенд      пересчитывает цены сам, проверяет «закончилось» и часы работы,
                      бронирует место в очереди на 8:40, создаёт заказ «ожидает оплаты»
08:21:11  Бэкенд      → платёжный сервис: «платёж на 410 ₽ за заказ № 47»
08:21:11  Приложение  показывает платёжную форму (карта или СБП)
08:21:25  Платёжный   деньги списаны → вебхук бэкенду: «платёж оплачен»
          сервис
08:21:25  Бэкенд      заказ → «оплачен»; электронный чек; событие на планшет кофейни
08:21:26  Приложение  узнаёт статус у бэкенда (не по экрану «успех» платёжной формы!)
08:21:40  Планшет     бариста Дима нажимает «Принять»
08:22:00  Телефон     метро — связи нет; приложение показывает последнее известное:
                      «Заказ № 47 принят, будет готов к 8:40»
08:36:00  Планшет     Дима нажимает «Готово»
08:36:01  Бэкенд      → APNs: «Заказ № 47 готов, полка у окна»
08:36:02  Телефон     уведомление на экране блокировки
08:39:00  Планшет     Катя забрала стакан → «выдан»
08:39:01  Бэкенд      начисляет 20 бонусов — только теперь, когда заказ выдан
`;

  protected readonly apiVersioning = `
// ═══ 1. СЕРВЕР: КАЖДЫЙ ЗАПРОС ГОВОРИТ, КТО ОН ═══
import express from 'express';

const app = express();

type Client = { platform: 'ios' | 'android' | 'web'; version: string };

declare global {
  namespace Express {
    interface Request { client: Client }
  }
}

const CONFIG = {
  minSupported: '1.2.0',  // ниже — экран «Обновите приложение»; поднимаем, когда старых почти не осталось
  latest: '1.4.0',        // ниже — мягкая плашка «Доступно обновление»
  features: {
    payWithPoints: true,  // сломалось в новой версии? false — и функция выключена у всех за минуту
    delivery: false,      // включим, когда курьеры будут готовы
  },
};

// '1.10.0' > '1.9.3' — сравниваем по частям, а не как строки ('1.10' < '1.9' в алфавите!)
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return Math.sign(diff);
  }
  return 0;
}

app.use((req, res, next) => {
  const platform = req.get('X-Platform');
  const version = req.get('X-App-Version') ?? '0.0.0';
  req.client = { platform: platform === 'ios' || platform === 'android' ? platform : 'web', version };
  // Даже если приложение не спросило настройки — сервер сам не пустит слишком старую версию
  if (req.client.platform !== 'web' && compareVersions(version, CONFIG.minSupported) < 0 && req.path !== '/api/config') {
    res.status(426).json({ code: 'app_update_required' }); // 426 Upgrade Required
    return;
  }
  next();
});

// Первый запрос приложения при каждом запуске
app.get('/api/config', (req, res) => {
  res.json({ ...CONFIG, storeUrl: req.client.platform === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL });
});
declare const IOS_STORE_URL: string;
declare const ANDROID_STORE_URL: string;

// ═══ 2. ОТВЕТ, КОТОРЫЙ ПЕРЕЖИВЁТ ЛЮБУЮ ВЕРСИЮ ═══
app.get('/api/orders/:id', async (req, res) => {
  const order = await loadOrder(req.params.id);
  res.json({
    id: order.id,
    number: order.number,      // 47
    status: order.status,      // 'handed_to_courier' — версия 1.0 о таком не знает…
    statusText: STATUS_TEXT[order.status], // …но покажет «Передан курьеру»: текст прислал сервер
    totalKopecks: order.totalKopecks,      // копейки с первого дня — и навсегда
    // новое поле: старые версии его просто не читают
    courier: order.courier ? { name: order.courier.name } : null,
  });
});
declare function loadOrder(id: string): Promise<{
  id: string; number: number; status: string; totalKopecks: number; courier: { name: string } | null;
}>;
const STATUS_TEXT: Record<string, string> = {
  awaiting_payment: 'Ждёт оплаты', paid: 'Оплачен', accepted: 'Принят', preparing: 'Готовится',
  ready: 'Готов', picked_up: 'Выдан', cancelled: 'Отменён', unclaimed: 'Не забран',
  handed_to_courier: 'Передан курьеру', // появился с доставкой, осенью
};

// ═══ 3. ПРИЛОЖЕНИЕ: НЕЗНАКОМОЕ — НЕ ОШИБКА ═══
const KNOWN = ['awaiting_payment', 'paid', 'accepted', 'preparing', 'ready', 'picked_up', 'cancelled', 'unclaimed'] as const;
type KnownStatus = (typeof KNOWN)[number];

function statusLabel(status: string, statusText?: string): string {
  if (statusText) return statusText;                     // сервер знает лучше
  if ((KNOWN as readonly string[]).includes(status)) return LOCAL_TEXT[status as KnownStatus];
  return 'Заказ в работе';                               // запасной вариант вместо падения
}
declare const LOCAL_TEXT: Record<KnownStatus, string>;

// ═══ ЧТО МОЖНО И ЧТО НЕЛЬЗЯ МЕНЯТЬ В ОТВЕТЕ ═══
// + новое поле courier                        — старые версии его не читают
// + новый адрес GET /api/delivery-zones        — старые версии туда не ходят
// + новое необязательное поле в запросе        — сервер подставит значение по умолчанию
// price → amount                               // [!error] у 1.0–1.3 пропадут цены
// totalKopecks: 41000 → total: "410.00"        // [!error] сменился тип — сломается расчёт
// switch (status) { …; default: throw … }      // [!error] новый статус уронит старое приложение
`;

  protected readonly otpServer = `
// ═══ 1. ЗАПРОСИТЬ КОД ═══
import { randomInt, randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto';
import { redis } from './redis';
import { db } from './db';
import { allow } from './rate-limit';
import { sms } from './sms';
import { signAccessToken } from './jwt';

const OTP_TTL_SEC = 300;      // код живёт 5 минут
const RESEND_AFTER_MS = 60_000;
const MAX_ATTEMPTS = 5;       // 4 цифры = 10 000 вариантов; 5 попыток — шанс угадать 1 из 2 000

// Номер для проверяющих из App Store и Google Play: код известен заранее, SMS не уходит
const REVIEW_PHONE = process.env['REVIEW_PHONE'] ?? '';
const REVIEW_CODE = process.env['REVIEW_CODE'] ?? '';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// '+7 (999) 123-45-67', '8 999 123 45 67' → '+79991234567'; не российский мобильный → null
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\\D/g, '');
  const ten = digits.length === 11 && /^[78]/.test(digits) ? digits.slice(1) : digits;
  return /^9\\d{9}$/.test(ten) ? '+7' + ten : null;
}

type OtpState = { hash: string; attempts: number; issuedAt: number };

export async function requestOtp(raw: string, ip: string, deviceId: string) {
  const phone = normalizePhone(raw);
  if (!phone) return { ok: false, code: 'bad_phone' } as const;
  // Три ограничения сразу — против «накачки» SMS за ваш счёт
  if (!(await allow('otp:phone:' + phone, 5, 3600))) return { ok: false, code: 'too_many' } as const;
  if (!(await allow('otp:ip:' + ip, 20, 3600))) return { ok: false, code: 'too_many' } as const;
  if (!(await allow('otp:device:' + deviceId, 10, 3600))) return { ok: false, code: 'too_many' } as const;

  const previous = await redis.get('otp:' + phone);
  if (previous && Date.now() - (JSON.parse(previous) as OtpState).issuedAt < RESEND_AFTER_MS) {
    return { ok: false, code: 'wait' } as const; // «Отправить ещё раз — через 42 секунды»
  }

  const isReview = REVIEW_PHONE !== '' && phone === REVIEW_PHONE;
  const code = isReview ? REVIEW_CODE : String(randomInt(0, 10_000)).padStart(4, '0'); // не Math.random
  const state: OtpState = { hash: sha256(phone + ':' + code), attempts: 0, issuedAt: Date.now() };
  await redis.set('otp:' + phone, JSON.stringify(state), 'EX', OTP_TTL_SEC);
  if (!isReview) await sms.send(phone, code + ' — код для входа в «Пенку». Никому его не сообщайте');
  return { ok: true, resendAfterSec: RESEND_AFTER_MS / 1000 } as const;
}

// ═══ 2. ПРОВЕРИТЬ КОД И ВЫДАТЬ ТОКЕНЫ ═══
type Device = { id: string; platform: 'ios' | 'android' };

export async function verifyOtp(raw: string, code: string, device: Device) {
  const phone = normalizePhone(raw);
  const stored = phone ? await redis.get('otp:' + phone) : null;
  if (!phone || !stored) return { ok: false, code: 'expired' } as const;
  const state = JSON.parse(stored) as OtpState;
  if (state.attempts >= MAX_ATTEMPTS) {
    await redis.del('otp:' + phone);
    return { ok: false, code: 'too_many_attempts' } as const; // запросите новый код
  }
  const expected = Buffer.from(state.hash, 'hex');
  const actual = Buffer.from(sha256(phone + ':' + code), 'hex');
  if (!timingSafeEqual(expected, actual)) { // сравнение за одинаковое время — не подсказывает, сколько цифр совпало
    state.attempts++;
    await redis.set('otp:' + phone, JSON.stringify(state), 'KEEPTTL');
    return { ok: false, code: 'wrong_code', attemptsLeft: MAX_ATTEMPTS - state.attempts } as const;
  }
  await redis.del('otp:' + phone); // код одноразовый
  const { rows } = await db.query<{ id: string }>(
    \`INSERT INTO users (phone) VALUES ($1)
     ON CONFLICT (phone) DO UPDATE SET last_login_at = now()
     RETURNING id\`, // первый вход — это и есть регистрация
    [phone],
  );
  const { refreshHash, ...tokens } = await issueTokens(rows[0].id, device.id, randomUUID()); // отпечаток приложению ни к чему
  return { ok: true, ...tokens } as const;
}

// CREATE TABLE refresh_tokens (
//   token_hash  text PRIMARY KEY,        -- сам токен не храним: утечка базы не даёт войти
//   user_id     uuid NOT NULL,
//   device_id   text NOT NULL,
//   family_id   uuid NOT NULL,           -- цепочка обменов, начатая одним входом
//   replaced_by text,                    -- каким токеном его сменили
//   used_at     timestamptz,
//   revoked_at  timestamptz,
//   expires_at  timestamptz NOT NULL
// );
async function issueTokens(userId: string, deviceId: string, familyId: string, client: Queryable = db) {
  const refreshToken = randomBytes(32).toString('base64url');
  await client.query(
    \`INSERT INTO refresh_tokens (token_hash, user_id, device_id, family_id, expires_at)
     VALUES ($1, $2, $3, $4, now() + interval '60 days')\`,
    [sha256(refreshToken), userId, deviceId, familyId],
  );
  return { accessToken: signAccessToken(userId, '15m'), refreshToken, expiresInSec: 900, refreshHash: sha256(refreshToken) };
}
type Queryable = { query: typeof db.query };

// ═══ 3. ОБМЕН ТОКЕНА ОБНОВЛЕНИЯ — С РОТАЦИЕЙ И ЗАЩИТОЙ ОТ КРАЖИ ═══
export async function refresh(refreshToken: string, deviceId: string) {
  const hash = sha256(refreshToken);
  return db.tx(async (tx) => {
    const { rows } = await tx.query<{
      user_id: string; device_id: string; family_id: string; replaced_by: string | null;
      used_at: Date | null; revoked_at: Date | null; expires_at: Date;
    }>('SELECT * FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE', [hash]);
    const t = rows[0];
    if (!t || t.revoked_at || t.expires_at < new Date()) return { ok: false } as const;

    if (t.used_at) {
      const justNow = Date.now() - t.used_at.getTime() < 60_000 && t.device_id === deviceId;
      if (!justNow) {
        // Токен уже меняли, и давно или с другого устройства: копия у кого-то ещё — отзываем всю цепочку
        await tx.query('UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1', [t.family_id]);
        return { ok: false } as const; // приложение покажет вход по номеру
      }
      // Связь оборвалась после обмена, и приложение повторило запрос: отзываем выданный минуту назад
      await tx.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1', [t.replaced_by]);
    }
    const next = await issueTokens(t.user_id, t.device_id, t.family_id, tx);
    await tx.query('UPDATE refresh_tokens SET used_at = coalesce(used_at, now()), replaced_by = $2 WHERE token_hash = $1', [hash, next.refreshHash]);
    return { ok: true, accessToken: next.accessToken, refreshToken: next.refreshToken, expiresInSec: next.expiresInSec } as const;
  });
}
`;

  protected readonly tokenStorage = `
// ═══ ПРИЛОЖЕНИЕ: ГДЕ ЛЕЖАТ ТОКЕНЫ И КАК ИХ МЕНЯТЬ (React Native + Expo) ═══
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const API = 'https://api.penka.example';
const REFRESH_KEY = 'penka.refresh';
const APP_VERSION = Application.nativeApplicationVersion ?? '0.0.0'; // '1.4.0' из настроек сборки

let accessToken: string | null = null; // только в памяти: живёт 15 минут, на диск не пишем

type Session = { accessToken: string; refreshToken: string };

export async function saveSession(s: Session): Promise<void> {
  accessToken = s.accessToken;
  // Keychain на iPhone, Keystore на Android: зашифровано, другим приложениям не видно
  await SecureStore.setItemAsync(REFRESH_KEY, s.refreshToken, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK, // доступно после первой разблокировки — и для фоновых задач
  });
}

export async function logoutLocally(): Promise<void> {
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  // и показать экран входа по номеру
}

// Один обмен на всех: пять запросов получили 401 — обмен идёт один, остальные его ждут
let refreshing: Promise<boolean> | null = null;

function refreshOnce(): Promise<boolean> {
  refreshing ??= (async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!refreshToken) return false;
      const res = await fetch(API + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Device-Id': await deviceId() },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.status === 401) {
        await logoutLocally(); // сервер отозвал цепочку — нужен вход заново
        return false;
      }
      if (!res.ok) return false;  // нет связи или сбой сервера — не выходим, попробуем позже
      await saveSession(await res.json());
      return true;
    } catch {
      return false;               // метро: токен обновления цел, просто подождём связи
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}
declare function deviceId(): Promise<string>; // случайный id, созданный при первом запуске и сохранённый в SecureStore

export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = () =>
    fetch(API + path, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string>),
        Authorization: 'Bearer ' + accessToken,
        'X-App-Version': APP_VERSION,
        'X-Platform': Platform.OS, // 'ios' | 'android'
      },
    });
  let res = await send();
  if (res.status === 401 && (await refreshOnce())) res = await send(); // повтор — один раз
  return res;
}

// ═══ КАК НЕ НАДО ═══
// await AsyncStorage.setItem('refresh', token)       // [!error] незашифрованный файл, попадает в бэкапы
// console.log('session', session)                    // [!error] токены — в логах и отчётах о падениях
// if (res.status === 401) await refresh()  — в каждом запросе свой  // [!error] второй обмен = «кража», выход
`;

  protected readonly networkClient = `
// ═══ 1. ЗАПРОС С ОГРАНИЧЕНИЕМ ПО ВРЕМЕНИ ═══
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Crypto from 'expo-crypto';
import { authedFetch } from './session';

export class NetworkError extends Error {}                  // нет связи, таймаут, «чужой» ответ
export class HttpError extends Error {
  constructor(readonly status: number, readonly code: string | null) {
    super('HTTP ' + status);
  }
}

export async function api<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 10_000); // 10 секунд — и хватит
  let res: Response;
  try {
    res = await authedFetch(path, { ...init, signal: controller.signal });
  } catch {
    throw new NetworkError('no connection or timeout');
  } finally {
    clearTimeout(timer);
  }
  // Wi-Fi «с ловушкой» отвечает HTML-страницей входа, а не нашим JSON
  if (!(res.headers.get('Content-Type') ?? '').includes('application/json')) throw new NetworkError('not our server');
  const body = await res.json();
  if (!res.ok) throw new HttpError(res.status, typeof body?.code === 'string' ? body.code : null);
  return body as T;
}

// ═══ 2. СНАЧАЛА СОХРАНЁННОЕ, ПОТОМ СВЕЖЕЕ (TanStack Query) ═══
// Библиотека узнаёт о связи от NetInfo: связи нет — запросы ждут; вернулась — повторяет
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
);

const WEEK_MS = 7 * 24 * 3_600_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,  // минуту данные свежие — без лишних запросов при переходах между экранами
      gcTime: WEEK_MS,    // неделю держим копию — чтобы показывать без связи
      retry: (count, err) => err instanceof NetworkError && count < 3, // 4xx повторять бесполезно
      retryDelay: (n) => Math.min(1000 * 2 ** n, 15_000) + Math.random() * 500,
    },
    mutations: { retry: false }, // изменения сами не повторяем — только с ключом повтора (ниже)
  },
});

// Копия ответов на диске: после перезапуска меню и заказы появляются мгновенно.
// Токенов здесь нет — они в SecureStore; здесь только то, что не жалко показать постороннему
export const persister = createAsyncStoragePersister({ storage: AsyncStorage, key: 'penka.cache' });
// В корне приложения:
//   <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: WEEK_MS }}>

// Экран меню: копия — сразу, свежее — следом
//   const menu = useQuery({ queryKey: ['menu'], queryFn: fetchMenu });
//   menu.data — показываем; menu.isFetching — маленький значок «обновляем»;
//   menu.error && !menu.data — «Нет связи. Меню появится, когда она вернётся»

// ═══ 3. ОФОРМИТЬ ЗАКАЗ: ОДИН КЛЮЧ НА НАЖАТИЕ, СКОЛЬКО БЫ НИ БЫЛО ПОПЫТОК ═══
type CartItem = { itemId: string; options: Record<string, string>; quantity: number };
type Cart = { shopId: string; pickupAt: string; items: CartItem[]; checkoutKey: string | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function placeOrder(cart: Cart, saveCart: (c: Cart) => Promise<void>) {
  // Ключ рождается при первом нажатии и хранится вместе с корзиной — переживёт даже выгрузку приложения.
  // Изменили корзину, кофейню или время — saveCart обнуляет ключ: это уже другой заказ
  const key = cart.checkoutKey ?? Crypto.randomUUID();
  if (!cart.checkoutKey) await saveCart({ ...cart, checkoutKey: key });

  for (let attempt = 0; ; attempt++) {
    try {
      const order = await api<{ id: string; number: number; totalKopecks: number }>('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify({ shopId: cart.shopId, pickupAt: cart.pickupAt, items: cart.items }),
      });
      await saveCart({ ...cart, items: [], checkoutKey: null }); // успех: корзина пуста, ключ больше не нужен
      return order;
    } catch (err) {
      if (!(err instanceof NetworkError) || attempt >= 2) throw err; // «Не удалось отправить. Повторить?»
      await sleep(1000 * 2 ** attempt); // 1 с, 2 с — и с ТЕМ ЖЕ ключом
    }
  }
}

// ═══ КАК НЕ НАДО ═══
// await fetch(url)                                     // [!error] без таймаута висит минуту на «ловушке» Wi-Fi
// onError: () => placeOrder({ ...cart, checkoutKey: null })  // [!error] потерянный ответ = второй заказ
// setStatus('paid') — до ответа сервера               // [!error] «оплачено», а денег нет
`;

  protected readonly idempotencyServer = `
// ═══ СЕРВЕР: ТОТ ЖЕ КЛЮЧ — ТОТ ЖЕ ОТВЕТ ═══
// CREATE TABLE idempotency_keys (
//   user_id      uuid NOT NULL,
//   key          text NOT NULL,
//   request_hash text NOT NULL,      -- отпечаток содержимого: тот же ключ с другим заказом — ошибка
//   response     jsonb NOT NULL,     -- что ответили в первый раз: статус и тело
//   created_at   timestamptz NOT NULL DEFAULT now(),
//   PRIMARY KEY (user_id, key)
// );
// Ключи старше суток удаляет ночная задача — повторов через сутки не бывает
import { createHash } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { db, type Tx } from './db';

export type AuthedRequest = Request & { user: { id: string } };
export type Result = { status: number; body: unknown };

export function idempotent(handler: (req: AuthedRequest, tx: Tx) => Promise<Result>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.get('Idempotency-Key');
    if (!key || key.length > 100) {
      res.status(400).json({ code: 'idempotency_key_required' });
      return;
    }
    const userId = (req as AuthedRequest).user.id;
    const requestHash = createHash('sha256').update(JSON.stringify(req.body)).digest('hex');
    try {
      const result = await db.tx(async (tx): Promise<Result> => {
        // Замок на пару «гость + ключ»: второй одновременный запрос ждёт здесь, пока первый не закончит
        await tx.query('SELECT pg_advisory_xact_lock(hashtext($1))', [userId + ':' + key]);
        const { rows } = await tx.query<{ request_hash: string; response: Result }>(
          'SELECT request_hash, response FROM idempotency_keys WHERE user_id = $1 AND key = $2',
          [userId, key],
        );
        const saved = rows[0];
        if (saved) {
          if (saved.request_hash !== requestHash) return { status: 422, body: { code: 'idempotency_key_reused' } };
          return saved.response; // повтор: тот же ответ, что и в первый раз, — заказ не создаётся заново
        }
        const fresh = await handler(req as AuthedRequest, tx); // заказ пишется в ЭТОЙ ЖЕ транзакции…
        await tx.query(
          'INSERT INTO idempotency_keys (user_id, key, request_hash, response) VALUES ($1, $2, $3, $4)',
          [userId, key, requestHash, fresh],
        ); // …вместе с ключом: либо сохранились оба, либо ни один
        return fresh;
      });
      res.status(result.status).json(result.body);
    } catch (err) {
      next(err); // транзакция откатилась целиком — повтор с тем же ключом попробует с нуля
    }
  };
}

// app.post('/api/orders', requireUser, idempotent(createOrderHandler));
`;

  protected readonly menuApi = `
// ═══ 1. СЕРВЕР: МЕНЮ ПО МЕТКЕ ВЕРСИИ ═══
import express from 'express';
import { db } from './db';

const app = express();

// Что внутри: цены — целыми копейками, картинки — ключами без размера
// {
//   "version": 1014,
//   "categories": [{ "id": "coffee", "title": "Кофе", "items": [{
//     "id": "cappuccino", "title": "Капучино", "priceKopecks": 22000, "isDrink": true,
//     "image": { "key": "menu/cappuccino.3f9a1c", "placeholder": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" },
//     "options": [
//       { "id": "size", "title": "Размер", "required": true, "choices": [
//         { "id": "s", "title": "0,25 л", "deltaKopecks": 0 },
//         { "id": "l", "title": "0,4 л",  "deltaKopecks": 6000 } ] },
//       { "id": "milk", "title": "Молоко", "required": true, "choices": [
//         { "id": "cow", "title": "Обычное", "deltaKopecks": 0 },
//         { "id": "oat", "title": "Овсяное", "deltaKopecks": 5000 } ] } ]
//   }] }]
// }
declare function loadMenu(): Promise<{ version: number }>; // из памяти; сбрасывается, когда в админке сохранили меню

app.get('/api/menu', async (req, res) => {
  const menu = await loadMenu();
  const etag = '"m-' + menu.version + '"';       // версия растёт при каждом сохранении меню
  res.set('ETag', etag);
  res.set('Cache-Control', 'private, no-cache'); // «храни у себя, но перед показом свежего — спроси»
  if (req.get('If-None-Match') === etag) {
    res.status(304).end();                        // не изменилось: ни байта меню
    return;
  }
  res.json(menu);
});

// ═══ 2. СЕРВЕР: НАЛИЧИЕ — МАЛЕНЬКОЕ И ЧАСТОЕ ═══
app.get('/api/shops/:shopId/availability', async (req, res) => {
  const { rows } = await db.query<{ ref: string }>(
    'SELECT ref FROM stop_list WHERE shop_id = $1 AND until > now()', // 'croissant', 'milk:oat'…
    [req.params.shopId],
  );
  res.set('Cache-Control', 'no-store');
  res.json({ unavailable: rows.map((r) => r.ref), at: new Date().toISOString() });
});
// Бариста на планшете нажал «Закончились круассаны» → строка в stop_list до конца дня

// ═══ 3. ПРИЛОЖЕНИЕ: КАРТИНКА НУЖНОГО РАЗМЕРА ═══
import { PixelRatio } from 'react-native';

const CDN = 'https://img.penka.example';
const WIDTHS = [200, 400, 800] as const; // какие размеры бэкенд нарезал при загрузке фото

export function imageUrl(key: string, widthOnScreen: number): string {
  const needed = widthOnScreen * PixelRatio.get();      // 160 точек × плотность 3 = 480 пикселей
  const width = WIDTHS.find((w) => w >= needed) ?? 800; // → 800, а не исходные 4000
  return \`\${CDN}/\${key}-\${width}.webp\`;              // в ключе отпечаток: новое фото — новый адрес
}
// В карточке меню (библиотека expo-image):
//   <Image source={imageUrl(item.image.key, 160)}
//          placeholder={{ blurhash: item.image.placeholder }}   // размытая заглушка, пока грузится
//          cachePolicy="disk" transition={150} />                // кэш переживёт перезапуск

// ═══ КАК НЕ НАДО ═══
// <Image source={{ uri: originalUrl }} />          // [!error] 3 МБ на карточку, 180 МБ на меню
// GET /api/menu каждые 30 секунд ради «закончилось»  // [!error] меню с фото по кругу по мобильной сети
// "price": 220.5                                    // [!error] дроби в деньгах — копейки теряются при сложении
`;

  protected readonly orderSchema = `
-- ═══ ЗАКАЗЫ, ПОЗИЦИИ, ОКНА ГОТОВНОСТИ, ЖУРНАЛ ═══
CREATE TABLE orders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number         integer NOT NULL,          -- «№ 47»: короткий номер — по кофейне за день
  business_date  date NOT NULL,             -- дата по местному времени кофейни
  user_id        uuid NOT NULL REFERENCES users (id),
  shop_id        text NOT NULL REFERENCES shops (id),
  status         text NOT NULL CHECK (status IN ('awaiting_payment', 'paid', 'accepted', 'preparing',
                                                  'ready', 'picked_up', 'cancelled', 'unclaimed')),
  pickup_slot    timestamptz NOT NULL,      -- начало пятиминутного окна: 08:40
  drinks         integer NOT NULL,          -- сколько мест в окне занимает заказ
  total_kopecks  integer NOT NULL CHECK (total_kopecks >= 0),
  points_spent   integer NOT NULL DEFAULT 0,
  pay_until      timestamptz,               -- создан + 15 минут; не оплатили — отмена
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON orders (shop_id, business_date, number);
CREATE INDEX ON orders (shop_id, status, pickup_slot);  -- планшет: активные заказы кофейни по времени
CREATE INDEX ON orders (user_id, created_at DESC);       -- приложение: «мои заказы»

CREATE TABLE order_items (
  order_id      uuid NOT NULL REFERENCES orders (id),
  line          smallint NOT NULL,
  item_id       text NOT NULL,
  title         text NOT NULL,              -- копия названия и цены на момент заказа:
  unit_kopecks  integer NOT NULL,           -- меню завтра изменится, а чек — нет
  options       jsonb NOT NULL,             -- {"size": "l", "milk": "oat"}
  quantity      smallint NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  PRIMARY KEY (order_id, line)
);

CREATE TABLE order_numbers (                -- счётчик «№ 47» без гонок
  shop_id        text NOT NULL,
  business_date  date NOT NULL,
  last           integer NOT NULL,
  PRIMARY KEY (shop_id, business_date)
);

CREATE TABLE pickup_slots (
  shop_id    text NOT NULL,
  starts_at  timestamptz NOT NULL,          -- 08:40, 08:45, 08:50…
  capacity   smallint NOT NULL,             -- сколько напитков успевают за 5 минут: 12 на Садовой
  booked     smallint NOT NULL DEFAULT 0,
  CHECK (booked BETWEEN 0 AND capacity),    -- база сама не даст переполнить окно
  PRIMARY KEY (shop_id, starts_at)
);

CREATE TABLE order_events (                 -- журнал: кто, когда, откуда, куда
  order_id     uuid NOT NULL REFERENCES orders (id),
  at           timestamptz NOT NULL DEFAULT now(),
  from_status  text,
  to_status    text NOT NULL,
  actor        text NOT NULL                -- 'guest:<id>', 'barista:<id>', 'payment', 'timer'
);

-- ═══ РАЗ В МИНУТУ: НЕОПЛАЧЕННЫЕ ДОЛЬШЕ 15 МИНУТ — ОТМЕНИТЬ И ВЕРНУТЬ МЕСТА ═══
WITH expired AS (
  UPDATE orders SET status = 'cancelled'
   WHERE status = 'awaiting_payment' AND pay_until < now()
  RETURNING id, shop_id, pickup_slot, drinks
), per_slot AS (                            -- два отменённых заказа в одном окне — одна строка с суммой
  SELECT shop_id, pickup_slot, sum(drinks)::smallint AS drinks FROM expired GROUP BY shop_id, pickup_slot
), freed AS (
  UPDATE pickup_slots s SET booked = s.booked - p.drinks
    FROM per_slot p
   WHERE s.shop_id = p.shop_id AND s.starts_at = p.pickup_slot
)
INSERT INTO order_events (order_id, from_status, to_status, actor)
SELECT id, 'awaiting_payment', 'cancelled', 'timer' FROM expired;

-- ═══ КАК НЕ НАДО ═══
-- SELECT max(number) + 1 FROM orders WHERE …          -- [!error] два заказа в одну секунду — оба «№ 48»
-- UPDATE pickup_slots … FROM expired                   -- [!error] два заказа в окне — место вернётся одно
-- order_items без title и unit_kopecks                 -- [!error] поменяли меню — старые чеки «переписались»
`;

  protected readonly createOrder = `
// ═══ 1. ОФОРМЛЕНИЕ: ЦЕНЫ — СВОИ, МЕСТО В ОКНЕ — АТОМАРНО ═══
import type { Tx } from './db';
import type { AuthedRequest, Result } from './idempotency';
import { OrderRequestSchema, type OrderStatus } from '@penka/shared'; // общие проверки из packages/shared
import { loadMenu, loadUnavailable, priceWithOptions } from './menu';
import { getShop, roundUpToSlot, nextFreeSlot } from './shops';
import { enqueue } from './jobs';
import { spendPoints } from './loyalty';

const fail = (status: number, code: string, extra: object = {}): Result => ({ status, body: { code, ...extra } });

export async function createOrderHandler(req: AuthedRequest, tx: Tx): Promise<Result> {
  const parsed = OrderRequestSchema.safeParse(req.body); // формат, длины, количество позиций
  if (!parsed.success) return fail(400, 'bad_request');
  const body = parsed.data;

  const shop = await getShop(tx, body.shopId);
  const slot = roundUpToSlot(new Date(body.pickupAt)); // 8:38 → окно 8:40
  if (!shop || !shop.isOpenAt(slot)) return fail(422, 'shop_closed');
  if (slot.getTime() < Date.now() + shop.minPrepMinutes * 60_000) return fail(422, 'too_soon');

  // Цена — только из базы. То, что приложение показало гостю, — для сверки, не для расчёта
  const menu = await loadMenu();
  const unavailable = await loadUnavailable(tx, shop.id);
  const lines: { itemId: string; title: string; unit: number; options: Record<string, string>; quantity: number }[] = [];
  let total = 0;
  let drinks = 0;
  for (const it of body.items) {
    const item = menu.items.get(it.itemId);
    if (!item || unavailable.has(item.id)) return fail(409, 'item_unavailable', { itemId: it.itemId });
    const unit = priceWithOptions(item, it.options, unavailable); // обязательные выбраны, лишних нет, молоко не кончилось
    if (unit === null) return fail(422, 'bad_options', { itemId: it.itemId });
    total += unit * it.quantity;
    if (item.isDrink) drinks += it.quantity;
    lines.push({ itemId: item.id, title: item.title, unit, options: it.options, quantity: it.quantity });
  }
  // Катя: капучино 0,4 л на овсяном (22 000 + 6 000 + 5 000) + сырник 8 000 = 41 000 копеек = 410 ₽

  // Бронь места: UPDATE сам запирает строку окна, и второй одновременный заказ проверит условие
  // уже после первого — последнее место не займут двое
  if (drinks > 0) {
    const booked = await tx.query(
      'UPDATE pickup_slots SET booked = booked + $3 WHERE shop_id = $1 AND starts_at = $2 AND booked + $3 <= capacity',
      [shop.id, slot, drinks],
    );
    if (!booked.rowCount) return fail(409, 'slot_full', { nextFree: await nextFreeSlot(tx, shop.id, slot, drinks) }); // «Ближайшее — 8:45»
  }

  const num = await tx.query<{ last: number }>(
    \`INSERT INTO order_numbers (shop_id, business_date, last) VALUES ($1, $2, 1)
     ON CONFLICT (shop_id, business_date) DO UPDATE SET last = order_numbers.last + 1
     RETURNING last\`,
    [shop.id, shop.businessDate(slot)],
  );
  const { rows } = await tx.query<{ id: string }>(
    \`INSERT INTO orders (number, business_date, user_id, shop_id, status, pickup_slot, drinks, total_kopecks, pay_until)
     VALUES ($1, $2, $3, $4, 'awaiting_payment', $5, $6, $7, now() + interval '15 minutes')
     RETURNING id\`,
    [num.rows[0].last, shop.businessDate(slot), req.user.id, shop.id, slot, drinks, total],
  );
  const orderId = rows[0].id;
  for (const [i, l] of lines.entries()) {
    await tx.query(
      'INSERT INTO order_items (order_id, line, item_id, title, unit_kopecks, options, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [orderId, i + 1, l.itemId, l.title, l.unit, l.options, l.quantity],
    );
  }
  // Бонусы — сколько гость попросил, но не больше баланса и 30 % заказа (раздел «Бонусы»)
  const pointsSpent = body.pointsToSpend ? await spendPoints(tx, req.user.id, orderId, body.pointsToSpend, total) : 0;
  await tx.query("INSERT INTO order_events (order_id, to_status, actor) VALUES ($1, 'awaiting_payment', $2)", [orderId, 'guest:' + req.user.id]);
  return { status: 201, body: { id: orderId, number: num.rows[0].last, totalKopecks: total, toPayKopecks: total - pointsSpent * 100 } };
}

// ═══ 2. ПЕРЕХОДЫ МЕЖДУ СОСТОЯНИЯМИ — ОДНОЙ ФУНКЦИЕЙ ═══
type Actor = 'guest' | 'barista' | 'payment' | 'timer';

const ALLOWED: Record<OrderStatus, Partial<Record<OrderStatus, Actor[]>>> = {
  awaiting_payment: { paid: ['payment'], cancelled: ['guest', 'timer'] },
  paid:             { accepted: ['barista'], cancelled: ['guest', 'barista'] }, // гость — пока не приняли
  accepted:         { preparing: ['barista'], cancelled: ['barista'] },
  preparing:        { ready: ['barista'] },
  ready:            { picked_up: ['barista'], unclaimed: ['timer'] },          // 2 часа — и «невостребован»
  picked_up: {}, cancelled: {}, unclaimed: {},                                  // конечные — дальше никуда
};

export async function transition(tx: Tx, orderId: string, to: OrderStatus, actor: { kind: Actor; id?: string }): Promise<boolean> {
  const { rows } = await tx.query<{ status: OrderStatus }>('SELECT status FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
  const from = rows[0]?.status;
  if (!from || !ALLOWED[from][to]?.includes(actor.kind)) return false; // «Готово» по отменённому заказу — нет
  await tx.query('UPDATE orders SET status = $2 WHERE id = $1', [orderId, to]);
  await tx.query(
    'INSERT INTO order_events (order_id, from_status, to_status, actor) VALUES ($1, $2, $3, $4)',
    [orderId, from, to, actor.id ? actor.kind + ':' + actor.id : actor.kind],
  );
  // Всё остальное — фоном, задачей в той же транзакции: push гостю, событие на планшет,
  // возврат места в окне и денег при отмене, бонусы при выдаче
  await enqueue(tx, 'order.changed', { orderId, from, to });
  return true;
}
`;

  protected readonly payment = `
// ═══ 1. БЭКЕНД: СОЗДАТЬ ПЛАТЁЖ — СУММА ИЗ БАЗЫ (пример — API ЮKassa) ═══
// CREATE TABLE payments (
//   id               text PRIMARY KEY,           -- id платежа у платёжного сервиса
//   order_id         uuid NOT NULL REFERENCES orders (id),
//   amount_kopecks   integer NOT NULL,
//   status           text NOT NULL,              -- pending · succeeded · canceled
//   confirmation_url text,
//   created_at       timestamptz NOT NULL DEFAULT now()
// );
import express from 'express';
import { db } from './db';
import { transition } from './orders';
import { enqueue } from './jobs';

const app = express();
const API = 'https://api.yookassa.ru/v3';
// Секретный ключ магазина — только здесь, на сервере. В приложении его нет и быть не может
const AUTH = 'Basic ' + Buffer.from(process.env['YOOKASSA_SHOP_ID'] + ':' + process.env['YOOKASSA_SECRET_KEY']).toString('base64');

class Conflict extends Error {}

export async function startPayment(userId: string, orderId: string): Promise<{ confirmationUrl: string }> {
  const { rows } = await db.query<{ number: number; total_kopecks: number; points_spent: number; status: string }>(
    'SELECT number, total_kopecks, points_spent, status FROM orders WHERE id = $1 AND user_id = $2', // только свой заказ
    [orderId, userId],
  );
  const order = rows[0];
  if (!order || order.status !== 'awaiting_payment') throw new Conflict('not_payable');
  const amountKopecks = order.total_kopecks - order.points_spent * 100; // часть оплатили бонусами

  // Форма уже открыта и не закрыта? Отдаём её же: два живых платежа за один заказ — путь к двойному списанию
  const pending = await db.query<{ confirmation_url: string }>(
    "SELECT confirmation_url FROM payments WHERE order_id = $1 AND status = 'pending'",
    [orderId],
  );
  if (pending.rows[0]) return { confirmationUrl: pending.rows[0].confirmation_url };

  // Ключ повтора — на попытку: сетевой повтор вернёт тот же платёж, новая попытка после отказа банка — новый
  const attempts = await db.query<{ n: number }>('SELECT count(*)::int AS n FROM payments WHERE order_id = $1', [orderId]);
  const res = await fetch(API + '/payments', {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      'Idempotence-Key': 'order-' + orderId + '-' + attempts.rows[0].n,
    },
    body: JSON.stringify({
      amount: { value: (amountKopecks / 100).toFixed(2), currency: 'RUB' }, // 41000 → "410.00"
      capture: true,
      // Ссылка возврата откроет приложение — раздел про глубокие ссылки
      confirmation: { type: 'redirect', return_url: 'https://penka.example/pay/return?order=' + orderId },
      description: 'Заказ № ' + order.number,
      metadata: { orderId },
      // receipt: состав чека из order_items; ставки и признаки расчёта — по указанию бухгалтера
    }),
  });
  if (!res.ok) throw new Error('payment create failed: ' + res.status); // текст ответа — в лог, без данных гостя
  const payment = await res.json();
  await db.query(
    'INSERT INTO payments (id, order_id, amount_kopecks, status, confirmation_url) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
    [payment.id, orderId, amountKopecks, payment.status, payment.confirmation.confirmation_url],
  );
  return { confirmationUrl: payment.confirmation.confirmation_url };
}

// ═══ 2. ВЕБХУК: НЕ ВЕРИМ НА СЛОВО — СПРАШИВАЕМ САМИ ═══
app.post('/webhooks/yookassa', express.json(), async (req, res) => {
  const paymentId = req.body?.object?.id;
  if (typeof paymentId !== 'string') {
    res.sendStatus(400);
    return;
  }
  // Подделанный вебхук ничего не изменит: статус берём у платёжного сервиса, а не из тела запроса
  const check = await fetch(API + '/payments/' + encodeURIComponent(paymentId), { headers: { Authorization: AUTH } });
  if (!check.ok) {
    res.sendStatus(502); // не 200 — сервис пришлёт вебхук ещё раз
    return;
  }
  const payment = await check.json();
  await db.tx(async (tx) => {
    const { rows } = await tx.query<{ order_id: string; amount_kopecks: number }>(
      'UPDATE payments SET status = $2 WHERE id = $1 AND status <> $2 RETURNING order_id, amount_kopecks',
      [payment.id, payment.status],
    );
    const row = rows[0];
    if (!row) return;                              // этот статус уже знаем — повторный вебхук ничего не меняет
    if (payment.status !== 'succeeded') return;    // canceled — гость может попробовать ещё раз
    if (Math.round(Number(payment.amount.value) * 100) !== row.amount_kopecks) {
      throw new Error('amount mismatch');          // оплачено не столько, сколько стоит заказ — разбираться человеку
    }
    const moved = await transition(tx, row.order_id, 'paid', { kind: 'payment' }); // → планшет, чек, «оплачен»
    if (!moved) {
      // Таймер успел отменить заказ, пока гость платил: заказ не «воскрешаем» — возвращаем деньги
      await enqueue(tx, 'payment.refund', { paymentId: payment.id, reason: 'paid_after_cancel' });
    }
  });
  res.sendStatus(200);
});

// ═══ 3. ВОЗВРАТ — ТОЖЕ С КЛЮЧОМ ═══
export async function refund(paymentId: string, amountKopecks: number, reason: string): Promise<void> {
  const res = await fetch(API + '/refunds', {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Idempotence-Key': 'refund-' + paymentId },
    body: JSON.stringify({
      payment_id: paymentId,
      amount: { value: (amountKopecks / 100).toFixed(2), currency: 'RUB' },
      description: reason,
    }),
  });
  if (!res.ok) throw new Error('refund failed: ' + res.status); // задача повторится — ключ не даст вернуть дважды
  // + уведомление гостю: «Оплата пришла после отмены заказа — деньги вернутся на карту»
}

// ═══ 4. ПРИЛОЖЕНИЕ: «ПРОВЕРЯЕМ ОПЛАТУ…» ═══
import * as WebBrowser from 'expo-web-browser';
import { api } from './api';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function pay(orderId: string): Promise<'paid' | 'not_paid' | 'unknown'> {
  const { confirmationUrl } = await api<{ confirmationUrl: string }>('/api/orders/' + orderId + '/pay', { method: 'POST' });
  // Форма во встроенном браузере; ссылка возврата откроет приложение и закроет браузер
  await WebBrowser.openBrowserAsync(confirmationUrl);
  // Чем бы ни закончилось — успехом, отказом банка, закрытием формы — спрашиваем бэкенд
  for (let i = 0; i < 10; i++) {
    const order = await api<{ status: string }>('/api/orders/' + orderId);
    if (order.status === 'cancelled') return 'not_paid';
    if (order.status !== 'awaiting_payment') return 'paid';
    await sleep(2000); // вебхук приходит через несколько секунд
  }
  return 'unknown'; // «Оплата ещё не подтверждена» — экран заказа проверит снова при открытии
}

// ═══ КАК НЕ НАДО ═══
// if (url.includes('/pay/return?status=success')) markPaid()   // [!error] ссылку откроют и без оплаты
// amount: { value: String(req.body.total) }                    // [!error] сумму прислал телефон — заплатят 1 ₽
// const YOOKASSA_SECRET = 'live_…'  — в коде приложения        // [!error] ключ достанут из файла приложения
`;

  protected readonly loyalty = `
// ═══ 1. ЖУРНАЛ ОПЕРАЦИЙ: СТРОКИ НЕ МЕНЯЮТСЯ И НЕ УДАЛЯЮТСЯ ═══
// CREATE TABLE loyalty_entries (
//   id         bigserial PRIMARY KEY,
//   user_id    uuid NOT NULL REFERENCES users (id),
//   delta      integer NOT NULL CHECK (delta <> 0),       -- +20 начисление, −40 списание
//   kind       text NOT NULL CHECK (kind IN ('accrual', 'accrual_reversal', 'spend', 'spend_return',
//                                            'expire', 'manual')),
//   order_id   uuid REFERENCES orders (id),
//   actor      text NOT NULL,                              -- 'system', 'guest', 'barista:<id>', 'manager:<id>'
//   comment    text,                                       -- у ручных операций — обязательно
//   created_at timestamptz NOT NULL DEFAULT now()
// );
// CREATE UNIQUE INDEX ON loyalty_entries (order_id, kind) WHERE order_id IS NOT NULL; -- один вид на заказ
// ALTER TABLE users ADD COLUMN points integer NOT NULL DEFAULT 0 CHECK (points >= 0);  -- сумма журнала — для скорости
// ALTER TABLE users ADD COLUMN last_purchase_at timestamptz;
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Tx } from './db';
import { redis } from './redis';

const ACCRUAL_RATE = 0.05; // 5 % с оплаченного деньгами
const MAX_SHARE = 0.3;     // бонусами — не больше 30 % заказа

// Списание — при оформлении, в той же транзакции, что и заказ
export async function spendPoints(tx: Tx, userId: string, orderId: string, requested: number, totalKopecks: number): Promise<number> {
  // FOR UPDATE: второй заказ с другого телефона подождёт здесь и увидит уже уменьшенный баланс
  const { rows } = await tx.query<{ points: number }>('SELECT points FROM users WHERE id = $1 FOR UPDATE', [userId]);
  const byRule = Math.floor((totalKopecks / 100) * MAX_SHARE); // 410 ₽ → не больше 123 бонусов
  const spend = Math.min(Math.max(0, Math.floor(requested)), rows[0].points, byRule);
  if (spend === 0) return 0;
  await tx.query("INSERT INTO loyalty_entries (user_id, delta, kind, order_id, actor) VALUES ($1, $2, 'spend', $3, 'guest')", [userId, -spend, orderId]);
  await tx.query('UPDATE users SET points = points - $2 WHERE id = $1', [userId, spend]);
  await tx.query('UPDATE orders SET points_spent = $2 WHERE id = $1', [orderId, spend]);
  return spend; // сколько списать, решил сервер: приложение могло показать устаревший баланс
}

// Начисление — задача после перехода заказа в «выдан»
export async function accrueForOrder(tx: Tx, orderId: string): Promise<void> {
  const { rows } = await tx.query<{ user_id: string; total_kopecks: number; points_spent: number }>(
    "SELECT user_id, total_kopecks, points_spent FROM orders WHERE id = $1 AND status = 'picked_up'",
    [orderId],
  );
  const order = rows[0];
  if (!order) return;
  const paidRubles = (order.total_kopecks - order.points_spent * 100) / 100;
  const points = Math.floor(paidRubles * ACCRUAL_RATE); // 410 ₽ → 20,5 → 20 бонусов (всегда вниз)
  if (points <= 0) return;
  const inserted = await tx.query(
    "INSERT INTO loyalty_entries (user_id, delta, kind, order_id, actor) VALUES ($1, $2, 'accrual', $3, 'system') ON CONFLICT DO NOTHING",
    [order.user_id, points, orderId],
  ); // задача выполнилась второй раз — уникальный индекс не пустит вторую строку
  if (inserted.rowCount) {
    await tx.query('UPDATE users SET points = points + $2, last_purchase_at = now() WHERE id = $1', [order.user_id, points]);
  }
}

// Отмена заказа со списанием — вернуть ровно то, что списали
export async function returnSpent(tx: Tx, orderId: string): Promise<void> {
  const { rows } = await tx.query<{ user_id: string; delta: number }>(
    "SELECT user_id, delta FROM loyalty_entries WHERE order_id = $1 AND kind = 'spend'",
    [orderId],
  );
  const spent = rows[0];
  if (!spent) return;
  const inserted = await tx.query(
    "INSERT INTO loyalty_entries (user_id, delta, kind, order_id, actor) VALUES ($1, $2, 'spend_return', $3, 'system') ON CONFLICT DO NOTHING",
    [spent.user_id, -spent.delta, orderId],
  );
  if (inserted.rowCount) await tx.query('UPDATE users SET points = points + $2 WHERE id = $1', [spent.user_id, -spent.delta]);
}

// Раз в сутки: полгода без покупок — бонусы сгорают (а за неделю — уведомление «сгорят 23 октября»)
//   INSERT INTO loyalty_entries (user_id, delta, kind, actor)
//   SELECT id, -points, 'expire', 'system' FROM users
//    WHERE points > 0 AND last_purchase_at < now() - interval '180 days';
//   UPDATE users SET points = 0 WHERE points > 0 AND last_purchase_at < now() - interval '180 days';
//   — обе команды в одной транзакции

// ═══ 2. QR НА КАССЕ: КОД МЕНЯЕТСЯ КАЖДЫЕ 30 СЕКУНД ═══
// Секрет карты выдаётся приложению при входе и лежит в SecureStore; на сервере — тот же секрет.
// Код считается на телефоне без связи: QR работает и в подвальной кофейне
const STEP_SEC = 30;

function mac(secret: Buffer, userId: string, step: number): string {
  return createHmac('sha256', secret).update(userId + ':' + step).digest('base64url').slice(0, 16);
}

export function cardCode(userId: string, secret: Buffer, now = Date.now()): string {
  const step = Math.floor(now / 1000 / STEP_SEC);
  return ['PNK1', userId, step, mac(secret, userId, step)].join('.'); // эта строка и рисуется в QR
}
// В приложении — тот же расчёт (HMAC-SHA256) библиотекой для JavaScript, например @noble/hashes

declare function loadCardSecret(userId: string): Promise<Buffer | null>;

export async function verifyCardCode(code: string): Promise<string | null> {
  const [prefix, userId, stepRaw, sig] = code.split('.');
  if (prefix !== 'PNK1' || !userId || !stepRaw || !sig) return null;
  const step = Number(stepRaw);
  const nowStep = Math.floor(Date.now() / 1000 / STEP_SEC);
  if (!Number.isInteger(step) || Math.abs(nowStep - step) > 1) return null; // ±30 с — на расхождение часов
  const secret = await loadCardSecret(userId);
  if (!secret) return null;
  const expected = mac(secret, userId, step);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  // Один код — одно сканирование: тот же снимок экрана второй раз не пройдёт
  const first = await redis.set('card-code:' + code, '1', 'EX', 90, 'NX');
  return first === null ? null : userId;
}
// Сканирует сотрудник? Начисление на коды сотрудников по чужим чекам — не больше 2 в день,
// всё — в отчёт владелице «кто, кому, сколько»

// ═══ КАК НЕ НАДО ═══
// UPDATE users SET points = points + 20 WHERE id = $1    -- и больше ничего  // [!error] через месяц не объяснить ни одного числа
// начислять при оплате                                    // [!error] отменили заказ — бонусы остались
// QR = 'PNK:' + userId                                    // [!error] снимок экрана — и чужие бонусы потрачены
`;

  protected readonly pushRegistration = `
// ═══ 1. ПРИЛОЖЕНИЕ: СПРОСИТЬ ВОВРЕМЯ, ПОЛУЧИТЬ ТОКЕН, ОТДАТЬ БЭКЕНДУ (expo-notifications) ═══
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';

declare function deviceId(): Promise<string>;
declare function openOrderScreen(orderId: string): void;

// Android: каналы — человек выключит «Акции», оставив «Заказы», прямо в настройках телефона
export async function setupChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('orders', {
    name: 'Заказы',
    importance: Notifications.AndroidImportance.HIGH, // со звуком и всплывающим окном
  });
  await Notifications.setNotificationChannelAsync('promo', {
    name: 'Акции',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

// Вызывается ПОСЛЕ первого заказа и только после «Да, сообщить» на своём экране
export async function enableOrderNotifications(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted && current.canAskAgain) {
    granted = (await Notifications.requestPermissionsAsync()).granted; // на iPhone системный вопрос — один раз
  }
  if (!granted) return false; // в профиле: «Уведомления выключены — включить в настройках телефона»
  await registerToken();
  return true;
}

// При КАЖДОМ запуске: токен может смениться — переустановка, восстановление телефона из копии
export async function registerToken(): Promise<void> {
  if (!(await Notifications.getPermissionsAsync()).granted) return;
  const token = await Notifications.getDevicePushTokenAsync(); // { type: 'ios' | 'android', data: '…' }
  await api('/api/push-tokens', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transport: token.type === 'ios' ? 'apns' : 'fcm', token: token.data, deviceId: await deviceId() }),
  });
}

// Нажали на уведомление — сразу экран заказа, а не главная
Notifications.addNotificationResponseReceivedListener((response) => {
  const orderId = response.notification.request.content.data?.['orderId'];
  if (typeof orderId === 'string') openOrderScreen(orderId);
});

// ═══ 2. БЭКЕНД: ОДНО УСТРОЙСТВО — ОДИН ТОКЕН ═══
// CREATE TABLE push_tokens (
//   user_id    uuid NOT NULL REFERENCES users (id),
//   device_id  text NOT NULL,
//   transport  text NOT NULL CHECK (transport IN ('apns', 'fcm', 'rustore')),
//   token      text NOT NULL,
//   updated_at timestamptz NOT NULL DEFAULT now(),
//   PRIMARY KEY (user_id, device_id)
// );
//
// PUT /api/push-tokens:
//   DELETE FROM push_tokens WHERE token = $1 AND user_id <> $2;   -- на этом телефоне теперь вошёл другой гость
//   INSERT INTO push_tokens (user_id, device_id, transport, token) VALUES ($2, $3, $4, $1)
//   ON CONFLICT (user_id, device_id) DO UPDATE SET token = EXCLUDED.token, transport = EXCLUDED.transport, updated_at = now();
// Выход из аккаунта: DELETE FROM push_tokens WHERE user_id = $1 AND device_id = $2

// ═══ 3. ВОРКЕР: «ЗАКАЗ ГОТОВ» ═══
import { db } from './db';

type SendResult = 'ok' | 'unregistered' | 'retry';
declare function sendApns(token: string, payload: object): Promise<SendResult>;
declare function sendFcm(message: object): Promise<SendResult>;
declare function sendRustore(token: string, message: object): Promise<SendResult>;

export async function notifyOrderReady(orderId: string): Promise<void> {
  const { rows } = await db.query<{ user_id: string; number: number; pickup_hint: string }>(
    'SELECT o.user_id, o.number, s.pickup_hint FROM orders o JOIN shops s ON s.id = o.shop_id WHERE o.id = $1',
    [orderId],
  );
  const order = rows[0];
  if (!order) return;
  const title = 'Заказ № ' + order.number + ' готов';
  const body = order.pickup_hint; // «Полка у окна» — без имени, телефона и состава: это видно на экране блокировки

  const tokens = await db.query<{ device_id: string; transport: string; token: string }>(
    'SELECT device_id, transport, token FROM push_tokens WHERE user_id = $1',
    [order.user_id],
  );
  for (const t of tokens.rows) {
    let result: SendResult;
    if (t.transport === 'apns') {
      // HTTP/2 POST https://api.push.apple.com/3/device/<token>
      // заголовки: apns-topic: ru.penka.app, apns-push-type: alert; вход — JWT, подписанный ключом .p8
      result = await sendApns(t.token, { aps: { alert: { title, body }, sound: 'default' }, orderId });
    } else if (t.transport === 'fcm') {
      // POST https://fcm.googleapis.com/v1/projects/<project>/messages:send — токен сервисного аккаунта
      result = await sendFcm({
        message: { token: t.token, notification: { title, body }, data: { orderId }, android: { notification: { channel_id: 'orders' } } },
      });
    } else {
      result = await sendRustore(t.token, { notification: { title, body }, data: { orderId } });
    }
    if (result === 'unregistered') {
      // APNs ответил 410, FCM — UNREGISTERED: приложение удалили или токен сменился
      await db.query('DELETE FROM push_tokens WHERE user_id = $1 AND device_id = $2', [order.user_id, t.device_id]);
    }
  }
}
// Рекламные — другим воркером: только с отдельным согласием, канал 'promo', не с 21:00 до 9:00 по времени гостя

// ═══ КАК НЕ НАДО ═══
// await Notifications.requestPermissionsAsync() — на первом экране   // [!error] «Нет» навсегда, до настроек
// body: 'Катя, ваш капучино на овсяном и сырник готовы'              // [!error] личное — на экране блокировки
// токен сохранили при регистрации — и больше не обновляли            // [!error] через месяц половина push в пустоту
`;

  protected readonly deepLinks = `
// ═══ 1. САЙТ: https://penka.example/.well-known/apple-app-site-association ═══
// Отдаётся как application/json, без перенаправлений, без расширения .json в адресе
const appleAppSiteAssociation = {
  applinks: {
    details: [
      {
        appIDs: ['ABCDE12345.ru.penka.app'],  // идентификатор команды в Apple Developer + идентификатор приложения
        components: [
          { '/': '/order/*' },                // экран заказа
          { '/': '/pay/return*' },            // возврат из платёжной формы
          { '/': '/menu/*' },                 // ссылка на позицию меню: «попробуй тыквенный латте»
          { '/': '/table/*' },                // QR на столике
        ],
      },
    ],
  },
};

// ═══ 2. САЙТ: https://penka.example/.well-known/assetlinks.json ═══
const assetLinks = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'ru.penka.app',
      sha256_cert_fingerprints: [
        '3A:91:…:7C', // ключ, которым Google Play подписывает приложение (из кабинета Play Console)
        'B4:0E:…:12', // наш собственный ключ — им подписана версия для RuStore
      ],
    },
  },
];

// ═══ 3. ПРИЛОЖЕНИЕ: app.config.ts (Expo) ═══
export default {
  name: 'Пенка',
  slug: 'penka',
  scheme: 'penka',                                   // запасная своя схема: penka://order/47
  ios: {
    bundleIdentifier: 'ru.penka.app',
    associatedDomains: ['applinks:penka.example'],   // «мои ссылки — на этом сайте»
  },
  android: {
    package: 'ru.penka.app',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,                            // проверить assetlinks.json при установке
        data: [
          { scheme: 'https', host: 'penka.example', pathPrefix: '/order' },
          { scheme: 'https', host: 'penka.example', pathPrefix: '/pay/return' },
          { scheme: 'https', host: 'penka.example', pathPrefix: '/menu' },
          { scheme: 'https', host: 'penka.example', pathPrefix: '/table' },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: ['expo-router'],
};

// ═══ 4. ЭКРАН ПО ССЫЛКЕ (expo-router: файл app/order/[id].tsx ↔ адрес /order/47) ═══
// export default function OrderScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const order = useQuery({ queryKey: ['order', id], queryFn: () => api('/api/orders/' + id) });
//   // 404 от сервера — «Заказ не найден»: чужой заказ по ссылке не покажут, это проверяет сервер
// }
//
// app/pay/return.tsx — пришли из платёжной формы:
//   WebBrowser.dismissBrowser();            // закрыть встроенный браузер с формой
//   router.replace('/order/' + order);      // экран заказа с «Проверяем оплату…» — а не «Оплачено!»

// ═══ КАК НЕ НАДО ═══
// https://penka.example/promo/apply?code=AUTUMN   — применяется само при открытии   // [!error] ссылку разошлют по чатам
// penka://order/47 — в SMS и письмах                // [!error] без приложения не откроется ничего
// assetlinks.json с отпечатком только ключа загрузки // [!error] у гостей из Google Play откроется сайт
`;

  protected readonly permissions = `
// ═══ 1. app.config.ts: ТЕКСТЫ, КОТОРЫЕ УВИДИТ ЧЕЛОВЕК ═══
export const permissionTexts = {
  ios: {
    infoPlist: {
      // Конкретная польза — и правда. «Приложению нужна геолокация» проверка отклонит
      NSLocationWhenInUseUsageDescription:
        'Чтобы показать ближайшую кофейню «Пенки». Геолокация не сохраняется и никому не передаётся.',
    },
  },
  android: {
    // Только то, что нужно: приблизительная и точная — при использовании; фоновой нет
    permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    blockedPermissions: ['android.permission.ACCESS_BACKGROUND_LOCATION', 'android.permission.CAMERA'],
  },
};

// ═══ 2. ВЫБОР КОФЕЙНИ: СНАЧАЛА СВОЁ ОБЪЯСНЕНИЕ, ПОТОМ СИСТЕМНЫЙ ВОПРОС ═══
import * as Location from 'expo-location';

type Shop = { id: string; title: string; lat: number; lon: number };
declare function askOurselves(text: string): Promise<boolean>; // свой экран: «Найти ближайшую?» — «Да» / «Выберу сам»

export async function nearestShops(shops: Shop[], lastChosenId: string | null): Promise<Shop[]> {
  const fallback = () => [...shops].sort((a, b) =>
    a.id === lastChosenId ? -1 : b.id === lastChosenId ? 1 : a.title.localeCompare(b.title, 'ru'));

  let perm = await Location.getForegroundPermissionsAsync();
  if (!perm.granted && perm.canAskAgain) {
    const wants = await askOurselves('Найти ближайшую к вам кофейню? Для этого нужна геолокация.');
    if (!wants) return fallback();
    perm = await Location.requestForegroundPermissionsAsync(); // системный вопрос — только после «Да»
  }
  if (!perm.granted) return fallback();     // отказ — не тупик: список по адресам, последняя выбранная наверху

  // Низкая точность: для «ближайшей из трёх кофеен» хватает района, и это быстрее и бережнее к батарее
  const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
  const d = (s: Shop) => Math.hypot(s.lat - here.coords.latitude, (s.lon - here.coords.longitude) * Math.cos((s.lat * Math.PI) / 180));
  return [...shops].sort((a, b) => d(a) - d(b)); // координаты гостя никуда не отправляем — считаем на телефоне
}

// ═══ КАК НЕ НАДО ═══
// useEffect(() => { requestAll() }, [])  — уведомления, геолокация, камера на первом экране  // [!error] три «Нет» подряд
// if (!perm.granted) return <Text>Без геолокации приложение не работает</Text>               // [!error] тупик вместо списка
// await api('/api/track', { body: JSON.stringify(here.coords) })                             // [!error] обещали «не сохраняется»
`;

  protected readonly mobileSecurity = `
// ═══ 1. ЧТО ВИДИТ ЛЮБОЙ, КТО РАЗОБРАЛ ПРИЛОЖЕНИЕ ═══
// Всё это — в файле приложения или в его трафике, и это нормально:
const API_BASE = 'https://api.penka.example';  // адрес API
const MAPS_KEY = 'pk_…';                        // ключ карт — ограничен в кабинете сервиса:
                                                 // только для ru.penka.app, не больше 10 000 запросов в сутки
// А этого в приложении быть не должно никогда:
// const YOOKASSA_SECRET_KEY = '…'   // [!error] возвраты и платежи от имени «Пенки»
// const SMS_API_KEY = '…'           // [!error] SMS на платные номера за ваш счёт
// const ADMIN_TOKEN = '…'           // [!error] админка для всех, кто заглянул в файл

// ═══ 2. СЕРВЕР: ПРАВА — ПО ТОМУ, КТО ВОШЁЛ, А НЕ ПО ТОМУ, ОТКУДА ЗАПРОС ═══
import type { Request, Response, NextFunction } from 'express';

type Principal =
  | { kind: 'guest'; userId: string }
  | { kind: 'shop_tablet'; shopId: string }           // планшет входит от имени кофейни
  | { kind: 'manager'; userId: string; mfa: boolean }; // владелица и управляющие — с вторым фактором

declare function principalOf(req: Request): Principal | null; // из токена доступа
declare function loadOrderOwner(orderId: string): Promise<{ user_id: string; shop_id: string } | null>;

export function canSeeOrder(p: Principal, order: { user_id: string; shop_id: string }): boolean {
  if (p.kind === 'guest') return p.userId === order.user_id;      // только свой заказ
  if (p.kind === 'shop_tablet') return p.shopId === order.shop_id; // только заказы своей кофейни
  return p.mfa;                                                    // управляющие — только со вторым фактором
}

export async function requireOrderAccess(req: Request, res: Response, next: NextFunction) {
  const p = principalOf(req);
  const orderId = String(req.params['id']);
  const order = p ? await loadOrderOwner(orderId) : null;
  if (!p || !order || !canSeeOrder(p, order)) {
    res.status(404).json({ code: 'not_found' }); // чужой заказ — «не найден», а не «запрещено»: не подтверждаем, что он есть
    return;
  }
  next();
}

// ═══ 3. ЧТО ПЛАНШЕТ МОЖЕТ, А ЧТО НЕТ ═══
const TABLET_ACTIONS = new Set(['order.accept', 'order.prepare', 'order.ready', 'order.pickup', 'stoplist.set', 'card.scan']);
// 'refund', 'menu.edit', 'price.edit', 'report.view', 'points.manual' — только manager с mfa: true

export function allowed(p: Principal, action: string): boolean {
  if (p.kind === 'shop_tablet') return TABLET_ACTIONS.has(action);
  if (p.kind === 'manager') return p.mfa;
  return false; // гостю — только свои заказы, корзина и профиль, через отдельные обработчики
}

// ═══ КАК НЕ НАДО ═══
// if (req.get('User-Agent')?.includes('PenkaApp')) allowAdmin()   // [!error] заголовок подделывается одной строкой
// const total = req.body.totalKopecks                              // [!error] кофе за рубль
// PATCH /api/orders/47 { "status": "picked_up" } от гостя — принят  // [!error] бонусы за невыданный заказ
`;

  protected readonly deleteAccount = `
// ═══ УДАЛЕНИЕ АККАУНТА: ЛИЧНОЕ — УДАЛИТЬ, УЧЁТНОЕ — ОБЕЗЛИЧИТЬ ═══
// Профиль → «Удалить аккаунт» → экран последствий → свежий код из SMS → POST /api/account/delete
// Та же процедура — на странице https://penka.example/account/delete (требование Google Play)
import type { Tx } from './db';
import { db } from './db';
import { verifyOtpForAction } from './auth';
import { audit } from './audit';

type DeleteResult =
  | { ok: true }
  | { ok: false; code: 'wrong_code' | 'active_order'; activeOrderNumber?: number };

export async function deleteAccount(userId: string, phone: string, otp: string): Promise<DeleteResult> {
  // Свежий код: человек с чужим разблокированным телефоном аккаунт не удалит
  if (!(await verifyOtpForAction(phone, otp, 'delete_account'))) return { ok: false, code: 'wrong_code' };

  return db.tx(async (tx: Tx): Promise<DeleteResult> => {
    await tx.query('SELECT 1 FROM users WHERE id = $1 FOR UPDATE', [userId]); // пока удаляем — никаких новых заказов
    const active = await tx.query<{ number: number }>(
      "SELECT number FROM orders WHERE user_id = $1 AND status IN ('awaiting_payment', 'paid', 'accepted', 'preparing', 'ready') LIMIT 1",
      [userId],
    );
    if (active.rows[0]) {
      return { ok: false, code: 'active_order', activeOrderNumber: active.rows[0].number }; // «Сначала заберите заказ № 47»
    }

    // 1. Удаляем личное
    await tx.query('DELETE FROM push_tokens WHERE user_id = $1', [userId]);
    await tx.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);  // все устройства выходят
    await tx.query('DELETE FROM card_secrets WHERE user_id = $1', [userId]);    // QR-код карты больше не работает
    await tx.query('DELETE FROM favorites WHERE user_id = $1', [userId]);
    await tx.query('DELETE FROM marketing_consents WHERE user_id = $1', [userId]);

    // 2. Бонусы сгорают — строкой в журнале, как и всё остальное
    await tx.query(
      \`INSERT INTO loyalty_entries (user_id, delta, kind, actor, comment)
       SELECT id, -points, 'expire', 'system', 'account deleted' FROM users WHERE id = $1 AND points > 0\`,
      [userId],
    );

    // 3. Обезличиваем учётное: заказы, платежи и чеки хранятся по требованиям учёта, но ничьи
    await tx.query(
      \`UPDATE users
          SET phone = NULL, name = NULL, email = NULL, points = 0,
              deleted_at = now()                  -- строка остаётся, чтобы ссылки из заказов не порвались
        WHERE id = $1\`,
      [userId],
    );
    // В orders, payments, loyalty_entries остаётся только user_id — указатель на пустую строку без имени и телефона

    await audit(tx, { action: 'account.delete', targetUserId: userId }); // кто и когда — без телефона в журнале
    return { ok: true };
  });
}
// Резервные копии: удалённые данные исчезнут из них, когда старые копии будут перезаписаны по графику;
// срок хранения копий записан в политике обработки данных

// ═══ КАК НЕ НАДО ═══
// UPDATE users SET deleted = true WHERE id = $1                // [!error] номер, история и push остались навсегда
// DELETE FROM users WHERE id = $1  — каскадом вместе с заказами  // [!error] из учёта пропали продажи и чеки
// удаление — только «напишите в поддержку»                     // [!error] App Store отклонит версию
`;

  protected readonly testingMatrix = `
═══ МАТРИЦА ПРОВЕРОК «ПЕНКИ» ПЕРЕД КАЖДЫМ ВЫПУСКОМ ═══

УСТРОЙСТВА (на столе у Ани — пять телефонов, остальное — в облачной ферме устройств)
  iPhone с самой старой поддерживаемой iOS · новый iPhone
  дешёвый Android, 3 ГБ памяти · флагман Android
  Huawei без сервисов Google · маленький экран (≈ 5 дюймов)

НАСТРОЙКИ ТЕЛЕФОНА
  [ ] шрифт увеличен до максимума — кнопка «Оплатить» видна и нажимается
  [ ] тёмная тема — нет белого текста на белом
  [ ] режим экономии энергии — статус заказа обновляется при открытии
  [ ] часы телефона спешат на 10 минут — время готовности и QR-код работают

СЕТЬ
  [ ] медленная сеть (эмуляция 3G) — меню из копии сразу, свежее следом
  [ ] авиарежим посреди «Оформить» — повтор с тем же ключом, один заказ
  [ ] Wi-Fi «с ловушкой» — понятная ошибка, а не пустой экран

ЖИЗНЕННЫЙ ЦИКЛ
  [ ] ушли в приложение банка для СБП, приложение «Пенки» выгружено — после возврата
      экран заказа и «Проверяем оплату…», а не пустая корзина
  [ ] уведомление пришло, когда приложение закрыто, — нажатие открывает заказ
  [ ] перезапуск без связи — меню, бонусы и последний заказ на месте

РАЗРЕШЕНИЯ
  [ ] уведомления запрещены — статус заказа виден на экране, подсказка в профиле
  [ ] геолокация запрещена — список кофеен по адресам

ВЕРСИИ
  [ ] тесты контракта: ответы сервера подходят версиям 1.0–1.4 (запускаются на каждом изменении сервера)
  [ ] версия ниже minSupported — экран «Обновите приложение» с рабочей кнопкой магазина
  [ ] обновление поверх прошлой версии — вход, корзина и настройки сохранились
`;

  protected readonly e2eFlow = `
# ═══ СКВОЗНОЙ СЦЕНАРИЙ MAESTRO: ВХОД → ЗАКАЗ → ОПЛАТА ═══
# Запуск: maestro test -e TEST_CARD=<номер из документации платёжного сервиса> flows/order.yaml
# на эмуляторе, против тестового сервера и тестового режима платёжного сервиса
appId: ru.penka.app
---
- launchApp:
    clearState: true                 # как будто приложение только что установили
- tapOn: "Войти"
- tapOn: "Номер телефона"
- inputText: "9990000001"            # тестовый номер: сервер знает код заранее, SMS не уходит
- tapOn: "Получить код"
- inputText: "1234"
- assertVisible: "Меню"

- tapOn: "Капучино"
- tapOn: "0,4 л"
- tapOn: "Овсяное"
- tapOn: "В корзину"
- tapOn: "Корзина"
- assertVisible: "330 ₽"             # 220 + 60 за размер + 50 за овсяное — сумму считает сервер
- tapOn: "Оформить"

- tapOn: "Оплатить"
- inputText: \${TEST_CARD}           # тестовая карта: настоящие карты в тестовом режиме не работают
- tapOn: "Заплатить"
- extendedWaitUntil:
    visible: "Заказ № .* принят"     # номер каждый раз свой — проверяем шаблоном
    timeout: 20000                   # вебхук и проверка статуса — несколько секунд
`;

  protected readonly appConfig = `
// ═══ app.config.ts: ОДИН ФАЙЛ — ТРИ ОКРУЖЕНИЯ ═══
import type { ExpoConfig } from 'expo/config';

const ENV = process.env['APP_ENV'] ?? 'development'; // задаётся профилем сборки в eas.json

const API_URL = {
  development: 'https://api.staging.penka.example',
  preview: 'https://api.staging.penka.example',     // тестировщики — тоже в тестовый сервер
  production: 'https://api.penka.example',
}[ENV];

const config: ExpoConfig = {
  name: ENV === 'production' ? 'Пенка' : 'Пенка (тест)', // тестовую сборку не перепутать с настоящей
  slug: 'penka',
  version: '1.4.0',                // видит гость; растёт с каждым выпуском
  runtimeVersion: { policy: 'appVersion' }, // для обновлений без магазина — раздел про обновления
  ios: {
    bundleIdentifier: ENV === 'production' ? 'ru.penka.app' : 'ru.penka.app.dev', // навсегда
    supportsTablet: false,
  },
  android: {
    package: ENV === 'production' ? 'ru.penka.app' : 'ru.penka.app.dev',          // навсегда
  },
  extra: { apiUrl: API_URL, env: ENV }, // приложение читает адрес API отсюда — секретов здесь нет
};

export default config;
// Номер сборки (iOS buildNumber, Android versionCode) хранит и увеличивает сервис сборки — см. eas.json
`;

  protected readonly easJson = `{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "APP_ENV": "preview" },
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "APP_ENV": "production" }
    },
    "rustore": {
      "extends": "production",
      "android": { "buildType": "apk" }
    }
  },
  "submit": {
    "production": {
      "android": { "track": "internal" }
    }
  }
}`;

  protected readonly storeChecklist = `
═══ ПЕРЕД ОТПРАВКОЙ НА ПРОВЕРКУ: ТРИ МАГАЗИНА ═══

                                         App Store       Google Play      RuStore
  ───────────────────────────────────    ─────────────   ──────────────   ───────────
  Аккаунт разработчика                   99 $ в год      25 $ однажды     нужен
  D-U-N-S для организации                нужен           нужен            —
  Проверка                               человек,        в основном       своя
                                         часы — дни      автоматическая   модерация
  Тест на людях до выпуска               TestFlight      закрытый тест    —
  Поэтапный выпуск                       7 дней          доля на выбор    —
  Подпись                                сертификаты     ключ Google      ваш ключ
                                         Apple           (или ваш)

СТРАНИЦА ПРИЛОЖЕНИЯ
  [ ] Название, короткое и полное описание — о том, что приложение делает на самом деле
  [ ] Иконка; снимки экранов для нескольких размеров — настоящие экраны, не реклама
  [ ] Возрастной рейтинг по анкете магазина; категория «Еда и напитки»
  [ ] Адрес политики обработки персональных данных — открывается без входа
  [ ] App Privacy (Apple) и Data safety (Google) — включая данные встроенных библиотек
  [ ] Ссылка на удаление аккаунта на сайте — для Google Play

ДЛЯ ПРОВЕРЯЮЩЕГО
  [ ] Тестовый номер и код в заметках для проверки: «+7 999 000-00-01, код 1234»
  [ ] На тестовом номере — бонусы и история заказов, чтобы было что посмотреть
  [ ] Объяснение, почему оплата идёт не через встроенную оплату магазина:
      «кофе и выпечка — физические товары, получаемые в кофейне (правило 3.1.3(e))»

ТЕХНИКА
  [ ] Целевая версия Android — та, которую Google требует сейчас (с 31.08.2026 — Android 16, API 36)
  [ ] Номер сборки больше, чем у прошлой загрузки
  [ ] Тексты разрешений — конкретные; лишних разрешений нет
  [ ] Сервер уже поддерживает новую версию — она может выйти в любой день проверки
`;

  protected readonly updatesPolicy = `
// ═══ ПРИ ЗАПУСКЕ: СНАЧАЛА «ПОДДЕРЖИВАЕТСЯ ЛИ», ПОТОМ — ТИХОЕ ОБНОВЛЕНИЕ КОДА ═══
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { api } from './api';
import { compareVersions } from '@penka/shared';

type AppConfig = { minSupported: string; latest: string; storeUrl: string; features: Record<string, boolean> };

export type StartupVerdict =
  | { kind: 'blocked'; storeUrl: string }      // экран «Обновите приложение, чтобы продолжить»
  | { kind: 'ok'; softUpdate: boolean; features: Record<string, boolean> };

export async function onStartup(cached: AppConfig | null): Promise<StartupVerdict> {
  const version = Application.nativeApplicationVersion ?? '0.0.0';
  let config = cached;
  try {
    config = await api<AppConfig>('/api/config', { timeoutMs: 4000 });
  } catch {
    // Нет связи — живём по прошлым настройкам: не блокируем гостя в метро из-за отсутствия ответа
  }
  if (config && compareVersions(version, config.minSupported) < 0) {
    return { kind: 'blocked', storeUrl: config.storeUrl };
  }
  void fetchCodeUpdateInBackground(); // не ждём: гость уже смотрит меню
  return {
    kind: 'ok',
    softUpdate: !!config && compareVersions(version, config.latest) < 0, // плашка «Доступно обновление»
    features: config?.features ?? {},
  };
}

// Обновление JavaScript и картинок без магазина: скачать сейчас, применить при следующем запуске.
// Подходит только к той нативной части, что уже стоит у гостя (runtimeVersion в app.config.ts)
async function fetchCodeUpdateInBackground(): Promise<void> {
  if (__DEV__) return;
  try {
    const check = await Updates.checkForUpdateAsync();
    if (check.isAvailable) await Updates.fetchUpdateAsync(); // ляжет на диск и включится при следующем запуске
  } catch {
    // не получилось — ничего страшного: попробуем при следующем запуске
  }
}
// Updates.reloadAsync() — перезапуск с новым кодом прямо сейчас — только на экранах без заказа,
// например при возврате на главный экран после долгой паузы, и никогда — посреди оплаты

// ═══ ЧТО МОЖНО ВЫПУСКАТЬ ОБНОВЛЕНИЕМ БЕЗ МАГАЗИНА, А ЧТО НЕТ ═══
// + исправить текст, вёрстку, ошибку в логике экрана        — JavaScript
// + заменить картинку-заглушку                             — ресурсы
// новое разрешение (камера, геолокация в фоне)              // [!error] нативная часть — только через магазин
// новая библиотека с нативным кодом                         // [!error] пакет не подойдёт к старой нативной части
// «раздел доставки», которого не было на проверке           // [!error] новая функция в обход проверки магазина
`;

  protected readonly analyticsEvents = `
// ═══ 1. ОТЧЁТЫ О ПАДЕНИЯХ: БЕЗ ЛИЧНЫХ ДАННЫХ ═══
import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

Sentry.init({
  dsn: 'https://…@sentry.example/12', // адрес приёма отчётов — не секрет, его и так видно в приложении
  release: 'penka@' + Application.nativeApplicationVersion, // всё разбивается по версии
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Последний рубеж: вычищаем номера телефонов, если они всё-таки попали в текст ошибки
    const scrub = (s?: string) => s?.replace(/\\+?[78][\\s(-]*9\\d{2}[\\s)-]*\\d{3}[\\s-]*\\d{2}[\\s-]*\\d{2}/g, '[phone]');
    if (event.message) event.message = scrub(event.message);
    for (const ex of event.exception?.values ?? []) ex.value = scrub(ex.value);
    return event;
  },
});
// После входа — только внутренний id, без телефона и имени
export const identify = (userId: string) => Sentry.setUser({ id: userId });

// ═══ 2. ВОРОНКА: СТРОГИЙ СПИСОК СОБЫТИЙ ═══
type AnalyticsEvent =
  | { name: 'menu_opened'; shopId: string }
  | { name: 'item_added'; itemId: string; fromCache: boolean }
  | { name: 'checkout_started'; items: number; totalKopecks: number }
  | { name: 'order_created'; orderId: string; slotShiftedMin: number }  // предложили время позже — на сколько
  | { name: 'payment_opened'; method: 'card' | 'sbp' }
  | { name: 'payment_result'; result: 'paid' | 'not_paid' | 'unknown'; seconds: number }
  | { name: 'push_prompt'; answer: 'yes' | 'not_now' | 'denied_by_system' }
  | { name: 'order_picked_up'; minutesAfterReady: number };

declare function sendToAnalytics(e: AnalyticsEvent & { appVersion: string; platform: string }): void;

export function track(e: AnalyticsEvent): void {
  // Ни телефона, ни имени, ни состава заказа — только то, что отвечает на вопрос «где уходят»
  sendToAnalytics({ ...e, appVersion: Application.nativeApplicationVersion ?? '0.0.0', platform: Platform.OS });
}

// Вопрос «где теряем гостей на оплате» отвечается тремя событиями:
//   checkout_started → payment_opened → payment_result: 'paid'
//   из 100 начавших: 97 открыли форму, 61 оплатили → смотрим payment_result по method:
//   СБП — 41 из 70, карта — 20 из 27 → проблема в возврате из приложения банка

// ═══ КАК НЕ НАДО ═══
// track({ name: 'login', phone })                         // [!error] телефоны всех гостей — в стороннем сервисе
// track({ name: 'Order Created' }) и track({ name: 'orderCreated' })  // [!error] одно событие под двумя именами
// Sentry.setUser({ phone, name })                          // [!error] личное — в каждом отчёте о падении
`;

  protected readonly mobileStack = `
═══ СТЕК «ПЕНКИ»: ПРИЛОЖЕНИЕ, БЭКЕНД, СЕРВИСЫ ═══

  Часть                Выбор                                   Почему
  ───────────────────  ──────────────────────────────────────  ──────────────────────────────────
  Приложение           React Native + Expo, TypeScript         одна кодовая база, команда знает React
  Экраны и ссылки      expo-router                             адрес /order/47 = файл app/order/[id]
  Данные и кэш         TanStack Query + копия на диске         сохранённое сразу, свежее следом
  Токены               expo-secure-store                       Keychain и Keystore
  Push                 expo-notifications → APNs, FCM;         RuStore Push — когда понадобится
                       RuStore Push позже
  Сборка и обновления  EAS Build, EAS Update                   облачные сборки, исправления без магазина
  Падения              Sentry или AppMetrica                   с первой версии, по версиям
  E2E                  Maestro                                 сценарии на YAML

  Бэкенд               Node.js + TypeScript                    общие типы с приложением
  База                 PostgreSQL                              заказы, бонусы, ключи повтора, задачи
  Временное            Redis                                   коды входа, лимиты, одноразовые QR
  Картинки             объектное хранилище + CDN               несколько размеров, WebP
  Оплата               платёжный сервис с СБП и чеками         без встроенной оплаты магазина
  SMS                  SMS-сервис, только российские номера    коды входа, с лимитами
  Планшет бариста      веб-страница + SSE                      новые заказы сразу и со звуком
  Хостинг              российское облако                       персональные данные гостей

═══ ОБЯЗАТЕЛЬНЫЕ ПЛАТЕЖИ ═══

  Apple Developer Program        99 $ в год
  Google Play Console            25 $ один раз
  SMS                            несколько рублей за код — главная переменная статья
  Серверы                        как у небольшого сайта

═══ НЕ БРАТЬ В ПЕРВУЮ ВЕРСИЮ ═══

  Два нативных приложения        одна кодовая база справится
  Микросервисы и GraphQL-шлюз    один бэкенд, одна база
  Свой сервер push               только APNs, FCM, RuStore Push — другого пути нет
  Офлайн-заказы «в очередь»      без связи заказ не оформить: оплата и время — онлайн
  Чат с бариста                  уведомления о статусе решают ту же задачу
  Закрепление сертификата        старые версии сломаются при смене сертификата
`;

  protected readonly mobileLaunch = `
═══ ПЕРЕД ЗАПУСКОМ ПРИЛОЖЕНИЯ «ПЕНКИ» ═══

НЕОБРАТИМОЕ — ПРОВЕРИТЬ ДВАЖДЫ
  [ ] Идентификатор ru.penka.app — окончательный
  [ ] Ключ подписи Android и пароли — в хранилище секретов, копия у второго человека
  [ ] Запрос /api/config и экран «Обновите приложение» — в версии 1.0
  [ ] Незнакомые значения (статусы, способы оплаты) — запасной вариант, а не падение

ВЕРСИИ И API
  [ ] Каждый запрос несёт X-App-Version и X-Platform
  [ ] Тесты контракта от каждой выпущенной версии — в сборке сервера
  [ ] Флаги возможностей — выключают сломанное без выпуска

ВХОД И БЕЗОПАСНОСТЬ
  [ ] Коды: 5 минут, 5 попыток, лимиты по номеру, адресу и устройству
  [ ] Ротация токенов обновления; токен — в SecureStore; один обмен на все запросы
  [ ] В приложении нет секретных ключей; ключ карт ограничен идентификатором приложения
  [ ] Сервер проверяет цены, бонусы, владельца заказа и переходы состояний
  [ ] Планшет — только права кофейни; админка — с паролем и вторым фактором

СЕТЬ, ЗАКАЗ, ОПЛАТА
  [ ] Таймаут на каждый запрос; ключ повтора на заказ и оплату
  [ ] Окна готовности с ёмкостью; неоплаченные — отмена через 15 минут
  [ ] Оплата: сумма из базы, вебхук проверяется запросом статуса, оплата после отмены — возврат
  [ ] Чек — из состава заказа; настройки чека — от бухгалтера

БОНУСЫ И УВЕДОМЛЕНИЯ
  [ ] Журнал операций; начисление после выдачи; уникальность «вид операции + заказ»
  [ ] QR на кассе — 30 секунд, одно сканирование
  [ ] Разрешение на push — после первого заказа, своим экраном; каналы «Заказы» и «Акции»
  [ ] Протухшие токены удаляются; при открытии приложение само спрашивает статус

МАГАЗИНЫ
  [ ] Аккаунты Apple, Google Play, RuStore; D-U-N-S; способ оплаты взносов
  [ ] Политика данных, App Privacy, Data safety — честно, с данными библиотек
  [ ] Удаление аккаунта в приложении и на сайте
  [ ] Тестовый номер и код — в заметках для проверяющего
  [ ] Целевая версия Android — по текущему требованию Google
  [ ] Глубокие ссылки проверены на версии из магазина (отпечатки всех подписей)

ВЫПУСК И НАБЛЮДЕНИЕ
  [ ] Закрытый тест две недели: бариста и постоянные гости
  [ ] Поэтапный выпуск; отчёты о падениях каждый день; цель — 99,5 % гостей без падений
  [ ] Воронка: меню → корзина → оформление → оплата → выдача
  [ ] Запуск в одной кофейне, неделя наблюдений, потом остальные
`;
}
