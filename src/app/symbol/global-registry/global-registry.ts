import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-symbol-global-registry',
  imports: [CodeBlock, RouterLink],
  templateUrl: './global-registry.html',
  styleUrls: ['../../content/doc.scss'],
})
export class SymbolGlobalRegistry {
  protected readonly problemExample = `// обычный символ уникален — «достать тот же» где-то ещё нельзя
const a = Symbol('app.id');
const b = Symbol('app.id');

a === b; // false — пришлось бы вручную передавать саму переменную a`;

  protected readonly forExample = `// Symbol.for(key) — общий реестр символов по строковому ключу
const a = Symbol.for('app.id'); // ключа ещё нет → создаём и кладём в реестр
const b = Symbol.for('app.id'); // ключ уже есть → возвращаем ТОТ ЖЕ символ

a === b; // true

// сравните с обычным Symbol(), который всегда новый:
Symbol.for('app.id') === Symbol('app.id'); // false`;

  protected readonly keyForExample = `const shared = Symbol.for('app.id');

Symbol.keyFor(shared);           // 'app.id' — под каким ключом лежит в реестре
Symbol.keyFor(Symbol('app.id')); // undefined — обычный символ в реестре не хранится`;
}
