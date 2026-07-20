import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-subtypes-supertypes',
  imports: [CodeBlock, RouterLink],
  templateUrl: './subtypes-supertypes.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesSubtypesSupertypes {
  protected readonly subtypeBasic = `// Dog — подтип Animal: у собаки есть всё, что требует Animal, и ещё breed сверху
interface Animal {
  name: string;
}
interface Dog {
  name: string;
  breed: string; // дополнительное свойство
}

const dog: Dog = { name: 'Rex', breed: 'corgi' };

// Подтип можно подставить туда, где ждут супертип — это всегда безопасно
const animal: Animal = dog; // ✅ у dog есть name — контракт Animal выполнен
console.log(animal.name); // 'Rex'`;

  protected readonly assignDirectionError = `interface Animal {
  name: string;
}
interface Dog {
  name: string;
  breed: string;
}

const someAnimal: Animal = { name: 'Unknown' };

// Супертип нельзя подставить туда, где ждут подтип
const dog: Dog = someAnimal;
// ❌ Property 'breed' is missing in type 'Animal' but required in type 'Dog'
// У произвольного Animal свойства breed может не быть — подстановка небезопасна`;

  protected readonly hierarchyChain = `// Цепочка подтипов: "red" ⊂ string ⊂ unknown
const literal: 'red' = 'red';
const str: string = literal; // ✅ "red" → string (кладём в более широкий тип)
const top: unknown = str;    // ✅ string → unknown (в самый широкий тип)

// И never ⊂ любой тип, включая всю эту цепочку:
declare const bottom: never;
const asLiteral: 'red' = bottom; // ✅
const asString: string = bottom; // ✅`;

  protected readonly narrowingExample = `function printId(id: string | number): void {
  // тип id — это string | number, то есть супертип string.
  // Чтобы работать с ним как со string, тип нужно сузить:
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // ✅ здесь id сужен до string (подтип)
  } else {
    console.log(id.toFixed(0));    // ✅ здесь id сужен до number
  }
}`;

  protected readonly functionSupertypeParam = `interface Animal {
  name: string;
}
interface Dog {
  name: string;
  breed: string;
}

// Функция ждёт СУПЕРТИП Animal — ей достаточно свойства name
function printName(a: Animal): void {
  console.log(a.name);
}

const rex: Dog = { name: 'Rex', breed: 'corgi' };
printName(rex); // ✅ Dog — подтип Animal, кладём узкое в широкое

// А наоборот нельзя: функция ждёт ПОДТИП Dog, а мы даём супертип Animal
function printBreed(d: Dog): void {
  console.log(d.breed);
}
const someone: Animal = { name: 'Kesha' };
printBreed(someone);
// ❌ Argument of type 'Animal' is not assignable to parameter of type 'Dog'.
//    Property 'breed' is missing in type 'Animal' but required in type 'Dog'`;

  protected readonly literalSubtype = `// Литерал "red" — подтип string: это ровно одно значение из всех возможных строк
let color: string = 'red'; // ✅ "red" → string: кладём в более широкий тип

let exact: 'red' = 'red';
exact = color;
// ❌ Type 'string' is not assignable to type '"red"'
// В color могла оказаться любая строка ('blue', 'green'…) — она не влезает в тип "red"`;

  protected readonly unionSupertype = `// Объединение string | number — супертип каждого своего члена
let id: string | number;
id = 'abc'; // ✅ string влезает в string | number
id = 42;    // ✅ number тоже влезает

// Обратно — из объединения в один его член — нельзя:
declare const mixed: string | number;
const onlyString: string = mixed;
// ❌ Type 'string | number' is not assignable to type 'string'
// В mixed может лежать число — использовать его как string небезопасно`;

  protected readonly unknownTop = `// unknown — супертип ВСЕХ типов (top type): в него влезает что угодно
let box: unknown;
box = 42;       // ✅
box = 'hello';  // ✅
box = { x: 1 }; // ✅

// А вот обратно — из unknown «вниз» — просто так нельзя:
const n: number = box;
// ❌ Type 'unknown' is not assignable to type 'number'

// Сначала нужно сузить тип проверкой:
if (typeof box === 'number') {
  const ok: number = box; // ✅ здесь box уже number
}`;

  protected readonly neverBottom = `// never — подтип ВСЕХ типов (bottom type): пустое множество влезает куда угодно
declare const nothing: never;

const a: string = nothing;  // ✅
const b: number = nothing;  // ✅
const c: boolean = nothing; // ✅
// Значения типа never не существует, поэтому «подставлять» на деле нечего —
// но по правилам системы типов never присваивается любому типу`;

  protected readonly neverInUnion = `// never — пустое множество. В объединении он просто исчезает:
type A = string | never;            // = string
type B = number | boolean | never;  // = number | boolean

// unknown — наоборот, вершина: в объединении он «поглощает» остальных:
type C = string | unknown;          // = unknown

// Это ровно логика множеств: X ∪ ∅ = X, а X ∪ (всё) = всё`;

  protected readonly structuralSubtype = `// Структурная («утиная») типизация: важна ФОРМА объекта, а не имя типа
type WithName = { name: string };
type User = { name: string; age: number };

const user: User = { name: 'Anna', age: 30 };

// У User свойств БОЛЬШЕ → User подтип WithName → присваивание разрешено
const named: WithName = user; // ✅ всё, что требует WithName (name), у user есть
console.log(named.name); // 'Anna'`;

  protected readonly structuralFunctionArg = `type Point = { x: number; y: number };

function vectorLength(p: Point): number {
  return Math.hypot(p.x, p.y);
}

// У point3d есть лишнее z — это делает его подтипом Point, передавать безопасно
const point3d = { x: 3, y: 4, z: 10 };
vectorLength(point3d); // ✅ 5 — функция просто не заметит z`;

  protected readonly excessPropertyCheck = `type Point = { x: number; y: number };

function vectorLength(p: Point): number {
  return Math.hypot(p.x, p.y);
}

// С объектным ЛИТЕРАЛОМ включается excess property check — проверка на лишние поля:
vectorLength({ x: 3, y: 4, z: 10 });
// ❌ Object literal may only specify known properties,
//    and 'z' does not exist in type 'Point'

// Через переменную — проходит: проверка на лишние поля работает
// только для литералов, записанных «прямо на месте»:
const p = { x: 3, y: 4, z: 10 };
vectorLength(p); // ✅`;
}
