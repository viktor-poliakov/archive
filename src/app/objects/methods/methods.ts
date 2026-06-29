import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsMethods {
  protected readonly methodExample = `const user = {
  name: 'Ann',
  // свойство, значение которого — функция, называют методом
  greet: function () {
    return 'Hello!';
  },
};

console.log(user.greet()); // 'Hello!'`;

  protected readonly shorthandExample = `const user = {
  name: 'Ann',

  // сокращённая запись метода — без слова function и двоеточия
  greet() {
    return 'Hello!';
  },
};

console.log(user.greet()); // 'Hello!'`;

  protected readonly thisExample = `const user = {
  name: 'Ann',
  greet() {
    // this — это объект, у которого вызвали метод (здесь — user)
    return 'Hi, I am ' + this.name;
  },
};

console.log(user.greet()); // 'Hi, I am Ann'`;

  protected readonly lostThisExample = `const user = {
  name: 'Ann',
  greet() {
    return 'Hi, I am ' + this.name;
  },
};

// отрываем метод от объекта — теряем this
const fn = user.greet;
fn(); // ошибка или 'undefined': this больше не указывает на user

// чтобы привязать this, есть bind:
const bound = user.greet.bind(user);
bound(); // 'Hi, I am Ann'`;

  protected readonly chainExample = `const calc = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // возвращаем сам объект — это и есть «цепочка»
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
};

// каждый метод вернул this, поэтому вызовы можно сцепить
const result = calc.add(5).multiply(3).value;
console.log(result); // 15`;
}
