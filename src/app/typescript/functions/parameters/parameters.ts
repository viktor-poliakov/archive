import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-parameters',
  imports: [CodeBlock, RouterLink],
  templateUrl: './parameters.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsParameters {
  protected readonly optionalBasicExample = `// Знак вопроса после имени делает параметр необязательным.
function greet(name: string, greeting?: string): string {
  // Внутри функции тип greeting — это string | undefined:
  // второй аргумент могли и не передать.
  return \`\${greeting.toUpperCase()}, \${name}!\`;
  // ❌ 'greeting' is possibly 'undefined'.
}

// Зато при вызове второй аргумент можно спокойно опустить —
// забыть про него больше не ошибка:
greet('Аня');           // второй аргумент не передан — это ОК
greet('Боб', 'Салют');  // передан`;

  protected readonly optionalAccessExample = `function greet(name: string, greeting?: string): string {
  // Сначала убеждаемся, что значение есть, — тогда undefined
  // уходит из типа, и методы становятся доступны.
  if (greeting === undefined) {
    return \`Привет, \${name}!\`;
  }
  // здесь greeting сузился до string
  return \`\${greeting.toUpperCase()}, \${name}!\`;
}

greet('Аня');           // ✅ 'Привет, Аня!'
greet('Боб', 'салют');  // ✅ 'САЛЮТ, Боб!'`;

  protected readonly optionalOrderExample = `// ❌ Необязательный параметр не может стоять ПЕРЕД обязательным.
function greet(greeting?: string, name: string): string {
  return \`\${greeting}, \${name}!\`;
}
// A required parameter cannot follow an optional parameter.

// ✅ Правильный порядок: сначала все обязательные, потом необязательные.
function greetOk(name: string, greeting?: string): string {
  return greeting === undefined
    ? \`Привет, \${name}!\`
    : \`\${greeting}, \${name}!\`;
}`;

  protected readonly defaultBasicExample = `// Знак = задаёт значение по умолчанию.
// Тип greeting TypeScript ВЫВЕДЕТ из значения — здесь это string.
function greet(name: string, greeting = 'Привет'): string {
  // Внутри функции тип greeting — просто string (не string | undefined):
  // значение гарантировано, проверять на undefined нечего.
  return \`\${greeting}, \${name}!\`;
}

greet('Аня');           // ✅ 'Привет, Аня!' — сработало значение по умолчанию
greet('Боб', 'Салют');  // ✅ 'Салют, Боб!'

// Тип можно указать и явно — результат тот же, но нагляднее:
function repeat(text: string, times: number = 1): string {
  return text.repeat(times);
}`;

  protected readonly defaultAppliesExample = `function greet(name: string, greeting = 'Привет'): string {
  return \`\${greeting}, \${name}!\`;
}

// Значение по умолчанию подставляется в ДВУХ случаях:

// 1) аргумент вообще не передан
greet('Аня');             // 'Привет, Аня!'

// 2) на месте аргумента ЯВНО стоит undefined
greet('Аня', undefined);  // 'Привет, Аня!'

// null «пустотой» для значения по умолчанию НЕ считается —
// и вдобавок не подходит по типу (greeting выведен как string):
greet('Аня', null);
// ❌ Argument of type 'null' is not assignable to
//    parameter of type 'string'.`;

  protected readonly defaultRefEarlierExample = `// Значение по умолчанию — это ВЫРАЖЕНИЕ. Оно вычисляется при каждом
// вызове, когда аргумент опущен, и может ссылаться на предыдущие параметры.
function makeRange(start: number, end: number = start + 4): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
}

makeRange(1);     // [1, 2, 3, 4, 5] — end = start + 4 = 5
makeRange(1, 3);  // [1, 2, 3]       — end передан явно`;

  protected readonly cannotCombineExample = `// ❌ Нельзя одновременно поставить и ?, и значение по умолчанию.
function greet(name: string, greeting?: string = 'Привет'): string {
  return \`\${greeting}, \${name}!\`;
}
// Parameter cannot have question mark and initializer.

// Причина: значение по умолчанию УЖЕ делает параметр необязательным.
// Знак ? становится лишним — оставьте что-то одно:
function greetOk(name: string, greeting = 'Привет'): string {
  return \`\${greeting}, \${name}!\`;
}`;

  protected readonly requiredAfterDefaultExample = `// TypeScript РАЗРЕШАЕТ поставить обязательный параметр после параметра
// со значением по умолчанию — ошибки в самом объявлении нет.
function box(width = 10, label: string): string {
  return \`\${label}: \${width}px\`;
}

// Но аргументы позиционные. Наивный вызов не проходит:
// 'ширина' встаёт на место width (а не label).
box('ширина');
// ❌ Argument of type 'string' is not assignable to
//    parameter of type 'number'.   (и label остаётся незаполненным)

// Чтобы оставить width по умолчанию и задать label,
// приходится ЯВНО передать undefined на место width:
box(undefined, 'ширина'); // ✅ 'ширина: 10px' — width снова 10

// Правило: параметры со значением по умолчанию ставьте В КОНЦЕ —
// тогда о них можно вообще не думать при вызове.
function boxBetter(label: string, width = 10): string {
  return \`\${label}: \${width}px\`;
}
boxBetter('ширина'); // ✅ 'ширина: 10px'`;
}
