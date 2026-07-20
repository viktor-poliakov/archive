import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-literal-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './literal-types.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesLiteralTypes {
  protected readonly whatIsLiteral = `// обычный тип string — это МНОЖЕСТВО всех возможных строк
let color: string = 'red';
color = 'blue'; // ок — любая строка подходит

// литеральный тип — это РОВНО одно конкретное значение в роли типа
let red: 'red' = 'red';
red = 'red';  // ок — единственное допустимое значение
red = 'blue'; // ❌ Type '"blue"' is not assignable to type '"red"'

// литералом может быть не только строка
let answer: 42 = 42;   // числовой литерал
let done: true = true; // булев литерал`;

  protected readonly unionDirection = `// один литерал сам по себе почти бесполезен — его сила в объединении (|)
type Direction = 'left' | 'right' | 'up' | 'down';

let move: Direction;
move = 'left';  // ок
move = 'up';    // ок
move = 'right'; // ок

function step(dir: Direction) {
  console.log('moving', dir);
}

step('down'); // ок`;

  protected readonly unionError = `type Direction = 'left' | 'right' | 'up' | 'down';

function step(dir: Direction) {
  // ...
}

step('rihgt'); // ❌ опечатка! '"rihgt"' is not assignable to type 'Direction'
step('north'); // ❌ такого направления нет в списке
step('LEFT');  // ❌ регистр важен: 'LEFT' ≠ 'left'

// сравните с обычным string — там опечатка проскочит незамеченной:
function stepLoose(dir: string) {}
stepLoose('rihgt'); // для TS это ок, а ошибку вы поймаете уже в рантайме`;

  protected readonly mixWithPrimitive = `// литералы можно смешивать с примитивами в одном объединении.
// частый пример — CSS-ширина: любое ЧИСЛО или одно слово 'auto'
type Width = number | 'auto';

let w: Width;
w = 200;    // ок — подходит под number
w = 0;      // ок
w = 'auto'; // ок — единственное разрешённое слово
w = 'full'; // ❌ '"full"' is not assignable to type 'Width' — только число или 'auto'`;

  protected readonly wideningLetConst = `// const хранит ровно одно неизменное значение →
// TS выводит УЗКИЙ литеральный тип
const c = 'red'; // тип: 'red'

// let можно переприсвоить →
// TS РАСШИРЯЕТ (widening) тип до примитива, чтобы позже влезли другие строки
let l = 'red';   // тип: string
l = 'blue';      // ок — тип string это разрешает

// то же самое с числами и булевыми
const n = 42;   // тип: 42
let m = 42;     // тип: number
const b = true; // тип: true
let t = true;   // тип: boolean`;

  protected readonly wideningWhy = `// let s = 'red' получает тип string — поэтому переприсваивание работает:
let s = 'red'; // выведенный тип: string (расширен)
s = 'green';   // ок — string разрешает любую строку

// а если БЫ TS оставил тип 'red' (как у const), то строка выше
// сразу стала бы ошибкой — и менять переменную было бы нельзя.
// именно чтобы этого избежать, у let тип и расширяется до примитива.

// нужен литеральный тип и у let? Задайте его явной аннотацией:
let mode: 'dark' = 'dark';
mode = 'dark';  // ок
mode = 'light'; // ❌ Type '"light"' is not assignable to type '"dark"'`;

  protected readonly asConstObject = `// без as const поля объекта расширяются до примитивов
const point1 = { x: 10, y: 20 };
// выведенный тип: { x: number; y: number } — поле x можно переприсвоить

// as const «замораживает» объект:
const point2 = { x: 10, y: 20 } as const;
// выведенный тип: { readonly x: 10; readonly y: 20 }

point2.x = 5; // ❌ Cannot assign to 'x' because it is a read-only property`;

  protected readonly asConstArray = `// обычный массив: тип string[], а значения — просто «какие-то строки»
const colors1 = ['red', 'green', 'blue'];
// тип: string[]
colors1.push('black'); // ок — можно менять

// as const делает из него readonly-кортеж из литералов
const colors2 = ['red', 'green', 'blue'] as const;
// тип: readonly ['red', 'green', 'blue']
colors2.push('black'); // ❌ push не существует у readonly-массива

// частый приём — вытащить объединение прямо из значений массива:
type Color = (typeof colors2)[number]; // 'red' | 'green' | 'blue'`;

  protected readonly statusExample = `// набор состояний приложения — классический кейс литеральных типов
type Status = 'idle' | 'loading' | 'success' | 'error';

function render(status: Status): string {
  switch (status) {
    case 'idle':    return 'Idle';
    case 'loading': return 'Loading…';
    case 'success': return 'Done';
    case 'error':   return 'Error';
  }
}

let state: Status = 'idle';
state = 'loading'; // ок
state = 'done';    // ❌ такого статуса нет — опечатка не пройдёт компиляцию`;

  protected readonly exhaustiveNever = `type Status = 'idle' | 'loading' | 'success' | 'error';

function label(status: Status): string {
  switch (status) {
    case 'idle':    return 'Ожидание';
    case 'loading': return 'Загрузка';
    case 'success': return 'Готово';
    case 'error':   return 'Ошибка';
    default: {
      // страховка на исчерпание: пока обработаны все варианты,
      // сюда не попасть, и status здесь сужается до never.
      // добавите новый статус и забудете ветку — эта строка загорится ошибкой:
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}`;

  protected readonly buttonExample = `type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  // ...
}

Button({ variant: 'primary', size: 'md' });     // ок
Button({ variant: 'ghost', size: 'md' });       // ❌ 'ghost' нет среди вариантов
Button({ variant: 'primary', size: 'medium' }); // ❌ размер только 'sm' | 'md' | 'lg'`;

  protected readonly codesExample = `// разрешаем только валидные HTTP-методы
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function request(url: string, method: HttpMethod) {
  // ...
}

request('/api/users', 'GET');   // ок
request('/api/users', 'POST');  // ок
request('/api/users', 'FETCH'); // ❌ такого метода не существует

// числовые литералы работают так же — например, набор кодов ответа
type SuccessCode = 200 | 201 | 204;
let code: SuccessCode = 200;
code = 404; // ❌ 404 не входит в список успешных кодов`;

  protected readonly subtypeExample = `// литерал 'red' — это ПОДТИП строки string
// (частный случай: одно значение вместо всех строк сразу)
let exact: 'red' = 'red';

let anyColor: string = exact; // ок — подтип свободно кладётся в супертип
                              // («красный» — это тоже «какой-то цвет»)

let back: 'red' = anyColor;   // ❌ обратно нельзя: произвольная строка ≠ именно 'red'`;
}
