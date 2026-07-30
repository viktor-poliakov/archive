import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-enums-alternatives',
  imports: [CodeBlock, RouterLink],
  templateUrl: './alternatives.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptEnumsAlternatives {
  protected readonly enumDrawbacks = `// Числовой enum компилируется в РЕАЛЬНЫЙ объект в JS —
// и вместе с этим тащит за собой пару неприятных причуд.
enum Status {
  Created,   // 0
  Paid,      // 1
  Shipped,   // 2
  Cancelled, // 3
}

// 1) Мусор от обратного маппинга (reverse mapping):
//    в объект попадают И имена, И числа — сразу вдвое больше ключей.
Object.keys(Status);
// ['0','1','2','3','Created','Paid','Shipped','Cancelled'] — 8 ключей!

// 2) Дыра в безопасности: почти любое число молча становится статусом.
const fromApi: number = JSON.parse('777'); // пришло с сервера, значение неизвестно
let s: Status = fromApi;        // ✅ ошибки НЕТ, хотя там могло быть 777

s = 99;
// ❌ Type '99' is not assignable to type 'Status'.
// Ошибку ловит только литерал вне диапазона, но НЕ переменная-число.`;

  protected readonly unionType = `// Альтернатива A: просто перечисляем допустимые строки через '|'.
// Это ТОЛЬКО тип — в скомпилированном JS от него не остаётся НИ строчки.
type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled';

let status: OrderStatus = 'paid'; // ✅ редактор подскажет все 4 варианта
status = 'shipped';               // ✅

status = 'done';
// ❌ Type '"done"' is not assignable to type 'OrderStatus'.
// 'done' не входит в набор — опечатку компилятор ловит сразу.`;

  protected readonly unionParamSwitch = `type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled';

// Union прекрасно работает как тип параметра и в switch.
// Никакого рантайм-объекта для этого не требуется.
function labelFor(status: OrderStatus): string {
  switch (status) {
    case 'created':
      return 'Создан';
    case 'paid':
      return 'Оплачен';
    case 'shipped':
      return 'Отправлен';
    case 'cancelled':
      return 'Отменён';
  }
}

labelFor('paid'); // 'Оплачен'

labelFor('unknown');
// ❌ Argument of type '"unknown"' is not assignable
//    to parameter of type 'OrderStatus'.`;

  protected readonly step1AsConst = `// Альтернатива B. Шаг 1: обычный объект, «замороженный» через as const.
// as const говорит компилятору две вещи:
//   1) значения — это ЛИТЕРАЛЫ ('created'), а не широкий string;
//   2) поля readonly — менять их нельзя.
const OrderStatus = {
  Created: 'created',
  Paid: 'paid',
  Shipped: 'shipped',
  Cancelled: 'cancelled',
} as const;

OrderStatus.Paid; // 'paid' — доступ по имени, как у enum`;

  protected readonly step2Typeof = `// Шаг 2: оператор typeof берёт из ЗНАЧЕНИЯ его тип-форму.
// (мы поднимаемся от значения к типу — см. страницу про оператор typeof)
type Shape = typeof OrderStatus;
// Shape === {
//   readonly Created: 'created';
//   readonly Paid: 'paid';
//   readonly Shipped: 'shipped';
//   readonly Cancelled: 'cancelled';
// }`;

  protected readonly step3KeyofTypeof = `// Шаг 3: keyof берёт КЛЮЧИ этой формы — объединение ИМЁН.
type StatusKey = keyof typeof OrderStatus;
// StatusKey === 'Created' | 'Paid' | 'Shipped' | 'Cancelled'

const k: StatusKey = 'Paid'; // ✅ это ИМЯ ключа

const bad: StatusKey = 'paid';
// ❌ Type '"paid"' is not assignable to type
//    '"Created" | "Paid" | "Shipped" | "Cancelled"'.
// 'paid' — это ЗНАЧЕНИЕ, а нам на этом шаге нужны имена ключей.`;

  protected readonly step4IndexedAccess = `// Шаг 4: индексный доступ [keyof ...] достаёт ЗНАЧЕНИЯ по всем ключам —
// ровно тот union литералов, который нам и нужен.
type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];
// OrderStatusValue === 'created' | 'paid' | 'shipped' | 'cancelled'

const v: OrderStatusValue = 'shipped'; // ✅

const wrong: OrderStatusValue = 'done';
// ❌ Type '"done"' is not assignable to type
//    '"created" | "paid" | "shipped" | "cancelled"'.`;

  protected readonly objectValues = `// Бонус as const-объекта: по нему можно ПЕРЕБИРАТЬ значения в рантайме,
// и массив получается ЧИСТЫЙ — без мусора обратного маппинга.
Object.values(OrderStatus);
// ['created', 'paid', 'shipped', 'cancelled'] — ровно 4 значения ✅

// Тот же перебор у числового enum из первой секции даёт кашу:
// Object.values(Status)
// → ['Created','Paid','Shipped','Cancelled', 0, 1, 2, 3] — 8 элементов ❌`;

  protected readonly nameValuePattern = `// Приём «одно имя = и объект-значение, и одноимённый тип».
// TypeScript хранит типы и значения в РАЗНЫХ пространствах имён,
// поэтому имя OrderStatus может означать сразу две вещи.
const OrderStatus = {
  Created: 'created',
  Paid: 'paid',
  Shipped: 'shipped',
  Cancelled: 'cancelled',
} as const;

// тип с тем же именем: 'created' | 'paid' | 'shipped' | 'cancelled'
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

function ship(status: OrderStatus) {
  /* ... */
}

ship(OrderStatus.Created); // ✅ объект-значение даёт литерал 'created'
ship('paid');              // ✅ и голый литерал из набора тоже подходит`;

  protected readonly roleType = `// Роли пользователя — классический union литералов, где рантайм-объект
// не нужен вовсе: нам важен только набор допустимых значений.
type Role = 'admin' | 'editor' | 'viewer';

function canEdit(role: Role): boolean {
  return role === 'admin' || role === 'editor';
}

canEdit('viewer'); // false

canEdit('guest');
// ❌ Argument of type '"guest"' is not assignable
//    to parameter of type 'Role'.`;

  protected readonly whereEnumWins = `// Где enum всё-таки удобнее: ОДНО объявление сразу даёт
// и namespace-доступ по имени (Direction.Up), и готовый тип —
// без ручной «матрёшки» typeof / keyof / индексного доступа.
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}

function move(dir: Direction) {
  /* ... */
}

move(Direction.Up); // ✅ Direction.Up — и значение, и тип из одного имени

move('UP');
// ❌ Type '"UP"' is not assignable to parameter of type 'Direction'.
// Строковый enum СТРОГИЙ: голый литерал не подходит (в отличие от as const).`;

  protected readonly recordLabels = `type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled';

// Record<OrderStatus, string> требует ключ на КАЖДОЕ значение union.
// Забыли статус → ошибка компиляции. Отличная пара к union литералов.
const labels: Record<OrderStatus, string> = {
  created: 'Создан',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  cancelled: 'Отменён',
};

labels['paid']; // 'Оплачен'

// Пропустите любой ключ — и компилятор укажет, какого не хватает:
// ❌ Property 'cancelled' is missing in type '{ ... }'
//    but required in type 'Record<OrderStatus, string>'.`;
}
