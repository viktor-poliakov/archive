import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-type-aliases',
  imports: [CodeBlock, RouterLink],
  templateUrl: './type-aliases.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesTypeAliases {
  protected readonly basicAliasExample = `// type даёт КОРОТКОЕ ИМЯ (псевдоним) уже существующему типу.
// Слева — новое имя, справа после = — тот тип, который называем.
type ID = string;

// Теперь ID можно ставить вместо string — читается понятнее:
let userId: ID = 'u-42';    // это по сути обычная строка
let productId: ID = 'p-100';

userId = 100; // ❌ Type 'number' is not assignable to type 'string'
              //    ID — это всё тот же string, число не подходит`;

  protected readonly aliasVsInterfaceExample = `// interface — ОПИСАНИЕ формы объекта. Знака = нет, тело сразу в скобках:
interface UserI {
  name: string;
  age: number;
}

// type — ПРИСВАИВАНИЕ имени типу. Есть знак = , как у переменной:
type UserT = {
  name: string;
  age: number;
};

// Для формы объекта оба варианта почти равнозначны.
// Но у type есть знак = , и он умеет называть НЕ только объекты (см. ниже).`;

  protected readonly objectAliasExample = `// Псевдоним для формы объекта работает так же, как интерфейс.
type User = {
  name: string;
  age: number;
};

const anna: User = { name: 'Аня', age: 30 }; // OK
const bob: User = { name: 'Боря' };          // ❌ Property 'age' is missing
                                             //    в User поле age обязательно

// Имя User можно ставить всюду, где ждут тип:
function greet(u: User): string {
  return \`Привет, \${u.name}!\`;
}`;

  protected readonly primitiveAliasExample = `// Псевдоним можно дать даже примитиву — просто более говорящее имя.
// interface так НЕ умеет: он только про объекты.
type Age = number;
type Email = string;
type Celsius = number;

let temperature: Celsius = 21;  // читается лучше, чем просто number
let contact: Email = 'a@b.ru';

// ВАЖНО: это не новый тип, а СИНОНИМ. Age и number взаимозаменяемы:
let years: Age = 30;
let n: number = years;          // OK — Age это и есть number`;

  protected readonly unionAliasExample = `// Самое частое применение type — имя для ОБЪЕДИНЕНИЯ (union).
// Очень практично, а interface так вообще не умеет.
type Status = 'idle' | 'loading' | 'done' | 'error';

let state: Status = 'idle'; // OK — одно из перечисленных значений
state = 'loading';          // OK
state = 'ready';            // ❌ Type '"ready"' is not assignable to type 'Status'
                            //    'ready' нет в списке допустимых значений

// Одно имя Status переиспользуем по всему проекту:
function render(s: Status): void {
  // ...
}`;

  protected readonly tupleAliasExample = `// Псевдоним для КОРТЕЖА — массива фиксированной длины с типом на каждой позиции.
type Point = [number, number];       // [x, y]
type RGB = [number, number, number]; // [красный, зелёный, синий]

const start: Point = [0, 0];      // OK
const pixel: RGB = [255, 128, 0]; // OK

const bad: Point = [0]; // ❌ Source has 1 element(s) but target requires 2
                        //    у Point ровно две координаты`;

  protected readonly functionAliasExample = `// Псевдоним для ТИПА ФУНКЦИИ — что она принимает и что возвращает.
type Handler = (event: string) => void;

const onClick: Handler = (event) => {
  console.log('Событие:', event);
};

// Такой тип удобно переиспользовать для всех колбэков одного вида:
function subscribe(cb: Handler): void {
  cb('click');
}`;

  protected readonly intersectionAliasExample = `// Композиция: пересечение через & — «сложить поля нескольких типов вместе».
type User = {
  name: string;
  age: number;
};

// Admin — это User ПЛЮС ещё поле role:
type Admin = User & { role: string };

const boss: Admin = {
  name: 'Аня',
  age: 40,
  role: 'superadmin', // OK — есть поля и User, и { role }
};

const guest: Admin = { name: 'Гость', age: 20 };
// ❌ Property 'role' is missing — & требует поля ОБОИХ типов`;

  protected readonly runtimeErasedExample = `// Псевдоним существует ТОЛЬКО на этапе проверки типов.
// После компиляции в JavaScript от него не остаётся ни следа.
type User = { name: string };

const anna: User = { name: 'Аня' };

console.log(typeof User);
// ❌ 'User' only refers to a type, but is being used as a value
//    type — это не значение, в рантайме его нет

// В скомпилированном .js останется лишь:
//   const anna = { name: 'Аня' };
// строки "type User = ..." там просто не будет.`;

  protected readonly practiceStatusExample = `// ПРАКТИКА 1. Статус загрузки как union-псевдоним.
type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

function statusText(s: LoadStatus): string {
  if (s === 'loading') return 'Загружаем…';
  if (s === 'success') return 'Готово!';
  if (s === 'error') return 'Ошибка';
  return 'Ожидание';
}

statusText('loading'); // 'Загружаем…'
statusText('done');    // ❌ 'done' не входит в LoadStatus`;

  protected readonly practicePointExample = `// ПРАКТИКА 2. Координата как кортеж, обработчик клика как тип функции.
type Coord = [number, number];
type ClickHandler = (point: Coord) => void;

const onMapClick: ClickHandler = ([x, y]) => {
  console.log(\`Клик по (\${x}, \${y})\`);
};

onMapClick([10, 25]); // OK
onMapClick([10]);     // ❌ у Coord должно быть ровно две координаты`;

  protected readonly practiceUserExample = `// ПРАКТИКА 3. Пользователь и админ: объект + пересечение.
type User = {
  id: string;
  name: string;
};

type Admin = User & { role: 'admin' | 'owner' };

const u: User = { id: 'u1', name: 'Аня' };
const a: Admin = { id: 'a1', name: 'Боря', role: 'admin' };

const bad: Admin = { id: 'a2', name: 'Вера' };
// ❌ Property 'role' is missing — Admin требует ещё и role`;
}
