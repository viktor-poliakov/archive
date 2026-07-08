import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-operators-arithmetic',
  imports: [CodeBlock, RouterLink],
  templateUrl: './arithmetic.html',
  styleUrls: ['../../content/doc.scss'],
})
export class OperatorsArithmetic {
  protected readonly arithExample = `// Базовая арифметика
7 + 3;  // 10
7 - 3;  // 4
7 * 3;  // 21
7 / 3;  // 2.333... — деление даёт дробь, если не делится нацело
7 % 3;  // 1  — остаток от деления
2 ** 3; // 8  — возведение в степень (2 в кубе)

// Остаток % удобен для проверки чётности
10 % 2; // 0 — чётное
7 % 2;  // 1 — нечётное`;

  protected readonly plusExample = `// + СЛОЖИТ, если оба операнда — числа
2 + 3; // 5

// но СКЛЕИТ, если хотя бы один операнд — строка (конкатенация)
'2' + 3;             // '23'
2 + '3';             // '23'
'Hello, ' + 'world'; // 'Hello, world'

// это уникальная черта +. Другие операторы приводят строку к числу:
'6' - 1; // 5
'6' * 2; // 12`;

  protected readonly unaryExample = `// Унарный + быстро приводит значение к числу (короче, чем Number())
+'42';  // 42
+'';    // 0
+true;  // 1
-'5';   // -5 — унарный минус тоже приводит к числу и меняет знак

// Инкремент ++ и декремент -- меняют переменную на единицу
let n = 5;
n++; // вернёт 5, а ПОТОМ n станет 6 (постфикс)
++n; // сначала n станет 7, затем вернёт 7 (префикс)
console.log(n); // 7`;

  protected readonly assignExample = `let x = 10;

x += 5;  // x = x + 5  → 15
x -= 3;  // x = x - 3  → 12
x *= 2;  // x = x * 2  → 24
x /= 4;  // x = x / 4  → 6
x %= 4;  // x = x % 4  → 2
x **= 3; // x = x ** 3 → 8

// += работает и со строками (конкатенация)
let s = 'a';
s += 'b'; // 'ab'`;
}
