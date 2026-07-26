import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-overloads',
  imports: [CodeBlock, RouterLink],
  templateUrl: './overloads.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsOverloads {
  protected readonly problemExample = `// Хотим точную зависимость: строка на входе — строка на выходе,
// число на входе — число на выходе. Например, «удвоить»:
// 'ab' -> 'abab', а 5 -> 10.

// Попытка описать это ОДНОЙ сигнатурой через объединение:
function double(x: string | number): string | number {
  if (typeof x === 'string') return x + x;
  return x * 2;
}

const s = double('ab'); // тип: string | number — а хотели просто string
const n = double(5);    // тип: string | number — а хотели просто number

s.toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'string | number'.
//    Property 'toUpperCase' does not exist on type 'number'.
//    Компилятор знает лишь «строка ИЛИ число» — и не даёт строковый метод.`;

  protected readonly syntaxExample = `// 1) Сначала — сигнатуры ПЕРЕГРУЗОК: без тела, только форма вызова.
function double(x: string): string;
function double(x: number): number;

// 2) Потом — ОДНА реализация с телом. Её параметры достаточно широки,
//    чтобы покрыть все перегрузки. Снаружи эту строку не видно.
function double(x: string | number): string | number {
  if (typeof x === 'string') return x + x;
  return x * 2;
}

const s = double('ab'); // ✅ тип: string
const n = double(5);    // ✅ тип: number

s.toUpperCase(); // ✅ теперь ок — s точно string
n.toFixed(2);    // ✅ n точно number`;

  protected readonly hiddenImplExample = `function double(x: string): string;
function double(x: number): number;
function double(x: string | number): string | number {
  if (typeof x === 'string') return x + x;
  return x * 2;
}

double('ab'); // ✅ подходит под перегрузку double(x: string)
double(5);    // ✅ подходит под перегрузку double(x: number)

// Хотя РЕАЛИЗАЦИЯ принимает string | number, снаружи видны
// только две перегрузки — и boolean не подходит ни под одну:
double(true);
// ❌ No overload matches this call.
//    Overload 1 of 2, '(x: string): string', gave the following error.
//      Argument of type 'boolean' is not assignable to parameter of type 'string'.`;

  protected readonly orderBadExample = `// Перегрузки перебираются сверху вниз — побеждает ПЕРВАЯ подходящая.

// ❌ Общая сигнатура стоит сверху и «перехватывает» вызов,
//    до более точной дело не доходит:
function first(arr: unknown[]): unknown;
function first(arr: string[]): string;
// Реализация покрывает ОБЕ перегрузки. Писать (unknown | string)[] не нужно:
// unknown поглощает string в объединении → это ровно тот же unknown[].
function first(arr: unknown[]): unknown {
  return arr[0];
}

const a = first(['a', 'b']); // тип: unknown — сработала верхняя перегрузка`;

  protected readonly orderGoodExample = `// ✅ Более ТОЧНУЮ перегрузку ставим ВЫШЕ более общей:
function first(arr: string[]): string;
function first(arr: unknown[]): unknown;
function first(arr: unknown[]): unknown {
  return arr[0];
}

const a = first(['a', 'b']); // ✅ тип: string  — подошла верхняя, точная
const b = first([1, 2, 3]);  // ✅ тип: unknown — string[] не подошёл, взяли общую`;

  protected readonly methodExample = `// Метод можно перечислить несколькими сигнатурами прямо в интерфейсе —
// это перегрузка метода.
interface Calc {
  run(a: number, b: number): number; // сложить два числа
  run(a: string, b: string): string; // склеить две строки
}

declare const calc: Calc;

const sum = calc.run(2, 3);      // ✅ тип: number
const text = calc.run('a', 'b'); // ✅ тип: string

// То же в псевдониме типа — перегрузки описывают через форму вызова:
type Merge = {
  (a: number, b: number): number;
  (a: string, b: string): string;
};`;

  protected readonly unionInsteadExample = `// Часто перегрузки избыточны. Сначала проверьте более простые варианты.

// 1) Один параметр-объединение — если тип РЕЗУЛЬТАТА один и тот же:
function idLabel(id: number | string): string {
  return \`#\${id}\`;
}

// 2) Необязательный параметр — вместо двух перегрузок «с ним / без него»:
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? 'Привет'}, \${name}!\`;
}`;

  protected readonly genericInsteadExample = `// 3) Дженерик — если тип результата ПОВТОРЯЕТ тип аргумента
//    (чистый «проход насквозь», без ветвления по типу):
function identity<T>(value: T): T {
  return value;
}

const a = identity('ab'); // ✅ тип: string
const b = identity(5);    // ✅ тип: number
const c = identity(true); // ✅ тип: boolean — и так для любого типа

// Перегрузки здесь были бы длиннее: под каждый новый тип пришлось бы
// дописывать ещё одну строку. Дженерик покрывает все типы сразу.`;
}
