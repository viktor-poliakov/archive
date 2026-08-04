import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesPitfalls {
  protected readonly forgotImportType = `// user.ts — модуль экспортирует И тип, И обычную функцию с побочным эффектом
export interface User {
  id: number;
  name: string;
}

console.log('модуль user.ts выполнился!'); // побочный эффект при импорте

export function saveUser(u: User) {
  /* ... */
}`;

  protected readonly forgotImportTypeUse = `// main.ts — нам нужен ТОЛЬКО тип User (аннотация), функция не используется.
import { User } from './user';
//     ^^^^ обычный импорт значения — а значит модуль ./user
//          реально ЗАГРУЗИТСЯ в рантайме и напечатает 'модуль user.ts выполнился!'

function render(u: User) {
  return u.name;
}

// Хотя User нужен только как тип, лишний модуль подтянулся в бандл
// и выполнил свой код. При сборке большого приложения таких «хвостов»
// набегает много — и лишний вес, и неожиданные побочные эффекты.`;

  protected readonly forgotImportTypeFix = `// Правильно: помечаем чисто-типовой импорт как import type.
// Такой импорт СТИРАЕТСЯ при компиляции — в JavaScript его не будет,
// модуль ./user не загрузится, побочный эффект не сработает.
import type { User } from './user';

// Если из модуля берём и тип, и значение — помечаем только тип:
import { saveUser, type User } from './user';

function render(u: User) {
  return u.name;
}`;

  protected readonly forgotImportTypeError = `// А при опции verbatimModuleSyntax забытый import type —
// это уже не «лишний вес», а прямая ОШИБКА КОМПИЛЯЦИИ:
import { User } from './user';
// ❌ error TS1484: 'User' is a type and must be imported using
//    a type-only import when 'verbatimModuleSyntax' is enabled.

// Лечится тем же import type:
import type { User } from './user'; // ✅`;

  protected readonly declarePromise = `// analytics.d.ts (или declare прямо в коде) — мы ОПИСЫВАЕМ переменную gtag,
// которую якобы добавляет на страницу внешний скрипт Google Analytics.
// declare — это ОБЕЩАНИЕ компилятору «поверь, снаружи это есть», без проверки.
declare const gtag: (command: string, ...args: unknown[]) => void;

// В коде спокойно пользуемся — компилятор доверяет описанию:
gtag('event', 'page_view'); // ✅ ошибок компиляции нет`;

  protected readonly declarePromiseRuntime = `// Но если тег <script> с gtag НЕ подключён на странице (забыли вставить,
// заблокировал адблок, опечатка в URL) — в рантайме переменной нет:
gtag('event', 'page_view');
// 💥 Uncaught ReferenceError: gtag is not defined
//
// Компилятор молчал, потому что declare — это слово, а не проверка.
// Ровно как приведение as: вы ПООБЕЩАЛИ, что нечто существует и имеет
// такой тип, но за правдивость обещания отвечаете сами.`;

  protected readonly declarePromiseFix = `// Правильно №1: убедиться, что описанное ДЕЙСТВИТЕЛЬНО подключено
// (тег <script> стоит, имя совпадает буква в букву).

// Правильно №2: если существование под вопросом — не обещать, а ПРОВЕРЯТЬ.
// Описываем как «может отсутствовать» и смотрим перед вызовом:
declare const gtag: ((command: string, ...args: unknown[]) => void) | undefined;

if (typeof gtag === 'function') {
  gtag('event', 'page_view'); // ✅ вызовем, только если gtag реально есть
}

// Внешние данные и внешние объекты вообще всегда проверяют в рантайме,
// а не «назначают» им тип обещанием.`;

  protected readonly globalDtsBefore = `// globals.d.ts — ГЛОБАЛЬНЫЙ файл объявлений (нет ни import, ни export).
// Такой файл добавляет объявления сразу во ВСЁ приложение — их видно
// в любом файле без всякого импорта. Это «ambient» (окружающие) объявления.

interface Window {
  appVersion: string;
}

declare const API_URL: string;

// В любом файле проекта теперь можно писать:
// window.appVersion  ✅
// API_URL            ✅  — глобально видно везде`;

  protected readonly globalDtsAfter = `// А теперь кто-то добавил в НАЧАЛО того же файла одну строчку import —
// например, чтобы переиспользовать чужой тип:
import { Theme } from './theme';
//   ^^^ верхнеуровневый import/export ПРЕВРАЩАЕТ файл в модуль!

interface Window {
  appVersion: string;
}

declare const API_URL: string;

// Файл стал модулем — и все объявления выше «спрятались» внутрь него.
// Теперь в других файлах:
// window.appVersion  ❌ Property 'appVersion' does not exist on type 'Window'
// API_URL            ❌ Cannot find name 'API_URL'.
// Глобальные объявления внезапно ПРОПАЛИ. Очень частая путаница.`;

  protected readonly globalDtsFix = `// Правило простое: есть верхнеуровневый import или export → файл стал модулем,
// и всё в нём — локальное. Два способа сохранить глобальность:

// Способ 1 — не добавлять import/export в глобальный .d.ts вообще
// (держать его чисто-декларативным).

// Способ 2 — если импорт нужен, оборачивать глобальные объявления в
// declare global { ... } (это работает только внутри модуля):
import { Theme } from './theme';

declare global {
  interface Window {
    appVersion: string;
    theme: Theme;
  }
  const API_URL: string;
}

export {}; // делает файл модулем осознанно, если других import/export нет
// Теперь window.appVersion, window.theme и API_URL снова видны глобально ✅`;

  protected readonly typeNoMerge = `// Пытаемся «дополнить» тип-алиас, объявив его ещё раз с новым полем.
type Settings = {
  theme: string;
};

type Settings = {
  // ❌ error TS2300: Duplicate identifier 'Settings'.
  fontSize: number;
};

// type НЕ сливается: два объявления с одним именем — это конфликт,
// а не «сложение». Компилятор считает это ошибкой.`;

  protected readonly interfaceMerges = `// А вот два interface с одинаковым именем сливаются в один —
// это называется слияние объявлений (declaration merging).
interface Settings {
  theme: string;
}

interface Settings {
  fontSize: number; // ✅ добавилось к тому же Settings
}

// Итоговый Settings = { theme: string; fontSize: number } — поля сложились:
const s: Settings = { theme: 'dark', fontSize: 14 }; // ✅

// Именно на слиянии interface (и namespace) держится расширение
// чужих типов — augmentation. С type это невозможно.`;

  protected readonly augmentType = `// Библиотека express экспортирует тип Request. Хотим добавить в него
// СВОЁ поле user (его кладёт наш middleware). Пробуем «в лоб» — не выйдет,
// если бы Request был type-алиасом: повторное объявление = Duplicate identifier.

// Расширение работает через interface + module augmentation:
import 'express'; // импорт делает файл модулем (без него augmentation не сработает)

declare module 'express' {
  interface Request {
    user?: { id: number; name: string }; // сливается с интерфейсом Request из express
  }
}

// Теперь во всём проекте:
// req.user?.name  ✅ — поле добавлено к библиотечному Request`;

  protected readonly augmentFail = `// Две типичные причины, по которым augmentation «молча не работает».

// Причина 1 — файл НЕ является модулем (в нём нет ни одного import/export).
// Тогда declare module трактуется иначе, и слияния с реальным модулем нет.
declare module 'express' {
  interface Request {
    user?: { id: number };
  }
}
// ❌ ничего не расширилось: добавьте вверху import 'express'; или export {};

// Причина 2 — имя в declare module не совпадает с тем, что реально импортируют.
declare module 'Express' {   // ← неверный регистр
  interface Request { user?: { id: number } }
}
// В коде импортируют 'express' (маленькими). 'Express' — ДРУГОЙ, несуществующий
// модуль, и augmentation уходит «в пустоту». Имя должно совпадать буква в букву.`;

  protected readonly typesMismatch = `// package.json: библиотека lodash версии 4, а типы поставили от другой версии.
// npm i lodash@4.17.21
// npm i -D @types/lodash@4.14.150   // ← типы описывают немного другой набор API

import { chunk } from 'lodash';

// @types обещает метод, которого в вашей установленной версии нет:
someLodashHelper();
// ✅ компилятор молчит (в типах метод есть)
// 💥 TypeError: someLodashHelper is not a function (в рантайме его нет)

// Или наоборот: в свежей библиотеке метод появился, а старые @types про него
// не знают — тогда компилятор ЗАПРЕЩАЕТ вызывать реально существующий метод.`;

  protected readonly typesMismatchFix = `// Правильно №1: держать версии согласованными. Многие @types повторяют
// мажорную/минорную версию библиотеки — подбирайте близкую:
// npm i lodash@4.17.21
// npm i -D @types/lodash@4.17.x

// Правильно №2: если библиотека УЖЕ поставляет свои типы (в ней есть .d.ts,
// в package.json указан "types"/"typings") — отдельный пакет @types НЕ нужен
// и может конфликтовать. Проверить просто:
// npm ls @types/some-lib   // если типы встроены — этот пакет лишний, удалите.`;

  protected readonly namespaceBad = `// Устаревший стиль: организовывать код проекта через namespace.
// Всё складывают в одно «пространство имён», обращаются через точку.
namespace Utils {
  export function formatDate(d: Date): string {
    return d.toISOString();
  }
  export function parseDate(s: string): Date {
    return new Date(s);
  }
}

// Использование: Utils.formatDate(new Date())
// Проблема: сборщик не может выкинуть неиспользуемое (parseDate уедет
// в бандл, даже если нигде не нужен) — tree-shaking не работает.`;

  protected readonly namespaceGood = `// Современный стиль: файл = модуль. Экспортируем то, что нужно, по отдельности.
// utils.ts
export function formatDate(d: Date): string {
  return d.toISOString();
}
export function parseDate(s: string): Date {
  return new Date(s);
}

// main.ts — импортируем ровно то, что используем:
import { formatDate } from './utils';
// parseDate не импортирован → сборщик выкинет его из бандла (tree-shaking) ✅

// Namespace в проекте на модулях почти не нужен: он дублирует роль модулей
// и мешает оптимизациям. Его законное место — старые .d.ts и глобальные типы.`;

  protected readonly legacyExport = `// ЛЕГАСИ-синтаксис из мира CommonJS/TS-старого:
// экспорт «всего модуля одним значением» через export =
// helper.ts
function helper() {
  return 42;
}
export = helper; // ← старый TS-синтаксис под module.exports = ...

// Импорт такого экспорта тоже особый — import x = require(...):
import helper = require('./helper');
helper(); // 42`;

  protected readonly legacyImportFix = `// Не смешивайте export = / import = require с современным ES import/export
// в одном модуле — это разные модельные системы, и компилятор ругается:
// ❌ error TS1202: Import assignment cannot be used when targeting
//    ECMAScript modules. Consider using 'import * as ns from ...' instead.

// Современный код пишите на ES-синтаксисе:
export default function helper() {
  return 42;
}
// ...и импортируйте так:
import helper from './helper';

// Если приходится работать со СТАРОЙ библиотекой на module.exports = ...,
// включите опцию esModuleInterop — тогда обычный default-import
// корректно «подружится» с CommonJS-экспортом, и import = require не нужен.`;
}
