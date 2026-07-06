import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-strings-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StringsBasics {
  protected readonly quotesExample = `// Одинарные и двойные кавычки равнозначны — выберите одни и держитесь их
const a = 'Hello';
const b = "Hello";

// Обратные кавычки (backticks) — шаблонные строки, им посвящена отдельная страница
const c = \`Hello\`;

// Кавычки внутри кавычек: берём другой вид или экранируем
const d = "It's fine";       // ' внутри "..."
const e = 'She said "hi"';   // " внутри '...'
const f = 'It\\'s escaped';   // \\' — экранируем кавычку того же вида`;

  protected readonly escapeExample = `// Спецсимволы задаются обратным слэшем
'Line 1\\nLine 2';    // \\n — перенос строки
'Col1\\tCol2';        // \\t — табуляция
'Path: C:\\\\temp';     // \\\\ — сам обратный слэш
'She said \\'hi\\'';    // \\' — кавычка того же вида

// Символ по его коду в Юникоде
'\\u0041';           // 'A'  — ровно 4 hex-цифры
'\\u{1F600}';        // '😀' — код в фигурных скобках, любой длины`;

  protected readonly lengthAccessExample = `const str = 'Hello';

str.length;     // 5 — длина (точнее, число кодовых единиц — см. «Юникод»)
str[0];         // 'H' — доступ по индексу, нумерация с нуля
str.at(-1);     // 'o' — at() понимает отрицательные индексы (с конца)
str.charAt(1);  // 'e' — старый способ, то же, что str[1]

// Отдельного типа «символ» в JS нет: str[0] — это строка длины 1
typeof str[0];  // 'string'`;

  protected readonly immutableExample = `let str = 'Hello';

// Изменить символ по индексу НЕЛЬЗЯ:
str[0] = 'J';   // молча не сработает (в strict mode — TypeError)
str;            // 'Hello' — строка не изменилась

// Методы не трогают оригинал, а возвращают НОВУЮ строку
const upper = str.toUpperCase();
upper;          // 'HELLO'
str;            // 'Hello' — оригинал цел

// «Изменение» строки — это переприсваивание переменной новым значением
str = 'J' + str.slice(1);
str;            // 'Jello'`;

  protected readonly concatExample = `// Склеивание (конкатенация) оператором +
const first = 'Ada';
const last = 'Lovelace';
first + ' ' + last;    // 'Ada Lovelace'

// += дописывает к строке
let greeting = 'Hello';
greeting += ', world'; // 'Hello, world'

// Число рядом со строкой приводится к строке
'age: ' + 25;   // 'age: 25' — число стало строкой
25 + '';        // '25'      — быстрый способ привести число к строке

// Для сборки из многих кусков читаемее шаблонные строки (см. отдельную страницу)
\`\${first} \${last}, age \${25}\`; // 'Ada Lovelace, age 25'`;
}
