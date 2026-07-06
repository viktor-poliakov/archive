import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-numbers-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class NumbersBasics {
  protected readonly basicExample = `// В JS один числовой тип — number (64-битный double).
// Целые и дробные — это одни и те же number, отдельного int нет.
typeof 42;   // 'number'
typeof 3.14; // 'number'
1 === 1.0;   // true — 1 и 1.0 это одно и то же число

// Для очень больших целых есть отдельный примитив BigInt (см. «Точность»)
typeof 10n;  // 'bigint'`;

  protected readonly literalsExample = `// Экспоненциальная запись — число × 10 в степени N
1e6;     // 1000000 (миллион)
2.5e-3;  // 0.0025

// Разделитель _ для читаемости; на значение не влияет
1_000_000;             // 1000000
1_000_000 === 1000000; // true

// Дробную часть или ведущий ноль можно опустить (но лучше не надо)
.5;  // 0.5
5.;  // 5`;

  protected readonly basesExample = `// Ввод числа в разных системах счисления
0xff;    // 255 — шестнадцатеричная (hex)
0b1010;  // 10  — двоичная (binary)
0o17;    // 15  — восьмеричная (octal)

// Вывод числа в другой системе — toString(основание)
(255).toString(16); // 'ff'
(10).toString(2);   // '1010'
(255).toString(2);  // '11111111'`;

  protected readonly specialExample = `// NaN — «не число», результат некорректной вычислительной операции
Number('abc'); // NaN
0 / 0;         // NaN
NaN === NaN;   // false — NaN не равен даже сам себе! (проверка — Number.isNaN)

// Infinity — «бесконечность»: деление на ноль или переполнение
1 / 0;    // Infinity
-1 / 0;   // -Infinity
1e400;    // Infinity — слишком большое, в double не поместилось

// -0 существует отдельно от 0 (почти всегда ведёт себя как обычный 0)
-0 === 0;         // true
Object.is(-0, 0); // false — так их можно различить`;
}
