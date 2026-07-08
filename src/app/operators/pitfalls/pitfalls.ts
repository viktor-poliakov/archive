import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-operators-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class OperatorsPitfalls {
  protected readonly eqTrapsExample = `// == полон исключений. Самые коварные:
null == undefined; // true
null == 0;         // false — но...
null >= 0;         // true!  — >= приводит null к 0, а == не приводит
'' == 0;           // true  — '' превратилось в 0
'0' == 0;          // true  — '0' превратилось в 0
'0' == '';         // false — здесь сравниваются строки, а не числа

// Вывод: используйте === и не полагайтесь на ==`;

  protected readonly plusTrapExample = `// + вычисляется слева направо, и одна строка «заражает» весь остаток
1 + 2 + '3'; // '33'  — сначала (1 + 2) = 3, потом 3 + '3' = '33'
'1' + 2 + 3; // '123' — '1' + 2 = '12', потом '12' + 3 = '123'
1 + '2' + 1; // '121'

// число рядом с массивом тоже даёт строку:
1 + [2];     // '12' — [2] превратился в строку '2'`;

  protected readonly precedenceExample = `// Приоритет: * и / выполняются раньше + и -
2 + 2 * 2;   // 6, а не 8
(2 + 2) * 2; // 8 — скобки меняют порядок

// && связывает сильнее, чем ||
true || (false && false); // true

// ?? нельзя смешивать с || или && без скобок — это СИНТАКСИЧЕСКАЯ ошибка:
// null ?? 1 || 2   // SyntaxError!
(null ?? 1) || 2;   // 1 — со скобками всё однозначно`;
}
