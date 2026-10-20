import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-recipes-marketplace',
  imports: [CodeBlock, RouterLink],
  templateUrl: './marketplace.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemRecipesMarketplace {
  protected readonly threeParties = `

═══ ОДНА ПОКУПКА НА «РЕМЕСЛЕ» — ГЛАЗАМИ ПОКУПАТЕЛЬНИЦЫ ═══

  кто       Анна из Перми, ищет подарок маме
  что       кружка «Утро», графит, 350 мл — «Обжиг»          1 450 ₽
            скатерть льняная 140 × 180, цвет «овёс» — «Лён и нить»  3 900 ₽
  доставка  до пункта выдачи: «Обжиг» 390 ₽, «Лён и нить» 350 ₽
  итого     6 090 ₽ — одной оплатой

  ЧТО ВИДИТ АННА — пять её действий
    1. находит обе вещи в поиске «Ремесла»
    2. кладёт их в одну корзину
    3. выбирает пункт выдачи — площадка сама показывает две доставки
    4. платит один раз 6 090 ₽
    5. получает две посылки и оставляет отзыв о кружке


═══ ЧТО В ЭТО ВРЕМЯ ДЕЛАЕТ ПЛОЩАДКА ═══

  ДО ОПЛАТЫ
     1. делит корзину на два заказа продавцов: R-20431-1 «Обжиг»,
        R-20431-2 «Лён и нить» — у каждого свой состав, доставка и статус
     2. берёт цены из базы, а не из браузера; проверяет остатки у КАЖДОГО
        продавца и резервирует (как в рецепте про магазин)
     3. считает комиссию площадки — 12 % от цены товаров:
          «Обжиг»       1 450 × 12 % = 174 ₽
          «Лён и нить»  3 900 × 12 % = 468 ₽
     4. создаёт ОДИН платёж на 6 090 ₽ с разбивкой по получателям

  ПОСЛЕ ОПЛАТЫ
     5. вебхук «оплачено» → перепроверка в API → оба заказа «оплачены»
     6. деньги НЕ уходят продавцам сразу: они удерживаются до получения
     7. каждый продавец видит в кабинете СВОЙ заказ и адрес пункта выдачи,
        но не видит чужую часть корзины
     8. чеки: на товары продавцов — с пометкой, что площадка действует
        как агент, и с ИНН продавца (раздел «Чеки и налоги на маркетплейсе»)
     9. продавцы отправляют посылки, вносят трек-номера

  ПОСЛЕ ПОЛУЧЕНИЯ
    10. Анна получила обе посылки; спор не открыт 7 дней → сделки завершены
    11. в журнале проводок деньги переходят «удержано» → «доступно продавцу»
    12. во вторник — выплаты:
          «Обжиг»       1 450 + 390 − 174 = 1 666 ₽
          «Лён и нить»  3 900 + 350 − 468 = 3 782 ₽
          площадке остаётся 174 + 468 = 642 ₽ комиссии
    13. Анна может оставить отзыв: площадка знает, что она ДЕЙСТВИТЕЛЬНО
        купила эту кружку, — отзыв помечается «покупка подтверждена»

  Проверка: 1 666 + 3 782 + 642 = 6 090 ₽ — сходится до рубля.


═══ ГДЕ НА ЭТОЙ СТРАНИЦЕ РАЗОБРАН КАЖДЫЙ ШАГ ═══

  шаг 1       «Корзина от разных продавцов: один заказ — несколько отправлений»
  шаги 3–4    «Чьи это деньги» и «Сплит-платёж в коде»
  шаги 6, 10  «Удержание денег до получения: безопасная сделка»
  шаги 11–12  «Баланс продавца и выплаты: журнал проводок»
  шаг 8       «Чеки и налоги на маркетплейсе»
  шаг 9       «Доставка: кто везёт и кто отвечает»
  шаг 13      «Отзывы и рейтинги: доверие, которое легко подделать»


═══ КАК НЕ НАДО ═══

  «Принимаем все 6 090 ₽ себе на счёт, а продавцам переводим вручную»     [!error]
  «Оплатили — сразу отдаём деньги продавцам, пусть сами разбираются»     [!error]
  «Один заказ на всю корзину, один статус, одна доставка»                 [!error]
  «Отзыв может оставить любой зарегистрированный»                         [!error]

  Как надо: схема расчётов, где деньги продавцов — не ваша выручка;
  удержание до получения; заказ на каждого продавца; отзывы — только
  после подтверждённой покупки.
`;

  protected readonly marketplaceTypes = `

═══ ТРИ ВОПРОСА, КОТОРЫЕ ОПРЕДЕЛЯЮТ ВАШ МАРКЕТПЛЕЙС ═══

  1. ЧТО ПРОДАЮТ
       товары         доставка, остатки, возвраты
       услуги         расписание, неявки, оплата после выполнения
       аренда         календарь, залог, двойные бронирования
       работа         этапы, приёмка, споры о качестве

  2. КТО И КОМУ
       B2C            предприниматели и самозанятые → людям
       C2C            люди → людям: продавец не предприниматель,
                      нужна безопасная сделка между незнакомцами
       B2B            организации → организациям: счета, отсрочки, документы

  3. КАК ГЛУБОКО ПЛОЩАДКА В СДЕЛКЕ
       доска объявлений   свела людей — дальше они сами
       сделка внутри      оплата, удержание, выплаты, споры — через площадку
       управляемая        площадка ещё и проверяет качество, назначает
                          исполнителя, хранит и возит товар


═══ «РЕМЕСЛО» ПО ЭТИМ ВОПРОСАМ ═══

  что продают     изделия ручной работы (керамика, лён, дерево, кожа)
                  + мастер-классы в мастерских продавцов
  кто и кому      ИП, самозанятые и небольшие мастерские → людям
  глубина         сделка внутри: оплата, удержание, выплаты, отзывы, споры;
                  склада нет — мастера отправляют посылки сами

  ЧТО ИЗ ЭТОГО СЛЕДУЕТ
    нужно           подключение продавцов, модерация, сплит-платёж,
                    удержание, баланс и выплаты, отзывы, споры, расписание
    не нужно        склад, приёмка товара, своя доставка, сборка заказов


═══ ПОЧЕМУ НИША ═══

                         площадка «всё для всех»   нишевая площадка
  покупателей найти      реклама на всех           конкретные сообщества
  выбор при запуске      пустота во всех разделах  полный в одной теме
  продавцам удобно       общие правила для всех    правила под их товар
  особые функции         трудно: каждая — для всех «сделано на заказ»,
                                                   запись на мастер-класс
  конкуренты             крупнейшие площадки       небольшие и такие же


═══ КАК НЕ НАДО ═══

  «Сделаем как Ozon, только лучше»                                       [!error]
  «Все категории ручной работы сразу — больше рынок»                    [!error]
  «Склад потом прикрутим, если понадобится»                              [!error]
`;

  protected readonly coldStart = `

═══ КАК «РЕМЕСЛО» РАСКРУЧИВАЛО ПЕРВЫЙ КРУГ ═══

  МЕСЯЦ 1 — ПРОДАВЦЫ ПОИМЁННО
    • список из 200 мастеров керамики и льна: соцсети, ярмарки, знакомые
    • личное письмо каждому: что даёт площадка, сколько стоит, чего НЕ требует
    • согласились 32; Кира сама помогла 14 из них сфотографировать
      изделия и написать описания
    • площадка закрыта для покупателей: «скоро открытие»

  МЕСЯЦ 2 — РЕЖИМ ОДНОГО ИГРОКА
    • у каждого мастера — страница-витрина с короткой ссылкой
      remeslo.example/obzhig — для профиля в соцсетях
    • оплата с чеками вместо «переведите на карту»
    • запись на мастер-классы с календарём
    → мастера сами ведут на площадку своих подписчиков

  МЕСЯЦ 3 — ОТКРЫТИЕ ДЛЯ ВСЕХ, НО ТОЛЬКО ДВЕ КАТЕГОРИИ
    • «Керамика» и «Текстиль»: 32 мастера, 640 карточек
    • первые покупатели — из тематических сообществ, с ярмарки ремёсел,
      через двух блогеров об интерьере
    • правило: у каждого нового продавца — продажа в первые 2 недели;
      нет продажи — Тимур смотрит карточки и цены вместе с мастером


═══ ЛИКВИДНОСТЬ — КАКУЮ СТОРОНУ ТЯНУТЬ ═══

  показатель                               значение   что делать
  ──────────────────────────────────────────────────────────────────────
  поиски «скатерть» без результатов        38 %       нужны мастера по льну
  карточки керамики без продаж за месяц    71 %       нужны покупатели
  дней до первой продажи у нового мастера  19         помогать с карточками
  покупатели, вернувшиеся за 60 дней       22 %       удержание работает

  Цифры — иллюстрация. Смысл: смотрите на обе стороны отдельно
  и по каждой категории отдельно.


═══ КАК НЕ НАДО ═══

  «Откроемся для всех и запустим рекламу на покупателей»                 [!error]
  «Продавцы сами найдут нас через объявление „продавайте у нас“»         [!error]
  «Нет продаж у нового мастера — значит, плохой товар, это его проблема» [!error]

  Как надо: продавцы поимённо → польза без покупателей → открытие
  в узкой нише → первая продажа каждого нового продавца.
`;

  protected readonly buildOrBuy = `

═══ ПЯТЬ ПУТЕЙ — И ВОПРОС, С КОТОРОГО ВСЁ НАЧИНАЕТСЯ ═══

  «Я один продавец?»                 → да: продавайте на чужой площадке
                                       (рецепт «Интернет-магазин»)
  «Есть ли покупатели у моей ниши?»  → не знаю: каталог без денег, 2–8 недель
  «Мой маркетплейс типовой?»         → да, товары от ИП и ООО: коробочный движок
  «Мне нужны особые правила?»        → услуги, самозанятые, своя логика: свой код


═══ ЭТАП 1 «РЕМЕСЛА»: КАТАЛОГ БЕЗ ДЕНЕГ (2 МЕСЯЦА) ═══

  что было      карточки 32 мастеров, поиск, страницы мастеров
  кнопка        «купить» → платёжная ссылка САМОГО мастера
  комиссия      12 %, раз в месяц — счёт мастеру по таблице продаж,
                которую мастер заполнял сам
  что узнали    покупатели приходят и покупают;
                мастерам неудобно возиться с оплатой и чеками самим;
                Кира тратит по три дня в месяц на сверку таблиц;
                защитить покупателя площадка не может — денег у неё нет


═══ ЭТАП 2: ПЛОЩАДКА СО СДЕЛКОЙ ВНУТРИ, СВОЙ КОД ═══

  почему не коробка
    • мастер-классы с расписанием рядом с товарами
    • много самозанятых: выплаты и чеки по своим правилам
    • удержание денег до получения, свои правила споров
  что взяли готовым
    • приём оплаты и разделение платежа — у платёжного сервиса
    • чеки — у платёжного сервиса
    • вход — сервис авторизации
    • доставка — службы доставки с API (как в рецепте про магазин)


═══ ДВЕНАДЦАТЬ ВОПРОСОВ КОРОБОЧНОМУ ДВИЖКУ ДО ПОКУПКИ ═══

   1. Умеет ли делить один платёж между продавцами через ваш платёжный сервис?
   2. Держит ли деньги до получения и выплачивает по расписанию?
   3. Как считает комиссию: с товара, с доставки, по категориям?
   4. Есть ли чеки с признаком агента и ИНН продавца?
   5. Как устроены возвраты: кто возвращает комиссию?
   6. Есть ли споры между покупателем и продавцом?
   7. Отзывы — только от покупателей?
   8. Есть ли модерация карточек и проверка продавцов?
   9. Можно ли продавать услуги с расписанием?
  10. Есть ли API для своих доработок?
  11. Где хранятся данные — можно ли развернуть в России?
  12. Сколько стоит обновление и кто его делает?


═══ КАК НЕ НАДО ═══

  «Полгода пишем всё сами, потом покажем мастерам»                         [!error]
  «Каталог без денег оставим навсегда — так же проще»                     [!error]
  «Возьмём зарубежный конструктор, там же всё есть»                       [!error]
`;

  protected readonly revenueModels = `

═══ ШЕСТЬ СПОСОБОВ ЗАРАБАТЫВАТЬ НА ПЛОЩАДКЕ ═══

  способ                  кто платит   пример «Ремесла»              плюсы / минусы
  ────────────────────────────────────────────────────────────────────────────────
  комиссия с продажи      продавец     12 % товары, 15 % мастер-классы  растёт с оборотом /
                                                                         продавцы торгуются
  плата за размещение     продавец     —                              предсказуемо /
                                                                         отпугивает новичков
  подписка продавца       продавец     «Мастер+» 490 ₽/мес: аналитика  стабильно /
                                       и 3 продвижения в месяц           нужен понятный смысл
  продвижение             продавец     выше в поиске — с меткой        доходно /
                                       «Реклама»                         портит поиск, если жадничать
  сервисный сбор          покупатель   —                              не трогает продавцов /
                                                                         покупателю обидно
  платные услуги          продавец     фотосъёмка изделий 1 500 ₽     полезно /
                                                                         требует людей


═══ GMV, ВЫРУЧКА И TAKE RATE — НА ЗАКАЗЕ АННЫ ═══

  GMV (всё, что заплатила Анна)                      6 090 ₽
    товары:   1 450 + 3 900 = 5 350 ₽
    доставка: 390 + 350     =   740 ₽

  выручка площадки = комиссия с товаров
    «Обжиг»       1 450 × 12 % = 174 ₽
    «Лён и нить»  3 900 × 12 % = 468 ₽
    ──────────────────────────────────
    итого                       642 ₽

  take rate = 642 ÷ 6 090 ≈ 10,5 %
  (меньше 12 %: доставка проходит через площадку без комиссии)


═══ СКОЛЬКО ОСТАЁТСЯ ПЛОЩАДКЕ — УСЛОВНЫЙ РАСЧЁТ ═══

  Цифры — ИЛЛЮСТРАЦИЯ, а не тариф: ставку приёма оплаты берите из договора.

  комиссия площадки                                       642 ₽
  приём оплаты, около 2,8 % со ВСЕЙ суммы 6 090 ₽        −171 ₽
  ─────────────────────────────────────────────────────────────
  на серверы, поддержку, споры, рекламу, зарплаты         471 ₽

  а если бы комиссия была 5 %:
    5 350 × 5 % = 267,50 ₽ − 171 ₽ = 96,50 ₽ с заказа на 6 090 ₽ — почти ничего


═══ ЧТО ПРОДАВЕЦ СРАВНИВАЕТ С ВАШЕЙ КОМИССИЕЙ ═══

  свой канал + перевод на карту   дёшево; нет защиты, чеков, новых покупателей
  крупный маркетплейс             дороже; много покупателей, жёсткие правила
  «Ремесло»                       12 %: покупатели ниши, оплата с чеками,
                                  защита от недобросовестных покупателей,
                                  запись на мастер-классы, витрина мастера

  СТАРТОВОЕ УСЛОВИЕ «РЕМЕСЛА»
    первые 32 мастера — 0 % первые три месяца;
    в договоре сразу написано: «с 1 июня — 12 %»;
    письмо-напоминание — за 45 дней до изменения


═══ КАК НЕ НАДО ═══

  «У нас миллион оборота — значит, миллион выручки»                        [!error]
  «Комиссия 3 % — продавцы к нам побегут»                                  [!error]
  «Продвижение: кто платит больше — тот первый, независимо от запроса»     [!error]
  «Поднимем комиссию с понедельника, письмо разошлём в понедельник»        [!error]
`;

  protected readonly marketplaceSchema = `
-- ═══ 1. ПРОДАВЦЫ — МАГАЗИНЫ НА ПЛОЩАДКЕ ═══
CREATE TABLE sellers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,                  -- «Обжиг»
  slug            text NOT NULL UNIQUE,           -- remeslo.example/obzhig
  legal_type      text NOT NULL CHECK (legal_type IN ('ip', 'company', 'self_employed')),
  inn             text NOT NULL UNIQUE,           -- один ИНН — один магазин: дубли ловит база
  status          text NOT NULL DEFAULT 'pending_review'
                  CHECK (status IN ('pending_review', 'active', 'suspended', 'blocked')),
  -- Ставки — в базисных пунктах (сотых долях процента): 12 % = 1200. Целое число, без дробей
  goods_commission_bps    integer NOT NULL DEFAULT 1200 CHECK (goods_commission_bps BETWEEN 0 AND 10000),
  workshop_commission_bps integer NOT NULL DEFAULT 1500 CHECK (workshop_commission_bps BETWEEN 0 AND 10000),
  created_at      timestamptz NOT NULL DEFAULT now()
);
-- Реквизиты для выплат — отдельная таблица: читать её может только модуль выплат
CREATE TABLE seller_payout_details (
  seller_id       uuid PRIMARY KEY REFERENCES sellers (id),
  provider_account_id text,                       -- id магазина продавца у платёжного сервиса (сплит)
  card_last4      text,                           -- для выплат самозанятым на карту — только 4 цифры
  verified_at     timestamptz
);

-- ═══ 2. УЧАСТНИКИ ПРОДАВЦА — КТО УПРАВЛЯЕТ МАГАЗИНОМ ═══
CREATE TABLE seller_members (
  seller_id  uuid NOT NULL REFERENCES sellers (id),
  user_id    uuid NOT NULL REFERENCES users (id),  -- тот же users, что у покупателей
  role       text NOT NULL CHECK (role IN ('owner', 'manager')),
  PRIMARY KEY (seller_id, user_id)
);

-- ═══ 3. ТОВАРЫ И ВАРИАНТЫ — У КАЖДОГО ЕСТЬ ПРОДАВЕЦ ═══
CREATE TABLE listings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id        uuid NOT NULL REFERENCES sellers (id),
  category_id      integer NOT NULL,
  title            text NOT NULL,                  -- «Кружка „Утро“»
  description      text NOT NULL,
  made_to_order    boolean NOT NULL DEFAULT false, -- «сделаю по вашим размерам» — важно и для возвратов
  production_days  integer CHECK (production_days > 0), -- срок изготовления для вещей на заказ
  status           text NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'in_review', 'published', 'rejected', 'hidden')),
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE variants (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    uuid NOT NULL REFERENCES listings (id),
  seller_id     uuid NOT NULL REFERENCES sellers (id), -- дублируем: проверка «это мой товар?» без лишнего JOIN
  title         text NOT NULL,                  -- «графит, 350 мл»
  price_kopecks integer NOT NULL CHECK (price_kopecks > 0),
  stock         integer NOT NULL CHECK (stock >= 0),  -- остаток ведёт продавец
  weight_grams  integer NOT NULL CHECK (weight_grams > 0)
);

-- ═══ 4. ЗАКАЗ ПОКУПАТЕЛЯ — ОДНА ПОКУПКА, ОДНА ОПЛАТА ═══
CREATE TABLE orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number        text NOT NULL UNIQUE,           -- 'R-20431' — для людей
  buyer_id      uuid NOT NULL REFERENCES users (id),
  total_kopecks integer NOT NULL CHECK (total_kopecks > 0),
  status        text NOT NULL CHECK (status IN ('awaiting_payment', 'paid', 'cancelled')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ═══ 5. ЗАКАЗЫ ПРОДАВЦОВ — ЧАСТИ ПОКУПКИ, У КАЖДОЙ СВОЯ СУДЬБА ═══
CREATE TABLE seller_orders (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           uuid NOT NULL REFERENCES orders (id),
  seller_id          uuid NOT NULL REFERENCES sellers (id),
  number             text NOT NULL UNIQUE,      -- 'R-20431-1' — видит продавец и покупатель
  status             text NOT NULL CHECK (status IN (
                       'awaiting_payment', 'paid', 'shipped', 'delivered',
                       'completed', 'disputed', 'cancelled', 'refunded')),
  items_kopecks      integer NOT NULL,          -- сумма товаров продавца
  shipping_kopecks   integer NOT NULL DEFAULT 0,-- доставка: деньги продавца, без комиссии
  commission_kopecks integer NOT NULL,          -- комиссия площадки — сумма комиссий строк
  ship_within_days   integer NOT NULL,          -- срок отправки: 3 дня или срок изготовления + 2 (раздел об удержании)
  tracking_number    text,
  paid_at            timestamptz,
  shipped_at         timestamptz,
  delivered_at       timestamptz,               -- посылка в пункте выдачи или вручена
  buyer_confirmed_at timestamptz,               -- покупатель нажал «получено, всё в порядке»
  completed_at       timestamptz,               -- сделка завершена: деньги доступны продавцу
  cancelled_reason   text,                      -- 'not_shipped_in_time', 'seller_cannot_fulfil'…
  UNIQUE (order_id, seller_id)                  -- один продавец — одна часть заказа
);

-- ═══ 6. СТРОКИ — СНИМОК НА МОМЕНТ ПОКУПКИ ═══
CREATE TABLE order_items (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_order_id    uuid NOT NULL REFERENCES seller_orders (id),
  variant_id         uuid NOT NULL REFERENCES variants (id),
  title              text NOT NULL,             -- «Кружка „Утро“, графит, 350 мл» — копия, не ссылка
  unit_price_kopecks integer NOT NULL,
  quantity           integer NOT NULL CHECK (quantity > 0),
  commission_bps     integer NOT NULL,          -- ставка на момент покупки: смена комиссии старое не трогает
  commission_kopecks integer NOT NULL
);

-- ═══ 7. ПОКУПКА АННЫ ═══
-- orders:         R-20431     total 609 000 коп. (6 090 ₽)   paid
-- seller_orders:  R-20431-1  «Обжиг»       items 145 000  shipping 39 000  commission 17 400
--                 R-20431-2  «Лён и нить»  items 390 000  shipping 35 000  commission 46 800
-- order_items:    кружка «Утро», графит, 350 мл   1 × 145 000   1200 б. п.  17 400
--                 скатерть, 140 × 180, «овёс»      1 × 390 000   1200 б. п.  46 800

-- ═══ 8. ЗАПРОСЫ ═══
-- Кабинет продавца: только СВОИ заказы — условие по seller_id в каждом запросе (как organization_id в SaaS)
SELECT so.number, so.status, so.items_kopecks, so.shipping_kopecks, so.commission_kopecks
FROM seller_orders so
WHERE so.seller_id = $1 AND so.status IN ('paid', 'shipped')
ORDER BY so.number;

-- Проверка целостности: сумма частей = сумме покупки (запускаем в тестах и раз в сутки)
SELECT o.number
FROM orders o
JOIN seller_orders so ON so.order_id = o.id
GROUP BY o.id, o.number, o.total_kopecks
HAVING sum(so.items_kopecks + so.shipping_kopecks) <> o.total_kopecks; -- пусто — всё сходится

-- ═══ КАК НЕ НАДО ═══
-- CREATE TABLE orders (…, status text, seller_id uuid)   -- [!error] один статус и один продавец на корзину
-- commission_rate numeric(4,2) у продавца, без копии в строке   -- [!error] сменили ставку — пересчитали прошлое
-- ALTER TABLE sellers ADD COLUMN balance_kopecks integer;       -- [!error] баланс полем, а не журналом
`;

  protected readonly sellerOnboarding = `
// ═══ 1. АНКЕТА ═══
import type pg from 'pg';
import { z } from 'zod';
import { isValidInn } from './inn';   // контрольные цифры ИНН — как в рецепте про SaaS
import { cache } from './cache';      // Redis или таблица в базе — неважно

export const SellerApplication = z.object({
  shopName: z.string().trim().min(2).max(60),                 // «Лён и нить»
  legalType: z.enum(['ip', 'company', 'self_employed']),
  inn: z.string().regex(/^(\\d{10}|\\d{12})$/),
  categories: z.array(z.string()).min(1).max(5),              // ['table-linen', 'bags']
});
type Application = z.infer<typeof SellerApplication>;

// ═══ 2. ПРАВИЛА «КАТЕГОРИЯ ↔ ПРАВОВОЙ СТАТУС» ═══
// Категории с обязательной маркировкой «Честный знак»: на НПД такие товары продавать нельзя.
// Список ведёт человек по действующим постановлениям — это ДАННЫЕ, а не логика в коде
const MARKED_CATEGORIES = new Set(['table-linen', 'bed-linen']); // скатерти и салфетки, постельное бельё

type Warning = { category: string; message: string };

export function categoryWarnings(app: Application): Warning[] {
  if (app.legalType !== 'self_employed') return [];
  return app.categories
    .filter((category) => MARKED_CATEGORIES.has(category))
    .map((category) => ({
      category,
      // Подсказка в нужный момент — прямо в анкете, до первой карточки
      message:
        'Товары этой категории подлежат обязательной маркировке «Честный знак»; продавать их на НПД нельзя. ' +
        'Нужен статус ИП или организации и подключение к системе маркировки.',
    }));
}

// ═══ 3. ПРОВЕРКИ ПО ИНН ═══
// Данные ЕГРЮЛ/ЕГРИП — через сервис подсказок по компаниям: название, тип, действует ли
type Registry = { name: string; kind: 'LEGAL' | 'INDIVIDUAL'; active: boolean };
declare function lookupByInn(inn: string): Promise<Registry | null>;
declare function moscowDate(date: Date): string; // '2026-10-20' — дата по Москве, а не по UTC

// Статус самозанятого — открытый сервис налоговой. Частота запросов сильно ограничена,
// гарантий стабильности нет: кэш на сутки, а массовые проверки — через очередь
export async function checkSelfEmployed(inn: string, onDate: Date): Promise<boolean | 'unavailable'> {
  const key = 'npd:' + inn + ':' + moscowDate(onDate);
  const cached = await cache.get(key);
  if (cached !== null) return cached === 'true';
  try {
    const response = await fetch('https://statusnpd.nalog.ru/api/v1/tracker/taxpayer_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inn, requestDate: moscowDate(onDate) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return 'unavailable'; // 429 — слишком часто: повторим позже из очереди
    const body = (await response.json()) as { status: boolean; message: string };
    await cache.set(key, String(body.status), { ttlSeconds: 86_400 });
    return body.status; // true — плательщик НПД на эту дату
  } catch {
    return 'unavailable'; // сервис не ответил — не «нет», а «не знаем»
  }
}

// ═══ 4. РЕШЕНИЕ: СРАЗУ ДАЛЬШЕ, НА РУЧНУЮ ПРОВЕРКУ ИЛИ ОТКАЗ ═══
type Review =
  | { status: 'auto_ok' }
  | { status: 'manual'; flags: string[] }   // человек посмотрит только помеченное
  | { status: 'rejected'; reason: string };  // понятная причина — в интерфейсе

export async function reviewApplication(client: pg.PoolClient, app: Application): Promise<Review> {
  if (!isValidInn(app.inn)) return { status: 'rejected', reason: 'inn_checksum' }; // опечатка — сразу видно
  const flags: string[] = [];

  if (app.legalType === 'self_employed') {
    const npd = await checkSelfEmployed(app.inn, new Date());
    if (npd === 'unavailable') flags.push('npd_unchecked');
    else if (!npd) return { status: 'rejected', reason: 'not_self_employed' };
  } else {
    const registry = await lookupByInn(app.inn);
    if (!registry || !registry.active) return { status: 'rejected', reason: 'not_in_registry' };
    // Выбрал «организация», а по ИНН — предприниматель: опечатка или чужой ИНН
    if ((app.legalType === 'company') !== (registry.kind === 'LEGAL')) flags.push('legal_type_mismatch');
  }

  if (categoryWarnings(app).length > 0) flags.push('marked_goods_on_npd');

  const existing = await client.query('SELECT 1 FROM sellers WHERE inn = $1', [app.inn]);
  if (existing.rowCount) flags.push('inn_already_registered'); // второй магазин на тот же ИНН — повод посмотреть

  return flags.length ? { status: 'manual', flags } : { status: 'auto_ok' };
}

// ═══ 5. «АКТИВЕН» — ТОЛЬКО КОГДА ВЫПОЛНЕНО ВСЁ ═══
// Принятие оферты — строкой в базе, как любое согласие:
//   INSERT INTO seller_agreements (seller_id, user_id, document, version, ip) VALUES (…)
const CURRENT_SELLER_OFFER = 'seller-offer-2026-10';

export async function tryActivate(client: pg.PoolClient, sellerId: string): Promise<boolean> {
  // Одно условное UPDATE: либо выполнены все условия, либо статус не меняется
  const { rowCount } = await client.query(
    \`UPDATE sellers s SET status = 'active'
      WHERE s.id = $1 AND s.status = 'pending_review'
        AND EXISTS (SELECT 1 FROM seller_checks c WHERE c.seller_id = s.id AND c.result = 'passed')
        AND EXISTS (SELECT 1 FROM seller_agreements a
                     WHERE a.seller_id = s.id AND a.document = 'seller_offer' AND a.version = $2)
        AND EXISTS (SELECT 1 FROM seller_payout_details p WHERE p.seller_id = s.id AND p.verified_at IS NOT NULL)
        -- хотя бы одна карточка прошла модерацию (покупатели её всё равно не видят, пока продавец не активен)
        AND EXISTS (SELECT 1 FROM listings l WHERE l.seller_id = s.id AND l.status = 'published')\`,
    [sellerId, CURRENT_SELLER_OFFER],
  );
  return rowCount === 1;
}
// Статус самозанятого проверяется ещё раз ПЕРЕД КАЖДОЙ ВЫПЛАТОЙ — раздел «Баланс продавца и выплаты»

// ═══ КАК НЕ НАДО ═══
// status: 'active' сразу после регистрации                         // [!error] мошенник получит деньги первым
// if (!npd) reject() — когда сервис налоговой просто не ответил     // [!error] «не знаем» ≠ «нет»
// проверили НПД один раз при подключении и забыли                   // [!error] статус теряют в любой момент
// const MARKED = ['table-linen'] прямо в условии обработчика        // [!error] правила меняются — это данные
`;

  protected readonly moderation = `
// ═══ 1. АВТОМАТИЧЕСКИЕ ПРАВИЛА — ВСЁ, ЧТО ПРОВЕРЯЕТСЯ БЕЗ ЧЕЛОВЕКА ═══
import type pg from 'pg';
import { llm } from './ai';

type Photo = { url: string; width: number; height: number; phash: string }; // phash — перцептивный хэш
type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  categoryId: number;
  priceKopecks: number;
  madeToOrder: boolean;
  productionDays: number | null;
  photos: Photo[];
};
type Code =
  | 'too_few_photos' | 'photo_too_small' | 'description_too_short' | 'production_time_missing'
  | 'contacts_in_text' | 'duplicate_listing' | 'photo_of_other_seller'
  | 'maybe_mass_produced' | 'category_mismatch';
type Finding = { code: Code; severity: 'reject' | 'flag'; detail?: string };

// Телефоны в любой записи: +7 (912) 345-67-89, 8 912 3456789…
const PHONE = /(?:\\+7|8)[\\s(-]*\\d{3}[\\s)-]*\\d{3}[\\s-]*\\d{2}[\\s-]*\\d{2}/;
// Ссылки и короткие адреса мессенджеров и соцсетей
const LINK = /(?:https?:\\/\\/|www\\.)\\S+|(?:t\\.me|vk\\.com|wa\\.me)\\/\\S+/i;
// Слова-приглашения уйти с площадки. \\p{L} и флаг u — чтобы границы слов работали и для кириллицы
const OFF_PLATFORM = /(?<!\\p{L})(?:телеграм\\p{L}*|telegram|ватсап\\p{L}*|whatsapp|в\\s+личк[уеи]|в\\s+лс)(?!\\p{L})/iu;

type PhotoIndex = { findSimilar(phash: string, maxDistance: number): { listingId: string; sellerId: string } | null };

export function autoCheck(listing: Listing, index: PhotoIndex): Finding[] {
  const findings: Finding[] = [];
  if (listing.photos.length < 3) findings.push({ code: 'too_few_photos', severity: 'reject' });
  if (listing.photos.some((p) => Math.min(p.width, p.height) < 800)) findings.push({ code: 'photo_too_small', severity: 'reject' });
  if (listing.description.trim().length < 80) findings.push({ code: 'description_too_short', severity: 'reject' });
  if (listing.madeToOrder && !listing.productionDays) findings.push({ code: 'production_time_missing', severity: 'reject' });

  const text = listing.title + '\\n' + listing.description;
  if (PHONE.test(text) || LINK.test(text) || OFF_PLATFORM.test(text)) {
    findings.push({ code: 'contacts_in_text', severity: 'reject' });
  }

  for (const photo of listing.photos) {
    // Перцептивный хэш почти не меняется от сжатия, обрезки краёв и цветокоррекции:
    // близкие «отпечатки» — почти наверняка одна и та же фотография
    const twin = index.findSimilar(photo.phash, 6);
    if (!twin || twin.listingId === listing.id) continue;
    findings.push(
      twin.sellerId === listing.sellerId
        ? { code: 'duplicate_listing', severity: 'flag', detail: twin.listingId }   // своё выложил дважды
        : { code: 'photo_of_other_seller', severity: 'flag', detail: twin.listingId }, // чужая фотография?
    );
  }
  return findings;
}

// ═══ 2. НЕЙРОСЕТЬ ПОМЕЧАЕТ, НО НЕ РЕШАЕТ ═══
// Ответ модели — по строгой схеме (structured output), а не свободным текстом
type AiOpinion = { looksMassProduced: number; matchesCategory: boolean; reason: string }; // number — от 0 до 1

export async function aiFlags(listing: Listing, categoryTitle: string): Promise<Finding[]> {
  const opinion = await llm.classify<AiOpinion>({
    images: listing.photos.slice(0, 3).map((p) => p.url),
    text: \`Категория: \${categoryTitle}\\nНазвание: \${listing.title}\\nОписание: \${listing.description}\`,
    instruction: 'Оцени, похоже ли изделие на ручную работу и подходит ли оно категории.',
  });
  const flags: Finding[] = [];
  if (opinion.looksMassProduced >= 0.7) flags.push({ code: 'maybe_mass_produced', severity: 'flag', detail: opinion.reason });
  if (!opinion.matchesCategory) flags.push({ code: 'category_mismatch', severity: 'flag', detail: opinion.reason });
  return flags; // НИКОГДА не 'reject': отклоняет только человек
}

// ═══ 3. КУДА ПОПАДАЕТ КАРТОЧКА ═══
type Outcome = 'rejected' | 'in_review' | 'published';

export async function submitForModeration(
  client: pg.PoolClient,
  listing: Listing,
  context: { categoryTitle: string; approvedListingsOfSeller: number; index: PhotoIndex },
): Promise<Outcome> {
  const findings = [...autoCheck(listing, context.index), ...(await aiFlags(listing, context.categoryTitle))];
  const rejects = findings.filter((f) => f.severity === 'reject');

  if (rejects.length > 0) {
    // Автоматический отказ — только по ясным правилам и сразу с текстом «что исправить»
    await setStatus(client, listing.id, 'rejected', rejects);
    return 'rejected';
  }
  const trusted = context.approvedListingsOfSeller >= 3; // первые три карточки — всегда глазами
  if (!trusted || findings.length > 0) {
    await client.query('INSERT INTO moderation_queue (listing_id, findings) VALUES ($1, $2)', [listing.id, JSON.stringify(findings)]);
    await setStatus(client, listing.id, 'in_review', []);
    return 'in_review';
  }
  await setStatus(client, listing.id, 'published', []);
  // Доверяй, но проверяй: каждую десятую опубликованную сразу карточку человек посмотрит потом
  if (Math.random() < 0.1) {
    await client.query("INSERT INTO moderation_queue (listing_id, findings, kind) VALUES ($1, '[]', 'sample')", [listing.id]);
  }
  return 'published';
}

async function setStatus(client: pg.PoolClient, listingId: string, status: Outcome, reasons: Finding[]): Promise<void> {
  await client.query('UPDATE listings SET status = $2 WHERE id = $1', [listingId, status]);
  await client.query(
    'INSERT INTO listing_moderation_log (listing_id, status, reasons) VALUES ($1, $2, $3)', // история: что и почему
    [listingId, status, JSON.stringify(reasons.map((r) => r.code))],
  );
}

// ═══ 4. ПОНЯТНЫЕ ТЕКСТЫ ОТКАЗА ═══
export const REJECT_TEXTS: Partial<Record<Code, string>> = {
  too_few_photos: 'Нужно хотя бы три фотографии: изделие целиком, деталь и в руке или в интерьере.',
  photo_too_small: 'Фотографии слишком маленькие: короткая сторона — не меньше 800 пикселей.',
  description_too_short: 'Опишите изделие подробнее: материал, размеры, уход — хотя бы два-три предложения.',
  production_time_missing: 'Для изделий на заказ укажите срок изготовления в днях.',
  contacts_in_text: 'Уберите телефоны, ссылки и названия мессенджеров: связь с покупателями — через сообщения «Ремесла».',
};

// ═══ 5. КАКИЕ ПРАВКИ ВОЗВРАЩАЮТ КАРТОЧКУ НА МОДЕРАЦИЮ ═══
export function needsRemoderation(before: Listing, after: Listing): boolean {
  const photosChanged = before.photos.map((p) => p.phash).join() !== after.photos.map((p) => p.phash).join();
  return (
    before.title !== after.title ||
    before.categoryId !== after.categoryId ||
    photosChanged ||
    after.priceKopecks < before.priceKopecks / 2 // цену уронили больше чем вдвое — подозрительно
  );
}

// ═══ КАК НЕ НАДО ═══
// if (opinion.looksMassProduced > 0.7) reject(listing);      // [!error] отказ по мнению нейросети
// moderate(listing) — только при создании, правки не смотрим // [!error] кружку заменят сервизом
// reason: 'Отклонено'                                         // [!error] продавец не поймёт, что исправить
// /\\bтелеграм\\b/i                                            // [!error] \\b не работает с кириллицей
`;

  protected readonly ranking = `
-- ═══ 1. ПОИСКОВАЯ СТРОКА КАРТОЧКИ — КАК В РЕЦЕПТЕ ПРО МАГАЗИН ═══
-- Название весит больше (A), описание — меньше (C): совпадение в названии важнее
ALTER TABLE listings ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('russian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('russian', coalesce(description, '')), 'C')
) STORED;
CREATE INDEX listings_search_idx ON listings USING gin (search_vector);

-- ═══ 2. СИГНАЛЫ КАЧЕСТВА — ПЕРЕСЧЁТ РАЗ В ЧАС, ЗА СКОЛЬЗЯЩИЙ ПЕРИОД ═══
CREATE TABLE listing_signals (
  listing_id         uuid PRIMARY KEY REFERENCES listings (id),
  rating_adjusted    numeric NOT NULL,   -- рейтинг с поправкой на число отзывов (раздел об отзывах)
  views_30d          integer NOT NULL,
  orders_30d         integer NOT NULL,
  seller_cancel_rate numeric NOT NULL,   -- доля заказов, отменённых продавцом, за 90 дней
  published_at       timestamptz NOT NULL
);

-- ═══ 3. ЗАПРОС: СООТВЕТСТВИЕ × КАЧЕСТВО, ПОТОМ РАЗНООБРАЗИЕ ═══
WITH q AS (
  SELECT websearch_to_tsquery('russian', $1) AS query   -- $1 = 'льняная скатерть'
), matched AS (
  SELECT l.id, l.seller_id, l.title,
         ts_rank(l.search_vector, q.query) AS relevance,
         s.rating_adjusted,
         -- Конверсия с поправкой: (покупки + 1) / (просмотры + 50).
         -- У новой карточки 0 покупок из 3 просмотров — не «0 %», а около 2 %: не хоронить с первого дня
         (s.orders_30d + 1)::numeric / (s.views_30d + 50) AS conversion,
         s.seller_cancel_rate,
         CASE WHEN s.published_at > now() - interval '14 days' THEN 0.15 ELSE 0 END AS freshness
    FROM listings l
    JOIN sellers sl ON sl.id = l.seller_id AND sl.status = 'active'  -- карточки неактивных продавцов не видны
    JOIN listing_signals s ON s.listing_id = l.id
   CROSS JOIN q
   WHERE l.status = 'published' AND l.search_vector @@ q.query       -- сначала — подходит ли ВООБЩЕ
), scored AS (
  SELECT *,
         -- Качество не тащит неподходящее наверх: оно УМНОЖАЕТ соответствие, а не прибавляется к нему
         relevance * (1
           + 0.30 * (rating_adjusted - 4)   -- рейтинг выше 4 — плюс, ниже — минус
           + 4.00 * conversion              -- 2 % конверсии → +0,08
           - 1.50 * seller_cancel_rate      -- 10 % отмен продавцом → −0,15
           + freshness) AS score
    FROM matched
), ranked AS (
  SELECT *, row_number() OVER (PARTITION BY seller_id ORDER BY score DESC) AS nth_of_seller
    FROM scored
)
SELECT id, seller_id, title, round(score::numeric, 4) AS score
  FROM ranked
 WHERE nth_of_seller <= 4            -- не больше четырёх карточек одного продавца на странице
 ORDER BY score DESC
 LIMIT 24;
-- «Не больше двух подряд» проще доделать в коде: пройти по списку и переставить третью подряд ниже.
-- Рекламные места (1 из каждых 6) вставляются отдельно — только из карточек, которые ЕСТЬ в matched

-- ═══ КАК НЕ НАДО ═══
-- ORDER BY total_sales DESC                       -- [!error] первые продавцы наверху навсегда
-- ORDER BY is_promoted DESC, relevance DESC       -- [!error] реклама вытесняет всю честную выдачу
-- score = relevance + rating                      -- [!error] хороший рейтинг тащит неподходящее наверх
-- avg(rating) без поправки на число отзывов       -- [!error] одна пятёрка обгоняет сотню
`;

  protected readonly checkout = `
// ═══ 1. ЧТО ПРИСЫЛАЕТ БРАУЗЕР — И ЧЕМУ МЫ НЕ ВЕРИМ ═══
import type pg from 'pg';
import { tx, enqueue } from './db';
import { commissionKopecks } from './money'; // следующий пример кода

type CartLine = { variantId: string; quantity: number }; // цен здесь нет: браузеру о деньгах не верим
// Цены доставки посчитаны на шаге выбора пункта выдачи и сохранены в delivery_quotes на 30 минут:
// внешний запрос к службе доставки ВНУТРИ транзакции держал бы блокировки остатков
type QuoteIds = Map<string, string>; // sellerId → id сохранённого расчёта доставки

class CheckoutError extends Error {
  constructor(readonly code: 'bad_cart' | 'unavailable' | 'out_of_stock' | 'delivery_quote_expired', readonly ref?: string) {
    super(code);
  }
}

type VariantRow = {
  id: string;
  seller_id: string;
  seller_status: string;
  title: string;
  price_kopecks: number;
  stock: number;
  commission_bps: number;
  made_to_order: boolean;
  production_days: number | null; // срок изготовления из карточки — для вещей на заказ
};

// ═══ 2. ОФОРМЛЕНИЕ: ЗАКАЗ ПОКУПАТЕЛЯ + ЗАКАЗЫ ПРОДАВЦОВ + РЕЗЕРВЫ — ОДНОЙ ТРАНЗАКЦИЕЙ ═══
export async function checkout(buyerId: string, lines: CartLine[], quoteIds: QuoteIds) {
  if (lines.length === 0 || lines.some((l) => !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 20)) {
    throw new CheckoutError('bad_cart');
  }
  return tx(async (client) => {
    // Цены, остатки, продавцы и ставки — из базы. FOR UPDATE: остатки не изменятся, пока считаем
    const { rows } = await client.query<VariantRow>(
      \`SELECT v.id, v.seller_id, s.status AS seller_status,
              l.title || ', ' || v.title AS title, v.price_kopecks, v.stock,
              s.goods_commission_bps AS commission_bps, l.made_to_order, l.production_days
         FROM variants v
         JOIN listings l ON l.id = v.listing_id AND l.status = 'published'
         JOIN sellers s ON s.id = v.seller_id
        WHERE v.id = ANY($1::uuid[])
        FOR UPDATE OF v\`,
      [lines.map((l) => l.variantId)],
    );
    const byId = new Map(rows.map((row) => [row.id, row]));

    // Группируем по продавцам: каждая группа станет заказом продавца
    const groups = new Map<string, { variant: VariantRow; quantity: number }[]>();
    for (const line of lines) {
      const variant = byId.get(line.variantId);
      if (!variant || variant.seller_status !== 'active') throw new CheckoutError('unavailable', line.variantId);
      if (variant.stock < line.quantity) throw new CheckoutError('out_of_stock', line.variantId);
      groups.set(variant.seller_id, [...(groups.get(variant.seller_id) ?? []), { variant, quantity: line.quantity }]);
    }

    const { rows: seq } = await client.query<{ n: string }>("SELECT nextval('order_number_seq') AS n");
    const orderNumber = 'R-' + seq[0].n; // R-20431
    const order = await client.query<{ id: string }>(
      "INSERT INTO orders (number, buyer_id, total_kopecks, status) VALUES ($1, $2, 0, 'awaiting_payment') RETURNING id",
      [orderNumber, buyerId],
    );
    const orderId = order.rows[0].id;

    let total = 0;
    let partNo = 0;
    for (const [sellerId, items] of groups) {
      partNo++;
      // Доставка — СВОЯ у каждого продавца: из его города до пункта выдачи покупателя
      const quote = await client.query<{ price_kopecks: number }>(
        'SELECT price_kopecks FROM delivery_quotes WHERE id = $1 AND buyer_id = $2 AND seller_id = $3 AND expires_at > now()',
        [quoteIds.get(sellerId), buyerId, sellerId],
      );
      if (!quote.rows[0]) throw new CheckoutError('delivery_quote_expired', sellerId);
      const shipping = quote.rows[0].price_kopecks;

      // Комиссия — по каждой строке, одно округление на строку; сумма строк — в заказ продавца
      const lineData = items.map(({ variant, quantity }) => {
        const amount = variant.price_kopecks * quantity;
        return { variant, quantity, commission: commissionKopecks(amount, variant.commission_bps), amount };
      });
      const itemsKopecks = lineData.reduce((sum, l) => sum + l.amount, 0);
      const commission = lineData.reduce((sum, l) => sum + l.commission, 0);
      // Срок отправки части — по самой долгой строке: в наличии 3 дня, на заказ — изготовление + 2
      const shipWithinDays = Math.max(
        ...lineData.map((l) => (l.variant.made_to_order ? (l.variant.production_days ?? 0) + 2 : 3)),
      );

      const part = await client.query<{ id: string }>(
        \`INSERT INTO seller_orders (order_id, seller_id, number, status, items_kopecks, shipping_kopecks,
                                    commission_kopecks, ship_within_days)
         VALUES ($1, $2, $3, 'awaiting_payment', $4, $5, $6, $7) RETURNING id\`,
        [orderId, sellerId, orderNumber + '-' + partNo, itemsKopecks, shipping, commission, shipWithinDays],
      );
      for (const l of lineData) {
        await client.query(
          \`INSERT INTO order_items (seller_order_id, variant_id, title, unit_price_kopecks, quantity, commission_bps, commission_kopecks)
           VALUES ($1, $2, $3, $4, $5, $6, $7)\`, // снимок: название, цена и ставка на момент покупки
          [part.rows[0].id, l.variant.id, l.variant.title, l.variant.price_kopecks, l.quantity, l.variant.commission_bps, l.commission],
        );
        // Списание остатка — условным UPDATE, как в рецепте про магазин (там — резерв на 30 минут с уборщиком;
        // здесь для краткости списываем сразу, а при отмене неоплаченного заказа возвращаем)
        const reserved = await client.query('UPDATE variants SET stock = stock - $2 WHERE id = $1 AND stock >= $2', [
          l.variant.id,
          l.quantity,
        ]);
        if (reserved.rowCount !== 1) throw new CheckoutError('out_of_stock', l.variant.id); // откат всей покупки
      }
      total += itemsKopecks + shipping;
    }
    await client.query('UPDATE orders SET total_kopecks = $2 WHERE id = $1', [orderId, total]);
    return { orderId, orderNumber, totalKopecks: total }; // дальше — создание платежа (следующий пример)
  });
}

// ═══ 3. СТАТУС ДЛЯ ПОКУПАТЕЛЯ — ВЫЧИСЛЯЕТСЯ ИЗ ЧАСТЕЙ, НЕ ХРАНИТСЯ ═══
type PartStatus = 'awaiting_payment' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'disputed' | 'cancelled' | 'refunded';

export function buyerStatus(parts: PartStatus[]): string {
  const live = parts.filter((s) => s !== 'cancelled' && s !== 'refunded');
  if (live.length === 0) return 'отменён';
  if (live.includes('awaiting_payment')) return 'ожидает оплаты';
  if (live.includes('disputed')) return 'открыт спор';
  if (live.every((s) => s === 'delivered' || s === 'completed')) return 'получен';
  const sent = live.filter((s) => s === 'shipped' || s === 'delivered' || s === 'completed').length;
  if (sent === 0) return 'оплачен';
  return sent < live.length ? 'частично отправлен' : 'отправлен';
}
// buyerStatus(['shipped', 'paid']) → 'частично отправлен' — у Анны кружка в пути, скатерть шьётся

// ═══ 4. ПРОДАВЕЦ НЕ МОЖЕТ ВЫПОЛНИТЬ СВОЮ ЧАСТЬ ═══
export async function cancelPartBySeller(client: pg.PoolClient, sellerId: string, sellerOrderId: string, reason: string) {
  // seller_id в условии: продавец может отменить только СВОЙ заказ, и только пока он не отправлен
  const { rows } = await client.query<{ refund_kopecks: number }>(
    \`UPDATE seller_orders SET status = 'cancelled'
      WHERE id = $1 AND seller_id = $2 AND status = 'paid'
     RETURNING items_kopecks + shipping_kopecks AS refund_kopecks\`,
    [sellerOrderId, sellerId],
  );
  if (!rows[0]) return null;
  // Остатки — обратно
  await client.query(
    'UPDATE variants v SET stock = v.stock + oi.quantity FROM order_items oi WHERE oi.seller_order_id = $1 AND v.id = oi.variant_id',
    [sellerOrderId],
  );
  // Возврат покупателю — ТОЛЬКО этой части (4 250 ₽ за скатерть с доставкой); кружка едет дальше
  await enqueue(client, 'refund.seller_order', { sellerOrderId, amountKopecks: rows[0].refund_kopecks, reason });
  // Отмена продавцом учитывается в его надёжности — и в поиске
  await client.query(
    "INSERT INTO seller_events (seller_id, kind, data) VALUES ($1, 'cancelled_by_seller', $2)",
    [sellerId, JSON.stringify({ sellerOrderId, reason })],
  );
  return rows[0].refund_kopecks;
}

// ═══ КАК НЕ НАДО ═══
// const total = req.body.total;                                     // [!error] итог из браузера
// const shipping = await deliveryApi.quote(…) — внутри транзакции   // [!error] держим блокировки секундами
// INSERT INTO orders (…, status, seller_id) — одна строка на корзину // [!error] у частей разная судьба
// UPDATE orders SET status = 'cancelled' — продавец отменил скатерть // [!error] отменили и кружку
`;

  protected readonly splitPayment = `
// ═══ 1. КОМИССИЯ СТРОКИ: КОПЕЙКИ × БАЗИСНЫЕ ПУНКТЫ, ОДНО ОКРУГЛЕНИЕ ═══
export function commissionKopecks(amountKopecks: number, bps: number): number {
  // 1 450,00 ₽ × 12 % → 145 000 × 1 200 / 10 000 = 17 400 копеек.
  // Math.round для положительных — половина копейки вверх; одно правило на всю площадку
  return Math.round((amountKopecks * bps) / 10_000);
}
// commissionKopecks(145_000, 1200) → 17 400   (174,00 ₽)
// commissionKopecks(239_000, 1200) → 28 680   (286,80 ₽ — сумка)
// commissionKopecks(129_900, 1250) → 16 238   (162,375 ₽ → 162,38 ₽)

// ═══ 2. РАЗБИВКА ПОКУПКИ: ДОЛЯ ПРОДАВЦА — ВЫЧИТАНИЕМ ═══
type PartInput = {
  sellerId: string;
  items: { amountKopecks: number; bps: number }[];
  shippingKopecks: number; // доставка — продавцу, без комиссии
};
export type PartSplit = {
  sellerId: string;
  itemsKopecks: number;
  shippingKopecks: number;
  commissionKopecks: number;
  sellerShareKopecks: number;
};
export type OrderSplit = { parts: PartSplit[]; platformKopecks: number; totalKopecks: number };

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function splitOrder(inputs: PartInput[]): OrderSplit {
  const parts = inputs.map((p) => {
    const itemsKopecks = sum(p.items.map((i) => i.amountKopecks));
    const commission = sum(p.items.map((i) => commissionKopecks(i.amountKopecks, i.bps))); // по строкам — как в чеке
    return {
      sellerId: p.sellerId,
      itemsKopecks,
      shippingKopecks: p.shippingKopecks,
      commissionKopecks: commission,
      sellerShareKopecks: itemsKopecks + p.shippingKopecks - commission, // ВЫЧИТАНИЕМ: копейка не теряется
    };
  });
  const platformKopecks = sum(parts.map((p) => p.commissionKopecks));
  const totalKopecks = sum(parts.map((p) => p.itemsKopecks + p.shippingKopecks));

  // Равенства, которые должны выполняться ВСЕГДА — проверяем и здесь, и в автотестах
  if (sum(parts.map((p) => p.sellerShareKopecks)) + platformKopecks !== totalKopecks) throw new Error('split mismatch');
  if (parts.some((p) => p.sellerShareKopecks < 0 || p.commissionKopecks < 0)) throw new Error('negative amount');
  return { parts, platformKopecks, totalKopecks };
}
// Покупка Анны:
//   «Обжиг»       145 000 + 39 000 − 17 400 = 166 600   (1 666 ₽)
//   «Лён и нить»  390 000 + 35 000 − 46 800 = 378 200   (3 782 ₽)
//   площадке 64 200 (642 ₽) · всего 609 000 (6 090 ₽) ✓

// ═══ 3. НОМИНАЛЬНЫЙ СЧЁТ: ЗАПРОС К СЕРВИСУ РАСЧЁТОВ БАНКА (УСЛОВНЫЙ КЛИЕНТ) ═══
// У каждого банка своё API и свои названия полей — смысл везде один: сумма платежа,
// кому какая часть, вознаграждение площадки, и до завершения сделки деньги удерживаются
type Beneficiary = { beneficiaryId: string; amountKopecks: number; platformFeeKopecks: number; reference: string };
declare const platformBank: {
  createPayment(request: {
    amountKopecks: number;
    description: string;
    returnUrl: string;
    idempotencyKey: string;
    beneficiaries: Beneficiary[];
  }): Promise<{ paymentId: string; confirmationUrl: string }>;
};

export async function startPayment(
  order: { id: string; number: string },
  split: OrderSplit,
  beneficiaryIdOf: (sellerId: string) => string, // id продавца как бенефициара в банке; нет — бросает ошибку
  partNumberOf: (sellerId: string) => string,    // R-20431-1
) {
  return platformBank.createPayment({
    amountKopecks: split.totalKopecks,
    description: 'Заказ ' + order.number + ' на «Ремесле»',
    returnUrl: 'https://remeslo.example/orders/' + order.number,
    idempotencyKey: 'order:' + order.id + ':attempt:1', // повтор запроса не создаст второй платёж
    beneficiaries: split.parts.map((p) => ({
      beneficiaryId: beneficiaryIdOf(p.sellerId),
      amountKopecks: p.itemsKopecks + p.shippingKopecks, // всё, что относится к продавцу
      platformFeeKopecks: p.commissionKopecks,          // из этого — вознаграждение площадки
      reference: partNumberOf(p.sellerId),
    })),
  });
}

// ═══ 4. ТО ЖЕ САМОЕ ДЛЯ СПЛИТОВАНИЯ ЮKASSA: МАССИВ transfers ═══
// Каждый продавец подключён к ЮKassa как отдельный магазин; его идентификатор — account_id
const toValue = (k: number) => \`\${Math.floor(k / 100)}.\${String(k % 100).padStart(2, '0')}\`; // 166600 → "1666.00"

export function yookassaSplitRequest(
  order: { id: string; number: string },
  split: OrderSplit,
  shopIdOf: (sellerId: string) => string,
  legalNameOf: (sellerId: string) => string,
) {
  // Описание видит покупатель на странице оплаты: продавцы и суммы. У ЮKassa — до 128 символов
  const description = ('Заказ ' + order.number + ': ' +
    split.parts.map((p) => legalNameOf(p.sellerId) + ' ' + toValue(p.itemsKopecks + p.shippingKopecks) + ' ₽').join(', ')
  ).slice(0, 128);

  return {
    amount: { value: toValue(split.totalKopecks), currency: 'RUB' },
    capture: false, // двухстадийно: пока не подтвердили — комиссию можно поменять, часть — не списывать
    confirmation: { type: 'redirect', return_url: 'https://remeslo.example/orders/' + order.number },
    description,
    transfers: split.parts.map((p) => ({
      account_id: shopIdOf(p.sellerId),                                                 // магазин продавца в ЮKassa
      amount: { value: toValue(p.itemsKopecks + p.shippingKopecks), currency: 'RUB' },  // сколько причитается ему
      platform_fee_amount: { value: toValue(p.commissionKopecks), currency: 'RUB' },    // комиссия площадки с этой суммы
      description: 'Заказ ' + order.number + ' на «Ремесле»',
      metadata: { orderId: order.id },
    })),
    metadata: { orderId: order.id },
  };
}
// В примере из документации сумма платежа равна сумме amount всех transfers.
// Объект receipt в запрос создания платежа со сплитом не передают — данные для чеков отправляют
// отдельным запросом (раздел «Чеки и налоги на маркетплейсе»). СБП в сплитовании недоступен.

// ═══ КАК НЕ НАДО ═══
// const sellerShare = Math.round(items * 0.88); const fee = Math.round(items * 0.12);  // [!error] два округления
// const fee = items * 0.12;                         — дробные рубли                      // [!error]
// transfers: [{ amount: total }] — всю сумму одному продавцу «потом разберёмся»          // [!error]
`;

  protected readonly holdRelease = `
// ═══ 1. ПРАВИЛА СРОКОВ — ДАННЫЕ, А НЕ ЧИСЛА В КОДЕ ═══
import type pg from 'pg';
import { pool, tx, enqueue } from './db';
import { ledgerTransaction, held, available } from './ledger';

export const HOLD_RULES = {
  shipWithinDaysInStock: 3,        // в наличии — отправить за 3 дня
  shipGraceAfterProductionDays: 2, // на заказ — срок изготовления из карточки + 2 дня
  claimWindowDays: 7,              // после доставки — 7 дней на претензию
  assumeDeliveredAfterShipDays: 20 // нет статусов доставки — считаем доставленным через 20 дней
} as const;
// При оформлении в seller_orders записан ship_within_days — максимум по строкам части заказа

// ═══ 2. НЕ ОТПРАВИЛ В СРОК — АВТООТМЕНА И ВОЗВРАТ ═══
async function cancelNotShipped(client: pg.PoolClient): Promise<void> {
  const { rows } = await client.query<{ id: string; number: string; seller_id: string; refund_kopecks: number }>(
    \`UPDATE seller_orders
        SET status = 'cancelled', cancelled_reason = 'not_shipped_in_time'
      WHERE status = 'paid'
        AND paid_at + make_interval(days => ship_within_days) < now()
     RETURNING id, number, seller_id, items_kopecks + shipping_kopecks AS refund_kopecks\`,
  );
  for (const part of rows) {
    // Деньги покупателю — из «удержано» продавца; комиссии не было: сделка не завершилась
    await ledgerTransaction(client, 'refund', part.number, 'refund:not_shipped:' + part.id, [
      { from: held(part.seller_id), to: 'external:refunded', amountKopecks: part.refund_kopecks },
    ]);
    await enqueue(client, 'refund.seller_order', { sellerOrderId: part.id, amountKopecks: part.refund_kopecks });
    await enqueue(client, 'email.part_cancelled_not_shipped', { sellerOrderId: part.id }); // и покупателю, и продавцу
  }
}

// ═══ 3. «ДОСТАВЛЕНО» — ОТ СЛУЖБЫ ДОСТАВКИ ИЛИ ОТ ПОКУПАТЕЛЯ, НО НЕ ОТ ПРОДАВЦА ═══
type DeliveryStatus = 'in_transit' | 'arrived_at_pickup' | 'delivered' | 'returned_to_sender';

export async function onDeliveryStatus(client: pg.PoolClient, trackingNumber: string, status: DeliveryStatus) {
  // Вебхук или опрос службы доставки — как в рецепте про магазин
  if (status === 'arrived_at_pickup' || status === 'delivered') {
    await client.query(
      \`UPDATE seller_orders SET status = 'delivered', delivered_at = coalesce(delivered_at, now())
        WHERE tracking_number = $1 AND status = 'shipped'\`,
      [trackingNumber],
    );
  }
}

// «Получено, всё в порядке» — может нажать только покупатель ЭТОГО заказа
export async function buyerConfirms(client: pg.PoolClient, buyerId: string, sellerOrderId: string): Promise<boolean> {
  const { rows } = await client.query<{ id: string }>(
    \`UPDATE seller_orders so
        SET status = 'delivered', delivered_at = coalesce(so.delivered_at, now()), buyer_confirmed_at = now()
       FROM orders o
      WHERE o.id = so.order_id AND so.id = $1 AND o.buyer_id = $2 AND so.status IN ('shipped', 'delivered')
     RETURNING so.id\`,
    [sellerOrderId, buyerId],
  );
  if (!rows[0]) return false;
  return completeSellerOrder(client, rows[0].id); // подтвердил сам — завершаем сразу, без семи дней
}

// ═══ 4. ЗАВЕРШЕНИЕ СДЕЛКИ: УДЕРЖАНО → ДОСТУПНО + КОМИССИЯ ПЛОЩАДКИ ═══
export async function completeSellerOrder(client: pg.PoolClient, sellerOrderId: string): Promise<boolean> {
  // Условия в UPDATE защищают от двойного завершения и от спора, открытого секунду назад
  const { rows } = await client.query<{ number: string; seller_id: string; items_kopecks: number; shipping_kopecks: number; commission_kopecks: number }>(
    \`UPDATE seller_orders SET status = 'completed', completed_at = now()
      WHERE id = $1 AND status = 'delivered'
        AND NOT EXISTS (SELECT 1 FROM disputes d WHERE d.seller_order_id = $1 AND d.status = 'open')
     RETURNING number, seller_id, items_kopecks, shipping_kopecks, commission_kopecks\`,
    [sellerOrderId],
  );
  const part = rows[0];
  if (!part) return false;
  const share = part.items_kopecks + part.shipping_kopecks - part.commission_kopecks; // 1 840 − 174 = 1 666 ₽
  // Ключ 'deal_completed:<id>' — даже если функцию вызовут дважды, проводки запишутся один раз
  await ledgerTransaction(client, 'deal_completed', part.number, 'deal_completed:' + sellerOrderId, [
    { from: held(part.seller_id), to: available(part.seller_id), amountKopecks: share },
    { from: held(part.seller_id), to: 'platform:fees', amountKopecks: part.commission_kopecks },
  ]);
  return true;
}

// ═══ 5. ПЛАНИРОВЩИК — РАЗ В ЧАС ═══
export async function holdTick(): Promise<void> {
  await tx(cancelNotShipped);

  // Доставлено больше 7 дней назад и спора нет — завершаем
  const due = await pool.query<{ id: string }>(
    \`SELECT id FROM seller_orders
      WHERE status = 'delivered' AND delivered_at <= now() - make_interval(days => $1)
      LIMIT 500\`,
    [HOLD_RULES.claimWindowDays],
  );
  for (const part of due.rows) await tx((client) => completeSellerOrder(client, part.id));

  // Служба доставки без статусов: 20 дней после отправки без жалоб — считаем доставленным;
  // дальше — обычные 7 дней на претензию, то есть деньги станут доступны через 27 дней
  await pool.query(
    \`UPDATE seller_orders so SET status = 'delivered', delivered_at = now()
      WHERE so.status = 'shipped' AND so.shipped_at <= now() - make_interval(days => $1)
        AND NOT EXISTS (SELECT 1 FROM disputes d WHERE d.seller_order_id = so.id)\`,
    [HOLD_RULES.assumeDeliveredAfterShipDays],
  );
}

// ═══ КАК НЕ НАДО ═══
// app.post('/seller/orders/:id/delivered', …) — кнопка «доставлено» у продавца   // [!error] её нажмёт мошенник
// onTrackingNumberAdded → completeSellerOrder(…)                                 // [!error] трек ≠ доставка
// UPDATE seller_orders SET status = 'completed' WHERE delivered_at < …  — без проверки спора  // [!error]
`;

  protected readonly ledger = `
-- ═══ 1. СЧЕТА — «КОНВЕРТЫ» ═══
-- Имя счёта говорит, чей он и что в нём:
--   seller:<id>:held        удержано по незавершённым частям заказов
--   seller:<id>:available   доступно к выплате
--   seller:<id>:paying_out  выплата отправлена в банк, ждём подтверждения
--   platform:fees           комиссия площадки
--   external:buyers         откуда пришли деньги покупателей
--   external:paid_out       куда ушли выплаты продавцам
--   external:refunded       куда ушли возвраты покупателям
CREATE TABLE ledger_accounts (
  id         text PRIMARY KEY,
  seller_id  uuid REFERENCES sellers (id),
  kind       text NOT NULL CHECK (kind IN ('held', 'available', 'paying_out', 'platform_fees', 'external')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ═══ 2. ОПЕРАЦИИ И ИХ ПЕРЕМЕЩЕНИЯ ═══
CREATE TABLE ledger_transactions (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind            text NOT NULL,         -- 'payment', 'deal_completed', 'payout_started', 'refund'…
  reference       text NOT NULL,         -- 'R-20431-1', номер выплаты
  idempotency_key text NOT NULL UNIQUE,  -- 'deal_completed:<id>': вторую такую операцию база не запишет
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  transaction_id bigint NOT NULL REFERENCES ledger_transactions (id),
  from_account   text NOT NULL REFERENCES ledger_accounts (id),
  to_account     text NOT NULL REFERENCES ledger_accounts (id),
  amount_kopecks integer NOT NULL CHECK (amount_kopecks > 0), -- только положительные: направление — «откуда → куда»
  CHECK (from_account <> to_account)
);
CREATE INDEX ledger_entries_from_idx ON ledger_entries (from_account);
CREATE INDEX ledger_entries_to_idx   ON ledger_entries (to_account);

-- Записи неизменны: приложению разрешено только добавлять. Ошибку исправляет обратная операция
REVOKE UPDATE, DELETE ON ledger_entries, ledger_transactions FROM remeslo_app;

-- ═══ 3. БАЛАНС СЧЁТА — ВСЁ, ЧТО ПРИШЛО, МИНУС ВСЁ, ЧТО УШЛО ═══
CREATE VIEW ledger_balances AS
SELECT a.id AS account,
       coalesce((SELECT sum(e.amount_kopecks) FROM ledger_entries e WHERE e.to_account = a.id), 0)
     - coalesce((SELECT sum(e.amount_kopecks) FROM ledger_entries e WHERE e.from_account = a.id), 0) AS balance_kopecks
FROM ledger_accounts a;
-- При десятках тысяч операций на продавца эту сумму хранят снимком и обновляют в той же транзакции,
-- что и проводки; но источник правды — всё равно строки журнала

-- ═══ 4. ЗАКАЗ АННЫ В ЖУРНАЛЕ ═══
-- 'payment' R-20431, 20 октября
--   external:buyers        → seller:obzhig:held         184 000   кружка 1 450 + доставка 390
--   external:buyers        → seller:len:held            425 000   скатерть 3 900 + доставка 350
-- 'deal_completed' R-20431-1, 25 октября — Анна нажала «всё в порядке»
--   seller:obzhig:held     → seller:obzhig:available    166 600
--   seller:obzhig:held     → platform:fees               17 400
-- 'payout_started' P-2026-10-27-…, 27 октября
--   seller:obzhig:available → seller:obzhig:paying_out  166 600
-- 'payout_paid', банк подтвердил
--   seller:obzhig:paying_out → external:paid_out        166 600
-- Итог по «Обжигу»: held 0 · available 0 · paying_out 0; комиссия площадки +174 ₽

-- ═══ 5. ПРОВЕРКИ — В ТЕСТАХ И РАЗ В СУТКИ ═══
-- В модели «откуда → куда» сумма всех балансов равна нулю по построению.
-- Поэтому сверяют журнал с ДРУГИМИ источниками:
-- а) «удержано» продавца = сумма его оплаченных, но не завершённых частей заказов
SELECT s.id, b.balance_kopecks AS held_in_ledger, coalesce(o.open_kopecks, 0) AS held_by_orders
FROM sellers s
JOIN ledger_balances b ON b.account = 'seller:' || s.id || ':held'
LEFT JOIN (
  SELECT seller_id, sum(items_kopecks + shipping_kopecks) AS open_kopecks
  FROM seller_orders
  WHERE status IN ('paid', 'shipped', 'delivered', 'disputed')
  GROUP BY seller_id
) o ON o.seller_id = s.id
WHERE b.balance_kopecks <> coalesce(o.open_kopecks, 0);   -- пусто — сходится
-- б) поступления на external:buyers за день = успешные платежи в выписке банка за день
-- в) переводы в external:paid_out за день = выплаты в выписке банка за день

-- ═══ 6. КОМУ ПЛАТИТЬ ВО ВТОРНИК ═══
SELECT b.account, b.balance_kopecks
FROM ledger_balances b
WHERE b.account LIKE 'seller:%:available'
  AND b.balance_kopecks >= 30000;   -- меньше 300 ₽ копится до следующей недели

-- ═══ КАК НЕ НАДО ═══
-- UPDATE sellers SET balance = balance + 1666 WHERE id = …     -- [!error] число без истории, гонки
-- DELETE FROM ledger_entries WHERE id = … — «ошиблись»        -- [!error] история перестала объяснять баланс
-- amount_kopecks numeric(12, 2) и «−1666» со знаком            -- [!error] дробные деньги и путаница со знаками
`;

  protected readonly payouts = `
// ═══ 1. ПРОВОДКА — ОДНА ФУНКЦИЯ НА ВСЮ ПЛОЩАДКУ (файл ledger.ts) ═══
import type pg from 'pg';
import { pool, tx, enqueue } from './db';
import { checkSelfEmployed } from './seller-onboarding';

export const held = (sellerId: string) => 'seller:' + sellerId + ':held';
export const available = (sellerId: string) => 'seller:' + sellerId + ':available';
export const payingOut = (sellerId: string) => 'seller:' + sellerId + ':paying_out';

type Move = { from: string; to: string; amountKopecks: number };

export async function ledgerTransaction(
  client: pg.PoolClient,
  kind: string,
  reference: string,
  idempotencyKey: string,
  moves: Move[],
): Promise<boolean> {
  const { rows } = await client.query<{ id: string }>(
    \`INSERT INTO ledger_transactions (kind, reference, idempotency_key) VALUES ($1, $2, $3)
     ON CONFLICT (idempotency_key) DO NOTHING RETURNING id\`,
    [kind, reference, idempotencyKey],
  );
  if (!rows[0]) return false; // уже записано — повтор события, ничего не делаем
  for (const move of moves) {
    if (!Number.isInteger(move.amountKopecks) || move.amountKopecks <= 0) throw new Error('bad amount ' + move.amountKopecks);
    await client.query(
      'INSERT INTO ledger_entries (transaction_id, from_account, to_account, amount_kopecks) VALUES ($1, $2, $3, $4)',
      [rows[0].id, move.from, move.to, move.amountKopecks],
    );
  }
  return true;
}

// Все операции с деньгами одного продавца берут ОДНУ блокировку — и баланс перечитывается под ней
async function lockSeller(client: pg.PoolClient, sellerId: string): Promise<void> {
  await client.query("SELECT pg_advisory_xact_lock(hashtext('seller-money:' || $1))", [sellerId]);
}

async function balance(client: pg.PoolClient, account: string): Promise<number> {
  const { rows } = await client.query<{ b: string }>('SELECT balance_kopecks AS b FROM ledger_balances WHERE account = $1', [account]);
  return Number(rows[0]?.b ?? 0); // sum() в pg приходит строкой — переводим в число
}

// ═══ 2. ВТОРНИК: ПОДГОТОВИТЬ ВЫПЛАТЫ ═══
const MIN_PAYOUT_KOPECKS = 30_000;          // 300 ₽: меньше — копится
const NEW_SELLER_FIRST_PAYOUT_DAYS = 14;    // первая выплата — не раньше чем через 14 дней после первой продажи

export async function preparePayouts(runDate: string): Promise<void> {
  const { rows } = await pool.query<{ seller_id: string; legal_type: string; inn: string }>(
    \`SELECT s.id AS seller_id, s.legal_type, s.inn
       FROM sellers s
       JOIN ledger_balances b ON b.account = 'seller:' || s.id || ':available'
      WHERE s.status IN ('active', 'suspended')            -- заблокированным — только после разбирательства
        AND b.balance_kopecks >= $1
        AND (SELECT min(so.completed_at) FROM seller_orders so WHERE so.seller_id = s.id)
            <= now() - make_interval(days => $2)\`,
    [MIN_PAYOUT_KOPECKS, NEW_SELLER_FIRST_PAYOUT_DAYS],
  );

  for (const seller of rows) {
    if (seller.legal_type === 'self_employed') {
      // Статус самозанятого — ПЕРЕД КАЖДОЙ выплатой: его теряют в любой момент
      const npd = await checkSelfEmployed(seller.inn, new Date());
      if (npd !== true) {
        await pool.query(
          "INSERT INTO payout_holds (seller_id, reason) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [seller.seller_id, npd === false ? 'not_self_employed' : 'npd_unchecked'],
        );
        continue; // не платим, пока не уверены; человек разберётся
      }
    }
    await tx(async (client) => {
      await lockSeller(client, seller.seller_id);
      const amount = await balance(client, available(seller.seller_id)); // перечитали ПОД блокировкой
      if (amount < MIN_PAYOUT_KOPECKS) return; // за это время пришёл возврат — платить нечего
      const number = 'P-' + runDate + '-' + seller.seller_id.slice(0, 8);
      // Бронь в журнале ДО запроса в банк: эти деньги уже не уйдут во вторую выплату
      const booked = await ledgerTransaction(client, 'payout_started', number, 'payout_started:' + number, [
        { from: available(seller.seller_id), to: payingOut(seller.seller_id), amountKopecks: amount },
      ]);
      if (!booked) return; // эту выплату уже готовили — повторный запуск
      await client.query(
        "INSERT INTO payouts (number, seller_id, amount_kopecks, status) VALUES ($1, $2, $3, 'pending')",
        [number, seller.seller_id, amount],
      );
      await enqueue(client, 'payout.send', { number }); // отправка — отдельной задачей
    });
  }
}

// ═══ 3. ОТПРАВИТЬ В БАНК (УСЛОВНЫЙ КЛИЕНТ СЕРВИСА РАСЧЁТОВ) ═══
declare const platformBank: {
  payout(request: { beneficiaryId: string; amountKopecks: number; idempotencyKey: string; purpose: string }): Promise<{
    status: 'succeeded' | 'failed' | 'processing';
    reason?: string;
  }>;
};

export async function sendPayout(payout: { number: string; beneficiaryId: string; amountKopecks: number; period: string }) {
  const result = await platformBank.payout({
    beneficiaryId: payout.beneficiaryId,
    amountKopecks: payout.amountKopecks,
    idempotencyKey: 'payout:' + payout.number, // повтор запроса не отправит деньги второй раз
    purpose: 'Выплата по отчёту за ' + payout.period + ', ' + payout.number,
  });
  if (result.status !== 'processing') await applyPayoutResult(payout.number, result.status, result.reason);
  // 'processing' — ждём уведомление банка или найдём в сверке по выписке
}

// ═══ 4. РЕЗУЛЬТАТ — ОДНА ФУНКЦИЯ ДЛЯ ОТВЕТА, УВЕДОМЛЕНИЯ И СВЕРКИ ═══
export async function applyPayoutResult(number: string, status: 'succeeded' | 'failed', reason?: string): Promise<void> {
  await tx(async (client) => {
    const { rows } = await client.query<{ seller_id: string; amount_kopecks: number }>(
      \`UPDATE payouts SET status = $2, failure_reason = $3
        WHERE number = $1 AND status = 'pending'
       RETURNING seller_id, amount_kopecks\`,
      [number, status === 'succeeded' ? 'paid' : 'failed', reason ?? null],
    );
    const payout = rows[0];
    if (!payout) return; // уже обработано — повтор
    await lockSeller(client, payout.seller_id);
    if (status === 'succeeded') {
      await ledgerTransaction(client, 'payout_paid', number, 'payout_paid:' + number, [
        { from: payingOut(payout.seller_id), to: 'external:paid_out', amountKopecks: payout.amount_kopecks },
      ]);
    } else {
      // Не прошло (закрыт счёт, неверная карта) — деньги обратно в «доступно», продавцу — письмо
      await ledgerTransaction(client, 'payout_failed', number, 'payout_failed:' + number, [
        { from: payingOut(payout.seller_id), to: available(payout.seller_id), amountKopecks: payout.amount_kopecks },
      ]);
      await enqueue(client, 'email.payout_failed', { number, reason });
    }
  });
}

// ═══ 5. ВОЗВРАТ ПОСЛЕ ЗАВЕРШЕНИЯ — «ДОСТУПНО» МОЖЕТ УЙТИ В МИНУС ═══
// Анна вернула кружку в законные 7 дней, а «Обжиг» деньги уже получил. Возврат за товар — 1 450 ₽:
// 1 276 ₽ — из денег «Обжига», 174 ₽ — комиссия, которую площадка тоже возвращает
export async function refundAfterCompletion(client: pg.PoolClient, part: { id: string; number: string; sellerId: string }, itemKopecks: number, commissionKopecks: number) {
  await lockSeller(client, part.sellerId);
  await ledgerTransaction(client, 'refund_after_completion', part.number, 'refund_after_completion:' + part.id, [
    { from: available(part.sellerId), to: 'external:refunded', amountKopecks: itemKopecks - commissionKopecks },
    { from: 'platform:fees', to: 'external:refunded', amountKopecks: commissionKopecks },
  ]);
  // Минус в «доступно» закроется следующими продажами: выплата берёт только положительный остаток.
  // Продаж больше нет — требование продавцу по правилам оферты
}

// ═══ КАК НЕ НАДО ═══
// await bank.payout(…); await bookInLedger(…);              // [!error] упали между — заплатили дважды
// const amount = balanceReadBeforeLock;                      // [!error] возврат пришёл в эту секунду
// if (seller.legalType === 'self_employed') pay();           // [!error] статус НПД мог смениться вчера
`;

  protected readonly agentReceipt = `
// ═══ 1. ЧЕК ПО ЗАКАЗУ АННЫ — ПЛОЩАДКА ВЫДАЁТ КАК АГЕНТ ПРОДАВЦОВ ═══
// Учебный пример: схему чеков для вашей площадки выбирают бухгалтер и юрист.
// Комментарии — только для учебника: в настоящий запрос уходит объект без них.
{
  "customer": { "email": "anna@mail.example" },
  "items": [
    {
      "description": "Кружка «Утро», графит, 350 мл",
      "quantity": 1,
      "amount": { "value": "1450.00", "currency": "RUB" },
      "vat_code": 1,                          // «Без НДС» — по налоговому режиму ПРОДАВЦА («Обжиг» — ИП на УСН)
      "payment_mode": "full_prepayment",      // деньги есть, товар ещё в пути — как в рецепте про магазин
      "payment_subject": "commodity",
      "agent_type": "agent",                  // признак агента; какой именно тип — по договору, решает юрист
      "supplier": {                           // данные ПОСТАВЩИКА — того, кто на самом деле продаёт
        "name": "ИП <ФИО предпринимателя> («Обжиг»)",
        "inn": "<ИНН продавца из анкеты>",
        "phone": "<телефон продавца>"
      }
    },
    {
      "description": "Доставка до пункта выдачи — «Обжиг»",
      "quantity": 1,
      "amount": { "value": "390.00", "currency": "RUB" },
      "vat_code": 1,
      "payment_mode": "full_prepayment",
      "payment_subject": "service",
      "agent_type": "agent",
      "supplier": { "name": "ИП <ФИО предпринимателя> («Обжиг»)", "inn": "<ИНН продавца>", "phone": "<телефон>" }
    },
    {
      "description": "Скатерть льняная 140 × 180, «овёс»",
      "quantity": 1,
      "amount": { "value": "3900.00", "currency": "RUB" },
      "vat_code": 1,
      "payment_mode": "full_prepayment",
      "payment_subject": "commodity",
      "agent_type": "agent",
      "supplier": { "name": "ИП <ФИО предпринимателя> («Лён и нить»)", "inn": "<ИНН продавца>", "phone": "<телефон>" },
      // Скатерть — маркированный товар: код маркировки КАЖДОЙ единицы передаётся в позиции чека.
      // Точные поля — по документации вашего сервиса (у ЮKassa для этого есть объект mark_code_info)
      "mark_code_info": { "gs_1m": "<код маркировки из «Честного знака»>" }
    },
    {
      "description": "Доставка до пункта выдачи — «Лён и нить»",
      "quantity": 1,
      "amount": { "value": "350.00", "currency": "RUB" },
      "vat_code": 1,
      "payment_mode": "full_prepayment",
      "payment_subject": "service",
      "agent_type": "agent",
      "supplier": { "name": "ИП <ФИО предпринимателя> («Лён и нить»)", "inn": "<ИНН продавца>", "phone": "<телефон>" }
    }
  ]
}
// Проверка: 1 450 + 390 + 3 900 + 350 = 6 090 ₽ — ровно сумма платежа.
// Комиссии площадки (642 ₽) в чеке покупателя НЕТ: покупатель платит за товары, а не за комиссию

// ═══ 2. ПРИ СПЛИТОВАНИИ ЮKASSA — ЧЕК ОТДЕЛЬНЫМ ЗАПРОСОМ ОТ ИМЕНИ МАГАЗИНА-ПРОДАВЦА ═══
// POST /v3/receipts — по одному чеку на продавца; on_behalf_of — shopId магазина-продавца в ЮKassa
{
  "type": "payment",
  "payment_id": "<id платежа>",
  "on_behalf_of": "<shopId «Обжига»>",
  "customer": { "email": "anna@mail.example" },
  "send": true,
  "items": [
    {
      "description": "Кружка «Утро», графит, 350 мл",
      "quantity": 1,
      "amount": { "value": "1450.00", "currency": "RUB" },
      "vat_code": 1,
      "payment_mode": "full_prepayment",
      "payment_subject": "commodity"
    }
  ]
}
// У каждого магазина-продавца в ЮKassa должен быть включён сценарий «сначала платёж, потом чек»

// ═══ 3. САМОЗАНЯТЫЙ — ЧЕК НПД, А НЕ КАССОВЫЙ ═══
// Семён из «Дубравы» продал доску для хлеба за 1 900 ₽:
//   чек НПД формирует сам Семён в «Моём налоге» — или площадка-партнёр налоговой по его разрешению.
//   Нужен ли при этом кассовый чек площадки — зависит от схемы расчётов: вопрос бухгалтеру и юристу

// ═══ КАК НЕ НАДО ═══
// "supplier" не указан — как будто кружку продала сама площадка   // [!error]
// в чек покупателя добавили строку «комиссия площадки 642 ₽»       // [!error] покупатель её не платит
// маркированная скатерть без кода маркировки в чеке                // [!error]
`;

  protected readonly deliveryModels = `

═══ ТРИ МОДЕЛИ ДОСТАВКИ НА МАРКЕТПЛЕЙСЕ ═══

  модель                  договор со службой   кто сдаёт посылку   чьи деньги за доставку
  ─────────────────────────────────────────────────────────────────────────────────
  1. продавец везёт сам   у продавца           продавец            продавца — в его выплату,
                                                                    без комиссии
  2. договор площадки     у площадки           продавец по         площадки — она платит службе;
                                               этикетке площадки   в журнале: «доставка к оплате»
  3. склад площадки       у площадки           площадка со склада  площадки
                                                                    (у «Ремесла» этого нет)


═══ ПУТЬ ДЕНЕГ ЗА ДОСТАВКУ В ЖУРНАЛЕ ═══

  модель 1 («Обжиг» в заказе Анны)
    оплата:       external:buyers → seller:obzhig:held      390 ₽ (вместе с товаром)
    завершение:   seller:obzhig:held → seller:obzhig:available  390 ₽ — без комиссии

  модель 2 (доставка площадки)
    оплата:       external:buyers → platform:shipping_payable   390 ₽
    счёт службы:  platform:shipping_payable → external:carriers  по счёту за месяц
    разница тарифа (договорились дешевле) — доход площадки, и это видно в журнале


═══ КТО ЗА ЧТО ОТВЕЧАЕТ ═══

  ситуация                       перед покупателем    кто компенсирует продавцу
  ───────────────────────────────────────────────────────────────────────────
  посылка потерялась             возврат из удержанного  служба доставки — по претензии продавца
  разбилась, упаковка правильная возврат                 служба доставки — по фото упаковки
  разбилась, упаковка плохая     возврат                 никто: убыток продавца
  не отправил в срок             автоотмена и возврат    —
  покупатель не забрал из ПВЗ    возврат за товар после  обратная доставка — по правилам
                                 возврата посылки        площадки, обычно за счёт покупателя


═══ ТРЕБОВАНИЯ К УПАКОВКЕ ХРУПКОГО — ИЗ ПРАВИЛ «РЕМЕСЛА» ═══

  • керамика и стекло: два слоя плёнки с пузырьками, жёсткая коробка,
    5 см свободного места заполнены, наклейка «Хрупкое»
  • фото упакованной посылки — в карточке заказа ДО передачи в службу
  • вес и размеры посылки — в заказе: по ним считается доставка и решаются
    споры «взяли за посылку меньше, чем она весит»


═══ КАК НЕ НАДО ═══

  кнопка «доставлено» в кабинете продавца                                [!error]
  плата за доставку площадки → в выплату продавцу «как обычно»           [!error]
  «разбилось — сами разбирайтесь со службой доставки» покупателю         [!error]
`;

  protected readonly reviews = `
-- ═══ 1. ОТЗЫВ ПРИВЯЗАН К КУПЛЕННОЙ ВЕЩИ ═══
CREATE TABLE reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id   uuid NOT NULL UNIQUE REFERENCES order_items (id), -- одна купленная вещь — один отзыв
  listing_id      uuid NOT NULL REFERENCES listings (id),
  seller_id       uuid NOT NULL REFERENCES sellers (id),
  author_id       uuid NOT NULL REFERENCES users (id),
  rating          smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text            text,
  status          text NOT NULL DEFAULT 'published'
                  CHECK (status IN ('published', 'pending_check', 'removed')), -- pending_check — подозрительная покупка
  removed_reason  text,                 -- только нарушение правил: оскорбления, чужие данные, реклама
  seller_reply    text,                 -- продавец отвечает, но не удаляет
  tags            text[] NOT NULL DEFAULT '{}', -- из анкеты отзыва: 'slow_shipping', 'packaging', 'as_described'…
  created_at      timestamptz NOT NULL DEFAULT now(),
  editable_until  timestamptz NOT NULL DEFAULT now() + interval '30 days'
);

-- ═══ 2. ОСТАВИТЬ ОТЗЫВ МОЖНО ТОЛЬКО О ДОСТАВЛЕННОМ И ТОЛЬКО ПОКУПАТЕЛЮ ═══
INSERT INTO reviews (order_item_id, listing_id, seller_id, author_id, rating, text, status)
SELECT oi.id, v.listing_id, so.seller_id, o.buyer_id, $3, $4,
       CASE WHEN $5 THEN 'pending_check' ELSE 'published' END   -- $5 — признаки подозрительной покупки
FROM order_items oi
JOIN seller_orders so ON so.id = oi.seller_order_id
JOIN orders o         ON o.id = so.order_id
JOIN variants v       ON v.id = oi.variant_id
WHERE oi.id = $1
  AND o.buyer_id = $2                                       -- автор — тот, кто купил
  AND so.status IN ('delivered', 'completed')               -- вещь уже у покупателя
RETURNING id;
-- 0 строк — чужой заказ, ещё не доставлено или отзыв уже есть (UNIQUE по order_item_id)

-- ═══ 3. ПРИЗНАКИ ПОДОЗРИТЕЛЬНОЙ ПОКУПКИ — ПОМЕЧАЕМ, НЕ УДАЛЯЕМ ═══
-- считаются в приложении перед вставкой отзыва:
--   • покупатель и продавец заходили с одного устройства или из одной сети за последние 30 дней
--   • адрес доставки совпадает с адресом продавца
--   • одна карта оплатила больше 3 заказов у этого продавца за месяц
--   • учётной записи покупателя меньше 7 дней, и это её первая покупка у нового продавца

-- ═══ 4. РЕЙТИНГ ДЛЯ СОРТИРОВКИ — СГЛАЖЕННОЕ СРЕДНЕЕ ═══
-- (C × m + сумма оценок) / (C + число отзывов):
--   m — средняя оценка по всей площадке, C — сколько «воображаемых» отзывов добавить
WITH platform AS (
  SELECT avg(rating)::numeric AS m, 10 AS c
  FROM reviews
  WHERE status = 'published' AND created_at > now() - interval '12 months'
)
SELECT r.listing_id,
       count(*)                                   AS reviews_count,
       round(avg(r.rating)::numeric, 2)           AS shown_average,   -- это показываем покупателю
       round((p.c * p.m + sum(r.rating)) / (p.c + count(*)), 3) AS rating_adjusted -- это — для поиска
FROM reviews r
CROSS JOIN platform p
WHERE r.status = 'published'
  AND r.created_at > now() - interval '12 months'          -- только последний год
GROUP BY r.listing_id, p.m, p.c;
-- кружка «Дубравы»:  1 отзыв, 5      → shown 5.00, adjusted (10 × 4.6 + 5) / 11     = 4.636
-- кружка «Обжига»: 100 отзывов, 4.9  → shown 4.90, adjusted (10 × 4.6 + 490) / 110  = 4.873
-- Товары без отзывов в выборку не попадут — их rating_adjusted = m (средняя по площадке)

-- ═══ 5. НА ЧТО ЖАЛУЮТСЯ — ПОДСКАЗКА ПРОДАВЦУ В КАБИНЕТЕ ═══
SELECT tag, count(*) AS mentions
FROM reviews r, unnest(r.tags) AS tag                      -- теги из анкеты отзыва: 'slow_shipping', 'packaging'…
WHERE r.seller_id = $1 AND r.rating <= 3 AND r.created_at > now() - interval '90 days'
GROUP BY tag
ORDER BY mentions DESC;

-- ═══ КАК НЕ НАДО ═══
-- INSERT INTO reviews (listing_id, author_id, rating) — без покупки        -- [!error]
-- ORDER BY avg(rating) DESC                                               -- [!error] одна пятёрка наверху
-- DELETE FROM reviews WHERE rating <= 2 AND seller_id = $1 — «по просьбе продавца»  -- [!error]
`;

  protected readonly messaging = `
// ═══ 1. ПЕРЕПИСКА — МЕЖДУ ПОКУПАТЕЛЕМ И ПРОДАВЦОМ, О ТОВАРЕ ИЛИ ЗАКАЗЕ ═══
import type pg from 'pg';
import { enqueue } from './db';
import { publish } from './realtime'; // доставка в открытые вкладки через WebSocket

type Thread = { id: string; buyerId: string; sellerId: string; listingId: string | null; sellerOrderId: string | null };

// ═══ 2. ЧТО СКРЫВАЕМ ДО ПОКУПКИ ═══
// Только то, что ДЕЙСТВИТЕЛЬНО похоже на контакт, — «скатерть 140 на 180» трогать нельзя
const PHONE = /(?:\\+7|8)[\\s(-]*\\d{3}[\\s)-]*\\d{3}[\\s-]*\\d{2}[\\s-]*\\d{2}/g;
const LINK = /(?:https?:\\/\\/|www\\.)\\S+|(?:t\\.me|vk\\.com|wa\\.me)\\/\\S+/gi;
const EMAIL = /[\\w.+-]+@[\\w-]+\\.[\\w.]+/g;
const HANDLE = /(?<![\\w.])@[A-Za-z0-9_]{4,}/g; // @len_i_nit — имя в мессенджере
const OFF_PLATFORM = /(?<!\\p{L})(?:телеграм\\p{L}*|telegram|ватсап\\p{L}*|whatsapp|в\\s+личк[уеи])(?!\\p{L})/giu;
// Схемы мошенничества: «оплатите по ссылке», «получите деньги по ссылке»
const PAY_BY_LINK = /(?<!\\p{L})(?:оплат\\p{L}*|получ\\p{L}*\\s+деньг\\p{L}*|перевед\\p{L}*)(?!\\p{L})[^.!?]{0,40}(?:ссылк\\p{L}*|по\\s+номеру\\s+карт\\p{L}*)/iu;

const HIDDEN = '[контакты скрыты — общайтесь здесь, это безопаснее]';

export function maskContacts(text: string): { text: string; masked: boolean } {
  let masked = false;
  const replaced = [PHONE, LINK, EMAIL, HANDLE, OFF_PLATFORM].reduce((acc, pattern) =>
    acc.replace(pattern, () => {
      masked = true;
      return HIDDEN;
    }), text);
  return { text: replaced, masked };
}
// maskContacts('Скатерть 140 на 180 сошью к 23.12')       → без изменений
// maskContacts('пишите в телеграм @len_i_nit')           → «пишите в [контакты скрыты…] [контакты скрыты…]»

// ═══ 3. ОТПРАВИТЬ СООБЩЕНИЕ ═══
export async function sendMessage(client: pg.PoolClient, thread: Thread, authorId: string, raw: string) {
  // Писать в переписку могут только её участники: покупатель или участник магазина-продавца
  const isBuyer = authorId === thread.buyerId;
  const isSeller = (await client.query('SELECT 1 FROM seller_members WHERE seller_id = $1 AND user_id = $2', [thread.sellerId, authorId])).rowCount === 1;
  if (!isBuyer && !isSeller) throw new Error('forbidden');

  const text = raw.trim().slice(0, 4000);
  // Контакты скрываем, пока между ними нет оплаченного заказа. После — адрес и телефон есть в заказе
  const paid = (await client.query(
    \`SELECT 1 FROM seller_orders so JOIN orders o ON o.id = so.order_id
      WHERE so.seller_id = $1 AND o.buyer_id = $2 AND so.status <> 'awaiting_payment' LIMIT 1\`,
    [thread.sellerId, thread.buyerId],
  )).rowCount === 1;
  const { text: shown, masked } = paid ? { text, masked: false } : maskContacts(text);

  const suspicious = PAY_BY_LINK.test(text); // похоже на «оплатите по ссылке» — человеку на проверку
  const { rows } = await client.query<{ id: string }>(
    \`INSERT INTO messages (thread_id, author_id, original_text, shown_text, masked, flagged)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id\`,
    [thread.id, authorId, text, shown, masked, suspicious],
  );
  if (masked && isSeller) {
    // Продавцу — напоминание правил; повторные попытки уводить — в его надёжность
    await client.query("INSERT INTO seller_events (seller_id, kind) VALUES ($1, 'contacts_masked')", [thread.sellerId]);
  }
  if (suspicious) await enqueue(client, 'trust.review_message', { messageId: rows[0].id });

  // В реальном времени — тем, у кого открыта переписка; остальным — письмо или push через задачу
  await publish('thread:' + thread.id, { id: rows[0].id, authorId, text: shown });
  await enqueue(client, 'notify.new_message', { threadId: thread.id, messageId: rows[0].id });
  return { id: rows[0].id, masked };
}
// original_text хранится, чтобы разобрать жалобу или спор; показывают его только сотрудникам
// безопасности по конкретному обращению — и каждый такой просмотр пишется в журнал

// ═══ КАК НЕ НАДО ═══
// text.replace(/\\d{3,}/g, '***')                         // [!error] «140180» и номер заказа — тоже «контакт»
// показывать в переписке телефон покупателя для доставки  // [!error] он есть в заказе — и только у продавца
// support читает переписки «для контроля качества»        // [!error] это персональные данные
`;

  protected readonly disputes = `
// ═══ 1. СПОР — ПО ЧАСТИ ЗАКАЗА ═══
import type pg from 'pg';
import { enqueue } from './db';
import { ledgerTransaction, held } from './ledger';

type Reason = 'not_received' | 'not_as_described' | 'damaged' | 'defect';
type Demand = { kind: 'full_refund' } | { kind: 'partial_refund'; amountKopecks: number } | { kind: 'replacement' };

const CLAIM_WINDOW_DAYS = 7;   // после доставки
const SELLER_REPLY_DAYS = 3;   // молчание продавца — решение в пользу покупателя

export async function openDispute(
  client: pg.PoolClient,
  buyerId: string,
  sellerOrderId: string,
  reason: Reason,
  demand: Demand,
  photoIds: string[],
): Promise<string | null> {
  // Только покупатель этого заказа, только в срок, только один открытый спор на часть
  const { rows } = await client.query<{ id: string }>(
    \`INSERT INTO disputes (seller_order_id, buyer_id, reason, demand, photo_ids, status, reply_due_at)
     SELECT so.id, o.buyer_id, $3, $4, $5, 'open', now() + make_interval(days => $6)
       FROM seller_orders so JOIN orders o ON o.id = so.order_id
      WHERE so.id = $1 AND o.buyer_id = $2
        AND so.status IN ('shipped', 'delivered')                     -- до завершения сделки
        AND (so.delivered_at IS NULL OR so.delivered_at > now() - make_interval(days => $7))
     ON CONFLICT (seller_order_id) WHERE status = 'open' DO NOTHING -- частичный уникальный индекс: один открытый спор
     RETURNING id\`,
    [sellerOrderId, buyerId, reason, JSON.stringify(demand), photoIds, SELLER_REPLY_DAYS, CLAIM_WINDOW_DAYS],
  );
  if (!rows[0]) return null;
  // Деньги части ЗАМОРОЖЕНЫ: completeSellerOrder не завершит сделку, пока спор открыт
  await client.query("UPDATE seller_orders SET status = 'disputed' WHERE id = $1", [sellerOrderId]);
  await enqueue(client, 'email.dispute_opened', { disputeId: rows[0].id }); // продавцу: «3 дня на ответ»
  return rows[0].id;
}
// Для «не получено» после завершения сделки и для возвратов в законные 7 дней после
// «всё в порядке» — отдельный путь refundAfterCompletion из раздела о выплатах

// ═══ 2. МОЛЧАНИЕ ПРОДАВЦА — В ПОЛЬЗУ ПОКУПАТЕЛЯ (ПЛАНИРОВЩИК) ═══
export async function autoResolveSilent(client: pg.PoolClient): Promise<void> {
  const { rows } = await client.query<{ id: string }>(
    \`UPDATE disputes SET status = 'resolved', resolution = 'buyer_by_seller_silence', resolved_at = now()
      WHERE status = 'open' AND seller_replied_at IS NULL AND reply_due_at < now()
     RETURNING id\`,
  );
  for (const d of rows) await executeResolution(client, d.id, { kind: 'full_refund' });
}

// ═══ 3. ИСПОЛНЕНИЕ РЕШЕНИЯ — В ДЕНЬГАХ ═══
type Resolution = { kind: 'full_refund' } | { kind: 'partial_refund'; amountKopecks: number } | { kind: 'seller_wins' };

export async function executeResolution(client: pg.PoolClient, disputeId: string, resolution: Resolution) {
  const { rows } = await client.query<{ seller_order_id: string; number: string; seller_id: string; items_kopecks: number; shipping_kopecks: number; commission_kopecks: number; commission_bps: number }>(
    \`SELECT so.id AS seller_order_id, so.number, so.seller_id, so.items_kopecks, so.shipping_kopecks,
            so.commission_kopecks, s.goods_commission_bps AS commission_bps
       FROM disputes d JOIN seller_orders so ON so.id = d.seller_order_id JOIN sellers s ON s.id = so.seller_id
      WHERE d.id = $1 FOR UPDATE OF so\`,
    [disputeId],
  );
  const part = rows[0];
  const total = part.items_kopecks + part.shipping_kopecks;

  if (resolution.kind === 'seller_wins') {
    // Возвращаем часть в обычный путь: «доставлено» → завершение и проводки, как без спора
    await client.query("UPDATE seller_orders SET status = 'delivered' WHERE id = $1", [part.seller_order_id]);
    await enqueue(client, 'deal.complete', { sellerOrderId: part.seller_order_id });
    return;
  }

  // Сделка не завершена → деньги ещё в «удержано»; комиссии с возвращённого не будет
  const refund = resolution.kind === 'full_refund' ? total : resolution.amountKopecks;
  if (refund <= 0 || refund > total) throw new Error('bad refund amount');
  await ledgerTransaction(client, 'refund', part.number, 'refund:dispute:' + disputeId, [
    { from: held(part.seller_id), to: 'external:refunded', amountKopecks: refund },
  ]);
  await client.query(
    "UPDATE seller_orders SET status = $2 WHERE id = $1",
    [part.seller_order_id, refund === total ? 'refunded' : 'delivered'], // частичный — остаток идёт к завершению
  );
  if (refund < total) {
    // Частичный возврат: комиссия пересчитывается с оставшейся суммы товара
    const itemsLeft = Math.max(part.items_kopecks - refund, 0);
    const commissionLeft = Math.round((itemsLeft * part.commission_bps) / 10_000);
    await client.query('UPDATE seller_orders SET commission_kopecks = $2 WHERE id = $1', [part.seller_order_id, commissionLeft]);
    await enqueue(client, 'deal.complete', { sellerOrderId: part.seller_order_id });
  }
  // Деньги покупателю — к ИСХОДНОМУ платежу, с чеком возврата («возврат прихода») с признаком агента
  await enqueue(client, 'refund.to_buyer', { sellerOrderId: part.seller_order_id, amountKopecks: refund, disputeId });
  // Спор — в надёжность продавца: от доли споров зависят поиск и лимиты выплат
  await client.query(
    "INSERT INTO seller_events (seller_id, kind, data) VALUES ($1, 'dispute_lost', $2)",
    [part.seller_id, JSON.stringify({ disputeId, refund })],
  );
}
// Если вещь нужно вернуть продавцу — refund.to_buyer ставится в очередь, когда служба доставки
// показала, что посылка вручена продавцу, а не в момент решения: покупатель не получит и деньги, и вещь

// ═══ КАК НЕ НАДО ═══
// if (dispute.opened) refundFull();                    — всегда в пользу покупателя   // [!error]
// UPDATE sellers SET balance = balance - refund         — мимо журнала                // [!error]
// перевод покупателю на карту вместо возврата к платежу — без связи и без чека        // [!error]
`;

  protected readonly riskRules = `
// ═══ 1. ПРАВИЛА РИСКА — ДАННЫЕ: БАЛЛЫ, А НЕ БЛОКИРОВКИ ═══
import type pg from 'pg';

type OrderContext = {
  buyerAccountAgeDays: number;
  orderTotalKopecks: number;
  distinctSellers: number;
  shippingMatchesSellerAddress: boolean;
  sameDeviceAsSeller: boolean;
  ordersFromThisCardLast24h: number;
  buyerDisputesNotReceived60d: number;
};

type Rule = { id: string; points: number; test: (ctx: OrderContext) => boolean; why: string };

// Каждое правило — короткое и объяснимое; веса подстраивают по журналу срабатываний
export const ORDER_RULES: Rule[] = [
  { id: 'new_account', points: 1, test: (c) => c.buyerAccountAgeDays < 2, why: 'учётной записи меньше двух дней' },
  { id: 'big_order', points: 1, test: (c) => c.orderTotalKopecks > 1_500_000, why: 'заказ дороже 15 000 ₽' },
  { id: 'many_sellers_new', points: 2, test: (c) => c.buyerAccountAgeDays < 2 && c.distinctSellers >= 4, why: 'новый покупатель сразу у четырёх продавцов' },
  { id: 'ships_to_seller', points: 3, test: (c) => c.shippingMatchesSellerAddress, why: 'доставка на адрес продавца — покупка у себя?' },
  { id: 'same_device', points: 3, test: (c) => c.sameDeviceAsSeller, why: 'покупатель и продавец с одного устройства' },
  { id: 'card_velocity', points: 2, test: (c) => c.ordersFromThisCardLast24h >= 5, why: 'одна карта — пять заказов за сутки' },
  { id: 'serial_not_received', points: 2, test: (c) => c.buyerDisputesNotReceived60d >= 2, why: 'два спора «не получил» за два месяца' },
];

const REVIEW_THRESHOLD = 4; // сумма баллов от 4 — ручная проверка

export function scoreOrder(ctx: OrderContext): { score: number; hits: { id: string; why: string }[] } {
  const hits = ORDER_RULES.filter((rule) => rule.test(ctx));
  return { score: hits.reduce((sum, rule) => sum + rule.points, 0), hits: hits.map(({ id, why }) => ({ id, why })) };
}

// ═══ 2. ЧТО ДЕЛАЕМ С РЕЗУЛЬТАТОМ ═══
export async function applyOrderRisk(client: pg.PoolClient, orderId: string, ctx: OrderContext): Promise<'ok' | 'review'> {
  const { score, hits } = scoreOrder(ctx);
  // Журнал срабатываний — даже когда порог не превышен: так видно, какие правила полезны
  await client.query('INSERT INTO risk_checks (subject, subject_id, score, hits) VALUES ($1, $2, $3, $4)', [
    'order',
    orderId,
    score,
    JSON.stringify(hits),
  ]);
  if (score < REVIEW_THRESHOLD) return 'ok';
  // Не «отказать», а «проверить»: заказ ждёт человека, покупатель видит нейтральное сообщение
  await client.query("UPDATE orders SET risk_hold = true WHERE id = $1", [orderId]);
  await client.query("INSERT INTO trust_queue (subject, subject_id, reason) VALUES ('order', $1, $2)", [orderId, hits.map((h) => h.why).join('; ')]);
  return 'review'; // интерфейс: «заказ проверяется, это займёт до двух часов»
}

// ═══ 3. СМЕНА РЕКВИЗИТОВ ВЫПЛАТ — САМОЕ ЦЕННОЕ МЕСТО ДЛЯ ЗЛОУМЫШЛЕННИКА ═══
const PAYOUT_DETAILS_DELAY_HOURS = 48;

export async function requestPayoutDetailsChange(
  client: pg.PoolClient,
  sellerId: string,
  userId: string,
  newDetails: { providerAccountId?: string; cardLast4?: string },
  secondFactorVerified: boolean,
): Promise<{ effectiveAt: Date }> {
  if (!secondFactorVerified) throw new Error('second factor required'); // без второго фактора — никак
  const { rows } = await client.query<{ effective_at: Date }>(
    \`INSERT INTO payout_details_changes (seller_id, requested_by, new_details, effective_at)
     VALUES ($1, $2, $3, now() + make_interval(hours => $4))
     RETURNING effective_at\`,
    [sellerId, userId, JSON.stringify(newDetails), PAYOUT_DETAILS_DELAY_HOURS],
  );
  // Письмо и уведомление на СТАРЫЕ контакты: «реквизиты изменены — если это не вы, нажмите сюда»
  await client.query("INSERT INTO jobs (kind, payload, run_at) VALUES ('email.payout_details_changed', $1, now())", [
    JSON.stringify({ sellerId }),
  ]);
  return { effectiveAt: rows[0].effective_at }; // до этого момента выплаты идут по старым реквизитам
}

// ═══ КАК НЕ НАДО ═══
// if (score >= 4) blockForever(buyer);                        // [!error] признаки — не доказательство
// UPDATE seller_payout_details SET … — сразу по кнопке         // [!error] украли пароль — украли выплату
// правила риска захардкожены, срабатывания нигде не пишутся   // [!error] не узнать, что работает
`;

  protected readonly booking = `
-- ═══ 1. РЕСУРСЫ, СЛОТЫ, БРОНИРОВАНИЯ ═══
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- нужно, чтобы в одном ограничении сочетать «=» и «пересекается»

CREATE TABLE resources (                     -- то, что не может быть занято дважды одновременно
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers (id),
  name      text NOT NULL,                   -- «Мастерская „Обжига“»
  timezone  text NOT NULL DEFAULT 'Europe/Moscow'
);

CREATE TABLE slots (                         -- конкретное занятие
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources (id),
  listing_id  uuid NOT NULL REFERENCES listings (id),  -- карточка мастер-класса
  during      tstzrange NOT NULL,            -- [начало, конец) — конец НЕ входит: 10–12 и 12–14 не пересекаются
  capacity    integer NOT NULL CHECK (capacity > 0),
  booked      integer NOT NULL DEFAULT 0,
  price_kopecks integer NOT NULL CHECK (price_kopecks > 0), -- за одно место
  status      text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'done')),
  CHECK (booked BETWEEN 0 AND capacity),     -- больше мест, чем есть, — не запишется НИКОГДА
  -- В одном ресурсе два живых занятия не пересекаются по времени
  EXCLUDE USING gist (resource_id WITH =, during WITH &&) WHERE (status <> 'cancelled')
);

CREATE TABLE bookings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id       uuid NOT NULL REFERENCES slots (id),
  buyer_id      uuid NOT NULL REFERENCES users (id),
  seats         integer NOT NULL CHECK (seats > 0),
  status        text NOT NULL CHECK (status IN ('awaiting_payment', 'paid', 'cancelled', 'attended', 'no_show')),
  seller_order_id uuid REFERENCES seller_orders (id), -- деньги идут тем же путём, что у товаров
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ═══ 2. ЗАНЯТИЯ «ОБЖИГА» НА СУББОТУ 7 НОЯБРЯ ═══
INSERT INTO slots (resource_id, listing_id, during, capacity, price_kopecks) VALUES
  ($1, $2, tstzrange('2026-11-07 10:00+03', '2026-11-07 12:00+03'), 8, 250000),  -- лепка для детей
  ($1, $3, tstzrange('2026-11-07 12:00+03', '2026-11-07 14:00+03'), 6, 350000);  -- гончарный круг

-- Попытка поставить третье занятие, которое пересекается с 12–14:
INSERT INTO slots (resource_id, listing_id, during, capacity, price_kopecks)
VALUES ($1, $4, tstzrange('2026-11-07 13:00+03', '2026-11-07 15:00+03'), 6, 300000);
-- → ERROR: conflicting key value violates exclusion constraint — база не дала

-- ═══ 3. ЗАБРОНИРОВАТЬ МЕСТА — ОДНИМ УСЛОВНЫМ ЗАПРОСОМ ═══
-- Игорь берёт 2 места на «Гончарный круг»; занято 4 из 6
UPDATE slots
   SET booked = booked + $2                   -- $2 = 2
 WHERE id = $1
   AND status = 'scheduled'
   AND lower(during) > now() + interval '2 hours'   -- за два часа до начала запись закрывается
   AND booked + $2 <= capacity                -- проверка и увеличение — за один шаг
RETURNING booked, capacity;
-- 1 строка → места взяты (6 из 6), создаём бронь и платёж
-- 0 строк  → мест нет или запись закрыта: второй покупатель с теми же двумя местами получит отказ

-- ═══ 4. ОТМЕНА ПОКУПАТЕЛЕМ — ПО ПОЛИТИКЕ ═══
-- больше 48 часов до начала → полный возврат; меньше → половина; не пришёл → без возврата
SELECT b.id,
       CASE WHEN lower(s.during) - now() > interval '48 hours' THEN 1.0
            WHEN lower(s.during) > now()                        THEN 0.5
            ELSE 0 END                                         AS refund_share
FROM bookings b JOIN slots s ON s.id = b.slot_id
WHERE b.id = $1 AND b.buyer_id = $2 AND b.status = 'paid';
-- места возвращаются в слот: UPDATE slots SET booked = booked - seats …

-- ═══ 5. ЗАНЯТИЕ СОСТОЯЛОСЬ → СУТКИ НА ПРЕТЕНЗИЮ → ДЕНЬГИ ДОСТУПНЫ ═══
UPDATE seller_orders so
   SET status = 'delivered', delivered_at = upper(s.during)   -- «доставлено» для услуги = занятие закончилось
  FROM bookings b JOIN slots s ON s.id = b.slot_id
 WHERE b.seller_order_id = so.id AND so.status = 'paid'
   AND s.status = 'done' AND b.status IN ('attended', 'paid');
-- дальше — тот же completeSellerOrder, но со сроком претензии 1 день вместо 7

-- ═══ КАК НЕ НАДО ═══
-- SELECT booked FROM slots …; if (booked + 2 <= capacity) UPDATE …   -- [!error] восемь человек на шесть кругов
-- during: два столбца starts_at/ends_at и проверка пересечений в коде  -- [!error] гонка при двух вставках
-- '2026-11-07 12:00' без часового пояса                               -- [!error] чьё это 12:00?
`;

  protected readonly cabinets = `

═══ КАБИНЕТ ПРОДАВЦА «ОБЖИГ» — ПО ПОРЯДКУ ВАЖНОСТИ ═══

  1. СЕГОДНЯ
     • отправить: R-20431-1 — до 23 октября (осталось 2 дня)
                  R-20502-1 — до 22 октября ⚠ осталось меньше суток
     • сообщения: 3 новых (2 — вопросы до покупки)
     • споры:     1 открыт — «пришла со сколом», ответить до 26 октября

  2. ДЕНЬГИ
     удержано по незавершённым заказам              8 940 ₽  → список заказов
     доступно к выплате                            11 820 ₽  → список операций
     ближайшая выплата                       вторник, 27 октября
     история выплат и отчёты за месяц (PDF, таблица для бухгалтера)

     «почему 11 820, а не 12 450?» → раскрываем:
        + 1 666   R-20431-1 завершён 25.10
        + 2 404   R-20377-1 завершён 23.10
        …
        −   630   возврат по R-20918-1 (кружка со сколом, частичный)

  3. КАРТОЧКИ
     • 41 опубликована · 2 на модерации · 1 отклонена: «нужно три фотографии»
     • просмотры и покупки по каждой; подсказки: «у 3 карточек одна фотография»

  4. ОТЗЫВЫ
     • 4,9 · 112 отзывов за год · ответить на новые

  5. НАСТРОЙКИ
     • реквизиты выплат — смена со вторым фактором, действует через 48 часов
     • участники: Ольга (владелец), Павел (менеджер)
     • отпуск: «не принимаю заказы с 1 по 14 января»


═══ АДМИНКА ПЛОЩАДКИ — ОЧЕРЕДИ СО СРОКАМИ ═══

  очередь                         сейчас   дольше нормы   норма
  ─────────────────────────────────────────────────────────────
  карточки на модерации              18          2         24 часа
  продавцы на проверке                5          0         2 рабочих дня
  споры на решении площадки           3          1         5 рабочих дней
  неопознанные поступления            1          0         1 рабочий день
  выплаты на удержании                2          0         до вторника
  пометки правил риска                7          3         2 часа


═══ РОЛИ СОТРУДНИКОВ — НАИМЕНЬШИЕ ПРИВИЛЕГИИ ═══

                       карточки   заказы   переписка   деньги   реквизиты
  модератор               да        —         —          —         —
  специалист по спорам    да        да     по спору      —         —
  финансист               —         да        —          да     только смена
  администратор           да        да     по спору      да        да

  Каждое действие — в журнал с причиной; ограничение продавца — с письмом
  ему: что случилось, почему, как обжаловать.


═══ КАК НЕ НАДО ═══

  в кабинете одно число «к выплате» без расшифровки                      [!error]
  «снять все карточки» в админке без причины и письма продавцу           [!error]
  модератор видит реквизиты выплат «на всякий случай»                     [!error]
`;

  protected readonly legalChecklist = `

═══ ЗАКОН О ПЛАТФОРМЕННОЙ ЭКОНОМИКЕ — КОРОТКО ═══

  что это           Федеральный закон от 31.07.2025 № 289-ФЗ
  с какого дня      основные нормы — с 1 октября 2026 года
  кого касается     посреднических платформ из реестра; критерии — постановлением
                    правительства (по разборам: аудитория от 100 тыс. в сутки
                    + 10 тыс. партнёров за год или оборот больше 50 млрд ₽)
  «Ремесло»         в реестр не входит — но следует тем же принципам
  важно             сроки и детали сверяйте с текстом закона и постановлений


═══ ЧТО ИЗ ЭТИХ ПРИНЦИПОВ СТОИТ ЗАЛОЖИТЬ В КОД С ПЕРВОГО ДНЯ ═══

  принцип                                      где в коде
  ─────────────────────────────────────────────────────────────────────────
  правила площадки опубликованы, договор —     версии документов и принятие
  в электронной форме                          с датой, кем и откуда
  порядок ранжирования раскрыт                 страница «как устроен поиск»
  отказ от акций не понижает в выдаче           акции НЕ участвуют в формуле поиска
  скидка за счёт продавца — только с согласия  флажок согласия на каждую акцию
  об изменении условий — заранее               дата вступления в силу у версии оферты
                                               + письма за N дней
  ограничения — с причиной и обжалованием      причина из списка, кнопка «обжаловать»,
                                               срок ответа в очереди админки
  в карточке — что площадка не продавец         блок «о продавце» в шаблоне карточки
  запрещённые товары не публикуются             категории и правила модерации


═══ ВЛАДЕЛЕЦ АГРЕГАТОРА — ПО ЗАКОНУ О ЗАЩИТЕ ПРАВ ПОТРЕБИТЕЛЕЙ ═══

  • показать сведения о себе и о продавце: наименование, адрес, ОГРН/ОГРНИП
  • предоплата через площадку, товар не передан в срок → покупатель вправе
    потребовать вернуть деньги и у владельца агрегатора
  → поэтому: удержание до получения и автоотмена неотправленного


═══ ПЕРСОНАЛЬНЫЕ ДАННЫЕ ПОКУПАТЕЛЯ — ЧТО ВИДИТ ПРОДАВЕЦ ═══

  видит            имя, телефон, пункт выдачи или адрес — ТОЛЬКО своего заказа
  не видит         почту, другие заказы, что куплено у других продавцов
  по желанию       одноразовый номер вместо настоящего телефона
  основание        исполнение договора с покупателем; описано в политике
  где лежит        в базах в России


═══ КАК НЕ НАДО ═══

  оферта для продавцов «изменяется площадкой в любой момент без уведомления»  [!error]
  в карточке нет ни слова о том, кто продавец                                   [!error]
  продавец видит в кабинете все заказы покупателя на площадке                   [!error]
`;

  protected readonly marketplaceMetrics = `
-- ═══ 1. ДЕНЬГИ ЗА МЕСЯЦ: GMV, ВЫРУЧКА, TAKE RATE, СРЕДНИЙ ЧЕК ═══
-- GMV — по ЗАВЕРШЁННЫМ частям заказов: возвращённое не раздувает оборот
SELECT
  sum(so.items_kopecks + so.shipping_kopecks) / 100.0                       AS gmv_rub,
  sum(so.commission_kopecks) / 100.0                                        AS revenue_rub,
  round(sum(so.commission_kopecks)::numeric
        / nullif(sum(so.items_kopecks + so.shipping_kopecks), 0) * 100, 1)  AS take_rate_pct,
  round(sum(so.items_kopecks + so.shipping_kopecks)::numeric
        / nullif(count(DISTINCT so.order_id), 0) / 100, 0)                  AS avg_order_rub
FROM seller_orders so
WHERE so.status = 'completed'
  AND so.completed_at >= DATE '2026-11-01' AND so.completed_at < DATE '2026-12-01';
-- gmv 1 240 000 · revenue 131 000 · take rate 10,6 % · средний чек 3 900 ₽ (цифры условные)

-- ═══ 2. ЛИКВИДНОСТЬ ПОКУПАТЕЛЯ: ПОИСКИ БЕЗ РЕЗУЛЬТАТОВ И С ПОКУПКОЙ ═══
-- search_events пишет поиск: запрос, категория, сколько нашлось, кто искал
SELECT category,
       count(*)                                                   AS searches,
       round(avg((results_count = 0)::int) * 100, 1)              AS no_results_pct,   -- не хватает продавцов
       round(avg((EXISTS (SELECT 1 FROM orders o
                           WHERE o.buyer_id = se.user_id
                             AND o.created_at BETWEEN se.created_at AND se.created_at + interval '7 days'))::int) * 100, 1)
                                                                  AS bought_within_7d_pct
FROM search_events se
WHERE se.created_at >= now() - interval '30 days'
GROUP BY category
ORDER BY no_results_pct DESC;
-- текстиль  | 2 140 | 38.0 | 6.1   ← звать мастеров по льну
-- керамика  | 5 380 |  4.2 | 9.8

-- ═══ 3. ЛИКВИДНОСТЬ ПРОДАВЦА: ДОЛЯ КАРТОЧЕК С ПРОДАЖАМИ, ДНИ ДО ПЕРВОЙ ПРОДАЖИ ═══
SELECT l.category_id,
       round(avg((EXISTS (SELECT 1 FROM order_items oi
                          JOIN variants v ON v.id = oi.variant_id
                          JOIN seller_orders so ON so.id = oi.seller_order_id
                         WHERE v.listing_id = l.id AND so.status = 'completed'
                           AND so.completed_at > now() - interval '30 days'))::int) * 100, 1) AS sell_through_pct
FROM listings l
WHERE l.status = 'published'
GROUP BY l.category_id;

SELECT s.id, s.name,
       (SELECT min(so.paid_at) FROM seller_orders so WHERE so.seller_id = s.id)::date
       - s.created_at::date                                       AS days_to_first_sale  -- NULL — продаж ещё нет
FROM sellers s
WHERE s.created_at > now() - interval '90 days'
ORDER BY days_to_first_sale DESC NULLS FIRST;   -- первыми — те, кому нужна помощь

-- ═══ 4. ЗДОРОВЬЕ СДЕЛОК ПО ПРОДАВЦАМ ═══
SELECT so.seller_id,
       count(*)                                                        AS parts,
       round(avg((so.status = 'cancelled' AND so.cancelled_reason IN ('seller_cannot_fulfil', 'not_shipped_in_time'))::int) * 100, 1) AS seller_cancel_pct,
       round(avg((EXISTS (SELECT 1 FROM disputes d WHERE d.seller_order_id = so.id))::int) * 100, 1) AS dispute_pct
FROM seller_orders so
WHERE so.paid_at > now() - interval '90 days'
GROUP BY so.seller_id
HAVING count(*) >= 10                       -- по трём заказам выводов не делаем
ORDER BY dispute_pct DESC;

-- ═══ 5. ПОВТОРНЫЕ ПОКУПАТЕЛИ ═══
-- Из купивших в прошлом квартале — сколько купили снова в этом
WITH last_q AS (
  SELECT DISTINCT buyer_id FROM orders
  WHERE status = 'paid' AND created_at >= DATE '2026-07-01' AND created_at < DATE '2026-10-01'
), this_q AS (
  SELECT DISTINCT buyer_id FROM orders
  WHERE status = 'paid' AND created_at >= DATE '2026-10-01' AND created_at < DATE '2027-01-01'
)
SELECT round(count(t.buyer_id)::numeric / nullif(count(l.buyer_id), 0) * 100, 1) AS repeat_pct
FROM last_q l LEFT JOIN this_q t ON t.buyer_id = l.buyer_id;
-- 22 % — сетевой эффект работает; 3 % — каждую продажу приходится покупать рекламой

-- ═══ КАК НЕ НАДО ═══
-- SELECT sum(total_kopecks) FROM orders WHERE status = 'paid'   -- [!error] GMV с будущими возвратами
-- средняя доля споров по площадке вместо распределения       -- [!error] один плохой продавец прячется
-- метрики без разбивки по категориям                         -- [!error] не видно, где пусто
`;

  protected readonly mpStack = `

═══ МОДУЛИ «РЕМЕСЛА» — ОДИН РЕПОЗИТОРИЙ, ОДНО ПРИЛОЖЕНИЕ ═══

  src/
    catalog/      карточки, варианты, категории, модерация, поиск
    sellers/      подключение, проверки, договоры, статусы, участники
    orders/       корзина, оформление, заказы продавцов, статусы
    money/        ЖУРНАЛ ПРОВОДОК, удержание, комиссии, возвраты — единственный, кто трогает деньги
    payouts/      выплаты, проверка НПД, отчёты агента, сверка с выпиской
    delivery/     расчёт тарифов, отправления, статусы служб
    reviews/      отзывы, рейтинги, проверка подозрительных
    messages/     переписка, маскирование контактов, уведомления
    disputes/     споры, решения, исполнение через money/
    booking/      ресурсы, слоты, бронирования мастер-классов
    trust/        правила риска, очередь проверки, смена реквизитов
    admin/        очереди, действия с журналом, роли сотрудников
    shared/       база, задачи, часы, письма, конфигурация

  Правило границ: модули вызывают функции money/, а не пишут в ledger_entries сами.


═══ ПРОЦЕССЫ НА СЕРВЕРЕ ═══

  web       витрина, кабинет продавца, админка, API, вебхуки банка и служб доставки,
            WebSocket для сообщений
  worker    задачи: письма, возвраты, отправка выплат, обработка фото, модерация
  cron      каждые 15 минут  статусы доставки, автоотмена неотправленного
            каждый час       завершение сделок после срока претензии,
                             молчание продавца в спорах, слоты прошедших занятий
            вторник 06:00    подготовка выплат
            раз в сутки      сверка журнала с выпиской, пересчёт сигналов поиска,
                             отчёты агента (1-го числа)


═══ ЧЕГО НЕ НУЖНО В ПЕРВОЙ ВЕРСИИ ═══

  склад и своя логистика · отдельный поисковый движок · микросервисы ·
  своя касса · машинное обучение для рисков · мобильное приложение ·
  своя модель нейросети


═══ КАК НЕ НАДО ═══

  disputes/ сам делает UPDATE баланса продавца                            [!error]
  поиск в отдельном сервисе с первого дня «на вырост»                     [!error]
  фото продавцов отдаются в исходном размере, с координатами в метаданных [!error]
`;

  protected readonly mpLaunch = `

═══ ЧЕК-ЛИСТ ЗАПУСКА «РЕМЕСЛА» ═══

  ДОГОВОРЁННОСТИ — ДО КОДА
    ☐ схема расчётов согласована с банком (номинальный счёт) или платёжным сервисом
    ☐ оферта для продавцов, правила площадки, пользовательское соглашение — у юриста
    ☐ политика обработки персональных данных: что передаём продавцам и зачем
    ☐ схема чеков (агент, данные продавца, НПД, маркировка) — у бухгалтера
    ☐ отчёт агента: форма согласована с бухгалтером

  ТЕСТОВАЯ СРЕДА
    ☐ песочницы банка или платёжного сервиса, служб доставки, сервиса писем
    ☐ сквозная сделка: подключение → карточка → модерация → корзина от двух
      продавцов → оплата → отправка → доставка → спор → частичный возврат →
      автозавершение второй части → выплата → отчёт агента
    ☐ каждая цифра сверена: доли, комиссия, возврат, журнал, выписка
    ☐ сроки на перемотанных часах: автоотмена, 7 дней, вторник, молчание продавца
    ☐ двойные события: повтор вебхука, двойной клик «оплатить», два воркера разом
    ☐ мастер-класс: пересечение слотов и последнее место — отклоняются базой

  БЕЗОПАСНОСТЬ
    ☐ второй фактор для продавцов и сотрудников
    ☐ смена реквизитов выплат — с задержкой 48 часов и письмом
    ☐ задержка первой выплаты новому продавцу — 14 дней
    ☐ SPF, DKIM, DMARC для почтового домена

  ЗАКРЫТЫЙ ЗАПУСК
    ☐ 30 продавцов, приглашённых лично; помощь с первыми карточками
    ☐ первые покупки — основатели и знакомые, на настоящие деньги
    ☐ хотя бы один возврат — проверить чек возврата и проводки
    ☐ первая настоящая выплата дошла до продавца — подтверждено продавцом
    ☐ каждая сделка первых двух недель — глазами

  ОТКРЫТИЕ
    ☐ в выбранных категориях есть выбор: доля поисков без результатов < 10 %
    ☐ сделки проходят без ручного вмешательства
    ☐ сигналы дежурному: зависшие выплаты, рост споров, планировщик молчит


═══ КАК НЕ НАДО ═══

  «схему расчётов придумаем, когда пойдут деньги»                          [!error]
  проверили только оплату, споры и выплаты — «на живых посмотрим»          [!error]
  реклама для покупателей до того, как в нише есть выбор                   [!error]
`;
}
