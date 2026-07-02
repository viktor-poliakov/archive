import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-classes-inheritance',
  imports: [CodeBlock, RouterLink],
  templateUrl: './inheritance.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClassesInheritance {
  protected readonly extendsExample = `class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    return this.name + ' is eating';
  }
}

// Rabbit расширяет Animal и получает все его методы
class Rabbit extends Animal {
  hide() {
    return this.name + ' hides'; // name достался от Animal
  }
}

const bunny = new Rabbit('Bunny');
bunny.eat();  // 'Bunny is eating' — метод родителя
bunny.hide(); // 'Bunny hides'`;

  protected readonly superExample = `class Rabbit extends Animal {
  constructor(name, speed) {
    super(name);        // конструктор родителя — ОБЯЗАТЕЛЬНО до обращения к this
    this.speed = speed;
  }

  eat() {
    // super.method() — вызвать версию родителя и дополнить её
    return super.eat() + ' (a carrot)';
  }
}

const bunny = new Rabbit('Bunny', 20);
bunny.eat(); // 'Bunny is eating (a carrot)'`;

  protected readonly instanceofExample = `const bunny = new Rabbit('Bunny');

bunny instanceof Rabbit; // true
bunny instanceof Animal; // true — Rabbit наследует Animal
bunny instanceof Object; // true — вся цепочка заканчивается на Object`;

  protected readonly fieldOrderExample = `class Animal {
  name = 'animal';
  constructor() {
    console.log(this.name); // 'animal' — а НЕ 'rabbit'
  }
}

class Rabbit extends Animal {
  name = 'rabbit'; // поле наследника ставится ПОСЛЕ super()
}

new Rabbit(); // выведет 'animal'`;
}
