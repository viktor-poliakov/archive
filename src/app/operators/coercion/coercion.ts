import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-operators-coercion',
  imports: [CodeBlock, RouterLink],
  templateUrl: './coercion.html',
  styleUrls: ['../../content/doc.scss'],
})
export class OperatorsCoercion {
  protected readonly explicitExample = `// Явное преобразование — мы сами вызываем функцию-преобразователь
Number('42'); // 42
String(42);   // '42'
Boolean(0);   // false

// (детали Number() и parseInt — в разделе «Числа и Math»)`;

  protected readonly toBoolExample = `// К boolean значение приводится в if, в !, в логических операторах.
// Falsy-значений всего 8 — всё остальное truthy:
Boolean(false);     // false
Boolean(0);         // false
Boolean('');        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false

// частые сюрпризы — это truthy:
Boolean('0');  // true — непустая строка!
Boolean([]);   // true — любой массив
Boolean({});   // true — любой объект`;

  protected readonly toNumberExample = `// К числу приводят: арифметика (кроме +), сравнения, унарный +
Number('');        // 0
Number('  12  ');  // 12  — пробелы по краям игнорируются
Number('12px');    // NaN — «мусор» не разбирается
Number(true);      // 1
Number(false);     // 0
Number(null);      // 0
Number(undefined); // NaN

// массивы и объекты тоже приводятся — иногда неожиданно:
Number([]);    // 0   — пустой массив
Number([5]);   // 5   — массив из одного числа
Number([1, 2]);// NaN — из нескольких элементов
Number({});    // NaN`;

  protected readonly toStringExample = `// К строке приводят: + со строкой, String(), шаблонные строки
String(42);        // '42'
String(true);      // 'true'
String(null);      // 'null'
String(undefined); // 'undefined'

// массив склеивается через запятую, объект даёт [object Object]
String([1, 2, 3]); // '1,2,3'
String({});        // '[object Object]'

// неявно — через + со строкой или через шаблон
'' + 42;        // '42'
\`value: \${42}\`; // 'value: 42'`;

  protected readonly objectCoercionExample = `// Объект сначала приводится к примитиву (обычно через toString)
[] + [];   // ''               — оба массива стали пустыми строками
[] + {};   // '[object Object]'
[1] + [2]; // '12'             — '1' + '2'
1 + [2];   // '12'             — число + строка '2'

// массив → строка: элементы через запятую (как join)
[1, 2, 3] + ''; // '1,2,3'

// управлять приведением можно методами valueOf / toString / Symbol.toPrimitive`;
}
