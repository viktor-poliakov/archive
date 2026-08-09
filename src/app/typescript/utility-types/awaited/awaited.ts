import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-awaited',
  imports: [CodeBlock, RouterLink],
  templateUrl: './awaited.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesAwaited {
  protected readonly promiseRecap = `// Прежде чем разворачивать посылку, вспомним, что такое Promise (обещание).
// Promise<T> — это «коробка», внутри которой КОГДА-НИБУДЬ появится значение
// типа T. Прямо сейчас значения ещё нет (данные грузятся с сервера,
// файл читается с диска), но коробка уже на руках, и на ней написано,
// что внутри будет ЛЕЖАТЬ значение типа T.

interface User {
  id: number;
  name: string;
}

// Тип ниже читается так: «коробка, в которой однажды окажется User».
let boxWithUser: Promise<User>;

// ВАЖНО: сама коробка — это НЕ User. Это Promise<User>.
// Достать User напрямую нельзя — сначала коробку надо распаковать.`;

  protected readonly awaitRuntime = `// В РАНТАЙМЕ (когда программа уже выполняется) коробку распаковывает
// ключевое слово await. Оно «ждёт», пока в коробке появится значение,
// и отдаёт нам само это значение — уже без обёртки.

interface User {
  id: number;
  name: string;
}

// getUser отдаёт коробку Promise<User> — это имитация запроса на сервер.
function getUser(): Promise<User> {
  return Promise.resolve({ id: 1, name: 'Анна' });
}

async function show(): Promise<void> {
  const box = getUser(); // box — это Promise<User> (коробка, ещё запакована)

  const user = await box; // await РАСПАКОВАЛ коробку → user имеет тип User ✅
  console.log(user.name); // ✅ user — это User, у него есть поле name
}

// Ключевое: await работает со ЗНАЧЕНИЯМИ во время выполнения программы.
// А как проделать то же самое с ТИПАМИ, ещё до запуска? Для этого есть Awaited.`;

  protected readonly awaitedFirst = `// Awaited<T> — это «await на уровне типов». Он берёт ТИП коробки-обещания
// и возвращает ТИП значения, которое лежит внутри. Обёртку Promise<...>
// он снимает — ровно как await снимает её со значения в рантайме.

interface User {
  id: number;
  name: string;
}

// Слева — тип коробки, справа — что получится после распаковки:
type A = Awaited<Promise<string>>; // string  — сняли Promise<...>, внутри строка
type B = Awaited<Promise<number>>; // number  — сняли Promise<...>, внутри число
type C = Awaited<Promise<User>>;   // User    — сняли Promise<...>, внутри User

// Обратите внимание: мы НЕ вызываем никакую функцию и ничего не «ждём».
// Всё происходит в мире типов, до запуска программы. Awaited просто
// «заглядывает в коробку» и говорит, что за тип там лежит.`;

  protected readonly awaitedNested = `// Иногда коробку кладут внутрь другой коробки: Promise<Promise<X>>.
// В рантайме await и такое разворачивает до конца (промисы «сплющиваются»).
// Awaited делает то же самое на уровне типов — снимает ВСЕ обёртки разом,
// сколько бы их ни было вложено. Это называется «рекурсивная распаковка».

type Once  = Awaited<Promise<number>>;                   // number
type Twice = Awaited<Promise<Promise<number>>>;          // number  (сняли обе обёртки)
type Thrice = Awaited<Promise<Promise<Promise<number>>>>; // number  (сняли все три)

// Сколько бы коробок ни было вложено друг в друга — Awaited дойдёт
// до самого «ядра» и вернёт тип значения, которое там лежит.`;

  protected readonly awaitedNonPromise = `// А что, если передать в Awaited тип, который ВОВСЕ не коробка?
// Например, обычное число. Тогда разворачивать нечего — распаковывать
// нечего, и Awaited просто возвращает тот же тип без изменений.

type P = Awaited<number>;  // number  — не промис, отдаём как есть
type Q = Awaited<string>;  // string  — не промис, отдаём как есть
type R = Awaited<boolean>; // boolean — не промис, отдаём как есть

// Это удобно: Awaited можно смело применять там, где заранее не знаешь,
// промис перед тобой или уже «голое» значение. Если обёртки нет —
// Awaited ничего не сломает и вернёт исходный тип.`;

  protected readonly asyncReturnsPromise = `// Ключевой факт про async: асинхронная функция ВСЕГДА возвращает Promise.
// Даже если в теле функции вы возвращаете обычный объект, TypeScript
// автоматически «заворачивает» результат в коробку Promise<...>.

interface User {
  id: number;
  name: string;
}

// Мы пишем 'return { ... }', как будто отдаём User напрямую...
async function fetchUser(): Promise<User> {
  return { id: 1, name: 'Анна' };
}

// ...но фактический тип того, что отдаёт fetchUser, — это Promise<User>.
// Слово async превратило User в Promise<User> за нас.
const result = fetchUser(); // тип result: Promise<User> (коробка, не User)`;

  protected readonly returnTypeAlone = `// Теперь вспомним ReturnType<T> — утилита, которая достаёт тип
// РЕЗУЛЬТАТА функции (подробнее — на странице про типы функций).
// Применим её к нашей асинхронной fetchUser и посмотрим, что выйдет.

interface User {
  id: number;
  name: string;
}

async function fetchUser(): Promise<User> {
  return { id: 1, name: 'Анна' };
}

// typeof fetchUser — это ТИП самой функции. ReturnType достаёт её результат:
type Result = ReturnType<typeof fetchUser>; // Promise<User>  — а не User!

// Вот она, боль: ReturnType честно вернул то, что отдаёт функция, —
// а отдаёт она КОРОБКУ Promise<User>. Нам же обычно нужен User ВНУТРИ.
// ReturnType довёл нас до коробки, но не распаковал её.`;

  protected readonly awaitedReturnType = `// Финальный аккорд: обернём результат ReturnType в Awaited — и он
// снимет обёртку Promise<...>, оставив чистый User. Две утилиты в паре
// делают ровно то, что нужно: «взять результат функции и распаковать его».

interface User {
  id: number;
  name: string;
}

async function fetchUser(): Promise<User> {
  return { id: 1, name: 'Анна' };
}

// Читаем ИЗНУТРИ наружу, шаг за шагом:
//   1) typeof fetchUser          → тип функции
//   2) ReturnType<...>           → Promise<User>  (коробка)
//   3) Awaited<...>              → User           (распаковали коробку) ✅
type User2 = Awaited<ReturnType<typeof fetchUser>>; // User

// Теперь User2 — это готовый тип пользователя, БЕЗ обёртки Promise.
// Пример использования: функция, которая принимает уже распакованного юзера.
function greet(user: User2): string {
  return 'Привет, ' + user.name + '!';
}`;

  protected readonly practicalWhyBother = `// Зачем так делать, если можно просто написать интерфейс User руками?
// Затем, что тип «привязывается» к функции. Если завтра fetchUser начнёт
// возвращать дополнительное поле, наш выведенный тип обновится САМ —
// его не придётся править вручную в двух местах.

async function fetchProfile() {
  // никакой аннотации типа не пишем — пусть TypeScript выведет его сам
  return {
    id: 1,
    name: 'Анна',
    email: 'anna@example.com',
    isAdmin: false,
  };
}

// Profile «следует» за функцией: поменяется return — поменяется и тип.
type Profile = Awaited<ReturnType<typeof fetchProfile>>;
// Profile = { id: number; name: string; email: string; isAdmin: boolean }

function render(profile: Profile): string {
  return profile.name + ' <' + profile.email + '>'; // ✅ все поля на месте
}`;

  protected readonly promiseAllExample = `// Ещё один частый случай — распаковать результат Promise.all.
// Promise.all берёт несколько промисов и отдаёт ОДИН промис с массивом
// их результатов. Тип этого общего промиса тоже удобно распаковывать через Awaited.

function loadUser(): Promise<{ id: number; name: string }> {
  return Promise.resolve({ id: 1, name: 'Анна' });
}
function loadSettings(): Promise<{ theme: string }> {
  return Promise.resolve({ theme: 'dark' });
}

async function loadAll() {
  return Promise.all([loadUser(), loadSettings()]);
}

// Тип того, что отдаёт loadAll, — это Promise<[{...}, {...}]>.
// Awaited снимает внешнюю обёртку и даёт готовый тип массива результатов:
type AllData = Awaited<ReturnType<typeof loadAll>>;
// AllData = [{ id: number; name: string }, { theme: string }]

function useData(data: AllData): void {
  const user = data[0];     // { id: number; name: string }
  const settings = data[1]; // { theme: string }
  console.log(user.name, settings.theme); // ✅ поля доступны, обёртки нет
}`;

  protected readonly ownImplementation = `// Awaited не встроен в компилятор — это обычный тип из стандартной
// библиотеки TypeScript (lib.es5.d.ts). Его суть умещается в строку:

// ── Awaited: «дождавшийся» ──────────────────────────────────────
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;
//                            └─ шаблон:      │      │         └─ не коробка?
//                            «коробка,       │      │            вернём как есть
//                             а внутри V»    │      └─ РЕКУРСИЯ: спросим ещё раз
//                                            └─ подошло? снимаем обёртку

// Два ключевых момента:
// 1) infer V — «дырка» в шаблоне: компилятор сам подставит сюда то,
//              что лежит внутри Promise.
// 2) MyAwaited<V> вместо простого V — тип ВЫЗЫВАЕТ САМ СЕБЯ.
//    Снял одну обёртку → задай тот же вопрос содержимому.
//    Именно так «матрёшка» промисов схлопывается до дна.

type A = MyAwaited<Promise<string>>;
// 1) Promise<string> — коробка? да, внутри string
// 2) MyAwaited<string> — коробка? нет → возвращаем string
// → string   ✅

type B = MyAwaited<Promise<Promise<number>>>;
// коробка → коробка → number
// → number  ✅ (без рекурсии здесь осталось бы Promise<number>)

type C = MyAwaited<number>;
// не коробка, разворачивать нечего
// → number  ✅

// ── Как это написано во встроенной версии ───────────────────────
// Скелет тот же — «есть обёртка? сними и повтори», — но проверяется
// не сам Promise, а наличие метода then: так распаковывается ЛЮБОЙ
// «промисоподобный» объект, а не только настоящий Promise.
type RealAwaited<T> = T extends null | undefined
  ? T // отдельный случай: пустые значения оставляем как есть
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any
      ? RealAwaited<V> // та же рекурсия, что и в нашей однострочной версии
      : never
    : T; // не промисоподобный — возвращаем без изменений`;
}
