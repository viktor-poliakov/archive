import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-losing-context',
  imports: [CodeBlock, RouterLink],
  templateUrl: './losing-context.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextLosingContext {
  protected readonly variableExample = `const user = {
  name: 'Ann',
  greet() {
    return 'Hi, ' + this.name;
  },
};

user.greet(); // 'Hi, Ann' — есть точка, this === user

// сохранили метод в переменную — точка потерялась
const fn = user.greet;
fn(); // ошибка: this === undefined (вызов без объекта перед точкой)`;

  protected readonly destructuringExample = `const user = {
  name: 'Ann',
  greet() {
    return 'Hi, ' + this.name;
  },
};

// деструктуризация тоже отрывает метод от объекта
const { greet } = user;
greet(); // this === undefined — точки больше нет`;

  protected readonly callbackExample = `const user = {
  name: 'Ann',
  greet() {
    return 'Hi, ' + this.name;
  },
};

// передаём метод как колбэк — его позовут как простую fn(), без точки
setTimeout(user.greet, 1000);        // this потерян
[1].forEach(user.greet);             // this потерян
button.addEventListener('click', user.greet); // this потерян
Promise.resolve().then(user.greet);  // this потерян`;

  protected readonly listenerExample = `const user = {
  name: 'Ann',
  handleClick() {
    console.log(this); // НЕ user!
  },
};

// у обычной функции-обработчика this === элемент (button), а не user
button.addEventListener('click', user.handleClick);

// у стрелочной this берётся из окружения и остаётся user
button.addEventListener('click', () => user.handleClick());`;

  protected readonly nestedExample = `const user = {
  name: 'Ann',
  greetLater() {
    // вложенная ОБЫЧНАЯ функция получает свой this (undefined),
    // а не this метода greetLater
    function inner() {
      return 'Hi, ' + this.name; // this === undefined → ошибка
    }
    return inner();
  },
};

user.greetLater(); // ошибка`;

  protected readonly fixesExample = `const user = {
  name: 'Ann',
  greet() {
    return 'Hi, ' + this.name;
  },
};

// 1. стрелка-обёртка: внутри вызываем через точку
setTimeout(() => user.greet(), 1000);

// 2. bind: жёстко привязываем this
setTimeout(user.greet.bind(user), 1000);

// 3. thisArg вторым аргументом forEach/map (только для обычных функций)
[1, 2].forEach(user.greet, user);

// 4. старый приём: сохранить this в переменную
const self = user;
setTimeout(function () {
  return self.greet();
}, 1000);`;

  protected readonly classFieldExample = `class Counter {
  count = 0;

  // поле-стрелка: this навсегда привязан к экземпляру
  increment = () => {
    this.count++;
  };
}

const c = new Counter();
const inc = c.increment; // отрываем от объекта
inc(); // всё равно работает: this === c
console.log(c.count); // 1`;
}
