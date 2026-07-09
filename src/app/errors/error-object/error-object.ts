import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-error-object',
  imports: [CodeBlock, RouterLink],
  templateUrl: './error-object.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsErrorObject {
  protected readonly propsExample = `const err = new Error('Something broke');

err.name;    // 'Error' — тип ошибки
err.message; // 'Something broke' — человекочитаемое описание
err.stack;   // 'Error: Something broke\\n    at ...' — где произошло (для отладки)

// первый аргумент конструктора — это message
new Error('текст').message; // 'текст'`;

  protected readonly builtinTypesExample = `// У Error есть встроенные подтипы — они говорят, ЧТО именно случилось:

null.foo;            // TypeError — значение не того типа (у null нет свойств)
notDefined;          // ReferenceError — обращение к несуществующей переменной
(5).toFixed(200);    // RangeError — число вне допустимого диапазона
JSON.parse('{ x }'); // SyntaxError — невалидный синтаксис/данные

// все они — потомки Error:
new TypeError() instanceof Error; // true`;

  protected readonly instanceofExample = `function handle(err) {
  // реагируем по ТИПУ ошибки — от частного к общему
  if (err instanceof RangeError) {
    console.log('Значение вне диапазона');
  } else if (err instanceof TypeError) {
    console.log('Неверный тип');
  } else if (err instanceof Error) {
    console.log('Другая ошибка:', err.message);
  }
}

try {
  (5).toFixed(200);
} catch (err) {
  handle(err); // 'Значение вне диапазона'
}`;

  protected readonly causeExample = `// cause (вторым аргументом Error) сохраняет ПЕРВОПРИЧИНУ, когда
// низкоуровневую ошибку заворачивают в понятную высокоуровневую
try {
  try {
    JSON.parse('{ broken }');
  } catch (err) {
    throw new Error('Не удалось загрузить настройки', { cause: err });
  }
} catch (err) {
  console.log(err.message);    // 'Не удалось загрузить настройки'
  console.log(err.cause.name); // 'SyntaxError' — исходная причина не потеряна
}`;
}
