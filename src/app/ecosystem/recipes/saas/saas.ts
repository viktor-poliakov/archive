import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-recipes-saas',
  imports: [CodeBlock, RouterLink],
  templateUrl: './saas.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemRecipesSaas {
  protected readonly saasMonth = `

═══ ПОЛТОРА МЕСЯЦА «ОБЖИГА» В «ОТКЛИКЕ» — ГЛАЗАМИ КЛИЕНТА ═══

  кто       Ольга, хозяйка керамической мастерской «Обжиг»
  что       тариф «Команда», 790 ₽ за оператора в месяц
  сколько   сначала 3 оператора, потом 4

  ЧТО ВИДИТ ОЛЬГА — шесть её действий за полтора месяца
    1 окт   регистрируется, создаёт организацию «Обжиг»
    1 окт   приглашает двух сотрудников, подключает почту и Telegram
   12 окт   получает письмо «пробный период заканчивается 15 октября»
   12 окт   привязывает карту
   20 окт   добавляет четвёртого оператора
   15 ноя   получает письмо «не удалось списать оплату» → меняет карту

  Больше она ничего не делает. Всё остальное происходит без неё.


═══ ЧТО В ЭТО ВРЕМЯ ДЕЛАЕТ «ОТКЛИК» ═══

  1 ОКТЯБРЯ — РЕГИСТРАЦИЯ
     1. создаёт пользователя Ольгу и организацию «Обжиг» одной транзакцией
     2. делает Ольгу владельцем (owner) — у организации всегда есть владелец
     3. создаёт подписку в статусе trialing: тариф «Команда», пока 1 место,
        пробный период до 15 октября
     4. отправляет два приглашения со ссылками, которые сгорят через 7 дней;
        в пробном периоде места добавляются бесплатно — их уже 3
     5. ничего не ставит «на 12 октября» отдельно: дата конца пробного периода
        записана в подписке, по ней планировщик сам найдёт, кому пора писать

  12 ОКТЯБРЯ — ПРИВЯЗКА КАРТЫ
     6. фоновая задача находит подписку с концом пробного периода через 3 дня
        и отправляет письмо (ровно одно — даже если задача запустится дважды)
     7. Ольга привязывает карту без списания («привязка на нулевую сумму»;
        где её нет — платёж на 1 ₽ с мгновенным возвратом) и ставит галочку
        согласия на ежемесячные списания
     8. записывает идентификатор сохранённого способа оплаты (не номер карты!)
        и последние 4 цифры для показа в кабинете

  15 ОКТЯБРЯ — ПЕРВОЕ СПИСАНИЕ
     9. планировщик видит: пробный период кончился, карта есть
    10. создаёт счёт (invoice) на 2 370 ₽ = 3 места × 790 ₽
    11. списывает деньги автоплатежом с ключом идемпотентности
        «подписка + период» — повтор запроса не спишет второй раз
    12. получает вебхук «платёж успешен», перепроверяет его запросом к API
    13. переводит подписку в active, период: 15 октября — 15 ноября
    14. отправляет чек: каждое автосписание — это расчёт, чек обязателен

  20 ОКТЯБРЯ — ЧЕТВЁРТЫЙ ОПЕРАТОР
    15. Ольга нажимает «добавить место» — сервис показывает сумму доплаты
        ДО подтверждения: 662,58 ₽ за 26 оставшихся дней из 31
    16. списывает доплату, увеличивает число мест до 4
    17. со следующего периода цена — 3 160 ₽ = 4 × 790 ₽

  15 НОЯБРЯ — НЕУДАЧНОЕ ПРОДЛЕНИЕ
    18. автоплатёж на 3 160 ₽ — банк отвечает «срок действия карты истёк»
    19. подписка переходит в past_due, начинается льготный период 7 дней,
        доступ НЕ закрывается
    20. письмо «не удалось списать оплату» со ссылкой прямо на смену карты
    21. повторять списание с той же карты бессмысленно — карта истекла,
        поэтому ждём новую карту, а не долбим банк

  17 НОЯБРЯ — НОВАЯ КАРТА
    22. Ольга привязывает новую карту → сервис сразу пытается списать долг
    23. списание прошло → подписка снова active, период 15 ноября — 15 декабря
        (дата продления не сдвигается на 17-е: платили за период с 15-го)
    24. чек, письмо «спасибо, оплата прошла»


═══ ГДЕ НА ЭТОЙ СТРАНИЦЕ РАЗОБРАН КАЖДЫЙ ШАГ ═══

  шаги 1–2       «Кто такой клиент: пользователь, организация, участник»
  шаги 3, 5, 6   «Пробный период: бесплатно, но не навсегда»
  шаг 4          «Приглашения и роли в команде»
  шаги 7–8       «Автоплатежи: кто нажимает кнопку «списать»»
  шаги 9–13      «Продление по расписанию: списать ровно один раз»
  шаг 14         «Чеки, НДС и закрывающие документы»
  шаги 15–17     «Смена тарифа и мест посреди периода»
  шаги 18–24     «Списание не прошло: льготный период и повторы»


═══ КАК НЕ НАДО ═══

  «Доступ есть, если последний платёж успешный»                          [!error]
  «Пробный период кончился — сразу закрываем доступ, карту попросим потом» [!error]
  «Банк отказал — повторим списание через минуту, и ещё, и ещё»         [!error]
  «Добавили место — спишем полную цену за месяц, так проще»             [!error]

  Как надо: доступ — отдельный статус подписки; о конце пробного периода
  предупреждаем заранее; при отказе — льготный период и письмо;
  доплата — только за оставшиеся дни, и сумму показываем до списания.
`;

  protected readonly validation = `

═══ ТРИ ПРОВЕРКИ СПРОСА ДО ПЕРВОЙ СТРОЧКИ КОДА ═══

  1. РАЗГОВОРЫ — есть ли боль
     с кем        20 владельцев небольших интернет-магазинов
     как найти    знакомые, тематические чаты продавцов, сообщества
     длительность 20–30 минут, лучше созвоном, а не анкетой
     итог         у 12 из 20 одна и та же боль; трое теряли из-за неё заказы

  2. СТРАНИЦА С ЦЕНОЙ — готовы ли платить
     что          лендинг: проблема, решение, тарифы с настоящими ценами,
                  кнопка «ранний доступ» и предложение предоплаты
     итог         4 магазина оплатили 3 месяца вперёд со скидкой 40 %

  3. КОНСЬЕРЖ — что именно нужно
     что          две недели Вера вручную делала работу будущего сервиса:
                  общий ящик + утренний список «без ответа» для «Обжига»
     итог         главное — очередь «без ответа» и напоминание через 2 часа;
                  красивый чат на сайт подождёт


═══ ВОПРОСЫ ДЛЯ РАЗГОВОРА — О ПРОШЛОМ, А НЕ О БУДУЩЕМ ═══

  хорошие вопросы
    • Где вам пишут покупатели? Покажите, как это выглядит сегодня.
    • Сколько вопросов было вчера? А в самый тяжёлый день?
    • Кто на них отвечает? Как вы понимаете, что кто-то уже ответил?
    • Расскажите про последний раз, когда вопрос остался без ответа.
    • Чем вы пользуетесь для этого сейчас и сколько это стоит?
    • Что вы уже пробовали и почему бросили?

  плохие вопросы                                    почему плохие
    • «Вам нужен такой сервис?»                     из вежливости скажут «да»
    • «Сколько бы вы заплатили?»                    люди не знают, гадают
    • «Если бы была функция X, пользовались бы?»    обещание ничего не стоит


═══ СКОЛЬКО КЛИЕНТОВ НУЖНО — РАСЧЁТ НА САЛФЕТКЕ ═══

  Все цифры — ИЛЛЮСТРАЦИЯ для понимания, а не бизнес-план.

  расходы в месяц
    две зарплаты с налогами                         380 000 ₽
    серверы, база, резервные копии                   25 000 ₽
    сервис писем, мониторинг, домены                 10 000 ₽
    нейросеть для подсказок                          20 000 ₽
    приём платежей, около 3 % выручки                15 000 ₽
    ──────────────────────────────────────────────────────────
    всего                                           450 000 ₽

  средний клиент
    3,5 оператора × 790 ₽ = 2 765 ₽ ≈ 2 800 ₽ в месяц

  нужно платящих клиентов
    450 000 ÷ 2 800 ≈ 161 магазин

  а теперь отток: каждый месяц уходит 3 % клиентов
    161 × 3 % ≈ 5 магазинов в месяц нужно находить
    ТОЛЬКО ЧТОБЫ НЕ УМЕНЬШАТЬСЯ

  если находить 10 новых в месяц, а уходит 3 %:
    месяц  1:  10 клиентов
    месяц  6:  около 56
    месяц 12:  около 102
    месяц 24:  около 173 — и рост замедляется, потому что с ростом базы
               растёт и число уходящих: при 333 клиентах уходило бы
               ровно 10 в месяц, и рост остановился бы совсем

  Вывод: потолок сервиса = новые клиенты в месяц ÷ доля оттока.
  10 ÷ 0,03 ≈ 333 клиента. Хотите больше — либо приводите больше,
  либо удерживайте лучше. Обычно второе дешевле.


═══ КАК НЕ НАДО ═══

  «Сначала напишем продукт, потом разберёмся, кому его продавать»         [!error]
  «Друзья сказали, что идея классная, — значит, спрос есть»              [!error]
  «Сделаем всё бесплатным, а платные тарифы придумаем через год»         [!error]
  «Нам нужно 160 клиентов — наберём за пару месяцев и будем жить»        [!error]

  Как надо: разговоры о прошлом, страница с настоящей ценой,
  предоплата от первых клиентов и расчёт с учётом оттока.
`;

  protected readonly glossary = `

═══ СЛОВАРЬ НА ЖИВОМ ПРИМЕРЕ «ОБЖИГА» ═══

  ЧТО ПРОДАЁТСЯ
    подписка        «Обжиг» пользуется «Откликом» и платит каждый месяц
    тариф           «Команда»: все каналы, 300 ИИ-подсказок в месяц,
                    история без ограничений; 790 ₽ за оператора в месяц
    период          месячный: с 15-го числа по 15-е следующего месяца
    место           один оператор; у «Обжига» сначала 3 места, потом 4
    лимит           300 ИИ-подсказок в месяц на всю организацию
    возможность     API — НЕТ на «Команде», ЕСТЬ на «Бизнесе»

  ЧТО ПРОИСХОДИТ СО ВРЕМЕНЕМ
    пробный период  1–15 октября: тариф «Команда» бесплатно
    продление       15 ноября: списать 3 160 ₽, сдвинуть конец периода на 15 декабря
    автоплатёж      списание с карты Ольги без её участия, по согласию,
                    которое она дала при привязке карты
    перерасчёт      20 октября +1 место: 790 ₽ × 26 ÷ 31 = 662,58 ₽
    неудачное
      списание      15 ноября: «срок действия карты истёк»
    льготный период 15–22 ноября: доступ открыт, ждём новую карту
    даннинг         письма 15, 18 и 21 ноября + попытки списания
    апгрейд         переход с «Команды» на «Бизнес» ради API
    даунгрейд       переход с «Бизнеса» на «Команду» — с конца периода
    отмена          «не продлевать»: доступ до 15-го, дальше — бесплатный тариф

  КАК БИЗНЕС СЧИТАЕТ ДЕНЬГИ
    MRR «Обжига»    4 × 790 ₽ = 3 160 ₽ в месяц
    если годовой    4 × 7 584 ₽ = 30 336 ₽ в год → MRR = 30 336 ÷ 12 = 2 528 ₽
    ARR «Обжига»    3 160 ₽ × 12 = 37 920 ₽
    MRR всего       сумма MRR всех действующих подписок «Отклика»
    отток           из 160 клиентов за ноябрь ушли 5 → 5 ÷ 160 ≈ 3,1 %
    ARPA            MRR всего ÷ число платящих организаций ≈ 2 800 ₽
    LTV             ARPA ÷ отток ≈ 2 800 ÷ 0,031 ≈ 90 000 ₽ выручки
                    (грубая оценка: «клиент в среднем живёт 1 ÷ 0,031 ≈ 32 месяца»)
    CAC             реклама и время на продажи за месяц ÷ новые клиенты
                    40 000 ₽ ÷ 10 магазинов = 4 000 ₽ за клиента
    активация       первый вопрос покупателя, на который ответили через «Отклик»


═══ ДОСТУП И ОПЛАТА — РАЗНЫЕ ВЕЩИ ═══

  ситуация                         последний платёж     доступ к «Команде»
  пробный период, 5 октября        не было              ЕСТЬ
  оплачено, 1 ноября               успешен              ЕСТЬ
  льготный период, 16 ноября       неудачен             ЕСТЬ
  отменили 20 ноября, сейчас 1 дек успешен (за ноябрь)  ЕСТЬ до 15 декабря
  льготный период кончился         неудачен             НЕТ

  Ни в одной строке «доступ» нельзя вычислить только по последнему платежу.


═══ КАК НЕ НАДО ═══

  «MRR — это сколько денег пришло на счёт в этом месяце»                  [!error]
  «LTV — это сколько клиент заплатил нам за первый месяц»               [!error]
  «Место и пользователь — одно и то же, считаем по числу логинов»       [!error]

  Как надо: MRR — по действующим подпискам, годовые делим на 12;
  LTV — за всю жизнь клиента; места покупают, пользователи — входят,
  и мест может быть больше, чем приглашённых людей.
`;

  protected readonly pricingGrid = `

═══ ТАРИФЫ «ОТКЛИКА» ═══

                       Бесплатный     Команда              Бизнес
  цена в месяц         0 ₽            790 ₽ за оператора   1 490 ₽ за оператора
  год вперёд (−20 %)   —              7 584 ₽ за оператора 14 304 ₽ за оператора
  операторов           1              до 10                без ограничений
  каналы               почта          почта, Telegram, ВКонтакте, чат на сайте
  история обращений    90 дней        без ограничений      без ограничений
  ИИ-подсказки         нет            300 в месяц          2 000 в месяц
                                      на организацию       на организацию
  шаблоны, напоминания нет            есть                 есть
  отчёты               нет            базовые              полные
  API и вебхуки        нет            нет                  есть
  журнал действий      нет            нет                  есть
  способ оплаты        —              карта, СБП           карта, СБП или счёт
  пробный период       —              14 дней              14 дней по запросу

  ДОПОЛНИТЕЛЬНО
    пакет +500 ИИ-подсказок   490 ₽, на любом платном тарифе;
                              действует до конца текущего периода,
                              неизрасходованное не переносится

  Годовая цена: 790 × 12 × 0,8 = 7 584 ₽;  1 490 × 12 × 0,8 = 14 304 ₽.
  Цены без НДС: «Отклик» — ООО на упрощённой системе с доходом меньше
  20 млн ₽ в год, от НДС освобождён (подробно — раздел о чеках и НДС).


═══ СКОЛЬКО ПЛАТЯТ РАЗНЫЕ КЛИЕНТЫ ═══

  «Лён и нить»        1 оператор, отвечает только на почту
                      → «Бесплатный», 0 ₽

  «Обжиг»             4 оператора, почта + Telegram + ВКонтакте
                      → «Команда» помесячно: 4 × 790 = 3 160 ₽ в месяц
                      в декабре докупили пакет подсказок: 3 160 + 490 = 3 650 ₽

  «Пиксель»           12 операторов, магазин электроники,
                      нужен API для связи с их складской программой
                      → «Бизнес» на год: 12 × 14 304 = 171 648 ₽ в год,
                        оплата по счёту с расчётного счёта


═══ ПОЧЕМУ ИИ-ПОДСКАЗКИ С ЛИМИТОМ — РАСЧЁТ ═══

  Цифры — ИЛЛЮСТРАЦИЯ: цена запроса к нейросети зависит от модели,
  длины переписки и тарифа провайдера (страница «LLM API: токены, цена, лимиты»).

  одна подсказка обходится «Отклику»       условно 0,5 ₽
  300 подсказок в месяц                    150 ₽ — из 3 160 ₽ «Обжига»: терпимо
  без лимита: активный оператор нажимает «предложить ответ»
    на каждое сообщение, 250 в день × 4 оператора × 22 дня
                                           22 000 подсказок = 11 000 ₽
  выручка от этого клиента                 3 160 ₽
  ─────────────────────────────────────────────────────────────
  итог без лимита                          минус 7 840 ₽ в месяц на одном клиенте

  Правило: всё, за что вы платите при каждом использовании, —
  с лимитом в тарифе или с отдельной ценой.


═══ ВЕРСИИ ТАРИФА: ЦЕНУ НЕ ПРАВЯТ В СТАРОЙ СТРОКЕ ═══

  plan_versions
    team_v1   «Команда»   790 ₽    продаётся с 01.10.2026
    team_v2   «Команда»   890 ₽    продаётся с 01.06.2027

  что происходит 1 июня 2027
    новые клиенты           сразу оформляются на team_v2
    действующие на team_v1  вариант А: остаются на 790 ₽ навсегда
                            вариант Б: письмо за 60 дней — «с продления
                            после 1 августа цена 890 ₽», затем перевод
                            на team_v2 в день их продления
    счета, выставленные     НЕ МЕНЯЮТСЯ никогда: счёт за октябрь 2026 —
    раньше                  790 ₽, даже если сегодня тариф стоит 890 ₽


═══ КАК НЕ НАДО ═══

  «Сделаем 6 тарифов, чтобы каждому подошёл свой»                        [!error]
  «ИИ-подсказки безлимитные — это наше преимущество»                     [!error]
  «Подняли цену — UPDATE plans SET price = 890 WHERE id = 'team'»        [!error]
  «Годовую подписку за 7 584 ₽ запишем в MRR октября целиком»           [!error]

  Как надо: три тарифа с разницей в одно предложение; лимит на всё,
  что стоит денег; новая цена — новая версия тарифа и письмо заранее;
  годовая подписка в MRR — двенадцатая часть.
`;

  protected readonly accountsSchema = `
-- ═══ 1. ПОЛЬЗОВАТЕЛИ — ЛЮДИ, КОТОРЫЕ ВХОДЯТ ═══
CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- случайный, а не 1, 2, 3: не выдаёт, сколько у нас людей
  email       text NOT NULL,
  email_verified_at timestamptz,                       -- когда подтвердили почту; NULL — ещё не подтвердили
  name        text NOT NULL,
  locale      text NOT NULL DEFAULT 'ru',
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz                              -- «мягкое» удаление: строку сотрёт уборщик по сроку
);
-- Почта уникальна без учёта регистра: Olga@obzhig.example и olga@obzhig.example — один человек
CREATE UNIQUE INDEX users_email_key ON users (lower(email));
-- Пароля здесь нет: вход у готового сервиса авторизации, у нас — только его идентификатор пользователя
ALTER TABLE users ADD COLUMN auth_subject text UNIQUE;

-- ═══ 2. ОРГАНИЗАЦИИ — АРЕНДАТОРЫ ═══
CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,                           -- «Обжиг»
  slug        text NOT NULL UNIQUE                     -- obzhig: короткое имя в ссылке app.otklik.example/obzhig
              CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) BETWEEN 3 AND 40),
  timezone    text NOT NULL DEFAULT 'Europe/Moscow',   -- «напомнить через 2 часа» и отчёты — по времени клиента
  next_conversation_number integer NOT NULL DEFAULT 1, -- счётчик номеров обращений ВНУТРИ организации
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

-- ═══ 3. УЧАСТИЯ — КТО В КАКОЙ ОРГАНИЗАЦИИ И С КАКОЙ РОЛЬЮ ═══
CREATE TABLE memberships (
  organization_id uuid NOT NULL REFERENCES organizations (id),
  user_id         uuid NOT NULL REFERENCES users (id),
  -- owner — оплата, удаление организации, передача владения; admin — участники и настройки;
  -- agent — оператор: только работа с обращениями
  role            text NOT NULL CHECK (role IN ('owner', 'admin', 'agent')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)               -- дважды в одну организацию не вступить: проверит сама база
);
-- «В каких организациях я состою» — запрос при каждом входе, поэтому отдельный индекс по user_id
CREATE INDEX memberships_user_idx ON memberships (user_id);

-- ═══ 4. ДАННЫЕ ПРОДУКТА — В КАЖДОЙ СТРОКЕ organization_id ═══
CREATE TABLE conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations (id),
  number          integer NOT NULL,                    -- «обращение № 312» — номер для людей, свой в каждой организации
  channel         text NOT NULL CHECK (channel IN ('email', 'telegram', 'vk', 'widget')),
  subject         text,
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  assignee_id     uuid REFERENCES users (id),          -- кто взял в работу; NULL — «ничьё», главный враг магазина
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, number)
);
-- Индексы начинаются с organization_id: каждый запрос продукта фильтрует по организации
CREATE INDEX conversations_queue_idx ON conversations (organization_id, status, created_at);

-- ═══ 5. ДАННЫЕ ПРИМЕРА ═══
INSERT INTO users (email, name) VALUES
  ('olga@obzhig.example', 'Ольга'),   -- хозяйка «Обжига»
  ('pavel@obzhig.example', 'Павел'),  -- второй гончар
  ('nina@mail.example', 'Нина'),      -- помощница: работает в двух магазинах
  ('sveta@len.example', 'Света');     -- хозяйка «Лён и нить»

INSERT INTO organizations (name, slug) VALUES ('Обжиг', 'obzhig'), ('Лён и нить', 'len-i-nit');

INSERT INTO memberships (organization_id, user_id, role)
SELECT o.id, u.id, v.role
FROM (VALUES
  ('obzhig',    'olga@obzhig.example',  'owner'),
  ('obzhig',    'pavel@obzhig.example', 'agent'),
  ('obzhig',    'nina@mail.example',    'agent'),
  ('len-i-nit', 'sveta@len.example',    'owner'),
  ('len-i-nit', 'nina@mail.example',    'agent')   -- та же Нина, второе участие
) AS v (slug, email, role)
JOIN organizations o ON o.slug = v.slug
JOIN users u ON lower(u.email) = lower(v.email);

-- ═══ 6. ЗАПРОСЫ, РАДИ КОТОРЫХ ВСЁ ЗАТЕВАЛОСЬ ═══
-- Переключатель организаций: где состоит Нина ($1 — её id из сессии)
SELECT o.name, o.slug, m.role
FROM memberships m
JOIN organizations o ON o.id = m.organization_id
WHERE m.user_id = $1 AND o.deleted_at IS NULL
ORDER BY o.name;
-- → «Лён и нить», len-i-nit, agent
--   «Обжиг»,      obzhig,    agent

-- Новый номер обращения: одно атомарное UPDATE — две заявки в одну секунду получат 312 и 313, а не обе 312
UPDATE organizations
SET next_conversation_number = next_conversation_number + 1
WHERE id = $1
RETURNING next_conversation_number - 1 AS number;

-- Выход из организации: последнего владельца не выпускаем
BEGIN;
-- FOR UPDATE запирает все участия организации: два последних владельца не выйдут одновременно
SELECT user_id, role FROM memberships WHERE organization_id = $1 FOR UPDATE;
-- приложение считает: уходит owner, а других owner нет → ROLLBACK и «сначала передайте владение»
DELETE FROM memberships WHERE organization_id = $1 AND user_id = $2;
COMMIT;

-- ═══ КАК НЕ НАДО ═══
-- ALTER TABLE users ADD COLUMN organization_id uuid;            -- [!error] человек — одна компания навсегда
-- CREATE TABLE conversations (id serial PRIMARY KEY, ...);      -- [!error] номера подряд на весь сервис
-- role text NOT NULL                                            -- [!error] без CHECK: 'ownr' запишется молча
`;

  protected readonly tenantIsolation = `
-- ═══ 1. ДВЕ РОЛИ БАЗЫ: ВЛАДЕЛЕЦ ТАБЛИЦ И ПРИЛОЖЕНИЕ ═══
-- otklik_owner создаёт таблицы и запускает миграции.
-- otklik_app — роль, которой подключается работающее приложение: не владелец, без права обходить политики.
CREATE ROLE otklik_app LOGIN NOBYPASSRLS;           -- пароль задают отдельно, из менеджера секретов, не в миграции
GRANT SELECT, INSERT, UPDATE, DELETE ON conversations, messages, templates, channels TO otklik_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, organizations, memberships TO otklik_app;

-- ═══ 2. ВКЛЮЧАЕМ ПОЛИТИКИ СТРОК ═══
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- FORCE: политика действует даже на владельца таблицы — страховка от «подключились не той ролью».
-- Миграции, которым нужно видеть всё, запускают ролью с BYPASSRLS, а не владельцем
ALTER TABLE conversations FORCE ROW LEVEL SECURITY;

-- ═══ 3. ПОЛИТИКА: ТОЛЬКО СТРОКИ ТЕКУЩЕЙ ОРГАНИЗАЦИИ ═══
-- current_setting(имя, true): true — «если настройка не задана, не падать, а вернуть NULL».
-- NULLIF(…, ''): после транзакции, где настройку задавали, она остаётся в сеансе пустой строкой,
-- а ''::uuid — ошибка; NULLIF превращает пустую строку в NULL.
-- NULL ни с чем не равен → ни одной строки. Забыли задать организацию — получили пусто, а не всё.
CREATE POLICY tenant_isolation ON conversations
  USING      (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);
-- USING — какие строки видно и можно менять (SELECT, UPDATE, DELETE);
-- WITH CHECK — какие строки можно записать (INSERT, UPDATE): в чужую организацию не вставить

-- То же самое — для КАЖДОЙ таблицы с organization_id:
-- messages, templates, channels, attachments, ai_suggestions, usage_counters…

-- ═══ 4. КАК ЭТО ВЫГЛЯДИТ В РАБОТЕ ═══
BEGIN;
-- третий аргумент true = «только до конца этой транзакции»; подставьте настоящий uuid «Обжига»
SELECT set_config('app.organization_id', '6a1d…-uuid-«Обжига»', true);

SELECT number, subject FROM conversations;            -- даже без WHERE — только обращения «Обжига»
SELECT number FROM conversations WHERE id = '…uuid обращения «Лён и нить»…';
-- → 0 строк: строка есть, но политика её не показывает

INSERT INTO conversations (organization_id, number, channel)
VALUES ('…uuid «Лён и нить»…', 1, 'email');
-- → ERROR: new row violates row-level security policy for table "conversations"
COMMIT;

-- Вне транзакции, где организацию не задали:
SELECT count(*) FROM conversations;                   -- → 0: ничего не видно

-- ═══ 5. ТАБЛИЦЫ БЕЗ ПОЛИТИК — И ПОЧЕМУ ═══
-- users, organizations, memberships читаются ДО того, как организация известна:
-- при входе и в переключателе организаций. Политика «по текущей организации» к ним не подходит,
-- поэтому доступ к ним — только через несколько проверенных функций приложения.

-- ═══ 6. ИНДЕКСЫ ПОД ПОЛИТИКУ ═══
-- Политика добавляет «organization_id = …» к каждому запросу — индексы должны начинаться с него
CREATE INDEX messages_org_conversation_idx ON messages (organization_id, conversation_id, created_at);

-- ═══ КАК НЕ НАДО ═══
-- SET app.organization_id = '…';                 -- [!error] без LOCAL живёт на соединении и достанется чужому запросу
-- приложение подключается ролью otklik_owner     -- [!error] владелец без FORCE обходит политики молча
-- USING (organization_id = current_setting('app.organization_id')::uuid)  -- [!error] без true и NULLIF — ошибки
`;

  protected readonly tenantContext = `
// ═══ 1. ПУЛ СОЕДИНЕНИЙ: РОЛЬ БЕЗ ПРАВА ОБХОДИТЬ ПОЛИТИКИ ═══
import express, { type NextFunction, type Request, type Response } from 'express';
import pg from 'pg';

// DATABASE_URL указывает на роль otklik_app — не владельца таблиц (см. SQL выше)
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

type Role = 'owner' | 'admin' | 'agent';
export type Tenant = { userId: string; organizationId: string; role: Role };

// ═══ 2. MIDDLEWARE: КТО ЭТО И В КАКОЙ ОРГАНИЗАЦИИ ═══
// Ссылки вида /:orgSlug/…; res.locals.userId заранее положил обработчик сессии (вход — отдельная тема)
export async function resolveTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId: string | undefined = res.locals['userId'];
  if (!userId) {
    res.sendStatus(401); // не вошёл
    return;
  }
  // Организацию ищем ЧЕРЕЗ участие: нет участия — для этого человека организации не существует
  const { rows } = await pool.query(
    \`SELECT o.id, m.role
       FROM organizations o
       JOIN memberships m ON m.organization_id = o.id
      WHERE o.slug = $1 AND m.user_id = $2 AND o.deleted_at IS NULL\`,
    [req.params['orgSlug'], userId],
  );
  if (rows.length === 0) {
    res.sendStatus(404); // не 403: не подтверждаем постороннему, что такая организация есть
    return;
  }
  // organizationId — из базы, из проверенного участия, а НЕ из тела запроса
  const tenant: Tenant = { userId, organizationId: rows[0].id, role: rows[0].role };
  res.locals['tenant'] = tenant;
  next();
}

// ═══ 3. ВСЕ ЗАПРОСЫ — В ТРАНЗАКЦИИ С ТЕКУЩЕЙ ОРГАНИЗАЦИЕЙ ═══
export async function withTenant<T>(tenant: Tenant, work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect(); // соединение из пула — до нас им пользовался чужой запрос
  try {
    await client.query('BEGIN');
    // true — «только до конца транзакции»: следующий запрос на этом соединении настройку не унаследует
    await client.query("SELECT set_config('app.organization_id', $1, true)", [tenant.organizationId]);
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // вернули соединение в пул; организация «отклеилась» вместе с транзакцией
  }
}

// ═══ 4. ДОСТУП К ДАННЫМ: ОРГАНИЗАЦИЯ — ОБЯЗАТЕЛЬНЫЙ АРГУМЕНТ ═══
type Conversation = { id: string; number: number; subject: string | null; status: string };

export async function findConversation(
  client: pg.PoolClient,
  organizationId: string, // без этого аргумента вызов не скомпилируется
  number: number,
): Promise<Conversation | null> {
  // Условие по организации пишем ВСЕГДА, хотя политика в базе добавит его сама: два слоя надёжнее одного
  const { rows } = await client.query<Conversation>(
    'SELECT id, number, subject, status FROM conversations WHERE organization_id = $1 AND number = $2',
    [organizationId, number],
  );
  return rows[0] ?? null;
}

// ═══ 5. МАРШРУТ ═══
export const app = express();

app.get('/:orgSlug/api/conversations/:number', resolveTenant, async (req, res) => {
  const tenant = res.locals['tenant'] as Tenant;
  const number = Number(req.params['number']);
  if (!Number.isInteger(number) || number < 1) {
    res.sendStatus(404);
    return;
  }
  const conversation = await withTenant(tenant, (client) =>
    findConversation(client, tenant.organizationId, number),
  );
  if (!conversation) {
    res.sendStatus(404); // чужое и несуществующее выглядят одинаково
    return;
  }
  res.json(conversation);
});

// ═══ 6. ТЕСТ, КОТОРЫЙ НАРОЧНО ПЫТАЕТСЯ УКРАСТЬ (vitest + supertest) ═══
import request from 'supertest';
import { expect, test } from 'vitest';
import { loginAs } from './test-helpers'; // создаёт сессию тестового пользователя и возвращает cookie

test('owner of Obzhig cannot read conversations of Len i Nit', async () => {
  const olgaCookie = await loginAs('olga@obzhig.example'); // Ольга — только в «Обжиге»
  // Чужая организация в ссылке → 404
  const foreignOrg = await request(app).get('/len-i-nit/api/conversations/1').set('Cookie', olgaCookie);
  expect(foreignOrg.status).toBe(404);
  // Своя организация, но номер, который есть только у «Лён и нить» → тоже 404
  const foreignNumber = await request(app).get('/obzhig/api/conversations/900').set('Cookie', olgaCookie);
  expect(foreignNumber.status).toBe(404);
});

// ═══ КАК НЕ НАДО ═══
// const organizationId = req.body.organizationId;                          // [!error] подставят чужой
// pool.query('SELECT * FROM conversations WHERE number = $1', [number]);   // [!error] без организации
// await client.query("SET app.organization_id = '…'");                     // [!error] прилипнет к соединению
`;

  protected readonly signup = `
// ═══ 1. ЧТО ПРИХОДИТ ИЗ ФОРМЫ — И ЧЕМУ МЫ НЕ ВЕРИМ ═══
import express from 'express';
import type pg from 'pg';
import { z } from 'zod';
import { pool } from './db';
import { createAuthUser, deleteAuthUser } from './auth'; // готовый сервис авторизации: хранит пароли сам

const SignupInput = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().min(10).max(200), // стойкость и хранение пароля — забота сервиса авторизации
  storeName: z.string().trim().min(2).max(80), // «Обжиг»
});

// ═══ 2. КОРОТКОЕ ИМЯ ДЛЯ ССЫЛКИ: «Лён и нить» → len-i-nit ═══
const TRANSLIT: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
  'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
  'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
  'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
};

export function slugify(name: string): string {
  const latin = [...name.toLowerCase()].map((ch) => TRANSLIT[ch] ?? ch).join('');
  const slug = latin
    .replace(/[^a-z0-9]+/g, '-') // всё, что не латинская буква и не цифра, — в дефис
    .slice(0, 36)                // оставляем место для «-2», «-3»: в базе предел 40 символов
    .replace(/^-+|-+$/g, '');    // без дефисов по краям
  if (slug.length >= 3) return slug;
  return slug ? 'shop-' + slug : 'shop'; // «Ы» → y → слишком коротко → shop-y
}
// slugify('Обжиг')      → 'obzhig'
// slugify('Лён и нить') → 'len-i-nit'

// ═══ 3. РЕГИСТРАЦИЯ: ВСЁ ОДНОЙ ТРАНЗАКЦИЕЙ ═══
const TRIAL_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function signup(raw: unknown): Promise<{ organizationSlug: string }> {
  const input = SignupInput.parse(raw); // не прошла проверка — исключение ZodError, ответим 400

  // Вход создаём у сервиса авторизации ДО транзакции: это внешний вызов, откатить его базой нельзя
  const authSubject = await createAuthUser(input.email, input.password);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await client.query<{ id: string }>(
      'INSERT INTO users (email, name, auth_subject) VALUES ($1, $2, $3) RETURNING id',
      [input.email, input.email.split('@')[0], authSubject], // имя спросим потом — сейчас лишнее поле
    );
    const userId = user.rows[0].id;

    // Короткое имя: obzhig, потом obzhig-2, obzhig-3…
    // ON CONFLICT DO NOTHING не обрывает транзакцию, а обычная ошибка уникальности — оборвала бы
    const base = slugify(input.storeName);
    let organizationId: string | undefined;
    let slug = base;
    for (let attempt = 1; attempt <= 20 && !organizationId; attempt++) {
      slug = attempt === 1 ? base : base + '-' + attempt;
      const org = await client.query<{ id: string }>(
        'INSERT INTO organizations (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING RETURNING id',
        [input.storeName, slug],
      );
      organizationId = org.rows[0]?.id; // пусто — имя занято, пробуем следующее
    }
    if (!organizationId) throw new Error('could not pick a free slug');

    await client.query(
      "INSERT INTO memberships (organization_id, user_id, role) VALUES ($1, $2, 'owner')",
      [organizationId, userId],
    );

    // Подписка существует с первой секунды: «Команда», 1 место, пробный период 14 дней.
    // Напоминание о конце пробного периода НЕ планируем отдельно — планировщик найдёт его по trial_ends_at
    await client.query(
      \`INSERT INTO subscriptions (organization_id, plan_version_id, status, seats, trial_ends_at)
       VALUES ($1, 'team_v1', 'trialing', 1, now() + make_interval(days => $2))\`,
      [organizationId, TRIAL_DAYS],
    );

    // Письма — не отправляем, а записываем в «исходящие» той же транзакцией
    const now = Date.now();
    await enqueue(client, 'email.confirm_address', { userId }, new Date(now));
    await enqueue(client, 'onboarding.no_channel_nudge', { organizationId }, new Date(now + 3 * DAY_MS));

    // Первое событие воронки активации
    await client.query(
      "INSERT INTO product_events (organization_id, user_id, name) VALUES ($1, $2, 'organization_created')",
      [organizationId, userId],
    );

    await client.query('COMMIT');
    return { organizationSlug: slug };
  } catch (err) {
    await client.query('ROLLBACK');
    await deleteAuthUser(authSubject).catch(() => undefined); // компенсируем внешний вызов: вход без пользователя не нужен
    throw err;
  } finally {
    client.release();
  }
}

// ═══ 4. «ИСХОДЯЩИЕ»: ЗАДАЧИ ДЛЯ ВОРКЕРА ═══
async function enqueue(client: pg.PoolClient, kind: string, payload: object, runAt: Date): Promise<void> {
  await client.query('INSERT INTO jobs (kind, payload, run_at) VALUES ($1, $2, $3)', [
    kind,
    JSON.stringify(payload),
    runAt,
  ]);
}
// Воркер каждые несколько секунд забирает созревшие задачи:
//   SELECT id, kind, payload FROM jobs
//    WHERE run_at <= now() AND done_at IS NULL
//    ORDER BY run_at LIMIT 20 FOR UPDATE SKIP LOCKED   -- два воркера не возьмут одну задачу
// Задача 'onboarding.no_channel_nudge' сама решает, нужно ли письмо: канал уже подключён — не пишет ничего

// ═══ 5. ОБРАБОТЧИК ═══
export const app = express();

app.post('/api/signup', express.json(), async (req, res) => {
  try {
    const { organizationSlug } = await signup(req.body);
    res.status(201).json({ redirectTo: '/' + organizationSlug + '/onboarding' }); // сразу в продукт, а не «проверьте почту»
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'check_fields', fields: err.issues.map((issue) => issue.path.join('.')) });
      return;
    }
    console.error('signup failed', { err }); // без пароля и без тела запроса в логе
    res.status(500).json({ error: 'try_again' });
  }
});

// ═══ КАК НЕ НАДО ═══
// await sendEmail(input.email, 'Подтвердите почту'); // до COMMIT          // [!error] откатилось — а письмо ушло
// const taken = await client.query('SELECT 1 FROM organizations WHERE slug = $1', [slug]);
// if (taken.rowCount === 0) await client.query('INSERT …');               // [!error] гонка: двое займут одно имя
// INSERT INTO subscriptions … — отдельным запросом после ответа клиенту   // [!error] организация без подписки
`;

  protected readonly invites = `
// ═══ 1. ТАБЛИЦА ПРИГЛАШЕНИЙ ═══
// CREATE TABLE invitations (
//   id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id uuid NOT NULL REFERENCES organizations (id),
//   email           text NOT NULL,                         -- храним в нижнем регистре
//   role            text NOT NULL CHECK (role IN ('admin', 'agent')), -- владельцем по приглашению не станешь
//   token_hash      bytea NOT NULL UNIQUE,                 -- хэш токена; сам токен есть только в письме
//   invited_by      uuid NOT NULL REFERENCES users (id),
//   expires_at      timestamptz NOT NULL,
//   accepted_at     timestamptz,
//   revoked_at      timestamptz,
//   created_at      timestamptz NOT NULL DEFAULT now()
// );
// Политики строк на этой таблице нет: при принятии ищем по токену, ещё не зная организацию
import { createHash, randomBytes } from 'node:crypto';
import { pool, withTenant, type Tenant } from './tenant';
import { sendInvitationEmail } from './mail';

// ═══ 2. ПРАВА — ОДНА ТАБЛИЦА НА ВЕСЬ ПРОЕКТ ═══
type Role = Tenant['role'];
type Action =
  | 'conversations.reply'
  | 'templates.manage_shared'
  | 'channels.manage'
  | 'members.invite'
  | 'members.remove'
  | 'billing.view'
  | 'billing.manage'
  | 'organization.export'
  | 'organization.delete';

const AGENT: Action[] = ['conversations.reply'];
const ADMIN: Action[] = [...AGENT, 'templates.manage_shared', 'channels.manage', 'members.invite', 'members.remove'];
const OWNER: Action[] = [...ADMIN, 'billing.view', 'billing.manage', 'organization.export', 'organization.delete'];

const PERMISSIONS: Record<Role, ReadonlySet<Action>> = {
  agent: new Set(AGENT),
  admin: new Set(ADMIN),
  owner: new Set(OWNER),
};

// Обработчики спрашивают «можно ли ДЕЙСТВИЕ», а не «какая роль»: новая роль — одна строка выше
export function can(tenant: Tenant, action: Action): boolean {
  return PERMISSIONS[tenant.role].has(action);
}

// ═══ 3. ПРИГЛАСИТЬ ═══
const INVITE_TTL_DAYS = 7;
const TRIAL_MAX_SEATS = 10; // в пробном периоде места бесплатные, но не больше лимита «Команды»

type InviteResult =
  | { ok: true }
  | { ok: false; reason: 'forbidden' | 'already_member' }
  | { ok: false; reason: 'no_free_seats'; seats: number; taken: number }; // интерфейс покажет окно с доплатой

export async function inviteMember(tenant: Tenant, rawEmail: string, role: 'admin' | 'agent'): Promise<InviteResult> {
  if (!can(tenant, 'members.invite')) return { ok: false, reason: 'forbidden' };
  const email = rawEmail.trim().toLowerCase();
  const token = randomBytes(32).toString('base64url');            // 256 случайных бит — не угадать и не перебрать
  const tokenHash = createHash('sha256').update(token).digest(); // в базу — только хэш

  const result = await withTenant(tenant, async (client): Promise<InviteResult> => {
    // Запираем строку подписки: два приглашения в одну секунду не займут одно последнее место
    const sub = await client.query<{ seats: number; status: string }>(
      'SELECT seats, status FROM subscriptions WHERE organization_id = $1 FOR UPDATE',
      [tenant.organizationId],
    );
    const { seats, status } = sub.rows[0];

    const member = await client.query(
      'SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.organization_id = $1 AND lower(u.email) = $2',
      [tenant.organizationId, email],
    );
    if (member.rowCount) return { ok: false, reason: 'already_member' };

    // Занятые места = участники + НЕОТВЕЧЕННЫЕ живые приглашения
    const used = await client.query<{ taken: number }>(
      \`SELECT (SELECT count(*) FROM memberships WHERE organization_id = $1)::int
             + (SELECT count(*) FROM invitations
                 WHERE organization_id = $1 AND accepted_at IS NULL
                   AND revoked_at IS NULL AND expires_at > now())::int AS taken\`,
      [tenant.organizationId],
    );
    const taken = used.rows[0].taken;

    if (taken >= seats) {
      if (status === 'trialing' && seats < TRIAL_MAX_SEATS) {
        // В пробном периоде место добавляется само и бесплатно
        await client.query('UPDATE subscriptions SET seats = seats + 1 WHERE organization_id = $1', [tenant.organizationId]);
      } else {
        return { ok: false, reason: 'no_free_seats', seats, taken }; // денег без явного согласия не берём
      }
    }

    await client.query(
      \`INSERT INTO invitations (organization_id, email, role, token_hash, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, now() + make_interval(days => $6))\`,
      [tenant.organizationId, email, role, tokenHash, tenant.userId, INVITE_TTL_DAYS],
    );
    return { ok: true };
  });

  // Письмо — ПОСЛЕ COMMIT: сам токен не должен лежать в базе даже в очереди писем.
  // Не ушло письмо — в интерфейсе кнопка «отправить ещё раз»: она отзовёт это приглашение и создаст новое
  if (result.ok) {
    await sendInvitationEmail(email, 'https://app.otklik.example/invite/' + token);
  }
  return result;
}

// ═══ 4. ПРИНЯТЬ ═══
type AcceptResult = { ok: true; organizationId: string } | { ok: false; reason: 'invalid_or_expired' | 'wrong_account' };

export async function acceptInvitation(userId: string, token: string): Promise<AcceptResult> {
  const tokenHash = createHash('sha256').update(token).digest();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      \`SELECT i.id, i.organization_id, i.email, i.role, u.email AS user_email, u.email_verified_at
         FROM invitations i
         JOIN users u ON u.id = $2
        WHERE i.token_hash = $1
          AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > now()
        FOR UPDATE OF i\`, // запираем приглашение: двойной клик не создаст двух участий
      [tokenHash, userId],
    );
    const invitation = rows[0];
    if (!invitation) {
      await client.query('ROLLBACK');
      return { ok: false, reason: 'invalid_or_expired' }; // одно сообщение на все случаи — не подсказываем, что не так
    }
    // Принять может только адресат: пересланное письмо не даёт доступ
    if (!invitation.email_verified_at || invitation.user_email.toLowerCase() !== invitation.email) {
      await client.query('ROLLBACK');
      return { ok: false, reason: 'wrong_account' };
    }
    await client.query(
      'INSERT INTO memberships (organization_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [invitation.organization_id, userId, invitation.role],
    );
    await client.query('UPDATE invitations SET accepted_at = now() WHERE id = $1', [invitation.id]);
    await client.query('COMMIT');
    return { ok: true, organizationId: invitation.organization_id };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ═══ 5. УДАЛИТЬ УЧАСТНИКА ═══
type RemoveResult = { ok: true } | { ok: false; reason: 'forbidden' | 'not_found' | 'transfer_ownership_first' };

export async function removeMember(tenant: Tenant, memberUserId: string): Promise<RemoveResult> {
  if (!can(tenant, 'members.remove')) return { ok: false, reason: 'forbidden' };
  return withTenant(tenant, async (client): Promise<RemoveResult> => {
    // Запираем все участия организации — правило «есть хотя бы один владелец» касается нескольких строк
    const { rows } = await client.query<{ user_id: string; role: Role }>(
      'SELECT user_id, role FROM memberships WHERE organization_id = $1 FOR UPDATE',
      [tenant.organizationId],
    );
    const target = rows.find((row) => row.user_id === memberUserId);
    if (!target) return { ok: false, reason: 'not_found' };
    if (target.role === 'owner') {
      if (tenant.role !== 'owner') return { ok: false, reason: 'forbidden' }; // администратор владельца не удаляет
      const owners = rows.filter((row) => row.role === 'owner').length;
      if (owners === 1) return { ok: false, reason: 'transfer_ownership_first' };
    }
    await client.query('DELETE FROM memberships WHERE organization_id = $1 AND user_id = $2', [
      tenant.organizationId,
      memberUserId,
    ]);
    // Открытые обращения ушедшего — обратно в общую очередь «ничьих», чтобы не повисли
    await client.query(
      "UPDATE conversations SET assignee_id = NULL WHERE organization_id = $1 AND assignee_id = $2 AND status <> 'closed'",
      [tenant.organizationId, memberUserId],
    );
    // Сессии отдельно гасить не нужно: resolveTenant проверяет участие В БАЗЕ при каждом запросе,
    // и следующий же запрос удалённого получит 404. Если бы роль лежала в JWT на сутки — он работал бы сутки.
    // Место остаётся оплаченным до конца периода: на него можно пригласить другого человека
    return { ok: true };
  });
}

// ═══ КАК НЕ НАДО ═══
// const link = '/invite/' + invitation.id;                       // [!error] номер вместо случайного токена
// INSERT INTO invitations (…, token) VALUES (…, $1)              // [!error] сам токен в базе
// if (user.role === 'owner' || user.role === 'admin') { … }      // [!error] сто таких мест в коде
// acceptInvitation без сверки почты                               // [!error] пересланное письмо = доступ
`;

  protected readonly entitlements = `
// ═══ 1. ОПИСАНИЕ ТАРИФОВ — ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЖИВУТ ЧИСЛА ═══
// В жизни это таблица plan_versions в базе; здесь — объект, чтобы всё было видно на одном экране
type Feature =
  | 'channels.messengers' // Telegram, ВКонтакте, чат на сайте; почта есть всегда
  | 'templates'
  | 'reminders'
  | 'reports.basic'
  | 'reports.full'
  | 'api'
  | 'audit_log';

type Limits = {
  maxSeats: number | null;        // null — без ограничений
  maxChannels: number;
  aiSuggestionsPerPeriod: number; // квота на период подписки, обнуляется при продлении
  historyDays: number | null;     // мягкий лимит: старше — не показываем, но храним
};

type PlanVersion = {
  id: string;
  title: string;
  pricePerSeatKopecks: number; // деньги — в целых копейках, никогда не дробными числами
  features: ReadonlySet<Feature>;
  limits: Limits;
};

const TEAM_FEATURES: Feature[] = ['channels.messengers', 'templates', 'reminders', 'reports.basic'];

export const PLAN_VERSIONS: Record<string, PlanVersion> = {
  free_v1: {
    id: 'free_v1', title: 'Бесплатный', pricePerSeatKopecks: 0,
    features: new Set<Feature>(),
    limits: { maxSeats: 1, maxChannels: 1, aiSuggestionsPerPeriod: 0, historyDays: 90 },
  },
  team_v1: {
    id: 'team_v1', title: 'Команда', pricePerSeatKopecks: 79_000,
    features: new Set<Feature>(TEAM_FEATURES),
    limits: { maxSeats: 10, maxChannels: 4, aiSuggestionsPerPeriod: 300, historyDays: null },
  },
  business_v1: {
    id: 'business_v1', title: 'Бизнес', pricePerSeatKopecks: 149_000,
    features: new Set<Feature>([...TEAM_FEATURES, 'reports.full', 'api', 'audit_log']),
    limits: { maxSeats: null, maxChannels: 20, aiSuggestionsPerPeriod: 2000, historyDays: null },
  },
};

// ═══ 2. ВОЗМОЖНОСТИ ОРГАНИЗАЦИИ ПРЯМО СЕЙЧАС ═══
type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
type SubscriptionRow = {
  status: SubscriptionStatus;
  planVersionId: string;
  seats: number;
  extraAiSuggestions: number; // докупленные пакеты в текущем периоде
};
type Override = { aiSuggestionsBonus?: number; maxChannels?: number }; // особые условия, выданные вручную

export type Entitlements = {
  plan: PlanVersion;
  source: 'subscription' | 'fallback_free';
  features: ReadonlySet<Feature>;
  limits: Limits & { seats: number };
};

export function getEntitlements(sub: SubscriptionRow, override: Override | null): Entitlements {
  // Тариф подписки действует, пока она «живая»: пробный период, оплачено, льготный период.
  // Переводы между статусами делает планировщик (разделы ниже), поэтому здесь доверяем статусу
  const alive = sub.status === 'trialing' || sub.status === 'active' || sub.status === 'past_due';
  const plan = PLAN_VERSIONS[alive ? sub.planVersionId : 'free_v1'];
  if (!plan) throw new Error('unknown plan version: ' + sub.planVersionId);

  return {
    plan,
    source: alive ? 'subscription' : 'fallback_free',
    features: plan.features,
    limits: {
      ...plan.limits,
      seats: alive ? sub.seats : 1,
      maxChannels: override?.maxChannels ?? plan.limits.maxChannels,
      aiSuggestionsPerPeriod:
        plan.limits.aiSuggestionsPerPeriod + (alive ? sub.extraAiSuggestions : 0) + (override?.aiSuggestionsBonus ?? 0),
    },
  };
}

// ═══ 3. ПРОВЕРКИ: «ДОСТУПНО ЛИ», А НЕ «КАКОЙ ТАРИФ» ═══
export type Check =
  | { ok: true }
  | { ok: false; reason: 'feature_not_in_plan' | 'limit_reached'; message: string; upgradeTo?: 'Команда' | 'Бизнес' };

export function checkFeature(ent: Entitlements, feature: Feature): Check {
  if (ent.features.has(feature)) return { ok: true };
  const upgradeTo = PLAN_VERSIONS['team_v1'].features.has(feature) ? 'Команда' : 'Бизнес';
  return {
    ok: false,
    reason: 'feature_not_in_plan',
    upgradeTo,
    // Человеческое сообщение с причиной и выходом, а не «403 Forbidden»
    message: \`Эта функция есть на тарифе «\${upgradeTo}». Сейчас у вас «\${ent.plan.title}».\`,
  };
}

export function checkChannelLimit(ent: Entitlements, activeChannels: number): Check {
  if (activeChannels < ent.limits.maxChannels) return { ok: true };
  return {
    ok: false,
    reason: 'limit_reached',
    upgradeTo: ent.plan.id === 'free_v1' ? 'Команда' : 'Бизнес',
    message: \`На тарифе «\${ent.plan.title}» можно подключить каналов: \${ent.limits.maxChannels}.\`,
  };
}

// ═══ 4. ОБРАБОТЧИК: КОРОТКИЙ И ОДИНАКОВЫЙ ═══
// app, resolveTenant, withTenant, can, Tenant — из примеров выше;
// loadEntitlements читает строку подписки и особые условия и вызывает getEntitlements
app.post('/:orgSlug/api/channels', resolveTenant, express.json(), async (req, res) => {
  const tenant = res.locals['tenant'] as Tenant;
  if (!can(tenant, 'channels.manage')) {
    res.sendStatus(403);
    return;
  }
  const kind = String(req.body?.kind); // 'email' | 'telegram' | 'vk' | 'widget'
  const result = await withTenant(tenant, async (client): Promise<Check> => {
    // lock: true — подписка читается с FOR UPDATE: две одновременные попытки подключить пятый канал
    // выстроятся в очередь, и вторая увидит уже четыре подключённых
    const ent = await loadEntitlements(client, tenant.organizationId, { lock: true });
    if (kind !== 'email') {
      const feature = checkFeature(ent, 'channels.messengers');
      if (!feature.ok) return feature;
    }
    const limit = checkChannelLimit(ent, await countActiveChannels(client, tenant.organizationId));
    if (!limit.ok) return limit;
    await createChannel(client, tenant.organizationId, kind);
    return { ok: true };
  });
  if (!result.ok) {
    res.status(403).json(result); // интерфейс покажет message и кнопку «перейти на тариф …»
    return;
  }
  res.sendStatus(201);
});

// ═══ 5. ОКАЗАЛИСЬ СВЕРХ ЛИМИТА: ПРИОСТАНОВИТЬ, НЕ УДАЛЯТЬ ═══
export async function suspendOverLimit(client: pg.PoolClient, organizationId: string, ent: Entitlements): Promise<void> {
  // Работать остаются самые старые каналы в пределах лимита (почту обычно подключают первой),
  // остальные — на паузу со всеми настройками и историей
  await client.query(
    \`UPDATE channels SET suspended_at = now(), suspended_reason = 'plan_limit'
      WHERE organization_id = $1 AND suspended_at IS NULL
        AND id NOT IN (SELECT id FROM channels
                        WHERE organization_id = $1 AND suspended_at IS NULL
                        ORDER BY created_at LIMIT $2)\`,
    [organizationId, ent.limits.maxChannels],
  );
}
// Обратная операция при возобновлении подписки — снять паузу со всего, что приостановлено из-за лимита:
//   UPDATE channels SET suspended_at = NULL, suspended_reason = NULL
//    WHERE organization_id = $1 AND suspended_reason = 'plan_limit'
// Мягкий лимит истории — условие в запросах очереди, а не удаление:
//   … AND ($2::int IS NULL OR created_at > now() - make_interval(days => $2))

// ═══ КАК НЕ НАДО ═══
// if (org.plan === 'team' && usage < 300) { … }        // [!error] числа тарифа размазаны по коду
// if (!lastPayment.succeeded) disableEverything();     // [!error] льготный период сломан
// DELETE FROM channels WHERE … — при переходе на меньший тариф   // [!error] клиент вернётся к пустоте
// сервер верит флагу canUseApi, присланному из браузера // [!error] возможности считает только сервер
`;

  protected readonly trial = `
// ═══ 1. ПЛАНИРОВЩИК: ОДНА ФУНКЦИЯ, КОТОРУЮ ЗАПУСКАЮТ КАЖДЫЕ 5 МИНУТ ═══
// Запускает её cron, воркер очереди или setInterval — неважно. Важно, что двойной запуск безопасен.
// Работает ролью otklik_billing: таблицы биллинга без политик строк, ей видны все организации.
import type pg from 'pg';
import { pool } from './db';
import { firstPeriod } from './billing-periods';        // даты с якорем — пример ниже
import { createRenewalInvoice } from './renewal';      // раздел «Продление по расписанию»
import { getEntitlements, suspendOverLimit } from './entitlements';

async function tx<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function enqueue(client: pg.PoolClient, kind: string, payload: object): Promise<void> {
  await client.query('INSERT INTO jobs (kind, payload, run_at) VALUES ($1, $2, now())', [kind, JSON.stringify(payload)]);
}

export async function trialTick(): Promise<void> {
  await sendTrialReminders();
  await finishExpiredTrials();
}

// ═══ 2. НАПОМИНАНИЯ: ЗА 3 ДНЯ И ЗА СУТКИ ═══
// Имена столбцов — из этой константы, а не из ввода пользователя, поэтому подставлять их в SQL безопасно
const REMINDERS = [
  { column: 'trial_reminder_3d_at', before: '3 days', email: 'email.trial_ends_in_3_days' },
  { column: 'trial_reminder_1d_at', before: '1 day', email: 'email.trial_ends_tomorrow' },
] as const;

async function sendTrialReminders(): Promise<void> {
  for (const reminder of REMINDERS) {
    await tx(async (client) => {
      // «Занимаем» подписки одним UPDATE: отметка ставится только там, где её ещё нет.
      // Второй запуск планировщика таких строк уже не найдёт — письмо уйдёт ровно один раз
      const { rows } = await client.query<{ organization_id: string; trial_ends_at: Date; has_method: boolean }>(
        \`UPDATE subscriptions s
            SET \${reminder.column} = now()
          WHERE s.status = 'trialing'
            AND s.\${reminder.column} IS NULL
            AND s.trial_ends_at > now()
            AND s.trial_ends_at <= now() + interval '\${reminder.before}'
         RETURNING s.organization_id, s.trial_ends_at,
                   EXISTS (SELECT 1 FROM payment_methods pm
                            WHERE pm.organization_id = s.organization_id
                              AND pm.deleted_at IS NULL) AS has_method\`,
      );
      // Отметка и задача на письмо — в одной транзакции: либо обе, либо ни одной
      for (const row of rows) {
        await enqueue(client, reminder.email, {
          organizationId: row.organization_id,
          trialEndsAt: row.trial_ends_at,
          // Карта уже есть — письмо «15-го спишем 2 370 ₽»; нет — «привяжите карту, чтобы продолжить»
          hasPaymentMethod: row.has_method,
        });
      }
    });
  }
}

// ═══ 3. ПРОБНЫЙ ПЕРИОД КОНЧИЛСЯ ═══
type ExpiredTrial = {
  id: string;
  organization_id: string;
  plan_version_id: string;
  seats: number;
  trial_ends_at: Date;
  has_method: boolean;
};

async function finishExpiredTrials(): Promise<void> {
  await tx(async (client) => {
    // current_period_end IS NULL — «первый период ещё не открыт»: уже обработанные сюда не попадут.
    // FOR UPDATE SKIP LOCKED: второй планировщик возьмёт ДРУГИЕ подписки, а не будет ждать эти.
    // Отменили в пробном периоде (cancel_at_period_end) — считаем, что карты нет: не списываем
    const { rows } = await client.query<ExpiredTrial>(
      \`SELECT s.id, s.organization_id, s.plan_version_id, s.seats, s.trial_ends_at,
              NOT s.cancel_at_period_end
              AND EXISTS (SELECT 1 FROM payment_methods pm
                           WHERE pm.organization_id = s.organization_id AND pm.deleted_at IS NULL) AS has_method
         FROM subscriptions s
        WHERE s.status = 'trialing'
          AND s.trial_ends_at <= now()
          AND s.current_period_end IS NULL
        ORDER BY s.trial_ends_at
        LIMIT 50
        FOR UPDATE OF s SKIP LOCKED\`,
    );

    for (const sub of rows) {
      if (sub.has_method) {
        // Карта есть: первый период начинается в момент конца пробного, якорь — этот день месяца.
        // Статус пока trialing: active он станет, когда придёт подтверждённое списание
        const period = firstPeriod(sub.trial_ends_at, 'month');
        await client.query(
          \`UPDATE subscriptions
              SET current_period_start = $2, current_period_end = $3, billing_anchor_day = $4
            WHERE id = $1\`,
          [sub.id, period.start, period.end, period.anchorDay],
        );
        // Счёт «места × цена»; само списание сделает задача продления — общий путь для всех периодов
        await createRenewalInvoice(client, {
          subscriptionId: sub.id,
          organizationId: sub.organization_id,
          period,
          planVersionId: sub.plan_version_id,
          seats: sub.seats,
        });
      } else {
        // Карты нет: подписка закончилась, действуют возможности бесплатного тарифа
        await client.query(
          \`UPDATE subscriptions
              SET status = 'canceled', ended_at = now(), ended_reason = 'trial_expired'
            WHERE id = $1 AND status = 'trialing'\`,
          [sub.id],
        );
        // Лишние каналы — на паузу со всеми настройками; данные НЕ удаляем
        const free = getEntitlements(
          { status: 'canceled', planVersionId: sub.plan_version_id, seats: sub.seats, extraAiSuggestions: 0 },
          null,
        );
        await suspendOverLimit(client, sub.organization_id, free);
        await enqueue(client, 'email.trial_expired', { organizationId: sub.organization_id });
      }
      await client.query(
        "INSERT INTO subscription_events (subscription_id, kind, actor) VALUES ($1, $2, 'scheduler')",
        [sub.id, sub.has_method ? 'trial_converting' : 'trial_expired'],
      );
    }
  });
}

// ═══ 4. ПРОДЛИТЬ ПРОБНЫЙ ПЕРИОД — ОДНО ПОЛЕ ═══
// Поддержка: «давайте ещё неделю». Будильников переставлять не нужно — планировщик смотрит на дату.
// Отметки напоминаний сбрасываем, чтобы письма пришли снова — уже к новой дате
export async function extendTrial(client: pg.PoolClient, subscriptionId: string, days: number, supportUserId: string) {
  await client.query(
    \`UPDATE subscriptions
        SET trial_ends_at = trial_ends_at + make_interval(days => $2),
            trial_reminder_3d_at = NULL, trial_reminder_1d_at = NULL
      WHERE id = $1 AND status = 'trialing' AND current_period_end IS NULL\`,
    [subscriptionId, days],
  );
  await client.query(
    "INSERT INTO subscription_events (subscription_id, kind, data, actor) VALUES ($1, 'trial_extended', $2, $3)",
    [subscriptionId, JSON.stringify({ days }), 'support:' + supportUserId],
  );
}

// ═══ КАК НЕ НАДО ═══
// setTimeout(() => endTrial(org), 14 * 24 * 60 * 60 * 1000);          // [!error] перезапуск сервера — и забыли
// if (new Date() > sub.trialEndsAt) — в браузере клиента                // [!error] часы клиента — не источник правды
// await sendEmail(...); await markReminderSent(...);                   // [!error] упали между — письмо уйдёт снова
// DELETE FROM channels WHERE organization_id = $1 — пробный кончился   // [!error] клиент вернётся к пустоте
`;

  protected readonly subscriptionSchema = `
-- ═══ 1. ВЕРСИИ ТАРИФОВ ═══
CREATE TABLE plan_versions (
  id                     text PRIMARY KEY,              -- 'team_v1', 'team_year_v1'
  plan_code              text NOT NULL,                 -- 'team' — общий у всех версий «Команды»
  title                  text NOT NULL,                 -- «Команда»
  billing_interval       text NOT NULL CHECK (billing_interval IN ('month', 'year')),
  price_per_seat_kopecks integer NOT NULL CHECK (price_per_seat_kopecks >= 0), -- 79000 = 790,00 ₽
  is_public              boolean NOT NULL DEFAULT true, -- false — новым клиентам больше не продаётся
  created_at             timestamptz NOT NULL DEFAULT now()
);
INSERT INTO plan_versions (id, plan_code, title, billing_interval, price_per_seat_kopecks) VALUES
  ('free_v1',          'free',     'Бесплатный', 'month',      0),
  ('team_v1',          'team',     'Команда',    'month',  79000),
  ('team_year_v1',     'team',     'Команда',    'year',  758400),  -- 790 × 12 × 0,8
  ('business_v1',      'business', 'Бизнес',     'month', 149000),
  ('business_year_v1', 'business', 'Бизнес',     'year', 1430400); -- 1 490 × 12 × 0,8

-- ═══ 2. ПОДПИСКИ — «ЧТО У ОРГАНИЗАЦИИ СЕЙЧАС» ═══
CREATE TABLE subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       uuid NOT NULL REFERENCES organizations (id),
  plan_version_id       text NOT NULL REFERENCES plan_versions (id),
  status                text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled')),
  seats                 integer NOT NULL CHECK (seats >= 1),
  trial_ends_at         timestamptz,
  trial_reminder_3d_at  timestamptz,   -- когда отправили напоминание за 3 дня; NULL — ещё нет
  trial_reminder_1d_at  timestamptz,
  current_period_start  timestamptz,   -- NULL, пока первый период не открыт
  current_period_end    timestamptz,
  billing_anchor_day    smallint CHECK (billing_anchor_day BETWEEN 1 AND 31), -- 15 — продление 15-го
  cancel_at_period_end  boolean NOT NULL DEFAULT false,  -- «не продлевать»: доступ до current_period_end
  scheduled_plan_version_id text REFERENCES plan_versions (id), -- «с нового периода — другой тариф»
  scheduled_seats       integer CHECK (scheduled_seats >= 1),   -- «с нового периода — 3 места»
  grace_ends_at         timestamptz,   -- конец льготного периода; только у past_due
  extra_ai_suggestions  integer NOT NULL DEFAULT 0,      -- докупленные пакеты в текущем периоде
  ended_at              timestamptz,
  ended_reason          text CHECK (ended_reason IN ('trial_expired', 'unpaid', 'customer_request')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  -- Поля обязаны соответствовать статусу — бессмыслицу база не запишет
  CHECK (status <> 'trialing' OR trial_ends_at IS NOT NULL),
  CHECK (status NOT IN ('active', 'past_due') OR current_period_end IS NOT NULL),
  CHECK (status <> 'past_due' OR grace_ends_at IS NOT NULL),
  CHECK ((status = 'canceled') = (ended_at IS NOT NULL AND ended_reason IS NOT NULL))
);
-- Одна «живая» подписка на организацию; закончившиеся остаются историей для метрик
CREATE UNIQUE INDEX subscriptions_one_alive ON subscriptions (organization_id) WHERE status <> 'canceled';
-- Планировщику: «у кого пора продлевать» и «у кого кончается пробный»
CREATE INDEX subscriptions_renewal_idx ON subscriptions (current_period_end) WHERE status IN ('active', 'past_due');
CREATE INDEX subscriptions_trial_idx ON subscriptions (trial_ends_at) WHERE status = 'trialing';

-- ═══ 3. СОГЛАСИЯ И СПОСОБЫ ОПЛАТЫ — ТОЛЬКО ИДЕНТИФИКАТОРЫ ═══
CREATE TABLE autopay_consents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations (id),
  user_id         uuid NOT NULL REFERENCES users (id),  -- кто поставил галочку
  text_version    text NOT NULL,                        -- 'autopay-2026-10': какой именно текст он видел
  ip              inet,
  given_at        timestamptz NOT NULL DEFAULT now(),
  revoked_at      timestamptz                           -- отказ: дальше по этому согласию не списываем
);

CREATE TABLE payment_methods (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    uuid NOT NULL REFERENCES organizations (id),
  provider           text NOT NULL DEFAULT 'yookassa',
  provider_method_id text NOT NULL UNIQUE,    -- payment_method.id из ЮKassa; номера карты здесь нет и не будет
  kind               text NOT NULL,           -- 'bank_card', 'sbp'
  card_last4         text,                    -- '4417' — чтобы показать «•• 4417»
  card_expiry_month  smallint,                -- 11 — за месяц до конца срока напишем клиенту
  card_expiry_year   smallint,
  is_default         boolean NOT NULL DEFAULT false,
  consent_id         uuid NOT NULL REFERENCES autopay_consents (id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  deleted_at         timestamptz              -- «отвязали»: для списаний больше не используем никогда
);

-- ═══ 4. СЧЕТА — «ЧТО МЫ ПОПРОСИЛИ ЗАПЛАТИТЬ» ═══
CREATE TABLE invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number          text NOT NULL UNIQUE,   -- 'OTK-2026-000188' — для людей, бухгалтерии, назначения платежа
  organization_id uuid NOT NULL REFERENCES organizations (id),
  subscription_id uuid NOT NULL REFERENCES subscriptions (id),
  kind            text NOT NULL CHECK (kind IN ('renewal', 'proration', 'addon')),
  period_start    timestamptz NOT NULL,
  period_end      timestamptz NOT NULL,
  total_kopecks   integer NOT NULL CHECK (total_kopecks >= 0),
  status          text NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  collection      text NOT NULL CHECK (collection IN ('autopay', 'bank_transfer')),
  due_at          timestamptz NOT NULL,   -- до какого момента ждём оплату
  paid_at         timestamptz,
  change          jsonb,                  -- у доплаты: что применить после оплаты, '{"addSeats": 1}'
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (period_end > period_start)
);
-- ГЛАВНАЯ защита от двойного списания: один счёт за продление на один период подписки
CREATE UNIQUE INDEX invoices_one_renewal_per_period
  ON invoices (subscription_id, period_start) WHERE kind = 'renewal';

CREATE TABLE invoice_lines (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id         uuid NOT NULL REFERENCES invoices (id),
  description        text NOT NULL,           -- «Тариф „Команда“, место оператора, 15.11–15.12»
  quantity           integer NOT NULL CHECK (quantity > 0),
  unit_price_kopecks integer NOT NULL CHECK (unit_price_kopecks >= 0), -- снимок цены на момент счёта
  amount_kopecks     integer NOT NULL,
  plan_version_id    text REFERENCES plan_versions (id),
  -- Итог строки всегда проверяется умножением — того же требует и кассовый чек
  CHECK (amount_kopecks = quantity * unit_price_kopecks)
);

-- ═══ 5. ПЛАТЕЖИ — ПОПЫТКИ ПОЛУЧИТЬ ДЕНЬГИ ПО СЧЁТУ ═══
CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id          uuid NOT NULL REFERENCES invoices (id),
  attempt             smallint NOT NULL,       -- 1, 2, 3… — номер попытки по этому счёту
  idempotence_key     text NOT NULL UNIQUE,    -- 'invoice:<id>:attempt:2' — тот же ключ уходит в ЮKassa
  provider_payment_id text UNIQUE,             -- id платежа в ЮKassa; NULL, пока ответ не получен
  payment_method_id   uuid REFERENCES payment_methods (id),
  amount_kopecks      integer NOT NULL,
  status              text NOT NULL CHECK (status IN ('pending', 'succeeded', 'canceled')),
  failure_reason      text,                    -- из cancellation_details.reason: 'card_expired', 'insufficient_funds'…
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (invoice_id, attempt)
);

-- ═══ 6. ИСТОРИЯ ПОДПИСКИ — КТО, ЧТО И КОГДА ═══
CREATE TABLE subscription_events (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscription_id uuid NOT NULL REFERENCES subscriptions (id),
  kind            text NOT NULL,     -- 'trial_started', 'activated', 'seats_changed', 'renewed', 'payment_failed'…
  data            jsonb NOT NULL DEFAULT '{}',
  actor           text NOT NULL,     -- 'user:<id>', 'scheduler', 'support:<id>'
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ═══ 7. «ОБЖИГ» НА 20 НОЯБРЯ ═══
-- subscriptions:   team_v1 · active · seats 4 · период 15.11 → 15.12 · якорь 15
-- invoices:
--   OTK-2026-000101  renewal    15.10–15.11  2 370,00 ₽  paid   строка: 3 × 790,00
--   OTK-2026-000134  proration  20.10–15.11    662,58 ₽  paid   строка: 1 × 662,58 (26 дней из 31)
--   OTK-2026-000188  renewal    15.11–15.12  3 160,00 ₽  paid   строка: 4 × 790,00
-- payments по OTK-2026-000188:
--   attempt 1  15.11  canceled   failure_reason = card_expired
--   attempt 2  17.11  succeeded  — с новой карты

-- ═══ КАК НЕ НАДО ═══
-- ALTER TABLE organizations ADD COLUMN paid_until date;   -- [!error] одно поле вместо счетов за периоды
-- price numeric(10, 2) или price real                     -- [!error] дробные деньги
-- CREATE TABLE cards (number text, cvc text, …);          -- [!error] номер карты в своей базе
`;

  protected readonly billingPeriods = `
// ═══ 1. ПОЧЕМУ НЕ «ПЛЮС МЕСЯЦ» ═══
const naive = new Date(Date.UTC(2027, 0, 31)); // 31 января 2027 (месяцы в Date считаются с нуля)
naive.setUTCMonth(naive.getUTCMonth() + 1);
console.log(naive.toISOString().slice(0, 10)); // '2027-03-03' — «31 февраля» перелилось в март  // [!error]

// ═══ 2. ТОТ ЖЕ ДЕНЬ МЕСЯЦА, А ЕСЛИ ЕГО НЕТ — ПОСЛЕДНИЙ ═══
function daysInMonthUTC(year: number, month0: number): number {
  // «Нулевой» день следующего месяца — это последний день нужного
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}

// anchorDay — день месяца первого периода (1–31); время суток сохраняем как было
export function addMonthsAnchored(from: Date, months: number, anchorDay: number): Date {
  const totalMonths = from.getUTCMonth() + months;
  const year = from.getUTCFullYear() + Math.floor(totalMonths / 12);
  const month0 = ((totalMonths % 12) + 12) % 12;
  const day = Math.min(anchorDay, daysInMonthUTC(year, month0));
  return new Date(Date.UTC(year, month0, day, from.getUTCHours(), from.getUTCMinutes(), from.getUTCSeconds()));
}

// ═══ 3. ПЕРИОДЫ ПОДПИСКИ ═══
export type Period = { start: Date; end: Date; anchorDay: number };
type BillingInterval = 'month' | 'year';

export function firstPeriod(start: Date, interval: BillingInterval): Period {
  // Якорь считаем в UTC: так все серверы получат одно и то же число.
  // Клиенту показываем дату в ЕГО часовом поясе (пункт 5)
  const anchorDay = start.getUTCDate();
  return { start, end: addMonthsAnchored(start, interval === 'month' ? 1 : 12, anchorDay), anchorDay };
}

export function nextPeriod(current: Period, interval: BillingInterval): Period {
  // Считаем от ЯКОРЯ, а не от прошлой даты: 28 февраля не «съедает» 31-е навсегда
  const months = interval === 'month' ? 1 : 12;
  return { start: current.end, end: addMonthsAnchored(current.end, months, current.anchorDay), anchorDay: current.anchorDay };
}

// Подписка, оформленная 31 января 2027 в 09:40 UTC:
let period = firstPeriod(new Date(Date.UTC(2027, 0, 31, 9, 40)), 'month');
for (let i = 0; i < 4; i++) {
  console.log(period.start.toISOString().slice(0, 10), '→', period.end.toISOString().slice(0, 10));
  period = nextPeriod(period, 'month');
}
// 2027-01-31 → 2027-02-28
// 2027-02-28 → 2027-03-31   ← якорь вернулся на 31-е
// 2027-03-31 → 2027-04-30
// 2027-04-30 → 2027-05-31

// ═══ 4. ДЛИНА ПЕРИОДА В ДНЯХ — ПРИГОДИТСЯ ДЛЯ ПЕРЕРАСЧЁТА ═══
const DAY_MS = 86_400_000;
export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS); // round — на случай секунд и перевода часов
}
// Периоды «Обжига»: 15.10 → 15.11 — 31 день; 15.11 → 15.12 — 30 дней; 15.01 → 15.02 — 31 день.
// Месяц — не «30 дней»: у периодов разная длина, и перерасчёт это учитывает

// ═══ 5. ПОКАЗ КЛИЕНТУ — В ЕГО ЧАСОВОМ ПОЯСЕ ═══
export function formatForCustomer(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone, // 'Europe/Moscow' — из настроек организации
  }).format(date);
}
// formatForCustomer(new Date('2026-10-15T09:40:00Z'), 'Europe/Moscow') → например, «15 октября в 12:40»

// ═══ КАК НЕ НАДО ═══
// paidUntil.setMonth(paidUntil.getMonth() + 1);        // [!error] 31 января → 3 марта
// const periodDays = 30;                               // [!error] у периодов разная длина
// if (new Date().getDate() === 15) renewAll();         // [!error] «сегодня 15-е» на сервере в UTC — не в Москве
`;

  protected readonly autopayFirst = `
// ═══ 1. КЛИЕНТ ЮKASSA ═══
import type pg from 'pg';
import { pool, withTenant, type Tenant } from './tenant';
import { can } from './permissions';
import { tx } from './db';

const API = 'https://api.yookassa.ru/v3';
// shopId и секретный ключ — только из переменных окружения сервера
const auth = 'Basic ' + Buffer.from(\`\${process.env.YOOKASSA_SHOP_ID}:\${process.env.YOOKASSA_SECRET_KEY}\`).toString('base64');

export type YooPayment = {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  amount: { value: string; currency: 'RUB' }; // сумма строкой: "2370.00"
  payment_method?: {
    type: string;   // 'bank_card', 'sbp', 'yoo_money'…
    id: string;     // идентификатор способа оплаты — его и сохраняем
    saved: boolean; // true — по нему можно списывать повторно
    card?: { last4: string; expiry_month: string; expiry_year: string; card_type: string };
  };
  confirmation?: { type: 'redirect'; confirmation_url: string };
  cancellation_details?: { party: string; reason: string }; // reason: 'card_expired', 'insufficient_funds'…
  metadata?: Record<string, string>;
};

export async function yookassa<T>(method: 'GET' | 'POST', path: string, body?: object, idempotenceKey?: string): Promise<T> {
  const response = await fetch(API + path, {
    method,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
      // Повтор запроса с тем же ключом ЮKassa не выполнит второй раз, а вернёт результат первого
      ...(idempotenceKey ? { 'Idempotence-Key': idempotenceKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(\`YooKassa \${method} \${path}: HTTP \${response.status}\`);
  return (await response.json()) as T;
}

// 237000 копеек → "2370.00" без дробной арифметики; и обратно
export const toValue = (kopecks: number) => \`\${Math.floor(kopecks / 100)}.\${String(kopecks % 100).padStart(2, '0')}\`;
export const toKopecks = (value: string) => {
  const [rubles, kopecks = '00'] = value.split('.');
  return Number(rubles) * 100 + Number(kopecks.padEnd(2, '0'));
};

// ═══ 2. ПЕРВЫЙ ПЛАТЁЖ С СОХРАНЕНИЕМ СПОСОБА ОПЛАТЫ ═══
// Путь, когда счёт уже выставлен: владелец нажал «оплатить и включить автопродление»
// и САМ поставил галочку согласия. (В пробном периоде карту привязывают без списания —
// у ЮKassa это «привязка на нулевую сумму», отдельный сценарий в её документации.)
export async function startAutopaySetup(tenant: Tenant, invoiceId: string, consentTextVersion: string, ip: string): Promise<string> {
  if (!can(tenant, 'billing.manage')) throw new Error('forbidden');

  // Транзакция 1: согласие и запись о попытке. Внешний запрос в ЮKassa — ПОСЛЕ неё, чтобы не держать
  // блокировки базы, пока ждём чужой сервер
  const prepared = await withTenant(tenant, async (client) => {
    const { rows } = await client.query<{ id: string; number: string; total_kopecks: number; status: string }>(
      'SELECT id, number, total_kopecks, status FROM invoices WHERE id = $1 AND organization_id = $2 FOR UPDATE',
      [invoiceId, tenant.organizationId],
    );
    const invoice = rows[0];
    if (!invoice || invoice.status !== 'open') throw new Error('invoice is not open');

    // Согласие — строка в базе: кто, когда, откуда и какую версию текста видел
    const consent = await client.query<{ id: string }>(
      'INSERT INTO autopay_consents (organization_id, user_id, text_version, ip) VALUES ($1, $2, $3, $4) RETURNING id',
      [tenant.organizationId, tenant.userId, consentTextVersion, ip],
    );
    const attempt = await nextAttempt(client, invoice.id);
    const idempotenceKey = \`invoice:\${invoice.id}:attempt:\${attempt}\`;
    await client.query(
      "INSERT INTO payments (invoice_id, attempt, idempotence_key, amount_kopecks, status) VALUES ($1, $2, $3, $4, 'pending')",
      [invoice.id, attempt, idempotenceKey, invoice.total_kopecks],
    );
    return { invoice, consentId: consent.rows[0].id, idempotenceKey };
  });

  const { invoice, consentId, idempotenceKey } = prepared;
  const payment = await yookassa<YooPayment>(
    'POST',
    '/payments',
    {
      amount: { value: toValue(invoice.total_kopecks), currency: 'RUB' },
      capture: true,                 // одностадийно: подписке холд не нужен
      save_payment_method: true,     // сохранить способ оплаты для следующих списаний
      confirmation: {
        type: 'redirect',
        return_url: 'https://app.otklik.example/billing/return?invoice=' + encodeURIComponent(invoice.number),
      },
      description: \`Счёт \${invoice.number}: «Отклик», тариф «Команда»\`, // это клиент увидит на странице оплаты
      metadata: { invoiceId: invoice.id, organizationId: tenant.organizationId, consentId },
      receipt: await buildReceipt(invoice.id), // чек — раздел «Чеки, НДС и закрывающие документы»
    },
    idempotenceKey,
  );
  // Упали до этой строки — не страшно: сверка повторит запрос с тем же ключом и получит тот же платёж
  await pool.query('UPDATE payments SET provider_payment_id = $1 WHERE idempotence_key = $2', [payment.id, idempotenceKey]);
  if (!payment.confirmation) throw new Error('no confirmation url');
  return payment.confirmation.confirmation_url; // браузер клиента уходит сюда
}

// ═══ 3. ВЕБХУК: ПЛАТЁЖ ПРОШЁЛ — СОХРАНЯЕМ СПОСОБ ОПЛАТЫ ═══
// Проверка адреса отправителя и «спроси сам» — как в рецепте про магазин; здесь — только новое
type PaymentRow = { id: string; status: string; invoice_id: string; organization_id: string; subscription_id: string; total_kopecks: number };

export async function onPaymentSucceeded(providerPaymentId: string): Promise<void> {
  // Решаем по ответу API, а не по телу уведомления: подделать ответ API нельзя
  const payment = await yookassa<YooPayment>('GET', '/payments/' + encodeURIComponent(providerPaymentId));
  if (payment.status !== 'succeeded') return;

  await tx(async (client) => {
    const { rows } = await client.query<PaymentRow>(
      \`SELECT p.id, p.status, p.invoice_id, i.organization_id, i.subscription_id, i.total_kopecks
         FROM payments p JOIN invoices i ON i.id = p.invoice_id
        WHERE p.provider_payment_id = $1
        FOR UPDATE OF p\`, // второй такой же вебхук подождёт и увидит уже 'succeeded'
      [payment.id],
    );
    const row = rows[0];
    if (!row || row.status === 'succeeded') return; // не наш платёж или повтор — уже обработали
    if (toKopecks(payment.amount.value) !== row.total_kopecks) {
      await alertHuman('payment amount mismatch', { paymentId: payment.id }); // доступ по такому платежу не даём
      return;
    }
    await client.query("UPDATE payments SET status = 'succeeded' WHERE id = $1", [row.id]);
    await client.query("UPDATE invoices SET status = 'paid', paid_at = now() WHERE id = $1 AND status = 'open'", [row.invoice_id]);

    const method = payment.payment_method;
    if (method?.saved) {
      // Сохраняем ИДЕНТИФИКАТОР и то, что покажем в кабинете. ON CONFLICT — повтор не создаст дубль
      await client.query(
        \`INSERT INTO payment_methods
           (organization_id, provider_method_id, kind, card_last4, card_expiry_month, card_expiry_year, is_default, consent_id)
         VALUES ($1, $2, $3, $4, $5, $6, true, $7)
         ON CONFLICT (provider_method_id) DO NOTHING\`,
        [
          row.organization_id,
          method.id,
          method.type,
          method.card?.last4 ?? null,
          method.card ? Number(method.card.expiry_month) : null,
          method.card ? Number(method.card.expiry_year) : null,
          payment.metadata?.['consentId'],
        ],
      );
      // Новый способ — основной; старые остаются в списке, пока их не отвяжут
      await client.query(
        'UPDATE payment_methods SET is_default = (provider_method_id = $2) WHERE organization_id = $1 AND deleted_at IS NULL',
        [row.organization_id, method.id],
      );
    }
    await activateAfterPayment(client, row.subscription_id, row.invoice_id); // статус и даты — следующий раздел
  });
}

// ═══ 4. СЛЕДУЮЩИЕ СПИСАНИЯ — БЕЗ КЛИЕНТА ═══
export function autopayRequest(invoice: { id: string; number: string; total_kopecks: number }, providerMethodId: string) {
  return {
    amount: { value: toValue(invoice.total_kopecks), currency: 'RUB' },
    capture: true,
    payment_method_id: providerMethodId, // вместо confirmation: клиента никуда не отправляем
    description: \`Автопродление «Отклика», счёт \${invoice.number}\`,
    metadata: { invoiceId: invoice.id },
  };
}

// ═══ 5. «ОТВЯЗАТЬ КАРТУ» ═══
export async function detachPaymentMethod(tenant: Tenant, paymentMethodId: string): Promise<void> {
  if (!can(tenant, 'billing.manage')) throw new Error('forbidden');
  await withTenant(tenant, async (client) => {
    const { rows } = await client.query<{ consent_id: string }>(
      \`UPDATE payment_methods SET deleted_at = now(), is_default = false
        WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL
       RETURNING consent_id\`,
      [paymentMethodId, tenant.organizationId],
    );
    if (rows[0]) {
      await client.query('UPDATE autopay_consents SET revoked_at = now() WHERE id = $1', [rows[0].consent_id]);
    }
  });
  // В ЮKassa сохранённый способ удалить нельзя — поэтому планировщик ПЕРЕД КАЖДЫМ списанием
  // берёт только способы с deleted_at IS NULL. Живого способа нет — нет автосписания, только письмо
}

async function nextAttempt(client: pg.PoolClient, invoiceId: string): Promise<number> {
  const { rows } = await client.query<{ next: number }>(
    'SELECT coalesce(max(attempt), 0) + 1 AS next FROM payments WHERE invoice_id = $1',
    [invoiceId],
  );
  return rows[0].next;
}

// ═══ КАК НЕ НАДО ═══
// save_payment_method: true — при покупке разового пакета подсказок   // [!error] на автоплатёж не соглашались
// if (req.body.object.payment_method.saved) { … }                     // [!error] верим телу уведомления
// fetch(API + '/payments', { … }) без Idempotence-Key                 // [!error] повтор запроса — второе списание
// INSERT INTO payment_methods (…, card_number, …)                     // [!error] номер карты у себя
`;

  protected readonly renewal = `
// ═══ 0. ЧТО ДОБАВЛЯЕМ В СХЕМУ ═══
// Одна попытка «в полёте» на счёт: пока судьба попытки неизвестна, новую создать нельзя
//   CREATE UNIQUE INDEX payments_one_pending ON payments (invoice_id) WHERE status = 'pending';
import type pg from 'pg';
import { pool, tx, enqueue } from './db';
import { nextPeriod, formatDay } from './billing-periods';
import { yookassa, autopayRequest, toKopecks, type YooPayment } from './yookassa';
import { buildReceipt } from './receipts';
import { nextInvoiceNumber } from './invoices';
import { onPaymentFailed } from './dunning';
import { applyPaidChange } from './proration';

// ═══ 1. ШАГ ПЕРВЫЙ: ПЕРИОД КОНЧИЛСЯ → НОВЫЙ ПЕРИОД И СЧЁТ ЗА НЕГО ═══
type DueSubscription = {
  id: string;
  organization_id: string;
  plan_version_id: string;
  seats: number;
  current_period_start: Date;
  current_period_end: Date;
  billing_anchor_day: number;
  cancel_at_period_end: boolean;
  next_plan_version_id: string; // с учётом запланированной смены тарифа
  next_seats: number;           // с учётом запланированного уменьшения мест
  next_interval: 'month' | 'year';
};

export async function renewDueSubscriptions(): Promise<void> {
  await tx(async (client) => {
    // SKIP LOCKED: два планировщика одновременно возьмут РАЗНЫЕ подписки
    const { rows } = await client.query<DueSubscription>(
      \`SELECT s.id, s.organization_id, s.plan_version_id, s.seats,
              s.current_period_start, s.current_period_end, s.billing_anchor_day, s.cancel_at_period_end,
              coalesce(s.scheduled_plan_version_id, s.plan_version_id) AS next_plan_version_id,
              coalesce(s.scheduled_seats, s.seats) AS next_seats,
              pv.billing_interval AS next_interval
         FROM subscriptions s
         JOIN plan_versions pv ON pv.id = coalesce(s.scheduled_plan_version_id, s.plan_version_id)
        WHERE s.status = 'active' AND s.current_period_end <= now()
        ORDER BY s.current_period_end
        LIMIT 100
        FOR UPDATE OF s SKIP LOCKED\`,
    );

    for (const sub of rows) {
      if (sub.cancel_at_period_end) {
        // Клиент просил не продлевать: период кончился — подписка закончилась
        await client.query(
          \`UPDATE subscriptions SET status = 'canceled', ended_at = now(), ended_reason = 'customer_request'
            WHERE id = $1 AND status = 'active'\`,
          [sub.id],
        );
        await enqueue(client, 'email.subscription_ended', { subscriptionId: sub.id });
        continue; // + приостановка лишнего, как в конце пробного периода
      }

      const period = nextPeriod(
        { start: sub.current_period_start, end: sub.current_period_end, anchorDay: sub.billing_anchor_day },
        sub.next_interval,
      );
      // Подписка «переезжает» в новый период СРАЗУ; статус потом скажет, оплачен ли он.
      // Запланированные изменения применяются здесь и стираются; пакеты подсказок сгорают
      await client.query(
        \`UPDATE subscriptions
            SET current_period_start = $2, current_period_end = $3,
                plan_version_id = $4, seats = $5,
                scheduled_plan_version_id = NULL, scheduled_seats = NULL,
                extra_ai_suggestions = 0
          WHERE id = $1\`,
        [sub.id, period.start, period.end, sub.next_plan_version_id, sub.next_seats],
      );
      await createRenewalInvoice(client, {
        subscriptionId: sub.id,
        organizationId: sub.organization_id,
        period,
        planVersionId: sub.next_plan_version_id,
        seats: sub.next_seats,
      });
    }
  });
}

type RenewalArgs = {
  subscriptionId: string;
  organizationId: string;
  period: { start: Date; end: Date };
  planVersionId: string;
  seats: number;
};

export async function createRenewalInvoice(client: pg.PoolClient, args: RenewalArgs): Promise<string | null> {
  const { rows: plans } = await client.query<{ title: string; price_per_seat_kopecks: number }>(
    'SELECT title, price_per_seat_kopecks FROM plan_versions WHERE id = $1',
    [args.planVersionId],
  );
  const plan = plans[0];
  const total = args.seats * plan.price_per_seat_kopecks; // 4 × 79 000 = 316 000 копеек
  // Номер берётся из последовательности; если счёт не вставится, номер «сгорит» — дырка в нумерации
  // счетов на оплату допустима, а вот второй счёт за тот же период — нет
  const number = await nextInvoiceNumber(client);
  const { rows } = await client.query<{ id: string }>(
    \`INSERT INTO invoices (number, organization_id, subscription_id, kind, period_start, period_end,
                           total_kopecks, status, collection, due_at)
     VALUES ($1, $2, $3, 'renewal', $4, $5, $6, 'open', 'autopay', $4)
     ON CONFLICT (subscription_id, period_start) WHERE kind = 'renewal' DO NOTHING
     RETURNING id\`, // ← уникальный индекс: второй счёт за этот период база не вставит
    [number, args.organizationId, args.subscriptionId, args.period.start, args.period.end, total],
  );
  const invoiceId = rows[0]?.id;
  if (!invoiceId) return null; // счёт уже есть — значит, этот шаг кто-то уже сделал

  await client.query(
    \`INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price_kopecks, amount_kopecks, plan_version_id)
     VALUES ($1, $2, $3, $4, $5, $6)\`,
    [
      invoiceId,
      \`Тариф «\${plan.title}», место оператора, \${formatDay(args.period.start)}–\${formatDay(args.period.end)}\`,
      args.seats,
      plan.price_per_seat_kopecks, // снимок цены: завтрашнее подорожание этот счёт не изменит
      total,
      args.planVersionId,
    ],
  );
  await enqueue(client, 'billing.charge_invoice', { invoiceId }); // списание — отдельной задачей, шаг второй
  return invoiceId;
}

// ═══ 2. ШАГ ВТОРОЙ: ПОПЫТКА СПИСАНИЯ ═══
type PreparedCharge = {
  invoice: { id: string; number: string; total_kopecks: number };
  providerMethodId: string;
  idempotenceKey: string;
};

export async function chargeInvoice(invoiceId: string): Promise<void> {
  // Транзакция: решить, можно ли пытаться, и ЗАПИСАТЬ попытку ДО запроса в ЮKassa
  const prepared = await tx(async (client): Promise<PreparedCharge | null> => {
    const { rows } = await client.query<{ id: string; number: string; total_kopecks: number; status: string; organization_id: string }>(
      'SELECT id, number, total_kopecks, status, organization_id FROM invoices WHERE id = $1 FOR UPDATE',
      [invoiceId],
    );
    const invoice = rows[0];
    if (!invoice || invoice.status !== 'open') return null; // оплачен или аннулирован — нечего делать

    // Попытка «в полёте»? Новую не создаём, пока не выясним судьбу старой (этим займётся сверка)
    const inFlight = await client.query("SELECT 1 FROM payments WHERE invoice_id = $1 AND status = 'pending'", [invoiceId]);
    if (inFlight.rowCount) return null;

    // Только живой способ оплаты: отвязанный (deleted_at) не используем НИКОГДА
    const method = await client.query<{ id: string; provider_method_id: string }>(
      \`SELECT id, provider_method_id FROM payment_methods
        WHERE organization_id = $1 AND deleted_at IS NULL
        ORDER BY is_default DESC, created_at DESC
        LIMIT 1\`,
      [invoice.organization_id],
    );
    if (!method.rows[0]) {
      await enqueue(client, 'email.no_payment_method', { invoiceId }); // списывать не с чего — просим привязать
      return null;
    }

    const { rows: attempts } = await client.query<{ next: number }>(
      'SELECT coalesce(max(attempt), 0) + 1 AS next FROM payments WHERE invoice_id = $1',
      [invoiceId],
    );
    const attempt = attempts[0].next;
    const idempotenceKey = \`invoice:\${invoiceId}:attempt:\${attempt}\`; // ключ — на ПОПЫТКУ, а не на запрос
    await client.query(
      \`INSERT INTO payments (invoice_id, attempt, idempotence_key, payment_method_id, amount_kopecks, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')\`,
      [invoiceId, attempt, idempotenceKey, method.rows[0].id, invoice.total_kopecks],
    );
    return { invoice, providerMethodId: method.rows[0].provider_method_id, idempotenceKey };
  });
  if (!prepared) return;

  // Запрос — ВНЕ транзакции: не держим блокировки, пока ждём чужой сервер.
  // Тайм-аут здесь не страшен: попытка уже записана как pending, и сверка повторит
  // ЭТОТ ЖЕ запрос с ЭТИМ ЖЕ ключом — ЮKassa вернёт тот же платёж, а не создаст второй
  const payment = await yookassa<YooPayment>(
    'POST',
    '/payments',
    { ...autopayRequest(prepared.invoice, prepared.providerMethodId), receipt: await buildReceipt(prepared.invoice.id) },
    prepared.idempotenceKey,
  );
  await pool.query(
    'UPDATE payments SET provider_payment_id = $1 WHERE idempotence_key = $2 AND provider_payment_id IS NULL',
    [payment.id, prepared.idempotenceKey],
  );
  await applyPaymentResult(payment); // часто ответ уже финальный; если нет — дождёмся вебхука
}

// ═══ 3. РЕЗУЛЬТАТ: ОДНА ФУНКЦИЯ ДЛЯ ОТВЕТА API, ВЕБХУКА И СВЕРКИ ═══
type PaymentContext = {
  id: string;
  status: string;
  invoice_id: string;
  subscription_id: string;
  kind: 'renewal' | 'proration' | 'addon';
  total_kopecks: number;
  attempt: number;
};

export async function applyPaymentResult(payment: YooPayment): Promise<void> {
  if (payment.status !== 'succeeded' && payment.status !== 'canceled') return; // ещё в обработке — ждём вебхук
  await tx(async (client) => {
    const { rows } = await client.query<PaymentContext>(
      \`SELECT p.id, p.status, p.invoice_id, p.attempt, i.subscription_id, i.kind, i.total_kopecks
         FROM payments p JOIN invoices i ON i.id = p.invoice_id
        WHERE p.provider_payment_id = $1
        FOR UPDATE OF p, i\`,
      [payment.id],
    );
    const row = rows[0];
    if (!row || row.status !== 'pending') return; // уже обработано — повтор вебхука, спокойно выходим

    if (payment.status === 'succeeded') {
      if (toKopecks(payment.amount.value) !== row.total_kopecks) {
        throw new Error('amount mismatch for payment ' + payment.id); // откат, попытка остаётся pending — разберёт человек
      }
      await client.query("UPDATE payments SET status = 'succeeded' WHERE id = $1", [row.id]);
      await client.query("UPDATE invoices SET status = 'paid', paid_at = now() WHERE id = $1", [row.invoice_id]);
      if (row.kind === 'renewal') {
        // Даты периода уже стоят по счёту (шаг первый) — здесь только статус: trialing / past_due → active.
        // Заплатили 17-го за период с 15-го — период всё равно с 15-го
        await client.query(
          \`UPDATE subscriptions SET status = 'active', grace_ends_at = NULL
            WHERE id = $1 AND status IN ('trialing', 'active', 'past_due')\`,
          [row.subscription_id],
        );
      } else if (row.kind === 'proration') {
        await applyPaidChange(client, row.invoice_id); // доплата прошла — теперь добавляем место или меняем тариф
      }
      await enqueue(client, 'email.payment_succeeded', { invoiceId: row.invoice_id });
    } else {
      const reason = payment.cancellation_details?.reason ?? 'unknown';
      await client.query("UPDATE payments SET status = 'canceled', failure_reason = $2 WHERE id = $1", [row.id, reason]);
      await onPaymentFailed(client, row, reason); // льготный период и лестница — следующий раздел
    }
  });
}

// ═══ 4. СВЕРКА: ЗАВИСШИЕ ПОПЫТКИ — РАЗ В ЧАС ═══
export async function reconcileStuckPayments(): Promise<void> {
  const { rows } = await pool.query<{ invoice_id: string; provider_payment_id: string | null; created_at: Date }>(
    \`SELECT invoice_id, provider_payment_id, created_at FROM payments
      WHERE status = 'pending' AND created_at < now() - interval '30 minutes'
      ORDER BY created_at
      LIMIT 200\`,
  );
  for (const stuck of rows) {
    if (stuck.provider_payment_id) {
      // id платежа известен — просто спрашиваем статус у ЮKassa
      const payment = await yookassa<YooPayment>('GET', '/payments/' + encodeURIComponent(stuck.provider_payment_id));
      await applyPaymentResult(payment);
    } else {
      // Ответа не было вовсе: повторяем ИСХОДНЫЙ запрос с ТЕМ ЖЕ ключом и тем же телом
      // (сумма и способ оплаты записаны в попытке). Ключ живёт у ЮKassa 24 часа — старше суток
      // такую попытку автомат не трогает, её показывают человеку
      await retrySameRequest(stuck.invoice_id);
    }
  }
}

// ═══ КАК НЕ НАДО ═══
// cron('0 3 * * *', renewAll) — «он же запускается один раз»            // [!error] запустится дважды при выкладке
// headers: { 'Idempotence-Key': randomUUID() } — новый ключ на каждый повтор // [!error] тайм-аут = второе списание
// SET current_period_end = now() + interval '1 month' — от дня оплаты      // [!error] продление уползает
// if (payment.status === 'succeeded') giveAccess(); — без проверки «уже»   // [!error] повтор вебхука
`;

  protected readonly dunning = `
// ═══ 1. МЯГКИЕ И ЖЁСТКИЕ ОТКАЗЫ ═══
import type pg from 'pg';
import { pool, tx, enqueue } from './db';
import { chargeInvoice } from './renewal';
import { getEntitlements, suspendOverLimit } from './entitlements';

// Жёсткие: повторять бессмысленно, нужна новая карта. Остальные считаем мягкими
const HARD_DECLINES = new Set([
  'card_expired',
  'permission_revoked',
  'payment_method_restricted',
  'fraud_suspected',
  'invalid_card_number',
  'country_forbidden',
]);
const GRACE_DAYS = 7;
const RETRY_DAYS = [3, 5]; // попытка № 2 — с 3-го дня, № 3 — с 5-го; больше не пытаемся

type FailedPayment = { invoice_id: string; subscription_id: string; kind: string; attempt: number };

// ═══ 2. СПИСАНИЕ НЕ ПРОШЛО ═══
export async function onPaymentFailed(client: pg.PoolClient, row: FailedPayment, reason: string): Promise<void> {
  if (row.kind !== 'renewal') {
    // Доплата или пакет: клиент у экрана — льготного периода нет. Счёт аннулируем,
    // изменение не применяем, интерфейс покажет «не удалось, попробуйте другую карту»
    await client.query("UPDATE invoices SET status = 'void' WHERE id = $1 AND status = 'open'", [row.invoice_id]);
    return;
  }
  if (reason === 'permission_revoked') {
    // Клиент отозвал разрешение в своём банке — этот способ оплаты больше не используем
    await client.query(
      \`UPDATE payment_methods SET deleted_at = now(), is_default = false
        WHERE id = (SELECT payment_method_id FROM payments WHERE invoice_id = $1 ORDER BY attempt DESC LIMIT 1)\`,
      [row.invoice_id],
    );
  }
  // Первый отказ начинает льготный период; повторные отказы его НЕ продлевают (coalesce)
  await client.query(
    \`UPDATE subscriptions
        SET status = 'past_due',
            grace_ends_at = coalesce(grace_ends_at, now() + make_interval(days => $2))
      WHERE id = $1 AND status IN ('trialing', 'active', 'past_due')\`,
    [row.subscription_id, GRACE_DAYS],
  );
  // Письмо владельцу — после первой и после последней попытки, а не после каждой
  if (row.attempt === 1 || row.attempt === RETRY_DAYS.length + 1) {
    await enqueue(client, 'email.payment_failed', {
      invoiceId: row.invoice_id,
      reason,                          // шаблон превратит 'card_expired' в «у карты •• 4417 закончился срок»
      hard: HARD_DECLINES.has(reason), // жёсткий — «обновите карту», мягкий — «попробуем ещё раз 18 ноября»
    });
  }
}

// ═══ 3. ЛЕСТНИЦА: ПЛАНИРОВЩИК РАЗ В ЧАС ═══
type PastDue = {
  subscription_id: string;
  invoice_id: string;
  collection: 'autopay' | 'bank_transfer';
  grace_over: boolean;
  days_since_first: number | null;
  attempts: number;
  last_reason: string | null;
  in_flight: boolean;
};

export async function dunningTick(): Promise<void> {
  // Время считает база (now()), а не часы сервера приложения.
  // LEFT JOIN: у счетов «по безналу» попыток списания нет, но льготный период кончается и у них
  const { rows } = await pool.query<PastDue>(
    \`SELECT s.id AS subscription_id, i.id AS invoice_id, i.collection,
            now() >= s.grace_ends_at AS grace_over,
            (extract(epoch FROM now() - min(p.created_at)) / 86400)::float8 AS days_since_first, -- ::float8 — число, а не строка
            count(p.id)::int AS attempts,
            (array_agg(p.failure_reason ORDER BY p.attempt DESC))[1] AS last_reason,
            coalesce(bool_or(p.status = 'pending'), false) AS in_flight
       FROM subscriptions s
       JOIN invoices i ON i.subscription_id = s.id AND i.kind = 'renewal' AND i.status = 'open'
       LEFT JOIN payments p ON p.invoice_id = i.id
      WHERE s.status = 'past_due'
      GROUP BY s.id, i.id, i.collection, s.grace_ends_at\`,
  );
  for (const row of rows) {
    if (row.in_flight) continue;                    // попытка в полёте — ждём её результат
    if (row.grace_over) {
      await endForNonPayment(row.subscription_id, row.invoice_id);
      continue;
    }
    if (row.collection === 'bank_transfer' || row.days_since_first === null) continue; // по безналу не списываем — только письма
    if (row.last_reason && HARD_DECLINES.has(row.last_reason)) continue; // ждём новую карту, банк не дёргаем
    // Сколько попыток уже «положено» к этому дню: 1 сразу, +1 с 3-го дня, +1 с 5-го
    const due = 1 + RETRY_DAYS.filter((day) => row.days_since_first >= day).length;
    if (row.attempts < due) await chargeInvoice(row.invoice_id);
  }
}

// ═══ 4. НОВАЯ КАРТА — СРАЗУ ПОПЫТКА, НЕ ЖДЁМ СТУПЕНИ ═══
export async function onPaymentMethodAdded(organizationId: string): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    \`SELECT i.id FROM invoices i
       JOIN subscriptions s ON s.id = i.subscription_id
      WHERE s.organization_id = $1 AND s.status = 'past_due'
        AND i.kind = 'renewal' AND i.status = 'open'\`,
    [organizationId],
  );
  for (const invoice of rows) await chargeInvoice(invoice.id); // сам не создаст попытку, если одна в полёте
}

// ═══ 5. ЛЬГОТНЫЙ ПЕРИОД КОНЧИЛСЯ ═══
async function endForNonPayment(subscriptionId: string, invoiceId: string): Promise<void> {
  await tx(async (client) => {
    // Условие в UPDATE — последняя проверка: вдруг клиент оплатил минуту назад
    const { rows } = await client.query<{ organization_id: string; plan_version_id: string; seats: number }>(
      \`UPDATE subscriptions
          SET status = 'canceled', ended_at = now(), ended_reason = 'unpaid', grace_ends_at = NULL
        WHERE id = $1 AND status = 'past_due' AND grace_ends_at <= now()
          AND NOT EXISTS (SELECT 1 FROM payments WHERE invoice_id = $2 AND status = 'pending')
       RETURNING organization_id, plan_version_id, seats\`,
      [subscriptionId, invoiceId],
    );
    const ended = rows[0];
    if (!ended) return;
    // Счёт не удаляем: он остаётся в истории как «безнадёжный» — пригодится для метрик и разговора с клиентом
    await client.query("UPDATE invoices SET status = 'uncollectible' WHERE id = $1 AND status = 'open'", [invoiceId]);
    const free = getEntitlements(
      { status: 'canceled', planVersionId: ended.plan_version_id, seats: ended.seats, extraAiSuggestions: 0 },
      null,
    );
    await suspendOverLimit(client, ended.organization_id, free); // лишнее — на паузу, данные целы
    await enqueue(client, 'email.subscription_ended_unpaid', { subscriptionId });
  });
}

// ═══ 6. ПРЕДУПРЕЖДАЮЩИЙ ДАННИНГ — РАЗ В СУТКИ ═══
// Карты, срок которых кончается в следующем месяце, а письмо ещё не отправляли:
//   UPDATE payment_methods SET expiry_warning_sent_at = now()
//    WHERE deleted_at IS NULL AND is_default AND expiry_warning_sent_at IS NULL
//      AND make_date(card_expiry_year, card_expiry_month, 1) = date_trunc('month', now() + interval '1 month')::date
//   RETURNING organization_id, card_last4   → письмо «карта •• 4417 действует до конца ноября»

// ═══ КАК НЕ НАДО ═══
// setInterval(() => chargeInvoice(id), 60 * 60 * 1000);           // [!error] каждый час по одной карте
// if (reason === 'card_expired') await chargeInvoice(id);          // [!error] повтор жёсткого отказа
// UPDATE subscriptions SET status = 'canceled' — сразу при отказе  // [!error] без льготного периода
// DELETE FROM conversations WHERE organization_id = $1 — не оплатили // [!error] данные клиента — не залог
`;

  protected readonly proration = `
// ═══ 1. ОДНО ПРАВИЛО ПЕРЕРАСЧЁТА НА ВЕСЬ СЕРВИС ═══
import type pg from 'pg';
import { daysBetween } from './billing-periods';

const DAY_MS = 86_400_000;

export function remainingDays(periodStart: Date, periodEnd: Date, at: Date): { remaining: number; total: number } {
  const total = daysBetween(periodStart, periodEnd); // 15.10 → 15.11 = 31 день — настоящая длина периода
  // Неполный сегодняшний день считаем полным: изменение 20-го — платим и за 20-е
  const raw = Math.ceil((periodEnd.getTime() - at.getTime()) / DAY_MS);
  return { remaining: Math.min(Math.max(raw, 0), total), total };
}

// Сумма за часть периода: всё в копейках, ОДНО округление в самом конце
export function prorate(fullPeriodKopecks: number, remaining: number, total: number): number {
  return Math.round((fullPeriodKopecks * remaining) / total);
}
// prorate(79_000, 26, 31)                  →  66 258  (662,58 ₽: +1 место 20 октября)
// prorate(4 * (149_000 - 79_000), 20, 30)  → 186 667  (1 866,67 ₽: «Бизнес» с 25 ноября)

// ═══ 2. ПРЕДПРОСМОТР: СУММА ДО ПОДТВЕРЖДЕНИЯ ═══
type SubscriptionForChange = {
  periodStart: Date;
  periodEnd: Date;
  seats: number;
  members: number;                // сколько людей уже в организации — ниже нельзя
  scheduledSeats: number | null;  // запланировано «с нового периода — столько мест»
  pricePerSeatKopecks: number;
  interval: 'month' | 'year';
};
type Plan = { id: string; title: string; pricePerSeatKopecks: number; interval: 'month' | 'year' };

export type Change =
  | { kind: 'add_seats'; count: number }
  | { kind: 'remove_seats'; count: number }
  | { kind: 'change_plan'; to: Plan };

export type Preview =
  | { ok: false; message: string }
  | {
      ok: true;
      effective: 'now' | 'next_period';
      chargeNowKopecks: number;       // показываем ДО кнопки «подтвердить»
      lineQuantity: number;           // для строки счёта: количество × цена = сумма
      lineUnitPriceKopecks: number;
      description: string;
    };

export function previewChange(sub: SubscriptionForChange, change: Change, at: Date): Preview {
  const { remaining, total } = remainingDays(sub.periodStart, sub.periodEnd, at);
  const days = \`\${remaining} дн. из \${total}\`;

  switch (change.kind) {
    case 'add_seats': {
      // Было запланировано уменьшение на следующий период? Сначала отменяем его — за эти места уже заплачено
      const scheduledCut = sub.scheduledSeats === null ? 0 : sub.seats - sub.scheduledSeats;
      const toPay = Math.max(change.count - scheduledCut, 0);
      // Цена ОДНОГО места за остаток, округлённая один раз; дальше — точное умножение на число мест
      const perSeat = prorate(sub.pricePerSeatKopecks, remaining, total);
      // Меньше суток до продления — не берём копеечную доплату, место войдёт в следующий счёт
      const charge = remaining <= 1 ? 0 : toPay * perSeat;
      return {
        ok: true,
        effective: 'now',
        chargeNowKopecks: charge,
        lineQuantity: toPay,
        lineUnitPriceKopecks: perSeat,
        description: \`Доплата за места: \${toPay}, остаток периода — \${days}\`,
      };
    }
    case 'remove_seats': {
      const next = sub.seats - change.count;
      if (next < sub.members) {
        return { ok: false, message: 'Сначала удалите участников: мест не может быть меньше, чем людей в команде.' };
      }
      // Уменьшение — с нового периода, без возврата: за текущий период уже заплачено
      return { ok: true, effective: 'next_period', chargeNowKopecks: 0, lineQuantity: 0, lineUnitPriceKopecks: 0, description: \`С нового периода — \${next} мест\` };
    }
    case 'change_plan': {
      const diff = change.to.pricePerSeatKopecks - sub.pricePerSeatKopecks;
      if (diff <= 0 || change.to.interval !== sub.interval) {
        // Дешевле или другой интервал (месяц ↔ год) — с начала следующего периода
        return { ok: true, effective: 'next_period', chargeNowKopecks: 0, lineQuantity: 0, lineUnitPriceKopecks: 0, description: \`С нового периода — тариф «\${change.to.title}»\` };
      }
      // Дороже — сразу; разница цен за все места, ОДНО округление на всю сумму, поэтому строка — одна штука
      const charge = prorate(sub.seats * diff, remaining, total);
      return {
        ok: true,
        effective: 'now',
        chargeNowKopecks: charge,
        lineQuantity: 1,
        lineUnitPriceKopecks: charge,
        description: \`Переход на тариф «\${change.to.title}», мест: \${sub.seats}, \${days}\`,
      };
    }
  }
}

// ═══ 3. ПРИМЕНИТЬ: СНАЧАЛА ДЕНЬГИ, ПОТОМ ИЗМЕНЕНИЕ ═══
// expectedKopecks — сумма, которую клиент ВИДЕЛ в окне. Пересчитали на сервере, не совпало
// (за минуту между показом и нажатием кто-то из команды тоже что-то поменял) — покажем окно заново
export async function confirmChange(
  client: pg.PoolClient,
  ctx: { subscriptionId: string; organizationId: string; sub: SubscriptionForChange },
  change: Change,
  expectedKopecks: number,
): Promise<'charged' | 'scheduled' | 'applied_free' | 'amount_changed'> {
  const preview = previewChange(ctx.sub, change, new Date());
  if (!preview.ok) throw new Error(preview.message);
  if (preview.chargeNowKopecks !== expectedKopecks) return 'amount_changed';

  if (preview.effective === 'next_period') {
    // Запланированное изменение — поле в подписке; применит планировщик при выставлении счёта
    if (change.kind === 'remove_seats') {
      await client.query('UPDATE subscriptions SET scheduled_seats = seats - $2 WHERE id = $1', [ctx.subscriptionId, change.count]);
    } else if (change.kind === 'change_plan') {
      await client.query('UPDATE subscriptions SET scheduled_plan_version_id = $2 WHERE id = $1', [ctx.subscriptionId, change.to.id]);
    }
    return 'scheduled';
  }

  if (preview.chargeNowKopecks === 0) {
    // Платить нечего (отменили запланированное уменьшение или до продления меньше суток) — применяем сразу
    await applyChange(client, ctx.subscriptionId, change);
    return 'applied_free';
  }

  // Счёт-доплата: что применить после оплаты, записано в самом счёте (столбец change)
  const { rows } = await client.query<{ id: string }>(
    \`INSERT INTO invoices (number, organization_id, subscription_id, kind, period_start, period_end,
                           total_kopecks, status, collection, due_at, change)
     VALUES (next_invoice_number(), $1, $2, 'proration', now(), $3, $4, 'open', 'autopay', now(), $5)
     RETURNING id\`,
    [ctx.organizationId, ctx.subscriptionId, ctx.sub.periodEnd, preview.chargeNowKopecks, JSON.stringify(change)],
  );
  await client.query(
    'INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price_kopecks, amount_kopecks) VALUES ($1, $2, $3, $4, $5)',
    [rows[0].id, preview.description, preview.lineQuantity, preview.lineUnitPriceKopecks, preview.chargeNowKopecks],
  );
  // Списание — сразу после COMMIT (chargeInvoice из раздела о продлении); клиент ждёт ответа на экране.
  // Не прошло — счёт аннулируется, изменения нет, клиент видит «попробуйте другую карту»
  return 'charged';
}

// Вызывается из applyPaymentResult, когда доплата прошла
export async function applyPaidChange(client: pg.PoolClient, invoiceId: string): Promise<void> {
  const { rows } = await client.query<{ subscription_id: string; change: Change }>(
    'SELECT subscription_id, change FROM invoices WHERE id = $1',
    [invoiceId],
  );
  await applyChange(client, rows[0].subscription_id, rows[0].change);
}

async function applyChange(client: pg.PoolClient, subscriptionId: string, change: Change): Promise<void> {
  if (change.kind === 'add_seats') {
    // Добавление «съедает» запланированное уменьшение: было 4 → запланировано 3 → добавили 1 → снова 4 без доплаты
    await client.query(
      \`UPDATE subscriptions
          SET seats = seats + greatest($2 - (seats - coalesce(scheduled_seats, seats)), 0),
              scheduled_seats = CASE WHEN scheduled_seats IS NULL THEN NULL
                                     WHEN scheduled_seats + $2 >= seats THEN NULL
                                     ELSE scheduled_seats + $2 END
        WHERE id = $1\`,
      [subscriptionId, change.count],
    );
  } else if (change.kind === 'change_plan') {
    await client.query('UPDATE subscriptions SET plan_version_id = $2, scheduled_plan_version_id = NULL WHERE id = $1', [subscriptionId, change.to.id]);
  }
  await client.query(
    "INSERT INTO subscription_events (subscription_id, kind, data, actor) VALUES ($1, 'changed', $2, 'user')",
    [subscriptionId, JSON.stringify(change)],
  );
}

// ═══ КАК НЕ НАДО ═══
// const perDay = Math.round(79_000 / 30); const charge = perDay * remaining;   // [!error] «30 дней» и два округления
// const charge = 790 * 26 / 31;                                                 // [!error] рубли дробным числом
// await addSeat(); await charge();                                              // [!error] сначала дали, потом попросили
// списали по сумме из запроса браузера                                         // [!error] сумму считает сервер
`;

  protected readonly bankTransfer = `
// ═══ 1. НОМЕР СЧЁТА: OTK-2026-000231 ═══
// Последовательность выдаёт каждое число ровно один раз, даже при одновременных счетах:
//   CREATE SEQUENCE invoice_number_seq;
//   CREATE FUNCTION next_invoice_number() RETURNS text LANGUAGE sql AS $$
//     SELECT 'OTK-' || to_char(now() AT TIME ZONE 'Europe/Moscow', 'YYYY')
//            || '-' || lpad(nextval('invoice_number_seq')::text, 6, '0')
//   $$;
import type pg from 'pg';
import { enqueue } from './db';

export async function nextInvoiceNumber(client: pg.PoolClient): Promise<string> {
  const { rows } = await client.query<{ number: string }>('SELECT next_invoice_number() AS number');
  return rows[0].number;
}

// ═══ 2. РЕКВИЗИТЫ ПОКУПАТЕЛЯ ПО ИНН ═══
type Company = { inn: string; kpp: string | null; name: string; address: string };

// Контрольные цифры ИНН: опечатку ловим сразу, до запроса к сервису подсказок
export function isValidInn(inn: string): boolean {
  if (!/^(\\d{10}|\\d{12})$/.test(inn)) return false;
  const digits = [...inn].map(Number);
  const check = (weights: number[]) => (weights.reduce((sum, weight, i) => sum + weight * digits[i], 0) % 11) % 10;
  if (digits.length === 10) return check([2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[9]; // организация
  return (
    check([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[10] && // предприниматель: две контрольные цифры
    check([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[11]
  );
}

// Название, КПП и адрес по ИНН — через сервис подсказок (например, DaData).
// Владелец только проверяет: двадцать полей вручную — это двадцать мест для опечатки
declare function lookupCompanyByInn(inn: string): Promise<Company | null>;

// ═══ 3. СЧЁТ НА ОПЛАТУ: ВСЁ, ЧТО ПОПАДЁТ В PDF ═══
type BankDetails = {
  name: string;                 // ООО «Отклик»
  inn: string;
  kpp: string;
  account: string;              // расчётный счёт
  bankName: string;
  bik: string;
  correspondentAccount: string;
};

export type BankInvoiceDocument = {
  number: string;               // OTK-2026-000231
  issuedAt: string;             // 05.11.2026
  dueAt: string;                // 25.11.2026 — срок оплаты с запасом
  supplier: BankDetails;        // реквизиты «Отклика» — из настроек, не из кода
  buyer: Company;
  lines: { description: string; quantity: number; unit: string; priceKopecks: number; amountKopecks: number }[];
  totalKopecks: number;
  vatNote: string;              // «Без НДС (упрощённая система налогообложения)» — текст выбирает бухгалтер
  paymentPurpose: string;       // назначение платежа: бухгалтер клиента скопирует его в платёжное поручение
};

export function buildPaymentPurpose(invoiceNumber: string, vatNote: string): string {
  // Номер счёта — В НАЧАЛЕ: длинное назначение банк может обрезать, и номер потеряется
  return \`Оплата по счёту \${invoiceNumber} за доступ к сервису «Отклик». \${vatNote}\`;
}
// → «Оплата по счёту OTK-2026-000231 за доступ к сервису «Отклик». Без НДС»
// Строка счёта «Пикселя»: «Доступ к сервису „Отклик“, тариф „Бизнес“, место оператора,
//   15.11.2026–15.11.2027» · 12 × 14 304,00 = 171 648,00 ₽

// ═══ 4. ВЫСТАВИТЬ ЗАРАНЕЕ, СРОК — С ЗАПАСОМ ═══
const ISSUE_DAYS_BEFORE = 10;     // счёт за следующий период — за 10 дней до конца текущего
const DUE_DAYS_AFTER_START = 10;  // оплатить — в течение 10 дней после начала периода; доступ всё это время есть

export async function issueUpcomingBankInvoices(client: pg.PoolClient): Promise<void> {
  const { rows } = await client.query<{ id: string; organization_id: string; current_period_end: Date }>(
    \`SELECT s.id, s.organization_id, s.current_period_end
       FROM subscriptions s
       JOIN billing_profiles bp ON bp.organization_id = s.organization_id AND bp.collection = 'bank_transfer'
      WHERE s.status = 'active' AND NOT s.cancel_at_period_end
        AND s.current_period_end <= now() + make_interval(days => $1)
        AND NOT EXISTS (SELECT 1 FROM invoices i
                         WHERE i.subscription_id = s.id AND i.kind = 'renewal'
                           AND i.period_start = s.current_period_end)
      FOR UPDATE OF s SKIP LOCKED\`,
    [ISSUE_DAYS_BEFORE],
  );
  for (const sub of rows) {
    // Тот же счёт за следующий период, что и для карт, но collection = 'bank_transfer' и срок
    // «начало периода + 10 дней». Когда наступит день продления, планировщик увидит, что счёт за
    // этот период уже есть (уникальный индекс), и второй не выставит; списания по карте не будет
    await createBankRenewalInvoice(client, sub, DUE_DAYS_AFTER_START);
    await enqueue(client, 'email.bank_invoice_issued', { subscriptionId: sub.id }); // владельцу и бухгалтеру, PDF во вложении
  }
}

// ═══ 5. ВЫПИСКА БАНКА → КАКОЙ СЧЁТ ОПЛАЧЕН ═══
export type StatementLine = {
  bankLineId: string;   // уникальный id операции из выписки — повторная загрузка выписки безопасна
  amountKopecks: number;
  payerInn: string;
  payerName: string;
  purpose: string;      // назначение платежа, как его написал бухгалтер клиента
};

const INVOICE_NUMBER = /OTK-\\d{4}-\\d{6}/g;

type MatchResult = 'matched' | 'duplicate' | 'manual';

export async function matchStatementLine(client: pg.PoolClient, line: StatementLine): Promise<MatchResult> {
  const fresh = await client.query(
    \`INSERT INTO bank_statement_lines (bank_line_id, amount_kopecks, payer_inn, payer_name, purpose, status)
     VALUES ($1, $2, $3, $4, $5, 'new')
     ON CONFLICT (bank_line_id) DO NOTHING\`,
    [line.bankLineId, line.amountKopecks, line.payerInn, line.payerName, line.purpose],
  );
  if (fresh.rowCount === 0) return 'duplicate'; // эту операцию уже разбирали

  // Ищем номер счёта; опечатка в регистре («otk-…») не помеха
  const numbers = [...new Set(line.purpose.toUpperCase().match(INVOICE_NUMBER) ?? [])];
  if (numbers.length !== 1) {
    return toManual(client, line.bankLineId, numbers.length === 0 ? 'no_invoice_number' : 'several_invoice_numbers');
  }

  const { rows } = await client.query<{ id: string; subscription_id: string; total_kopecks: number; status: string; inn: string }>(
    \`SELECT i.id, i.subscription_id, i.total_kopecks, i.status, bp.inn
       FROM invoices i
       JOIN billing_profiles bp ON bp.organization_id = i.organization_id
      WHERE i.number = $1
      FOR UPDATE OF i\`,
    [numbers[0]],
  );
  const invoice = rows[0];
  // Автомат НЕ гадает: любое несовпадение — человеку
  if (!invoice) return toManual(client, line.bankLineId, 'unknown_invoice');
  if (invoice.status !== 'open') return toManual(client, line.bankLineId, 'invoice_not_open'); // уже оплачен — двойная оплата?
  if (invoice.total_kopecks !== line.amountKopecks) return toManual(client, line.bankLineId, 'amount_mismatch'); // частичная или переплата
  if (invoice.inn !== line.payerInn) return toManual(client, line.bankLineId, 'payer_mismatch'); // заплатила другая компания

  // Совпало всё: номер, сумма, ИНН
  await client.query("UPDATE invoices SET status = 'paid', paid_at = now() WHERE id = $1", [invoice.id]);
  await client.query(
    "UPDATE bank_statement_lines SET status = 'matched', invoice_id = $2 WHERE bank_line_id = $1",
    [line.bankLineId, invoice.id],
  );
  await client.query(
    \`UPDATE subscriptions SET status = 'active', grace_ends_at = NULL
      WHERE id = $1 AND status IN ('active', 'past_due')\`,
    [invoice.subscription_id],
  );
  await enqueue(client, 'email.bank_payment_received', { invoiceId: invoice.id });
  return 'matched';
}

async function toManual(client: pg.PoolClient, bankLineId: string, reason: string): Promise<MatchResult> {
  // Очередь «разобрать вручную» в админке: кнопки «отнести к счёту…» и «вернуть деньги»
  await client.query(
    "UPDATE bank_statement_lines SET status = 'manual', manual_reason = $2 WHERE bank_line_id = $1",
    [bankLineId, reason],
  );
  return 'manual';
}

// ═══ 6. СРОК ОПЛАТЫ ПРОШЁЛ ═══
export async function markOverdueBankInvoices(client: pg.PoolClient): Promise<void> {
  // Та же лестница, что для карт, только вместо повторов списания — письма владельцу и бухгалтеру
  await client.query(
    \`UPDATE subscriptions s
        SET status = 'past_due', grace_ends_at = now() + interval '7 days'
       FROM invoices i
      WHERE i.subscription_id = s.id AND i.kind = 'renewal' AND i.collection = 'bank_transfer'
        AND i.status = 'open' AND i.due_at < now() AND s.status = 'active'\`,
  );
}

// ═══ КАК НЕ НАДО ═══
// if (line.purpose.includes('Отклик')) markPaid(lastOpenInvoice);    // [!error] «примерно похоже» — не оплата
// UPDATE invoices SET total_kopecks = $2 WHERE number = $1             // [!error] выставленный счёт не правят
// status = 'past_due' в день выставления счёта                         // [!error] бухгалтерии нужно время
`;

  protected readonly receiptRenewal = `
// ═══ 1. 15 НОЯБРЯ: ПРОДЛЕНИЕ «ОБЖИГА», СЧЁТ OTK-2026-000188 ═══
// Комментарии — только для учебника: JSON их не допускает, в запрос уходит объект без них.
//
//   Доступ к «Отклику», тариф «Команда», место оператора   4 × 790,00 = 3 160,00 ₽
//                                                           итого    3 160,00 ₽ — ровно сумма списания
//
// «Отклик» — ООО на УСН с доходом меньше 20 млн ₽ в год, от НДС освобождён → vat_code 1.
// payment_mode и payment_subject — из настроек: их выбрал бухгалтер по тексту оферты.

// ═══ 2. POST /v3/payments — АВТОСПИСАНИЕ ВМЕСТЕ С ЧЕКОМ ═══
{
  "amount": { "value": "3160.00", "currency": "RUB" },
  "capture": true,
  "payment_method_id": "2d6f3a1c-000f-5000-9000-1b6c34a7e2f4",   // сохранённый способ — клиента никуда не ведём
  "description": "Автопродление «Отклика», счёт OTK-2026-000188",
  "metadata": { "invoiceId": "9b1e…" },
  "receipt": {
    "customer": {
      "email": "olga@obzhig.example"               // чек — владельцу на почту
    },
    "items": [
      {
        "description": "Доступ к сервису «Отклик», тариф «Команда», место оператора, 15.11–15.12.2026",
        "quantity": 4,                               // = quantity строки счёта
        "amount": { "value": "790.00", "currency": "RUB" },  // цена ЗА ОДНО место, а не 3 160 за строку
        "vat_code": 1,                               // «Без НДС»; если НДС появится — ставку меняет бухгалтер в настройках
        "payment_mode": "full_payment",              // «Полный расчёт» — частый выбор для доступа, который начался сразу;
                                                     //  если бухгалтер решит «предоплата 100%» — будет и второй чек
        "payment_subject": "service"                 // услуга; если оферта — лицензия: "intellectual_activity"
      }
    ]
  }
}

// ═══ 3. 20 ОКТЯБРЯ: ДОПЛАТА ЗА МЕСТО — ОТДЕЛЬНЫЙ ЧЕК ═══
{
  "receipt": {
    "customer": { "email": "olga@obzhig.example" },
    "items": [
      {
        "description": "Доплата за 1 место оператора, тариф «Команда», 20.10–15.11.2026 (26 дн. из 31)",
        "quantity": 1,
        "amount": { "value": "662.58", "currency": "RUB" },  // 790,00 × 26 ÷ 31, одно округление
        "vat_code": 1,
        "payment_mode": "full_payment",
        "payment_subject": "service"
      }
    ]
  }
}

// ═══ 4. ПРОВЕРКА, КОТОРУЮ ДЕЛАЕТ ЮKASSA (и должны делать ваши автотесты) ═══
//   Σ (quantity × amount) = 4 × 790.00 = 3160.00 = amount.value платежа → чек принят
//   Разница хоть в копейку — платёж не пройдёт: вот зачем CHECK (amount = quantity × unit_price) в строках счёта

// ═══ 5. ОПЛАТА ПО СЧЁТУ С РАСЧЁТНОГО СЧЁТА — ЧЕКА НЕТ ═══
// «Пиксель» заплатил 171 648,00 ₽ платёжным поручением: безналичный расчёт между организациями
// без карты — кассовый чек не нужен. Нужны счёт до оплаты и акт или УПД после периода:
//   акт № OTK-A-2026-000231 · «Доступ к сервису „Отклик“, тариф „Бизнес“, 12 мест, 15.11.2026–15.11.2027»
//   → PDF бухгалтеру на почту; когда подключим ЭДО — через оператора, с электронной подписью

// ═══ КАК НЕ НАДО ═══
// "amount": { "value": "3160.00" } при "quantity": 4        // [!error] цена за строку вместо цены за штуку
// "vat_code": 4                                             // [!error] 20% — основная ставка до 2026 года
// автосписание без receipt — «это же подписка, не покупка»  // [!error] автоплатёж — тоже расчёт
`;

  protected readonly cancel = `
// ═══ 1. ОТМЕНИТЬ: ФЛАЖОК «НЕ ПРОДЛЕВАТЬ» ═══
import { withTenant, type Tenant } from './tenant';
import { can } from './permissions';
import { enqueue } from './db';
import { yookassa, toValue } from './yookassa';
import { remainingDays, prorate } from './proration';

type CancelInput = { reason?: 'too_expensive' | 'few_questions' | 'switched_tool' | 'closed_store' | 'other'; comment?: string };
type CancelResult = { ok: true; accessUntil: Date | null } | { ok: false; reason: 'forbidden' | 'no_subscription' };

export async function cancelSubscription(tenant: Tenant, input: CancelInput): Promise<CancelResult> {
  if (!can(tenant, 'billing.manage')) return { ok: false, reason: 'forbidden' };
  return withTenant(tenant, async (client): Promise<CancelResult> => {
    const { rows } = await client.query<{ id: string; status: string; current_period_end: Date | null; trial_ends_at: Date | null }>(
      "SELECT id, status, current_period_end, trial_ends_at FROM subscriptions WHERE organization_id = $1 AND status <> 'canceled' FOR UPDATE",
      [tenant.organizationId],
    );
    const sub = rows[0];
    if (!sub) return { ok: false, reason: 'no_subscription' };

    let accessUntil: Date | null;
    if (sub.status === 'past_due') {
      // Текущий период не оплачен — заканчиваем сразу и счёт аннулируем: за отменённое деньги не берём
      await client.query(
        \`UPDATE subscriptions SET status = 'canceled', ended_at = now(), ended_reason = 'customer_request', grace_ends_at = NULL
          WHERE id = $1\`,
        [sub.id],
      );
      await client.query("UPDATE invoices SET status = 'void' WHERE subscription_id = $1 AND status = 'open'", [sub.id]);
      accessUntil = null;
    } else {
      // trialing и active: работаем до конца пробного или оплаченного периода, продления не будет.
      // Счёт по безналу, выставленный заранее на следующий период, аннулируем — платить за него не нужно
      await client.query('UPDATE subscriptions SET cancel_at_period_end = true WHERE id = $1', [sub.id]);
      await client.query(
        "UPDATE invoices SET status = 'void' WHERE subscription_id = $1 AND status = 'open' AND period_start >= $2",
        [sub.id, sub.current_period_end ?? sub.trial_ends_at],
      );
      accessUntil = sub.current_period_end ?? sub.trial_ends_at;
    }

    // Ответ «почему» — необязательный, но самый ценный результат отмены
    await client.query(
      'INSERT INTO cancellation_feedback (subscription_id, user_id, reason, comment) VALUES ($1, $2, $3, $4)',
      [sub.id, tenant.userId, input.reason ?? null, input.comment?.slice(0, 2000) ?? null],
    );
    await client.query(
      "INSERT INTO subscription_events (subscription_id, kind, actor) VALUES ($1, 'cancel_requested', $2)",
      [sub.id, 'user:' + tenant.userId],
    );
    // Служебное письмо — согласия на рассылку не требует: «подписка отменена, действует до 15 декабря»
    await enqueue(client, 'email.cancellation_confirmed', { subscriptionId: sub.id, accessUntil });
    return { ok: true, accessUntil };
  });
}
// Планировщик продлений (раздел «Продление по расписанию») видит cancel_at_period_end и в конце периода
// переводит подписку в canceled вместо нового счёта. Пробный период с флажком заканчивается без списания.
// В окне отмены — галочка «удалить и сохранённую карту»: отвязка способа оплаты из раздела об автоплатежах

// ═══ 2. ВОЗОБНОВИТЬ ДО КОНЦА ПЕРИОДА ═══
export async function resumeSubscription(tenant: Tenant): Promise<boolean> {
  if (!can(tenant, 'billing.manage')) return false;
  return withTenant(tenant, async (client) => {
    const { rowCount } = await client.query(
      \`UPDATE subscriptions SET cancel_at_period_end = false
        WHERE organization_id = $1 AND status IN ('trialing', 'active') AND cancel_at_period_end\`,
      [tenant.organizationId],
    );
    // Автопродлению нужен живой способ оплаты: отвязали карту — интерфейс сразу попросит привязать
    return (rowCount ?? 0) > 0;
  });
}

// ═══ 3. ВОЗВРАТ ЗА НЕИСПОЛЬЗОВАННОЕ — ПО ЗАЯВЛЕНИЮ, ЧЕРЕЗ ПОДДЕРЖКУ ═══
type PaidInvoice = {
  id: string;
  number: string;
  periodStart: Date;
  periodEnd: Date;
  totalKopecks: number;
  providerPaymentId: string; // успешный платёж по этому счёту
  customerEmail: string;
};

export async function refundUnused(invoice: PaidInvoice, at: Date): Promise<{ refundKopecks: number }> {
  // То же правило, что у перерасчёта: оставшиеся дни из настоящей длины периода, одно округление
  const { remaining, total } = remainingDays(invoice.periodStart, invoice.periodEnd, at);
  const refundKopecks = prorate(invoice.totalKopecks, remaining, total);
  if (refundKopecks === 0) return { refundKopecks };

  await yookassa(
    'POST',
    '/refunds',
    {
      payment_id: invoice.providerPaymentId, // возврат — к ИСХОДНОМУ платежу: так он свяжется с ним и с чеком
      amount: { value: toValue(refundKopecks), currency: 'RUB' },
      description: \`Возврат за неиспользованный период по счёту \${invoice.number}\`,
      // Частичный возврат — с данными для чека возврата («возврат прихода»)
      receipt: {
        customer: { email: invoice.customerEmail },
        items: [
          {
            description: \`Возврат: доступ к сервису «Отклик», \${remaining} дн. из \${total}\`,
            quantity: 1,
            amount: { value: toValue(refundKopecks), currency: 'RUB' },
            vat_code: 1,
            payment_mode: 'full_payment',
            payment_subject: 'service',
          },
        ],
      },
    },
    'refund:' + invoice.id, // один возврат на счёт: повторный запрос не вернёт деньги дважды
  );
  return { refundKopecks };
}
// Пример: годовая «Команда» на 4 места, 30 336 ₽ за 15.12.2026–15.12.2027 (365 дней),
// человек отказался 15.06.2027 — осталось 183 дня → 30 336 × 183 ÷ 365 = 15 209,56 ₽ к возврату

// ═══ КАК НЕ НАДО ═══
// UPDATE subscriptions SET status = 'canceled' — сразу у оплаченной       // [!error] оплаченный месяц пропал
// res.send('Для отмены позвоните в поддержку с 10 до 18')                 // [!error] отказ — электронно, в сервисе
// продлить, «потому что флажок проверим потом»                             // [!error] после отказа — ни рубля
// вернуть деньги переводом через банк-клиент                               // [!error] без связи с платежом и без чека
`;

  protected readonly billingEmails = `

═══ ПИСЬМА О ДЕНЬГАХ «ОТКЛИКА»: КОГДА, КОМУ, О ЧЁМ ═══

  когда                          кому                   о чём
  ─────────────────────────────────────────────────────────────────────────────
  за 3 дня до конца пробного     владельцу              «пробный период до 15 октября;
  и за сутки                                             карта есть — спишем 2 370 ₽;
                                                         нет — перейдёте на бесплатный»
  привязали карту                владельцу              «автопродление включено: 15-го
                                                         каждого месяца, 2 370 ₽; отключить —
                                                         в разделе „Оплата“»
  списание прошло                владельцу +            сумма, карта •• 4417, период,
                                 платёжной почте        чек во вложении, дата следующего
  доплата за место прошла        владельцу              «+1 место: 662,58 ₽ за 26 дней;
                                                         с 15 ноября — 3 160 ₽ в месяц»
  за 7 дней до ГОДОВОГО          владельцу +            «22 ноября спишем 30 336 ₽ за год
  списания                       платёжной почте         „Команды“ на 4 места; передумали —
                                                         отменить можно до 22-го»
  за месяц до конца срока        владельцу              «карта •• 4417 действует до конца
  карты                                                  ноября — обновите заранее»
  списание не прошло             владельцу +            причина человеческим языком,
  (1-я и последняя попытка)      платёжной почте        ПРЯМАЯ ссылка на смену карты,
                                                         «доступ сохранится до 22 ноября»
  за 2 дня до конца              владельцу +            «осталось 2 дня, потом бесплатный
  льготного периода              администраторам         тариф; данные сохранятся»
  подписка закончилась           владельцу              что изменилось, что сохранилось,
                                                         как вернуться в два клика
  отмена подтверждена            владельцу              «действует до 15 декабря;
                                                         возобновить — одна кнопка»
  счёт по безналу выставлен      платёжной почте +      PDF счёта, срок оплаты,
                                 владельцу               назначение платежа целиком
  оплата по счёту получена       платёжной почте        «спасибо, счёт OTK-… оплачен»
  акт или УПД за период          платёжной почте        PDF или «отправлен через ЭДО»


═══ ПРИМЕР: СПИСАНИЕ НЕ ПРОШЛО — 15 НОЯБРЯ ═══

  Тема:    «Отклик»: не удалось оплатить подписку «Обжига»

  Ольга, здравствуйте!

  Сегодня мы не смогли списать 3 160 ₽ за тариф «Команда» (4 места,
  15 ноября — 15 декабря): у карты •• 4417 закончился срок действия.

  Всё продолжает работать до 22 ноября. Чтобы ничего не прервалось,
  привяжите новую карту — мы сразу попробуем списать оплату:
  → https://app.otklik.example/obzhig/billing/payment-method

  Если вы хотите отменить подписку — это можно сделать там же.
  Вопросы — просто ответьте на это письмо.

  Команда «Отклика»


═══ ЧЕТЫРЕ ВОПРОСА, НА КОТОРЫЕ ОТВЕЧАЕТ КАЖДОЕ ПИСЬМО ═══

  что произошло        «не смогли списать», «списали», «спишем через 7 дней»
  на какую сумму       3 160 ₽ — числом, с копейками, если они есть
  за что               тариф, число мест, период с датами
  что делать дальше    одна главная ссылка — прямо на нужную страницу


═══ СЛУЖЕБНОЕ ИЛИ РЕКЛАМНОЕ ═══

  служебное — согласия не требует       рекламное — только с согласием
    «списали 3 160 ₽»                     «скидка 20 % на годовой тариф»
    «не удалось списать»                  «новая функция — попробуйте „Бизнес“»
    «подписка закончилась»                «возвращайтесь — первый месяц за 1 ₽»

  Добавили рекламный блок в служебное письмо — всё письмо стало рекламой.


═══ КАК НЕ НАДО ═══

  «Транзакция № 88213 завершена» с адреса noreply@                        [!error]
  годовое списание 30 336 ₽ без предупреждения                            [!error]
  «войдите в кабинет → Настройки → Биллинг → Способы оплаты»              [!error]
  письма о неудачном списании — всем двенадцати операторам               [!error]

  Как надо: адрес, на который можно ответить; предупреждение о крупном
  списании; прямая ссылка; письма о деньгах — владельцу и платёжной почте.
`;

  protected readonly usageMetering = `
// ═══ 1. ТАБЛИЦЫ ═══
// CREATE TABLE usage_counters (
//   organization_id uuid NOT NULL REFERENCES organizations (id),
//   metric          text NOT NULL,                -- 'ai_suggestions'
//   period_start    timestamptz NOT NULL,         -- начало периода подписки: новый период — новая строка
//   used            integer NOT NULL DEFAULT 0 CHECK (used >= 0),
//   PRIMARY KEY (organization_id, metric, period_start)
// );
// CREATE TABLE ai_suggestions (
//   id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id uuid NOT NULL REFERENCES organizations (id),
//   request_id      text NOT NULL,                -- идентификатор нажатия, создан в браузере
//   conversation_id uuid NOT NULL,
//   period_start    timestamptz NOT NULL,         -- из какого периода заняли единицу
//   status          text NOT NULL CHECK (status IN ('reserved', 'done', 'failed')),
//   text            text,
//   model           text,
//   input_tokens    integer,
//   output_tokens   integer,
//   created_at      timestamptz NOT NULL DEFAULT now(),
//   UNIQUE (organization_id, request_id)          -- повторное нажатие не создаст вторую подсказку
// );
import type pg from 'pg';
import { withTenant, type Tenant } from './tenant';
import { loadEntitlements } from './entitlements';
import { buildPrompt, llm } from './ai'; // клиент LLM API — любого провайдера (страница «LLM API: токены, цена, лимиты»)

const METRIC = 'ai_suggestions';

// ═══ 2. ЗАНЯТЬ ЕДИНИЦУ: ПРОВЕРКА И СПИСАНИЕ — ОДИН ЗАПРОС ═══
async function reserveUnit(client: pg.PoolClient, organizationId: string, periodStart: Date, limit: number): Promise<boolean> {
  // Строки за этот период ещё нет — создаём с нулём; второй раз не создастся
  await client.query(
    'INSERT INTO usage_counters (organization_id, metric, period_start) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [organizationId, METRIC, periodStart],
  );
  // База сама проверит лимит и увеличит счётчик за ОДИН шаг: при 299 из 300 пройдёт ровно один из двух
  const { rowCount } = await client.query(
    \`UPDATE usage_counters SET used = used + 1
      WHERE organization_id = $1 AND metric = $2 AND period_start = $3 AND used < $4\`,
    [organizationId, METRIC, periodStart, limit],
  );
  return rowCount === 1; // 0 строк — лимит исчерпан
}

async function releaseUnit(client: pg.PoolClient, organizationId: string, periodStart: Date): Promise<void> {
  await client.query(
    \`UPDATE usage_counters SET used = used - 1
      WHERE organization_id = $1 AND metric = $2 AND period_start = $3 AND used > 0\`,
    [organizationId, METRIC, periodStart],
  );
}

// ═══ 3. ПОДСКАЗКА ЦЕЛИКОМ: ЗАНЯТЬ → СПРОСИТЬ → ПОДТВЕРДИТЬ ИЛИ ВЕРНУТЬ ═══
type SuggestResult =
  | { ok: true; text: string; used: number; limit: number }
  | { ok: false; reason: 'limit_reached' | 'in_progress' | 'ai_unavailable' | 'not_in_plan' };

type Step1 =
  | { kind: 'done'; result: SuggestResult }
  | { kind: 'reserved'; suggestionId: string; periodStart: Date; limit: number };

export async function suggestReply(tenant: Tenant, conversationId: string, requestId: string): Promise<SuggestResult> {
  // Шаг 1 — короткая транзакция: повтор? есть ли в тарифе? хватает ли лимита? занять и записать «резерв»
  const step1 = await withTenant(tenant, async (client): Promise<Step1> => {
    const previous = await client.query<{ status: string; text: string | null }>(
      'SELECT status, text FROM ai_suggestions WHERE organization_id = $1 AND request_id = $2',
      [tenant.organizationId, requestId],
    );
    const repeat = previous.rows[0];
    if (repeat) {
      // Повторный запрос того же нажатия: вторую единицу НЕ списываем
      if (repeat.status === 'done' && repeat.text) return { kind: 'done', result: { ok: true, text: repeat.text, used: -1, limit: -1 } };
      return { kind: 'done', result: { ok: false, reason: repeat.status === 'reserved' ? 'in_progress' : 'ai_unavailable' } };
    }
    const ent = await loadEntitlements(client, tenant.organizationId, { lock: false });
    const limit = ent.limits.aiSuggestionsPerPeriod;
    if (limit === 0) return { kind: 'done', result: { ok: false, reason: 'not_in_plan' } };

    // loadEntitlements отдаёт и начало текущего периода подписки;
    // у бесплатного тарифа периода нет — там начало календарного месяца
    const periodStart = ent.periodStart;
    if (!(await reserveUnit(client, tenant.organizationId, periodStart, limit))) {
      return { kind: 'done', result: { ok: false, reason: 'limit_reached' } };
    }
    const { rows } = await client.query<{ id: string }>(
      \`INSERT INTO ai_suggestions (organization_id, request_id, conversation_id, period_start, status)
       VALUES ($1, $2, $3, $4, 'reserved') RETURNING id\`,
      [tenant.organizationId, requestId, conversationId, periodStart],
    );
    return { kind: 'reserved', suggestionId: rows[0].id, periodStart, limit };
  });
  if (step1.kind === 'done') return step1.result;

  // Шаг 2 — запрос к нейросети ВНЕ транзакции: он идёт секунды, держать блокировки так долго нельзя
  try {
    // В подсказку — только СВОЯ переписка и СВОЯ база знаний (стены из раздела о мультитенантности)
    const prompt = await buildPrompt(tenant, conversationId);
    const answer = await llm.generate(prompt, { timeoutMs: 20_000 });
    const used = await withTenant(tenant, async (client) => {
      await client.query(
        \`UPDATE ai_suggestions SET status = 'done', text = $2, model = $3, input_tokens = $4, output_tokens = $5
          WHERE id = $1 AND status = 'reserved'\`,
        [step1.suggestionId, answer.text, answer.model, answer.inputTokens, answer.outputTokens],
      );
      const counter = await client.query<{ used: number }>(
        'SELECT used FROM usage_counters WHERE organization_id = $1 AND metric = $2 AND period_start = $3',
        [tenant.organizationId, METRIC, step1.periodStart],
      );
      return counter.rows[0].used;
    });
    return { ok: true, text: answer.text, used, limit: step1.limit };
  } catch (err) {
    // Шаг 3 — подсказки не было: возвращаем единицу. Условие status = 'reserved' не даст вернуть дважды
    await withTenant(tenant, async (client) => {
      const { rowCount } = await client.query(
        "UPDATE ai_suggestions SET status = 'failed' WHERE id = $1 AND status = 'reserved'",
        [step1.suggestionId],
      );
      if (rowCount === 1) await releaseUnit(client, tenant.organizationId, step1.periodStart);
    });
    console.warn('ai suggestion failed', { organizationId: tenant.organizationId, err }); // без текста переписки в логе
    return { ok: false, reason: 'ai_unavailable' };
  }
}
// Сервер упал между шагами 1 и 3 — резерв повис. Уборщик раз в 5 минут:
//   резервы старше 5 минут → status = 'failed' и releaseUnit — тем же условием «только если reserved»

// ═══ 4. СКОЛЬКО ОСТАЛОСЬ: ПРЕДУПРЕЖДЕНИЯ НА 80 % И 100 % ═══
export function usageBanner(used: number, limit: number): string | null {
  if (limit === 0) return null;
  if (used >= limit) {
    return \`ИИ-подсказки на этот период закончились: \${used} из \${limit}. Купите пакет +500 за 490 ₽ или дождитесь нового периода.\`;
  }
  if (used >= limit * 0.8) return \`Использовано \${used} из \${limit} ИИ-подсказок.\`;
  return null;
}

// ═══ 5. ВО ЧТО НАМ ОБХОДИТСЯ КАЖДАЯ ОРГАНИЗАЦИЯ — РАЗ В МЕСЯЦ ═══
//   SELECT organization_id, count(*) AS suggestions,
//          sum(input_tokens) AS input_tokens, sum(output_tokens) AS output_tokens
//     FROM ai_suggestions
//    WHERE status = 'done'
//      AND created_at >= date_trunc('month', now()) - interval '1 month'
//      AND created_at <  date_trunc('month', now())
//    GROUP BY organization_id
//    ORDER BY sum(input_tokens + output_tokens) DESC
//    LIMIT 20;
// → умножаем на цены провайдера за миллион токенов и сравниваем с выручкой от организации

// ═══ КАК НЕ НАДО ═══
// const counters = new Map<string, number>(); counters.set(orgId, used + 1);   // [!error] перезапуск — и всё обнулилось
// if (used < limit) { await llm.generate(…); await increment(); }             // [!error] гонка: 301 из 300
// единицу не вернули после тайм-аута нейросети                               // [!error] клиент платит за ничего
// в подсказку подмешали примеры ответов другой организации                   // [!error] утечка через нейросеть
`;

  protected readonly billingPage = `
<!-- ═══ 1. СТРАНИЦА ЦЕЛИКОМ: ШЕСТЬ БЛОКОВ ═══ -->
<!-- Все суммы и даты пришли с сервера уже посчитанными; браузер ничего не вычисляет, только показывает -->
<main class="billing" aria-labelledby="billing-title">
  <h1 id="billing-title">Оплата и тариф</h1>

  <!-- ═══ 2. ТАРИФ И МЕСТА ═══ -->
  <section class="card" aria-labelledby="plan-title">
    <h2 id="plan-title">Тариф «Команда»</h2>
    <p>4 места, занято 4 · 790 ₽ за место в месяц</p>
    <button type="button" data-action="change-plan">Изменить тариф</button>
    <button type="button" data-action="add-seats">Добавить место</button>
  </section>

  <!-- ═══ 3. СЛЕДУЮЩЕЕ СПИСАНИЕ — С УЧЁТОМ ЗАПЛАНИРОВАННОГО ═══ -->
  <section class="card" aria-labelledby="next-title">
    <h2 id="next-title">Следующее списание</h2>
    <p>
      <time datetime="2026-12-15T09:40:00Z">15 декабря в 12:40 по Москве</time> —
      <strong>3 160,00 ₽</strong> с карты •• 4417
    </p>
    <!-- если запланировано уменьшение: «с 15 декабря — 3 места, 2 370,00 ₽» -->
    <!-- если стоит флажок отмены: «подписка действует до 15 декабря» и кнопка «Возобновить» -->
  </section>

  <!-- ═══ 4. ИСПОЛЬЗОВАНИЕ ═══ -->
  <section class="card" aria-labelledby="usage-title">
    <h2 id="usage-title">ИИ-подсказки</h2>
    <label for="ai-usage">Использовано 212 из 300 до 15 декабря</label>
    <progress id="ai-usage" value="212" max="300">212 из 300</progress>
    <button type="button" data-action="buy-pack">Купить пакет +500 — 490 ₽</button>
  </section>

  <!-- ═══ 5. СПОСОБ ОПЛАТЫ ═══ -->
  <section class="card" aria-labelledby="method-title">
    <h2 id="method-title">Способ оплаты</h2>
    <p>Карта •• 4417, действует до 11/2026</p>
    <button type="button" data-action="replace-method">Заменить карту</button>
    <!-- Отвязать — всегда доступно: после этого автосписаний по карте не будет -->
    <button type="button" data-action="detach-method">Отвязать карту</button>
  </section>

  <!-- ═══ 6. ИСТОРИЯ СЧЕТОВ — С ЧЕКАМИ И АКТАМИ ═══ -->
  <section class="card card--wide" aria-labelledby="history-title">
    <h2 id="history-title">История счетов</h2>
    <table>
      <caption class="visually-hidden">Счета организации «Обжиг»</caption>
      <thead>
        <tr><th scope="col">Счёт</th><th scope="col">Дата</th><th scope="col">Сумма</th><th scope="col">Статус</th><th scope="col">Документы</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>OTK-2026-000188</td><td>15.11.2026</td><td>3 160,00 ₽</td><td>оплачен</td>
          <td><a href="/obzhig/billing/invoices/OTK-2026-000188/receipt">чек</a></td>
        </tr>
        <tr>
          <td>OTK-2026-000134</td><td>20.10.2026</td><td>662,58 ₽</td><td>оплачен</td>
          <td><a href="/obzhig/billing/invoices/OTK-2026-000134/receipt">чек</a></td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- ═══ 7. ОТМЕНА — НА ВИДУ, А НЕ В ПОДВАЛЕ ═══ -->
  <section class="card card--wide" aria-labelledby="cancel-title">
    <h2 id="cancel-title">Отмена подписки</h2>
    <p>Подписка будет действовать до 15 декабря, потом — бесплатный тариф. Данные сохранятся.</p>
    <button type="button" class="danger" data-action="cancel">Отменить подписку</button>
  </section>
</main>

<!-- ═══ 8. ОКНО ПОДТВЕРЖДЕНИЯ: СУММА — ДО СПИСАНИЯ ═══ -->
<dialog id="confirm-change" aria-labelledby="confirm-title">
  <form method="dialog">
    <h2 id="confirm-title">Добавить место</h2>
    <!-- Текст и сумму прислал сервер: тот же код, что потом спишет деньги -->
    <p id="confirm-text">Доплата сегодня — 658,33 ₽ за 25 оставшихся дней из 30. С 15 декабря — 3 950,00 ₽ в месяц.</p>
    <button value="cancel">Не сейчас</button>
    <button value="confirm" id="confirm-button">Оплатить 658,33 ₽</button>
  </form>
</dialog>

<script type="module">
  // ═══ 9. ПРЕДПРОСМОТР → ПОДТВЕРЖДЕНИЕ ═══
  const dialog = document.getElementById('confirm-change');
  let preview = null;

  document.querySelector('[data-action="add-seats"]').addEventListener('click', async () => {
    // Сервер считает сумму; браузер её не вычисляет
    const response = await fetch('/obzhig/api/billing/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: { kind: 'add_seats', count: 1 } }),
    });
    preview = await response.json(); // { text, chargeNowKopecks, buttonLabel }
    document.getElementById('confirm-text').textContent = preview.text;
    document.getElementById('confirm-button').textContent = preview.buttonLabel;
    dialog.showModal();
  });

  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'confirm' || !preview) return;
    // Отправляем обратно сумму, которую человек ВИДЕЛ: не совпадёт с пересчётом — сервер покажет окно заново
    await fetch('/obzhig/api/billing/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: { kind: 'add_seats', count: 1 }, expectedKopecks: preview.chargeNowKopecks }),
    });
    location.reload(); // в жизни — обновить блоки без перезагрузки, но смысл тот же
  });
</script>

<!-- ═══ КАК НЕ НАДО: смену карты через поддержку, сумму в браузере, списание без окна ═══ -->
<p>Чтобы сменить карту, напишите в поддержку</p> [!error]
<script>const charge = 790 * remainingDays / 31;</script> [!error]
<button onclick="addSeatAndChargeNow()">Добавить место</button> [!error]
`;

  protected readonly supportTools = `
// ═══ 1. КАЖДОЕ ДЕЙСТВИЕ — ЧЕРЕЗ ОДНУ ОБЁРТКУ С ЖУРНАЛОМ ═══
// CREATE TABLE admin_audit_log (
//   id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   staff_id        uuid NOT NULL,
//   action          text NOT NULL,          -- 'trial.extend', 'ai.bonus', 'invoice.forgive', 'impersonation.start'
//   organization_id uuid NOT NULL,
//   reason          text NOT NULL,          -- «почему» — обязательное поле
//   before          jsonb,
//   after           jsonb,
//   created_at      timestamptz NOT NULL DEFAULT now()
// );
import { createHash, randomBytes } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type pg from 'pg';
import { tx } from './db';
import { extendTrial } from './trial';

type Staff = { id: string; name: string; role: 'support' | 'admin' };
type Outcome<T> = { before: unknown; after: unknown; result: T };

export async function adminAction<T>(
  staff: Staff,
  action: string,
  organizationId: string,
  reason: string,
  work: (client: pg.PoolClient) => Promise<Outcome<T>>,
): Promise<T> {
  if (reason.trim().length < 10) throw new Error('reason is required'); // «причина» — не формальность
  return tx(async (client) => {
    const { before, after, result } = await work(client);
    // Журнал — в той же транзакции: нет записи в журнале — нет и действия
    await client.query(
      'INSERT INTO admin_audit_log (staff_id, action, organization_id, reason, before, after) VALUES ($1, $2, $3, $4, $5, $6)',
      [staff.id, action, organizationId, reason, JSON.stringify(before), JSON.stringify(after)],
    );
    return result;
  });
}

// ═══ 2. ДЕЙСТВИЯ, А НЕ ПОЛЯ ═══
export function extendTrialByStaff(staff: Staff, organizationId: string, days: number, reason: string) {
  if (!Number.isInteger(days) || days < 1 || days > 30) throw new Error('days must be 1..30');
  return adminAction(staff, 'trial.extend', organizationId, reason, async (client) => {
    const { rows } = await client.query<{ id: string; trial_ends_at: Date }>(
      "SELECT id, trial_ends_at FROM subscriptions WHERE organization_id = $1 AND status = 'trialing' FOR UPDATE",
      [organizationId],
    );
    const sub = rows[0];
    if (!sub) throw new Error('organization is not on trial');
    await extendTrial(client, sub.id, days, staff.id); // тот же код, что у планировщика, — не «UPDATE руками»
    const after = await client.query<{ trial_ends_at: Date }>('SELECT trial_ends_at FROM subscriptions WHERE id = $1', [sub.id]);
    return { before: { trialEndsAt: sub.trial_ends_at }, after: { trialEndsAt: after.rows[0].trial_ends_at }, result: after.rows[0].trial_ends_at };
  });
}

// Сбой нейросети съел подсказки — возвращаем бонусом на текущий период
export function grantAiBonus(staff: Staff, organizationId: string, amount: number, reason: string) {
  if (!Number.isInteger(amount) || amount < 1 || amount > 1000) throw new Error('amount must be 1..1000');
  return adminAction(staff, 'ai.bonus', organizationId, reason, async (client) => {
    const { rows } = await client.query<{ before: number; after: number }>(
      \`UPDATE subscriptions SET extra_ai_suggestions = extra_ai_suggestions + $2
        WHERE organization_id = $1 AND status IN ('trialing', 'active', 'past_due')
       RETURNING extra_ai_suggestions - $2 AS before, extra_ai_suggestions AS after\`,
      [organizationId, amount],
    );
    if (!rows[0]) throw new Error('no live subscription');
    return { before: rows[0].before, after: rows[0].after, result: rows[0].after };
  });
}

// «Простить долг»: только администратор, и делает ВСЁ согласованно — счёт, статус, история
export function forgiveInvoice(staff: Staff, organizationId: string, invoiceId: string, reason: string) {
  if (staff.role !== 'admin') throw new Error('admins only');
  return adminAction(staff, 'invoice.forgive', organizationId, reason, async (client) => {
    const { rows } = await client.query<{ subscription_id: string; total_kopecks: number }>(
      \`UPDATE invoices SET status = 'void'
        WHERE id = $1 AND organization_id = $2 AND status = 'open'
       RETURNING subscription_id, total_kopecks\`,
      [invoiceId, organizationId],
    );
    if (!rows[0]) throw new Error('invoice is not open');
    // Попыток «в полёте» быть не должно: иначе деньги могут прийти уже за прощённый счёт
    const inFlight = await client.query("SELECT 1 FROM payments WHERE invoice_id = $1 AND status = 'pending'", [invoiceId]);
    if (inFlight.rowCount) throw new Error('payment in flight — wait for reconciliation');
    await client.query(
      "UPDATE subscriptions SET status = 'active', grace_ends_at = NULL WHERE id = $1 AND status = 'past_due'",
      [rows[0].subscription_id],
    );
    return { before: { invoice: 'open' }, after: { invoice: 'void', forgivenKopecks: rows[0].total_kopecks }, result: true };
  });
}

// ═══ 3. ВХОД ПОД КЛИЕНТОМ: ТОЛЬКО ЧТЕНИЕ, 30 МИНУТ, ПОЛОСА И ЖУРНАЛ ═══
// CREATE TABLE impersonation_sessions (token_hash bytea PRIMARY KEY, staff_id uuid, organization_id uuid,
//   can_see_conversations boolean NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz DEFAULT now());
type Impersonation = { token: string; expiresAt: Date; canSeeConversations: boolean };

export function startImpersonation(staff: Staff, organizationId: string, reason: string): Promise<Impersonation> {
  return adminAction(staff, 'impersonation.start', organizationId, reason, async (client) => {
    // Переписку покупателей поддержка видит, только если клиент сам разрешил: «доступ поддержке на 24 часа»
    const { rows } = await client.query<{ allowed: boolean }>(
      'SELECT coalesce(support_access_until > now(), false) AS allowed FROM organizations WHERE id = $1',
      [organizationId],
    );
    const canSeeConversations = rows[0]?.allowed ?? false;
    const token = randomBytes(32).toString('base64url');
    const created = await client.query<{ expires_at: Date }>(
      \`INSERT INTO impersonation_sessions (token_hash, staff_id, organization_id, can_see_conversations, expires_at)
       VALUES ($1, $2, $3, $4, now() + interval '30 minutes')
       RETURNING expires_at\`,
      [createHash('sha256').update(token).digest(), staff.id, organizationId, canSeeConversations],
    );
    const expiresAt = created.rows[0].expires_at;
    return { before: null, after: { canSeeConversations, expiresAt }, result: { token, expiresAt, canSeeConversations } };
  });
}

// Middleware для запросов в режиме поддержки (res.locals.impersonation положил обработчик сессии)
export function guardImpersonation(req: Request, res: Response, next: NextFunction): void {
  const session: { staffName: string; canSeeConversations: boolean } | undefined = res.locals['impersonation'];
  if (!session) {
    next();
    return;
  }
  if (req.method !== 'GET') {
    res.status(403).json({ error: 'read_only_support_session' }); // ответить покупателю «от имени» клиента нельзя
    return;
  }
  if (!session.canSeeConversations && req.path.includes('/conversations')) {
    res.status(403).json({ error: 'customer_did_not_allow' });
    return;
  }
  res.setHeader('X-Support-Session', encodeURIComponent(session.staffName)); // по нему интерфейс рисует яркую полосу
  next();
}

// ═══ КАК НЕ НАДО ═══
// psql боевой базы: UPDATE subscriptions SET status = 'active';     // [!error] без WHERE и без журнала
// <select name="status"> в карточке подписки                        // [!error] поля вместо действий
// вход под клиентом без срока и с правом отвечать покупателям      // [!error] чужие данные и чужие ответы
`;

  protected readonly dataLifecycle = `

═══ КТО ЗА КАКИЕ ДАННЫЕ ОТВЕЧАЕТ ═══

  чьи данные                              оператор      «Отклик» для них
  ─────────────────────────────────────────────────────────────────────────
  Ольга, Павел, Нина: почта, имя, вход    «Отклик»      оператор
  покупатели «Обжига» в переписке:        «Обжиг»       обработчик по поручению
    имена, телефоны, адреса, фото
  реквизиты «Пикселя» для счетов          «Отклик»      оператор (данные организации
                                                         и её представителя)


═══ ПОРУЧЕНИЕ НА ОБРАБОТКУ — ЧТО В НЁМ ДОЛЖНО БЫТЬ ═══

  • какие действия «Отклик» совершает с данными: хранение, систематизация,
    показ операторам клиента, передача в нейросеть для подсказок, удаление
  • зачем: чтобы клиент мог отвечать своим покупателям
  • обязанность хранить конфиденциальность и защищать данные
  • где данные хранятся (в России) и кому ещё передаются
  Принимается вместе с офертой при регистрации — с версией текста и датой.
  Текст пишет юрист; разработчик делает так, чтобы его нельзя было пропустить.


═══ ГДЕ ЛЕЖАТ ДАННЫЕ — ЛОКАЛИЗАЦИЯ ═══

  основная база PostgreSQL        российское облако, регион в России
  реплики и резервные копии       там же — копия в другой стране тоже копия
  вложения покупателей            объектное хранилище в России
  логи и ошибки                   без текстов переписки: только идентификаторы
  аналитика                       события без почт и телефонов
  нейросеть для подсказок         модель в России ИЛИ телефоны, почты и адреса
                                  заменяются заглушками до отправки;
                                  решение — с юристом, до запуска


═══ ЖИЗНЕННЫЙ ЦИКЛ ОРГАНИЗАЦИИ ═══

  подписка закончилась      данные целы, бесплатный тариф, вернуться — 2 клика
  владелец удалил           deleted_at = сейчас; 30 дней можно восстановить
  +30 дней                  уборщик стирает обращения, сообщения, вложения,
                            участия, счётчики; счета и платежи — по сроку
                            бухгалтерского хранения, отдельно от переписки
  +30 дней ещё              устаревают и удаляются бэкапы с этими данными —
                            срок честно написан в политике


═══ ВЫГРУЗКА — В ЛЮБОЙ МОМЕНТ ═══

  кто           владелец организации
  что           обращения и сообщения, контакты, шаблоны, каналы, участники
  формат        архив с JSON и CSV — машиночитаемо, а не PDF-скриншоты
  как           фоновая задача собирает архив, ссылка на скачивание
                живёт 24 часа и открывается только владельцу


═══ ЗАПРОС ПОКУПАТЕЛЯ: «УДАЛИТЕ МОИ ДАННЫЕ» ═══

  1. покупатель пишет «Обжигу» — отвечать за это должен «Обжиг» как оператор
  2. Ольга находит контакт по почте или телефону в «Отклике»
  3. «удалить контакт и всю переписку» — во всех каналах, с вложениями
  4. подтверждение + запись в журнал: кто, когда, какой контакт
  5. «Обжиг» отвечает покупателю, что данные удалены
  Без этой кнопки шаги 2–4 превращаются в письмо в поддержку «Отклика»
  и ручные запросы к базе.


═══ КАК НЕ НАДО ═══

  «Поручение? Да кто его читает — уберём из регистрации»                  [!error]
  реплика для чтения — «поближе к разработчикам», в другой стране       [!error]
  в сервис ошибок уходит тело запроса с перепиской                       [!error]
  «удалить организацию» = DELETE прямо сейчас, без окна восстановления   [!error]
`;

  protected readonly reliability = `

═══ ЧТО ЗНАЧАТ ДЕВЯТКИ — ДЛЯ МЕСЯЦА В 30 ДНЕЙ ═══

  доступность    можно лежать в месяц     что для этого нужно
  99 %           7 ч 12 мин               один сервер и бэкапы
  99,5 %         3 ч 36 мин               мониторинг, быстрые выкладки и откаты
  99,9 %         43 мин                   резервный сервер, дежурство
  99,99 %        4 мин 19 с               автоматическое переключение, несколько зон

  «Отклик» обещает 99,5 % на «Бизнесе» (с компенсацией днями подписки),
  внутренняя цель — 99,9 %. На «Команде» формального обещания нет.


═══ ШУМНЫЙ СОСЕД — ТРИ ЗАЩИТЫ ═══

  1. лимит запросов на организацию     API: 600 запросов в минуту;
                                       превысили — 429 и заголовок Retry-After
  2. отдельные очереди                 «новые сообщения» — быстрая очередь;
                                       «импорт архива», «выгрузка» — медленная
  3. справедливые воркеры              воркер берёт задачи по кругу организаций,
                                       а не «первые сто в очереди»: импорт
                                       «Пикселя» не задерживает «Обжиг»


═══ РЕЗЕРВНЫЕ КОПИИ ═══

  что                     как часто            сколько хранить
  база целиком            раз в сутки          30 дней
  журнал изменений базы   непрерывно           7 дней — откат на любую минуту
  вложения                версии в хранилище   30 дней
  проверка восстановления раз в месяц          на отдельном сервере, с замером времени


═══ БИЛЛИНГ ВО ВРЕМЯ СБОЯ ═══

  сбой у нас                письмо клиентам после восстановления;
                            компенсация по SLA — одним действием в админке
  сбой у платёжного сервиса отказы 'issuer_unavailable' и ошибки сети —
                            мягкие: тихий повтор через 3 часа,
                            никаких писем «карта не прошла» в ту же минуту
  планировщик молчит        сигнал дежурному: «за час ни одного продления,
                            хотя к продлению подошли 14 подписок»


═══ СИГНАЛЫ ДЕЖУРНОМУ ═══

  сервис не отвечает снаружи 2 минуты подряд
  доля ошибок 5xx больше 2 % за 5 минут
  очередь «новые сообщения» старше 2 минут
  планировщик не обработал подошедшие продления за час
  доля неудачных списаний за сутки выросла вдвое
  попытки «в полёте» старше суток — ключ идемпотентности вот-вот истечёт


═══ КАК НЕ НАДО ═══

  страница статуса на том же сервере, что и сервис                        [!error]
  «бэкапы делаются» — но восстановление ни разу не пробовали             [!error]
  импорт одного клиента в общей очереди с новыми сообщениями всех        [!error]
  обещать 99,99 % в договоре, имея один сервер                           [!error]
`;

  protected readonly metrics = `
-- ═══ 1. MRR ПРЯМО СЕЙЧАС: КАЖДАЯ ДЕЙСТВУЮЩАЯ ПОДПИСКА СВОЕЙ МЕСЯЧНОЙ ЦЕНОЙ ═══
-- Годовые — двенадцатой частью; пробные не считаем; пакеты и доплаты — не регулярные, не входят
SELECT
  sum(s.seats * pv.price_per_seat_kopecks::numeric
      / CASE pv.billing_interval WHEN 'year' THEN 12 ELSE 1 END) / 100       AS mrr_rub,
  sum(s.seats * pv.price_per_seat_kopecks::numeric
      / CASE pv.billing_interval WHEN 'year' THEN 12 ELSE 1 END)
      FILTER (WHERE s.status = 'past_due') / 100                           AS mrr_at_risk_rub, -- в льготном периоде
  count(*)                                                                 AS paying_organizations
FROM subscriptions s
JOIN plan_versions pv ON pv.id = s.plan_version_id
WHERE s.status IN ('active', 'past_due')
  AND pv.price_per_seat_kopecks > 0;
-- «Обжиг»:  4 × 79 000 / 1   = 316 000 коп. = 3 160 ₽
-- «Пиксель»: 12 × 1 430 400 / 12 = 1 430 400 коп. = 14 304 ₽

-- ═══ 2. СНИМОК MRR РАЗ В СУТКИ — ИСТОРИЯ ДЛЯ МОСТА ═══
CREATE TABLE mrr_snapshots (
  day             date NOT NULL,
  organization_id uuid NOT NULL REFERENCES organizations (id),
  mrr_kopecks     integer NOT NULL,
  PRIMARY KEY (day, organization_id)
);

INSERT INTO mrr_snapshots (day, organization_id, mrr_kopecks)
SELECT current_date,
       s.organization_id,
       round(s.seats * pv.price_per_seat_kopecks::numeric
             / CASE pv.billing_interval WHEN 'year' THEN 12 ELSE 1 END)
FROM subscriptions s
JOIN plan_versions pv ON pv.id = s.plan_version_id
WHERE s.status IN ('active', 'past_due') AND pv.price_per_seat_kopecks > 0
ON CONFLICT (day, organization_id) DO UPDATE SET mrr_kopecks = EXCLUDED.mrr_kopecks; -- перезапуск задачи безопасен

-- ═══ 3. МОСТ MRR ЗА НОЯБРЬ ═══
WITH start_mrr AS (
  SELECT organization_id, mrr_kopecks FROM mrr_snapshots WHERE day = DATE '2026-11-01'
), end_mrr AS (
  SELECT organization_id, mrr_kopecks FROM mrr_snapshots WHERE day = DATE '2026-12-01'
), joined AS (
  SELECT coalesce(e.organization_id, s.organization_id) AS organization_id,
         coalesce(s.mrr_kopecks, 0)                    AS before,
         coalesce(e.mrr_kopecks, 0)                    AS after,
         EXISTS (SELECT 1 FROM mrr_snapshots h
                  WHERE h.organization_id = coalesce(e.organization_id, s.organization_id)
                    AND h.day < DATE '2026-11-01' AND h.mrr_kopecks > 0) AS paid_before
  FROM start_mrr s
  FULL JOIN end_mrr e ON e.organization_id = s.organization_id     -- FULL: и ушедшие, и пришедшие
)
SELECT
  sum(before) / 100.0                                                       AS mrr_start,
  coalesce(sum(after) FILTER (WHERE before = 0 AND NOT paid_before), 0) / 100.0       AS new_mrr,
  coalesce(sum(after) FILTER (WHERE before = 0 AND paid_before), 0) / 100.0           AS reactivation,
  coalesce(sum(after - before) FILTER (WHERE before > 0 AND after > before), 0) / 100.0 AS expansion,
  coalesce(sum(before - after) FILTER (WHERE after > 0 AND after < before), 0) / 100.0  AS contraction,
  coalesce(sum(before) FILTER (WHERE before > 0 AND after = 0), 0) / 100.0            AS churn,
  sum(after) / 100.0                                                        AS mrr_end,
  -- отток клиентов: сколько платящих на 1 ноября не платят 1 декабря
  round(count(*) FILTER (WHERE before > 0 AND after = 0)::numeric
        / nullif(count(*) FILTER (WHERE before > 0), 0), 3)                AS logo_churn
FROM joined;
-- mrr_start 448 000 · new 28 000 · reactivation 0 · expansion 9 000 · contraction 4 000
-- churn 13 500 · mrr_end 467 500 · logo_churn 0.031 (5 из 160)

-- ═══ 4. ПОЧЕМУ ЗАКАНЧИВАЮТСЯ ПОДПИСКИ ═══
SELECT ended_reason, count(*) AS subscriptions
FROM subscriptions
WHERE ended_at >= DATE '2026-11-01' AND ended_at < DATE '2026-12-01'
  AND ended_reason <> 'trial_expired'               -- пробные без оплаты — отдельная воронка
GROUP BY ended_reason;
-- unpaid           3  ← не «ушли», а «не заплатили»: это работа даннинга, а не продукта
-- customer_request 2  ← причины — в cancellation_feedback

-- ═══ 5. КОНВЕРСИЯ ПРОБНОГО ПЕРИОДА ПО МЕСЯЦАМ РЕГИСТРАЦИИ ═══
SELECT date_trunc('month', s.created_at)::date AS cohort,
       count(*)                                AS trials,
       count(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM invoices i
          WHERE i.subscription_id = s.id AND i.kind = 'renewal' AND i.status = 'paid'
       ))                                      AS converted
FROM subscriptions s
WHERE s.trial_ends_at IS NOT NULL
GROUP BY 1
ORDER BY 1;
-- 2026-10-01 | 100 | 12   ← та самая воронка активации: 12 из 100

-- ═══ КАК НЕ НАДО ═══
-- SELECT sum(total_kopecks) FROM invoices WHERE paid_at >= '2026-11-01'   -- [!error] это поступления, а не MRR
-- считать trialing в MRR — «они же скоро заплатят»                         -- [!error]
-- UPDATE subscriptions SET ended_reason = NULL — «чтобы не путало»         -- [!error] история — основа метрик
`;

  protected readonly stack = `

═══ СТРУКТУРА РЕПОЗИТОРИЯ «ОТКЛИКА» ═══

  src/
    product/         очередь, обращения, ответы, каналы
    organizations/   пользователи, организации, участия, приглашения, права
    billing/         тарифы, подписки, счета, платежи, планировщик, даннинг,
                     перерасчёт, чеки, оплата по счёту
    usage/           счётчики, ИИ-подсказки
    support/         внутренняя админка, журнал действий, вход под клиентом
    shared/          база, задачи, часы, письма, конфигурация
  migrations/        схема базы — по шагам, в репозитории
  tests/billing/     сценарии на перемотанных часах

  Правило границ: модуль product не пишет в таблицы billing напрямую —
  он вызывает функции billing (например, «можно ли подключить канал»).


═══ ПРОЦЕССЫ НА СЕРВЕРЕ — ОДИН КОД, ТРИ РОЛИ ═══

  web       HTTP: кабинет, API, вебхуки ЮKassa
  worker    задачи из таблицы jobs: письма, списания, выгрузки, импорт
  cron      каждые 5 минут   trialTick, renewDueSubscriptions, dunningTick,
                             issueUpcomingBankInvoices
            каждый час       reconcileStuckPayments, загрузка выписки банка
            раз в сутки      снимок MRR, предупреждения об истекающих картах,
                             уборщик удалённых организаций


═══ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ — СЕКРЕТЫ НЕ В КОДЕ ═══

  DATABASE_URL            роль otklik_app — без права обходить политики строк
  BILLING_DATABASE_URL    роль otklik_billing — для планировщика
  YOOKASSA_SHOP_ID        тестовый и боевой магазины — РАЗНЫЕ значения
  YOOKASSA_SECRET_KEY
  MAIL_API_KEY
  LLM_API_KEY
  BANK_API_TOKEN          выписки для оплаты по счёту
  (подробно — страница «Окружения, конфиги и секреты»)


═══ ЧЕГО НЕ НУЖНО В ПЕРВОЙ ВЕРСИИ ═══

  Kubernetes, брокер сообщений, микросервисы, своя модель нейросети,
  свой сервис входа, своя касса, вход через корпоративный каталог,
  мобильное приложение. Всё это — когда появится конкретная боль.


═══ КАК НЕ НАДО ═══

  «billing — отдельный сервис, общается с остальными по HTTP»            [!error]
  YOOKASSA_SECRET_KEY в репозитории, «он же тестовый»                    [!error]
  планировщик внутри web-процесса через setInterval на каждом сервере    [!error]
`;

  protected readonly testClock = `
// ═══ 1. ЧАСЫ — ОДИН ИСТОЧНИК ВРЕМЕНИ ДЛЯ ВСЕГО БИЛЛИНГА ═══
export interface Clock {
  now(): Date;
}

export class TestClock implements Clock {
  constructor(private current: Date) {}
  now(): Date {
    return new Date(this.current);
  }
  advanceDays(days: number): void {
    this.current = new Date(this.current.getTime() + days * 86_400_000);
  }
  advanceHours(hours: number): void {
    this.current = new Date(this.current.getTime() + hours * 3_600_000);
  }
}
// В бою — время базы (SELECT now()), в тестах — TestClock. Функции биллинга получают clock
// и передают clock.now() в запросы параметром: … WHERE current_period_end <= $1

// ═══ 2. ПОДДЕЛКА ЮKASSA ДЛЯ ТЕСТОВ — ВЕДЁТ СЕБЯ КАК НАСТОЯЩАЯ ═══
type Outcome = 'succeeded' | { reason: string };

export class FakeYookassa {
  readonly charges: { key: string; value: string }[] = [];
  private byKey = new Map<string, { id: string; status: string; reason?: string }>();
  nextOutcome: Outcome = 'succeeded';
  dropNextResponse = false; // платёж «выполнен», но ответ «потерялся в сети»

  async createPayment(body: { amount: { value: string } }, idempotenceKey: string) {
    const existing = this.byKey.get(idempotenceKey);
    if (existing) return existing; // как настоящая: тот же ключ — тот же платёж, без второго списания
    const outcome = this.nextOutcome;
    const payment =
      outcome === 'succeeded'
        ? { id: 'pay-' + (this.charges.length + 1), status: 'succeeded' }
        : { id: 'pay-' + (this.charges.length + 1), status: 'canceled', reason: outcome.reason };
    this.byKey.set(idempotenceKey, payment);
    this.charges.push({ key: idempotenceKey, value: body.amount.value });
    if (this.dropNextResponse) {
      this.dropNextResponse = false;
      throw new Error('timeout'); // для нашего кода — тайм-аут, хотя платёж создан
    }
    return payment;
  }
}

// ═══ 3. СЦЕНАРИЙ: ИСТЁКШАЯ КАРТА → ЛЬГОТНЫЙ ПЕРИОД → НОВАЯ КАРТА ═══
import { beforeEach, expect, test } from 'vitest';
import { createBilling, type Billing } from '../src/billing';
import { resetTestDatabase, testDb } from './test-db';

let clock: TestClock;
let yookassa: FakeYookassa;
let billing: Billing;

beforeEach(async () => {
  await resetTestDatabase();
  clock = new TestClock(new Date('2026-10-01T09:40:00Z')); // 1 октября, 12:40 по Москве
  yookassa = new FakeYookassa();
  billing = createBilling({ db: testDb, clock, yookassa }); // все зависимости — снаружи, ничего «глобального»
});

test('expired card: grace period, then a new card pays the same invoice', async () => {
  const org = await billing.signup({ storeName: 'Обжиг', email: 'olga@obzhig.example' });
  await billing.inviteAndAccept(org, ['pavel@obzhig.example', 'nina@mail.example']); // 3 места в пробном
  await billing.attachCard(org, { last4: '4417' });

  clock.advanceDays(14);
  await billing.tick(); // 15 октября: конец пробного → счёт 2 370 ₽ → списание
  expect(await billing.subscription(org)).toMatchObject({ status: 'active', seats: 3 });
  expect(yookassa.charges.map((c) => c.value)).toEqual(['2370.00']);

  yookassa.nextOutcome = { reason: 'card_expired' };
  clock.advanceDays(31);
  await billing.tick(); // 15 ноября: продление — жёсткий отказ
  expect(await billing.subscription(org)).toMatchObject({ status: 'past_due' });

  clock.advanceDays(3);
  await billing.tick(); // 18 ноября: жёсткий отказ НЕ повторяем
  expect(yookassa.charges).toHaveLength(2);

  yookassa.nextOutcome = 'succeeded';
  await billing.attachCard(org, { last4: '5521' }); // новая карта → сразу попытка
  const sub = await billing.subscription(org);
  expect(sub.status).toBe('active');
  expect(sub.currentPeriodStart.toISOString()).toBe('2026-11-15T09:40:00.000Z'); // период с 15-го, а не с 18-го
  expect(yookassa.charges).toHaveLength(3);
});

// ═══ 4. ДВА ПЛАНИРОВЩИКА РАЗОМ — ОДНО СПИСАНИЕ ═══
test('two schedulers at once charge only once', async () => {
  const org = await billing.signup({ storeName: 'Обжиг', email: 'olga@obzhig.example' });
  await billing.attachCard(org, { last4: '4417' });
  clock.advanceDays(14);
  await Promise.all([billing.tick(), billing.tick()]); // два процесса в одну секунду
  expect(yookassa.charges).toHaveLength(1);
});

// ═══ 5. ТАЙМ-АУТ, ПОТОМ СВЕРКА — ВТОРОГО ПЛАТЕЖА НЕТ ═══
test('timeout then reconcile does not create a second payment', async () => {
  const org = await billing.signup({ storeName: 'Обжиг', email: 'olga@obzhig.example' });
  await billing.attachCard(org, { last4: '4417' });
  clock.advanceDays(14);
  yookassa.dropNextResponse = true;
  await billing.tick();                 // попытка записана как pending, ответа нет
  clock.advanceHours(1);
  await billing.reconcile();            // повтор с ТЕМ ЖЕ ключом
  expect(yookassa.charges).toHaveLength(1);
  expect(await billing.subscription(org)).toMatchObject({ status: 'active' });
});

// ═══ КАК НЕ НАДО ═══
// await new Promise((r) => setTimeout(r, 14 * 24 * 3600 * 1000));   // [!error] ждать 14 дней в тесте
// vi.setSystemTime(…) — а SQL внутри всё равно считает по now() базы // [!error] часы разошлись
// тестировать только первый платёж                                    // [!error] ломается продление
`;

  protected readonly launchChecklist = `

═══ ЧЕК-ЛИСТ ЗАПУСКА «ОТКЛИКА» ═══

  ДОКУМЕНТЫ — с юристом
    ☐ оферта: тарифы, автопродление, отмена, возвраты, SLA для «Бизнеса»
    ☐ политика обработки персональных данных — на сайте
    ☐ поручение на обработку данных покупателей клиентов — в оферте
    ☐ текст согласия на автоплатёж — с версией
    ☐ реквизиты «Отклика» на сайте и в счетах

  ДЕНЬГИ — с бухгалтером
    ☐ налоговый режим и «Без НДС» в чеках и счетах подтверждены
    ☐ признак способа расчёта и предмета расчёта выбраны и стоят в настройках
    ☐ тестовый платёж с чеком проверен глазами бухгалтера
    ☐ шаблон акта для компаний согласован

  ПЛАТЁЖНЫЙ СЕРВИС
    ☐ автоплатежи включены менеджером в БОЕВОМ магазине
    ☐ боевые ключи — в переменных окружения боевого сервера
    ☐ адрес вебхуков указан в боевом магазине (у тестового — свой!)
    ☐ «Чеки от ЮKassa» подключены в боевом магазине

  КОД
    ☐ автотесты сценариев на перемотанных часах — зелёные
    ☐ двойной запуск планировщика и двойной вебхук — в тестах
    ☐ тест «войти в организацию A, запросить данные B» — для всех адресов API
    ☐ приложение подключается ролью без права обходить политики строк

  ЭКСПЛУАТАЦИЯ
    ☐ сигналы: сервис недоступен, планировщик молчит, растут отказы,
      попытки «в полёте» старше суток
    ☐ резервная копия восстановлена на отдельном сервере хотя бы раз
    ☐ страница статуса — на отдельном хостинге
    ☐ фильтры персональных данных в ошибках и логах

  ПЕРВЫЙ КЛИЕНТ — ВЫ САМИ
    ☐ подписка на свою карту в боевом режиме
    ☐ доплата за место, отмена, возобновление
    ☐ чек пришёл на почту, в кабинете он скачивается
    ☐ возврат — через платёжный сервис, с чеком возврата
    ☐ только после этого — приглашение «Обжигу»


═══ КАК НЕ НАДО ═══

  «запустимся, а оферту допишем на следующей неделе»                       [!error]
  боевой магазин без адреса вебхуков — «он же скопировался из тестового» [!error]
  первым клиентом сразу становится «Пиксель» на годовой счёт             [!error]
`;
}
