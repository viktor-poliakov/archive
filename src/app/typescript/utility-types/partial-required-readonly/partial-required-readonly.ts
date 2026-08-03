import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-partial-required-readonly',
  imports: [CodeBlock, RouterLink],
  templateUrl: './partial-required-readonly.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesPartialRequiredReadonly {
  protected readonly baseUser = `// Возьмём один обычный тип — «карточку пользователя».
// Три поля, и все три ОБЯЗАТЕЛЬНЫЕ: без вопросительного знака.
// Обязательное поле — то, которое нельзя пропустить при создании объекта.
interface User {
  id: number;
  name: string;
  email: string;
}

// Чтобы создать User, нужно заполнить ВСЕ поля — иначе ошибка:
const anna: User = {
  id: 1,
  name: 'Анна',
  email: 'anna@example.com',
}; // ✅ все три поля на месте`;

  protected readonly painUpdate = `// Боль без Partial. Хотим функцию «обновить пользователя»:
// меняем только то, что реально изменилось (например, один email).
// Но если аргумент типизировать как User, придётся передавать ВСЁ:
function updateUserBad(id: number, patch: User): void {
  // ...записать изменения...
}

// Меняем только email — а компилятор требует ещё id и name:
updateUserBad(1, { email: 'new@example.com' });
// ❌ Property 'id' is missing in type '{ email: string; }' but required in type 'User'.
// Приходится тащить поля, которые мы вообще не трогаем. Неудобно и опасно.`;

  protected readonly painManualOptional = `// «Решение в лоб» — руками написать ВТОРОЙ тип, где всё необязательно.
// Обратите внимание на «?» после каждого имени — это и есть «поле можно пропустить».
interface UserPatch {
  id?: number;
  name?: string;
  email?: string;
}

// Работает, но это копипаста: та же User, только с «?» у каждого поля.
// Добавим в User новое поле — придётся не забыть добавить его и сюда.
// Два типа придётся держать в синхроне вручную. Partial делает это за нас.`;

  protected readonly partialBasic = `// Partial<T> берёт тип T и ставит «?» КАЖДОМУ его полю.
// Название буквальное: «частичный» — можно заполнить лишь ЧАСТЬ полей.
type PartialUser = Partial<User>;

// PartialUser разворачивается ровно в это (все поля стали необязательными):
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }

// Теперь допустимо указать сколько угодно полей — хоть одно, хоть ни одного:
const patch1: PartialUser = { email: 'new@example.com' }; // ✅ только email
const patch2: PartialUser = { name: 'Аня', id: 7 };       // ✅ два поля
const patch3: PartialUser = {};                            // ✅ вообще пусто — тоже ок`;

  protected readonly partialUpdate = `// Классическое применение Partial — функция частичного обновления.
// patch: Partial<User> означает «любое подмножество полей User».
function updateUser(id: number, patch: Partial<User>): void {
  // здесь мы бы взяли текущего пользователя и наложили на него изменения:
  // Object.assign(existing, patch)
}

updateUser(1, { email: 'new@example.com' });   // ✅ поменять только email
updateUser(2, { name: 'Борис', id: 2 });       // ✅ поменять имя и id
updateUser(3, {});                              // ✅ ничего не менять — тоже допустимо

updateUser(4, { age: 30 });
// ❌ Object literal may only specify known properties, and 'age' does not exist in type 'Partial<User>'.
// Partial ослабил обязательность, но НЕ разрешил чужие поля — набор полей тот же, что у User.`;

  protected readonly requiredBasic = `// Required<T> — полная противоположность Partial<T>.
// Он УБИРАЕТ «?» у каждого поля, делая все поля обязательными.
// Возьмём тип, где часть полей была необязательной:
interface Settings {
  theme?: 'light' | 'dark';
  fontSize?: number;
  language?: string;
}

// Required<Settings> разворачивается так (у всех полей «?» исчез):
// {
//   theme: 'light' | 'dark';
//   fontSize: number;
//   language: string;
// }
type FullSettings = Required<Settings>;

const ok: FullSettings = {
  theme: 'dark',
  fontSize: 14,
  language: 'ru',
}; // ✅ заполнены все три поля

const bad: FullSettings = {
  theme: 'dark',
};
// ❌ Type '{ theme: "dark"; }' is missing the following properties from type
//    'Required<Settings>': fontSize, language`;

  protected readonly requiredValidate = `// Практика: «сырые» настройки приходят с необязательными полями
// (пользователь мог что-то не указать). Но ПОСЛЕ проверки и подстановки
// значений по умолчанию мы гарантируем, что заполнено всё.
// Тип результата — Required<Settings>: пропусков больше нет.
interface Settings {
  theme?: 'light' | 'dark';
  fontSize?: number;
  language?: string;
}

function normalizeSettings(raw: Settings): Required<Settings> {
  return {
    theme: raw.theme ?? 'light',      // не задано — берём светлую тему
    fontSize: raw.fontSize ?? 14,     // не задано — берём 14
    language: raw.language ?? 'ru',   // не задано — берём русский
  };
}

const validated = normalizeSettings({ theme: 'dark' });
// тип validated: Required<Settings> — теперь theme, fontSize и language
// точно есть, и можно читать их без проверки на undefined:
validated.fontSize.toFixed(0); // ✅ fontSize гарантированно число, не number | undefined`;

  protected readonly readonlyBasic = `// Readonly<T> ставит модификатор readonly КАЖДОМУ полю.
// readonly значит «только для чтения»: значение можно прочитать,
// но НЕЛЬЗЯ перезаписать после создания объекта.
type FrozenUser = Readonly<User>;

// FrozenUser разворачивается так:
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

const anna: FrozenUser = {
  id: 1,
  name: 'Анна',
  email: 'anna@example.com',
}; // ✅ создать (заполнить один раз) можно

anna.email;         // ✅ читать можно сколько угодно
anna.email = 'x@y'; // ❌ Cannot assign to 'email' because it is a read-only property.
// Поле «запечатано»: перезаписать его — ошибка компиляции.`;

  protected readonly readonlyConfig = `// Практика: неизменяемая конфигурация приложения.
// Такие значения задают один раз при старте и дальше только читают.
// Readonly защищает их от случайной перезаписи где-то в глубине кода.
interface AppConfig {
  apiUrl: string;
  timeoutMs: number;
  retries: number;
}

const config: Readonly<AppConfig> = {
  apiUrl: 'https://api.example.com',
  timeoutMs: 5000,
  retries: 3,
};

config.timeoutMs;        // ✅ читаем — пожалуйста
config.timeoutMs = 9000; // ❌ Cannot assign to 'timeoutMs' because it is a read-only property.
// Никто случайно не «подкрутит» таймаут в рантайме — компилятор не даст.`;

  protected readonly readonlyShallow = `// ВАЖНО: Readonly<T> — «неглубокий» (shallow). Он запечатывает только
// поля ВЕРХНЕГО уровня. Вложенные объекты остаются изменяемыми!
interface Profile {
  name: string;
  address: {
    city: string;
    zip: string;
  };
}

const profile: Readonly<Profile> = {
  name: 'Анна',
  address: { city: 'Москва', zip: '101000' },
};

profile.name = 'Борис';
// ❌ Cannot assign to 'name' — поле верхнего уровня защищено.

profile.address = { city: 'Тверь', zip: '170000' };
// ❌ Cannot assign to 'address' — саму ссылку заменить нельзя.

profile.address.city = 'Тверь';
// ✅ (!) а вот это РАЗРЕШЕНО — Readonly не «спустился» внутрь address.
// Вложенный объект остался обычным, изменяемым. Это частая ловушка.`;

  protected readonly noDeep = `// Встроенного DeepReadonly или DeepPartial в TypeScript НЕТ.
// Partial<T> и Readonly<T> тоже работают только на верхнем уровне.
type Nested = {
  user: {
    id: number;
    name: string;
  };
};

type P = Partial<Nested>;
// user стало необязательным (user?), но ВНУТРИ user поля id и name
// как были обязательными, так и остались:
// { user?: { id: number; name: string } }

// «Глубокие» версии при необходимости пишут вручную или берут из библиотек
// (например, type-fest). Для большинства задач хватает и обычных Partial/Readonly.`;

  protected readonly combine = `// Утилитарные типы можно вкладывать друг в друга — они просто функции над типами.
// Пример: «черновик пользователя» — все поля необязательные И только для чтения.
type UserDraft = Readonly<Partial<User>>;

// Разворачивается так:
// {
//   readonly id?: number;
//   readonly name?: string;
//   readonly email?: string;
// }

const draft: UserDraft = { name: 'Аня' }; // ✅ хватило одного поля
draft.name;         // ✅ читать можно
draft.name = 'Боб'; // ❌ Cannot assign to 'name' because it is a read-only property.`;
}
