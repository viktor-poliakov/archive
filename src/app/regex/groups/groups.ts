import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-groups',
  imports: [CodeBlock, RouterLink],
  templateUrl: './groups.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexGroups {
  protected readonly groupExample = `// скобки группируют — квантор применится ко ВСЕЙ группе
/(ab)+/.exec('ababab')[0]; // 'ababab' — 'ab' повторилось 3 раза
/ab+/.exec('abbb')[0];     // 'abbb'   — а здесь + относится только к 'b'`;

  protected readonly altExample = `/cat|dog/.test('I have a dog'); // true — 'cat' ИЛИ 'dog'

// | внутри группы — выбор из вариантов на своём месте
/\\.(jpg|png|gif)$/.test('photo.png'); // true — расширение из списка`;

  protected readonly captureExample = `const date = '2026-07-09';

// круглые скобки ЗАПОМИНАЮТ куски — потом достаём их по номеру
const m = date.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[0]; // '2026-07-09' — всё совпадение целиком
m[1]; // '2026' — 1-я группа (год)
m[2]; // '07'   — 2-я группа (месяц)
m[3]; // '09'   — 3-я группа (день)`;

  protected readonly namedExample = `const date = '2026-07-09';

// именованные группы (?<имя>...) — читать удобнее, чем m[1], m[2]
const m = date.match(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/);
m.groups.year;  // '2026'
m.groups.month; // '07'
m.groups.day;   // '09'`;

  protected readonly lookaheadExample = `// (?=...) — опережающая проверка: «за этим ДОЛЖНО идти...», но её НЕ захватываем
'100$'.match(/\\d+(?=\\$)/)[0]; // '100' — цифры, за которыми знак доллара

// (?:...) — просто группировка БЕЗ запоминания (не попадёт в m[1])
'ababc'.match(/(?:ab)+c/)[0];  // 'ababc'`;
}
