import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-call-apply-bind',
  imports: [CodeBlock, RouterLink],
  templateUrl: './call-apply-bind.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextCallApplyBind {
  protected readonly callApplyExample = `function introduce(greeting, punctuation) {
  return greeting + ', ' + this.name + punctuation;
}

const user = { name: 'Ann' };

// call — аргументы перечисляем списком
introduce.call(user, 'Hi', '!'); // 'Hi, Ann!'

// apply — аргументы передаём массивом (apply = array)
introduce.apply(user, ['Hi', '!']); // 'Hi, Ann!'`;

  protected readonly bindExample = `function introduce() {
  return 'Hi, ' + this.name;
}

const user = { name: 'Ann' };

// bind не вызывает функцию, а возвращает новую с привязанным this
const greetUser = introduce.bind(user);

greetUser(); // 'Hi, Ann' — this навсегда === user`;

  protected readonly partialExample = `function multiply(a, b) {
  return a * b;
}

// предзаполняем первый аргумент (this не нужен → null)
const double = multiply.bind(null, 2);

double(5);  // 10
double(10); // 20`;

  protected readonly doubleBindExample = `function show() {
  return this.label;
}

const a = { label: 'A' };
const b = { label: 'B' };

// bind «сцепляется» только один раз — повторный bind игнорируется
const bound = show.bind(a).bind(b);

bound(); // 'A', а не 'B'`;

  protected readonly borrowExample = `// заимствование метода: применяем метод одного объекта к другому
const arrayLike = { 0: 'a', 1: 'b', length: 2 };

// у arrayLike нет своего join, одалживаем у массива
const result = Array.prototype.join.call(arrayLike, '-');
console.log(result); // 'a-b'

// apply удобен, чтобы «развернуть» массив в аргументы
const numbers = [5, 1, 9, 3];
Math.max.apply(null, numbers); // 9`;
}
