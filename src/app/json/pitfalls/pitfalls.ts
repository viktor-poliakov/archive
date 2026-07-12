import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-json-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class JsonPitfalls {
  protected readonly datesExample = `const data = { when: new Date('2026-01-01') };

const json = JSON.stringify(data);
json; // '{"when":"2026-01-01T00:00:00.000Z"}' — дата стала строкой

const back = JSON.parse(json);
back.when;        // '2026-01-01T00:00:00.000Z' — это СТРОКА, не Date
typeof back.when; // 'string'`;

  protected readonly specialNumbersExample = `// NaN и Infinity не выразимы в JSON — превращаются в null
JSON.stringify(NaN);        // 'null'
JSON.stringify(Infinity);   // 'null'
JSON.stringify({ n: NaN }); // '{"n":null}'

// BigInt сериализовать вообще нельзя
JSON.stringify(10n); // TypeError: Do not know how to serialize a BigInt`;

  protected readonly precisionExample = `// большие целые числа теряют точность (выходят за безопасный предел)
const json = '{"id": 12345678901234567890}';

JSON.parse(json).id; // 12345678901234567000 — последние цифры «уплыли»

// поэтому большие идентификаторы хранят и передают как строку:
// { "id": "12345678901234567890" }`;

  protected readonly circularExample = `const user = { name: 'Anna' };
user.self = user; // объект ссылается сам на себя

JSON.stringify(user);
// TypeError: Converting circular structure to JSON`;
}
