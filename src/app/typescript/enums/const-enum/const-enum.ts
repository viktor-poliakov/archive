import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-enums-const-enum',
  imports: [CodeBlock, RouterLink],
  templateUrl: './const-enum.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptEnumsConstEnum {
  protected readonly regularEnumEmit = `// Обычный enum — это НЕ только тип, но и настоящий объект в рантайме.
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

// Компилятор превращает его примерно в такой код (самовызывающаяся
// функция, IIFE), и этот объект РЕАЛЬНО попадает в итоговый бандл:
//
//   var Direction;
//   (function (Direction) {
//     Direction[Direction["Up"] = 0] = "Up";
//     Direction[Direction["Down"] = 1] = "Down";
//     Direction[Direction["Left"] = 2] = "Left";
//     Direction[Direction["Right"] = 3] = "Right";
//   })(Direction || (Direction = {}));

// Отсюда и лишний вес: даже если в коде используется только Direction.Up,
// в бандл всё равно уезжает весь объект-справочник целиком.`;

  protected readonly constEnumBasic = `// const enum объявляется так же, только со словом const впереди.
const enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

// Пользуемся точно так же, как обычным enum:
const move = Direction.Up;   // тип: Direction, значение: 0
const back = Direction.Down; // 1

// Идея в том, что компилятор ЗНАЕТ все значения ещё на этапе сборки.
// Значит, он может подставить (заинлайнить) их прямо в код,
// а сам объект Direction в рантайм вообще не выпускать.`;

  protected readonly plainTscEmit = `// ИСХОДНИК:
const enum Direction { Up, Down, Left, Right }
const x = Direction.Up;
const y = Direction.Right;

// РЕЗУЛЬТАТ обычного tsc (в проекте БЕЗ isolatedModules):
// объекта Direction в JS нет вообще — только подставленные числа
// с комментарием-подсказкой, откуда они взялись:
//
//   const x = 0 /* Direction.Up */;
//   const y = 3 /* Direction.Right */;
//
// ✅ Ноль лишнего кода в бандле: остались голые литералы, как будто
//    вы с самого начала написали const x = 0.`;

  protected readonly isolatedModulesEmit = `// НАШ проект собран в режиме isolatedModules: каждый файл
// транспилируется НЕЗАВИСИМО от остальных.
// Надёжно заинлайнить const enum можно, лишь зная его значения во
// ВСЕХ местах использования — а они бывают и в других файлах, которых
// компилятор в этом режиме не видит. Гарантировать инлайн нельзя,
// поэтому под isolatedModules он ОТКЛЮЧЁН полностью — объект остаётся
// даже вот здесь, в одном файле с определением.

const enum Direction { Up, Down, Left, Right }
const x = Direction.Up;

// РЕЗУЛЬТАТ под isolatedModules — снова ПОЛНЫЙ объект, ровно такой же,
// как у обычного enum (никакого инлайна, даже для соседней строки):
//
//   var Direction;
//   (function (Direction) {
//     Direction[Direction["Up"] = 0] = "Up";
//     // ...остальные члены...
//   })(Direction || (Direction = {}));
//   const x = Direction.Up;
//
// ❌ Выгода const enum здесь равна нулю: объект всё равно в бандле.`;

  protected readonly noReverseMapping = `const enum Level { Debug, Info, Warn, Error }

// Прямое обращение по имени работает — оно инлайнится в число:
const code = Level.Warn; // ✅ 2

// А вот обратного маппинга (reverse mapping) у const enum НЕТ:
// получить имя по числу нельзя, ведь в рантайме нет объекта, где искать.
const name = Level[0];
// ❌ A const enum member can only be accessed using a string literal.
// Обычный enum позволил бы Level[0] === 'Debug', const enum — нет.`;

  protected readonly ambientConstEnum = `// «Ambient» const enum — объявленный через declare. Обычно такие
// приходят из .d.ts-файлов сторонних библиотек:
declare const enum Country {
  RU,
  US,
  DE,
}

const c = Country.RU;
// ❌ TS2748: Cannot access ambient const enums when 'isolatedModules'
//    is enabled.
//
// Под isolatedModules компилятор не видит тело такого enum
// (оно объявлено, но не определено здесь) и подставить значение
// не может — поэтому просто запрещает обращение.`;

  protected readonly preserveConstEnums = `// Флаг preserveConstEnums заставляет компилятор ОСТАВИТЬ объект
// const enum в JS — даже там, где он мог бы заинлайнить значения.
// tsconfig.json:
//   { "compilerOptions": { "preserveConstEnums": true } }

const enum Direction { Up, Down, Left, Right }
const x = Direction.Up;

// РЕЗУЛЬТАТ: объект Direction сохранён в бандле (как у обычного enum),
// хотя значения при этом всё равно подставлены:
//
//   var Direction;
//   (function (Direction) { Direction[Direction["Up"] = 0] = "Up"; /* ... */ })(Direction || (Direction = {}));
//   const x = 0 /* Direction.Up */;
//
// ❗ Главное преимущество const enum — отсутствие объекта — при этом
//    теряется. Остаётся обычный enum, только записанный сложнее.`;

  protected readonly asConstAlternative = `// Вывод для проектов с бандлером и isolatedModules (как наш):
// вместо const enum берите обычный объект с as const.

const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// Тип-объединение значений выводим прямо из объекта:
type Direction = (typeof Direction)[keyof typeof Direction]; // 0 | 1 | 2 | 3

const move: Direction = Direction.Up; // ✅ 0

const bad: Direction = 99;
// ❌ Type '99' is not assignable to type '0 | 1 | 2 | 3'

// Поведение предсказуемо в любом сборщике, объект честно виден
// в рантайме, а «дыры» числового enum больше не мешают.
// Подробный разбор — на странице «Альтернативы enum».`;
}
