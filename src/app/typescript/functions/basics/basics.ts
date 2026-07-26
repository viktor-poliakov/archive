import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsBasics {
  protected readonly addExample = `// Аннотации описывают, что функция ЖДЁТ и что ВОЗВРАЩАЕТ.
// a: number, b: number — оба параметра обязаны быть числами.
// : number после скобок — результат тоже число.
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);        // ✅ 5 — оба аргумента числа
add(10, 20);      // ✅ 30

add(2, '3');      // ❌ Argument of type 'string' is not assignable
                  //    to parameter of type 'number'
add(2);           // ❌ Expected 2 arguments, but got 1.`;

  protected readonly wrongArgExample = `// Проверка происходит ДО запуска — прямо в редакторе.
// В обычном JavaScript такой вызов молча дал бы '23' (склейку строк):
function add(a: number, b: number): number {
  return a + b;
}

const total = add(2, '3');
// ❌ Argument of type 'string' is not assignable to parameter
//    of type 'number'
//
// Ошибку видно сразу, а не в проде, когда пользователь получит
// вместо 5 странную строку '23'.`;

  protected readonly arrowExample = `// У стрелочной функции аннотации ставят там же:
// параметры в скобках, тип результата — после скобок, перед =>
const square = (x: number): number => x * x;

square(4);   // ✅ 16
square('4'); // ❌ Argument of type 'string' is not assignable
             //    to parameter of type 'number'

// Для тела из нескольких строк — всё так же:
const greet = (name: string): string => {
  return \`Привет, \${name}!\`;
};`;

  protected readonly inferExample = `// Тип результата можно НЕ писать — TypeScript выведет его сам,
// прочитав тело функции.
function double(x: number) {
  return x * 2; // число * число → число
}
// double выводится как (x: number) => number

const r = double(21); // r: number, значение 42

// Наведите курсор на double в редакторе — увидите
// выведённый тип :number, хотя вы его не писали.`;

  protected readonly explicitReturnExample = `// Когда стоит писать тип результата ЯВНО:

// 1) Публичный API — фиксируем «договор» функции.
//    Если тело случайно начнёт возвращать не то — ошибка будет
//    здесь, у объявления, а не у того, кто функцию вызвал.
function parsePrice(input: string): number {
  const n = Number(input);
  return n; // ← верните тут строку — TS сразу подчеркнёт эту строку
}

// 2) Ловим ошибку в теле пораньше.
function half(x: number): number {
  return String(x / 2);
  // ❌ Type 'string' is not assignable to type 'number'
  //    без явного : number ошибка «уехала» бы к месту вызова
}`;

  protected readonly fnTypeExample = `// У самой функции тоже есть тип. Записывается стрелкой:
//   (список параметров) => тип результата
// Это ТИП, а не функция: он описывает форму, а не делает вычислений.

let op: (a: number, b: number) => number;

// Подходит любая функция такой формы — имена параметров не важны,
// важны их типы и тип результата.
op = (x, y) => x + y;   // ✅ форма совпадает: (number, number) => number
op(2, 3);               // 5 — x и y уже известны как number, типы писать не нужно

op = (x, y) => x * y;   // ✅ та же форма, другое тело
op(2, 3);               // 6 — теперь op перемножает аргументы

// Не подходит функция с другим типом ПАРАМЕТРА:
op = (x: string, y: number) => y;
// ❌ Type '(x: string, y: number) => number' is not assignable to
//    type '(a: number, b: number) => number'
//    первый параметр обязан принимать number, а не string
op = (x, y) => \`\${x}\${y}\`; // ❌ Type 'string' is not assignable to
                           //    type 'number' — результат не number`;

  protected readonly callbackExample = `// Чаще всего тип-функция нужен, чтобы описать КОЛБЭК —
// функцию, которую передают внутрь другой функции.
// Параметр transform имеет тип (value: string) => string.
function shout(times: number, transform: (value: string) => string): string {
  return transform('привет').repeat(times);
}

shout(2, (s) => s.toUpperCase()); // ✅ 'ПРИВЕТПРИВЕТ'

shout(2, (s) => s.length);
// ❌ Type 'number' is not assignable to type 'string'
//    колбэк обязан вернуть string, а вернул number`;

  protected readonly implicitAnyExample = `// Параметр без аннотации TypeScript не может проверить,
// поэтому в строгом режиме (флаг noImplicitAny) это ОШИБКА.
function greet(name) {  // ❌ Parameter 'name' implicitly has an 'any' type
  return \`Привет, \${name}!\`;
}

// any «выключает» проверки: TS про такой параметр ничего не знает
// и молча пропустит любой вызов — это опасно.

// Лечится одной аннотацией:
function greetOk(name: string) { // ✅ теперь параметр под контролем
  return \`Привет, \${name}!\`;
}

greetOk(42); // ❌ Argument of type 'number' is not assignable
             //    to parameter of type 'string'`;

  protected readonly voidExample = `// Если функция ничего не возвращает — тип результата void.
// Обычно его тоже выводят автоматически, но можно указать явно.
function logMessage(text: string): void {
  console.log(text);
  // нет return со значением → результат void
}

const result = logMessage('готово');
// result: void — «полезного» значения нет, использовать его бессмысленно`;
}
