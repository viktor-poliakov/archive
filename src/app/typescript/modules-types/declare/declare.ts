import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-declare',
  imports: [CodeBlock, RouterLink],
  templateUrl: './declare.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesDeclare {
  protected readonly problemNoDeclare = `// Сборщик (Vite, Webpack) на этапе сборки подставляет вместо слова
// VERSION реальную строку — например "1.4.0". В рантайме значение ЕСТЬ.
// Но в исходном коде переменная VERSION нигде не объявлена,
// поэтому компилятор её «не видит» и ругается:

const banner = 'Версия приложения: ' + VERSION;
// ❌ Cannot find name 'VERSION'. (TS2304)

// То же самое со скриптом аналитики, подключённым тегом <script>
// в index.html. Функция gtag появляется в window во время работы,
// но в .ts-коде её никто не объявлял:

gtag('event', 'page_view');
// ❌ Cannot find name 'gtag'. (TS2304)`;

  protected readonly declareConst = `// Решение — ОБЪЯВИТЬ эти вещи, ничего не создавая.
// declare = «поверь на слово: такое имя уже существует, и вот его тип».
// Ниже нет присваивания значения — только обещание, что VERSION есть
// и это строка. Реализацию (реальное значение) даст кто-то другой.

declare const VERSION: string;

const banner = 'Версия приложения: ' + VERSION;
// ✅ ошибки больше нет: компилятор верит, что VERSION — строка,
//    и даже подсказывает строковые методы: VERSION.toUpperCase()`;

  protected readonly forms = `// Формы ambient-объявлений. Общее правило: пишем ТОЛЬКО тип,
// без тела и без значения — реализация живёт где-то снаружи.

// 1. Переменные — как обычные const/let/var, но без "= значение".
declare const VERSION: string;
declare let currentUser: string;
declare var legacyGlobal: number;

// 2. Функция — ТОЛЬКО сигнатура (имя, аргументы, тип результата).
//    Фигурных скобок с телом НЕТ:
declare function track(event: string, data?: object): void;

// 3. Класс — только «форма»: поля и сигнатуры методов, без реализации.
declare class Widget {
  id: string;
  constructor(id: string);
  render(): void;
}

// 4. Пространство имён — описываем структуру внешнего объекта.
declare namespace analytics {
  function init(key: string): void;
  const version: string;
}`;

  protected readonly functionNoBody = `// Важно: у declare-функции тела быть НЕ МОЖЕТ — это только описание.
// Мы обещаем, ЧТО функция есть и КАКАЯ она, но не КАК она устроена.

declare function track(event: string): void; // ✅ только сигнатура

declare function track2(event: string): void {
  console.log(event); // ❌ An implementation cannot be
}                      //    declared in ambient contexts. (TS1183)
//   ↑ добавили тело в declare — ошибка. Тело реализует кто-то другой.`;

  protected readonly noOutput = `// Файл до компиляции (TypeScript):
declare const VERSION: string;
declare function track(event: string): void;

console.log(VERSION);
track('start');

// ────────────────────────────────────────────────
// Тот же файл ПОСЛЕ компиляции (JavaScript, .js):

console.log(VERSION);
track('start');

// Строчки с declare ИСЧЕЗЛИ полностью. Их в собранном коде нет —
// они существовали только для компилятора, как заметки на полях.
// А вот console.log и track остались: их реализацию должен
// обеспечить кто-то снаружи (сборщик, <script>, другая библиотека).`;

  protected readonly declareGlobal = `// Частая задача: добавить СВОЁ поле в глобальный объект window.
// Виджет положил себя в window.myWidget во время работы, и мы хотим
// обращаться к window.myWidget без ошибки типов.

// Без объявления TypeScript не знает о таком поле:
window.myWidget.open();
// ❌ Property 'myWidget' does not exist on type 'Window & typeof globalThis'.

// declare global открывает глобальную область и ДОПОЛНЯЕТ уже
// существующий интерфейс Window новым полем (это слияние объявлений):
export {}; // ← эта строка делает файл модулем (см. пояснение ниже)

declare global {
  interface Window {
    myWidget: { open(): void; close(): void };
  }
}

window.myWidget.open();  // ✅ теперь поле известно и есть автодополнение
window.myWidget.close(); // ✅`;

  protected readonly globalNeedsModule = `// Тонкость: declare global работает ТОЛЬКО внутри файла-МОДУЛЯ,
// то есть файла, где есть хотя бы один import или export.

// В обычном скрипте (без import/export) будет ошибка:
declare global {
  interface Window { myWidget: object }
}
// ❌ Augmentations for the global scope can only be directly nested
//    in external modules or ambient module declarations. (TS2669)

// Лечится одной строкой — пустым экспортом, который превращает
// файл в модуль, ничего при этом не экспортируя наружу:
export {};`;

  protected readonly gtagPractice = `// Полный практический пример: типизируем внешний скрипт аналитики.
// В index.html подключён <script src="...gtag.js">, который кладёт
// в глобальную область функцию gtag. В нашем .ts-коде её нет.

// БЕЗ объявления — красная волна и никакого автодополнения:
gtag('event', 'purchase', { value: 999 });
// ❌ Cannot find name 'gtag'. (TS2304)

// Объявляем её как глобальную функцию — тело не пишем, только сигнатуру.
// Теперь компилятор «видит» gtag, проверяет аргументы и подсказывает вызов:
declare function gtag(command: string, ...args: unknown[]): void;

gtag('event', 'purchase', { value: 999 }); // ✅ компилируется, есть подсказки
gtag(123);
// ❌ Argument of type 'number' is not assignable to parameter
//    of type 'string'. — тип аргумента проверяется как обычно`;

  protected readonly promiseCanLie = `// declare — это ОБЕЩАНИЕ, а не проверка. Компилятор верит на слово
// и ничего не проверяет в рантайме — ровно как приведение as.

declare const gtag: (command: string, ...args: unknown[]) => void;

// Мы поклялись, что gtag существует. Но если <script> с аналитикой
// не подключён (или ещё не загрузился), в рантайме gtag будет undefined:
gtag('event', 'click');
// Компилятор молчит ✅, а в браузере:
// ❌ Uncaught ReferenceError: gtag is not defined  (или "gtag is not a function")

// Тот же риск, что у as: обещали то, чего в рантайме нет — программа упадёт.
// Объявляйте только то, что реально появляется в окружении.`;
}
