import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-classes-static-private',
  imports: [CodeBlock, RouterLink],
  templateUrl: './static-private.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClassesStaticPrivate {
  protected readonly staticExample = `class User {
  static count = 0; // принадлежит самому классу, не экземпляру

  constructor(name) {
    this.name = name;
    User.count += 1; // считаем всех созданных пользователей
  }

  // статический метод-фабрика; this внутри него — сам класс User
  static fromJSON(json) {
    return new User(JSON.parse(json).name);
  }
}

new User('Anna');
new User('Bob');
User.count; // 2 — читаем на классе, а не на экземпляре

const kate = User.fromJSON('{"name":"Kate"}');
kate.name; // 'Kate'`;

  protected readonly privateExample = `class BankAccount {
  #balance = 0; // приватное поле — доступно ТОЛЬКО внутри класса

  deposit(sum) {
    if (sum > 0) this.#balance += sum;
  }

  get balance() {
    return this.#balance; // наружу отдаём значение только для чтения
  }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;    // 100
// acc.#balance — SyntaxError: снаружи к #balance не подобраться`;

  protected readonly privateMethodExample = `class Timer {
  #seconds = 0;

  // приватный метод — тоже с # и только для внутреннего использования
  #tick() {
    this.#seconds += 1;
  }

  start() {
    this.#tick(); // вызвать можно лишь изнутри класса
  }
}`;
}
