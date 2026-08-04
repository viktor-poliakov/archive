import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-declaration-files',
  imports: [CodeBlock, RouterLink],
  templateUrl: './declaration-files.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesDeclarationFiles {
  protected readonly simpleDts = `// Файл user.d.ts — «меню», а не «кухня».
// Здесь ТОЛЬКО описания типов: какие есть формы данных и функции.
// Обратите внимание: ни одной строки работающего кода — только объявления.

// Форма объекта-пользователя.
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

// Объявление функции: известны её имя, аргументы и результат —
// но БЕЗ тела. Слово declare как раз и значит «это существует
// где-то ещё, просто опиши мне его тип».
declare function getUser(id: number): User;

// Объявление переменной, которая где-то уже создана.
declare const appVersion: string;`;

  protected readonly noBodyError = `// В .d.ts НЕЛЬЗЯ писать реализацию — это «меню», а не «кухня».
// Стоит добавить тело функции — и компилятор ругается:

declare function add(a: number, b: number): number {
  return a + b;
}
// ❌ An implementation cannot be declared in ambient contexts.
// Перевод: «в ambient-контексте (а весь .d.ts именно такой)
// реализацию объявлять нельзя». Оставляйте только заголовок:
declare function add(a: number, b: number): number; // ✅ так правильно`;

  protected readonly mathJs = `// math.js — НАСТОЯЩИЙ рабочий код на чистом JavaScript.
// Здесь есть тела функций, они реально что-то вычисляют.
// Но типов тут нет: JS про них ничего не знает.

export function add(a, b) {
  return a + b;
}

export function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export const PI = 3.14159;`;

  protected readonly mathDts = `// math.d.ts — «карточка блюда»: описываем ТИПЫ того, что лежит в math.js.
// Имена здесь обязаны совпадать с реальными экспортами из math.js.
// Реализации нет — только формы: какие аргументы и что вернётся.

export function add(a: number, b: number): number;
export function roundTo(value: number, digits: number): number;
export const PI: number;`;

  protected readonly mathConsumer = `// Потребитель импортирует ОБЫЧНЫЙ math.js —
// про .d.ts он даже не пишет напрямую.
// TypeScript сам находит math.d.ts рядом с math.js и берёт типы оттуда.
import { add, roundTo, PI } from './math.js';

const sum = add(2, 3);          // ✅ тип sum: number
const rounded = roundTo(3.14159, 2); // ✅ тип: number, автодополнение работает

add('2', 3);
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
// Хотя сам math.js на чистом JS — типы из math.d.ts уже защищают нас.

PI.toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'number'.`;

  protected readonly generatedDts = `// Ваш исходник lib.ts (пишете вы):
export function greet(name: string): string {
  return \`Привет, \${name}!\`;
}

// После сборки с опцией "declaration": true компилятор кладёт рядом ДВА файла:

// 1) lib.js — рабочий код, который реально выполняется:
//    export function greet(name) { return \`Привет, \${name}!\`; }

// 2) lib.d.ts — типы, СГЕНЕРИРОВАННЫЕ автоматически из вашего lib.ts:
//    export declare function greet(name: string): string;

// Именно так библиотеки, написанные на TypeScript,
// отдают типы всем, кто их подключает: код в .js, типы в .d.ts.`;

  protected readonly moduleDts = `// forms.d.ts — МОДУЛЬНЫЙ файл объявлений.
// Признак: есть верхнеуровневый export (или import).
// Такой файл — модуль: его типы видны ТОЛЬКО после импорта.
export interface FormConfig {
  action: string;
  method: 'GET' | 'POST';
}

export declare function buildForm(config: FormConfig): HTMLFormElement;

// Использование — обязательно через import:
// import { FormConfig } from './forms';
// FormConfig без импорта будет «не найден».`;

  protected readonly globalDts = `// globals.d.ts — ГЛОБАЛЬНЫЙ (ambient) файл объявлений.
// Признак: НЕТ ни одного верхнеуровневого import/export.
// Тогда всё внутри видно ВЕЗДЕ в проекте — без всякого импорта.

// Описываем переменную, которую в рантайм добавил, например, скрипт в index.html:
declare const APP_ENV: 'dev' | 'prod';

// Расширяем глобальный объект window новым полем:
interface Window {
  myWidget: {
    open(): void;
    close(): void;
  };
}

// Теперь в ЛЮБОМ файле проекта — без import — доступно:
// if (APP_ENV === 'prod') { ... }
// window.myWidget.open();`;

  protected readonly moduleVsGlobal = `// Один и тот же по смыслу файл — но поведение РАЗНОЕ из-за одной строки.

// ── Вариант А: МОДУЛЬ (есть export) ──
// theme.d.ts
export type Theme = 'light' | 'dark';
// Чтобы взять Theme, нужен импорт:
//   import { Theme } from './theme';

// ── Вариант Б: ГЛОБАЛЬ (нет ни import, ни export) ──
// theme.d.ts
type Theme = 'light' | 'dark';
// Theme доступен сразу везде, импорт не нужен и невозможен.

// Мораль: наличие даже одного export наверху файла
// превращает весь .d.ts из «глобального» в «модульный».`;

  protected readonly packageJson = `{
  "name": "cool-lib",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}`;

  protected readonly tsconfigDecl = `{
  "compilerOptions": {
    "declaration": true,
    "outDir": "dist"
  }
}`;
}
