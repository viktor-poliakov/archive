import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexBasics {
  protected readonly createExample = `// 1) литерал — между слэшами (самый частый способ)
const re1 = /hello/;

// 2) конструктор — когда паттерн собирается из переменной
const word = 'hello';
const re2 = new RegExp(word);       // то же самое
const re3 = new RegExp(word, 'gi'); // флаги — вторым аргументом

// в конструкторе спецсимволы экранируют ДВОЙНЫМ слэшем:
new RegExp('\\\\d+'); // то же, что литерал /\\d+/`;

  protected readonly testExample = `// test — есть ли хоть одно совпадение? Возвращает true / false
/\\d/.test('abc');    // false — цифр нет
/\\d/.test('abc5');   // true  — есть цифра
/cat/i.test('CAT');  // true  — флаг i игнорирует регистр`;

  protected readonly flagsExample = `'a1 b2 c3'.match(/\\d/);  // ['1']            — без g только ПЕРВОЕ
'a1 b2 c3'.match(/\\d/g); // ['1', '2', '3']  — g: все совпадения

/hello/i.test('HELLO');  // true — i: без учёта регистра`;
}
