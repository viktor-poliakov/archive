import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-strings-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StringsMethods {
  protected readonly searchExample = `const str = 'The quick brown fox';

// Проверка на вхождение — самое читаемое
str.includes('quick');    // true
str.startsWith('The');    // true
str.endsWith('fox');      // true

// Позиция подстроки (или -1, если не найдена)
str.indexOf('o');         // 12 — первое вхождение
str.lastIndexOf('o');     // 17 — последнее
str.indexOf('cat');       // -1 — не найдено`;

  protected readonly extractExample = `const str = 'JavaScript';

// slice(start, end): end НЕ включается, понимает отрицательные индексы
str.slice(0, 4);     // 'Java'
str.slice(4);        // 'Script' — до конца
str.slice(-6);       // 'Script' — 6 символов с конца
str.slice(-6, -3);   // 'Scr'

// substring — почти как slice, но отрицательные считает нулём
str.substring(0, 4); // 'Java'
str.substring(-6);   // 'JavaScript' — -6 превратилось в 0 (!)`;

  protected readonly caseTrimExample = `'Hello'.toUpperCase();  // 'HELLO'
'Hello'.toLowerCase();  // 'hello'

// trim убирает пробелы по КРАЯМ (не внутри строки)
'  hi  '.trim();        // 'hi'
'  hi  '.trimStart();   // 'hi  '
'  hi  '.trimEnd();     // '  hi'`;

  protected readonly replaceExample = `const str = 'cat dog cat';

// replace со строкой меняет ТОЛЬКО первое совпадение
str.replace('cat', 'fox');    // 'fox dog cat'

// replaceAll меняет все вхождения
str.replaceAll('cat', 'fox'); // 'fox dog fox'

// то же через регулярное выражение с флагом g
str.replace(/cat/g, 'fox');   // 'fox dog fox'

// функция-заменитель: получает совпадение и возвращает замену
'a1b2'.replace(/\\d/g, (d) => \`[\${d}]\`); // 'a[1]b[2]'`;

  protected readonly splitPadExample = `// split разбивает строку в массив по разделителю
'a,b,c'.split(',');   // ['a', 'b', 'c']
'hello'.split('');    // ['h', 'e', 'l', 'l', 'o'] — по символам
'a b  c'.split(' ');  // ['a', 'b', '', 'c'] — двойной пробел даёт пустой элемент

// массив обратно в строку — join (это метод массива)
['a', 'b', 'c'].join('-'); // 'a-b-c'

// repeat повторяет строку
'ab'.repeat(3);       // 'ababab'

// padStart / padEnd дополняют до нужной длины
'5'.padStart(3, '0'); // '005'
'5'.padEnd(3, '.');   // '5..'`;
}
