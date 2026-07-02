import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-prototypes-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PrototypesBasics {
  protected readonly chainExample = `const animal = {
  eats: true,
};

// делаем rabbit объектом, прототип которого — animal
const rabbit = Object.create(animal);
rabbit.jumps = true;

rabbit.jumps; // true  — своё свойство
rabbit.eats;  // true  — своего нет, нашли в прототипе animal`;

  protected readonly viewExample = `const rabbit = Object.create(animal);

// современный способ посмотреть/поменять прототип
Object.getPrototypeOf(rabbit) === animal; // true
Object.setPrototypeOf(rabbit, null);      // убрать прототип

// __proto__ делает то же самое, но устарел (это геттер из Object.prototype)
rabbit.__proto__; // не используйте в новом коде`;

  protected readonly writeExample = `const animal = { eats: true };
const rabbit = Object.create(animal);

// запись всегда создаёт СВОЁ свойство на самом объекте,
// прототип при этом не меняется
rabbit.eats = false;

rabbit.eats;  // false — собственное свойство перекрыло унаследованное
animal.eats;  // true  — прототип не тронут`;
}
