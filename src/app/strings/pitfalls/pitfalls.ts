import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-strings-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StringsPitfalls {
  protected readonly lengthExample = `'😀'.length;       // 2 — а не 1 (эмодзи = суррогатная пара)
[...'😀'].length;  // 1 — «настоящее» число символов
'hello'.length;    // 5 — для обычного текста всё как ожидается`;

  protected readonly comparisonExample = `// Сравнение строк идёт лексикографически (посимвольно), НЕ как чисел
'2' > '10';  // true!  сравниваются '2' и '1', а '2' > '1'
'10' > '9';  // false! '1' < '9'

// + приводит к строке, остальные операторы — к числу
'10' + 1;    // '101' — это конкатенация
'10' - 1;    // 9     — вычитание превратило строку в число
'5' * '2';   // 10    — оба операнда стали числами

// нестрогое == приводит типы, строгое === — нет
'5' == 5;    // true  — типы привелись
'5' === 5;   // false — разные типы`;

  protected readonly replaceExample = `'a-b-c'.replace('-', '+');    // 'a+b-c' — заменилось только ПЕРВОЕ!
'a-b-c'.replaceAll('-', '+'); // 'a+b+c' — все вхождения
'a-b-c'.replace(/-/g, '+');   // 'a+b+c' — через регулярку с флагом g`;

  protected readonly substringExample = `'abcdef'.slice(-3);     // 'def'    — отрицательный индекс = отсчёт с конца
'abcdef'.substring(-3); // 'abcdef' — substring считает -3 нулём (!)`;

  protected readonly immutableExample = `const s = 'hello';
s[0] = 'H';  // молча игнорируется (в strict mode — TypeError)
s;           // 'hello' — строка не изменилась

// правильно — собрать новую строку
const fixed = 'H' + s.slice(1); // 'Hello'`;
}
