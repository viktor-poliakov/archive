import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-declarations',
  imports: [CodeBlock, RouterLink],
  templateUrl: './declarations.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsDeclarations {
  protected readonly declarationExample = `function greet(name) {
  return 'Hello, ' + name;
}`;

  protected readonly expressionExample = `const greet = function (name) {
  return 'Hello, ' + name;
};`;

  protected readonly arrowExample = `const greet = (name) => 'Hello, ' + name;`;

  protected readonly declVsExprHoistingExample = `declared();  // 'I am declaration' — работает, объявление поднято целиком
expressed(); // TypeError: expressed is not a function

function declared() {
  return 'I am declaration';
}

var expressed = function () {
  return 'I am expression';
};`;

  protected readonly exprAsValueExample = `// expression в переменной
const sayHi = function () {
  return 'Hi';
};

// expression как аргумент (анонимная функция)
[1, 2, 3].forEach(function (n) {
  console.log(n);
});`;

  protected readonly namedExpressionExample = `const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // имя fact доступно внутри
};

factorial(5); // 120
// fact(5);   // ReferenceError: снаружи имя fact не видно`;
}
