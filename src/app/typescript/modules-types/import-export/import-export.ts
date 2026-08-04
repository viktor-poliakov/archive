import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-import-export',
  imports: [CodeBlock, RouterLink],
  templateUrl: './import-export.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesImportExport {
  protected readonly exportType = `// файл: user.ts
// Тип экспортируется точно так же, как функция или переменная —
// обычным словом export. Никакой отдельной магии для типов не нужно.
export interface User {
  id: number;
  name: string;
}

// В том же файле можно экспортировать и type-алиас, и enum, и класс:
export type UserId = number;`;

  protected readonly importType = `// файл: profile.ts
// Импортируем тип ровно так же, как импортировали бы функцию:
// фигурные скобки и имя. Внешне не отличить импорт типа от импорта значения.
import { User } from './user';

function greet(user: User): string {
  return 'Привет, ' + user.name;
}

const anna: User = { id: 1, name: 'Анна' };
greet(anna); // ✅ тип User использован для проверки — и всё`;

  protected readonly sideEffectValue = `// файл: logger.ts
// Модуль с ПОБОЧНЫМ ЭФФЕКТОМ: он что-то делает уже при загрузке.
console.log('logger.ts загрузился!'); // выполнится, как только модуль подключат

export interface LogEntry {
  message: string;
  level: 'info' | 'error';
}

export function log(entry: LogEntry): void {
  console.log(entry.level + ': ' + entry.message);
}`;

  protected readonly sideEffectProblem = `// файл: report.ts
// Нам нужен ТОЛЬКО тип LogEntry — функцию log мы не вызываем.
import { LogEntry } from './logger';

function describe(entry: LogEntry): string {
  return entry.message;
}

// Беда: при части настроек компилятор НЕ понимает, что LogEntry —
// это только тип. Он на всякий случай оставит строку импорта в готовом .js:
//
//   import './logger';   ← осталось в собранном коде!
//
// А значит, при загрузке report.js выполнится весь logger.js,
// и в консоли внезапно всплывёт «logger.ts загрузился!».
// Мы подтянули целый файл и его побочный эффект ради одного лишь ТИПА.`;

  protected readonly importTypeSolution = `// файл: report.ts (исправленная версия)
// import type говорит прямо: «это ТОЛЬКО тип, в рантайме удали его целиком».
import type { LogEntry } from './logger';

function describe(entry: LogEntry): string {
  return entry.message;
}

// Теперь в собранном .js от этой строки НЕ останется ничего:
// import type всегда стирается без следа. logger.js не подтянется,
// его console.log не выполнится — никаких сюрпризов.`;

  protected readonly exportTypeReexport = `// файл: models.ts
// export type — это реэкспорт ТОЛЬКО типа. Он тоже полностью стирается
// из рантайма, ровно как import type.
import type { User } from './user';

// Пробрасываем тип User наружу как часть публичного «фасада» модуля.
// Другие файлы смогут писать import type { User } from './models'.
export type { User };

// export type умеет и переименовывать при реэкспорте:
export type { User as Person };`;

  protected readonly inlineTypeModifier = `// файл: models.ts
export interface User {
  id: number;
  name: string;
}

export function createUser(name: string): User {
  return { id: Date.now(), name };
}

// файл: app.ts
// Из одного модуля нужны И тип User, И функция createUser.
// Можно НЕ делить их на два импорта, а пометить только тип словом type
// прямо внутри фигурных скобок — это «встроенный» модификатор type.
import { type User, createUser } from './models';

const u: User = createUser('Анна');
// createUser останется в рантайме (это настоящая функция),
// а User сотрётся — благодаря пометке type перед ним.`;

  protected readonly verbatimConfig = `// tsconfig.json
{
  "compilerOptions": {
    // «verbatim» = «дословно». Пиши импорты буквально:
    // компилятор НЕ угадывает сам, что удалить, а что оставить.
    "verbatimModuleSyntax": true
  }
}`;

  protected readonly verbatimRequires = `// При verbatimModuleSyntax правило строгое:
// хочешь, чтобы импорт типа исчез в рантайме — помечай его type САМ.

import { User } from './models';
// ❌ 'User' is a type and must be imported using a type-only import
//    when 'verbatimModuleSyntax' is enabled.

// ✅ Правильно — явно пометить тип:
import type { User } from './models';

// ✅ Или встроенной пометкой, если рядом есть и значение:
import { type User, createUser } from './models';`;

  protected readonly practical = `// файл: cart.ts
// Модуль отдаёт наружу и ТИП (описание корзины), и ФУНКЦИЮ (её создание).
export interface Cart {
  items: string[];
  total: number;
}

export function createCart(): Cart {
  return { items: [], total: 0 };
}

// файл: checkout.ts
// Правильный импорт: тип берём через type, функцию — обычным импортом.
import { createCart, type Cart } from './cart';

function priceLabel(cart: Cart): string {
  return cart.total + ' ₽';
}

const cart = createCart(); // createCart — значение, живёт в рантайме
priceLabel(cart);          // Cart — только тип, в JS его не будет

// Итог в собранном .js: останется лишь import { createCart } from './cart' —
// тип Cart стёрт, ничего лишнего не подтянуто.`;
}
