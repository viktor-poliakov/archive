import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-enums-numeric',
  imports: [CodeBlock, RouterLink],
  templateUrl: './numeric.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptEnumsNumeric {
  protected readonly beforeMagicNumbers = `// БЕЗ enum. Статус заказа хранится "голым" числом:
const order = { status: 2 };

if (order.status === 2) {
  // ...и что здесь происходит? Что означает именно 2?
  // Придётся лезть в документацию, комментарии или гадать.
}

// Обычно заводят россыпь констант вручную:
const STATUS_CREATED = 0;
const STATUS_PAID = 1;
const STATUS_SHIPPED = 2;

// Но тип — обычный number, он НИЧЕГО не гарантирует:
let s: number = 2;
s = 42;   // ✅ компилятор молчит, хотя статуса 42 не существует
s = -1;   // ✅ и это "проходит" — число есть число
// Никакой защиты от бессмыслицы и никакой подсказки в редакторе.`;

  protected readonly basicEnum = `// enum задаёт набор ИМЕНОВАННЫХ вариантов.
// Числовой enum сам расставляет номера, начиная с 0:
enum OrderStatus {
  Created,   // = 0  (нумерация всегда стартует с нуля)
  Paid,      // = 1
  Shipped,   // = 2
  Delivered, // = 3
  Cancelled, // = 4
}

// Теперь у чисел есть понятные имена — пишем смысл, а не цифру:
const current = OrderStatus.Paid; // по значению это 1

console.log(OrderStatus.Created); // 0
console.log(OrderStatus.Shipped); // 2

if (current === OrderStatus.Paid) {
  // сразу ясно: заказ оплачен, гадать не нужно
}`;

  protected readonly logLevelEnum = `// Стартовое число можно задать вручную — дальше идёт автоинкремент (+1).
enum LogLevel {
  Debug = 1, // задаём начало явно
  Info,      // = 2  (следующий член: предыдущий + 1)
  Warn,      // = 3
  Error,     // = 4
}

console.log(LogLevel.Debug); // 1
console.log(LogLevel.Info);  // 2
console.log(LogLevel.Error); // 4`;

  protected readonly httpStatusEnum = `// Значения можно расставить выборочно — они не обязаны идти подряд.
// Удобно, когда числа диктует внешний мир (например, коды HTTP):
enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204, // 202 и 203 нам не нужны — просто пропускаем
}

console.log(HttpStatus.Ok);        // 200
console.log(HttpStatus.Created);   // 201
console.log(HttpStatus.NoContent); // 204`;

  protected readonly enumAsType = `enum OrderStatus { Created, Paid, Shipped, Delivered, Cancelled }

// Имя enum можно использовать как ТИП — ограничить параметр
// только членами OrderStatus (а не любым числом):
function advanceOrder(status: OrderStatus): OrderStatus {
  if (status === OrderStatus.Created) return OrderStatus.Paid;
  if (status === OrderStatus.Paid) return OrderStatus.Shipped;
  return status;
}

advanceOrder(OrderStatus.Created); // ✅ передаём член enum

advanceOrder(999);
// ❌ Argument of type '999' is not assignable to parameter of type 'OrderStatus'
// 999 не входит в набор членов — компилятор ловит опечатку`;

  protected readonly enumAsValue = `enum OrderStatus { Created, Paid, Shipped, Delivered, Cancelled }

// То же имя OrderStatus — это ещё и ЗНАЧЕНИЕ: реальный объект в рантайме.
// К нему можно обращаться как к обычному объекту:
const next = advanceOrder(OrderStatus.Paid); // передаём член как значение
console.log(next);                  // 2  (это OrderStatus.Shipped)

console.log(OrderStatus.Delivered); // 3
console.log(typeof OrderStatus);    // "object" — да, это настоящий объект

function advanceOrder(status: OrderStatus): OrderStatus {
  return status === OrderStatus.Paid ? OrderStatus.Shipped : status;
}`;

  protected readonly generatedObject = `enum OrderStatus {
  Created,   // 0
  Paid,      // 1
  Shipped,   // 2
  Delivered, // 3
  Cancelled, // 4
}

// TypeScript компилирует это в НАСТОЯЩИЙ объект с ОБРАТНЫМ маппингом.
// Примерно такой код появляется в JS:
//
// var OrderStatus;
// (function (OrderStatus) {
//   OrderStatus[OrderStatus["Created"]   = 0] = "Created";
//   OrderStatus[OrderStatus["Paid"]      = 1] = "Paid";
//   OrderStatus[OrderStatus["Shipped"]   = 2] = "Shipped";
//   OrderStatus[OrderStatus["Delivered"] = 3] = "Delivered";
//   OrderStatus[OrderStatus["Cancelled"] = 4] = "Cancelled";
// })(OrderStatus || (OrderStatus = {}));
//
// Каждая строка кладёт в объект СРАЗУ ДВЕ записи: имя → число И число → имя.

console.log(OrderStatus.Paid); // 1      (имя  → число)
console.log(OrderStatus[1]);   // "Paid" (число → имя — это и есть reverse mapping)

// Поэтому ключей в объекте ВДВОЕ больше, чем членов enum:
console.log(Object.keys(OrderStatus));
// ["0","1","2","3","4","Created","Paid","Shipped","Delivered","Cancelled"] — 10 штук!
console.log(Object.values(OrderStatus));
// ["Created","Paid","Shipped","Delivered","Cancelled",0,1,2,3,4]`;

  protected readonly reverseMapping = `enum OrderStatus { Created, Paid, Shipped, Delivered, Cancelled }

// Из базы или из JSON пришёл номер статуса — превратим его в читаемое имя.
// Для этого и нужен обратный маппинг число → имя:
const codeFromDb = 0;
const name = OrderStatus[codeFromDb]; // "Created"
console.log('Статус заказа: ' + name); // Статус заказа: Created

console.log(OrderStatus[2]); // "Shipped"

// ⚠️ Обратный маппинг есть ТОЛЬКО у числовых enum.
// У строковых enum его нет — там имя в объект не кладётся.`;

  protected readonly comparison = `enum LogLevel {
  Debug = 1,
  Info,  // 2
  Warn,  // 3
  Error, // 4
}

// Раз члены — это числа по возрастанию, их можно СРАВНИВАТЬ: < > >= <=
function shouldLog(level: LogLevel, threshold: LogLevel): boolean {
  return level >= threshold;
}

shouldLog(LogLevel.Error, LogLevel.Warn); // true  (4 >= 3)
shouldLog(LogLevel.Debug, LogLevel.Warn); // false (1 >= 3 — нет)

// Классический приём: "показывай сообщения не ниже уровня Warn"
const logs = [
  { level: LogLevel.Debug, text: 'соединяюсь...' },
  { level: LogLevel.Error, text: 'сервер недоступен' },
];
const important = logs.filter((m) => m.level >= LogLevel.Warn);
// в important останется только сообщение с level = Error`;

  protected readonly directionAndFootgun = `enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

let move: Direction = Direction.Up; // ✅ член enum
move = Direction.Left;              // ✅

// А если попробовать присвоить обычное число?
move = 99;
// ❌ Type '99' is not assignable to type 'Direction'
// Число ВНЕ диапазона членов ловится — и это хорошо.

move = 1; // ✅ (число В диапазоне) — но это "случайно" совпало с Down!

const fromApi: number = JSON.parse('1');
move = fromApi; // ✅ ошибки НЕТ — а вот это уже настоящая дыра
// Любой number, чьё значение неизвестно на этапе компиляции, пролезает
// в числовой enum без проверки. Разбор этой ловушки — на странице «Нюансы».`;
}
