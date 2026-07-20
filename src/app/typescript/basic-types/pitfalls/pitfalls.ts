import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesPitfalls {
  protected readonly anyPropagation = `// any заражает всё, к чему прикоснётся
const data: any = JSON.parse('{"count":"пять"}');

const count = data.count;   // тип count — снова any (не string!)
const total = count * 2;    // ⚠️ компилятор молчит: any разрешает любую операцию

console.log(total);         // 💥 NaN — баг увидели только в рантайме`;

  protected readonly anyIntoTyped = `// any не только «заражает» переменные — он проходит в любой типизированный параметр
function save(user: { id: number; name: string }): void {
  console.log(user.id.toFixed(0));   // рассчитываем, что id — число
}

const fromApi: any = { id: 'сорок два', name: 'Аня' };

save(fromApi);   // ⚠️ компилятор молчит: значение типа any подходит под любой тип
// 💥 в рантайме: у строки 'сорок два' нет метода toFixed`;

  protected readonly unknownInstead = `// unknown — «безопасный any»: сначала докажи тип, потом действуй
const data: unknown = JSON.parse('{"count":"пять"}');

// const total = data.count * 2;   // ❌ ошибка: 'data' имеет тип unknown

// ✅ сузили тип проверками — только теперь TypeScript разрешит работу
if (
  typeof data === 'object' &&
  data !== null &&
  'count' in data &&
  typeof data.count === 'number'
) {
  // здесь TypeScript уже точно знает: data.count — это number
  const total = data.count * 2;
  console.log(total);
}`;

  protected readonly noImplicitAny = `// Без noImplicitAny параметр молча получает тип any
function greet(name) {                    // ❌ с noImplicitAny: параметр неявно имеет тип any
  return 'Привет, ' + name.toUppercase(); // опечатку в toUpperCase никто не поймает
}

// ✅ явный тип — и компилятор сразу ловит опечатку
function greetOk(name: string) {
  return 'Привет, ' + name.toUpperCase();
}`;

  protected readonly tsconfigStrict = `{
  "compilerOptions": {
    "strict": true,           // включает сразу набор строгих проверок
    "noImplicitAny": true,    // запрет «молчаливого» any
    "strictNullChecks": true  // null/undefined больше не входят в любой тип
  }
}`;

  protected readonly objectEmptyObject = `// {} — почти НЕ ограничивает: подходит всё, кроме null и undefined
let a: {} = 42;        // ок
let b: {} = 'строка';  // ок
let c: {} = true;      // ок
let d: {} = [1, 2];    // ок
// let e: {} = null;   // ❌ вот это (и undefined) — единственное, что отсекается

// Object (с большой буквы) — практически то же самое, тоже почти бесполезен
let f: Object = 123;   // ок

// object (с маленькой буквы) — «любой НЕ примитив»
let g: object = { id: 1 }; // ок
// let h: object = 42;     // ❌ число — примитив, под object не подходит`;

  protected readonly objectProperShape = `// ❌ слишком широко: {} ничего не гарантирует
function printId(user: {}) {
  // return user.id;   // ❌ у типа {} нет свойства id
}

// ✅ конкретная форма объекта — компилятор знает поля
function printIdOk(user: { id: number; name: string }) {
  console.log(user.id, user.name);
}

// ✅ или Record, когда ключи заранее неизвестны, а тип значений один
const scores: Record<string, number> = { math: 5, physics: 4 };`;

  protected readonly numberNaNInfinity = `// Тип number включает NaN и Infinity — аннотация от них не спасает
function average(nums: number[]): number {
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;    // пустой массив → 0 / 0 → NaN
}

const huge: number = 1 / 0;    // Infinity — тоже вполне валидный number

console.log(average([]));       // 💥 NaN
console.log(huge);              // Infinity`;

  protected readonly numberGuard = `// ✅ проверяем «настоящее» ли число сами — тип этого не делает
function averageOk(nums: number[]): number {
  if (nums.length === 0) return 0;

  const result = nums.reduce((a, b) => a + b, 0) / nums.length;

  if (!Number.isFinite(result)) {   // отсекает и NaN, и ±Infinity
    throw new Error('Некорректный результат: ' + result);
  }
  return result;
}`;

  protected readonly strictNullOff = `// БЕЗ strictNullChecks: null и undefined незаметно входят в любой тип
function getLength(text: string): number {
  return text.length;
}

getLength(null);   // ⚠️ без strictNullChecks компилятор молчит → 💥 TypeError в рантайме`;

  protected readonly strictNullOn = `// СО strictNullChecks: чтобы принять null, его надо разрешить и обработать
function getLength(text: string | null): number {
  if (text === null) return 0;   // ✅ обязаны учесть этот случай
  return text.length;            // здесь text гарантированно string
}

getLength(null);   // ок — null обработан явно`;

  protected readonly excessLiteral = `interface Point {
  x: number;
  y: number;
}

// ❌ excess property check: лишнее свойство в ЛИТЕРАЛЕ ловится сразу
const p: Point = { x: 1, y: 2, z: 3 };
//                             ~~~~
// Object literal may only specify known properties, and 'z' does not exist in type 'Point'.`;

  protected readonly excessViaVariable = `interface Point {
  x: number;
  y: number;
}

const raw = { x: 1, y: 2, z: 3 };   // тип выведен со ВСЕМИ полями
const p: Point = raw;               // ✅ проходит — лишнее z «просочилось»

// Почему так: структурная типизация спрашивает «есть ли всё нужное?».
// У raw есть x и y → он совместим с Point, лишние поля игнорируются.
// Прямой литерал — особый случай: для него включают доп. проверку на лишнее.`;

  protected readonly asLie = `const value: unknown = 'на самом деле строка';

// as ничего НЕ проверяет и НЕ преобразует — это «поверь мне на слово»
const n = value as number;   // компилятор молча соглашается

console.log(n.toFixed(2));   // 💥 TypeError в рантайме: n — строка, а не число`;

  protected readonly asDoubleLie = `const id: string = 'abc';

// У as всё же есть крохотная защита: два несовместимых типа напрямую он не даст утвердить
// const n = id as number;   // ❌ ошибка: типы string и number не пересекаются

// Но двойное утверждение через unknown обходит и её — «ложь в квадрате»
const n = id as unknown as number;   // компилятор снова молчит
console.log(n.toFixed(2));           // 💥 TypeError в рантайме`;

  protected readonly asProper = `const value: unknown = 'на самом деле строка';

// ✅ вместо as — настоящая проверка, которая сужает тип
if (typeof value === 'number') {
  console.log(value.toFixed(2)); // сюда попадём, только если это реально число
} else {
  console.log('Это не число:', value);
}`;

  protected readonly tuplePush = `const pair: [number, number] = [10, 20];

pair.push(30);        // ⚠️ .push компилятор НЕ запрещает — в кортеже уже 3 элемента
console.log(pair);    // [10, 20, 30] — обещанная «длина 2» нарушена
console.log(pair.length); // 3

// при этом pair[2] по типам «не существует», хотя значение там реально лежит`;

  protected readonly tupleReadonly = `// ✅ readonly-кортеж запрещает мутирующие методы (push, pop, splice...)
const pair: readonly [number, number] = [10, 20];

// pair.push(30);   // ❌ у readonly-кортежа нет метода push

const [a, b] = pair;  // читать и разбирать по-прежнему можно
console.log(a, b);    // 10 20`;
}
