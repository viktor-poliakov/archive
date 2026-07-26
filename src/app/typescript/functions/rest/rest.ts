import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-rest',
  imports: [CodeBlock, RouterLink],
  templateUrl: './rest.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsRest {
  protected readonly syntaxExample = `// Три точки перед последним параметром собирают ВСЕ оставшиеся
// аргументы вызова в один массив. Такой параметр называют rest.
function sum(...nums: number[]): number {
  // внутри функции nums — это обычный массив чисел
  let total = 0;
  for (const n of nums) total += n;
  return total;
}

sum(1, 2, 3);   // 6  — три аргумента собрались в [1, 2, 3]
sum(10, 20);    // 30 — можно передать сколько угодно
sum();          // 0  — и ни одного тоже: тогда nums = []

sum(1, 'два', 3); // ❌ Argument of type 'string' is not assignable
                  //    to parameter of type 'number'
                  //    каждый аргумент должен подойти под number`;

  protected readonly mustBeArrayExample = `// Тип rest-параметра — ВСЕГДА тип массива: number[], string[], User[]...
function joinWords(...words: string[]): string {
  return words.join(' ');
}
joinWords('Привет', 'мир'); // 'Привет мир'

// ❌ голый тип элемента (не массив) для rest запрещён
function bad(...x: number): void {}
// A rest parameter must be of an array type.`;

  protected readonly rulesExample = `// Обычные параметры могут стоять ПЕРЕД rest — он забирает «всё остальное».
function log(label: string, ...values: number[]): void {
  console.log(label + ':', values);
}

log('Очки', 10, 20, 30); // Очки: [10, 20, 30]
log('Пусто');            // Пусто: []  — rest собрал ноль аргументов

// label получает первый аргумент, а всё, что идёт после него, — в values.`;

  protected readonly rulesErrorExample = `// ❌ rest обязан быть ПОСЛЕДНИМ — после него параметров быть не может
function wrong(...nums: number[], label: string): void {}
// A rest parameter must be last in a parameter list.

// ❌ и rest-параметр может быть только ОДИН
function alsoWrong(...a: number[], ...b: string[]): void {}
// A rest parameter must be last in a parameter list.`;

  protected readonly collectVsSpreadExample = `// СБОР (в объявлении): три точки складывают аргументы в массив.
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// РАЗВОРАЧИВАНИЕ (в вызове): три точки раскладывают массив в аргументы.
const scores = [1, 2, 3];
sum(...scores); // то же самое, что sum(1, 2, 3) → 6

// «Три точки» одни и те же, но роль зависит от места:
//   в списке параметров → СОБИРАЮТ аргументы в массив (rest);
//   в месте вызова       → РАЗВОРАЧИВАЮТ массив в аргументы (spread).`;

  protected readonly spreadTypeExample = `function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

const nums: number[] = [1, 2, 3];
sum(...nums);  // ✅ элементы number подходят под number[]

const words: string[] = ['a', 'b'];
sum(...words); // ❌ Argument of type 'string' is not assignable
               //    to parameter of type 'number'

// Массив смешанного типа тоже не пройдёт целиком:
const mixed = [1, 'два']; // выведенный тип (string | number)[]
sum(...mixed); // ❌ string нельзя подставить в number-параметр`;

  protected readonly tupleRestExample = `// rest можно типизировать КОРТЕЖЕМ — тогда это фиксированный набор
// аргументов на конкретных позициях, а не «сколько угодно».
function makePair(...args: [number, string]): string {
  const [id, name] = args; // args гарантированно из двух элементов
  return \`\${id}: \${name}\`;
}

makePair(1, 'Аня');  // ✅ ровно number, затем string
makePair(1);         // ❌ Expected 2 arguments, but got 1.
makePair('Аня', 1);  // ❌ порядок и типы не совпали`;

  protected readonly labeledTupleExample = `// Элементы кортежа можно ПОДПИСАТЬ — имена видны в подсказках редактора.
// Здесь: сначала один обязательный number, дальше сколько угодно string.
function tag(...args: [id: number, ...labels: string[]]): void {
  const [id, ...labels] = args;
  console.log(id, labels);
}

tag(1);                  // 1 []              — только id
tag(1, 'new', 'urgent'); // 1 ['new', 'urgent']
tag('x');                // ❌ первый аргумент должен быть number`;

  protected readonly wrapperExample = `// Задача: обёртка над функцией — что-то добавить вокруг вызова (лог),
// но принять и передать РОВНО те же аргументы, что у исходной функции.
function sendMessage(to: string, text: string): void {
  console.log(to + ': ' + text);
}

// Parameters<> достаёт список параметров функции — как кортеж:
type SendArgs = Parameters<typeof sendMessage>;
// SendArgs = [to: string, text: string]

// Кладём этот кортеж в rest обёртки — и разворачиваем обратно при вызове:
function logged(...args: SendArgs): void {
  console.log('Отправляем с аргументами:', ...args);
  sendMessage(...args); // тот же набор аргументов уходит дальше
}

logged('Аня', 'привет'); // ✅ ок
logged('Аня', 42);       // ❌ Argument of type 'number' is not assignable to parameter of type 'string'.
logged('Аня');           // ❌ Expected 2 arguments, but got 1.

// Бонус: поменяете параметры sendMessage — logged подхватит их сам,
// переписывать список аргументов вручную не нужно.`;
}
