import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-namespaces',
  imports: [CodeBlock, RouterLink],
  templateUrl: './namespaces.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesNamespaces {
  protected readonly whatIsNamespace = `// namespace — «подписанный ящик»: он держит родственные вещи вместе
// под одним именем, чтобы имена внутри не сталкивались с чужими.
namespace Geometry {
  // Наружу видно ТОЛЬКО то, что помечено словом export.
  export interface Point {
    x: number;
    y: number;
  }

  export function area(width: number, height: number): number {
    return width * height;
  }

  // Без export — «внутренняя» вещь, снаружи её не достать.
  const version = '1.0';
}

// Снаружи к содержимому обращаемся через ИМЯ ящика и точку:
const p: Geometry.Point = { x: 0, y: 0 };
const s = Geometry.area(3, 4); // 12

// Geometry.version
// ❌ Property 'version' does not exist on type 'typeof Geometry'.
//    version не помечен export — он спрятан внутри ящика.`;

  protected readonly hiddenMembers = `namespace Auth {
  // Внутренний помощник — деталь реализации, наружу не торчит.
  function hash(password: string): string {
    return '***' + password.length;
  }

  // Публичная функция — ею пользуются снаружи, поэтому export.
  export function login(user: string, password: string): boolean {
    const secret = hash(password); // hash доступен ВНУТРИ ящика
    return secret.length > 0 && user.length > 0;
  }
}

Auth.login('anna', '1234'); // ✅ login помечен export — виден снаружи

// Auth.hash('1234')
// ❌ Property 'hash' does not exist — hash без export, он приватный.`;

  protected readonly historyGlobal = `// Как было ДО ES-модулей. Несколько файлов подключали тегами <script>,
// и все они сливались в ОДНУ общую (глобальную) область.
// Любая переменная верхнего уровня становилась глобальной — файлы
// «видели» друг друга, а одинаковые имена ЗАТИРАЛИ друг друга.

// файл users.js
var data = ['Анна', 'Борис']; // глобальная переменная data

// файл products.js
var data = ['Молоко', 'Хлеб'];
// ❌ ТА ЖЕ глобальная data — второй файл затёр первый. Коллизия имён!`;

  protected readonly historyNamespaceFix = `// namespace (раньше их звали «внутренними модулями», internal modules)
// решал эту боль: каждый набор кода прятали в свой «ящик»,
// и глобальными оставались только имена самих ящиков.

namespace Users {
  export const data = ['Анна', 'Борис'];
}

namespace Products {
  export const data = ['Молоко', 'Хлеб'];
}

// Теперь два разных data мирно живут рядом — они в РАЗНЫХ ящиках:
Users.data;    // ['Анна', 'Борис']
Products.data; // ['Молоко', 'Хлеб']
// Глобально «торчат» только имена Users и Products, а не сами data.`;

  protected readonly modernModules = `// Современный способ — ES-МОДУЛИ. Один файл = один модуль = свой «ящик».
// Заводить ящик руками больше НЕ нужно: каждый файл изолирован сам по себе.

// файл users.ts  — здесь свой data, наружу уйдёт только export
export const data = ['Анна', 'Борис'];

function helper() {} // без export — приватно для файла, как раньше приватный член ящика

// файл products.ts — здесь СВОЙ data, он никак не столкнётся с чужим
export const data = ['Молоко', 'Хлеб'];

// файл app.ts — берём именно то, что нужно, явным импортом:
import { data as users } from './users';
import { data as products } from './products';
// Никаких коллизий: имена приходят по явным путям, а не из общей свалки.`;

  protected readonly dontMix = `// НЕ смешивайте модули и namespace для организации кода.
// Как только в файле есть import или export — это уже модуль,
// и оборачивать содержимое ещё и в namespace бессмысленно:

// плохо: лишний ящик поверх модуля
export namespace Utils {
  export function sum(a: number, b: number): number {
    return a + b;
  }
}
// пользователю приходится писать двойной путь: import { Utils } ... Utils.sum(...)

// хорошо: модуль сам по себе — уже пространство имён
export function sum(a: number, b: number): number {
  return a + b;
}
// на другой стороне: import { sum } from './utils'; sum(1, 2);`;

  protected readonly globalDts = `// Уместный случай №1: глобальный .d.ts для старой библиотеки,
// которую подключают тегом <script> и она кладёт себя в глобальную
// переменную (например, window.MyLib). namespace группирует её типы.

// файл my-lib.d.ts
declare namespace MyLib {
  interface Options {
    debug: boolean;
    timeout: number;
  }

  function init(options: Options): void;
  function version(): string;
}

// В любом файле проекта, без импорта, MyLib доступна как глобальная:
MyLib.init({ debug: true, timeout: 1000 });
const v: string = MyLib.version();`;

  protected readonly mergingFunction = `// Уместный случай №2: слияние объявлений — function + namespace
// с ОДНИМ именем сливаются. Так к функции «прикрепляют» свойства.

// Само значение — функция, которую можно вызвать:
function greet(name: string): string {
  return 'Привет, ' + name;
}

// namespace с тем же именем добавляет функции статические поля:
namespace greet {
  export const lang = 'ru';
  export function formal(name: string): string {
    return 'Уважаемый(ая) ' + name;
  }
}

greet('Анна');        // ✅ вызвали как функцию
greet.lang;           // ✅ 'ru' — свойство, «приклеенное» через namespace
greet.formal('Анна'); // ✅ 'Уважаемый(ая) Анна'
// Подробнее про этот механизм — на странице «Слияние объявлений».`;

  protected readonly nesting = `// namespace можно вкладывать друг в друга — как папки внутри папок.
namespace App {
  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
  }

  export namespace Utils {
    export function log(msg: string): void {
      console.log('[App]', msg);
    }
  }
}

// Обращаемся по цепочке имён через точку:
const u: App.Models.User = { id: 1, name: 'Анна' };
App.Utils.log('готово');

// Длинные цепочки утомляют — можно завести короткий псевдоним:
import Models = App.Models; // это import-псевдоним TS, не ES-импорт
const u2: Models.User = { id: 2, name: 'Борис' };`;
}
