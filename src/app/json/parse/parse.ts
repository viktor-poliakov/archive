import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-json-parse',
  imports: [CodeBlock, RouterLink],
  templateUrl: './parse.html',
  styleUrls: ['../../content/doc.scss'],
})
export class JsonParse {
  protected readonly basicExample = `const json = '{"name":"Anna","age":30,"pets":["cat","dog"]}';

const user = JSON.parse(json);

user.name;    // 'Anna'
user.age;     // 30
user.pets[0]; // 'cat'
typeof user;  // 'object' — снова полноценный объект`;

  protected readonly reviverExample = `const json = '{"title":"Party","date":"2026-01-01T00:00:00.000Z"}';

// второй аргумент — reviver: вызывается для каждого значения при разборе.
// здесь превращаем строку-дату обратно в настоящий объект Date
const event = JSON.parse(json, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});

event.date instanceof Date; // true`;

  protected readonly errorExample = `// невалидный JSON бросает SyntaxError
JSON.parse("{'name':'Anna'}"); // SyntaxError — одинарные кавычки
JSON.parse('{"name":"Anna",}'); // SyntaxError — висячая запятая

// данные «извне» (сеть, файл) всегда разбираем в try/catch
const input = '{ broken json';

try {
  const data = JSON.parse(input);
  console.log(data);
} catch (error) {
  console.error('Broken JSON:', error.message);
}`;
}
