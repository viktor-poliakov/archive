import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-discriminated-unions',
  imports: [CodeBlock, RouterLink],
  templateUrl: './discriminated-unions.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingDiscriminatedUnions {
  protected readonly discriminantIdea = `// У каждого варианта есть ОБЩЕЕ поле-метка kind со своим строковым литералом
type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };

// Объединение вариантов. kind — это «ярлык на посылке»
type Shape = Circle | Square;

// По значению ярлыка сразу ясно, что внутри и какие поля там лежат
const a: Shape = { kind: 'circle', radius: 10 }; // ✅ вариант Circle
const b: Shape = { kind: 'square', side: 4 };     // ✅ вариант Square`;

  protected readonly narrowByKind = `type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };
type Shape = Circle | Square;

function describe(shape: Shape): string {
  // Проверяем ОДИН ярлык — и TS сужает ВЕСЬ объект до нужного варианта
  if (shape.kind === 'circle') {
    // здесь shape — это Circle, доступно только radius
    return \`круг радиусом \${shape.radius}\`;
  }
  // остался единственный вариант — Square, доступно только side
  return \`квадрат со стороной \${shape.side}\`;
}`;

  protected readonly shapesUnion = `// Три геометрические фигуры. Дискриминант — поле kind, у каждого свой литерал
type Circle = {
  kind: 'circle';
  radius: number;
};
type Rectangle = {
  kind: 'rectangle';
  width: number;
  height: number;
};
type Triangle = {
  kind: 'triangle';
  base: number;
  height: number;
};

type Shape = Circle | Rectangle | Triangle;`;

  protected readonly shapesArea = `function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape сужен до Circle — доступно radius (width/height тут нет)
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      // shape сужен до Rectangle — доступны width и height
      return shape.width * shape.height;
    case 'triangle':
      // shape сужен до Triangle — доступны base и height
      return (shape.base * shape.height) / 2;
  }
}

area({ kind: 'circle', radius: 10 });             // ✅ 314.159…
area({ kind: 'rectangle', width: 4, height: 5 }); // ✅ 20
area({ kind: 'triangle', base: 6, height: 3 });   // ✅ 9`;

  protected readonly shapesForeignFieldError = `function areaBroken(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // В этой ветке shape — это Circle. Чужих полей у него нет:
      return shape.width * shape.height;
      // ❌ Property 'width' does not exist on type 'Circle'.
      // ❌ Property 'height' does not exist on type 'Circle'.
    case 'rectangle':
      // radius есть только у круга — здесь его тоже нет
      return Math.PI * shape.radius ** 2;
      // ❌ Property 'radius' does not exist on type 'Rectangle'.
    default:
      return 0;
  }
}`;

  protected readonly fetchStateUnion = `type User = { id: number; name: string };

// Три ВЗАИМОИСКЛЮЧАЮЩИХ состояния запроса. Дискриминант — поле status.
// data есть только при успехе, message — только при ошибке
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };`;

  protected readonly fetchStateRender = `function render(state: RequestState): string {
  switch (state.status) {
    case 'loading':
      // ни data, ни message тут нет — и это правильно
      return 'Загрузка…';
    case 'success':
      // data доступно ТОЛЬКО в этой ветке
      return \`Привет, \${state.data.name}!\`;
    case 'error':
      // message доступно только здесь
      return \`Ошибка: \${state.message}\`;
  }
}

render({ status: 'loading' });                               // 'Загрузка…'
render({ status: 'success', data: { id: 1, name: 'Аня' } }); // 'Привет, Аня!'
render({ status: 'error', message: 'нет сети' });            // 'Ошибка: нет сети'`;

  protected readonly exhaustiveNever = `function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // Мы перебрали ВСЕ варианты, поэтому сюда попасть невозможно.
      // Значит здесь тип shape сужен до never (пустое множество).
      // never присваивается только never → строка компилируется
      const _exhaustive: never = shape; // ✅ пока все ветки на месте
      return _exhaustive;
  }
}`;

  protected readonly exhaustiveNewVariant = `// Добавили новую фигуру в объединение…
type Hexagon = { kind: 'hexagon'; side: number };
type Shape = Circle | Rectangle | Triangle | Hexagon;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return (shape.base * shape.height) / 2;
    // …а ветку для 'hexagon' добавить ЗАБЫЛИ
    default:
      // Теперь в default доходит Hexagon, а не never:
      const _exhaustive: never = shape;
      // ❌ Type 'Hexagon' is not assignable to type 'never'.
      // Компилятор поймал пропущенную ветку ЕЩЁ ДО запуска программы
      return _exhaustive;
  }
}`;

  protected readonly godObjectBad = `type User = { id: number; name: string };

// ❌ «Объект-бог»: всё в одном типе, нужные поля — опциональные
type RequestStateBad = {
  status: 'loading' | 'success' | 'error';
  data?: User;      // должно быть только при success…
  message?: string; // …а это только при error, но тип не связывает их со status
};

const state: RequestStateBad = { status: 'success' };
// TS не заставил положить data — забыли, а компилятор промолчал

console.log(state.data.name);
// ❌ 'state.data' is possibly 'undefined'.
// Приходится всюду писать state.data?.name и гадать, что реально пришло.
// Хуже того — можно собрать бессмысленное состояние:
const nonsense: RequestStateBad = {
  status: 'loading',
  data: { id: 1, name: 'Аня' },
  message: 'ошибка',
}; // ✅ для TS ок, хотя загрузка + данные + ошибка одновременно — абсурд`;

  protected readonly godObjectGood = `// ✅ Размеченное объединение: у каждого статуса — РОВНО свои поля
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

const ok: RequestState = { status: 'success', data: { id: 1, name: 'Аня' } };

// Собрать бессмысленное состояние компилятор просто не даст:
const bad: RequestState = {
  status: 'loading',
  data: { id: 1, name: 'Аня' },
};
// ❌ Object literal may only specify known properties,
//    and 'data' does not exist in type '{ status: "loading"; }'.
// Невозможные комбинации отсекаются на этапе компиляции`;

  protected readonly discriminantLiteral = `type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };
type Shape = Circle | Square;

// Поле kind объекта raw выведется как ШИРОКИЙ string, а не литерал 'circle'
const raw = { kind: 'circle', radius: 10 };
const shape: Shape = raw;
// ❌ Types of property 'kind' are incompatible.
//    Type 'string' is not assignable to type '"circle"'.

// Дискриминант ОБЯЗАН быть литеральным типом. Чиним через as const:
const fixed = { kind: 'circle', radius: 10 } as const;
const okShape: Shape = fixed; // ✅ теперь тип поля kind — литерал 'circle'`;
}
