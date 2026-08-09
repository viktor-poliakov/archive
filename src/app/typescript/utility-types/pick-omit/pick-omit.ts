import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-pick-omit',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pick-omit.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesPickOmit {
  protected readonly painManualCopy = `// Есть большой тип пользователя — «полная анкета» со всеми полями.
interface User {
  id: number;
  name: string;
  email: string;
  password: string; // секрет! наружу отдавать нельзя
  createdAt: string;
}

// Задача: сделать «облегчённую» версию — только id и имя (для списка карточек).
// Наивный способ — СКОПИРОВАТЬ нужные поля руками в новый тип:
interface UserPreview {
  id: number;
  name: string;
}

// Работает. Но это копипаста: мы продублировали описание полей.
// Если завтра id станет строкой (id: string) — придётся вспомнить и починить
// ОБА места. Про UserPreview легко забыть, и типы «разъедутся». Это хрупко.`;

  protected readonly pickFirst = `// Pick<T, K> строит НОВЫЙ тип, оставляя из T только перечисленные ключи K.
// Читается как «возьми (pick) из User поля id и name — и больше ничего».
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// K — это имена ключей, соединённые через | (вертикальную черту).
type UserPreview = Pick<User, 'id' | 'name'>;

// Получился тип, эквивалентный такому:
// {
//   id: number;
//   name: string;
// }

// Главное: если в User изменится тип id — UserPreview обновится САМ.
// Мы не копировали поля, а «сослались» на них. Один источник правды.

const card: UserPreview = {
  id: 1,
  name: 'Анна',
}; // ✅ ровно два поля — как и просили`;

  protected readonly pickExtraKey = `// В Pick-тип нельзя положить поле, которого в списке K не было.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;

const bad: UserPreview = {
  id: 1,
  name: 'Анна',
  email: 'anna@mail.ru',
};
// ❌ Object literal may only specify known properties,
//    and 'email' does not exist in type 'UserPreview'.
// В превью есть только id и name — email сюда не относится.`;

  protected readonly pickWrongKey = `// А что если попросить у Pick поле, которого в User вообще нет?
// Компилятор поймает опечатку сразу — это защита от ошибок.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

type Broken = Pick<User, 'id' | 'username'>;
// ❌ Type '"username"' does not satisfy the constraint
//    'keyof User'. В User нет ключа username — есть name.
//    Pick разрешает перечислять ТОЛЬКО реальные ключи типа.`;

  protected readonly omitFirst = `// Omit<T, K> — «зеркало» Pick. Он оставляет ВСЕ поля T, КРОМЕ перечисленных K.
// Читается как «возьми User целиком, но ВЫБРОСЬ (omit) поле password».
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Самый частый и полезный случай: убрать секрет перед отправкой на клиент.
type PublicUser = Omit<User, 'password'>;

// Получился тип со всеми полями, кроме password:
// {
//   id: number;
//   name: string;
//   email: string;
//   createdAt: string;
// }

// Функция, которая готовит безопасную версию пользователя для ответа API:
function toPublic(user: User): PublicUser {
  const safe: PublicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
  return safe; // ✅ пароль физически не попал в результат
}`;

  protected readonly omitMultiple = `// В K можно перечислить НЕСКОЛЬКО ключей через | — выбросим сразу два поля.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Уберём и пароль, и служебную дату создания:
type ClientUser = Omit<User, 'password' | 'createdAt'>;

// Результат:
// {
//   id: number;
//   name: string;
//   email: string;
// }

const u: ClientUser = {
  id: 7,
  name: 'Борис',
  email: 'boris@mail.ru',
}; // ✅ ни password, ни createdAt тут нет`;

  protected readonly pickOmitEquivalence = `// Pick и Omit — две стороны одной монеты. Один и тот же результат
// можно получить и «оставив нужное», и «выбросив лишнее».
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Оставляем только id и name:
type PreviewViaPick = Pick<User, 'id' | 'name'>;

// Выбрасываем всё ОСТАЛЬНОЕ — остаются те же id и name:
type PreviewViaOmit = Omit<User, 'email' | 'password' | 'createdAt'>;

// PreviewViaPick и PreviewViaOmit — это один и тот же тип { id; name }.
// Правило выбора простое:
// • оставить нужно МАЛО полей  → короче написать Pick;
// • выбросить нужно МАЛО полей → короче написать Omit.`;

  protected readonly formProps = `// Реальный сценарий: форма редактирования профиля.
// Пользователь меняет только имя и email — id и пароль форме не нужны.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Описываем «пропсы» формы как срез большого типа — без копипасты полей:
type ProfileFormValues = Pick<User, 'name' | 'email'>;

function renderProfileForm(values: ProfileFormValues): void {
  // здесь рисуем два поля ввода: имя и email
  console.log(values.name, values.email);
  // values.password — ❌ такого поля в форме нет, компилятор не даст обратиться
}

renderProfileForm({ name: 'Анна', email: 'anna@mail.ru' }); // ✅`;

  protected readonly apiResponse = `// Ещё пример: ответ сервера. В базе у заказа много полей,
// но клиенту в списке заказов нужна лишь их часть.
interface Order {
  id: number;
  userId: number;
  total: number;
  items: string[];
  internalNote: string; // заметка для склада — наружу не отдаём
  createdAt: string;
}

// Строку списка соберём через Pick — берём только то, что показываем:
type OrderListItem = Pick<Order, 'id' | 'total' | 'createdAt'>;

// А «карточку заказа» — через Omit: показываем всё, кроме внутренней заметки:
type OrderCard = Omit<Order, 'internalNote'>;

const row: OrderListItem = {
  id: 100,
  total: 2500,
  createdAt: '2026-08-01',
}; // ✅`;

  protected readonly notExcludeExtract = `// ВАЖНО не перепутать! Pick/Omit работают с КЛЮЧАМИ (полями) объекта.
// А Exclude/Extract работают с ЧЛЕНАМИ объединения (union) — это другое.

// Pick/Omit — про поля ОБЪЕКТНОГО типа:
interface User {
  id: number;
  name: string;
  password: string;
}
type SafeUser = Omit<User, 'password'>; // убрали ПОЛЕ password ✅

// Exclude — про варианты ОБЪЕДИНЕНИЯ (набор допустимых значений):
type Role = 'admin' | 'editor' | 'guest';
type NonGuest = Exclude<Role, 'guest'>; // убрали ВАРИАНТ 'guest'
// NonGuest = 'admin' | 'editor'

// Запомните разницу так:
// • объект { поле: тип; ... }  → режем поля через Pick / Omit;
// • объединение A | B | C      → режем варианты через Exclude / Extract.`;

  protected readonly ownImplementation = `// Pick и Omit не встроены в компилятор — они написаны обычным кодом
// в стандартной библиотеке TypeScript (lib.es5.d.ts). Вот они целиком.

// ── Pick: «выбрать» ─────────────────────────────────────────────
// «Для каждого имени P из набора K создай поле P
//  с тем же типом, какой у этого поля в T».
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
// [P in K] — отображённый тип (mapped type), «цикл по ключам».
// T[P]     — индексный доступ, «возьми тип поля P из T».
// K extends keyof T — защита от опечаток: в K разрешены
//                     ТОЛЬКО реальные ключи типа T.

// ── Omit: «опустить» ────────────────────────────────────────────
// Omit не пишут с нуля — его СОБИРАЮТ из Pick и Exclude:
// «возьми все ключи T, вычти из них K, по остатку сделай Pick».
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;
//                                            └─ 'id'|'name'|'email'|... минус K

// ── Проверяем на знакомом User ──────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

type Preview = MyPick<User, 'id' | 'name'>;
// { id: number; name: string }
// ✅ то же самое, что встроенный Pick<User, 'id' | 'name'>

type Public = MyOmit<User, 'password'>;
// { id: number; name: string; email: string; createdAt: string }
// ✅ то же самое, что встроенный Omit<User, 'password'>

// Разложим MyOmit<User, 'password'> по шагам:
// 1) keyof User                    → 'id'|'name'|'email'|'password'|'createdAt'
// 2) Exclude<..., 'password'>      → 'id'|'name'|'email'|'createdAt'
// 3) MyPick<User, ...>             → объект из этих четырёх полей`;
}
