import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-interface-vs-type',
  imports: [CodeBlock, RouterLink],
  templateUrl: './interface-vs-type.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesInterfaceVsType {
  protected readonly sameShapeExample = `// Один и тот же объект-пользователь, описанный двумя способами.
// Для ОПИСАНИЯ ФОРМЫ объекта interface и type работают одинаково.

// Вариант 1 — interface (после имени сразу фигурные скобки, без "=")
interface UserI {
  id: number;
  name: string;
  isAdmin: boolean;
}

// Вариант 2 — type (это присваивание: есть "=" и ";" в конце)
type UserT = {
  id: number;
  name: string;
  isAdmin: boolean;
};

// Использование НЕ отличается ничем:
const a: UserI = { id: 1, name: 'Аня', isAdmin: false };
const b: UserT = { id: 2, name: 'Боря', isAdmin: true };`;

  protected readonly unionOnlyTypeExample = `// Объединение (union) можно назвать ТОЛЬКО через type.
type Status = 'idle' | 'loading' | 'done' | 'error';
type Id = number | string;

let s: Status = 'loading';
s = 'busy'; // ❌ Type '"busy"' is not assignable to type 'Status'

// interface так НЕ умеет — он описывает только форму объекта.
// Строки вида "interface Status = ..." просто не существует в языке.`;

  protected readonly aliasOnlyTypeExample = `// type умеет дать имя примитиву, кортежу и функции. interface — нет.

type UserId = number;                             // псевдоним примитива
type Point = [number, number];                    // кортеж (tuple)
type Compare = (a: number, b: number) => number;  // тип функции

const id: UserId = 42;
const origin: Point = [0, 0];
const cmp: Compare = (a, b) => a - b;

// Для всего этого interface не подходит: у него нет "тела" кроме
// набора свойств объекта.`;

  protected readonly computedOnlyTypeExample = `// «Вычисляемые» типы — тоже только через type.

// mapped type: пройтись по ключам и, например, сделать все поля readonly
type Flags = { dark: boolean; beta: boolean };
type ReadonlyFlags = { readonly [K in keyof Flags]: Flags[K] };

// conditional type: выбрать тип по условию (ветвление на уровне типов)
type ItemOf<T> = T extends (infer U)[] ? U : T;
type A = ItemOf<string[]>; // string
type B = ItemOf<number>;   // number

// шаблонный литеральный тип (строка по образцу)
type PxValue = \`\${number}px\`;
const w: PxValue = '16px';   // OK
const bad: PxValue = '16em'; // ❌ не подходит под образец \`\${number}px\``;

  protected readonly typeNoMergeExample = `// Два type с ОДНИМ именем — это ошибка: имя уже занято.
type Box = { width: number };
type Box = { height: number };
// ❌ Duplicate identifier 'Box'
//    так же, как нельзя дважды объявить одну и ту же const`;

  protected readonly interfaceMergeExample = `// А два interface с одним именем ТИХО ОБЪЕДИНЯЮТСЯ в один.
// Это и называется declaration merging (слияние объявлений).
interface Box {
  width: number;
}
interface Box {
  height: number;
}

// Теперь Box = { width: number; height: number } — оба поля обязательны:
const ok: Box = { width: 100, height: 50 }; // OK
const bad: Box = { width: 100 };            // ❌ отсутствует свойство 'height'`;

  protected readonly augmentExample = `// Где merging реально полезен: дополнить ЧУЖОЙ тип, не трогая его исходники.
// Пример — добавить своё поле в глобальный объект window.

declare global {
  interface Window {
    myAppVersion: string;
  }
}

window.myAppVersion = '1.4.2'; // теперь TypeScript про это поле знает
export {}; // чтобы файл считался модулем

// Так же расширяют типы сторонних библиотек: объявляют ещё один interface
// с тем же именем — и он «дописывается» к существующему.`;

  protected readonly extendsInterfaceExample = `// Расширение у interface — ключевое слово extends (читается как наследование).
interface Named {
  name: string;
}
interface Aged {
  age: number;
}

// Можно наследовать сразу от нескольких «родителей»:
interface Person extends Named, Aged {
  email: string;
}

const p: Person = { name: 'Аня', age: 30, email: 'a@example.com' };`;

  protected readonly intersectionTypeExample = `// То же расширение у type — через пересечение & (intersection).
type Named = { name: string };
type Aged = { age: number };

// & «складывает» типы: в Person обязаны быть все поля сразу.
type Person = Named & Aged & { email: string };

const p: Person = { name: 'Аня', age: 30, email: 'a@example.com' };`;

  protected readonly mixExample = `// interface и type можно СМЕШИВАТЬ в расширении.
type Point2D = { x: number; y: number };

interface Point3D extends Point2D {
  // interface расширяет type-объект — так можно
  z: number;
}

type Labeled = Point3D & { label: string }; // type пересекает interface — тоже можно

const dot: Labeled = { x: 1, y: 2, z: 3, label: 'A' };`;
}
