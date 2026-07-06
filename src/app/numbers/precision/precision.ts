import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-numbers-precision',
  imports: [CodeBlock, RouterLink],
  templateUrl: './precision.html',
  styleUrls: ['../../content/doc.scss'],
})
export class NumbersPrecision {
  protected readonly floatExample = `// Дробные числа хранятся в двоичной системе ПРИБЛИЖЁННО
0.1 + 0.2;         // 0.30000000000000004 — не ровно 0.3!
0.1 + 0.2 === 0.3; // false

// Причина та же, что у 1/3 в десятичной: 0.333... точно не записать.
// В двоичной так же «не записываются» 0.1 и 0.2.
(0.1).toFixed(20); // '0.10000000000000000555' — вот что там на самом деле`;

  protected readonly epsilonExample = `// Сравнивать дробные через === опасно — сравнивайте с погрешностью.
// Number.EPSILON — наименьший заметный «шаг» точности.
const a = 0.1 + 0.2;
const b = 0.3;

a === b;                          // false
Math.abs(a - b) < Number.EPSILON; // true — равны с точностью до погрешности

Number.EPSILON; // 2.220446049250313e-16`;

  protected readonly safeIntExample = `// Целые точны только до предела MAX_SAFE_INTEGER (это 2**53 - 1)
Number.MAX_SAFE_INTEGER; // 9007199254740991

// За пределом точность теряется — соседние числа «слипаются»:
9007199254740991 + 1; // 9007199254740992 (ок)
9007199254740991 + 2; // 9007199254740992 (!) — тот же результат, что и +1

// проверить, что целое ещё «безопасно»:
Number.isSafeInteger(9007199254740991); // true
Number.isSafeInteger(9007199254740993); // false`;

  protected readonly bigintExample = `// BigInt — целые ЛЮБОГО размера без потери точности. Суффикс n
9007199254740991n + 2n; // 9007199254740993n — точно (сравните с number выше)

const big = BigInt('123456789012345678901234567890');
typeof 10n; // 'bigint'

// Нельзя смешивать BigInt и number в одной операции
10n + 5;  // TypeError!
10n + 5n; // 15n — оба операнда BigInt

// У BigInt нет дробей: деление отбрасывает остаток
7n / 2n; // 3n (а не 3.5)`;
}
