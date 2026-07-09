import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-char-classes',
  imports: [CodeBlock, RouterLink],
  templateUrl: './char-classes.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexCharClasses {
  protected readonly classesExample = `/\\d/.test('5');   // true  — \\d: цифра
/\\w/.test('_');   // true  — \\w: буква, цифра или _
/\\s/.test(' ');   // true  — \\s: пробельный символ

// заглавная версия — это ОТРИЦАНИЕ:
/\\D/.test('5');   // false — \\D: НЕ цифра
'Room 101'.match(/\\d+/g); // ['101'] — одна или больше цифр подряд`;

  protected readonly setsExample = `/[aeiou]/.test('sky');  // false — ни одной из перечисленных гласных
/[a-z]/.test('Hello');  // true  — есть строчная латинская буква (диапазон)
/[^0-9]/.test('42');    // false — все символы цифры (нет НИ одной не-цифры)
/gr[ae]y/.test('grey'); // true  — совпадёт 'gray' ИЛИ 'grey'

/./.test('x');          // true  — точка = любой символ (кроме перевода строки)`;

  protected readonly anchorsExample = `/^\\d/.test('5 apples'); // true  — строка НАЧИНАЕТСЯ с цифры
/\\d$/.test('room 7');    // true  — строка ЗАКАНЧИВАЕТСЯ цифрой
/^\\d+$/.test('12345');   // true  — строка ЦЕЛИКОМ из цифр
/^\\d+$/.test('12a45');   // false — внутри есть буква

/\\bcat\\b/.test('a cat sat'); // true  — 'cat' как отдельное слово
/\\bcat\\b/.test('category');  // false — 'cat' внутри слова не в счёт`;

  protected readonly escapeExample = `// спецсимволы (. * + ? [ ] ( ) …) экранируют слэшем, чтобы искать БУКВАЛЬНО
/3.14/.test('3x14');    // true  — точка тут = ЛЮБОЙ символ (!)
/3\\.14/.test('3x14');   // false — \\. это буквально точка
/3\\.14/.test('3.14');   // true

/a\\+b/.test('a+b');     // true  — ищем плюс как обычный символ`;
}
