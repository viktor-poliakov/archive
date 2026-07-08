import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-prototypes-chain',
  imports: [CodeBlock, RouterLink],
  templateUrl: './chain.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PrototypesChain {
  protected readonly fullChainExample = `class User {
  greet() {}
}
const u = new User();

// полная цепочка экземпляра снизу вверх:
Object.getPrototypeOf(u) === User.prototype;                // true
Object.getPrototypeOf(User.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);                    // null — конец цепочки`;

  protected readonly builtinChainExample = `const arr = [1, 2, 3];

// методы массива лежат не в самом arr, а в общем Array.prototype
Object.getPrototypeOf(arr) === Array.prototype;             // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true

arr.map;      // это Array.prototype.map — один на все массивы
arr.toString; // а это Object.prototype.toString — ещё выше по цепочке

// то же самое короткой (устаревшей) записью через __proto__:
Array.prototype.__proto__ === Object.prototype; // true — сам Array.prototype это объект
Object.prototype.__proto__ === null;            // true — вершина цепочки, выше ничего нет`;

  protected readonly instanceofExample = `const arr = [1, 2, 3];

arr instanceof Array;  // true
arr instanceof Object; // true — Array.prototype наследует Object.prototype

// instanceof идёт по цепочке объекта и ищет в ней Constructor.prototype
Array.prototype.isPrototypeOf(arr); // true — по сути та же проверка`;

  protected readonly apiExample = `const animal = { eats: true };

// создать объект с нужным прототипом
const rabbit = Object.create(animal);

// прочитать / поменять прототип
Object.getPrototypeOf(rabbit);       // animal
Object.setPrototypeOf(rabbit, null); // работает, но медленно — не в горячем коде

// отличить собственное свойство от унаследованного
rabbit.jumps = true;
Object.hasOwn(rabbit, 'jumps'); // true
Object.hasOwn(rabbit, 'eats');  // false — унаследовано от animal`;
}
