import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-classes-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClassesBasics {
  protected readonly classExample = `class User {
  // поле экземпляра со значением по умолчанию
  role = 'guest';

  // конструктор — вызывается автоматически при new
  constructor(name, age) {
    this.name = name; // this — создаваемый объект
    this.age = age;
  }

  // метод — общий для всех экземпляров
  greet() {
    return 'Hi, I am ' + this.name;
  }
}

const anna = new User('Anna', 30);
anna.greet(); // 'Hi, I am Anna'
anna.role;    // 'guest'`;

  protected readonly instancesExample = `const anna = new User('Anna', 30);
const bob = new User('Bob', 25);

anna.name; // 'Anna'
bob.name;  // 'Bob'

// у каждого экземпляра свои данные, но метод greet — один на всех
anna.greet(); // 'Hi, I am Anna'
bob.greet();  // 'Hi, I am Bob'`;

  protected readonly accessorExample = `class Temperature {
  _celsius = 0; // соглашение: подчёркивание = "не трогать снаружи"

  // геттер: читается как свойство, но вычисляется на лету
  get fahrenheit() {
    return this._celsius * 1.8 + 32;
  }

  // сеттер: срабатывает при присваивании, удобно для проверки
  set celsius(value) {
    if (typeof value === 'number') {
      this._celsius = value;
    }
  }
}

const t = new Temperature();
t.celsius = 25;   // вызовется сеттер
t.fahrenheit;     // 77 — обращаемся как к свойству, без ()`;
}
