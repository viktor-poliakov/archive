import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-classes-under-the-hood',
  imports: [CodeBlock, RouterLink],
  templateUrl: './under-the-hood.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClassesUnderTheHood {
  protected readonly sugarExample = `class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return this.name;
  }
}

// класс — это функция; почти то же самое можно написать "руками":
function User2(name) {
  this.name = name;
}
User2.prototype.greet = function () {
  return this.name;
};

typeof User; // 'function' — да, класс это функция`;

  protected readonly whereLivesExample = `class User {
  role = 'guest'; // поле — на каждом экземпляре
  greet() {}      // метод — один в User.prototype
}

const u = new User();
Object.hasOwn(u, 'role');  // true  — собственное поле экземпляра
Object.hasOwn(u, 'greet'); // false — метод живёт в прототипе, а не на объекте`;

  protected readonly hoistingExample = `new User(); // ReferenceError: доступ до объявления запрещён

class User {}

// в отличие от function declaration, класс НЕ "всплывает" готовым:
// до строки объявления он в «мёртвой зоне» (TDZ)`;

  protected readonly thisPitfallExample = `class Button {
  text = 'OK';

  // обычный метод теряет this, если оторвать его от объекта
  handleClick() {
    console.log(this.text);
  }

  // поле-стрелка привязывает this к экземпляру навсегда
  handleClickArrow = () => {
    console.log(this.text);
  };
}

const btn = new Button();
setTimeout(btn.handleClick, 0);      // undefined — this потерян
setTimeout(btn.handleClickArrow, 0); // 'OK' — стрелка держит this`;
}
