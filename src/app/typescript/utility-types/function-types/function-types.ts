import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-function-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './function-types.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesFunctionTypes {
  protected readonly painManual = `// У нас есть готовая функция — «фабрика», которая собирает пользователя.
// Обратите внимание: тип возвращаемого объекта мы нигде не писали руками,
// TypeScript вывел его сам из тела функции.
function makeUser(name: string, age: number) {
  return {
    name: name,
    age: age,
    isActive: true,
    createdAt: Date.now(),
  };
}

// Теперь в другом месте нужен ТИП того, что возвращает makeUser.
// Первый порыв новичка — переписать этот тип руками, заново:
interface User {
  name: string;
  age: number;
  isActive: boolean;
  createdAt: number;
}

// Работает. Но мы завели ДВА источника правды об одном и том же объекте.
// Завтра в makeUser добавят поле email — а в interface User его забудут.
// Типы «разъедутся» (drift), и компилятор не заметит рассинхрона.`;

  protected readonly returnTypeFirst = `// ReturnType<F> — это «рентген» функции: он заглядывает внутрь
// уже написанной функции и считывает ТИП того, что она возвращает.
// Ничего переписывать руками не нужно.

function makeUser(name: string, age: number) {
  return { name: name, age: age, isActive: true };
}

// Читается так: «возьми ТИП функции makeUser и достань из него тип результата».
type User = ReturnType<typeof makeUser>;
// User = { name: string; age: number; isActive: boolean }  ✅

// Теперь User — не копия, а ПРОИЗВОДНАЯ от makeUser.
// Поменяется фабрика — тип User обновится сам собой, автоматически.`;

  protected readonly typeofStep = `// Самый важный (и самый спотыкательный) шаг — маленькое слово typeof.
// Разберём по косточкам, зачем оно здесь.

function makeUser(name: string, age: number) {
  return { name: name, age: age };
}

// makeUser — это ЗНАЧЕНИЕ (конкретная функция, которую можно вызвать).
// ReturnType же ждёт ТИП функции, а не саму функцию.
// Оператор typeof переводит значение в его тип — «какого типа эта штука?».

typeof makeUser;
// → (name: string, age: number) => { name: string; age: number }
//   это ТИП функции makeUser — как раз то, что нужно ReturnType.

type User = ReturnType<typeof makeUser>; // ✅ сначала typeof, потом ReturnType`;

  protected readonly forgotTypeof = `// Частая ошибка новичка — забыть typeof и передать саму функцию.
function makeUser(name: string, age: number) {
  return { name: name, age: age };
}

// ❌ ОШИБКА: makeUser здесь — это ЗНАЧЕНИЕ, а в угловых скобках
//    (в позиции типа) ждут ТИП. Значение туда не подходит.
type Wrong = ReturnType<makeUser>;
// 'makeUser' refers to a value, but is being used as a type here.
// Did you mean 'typeof makeUser'?

// ✅ ПРАВИЛЬНО: добавляем typeof — превращаем значение в тип.
type Right = ReturnType<typeof makeUser>;
// Right = { name: string; age: number }

// Мнемоника: «функция — это ЗНАЧЕНИЕ; чтобы получить её ТИП, пиши typeof».`;

  protected readonly parametersFirst = `// Parameters<F> — второй «рентген». Он считывает типы АРГУМЕНТОВ функции
// и складывает их в кортеж (tuple) — упорядоченный список типов по позициям.

function createUser(name: string, age: number, isAdmin: boolean) {
  return { name: name, age: age, isAdmin: isAdmin };
}

// Снова тот же приём: сначала typeof (значение → тип), потом Parameters.
type CreateUserArgs = Parameters<typeof createUser>;
// CreateUserArgs = [name: string, age: number, isAdmin: boolean]
//                  ↑ это КОРТЕЖ: [0] строка, [1] число, [2] булево — по порядку.

// Кортеж удобно «разворачивать» — например, чтобы принять ТЕ ЖЕ аргументы:
function logUser(...args: Parameters<typeof createUser>) {
  const [name, age] = args;
  console.log(name + ', ' + age);
}
logUser('Анна', 30, false); // ✅ типы аргументов сверяются с createUser`;

  protected readonly parametersIndex = `// Кортеж можно индексировать, чтобы достать тип ОДНОГО аргумента.
// Пишем [0] — первый аргумент, [1] — второй, и так далее.

function createUser(name: string, age: number, isAdmin: boolean) {
  return { name: name, age: age, isAdmin: isAdmin };
}

type FirstArg = Parameters<typeof createUser>[0];  // string
type SecondArg = Parameters<typeof createUser>[1]; // number
type ThirdArg = Parameters<typeof createUser>[2];  // boolean

// Практический смысл: если сигнатура createUser изменится (например,
// name станет числом), FirstArg обновится сам — руками ничего не правим.

// Отдельная функция валидации имени берёт тип прямо у источника:
function validateName(name: Parameters<typeof createUser>[0]): boolean {
  return name.trim().length > 0; // ✅ name гарантированно string
}`;

  protected readonly dryUser = `// Собираем всё вместе на реалистичном примере — форма регистрации.
// Одна фабрика описывает форму профиля; из неё выводим ВСЕ нужные типы.

function buildProfile(nickname: string, bio: string, age: number) {
  return {
    nickname: nickname,
    bio: bio,
    age: age,
    joinedAt: new Date(),
  };
}

// Тип готового профиля — производная от фабрики (никакой копипасты):
type Profile = ReturnType<typeof buildProfile>;
// Profile = { nickname: string; bio: string; age: number; joinedAt: Date }

// Тип набора аргументов формы — тоже производная:
type ProfileFields = Parameters<typeof buildProfile>;
// ProfileFields = [nickname: string, bio: string, age: number]

// Функция, которая сохраняет уже готовый профиль, принимает Profile:
function saveProfile(profile: Profile): void {
  console.log('Сохраняю профиль: ' + profile.nickname);
}

const profile = buildProfile('anna', 'люблю котиков', 30);
saveProfile(profile); // ✅ типы совпадают, потому что у них общий источник`;

  protected readonly actionCreator = `// Ещё один частый приём — вывести тип «действия» из функции-создателя.
// Это популярно в стейт-менеджерах (Redux и подобных).

// Функция-создатель действия «добавить товар в корзину»:
function addToCart(productId: string, quantity: number) {
  return {
    type: 'ADD_TO_CART' as const, // as const фиксирует строку как литерал
    productId: productId,
    quantity: quantity,
  };
}

// Тип действия выводим прямо из создателя — руками не описываем:
type AddToCartAction = ReturnType<typeof addToCart>;
// AddToCartAction = {
//   type: 'ADD_TO_CART';
//   productId: string;
//   quantity: number;
// }

// Редьюсер принимает это действие; тип всегда синхронен с создателем:
function cartReducer(action: AddToCartAction): void {
  if (action.type === 'ADD_TO_CART') {
    console.log('Добавили ' + action.quantity + ' шт. товара ' + action.productId);
  }
}`;

  protected readonly asyncTeaser = `// Осторожно с АСИНХРОННЫМИ функциями. async-функция всегда возвращает Promise,
// поэтому ReturnType достанет именно Promise, а не «внутренний» результат.

async function fetchUser(id: string) {
  return { id: id, name: 'Анна' };
}

type FetchResult = ReturnType<typeof fetchUser>;
// FetchResult = Promise<{ id: string; name: string }>  ← это Promise, не сам объект!

// Чтобы «развернуть» Promise и добраться до типа внутри, есть отдельный
// утилитарный тип Awaited — см. страницу про него (ссылка ниже).
type User = Awaited<ReturnType<typeof fetchUser>>;
// User = { id: string; name: string }  ✅ Promise снят, остался чистый объект`;

  protected readonly ownImplementation = `// Обе утилиты не встроены в компилятор — они написаны обычным кодом
// в стандартной библиотеке TypeScript (lib.es5.d.ts).

// ── ReturnType: «тип возвращаемого значения» ────────────────────
// «Если T подходит под шаблон „функция, возвращающая ЧТО-ТО“ —
//  назови это что-то буквой R и верни R».
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
//                            ↑ дырка ПОСЛЕ стрелки — там, где результат

// ── Parameters: «параметры» ─────────────────────────────────────
// Тот же приём, но дырка стоит ДО стрелки — в списке аргументов.
type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;
//                    ↑ дырка ДО стрелки — там, где аргументы

// infer («вывести») — это шаблон с пропуском: мы описываем форму
// функции, а на месте интересующей нас части ставим не конкретный
// тип, а именованную «дырку». Компилятор сам подставит в неё то,
// что найдёт. Вся разница между двумя утилитами — МЕСТО дырки.

// ── Проверяем на живой функции ──────────────────────────────────
function createUser(name: string, age: number, isAdmin: boolean) {
  return { name: name, age: age, isAdmin: isAdmin };
}

type Result = MyReturnType<typeof createUser>;
// { name: string; age: number; isAdmin: boolean }
// ✅ то же самое, что встроенный ReturnType<typeof createUser>

type Args = MyParameters<typeof createUser>;
// [name: string, age: number, isAdmin: boolean]  ← кортеж
// ✅ то же самое, что встроенный Parameters<typeof createUser>

// Ветка «иначе» (: any и : never) нужна формально — условный тип
// обязан ответить и на случай «шаблон не подошёл». На практике до
// неё не доходит: ограничение T extends (...args: any) => any
// не пропустит внутрь ничего, кроме функции.`;
}
