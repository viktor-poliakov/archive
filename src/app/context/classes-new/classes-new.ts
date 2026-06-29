import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-classes-new',
  imports: [CodeBlock, RouterLink],
  templateUrl: './classes-new.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextClassesNew {
  protected readonly newExample = `class User {
  constructor(name) {
    // new создал пустой объект и сделал его this
    this.name = name;
  }
  greet() {
    return 'Hi, ' + this.name;
  }
}

const u = new User('Ann');
u.greet(); // 'Hi, Ann' — this === u`;

  protected readonly forgotNewExample = `class User {
  constructor(name) {
    this.name = name;
  }
}

// class обязателен вызывать с new
User('Ann'); // TypeError: Class constructor cannot be invoked without 'new'`;

  protected readonly lostMethodExample = `class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return 'Hi, ' + this.name;
  }
}

const u = new User('Ann');

// методы класса лежат в прототипе и теряют this при отрыве —
// так же, как методы обычного объекта
const fn = u.greet;
fn(); // ошибка: тело класса строгое → this === undefined`;

  protected readonly fixExample = `class Button {
  label = 'OK';

  // 1. поле-стрелка: this навсегда привязан к экземпляру
  handleClick = () => {
    console.log(this.label);
  };
}

class Button2 {
  label = 'OK';
  constructor() {
    // 2. bind в конструкторе — старый, но рабочий способ
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this.label);
  }
}`;

  protected readonly getterStaticExample = `class Circle {
  constructor(r) {
    this.r = r;
  }
  // в геттере this — объект, у которого читают свойство
  get area() {
    return Math.PI * this.r ** 2;
  }
  // в статическом методе this — сам класс (Circle)
  static unit() {
    return new this(1);
  }
}

new Circle(2).area; // 12.566...
Circle.unit();      // Circle { r: 1 }`;
}
