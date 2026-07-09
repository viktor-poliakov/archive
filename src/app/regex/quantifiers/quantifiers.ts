import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-quantifiers',
  imports: [CodeBlock, RouterLink],
  templateUrl: './quantifiers.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexQuantifiers {
  protected readonly quantifiersExample = `/colou?r/.test('color');   // true — ? : буква 'u' необязательна
/colou?r/.test('colour');  // true

/\\d+/.exec('abc123')[0];      // '123' — + : одна или больше цифр
/\\d*/.exec('abc')[0];         // ''    — * : ноль или больше (совпало пусто)
/\\d{3}/.test('12');           // false — {3} : ровно три цифры
/\\d{2,4}/.exec('123456')[0];  // '1234' — {2,4} : от 2 до 4 (жадно берёт 4)`;

  protected readonly greedyExample = `const text = '"a" and "b"';

// жадный .+ хватает как можно БОЛЬШЕ — от первой кавычки до последней
text.match(/".+"/)[0]; // '"a" and "b"' — захватил всё разом!`;

  protected readonly lazyExample = `const text = '"a" and "b"';

// ленивый .+? хватает как можно МЕНЬШЕ — до первой закрывающей кавычки
text.match(/".+?"/)[0]; // '"a"'
text.match(/".+?"/g);   // ['"a"', '"b"'] — с флагом g нашёл обе пары`;
}
