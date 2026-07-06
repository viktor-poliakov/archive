import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-strings-templates',
  imports: [CodeBlock, RouterLink],
  templateUrl: './templates.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StringsTemplates {
  protected readonly interpolationExample = `const name = 'Ada';
const a = 5, b = 3;

// Внутри \${...} — ЛЮБОЕ выражение, не только имя переменной
\`Hello, \${name}!\`;              // 'Hello, Ada!'
\`Sum: \${a + b}\`;                // 'Sum: 8'
\`Upper: \${name.toUpperCase()}\`; // 'Upper: ADA'
\`\${a > b ? 'more' : 'less'}\`;   // 'more'`;

  protected readonly multilineExample = `// Обратные кавычки сохраняют переносы строк как есть
const text = \`First line
Second line
Third line\`;

// Раньше многострочность собирали вручную через \\n:
const old = 'First line\\n' +
  'Second line\\n' +
  'Third line';`;

  protected readonly nestedExample = `const user = { name: 'Ada', isAdmin: true };

// Тернарный оператор прямо внутри подстановки
\`Role: \${user.isAdmin ? 'admin' : 'user'}\`; // 'Role: admin'

// Шаблонные строки можно вкладывать друг в друга
const items = ['a', 'b'];
\`List: \${items.map((x) => \`[\${x}]\`).join(' ')}\`; // 'List: [a] [b]'`;

  protected readonly tagAnatomyExample = `// Тег видит шаблон «разобранным»: статичные куски и значения — отдельно
function inspect(strings, ...values) {
  console.log(strings); // ['Name: ', ', age: ', '!'] — статичные куски
  console.log(values);  // ['Ada', 36]                — подставленные значения
  return strings;
}

const name = 'Ada';
const age = 36;
inspect\`Name: \${name}, age: \${age}!\`;

// Статичных кусков ВСЕГДА на один больше, чем значений: шаблон начинается
// и заканчивается текстом (пусть даже пустой строкой '')`;

  protected readonly taggedExample = `// Тег highlight оборачивает КАЖДОЕ подставленное значение в <b>…</b>,
// а статичный текст оставляет как есть
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const value = i < values.length ? \`<b>\${values[i]}</b>\` : '';
    return acc + str + value;
  }, '');
}

const name = 'Ada';
const age = 36;
highlight\`Name: \${name}, age: \${age}\`;
// 'Name: <b>Ada</b>, age: <b>36</b>'`;

  protected readonly safeHtmlExample = `// Частый реальный тег: экранирование HTML (защита от XSS).
// Статичному тексту шаблона доверяем, а подставляемым значениям — нет.
function safe(strings, ...values) {
  const escape = (s) =>
    String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');

  return strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? escape(values[i]) : ''),
    '',
  );
}

const comment = '<script>alert(1)</script>';
safe\`<p>\${comment}</p>\`;
// '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>' — вставка обезврежена`;

  protected readonly rawExample = `// Обычная строка обрабатывает \\n, \\t и другие escape-последовательности
\`a\\nb\`.length;           // 3 — здесь \\n это ОДИН символ (перенос строки)

// String.raw — встроенный тег: отдаёт текст «как написан», не трогая слэши
String.raw\`a\\nb\`.length; // 4 — это символы 'a', '\\', 'n', 'b'
String.raw\`C:\\temp\\new\`; // 'C:\\temp\\new' — удобно для путей и регулярок

// В своём теге сырые куски доступны через strings.raw
function raw(strings) {
  return strings.raw[0];
}
raw\`line\\nbreak\`;        // 'line\\nbreak' — обратный слэш сохранён`;
}
