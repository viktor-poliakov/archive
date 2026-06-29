import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-prototypes',
  imports: [CodeBlock, RouterLink],
  templateUrl: './prototypes.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsPrototypes {
  protected readonly chainExample = `const animal = {
  eats: true,
  walk() {
    return 'walks';
  },
};

// rabbit наследует от animal: animal становится его прототипом
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps); // true  — своё свойство
console.log(rabbit.eats);  // true  — нашлось в прототипе animal
console.log(rabbit.walk()); // 'walks' — метод тоже из прототипа`;

  protected readonly getProtoExample = `const animal = { eats: true };
const rabbit = Object.create(animal);

// получить прототип объекта
console.log(Object.getPrototypeOf(rabbit) === animal); // true

// устаревший способ (не используйте в новом коде):
console.log(rabbit.__proto__ === animal); // true`;

  protected readonly shadowExample = `const animal = { eats: true };
const rabbit = Object.create(animal);

rabbit.eats = false; // запись создаёт СВОЁ свойство, прототип не меняется

console.log(rabbit.eats); // false — своё перекрывает унаследованное
console.log(animal.eats); // true  — прототип не тронут`;

  protected readonly builtinExample = `const arr = [1, 2, 3];

// метод map не лежит в самом массиве —
// он живёт в Array.prototype, общем для всех массивов
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// поэтому любой массив «умеет» map, push, filter и т.д.
console.log(arr.map((n) => n * 2)); // [2, 4, 6]`;

  protected readonly classExample = `// class — это удобный синтаксис поверх прототипов
class Animal {
  constructor(name) {
    this.name = name;
  }
  walk() {
    return this.name + ' walks';
  }
}

const cat = new Animal('Cat');
console.log(cat.walk()); // 'Cat walks'

// метод walk лежит в прототипе, а не в самом объекте cat
console.log(Object.getPrototypeOf(cat) === Animal.prototype); // true`;
}
