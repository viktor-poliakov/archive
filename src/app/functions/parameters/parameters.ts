import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-parameters',
  imports: [CodeBlock, RouterLink],
  templateUrl: './parameters.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsParameters {
  protected readonly defaultParamsExample = `function greet(name = 'guest') {
  return 'Hello, ' + name;
}

greet();       // 'Hello, guest'
greet('Anna'); // 'Hello, Anna'`;

  protected readonly restParamsExample = `function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3);    // 6
sum(10, 20);     // 30`;

  protected readonly destructureParamsExample = `function createUser({ name, age = 18 }) {
  return name + ', ' + age;
}

createUser({ name: 'Anna' });          // 'Anna, 18'
createUser({ name: 'Ivan', age: 30 }); // 'Ivan, 30'`;

  protected readonly paramAsVariableExample = `function greet(name) {
  name = name.trim();    // параметр можно переприсваивать, как переменную
  name = name || 'guest';
  return 'Hello, ' + name;
}

greet('  Anna  '); // 'Hello, Anna'
greet('');         // 'Hello, guest'`;

  protected readonly paramScopeExample = `function multiply(a, b) {
  const result = a * b; // result и параметры a, b живут только внутри функции
  return result;
}

multiply(2, 3); // 6

// console.log(a);      // ReferenceError: a снаружи не существует
// console.log(result); // ReferenceError: result снаружи не существует`;

  protected readonly paramPrimitiveExample = `function increment(n) {
  n = n + 1; // меняем локальную копию, а не исходную переменную
  return n;
}

let count = 5;
increment(count);   // вернёт 6
console.log(count); // 5 — внешняя переменная не изменилась`;

  protected readonly returnExample = `function logMessage(text) {
  console.log(text);
  // нет return → функция вернёт undefined
}

const result = logMessage('Hi'); // result === undefined`;
}
