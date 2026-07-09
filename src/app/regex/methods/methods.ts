import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexMethods {
  protected readonly testExecExample = `const re = /\\d+/;
re.test('id 42');     // true          — есть ли совпадение
re.exec('id 42');     // ['42', index: 3, ...] — массив с деталями
re.exec('no digits'); // null          — совпадения нет`;

  protected readonly matchExample = `const str = 'a1 b2 c3';

// без g: ПЕРВОЕ совпадение + его группы (index, groups)
str.match(/(\\w)(\\d)/); // ['a1', 'a', '1', index: 0, ...]

// с g: массив ВСЕХ совпадений, но БЕЗ групп
str.match(/\\w\\d/g);    // ['a1', 'b2', 'c3']

str.match(/xyz/);      // null — ничего не нашли`;

  protected readonly matchAllExample = `const str = 'a1 b2 c3';

// matchAll (нужен флаг g) — итератор всех совпадений ВМЕСТЕ с группами
for (const m of str.matchAll(/(\\w)(\\d)/g)) {
  console.log(m[1], m[2]); // 'a' '1', затем 'b' '2', затем 'c' '3'
}

// удобно сразу собрать в массив:
[...str.matchAll(/(\\w)(\\d)/g)].length; // 3`;

  protected readonly replaceExample = `// $1, $2, $3 — вставить захваченные группы в результат
'2026-07-09'.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, '$3.$2.$1');
// '09.07.2026' — поменяли формат даты

// функция-заменитель: получает совпадение и возвращает замену
'a1b2'.replace(/\\d/g, (d) => \`[\${d}]\`); // 'a[1]b[2]'

// именованные группы — через $<имя>
'2026-07-09'.replace(/(?<y>\\d{4})-(?<m>\\d{2})-(?<d>\\d{2})/, '$<d>.$<m>.$<y>');
// '09.07.2026'`;

  protected readonly splitSearchExample = `// split по регулярке-разделителю (любые пробелы вокруг запятой)
'a, b,c ,  d'.split(/\\s*,\\s*/); // ['a', 'b', 'c', 'd']

// search — индекс первого совпадения или -1
'room 42'.search(/\\d/);   // 5
'no digits'.search(/\\d/);  // -1`;
}
