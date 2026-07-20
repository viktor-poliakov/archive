import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-any-unknown',
  imports: [CodeBlock, RouterLink],
  templateUrl: './any-unknown.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesAnyUnknown {
  protected readonly anyBasicsExample = `let data: any = 42;

// TypeScript молчит на любое действие — проверка типов отключена
data = 'теперь строка';
data = { user: 'Аня' };

data.foo.bar.baz;        // ок для компилятора
data();                  // ок для компилятора
data.toUpperCase();      // ок для компилятора

const n: number = data;  // ок: any «подходит» под любой тип`;

  protected readonly anyRuntimeErrorExample = `let value: any = 'привет';

// Компилятор не возражает — а в рантайме всё падает:
value.toFixed(2);   // ❌ TypeError: value.toFixed is not a function
value.items[0];     // ❌ TypeError: Cannot read properties of undefined
value();            // ❌ TypeError: value is not a function

// Проблему нашли не при сборке, а когда код уже выполнялся у пользователя.`;

  protected readonly anyContagionExample = `const raw: any = getConfig();       // функция вернула any

const port = raw.port;              // port: any     ← «заразилось»
const next = port * 2;              // next: any     ← и это тоже
const url = 'http://host:' + port;  // url: string, но по пути никто ничего не проверил

// any растекается: всё, что вычислено из any, тоже становится any,
// и компилятор перестаёт проверять целые куски программы.`;

  protected readonly unknownAssignExample = `let box: unknown;

// Положить в unknown можно что угодно — ровно как в any:
box = 42;
box = 'строка';
box = { id: 1 };
box = [1, 2, 3];
box = null;`;

  protected readonly unknownUseErrorExample = `let box: unknown = 'привет';

box.toUpperCase();      // ❌ 'box' is of type 'unknown'
box.length;             // ❌ 'box' is of type 'unknown'
box();                  // ❌ 'box' is of type 'unknown'
const s: string = box;  // ❌ Type 'unknown' is not assignable to type 'string'

// unknown принимает всё, но НЕ даёт ничего с собой сделать,
// пока вы не докажете компилятору настоящий тип значения.`;

  protected readonly topTypeExample = `// unknown — «вершина»: в него можно положить любой тип...
const a: unknown = 123;
const b: unknown = 'x';
const c: unknown = true;

// ...но сам unknown нельзя присвоить в конкретный тип без проверки:
const n: number = a;          // ❌ Type 'unknown' is not assignable to type 'number'

// any же совместим в обе стороны — потому он и «дыра» в типах:
let anyVal: any = 5;
const s: string = anyVal;     // ок (никакой проверки)
const arr: number[] = anyVal; // ок (никакой проверки)`;

  protected readonly narrowTypeofExample = `function printValue(x: unknown) {
  // x.length;  // ❌ ещё нельзя — тип неизвестен

  if (typeof x === 'string') {
    // внутри этой ветки TypeScript уверен: x — это string
    console.log(x.length);         // ок
    console.log(x.toUpperCase());  // ок
  } else if (typeof x === 'number') {
    console.log(x.toFixed(2));     // ок: здесь x — number
  } else {
    console.log('другой тип');
  }
}`;

  protected readonly narrowInstanceofExample = `function describe(value: unknown) {
  if (value instanceof Date) {
    // сузили до Date — доступны его методы
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    // сузили до массива
    return \`массив из \${value.length} элементов\`;
  }
  return String(value);
}`;

  protected readonly catchErrorExample = `try {
  JSON.parse(input);
} catch (err) {
  // При strict тип err — unknown (с TS 4.4), а не any.
  // Бросить можно что угодно (throw 'строка', throw 42), поэтому сначала проверяем:
  if (err instanceof SyntaxError) {
    console.error('Битый JSON:', err.message);
  } else {
    console.error('Что-то пошло не так:', err);
  }
}`;

  protected readonly jsonParseAnyExample = `// Встроенный JSON.parse возвращает any — это дыра в типизации:
const user = JSON.parse(response);  // user: any
user.nmae.toUpperCase();            // опечатка в 'name' — компилятор промолчит ❌

// Безопаснее сразу пометить результат как unknown и проверить форму:
const data: unknown = JSON.parse(response);

if (typeof data === 'object' && data !== null && 'name' in data) {
  const named = data as { name: string };
  console.log(named.name.toUpperCase()); // теперь безопасно
}`;

  protected readonly noImplicitAnyExample = `// noImplicitAny ВЫКЛЮЧЕН: параметр без типа молча становится any
function greet(name) {          // name: any (неявно)
  return 'Привет, ' + name.toUpperCase();
}
greet(42);                      // компилятор молчит → в рантайме упадёт ❌

// noImplicitAny ВКЛЮЧЁН (входит в strict): такой параметр — ошибка сборки
function greetStrict(name) {    // ❌ Parameter 'name' implicitly has an 'any' type.
  return 'Привет, ' + name.toUpperCase();
}

// Правильно — указать тип явно:
function greetOk(name: string) {
  return 'Привет, ' + name.toUpperCase();
}`;

  protected readonly tsconfigExample = `{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}`;

  protected readonly whenAnyOkExample = `// 1) Быстрая миграция большого JS-файла на TS — временно глушим ошибки:
let legacy: any = oldGlobalThing;

// 2) Нетипизированная библиотека без описаний типов (.d.ts):
declare const analytics: any;
analytics.track('click', { id: 42 });

// Это осознанные, точечные исключения. По умолчанию, когда тип заранее
// неизвестен, берите unknown — он заставит проверить значение перед использованием.`;
}
