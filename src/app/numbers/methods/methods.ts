import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-numbers-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class NumbersMethods {
  protected readonly toNumberExample = `// Number(...) — строгое преобразование: ВСЯ строка должна быть числом
Number('42');    // 42
Number('3.14');  // 3.14
Number('  42 '); // 42 — пробелы по краям игнорируются
Number('');      // 0  — пустая строка это 0 (неожиданно!)
Number('12px');  // NaN — любой «мусор» в строке → не число
Number(true);    // 1
Number(null);    // 0

// Унарный + делает то же самое, но короче
+'42'; // 42`;

  protected readonly parseExample = `// parseInt/parseFloat «прощающие»: читают число с начала строки
// и останавливаются на первом нечисловом символе
parseInt('12px');    // 12
parseFloat('3.14m'); // 3.14
parseInt('  42abc'); // 42

// Но если строка начинается НЕ с цифры — сразу NaN
parseInt('px12');    // NaN

// ВАЖНО: второй аргумент parseInt — основание (radix). Указывайте его явно:
parseInt('11', 2);   // 3   — '11' в двоичной системе
parseInt('ff', 16);  // 255 — 'ff' в шестнадцатеричной
parseInt('08', 10);  // 8   — десятичная`;

  protected readonly checksExample = `// Глобальный isNaN сначала ПРИВОДИТ аргумент к числу — отсюда сюрпризы
isNaN('abc'); // true  — 'abc' превратился в NaN
isNaN('42');  // false — '42' превратился в 42

// Number.isNaN строгий: true только для настоящего NaN, без приведения
Number.isNaN(NaN);   // true
Number.isNaN('abc'); // false — строка это не NaN

// Number.isFinite — конечное ли число (тоже без приведения типов)
Number.isFinite(42);       // true
Number.isFinite(Infinity); // false
Number.isFinite('42');     // false — строка это не число

// Number.isInteger — целое ли число
Number.isInteger(5);   // true
Number.isInteger(5.1); // false`;

  protected readonly formatExample = `const price = 3.14159;

// toFixed(N) — округлить до N знаков после точки. ВОЗВРАЩАЕТ СТРОКУ!
price.toFixed(2); // '3.14'
price.toFixed(0); // '3'
(5).toFixed(2);   // '5.00'

// toPrecision(N) — N значащих цифр
(123.456).toPrecision(4); // '123.5'

// toString(основание) — запись в другой системе счисления
(255).toString(16); // 'ff'

// toLocaleString — «человеческий» формат по локали (разряды, валюта)
(1234567.89).toLocaleString('ru-RU'); // '1 234 567,89'`;
}
