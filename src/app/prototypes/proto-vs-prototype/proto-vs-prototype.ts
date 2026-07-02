import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-prototypes-proto-vs-prototype',
  imports: [CodeBlock, RouterLink],
  templateUrl: './proto-vs-prototype.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PrototypesProtoVsPrototype {
  protected readonly coreExample = `function User(name) {
  this.name = name;
}
// метод кладём в prototype — это обычное свойство функции User
User.prototype.greet = function () {
  return this.name;
};

const u = new User('Anna');

// prototype — у функции; __proto__ — ссылка самого объекта на неё
Object.getPrototypeOf(u) === User.prototype; // true
u.__proto__ === User.prototype;              // true (то же, но __proto__ устарел)

u.greet(); // 'Anna' — метод найден в User.prototype по цепочке`;

  protected readonly constructorExample = `// по умолчанию prototype содержит ссылку constructor обратно на функцию
User.prototype.constructor === User; // true

// экземпляр видит constructor через цепочку прототипов
u.constructor === User;      // true
u.constructor.name;          // 'User'`;

  protected readonly classSameExample = `class User {
  greet() {
    return this.name;
  }
}

const u = new User();
// у классов ровно тот же механизм: методы лежат в User.prototype
Object.getPrototypeOf(u) === User.prototype; // true`;

  protected readonly arrowExample = `function Regular() {}
Regular.prototype; // { constructor: Regular } — есть

const arrow = () => {};
arrow.prototype;   // undefined — у стрелочных функций prototype НЕТ

// именно поэтому стрелочную функцию нельзя вызвать через new`;
}
