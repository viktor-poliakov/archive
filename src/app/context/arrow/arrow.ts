import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-arrow',
  imports: [CodeBlock, RouterLink],
  templateUrl: './arrow.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextArrow {
  protected readonly lexicalExample = `const timer = {
  seconds: 0,
  start() {
    // стрелка берёт this из start(), где this === timer
    setInterval(() => {
      this.seconds++; // работает: this === timer
    }, 1000);
  },
};`;

  protected readonly brokenRegularExample = `const timer = {
  seconds: 0,
  start() {
    // обычная функция заводит свой this (по умолчанию undefined)
    setInterval(function () {
      this.seconds++; // ошибка: this не timer
    }, 1000);
  },
};`;

  protected readonly cannotRebindExample = `const arrow = () => this;

// bind/call/apply не меняют this стрелки — он лексический
arrow.call({ x: 1 });  // вернёт внешний this, а не { x: 1 }
arrow.bind({ x: 1 })(); // тоже внешний this

// (аргументы при этом передаются как обычно)`;

  protected readonly methodTrapExample = `const user = {
  name: 'Ann',

  // ЛОВУШКА: стрелка как метод объекта
  greet: () => 'Hi, ' + this.name,
};

// this здесь — внешняя область (модуль → undefined, скрипт → window),
// а НЕ user
user.greet(); // 'Hi, undefined'

// правильно — обычный (сокращённый) метод:
const ok = {
  name: 'Ann',
  greet() {
    return 'Hi, ' + this.name;
  },
};
ok.greet(); // 'Hi, Ann'`;
}
