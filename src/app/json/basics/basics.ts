import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-json-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class JsonBasics {
  protected readonly roundTripExample = `// JS-объект живёт в памяти программы
const user = { name: 'Anna', age: 30 };

// JSON — тот же набор данных, записанный ТЕКСТОМ
const json = JSON.stringify(user);

json;        // '{"name":"Anna","age":30}'
typeof json; // 'string' — JSON это всегда строка`;

  protected readonly jsonDocExample = `{
  "name": "Anna",
  "age": 30,
  "isAdmin": false,
  "spouse": null,
  "pets": ["cat", "dog"],
  "address": {
    "city": "Berlin"
  }
}`;

  protected readonly jsObjectExample = `// В объектном литерале JS многое разрешено...
const obj = {
  name: 'Anna',   // ключ без кавычек, строка в одинарных
  greet() {},     // метод (функция)
  age: undefined, // значение undefined
};                // висячая запятая — тоже ок

// ...но в JSON ничего из этого нельзя (см. таблицу ниже)`;
}
