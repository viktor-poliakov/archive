import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-enums-string',
  imports: [CodeBlock, RouterLink],
  templateUrl: './string.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptEnumsString {
  protected readonly syntaxBasic = `// Строковый enum: у КАЖДОГО члена явно прописано строковое значение
enum OrderStatus {
  Created = "CREATED",
  Paid = "PAID",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// Пользуемся так же, как числовым — через имя члена:
const status: OrderStatus = OrderStatus.Paid;

console.log(status); // "PAID" — в переменной лежит сама строка

// Значение члена — это его строка. Именно ЕЁ увидят в логе,
// в сетевом запросе и в базе данных. Число '1' там читалось бы хуже.`;

  protected readonly mustInit = `// В строковом enum каждый член ОБЯЗАН получить значение вручную.
enum Direction {
  North = "N",
  East = "E",
  South, // ❌ Enum member must have initializer.
  West,  // ❌ Enum member must have initializer.
}
// TypeScript не умеет «додумать» строку сам: какой она должна быть
// после "E"? Ответа нет. Поэтому пропущенных значений у строкового
// enum не бывает — либо задаёшь все, либо получаешь ошибку компиляции.`;

  protected readonly noAutoincrement = `// У ЧИСЛОВОГО enum значения проставляются сами (автоинкремент с 0):
enum NumLevel {
  Debug, // 0
  Info,  // 1
  Warn,  // 2
  Error, // 3
}

// У СТРОКОВОГО автоинкремента НЕТ — каждую строку пишем руками.
// Одну строку «увеличить» до следующей невозможно, поэтому так и надо:
enum StrLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}
// Печатать чуть больше — зато значение осмысленное, а не безликий номер.`;

  protected readonly generatedObject = `enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// Что TypeScript сгенерирует в JS — обычный объект «имя → строка»:
//
//   var Role;
//   (function (Role) {
//     Role["Admin"] = "admin";
//     Role["Editor"] = "editor";
//     Role["Viewer"] = "viewer";
//   })(Role || (Role = {}));
//
// Обратите внимание: только присваивания «имя = строка», ничего больше.

console.log(Object.keys(Role));   // ["Admin", "Editor", "Viewer"] — только ИМЕНА
console.log(Object.values(Role)); // ["admin", "editor", "viewer"] — только строки
// Ровно 3 ключа на 3 члена. Никаких «лишних» записей.`;

  protected readonly noReverseMapping = `enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

console.log(Role.Admin); // ✅ "admin" — по имени получаем строку

console.log(Role["admin"]);
// ❌ Property 'admin' does not exist on type 'typeof Role'. Did you mean 'Admin'?
// Обратного маппинга НЕТ: строку "admin" обратно в имя Admin не превратить.

// Сравните с числовым enum, где связь ДВУСТОРОННЯЯ:
//   enum Num { A }  →  Num.A === 0  И  Num[0] === "A"
// У строкового связь одна: имя → строка, и только так.`;

  protected readonly strictAssignment = `enum OrderStatus {
  Created = "CREATED",
  Paid = "PAID",
}

let s: OrderStatus;

s = OrderStatus.Created; // ✅ единственный правильный путь — через член enum

s = "CREATED";
// ❌ Type '"CREATED"' is not assignable to type 'OrderStatus'.
// Даже если голая строка ТОЧНО СОВПАДАЕТ со значением члена —
// присвоить её нельзя. Строковый enum строгий: чужие строки он не принимает.

// Это защита! У ЧИСЛОВОГО enum здесь дыра:
//   enum Num { A, B }
//   const x: number = 99;
//   let n: Num = x; // ❌ ошибки НЕТ — любой number «пролезает» в числовой enum
// Строковый такого не допускает — отсюда его надёжность.`;

  protected readonly jsonReadable = `enum OrderStatus {
  Created = "CREATED",
  Paid = "PAID",
}

// Строковый enum в JSON — читаемо:
JSON.stringify({ status: OrderStatus.Paid });
// '{"status":"PAID"}'  ✅ сразу видно, что заказ оплачен

// Для сравнения — числовой enum (Created = 0, Paid = 1) дал бы:
// '{"status":1}'       ❌ «1» — это что? Придётся лезть в исходник за расшифровкой
//
// То же самое в логах: строка "PAID" в файле лога понятна без словаря,
// а «1» заставляет каждый раз вспоминать, какому статусу соответствует номер.`;

  protected readonly logLevelEnum = `// Уровни лога строковым enum — метка в файле сразу читаемая
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

function log(level: LogLevel, message: string): void {
  console.log(\`[\${level}] \${message}\`);
}

log(LogLevel.Warn, "диск заполнен на 90%");
// [WARN] диск заполнен на 90%   ← метка WARN понятна без расшифровки`;

  protected readonly switchExample = `enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// switch по строковому enum: в ветках указываем ЧЛЕНА (Role.Admin),
// а не голую строку "admin".
function canDelete(role: Role): boolean {
  switch (role) {
    case Role.Admin:
      return true;  // администратору можно всё
    case Role.Editor:
      return true;  // редактор тоже может удалять
    case Role.Viewer:
      return false; // читатель — только смотрит
  }
}

canDelete(Role.Viewer); // false`;

  protected readonly refactorStability = `// Значение строкового члена «прибито» к нему и НЕ зависит от позиции.
enum Status {
  Paid = "PAID",
  Shipped = "SHIPPED",
}

// Вставили новый член В НАЧАЛО — на строки это никак не влияет:
enum StatusV2 {
  Created = "CREATED", // новый первый член
  Paid = "PAID",       // по-прежнему "PAID"
  Shipped = "SHIPPED", // по-прежнему "SHIPPED"
}
// Записи "PAID" и "SHIPPED", уже лежащие в базе, остаются валидными.

// У ЧИСЛОВОГО enum так нельзя: вставка члена в начало сдвигает автонумерацию
// (Paid был 0 — стал 1), и старые числа в базе начинают означать другое.
// Разбор этой ловушки — на странице «Нюансы и подводные камни».`;
}
