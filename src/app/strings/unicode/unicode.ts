import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-strings-unicode',
  imports: [CodeBlock, RouterLink],
  templateUrl: './unicode.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StringsUnicode {
  protected readonly codePointExample = `const str = 'ABC';

// Кодовая точка (code point) — номер символа в таблице Юникода
str.codePointAt(0);        // 65 — код 'A'
String.fromCodePoint(65);  // 'A'

// Старые методы работают с 16-битными кодовыми единицами
str.charCodeAt(0);         // 65
String.fromCharCode(65);   // 'A'

// Для символов из основной таблицы (BMP) оба подхода совпадают
'A'.codePointAt(0) === 'A'.charCodeAt(0); // true`;

  protected readonly surrogateExample = `const emoji = '😀';

// Эмодзи не влезает в одну 16-битную ячейку — это СУРРОГАТНАЯ ПАРА
emoji.length;         // 2 — а не 1!
emoji[0];             // '\\ud83d' — половинка пары, сама по себе бессмысленна
emoji.charCodeAt(0);  // 55357 — код первой половинки

// codePointAt читает пару целиком и даёт настоящий код символа
emoji.codePointAt(0);          // 128512
String.fromCodePoint(128512);  // '😀'`;

  protected readonly iterateExample = `const str = 'a😀b';

// Индекс и length работают по кодовым ЕДИНИЦАМ — эмодзи «весит» 2
str.length;       // 4 (a + две половинки + b)
str[1];           // '\\ud83d' — половинка, а не '😀'

// for...of и spread идут по кодовым ТОЧКАМ — эмодзи целиком
[...str];         // ['a', '😀', 'b']
[...str].length;  // 3 — «настоящее» число символов

for (const ch of str) {
  // ch по очереди: 'a', '😀', 'b'
}`;

  protected readonly normalizeExample = `// Один и тот же на вид символ 'é' можно записать двумя способами
const composed = '\\u00e9';    // 'é' — одна кодовая точка
const decomposed = 'e\\u0301'; // 'e' + знак ударения — две точки

composed === decomposed; // false! на вид одинаковы, по «байтам» — нет
composed.length;         // 1
decomposed.length;       // 2

// normalize приводит к единой форме — и сравнение становится честным
composed.normalize() === decomposed.normalize(); // true`;

  protected readonly localeCompareExample = `// Оператор < сравнивает по кодам кодовых единиц, а НЕ по алфавиту языка
'a' < 'B';  // false — код 'a' (97) больше кода 'B' (66)!
'A' < 'a';  // true  — все заглавные латинские идут раньше строчных

// localeCompare сравнивает по правилам языка: <0, 0 или >0
'a'.localeCompare('B'); // отрицательное — по алфавиту 'a' раньше 'B'

// сортировка массива строк с учётом локали
['б', 'ё', 'а', 'я'].sort((x, y) => x.localeCompare(y, 'ru'));
// ['а', 'б', 'ё', 'я']`;
}
