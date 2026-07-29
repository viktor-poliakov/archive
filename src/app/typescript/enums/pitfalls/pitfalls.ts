import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-enums-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptEnumsPitfalls {
  protected readonly leakyNumeric = `// Числовой enum статусов заказа: значения проставились сами — 0,1,2,3
enum Status {
  New,      // 0
  Paid,     // 1
  Shipped,  // 2
  Done,     // 3
}

// Числовой ЛИТЕРАЛ вне диапазона компилятор всё-таки ловит:
let a: Status = 99;
// ❌ Type '99' is not assignable to type 'Status'.

let b: Status = -5;
// ❌ Type '-5' is not assignable to type 'Status'.

// НО литерал В диапазоне проходит, даже если это «не тот» член:
let c: Status = 1; // ✅ ошибки нет — это молча стало Status.Paid

// А вот и сама дыра: ЛЮБОЙ обычный number проходит БЕЗ проверки.
declare const fromApi: number; // например, распарсили из JSON
let d: Status = fromApi;
// ✅ ошибки НЕТ — хотя внутри fromApi может лежать 500 или -1

// ---- Строковый enum, для контраста, СТРОГ ----
enum SStatus {
  New = 'new',
  Paid = 'paid',
  Shipped = 'shipped',
}

let e: SStatus = 'paid';
// ❌ Type '"paid"' is not assignable to type 'SStatus'.
// Даже правильную по смыслу строку не подсунуть — нужен именно член:
let f: SStatus = SStatus.Paid; // ✅ только так`;

  protected readonly enumIteration = `enum Status {
  New,      // 0
  Paid,     // 1
  Shipped,  // 2
  Done,     // 3
}

// Числовой enum компилируется в объект с ОБРАТНЫМ маппингом (reverse mapping):
// есть и Status.Paid === 1, и Status[1] === "Paid". Поэтому ключей вдвое больше.
Object.keys(Status);
// ["0", "1", "2", "3", "New", "Paid", "Shipped", "Done"]  — 8 штук, а не 4!

Object.values(Status);
// ["New", "Paid", "Shipped", "Done", 0, 1, 2, 3]

// Наивный перебор «по статусам» выдаёт мусор — сначала числа, потом имена:
for (const k of Object.keys(Status)) {
  console.log(k); // "0", "1", "2", "3", "New", "Paid", "Shipped", "Done"
}

// Чтобы достать ТОЛЬКО имена, приходится вручную отсекать числовые ключи:
const names = Object.keys(Status).filter((k) => isNaN(Number(k)));
// ["New", "Paid", "Shipped", "Done"]

// А только числовые значения — так:
const values = Object.values(Status).filter(
  (v): v is number => typeof v === 'number',
);
// [0, 1, 2, 3]`;

  protected readonly nominal = `// Два enum направлений с ОДИНАКОВЫМИ по виду значениями
enum Direction {
  Up = 'up',
  Down = 'down',
}
enum Move {
  Up = 'up',
  Down = 'down',
}

// Значения совпадают, но enum НОМИНАЛЬНЫ — это разные типы:
let dir: Direction = Move.Up;
// ❌ Type 'Move.Up' is not assignable to type 'Direction'.

// Голый литерал тоже не присвоить enum:
let d2: Direction = 'up';
// ❌ Type '"up"' is not assignable to type 'Direction'.
let d3: Direction = Direction.Up; // ✅ только через сам enum

// А вот В ОБРАТНУЮ сторону строгости нет: член строкового enum
// совместим со своим литеральным типом-значением.
const lit: 'up' = Direction.Up; // ✅ ok`;

  protected readonly jsonReadability = `enum NumStatus {
  New,      // 0
  Paid,     // 1
  Shipped,  // 2
}
enum StrStatus {
  New = 'new',
  Paid = 'paid',
  Shipped = 'shipped',
}

// Числовой enum в JSON/логах превращается в загадочное число:
JSON.stringify({ status: NumStatus.Shipped });
// '{"status":2}'  — что значит 2? без исходника enum не понять

// Строковый enum самодокументируется:
JSON.stringify({ status: StrStatus.Shipped });
// '{"status":"shipped"}'  — читаемо и в логе, и в базе, и в чужом сервисе`;

  protected readonly keyofVsType = `enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

// Тип самого enum (Direction) = его ЗНАЧЕНИЯ ('up' | 'down' | 'left' | 'right'):
const a: Direction = 'up';
// ❌ Type '"up"' is not assignable to type 'Direction'.
const b: Direction = Direction.Up; // ✅

// keyof typeof Direction = ИМЕНА членов ('Up' | 'Down' | 'Left' | 'Right'):
type DirName = keyof typeof Direction;
const k1: DirName = 'Up'; // ✅ имя члена

const k2: DirName = 'up';
// ❌ Type '"up"' is not assignable to type '"Up" | "Down" | "Left" | "Right"'.
// Легко перепутать: тип enum хочет ЗНАЧЕНИЕ, keyof typeof — ИМЯ`;

  protected readonly heterogeneous = `// Гетерогенный enum — числа и строки вперемешку. Компилируется, но ведёт
// себя непоследовательно: обратный маппинг появляется ТОЛЬКО у числовых членов.
enum Answer {
  No = 0,
  Yes = 'YES',
}

Object.keys(Answer);
// ["0", "No", "Yes"]  — обратный ключ "0" есть, а обратного ключа "YES" нет

Answer.No;   // 0
Answer.Yes;  // "YES"
Answer[0];   // "No"   ✅ reverse mapping есть — член числовой
// Answer["YES"] — обратного маппинга НЕТ: у строкового члена его не бывает`;

  protected readonly runtimeCost = `// Этот enum используется как ТИП параметра — казалось бы, чистая аннотация.
enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

function log(level: LogLevel, message: string) {
  /* ... */
}

// Но enum — не только тип: в собранный JS попадёт целый объект-таблица (IIFE):
//
//   var LogLevel;
//   (function (LogLevel) {
//     LogLevel[LogLevel["Debug"] = 0] = "Debug";
//     LogLevel[LogLevel["Info"]  = 1] = "Info";
//     LogLevel[LogLevel["Warn"]  = 2] = "Warn";
//     LogLevel[LogLevel["Error"] = 3] = "Error";
//   })(LogLevel || (LogLevel = {}));
//
// Этот код остаётся в бандле, даже если enum нужен был лишь для типов,
// и плохо вытряхивается tree-shaking'ом. Обычный union такой цены не имеет.`;

  protected readonly constEnumUseless = `// Идея const enum — «исчезнуть» из сборки, заинлайнив значения по месту:
const enum Color {
  Red,
  Green,
  Blue,
}
const c = Color.Green;

// Обычный tsc заинлайнил бы это в:  const c = 1 /* Color.Green */;
// и объекта Color в JS не осталось бы вовсе.
//
// НО в этом проекте включён isolatedModules — и тогда const enum
// НЕ инлайнится: компилятор эмитит тот же полный объект-таблицу,
// что и у обычного enum. Приставка const не даёт ничего.

// А внешний (ambient) const enum под isolatedModules прямо запрещён:
declare const enum Env {
  Dev,
  Prod,
}
const e = Env.Dev;
// ❌ TS2748: Cannot access ambient const enums when 'isolatedModules' is enabled.`;

  protected readonly reorder = `// Было так, и в БАЗУ писались ЧИСЛА (0, 1, 2, 3):
enum StatusV1 {
  New,      // 0
  Paid,     // 1
  Shipped,  // 2  ← в базе накопились записи со значением 2 = Shipped
  Done,     // 3
}

// Позже кто-то «навёл порядок» и вставил член В СЕРЕДИНУ:
enum StatusV2 {
  New,       // 0
  Paid,      // 1
  Packing,   // 2  ← вставили здесь
  Shipped,   // 3  ← был 2, стал 3!
  Done,      // 4
}
// Старые записи со значением 2 раньше значили Shipped,
// а теперь молча читаются как Packing. Данные «поехали», ошибок нет.

// Лекарство №1 — прибить значения гвоздями (явные номера, новое — в конец):
enum StatusSafe {
  New = 0,
  Paid = 1,
  Shipped = 2,
  Done = 3,
  Packing = 4, // добавили со своим номером — старые 0..3 не сдвинулись
}

// Лекарство №2 (надёжнее) — хранить строки: их смысл не зависит от порядка.
enum StatusStr {
  New = 'new',
  Paid = 'paid',
  Shipped = 'shipped',
  Done = 'done',
}`;

  protected readonly duplicates = `// Авто-инкремент может НЕЗАМЕТНО создать два члена с одним значением:
enum Dup {
  A = 1,
  B,      // авто → 2
  C = 1,  // снова 1 — молчаливый дубликат A
}

Dup.A; // 1
Dup.C; // 1  — совпадает с A, компилятор об этом не предупреждает

// Обратный маппинг ОДИН на значение, поэтому «последний победил»:
Dup[1]; // "C"  — не "A"! Запись Dup[1] = "A" была перезаписана на "C"`;
}
