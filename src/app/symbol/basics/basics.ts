import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-symbol-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class SymbolBasics {
  protected readonly createExample = `// символ создаётся вызовом Symbol() — БЕЗ new
const id = Symbol();

typeof id; // 'symbol' — это отдельный примитивный тип

// в скобки можно передать описание (description) — просто ярлык для отладки
const userId = Symbol('user id');`;

  protected readonly uniqueExample = `// каждый вызов Symbol() создаёт НОВЫЙ уникальный символ
const a = Symbol('id');
const b = Symbol('id'); // то же описание, но...

a === b; // false — это два РАЗНЫХ символа

// символ равен только самому себе
a === a; // true`;

  protected readonly descriptionExample = `const id = Symbol('user id');

id.description; // 'user id' — читаем описание
id.toString();  // 'Symbol(user id)' — строковое представление

Symbol().description; // undefined — описания не задавали`;

  protected readonly notConstructorExample = `// символ — примитив, а не объект, поэтому new не работает
new Symbol('id'); // TypeError: Symbol is not a constructor

// правильно — просто вызвать функцию
const id = Symbol('id'); // ок`;
}
