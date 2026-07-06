import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-numbers-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class NumbersPitfalls {
  protected readonly nanExample = `// NaN — единственное значение, не равное самому себе
NaN === NaN; // false
typeof NaN;  // 'number' — да, NaN формально это «число»!

// Поэтому проверять на NaN через === бесполезно — только Number.isNaN:
const x = Number('oops'); // NaN
x === NaN;       // false — так НЕ проверить
Number.isNaN(x); // true  — так правильно`;

  protected readonly parseVsNumberExample = `// parseInt и Number по-разному ведут себя на «неидеальных» строках
Number('');       // 0    — пустая строка это ноль
parseInt('');     // NaN

Number('12px');   // NaN  — вся строка должна быть числом
parseInt('12px'); // 12   — читает число с начала

Number('  ');     // 0    — строка из пробелов это ноль
parseInt('  ');   // NaN`;

  protected readonly toFixedExample = `// toFixed округляет ДВОИЧНОЕ представление — и иногда мажет на копейку
(1.005).toFixed(2); // '1.00' — а ожидали '1.01'!
// причина: 1.005 хранится как 1.00499999... — чуть меньше

(0.615).toFixed(2); // '0.61' — снова «мимо»

// и помните: toFixed возвращает СТРОКУ, а не число
typeof (3.14).toFixed(1); // 'string'`;

  protected readonly isNaNExample = `// Глобальный isNaN сначала приводит аргумент к числу — и потому «врёт»
isNaN('abc'); // true  — 'abc' превратился в NaN
isNaN('');    // false — '' превратилось в 0
isNaN('123'); // false — '123' превратилось в 123

// Number.isNaN не приводит типы: спрашивает «это ровно NaN?»
Number.isNaN('abc'); // false — строка не есть NaN`;
}
